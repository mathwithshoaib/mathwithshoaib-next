// app/api/schedule/admin/exam-seating/rows/route.js
// GET  ?exam=...&roll=... -> look up one row, for the admin to verify an
//      entry (or a student's report of "it's not working") without
//      rendering the whole roster.
// POST -> add or correct one student's row (upsert on course+exam+roll).
//      Bulk import for a real class roster is done directly against this
//      same table via a one-off script when the actual sheet is handed
//      over — this endpoint is for single corrections/testing.

import { cookies } from 'next/headers';
import { readAdminSession } from '../../../../../../lib/scheduleAuth';
import { sbSelect, sbUpsert } from '../../../../../../lib/supabaseAdmin';
import { COURSE_CODE } from '../../../../../../lib/scheduleConfig';

function normalize(s) {
  return (s || '').trim().toUpperCase();
}

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
      'exam_seating',
      `course_code=eq.${COURSE_CODE}&exam=eq.${encodeURIComponent(exam)}&roll_number=eq.${encodeURIComponent(normalize(roll))}&select=*`
    );
    return Response.json({ row: rows?.[0] || null });
  } catch (err) {
    console.error('admin/exam-seating/rows GET error:', err);
    return Response.json({ error: 'Server error.' }, { status: 500 });
  }
}

export async function POST(req) {
  const cookieStore = await cookies();
  if (!readAdminSession(cookieStore)) {
    return Response.json({ error: 'Admin login required.' }, { status: 401 });
  }

  try {
    const { exam, rollNumber, name, room, seatNumber } = await req.json();
    if (!exam?.trim() || !rollNumber?.trim() || !name?.trim() || !room?.trim() || !String(seatNumber ?? '').trim()) {
      return Response.json({ error: 'exam, rollNumber, name, room, and seatNumber are all required.' }, { status: 400 });
    }

    const [row] = await sbUpsert('exam_seating', {
      course_code: COURSE_CODE,
      exam: exam.trim(),
      roll_number: normalize(rollNumber),
      student_name: name.trim(),
      room: room.trim(),
      seat_number: String(seatNumber).trim(),
    }, 'course_code,exam,roll_number');

    return Response.json({ ok: true, id: row.id });
  } catch (err) {
    console.error('admin/exam-seating/rows POST error:', err);
    return Response.json({ error: 'Server error.' }, { status: 500 });
  }
}
