// app/api/schedule/admin/exam-results/reset-verification/route.js
// POST { studentId } -> clears a student's Stage-1 (name+venue) attempt
// count back to 0, unlocking them after 3 failed tries. Use when a
// genuine student gets locked out from honest typos.

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

    await sbUpsert('student_pins', { course_code: COURSE_CODE, roll_number: id, verify_attempts: 0 }, 'course_code,roll_number');
    return Response.json({ ok: true });
  } catch (err) {
    console.error('admin/exam-results/reset-verification error:', err);
    return Response.json({ error: 'Server error.' }, { status: 500 });
  }
}
