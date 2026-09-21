'use client';

import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import CourseSidebar from '../CourseSidebar';
import CourseTopBar from '../CourseTopBar';

/* ═════════════════════════════════════════════════════════════════
   MATH-101 · CALCULUS I (Non-SSE) FA26 — PAST PAPERS
   Route: /courses/calc1-fa26/past-papers

   Practice material from previous Non-SSE offerings of this same
   course. Plain hand-edited list (same convention as LECTURE_NOTES /
   PROBLEM_SETS on the course home page) — add a new { term, papers }
   block as each additional past offering's papers become available.
   ═════════════════════════════════════════════════════════════════ */

const PAST_PAPERS = [
  {
    term: 'Fall 2025 · Non-SSE',
    papers: [
      { label: 'Midterm', href: 'https://drive.google.com/file/d/1sE1MO_mIAsey1Mg51Zt9oSCOVYRmjdtt/view?usp=sharing' },
      { label: 'Midterm (Mock)', href: 'https://drive.google.com/file/d/1Kb_UYxorPxlgKlmGAY2dfD_fGZbzklYx/view?usp=sharing' },
      { label: 'Final', href: 'https://drive.google.com/file/d/1otG3OMlvUqqIPws4Bk-IkSE5it27coPV/view?usp=sharing' },
    ],
  },
  {
    term: 'Spring 2026 · Non-SSE',
    papers: [
      { label: 'Midterm', href: 'https://drive.google.com/file/d/183_yQeknGzCFXwpyD-mwzhE-KLEPrarv/view?usp=sharing' },
      { label: 'Midterm Solution', href: 'https://drive.google.com/file/d/1_mZhDHnqgthydElH27bZcv6ulT8zHvk9/view?usp=sharing' },
      { label: 'Final', href: 'https://drive.google.com/file/d/1ygFKFwB3KgtwxUwCen8lWn_Z2EkTN8rf/view?usp=sharing' },
    ],
  },
];

export default function PastPapersPage() {
  return (
    <>
      <style>{`
        .pp-shell { }
        @media (min-width: 1151px) { .pp-shell { margin-left: 210px; } }
        .pp-wrap { max-width: 780px; margin: 0 auto; padding: calc(var(--nav-h) + 3px + 40px) 24px 80px; }
        .pp-term-card { margin-bottom: 20px; }
        .pp-paper-list { display: flex; flex-direction: column; gap: 6px; margin-top: 12px; }
        .pp-paper-link {
          display: flex; align-items: center; justify-content: space-between; padding: 11px 15px;
          border-radius: 8px; border: 1px solid var(--border); text-decoration: none;
          font-family: var(--fm); font-size: .85rem; color: var(--text);
        }
        .pp-paper-link:hover { border-color: var(--teal); background: rgba(56,201,176,.06); }
        .pp-paper-arrow { color: var(--teal); }
      `}</style>

      <Navbar activePage="courses" />
      <CourseTopBar />
      <CourseSidebar active="past-papers" />

      <div className="pp-shell">
        <div className="pp-wrap">
          <span className="eyebrow">MATH 101 · Non-SSE Section · Fall 2026</span>
          <h1 style={{ fontSize: 'clamp(1.8rem,4vw,2.6rem)', margin: '6px 0 10px' }}>Past Papers</h1>
          <p style={{ color: 'var(--text2)', fontSize: '.95rem', marginBottom: '28px', maxWidth: '640px' }}>
            Practice material from previous Non-SSE offerings of this course — good for getting a feel for
            question style and difficulty, though the exact syllabus and coverage may differ from this term's exams.
          </p>

          {PAST_PAPERS.map((term) => (
            <div key={term.term} className="card pp-term-card" style={{ padding: '20px 22px' }}>
              <h4 style={{ fontSize: '1rem', margin: 0 }}>{term.term}</h4>
              <div className="pp-paper-list">
                {term.papers.map((p) => (
                  <Link key={p.label} href={p.href} target="_blank" rel="noopener noreferrer" className="pp-paper-link">
                    {p.label} <span className="pp-paper-arrow">→</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '24px', borderTop: '1px solid var(--border)', flexWrap: 'wrap', gap: '12px', marginTop: '20px' }}>
            <Link href="/courses/calc1-fa26" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--fm)', fontSize: '.74rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--text3)', padding: '8px 18px', border: '1px solid var(--border)', borderRadius: '8px', textDecoration: 'none' }}>
              ← Course home
            </Link>
            <Link href="/courses/calc1-fa26/exams" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--fm)', fontSize: '.74rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--amber)', padding: '8px 18px', border: '1px solid rgba(232,160,32,.4)', borderRadius: '8px', background: 'rgba(232,160,32,.07)', textDecoration: 'none' }}>
              Exams →
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
