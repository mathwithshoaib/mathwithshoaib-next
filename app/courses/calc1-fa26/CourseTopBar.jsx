'use client';

import Link from 'next/link';

/* ═════════════════════════════════════════════════════════════════
   "Home › Courses › Calculus I · Non-SSE · FA26" breadcrumb + the
   course-switcher tabs (Pre-Calc / Calc1 Fall25 / this one / LinAlg) —
   for switching to an entirely DIFFERENT course offering, as opposed to
   CourseSidebar which switches between pages WITHIN this one. Shared
   across all 4 course pages (Home/Schedule/Exams/Announcements) so the
   "you're inside this course" identity stays consistent everywhere, not
   just on the home page.

   COURSE_TOPBAR_HEIGHT is exported so CourseSidebar can offset its own
   fixed top/height to sit right below this instead of overlapping it —
   keep the two in sync if this bar's padding/font-size ever changes.
   ═════════════════════════════════════════════════════════════════ */

export const COURSE_TOPBAR_HEIGHT = 78;

const SWITCHER = [
  { href: '/courses/precalc', label: 'Pre-Calculus' },
  { href: '/courses/calc1', label: 'Calculus I · Fall 2025' },
  { href: '/courses/calc1-fa26', label: 'Calculus I · Non-SSE · Fall 2026', active: true },
  { href: '/courses/linalg', label: 'Linear Algebra · Summer 2026' },
];

export default function CourseTopBar() {
  return (
    <div className="c26-topbar no-print">
      <style>{`
        .c26-topbar { position: sticky; top: calc(var(--nav-h) + 3px); z-index: 500; background: var(--bg2); border-bottom: 1px solid var(--border); }
        .c26-topbar-crumb {
          max-width: 1080px; margin: 0 auto; padding: 8px 24px; display: flex; align-items: center; gap: 8px;
          font-family: var(--fm); font-size: .72rem; color: var(--text3); border-bottom: 1px solid var(--border);
        }
        .c26-topbar-crumb a { color: var(--amber); text-decoration: none; }
        .c26-topbar-tabs { max-width: 1080px; margin: 0 auto; display: flex; align-items: center; padding: 0 24px; overflow-x: auto; scrollbar-width: none; }
        .c26-topbar-tabs::-webkit-scrollbar { display: none; }
        .c26-topbar-tab {
          font-family: var(--fm); font-size: .72rem; letter-spacing: .06em; text-transform: uppercase;
          padding: 9px 18px; border-bottom: 2px solid transparent; white-space: nowrap; text-decoration: none; color: var(--text3);
        }
        .c26-topbar-tab.active { color: var(--amber); border-bottom-color: var(--amber); }
        @media (max-width: 1150px) { .c26-topbar { position: static; margin-top: calc(var(--nav-h) + 3px); } }
      `}</style>
      <div className="c26-topbar-crumb">
        <Link href="/">Home</Link><span>›</span>
        <Link href="/courses">Courses</Link><span>›</span>
        <span style={{ color: 'var(--text2)', fontWeight: 500 }}>Calculus I · Non-SSE · FA26</span>
      </div>
      <div className="c26-topbar-tabs">
        {SWITCHER.map(({ href, label, active }) => (
          <Link key={href} href={href} className={`c26-topbar-tab${active ? ' active' : ''}`}>{label}</Link>
        ))}
      </div>
    </div>
  );
}
