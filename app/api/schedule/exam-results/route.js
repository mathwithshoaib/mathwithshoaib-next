// app/api/schedule/exam-results/route.js
// GET -> public status check: is the results box switched on, and for
// which exam? No student data here — just enough for the "Check Your
// Results" box to know whether to show itself at all.

import { sbSelect } from '../../../../lib/supabaseAdmin';
import { COURSE_CODE } from '../../../../lib/scheduleConfig';

export async function GET() {
  try {
    const rows = await sbSelect('exam_results_settings', `course_code=eq.${COURSE_CODE}&select=active,exam,instructions`);
    const s = rows?.[0];
    if (!s || !s.active || !s.exam) return Response.json({ active: false });
    return Response.json({ active: true, exam: s.exam, instructions: s.instructions || '' });
  } catch (err) {
    console.error('exam-results status error:', err);
    return Response.json({ active: false });
  }
}
