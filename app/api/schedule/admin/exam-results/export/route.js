// app/api/schedule/admin/exam-results/export/route.js
// GET ?exam=... -> downloads every row for that exam as a CSV, in the same
// column layout the importer accepts, plus a trailing "PIN Set" column —
// so a corrected export can be re-uploaded as-is (the extra column is
// simply ignored by the importer), and the admin can see PIN status
// without a separate per-student lookup. Admin-session gated like every
// other exam-results admin route; the browser sends the session cookie
// automatically for a same-origin GET, so a plain link/button works.

import { cookies } from 'next/headers';
import { readAdminSession } from '../../../../../../lib/scheduleAuth';
import { sbSelect } from '../../../../../../lib/supabaseAdmin';
import { COURSE_CODE } from '../../../../../../lib/scheduleConfig';

function csvField(v) {
  const s = v === null || v === undefined ? '' : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export async function GET(req) {
  const cookieStore = await cookies();
  if (!readAdminSession(cookieStore)) {
    return Response.json({ error: 'Admin login required.' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const exam = searchParams.get('exam');
    if (!exam || !exam.trim()) {
      return Response.json({ error: 'exam is required.' }, { status: 400 });
    }

    const rows = await sbSelect(
      'exam_results',
      `course_code=eq.${COURSE_CODE}&exam=eq.${encodeURIComponent(exam.trim())}&select=*&order=roll_number`
    );
    const pinRows = await sbSelect('student_pins', `course_code=eq.${COURSE_CODE}&select=roll_number,pin_hash`);
    const pinSet = new Set(pinRows.filter((p) => p.pin_hash).map((p) => p.roll_number));

    const header = ['Number', 'Name', 'ID', 'Section', 'Venue', 'MCQs Marks', 'Question 2', 'Question 3', 'Question 4', 'Bonus', 'Bonus Total', 'Total', 'PIN Set'];
    const lines = [header.map(csvField).join(',')];
    rows.forEach((r, i) => {
      lines.push([
        i + 1, r.student_name, r.roll_number, r.section, r.venue,
        r.mcqs_marks, r.q2, r.q3, r.q4, r.bonus, r.bonus_total, r.total,
        pinSet.has(r.roll_number) ? 'Yes' : 'No',
      ].map(csvField).join(','));
    });

    const filename = `${COURSE_CODE}-${exam.trim().replace(/[^a-z0-9]+/gi, '-')}-results.csv`;
    return new Response(lines.join('\r\n'), {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (err) {
    console.error('admin/exam-results/export error:', err);
    return Response.json({ error: 'Server error.' }, { status: 500 });
  }
}
