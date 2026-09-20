// app/api/schedule/exam-seating/lookup/route.js
// POST { rollNumber } -> the ONLY route that ever touches the actual
// exam_seating roster from the public side, and even then it returns
// exactly one student's row (name/room/seat), matched by exact roll
// number against whichever exam is currently marked active in settings.
// Never exposes anyone else's data, and does nothing at all once the
// search is switched off in the admin panel.

import { sbSelect } from '../../../../../lib/supabaseAdmin';
import { COURSE_CODE } from '../../../../../lib/scheduleConfig';

function normalize(s) {
  return (s || '').trim().toUpperCase();
}

export async function POST(req) {
  try {
    const { rollNumber } = await req.json();
    const roll = normalize(rollNumber);
    if (!roll) {
      return Response.json({ found: false, error: 'Enter your roll number.' }, { status: 400 });
    }

    const settingsRows = await sbSelect('exam_seating_settings', `course_code=eq.${COURSE_CODE}&select=active,exam,instructions`);
    const settings = settingsRows?.[0];
    if (!settings || !settings.active || !settings.exam) {
      return Response.json({ found: false, error: "The seating plan hasn't been released yet — check back closer to the exam." }, { status: 400 });
    }

    const rows = await sbSelect(
      'exam_seating',
      `course_code=eq.${COURSE_CODE}&exam=eq.${encodeURIComponent(settings.exam)}&roll_number=eq.${encodeURIComponent(roll)}&select=student_name,room,seat_number`
    );
    const row = rows?.[0];
    if (!row) {
      return Response.json({ found: false, error: "No seat found for that roll number — double-check it, or contact your TF." });
    }

    return Response.json({
      found: true,
      exam: settings.exam,
      name: row.student_name,
      room: row.room,
      seatNumber: row.seat_number,
      instructions: settings.instructions || '',
    });
  } catch (err) {
    console.error('exam-seating lookup error:', err);
    return Response.json({ found: false, error: 'Server error.' }, { status: 500 });
  }
}
