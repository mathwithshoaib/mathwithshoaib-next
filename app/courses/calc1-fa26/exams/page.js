'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import ExamSeatingBox from '../ExamSeatingBox';
import ExamResultsBox from '../ExamResultsBox';
import CourseSidebar from '../CourseSidebar';
import CourseTopBar from '../CourseTopBar';

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

// Shared across the Mid-2 entry itself and the Final Exam's "recap" of it.
const MID2_TEXTBOOK = {
  label: 'Textbook: Calculus for Business, Economics, and the Social and Life Sciences — Hoffmann & Bradley',
  href: 'https://drive.google.com/file/d/1PmtGq0ybYqNtEFf68rVasmQv3e6d_xYN/view?usp=sharing',
};
const MID2_SYLLABUS_CHAPTERS = [
  {
    title: 'Chapter 2: Differentiation: Basic Concepts (continued)',
    sections: [
      '2.5 Marginal Analysis and Approximations Using Increments (p. 160)',
      '2.6 Implicit Differentiation and Related Rates (p. 172)',
      { text: "Topic: Newton's Method (p. 171)", href: 'https://drive.google.com/file/d/1Qc4sHc1mneDkNHhmtWHJLLrtT1qPMrPi/view?usp=sharing', linkLabel: 'Notes →' },
    ],
  },
  {
    title: 'Chapter 3: Additional Applications of the Derivative',
    sections: [
      '3.1 Increasing and Decreasing Functions; Relative Extrema (p. 198)',
      '3.2 Concavity and Points of Inflection (p. 215)',
      '3.4 Optimization; Elasticity of Demand (p. 248)',
    ],
  },
];

// Mid-1 syllabus isn't stored anywhere else in the codebase — inferred as
// "everything before 2.5" (the complement of the Mid-2 and Final syllabi
// below), since the course's own section order has no gap there. Only
// included here as the Final Exam's recap; confirm against what was
// actually announced for Mid-1 before relying on it.
const MID1_SYLLABUS_CHAPTERS = [
  {
    title: 'Chapter 1: Functions, Limits & Continuity',
    sections: ['1.1–1.4 A Preview of Calculus; Functions & Models', '1.5 Limits', '1.6 Continuity'],
  },
  {
    title: 'Chapter 2: Differentiation: Basic Concepts (part)',
    sections: [
      '2.1 The Derivative',
      '2.2 Techniques of Differentiation',
      '2.3 Product & Quotient Rules; Higher-Order Derivatives',
      '2.4 The Chain Rule',
    ],
  },
];

const EXAM_SCHEDULE = [
  {
    key: 'mid1', label: 'Midterm I', date: 'Oct 4, 2026', time: '6:30 PM', tentative: false,
    duration: null, spec: 'No notes · No books · No AI',
  },
  {
    key: 'mid2', label: 'Midterm II', date: 'Oct 31, 2026', time: null, tentative: false,
    duration: '120 minutes', spec: 'No notes · No books · No AI',
    syllabus: {
      note: 'Sections 2.5, 2.6, 3.1, 3.2, 3.4, and the Newton\'s Method topic — the material covered since Midterm I.',
      textbook: MID2_TEXTBOOK,
      chapters: MID2_SYLLABUS_CHAPTERS,
      excluded: 'Section 3.3 Curve Sketching (p. 233) is NOT included.',
    },
  },
  {
    key: 'final', label: 'Final Exam', date: 'Dec 22, 2026', time: '11:30 AM – 2:30 PM', tentative: false,
    duration: '3 hours', spec: 'No notes · No books · No AI',
    venueNote: 'Venues and the seating plan will be uploaded closer to the exam.',
    syllabus: {
      structure: {
        totalMarks: 100,
        rows: [
          { part: 'Part A', details: '20 MCQs × 2 marks each — comprehensive (the entire course)', marks: 40 },
          { part: 'Part B · Q1', details: 'Long question — from the Midterm I syllabus', marks: 15 },
          { part: 'Part B · Q2', details: 'Long question — from the Midterm II syllabus', marks: 15 },
          { part: 'Part B · Q3', details: 'Long question — from the Post-Midterm II syllabus', marks: 15 },
          { part: 'Part B · Q4', details: 'Long question — from the Post-Midterm II syllabus', marks: 15 },
        ],
      },
      note: 'Part A is comprehensive (the entire course). Part B, Questions 1 & 2 draw from the Midterm I and Midterm II syllabi (recapped further down); Questions 3 & 4 draw from the Post-Midterm II syllabus below — the material covered since Midterm II.',
      textbook: {
        label: 'Textbook: Calculus for Business, Economics, and the Social and Life Sciences — Hoffmann, Bradley, Sobecki & Price',
        href: MID2_TEXTBOOK.href,
      },
      chapters: [
        {
          title: 'Chapter 4: Exponential and Logarithmic Functions',
          sections: [
            '4.1 Exponential Functions; Continuous Compounding',
            '4.2 Logarithmic Functions',
            '4.3 Differentiation of Exponential and Logarithmic Functions',
            "Appendix A.3: Evaluating Limits with L'Hôpital's Rule",
          ],
        },
        {
          title: 'Chapter 5: Integration',
          sections: [
            '5.1 Indefinite Integration and Differential Equations',
            '5.2 Integration by Substitution',
            '5.3 The Definite Integral and the Fundamental Theorem of Calculus',
            '5.4 Applying Definite Integration: Distribution of Wealth and Average Value',
          ],
        },
        {
          title: 'Chapter 6: Additional Topics in Integration',
          sections: [
            '6.1 Integration by Parts; Integral Tables',
            '6.2 Numerical Integration',
            '6.4 Introduction to Continuous Probability',
          ],
        },
      ],
      excluded: 'Sections 4.4, 5.5, 5.6, and 6.3 are NOT included.',
      priorSyllabi: [
        { label: 'Midterm I syllabus (recap)', chapters: MID1_SYLLABUS_CHAPTERS },
        { label: 'Midterm II syllabus (recap)', chapters: MID2_SYLLABUS_CHAPTERS, excluded: 'Section 3.3 Curve Sketching (p. 233) is NOT included.' },
      ],
    },
  },
];

// Change this one line as the term moves from exam to exam.
const CURRENT_EXAM_KEY = 'final';

function SyllabusChapters({ chapters }) {
  return chapters.map((c) => (
    <div key={c.title} className="exm-syllabus-chapter">
      <h5>{c.title}</h5>
      <ul>
        {c.sections.map((s, i) => {
          const text = typeof s === 'string' ? s : s.text;
          const href = typeof s === 'string' ? null : s.href;
          return (
            <li key={i}>
              {text}
              {href && (
                <>
                  {' — '}
                  <Link href={href} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--teal)' }}>{s.linkLabel || 'Notes →'}</Link>
                </>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  ));
}

export default function ExamsPage() {
  const currentIndex = EXAM_SCHEDULE.findIndex((e) => e.key === CURRENT_EXAM_KEY);
  const current = EXAM_SCHEDULE[currentIndex];
  const next = EXAM_SCHEDULE[currentIndex + 1];
  const [syllabusOpen, setSyllabusOpen] = useState(false);

  return (
    <>
      <style>{`
        .exm-shell { }
        @media (min-width: 1151px) { .exm-shell { margin-left: 210px; } }
        .exm-wrap { max-width: 780px; margin: 0 auto; padding: calc(var(--nav-h) + 3px + 40px) 24px 80px; }
        .exm-section { margin-bottom: 32px; }
        .exm-datetime { font-size: 1.15rem; font-weight: 700; color: var(--amber); line-height: 1.3; }
        .exm-soon { font-family: var(--fm); font-size: .72rem; color: var(--text3); opacity: .5; }
        .exm-resource-link { color: var(--teal); text-decoration: none; font-family: var(--fm); font-size: .78rem; }
        .exm-syllabus-btn {
          background: none; border: 1px solid var(--border); border-radius: 7px; cursor: pointer;
          color: var(--teal); font-family: var(--fm); font-size: .78rem; padding: 6px 14px;
        }
        .exm-syllabus-btn:hover { border-color: var(--teal); background: rgba(56,201,176,.06); }
        .exm-syllabus-panel { margin-top: 4px; padding-top: 16px; border-top: 1px solid var(--border); }
        .exm-syllabus-note { font-size: .82rem; color: var(--text2); margin: 0 0 14px; }
        .exm-syllabus-chapter { margin-bottom: 14px; }
        .exm-syllabus-chapter:last-child { margin-bottom: 0; }
        .exm-syllabus-chapter h5 { font-size: .85rem; margin: 0 0 6px; color: var(--text); }
        .exm-syllabus-chapter ul { margin: 0; padding-left: 20px; }
        .exm-syllabus-chapter li { font-size: .82rem; color: var(--text2); line-height: 1.7; }
        .c26-table-scroll { overflow-x: auto; }
        .exm-table { width: 100%; border-collapse: collapse; font-size: .82rem; min-width: 320px; margin-top: 4px; }
        .exm-table th { text-align: left; font-family: var(--fm); font-size: .6rem; letter-spacing: .07em; text-transform: uppercase;
                        color: var(--text3); padding: 6px 10px; border-bottom: 1px solid var(--border); white-space: nowrap; }
        .exm-table td { padding: 7px 10px; border-bottom: 1px solid var(--border); color: var(--text); vertical-align: top; }
        .exm-table tbody tr:last-child td { border-bottom: none; }
      `}</style>

      <Navbar activePage="courses" />
      <CourseTopBar />
      <CourseSidebar active="exams" />

      <div className="exm-shell">
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
          {current.duration && <div style={{ fontSize: '.9rem', color: 'var(--text2)', marginTop: '10px' }}>{current.duration}</div>}
          <div style={{ fontSize: '.78rem', color: 'var(--text3)', marginTop: '4px' }}>{current.spec}</div>
          {current.venueNote && <div style={{ fontSize: '.78rem', color: 'var(--text3)', marginTop: '6px' }}>{current.venueNote}</div>}

          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
            {current.syllabus ? (
              <button type="button" onClick={() => setSyllabusOpen((s) => !s)} className="exm-syllabus-btn">
                {syllabusOpen ? '▾ Hide syllabus' : '▸ View syllabus'}
              </button>
            ) : (
              <span className="exm-soon">Syllabus — coming soon</span>
            )}
          </div>

          {current.syllabus && syllabusOpen && (
            <div className="exm-syllabus-panel">
              {current.syllabus.structure && (
                <div className="exm-syllabus-chapter">
                  <h5>Exam structure (Total: {current.syllabus.structure.totalMarks} marks)</h5>
                  <div className="c26-table-scroll">
                    <table className="exm-table">
                      <thead><tr><th>Part</th><th>Details</th><th>Marks</th></tr></thead>
                      <tbody>
                        {current.syllabus.structure.rows.map((r) => (
                          <tr key={r.part}><td>{r.part}</td><td>{r.details}</td><td>{r.marks}</td></tr>
                        ))}
                        <tr>
                          <td style={{ fontWeight: 700 }}>Total</td><td></td>
                          <td style={{ fontWeight: 700 }}>{current.syllabus.structure.totalMarks}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              <p className="exm-syllabus-note">{current.syllabus.note}</p>
              {current.syllabus.textbook && (
                <p className="exm-syllabus-note">
                  📖{' '}
                  <Link href={current.syllabus.textbook.href} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--teal)' }}>
                    {current.syllabus.textbook.label}
                  </Link>
                </p>
              )}
              <SyllabusChapters chapters={current.syllabus.chapters} />
              {current.syllabus.excluded && (
                <p className="exm-syllabus-note" style={{ marginTop: '10px', marginBottom: 0, opacity: .7 }}>{current.syllabus.excluded}</p>
              )}
              {current.syllabus.priorSyllabi && current.syllabus.priorSyllabi.map((p) => (
                <div key={p.label} style={{ marginTop: '18px', paddingTop: '14px', borderTop: '1px dashed var(--border)', opacity: .85 }}>
                  <div style={{ fontFamily: 'var(--fm)', fontSize: '.64rem', color: 'var(--text3)', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: '8px' }}>
                    {p.label}
                  </div>
                  <SyllabusChapters chapters={p.chapters} />
                  {p.excluded && (
                    <p className="exm-syllabus-note" style={{ marginTop: '10px', marginBottom: 0, opacity: .7 }}>{p.excluded}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SEATING SEARCH */}
        <div className="exm-section">
          <ExamSeatingBox />
        </div>

        {/* RESULTS */}
        <div className="exm-section">
          <ExamResultsBox />
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
      </div>

      <Footer />
    </>
  );
}
