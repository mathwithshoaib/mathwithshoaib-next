// app/api/schedule/ta/login/route.js
// POST { passcode } -> the passcode itself identifies which TA this is (no
// separate name field). Checked against every TA's salted hash for this
// course; on match, sets an httpOnly session cookie scoped to that TA's id.

import { cookies } from 'next/headers';
import { verifyPasscode, signTaSession, TA_COOKIE, taCookieOptions } from '../../../../../lib/scheduleAuth';
import { sbSelect } from '../../../../../lib/supabaseAdmin';
import { COURSE_CODE } from '../../../../../lib/scheduleConfig';

export async function POST(req) {
  try {
    const { passcode } = await req.json();
    if (!passcode || typeof passcode !== 'string') {
      return Response.json({ error: 'Enter your TA passcode.' }, { status: 400 });
    }

    const tas = await sbSelect(
      'tas',
      `course_code=eq.${COURSE_CODE}&select=id,name,passcode_hash,passcode_salt,office_hours_only,oh_cap_hours`
    );

    const match = tas.find((t) => verifyPasscode(passcode, t.passcode_hash, t.passcode_salt));
    if (!match) {
      return Response.json({ error: 'Passcode not recognized.' }, { status: 401 });
    }

    const cookieStore = await cookies();
    cookieStore.set(TA_COOKIE, signTaSession(match.id, COURSE_CODE), taCookieOptions());
    return Response.json({ ok: true, taId: match.id, name: match.name, officeHoursOnly: match.office_hours_only, ohCapHours: Number(match.oh_cap_hours) });
  } catch (err) {
    console.error('ta login error:', err);
    return Response.json({ error: 'Server error.' }, { status: 500 });
  }
}
