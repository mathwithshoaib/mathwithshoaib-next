// lib/examResultsAuth.js
//
// Server-side only. Shared helpers for the "Check Your Results" feature —
// kept separate from scheduleAuth.js since this gates student data, not
// admin/TA access, but reuses the same scrypt-based hashing approach for
// the PIN (see hashPasscode/verifyPasscode in scheduleAuth.js).

// Same LUMS-ID normalization as exam seating (8-digit, or the dashed
// "20XX-XX-XXXX" form some students type) — kept in sync by hand.
export function normalizeId(s) {
  let digits = (s || '').replace(/\D/g, '');
  if (digits.length === 10 && digits.startsWith('20')) digits = digits.slice(2);
  if (digits.length === 7) digits = '0' + digits;
  return digits;
}

// Blanks out one word of a full name so a student can prove they know it
// without it being shown in full. Single-word names: the whole word is
// blanked (no middle word to pick). Two-word names: the second word is
// blanked. Three or more words: a middle word is blanked, so the first
// and last names — which someone might guess from a seating chart or
// WhatsApp group — are never enough on their own.
export function maskName(fullName) {
  const words = (fullName || '').trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return { display: '', answer: '', maskIndex: -1 };
  const maskIndex = words.length === 1 ? 0 : words.length === 2 ? 1 : Math.floor(words.length / 2);
  const display = words.map((w, i) => (i === maskIndex ? '_'.repeat(w.length) : w)).join(' ');
  return { display, answer: words[maskIndex], maskIndex };
}

// Lenient comparison for the typed-in missing word — case/whitespace
// shouldn't cause an honest student to burn an attempt.
export function namesMatch(guess, answer) {
  const norm = (s) => (s || '').trim().toLowerCase().replace(/\s+/g, '');
  return norm(guess) === norm(answer) && norm(guess).length > 0;
}

export function venuesMatch(guess, answer) {
  const norm = (s) => (s || '').trim().toLowerCase();
  return norm(guess) === norm(answer) && norm(guess).length > 0;
}

export const MAX_VERIFY_ATTEMPTS = 3;
export const MAX_PIN_ATTEMPTS = 5;
export const PIN_LOCKOUT_MINUTES = 15;

export function isValidPin(pin) {
  return typeof pin === 'string' && /^\d{6}$/.test(pin);
}
