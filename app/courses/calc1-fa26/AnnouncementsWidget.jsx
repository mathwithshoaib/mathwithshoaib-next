'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ANNOUNCEMENT_URGENT_WINDOW_HOURS,
  ANNOUNCEMENT_ARCHIVE_GRACE_HOURS,
  ANNOUNCEMENTS_FEATURE_END,
} from '../../../lib/scheduleConfig';

/* ═════════════════════════════════════════════════════════════════
   Course announcements — shared by the course home page and the
   schedule page. On first load (per browser), if there's anything the
   visitor hasn't seen yet, it pops up automatically; a "seen" list is
   kept in localStorage so it won't nag on every visit — only when a
   genuinely new announcement is posted. `showButton` additionally
   renders a floating bell (bottom-right, fixed — stays put while
   scrolling, shown on mobile too) that reopens the same list on demand.

   Lifecycle of a deadline-based announcement (e.g. a Webwork due date):
     more than 48h out -> shown normally, admin's chosen type/color
     within 48h before/after the deadline -> auto-escalated to "urgent"
       (red, live countdown, e.g. "due 3h ago" once it's passed)
     more than ANNOUNCEMENT_ARCHIVE_GRACE_HOURS past the deadline
       -> moves into the collapsed "Past announcements" list at the
          bottom of the popup — out of the way, but still one click open
   Announcements with no deadline never auto-archive; the admin's own
   `active` toggle controls those.

   The whole widget (popup + bell) disables itself entirely once
   ANNOUNCEMENTS_FEATURE_END passes, since this course offering ends in
   December — no reason to keep surfacing course announcements after
   the term is over, regardless of what's still in the database.
   ═════════════════════════════════════════════════════════════════ */

const SEEN_KEY = 'c26_announcements_seen_v1';

function loadSeen() {
  try { return new Set(JSON.parse(localStorage.getItem(SEEN_KEY) || '[]')); } catch { return new Set(); }
}
function saveSeen(ids) {
  try { localStorage.setItem(SEEN_KEY, JSON.stringify(ids)); } catch { /* ignore */ }
}

// True once an announcement's deadline is more than the grace period in
// the past — that's when it slides into the collapsed archive. No
// deadline means it never auto-archives.
function isArchived(a) {
  if (!a.deadline) return false;
  const hoursSince = (Date.now() - new Date(a.deadline).getTime()) / 3600000;
  return hoursSince >= ANNOUNCEMENT_ARCHIVE_GRACE_HOURS;
}

function urgencyOf(a) {
  if (!a.deadline) return a.type;
  const hoursLeft = (new Date(a.deadline).getTime() - Date.now()) / 3600000; // positive before, negative after
  if (hoursLeft <= ANNOUNCEMENT_URGENT_WINDOW_HOURS && hoursLeft > -ANNOUNCEMENT_ARCHIVE_GRACE_HOURS) return 'urgent';
  return a.type;
}

// Shows seconds once under an hour so it visibly ticks while the popup is
// open (the widget re-renders every second while open, every 60s while
// closed — see the interval effect below).
function fmtCountdown(deadline) {
  const ms = new Date(deadline).getTime() - Date.now();
  const past = ms <= 0;
  const absSecs = Math.floor(Math.abs(ms) / 1000);
  const d = Math.floor(absSecs / 86400);
  const h = Math.floor((absSecs % 86400) / 3600);
  const m = Math.floor((absSecs % 3600) / 60);
  const s = absSecs % 60;
  const span = d > 0 ? `${d}d ${h}h` : h > 0 ? `${h}h ${m}m` : `${m}m ${s}s`;
  return past ? `Due ${span} ago` : `${span} left`;
}

function fmtPostedAt(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

const TYPE_STYLE = {
  info: { accent: 'var(--teal)', bg: 'rgba(56,201,176,.10)', label: 'Info' },
  warning: { accent: 'var(--amber)', bg: 'rgba(232,160,32,.10)', label: 'Heads up' },
  urgent: { accent: 'var(--rose)', bg: 'rgba(224,107,107,.13)', label: 'Urgent' },
};
const ARCHIVE_STYLE = { accent: 'var(--text3)', bg: 'var(--bg2)', label: 'Past' };

// Compact 2-3 line layout: a header line (type badge, title, category tag,
// New badge, pin — pin pushed flush right instead of leaving a gap), an
// optional message line, and a footer line combining the countdown and
// posted-at so short announcements don't leave a wall of empty space.
function AnnouncementCard({ a, isNew, archived }) {
  const urgency = archived ? null : urgencyOf(a);
  const style = archived ? ARCHIVE_STYLE : (TYPE_STYLE[urgency] || TYPE_STYLE.info);
  return (
    <div className="c26-announce-card" style={{ borderLeftColor: style.accent, background: style.bg, opacity: archived ? 0.75 : 1 }}>
      <div className="c26-announce-line1">
        <span className="c26-announce-type" style={{ color: style.accent }}>{style.label}</span>
        <h4>{a.title}</h4>
        {a.category && <span className="c26-announce-category">{a.category}</span>}
        {isNew && <span className="c26-announce-new">🆕 New</span>}
        {a.pinned && !archived && <span className="c26-announce-pin">📌</span>}
      </div>
      {a.message && <p>{a.message}</p>}
      <div className="c26-announce-line2">
        {a.deadline && (
          <span style={{ color: !archived && urgency === 'urgent' ? 'var(--rose)' : 'var(--text3)', fontWeight: 700 }}>
            ⏰ {fmtCountdown(a.deadline)}
          </span>
        )}
        <span className="c26-announce-posted">Posted {fmtPostedAt(a.createdAt)}</span>
      </div>
    </div>
  );
}

export default function AnnouncementsWidget({ showButton = false }) {
  const featureEnded = Date.now() >= new Date(ANNOUNCEMENTS_FEATURE_END).getTime();

  const [all, setAll] = useState([]);
  const [seatStatus, setSeatStatus] = useState(null); // { active, exam } | null while loading
  const [open, setOpen] = useState(false);
  const [showArchive, setShowArchive] = useState(false);
  const [, forceTick] = useState(0);
  // Snapshot of what was already "seen" as of this page load — stays fixed
  // for the life of the component so "New" badges don't disappear the
  // instant dismiss() writes the updated set back to localStorage.
  const [seenSnapshot] = useState(() => loadSeen());

  useEffect(() => {
    if (featureEnded) return; // course is over — don't even bother fetching
    fetch('/api/schedule/announcements')
      .then((r) => r.json())
      .then((json) => setAll(json.announcements || []))
      .catch(() => {});
    fetch('/api/schedule/exam-seating')
      .then((r) => r.json())
      .then(setSeatStatus)
      .catch(() => setSeatStatus({ active: false }));
  }, [featureEnded]);

  // Re-render every second while the popup is open (a genuinely "live"
  // ticking countdown), or every 60s while it's closed — just enough to
  // keep the fab badge / auto-urgent escalation current without wasting
  // cycles on a re-render nobody's looking at.
  useEffect(() => {
    if (featureEnded) return;
    const id = setInterval(() => forceTick((t) => t + 1), open ? 1000 : 60000);
    return () => clearInterval(id);
  }, [featureEnded, open]);

  const visible = all.filter((a) => !isArchived(a));
  const archivedOnes = all.filter((a) => isArchived(a));

  // Auto-open once per newly-seen batch — fires again only when the set of
  // visible announcement ids includes one not already in localStorage, so a
  // brand-new post reopens this even for a visitor who dismissed older ones.
  useEffect(() => {
    if (featureEnded || visible.length === 0) return;
    if (visible.some((a) => !seenSnapshot.has(a.id))) setOpen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [all, featureEnded]);

  const dismiss = () => {
    saveSeen(visible.map((a) => a.id));
    setOpen(false);
  };

  const seatingActive = !!seatStatus?.active;

  if (featureEnded || (visible.length === 0 && archivedOnes.length === 0 && !seatingActive)) return null;

  const urgentOnes = visible.filter((a) => urgencyOf(a) === 'urgent');
  const restOnes = visible.filter((a) => urgencyOf(a) !== 'urgent');

  return (
    <>
      <style>{`
        .c26-announce-fab {
          position: fixed; bottom: 24px; right: 24px; z-index: 900;
          width: 52px; height: 52px; border-radius: 50%; border: none; cursor: pointer;
          background: var(--amber); color: var(--bg); font-size: 1.3rem;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 6px 20px rgba(0,0,0,.35);
        }
        .c26-announce-badge {
          position: absolute; top: -4px; right: -4px; background: var(--rose); color: #fff;
          font-family: var(--fm); font-size: .62rem; font-weight: 700; border-radius: 10px;
          min-width: 18px; height: 18px; padding: 0 4px;
          display: flex; align-items: center; justify-content: center;
        }
        .c26-announce-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,.6); z-index: 1000;
          display: flex; align-items: center; justify-content: center; padding: 20px;
        }
        .c26-announce-modal {
          background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius);
          max-width: 520px; width: 100%; max-height: 82vh;
          display: flex; flex-direction: column; padding: 20px; gap: 14px;
        }
        .c26-announce-modal-head { display: flex; justify-content: space-between; align-items: center; }
        .c26-announce-modal-head h3 { margin: 0; font-size: 1.1rem; color: var(--text); }
        .c26-announce-modal-head button {
          background: none; border: none; color: var(--text3); font-size: 1.1rem; cursor: pointer; line-height: 1;
        }
        .c26-announce-list { overflow-y: auto; display: flex; flex-direction: column; gap: 8px; }
        .c26-announce-card { border-left: 3px solid; border-radius: 8px; padding: 9px 12px; }
        .c26-announce-line1 { display: flex; align-items: center; flex-wrap: wrap; gap: 7px; }
        .c26-announce-type { font-family: var(--fm); font-size: .62rem; letter-spacing: .08em; text-transform: uppercase; font-weight: 700; }
        .c26-announce-line1 h4 { margin: 0; font-size: .92rem; color: var(--text); font-weight: 600; }
        .c26-announce-category {
          font-family: var(--fm); font-size: .58rem; letter-spacing: .04em; text-transform: uppercase;
          color: var(--text3); border: 1px solid var(--border); border-radius: 5px; padding: 1px 7px; font-weight: 400;
        }
        .c26-announce-pin { margin-left: auto; }
        @keyframes c26-heartbeat {
          0%, 100% { transform: scale(1); }
          20% { transform: scale(1.18); }
          35% { transform: scale(1); }
          50% { transform: scale(1.12); }
          65% { transform: scale(1); }
        }
        .c26-announce-new {
          font-family: var(--fm); font-size: .58rem; font-weight: 700; letter-spacing: .02em;
          color: var(--bg); background: var(--amber); border-radius: 10px; padding: 1px 7px;
          animation: c26-heartbeat 1.6s ease-in-out infinite;
        }
        .c26-announce-card p { margin: 4px 0 0; font-size: .82rem; color: var(--text2); line-height: 1.45; white-space: pre-wrap; }
        .c26-announce-line2 {
          display: flex; align-items: center; flex-wrap: wrap; gap: 12px; margin-top: 5px;
          font-family: var(--fm); font-size: .66rem; color: var(--text3);
        }
        .c26-announce-posted { opacity: .8; }
        .c26-announce-section-label {
          font-family: var(--fm); font-size: .6rem; letter-spacing: .1em; text-transform: uppercase; color: var(--text3);
          padding-top: 10px; margin-top: 2px; border-top: 1px solid var(--border);
        }
        .c26-announce-archive-toggle {
          background: none; border: none; cursor: pointer; text-align: left; padding: 10px 0 0;
          font-family: var(--fm); font-size: .68rem; letter-spacing: .04em; color: var(--text3);
          border-top: 1px solid var(--border); margin-top: 4px; width: 100%;
        }
        .c26-announce-archive-toggle:hover { color: var(--amber); }

        .c26-seat-banner {
          display: block; flex-shrink: 0; text-decoration: none; text-align: center;
          border: 1px solid var(--violet); border-radius: 8px; background: rgba(155,128,232,.12);
          padding: 12px 14px; font-family: var(--fh); font-size: .95rem; font-weight: 600; color: var(--violet);
        }
        .c26-seat-banner:hover { background: rgba(155,128,232,.2); }
      `}</style>

      {showButton && (visible.length > 0 || seatingActive) && (
        <button onClick={() => setOpen(true)} className="c26-announce-fab" aria-label="Course announcements">
          🔔
          {visible.length > 0 && <span className="c26-announce-badge">{visible.length}</span>}
        </button>
      )}

      {open && (
        <div className="c26-announce-overlay" onClick={dismiss}>
          <div className="c26-announce-modal" onClick={(e) => e.stopPropagation()}>
            <div className="c26-announce-modal-head">
              <h3>📣 Course announcements</h3>
              <button onClick={dismiss} aria-label="Close">✕</button>
            </div>
            <Link href="/courses/calc1-fa26/exams" className="c26-seat-banner">
              {seatingActive ? `🔍 Find Your Seat — ${seatStatus.exam} →` : '📅 Exam Details & Seating →'}
            </Link>
            <div className="c26-announce-list">
              {urgentOnes.map((a) => <AnnouncementCard key={a.id} a={a} isNew={!seenSnapshot.has(a.id)} />)}
              {urgentOnes.length > 0 && restOnes.length > 0 && (
                <div className="c26-announce-section-label">Other announcements</div>
              )}
              {restOnes.map((a) => <AnnouncementCard key={a.id} a={a} isNew={!seenSnapshot.has(a.id)} />)}
              {visible.length === 0 && <div style={{ fontSize: '.84rem', color: 'var(--text3)' }}>Nothing current — check past announcements below.</div>}

              {archivedOnes.length > 0 && (
                <button type="button" className="c26-announce-archive-toggle" onClick={() => setShowArchive((s) => !s)}>
                  {showArchive ? '▾' : '▸'} Past announcements ({archivedOnes.length})
                </button>
              )}
              {showArchive && archivedOnes.map((a) => <AnnouncementCard key={a.id} a={a} isNew={false} archived />)}
            </div>
            <button className="btn" onClick={dismiss} style={{ width: '100%' }}>Got it</button>
          </div>
        </div>
      )}
    </>
  );
}
