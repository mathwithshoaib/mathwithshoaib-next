// app/api/schedule/admin/exam-results/rows/route.js
// GET  ?exam=...&roll=... -> look up one student's result row, for the
//      admin to verify an entry without rendering the whole class list.
// POST -> add or correct one student's row (upsert on course+exam+roll).

import { cookies } from 'next/headers';
import { readAdminSession } from '../../../../../../lib/scheduleAuth';
import { sbSelect, sbUpsert } from '../../../../../../lib/supabaseAdmin';
import { COURSE_CODE } from '../../../../../../lib/scheduleConfig';
import { normalizeId } from '../../../../../../lib/examResultsAuth';

export async function GET(req) {
  const cookieStore = await cookies();
  if (!readAdminSession(cookieStore)) {
    return Response.json({ error: 'Admin login required.' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const exam = searchParams.get('exam');
    const roll = searchParams.get('roll');
    if (!exam || !roll) {
      return Response.json({ error: 'exam and roll are both required.' }, { status: 400 });
    }
    const rows = await sbSelect(
      'exam_results',
      `course_code=eq.${COURSE_CODE}&exam=eq.${encodeURIComponent(exam)}&roll_number=eq.${encodeURIComponent(normalizeId(roll))}&select=*`
    );
    const pinRows = await sbSelect(
      'student_pins',
      `course_code=eq.${COURSE_CODE}&roll_number=eq.${encodeURIComponent(normalizeId(roll))}&select=pin_set_at,verify_attempts,pin_fail_attempts,pin_locked_until`
    );
    return Response.json({ row: rows?.[0] || null, pin: pinRows?.[0] || null });
  } catch (err) {
    console.error('admin/exam-results/rows GET error:', err);
    return Response.json({ error: 'Server error.' }, { status: 500 });
  }
}

export async function POST(req) {
  const cookieStore = await cookies();
  if (!readAdminSession(cookieStore)) {
    return Response.json({ error: 'Admin login required.' }, { status: 401 });
  }

  try {
    const { exam, rollNumber, name, section, venue, mcqsMarks, q2, q3, q4, bonus, bonusTotal, total } = await req.json();
    if (!exam?.trim() || !rollNumber?.trim() || !name?.trim() || !section?.trim() || !venue?.trim() || !String(total ?? '').trim()) {
      return Response.json({ error: 'exam, rollNumber, name, section, venue, and total are all required.' }, { status: 400 });
    }

    const [row] = await sbUpsert('exam_results', {
      course_code: COURSE_CODE,
      exam: exam.trim(),
      roll_number: normalizeId(rollNumber),
      student_name: name.trim(),
      section: section.trim(),
      venue: venue.trim(),
      mcqs_marks: mcqsMarks ?? null,
      q2: q2 ?? null,
      q3: q3 ?? null,
      q4: q4 ?? null,
      bonus: bonus ?? null,
      bonus_total: bonusTotal ?? null,
      total: String(total).trim(),
    }, 'course_code,exam,roll_number');

    return Response.json({ ok: true, id: row.id });
  } catch (err) {
    console.error('admin/exam-results/rows POST error:', err);
    return Response.json({ error: 'Server error.' }, { status: 500 });
  }
}
