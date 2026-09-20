'use client';

import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import ExamSeatingBox from '../ExamSeatingBox';

/* ═════════════════════════════════════════════════════════════════
   MATH-101 · CALCULUS I (Non-SSE) FA26 — EXAMS
   Route: /courses/calc1-fa26/exams

   One living page, not three static ones. It always shows whichever
   exam is "current" (syllabus link + the seating search) plus a small
   "up next" teaser for whatever's coming after it. As the term moves
   from Mid-1 -> Mid-2 -> Final, update CURRENT_EXAM_KEY below (and the
   date/syllabus link for whichever exam becomes current) — nothing else
   on the page needs to change. The seating search itself is switched on
   separately in the schedule admin panel's Exam Seating section; this
   page's content and that toggle are independent, so keep them in sync
   by hand when moving to the next exam.
   ═════════════════════════════════════════════════════════════════ */

const EXAM_SCHEDULE = [
  {
    key: 'mid1', label: 'Midterm I', date: 'Oct 3, 2026', time: null, tentative: true,
    duration: '120 minutes', spec: 'No notes · No books · No AI',
    resources: [{ label: 'Syllabus', href: null }],
  },
  {
    key: 'mid2', label: 'Midterm II', date: 'Nov 7, 2026', time: null, tentative: true,
    duration: '120 minutes', spec: 'No notes · No books · No AI',
    resources: [{ label: 'Syllabus', href: null }],
  },
  {
    key: 'final', label: 'Final Exam', date: 'TBA', time: null, tentative: false,
    duration: '3 hours', spec: 'No notes · No books · No AI',
    resources: [{ label: 'Syllabus', href: null }],
  },
];

// Change this one line as the term moves from exam to exam.
const CURRENT_EXAM_KEY = 'mid1';

export default function ExamsPage() {
  const currentIndex = EXAM_SCHEDULE.findIndex((e) => e.key === CURRENT_EXAM_KEY);
  const current = EXAM_SCHEDULE[currentIndex];
  const next = EXAM_SCHEDULE[currentIndex + 1];

  return (
    <>
      <style>{`
        .exm-wrap { max-width: 780px; margin: 0 auto; padding: calc(var(--nav-h) + 3px + 40px) 24px 80px; }
        .exm-section { margin-bottom: 32px; }
        .exm-datetime { font-size: 1.15rem; font-weight: 700; color: var(--amber); line-height: 1.3; }
        .exm-soon { font-family: var(--fm); font-size: .72rem; color: var(--text3); opacity: .5; }
        .exm-resource-link { color: var(--teal); text-decoration: none; font-family: var(--fm); font-size: .78rem; }
      `}</style>

      <Navbar activePage="courses" />

      <div className="exm-wrap">
        <span className="eyebrow">MATH 101 · Non-SSE Section · Fall 2026</span>
        <h1 style={{ fontSize: 'clamp(1.8rem,4vw,2.6rem)', margin: '6px 0 24px' }}>Exams</h1>

        {/* CURRENT EXAM */}
        <div className="exm-section card" style={{ padding: '24px 26px' }}>
          <div style={{ fontFamily: 'var(--fm)', fontSize: '.68rem', color: 'var(--text3)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
            Current — {current.label}
          </div>
          <div className="exm-datetime">
            {current.date}{current.time ? ` · ${current.time}` : ''}
          </div>
          {current.tentative && <div style={{ fontSize: '.72rem', color: 'var(--text3)', marginTop: '2px' }}>(tentative)</div>}
          <div style={{ fontSize: '.9rem', color: 'var(--text2)', marginTop: '10px' }}>{current.duration}</div>
          <div style={{ fontSize: '.78rem', color: 'var(--text3)', marginTop: '4px' }}>{current.spec}</div>

          {current.resources?.length > 0 && (
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
              {current.resources.map((r) => (
                r.href
                  ? <Link key={r.label} href={r.href} target="_blank" rel="noopener noreferrer" className="exm-resource-link">{r.label}</Link>
                  : <span key={r.label} className="exm-soon">{r.label} — coming soon</span>
              ))}
            </div>
          )}
        </div>

        {/* SEATING SEARCH */}
        <div className="exm-section">
          <ExamSeatingBox />
        </div>

        {/* UP NEXT */}
        {next && (
          <div className="exm-section" style={{ border: '1px dashed var(--border2)', borderRadius: 'var(--radius)', padding: '18px 22px' }}>
            <div style={{ fontFamily: 'var(--fm)', fontSize: '.64rem', color: 'var(--text3)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: '6px' }}>
              Up next
            </div>
            <div style={{ fontSize: '.98rem', color: 'var(--text2)' }}>
              {next.label} · {next.date}{next.tentative && <span style={{ color: 'var(--text3)' }}> (tentative)</span>}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '24px', borderTop: '1px solid var(--border)', flexWrap: 'wrap', gap: '12px' }}>
          <Link href="/courses/calc1-fa26" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--fm)', fontSize: '.74rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--text3)', padding: '8px 18px', border: '1px solid var(--border)', borderRadius: '8px', textDecoration: 'none' }}>
            ← Course home
          </Link>
          <Link href="/courses/calc1-fa26/schedule" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--fm)', fontSize: '.74rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--amber)', padding: '8px 18px', border: '1px solid rgba(232,160,32,.4)', borderRadius: '8px', background: 'rgba(232,160,32,.07)', textDecoration: 'none' }}>
            Weekly schedule →
          </Link>
        </div>
      </div>

      <Footer />
    </>
  );
}
