// app/api/schedule/admin/tutorial-slots/[id]/clear-seat/route.js
// POST { seatNo: 1|2 } -> admin force-removes whichever TA holds that seat,
// freeing it immediately. Covers ad-hoc corrections without deleting the TA
// from the roster entirely (see admin/tas/[id] for that).

import { cookies } from 'next/headers';
import { readAdminSession } from '../../../../../../../lib/scheduleAuth';
import { sbDelete } from '../../../../../../../lib/supabaseAdmin';

export async function POST(req, { params }) {
  const cookieStore = await cookies();
  if (!readAdminSession(cookieStore)) {
    return Response.json({ error: 'Admin login required.' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const { seatNo } = await req.json();
    const seat = Number(seatNo);
    if (seat !== 1 && seat !== 2) {
      return Response.json({ error: 'seatNo must be 1 or 2.' }, { status: 400 });
    }
    await sbDelete('tutorial_bookings', `slot_id=eq.${Number(id)}&seat_no=eq.${seat}`);
    return Response.json({ ok: true });
  } catch (err) {
    console.error('admin/tutorial-slots clear-seat error:', err);
    return Response.json({ error: 'Server error.' }, { status: 500 });
  }
}
