// app/api/schedule/admin/tas/[id]/route.js
// DELETE -> removes a TA from the roster. This is the "TA who left" path:
// the FK ON DELETE CASCADE on tutorial_bookings/ta_office_hours means their
// tutorial seat and any booked office hours are freed in the same instant.

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
    await sbDelete('tas', `id=eq.${Number(id)}&course_code=eq.${COURSE_CODE}`);
    return Response.json({ ok: true });
  } catch (err) {
    console.error('admin/tas DELETE error:', err);
    return Response.json({ error: 'Server error.' }, { status: 500 });
  }
}
