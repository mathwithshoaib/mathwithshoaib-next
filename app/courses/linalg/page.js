import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export const metadata = {
  title: 'Linear Algebra with Differential Equations · MATH-120 · Shoaib-K · LUMS',
  description:
    'MATH-120 Linear Algebra with Differential Equations at LUMS — systems of equations, matrix algebra, determinants, vector spaces, eigentheory, orthogonality, and linear maps. Weekly tutorials, problem sets, quizzes, and mock exams.',
};

/* ─────────────────────────────────────────────────────────────
   EDIT-ME DATA BLOCKS
   Everything you update week-to-week lives in these arrays.
   Set href to a real URL to make a link live; leave it null to
   show a greyed-out "Coming soon" placeholder.
   ───────────────────────────────────────────────────────────── */

// Teaching team — fill Hajra's details once decided.
const TEACHING_TEAM = [
  {
    role: 'Instructor',
    name: 'Imran Anwar',
    email: 'imran.anwar@lums.edu.pk',      // ← update if needed
    office: '9-155A (SSE Building)',                          // ← e.g. "9-xxx, SBASSE"
    hours: '04:00 – 05:00 (Monday - Thursday)',                           // ← e.g. "Mon & Wed, 3–4 PM"
  },
  {
    role: 'Teaching Assistant',
    name: 'Muhammad Shoaib Khan',
    email: 'shoaib.khan@lums.edu.pk',      // ← update if needed
    office: '9-155 SSE',                          // ← e.g. "9-xxx, SBASSE"
    hours: '01:00 - 02:00 (Monday - Thursday)',                           // ← e.g. "Mon & Wed, 3–4 PM"
  },
  {
    role: 'Teaching Assistant',
    name: 'Hajra Mahmood',                          // ← update full name
    email: '28100096@lums.edu.pk',                           // ← update
    office: 'TBA',                          // ← update
    hours: 'TBA',                           // ← update
  },
];

// Course timeline — 7 weeks. Each week has sections + an aim.
const TIMELINE = [
  {
    no: 'Week 01', title: 'Systems of Linear Equations', ref: 'Ch 1',
    items: [
      ['§1.2', 'Elementary row operations, echelon form & rank'],
      ['§1.2', 'Gaussian elimination method'],
      ['§1.3', 'Homogeneous equations'],
      ['§1.4', 'Electrical networks & chemical reactions'],
    ],
    aim: 'Rank introduced via row-echelon form; applications to network flow.',
  },
  {
    no: 'Week 02', title: 'Matrix Algebra & Factorization', ref: 'Ch 2–3',
    items: [
      ['§2.2–2.3', 'Transpose, multiplication, inverses'],
      ['§2.6–2.7', 'LU factorization, input–output economic model'],
    ],
    aim: 'Matrix operations, inverse methods & elementary matrices.',
  },
  {
    no: 'Week 03', title: 'Determinants & Diagonalization', ref: 'Ch 3',
    items: [
      ['§3.1–3.2', 'Cofactor expansion, properties, adjugate & inverse'],
      ['§3.3', 'Diagonalization, eigenvalues, linear dynamical systems'],
    ],
    aim: 'First taste of dynamical systems through diagonalization.',
  },
  {
    no: 'Week 04', title: 'Vector Space ℝⁿ', ref: 'Ch 5–6',
    items: [
      ['§6.1', 'Vector space examples & basic properties'],
      ['§5.1', 'Subspaces, spanning, independence & dependence'],
      ['§6.2–6.3', 'Basis & dimension'],
    ],
    aim: 'Theory built in ℝⁿ, then expanded to the abstract setting.',
  },
  {
    no: 'Week 05', title: 'Orthogonality & Polynomials', ref: 'Ch 8',
    items: [
      ['§8.1', 'Orthogonal & orthonormal bases (Gram–Schmidt)'],
      ['§8.2', 'Orthogonal diagonalization'],
      ['§8.9', 'An application to quadratic forms'],
    ],
    aim: 'Projections, complements, and the Gram–Schmidt process.',
  },
  {
    no: 'Week 06', title: 'Linear Transformations', ref: 'Ch 7 & 2',
    items: [
      ['§7.1', 'Linear transformation examples & properties'],
      ['§2.5', 'Matrix of a transformation'],
      ['§7.2', 'Kernel, image & the dimension theorem'],
    ],
    aim: 'Basic theory of linear maps, again grounded in ℝⁿ.',
  },
  {
    no: 'Week 07', title: 'Applications', ref: 'Ch 10 & 8',
    items: [
      ['§10.2', 'Legendre interpolation polynomial'],
      ['§8.10', 'Systems of differential equations via eigenvalues'],
    ],
    aim: 'Where basis and eigenvalues earn their keep.',
  },
];

// Midterm checkpoint, inserted after this many weeks (after Week 03).
const MIDTERM = { after: 3, label: 'Midterm Examination', detail: '03 July · 10:00 AM · Weeks 1–3 · 30%' };

// Tutorials — one PDF per TA per week. Topic = link text.
// To make a link live: replace href: null with the PDF URL.
const TUTORIALS = [
  { week: 1, shoaib: { topic: 'Row Reduction & Echelon Forms', href: null }, hajra: { topic: 'Row Reduction & Echelon Forms', href: null } },
  { week: 2, shoaib: { topic: 'Matrix Algebra', href: null }, hajra: { topic: 'Matrix Algebra', href: null } },
  { week: 3, shoaib: { topic: 'Determinants', href: null }, hajra: { topic: 'Determinants', href: null } },
  { week: 4, shoaib: { topic: 'Vector Spaces & Subspaces', href: null }, hajra: { topic: 'Vector Spaces & Subspaces', href: null } },
  { week: 5, shoaib: { topic: 'Gram–Schmidt', href: null }, hajra: { topic: 'Gram–Schmidt', href: null } },
  { week: 6, shoaib: { topic: 'Linear Transformations', href: null }, hajra: { topic: 'Linear Transformations', href: null } },
  { week: 7, shoaib: { topic: 'Applications', href: null }, hajra: { topic: 'Applications', href: null } },
];

// Weekly problem sets. Set href to go live.
const PROBLEM_SETS = [
  { week: 1, title: 'Problem Set 1 — Systems of Equations', href: null },
  { week: 2, title: 'Problem Set 2 — Matrix Algebra', href: null },
  { week: 3, title: 'Problem Set 3 — Determinants', href: null },
  { week: 4, title: 'Problem Set 4 — Vector Spaces', href: null },
  { week: 5, title: 'Problem Set 5 — Orthogonality', href: null },
  { week: 6, title: 'Problem Set 6 — Linear Maps', href: null },
  { week: 7, title: 'Problem Set 7 — Applications', href: null },
];

// Quizzes (best 5 of 6).
const QUIZZES = [
  { n: 1, date: '15 June', day: 'Mon' },
  { n: 2, date: '22 June', day: 'Mon' },
  { n: 3, date: '29 June', day: 'Mon' },
  { n: 4, date: '06 July', day: 'Mon' },
  { n: 5, date: '13 July', day: 'Mon' },
  { n: 6, date: '20 July', day: 'Mon' },
];

// Mock exams.
const MOCK_EXAMS = [
  { title: 'Mock Midterm', detail: 'Weeks 1–3', href: null },
  { title: 'Mock Final', detail: 'Comprehensive', href: null },
];

// Weekly schedule. day: 0=Mon,1=Tue,2=Wed,3=Thu. Times in 24h decimal (13.5 = 1:30pm).
// type controls colour: 'lecture' | 'tutorial' | 'office'
const SCHEDULE = {
  startHour: 9,
  endHour: 18,
  days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  events: [
    { day: 0, start: 14, end: 15.67, type: 'lecture', title: 'Lecture', loc: 'Acad-11' },
    { day: 1, start: 14, end: 15.67, type: 'lecture', title: 'Lecture', loc: 'Acad-11' },
    { day: 2, start: 14, end: 15.67, type: 'lecture', title: 'Lecture', loc: 'Acad-11' },
    { day: 3, start: 14, end: 15.67, type: 'lecture', title: 'Lecture', loc: 'Acad-11' },
    { day: 0, start: 13, end: 14, type: 'office', title: 'Shoaib · Office Hours', loc: '9-155 SSE' },
    { day: 1, start: 13, end: 14, type: 'office', title: 'Shoaib · Office Hours', loc: '9-155 SSE' },
    { day: 2, start: 13, end: 14, type: 'office', title: 'Shoaib · Office Hours', loc: '9-155 SSE' },
    { day: 3, start: 13, end: 14, type: 'office', title: 'Shoaib · Office Hours', loc: '9-155 SSE' },
    { day: 0, start: 10, end: 11.5, type: 'tutorial', title: 'Tutorial · Shoaib', loc: 'TBA' },
    // Hajra's tutorial + office hours: add here once decided, e.g.:
    // { day: 2, start: 10, end: 12, type: 'tutorial', title: 'Tutorial · Hajra', loc: 'TBA' },
  ],
};

// Sidebar TOC — chapter groups for MATH-120.
const SIDEBAR = [
  { ch: 'Week 1 — Systems & Networks', items: ['§1.2 Row Operations & Rank', '§1.3 Homogeneous Systems', '§1.4 Networks & Reactions'] },
  { ch: 'Week 2 — Matrix Algebra', items: ['§2.2–2.3 Operations & Inverses', '§2.6–2.7 LU & Input–Output'] },
  { ch: 'Week 3 — Determinants', items: ['§3.1–3.2 Cofactor & Adjugate', '§3.3 Diagonalization'] },
  { ch: 'Week 4 — Vector Spaces', items: ['§6.1 Vector Spaces', '§5.1 Subspaces & Independence', '§6.2–6.3 Basis & Dimension'] },
  { ch: 'Week 5 — Orthogonality', items: ['§8.1 Gram–Schmidt', '§8.2 Orthogonal Diagonalization', '§8.9 Quadratic Forms'] },
  { ch: 'Week 6 — Linear Maps', items: ['§7.1 Transformations', '§2.5 Matrix of a Map', '§7.2 Kernel & Image'] },
  { ch: 'Week 7 — Applications', items: ['§10.2 Legendre Polynomials', '§8.10 Differential Equations'] },
];

/* ─── small presentational helpers (server-safe, no client JS) ─── */

function MaybeLink({ link, style }) {
  // link: { topic|title, href }. Live if href is set, else greyed placeholder.
  const label = link.topic ?? link.title;
  if (link.href) {
    return (
      <a href={link.href} target="_blank" rel="noopener noreferrer"
        style={{ color: 'var(--amber)', textDecoration: 'none', borderBottom: '1px solid rgba(232,160,32,.35)', ...style }}>
        {label}
      </a>
    );
  }
  return (
    <span style={{ color: 'var(--text3)', fontStyle: 'italic', ...style }}>
      {label} <span style={{ fontSize: '.7em', opacity: .7 }}>· soon</span>
    </span>
  );
}

export default function LinAlg() {
  return (
    <>
      <Navbar activePage="courses" />

      {/* STICKY SUB-HEADER */}
      <div style={{ position: 'sticky', top: 'calc(var(--nav-h) + 3px)', zIndex: 500, background: 'var(--bg2)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ padding: '8px 24px', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--fm)', fontSize: '.72rem', color: 'var(--text3)', borderBottom: '1px solid var(--border)' }}>
          <Link href="/" style={{ color: 'var(--amber)' }}>Home</Link><span>›</span>
          <Link href="/courses" style={{ color: 'var(--amber)' }}>Courses</Link><span>›</span>
          <span style={{ color: 'var(--text2)', fontWeight: 500 }}>Linear Algebra</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', padding: '0 24px', overflowX: 'auto' }}>
          {[
            { href: '/courses/precalc', label: 'Pre-Calculus', active: false },
            { href: '/courses/calc1', label: 'Calculus I', active: false },
            { href: '/courses/linalg', label: 'Linear Algebra', active: true },
          ].map(({ href, label, active }) => (
            <Link key={href} href={href} style={{
              fontFamily: 'var(--fm)', fontSize: '.72rem', letterSpacing: '.06em',
              textTransform: 'uppercase', color: active ? 'var(--amber)' : 'var(--text3)',
              padding: '9px 18px', borderBottom: active ? '2px solid var(--amber)' : '2px solid transparent',
              whiteSpace: 'nowrap', textDecoration: 'none',
            }}>{label}</Link>
          ))}
        </div>
      </div>

      {/* TWO-COLUMN LAYOUT: sidebar TOC + main */}
      <div style={{ display: 'flex', paddingTop: 'calc(var(--nav-h) + 3px + 37px + 40px)', minHeight: '100vh' }}>

        {/* SIDEBAR */}
        <aside style={{ width: '256px', flexShrink: 0, position: 'sticky', top: 'calc(var(--nav-h) + 3px + 37px + 40px)', height: 'calc(100vh - var(--nav-h) - 80px)', overflowY: 'auto', background: 'var(--bg2)', borderRight: '1px solid var(--border)' }}>
          <div style={{ padding: '18px 16px 12px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ fontFamily: 'var(--fm)', fontSize: '.6rem', letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--amber)', marginBottom: '4px' }}>MATH-120 · Linear Algebra</div>
            <div style={{ fontFamily: 'var(--fh)', fontSize: '.95rem', color: 'var(--text)', lineHeight: 1.3 }}>Course Contents</div>
            <Link href="/courses" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontFamily: 'var(--fm)', fontSize: '.68rem', color: 'var(--text3)', marginTop: '8px', textDecoration: 'none' }}>← All Courses</Link>
          </div>

          <nav style={{ padding: '8px 0 24px' }}>
            {SIDEBAR.map(({ ch, items }) => (
              <div key={ch}>
                <span style={{ fontFamily: 'var(--fm)', fontSize: '.58rem', letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--text3)', padding: '10px 16px 3px', display: 'block' }}>{ch}</span>
                {items.map(item => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 16px', fontFamily: 'var(--fm)', fontSize: '.72rem', color: 'var(--text3)', opacity: .55, lineHeight: 1.35 }}>
                    <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--border2)', flexShrink: 0, display: 'inline-block' }}></span>
                    {item}
                  </div>
                ))}
              </div>
            ))}
          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <main style={{ flex: 1, minWidth: 0, background: 'var(--bg)' }}>

          {/* HERO */}
          <div style={{ padding: '44px 52px 36px', background: 'linear-gradient(135deg, var(--bg) 0%, var(--bg2) 100%)', borderBottom: '1px solid var(--border)' }}>
            <span className="eyebrow">MATH-120 · Summer 2026 · SSE Core</span>
            <h1 style={{ fontSize: 'clamp(2rem,4vw,3.2rem)', marginBottom: '12px' }}>Linear Algebra <em style={{ color: 'var(--amber)', fontStyle: 'italic' }}>with Differential Equations</em></h1>
            <p style={{ maxWidth: '600px', fontSize: '1.02rem', color: 'var(--text2)' }}>
              The grammar of every linear system in mathematics, taught from the <em>why</em>, not just the <em>how</em>. From row reduction to abstract vector spaces and differential equations, with proofs along the way.
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '16px' }}>
              <span className="tag tag-amber">Vector Spaces</span>
              <span className="tag">Eigenvalues</span>
              <span className="tag">Orthogonality</span>
              <span className="tag">Linear Maps</span>
              <span className="tag tag-teal">Differential Equations</span>
            </div>
            <div style={{ display: 'flex', gap: '36px', marginTop: '28px', flexWrap: 'wrap' }}>
              {[
                ['Instructor', 'Imran Anwar'],
                ['Credits', '3ch - 4 lec / wk'],
                ['Prerequisite', 'MATH-101 Calculus I'],
                ['Textbook', 'Nicholson · Anton'],
              ].map(([k, v]) => (
                <div key={k}>
                  <div style={{ fontFamily: 'var(--fm)', fontSize: '.66rem', color: 'var(--text3)', letterSpacing: '.1em', textTransform: 'uppercase' }}>{k}</div>
                  <div style={{ fontSize: '.92rem', color: 'var(--text)', marginTop: '4px' }}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* BODY */}
          <div style={{ padding: '40px 52px 56px' }}>

            {/* Note callout */}
            <div style={{ background: 'var(--amber-lt)', borderLeft: '4px solid var(--amber)', borderRadius: '0 8px 8px 0', padding: '14px 18px', marginBottom: '40px', fontSize: '.92rem', color: 'var(--text2)' }}>
              <strong style={{ color: 'var(--text)' }}>📢 Note:</strong> This page is updated through the term. Tutorials, problem sets, and exam links go live as each week opens — click a week below to expand it.
            </div>

            {/* ── SECTION 01 · COURSE TIMELINE ── */}
            <SectionHeading num="01" title="Course Timeline" />
            <details open style={detailsStyle}>
              <summary style={summaryStyle}>The Seven Weeks</summary>
              <div style={{ marginTop: '14px' }}>
                {TIMELINE.map((wk, idx) => (
                  <div key={wk.no}>
                    <details style={weekStyle}>
                      <summary style={weekSummaryStyle}>
                        <span style={{ fontFamily: 'var(--fm)', fontSize: '.68rem', letterSpacing: '.1em', color: 'var(--amber)', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{wk.no}</span>
                        <span style={{ fontFamily: 'var(--fh)', fontSize: '1.1rem', color: 'var(--text)', flex: 1 }}>{wk.title}</span>
                        <span style={{ fontFamily: 'var(--fm)', fontSize: '.66rem', color: 'var(--text3)', border: '1px solid var(--border2)', padding: '2px 8px', borderRadius: '6px', whiteSpace: 'nowrap' }}>{wk.ref}</span>
                      </summary>
                      <div style={{ padding: '12px 4px 4px' }}>
                        <ul style={{ borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
                          {wk.items.map(([s, t]) => (
                            <li key={s + t} style={{ display: 'flex', gap: '12px', padding: '5px 0', fontSize: '.9rem', color: 'var(--text2)' }}>
                              <span style={{ fontFamily: 'var(--fm)', fontSize: '.74rem', color: 'var(--teal)', minWidth: '74px', whiteSpace: 'nowrap' }}>{s}</span>
                              <span>{t}</span>
                            </li>
                          ))}
                        </ul>
                        <div style={{ marginTop: '10px', fontSize: '.84rem', color: 'var(--text3)', fontStyle: 'italic', borderLeft: '2px solid var(--amber)', paddingLeft: '12px' }}>{wk.aim}</div>
                      </div>
                    </details>

                    {/* Midterm checkpoint after the configured week */}
                    {MIDTERM.after === idx + 1 && (
                      <div style={{ background: 'linear-gradient(100deg, var(--amber-lt), transparent)', border: '1px solid rgba(232,160,32,.4)', borderRadius: '10px', padding: '14px 18px', margin: '8px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px', flexWrap: 'wrap' }}>
                        <span style={{ fontFamily: 'var(--fh)', fontSize: '1.05rem', color: 'var(--amber)' }}>◆ {MIDTERM.label}</span>
                        <span style={{ fontFamily: 'var(--fm)', fontSize: '.78rem', color: 'var(--text2)' }}>{MIDTERM.detail}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </details>

            {/* ── SECTION · WEEKLY SCHEDULE ── */}
            <SectionHeading num="02" title="Weekly Schedule" />
            <Schedule />

            {/* ── SECTION 02 · TEACHING TEAM ── */}
            <SectionHeading num="02" title="Teaching Team" />
            <div className="grid-3" style={{ marginBottom: '8px' }}>
              {TEACHING_TEAM.map(t => (
                <div key={t.name} className="card card-teal" style={{ padding: '22px 24px' }}>
                  <div style={{ fontFamily: 'var(--fm)', fontSize: '.62rem', letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--teal)', marginBottom: '8px' }}>{t.role}</div>
                  <h4 style={{ marginBottom: '12px' }}>{t.name}</h4>
                  <div style={{ display: 'grid', gap: '6px', fontSize: '.86rem' }}>
                    <Row label="Email" value={t.email} isEmail />
                    <Row label="Office" value={t.office} />
                    <Row label="Office Hours" value={t.hours} />
                  </div>
                </div>
              ))}
            </div>

            {/* ── SECTION 03 · TUTORIALS ── */}
            <SectionHeading num="03" title="Tutorials" />
            <p style={{ fontSize: '.88rem', color: 'var(--text3)', marginTop: '-8px', marginBottom: '16px' }}>
              Two tutorials each week — one per TA. Click a topic to open its PDF.
            </p>
            <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.88rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg2)' }}>
                    <th style={thStyle}>Week</th>
                    <th style={thStyle}>Shoaib</th>
                    <th style={thStyle}>Hajra</th>
                  </tr>
                </thead>
                <tbody>
                  {TUTORIALS.map(t => (
                    <tr key={t.week} style={{ borderTop: '1px solid var(--border)' }}>
                      <td style={{ ...tdStyle, fontFamily: 'var(--fm)', color: 'var(--amber)', width: '70px' }}>W{t.week}</td>
                      <td style={tdStyle}><MaybeLink link={t.shoaib} /></td>
                      <td style={tdStyle}><MaybeLink link={t.hajra} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ── SECTION 04 · PROBLEM SETS ── */}
            <SectionHeading num="04" title="Weekly Problem Sets" />
            <div style={{ display: 'grid', gap: '8px' }}>
              {PROBLEM_SETS.map(p => (
                <div key={p.week} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '11px 16px', border: '1px solid var(--border)', borderRadius: '10px', background: 'var(--surface)' }}>
                  <span style={{ fontFamily: 'var(--fm)', fontSize: '.72rem', color: 'var(--amber)', border: '1px solid var(--amber)', borderRadius: '50%', width: '30px', height: '30px', display: 'grid', placeItems: 'center', flexShrink: 0 }}>{p.week}</span>
                  <MaybeLink link={p} style={{ fontSize: '.92rem' }} />
                </div>
              ))}
            </div>

            {/* ── SECTION 05 · ASSESSMENT ── */}
            <SectionHeading num="05" title="Assessment" />
            <div className="grid-2">
              <div className="card" style={{ padding: '24px 26px' }}>
                <h4 style={{ fontFamily: 'var(--fm)', fontSize: '.72rem', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: '18px' }}>Grade Weighting</h4>
                {[['Quizzes (best 5 of 6)', 30], ['Midterm', 30], ['Final (comprehensive)', 40]].map(([label, pct]) => (
                  <div key={label} style={{ marginBottom: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.88rem', marginBottom: '6px' }}>
                      <span>{label}</span><b style={{ fontFamily: 'var(--fm)', color: 'var(--amber)' }}>{pct}%</b>
                    </div>
                    <div style={{ height: '7px', background: 'rgba(255,255,255,.05)', borderRadius: '50px', overflow: 'hidden' }}>
                      <span style={{ display: 'block', height: '100%', width: `${pct}%`, borderRadius: '50px', background: 'linear-gradient(90deg, var(--teal), var(--amber))' }}></span>
                    </div>
                  </div>
                ))}
                <div style={{ marginTop: '14px', fontSize: '.78rem', color: 'var(--text3)', fontStyle: 'italic', textAlign: 'center', paddingTop: '12px', borderTop: '1px dashed var(--border)' }}>Final · 25 July · 3:00 PM · covers all seven weeks</div>
              </div>

              <div className="card" style={{ padding: '24px 26px' }}>
                <h4 style={{ fontFamily: 'var(--fm)', fontSize: '.72rem', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: '18px' }}>Quiz Calendar</h4>
                <div style={{ display: 'grid', gap: '8px' }}>
                  {QUIZZES.map(q => (
                    <div key={q.n} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '.88rem', padding: '8px 12px', border: '1px solid var(--border)', borderRadius: '10px', background: 'rgba(255,255,255,.02)' }}>
                      <span style={{ fontFamily: 'var(--fm)', color: 'var(--amber)', fontSize: '.76rem', width: '24px', height: '24px', display: 'grid', placeItems: 'center', border: '1px solid var(--amber)', borderRadius: '50%' }}>{q.n}</span>
                      <span style={{ color: 'var(--text)' }}>{q.date}</span>
                      <span style={{ marginLeft: 'auto', fontFamily: 'var(--fm)', fontSize: '.72rem', color: 'var(--text3)' }}>{q.day}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: '14px', fontSize: '.78rem', color: 'var(--text3)', fontStyle: 'italic', textAlign: 'center', paddingTop: '12px', borderTop: '1px dashed var(--border)' }}>Best 5 of 6 count — one quiz dropped</div>
              </div>
            </div>

            {/* ── SECTION 06 · MOCK EXAMS ── */}
            <SectionHeading num="06" title="Mock Exams" />
            <div className="grid-2">
              {MOCK_EXAMS.map(m => (
                <div key={m.title} className="card card-amber" style={{ padding: '20px 24px' }}>
                  <h4 style={{ marginBottom: '4px' }}>{m.title}</h4>
                  <div style={{ fontSize: '.8rem', color: 'var(--text3)', marginBottom: '12px' }}>{m.detail}</div>
                  <MaybeLink link={{ title: m.href ? 'Open PDF' : 'Practice paper', href: m.href }} style={{ fontSize: '.88rem' }} />
                </div>
              ))}
            </div>

          </div>

          {/* FOOTER NAV */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 52px', borderTop: '1px solid var(--border)', flexWrap: 'wrap', gap: '12px' }}>
            <Link href="/courses/calc1" style={navBtn(false)}>← Calculus I</Link>
            <Link href="/courses" style={navBtn(true)}>All Courses →</Link>
          </div>

        </main>
      </div>

      <Footer />
    </>
  );
}

/* ─── shared inline-style helpers ─── */

function SectionHeading({ num, title }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px', margin: '40px 0 20px' }}>
      <span style={{ fontFamily: 'var(--fm)', color: 'var(--amber)', fontSize: '.82rem' }}>{num}</span>
      <h3 style={{ fontFamily: 'var(--fh)', fontSize: '1.5rem', color: 'var(--text)', margin: 0 }}>{title}</h3>
      <span style={{ flex: 1, height: '1px', background: 'var(--border)' }}></span>
    </div>
  );
}

function Row({ label, value, isEmail }) {
  const isTBA = value === 'TBA';
  return (
    <div style={{ display: 'flex', gap: '10px' }}>
      <span style={{ color: 'var(--text3)', minWidth: '92px', fontFamily: 'var(--fm)', fontSize: '.72rem', letterSpacing: '.04em', textTransform: 'uppercase' }}>{label}</span>
      {isEmail && !isTBA
        ? <a href={`mailto:${value}`} style={{ color: 'var(--amber)' }}>{value}</a>
        : <span style={{ color: isTBA ? 'var(--text3)' : 'var(--text)', fontStyle: isTBA ? 'italic' : 'normal' }}>{value}</span>}
    </div>
  );
}

function Schedule() {
  const { startHour, endHour, days, events } = SCHEDULE;
  const totalMin = (endHour - startHour) * 60;
  const pxPerMin = 0.9; // grid height scale
  const gridH = totalMin * pxPerMin;
  const colors = {
    lecture:  { bg: 'rgba(232,160,32,.18)', bd: 'var(--amber)' },
    tutorial: { bg: 'rgba(56,201,176,.18)', bd: 'var(--teal)' },
    office:   { bg: 'rgba(155,128,232,.18)', bd: 'var(--violet)' },
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
      {/* legend */}
      <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap', padding: '14px 18px', borderBottom: '1px solid var(--border)', fontSize: '.78rem' }}>
        {[['lecture', 'Lecture'], ['tutorial', 'Tutorial'], ['office', 'Office Hours']].map(([k, label]) => (
          <span key={k} style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', color: 'var(--text2)' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: colors[k].bg, border: `1px solid ${colors[k].bd}` }}></span>{label}
          </span>
        ))}
      </div>

      <div style={{ overflowX: 'auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: `64px repeat(${days.length}, minmax(120px, 1fr))`, minWidth: '560px' }}>
          {/* header row */}
          <div style={{ borderBottom: '1px solid var(--border)' }}></div>
          {days.map(d => (
            <div key={d} style={{ padding: '10px 8px', textAlign: 'center', fontFamily: 'var(--fm)', fontSize: '.72rem', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--text2)', borderBottom: '1px solid var(--border)', borderLeft: '1px solid var(--border)' }}>{d}</div>
          ))}

          {/* time gutter */}
          <div style={{ position: 'relative', height: `${gridH}px` }}>
            {hours.map(h => (
              <div key={h} style={{ position: 'absolute', top: `${(h - startHour) * 60 * pxPerMin}px`, right: '8px', fontFamily: 'var(--fm)', fontSize: '.64rem', color: 'var(--text3)', transform: 'translateY(-50%)' }}>{fmt(h)}</div>
            ))}
          </div>

          {/* day columns */}
          {days.map((d, di) => (
            <div key={d} style={{ position: 'relative', height: `${gridH}px`, borderLeft: '1px solid var(--border)' }}>
              {/* hour gridlines */}
              {hours.map(h => (
                <div key={h} style={{ position: 'absolute', top: `${(h - startHour) * 60 * pxPerMin}px`, left: 0, right: 0, borderTop: '1px solid var(--border)', opacity: .5 }}></div>
              ))}
              {/* events for this day */}
              {events.filter(e => e.day === di).map((e, ei) => {
                const top = (e.start - startHour) * 60 * pxPerMin;
                const h = (e.end - e.start) * 60 * pxPerMin;
                const c = colors[e.type];
                return (
                  <div key={ei} style={{ position: 'absolute', top: `${top}px`, height: `${h}px`, left: '4px', right: '4px', background: c.bg, borderLeft: `3px solid ${c.bd}`, borderRadius: '5px', padding: '5px 7px', overflow: 'hidden' }}>
                    <div style={{ fontSize: '.74rem', fontWeight: 600, color: 'var(--text)', lineHeight: 1.2 }}>{e.title}</div>
                    <div style={{ fontFamily: 'var(--fm)', fontSize: '.62rem', color: 'var(--text2)', marginTop: '2px' }}>{fmt(e.start)}–{fmt(e.end)}</div>
                    <div style={{ fontFamily: 'var(--fm)', fontSize: '.62rem', color: 'var(--text3)' }}>{e.loc}</div>
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

const detailsStyle = { border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '16px 20px', background: 'var(--surface)' };
const summaryStyle = { cursor: 'pointer', fontFamily: 'var(--fh)', fontSize: '1.25rem', color: 'var(--text)', listStyle: 'none' };
const weekStyle = { borderBottom: '1px solid var(--border)', padding: '10px 0' };
const weekSummaryStyle = { cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '14px', listStyle: 'none' };
const thStyle = { textAlign: 'left', padding: '11px 16px', fontFamily: 'var(--fm)', fontSize: '.66rem', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--text3)' };
const tdStyle = { padding: '11px 16px', verticalAlign: 'top' };
const navBtn = (primary) => ({
  display: 'inline-flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--fm)', fontSize: '.74rem',
  letterSpacing: '.08em', textTransform: 'uppercase', padding: '8px 18px', borderRadius: '8px', textDecoration: 'none',
  color: primary ? 'var(--amber)' : 'var(--text3)',
  border: primary ? '1px solid rgba(232,160,32,.4)' : '1px solid var(--border)',
  background: primary ? 'var(--amber-lt)' : 'transparent',
});