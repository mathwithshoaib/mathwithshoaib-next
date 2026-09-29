'use client';

import { useState, useEffect } from 'react';

/* ═════════════════════════════════════════════════════════════════
   Standalone "Find Your Seat" box — the main content of /exams.
   Always rendered as a live, interactive search (never hidden), so
   students always see it and understand what it's for. If the admin
   hasn't switched on the seating search yet (or hasn't loaded a roster
   for the current exam), submitting simply reports that plainly rather
   than pretending nothing exists here.

   Two-step reveal: typing an ID and searching only shows the matched
   NAME first, with a "Yes, that's me / No" check — catches a mistyped ID
   landing on someone else's row before the actual seat details show.
   Only after confirming does the venue/section/seat (and date/time)
   appear, large and prominent since most students check this on a phone.

   Only ever returns the ONE student's own row (see the lookup API
   route) — never the full roster.
   ═════════════════════════════════════════════════════════════════ */

export default function ExamSeatingBox() {
  const [status, setStatus] = useState(null); // { active, exam, examDate, examTime } | null while loading
  const [studentId, setStudentId] = useState('');
  const [busy, setBusy] = useState(false);
  const [stage, setStage] = useState('idle'); // idle | confirm | revealed | error
  const [pending, setPending] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetch('/api/schedule/exam-seating')
      .then((r) => r.json())
      .then(setStatus)
      .catch(() => setStatus({ active: false }));
  }, []);

  const reset = () => {
    setStage('idle');
    setPending(null);
    setErrorMsg('');
    setStudentId('');
  };

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/schedule/exam-seating/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId }),
      });
      const data = await res.json();
      if (data.found) {
        setPending(data);
        setStage('confirm');
      } else {
        setErrorMsg(data.error || 'Not found.');
        setStage('error');
      }
    } catch {
      setErrorMsg('Something went wrong — try again.');
      setStage('error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="seatbox">
      <style>{`
        .seatbox { border: 1px solid var(--violet); border-radius: var(--radius); background: rgba(155,128,232,.06); padding: 24px 26px; }
        .seatbox h4 { margin: 0 0 4px; font-size: 1.1rem; color: var(--text); }
        .seatbox-sub { margin: 0 0 16px; font-size: .84rem; color: var(--text3); }
        .seatbox-form { display: flex; gap: 10px; flex-wrap: wrap; }
        .seatbox-input {
          flex: 1; min-width: 200px; padding: 14px 16px; border-radius: 8px; border: 1px solid var(--border2);
          background: var(--bg2); color: var(--text); font-family: var(--fm); font-size: 16px;
        }
        .seatbox-confirm { margin-top: 18px; padding: 18px 20px; border-radius: 8px; background: var(--bg2); border: 1px solid var(--border2); }
        .seatbox-confirm-name { font-size: 1.15rem; font-weight: 700; color: var(--text); margin-bottom: 14px; }
        .seatbox-confirm-btns { display: flex; gap: 10px; flex-wrap: wrap; }
        .seatbox-btn-yes, .seatbox-btn-no {
          flex: 1; min-width: 120px; padding: 13px 20px; border-radius: 8px; font-family: var(--fm); font-size: .88rem;
          font-weight: 700; cursor: pointer; border: 1px solid;
        }
        .seatbox-btn-yes { background: var(--teal); border-color: var(--teal); color: var(--bg); }
        .seatbox-btn-no { background: transparent; border-color: var(--border2); color: var(--text2); }
        .seatbox-result { margin-top: 18px; padding: 20px 22px; border-radius: 8px; background: rgba(56,201,176,.1); border: 1px solid var(--teal); }
        .seatbox-result-name { font-size: 1.1rem; color: var(--text); font-weight: 700; }
        .seatbox-result-section { font-family: var(--fm); font-size: .8rem; color: var(--text3); margin-top: 2px; }
        .seatbox-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 16px; }
        .seatbox-tile { background: var(--bg); border: 1px solid rgba(56,201,176,.3); border-radius: 8px; padding: 12px 14px; text-align: center; }
        .seatbox-tile-label { font-family: var(--fm); font-size: .62rem; letter-spacing: .08em; text-transform: uppercase; color: var(--text3); margin-bottom: 4px; }
        .seatbox-tile-value { font-family: var(--fm); font-size: 1.5rem; font-weight: 700; color: var(--teal); line-height: 1.15; }
        .seatbox-when { margin-top: 14px; padding-top: 14px; border-top: 1px solid rgba(56,201,176,.25); font-size: .9rem; color: var(--text2); }
        .seatbox-when strong { color: var(--text); }
        .seatbox-instructions { margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(56,201,176,.25); font-size: .82rem; color: var(--text2); line-height: 1.6; white-space: pre-wrap; }
        .seatbox-error { margin-top: 18px; padding: 14px 16px; border-radius: 8px; background: rgba(224,107,107,.1); border: 1px solid var(--rose); font-size: .86rem; color: var(--rose); }
        .seatbox-again { margin-top: 12px; background: none; border: none; color: var(--text3); font-family: var(--fm); font-size: .74rem; text-decoration: underline; cursor: pointer; padding: 4px 0; }
        @media (max-width: 480px) { .seatbox-grid { grid-template-columns: 1fr; } }
      `}</style>
      <h4>🔍 Find Your Seat</h4>
      <p className="seatbox-sub">
        {status?.active
          ? `Enter your LUMS ID to see your venue, section & seat for ${status.exam}.`
          : 'Enter your LUMS ID below.'}
      </p>

      {stage === 'idle' && (
        <form onSubmit={submit} className="seatbox-form">
          <input
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="Your LUMS ID — 8 digits or 20XX-XX-XXXX"
            className="seatbox-input"
            inputMode="numeric"
          />
          <button type="submit" className="btn" disabled={busy || !studentId.trim()} style={{ padding: '12px 24px', fontSize: '.82rem', flexShrink: 0 }}>
            {busy ? 'Searching…' : 'Search'}
          </button>
        </form>
      )}

      {stage === 'confirm' && pending && (
        <div className="seatbox-confirm">
          <div className="seatbox-confirm-name">Is this you? {pending.name}</div>
          <div className="seatbox-confirm-btns">
            <button type="button" className="seatbox-btn-yes" onClick={() => setStage('revealed')}>Yes, that's me</button>
            <button type="button" className="seatbox-btn-no" onClick={reset}>No, try again</button>
          </div>
        </div>
      )}

      {stage === 'revealed' && pending && (
        <div className="seatbox-result">
          <div className="seatbox-result-name">{pending.name}</div>
          <div className="seatbox-result-section">
            {pending.studentId && `ID ${pending.studentId}`}
            {pending.studentId && pending.section && ' · '}
            {pending.section && `Section ${pending.section}`}
          </div>
          <div className="seatbox-grid">
            <div className="seatbox-tile">
              <div className="seatbox-tile-label">Venue</div>
              <div className="seatbox-tile-value">{pending.venue}</div>
            </div>
            <div className="seatbox-tile">
              <div className="seatbox-tile-label">Seat</div>
              <div className="seatbox-tile-value">{pending.seatNumber}</div>
            </div>
          </div>
          {(pending.examDate || pending.examTime) && (
            <div className="seatbox-when">
              {pending.examDate && <div><strong>{pending.examDate}</strong></div>}
              {pending.examTime && <div>{pending.examTime}</div>}
            </div>
          )}
          {pending.instructions && <div className="seatbox-instructions">{pending.instructions}</div>}
          <button type="button" className="seatbox-again" onClick={reset}>Search another ID</button>
        </div>
      )}

      {stage === 'error' && (
        <>
          <div className="seatbox-error">{errorMsg}</div>
          <button type="button" className="seatbox-again" onClick={reset}>Try again</button>
        </>
      )}
    </div>
  );
}
