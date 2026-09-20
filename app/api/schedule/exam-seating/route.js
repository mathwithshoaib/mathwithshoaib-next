// app/api/schedule/exam-seating/route.js
// GET -> public status check: is the seating search switched on right now,
// and for which exam? No roster data here — just enough for the "Find
// Your Seat" button to know whether to show itself at all.

import { sbSelect } from '../../../../lib/supabaseAdmin';
import { COURSE_CODE } from '../../../../lib/scheduleConfig';

export async function GET() {
  try {
    const rows = await sbSelect('exam_seating_settings', `course_code=eq.${COURSE_CODE}&select=active,exam`);
    const s = rows?.[0];
    if (!s || !s.active || !s.exam) return Response.json({ active: false });
    return Response.json({ active: true, exam: s.exam });
  } catch (err) {
    console.error('exam-seating status error:', err);
    return Response.json({ active: false });
  }
}
