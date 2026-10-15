'use client';

import { useState, useEffect } from 'react';

/* ═════════════════════════════════════════════════════════════════
   "Check Your Results" box — the main content of /exams once marks
   are released. Two very different paths depending on whether this
   is the student's first visit:

   FIRST VISIT (no PIN set yet): enter ID → complete a masked name
   (one word blanked, so a classmate who merely knows your name can't
   pass) → pick your venue from a dropdown of the exam's real venues
   (built automatically from the uploaded results, never the full
   list of every venue that's ever existed) → set a 6-digit PIN. All
   of that happens in ONE submission, verified server-side — the
   masked-name template shown to the browser is never treated as
   proof by itself.

   EVERY VISIT AFTER (this exam, Mid-2, Final — same PIN): just ID +
   PIN. No re-verification; the PIN is the identity proof from here on.

   Only ever returns the ONE student's own row — never the full class.
   ═════════════════════════════════════════════════════════════════ */

export default function ExamResultsBox() {
  const [status, setStatus] = useState(null); // { active, exam, instructions } | null while loading
  const [studentId, setStudentId] = useState('');
  const [busy, setBusy] = useState(false);
  const [stage, setStage] = useState('id'); // id | verify | pin | revealed | error
  const [errorMsg, setErrorMsg] = useState('');

  const [verifyInfo, setVerifyInfo] = useState(null); // { maskedName, venues, attemptsLeft }
  const [nameGuess, setNameGuess] = useState('');
  const [venueGuess, setVenueGuess] = useState('');
  const [pin, setPin] = useState('');
  const [pinConfirm, setPinConfirm] = useState('');

  const [pinInput, setPinInput] = useState('');
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetch('/api/schedule/exam-results')
      .then((r) => r.json())
      .then(setStatus)
      .catch(() => setStatus({ active: false }));
  }, []);

  const resetAll = () => {
    setStage('id'); setStudentId(''); setErrorMsg(''); setVerifyInfo(null);
    setNameGuess(''); setVenueGuess(''); setPin(''); setPinConfirm(''); setPinInput(''); setResult(null);
  };

  const startLookup = async (e) => {
    e.preventDefault();
    setBusy(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/schedule/exam-results/lookup-start', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId }),
      });
      const data = await res.json();
      if (!data.found) {
        setErrorMsg(data.error || 'Not found.');
        setStage('error');
      } else if (data.stage === 'pin') {
        setStage('pin');
      } else {
        setVerifyInfo(data);
        setStage('verify');
      }
    } catch {
      setErrorMsg('Something went wrong — try again.');
      setStage('error');
    } finally {
      setBusy(false);
    }
  };

  const submitVerify = async (e) => {
    e.preventDefault();
    setBusy(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/schedule/exam-results/verify-and-set-pin', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, nameGuess, venueGuess, pin, pinConfirm }),
      });
      const data = await res.json();
      if (data.ok) {
        setResult(data);
        setStage('revealed');
      } else {
        setErrorMsg(data.error || 'That did not match — try again.');
        // Refresh attempts-left / lockout state from the server rather than guessing it client-side.
        const refreshed = await fetch('/api/schedule/exam-results/lookup-start', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ studentId }),
        }).then((r) => r.json());
        if (!refreshed.found) { setErrorMsg(refreshed.error || errorMsg); setStage('error'); }
        else if (refreshed.stage === 'verify') setVerifyInfo(refreshed);
      }
    } catch {
      setErrorMsg('Something went wrong — try again.');
    } finally {
      setBusy(false);
    }
  };

  const submitPin = async (e) => {
    e.preventDefault();
    setBusy(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/schedule/exam-results/check', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, pin: pinInput }),
      });
      const data = await res.json();
      if (data.ok) {
        setResult(data);
        setStage('revealed');
      } else {
        setErrorMsg(data.error || 'Incorrect PIN.');
      }
    } catch {
      setErrorMsg('Something went wrong — try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="resbox">
      <style>{`
        .resbox { border: 1px solid var(--teal); border-radius: var(--radius); background: rgba(56,201,176,.06); padding: 24px 26px; }
        .resbox h4 { margin: 0 0 4px; font-size: 1.1rem; color: var(--text); }
        .resbox-sub { margin: 0 0 16px; font-size: .84rem; color: var(--text3); }
        .resbox-form { display: flex; gap: 10px; flex-wrap: wrap; }
        .resbox-input, .resbox-select {
          flex: 1; min-width: 200px; padding: 14px 16px; border-radius: 8px; border: 1px solid var(--border2);
          background: var(--bg2); color: var(--text); font-family: var(--fm); font-size: 16px;
        }
        .resbox-field { margin-top: 14px; }
        .resbox-label { display: block; font-family: var(--fm); font-size: .7rem; color: var(--text3); letter-spacing: .04em; text-transform: uppercase; margin-bottom: 6px; }
        .resbox-masked { font-size: 1.05rem; color: var(--text); font-weight: 600; margin-bottom: 14px; letter-spacing: .02em; }
        .resbox-pin-row { display: flex; gap: 10px; flex-wrap: wrap; }
        .resbox-pin-row .resbox-input { flex: 1; min-width: 140px; letter-spacing: .2em; }
        .resbox-result { margin-top: 4px; padding: 20px 22px; border-radius: 8px; background: rgba(56,201,176,.1); border: 1px solid var(--teal); }
        .resbox-result-name { font-size: 1.1rem; color: var(--text); font-weight: 700; }
        .resbox-result-sub { font-family: var(--fm); font-size: .8rem; color: var(--text3); margin-top: 2px; }
        .resbox-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 16px; }
        .resbox-tile { background: var(--bg); border: 1px solid rgba(56,201,176,.3); border-radius: 8px; padding: 10px 8px; text-align: center; }
        .resbox-tile-label { font-family: var(--fm); font-size: .6rem; letter-spacing: .06em; text-transform: uppercase; color: var(--text3); margin-bottom: 4px; }
        .resbox-tile-value { font-family: var(--fm); font-size: 1.2rem; font-weight: 700; color: var(--teal); }
        .resbox-total { margin-top: 12px; padding: 14px 16px; border-radius: 8px; background: var(--bg); border: 1px solid var(--teal); text-align: center; }
        .resbox-total-label { font-family: var(--fm); font-size: .68rem; letter-spacing: .06em; text-transform: uppercase; color: var(--text3); }
        .resbox-total-value { font-family: var(--fm); font-size: 1.8rem; font-weight: 700; color: var(--teal); }
        .resbox-instructions { margin-top: 14px; padding-top: 14px; border-top: 1px solid rgba(56,201,176,.25); font-size: .82rem; color: var(--text2); line-height: 1.6; white-space: pre-wrap; }
        .resbox-error { margin-top: 18px; padding: 14px 16px; border-radius: 8px; background: rgba(224,107,107,.1); border: 1px solid var(--rose); font-size: .86rem; color: var(--rose); }
        .resbox-again { margin-top: 12px; background: none; border: none; color: var(--text3); font-family: var(--fm); font-size: .74rem; text-decoration: underline; cursor: pointer; padding: 4px 0; }
        .resbox-hint { font-size: .74rem; color: var(--text3); margin-top: 10px; }
        @media (max-width: 480px) { .resbox-grid { grid-template-columns: repeat(2, 1fr); } }
      `}</style>
      <h4>📊 Check Your Results</h4>
      <p className="resbox-sub">
        {status?.active
          ? `Enter your LUMS ID to see your marks for ${status.exam}.`
          : status === null ? 'Loading…' : "Results haven't been released yet."}
      </p>

      {stage === 'id' && (
        <form onSubmit={startLookup} className="resbox-form">
          <input
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="Your LUMS ID — 8 digits or 20XX-XX-XXXX"
            className="resbox-input"
            inputMode="numeric"
          />
          <button type="submit" className="btn" disabled={busy || !studentId.trim()} style={{ padding: '12px 24px', fontSize: '.82rem', flexShrink: 0 }}>
            {busy ? 'Checking…' : 'Continue'}
          </button>
        </form>
      )}

      {stage === 'verify' && verifyInfo && (
        <form onSubmit={submitVerify}>
          <div className="resbox-masked">{verifyInfo.maskedName}</div>
          <p className="resbox-hint" style={{ marginTop: '-10px', marginBottom: '14px' }}>
            Complete your name above (just the missing part), then pick your venue, to prove this is you.
            {typeof verifyInfo.attemptsLeft === 'number' && ` ${verifyInfo.attemptsLeft} attempt${verifyInfo.attemptsLeft === 1 ? '' : 's'} left.`}
          </p>

          <div className="resbox-field">
            <label className="resbox-label">Missing part of your name</label>
            <input value={nameGuess} onChange={(e) => setNameGuess(e.target.value)} className="resbox-input" style={{ width: '100%' }} required />
          </div>

          <div className="resbox-field">
            <label className="resbox-label">Your venue</label>
            <select value={venueGuess} onChange={(e) => setVenueGuess(e.target.value)} className="resbox-select" style={{ width: '100%' }} required>
              <option value="" disabled>Select your venue…</option>
              {verifyInfo.venues.map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>

          <div className="resbox-field">
            <label className="resbox-label">Set a 6-digit PIN (you'll reuse this for Mid-2 &amp; Final)</label>
            <div className="resbox-pin-row">
              <input value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="New PIN" className="resbox-input" inputMode="numeric" required />
              <input value={pinConfirm} onChange={(e) => setPinConfirm(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="Confirm PIN" className="resbox-input" inputMode="numeric" required />
            </div>
          </div>

          <button type="submit" className="btn" disabled={busy} style={{ marginTop: '16px', padding: '12px 24px', fontSize: '.82rem' }}>
            {busy ? 'Verifying…' : 'Verify & Set PIN'}
          </button>
          {errorMsg && <div className="resbox-error">{errorMsg}</div>}
          <button type="button" className="resbox-again" onClick={resetAll}>Start over</button>
        </form>
      )}

      {stage === 'pin' && (
        <form onSubmit={submitPin} className="resbox-form">
          <input
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="Your 6-digit PIN"
            className="resbox-input"
            inputMode="numeric"
          />
          <button type="submit" className="btn" disabled={busy || pinInput.length !== 6} style={{ padding: '12px 24px', fontSize: '.82rem', flexShrink: 0 }}>
            {busy ? 'Checking…' : 'View Results'}
          </button>
          {errorMsg && <div className="resbox-error" style={{ width: '100%' }}>{errorMsg}</div>}
          <div className="resbox-hint" style={{ width: '100%' }}>Forgot your PIN? Ask your TF to reset it.</div>
        </form>
      )}

      {stage === 'revealed' && result && (
        <div className="resbox-result">
          <div className="resbox-result-name">{result.name}</div>
          <div className="resbox-result-sub">Section {result.section} · {result.venue} · {result.exam}</div>

          <div className="resbox-grid">
            <div className="resbox-tile"><div className="resbox-tile-label">MCQs</div><div className="resbox-tile-value">{result.mcqsMarks ?? '—'}</div></div>
            <div className="resbox-tile"><div className="resbox-tile-label">Q2</div><div className="resbox-tile-value">{result.q2 ?? '—'}</div></div>
            <div className="resbox-tile"><div className="resbox-tile-label">Q3</div><div className="resbox-tile-value">{result.q3 ?? '—'}</div></div>
            <div className="resbox-tile"><div className="resbox-tile-label">Q4</div><div className="resbox-tile-value">{result.q4 ?? '—'}</div></div>
            <div className="resbox-tile"><div className="resbox-tile-label">Bonus</div><div className="resbox-tile-value">{result.bonus ?? '—'}</div></div>
            <div className="resbox-tile"><div className="resbox-tile-label">Bonus Total</div><div className="resbox-tile-value">{result.bonusTotal ?? '—'}</div></div>
          </div>

          <div className="resbox-total">
            <div className="resbox-total-label">Total</div>
            <div className="resbox-total-value">{result.total}</div>
          </div>

          {result.instructions && <div className="resbox-instructions">{result.instructions}</div>}
          <button type="button" className="resbox-again" onClick={resetAll}>Check another ID</button>
        </div>
      )}

      {stage === 'error' && (
        <>
          <div className="resbox-error">{errorMsg}</div>
          <button type="button" className="resbox-again" onClick={resetAll}>Try again</button>
        </>
      )}
    </div>
  );
}
