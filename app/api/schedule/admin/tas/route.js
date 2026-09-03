// app/api/schedule/admin/tas/route.js
// POST { name } -> adds a TA to the roster and generates their passcode.
// The plaintext passcode is returned exactly once, in this response — only
// its salted hash is ever stored. Copy it now; use "reset passcode" later
// if it's lost.

import { cookies } from 'next/headers';
import { readAdminSession, generatePasscode, hashPasscode } from '../../../../../lib/scheduleAuth';
import { sbInsert } from '../../../../../lib/supabaseAdmin';
import { COURSE_CODE, TA_OH_WEEKLY_CAP_HOURS } from '../../../../../lib/scheduleConfig';

export async function POST(req) {
  const cookieStore = await cookies();
  if (!readAdminSession(cookieStore)) {
    return Response.json({ error: 'Admin login required.' }, { status: 401 });
  }

  try {
    const { name, officeHoursOnly, ohCapHours } = await req.json();
    if (!name || typeof name !== 'string' || !name.trim()) {
      return Response.json({ error: 'Name is required.' }, { status: 400 });
    }
    const cap = Number(ohCapHours);
    if (ohCapHours !== undefined && (!Number.isFinite(cap) || cap < 0)) {
      return Response.json({ error: 'Weekly OH cap must be a number ≥ 0.' }, { status: 400 });
    }

    const passcode = generatePasscode();
    const { hash, salt } = hashPasscode(passcode);

    const [row] = await sbInsert('tas', {
      course_code: COURSE_CODE,
      name: name.trim(),
      passcode_hash: hash,
      passcode_salt: salt,
      office_hours_only: !!officeHoursOnly,
      oh_cap_hours: Number.isFinite(cap) ? cap : TA_OH_WEEKLY_CAP_HOURS,
    });

    return Response.json({ ok: true, id: row.id, name: row.name, officeHoursOnly: row.office_hours_only, ohCapHours: Number(row.oh_cap_hours), passcode });
  } catch (err) {
    console.error('admin/tas POST error:', err);
    return Response.json({ error: 'Server error.' }, { status: 500 });
  }
}
