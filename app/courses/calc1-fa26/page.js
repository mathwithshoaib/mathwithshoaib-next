'use client';

import { useState, useEffect, Fragment } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

/* ═════════════════════════════════════════════════════════════════
   MATH-101 · CALCULUS I (Non-SSE) — FALL 2026 — COURSE HOME
   Route: /courses/calc1-fa26

   Content below (description, grading breakdown, exam format, weekly
   outline, CLOs) is transcribed from the official LUMS syllabus (Sections
   III-V, Fall 2026-2027). Two things were deliberately left out/reworded:
   - The syllabus's midterm dates (03-10-2025 / 07-11-2025) predate this
     Fall-2026 offering by a year — clearly carried over from an older
     template — so they're shown as "TBA" here rather than repeating a
     wrong date.
   - The AI-policy section is condensed to the 2 levels that actually apply
     to this course (No AI for exams, Full AI for Webwork) instead of the
     full 5-level LUMS rubric, which would mostly be noise here.

   Teaching Team is NOT hardcoded — it's fetched live from the same roster
   the schedule admin panel manages, so it can never drift out of sync with
   the schedule. Lecture-note / recitation links in the Resources section
   ARE hardcoded (LECTURE_NOTES / RECITATIONS below) since they're files
   instructors send over time, not something that needs a database — add a
   URL as each one arrives and it goes live immediately.
   ═════════════════════════════════════════════════════════════════ */

async function api(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error('Failed to load');
  return res.json();
}

const SWITCHER = [
  { href: '/courses/precalc', label: 'Pre-Calculus' },
  { href: '/courses/calc1', label: 'Calculus I · Fall 2025' },
  { href: '/courses/calc1-fa26', label: 'Calculus I · Non-SSE · Fall 2026', active: true },
  { href: '/courses/linalg', label: 'Linear Algebra · Summer 2026' },
];

const WEEK_COUNT = 14;
const WEEKS = Array.from({ length: WEEK_COUNT }, (_, i) => i + 1);

// One lecture-notes link per instructor per week. Keyed by the exact name
// as entered in the schedule admin's Teaching Team roster, so this table's
// columns always line up with whoever's actually listed there — no name
// here yet means that column just won't render until the roster has a
// matching instructor. Fill in a URL as each instructor sends their notes;
// `null` shows as "Coming soon" instead of a dead link.
const LECTURE_NOTES = {
  'Imran Anwar': Array(WEEK_COUNT).fill(null),
  'Adnan Khan': Array(WEEK_COUNT).fill(null),
  'Omar Malik': Array(WEEK_COUNT).fill(null),
};

// All 3 recitation sections use the same slides/notes each week (not
// per-TF), so this is one row per week rather than one per section.
const RECITATIONS = [
  { slides: 'https://canva.link/fa26-w1-cal-1-racitation-shoaib', notes: 'https://drive.google.com/file/d/1I53YOLf9ivn13hK4_u4XhNTMXJEtuPYn/view?usp=sharing' },
  ...Array.from({ length: WEEK_COUNT - 1 }, () => ({ slides: null, notes: null })),
];

// 14-week outline, straight from the syllabus's Course Overview table.
// `mid` marks the banner shown right after that week.
const COURSE_OUTLINE = [
  { topics: ['A preview of calculus', 'Review of functions & models (Econ/Business/Social Science lens)'], sections: 'HBSP 1.1–1.4' },
  { topics: ['Limits (with graphical applets)', 'Continuity (with graphical applets)'], sections: 'HBSP 1.5, 1.6' },
  { topics: ['The Derivative (with graphical applets)', 'Techniques of Differentiation'], sections: 'HBSP 2.1, 2.2' },
  { topics: ['Product & Quotient Rules; Higher-Order Derivatives', 'The Chain Rule'], sections: 'HBSP 2.3, 2.4' },
  { topics: ['Marginal Analysis & Approximations', 'Linear Approximation using Increments'], sections: 'HBSP 2.5', mid: 'Midterm I' },
  { topics: ['Implicit Differentiation & Related Rates', 'Increasing & Decreasing Functions'], sections: 'HBSP 2.6, 3.1' },
  { topics: ['Relative Extrema (with graphical applets)', 'Concavity & Points of Inflection'], sections: 'HBSP 3.1, 3.2' },
  { topics: ['Optimization; Elasticity of Demand', 'Applied Optimization'], sections: 'HBSP 3.3, 3.4' },
  { topics: ['Exponential & Logarithmic Functions', 'Their Differentiation & Applications'], sections: 'HBSP 4.1–4.4' },
  { topics: ['Indefinite Integration & Differential Equations', 'Integration by Substitution'], sections: 'HBSP 5.1, 5.2', mid: 'Midterm II' },
  { topics: ['The Definite Integral & Fundamental Theorem of Calculus', 'Distribution of Wealth & Average Value'], sections: 'HBSP 5.3, 5.4' },
  { topics: ['Additional Applications of Integration', '(Business, Economics & Social Sciences)'], sections: 'HBSP 5.5, 5.6' },
  { topics: ['Integration by Parts; Integral Tables', "Evaluating Limits with L'Hôpital's Rule"], sections: 'HBSP 6.1, A.3' },
  { topics: ['Numerical Integration — Trapezoidal & Simpson’s Rule', 'Improper Integrals — Intro to Continuous Probability'], sections: 'HBSP 6.2, 6.3, 6.4' },
].map((row, i) => ({ week: i + 1, ...row }));

const GRADING = [
  { label: 'Midterm I', pct: 25, color: 'var(--amber)' },
  { label: 'Midterm II', pct: 25, color: 'var(--rose)' },
  { label: 'Webwork', pct: 10, color: 'var(--violet)' },
  { label: 'Final Exam', pct: 40, color: 'var(--teal)' },
];

const EXAMS = [
  { label: 'Midterm I', duration: '120 minutes', date: 'Oct 3, 2026', tentative: true, spec: 'No notes · No books · No AI' },
  { label: 'Midterm II', duration: '120 minutes', date: 'Nov 7, 2026', tentative: true, spec: 'No notes · No books · No AI' },
  { label: 'Final Exam', duration: '3 hours', date: 'TBA', spec: 'No notes · No books · No AI' },
];

const CLOS = [
  { color: 'var(--amber)', text: 'Develop a solid grasp of the foundational concepts of calculus — limits, continuity, differentiation, and integration — and their theoretical and practical significance.' },
  { color: 'var(--teal)', text: 'Apply differentiation and integration techniques to real-world problems in economics, biology, and social sciences: rates of change, optimization, and area/accumulation problems.' },
  { color: 'var(--violet)', text: 'Understand Riemann integrals as anti-derivatives, and evaluate integrals using advanced techniques of integration to solve mathematical problems.' },
];

export default function Calc1Fa26() {
  const [roster, setRoster] = useState(null);

  useEffect(() => {
    api('/api/schedule/state').then(setRoster).catch(() => {});
  }, []);

  const instructors = roster?.instructors || [];
  const tfs = roster?.tfs || [];
  const tas = roster?.tas || [];

  return (
    <>
      <style>{`
        .c26-wrap { max-width: 1080px; margin: 0 auto; padding: 0 24px 80px; }
        .c26-section { margin-bottom: 48px; }
        .c26-team-cols { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
        .c26-team-row { display: flex; gap: 8px; padding: 6px 0; border-bottom: 1px solid var(--border); }
        .c26-team-row:last-child { border-bottom: none; }
        .c26-clo-cols { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
        .c26-cta { display: flex; align-items: center; justify-content: space-between; gap: 20px; flex-wrap: wrap;
                   border: 1px solid rgba(232,160,32,.4); border-radius: var(--radius); padding: 24px 28px;
                   background: linear-gradient(135deg, var(--amber-lt) 0%, transparent 100%); }
        .c26-resources-cols { display: grid; grid-template-columns: 1.55fr 1fr; gap: 20px; align-items: start; }
        .c26-table-scroll { overflow-x: auto; }
        .c26-table { width: 100%; border-collapse: collapse; font-size: .82rem; min-width: 360px; }
        .c26-table th { text-align: left; font-family: var(--fm); font-size: .6rem; letter-spacing: .07em; text-transform: uppercase;
                        color: var(--text3); padding: 6px 10px; border-bottom: 1px solid var(--border); white-space: nowrap; }
        .c26-table td { padding: 7px 10px; border-bottom: 1px solid var(--border); color: var(--text); vertical-align: top; }
        .c26-table tbody tr:last-child td { border-bottom: none; }
        .c26-soon { font-family: var(--fm); font-size: .67rem; color: var(--text3); opacity: .5; }
        .c26-mid-row td { background: linear-gradient(90deg, rgba(232,160,32,.16), rgba(224,107,107,.16));
                          font-family: var(--fh); font-size: .92rem; font-weight: 600; text-align: center; color: var(--text); }
        .c26-quickfacts { display: flex; gap: 28px; margin-top: 22px; flex-wrap: wrap; }
        .c26-bar { display: flex; height: 14px; border-radius: 8px; overflow: hidden; border: 1px solid var(--border); }
        @media (max-width: 900px) { .c26-resources-cols { grid-template-columns: 1fr; } }
        @media (max-width: 720px) { .c26-team-cols, .c26-clo-cols { grid-template-columns: 1fr; } }
        @media (max-width: 640px) { .c26-cta { flex-direction: column; align-items: flex-start; } }
      `}</style>

      <Navbar activePage="courses" />

      {/* breadcrumb + course switcher */}
      <div style={{ position: 'sticky', top: 'calc(var(--nav-h) + 3px)', zIndex: 500, background: 'var(--bg2)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '8px 24px', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--fm)', fontSize: '.72rem', color: 'var(--text3)', borderBottom: '1px solid var(--border)' }}>
          <Link href="/" style={{ color: 'var(--amber)' }}>Home</Link><span>›</span>
          <Link href="/courses" style={{ color: 'var(--amber)' }}>Courses</Link><span>›</span>
          <span style={{ color: 'var(--text2)', fontWeight: 500 }}>Calculus I · Non-SSE · FA26</span>
        </div>
        <div style={{ maxWidth: '1080px', margin: '0 auto', display: 'flex', alignItems: 'center', padding: '0 24px', overflowX: 'auto' }}>
          {SWITCHER.map(({ href, label, active }) => (
            <Link key={href} href={href} style={{
              fontFamily: 'var(--fm)', fontSize: '.72rem', letterSpacing: '.06em', textTransform: 'uppercase',
              color: active ? 'var(--amber)' : 'var(--text3)', padding: '9px 18px',
              borderBottom: active ? '2px solid var(--amber)' : '2px solid transparent', whiteSpace: 'nowrap', textDecoration: 'none',
            }}>{label}</Link>
          ))}
        </div>
      </div>

      {/* HERO */}
      <div style={{ padding: 'calc(var(--nav-h) + 3px + 37px) 24px 40px', borderBottom: '1px solid var(--border)',
                    background: 'linear-gradient(135deg, var(--bg) 0%, var(--bg2) 100%)' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
          <span className="eyebrow">MATH 101 · Sections III–V · Non-SSE · Fall 2026</span>
          <h1 style={{ fontSize: 'clamp(2rem,4vw,3rem)', margin: '6px 0 14px' }}>
            Calculus I <em style={{ color: 'var(--amber)', fontStyle: 'italic' }}>— Non-SSE</em>
          </h1>
          <p style={{ maxWidth: '660px', fontSize: '1.02rem', color: 'var(--text2)' }}>
            An accessible, rigorous introduction to differentiation and integration of functions of one variable —
            built for students headed into business, economics, and the social and life sciences rather than pure
            math. Emphasis throughout is on using calculus as a problem-solving tool: rates of change, optimization,
            accumulation, and what they mean in a real model, not just how to compute them.
          </p>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', margin: '16px 0' }}>
            {['Limits', 'Differentiation', 'Optimization', 'Integration', 'Applications'].map((t) => (
              <span key={t} className="tag tag-amber">{t}</span>
            ))}
          </div>

          <div className="c26-quickfacts">
            {[
              ['Credits', '3'],
              ['Format', '2 lectures/week · 75 min · + weekly tutorial'],
              ['Prereq', 'MATH 100, or Math in A-Levels/FSc, or equivalent'],
              ['Textbook', 'Hoffman, Bradley, Sobecki & Price — 11th ed.'],
            ].map(([k, v]) => (
              <div key={k}>
                <div style={{ fontFamily: 'var(--fm)', fontSize: '.64rem', color: 'var(--text3)', letterSpacing: '.1em', textTransform: 'uppercase' }}>{k}</div>
                <div style={{ fontSize: '.88rem', color: 'var(--text)', marginTop: '3px', maxWidth: '220px' }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="c26-wrap">

        {/* GRADING & EXAMS */}
        <div className="c26-section" style={{ marginTop: '40px' }}>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '16px' }}>Grading &amp; exams</h3>
          <div className="card" style={{ padding: '22px 24px', marginBottom: '14px' }}>
            <div className="c26-bar">
              {GRADING.map((g) => <div key={g.label} title={`${g.label} — ${g.pct}%`} style={{ width: `${g.pct}%`, background: g.color }} />)}
            </div>
            <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap', marginTop: '12px' }}>
              {GRADING.map((g) => (
                <span key={g.label} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '.8rem', color: 'var(--text2)' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: g.color, flexShrink: 0 }} />
                  {g.label} · {g.pct}%
                </span>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '14px' }}>
            {EXAMS.map((e) => (
              <div key={e.label} className="card" style={{ padding: '16px 18px' }}>
                <div style={{ fontFamily: 'var(--fm)', fontSize: '.66rem', color: 'var(--amber)', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: '4px' }}>{e.label}</div>
                <div style={{ fontSize: '.92rem', color: 'var(--text)' }}>{e.duration}</div>
                <div style={{ fontSize: '.76rem', color: 'var(--text3)', marginTop: '2px' }}>
                  Date: {e.date}{e.tentative && <span style={{ color: 'var(--amber)', opacity: .8 }}> (tentative)</span>}
                </div>
                <div style={{ fontSize: '.72rem', color: 'var(--text3)', marginTop: '6px' }}>{e.spec}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px', marginBottom: '14px' }}>
            <div className="card" style={{ padding: '16px 18px', borderLeft: '3px solid var(--rose)' }}>
              <div style={{ fontFamily: 'var(--fm)', fontSize: '.66rem', color: 'var(--rose)', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: '4px' }}>🚫 No AI — Midterms &amp; Final</div>
              <p style={{ fontSize: '.82rem', color: 'var(--text2)', margin: 0 }}>Completed entirely without AI assistance. AI must not be used at any point during these assessments.</p>
            </div>
            <div className="card" style={{ padding: '16px 18px', borderLeft: '3px solid var(--teal)' }}>
              <div style={{ fontFamily: 'var(--fm)', fontSize: '.66rem', color: 'var(--teal)', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: '4px' }}>✦ Full AI — Webwork</div>
              <p style={{ fontSize: '.82rem', color: 'var(--text2)', margin: 0 }}>AI may be used as a co-pilot throughout Webwork to support your own work — no need to flag which content is AI-assisted.</p>
            </div>
          </div>

          <ul style={{ fontSize: '.82rem', color: 'var(--text3)', margin: 0, paddingLeft: '18px', lineHeight: 1.7 }}>
            <li>Grading is relative.</li>
            <li>No grade-change requests are entertained once grades are finalized.</li>
          </ul>
        </div>

        {/* SCHEDULE CTA */}
        <div className="c26-section">
          <div className="c26-cta">
            <div>
              <div style={{ fontFamily: 'var(--fm)', fontSize: '.68rem', color: 'var(--amber)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: '6px' }}>Live</div>
              <h3 style={{ margin: '0 0 6px' }}>Weekly schedule</h3>
              <p style={{ margin: 0, color: 'var(--text2)', fontSize: '.92rem', maxWidth: '480px' }}>
                Lectures, office hours, recitations, and tutorial venues — updated live. TAs pick their own tutorial seat and office hours here too.
              </p>
            </div>
            <Link href="/courses/calc1-fa26/schedule" className="btn" style={{ flexShrink: 0 }}>Open schedule →</Link>
          </div>
        </div>

        {/* TEACHING TEAM — fetched live from the schedule roster */}
        <div className="c26-section">
          <h3 style={{ fontSize: '1.3rem', marginBottom: '16px' }}>Teaching team</h3>
          {!roster ? (
            <p style={{ color: 'var(--text3)', fontSize: '.9rem' }}>Loading…</p>
          ) : instructors.length === 0 && tfs.length === 0 && tas.length === 0 ? (
            <p style={{ color: 'var(--text3)', fontSize: '.9rem' }}>Team roster not added yet — add instructors/TFs/TAs via the schedule admin panel.</p>
          ) : (
            <div className="c26-team-cols">
              <TeamColumn title="Instructors" accent="var(--amber)" people={instructors} details />
              <TeamColumn title="TFs" accent="var(--rose)" people={tfs} details />
              <TeamColumn title="TAs" accent="var(--teal)" people={tas} />
            </div>
          )}
          <p style={{ fontSize: '.74rem', color: 'var(--text3)', marginTop: '12px' }}>
            This list is managed in one place (schedule admin panel → Teaching team) and shared with the schedule page, so it's always in sync.
          </p>
        </div>

        {/* RESOURCES — lecture notes (per instructor) + recitation slides/notes (shared across sections) */}
        <div className="c26-section">
          <h3 style={{ fontSize: '1.3rem', marginBottom: '4px' }}>Resources</h3>
          <p style={{ fontSize: '.82rem', color: 'var(--text3)', marginBottom: '16px' }}>
            Lecture notes are posted per instructor, week by week. Recitation slides &amp; notes are shared across all 3 sections that week.
          </p>
          <div className="c26-resources-cols">
            <div className="card" style={{ padding: '20px 22px' }}>
              <h4 style={{ fontSize: '1rem', marginBottom: '2px' }}>Lecture notes</h4>
              <p style={{ fontSize: '.74rem', color: 'var(--text3)', marginBottom: '12px' }}>Provided by each instructor.</p>
              {!roster ? (
                <p style={{ color: 'var(--text3)', fontSize: '.85rem' }}>Loading…</p>
              ) : instructors.length === 0 ? (
                <p style={{ color: 'var(--text3)', fontSize: '.85rem' }}>No instructors on the roster yet.</p>
              ) : (
                <div className="c26-table-scroll">
                  <table className="c26-table">
                    <thead>
                      <tr>
                        <th>Week</th>
                        {instructors.map((p) => <th key={p.id}>{p.name}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {WEEKS.map((w) => (
                        <tr key={w}>
                          <td style={{ whiteSpace: 'nowrap', color: 'var(--text2)' }}>Week {w}</td>
                          {instructors.map((p) => {
                            const href = (LECTURE_NOTES[p.name] || [])[w - 1];
                            return (
                              <td key={p.id}>
                                {href
                                  ? <Link href={href} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--teal)', textDecoration: 'none', fontFamily: 'var(--fm)', fontSize: '.72rem' }}>View →</Link>
                                  : <span className="c26-soon">Coming soon</span>}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="card" style={{ padding: '20px 22px', borderTop: '3px solid var(--rose)' }}>
              <h4 style={{ fontSize: '1rem', marginBottom: '2px' }}>Recitation resources</h4>
              <p style={{ fontSize: '.74rem', color: 'var(--text3)', marginBottom: '12px' }}>Same slides/notes for all 3 sections.</p>
              <div className="c26-table-scroll">
                <table className="c26-table">
                  <thead><tr><th>Week</th><th>Slides</th><th>Notes</th></tr></thead>
                  <tbody>
                    {WEEKS.map((w) => {
                      const r = RECITATIONS[w - 1] || {};
                      return (
                        <tr key={w}>
                          <td style={{ whiteSpace: 'nowrap', color: 'var(--text2)' }}>Week {w}</td>
                          <td>
                            {r.slides
                              ? <Link href={r.slides} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--rose)', textDecoration: 'none', fontFamily: 'var(--fm)', fontSize: '.72rem' }}>Slides →</Link>
                              : <span className="c26-soon">Coming soon</span>}
                          </td>
                          <td>
                            {r.notes
                              ? <Link href={r.notes} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--rose)', textDecoration: 'none', fontFamily: 'var(--fm)', fontSize: '.72rem' }}>PDF →</Link>
                              : <span className="c26-soon">Coming soon</span>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* PROBLEM SETS CTA */}
        <div className="c26-section">
          <div className="c26-cta" style={{ borderColor: 'rgba(155,128,232,.4)', background: 'linear-gradient(135deg, rgba(155,128,232,.12) 0%, transparent 100%)' }}>
            <div>
              <div style={{ fontFamily: 'var(--fm)', fontSize: '.68rem', color: 'var(--violet)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: '6px' }}>Practice</div>
              <h3 style={{ margin: '0 0 6px' }}>Weekly problem sets</h3>
              <p style={{ margin: 0, color: 'var(--text2)', fontSize: '.92rem', maxWidth: '480px' }}>
                One problem set per week, posted alongside the lecture notes as the term goes on. Nothing's up yet — the page is ready for when they are.
              </p>
            </div>
            <Link href="/courses/calc1-fa26/problem-sets" className="btn btn-outline" style={{ flexShrink: 0, borderColor: 'var(--violet)', color: 'var(--violet)' }}>View problem sets →</Link>
          </div>
        </div>

        {/* 14-WEEK COURSE OUTLINE */}
        <div className="c26-section">
          <h3 style={{ fontSize: '1.3rem', marginBottom: '16px' }}>14-week course outline</h3>
          <div className="card" style={{ padding: '10px 4px 4px' }}>
            <div className="c26-table-scroll">
              <table className="c26-table" style={{ minWidth: '480px' }}>
                <thead><tr><th style={{ paddingLeft: '18px' }}>Week</th><th>Topics</th><th style={{ paddingRight: '18px' }}>Sections</th></tr></thead>
                <tbody>
                  {COURSE_OUTLINE.map((row) => (
                    <Fragment key={row.week}>
                      <tr>
                        <td style={{ paddingLeft: '18px', whiteSpace: 'nowrap', color: 'var(--text2)', fontFamily: 'var(--fm)', fontSize: '.76rem' }}>Wk {row.week}</td>
                        <td>{row.topics.map((t, i) => <div key={i} style={{ marginBottom: i < row.topics.length - 1 ? '3px' : 0 }}>{t}</div>)}</td>
                        <td style={{ paddingRight: '18px', whiteSpace: 'nowrap', fontFamily: 'var(--fm)', fontSize: '.72rem', color: 'var(--text3)' }}>{row.sections}</td>
                      </tr>
                      {row.mid && (
                        <tr className="c26-mid-row"><td colSpan={3}>{row.mid}</td></tr>
                      )}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* COURSE LEARNING OUTCOMES */}
        <div className="c26-section">
          <h3 style={{ fontSize: '1.3rem', marginBottom: '16px' }}>Course learning outcomes</h3>
          <div className="c26-clo-cols">
            {CLOS.map((c, i) => (
              <div key={i} className="card" style={{ padding: '18px 20px', borderTop: `3px solid ${c.color}` }}>
                <div style={{ fontFamily: 'var(--fm)', fontSize: '.66rem', color: c.color, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: '6px' }}>CLO {i + 1}</div>
                <p style={{ fontSize: '.86rem', color: 'var(--text2)', margin: 0, lineHeight: 1.55 }}>{c.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* PRACTICE MATERIAL — points to the Fall 2025 offering */}
        <div className="c26-section">
          <div className="card" style={{ padding: '22px 24px', display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            <div style={{ maxWidth: '580px' }}>
              <div style={{ fontFamily: 'var(--fm)', fontSize: '.66rem', color: 'var(--teal)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: '4px' }}>Practice material</div>
              <h4 style={{ margin: '0 0 6px' }}>Looking for extra practice?</h4>
              <p style={{ margin: 0, fontSize: '.88rem', color: 'var(--text2)' }}>
                The Fall 2025 offering of Calculus I covers the same material — its lecture notes and practice quizzes are still live.
                Use it alongside this section for extra worked examples while this term's own notes go up.
              </p>
            </div>
            <Link href="/courses/calc1" className="btn btn-outline" style={{ flexShrink: 0 }}>Browse Fall 2025 notes →</Link>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '24px', borderTop: '1px solid var(--border)', flexWrap: 'wrap', gap: '12px' }}>
          <Link href="/courses/calc1" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--fm)', fontSize: '.74rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--text3)', padding: '8px 18px', border: '1px solid var(--border)', borderRadius: '8px', textDecoration: 'none' }}>
            ← Calculus I (Fall 2025)
          </Link>
          <Link href="/courses" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--fm)', fontSize: '.74rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--amber)', padding: '8px 18px', border: '1px solid rgba(232,160,32,.4)', borderRadius: '8px', background: 'rgba(232,160,32,.07)', textDecoration: 'none' }}>
            All Courses →
          </Link>
        </div>
      </div>

      <Footer />
    </>
  );
}

// One compact numbered column of the Teaching Team section. `details` shows
// a small office/email line under each name (instructors/TFs); TAs just
// get the name — a title says which column is which, so per-row labels
// would be redundant.
function TeamColumn({ title, accent, people, details }) {
  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: '12px', padding: '14px 16px', background: 'var(--surface)', borderTop: `3px solid ${accent}` }}>
      <h4 style={{ fontFamily: 'var(--fm)', fontSize: '.68rem', letterSpacing: '.1em', textTransform: 'uppercase', color: accent, margin: '0 0 8px' }}>
        {title} {people.length > 0 && <span style={{ color: 'var(--text3)' }}>· {people.length}</span>}
      </h4>
      {people.length === 0 ? (
        <div style={{ fontSize: '.8rem', color: 'var(--text3)', padding: '6px 0' }}>None yet.</div>
      ) : (
        people.map((p, i) => (
          <div key={p.id} className="c26-team-row">
            <span style={{ fontFamily: 'var(--fm)', fontSize: '.72rem', color: 'var(--text3)', flexShrink: 0, width: '16px' }}>{i + 1}.</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '.86rem', color: 'var(--text)' }}>{p.name}</div>
              {details && (p.office || p.email) && (
                <div style={{ fontSize: '.68rem', color: 'var(--text3)', marginTop: '2px' }}>
                  {[p.office, p.email].filter(Boolean).join(' · ')}
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
