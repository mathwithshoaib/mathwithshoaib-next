'use client';

import Link from 'next/link';
import { ANNOUNCEMENT_URGENT_WINDOW_HOURS, ANNOUNCEMENT_ARCHIVE_GRACE_HOURS } from '../../../lib/scheduleConfig';

/* ═════════════════════════════════════════════════════════════════
   Shared announcement logic + card rendering — used by both
   AnnouncementsWidget (the popup/bell) and the standalone /announcements
   page, so the urgency/archive rules and the card's look can't drift
   between the two surfaces.
   ═════════════════════════════════════════════════════════════════ */

// True once an announcement's deadline is more than the grace period in
// the past — that's when it slides into the collapsed archive. No
// deadline means it never auto-archives.
export function isArchived(a) {
  if (!a.deadline) return false;
  const hoursSince = (Date.now() - new Date(a.deadline).getTime()) / 3600000;
  return hoursSince >= ANNOUNCEMENT_ARCHIVE_GRACE_HOURS;
}

export function urgencyOf(a) {
  if (!a.deadline) return a.type;
  const hoursLeft = (new Date(a.deadline).getTime() - Date.now()) / 3600000; // positive before, negative after
  if (hoursLeft <= ANNOUNCEMENT_URGENT_WINDOW_HOURS && hoursLeft > -ANNOUNCEMENT_ARCHIVE_GRACE_HOURS) return 'urgent';
  return a.type;
}

// Shows seconds once under an hour so it visibly ticks wherever the caller
// re-renders often enough (the popup does, every second, while open).
export function fmtCountdown(deadline) {
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

export function fmtPostedAt(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

// Prominent "Oct 4, 2026 · 6:30 PM" text for when an admin ticks
// "show date/time" on an exam-type announcement — separate from the
// small countdown line, which stays in the footer either way.
export function fmtDeadlineDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
}

export const TYPE_STYLE = {
  info: { accent: 'var(--teal)', bg: 'rgba(56,201,176,.10)', label: 'Info' },
  warning: { accent: 'var(--amber)', bg: 'rgba(232,160,32,.10)', label: 'Heads up' },
  urgent: { accent: 'var(--rose)', bg: 'rgba(224,107,107,.13)', label: 'Urgent' },
};
export const ARCHIVE_STYLE = { accent: 'var(--text3)', bg: 'var(--bg2)', label: 'Past' };

// Compact 2-3 line layout: a header line (type badge, title, category tag,
// New badge, pin — pin pushed flush right instead of leaving a gap), an
// optional message line, an optional per-announcement link button, and a
// footer line combining the countdown and posted-at.
export function AnnouncementCard({ a, isNew, archived }) {
  const urgency = archived ? null : urgencyOf(a);
  const style = archived ? ARCHIVE_STYLE : (TYPE_STYLE[urgency] || TYPE_STYLE.info);
  const isExternal = a.linkUrl && /^https?:\/\//i.test(a.linkUrl);
  const showDeadlineText = !archived && a.showDeadline && a.deadline;
  const showLinkBtn = !archived && a.showButton && a.linkUrl;
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
      {(showDeadlineText || showLinkBtn) && (
        <div className="c26-announce-link-row" style={{ justifyContent: showDeadlineText ? 'space-between' : 'flex-end' }}>
          {showDeadlineText && (
            <span className="c26-announce-deadline-text" style={{ color: style.accent }}>
              📅 {fmtDeadlineDate(a.deadline)}
            </span>
          )}
          {showLinkBtn && (
            <Link
              href={a.linkUrl}
              target={isExternal ? '_blank' : undefined}
              rel={isExternal ? 'noopener noreferrer' : undefined}
              className="c26-announce-link-btn"
              style={{ background: style.accent }}
            >
              {a.linkLabel || 'View'} →
            </Link>
          )}
        </div>
      )}
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

// CSS for the card itself + the shared bits (section label, archive
// toggle, link button) — both the popup and the full page inject this
// alongside their own layout-specific styles.
export const ANNOUNCEMENT_CARD_CSS = `
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
  .c26-announce-link-row { display: flex; align-items: center; gap: 10px; margin-top: 8px; }
  .c26-announce-deadline-text { font-family: var(--fm); font-size: .8rem; font-weight: 700; white-space: nowrap; }
  .c26-announce-link-btn {
    display: inline-block; text-decoration: none; color: var(--bg); font-weight: 700;
    font-family: var(--fm); font-size: .68rem; padding: 5px 12px; border-radius: 6px; white-space: nowrap;
  }
  .c26-announce-link-btn:hover { opacity: .85; }
`;
