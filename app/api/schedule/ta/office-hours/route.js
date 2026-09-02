// app/api/schedule/ta/office-hours/route.js
// POST { day, hour } -> book a 1-hour office-hour block (own session only).
// DELETE { id }      -> remove one you booked (freeing it for rebooking).
//
// Both re-check availability/ownership at the moment of write — never trust
// the client's view of the grid, since another TA may have just acted.

import { cookies } from 'next/headers';
import { readTaSession } from '../../../../../lib/scheduleAuth';
import { sbRpc, sbDelete } from '../../../../../lib/supabaseAdmin';
import { COURSE_CODE } from '../../../../../lib/scheduleConfig';
import { rpcErrorMessage } from '../../../../../lib/scheduleValidate';

export async function POST(req) {
  const cookieStore = await cookies();
  const session = readTaSession(cookieStore, COURSE_CODE);
  if (!session) return Response.json({ error: 'Please log in with your TA passcode first.' }, { status: 401 });

  try {
    const { day, hour } = await req.json();
    const d = Number(day), h = Number(hour);
    if (!Number.isInteger(d) || d < 0 || d > 4 || !Number.isInteger(h)) {
      return Response.json({ error: 'Invalid day/hour.' }, { status: 400 });
    }

    const [result] = await sbRpc('book_ta_office_hour', {
      p_ta_id: session.taId,
      p_course: COURSE_CODE,
      p_day: d,
      p_hour: h,
    });

    if (!result?.ok) {
      return Response.json({ error: rpcErrorMessage(result?.error) }, { status: 409 });
    }
    return Response.json({ ok: true });
  } catch (err) {
    console.error('ta/office-hours POST error:', err);
    return Response.json({ error: 'Server error.' }, { status: 500 });
  }
}

export async function DELETE(req) {
  const cookieStore = await cookies();
  const session = readTaSession(cookieStore, COURSE_CODE);
  if (!session) return Response.json({ error: 'Please log in with your TA passcode first.' }, { status: 401 });

  try {
    const { id } = await req.json();
    if (!id) return Response.json({ error: 'Missing id.' }, { status: 400 });

    // Filter by ta_id too: a TA can only ever delete their own row, even if
    // they somehow guessed another booking's id.
    const deleted = await sbDelete(
      'ta_office_hours',
      `id=eq.${Number(id)}&ta_id=eq.${session.taId}&course_code=eq.${COURSE_CODE}`
    );
    if (!deleted?.length) {
      return Response.json({ error: "That booking isn't yours (or is already gone)." }, { status: 404 });
    }
    return Response.json({ ok: true });
  } catch (err) {
    console.error('ta/office-hours DELETE error:', err);
    return Response.json({ error: 'Server error.' }, { status: 500 });
  }
}
