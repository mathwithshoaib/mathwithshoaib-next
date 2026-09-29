// app/api/schedule/exam-seating/lookup/route.js
// POST { studentId } -> the ONLY route that ever touches the actual
// exam_seating roster from the public side, and even then it returns
// exactly one student's row (name/section/venue/seat), matched by exact
// LUMS ID against whichever exam is currently marked active in settings.
// Never exposes anyone else's data, and does nothing at all once the
// search is switched off in the admin panel.

import { sbSelect, sbRpc } from '../../../../../lib/supabaseAdmin';
import { COURSE_CODE } from '../../../../../lib/scheduleConfig';

// Same normalization as the CSV import and the admin single-row route —
// accepts the raw 8-digit form or the dashed "20XX-XX-XXXX" form students
// sometimes type, and reduces either to the same 8-digit lookup key.
function normalizeId(s) {
  let digits = (s || '').replace(/\D/g, '');
  if (digits.length === 10 && digits.startsWith('20')) digits = digits.slice(2);
  if (digits.length === 7) digits = '0' + digits;
  return digits;
}

export async function POST(req) {
  try {
    const { studentId } = await req.json();
    const id = normalizeId(studentId);
    if (!id) {
      return Response.json({ found: false, error: 'Enter your LUMS ID.' }, { status: 400 });
    }

    const settingsRows = await sbSelect('exam_seating_settings', `course_code=eq.${COURSE_CODE}&select=active,exam,instructions,exam_date,exam_time`);
    const settings = settingsRows?.[0];
    if (!settings || !settings.active || !settings.exam) {
      return Response.json({ found: false, error: "The seating plan hasn't been released yet — check back closer to the exam." }, { status: 400 });
    }

    // Best-effort usage counter for the admin panel — every real attempted
    // search against a live roster, found or not. Never let a hiccup here
    // fail the actual lookup the student is waiting on.
    sbRpc('increment_exam_seating_search_count', { p_course_code: COURSE_CODE }).catch((err) => {
      console.error('exam-seating search count increment failed:', err);
    });

    const rows = await sbSelect(
      'exam_seating',
      `course_code=eq.${COURSE_CODE}&exam=eq.${encodeURIComponent(settings.exam)}&roll_number=eq.${encodeURIComponent(id)}&select=roll_number,student_name,section,venue,seat_number`
    );
    const row = rows?.[0];
    if (!row) {
      return Response.json({ found: false, error: "No seat found for that ID — double-check it, or contact your TF." });
    }

    return Response.json({
      found: true,
      exam: settings.exam,
      studentId: row.roll_number,
      name: row.student_name,
      section: row.section,
      venue: row.venue,
      seatNumber: row.seat_number,
      examDate: settings.exam_date || '',
      examTime: settings.exam_time || '',
      instructions: settings.instructions || '',
    });
  } catch (err) {
    console.error('exam-seating lookup error:', err);
    return Response.json({ found: false, error: 'Server error.' }, { status: 500 });
  }
}
