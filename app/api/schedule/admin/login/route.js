// app/api/schedule/admin/login/route.js
// POST { passcode } -> verifies against ADMIN_SECRET server-side, sets an
// httpOnly signed session cookie on success. This is the server-side check
// the spec requires — a wrong/missing passcode never gets a cookie, and
// every admin write route re-verifies that cookie independently.

import { cookies } from 'next/headers';
import { verifyAdminPasscode, signAdminSession, ADMIN_COOKIE, adminCookieOptions } from '../../../../../lib/scheduleAuth';

export async function POST(req) {
  try {
    const { passcode } = await req.json();
    if (!passcode || typeof passcode !== 'string') {
      return Response.json({ error: 'Enter the admin passcode.' }, { status: 400 });
    }

    let ok;
    try {
      ok = verifyAdminPasscode(passcode);
    } catch (err) {
      console.error('admin login config error:', err);
      return Response.json({ error: 'Server not configured. Contact the developer.' }, { status: 500 });
    }

    if (!ok) {
      return Response.json({ error: 'Incorrect passcode.' }, { status: 401 });
    }

    const cookieStore = await cookies();
    cookieStore.set(ADMIN_COOKIE, signAdminSession(), adminCookieOptions());
    return Response.json({ ok: true });
  } catch (err) {
    console.error('admin login error:', err);
    return Response.json({ error: 'Server error.' }, { status: 500 });
  }
}
