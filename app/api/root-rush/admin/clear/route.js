// app/api/root-rush/admin/clear/route.js
//
// POST { secret, difficulty, level } -> deletes every row for that one
// leaderboard (difficulty + level) using the service-role key. This is the
// "owner can clear test entries" control from the spec — root_rush_scores
// has no delete policy for the public/anon role (see
// supabase/015_root_rush_scores.sql), so this route is the only way to
// remove a row at all.
//
// Deliberately a single secret check per request rather than the schedule
// feature's signed-cookie session: this is one occasional destructive
// action, not an ongoing admin dashboard, so there's no session worth
// maintaining.

import crypto from 'node:crypto';
import { sbDelete } from '../../../../../lib/supabaseAdmin';

function verifySecret(candidate) {
  const secret = process.env.ROOT_RUSH_ADMIN_SECRET;
  if (!secret) throw new Error('ROOT_RUSH_ADMIN_SECRET is not set. Add it to your environment (Vercel + .env.local).');
  const a = crypto.createHash('sha256').update(String(candidate || '')).digest();
  const b = crypto.createHash('sha256').update(secret).digest();
  return crypto.timingSafeEqual(a, b);
}

const DIFFICULTIES = ['easy', 'medium', 'hard'];

export async function POST(req) {
  try {
    const { secret, difficulty, level } = await req.json();

    let ok;
    try {
      ok = verifySecret(secret);
    } catch (err) {
      console.error('root-rush admin config error:', err);
      return Response.json({ error: 'Server not configured. Contact the developer.' }, { status: 500 });
    }
    if (!ok) return Response.json({ error: 'Incorrect passcode.' }, { status: 401 });

    if (!DIFFICULTIES.includes(difficulty) || ![1, 2, 3].includes(level)) {
      return Response.json({ error: 'Invalid difficulty or level.' }, { status: 400 });
    }

    const deleted = await sbDelete('root_rush_scores', `difficulty=eq.${difficulty}&level=eq.${level}`);
    return Response.json({ ok: true, deletedCount: Array.isArray(deleted) ? deleted.length : 0 });
  } catch (err) {
    console.error('root-rush admin clear error:', err);
    return Response.json({ error: 'Server error.' }, { status: 500 });
  }
}
