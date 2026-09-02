'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { DAY_LABELS } from '../../../../lib/scheduleConfig';

/* ═════════════════════════════════════════════════════════════════
   MATH-101 · CALCULUS I (Non-SSE) FA26 — LIVE WEEKLY SCHEDULE
   Route: /courses/calc1-fa26/schedule

   Lectures, instructor office hours, and TF recitations are fixed —
   entered by the instructor via /schedule/admin. Tutorials (8 weekly
   slots, 2 TA seats each) and TA office hours (4 hrs/week, self-picked
   1-hour blocks) are filled live by TAs on this page. Everyone sees the
   same grid; it refreshes every few seconds.
   ═════════════════════════════════════════════════════════════════ */

const POLL_MS = 5000;
const PX_PER_MIN = 1.05;

const COLORS = {
  lecture:       { bg: 'rgba(232,160,32,.18)',  bd: 'var(--amber)' },
  instructor_oh: { bg: 'rgba(155,128,232,.18)', bd: 'var(--violet)' },
  recitation:    { bg: 'rgba(224,107,107,.18)', bd: 'var(--rose)' },
  tutorial:      { bg: 'rgba(56,201,176,.18)',  bd: 'var(--teal)' },
  ta_oh:         { bg: 'rgba(79,143,224,.20)',  bd: '#4f8fe0' },
};
const CATEGORY_ORDER = [
  ['lecture', 'Lecture'],
  ['instructor_oh', 'Instructor OH'],
  ['recitation', 'TF Recitation'],
  ['tutorial', 'Tutorial'],
  ['ta_oh', 'TA Office Hours'],
];

function fmtHour(t) {
  const h = Math.floor(t), m = Math.round((t - h) * 60);
  const ap = h >= 12 ? 'pm' : 'am';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${h12}${ap}` : `${h12}:${String(m).padStart(2, '0')}${ap}`;
}

async function api(path, opts) {
  const res = await fetch(path, {
    method: opts?.method || 'GET',
    headers: opts?.body ? { 'Content-Type': 'application/json' } : undefined,
    body: opts?.body ? JSON.stringify(opts.body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || 'Something went wrong.');
  return json;
}

// Does this row currently cover integer hour h? (h < end && start < h+1 handles both
// whole-hour ta_oh rows [start,start+1) and fractional fixed/tutorial rows.)
function covers(row, h) {
  return row.start < h + 1 && row.end > h;
}

// Assign each of a day's items a lane (0/1) and mark whether it overlaps a
// neighbor, so overlapping items render side-by-side (cap of 2 keeps this simple).
function layoutDay(items) {
  const sorted = [...items].sort((a, b) => a.start - b.start);
  const laneEnds = [];
  const withLane = sorted.map((item) => {
    let lane = 0;
    while (laneEnds[lane] !== undefined && laneEnds[lane] > item.start) lane++;
    laneEnds[lane] = item.end;
    return { ...item, lane };
  });
  return withLane.map((item) => ({
    ...item,
    overlapping: withLane.some((o) => o !== item && o.start < item.end && item.start < o.end),
  }));
}

export default function CalcFA26Schedule() {
  const [data, setData] = useState(null);
  const [me, setMe] = useState({ admin: false, ta: null });
  const [loadError, setLoadError] = useState('');
  const [actionMsg, setActionMsg] = useState(null); // { text, tone }
  const [passcode, setPasscode] = useState('');
  const [loginBusy, setLoginBusy] = useState(false);
  const [loginError, setLoginError] = useState('');
  const msgTimer = useRef(null);

  const flash = useCallback((text, tone = 'error') => {
    setActionMsg({ text, tone });
    clearTimeout(msgTimer.current);
    msgTimer.current = setTimeout(() => setActionMsg(null), 5000);
  }, []);

  const fetchState = useCallback(async () => {
    try {
      const json = await api('/api/schedule/state');
      setData(json);
      setLoadError('');
    } catch {
      setLoadError('Could not reach the schedule server. Retrying…');
    }
  }, []);

  const fetchMe = useCallback(async () => {
    try {
      const json = await api('/api/schedule/me');
      setMe(json);
    } catch { /* leave as-is */ }
  }, []);

  useEffect(() => {
    fetchState();
    fetchMe();
    const id = setInterval(fetchState, POLL_MS);
    return () => clearInterval(id);
  }, [fetchState, fetchMe]);

  const taLogin = async (e) => {
    e.preventDefault();
    setLoginBusy(true); setLoginError('');
    try {
      const json = await api('/api/schedule/ta/login', { method: 'POST', body: { passcode } });
      setMe((m) => ({ ...m, ta: { id: json.taId, name: json.name } }));
      setPasscode('');
      fetchState();
    } catch (err) {
      setLoginError(err.message);
    } finally {
      setLoginBusy(false);
    }
  };

  const taLogout = async () => {
    await api('/api/schedule/ta/logout', { method: 'POST' }).catch(() => {});
    setMe((m) => ({ ...m, ta: null }));
  };

  const bookHour = async (day, hour) => {
    try {
      await api('/api/schedule/ta/office-hours', { method: 'POST', body: { day, hour } });
      flash('Booked.', 'ok');
      fetchState();
    } catch (err) {
      flash(err.message);
      fetchState();
    }
  };
  const removeHour = async (id) => {
    try {
      await api('/api/schedule/ta/office-hours', { method: 'DELETE', body: { id } });
      flash('Removed.', 'ok');
      fetchState();
    } catch (err) {
      flash(err.message);
      fetchState();
    }
  };
  const bookSeat = async (slotId) => {
    try {
      await api('/api/schedule/ta/tutorial-seat', { method: 'POST', body: { slotId } });
      flash('Seat picked.', 'ok');
      fetchState();
    } catch (err) {
      flash(err.message);
      fetchState();
    }
  };
  const leaveSeat = async () => {
    try {
      await api('/api/schedule/ta/tutorial-seat', { method: 'DELETE' });
      flash('Seat freed.', 'ok');
      fetchState();
    } catch (err) {
      flash(err.message);
      fetchState();
    }
  };

  if (!data) {
    return (
      <>
        <Navbar activePage="courses" />
        <div style={{ padding: 'calc(var(--nav-h) + 80px) 24px', textAlign: 'center', color: 'var(--text3)' }}>
          {loadError || 'Loading schedule…'}
        </div>
        <Footer />
      </>
    );
  }

  const { settings, fixedEvents, tutorialSlots, taOfficeHours } = data;
  const { startHour, endHour } = settings;
  const hours = [];
  for (let h = startHour; h < endHour; h++) hours.push(h);
  const gridH = (endHour - startHour) * 60 * PX_PER_MIN;
  const myTaId = me.ta?.id;
  const myHourCount = myTaId ? taOfficeHours.filter((o) => o.taId === myTaId).length : 0;
  const myHeldSlot = myTaId ? tutorialSlots.find((s) => s.seats.some((seat) => seat?.taId === myTaId)) : null;

  return (
    <>
      <style>{`
        .sched-wrap { max-width: 1180px; margin: 0 auto; padding: 0 24px 72px; }
        .sched-hero { padding: calc(var(--nav-h) + 3px + 34px) 24px 28px; border-bottom: 1px solid var(--border);
                      background: linear-gradient(135deg, var(--bg) 0%, var(--bg2) 100%); }
        .sched-hero-inner { max-width: 1180px; margin: 0 auto; }
        .sched-panel { border: 1px solid var(--border); border-radius: var(--radius); background: var(--surface);
                       padding: 16px 18px; margin-bottom: 18px; }
        .sched-cell-btn { font-family: var(--fm); font-size: .62rem; letter-spacing: .04em; border-radius: 5px;
                           padding: 3px 8px; cursor: pointer; border: 1px solid; background: transparent; }
        @media (max-width: 820px) { .sched-hero h1 { font-size: clamp(1.5rem, 7vw, 2rem) !important; } }
      `}</style>

      <Navbar activePage="courses" />

      <div className="sched-hero">
        <div className="sched-hero-inner">
          <span className="eyebrow">MATH 101 · Calculus I (Non-SSE) · Fall 2026</span>
          <h1 style={{ fontSize: 'clamp(1.8rem,4vw,2.6rem)', margin: '6px 0 8px' }}>
            Scheduling for course <em style={{ color: 'var(--amber)', fontStyle: 'italic' }}>MATH 101 Calculus-1 (Non-SSE) FA26</em>
          </h1>
          <p style={{ maxWidth: '640px', color: 'var(--text2)', fontSize: '.98rem', margin: 0 }}>
            Live weekly grid — lectures, office hours, and recitations are set by the instructor.
            TAs pick their own tutorial seat and office-hour blocks below; everyone sees updates within a few seconds.
          </p>
          <div style={{ marginTop: '14px' }}>
            <Link href="/courses/calc1-fa26/schedule/admin" style={{ fontFamily: 'var(--fm)', fontSize: '.68rem', color: 'var(--text3)', textDecoration: 'underline' }}>
              Instructor admin panel →
            </Link>
          </div>
        </div>
      </div>

      <div className="sched-wrap">
        {/* TA session box */}
        <div className="sched-panel" style={{ marginTop: '24px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px' }}>
          {!me.ta ? (
            <form onSubmit={taLogin} style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--fm)', fontSize: '.72rem', color: 'var(--text2)' }}>TAs — enter your passcode to pick seats/hours:</span>
              <input
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Passcode"
                style={{ padding: '7px 10px', borderRadius: '7px', border: '1px solid var(--border2)', background: 'var(--bg2)', color: 'var(--text)', fontFamily: 'var(--fm)', fontSize: '.8rem', width: '140px' }}
              />
              <button className="btn" type="submit" disabled={loginBusy || !passcode} style={{ padding: '7px 16px', fontSize: '.75rem' }}>
                {loginBusy ? 'Checking…' : 'Sign in'}
              </button>
              {loginError && <span style={{ color: 'var(--rose)', fontSize: '.76rem' }}>{loginError}</span>}
            </form>
          ) : (
            <>
              <span style={{ fontFamily: 'var(--fh)', fontSize: '1.05rem', color: 'var(--text)' }}>Signed in as {me.ta.name}</span>
              <span style={{ fontFamily: 'var(--fm)', fontSize: '.72rem', color: myHourCount >= 4 ? 'var(--amber)' : 'var(--text3)', border: '1px solid var(--border2)', borderRadius: '20px', padding: '3px 12px' }}>
                {myHourCount} of 4 office hours booked
              </span>
              <span style={{ fontFamily: 'var(--fm)', fontSize: '.72rem', color: 'var(--text3)' }}>
                {myHeldSlot ? `Holding tutorial slot: ${DAY_LABELS[myHeldSlot.day]} ${fmtHour(myHeldSlot.start)}` : 'No tutorial slot yet'}
              </span>
              <button onClick={taLogout} style={{ marginLeft: 'auto', fontFamily: 'var(--fm)', fontSize: '.7rem', color: 'var(--text3)', background: 'none', border: '1px solid var(--border2)', borderRadius: '7px', padding: '6px 12px', cursor: 'pointer' }}>
                Sign out
              </button>
            </>
          )}
        </div>

        {actionMsg && (
          <div style={{ marginBottom: '14px', padding: '9px 14px', borderRadius: '8px', fontSize: '.82rem', fontFamily: 'var(--fm)',
                        background: actionMsg.tone === 'ok' ? 'rgba(56,201,176,.12)' : 'rgba(224,107,107,.12)',
                        border: `1px solid ${actionMsg.tone === 'ok' ? 'var(--teal)' : 'var(--rose)'}`,
                        color: actionMsg.tone === 'ok' ? 'var(--teal)' : 'var(--rose)' }}>
            {actionMsg.text}
          </div>
        )}
        {loadError && <div style={{ marginBottom: '14px', fontSize: '.78rem', color: 'var(--text3)' }}>{loadError}</div>}

        {/* LEGEND */}
        <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap', marginBottom: '10px', fontSize: '.78rem' }}>
          {CATEGORY_ORDER.map(([k, label]) => (
            <span key={k} style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', color: 'var(--text2)' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: COLORS[k].bg, border: `1px solid ${COLORS[k].bd}` }} />
              {label}
            </span>
          ))}
        </div>

        {/* MAIN GRID */}
        <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden', background: 'var(--surface)', marginBottom: '24px' }}>
          <div style={{ overflowX: 'auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: `64px repeat(${DAY_LABELS.length}, minmax(150px, 1fr))`, minWidth: '760px' }}>
              <div style={{ borderBottom: '1px solid var(--border)' }} />
              {DAY_LABELS.map((d) => (
                <div key={d} style={{ padding: '10px 8px', textAlign: 'center', fontFamily: 'var(--fm)', fontSize: '.72rem', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--text2)', borderBottom: '1px solid var(--border)', borderLeft: '1px solid var(--border)' }}>{d}</div>
              ))}
              <div style={{ position: 'relative', height: `${gridH}px` }}>
                {hours.map((h) => (
                  <div key={h} style={{ position: 'absolute', top: `${(h - startHour) * 60 * PX_PER_MIN}px`, right: '8px', fontFamily: 'var(--fm)', fontSize: '.64rem', color: 'var(--text3)', transform: 'translateY(-50%)' }}>{fmtHour(h)}</div>
                ))}
              </div>
              {DAY_LABELS.map((_, di) => {
                const items = [
                  ...fixedEvents.filter((e) => e.day === di).map((e) => ({ ...e, kind: 'fixed' })),
                  ...tutorialSlots.filter((s) => s.day === di).map((s) => ({ ...s, kind: 'tutorial' })),
                  ...taOfficeHours.filter((o) => o.day === di).map((o) => ({ ...o, start: o.hour, end: o.hour + 1, kind: 'ta_oh' })),
                ];
                const laid = layoutDay(items);
                return (
                  <div key={di} style={{ position: 'relative', height: `${gridH}px`, borderLeft: '1px solid var(--border)' }}>
                    {hours.map((h) => (
                      <div key={h} style={{ position: 'absolute', top: `${(h - startHour) * 60 * PX_PER_MIN}px`, left: 0, right: 0, borderTop: '1px solid var(--border)', opacity: .5 }} />
                    ))}
                    {laid.map((item) => {
                      const top = (item.start - startHour) * 60 * PX_PER_MIN;
                      const hgt = (item.end - item.start) * 60 * PX_PER_MIN;
                      const left = item.overlapping ? (item.lane === 0 ? '2%' : '51%') : '2%';
                      const width = item.overlapping ? '47%' : '96%';
                      const c = item.kind === 'fixed' ? COLORS[item.category] : item.kind === 'tutorial' ? COLORS.tutorial : COLORS.ta_oh;
                      const key = `${item.kind}-${item.id}`;

                      let body;
                      if (item.kind === 'fixed') {
                        body = (
                          <>
                            <div style={{ fontSize: '.72rem', fontWeight: 600, color: 'var(--text)', lineHeight: 1.2 }}>{item.title}</div>
                            {item.person && <div style={{ fontFamily: 'var(--fm)', fontSize: '.6rem', color: 'var(--text2)', marginTop: '2px' }}>{item.person}</div>}
                            <div style={{ fontFamily: 'var(--fm)', fontSize: '.58rem', color: 'var(--text3)' }}>{fmtHour(item.start)}–{fmtHour(item.end)}{item.location ? ` · ${item.location}` : ''}</div>
                          </>
                        );
                      } else if (item.kind === 'tutorial') {
                        const iHoldOther = myHeldSlot && myHeldSlot.id !== item.id;
                        body = (
                          <>
                            <div style={{ fontSize: '.7rem', fontWeight: 600, color: 'var(--text)' }}>Tutorial</div>
                            <div style={{ fontFamily: 'var(--fm)', fontSize: '.58rem', color: 'var(--text3)', marginBottom: '3px' }}>{fmtHour(item.start)}–{fmtHour(item.end)}{item.location ? ` · ${item.location}` : ''}</div>
                            {item.seats.map((seat, i) => (
                              <div key={i} style={{ fontSize: '.62rem', color: 'var(--text2)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '1px' }}>
                                {seat ? (
                                  <>
                                    <span>{seat.taName}</span>
                                    {myTaId === seat.taId && (
                                      <button onClick={leaveSeat} className="sched-cell-btn" style={{ borderColor: 'var(--rose)', color: 'var(--rose)' }}>leave</button>
                                    )}
                                  </>
                                ) : myTaId && !iHoldOther ? (
                                  <button onClick={() => bookSeat(item.id)} className="sched-cell-btn" style={{ borderColor: 'var(--teal)', color: 'var(--teal)' }}>pick seat</button>
                                ) : (
                                  <span style={{ opacity: .5 }}>open</span>
                                )}
                              </div>
                            ))}
                          </>
                        );
                      } else {
                        body = (
                          <>
                            <div style={{ fontSize: '.68rem', fontWeight: 600, color: 'var(--text)' }}>{item.taName}</div>
                            <div style={{ fontFamily: 'var(--fm)', fontSize: '.58rem', color: 'var(--text3)' }}>{fmtHour(item.start)}–{fmtHour(item.end)} OH</div>
                            {myTaId === item.taId && (
                              <button onClick={() => removeHour(item.id)} className="sched-cell-btn" style={{ marginTop: '3px', borderColor: 'var(--rose)', color: 'var(--rose)' }}>remove</button>
                            )}
                          </>
                        );
                      }

                      return (
                        <div key={key} style={{ position: 'absolute', top: `${top}px`, height: `${hgt}px`, left, width, background: c.bg, borderLeft: `3px solid ${c.bd}`, borderRadius: '5px', padding: '4px 6px', overflow: 'hidden' }}>
                          {body}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* OFFICE-HOUR BOOKING WIDGET */}
        {me.ta && (
          <div className="sched-panel">
            <h4 style={{ fontFamily: 'var(--fm)', fontSize: '.7rem', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--text3)', margin: '0 0 12px' }}>
              Book your office hours — any pattern, up to 4 hours/week
            </h4>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: '520px' }}>
                <thead>
                  <tr>
                    <th style={{ width: '56px' }} />
                    {DAY_LABELS.map((d) => (
                      <th key={d} style={{ fontFamily: 'var(--fm)', fontSize: '.64rem', color: 'var(--text3)', padding: '4px' }}>{d}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {hours.map((h) => (
                    <tr key={h}>
                      <td style={{ fontFamily: 'var(--fm)', fontSize: '.62rem', color: 'var(--text3)', textAlign: 'right', paddingRight: '8px' }}>{fmtHour(h)}</td>
                      {DAY_LABELS.map((_, di) => {
                        const count = [
                          ...fixedEvents.filter((e) => e.day === di),
                          ...tutorialSlots.filter((s) => s.day === di),
                        ].filter((e) => covers(e, h)).length
                          + taOfficeHours.filter((o) => o.day === di && o.hour === h).length;
                        const mine = taOfficeHours.find((o) => o.day === di && o.hour === h && o.taId === myTaId);
                        const full = count >= 2 && !mine;
                        const atCap = myHourCount >= 4 && !mine;
                        let label = 'book', disabled = false, tone = 'var(--teal)';
                        if (mine) { label = '✕ yours'; tone = 'var(--rose)'; }
                        else if (full) { label = 'full'; disabled = true; tone = 'var(--text3)'; }
                        else if (atCap) { label = '4/4 used'; disabled = true; tone = 'var(--text3)'; }
                        return (
                          <td key={di} style={{ padding: '2px', textAlign: 'center' }}>
                            <button
                              disabled={disabled}
                              onClick={() => (mine ? removeHour(mine.id) : bookHour(di, h))}
                              className="sched-cell-btn"
                              style={{ width: '100%', borderColor: tone, color: tone, opacity: disabled ? .5 : 1, cursor: disabled ? 'not-allowed' : 'pointer' }}
                            >
                              {label}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}
