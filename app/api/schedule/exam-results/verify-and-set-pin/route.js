// app/api/schedule/exam-results/verify-and-set-pin/route.js
// POST { studentId, nameGuess, venueGuess, pin, pinConfirm } -> Stage 1,
// completed in one shot: re-verifies the masked-name completion and venue
// pick SERVER-SIDE (the client is never trusted with a "you're verified"
// flag from an earlier call), and only then sets the PIN. On success,
// also returns the student's own result for this exam immediately, so
// they don't have to re-enter anything right after setting a PIN.

import { sbSelect, sbUpdate, sbRpc } from '../../../../../lib/supabaseAdmin';
import { COURSE_CODE } from '../../../../../lib/scheduleConfig';
import { hashPasscode } from '../../../../../lib/scheduleAuth';
import { normalizeId, maskName, namesMatch, venuesMatch, isValidPin, MAX_VERIFY_ATTEMPTS } from '../../../../../lib/examResultsAuth';

export async function POST(req) {
  try {
    const { studentId, nameGuess, venueGuess, pin, pinConfirm } = await req.json();
    const id = normalizeId(studentId);
    if (!id) {
      return Response.json({ ok: false, error: 'Enter your LUMS ID.' }, { status: 400 });
    }
    if (!isValidPin(pin) || pin !== pinConfirm) {
      return Response.json({ ok: false, error: 'PIN must be exactly 6 digits, and both entries must match.' }, { status: 400 });
    }

    const settingsRows = await sbSelect('exam_results_settings', `course_code=eq.${COURSE_CODE}&select=active,exam,instructions`);
    const settings = settingsRows?.[0];
    if (!settings || !settings.active || !settings.exam) {
      return Response.json({ ok: false, error: "Results haven't been released yet — check back later." }, { status: 400 });
    }

    const resultRows = await sbSelect(
      'exam_results',
      `course_code=eq.${COURSE_CODE}&exam=eq.${encodeURIComponent(settings.exam)}&roll_number=eq.${encodeURIComponent(id)}&select=*`
    );
    const result = resultRows?.[0];
    if (!result) {
      return Response.json({ ok: false, error: "No results found for that ID." }, { status: 400 });
    }

    const pinRows = await sbSelect('student_pins', `course_code=eq.${COURSE_CODE}&roll_number=eq.${encodeURIComponent(id)}&select=pin_hash,verify_attempts`);
    const pinRow = pinRows?.[0];
    if (pinRow?.pin_hash) {
      return Response.json({ ok: false, error: 'A PIN is already set for this ID — use the PIN sign-in instead.' }, { status: 400 });
    }
    if ((pinRow?.verify_attempts || 0) >= MAX_VERIFY_ATTEMPTS) {
      return Response.json({ ok: false, error: 'Too many failed attempts — ask your TF to reset verification for your ID.' }, { status: 429 });
    }

    const { answer } = maskName(result.student_name);
    const nameOk = namesMatch(nameGuess, answer);
    const venueOk = venuesMatch(venueGuess, result.venue);

    if (!nameOk || !venueOk) {
      const newCount = await sbRpc('increment_verify_attempts', { p_course_code: COURSE_CODE, p_roll_number: id });
      const attemptsLeft = Math.max(0, MAX_VERIFY_ATTEMPTS - (Array.isArray(newCount) ? newCount[0] : newCount));
      if (attemptsLeft <= 0) {
        return Response.json({ ok: false, error: 'Too many failed attempts — ask your TF to reset verification for your ID.' }, { status: 429 });
      }
      return Response.json({ ok: false, error: `That doesn't match. ${attemptsLeft} attempt${attemptsLeft === 1 ? '' : 's'} left.` }, { status: 400 });
    }

    const { hash, salt } = hashPasscode(pin);
    await sbUpdate(
      'student_pins',
      `course_code=eq.${COURSE_CODE}&roll_number=eq.${encodeURIComponent(id)}`,
      { pin_hash: hash, pin_salt: salt, pin_set_at: new Date().toISOString() }
    );

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
    console.error('exam-results verify-and-set-pin error:', err);
    return Response.json({ ok: false, error: 'Server error.' }, { status: 500 });
  }
}
