// app/api/schedule/exam-results/check/route.js
// POST { studentId, pin } -> Stage 2: every visit after a student has set
// a PIN (this exam and all future ones — Mid-2, Final — reuse the same
// PIN). Throttled rather than permanently locked: a handful of wrong
// tries, then a short cool-down, since a legitimate student will come
// back and type their PIN many times across the term.

import { sbSelect, sbUpdate, sbRpc } from '../../../../../lib/supabaseAdmin';
import { COURSE_CODE } from '../../../../../lib/scheduleConfig';
import { verifyPasscode } from '../../../../../lib/scheduleAuth';
import { normalizeId, MAX_PIN_ATTEMPTS, PIN_LOCKOUT_MINUTES } from '../../../../../lib/examResultsAuth';

export async function POST(req) {
  try {
    const { studentId, pin } = await req.json();
    const id = normalizeId(studentId);
    if (!id || !pin) {
      return Response.json({ ok: false, error: 'Enter your LUMS ID and PIN.' }, { status: 400 });
    }

    const settingsRows = await sbSelect('exam_results_settings', `course_code=eq.${COURSE_CODE}&select=active,exam,instructions`);
    const settings = settingsRows?.[0];
    if (!settings || !settings.active || !settings.exam) {
      return Response.json({ ok: false, error: "Results haven't been released yet — check back later." }, { status: 400 });
    }

    const pinRows = await sbSelect('student_pins', `course_code=eq.${COURSE_CODE}&roll_number=eq.${encodeURIComponent(id)}&select=pin_hash,pin_salt,pin_locked_until`);
    const pinRow = pinRows?.[0];
    if (!pinRow?.pin_hash) {
      return Response.json({ ok: false, error: 'No PIN set for this ID yet — verify your identity first.' }, { status: 400 });
    }

    if (pinRow.pin_locked_until && new Date(pinRow.pin_locked_until).getTime() > Date.now()) {
      const mins = Math.ceil((new Date(pinRow.pin_locked_until).getTime() - Date.now()) / 60000);
      return Response.json({ ok: false, error: `Too many wrong PINs — try again in ${mins} minute${mins === 1 ? '' : 's'}.` }, { status: 429 });
    }

    const pinOk = verifyPasscode(pin, pinRow.pin_hash, pinRow.pin_salt);
    if (!pinOk) {
      try {
        const rows = await sbRpc('register_pin_failure', {
          p_course_code: COURSE_CODE, p_roll_number: id,
          p_max_attempts: MAX_PIN_ATTEMPTS, p_lockout_minutes: PIN_LOCKOUT_MINUTES,
        });
        const lockedUntil = rows?.[0]?.pin_locked_until;
        if (lockedUntil && new Date(lockedUntil).getTime() > Date.now()) {
          const mins = Math.ceil((new Date(lockedUntil).getTime() - Date.now()) / 60000);
          return Response.json({ ok: false, error: `Too many wrong PINs — try again in ${mins} minute${mins === 1 ? '' : 's'}.` }, { status: 429 });
        }
      } catch (err) {
        console.error('register_pin_failure error:', err);
      }
      return Response.json({ ok: false, error: 'Incorrect PIN.' }, { status: 400 });
    }

    // Best-effort — a correct PIN should clear any earlier fail count.
    sbUpdate('student_pins', `course_code=eq.${COURSE_CODE}&roll_number=eq.${encodeURIComponent(id)}`, { pin_fail_attempts: 0 })
      .catch((err) => console.error('pin_fail_attempts reset error:', err));

    const resultRows = await sbSelect(
      'exam_results',
      `course_code=eq.${COURSE_CODE}&exam=eq.${encodeURIComponent(settings.exam)}&roll_number=eq.${encodeURIComponent(id)}&select=*`
    );
    const result = resultRows?.[0];
    if (!result) {
      return Response.json({ ok: false, error: 'No results found for your ID for the current exam.' }, { status: 400 });
    }

    return Response.json({
      ok: true,
      exam: settings.exam,
      name: result.student_name,
      section: result.section,
      venue: result.venue,
      mcqsMarks: result.mcqs_marks,
      q2: result.q2,
      q3: result.q3,
      q4: result.q4,
      bonus: result.bonus,
      bonusTotal: result.bonus_total,
      total: result.total,
      instructions: settings.instructions || '',
    });
  } catch (err) {
    console.error('exam-results check error:', err);
    return Response.json({ ok: false, error: 'Server error.' }, { status: 500 });
  }
}
