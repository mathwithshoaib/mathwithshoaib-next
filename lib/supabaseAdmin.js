// lib/supabaseAdmin.js
//
// Server-side only. Talks to the Supabase project's PostgREST API using the
// SERVICE ROLE key — this key bypasses RLS, so it must never reach the
// browser. It's read purely from process.env here and only ever imported by
// files under app/api/**/route.js.
//
// Mirrors the plain-fetch style already used for the anon key in
// app/courses/calc1/page.js (sbPostReview / sbGetReviews / ...), just with
// the service-role key and a couple more verbs (RPC, filtered PATCH/DELETE).

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function assertConfigured() {
  if (!SUPABASE_URL || !SERVICE_KEY) {
    throw new Error(
      'SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are not set. Add them to your environment (Vercel + .env.local).'
    );
  }
}

function baseHeaders(extra) {
  return {
    apikey: SERVICE_KEY,
    Authorization: `Bearer ${SERVICE_KEY}`,
    'Content-Type': 'application/json',
    ...extra,
  };
}

async function asJson(res) {
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

// SELECT — query is a raw PostgREST query string, e.g. "course_code=eq.calc1-fa26&select=*"
export async function sbSelect(table, query = '') {
  assertConfigured();
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}${query ? `?${query}` : ''}`, {
    headers: baseHeaders(),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`sbSelect(${table}) failed: ${res.status} ${await res.text()}`);
  return asJson(res);
}

// INSERT — returns the inserted row(s)
export async function sbInsert(table, row) {
  assertConfigured();
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: baseHeaders({ Prefer: 'return=representation' }),
    body: JSON.stringify(row),
  });
  if (!res.ok) throw new Error(`sbInsert(${table}) failed: ${res.status} ${await res.text()}`);
  return asJson(res);
}

// UPDATE — query is the PostgREST filter, e.g. "id=eq.5"
export async function sbUpdate(table, query, patch) {
  assertConfigured();
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${query}`, {
    method: 'PATCH',
    headers: baseHeaders({ Prefer: 'return=representation' }),
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error(`sbUpdate(${table}) failed: ${res.status} ${await res.text()}`);
  return asJson(res);
}

// DELETE — query is the PostgREST filter. Returns the deleted rows, so
// callers enforcing ownership (e.g. "?id=eq.5&ta_id=eq.9") can check
// `deleted.length > 0` to know whether the row actually belonged to them.
export async function sbDelete(table, query) {
  assertConfigured();
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${query}`, {
    method: 'DELETE',
    headers: baseHeaders({ Prefer: 'return=representation' }),
  });
  if (!res.ok) throw new Error(`sbDelete(${table}) failed: ${res.status} ${await res.text()}`);
  return asJson(res);
}

// RPC — calls a Postgres function defined in supabase/schedule_schema.sql.
// Table-returning functions come back as an array of rows.
export async function sbRpc(fnName, args) {
  assertConfigured();
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${fnName}`, {
    method: 'POST',
    headers: baseHeaders(),
    body: JSON.stringify(args),
  });
  if (!res.ok) throw new Error(`sbRpc(${fnName}) failed: ${res.status} ${await res.text()}`);
  return asJson(res);
}
