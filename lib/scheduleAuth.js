// lib/scheduleAuth.js
//
// Server-side only. Small hand-rolled auth helpers for the live schedule
// feature (app/courses/calc1-fa26/schedule) — no new npm dependency.
//
//   - Passcodes (TA + admin) are never stored in plaintext, and compared in
//     constant time so response timing can't leak a partial match.
//   - Session cookies are signed (HMAC-SHA256) and carry an expiry, verified
//     on every request server-side. This is what makes the admin/TA gates
//     real access control rather than a client-side-only passcode prompt.

import crypto from 'node:crypto';

const SESSION_SECRET = process.env.SESSION_SECRET;
const ADMIN_SECRET = process.env.ADMIN_SECRET;

function requireEnv(name, val) {
  if (!val) throw new Error(`${name} is not set. Add it to your environment (Vercel + .env.local).`);
  return val;
}

// ─── passcodes ──────────────────────────────────────────────────────────

// TA passcodes: 8 chars, uppercase letters + digits, ambiguous chars removed
// (0/O, 1/I/L) so they're easy to read aloud / type from a screenshot.
const PASSCODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

export function generatePasscode(length = 8) {
  let out = '';
  for (let i = 0; i < length; i++) {
    out += PASSCODE_ALPHABET[crypto.randomInt(PASSCODE_ALPHABET.length)];
  }
  return out;
}

export function hashPasscode(passcode) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(passcode, salt, 64).toString('hex');
  return { hash, salt };
}

export function verifyPasscode(passcode, hash, salt) {
  const candidate = crypto.scryptSync(String(passcode || ''), salt, 64).toString('hex');
  const a = Buffer.from(candidate, 'hex');
  const b = Buffer.from(hash, 'hex');
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

// Constant-time compare of the admin passcode against ADMIN_SECRET (hash
// both first so differing lengths don't short-circuit the comparison).
export function verifyAdminPasscode(passcode) {
  const secret = requireEnv('ADMIN_SECRET', ADMIN_SECRET);
  const a = crypto.createHash('sha256').update(String(passcode || '')).digest();
  const b = crypto.createHash('sha256').update(secret).digest();
  return crypto.timingSafeEqual(a, b);
}

// ─── signed session tokens ──────────────────────────────────────────────

function b64urlEncode(str) {
  return Buffer.from(str, 'utf8').toString('base64url');
}
function b64urlDecode(str) {
  return Buffer.from(str, 'base64url').toString('utf8');
}

export function signSession(payload, maxAgeSeconds) {
  const secret = requireEnv('SESSION_SECRET', SESSION_SECRET);
  const body = { ...payload, exp: Date.now() + maxAgeSeconds * 1000 };
  const b64 = b64urlEncode(JSON.stringify(body));
  const sig = crypto.createHmac('sha256', secret).update(b64).digest('base64url');
  return `${b64}.${sig}`;
}

export function verifySession(token) {
  const secret = requireEnv('SESSION_SECRET', SESSION_SECRET);
  if (!token || typeof token !== 'string' || !token.includes('.')) return null;
  const [b64, sig] = token.split('.');
  const expected = crypto.createHmac('sha256', secret).update(b64).digest('base64url');
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(b64urlDecode(b64));
    if (!payload.exp || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

// ─── cookie config ──────────────────────────────────────────────────────

export const ADMIN_COOKIE = 'sk_sched_admin';
export const TA_COOKIE = 'sk_sched_ta';
const ADMIN_SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours
const TA_SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days — TAs shouldn't have to re-enter a passcode every visit

// `secure` is relaxed outside production so cookies still work on
// http://localhost during `npm run dev` (Vercel deployments are always https).
const SECURE_COOKIES = process.env.NODE_ENV === 'production';

export function adminCookieOptions() {
  return { httpOnly: true, secure: SECURE_COOKIES, sameSite: 'lax', path: '/', maxAge: ADMIN_SESSION_MAX_AGE };
}
export function taCookieOptions() {
  return { httpOnly: true, secure: SECURE_COOKIES, sameSite: 'lax', path: '/', maxAge: TA_SESSION_MAX_AGE };
}

export function signAdminSession() {
  return signSession({ admin: true }, ADMIN_SESSION_MAX_AGE);
}
export function signTaSession(taId, courseCode) {
  return signSession({ taId, courseCode }, TA_SESSION_MAX_AGE);
}

// Reads + verifies the admin session from a Next.js cookie store
// (the `cookies()` object from `next/headers`, already awaited by the caller).
export function readAdminSession(cookieStore) {
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  const payload = verifySession(token);
  return !!payload?.admin;
}

// Returns { taId, courseCode } or null.
export function readTaSession(cookieStore, expectedCourseCode) {
  const token = cookieStore.get(TA_COOKIE)?.value;
  const payload = verifySession(token);
  if (!payload?.taId || !payload?.courseCode) return null;
  if (expectedCourseCode && payload.courseCode !== expectedCourseCode) return null;
  return payload;
}
