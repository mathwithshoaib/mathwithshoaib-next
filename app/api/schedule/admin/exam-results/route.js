// app/api/schedule/admin/exam-results/route.js
// GET   -> current settings (active/exam/instructions) plus how many rows
//          are loaded for that exam, searchCount — a running total of
//          every public results lookup, incremented server-side by the
//          lookup-start route itself — pinsSetCount (students who have
//          ever set a PIN, course-wide, since it carries across exams),
//          and stats — mean/median/stdDev/min/max on Total plus a
//          per-question average, computed fresh from exam_results on
//          every call rather than stored anywhere.
// PATCH -> update settings. Switch `active` on once marks are ready to
//          release; change `exam` and re-import rows for the next one —
//          old rows for a past exam are left alone (a different exam
//          string), so nothing needs to be deleted between exams.
//          Pass `resetSearchCount: true` to zero the counter back out.

import { cookies } from 'next/headers';
import { readAdminSession } from '../../../../../lib/scheduleAuth';
import { sbSelect, sbUpsert } from '../../../../../lib/supabaseAdmin';
import { COURSE_CODE } from '../../../../../lib/scheduleConfig';

// Ignores blank/non-numeric values rather than treating them as zero, so a
// few students with a field left empty don't drag the average down.
function numStats(values) {
  const nums = values.map((v) => parseFloat(v)).filter((n) => Number.isFinite(n));
  if (nums.length === 0) return { count: 0, mean: null, median: null, stdDev: null, min: null, max: null };
  const sum = nums.reduce((a, b) => a + b, 0);
  const mean = sum / nums.length;
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  const median = sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  const variance = nums.reduce((a, n) => a + (n - mean) ** 2, 0) / nums.length;
  const round2 = (n) => Math.round(n * 100) / 100;
  return {
    count: nums.length,
    mean: round2(mean),
    median: round2(median),
    stdDev: round2(Math.sqrt(variance)),
    min: round2(sorted[0]),
    max: round2(sorted[sorted.length - 1]),
  };
}

export async function GET() {
  const cookieStore = await cookies();
  if (!readAdminSession(cookieStore)) {
    return Response.json({ error: 'Admin login required.' }, { status: 401 });
  }

  try {
    const settingsRows = await sbSelect('exam_results_settings', `course_code=eq.${COURSE_CODE}&select=active,exam,instructions,search_count`);
    const s = settingsRows?.[0] || { active: false, exam: '', instructions: '', search_count: 0 };

    let count = 0;
    let stats = null;
    if (s.exam) {
      const rows = await sbSelect(
        'exam_results',
        `course_code=eq.${COURSE_CODE}&exam=eq.${encodeURIComponent(s.exam)}&select=mcqs_marks,q2,q3,q4,bonus,bonus_total,total`
      );
      count = rows.length;
      stats = {
        total: numStats(rows.map((r) => r.total)),
        mcqsMarks: numStats(rows.map((r) => r.mcqs_marks)),
        q2: numStats(rows.map((r) => r.q2)),
        q3: numStats(rows.map((r) => r.q3)),
        q4: numStats(rows.map((r) => r.q4)),
        bonusTotal: numStats(rows.map((r) => r.bonus_total)),
      };
    }

    const pinRows = await sbSelect('student_pins', `course_code=eq.${COURSE_CODE}&pin_hash=not.is.null&select=roll_number`);

    return Response.json({
      settings: { active: !!s.active, exam: s.exam || '', instructions: s.instructions || '' },
      count,
      searchCount: s.search_count || 0,
      pinsSetCount: pinRows.length,
      stats,
    });
  } catch (err) {
    console.error('admin/exam-results GET error:', err);
    return Response.json({ error: 'Server error.' }, { status: 500 });
  }
}

export async function PATCH(req) {
  const cookieStore = await cookies();
  if (!readAdminSession(cookieStore)) {
    return Response.json({ error: 'Admin login required.' }, { status: 401 });
  }

  try {
    const { active, exam, instructions, resetSearchCount } = await req.json();
    const patch = {
      course_code: COURSE_CODE,
      active: !!active,
      exam: exam && exam.trim() ? exam.trim() : null,
      instructions: instructions && instructions.trim() ? instructions.trim() : null,
    };
    if (resetSearchCount) patch.search_count = 0;
    await sbUpsert('exam_results_settings', patch, 'course_code');
    return Response.json({ ok: true });
  } catch (err) {
    console.error('admin/exam-results PATCH error:', err);
    return Response.json({ error: 'Server error.' }, { status: 500 });
  }
}
