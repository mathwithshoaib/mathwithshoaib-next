// app/api/schedule/exam-results/lookup-start/route.js
// POST { studentId } -> tells the client which stage to show next:
//   - "pin"    : this student already has a PIN set — just ask for ID+PIN.
//   - "verify" : no PIN yet — returns a masked name template (one word
//                blanked) and the list of real venues for this exam, so
//                the student can prove who they are before setting a PIN.
// Never reveals the student's full name, their own venue, or anyone
// else's data. Rejects once Stage-1 attempts are exhausted (see
// MAX_VERIFY_ATTEMPTS) — admin can reset that counter from the admin panel.

import { sbSelect, sbUpsert, sbRpc } from '../../../../../lib/supabaseAdmin';
import { COURSE_CODE } from '../../../../../lib/scheduleConfig';
import { normalizeId, maskName, MAX_VERIFY_ATTEMPTS } from '../../../../../lib/examResultsAuth';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export async function POST(req) {
  try {
    const { studentId } = await req.json();
    const id = normalizeId(studentId);
    if (!id) {
      return Response.json({ found: false, error: 'Enter your LUMS ID.' }, { status: 400 });
    }

    const settingsRows = await sbSelect('exam_results_settings', `course_code=eq.${COURSE_CODE}&select=active,exam`);
    const settings = settingsRows?.[0];
    if (!settings || !settings.active || !settings.exam) {
      return Response.json({ found: false, error: "Results haven't been released yet — check back later." }, { status: 400 });
    }

    // Best-effort usage counter for the admin panel — every real attempted
    // results lookup, found or not. Never let a hiccup here fail the
    // actual lookup the student is waiting on.
    sbRpc('increment_exam_results_search_count', { p_course_code: COURSE_CODE }).catch((err) => {
      console.error('exam-results search count increment failed:', err);
    });

    const resultRows = await sbSelect(
      'exam_results',
      `course_code=eq.${COURSE_CODE}&exam=eq.${encodeURIComponent(settings.exam)}&roll_number=eq.${encodeURIComponent(id)}&select=student_name,venue`
    );
    const result = resultRows?.[0];
    if (!result) {
      return Response.json({ found: false, error: "No results found for that ID — double-check it, or contact your TF." });
    }

    const pinRows = await sbSelect('student_pins', `course_code=eq.${COURSE_CODE}&roll_number=eq.${encodeURIComponent(id)}&select=pin_hash,verify_attempts`);
    const pinRow = pinRows?.[0];

    if (pinRow?.pin_hash) {
      return Response.json({ found: true, stage: 'pin' });
    }

    const attempts = pinRow?.verify_attempts || 0;
    if (attempts >= MAX_VERIFY_ATTEMPTS) {
      return Response.json({ found: false, error: 'Too many failed attempts — ask your TF to reset verification for your ID.' }, { status: 429 });
    }

    // Ensure a tracking row exists so the attempt counter has somewhere to live.
    if (!pinRow) {
      await sbUpsert('student_pins', { course_code: COURSE_CODE, roll_number: id }, 'course_code,roll_number');
    }

    const allVenueRows = await sbSelect(
      'exam_results',
      `course_code=eq.${COURSE_CODE}&exam=eq.${encodeURIComponent(settings.exam)}&select=venue`
    );
    const venues = shuffle([...new Set(allVenueRows.map((r) => r.venue).filter(Boolean))]);

    const { display } = maskName(result.student_name);

    return Response.json({
      found: true,
      stage: 'verify',
      maskedName: display,
      venues,
      attemptsLeft: MAX_VERIFY_ATTEMPTS - attempts,
    });
  } catch (err) {
    console.error('exam-results lookup-start error:', err);
    return Response.json({ found: false, error: 'Server error.' }, { status: 500 });
  }
}
