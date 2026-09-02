// app/api/schedule/admin/office-hours/[id]/route.js
// DELETE -> admin force-removes a single booked TA office hour (correction
// tool; doesn't touch the rest of that TA's bookings or their roster entry).

import { cookies } from 'next/headers';
import { readAdminSession } from '../../../../../../lib/scheduleAuth';
import { sbDelete } from '../../../../../../lib/supabaseAdmin';
import { COURSE_CODE } from '../../../../../../lib/scheduleConfig';

export async function DELETE(req, { params }) {
  const cookieStore = await cookies();
  if (!readAdminSession(cookieStore)) {
    return Response.json({ error: 'Admin login required.' }, { status: 401 });
  }

  try {
    const { id } = await params;
    await sbDelete('ta_office_hours', `id=eq.${Number(id)}&course_code=eq.${COURSE_CODE}`);
    return Response.json({ ok: true });
  } catch (err) {
    console.error('admin/office-hours DELETE error:', err);
    return Response.json({ error: 'Server error.' }, { status: 500 });
  }
}
