// app/api/schedule/admin/tutorial-venues/route.js
// POST { slotId, date, hasSession, venue, notes } -> set/replace the venue
// info for one tutorial slot on one specific calendar date. Upserts on
// (slot_id, class_date), so re-submitting the same date+slot just updates it.

import { cookies } from 'next/headers';
import { readAdminSession } from '../../../../../lib/scheduleAuth';
import { sbUpsert } from '../../../../../lib/supabaseAdmin';

function isValidDate(s) {
  return typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(new Date(s).getTime());
}

export async function POST(req) {
  const cookieStore = await cookies();
  if (!readAdminSession(cookieStore)) {
    return Response.json({ error: 'Admin login required.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const slotId = Number(body.slotId);
    if (!Number.isInteger(slotId)) return Response.json({ error: 'Missing/invalid slotId.' }, { status: 400 });
    if (!isValidDate(body.date)) return Response.json({ error: 'Date must be YYYY-MM-DD.' }, { status: 400 });

    const hasSession = body.hasSession !== false; // default true
    const row = {
      slot_id: slotId,
      class_date: body.date,
      has_session: hasSession,
      venue: hasSession ? (body.venue || null) : null,
      notes: body.notes || null,
    };

    const [saved] = await sbUpsert('tutorial_slot_venues', row, 'slot_id,class_date');
    return Response.json({ ok: true, id: saved?.id });
  } catch (err) {
    console.error('admin/tutorial-venues POST error:', err);
    return Response.json({ error: 'Server error.' }, { status: 500 });
  }
}
