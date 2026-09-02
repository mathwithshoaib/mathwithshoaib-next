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
      const rows = await sbSelect('tas', `id=eq.${taSession.taId}&select=id,name`);
      if (rows?.[0]) ta = rows[0];
    }

    return Response.json({ admin: isAdmin, ta });
  } catch (err) {
    console.error('schedule/me error:', err);
    return Response.json({ admin: false, ta: null });
  }
}
