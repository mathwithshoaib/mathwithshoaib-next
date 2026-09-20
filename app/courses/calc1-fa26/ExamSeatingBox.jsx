'use client';

import { useState, useEffect } from 'react';

/* ═════════════════════════════════════════════════════════════════
   Standalone "Find Your Seat" box — the main content of /exams.
   Always rendered as a live, interactive search (never hidden), so
   students always see it and understand what it's for. If the admin
   hasn't switched on the seating search yet (or hasn't loaded a roster
   for the current exam), submitting simply reports that plainly rather
   than pretending nothing exists here.

   Only ever returns the ONE student's own row (see the lookup API
   route) — never the full roster.
   ═════════════════════════════════════════════════════════════════ */

export default function ExamSeatingBox() {
  const [status, setStatus] = useState(null); // { active, exam } | null while loading
  const [roll, setRoll] = useState('');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetch('/api/schedule/exam-seating')
      .then((r) => r.json())
      .then(setStatus)
      .catch(() => setStatus({ active: false }));
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setResult(null);
    try {
      const res = await fetch('/api/schedule/exam-seating/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rollNumber: roll }),
      });
      setResult(await res.json());
    } catch {
      setResult({ found: false, error: 'Something went wrong — try again.' });
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
          flex: 1; min-width: 200px; padding: 12px 14px; border-radius: 8px; border: 1px solid var(--border2);
          background: var(--bg2); color: var(--text); font-family: var(--fm); font-size: .92rem;
        }
        .seatbox-result { margin-top: 18px; padding: 16px 18px; border-radius: 8px; background: rgba(56,201,176,.1); border: 1px solid var(--teal); }
        .seatbox-name { font-size: .96rem; color: var(--text); font-weight: 600; }
        .seatbox-place { margin-top: 8px; font-family: var(--fm); font-size: 1.15rem; color: var(--teal); font-weight: 700; }
        .seatbox-instructions { margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(56,201,176,.25); font-size: .82rem; color: var(--text2); line-height: 1.6; white-space: pre-wrap; }
        .seatbox-error { margin-top: 18px; padding: 14px 16px; border-radius: 8px; background: rgba(224,107,107,.1); border: 1px solid var(--rose); font-size: .86rem; color: var(--rose); }
        @media (max-width: 680px) { .seatbox-input { font-size: 16px; } }
      `}</style>
      <h4>🔍 Find Your Seat</h4>
      <p className="seatbox-sub">
        {status?.active
          ? `Enter your roll number to see your room and seat for ${status.exam}.`
          : 'Enter your roll number below.'}
      </p>
      <form onSubmit={submit} className="seatbox-form">
        <input
          value={roll}
          onChange={(e) => setRoll(e.target.value)}
          placeholder="Your roll number / campus ID"
          className="seatbox-input"
        />
        <button type="submit" className="btn" disabled={busy || !roll.trim()} style={{ padding: '12px 24px', fontSize: '.82rem', flexShrink: 0 }}>
          {busy ? 'Searching…' : 'Search'}
        </button>
      </form>
      {result && (
        result.found ? (
          <div className="seatbox-result">
            <div className="seatbox-name">{result.name}</div>
            <div className="seatbox-place">Room {result.room} · Seat {result.seatNumber}</div>
            {result.instructions && <div className="seatbox-instructions">{result.instructions}</div>}
          </div>
        ) : (
          <div className="seatbox-error">{result.error || 'Not found.'}</div>
        )
      )}
    </div>
  );
}
