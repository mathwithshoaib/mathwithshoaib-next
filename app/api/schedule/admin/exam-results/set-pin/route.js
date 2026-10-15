// app/api/schedule/admin/exam-results/set-pin/route.js
// POST { studentId, pin } -> admin sets (or overwrites) a student's PIN
// directly — the "I'm locked out and need it changed now" support path,
// as an alternative to reset-pin (which only clears it and makes the
// student re-verify to pick their own). Also clears attempt counters and
// any active lockout, since an admin-set PIN should work immediately.
// PINs are never stored or shown in plaintext anywhere, including here —
// only this one request ever sees it, hashed before it touches the DB.

import { cookies } from 'next/headers';
import { readAdminSession } from '../../../../../../lib/scheduleAuth';
import { sbUpsert } from '../../../../../../lib/supabaseAdmin';
import { COURSE_CODE } from '../../../../../../lib/scheduleConfig';
import { hashPasscode } from '../../../../../../lib/scheduleAuth';
import { normalizeId, isValidPin } from '../../../../../../lib/examResultsAuth';

export async function POST(req) {
  const cookieStore = await cookies();
  if (!readAdminSession(cookieStore)) {
    return Response.json({ error: 'Admin login required.' }, { status: 401 });
  }

  try {
    const { studentId, pin } = await req.json();
    const id = normalizeId(studentId);
    if (!id) return Response.json({ error: 'studentId is required.' }, { status: 400 });
    if (!isValidPin(pin)) return Response.json({ error: 'PIN must be exactly 6 digits.' }, { status: 400 });

    const { hash, salt } = hashPasscode(pin);
    await sbUpsert('student_pins', {
      course_code: COURSE_CODE,
      roll_number: id,
      pin_hash: hash,
      pin_salt: salt,
      pin_set_at: new Date().toISOString(),
      verify_attempts: 0,
      pin_fail_attempts: 0,
      pin_locked_until: null,
    }, 'course_code,roll_number');
    return Response.json({ ok: true });
  } catch (err) {
    console.error('admin/exam-results/set-pin error:', err);
    return Response.json({ error: 'Server error.' }, { status: 500 });
  }
}
