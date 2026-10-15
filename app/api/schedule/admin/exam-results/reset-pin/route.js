// app/api/schedule/admin/exam-results/reset-pin/route.js
// POST { studentId } -> clears a student's PIN (and attempt counters)
// entirely, so they can go through Stage 1 (name+venue) again and set a
// fresh one. This is the "I forgot my PIN" support path — a student can
// never self-reset, since that would let anyone who merely knows an ID
// hijack it.

import { cookies } from 'next/headers';
import { readAdminSession } from '../../../../../../lib/scheduleAuth';
import { sbUpsert } from '../../../../../../lib/supabaseAdmin';
import { COURSE_CODE } from '../../../../../../lib/scheduleConfig';
import { normalizeId } from '../../../../../../lib/examResultsAuth';

export async function POST(req) {
  const cookieStore = await cookies();
  if (!readAdminSession(cookieStore)) {
    return Response.json({ error: 'Admin login required.' }, { status: 401 });
  }

  try {
    const { studentId } = await req.json();
    const id = normalizeId(studentId);
    if (!id) return Response.json({ error: 'studentId is required.' }, { status: 400 });

    await sbUpsert('student_pins', {
      course_code: COURSE_CODE,
      roll_number: id,
      pin_hash: null,
      pin_salt: null,
      pin_set_at: null,
      verify_attempts: 0,
      pin_fail_attempts: 0,
      pin_locked_until: null,
    }, 'course_code,roll_number');
    return Response.json({ ok: true });
  } catch (err) {
    console.error('admin/exam-results/reset-pin error:', err);
    return Response.json({ error: 'Server error.' }, { status: 500 });
  }
}
