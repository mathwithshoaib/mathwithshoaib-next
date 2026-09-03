// app/api/schedule/me/route.js
// GET -> tells the client which sessions (admin / TA) are currently valid,
// so the page can skip the login prompt on repeat visits without ever
// trusting anything the client claims about itself.

import { cookies } from 'next/headers';
import { readAdminSession, readTaSession } from '../../../../lib/scheduleAuth';
import { sbSelect } from '../../../../lib/supabaseAdmin';
import { COURSE_CODE } from '../../../../lib/scheduleConfig';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const isAdmin = readAdminSession(cookieStore);
    const taSession = readTaSession(cookieStore, COURSE_CODE);

    let ta = null;
    if (taSession) {
      const rows = await sbSelect('tas', `id=eq.${taSession.taId}&select=id,name,office_hours_only,oh_cap_hours`);
      if (rows?.[0]) ta = { id: rows[0].id, name: rows[0].name, officeHoursOnly: rows[0].office_hours_only, ohCapHours: Number(rows[0].oh_cap_hours) };
    }

    return Response.json({ admin: isAdmin, ta });
  } catch (err) {
    console.error('schedule/me error:', err);
    return Response.json({ admin: false, ta: null });
  }
}
