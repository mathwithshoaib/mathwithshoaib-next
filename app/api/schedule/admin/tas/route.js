// app/api/schedule/admin/tas/route.js
// POST { name } -> adds a TA to the roster and generates their passcode.
// The plaintext passcode is returned exactly once, in this response — only
// its salted hash is ever stored. Copy it now; use "reset passcode" later
// if it's lost.

import { cookies } from 'next/headers';
import { readAdminSession, generatePasscode, hashPasscode } from '../../../../../lib/scheduleAuth';
import { sbInsert } from '../../../../../lib/supabaseAdmin';
import { COURSE_CODE } from '../../../../../lib/scheduleConfig';

export async function POST(req) {
  const cookieStore = await cookies();
  if (!readAdminSession(cookieStore)) {
    return Response.json({ error: 'Admin login required.' }, { status: 401 });
  }

  try {
    const { name } = await req.json();
    if (!name || typeof name !== 'string' || !name.trim()) {
      return Response.json({ error: 'Name is required.' }, { status: 400 });
    }

    const passcode = generatePasscode();
    const { hash, salt } = hashPasscode(passcode);

    const [row] = await sbInsert('tas', {
      course_code: COURSE_CODE,
      name: name.trim(),
      passcode_hash: hash,
      passcode_salt: salt,
    });

    return Response.json({ ok: true, id: row.id, name: row.name, passcode });
  } catch (err) {
    console.error('admin/tas POST error:', err);
    return Response.json({ error: 'Server error.' }, { status: 500 });
  }
}
