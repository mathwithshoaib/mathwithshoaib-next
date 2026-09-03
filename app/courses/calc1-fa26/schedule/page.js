'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { DAY_LABELS, TA_OH_WINDOW, TA_OH_SLOT_MINUTES, TA_OH_WEEKLY_CAP_HOURS } from '../../../../lib/scheduleConfig';

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
const SITE_OWNER_NAME = 'Muhammad Shoaib Khan';

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

// Do two real (not hour-bucket) intervals overlap?
function trueOverlap(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && bStart < aEnd;
}

// Mirrors would_exceed_cap() in the DB (see supabase/005_...sql): would
// adding an item spanning [start,end) push simultaneous concurrency above 2
// at any actual instant — not just "touches the same hour label"? Two items
// that each brush a different edge of an hour without ever coinciding
// (e.g. one ends 9:15, the next starts 9:30) must NOT count as a conflict.
function wouldExceedCap(day, start, end, fixedEvents, tutorialSlots, taOfficeHours) {
  const items = [
    ...fixedEvents.filter((e) => e.day === day).map((e) => ({ s: e.start, e: e.end })),
    ...tutorialSlots.filter((s) => s.day === day).map((s) => ({ s: s.start, e: s.end })),
    ...taOfficeHours.filter((o) => o.day === day).map((o) => ({ s: o.hour, e: o.hour + 0.5 })),
  ].filter((it) => trueOverlap(it.s, it.e, start, end));

  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      const lo = Math.max(items[i].s, items[j].s, start);
      const hi = Math.min(items[i].e, items[j].e, end);
      if (lo < hi) return true; // two OTHER items already overlap each other within this window
    }
  }
  return false;
}

// A TA can hold several consecutive 30-min office-hour blocks (e.g. 2pm,
// 2:30pm, 3pm, 3:30pm — a 2hr run). Rendered separately those stack up as
// 4 skinny slivers on top of each other; merge each TA's back-to-back rows
// on a given day into one grid item spanning the full run instead, same as
// a single 2-hour booking would look. Cap-checking (wouldExceedCap, above)
// is untouched — it still reasons per 30-min row, only the display merges.
function mergeTaOfficeHours(dayOhs) {
  const byTa = new Map();
  for (const o of dayOhs) {
    if (!byTa.has(o.taId)) byTa.set(o.taId, []);
    byTa.get(o.taId).push(o);
  }
  const merged = [];
  for (const ohs of byTa.values()) {
    const sorted = [...ohs].sort((a, b) => a.hour - b.hour);
    let run = null;
    for (const o of sorted) {
      if (run && Math.abs(o.hour - run.end) < 1e-6) {
        run.end = o.hour + 0.5;
        run.ids.push(o.id);
      } else {
        if (run) merged.push(run);
        run = { ...o, start: o.hour, end: o.hour + 0.5, kind: 'ta_oh', ids: [o.id] };
      }
    }
    if (run) merged.push(run);
  }
  return merged;
}

// Groups one TA's own office-hour rows into readable day+range runs across
// the whole week (e.g. "Mon 2pm-4pm, Fri 1:30pm-3:30pm") for the "Your
// schedule" summary card — reuses mergeTaOfficeHours per day so the runs
// match exactly what's shown on the grid itself.
function myScheduleRuns(taOfficeHours, taId) {
  const mine = taOfficeHours.filter((o) => o.taId === taId);
  const byDay = new Map();
  for (const o of mine) {
    if (!byDay.has(o.day)) byDay.set(o.day, []);
    byDay.get(o.day).push(o);
  }
  const runs = [];
  for (const [day, ohs] of byDay) {
    for (const m of mergeTaOfficeHours(ohs)) runs.push({ day, start: m.start, end: m.end });
  }
  return runs.sort((a, b) => a.day - b.day || a.start - b.start);
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
  const printStyleRef = useRef(null);
  const originalTitleRef = useRef('');

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

  // Restore the real tab title once the print/save-as-PDF dialog closes
  // (downloadPdf() below swaps it to a nicer suggested filename first).
  useEffect(() => {
    originalTitleRef.current = document.title;
    const restore = () => { document.title = originalTitleRef.current; };
    window.addEventListener('afterprint', restore);
    return () => window.removeEventListener('afterprint', restore);
  }, []);

  const taLogin = async (e) => {
    e.preventDefault();
    setLoginBusy(true); setLoginError('');
    try {
      const json = await api('/api/schedule/ta/login', { method: 'POST', body: { passcode } });
      setMe((m) => ({ ...m, ta: { id: json.taId, name: json.name, officeHoursOnly: json.officeHoursOnly } }));
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
  // Frees a whole run of merged consecutive blocks (see mergeTaOfficeHours) at once.
  const removeHours = async (ids) => {
    try {
      await Promise.all(ids.map((id) => api('/api/schedule/ta/office-hours', { method: 'DELETE', body: { id } })));
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

  const { settings, fixedEvents, tutorialSlots, taOfficeHours, tutorialVenues } = data;
  const { startHour, endHour } = settings;
  const hours = [];
  for (let h = startHour; h < endHour; h++) hours.push(h);
  const gridH = (endHour - startHour) * 60 * PX_PER_MIN;
  const myTaId = me.ta?.id;
  const myHourCount = myTaId ? taOfficeHours.filter((o) => o.taId === myTaId).length * (TA_OH_SLOT_MINUTES / 60) : 0;
  const myCap = me.ta?.ohCapHours ?? TA_OH_WEEKLY_CAP_HOURS;
  const myHeldSlot = myTaId ? tutorialSlots.find((s) => s.seats.some((seat) => seat?.taId === myTaId)) : null;
  const myOhRuns = myTaId ? myScheduleRuns(taOfficeHours, myTaId) : [];
  const ohSlots = [];
  for (let t = TA_OH_WINDOW.start; t < TA_OH_WINDOW.end; t += TA_OH_SLOT_MINUTES / 60) ohSlots.push(t);

  // Print/PDF: shrink the exact same on-screen calendar (via CSS `zoom`, which —
  // unlike `transform: scale` — actually reflows layout, so the page-fit
  // calculation below is correct) instead of rebuilding it as a table. That
  // keeps every block's real position, so overlapping-but-not-simultaneous
  // items (e.g. two lectures 15 minutes apart) still read correctly on paper.
  // Zoom is computed from the actual configured hour range + known chrome
  // heights, with a safety margin, so it stays correct if the admin changes
  // the grid's hour range later.
  const downloadPdf = (orientation) => {
    const gridPx = 36 + gridH; // day-header row (~36px) + the hour body
    const landscape = Math.max(0.4, Math.min(0.85, (734 - 170) / gridPx));
    const portrait = Math.max(0.4, Math.min(0.9, 734 / 780, (996 - 150) / gridPx));
    const zoom = orientation === 'landscape' ? landscape : portrait;

    if (printStyleRef.current) {
      printStyleRef.current.textContent = `
        @page { size: ${orientation}; margin: 8mm; }
        @media print { .sched-print-zoom { zoom: ${zoom}; } }
      `;
    }
    document.title = `MATH101-FA26-Schedule-${orientation}`;
    window.print();
  };

  return (
    <>
      <style>{`
        .sched-wrap { max-width: 1600px; margin: 0 auto; padding: 0 24px 72px; }
        .sched-hero { padding: calc(var(--nav-h) + 3px + 34px) 24px 28px; border-bottom: 1px solid var(--border);
                      background: linear-gradient(135deg, var(--bg) 0%, var(--bg2) 100%); }
        .sched-hero-inner { max-width: 1600px; margin: 0 auto; }
        .sched-panel { border: 1px solid var(--border); border-radius: var(--radius); background: var(--surface);
                       padding: 16px 18px; margin-bottom: 18px; }
        .sched-cell-btn { font-family: var(--fm); font-size: .62rem; letter-spacing: .04em; border-radius: 5px;
                           padding: 3px 8px; cursor: pointer; border: 1px solid; background: transparent; }
        .print-only { display: none; }
        .sched-cols { display: grid; grid-template-columns: 1fr 300px; gap: 24px; align-items: start; }
        .sched-grid-scroll, .sched-oh-scroll { -webkit-overflow-scrolling: touch; }
        @media (max-width: 900px) {
          .sched-hero h1 { font-size: clamp(1.5rem, 7vw, 2rem) !important; }
          .sched-cols { grid-template-columns: 1fr; }
          .sched-side { position: static !important; } /* sticky is pointless once stacked below main */
        }

        /* ── MOBILE (phone) ──
           Desktop styling above is untouched; these only kick in narrow. */
        @media (max-width: 680px) {
          .sched-top-row .sched-panel { flex-basis: 100% !important; }
          /* iOS Safari auto-zooms the page when a tapped input's font is under 16px */
          .sched-panel input, .sched-panel select { font-size: 16px !important; }
          /* bigger touch targets for pick/leave/remove/book buttons */
          .sched-cell-btn { padding: 7px 11px !important; font-size: .72rem !important; min-height: 32px; }
          .sched-legend { gap: 12px !important; font-size: .72rem !important; }
        }

        .sched-print-footer { display: none; }

        /* ── PDF / PRINT ──
           Redefining the theme's CSS variables for print is what makes every
           inline style on this page (they all read var(--text), var(--bg), …)
           switch from "light text on dark" to "dark text on white" for free —
           no need to touch each inline style individually. The real calendar
           (not a rebuilt table) is what prints — the .sched-print-zoom class's
           zoom level is computed and injected per click in downloadPdf() so it's
           shrunk to fit one page while keeping every block's exact time
           position, instead of losing precision to a compact table. */
        @media print {
          :root {
            --bg: #fff !important; --bg2: #fff !important; --bg3: #fff !important;
            --surface: #fff !important; --surface2: #fff !important;
            --text: #111 !important; --text2: #333 !important; --text3: #555 !important;
            --border: #ccc !important; --border2: #999 !important;
          }
          * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          .sched-hero { padding: 4px 0 10px !important; border-bottom: none !important; }
          .sched-wrap { padding: 0 0 20px !important; }

          /* decorative gradient bar under the title */
          .sched-print-band { height: 6px; border-radius: 4px; margin: 0 0 14px;
            background: linear-gradient(90deg, #c9860a, #1f9c85, #7c5fd6, #cf4f4f, #3068b8); }

          /* legend, recolored to a bolder print-safe palette + enlarged */
          .sched-legend { gap: 18px !important; margin-bottom: 10px !important; }
          .sched-legend span { font-size: 11.5px !important; font-weight: 600; }
          .legend-swatch { width: 15px !important; height: 15px !important; border-radius: 4px !important; border-width: 2px !important; }
          .legend-lecture       { background: #fdf0d9 !important; border-color: #c9860a !important; }
          .legend-instructor_oh { background: #efeafc !important; border-color: #7c5fd6 !important; }
          .legend-recitation    { background: #fbe9e9 !important; border-color: #cf4f4f !important; }
          .legend-tutorial      { background: #e3f8f2 !important; border-color: #1f9c85 !important; }
          .legend-ta_oh         { background: #e8f1fd !important; border-color: #3068b8 !important; }

          /* the calendar itself — visible, un-clipped, un-scrolled; zoom level set inline per print */
          .sched-grid-scroll { overflow: visible !important; }
          .sched-cell-btn { display: none !important; }

          .sched-print-footer {
            display: flex !important; justify-content: space-between; gap: 10px;
            position: fixed; bottom: 0; left: 0; right: 0;
            font-family: var(--fm); font-size: 9px; color: #666;
            padding: 6px 0; border-top: 1px solid #ccc;
          }
        }
      `}</style>
      {/* Mutated right before window.print() to set the chosen page orientation. */}
      <style ref={printStyleRef} />

      <div className="no-print"><Navbar activePage="courses" /></div>

      <div className="sched-hero">
        <div className="sched-hero-inner">
          <span className="eyebrow no-print">MATH 101 · Calculus I (Non-SSE) · Fall 2026</span>
          <span className="print-only" style={{ display: 'inline-block', marginBottom: '8px', padding: '4px 14px', borderRadius: '20px', background: '#fdf0d9', border: '1.5px solid #c9860a', fontFamily: 'var(--fm)', fontSize: '10px', letterSpacing: '.1em', textTransform: 'uppercase', color: '#8a5c0a' }}>
            MATH 101 · Non-SSE · Fall 2026
          </span>
          <h1 style={{ fontSize: 'clamp(1.8rem,4vw,2.6rem)', margin: '6px 0 8px' }}>
            Scheduling for course <em style={{ color: 'var(--amber)', fontStyle: 'italic' }}>MATH 101 Calculus-1 (Non-SSE) FA26</em>
          </h1>
          <p className="no-print" style={{ maxWidth: '640px', color: 'var(--text2)', fontSize: '.98rem', margin: 0 }}>
            Live weekly grid — lectures, office hours, and recitations are set by the instructor.
            TAs pick their own tutorial seat and office-hour blocks below; everyone sees updates within a few seconds.
          </p>
          <div className="print-only sched-print-band" />
          <div className="no-print" style={{ marginTop: '14px', display: 'flex', gap: '18px', flexWrap: 'wrap' }}>
            <Link href="/courses/calc1-fa26" style={{ fontFamily: 'var(--fm)', fontSize: '.68rem', color: 'var(--text3)', textDecoration: 'underline' }}>
              ← Course home
            </Link>
            <Link href="/courses/calc1-fa26/schedule/admin" style={{ fontFamily: 'var(--fm)', fontSize: '.68rem', color: 'var(--text3)', textDecoration: 'underline' }}>
              Instructor admin panel →
            </Link>
          </div>
        </div>
      </div>

      <div className="sched-wrap">
        {/* Full-width top row: TA sign-in (grows) + PDF download buttons */}
        <div className="no-print sched-top-row" style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', margin: '24px 0 14px', alignItems: 'stretch' }}>
          <div className="sched-panel" style={{ flex: '1 1 420px', margin: 0, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px' }}>
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
                <span style={{ fontFamily: 'var(--fm)', fontSize: '.72rem', color: myHourCount >= myCap ? 'var(--amber)' : 'var(--text3)', border: '1px solid var(--border2)', borderRadius: '20px', padding: '3px 12px' }}>
                  {myHourCount} of {myCap} office hours booked
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

          <div className="sched-panel" style={{ margin: 0, display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => downloadPdf('portrait')} className="btn btn-outline" style={{ padding: '8px 18px', fontSize: '.75rem' }}>
              📄 Download PDF — Portrait
            </button>
            <button onClick={() => downloadPdf('landscape')} className="btn btn-outline" style={{ padding: '8px 18px', fontSize: '.75rem' }}>
              📄 Download PDF — Landscape
            </button>
          </div>
        </div>

        {/* "Your schedule" — once signed in, the TA's own booked slot/hours are
            pulled out into a plain summary, since once everyone's picked
            something the grid itself gets crowded and hard to scan for your own. */}
        {me.ta && (
          <div className="no-print sched-panel" style={{ margin: '0 0 14px', border: '1px solid var(--amber)', background: 'rgba(232,160,32,.08)' }}>
            <h4 style={{ fontFamily: 'var(--fm)', fontSize: '.7rem', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--amber)', margin: '0 0 8px' }}>
              📌 Your schedule
            </h4>
            <div style={{ fontSize: '.85rem', color: 'var(--text)', marginBottom: '4px' }}>
              <b>Tutorial slot:</b>{' '}
              {myHeldSlot
                ? `${DAY_LABELS[myHeldSlot.day]} ${fmtHour(myHeldSlot.start)}–${fmtHour(myHeldSlot.end)}${myHeldSlot.location ? ` · ${myHeldSlot.location}` : ''}`
                : me.ta.officeHoursOnly ? 'Not assigned — you\'re office hours only' : 'None yet — pick an open seat below'}
            </div>
            <div style={{ fontSize: '.85rem', color: 'var(--text)' }}>
              <b>Office hours:</b>{' '}
              {myOhRuns.length ? myOhRuns.map((r) => `${DAY_LABELS[r.day]} ${fmtHour(r.start)}–${fmtHour(r.end)}`).join(', ') : 'None booked yet'}
            </div>
          </div>
        )}

        {actionMsg && (
          <div className="no-print" style={{ marginBottom: '14px', padding: '9px 14px', borderRadius: '8px', fontSize: '.82rem', fontFamily: 'var(--fm)',
                        background: actionMsg.tone === 'ok' ? 'rgba(56,201,176,.12)' : 'rgba(224,107,107,.12)',
                        border: `1px solid ${actionMsg.tone === 'ok' ? 'var(--teal)' : 'var(--rose)'}`,
                        color: actionMsg.tone === 'ok' ? 'var(--teal)' : 'var(--rose)' }}>
            {actionMsg.text}
          </div>
        )}
        {loadError && <div className="no-print" style={{ marginBottom: '14px', fontSize: '.78rem', color: 'var(--text3)' }}>{loadError}</div>}

        {/* LEGEND — full width, above the two-column split */}
        <div className="sched-legend" style={{ display: 'flex', gap: '18px', flexWrap: 'wrap', marginBottom: '14px', fontSize: '.78rem' }}>
          {CATEGORY_ORDER.map(([k, label]) => (
            <span key={k} style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', color: 'var(--text2)' }}>
              <span className={`legend-swatch legend-${k}`} style={{ width: '12px', height: '12px', borderRadius: '3px', background: COLORS[k].bg, border: `1px solid ${COLORS[k].bd}` }} />
              {label}
            </span>
          ))}
        </div>

      <div className="sched-cols">
      <div className="sched-main">

        {/* MAIN GRID — same block for screen and print (shrunk to fit via CSS zoom for PDF export) */}
        <div className="sched-print-zoom" style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden', background: 'var(--surface)', marginBottom: '24px' }}>
          <div className="sched-grid-scroll" style={{ overflowX: 'auto' }}>
            <div className="sched-grid-inner" style={{ display: 'grid', gridTemplateColumns: `64px repeat(${DAY_LABELS.length}, minmax(150px, 1fr))`, minWidth: '760px' }}>
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
                  ...mergeTaOfficeHours(taOfficeHours.filter((o) => o.day === di)),
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
                      // Highlight the signed-in TA's own tutorial seat / office-hour
                      // block so it's easy to spot once the grid fills up with
                      // everyone else's bookings too.
                      const isMine = item.kind === 'tutorial'
                        ? item.seats.some((s) => s?.taId === myTaId)
                        : item.kind === 'ta_oh' ? item.taId === myTaId : false;

                      if (item.kind === 'fixed') {
                        body = (
                          <>
                            <div title={item.title} style={{ fontSize: '.72rem', fontWeight: 600, color: 'var(--text)', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</div>
                            {item.person && <div title={item.person} style={{ fontFamily: 'var(--fm)', fontSize: '.6rem', color: 'var(--text2)', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.person}</div>}
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
                              <div key={i} style={{ fontSize: '.62rem', color: 'var(--text2)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '1px', minWidth: 0 }}>
                                {seat ? (
                                  <>
                                    <span title={seat.taName} style={{ flex: '1 1 auto', minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{seat.taName}</span>
                                    {myTaId === seat.taId && (
                                      <button onClick={leaveSeat} className="sched-cell-btn" style={{ flex: '0 0 auto', borderColor: 'var(--rose)', color: 'var(--rose)' }}>leave</button>
                                    )}
                                  </>
                                ) : myTaId && !iHoldOther && !me.ta?.officeHoursOnly ? (
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
                            <div title={item.taName} style={{ fontSize: '.68rem', fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.taName}</div>
                            <div style={{ fontFamily: 'var(--fm)', fontSize: '.58rem', color: 'var(--text3)' }}>{fmtHour(item.start)}–{fmtHour(item.end)} OH</div>
                            {myTaId === item.taId && (
                              <button onClick={() => removeHours(item.ids)} className="sched-cell-btn" style={{ marginTop: '3px', borderColor: 'var(--rose)', color: 'var(--rose)' }}>remove</button>
                            )}
                          </>
                        );
                      }

                      return (
                        <div
                          key={key}
                          style={{
                            position: 'absolute', top: `${top}px`, height: `${hgt}px`, left, width,
                            background: c.bg, borderLeft: `3px solid ${c.bd}`, borderRadius: '5px', padding: '4px 6px', overflow: 'hidden',
                            boxShadow: isMine ? '0 0 0 2px var(--amber)' : 'none',
                            zIndex: isMine ? 2 : 1,
                          }}
                        >
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
          <div className="no-print sched-panel">
            <h4 style={{ fontFamily: 'var(--fm)', fontSize: '.7rem', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--text3)', margin: '0 0 12px' }}>
              Book your office hours — any pattern, up to {myCap} hours/week, 30-min blocks, {fmtHour(TA_OH_WINDOW.start)}–{fmtHour(TA_OH_WINDOW.end)}
            </h4>
            <div className="sched-oh-scroll" style={{ overflowX: 'auto' }}>
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
                  {ohSlots.map((h) => (
                    <tr key={h}>
                      <td style={{ fontFamily: 'var(--fm)', fontSize: '.62rem', color: 'var(--text3)', textAlign: 'right', paddingRight: '8px' }}>{fmtHour(h)}</td>
                      {DAY_LABELS.map((_, di) => {
                        const mine = taOfficeHours.find((o) => o.day === di && o.hour === h && o.taId === myTaId);
                        const full = !mine && wouldExceedCap(di, h, h + 0.5, fixedEvents, tutorialSlots, taOfficeHours);
                        const atCap = myHourCount >= myCap && !mine;
                        let label = 'book', disabled = false, tone = 'var(--teal)';
                        if (mine) { label = '✕ yours'; tone = 'var(--rose)'; }
                        else if (full) { label = 'full'; disabled = true; tone = 'var(--text3)'; }
                        else if (atCap) { label = `${myCap}/${myCap} used`; disabled = true; tone = 'var(--text3)'; }
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

      <div className="sched-side">
        <TutorialVenueCard tutorialSlots={tutorialSlots} tutorialVenues={tutorialVenues} />
      </div>
      </div>
      </div>

      <div className="print-only sched-print-footer">
        <span>Printed {new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        <span>{SITE_OWNER_NAME}</span>
        <span>{typeof window !== 'undefined' ? window.location.host + window.location.pathname : ''}</span>
      </div>

      <div className="no-print"><Footer /></div>
    </>
  );
}

// Vertical "today's tutorial venue" card for the sidebar — sourced from the
// per-date booking sheet (tutorial_slot_venues), not the recurring weekly
// slots, since the actual room changes date to date all semester.
function TutorialVenueCard({ tutorialSlots, tutorialVenues }) {
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  const todayDay = (now.getDay() + 6) % 7; // JS Sun=0..Sat=6 -> Mon=0..Sun=6

  const dateLabel = (iso) => new Date(`${iso}T00:00:00`).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });

  const todaySlots = tutorialSlots.filter((s) => s.day === todayDay).sort((a, b) => a.start - b.start);
  const todayEntries = todaySlots.map((slot, i) => ({
    slot,
    label: i === 0 ? 'Tutorial 1' : 'Tutorial 2',
    venue: tutorialVenues.find((v) => v.slotId === slot.id && v.date === todayStr) || null,
  }));

  const upcoming = tutorialVenues
    .filter((v) => v.date > todayStr && v.hasSession)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 10)
    .map((venue) => ({ venue, slot: tutorialSlots.find((s) => s.id === venue.slotId) }))
    .filter((x) => x.slot);

  return (
    <div className="no-print sched-panel" style={{ position: 'sticky', top: 'calc(var(--nav-h) + 20px)' }}>
      <h4 style={{ fontFamily: 'var(--fm)', fontSize: '.7rem', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--text3)', margin: '0 0 4px' }}>
        📍 Tutorial Venue
      </h4>
      <div style={{ fontFamily: 'var(--fm)', fontSize: '.68rem', color: 'var(--text3)', marginBottom: '12px' }}>
        {now.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
      </div>

      {todayEntries.length === 0 ? (
        <div style={{ fontSize: '.85rem', color: 'var(--text2)', marginBottom: '4px' }}>No tutorial today.</div>
      ) : (
        todayEntries.map(({ slot, label, venue }) => {
          const noSession = venue && !venue.hasSession;
          const tone = noSession ? 'var(--rose)' : 'var(--teal)';
          const bg = noSession ? 'rgba(224,107,107,.10)' : 'rgba(56,201,176,.10)';
          return (
            <div key={slot.id} style={{ padding: '10px 12px', borderRadius: '8px', background: bg, border: `1px solid ${tone}`, marginBottom: '8px' }}>
              <div style={{ fontFamily: 'var(--fm)', fontSize: '.62rem', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.06em' }}>
                {label} · {fmtHour(slot.start)}–{fmtHour(slot.end)}
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)', marginTop: '2px' }}>
                {!venue ? 'Venue TBA' : noSession ? 'No session' : venue.venue || 'Venue TBA'}
              </div>
              {venue?.notes && <div style={{ fontSize: '.68rem', color: 'var(--text3)', marginTop: '4px' }}>{venue.notes}</div>}
            </div>
          );
        })
      )}

      {upcoming.length > 0 && (
        <>
          <div style={{ fontFamily: 'var(--fm)', fontSize: '.62rem', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.08em', margin: '14px 0 8px' }}>
            Coming up
          </div>
          <div style={{ maxHeight: '260px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {upcoming.map(({ venue, slot }) => (
              <div key={venue.id} style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', fontSize: '.76rem', padding: '6px 8px', borderRadius: '6px', background: 'var(--bg2)' }}>
                <span style={{ color: 'var(--text2)' }}>{dateLabel(venue.date)} · {slot.start < 17 ? 'T1' : 'T2'}</span>
                <span style={{ color: 'var(--text)', fontWeight: 600, textAlign: 'right' }}>{venue.venue}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
