'use client';

import { useState, useEffect } from 'react';
import { ANNOUNCEMENTS_FEATURE_END } from '../../../lib/scheduleConfig';
import { isArchived, urgencyOf, AnnouncementCard, ANNOUNCEMENT_CARD_CSS } from './AnnouncementHelpers';

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

export default function AnnouncementsWidget({ showButton = false }) {
  const featureEnded = Date.now() >= new Date(ANNOUNCEMENTS_FEATURE_END).getTime();

  const [all, setAll] = useState([]);
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

  if (featureEnded || (visible.length === 0 && archivedOnes.length === 0)) return null;

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
        ${ANNOUNCEMENT_CARD_CSS}
      `}</style>

      {showButton && visible.length > 0 && (
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
