// app/api/schedule/admin/exam-seating/route.js
// GET   -> current settings (active/exam/instructions) plus how many rows
//          are loaded for that exam, so the admin can confirm an import
//          worked without dumping the whole roster into the page.
// PATCH -> update settings. Switch `active` on shortly before an exam and
//          off again after; change `exam` and re-import rows for the next
//          one — old rows for a past exam are left alone (a different
//          exam string), so nothing needs to be deleted between exams.

import { cookies } from 'next/headers';
import { readAdminSession } from '../../../../../lib/scheduleAuth';
import { sbSelect, sbUpsert } from '../../../../../lib/supabaseAdmin';
import { COURSE_CODE } from '../../../../../lib/scheduleConfig';

export async function GET() {
  const cookieStore = await cookies();
  if (!readAdminSession(cookieStore)) {
    return Response.json({ error: 'Admin login required.' }, { status: 401 });
  }

  try {
    const settingsRows = await sbSelect('exam_seating_settings', `course_code=eq.${COURSE_CODE}&select=active,exam,instructions`);
    const s = settingsRows?.[0] || { active: false, exam: '', instructions: '' };

    let count = 0;
    if (s.exam) {
      const rows = await sbSelect('exam_seating', `course_code=eq.${COURSE_CODE}&exam=eq.${encodeURIComponent(s.exam)}&select=id`);
      count = rows.length;
    }

    return Response.json({
      settings: { active: !!s.active, exam: s.exam || '', instructions: s.instructions || '' },
      count,
    });
  } catch (err) {
    console.error('admin/exam-seating GET error:', err);
    return Response.json({ error: 'Server error.' }, { status: 500 });
  }
}

export async function PATCH(req) {
  const cookieStore = await cookies();
  if (!readAdminSession(cookieStore)) {
    return Response.json({ error: 'Admin login required.' }, { status: 401 });
  }

  try {
    const { active, exam, instructions } = await req.json();
    await sbUpsert('exam_seating_settings', {
      course_code: COURSE_CODE,
      active: !!active,
      exam: exam && exam.trim() ? exam.trim() : null,
      instructions: instructions && instructions.trim() ? instructions.trim() : null,
    }, 'course_code');
    return Response.json({ ok: true });
  } catch (err) {
    console.error('admin/exam-seating PATCH error:', err);
    return Response.json({ error: 'Server error.' }, { status: 500 });
  }
}
