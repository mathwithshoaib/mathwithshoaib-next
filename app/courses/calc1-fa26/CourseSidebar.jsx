'use client';

import Link from 'next/link';
import { COURSE_TOPBAR_HEIGHT } from './CourseTopBar';

/* ═════════════════════════════════════════════════════════════════
   Persistent in-course navigation — Home / Schedule / Exams /
   Announcements. On wide screens (>1150px) this is truly
   `position: fixed` to the viewport's left edge, spanning the full
   height below the navbar — always visible at the same screen
   position regardless of scroll or which page's hero is showing
   (a `position: sticky` version of this, tried first, only stuck
   within its own page's content column, so it disappeared while
   scrolling back up through a tall hero — fixed avoids that entirely).

   Below 1150px it becomes a normal, non-fixed horizontal scrollable
   pill-bar (same pattern as the course switcher / admin jump-nav)
   sitting in the page's own flow, since a fixed rail has no good home
   on a phone-width screen.

   Each page using this must reserve 210px on its left via the
   `.c26-shell` margin-left pattern (see any of the 4 pages) — this
   component only handles its own positioning, not the page's.

   NOT used on the schedule admin panel — that's a separate internal
   tool with its own nav, not part of the student-facing course flow.
   ═════════════════════════════════════════════════════════════════ */

const NAV_ITEMS = [
  { href: '/courses/calc1-fa26', label: 'Course Home', key: 'home' },
  { href: '/courses/calc1-fa26/schedule', label: 'Weekly Schedule', key: 'schedule' },
  { href: '/courses/calc1-fa26/exams', label: 'Exams', key: 'exams' },
  { href: '/courses/calc1-fa26/announcements', label: 'Announcements', key: 'announcements' },
];

export default function CourseSidebar({ active }) {
  return (
    <nav className="c26-sidebar no-print">
      <style>{`
        .c26-sidebar {
          position: fixed; top: calc(var(--nav-h) + 3px + ${COURSE_TOPBAR_HEIGHT}px); left: 0; z-index: 40;
          width: 210px; height: calc(100vh - var(--nav-h) - 3px - ${COURSE_TOPBAR_HEIGHT}px); overflow-y: auto;
          padding: 22px 14px; border-right: 1px solid var(--border); background: var(--bg);
          display: flex; flex-direction: column; gap: 2px;
        }
        .c26-sidebar-link {
          display: block; padding: 9px 14px; border-radius: 7px; text-decoration: none;
          font-family: var(--fm); font-size: .78rem; letter-spacing: .02em; color: var(--text3);
        }
        .c26-sidebar-link:hover { color: var(--text); background: var(--bg2); }
        .c26-sidebar-link.active { color: var(--amber); background: rgba(232,160,32,.1); font-weight: 600; }

        @media (max-width: 1150px) {
          .c26-sidebar {
            position: static; width: 100%; height: auto; overflow-y: visible;
            flex-direction: row; overflow-x: auto; gap: 6px;
            padding: 4px 2px 12px; border-right: none; border-bottom: 1px solid var(--border);
            background: transparent;
          }
          .c26-sidebar-link { white-space: nowrap; flex-shrink: 0; }
        }
      `}</style>
      {NAV_ITEMS.map((item) => (
        <Link key={item.key} href={item.href} className={`c26-sidebar-link${item.key === active ? ' active' : ''}`}>
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
