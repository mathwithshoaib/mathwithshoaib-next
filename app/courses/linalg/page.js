'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

/* ═════════════════════════════════════════════════════════════════
   MATH-120 · LINEAR ALGEBRA — COURSE HOME  (redesigned, compact)
   Route: /courses/linalg

   ALL weekly edits live in the DATA BLOCKS below.
   - Add a lecture      → add one object to LECTURES.
   - Make a link live   → change href:null to a URL string.
   - CURRENT_WEEK        → which week's accordion opens by default.
   ═════════════════════════════════════════════════════════════════ */

const CURRENT_WEEK = 5;   // controls which lecture week + resource row is highlighted/open

/* ─────────── LECTURES ─────────── */
const LECTURES = [
  { week: 1, n: 1, slug: 'w1/lec1', title: 'The Language of Matrices', ref: '§1.1–1.2', date: '8 Jun', live: true },
  { week: 1, n: 2, slug: 'w1/lec2', title: 'Row Operations & Gaussian Elimination', ref: '§1.2', date: '9 Jun', live: true },
  { week: 1, n: 3, slug: 'w1/lec3', title: 'RREF, Homogeneous Systems & Linear Combinations', ref: '§1.3', date: '10 Jun', live: true },
  { week: 1, n: 4, slug: 'w1/lec4', title: 'Solution Structure & Applications', ref: '§1.4', date: '11 Jun', live: true },
  { week: 2, n: 5, slug: 'w2/lec5', title: 'Matrix Algebra: Addition, Scalar Multiplication & Transpose', ref: '§2.1–2.2', date: '15 Jun', live: true },
  { week: 2, n: 6, slug: 'w2/lec6', title: 'The Inverse of a Matrix', ref: '§2.4', date: '16 Jun', live: true },
  { week: 2, n: 7, slug: 'w2/lec7', title: 'Elementary Matrices & Solving Systems', ref: '§2.5', date: '17 Jun', live: true },
  { week: 2, n: 8, slug: 'w2/lec8', title: 'LU-Factorization & Input–Output Models', ref: '§2.7–2.8', date: '18 Jun', live: true },
  { week: 3, n: 9, slug: 'w3/lec9', title: 'Determinants: Cofactor Expansion & Properties', ref: '§3.1', date: '22 Jun', live: true },
  { week: 3, n: 10, slug: 'w3/lec10', title: 'Determinants & Matrix Inverses', ref: '§3.2', date: '23 Jun', live: true },
  { week: 3, n: 11, slug: 'w3/lec11', title: 'Eigenvalues & Eigenvectors', ref: '§3.3', date: '24 Jun', live: true },
  { week: 4, n: 12, slug: 'w4/lec12', title: 'Diagonalization & Dynamical Systems', ref: '§3.3', date: '29 Jun', live: true },
  { week: 4, n: 13, slug: 'w4/lec13', title: 'Polynomial Interpolation & Linear Recurrences', ref: '§3.2 and §3.4', date: '1 Jul', live: true },
  { week: 4, n: 14, slug: 'w4/lec14', title: 'Subspaces and Spanning', ref: '§5.1', date: '2 Jul', live: true },
  { week: 5, n: 15, slug: 'w5/lec15', title: 'Basis & Dimension', ref: '§5.2', date: '6 Jul', live: true },
];

/* one-line theme per week, shown as the accordion subtitle */
const WEEK_THEMES = {
  1: 'Systems of Linear Equations',
  2: 'Matrix Algebra & Factorization',
  3: 'Determinants & Eigen-values/vectors',
  4: 'Diagonalization and Subspaces of ℝⁿ',
  5: 'Basis, Dimension, and Orthogonality',
  6: 'Linear Transformations',
  7: 'Applications',
};

/* ─────────── RESOURCES — one row per week ───────────
   Each cell: { href } — null href renders a muted "soon" chip. */
const RESOURCES = [
  { week: 1, practice: { href: null }, solutions: { href: 'https://drive.google.com/file/d/1wwHCSyEYDdOrZGHSHhpRam1ql8BqsUij/view?usp=sharing' }, pset: { href: null } },
  { week: 2, practice: { href: null }, solutions: { href: null }, pset: { href: null } },
  { week: 3, practice: { href: null }, solutions: { href: null }, pset: { href: null } },
  { week: 4, practice: { href: 'https://drive.google.com/file/d/1kdPWhV0iA097sUgHLsi5f-6Ewhx7TWPp/view?usp=sharing' }, solutions: { href: 'https://drive.google.com/file/d/1czjBfjPluFs9SVlBiozEC2mEVyXZiAhR/view?usp=sharing' }, pset: { href: null } },
  { week: 5, practice: { href: null }, solutions: { href: null }, pset: { href: null } },
  { week: 6, practice: { href: null }, solutions: { href: null }, pset: { href: null } },
  { week: 7, practice: { href: null }, solutions: { href: null }, pset: { href: null } },
];

/* ─────────── QUIZZES — separate date strip ─────────── */
const QUIZZES = [
  { n: 1, date: '15 Jun', sol: 'https://drive.google.com/file/d/173KCNI7RrnRpouyLGN3zXhQ0FdLdCyNy/view?usp=sharing' },
  { n: 2, date: '22 Jun', sol: 'https://drive.google.com/file/d/1F1gCKomKeH2GizwUA7y6P8gJcdT34IYP/view?usp=sharing' },
  { n: 3, date: '29 Jun', sol: 'https://drive.google.com/file/d/19qqXs_iuM_H29f-Ox-r9fr-HbgB5f1wp/view?usp=sharing' },
  { n: 4, date: '06 Jul', sol: null },
  { n: 5, date: '13 Jul', sol: null },
  { n: 6, date: '20 Jul', sol: null },
];

/* ─────────── ASSESSMENT ─────────── */
const WEIGHTS = [['Quizzes · best 5 of 6', 30], ['Midterm', 30], ['Final · comprehensive', 40]];
const EXAM_DATES = [
  { label: 'Midterm', detail: '03 Jul · 10:00 AM', sol: 'https://drive.google.com/file/d/18-fQTsHWNE-E2pAxsOfwU0o6w1NetgLF/view?usp=sharing', mock: 'https://drive.google.com/file/d/1Goamv7xmAAxLwtzUveWpW9P4po9-PJlM/view?usp=sharing' },
  { label: 'Final', detail: '25 Jul · 3:00 PM', sol: null, mock: null },
];

/* ─────────── TEACHING TEAM ─────────── */
const TEACHING_TEAM = [
  { role: 'Instructor', name: 'Imran Anwar', email: 'imran.anwar@lums.edu.pk', office: '9-155A SSE', hours: 'Mon–Thu 4:00–5:00' },
  { role: 'TA', name: 'Muhammad Shoaib Khan', email: 'shoaib.khan@lums.edu.pk', office: '9-155 SSE', hours: 'Mon–Thu 1:00–2:00' },
  { role: 'TA', name: 'Azhar Javed', email: 'azhar.javed@lums.edu.pk', office: '9-155 SSE', hours: 'TBA' },
  { role: 'TA', name: 'Aqsa Noreen', email: '22070005@lums.edu.pk', office: '9-155 SSE', hours: 'TBA' },
  { role: 'TA', name: 'Hajra Mahmood', email: '28100096@lums.edu.pk', office: 'Math Lobby', hours: 'Mon/Wed/Thu 5–6 · Fri 4–5' },
];

/* ─────────── SYLLABUS (read-once, collapsed) ─────────── */
const TIMELINE = [
  { no: 'Week 1', title: 'Systems of Linear Equations', ref: 'Ch 1', items: [['§1.2', 'Row operations, echelon form & rank'], ['§1.2', 'Gaussian elimination'], ['§1.3', 'Homogeneous equations'], ['§1.4', 'Networks & chemical reactions']] },
  { no: 'Week 2', title: 'Matrix Algebra & Factorization', ref: 'Ch 2–3', items: [['§2.2–2.3', 'Transpose, multiplication, inverses'], ['§2.6–2.7', 'LU factorization, input–output model']] },
  { no: 'Week 3', title: 'Determinants & Diagonalization', ref: 'Ch 3', items: [['§3.1–3.2', 'Cofactor expansion, adjugate & inverse'], ['§3.3', 'Diagonalization, eigenvalues, dynamical systems']] },
  { no: 'Week 4', title: 'Vector Space ℝⁿ', ref: 'Ch 5–6', items: [['§6.1', 'Vector space examples & properties'], ['§5.1', 'Subspaces, spanning, independence'], ['§6.2–6.3', 'Basis & dimension']] },
  { no: 'Week 5', title: 'Orthogonality & Polynomials', ref: 'Ch 8', items: [['§8.1', 'Orthogonal bases (Gram–Schmidt)'], ['§8.2', 'Orthogonal diagonalization'], ['§8.9', 'Quadratic forms']] },
  { no: 'Week 6', title: 'Linear Transformations', ref: 'Ch 7 & 2', items: [['§7.1', 'Transformation examples & properties'], ['§2.5', 'Matrix of a transformation'], ['§7.2', 'Kernel, image & dimension theorem']] },
  { no: 'Week 7', title: 'Applications', ref: 'Ch 10 & 8', items: [['§10.2', 'Legendre interpolation'], ['§8.10', 'Differential equations via eigenvalues']] },
];

/* ─────────── WEEKLY SCHEDULE ─────────── */
const SCHEDULE = {
  startHour: 11, endHour: 19,
  days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  events: [
    { day: 0, start: 14, end: 15.67, type: 'lecture', title: 'Lecture', loc: 'Acad-11' },
    { day: 1, start: 14, end: 15.67, type: 'lecture', title: 'Lecture', loc: 'Acad-11' },
    { day: 2, start: 14, end: 15.67, type: 'lecture', title: 'Lecture', loc: 'Acad-11' },
    { day: 3, start: 14, end: 15.67, type: 'lecture', title: 'Lecture', loc: 'Acad-11' },
    { day: 0, start: 12.5, end: 13.5, type: 'office', title: 'Shoaib · OH', loc: '9-155 SSE' },
    { day: 1, start: 12.5, end: 13.5, type: 'office', title: 'Shoaib · OH', loc: '9-155 SSE' },
    { day: 2, start: 12.5, end: 13.5, type: 'office', title: 'Shoaib · OH', loc: '9-155 SSE' },
    { day: 3, start: 12.5, end: 13.5, type: 'office', title: 'Shoaib · OH', loc: '9-155 SSE' },
    { day: 0, start: 11, end: 12.5, type: 'tutorial', title: 'Tutorial · Aqsa', loc: 'TBA' },
    { day: 3, start: 16, end: 17, type: 'tutorial', title: 'Tutorial · Azhar', loc: 'TBA' },
    { day: 0, start: 17, end: 18, type: 'office', title: 'Hajra · OH', loc: '9-155 SSE' },
    { day: 2, start: 17, end: 18, type: 'office', title: 'Hajra · OH', loc: '9-155 SSE' },
    { day: 3, start: 17, end: 18, type: 'office', title: 'Hajra · OH', loc: '9-155 SSE' },
    { day: 4, start: 16, end: 17, type: 'office', title: 'Hajra · OH', loc: '9-155 SSE' },
    { day: 4, start: 14.5, end: 16, type: 'tutorial', title: 'Tutorial · Hajra', loc: '9-1C1 SSE' },
  ],
};

/* ─── helpers ─── */
function lecturesByWeek() {
  const w = {};
  LECTURES.forEach(l => { (w[l.week] = w[l.week] || []).push(l); });
  return Object.keys(w).map(Number).sort((a, b) => a - b).map(week => ({ week, lectures: w[week] }));
}
function liveCount() { return LECTURES.filter(l => l.live).length; }

/* small link-or-soon chip used across resource cells */
function Chip({ href, label, tone = 'amber' }) {
  const c = tone === 'teal' ? 'var(--teal)' : tone === 'violet' ? 'var(--violet)' : 'var(--amber)';
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" style={{
        display: 'inline-flex', alignItems: 'center', gap: '5px', fontFamily: 'var(--fm)', fontSize: '.72rem',
        color: c, textDecoration: 'none', border: `1px solid ${c}`, borderRadius: '6px', padding: '3px 10px',
        background: 'transparent', whiteSpace: 'nowrap',
      }}>{label} ↗</a>
    );
  }
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', fontFamily: 'var(--fm)', fontSize: '.72rem',
      color: 'var(--text3)', border: '1px dashed var(--border2)', borderRadius: '6px', padding: '3px 10px',
      opacity: .65, whiteSpace: 'nowrap',
    }}>{label} · soon</span>
  );
}

export default function LinAlg() {
  const weeks = lecturesByWeek();
  const [openWeek, setOpenWeek] = useState(CURRENT_WEEK);

  return (
    <>
      <style>{`
        .la-wrap { max-width: 1080px; margin: 0 auto; padding: 0 24px 72px; }
        .la-hero { padding: calc(var(--nav-h) + 3px + 37px + 34px) 24px 30px; border-bottom: 1px solid var(--border);
                   background: linear-gradient(135deg, var(--bg) 0%, var(--bg2) 100%); }
        .la-hero-inner { max-width: 1080px; margin: 0 auto; }

        /* quick-access strip */
        .la-quick { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-top: 26px; }
        .la-quick a { display: flex; flex-direction: column; gap: 4px; padding: 14px 16px; border-radius: 12px;
                      border: 1px solid var(--border); background: var(--surface); text-decoration: none;
                      transition: border-color .15s, transform .15s; }
        .la-quick a:hover { border-color: var(--amber); transform: translateY(-2px); }

        .la-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .la-week { border: 1px solid var(--border); border-radius: 14px; overflow: hidden; margin-bottom: 10px;
                   background: var(--surface); }
        .la-week.cur { border-color: rgba(232,160,32,.5); }
        .la-week-btn { width: 100%; display: flex; align-items: center; gap: 14px; padding: 14px 18px;
                       background: transparent; border: none; cursor: pointer; text-align: left; }
        .la-week-body { overflow: hidden; transition: max-height .3s ease; }
        .la-lec-row { display: flex; align-items: center; gap: 14px; padding: 11px 18px 11px 20px;
                      border-top: 1px solid var(--border); text-decoration: none; transition: background .12s; }
        .la-lec-row:hover { background: var(--bg2); }

        .la-restable { width: 100%; border-collapse: collapse; }
        .la-restable th { text-align: left; padding: 10px 14px; font-family: var(--fm); font-size: .64rem;
                          letter-spacing: .12em; text-transform: uppercase; color: var(--text3); background: var(--bg2); }
        .la-restable td { padding: 10px 14px; border-top: 1px solid var(--border); }

        @media (max-width: 820px) {
          .la-quick { grid-template-columns: repeat(2, 1fr); }
          .la-grid2 { grid-template-columns: 1fr; }
          .la-hero h1 { font-size: clamp(1.7rem, 7vw, 2.2rem) !important; }
        }
      `}</style>

      <Navbar activePage="courses" />

      {/* breadcrumb + course switcher */}
      <div style={{ position: 'sticky', top: 'calc(var(--nav-h) + 3px)', zIndex: 500, background: 'var(--bg2)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '8px 24px', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--fm)', fontSize: '.72rem', color: 'var(--text3)', borderBottom: '1px solid var(--border)' }}>
          <Link href="/" style={{ color: 'var(--amber)' }}>Home</Link><span>›</span>
          <Link href="/courses" style={{ color: 'var(--amber)' }}>Courses</Link><span>›</span>
          <span style={{ color: 'var(--text2)', fontWeight: 500 }}>Linear Algebra</span>
        </div>
        <div style={{ maxWidth: '1080px', margin: '0 auto', display: 'flex', alignItems: 'center', padding: '0 24px', overflowX: 'auto' }}>
          {[
            { href: '/courses/precalc', label: 'Pre-Calculus', active: false },
            { href: '/courses/calc1', label: 'Calculus I', active: false },
            { href: '/courses/linalg', label: 'Linear Algebra', active: true },
          ].map(({ href, label, active }) => (
            <Link key={href} href={href} style={{
              fontFamily: 'var(--fm)', fontSize: '.72rem', letterSpacing: '.06em', textTransform: 'uppercase',
              color: active ? 'var(--amber)' : 'var(--text3)', padding: '9px 18px',
              borderBottom: active ? '2px solid var(--amber)' : '2px solid transparent', whiteSpace: 'nowrap', textDecoration: 'none',
            }}>{label}</Link>
          ))}
        </div>
      </div>

      {/* HERO */}
      <div className="la-hero">
        <div className="la-hero-inner">
          <span className="eyebrow">MATH-120 · Summer 2026 · SSE Core</span>
          <h1 style={{ fontSize: 'clamp(2rem,4vw,3rem)', margin: '6px 0 12px' }}>
            Linear Algebra <em style={{ color: 'var(--amber)', fontStyle: 'italic' }}>with Differential Equations</em>
          </h1>
          <p style={{ maxWidth: '620px', fontSize: '1rem', color: 'var(--text2)', margin: 0 }}>
            The grammar of every linear system in mathematics — taught from the <em>why</em>, not just the <em>how</em>.
            From row reduction to abstract vector spaces, with proofs along the way.
          </p>

          {/* meta line */}
          <div style={{ display: 'flex', gap: '28px', marginTop: '20px', flexWrap: 'wrap' }}>
            {[['Instructor', 'Imran Anwar'], ['Credits', '3ch · 4 lec/wk'], ['Prereq', 'MATH-101'], ['Text', 'Nicholson · Anton'], ['Notes live', `${liveCount()} of ${LECTURES.length}`]].map(([k, v]) => (
              <div key={k}>
                <div style={{ fontFamily: 'var(--fm)', fontSize: '.64rem', color: 'var(--text3)', letterSpacing: '.1em', textTransform: 'uppercase' }}>{k}</div>
                <div style={{ fontSize: '.9rem', color: 'var(--text)', marginTop: '3px' }}>{v}</div>
              </div>
            ))}
          </div>

          {/* QUICK ACCESS — jump links to the four things students use weekly */}
          <div className="la-quick">
            {[
              { href: '#lectures', top: 'Lecture Notes', sub: `${liveCount()} available`, tone: 'var(--amber)' },
              { href: '#resources', top: 'Practice & Problem Sets', sub: 'by week', tone: 'var(--teal)' },
              { href: '#quizzes', top: 'Quizzes', sub: '6 · best 5 count', tone: 'var(--violet)' },
              { href: '#assessment', top: 'Dates & Grading', sub: 'exams · weights', tone: 'var(--amber)' },
            ].map(q => (
              <a key={q.href} href={q.href}>
                <span style={{ fontFamily: 'var(--fm)', fontSize: '.62rem', letterSpacing: '.1em', textTransform: 'uppercase', color: q.tone }}>{q.sub}</span>
                <span style={{ fontFamily: 'var(--fh)', fontSize: '1.02rem', color: 'var(--text)' }}>{q.top}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="la-wrap">

        {/* 01 · LECTURE NOTES — accordion by week */}
        <SectionHeading num="01" title="Lecture Notes" id="lectures"
          note="Grouped by week. The current week is open by default — tap any week to expand." />

        {weeks.map(({ week, lectures }) => {
          const isOpen = openWeek === week;
          const isCur = week === CURRENT_WEEK;
          const liveHere = lectures.filter(l => l.live).length;
          return (
            <div key={week} className={`la-week ${isCur ? 'cur' : ''}`}>
              <button className="la-week-btn" onClick={() => setOpenWeek(isOpen ? -1 : week)} aria-expanded={isOpen}>
                <span style={{ fontFamily: 'var(--fm)', fontSize: '.7rem', letterSpacing: '.1em', textTransform: 'uppercase', color: isCur ? 'var(--amber)' : 'var(--text3)', border: `1px solid ${isCur ? 'var(--amber)' : 'var(--border2)'}`, borderRadius: '7px', padding: '5px 10px', whiteSpace: 'nowrap' }}>
                  Week {week}
                </span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: 'block', fontFamily: 'var(--fh)', fontSize: '1.06rem', color: 'var(--text)' }}>{WEEK_THEMES[week]}</span>
                  <span style={{ fontFamily: 'var(--fm)', fontSize: '.72rem', color: 'var(--text3)' }}>{lectures.length} lectures · {liveHere} live</span>
                </span>
                {isCur && <span style={{ fontFamily: 'var(--fm)', fontSize: '.62rem', color: 'var(--amber)', background: 'var(--amber-lt)', border: '1px solid rgba(232,160,32,.4)', borderRadius: '20px', padding: '3px 10px', whiteSpace: 'nowrap' }}>current</span>}
                <span style={{ color: 'var(--text3)', fontSize: '1.1rem', transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform .25s', flexShrink: 0 }}>›</span>
              </button>

              <div className="la-week-body" style={{ maxHeight: isOpen ? `${lectures.length * 66 + 8}px` : '0px' }}>
                {lectures.map(lec => {
                  const inner = (
                    <>
                      <span style={{ fontFamily: 'var(--fm)', fontSize: '.72rem', color: 'var(--amber)', border: '1px solid var(--amber)', borderRadius: '7px', padding: '5px 9px', whiteSpace: 'nowrap', flexShrink: 0 }}>Lec {lec.n}</span>
                      <span style={{ flex: 1, minWidth: 0 }}>
                        <span style={{ display: 'block', fontSize: '.95rem', color: 'var(--text)', lineHeight: 1.3 }}>{lec.title}</span>
                        <span style={{ fontFamily: 'var(--fm)', fontSize: '.68rem', color: 'var(--text3)' }}>Nicholson {lec.ref} · {lec.date}</span>
                      </span>
                      <span style={{ fontFamily: 'var(--fm)', fontSize: '.72rem', color: lec.live ? 'var(--teal)' : 'var(--text3)', whiteSpace: 'nowrap', flexShrink: 0 }}>{lec.live ? 'open →' : 'soon'}</span>
                    </>
                  );
                  return lec.live
                    ? <Link key={lec.n} href={`/courses/linalg/${lec.slug}`} className="la-lec-row">{inner}</Link>
                    : <div key={lec.n} className="la-lec-row" style={{ opacity: .55 }}>{inner}</div>;
                })}
              </div>
            </div>
          );
        })}

        {/* 02 · RESOURCES — practice / solutions / problem sets, one row per week */}
        <SectionHeading num="02" title="Practice & Problem Sets" id="resources"
          note="Practice problems, worked solutions, and the weekly problem set — one row per week." />
        <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
          <table className="la-restable">
            <thead>
              <tr>
                <th style={{ width: '64px' }}>Week</th>
                <th>Practice Problems</th>
                <th>Solutions</th>
                <th>Problem Set</th>
              </tr>
            </thead>
            <tbody>
              {RESOURCES.map(r => (
                <tr key={r.week} style={r.week === CURRENT_WEEK ? { background: 'var(--amber-lt)' } : undefined}>
                  <td style={{ fontFamily: 'var(--fm)', fontSize: '.8rem', color: 'var(--amber)' }}>W{r.week}</td>
                  <td><Chip href={r.practice.href} label="Practice" tone="teal" /></td>
                  <td><Chip href={r.solutions.href} label="Solutions" tone="violet" /></td>
                  <td><Chip href={r.pset.href} label="Problem Set" tone="amber" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 03 · QUIZZES — separate date strip */}
        <SectionHeading num="03" title="Quizzes" id="quizzes"
          note="Six quizzes across the term · best 5 of 6 count. Papers and solutions post after each quiz." />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))', gap: '10px' }}>
          {QUIZZES.map(q => (
            <div key={q.n} style={{ border: '1px solid var(--border)', borderRadius: '12px', padding: '14px 16px', background: 'var(--surface)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <span style={{ fontFamily: 'var(--fm)', fontSize: '.74rem', color: 'var(--violet)', border: '1px solid var(--violet)', borderRadius: '50%', width: '28px', height: '28px', display: 'grid', placeItems: 'center', flexShrink: 0 }}>{q.n}</span>
                <div>
                  <div style={{ fontFamily: 'var(--fh)', fontSize: '.94rem', color: 'var(--text)' }}>Quiz {q.n}</div>
                  <div style={{ fontFamily: 'var(--fm)', fontSize: '.68rem', color: 'var(--text3)' }}>{q.date} · Mon</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <Chip href={q.sol} label="Solution" tone="teal" />
              </div>
            </div>
          ))}
        </div>

        {/* 04 · ASSESSMENT — grading + exam dates side by side */}
        <SectionHeading num="04" title="Dates & Grading" id="assessment" />
        <div className="la-grid2">
          <div style={{ border: '1px solid var(--border)', borderRadius: '14px', padding: '22px 24px', background: 'var(--surface)' }}>
            <h4 style={{ fontFamily: 'var(--fm)', fontSize: '.7rem', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--text3)', margin: '0 0 16px' }}>Grade Weighting</h4>
            {WEIGHTS.map(([label, pct]) => (
              <div key={label} style={{ marginBottom: '13px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.88rem', marginBottom: '5px' }}>
                  <span>{label}</span><b style={{ fontFamily: 'var(--fm)', color: 'var(--amber)' }}>{pct}%</b>
                </div>
                <div style={{ height: '7px', background: 'rgba(255,255,255,.05)', borderRadius: '50px', overflow: 'hidden' }}>
                  <span style={{ display: 'block', height: '100%', width: `${pct}%`, borderRadius: '50px', background: 'linear-gradient(90deg, var(--teal), var(--amber))' }} />
                </div>
              </div>
            ))}
          </div>
          <div style={{ border: '1px solid var(--border)', borderRadius: '14px', padding: '22px 24px', background: 'var(--surface)' }}>
            <h4 style={{ fontFamily: 'var(--fm)', fontSize: '.7rem', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--text3)', margin: '0 0 16px' }}>Exam Dates</h4>
            {EXAM_DATES.map(e => (
              <div key={e.label} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: '1px dashed var(--border)', flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'var(--fh)', fontSize: '1.02rem', color: 'var(--amber)', minWidth: '72px' }}>{e.label}</span>
                <span style={{ fontFamily: 'var(--fm)', fontSize: '.8rem', color: 'var(--text2)', flex: 1 }}>{e.detail}</span>
                <Chip href={e.sol} label="Midterm-Sol" tone="teal" />
                <Chip href={e.mock} label="Mock Exam" tone="violet" />
              </div>
            ))}
            <div style={{ marginTop: '12px', fontSize: '.76rem', color: 'var(--text3)', fontStyle: 'italic' }}>One quiz is dropped — best 5 of 6 count.</div>
          </div>
        </div>

        {/* 05 · TEACHING TEAM — compact accordion */}
        <SectionHeading num="05" title="Teaching Team" id="team" />
        <details style={boxStyle}>
          <summary style={summaryStyle}>Instructor & 4 TAs — office hours & contact</summary>
          <div style={{ marginTop: '14px', overflowX: 'auto' }}>
            <table className="la-restable">
              <thead>
                <tr><th style={{ width: '70px' }}>Role</th><th>Name</th><th>Email</th><th>Office</th><th>Hours</th></tr>
              </thead>
              <tbody>
                {TEACHING_TEAM.map(t => (
                  <tr key={t.name}>
                    <td style={{ fontFamily: 'var(--fm)', fontSize: '.7rem', color: t.role === 'Instructor' ? 'var(--amber)' : 'var(--teal)' }}>{t.role}</td>
                    <td style={{ fontSize: '.86rem', color: 'var(--text)' }}>{t.name}</td>
                    <td><a href={`mailto:${t.email}`} style={{ color: 'var(--amber)', fontSize: '.8rem', wordBreak: 'break-all' }}>{t.email}</a></td>
                    <td style={{ fontSize: '.82rem', color: 'var(--text2)' }}>{t.office}</td>
                    <td style={{ fontSize: '.82rem', color: t.hours === 'TBA' ? 'var(--text3)' : 'var(--text2)', fontStyle: t.hours === 'TBA' ? 'italic' : 'normal' }}>{t.hours}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>

        {/* 06 · SYLLABUS — collapsed by default */}
        <SectionHeading num="06" title="Full Syllabus" id="syllabus" />
        <details style={boxStyle}>
          <summary style={summaryStyle}>Seven-week outline (Nicholson sections)</summary>
          <div style={{ marginTop: '10px' }}>
            {TIMELINE.map(wk => (
              <div key={wk.no} style={{ borderTop: '1px solid var(--border)', padding: '12px 0' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'var(--fm)', fontSize: '.66rem', letterSpacing: '.1em', color: 'var(--amber)', textTransform: 'uppercase' }}>{wk.no}</span>
                  <span style={{ fontFamily: 'var(--fh)', fontSize: '1.05rem', color: 'var(--text)', flex: 1 }}>{wk.title}</span>
                  <span style={{ fontFamily: 'var(--fm)', fontSize: '.64rem', color: 'var(--text3)', border: '1px solid var(--border2)', padding: '2px 8px', borderRadius: '6px' }}>{wk.ref}</span>
                </div>
                <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none' }}>
                  {wk.items.map(([s, t]) => (
                    <li key={s + t} style={{ display: 'flex', gap: '12px', padding: '3px 0', fontSize: '.86rem', color: 'var(--text2)' }}>
                      <span style={{ fontFamily: 'var(--fm)', fontSize: '.72rem', color: 'var(--teal)', minWidth: '74px' }}>{s}</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </details>

        {/* 07 · WEEKLY SCHEDULE — moved to the end, as requested */}
        <SectionHeading num="07" title="Weekly Schedule" id="schedule" />
        <Schedule />

        {/* footer nav */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '28px 0 0', marginTop: '32px', borderTop: '1px solid var(--border)', flexWrap: 'wrap', gap: '12px' }}>
          <Link href="/courses/calc1" style={navBtn(false)}>← Calculus I</Link>
          <Link href="/courses" style={navBtn(true)}>All Courses →</Link>
        </div>
      </div>

      <Footer />
    </>
  );
}

/* ─── presentational helpers ─── */
function SectionHeading({ num, title, id, note }) {
  return (
    <div id={id} style={{ scrollMarginTop: 'calc(var(--nav-h) + 80px)', margin: '44px 0 18px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px' }}>
        <span style={{ fontFamily: 'var(--fm)', color: 'var(--amber)', fontSize: '.82rem' }}>{num}</span>
        <h3 style={{ fontFamily: 'var(--fh)', fontSize: '1.5rem', color: 'var(--text)', margin: 0 }}>{title}</h3>
        <span style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
      </div>
      {note && <p style={{ fontSize: '.84rem', color: 'var(--text3)', margin: '8px 0 0', paddingLeft: '28px' }}>{note}</p>}
    </div>
  );
}

function Schedule() {
  const { startHour, endHour, days, events } = SCHEDULE;
  const totalMin = (endHour - startHour) * 60;
  const pxPerMin = 0.9;
  const gridH = totalMin * pxPerMin;
  const colors = {
    lecture: { bg: 'rgba(232,160,32,.18)', bd: 'var(--amber)' },
    tutorial: { bg: 'rgba(56,201,176,.18)', bd: 'var(--teal)' },
    office: { bg: 'rgba(155,128,232,.18)', bd: 'var(--violet)' },
  };
  const hours = [];
  for (let h = startHour; h <= endHour; h++) hours.push(h);
  const fmt = (t) => {
    const h = Math.floor(t), m = Math.round((t - h) * 60);
    const ap = h >= 12 ? 'pm' : 'am';
    const h12 = h % 12 === 0 ? 12 : h % 12;
    return `${h12}:${m.toString().padStart(2, '0')}${ap}`;
  };
  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden', background: 'var(--surface)' }}>
      <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap', padding: '14px 18px', borderBottom: '1px solid var(--border)', fontSize: '.78rem' }}>
        {[['lecture', 'Lecture'], ['tutorial', 'Tutorial'], ['office', 'Office Hours']].map(([k, label]) => (
          <span key={k} style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', color: 'var(--text2)' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: colors[k].bg, border: `1px solid ${colors[k].bd}` }} />{label}
          </span>
        ))}
      </div>
      <div style={{ overflowX: 'auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: `64px repeat(${days.length}, minmax(110px, 1fr))`, minWidth: '640px' }}>
          <div style={{ borderBottom: '1px solid var(--border)' }} />
          {days.map(d => (
            <div key={d} style={{ padding: '10px 8px', textAlign: 'center', fontFamily: 'var(--fm)', fontSize: '.72rem', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--text2)', borderBottom: '1px solid var(--border)', borderLeft: '1px solid var(--border)' }}>{d}</div>
          ))}
          <div style={{ position: 'relative', height: `${gridH}px` }}>
            {hours.map(h => (
              <div key={h} style={{ position: 'absolute', top: `${(h - startHour) * 60 * pxPerMin}px`, right: '8px', fontFamily: 'var(--fm)', fontSize: '.64rem', color: 'var(--text3)', transform: 'translateY(-50%)' }}>{fmt(h)}</div>
            ))}
          </div>
          {days.map((d, di) => (
            <div key={d} style={{ position: 'relative', height: `${gridH}px`, borderLeft: '1px solid var(--border)' }}>
              {hours.map(h => (
                <div key={h} style={{ position: 'absolute', top: `${(h - startHour) * 60 * pxPerMin}px`, left: 0, right: 0, borderTop: '1px solid var(--border)', opacity: .5 }} />
              ))}
              {events.filter(e => e.day === di).map((e, ei) => {
                const top = (e.start - startHour) * 60 * pxPerMin;
                const hgt = (e.end - e.start) * 60 * pxPerMin;
                const c = colors[e.type];
                return (
                  <div key={ei} style={{ position: 'absolute', top: `${top}px`, height: `${hgt}px`, left: '4px', right: '4px', background: c.bg, borderLeft: `3px solid ${c.bd}`, borderRadius: '5px', padding: '5px 7px', overflow: 'hidden' }}>
                    <div style={{ fontSize: '.72rem', fontWeight: 600, color: 'var(--text)', lineHeight: 1.2 }}>{e.title}</div>
                    <div style={{ fontFamily: 'var(--fm)', fontSize: '.6rem', color: 'var(--text2)', marginTop: '2px' }}>{fmt(e.start)}–{fmt(e.end)}</div>
                    <div style={{ fontFamily: 'var(--fm)', fontSize: '.6rem', color: 'var(--text3)' }}>{e.loc}</div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const boxStyle = { border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '16px 20px', background: 'var(--surface)' };
const summaryStyle = { cursor: 'pointer', fontFamily: 'var(--fh)', fontSize: '1.1rem', color: 'var(--text)', listStyle: 'none' };
const navBtn = (primary) => ({
  display: 'inline-flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--fm)', fontSize: '.74rem',
  letterSpacing: '.08em', textTransform: 'uppercase', padding: '8px 18px', borderRadius: '8px', textDecoration: 'none',
  color: primary ? 'var(--amber)' : 'var(--text3)',
  border: primary ? '1px solid rgba(232,160,32,.4)' : '1px solid var(--border)',
  background: primary ? 'var(--amber-lt)' : 'transparent',
});