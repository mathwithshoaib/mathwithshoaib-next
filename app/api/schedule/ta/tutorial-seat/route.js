// app/api/schedule/ta/tutorial-seat/route.js
// POST { slotId } -> claim an open seat in that tutorial slot (own session
// only; the RPC enforces "one slot per TA" and picks a free seat atomically).
// DELETE          -> leave whichever slot you currently hold.

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
    const { slotId } = await req.json();
    if (!slotId) return Response.json({ error: 'Missing slotId.' }, { status: 400 });

    const [result] = await sbRpc('book_tutorial_seat', {
      p_ta_id: session.taId,
      p_course: COURSE_CODE,
      p_slot_id: Number(slotId),
    });

    if (!result?.ok) {
      return Response.json({ error: rpcErrorMessage(result?.error) }, { status: 409 });
    }
    return Response.json({ ok: true });
  } catch (err) {
    console.error('ta/tutorial-seat POST error:', err);
    return Response.json({ error: 'Server error.' }, { status: 500 });
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  const session = readTaSession(cookieStore, COURSE_CODE);
  if (!session) return Response.json({ error: 'Please log in with your TA passcode first.' }, { status: 401 });

  try {
    const deleted = await sbDelete('tutorial_bookings', `ta_id=eq.${session.taId}`);
    if (!deleted?.length) {
      return Response.json({ error: "You don't currently hold a tutorial slot." }, { status: 404 });
    }
    return Response.json({ ok: true });
  } catch (err) {
    console.error('ta/tutorial-seat DELETE error:', err);
    return Response.json({ error: 'Server error.' }, { status: 500 });
  }
}
