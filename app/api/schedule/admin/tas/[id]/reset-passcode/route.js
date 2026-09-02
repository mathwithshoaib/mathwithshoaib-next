// app/api/schedule/admin/tas/[id]/reset-passcode/route.js
// POST -> issues a fresh passcode for a TA (old one stops working
// immediately), returned once in this response.

import { cookies } from 'next/headers';
import { readAdminSession, generatePasscode, hashPasscode } from '../../../../../../../lib/scheduleAuth';
import { sbUpdate } from '../../../../../../../lib/supabaseAdmin';
import { COURSE_CODE } from '../../../../../../../lib/scheduleConfig';

export async function POST(req, { params }) {
  const cookieStore = await cookies();
  if (!readAdminSession(cookieStore)) {
    return Response.json({ error: 'Admin login required.' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const passcode = generatePasscode();
    const { hash, salt } = hashPasscode(passcode);

    const rows = await sbUpdate('tas', `id=eq.${Number(id)}&course_code=eq.${COURSE_CODE}`, {
      passcode_hash: hash,
      passcode_salt: salt,
    });
    if (!rows?.length) {
      return Response.json({ error: 'TA not found.' }, { status: 404 });
    }

    return Response.json({ ok: true, passcode });
  } catch (err) {
    console.error('admin/tas reset-passcode error:', err);
    return Response.json({ error: 'Server error.' }, { status: 500 });
  }
}
