// app/explore/rootRushApi.js
//
// Direct-to-Supabase REST calls using the publishable (anon) key — same
// project and same pattern as sbPostReview/sbGetReviews in
// app/courses/calc1/page.js. root_rush_scores has a public insert+select
// RLS policy and no update/delete policy (see
// supabase/015_root_rush_scores.sql), so this is safe to call straight
// from the browser: nobody can alter or erase another player's row this way.
//
// Every call is wrapped so a missing table (migration not run yet) or a
// network hiccup degrades quietly — the game must stay playable even if
// the leaderboard can't be reached.

const SUPABASE_URL = 'https://ujmxucxfqohlvssoxpsc.supabase.co';
const SUPABASE_KEY = 'sb_publishable_Oh6eOOEaCpb420HxsaMreA_lB0BRzN7';

function headers(extra) {
  return { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, ...extra };
}

// Submits one solved-level score. Never throws — returns true/false.
export async function submitScore({ difficulty, level, playerName, deviceId, steps, timeMs }) {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/root_rush_scores`, {
      method: 'POST',
      headers: headers({ 'Content-Type': 'application/json', Prefer: 'return=minimal' }),
      body: JSON.stringify({
        difficulty, level, player_name: playerName, device_id: deviceId,
        steps, time_ms: timeMs,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

// Fetches every row for one (difficulty, level) leaderboard, oldest first
// (capped — a casual site's leaderboard won't come close to this many rows;
// the cap just guards against an unbounded fetch if it ever did).
export async function fetchScores(difficulty, level) {
  try {
    const q = `difficulty=eq.${encodeURIComponent(difficulty)}&level=eq.${level}&select=*&order=created_at.asc&limit=5000`;
    const res = await fetch(`${SUPABASE_URL}/rest/v1/root_rush_scores?${q}`, { headers: headers() });
    if (!res.ok) return [];
    const rows = await res.json();
    return rows.map((r) => ({
      deviceId: r.device_id,
      playerName: r.player_name,
      steps: r.steps,
      timeMs: r.time_ms,
      createdAt: r.created_at,
    }));
  } catch {
    return [];
  }
}

// Owner-only: clears one leaderboard via the service-role-gated API route
// (app/api/root-rush/admin/clear). Returns { ok, error? }.
export async function clearLeaderboard(secret, difficulty, level) {
  try {
    const res = await fetch('/api/root-rush/admin/clear', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret, difficulty, level }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, error: data.error || 'Could not clear the leaderboard.' };
    return { ok: true };
  } catch {
    return { ok: false, error: 'Could not reach the server.' };
  }
}
