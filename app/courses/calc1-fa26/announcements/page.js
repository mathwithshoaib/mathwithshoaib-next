'use client';

import { useState, useEffect } from 'react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import CourseSidebar from '../CourseSidebar';
import CourseTopBar from '../CourseTopBar';
import { isArchived, urgencyOf, AnnouncementCard, ANNOUNCEMENT_CARD_CSS } from '../AnnouncementHelpers';
import { ANNOUNCEMENTS_FEATURE_END } from '../../../../lib/scheduleConfig';

/* ═════════════════════════════════════════════════════════════════
   MATH-101 · CALCULUS I (Non-SSE) FA26 — ANNOUNCEMENTS
   Route: /courses/calc1-fa26/announcements

   The full, always-available listing — same data and urgency/archive
   rules as the pop-up (see AnnouncementHelpers.jsx), just as its own
   page reachable from the sidebar instead of a modal. The floating bell
   still exists on other pages for "something new" alerts; this page is
   where you come to browse everything at your own pace.
   ═════════════════════════════════════════════════════════════════ */

export default function AnnouncementsPage() {
  const featureEnded = Date.now() >= new Date(ANNOUNCEMENTS_FEATURE_END).getTime();
  const [all, setAll] = useState(null); // null = loading
  const [showArchive, setShowArchive] = useState(false);

  useEffect(() => {
    if (featureEnded) { setAll([]); return; }
    fetch('/api/schedule/announcements')
      .then((r) => r.json())
      .then((json) => setAll(json.announcements || []))
      .catch(() => setAll([]));
  }, [featureEnded]);

  const visible = (all || []).filter((a) => !isArchived(a));
  const archivedOnes = (all || []).filter((a) => isArchived(a));
  const urgentOnes = visible.filter((a) => urgencyOf(a) === 'urgent');
  const restOnes = visible.filter((a) => urgencyOf(a) !== 'urgent');

  return (
    <>
      <style>{`
        .anc-shell { }
        @media (min-width: 1151px) { .anc-shell { margin-left: 210px; } }
        .anc-wrap { max-width: 720px; margin: 0 auto; padding: calc(var(--nav-h) + 3px + 40px) 24px 80px; }
        .anc-list { display: flex; flex-direction: column; gap: 10px; }
        ${ANNOUNCEMENT_CARD_CSS}
      `}</style>

      <Navbar activePage="courses" />
      <CourseTopBar />
      <CourseSidebar active="announcements" />

      <div className="anc-shell">
        <div className="anc-wrap">
          <span className="eyebrow">MATH 101 · Non-SSE Section · Fall 2026</span>
          <h1 style={{ fontSize: 'clamp(1.8rem,4vw,2.6rem)', margin: '6px 0 24px' }}>Announcements</h1>

          {featureEnded ? (
            <p style={{ color: 'var(--text3)', fontSize: '.9rem' }}>This course offering has ended — announcements are no longer shown.</p>
          ) : all === null ? (
            <p style={{ color: 'var(--text3)', fontSize: '.9rem' }}>Loading…</p>
          ) : visible.length === 0 && archivedOnes.length === 0 ? (
            <p style={{ color: 'var(--text3)', fontSize: '.9rem' }}>Nothing posted yet — check back once the term is underway.</p>
          ) : (
            <div className="anc-list">
              {urgentOnes.map((a) => <AnnouncementCard key={a.id} a={a} isNew={false} />)}
              {urgentOnes.length > 0 && restOnes.length > 0 && (
                <div className="c26-announce-section-label">Other announcements</div>
              )}
              {restOnes.map((a) => <AnnouncementCard key={a.id} a={a} isNew={false} />)}
              {visible.length === 0 && <div style={{ fontSize: '.84rem', color: 'var(--text3)' }}>Nothing current — check past announcements below.</div>}

              {archivedOnes.length > 0 && (
                <button type="button" className="c26-announce-archive-toggle" onClick={() => setShowArchive((s) => !s)}>
                  {showArchive ? '▾' : '▸'} Past announcements ({archivedOnes.length})
                </button>
              )}
              {showArchive && archivedOnes.map((a) => <AnnouncementCard key={a.id} a={a} isNew={false} archived />)}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
