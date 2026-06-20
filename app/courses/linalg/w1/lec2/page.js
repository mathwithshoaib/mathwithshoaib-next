'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import Navbar from '../../../../components/Navbar';
import Footer from '../../../../components/Footer';

/* ════════════════════════════════════════════════════════════════
   MATH-120 · LECTURE 2 — Solving Systems: Row Operations,
   Gaussian Elimination, Rank & Consistency
   Route: /courses/linalg/w1/lec2
   ════════════════════════════════════════════════════════════════ */

const LECTURES = [
  { week: 1, n: 1, slug: 'w1/lec1', title: 'The Language of Matrices', live: true },
  { week: 1, n: 2, slug: 'w1/lec2', title: 'Row Operations & Gaussian Elimination', live: true },
  { week: 1, n: 3, slug: 'w1/lec3', title: 'RREF, Homogeneous Systems & Linear Combinations', live: true },
  { week: 1, n: 4, slug: 'w1/lec4', title: 'Solution Structure & Applications', live: true },
  { week: 2, n: 5, slug: 'w2/lec5', title: 'Matrix Algebra: Addition, Scalar Multiplication & Transpose', live: true },
  { week: 2, n: 6, slug: 'w2/lec6', title: 'The Inverse of a Matrix', live: true },
  { week: 2, n: 7, slug: 'w2/lec7', title: 'Elementary Matrices & Solving Systems', live: true },
  { week: 2, n: 8, slug: 'w2/lec8', title: 'LU-Factorization & Input–Output Models', live: true },
];
const THIS_SLUG = 'w1/lec2';
const PREV_HREF = '/courses/linalg/w1/lec1';
const NEXT_HREF = '/courses/linalg/w1/lec3';

const LEC = {
  course: 'MATH-120 · Linear Algebra',
  number: 'Lecture 2',
  title: 'Row Operations & Gaussian Elimination',
  subtitle: 'How to actually solve a system — and tell whether it has one, none, or infinitely many solutions',
  date: '9 June 2026',
};

const ANCHORS = [
  ['Big Questions', 'questions'],
  ['The Motto', 'motto'],
  ['Row Operations', 'rowops'],
  ['Gaussian Elimination', 'gauss'],
  ['Infinite Solutions', 'infinite'],
  ['Rank & Consistency', 'rank'],
  ['Exercises', 'exercises'],
];

function lecturesByWeek() {
  const w = {};
  LECTURES.forEach(l => { (w[l.week] = w[l.week] || []).push(l); });
  return Object.keys(w).map(Number).sort((a, b) => a - b).map(week => ({ week, lectures: w[week] }));
}

/* ══════════════ COMPONENTS ══════════════ */

function Reveal({ label = 'Show solution', children }) {
  const [open, setOpen] = useState(false);
  const bodyRef = useRef(null);

  // When the panel opens, its LaTeX has only just been mounted into the DOM.
  // MathJax already finished its page-load pass, so we must ask it to typeset
  // this newly-revealed content specifically.
  useEffect(() => {
    if (!open) return;
    let tries = 0;
    const t = setInterval(() => {
      tries++;
      if (window.MathJax?.typesetPromise && bodyRef.current) {
        window.MathJax.typesetPromise([bodyRef.current]);
        clearInterval(t);
      }
      if (tries > 20) clearInterval(t);
    }, 80);
    return () => clearInterval(t);
  }, [open]);

  return (
    <div style={{ margin: '16px 0' }}>
      <button onClick={() => setOpen(o => !o)} style={{
        fontFamily: 'var(--fm)', fontSize: '.78rem', letterSpacing: '.04em',
        color: '#c8860a', background: 'rgba(232,160,32,.1)',
        border: '1px solid rgba(232,160,32,.4)', borderRadius: '8px',
        padding: '9px 18px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: 600,
      }}>
        <span style={{ transform: open ? 'rotate(90deg)' : 'none', transition: 'transform .2s', display: 'inline-block' }}>▶</span>
        {open ? 'Hide solution' : label}
      </button>
      {open && (
        <div ref={bodyRef} style={{ marginTop: '12px', padding: '18px 22px', background: 'rgba(56,201,176,.06)', border: '1px solid #cfe8e2', borderRadius: '12px', lineHeight: 1.8 }}>
          {children}
        </div>
      )}
    </div>
  );
}

function DefBox({ term, color = 'teal', children }) {
  const c = color === 'amber' ? { bg: 'rgba(232,160,32,.07)', bd: '#c8860a', tc: '#c8860a' }
           : color === 'violet' ? { bg: 'rgba(155,128,232,.08)', bd: '#9b80e8', tc: '#9b80e8' }
           : color === 'rose' ? { bg: 'rgba(224,107,107,.08)', bd: '#d85555', tc: '#d85555' }
           : { bg: 'rgba(56,201,176,.07)', bd: '#2a9d8f', tc: '#2a9d8f' };
  return (
    <div style={{ background: c.bg, borderLeft: `4px solid ${c.bd}`, borderRadius: '0 12px 12px 0', padding: '18px 22px', margin: '24px 0' }}>
      {term && (
        <div style={{ fontFamily: 'var(--fm)', fontSize: '.68rem', letterSpacing: '.16em', textTransform: 'uppercase', color: c.tc, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: c.tc, display: 'inline-block' }}></span>
          {term}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
}

function Example({ n, title, advanced, children }) {
  return (
    <div style={{
      background: advanced ? 'rgba(155,128,232,.05)' : 'rgba(255,253,240,.97)',
      border: `1px solid ${advanced ? 'rgba(155,128,232,.35)' : 'var(--lec-border)'}`,
      borderRadius: '14px', padding: '24px 28px', margin: '24px 0',
      boxShadow: '0 2px 18px rgba(60,40,20,.06)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px', flexWrap: 'wrap' }}>
        <span style={{
          fontFamily: 'var(--fm)', fontSize: '.7rem', letterSpacing: '.1em', textTransform: 'uppercase',
          color: advanced ? '#9b80e8' : '#c8860a',
          background: advanced ? 'rgba(155,128,232,.14)' : 'rgba(232,160,32,.14)',
          padding: '4px 12px', borderRadius: '20px',
        }}>
          {advanced ? `★ ${n}` : `Example ${n}`}
        </span>
        {title && <span style={{ fontFamily: 'var(--fh)', fontSize: '1.08rem', color: 'var(--lec-ink)', fontWeight: 600 }}>{title}</span>}
      </div>
      {children}
    </div>
  );
}

function Sec({ id, n, children }) {
  return (
    <h2 id={id} style={{
      scrollMarginTop: 'calc(var(--nav-h) + 3px + 37px + 48px + 16px)',
      fontFamily: 'var(--fh)', fontSize: 'clamp(1.6rem,3vw,2.1rem)',
      color: 'var(--lec-ink)', margin: '56px 0 18px',
      display: 'flex', alignItems: 'baseline', gap: '14px',
      borderBottom: '1px solid var(--lec-border)', paddingBottom: '10px',
    }}>
      <span style={{ fontFamily: 'var(--fm)', fontSize: '.82rem', color: '#c8860a', flexShrink: 0 }}>{n}</span>
      {children}
    </h2>
  );
}

function Callout({ icon, title, color = 'amber', children }) {
  const c = color === 'teal' ? 'rgba(56,201,176,.09)' : color === 'violet' ? 'rgba(155,128,232,.09)' : color === 'rose' ? 'rgba(224,107,107,.09)' : 'rgba(232,160,32,.09)';
  const bc = color === 'teal' ? 'var(--teal)' : color === 'violet' ? 'var(--violet)' : color === 'rose' ? 'var(--rose)' : 'var(--amber)';
  return (
    <div style={{ background: c, border: `1px solid ${bc}40`, borderRadius: '12px', padding: '18px 22px', margin: '24px 0', display: 'flex', gap: '16px' }}>
      <span style={{ fontSize: '1.6rem', flexShrink: 0, lineHeight: 1 }}>{icon}</span>
      <div>
        {title && <div style={{ fontFamily: 'var(--fm)', fontSize: '.72rem', letterSpacing: '.12em', textTransform: 'uppercase', color: bc, marginBottom: '6px' }}>{title}</div>}
        <div style={{ fontSize: '.95rem', color: 'var(--lec-ink2)', lineHeight: 1.75 }}>{children}</div>
      </div>
    </div>
  );
}

function Widget({ title, children }) {
  return (
    <div className="dark-widget" style={{ background: '#0f1525', border: '1px solid rgba(255,255,255,.08)', borderRadius: '16px', padding: '22px', margin: '24px 0', color: '#e8e8f0', boxShadow: '0 8px 40px rgba(0,0,0,.4)' }}>
      {title && <div style={{ fontFamily: 'var(--fm)', fontSize: '.7rem', letterSpacing: '.14em', textTransform: 'uppercase', color: '#6a6a9a', marginBottom: '16px' }}>{title}</div>}
      {children}
    </div>
  );
}

/* ══════════════ ANIMATED ROW-REDUCTION APPLET ══════════════ */
/*
   A fixed 4-variable system. Each click advances one step:
   step 0  → system shown
   step 1  → becomes augmented matrix
   step 2..→ row operations, one at a time, until REF
*/
function RowReduceApplet() {
  // The system:  x1+2x2+ x3+ x4 = 5
  //             2x1+2x2+ x3    = 6  (no x4)  -> use 2x1+2x2+x3+0x4=6
  //              x1     -x3+2x4 = 0  -> x1+0x2-x3+2x4=0
  //              3x1+5x2+2x3+ x4 = 14
  // We'll animate elimination to REF (leading 1s).
  const STEPS = [
    {
      kind: 'system',
      caption: 'We begin with a system of 4 equations in 4 unknowns. Solving this by hand-substitution would be painful. Watch instead.',
      sys: [
        '  x_1 + 2x_2 + x_3 + x_4 = 5',
        ' 2x_1 + 2x_2 + x_3       = 6',
        '  x_1        - x_3 + 2x_4 = 0',
        ' 3x_1 + 5x_2 + 2x_3 + x_4 = 14',
      ],
    },
    {
      kind: 'matrix',
      caption: 'Step 1 — Strip away the variables. Write the augmented matrix (A | b). Missing variables become 0. Now we only push numbers around.',
      m: [[1,2,1,1,5],[2,2,1,0,6],[1,0,-1,2,0],[3,5,2,1,14]],
    },
    {
      kind: 'matrix',
      caption: 'The first pivot position is row 1, column 1. It is already a 1 — good. (If it were not, we would divide the row to make it 1.)',
      m: [[1,2,1,1,5],[2,2,1,0,6],[1,0,-1,2,0],[3,5,2,1,14]],
      pivot: [0,0],
    },
    {
      kind: 'matrix',
      caption: 'R₂ → R₂ − 2R₁  : make the entry below pivot 1 a zero.',
      m: [[1,2,1,1,5],[0,-2,-1,-2,-4],[1,0,-1,2,0],[3,5,2,1,14]],
      pivot: [0,0], changed: 1,
    },
    {
      kind: 'matrix',
      caption: 'R₃ → R₃ − R₁  : clear the next entry in column 1.',
      m: [[1,2,1,1,5],[0,-2,-1,-2,-4],[0,-2,-2,1,-5],[3,5,2,1,14]],
      pivot: [0,0], changed: 2,
    },
    {
      kind: 'matrix',
      caption: 'R₄ → R₄ − 3R₁  : column 1 below the pivot is now all zeros.',
      m: [[1,2,1,1,5],[0,-2,-1,-2,-4],[0,-2,-2,1,-5],[0,-1,-1,-2,-1]],
      pivot: [0,0], changed: 3,
    },
    {
      kind: 'matrix',
      caption: 'Move to pivot 2 (row 2, column 2). It is −2, not 1. R₂ → −½R₂ to make the pivot a leading 1.',
      m: [[1,2,1,1,5],[0,1,0.5,1,2],[0,-2,-2,1,-5],[0,-1,-1,-2,-1]],
      pivot: [1,1], changed: 1,
    },
    {
      kind: 'matrix',
      caption: 'R₃ → R₃ + 2R₂  : zero below pivot 2.',
      m: [[1,2,1,1,5],[0,1,0.5,1,2],[0,0,-1,3,-1],[0,-1,-1,-2,-1]],
      pivot: [1,1], changed: 2,
    },
    {
      kind: 'matrix',
      caption: 'R₄ → R₄ + R₂  : column 2 below pivot 2 is now clear.',
      m: [[1,2,1,1,5],[0,1,0.5,1,2],[0,0,-1,3,-1],[0,0,-0.5,-1,1]],
      pivot: [1,1], changed: 3,
    },
    {
      kind: 'matrix',
      caption: 'Pivot 3 (row 3, column 3) is −1. R₃ → −R₃ to make it a leading 1.',
      m: [[1,2,1,1,5],[0,1,0.5,1,2],[0,0,1,-3,1],[0,0,-0.5,-1,1]],
      pivot: [2,2], changed: 2,
    },
    {
      kind: 'matrix',
      caption: 'R₄ → R₄ + ½R₃  : clear below pivot 3.',
      m: [[1,2,1,1,5],[0,1,0.5,1,2],[0,0,1,-3,1],[0,0,0,-2.5,1.5]],
      pivot: [2,2], changed: 3,
    },
    {
      kind: 'matrix',
      caption: 'Pivot 4 (row 4, column 4) is −2.5. R₄ → −0.4·R₄ to make it a leading 1.',
      m: [[1,2,1,1,5],[0,1,0.5,1,2],[0,0,1,-3,1],[0,0,0,1,-0.6]],
      pivot: [3,3], changed: 3,
    },
    {
      kind: 'done',
      caption: 'Done. Every pivot is a leading 1 and every entry below each pivot is zero — this is Row-Echelon Form. From here, back-substitution reads off the solution from the bottom up. Four pivots, four variables → a unique solution.',
      m: [[1,2,1,1,5],[0,1,0.5,1,2],[0,0,1,-3,1],[0,0,0,1,-0.6]],
      pivots: [[0,0],[1,1],[2,2],[3,3]],
    },
  ];

  const [step, setStep] = useState(0);
  const cur = STEPS[step];
  const atEnd = step === STEPS.length - 1;

  const fmt = (v) => {
    if (Number.isInteger(v)) return String(v);
    // show simple fractions for common values
    const map = { '0.5':'½', '-0.5':'−½', '-0.6':'−0.6', '1.5':'1.5', '-2.5':'−2.5', '-3':'−3' };
    if (map[String(v)]) return map[String(v)];
    return String(v).replace('-', '−');
  };

  return (
    <Widget title={`Interactive · Watch a 4×4 system reduce to REF  (step ${step} of ${STEPS.length - 1})`}>
      <div style={{ minHeight: '210px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {cur.kind === 'system' ? (
          <div style={{ fontFamily: 'monospace', fontSize: '1.05rem', lineHeight: 2, textAlign: 'center', color: '#e8e8f0' }}>
            {cur.sys.map((row, i) => <div key={i}>{row.replace(/-/g, '−')}</div>)}
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'stretch', gap: '6px' }}>
              <div style={{ width: '3px', background: '#5a5a8a', borderRadius: '2px' }} />
              <table style={{ borderCollapse: 'collapse', fontFamily: 'monospace', fontSize: '1.02rem' }}>
                <tbody>
                  {cur.m.map((row, i) => {
                    const isChanged = cur.changed === i;
                    return (
                      <tr key={i} style={{ background: isChanged ? 'rgba(232,160,32,.12)' : 'transparent', transition: 'background .4s' }}>
                        {row.map((v, j) => {
                          const isPivot = (cur.pivot && cur.pivot[0] === i && cur.pivot[1] === j)
                            || (cur.pivots && cur.pivots.some(p => p[0] === i && p[1] === j));
                          const isBar = j === row.length - 1;
                          return (
                            <td key={j} style={{
                              padding: '6px 13px', textAlign: 'center',
                              color: isPivot ? '#0f1525' : '#e8e8f0',
                              background: isPivot ? '#e8a020' : 'transparent',
                              borderRadius: isPivot ? '6px' : 0,
                              fontWeight: isPivot ? 700 : 400,
                              borderLeft: isBar ? '2px solid #5a5a8a' : 'none',
                              transition: 'all .3s',
                            }}>{fmt(v)}</td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div style={{ width: '3px', background: '#5a5a8a', borderRadius: '2px' }} />
            </div>
          </div>
        )}
      </div>

      <div style={{ marginTop: '18px', padding: '14px 18px', background: 'rgba(56,201,176,.08)', border: '1px solid rgba(56,201,176,.25)', borderRadius: '10px', fontSize: '.9rem', color: '#cfeee8', lineHeight: 1.6, minHeight: '54px' }}>
        {cur.caption}
      </div>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '18px', flexWrap: 'wrap' }}>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}
          style={{ ...appletBtn, opacity: step === 0 ? .4 : 1, cursor: step === 0 ? 'not-allowed' : 'pointer', color: '#8a8ac0', borderColor: '#3a3a5a', background: 'transparent' }}>
          ← Back
        </button>
        {!atEnd ? (
          <button onClick={() => setStep(s => Math.min(STEPS.length - 1, s + 1))} style={{ ...appletBtn, color: '#0f1525', background: '#e8a020', borderColor: '#e8a020' }}>
            Next step →
          </button>
        ) : (
          <button onClick={() => setStep(0)} style={{ ...appletBtn, color: '#38c9b0', background: 'rgba(56,201,176,.12)', borderColor: '#38c9b0' }}>
            ↺ Restart
          </button>
        )}
      </div>
    </Widget>
  );
}
const appletBtn = { fontFamily: 'var(--fm)', fontSize: '.82rem', fontWeight: 600, padding: '10px 22px', borderRadius: '10px', border: '1px solid', transition: 'all .2s' };

/* ══════════════ PAGE ══════════════ */
export default function Lec2() {
  const [menuOpen, setMenuOpen] = useState(false);
  const weeks = lecturesByWeek();

  useEffect(() => {
    window.MathJax = {
      tex: { inlineMath: [['$', '$'], ['\\(', '\\)']], displayMath: [['$$', '$$'], ['\\[', '\\]']] },
      options: { skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre'] },
    };
    let n = 0;
    const ti = setInterval(() => {
      n++;
      if (window.MathJax?.typesetPromise) { window.MathJax.typesetPromise(); }
      if (n > 12) clearInterval(ti);
    }, 350);
    return () => clearInterval(ti);
  }, []);

  function jump(e, id) {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <>
      <Script src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js" strategy="afterInteractive" />

      <style>{`
        :root {
          --lec-paper: #faf7f2;
          --lec-ink:   #241e14;
          --lec-ink2:  #4a4030;
          --lec-ink3:  #7a6e5e;
          --lec-border:#e2d8c8;
          --lec-accent:#c8860a;
        }
        .lec-content { color: var(--lec-ink); }
        .lec-content p { color: var(--lec-ink2); line-height: 1.85; margin: 14px 0; font-size: 1.02rem; }
        .lec-content mjx-container { color: var(--lec-ink) !important; }
        .dark-widget mjx-container { color: #e8e8f0 !important; }
        .dark-widget * { color: #e8e8f0; }
        .lec-content b, .lec-content strong { color: var(--lec-ink); }

        .lc-shell { display:flex; padding-top:calc(var(--nav-h) + 3px + 37px); min-height:100vh; }
        .lc-sidebar {
          width:256px; flex-shrink:0; position:sticky;
          top:calc(var(--nav-h)+3px+37px); height:calc(100vh - var(--nav-h) - 40px);
          overflow-y:auto; background:var(--bg2); border-right:1px solid var(--border); z-index:510;
        }
        .lc-backdrop { display:none; }
        .lc-menu-btn { display:none; }
        .lc-main { flex:1; min-width:0; background:var(--lec-paper); }
        .lc-body { max-width:880px; margin:0 auto; padding:36px 48px 96px; }
        .sbs { display:grid; grid-template-columns:1fr 1fr; gap:18px; margin:22px 0; }
        .sbs-card { background:rgba(255,253,240,.97); border:1px solid var(--lec-border); border-radius:12px; padding:18px 20px; box-shadow:0 2px 14px rgba(60,40,20,.05); }
        .sbs-label { font-family:var(--fm); font-size:.62rem; letter-spacing:.14em; text-transform:uppercase; color:var(--lec-accent); margin-bottom:10px; }

        @media(max-width:960px){ .lc-body{ padding:28px 28px 80px; } }
        @media(max-width:780px){ .sbs{ grid-template-columns:1fr; } }
        @media(max-width:860px){
          .lc-sidebar{ position:fixed; top:0; left:0; height:100vh; width:272px; transform:translateX(-100%); transition:transform .25s ease; padding-top:calc(var(--nav-h)+14px); }
          .lc-sidebar.open{ transform:translateX(0); box-shadow:0 0 40px rgba(0,0,0,.5); }
          .lc-backdrop.open{ display:block; position:fixed; inset:0; background:rgba(0,0,0,.55); z-index:505; }
          .lc-menu-btn{ display:inline-flex; align-items:center; gap:7px; position:fixed; bottom:22px; left:22px; z-index:506; background:var(--amber); color:#1a1a2e; border:none; font-family:var(--fm); font-size:.8rem; font-weight:600; padding:12px 18px; border-radius:32px; cursor:pointer; box-shadow:0 4px 20px rgba(0,0,0,.35); }
          .lc-body{ padding:24px 18px 72px; }
          .lec-content p{ font-size:.97rem; }
          .lec-content h1{ font-size:clamp(1.6rem,7vw,2.2rem) !important; }
        }
      `}</style>

      <Navbar activePage="courses" />

      {/* BREADCRUMB */}
      <div style={{ position:'sticky', top:'calc(var(--nav-h) + 3px)', zIndex:500, background:'var(--bg2)', borderBottom:'1px solid var(--border)', padding:'0 24px', display:'flex', alignItems:'center', gap:'8px', fontFamily:'var(--fm)', fontSize:'.72rem', color:'var(--text3)', height:'37px', overflowX:'auto', whiteSpace:'nowrap' }}>
        <Link href="/" style={{color:'var(--amber)'}}>Home</Link><span>›</span>
        <Link href="/courses" style={{color:'var(--amber)'}}>Courses</Link><span>›</span>
        <Link href="/courses/linalg" style={{color:'var(--amber)'}}>Linear Algebra</Link><span>›</span>
        <span style={{color:'var(--text2)'}}>Week 1 · Lecture 2</span>
      </div>

      <button className="lc-menu-btn" onClick={()=>setMenuOpen(o=>!o)}>☰ Lectures</button>
      <div className={`lc-backdrop ${menuOpen?'open':''}`} onClick={()=>setMenuOpen(false)} />

      <div className="lc-shell">

        {/* SIDEBAR */}
        <aside className={`lc-sidebar ${menuOpen?'open':''}`}>
          <div style={{padding:'18px 16px 12px',borderBottom:'1px solid var(--border)'}}>
            <div style={{fontFamily:'var(--fm)',fontSize:'.6rem',letterSpacing:'.2em',textTransform:'uppercase',color:'var(--amber)',marginBottom:'4px'}}>MATH-120 · Linear Algebra</div>
            <div style={{fontFamily:'var(--fh)',fontSize:'.95rem',color:'var(--text)',lineHeight:1.3}}>Lectures</div>
            <Link href="/courses/linalg" style={{display:'inline-flex',alignItems:'center',gap:'5px',fontFamily:'var(--fm)',fontSize:'.68rem',color:'var(--text3)',marginTop:'8px',textDecoration:'none'}}>← Course Home</Link>
          </div>
          <nav style={{padding:'8px 0 24px'}}>
            {weeks.map(({week,lectures})=>(
              <div key={week}>
                <span style={{fontFamily:'var(--fm)',fontSize:'.58rem',letterSpacing:'.22em',textTransform:'uppercase',color:'var(--text3)',padding:'12px 16px 4px',display:'block'}}>Week {week}</span>
                {lectures.map(lec=>{
                  const isCurrent = lec.slug===THIS_SLUG;
                  const label = lec.title||`Lecture ${lec.n}`;
                  const body = (
                    <div style={{padding:'8px 16px',borderLeft:isCurrent?'3px solid var(--amber)':'3px solid transparent',background:isCurrent?'var(--amber-lt)':'transparent'}}>
                      <div style={{fontFamily:'var(--fm)',fontSize:'.72rem',lineHeight:1.4,color:isCurrent?'var(--amber)':(lec.live?'var(--text2)':'var(--text3)'),opacity:(lec.live||isCurrent)?1:.5}}>
                        <span style={{color:isCurrent?'var(--amber)':'var(--text3)'}}>Lec {lec.n}</span> · {label}{!lec.live&&<span style={{fontStyle:'italic'}}> · soon</span>}
                      </div>
                    </div>
                  );
                  if(isCurrent) return <div key={lec.n}>{body}</div>;
                  return lec.live
                    ? <Link key={lec.n} href={`/courses/linalg/${lec.slug}`} onClick={()=>setMenuOpen(false)} style={{textDecoration:'none',display:'block'}}>{body}</Link>
                    : <div key={lec.n}>{body}</div>;
                })}
              </div>
            ))}
          </nav>
        </aside>

        {/* MAIN */}
        <main className="lc-main">

          {/* STICKY ANCHOR BAR */}
          <div style={{ position:'sticky', top:'calc(var(--nav-h) + 3px + 37px)', zIndex:480, background:'var(--lec-paper)', borderBottom:'1px solid var(--lec-border)', height:'48px', display:'flex', alignItems:'center' }}>
            <Link href={PREV_HREF} style={{ display:'flex', alignItems:'center', gap:'5px', padding:'0 16px', height:'100%', fontFamily:'var(--fm)', fontSize:'.72rem', color:'var(--lec-ink3)', borderRight:'1px solid var(--lec-border)', whiteSpace:'nowrap', flexShrink:0, textDecoration:'none' }}>
              ← Lecture 1
            </Link>
            <div style={{ flex:1, display:'flex', justifyContent:'center', alignItems:'center', gap:'4px', overflowX:'auto', padding:'0 8px' }}>
              <span style={{ fontFamily:'var(--fm)', fontSize:'.6rem', letterSpacing:'.12em', textTransform:'uppercase', color:'var(--lec-accent)', flexShrink:0, marginRight:'6px' }}>On this page</span>
              {ANCHORS.map(([label,id],i)=>(
                <span key={id} style={{display:'inline-flex',alignItems:'center',flexShrink:0}}>
                  {i>0&&<span style={{color:'var(--lec-border)',margin:'0 7px'}}>·</span>}
                  <a href={`#${id}`} onClick={e=>jump(e,id)} style={{fontFamily:'var(--fm)',fontSize:'.73rem',color:'var(--lec-ink2)',textDecoration:'none',whiteSpace:'nowrap'}}>{label}</a>
                </span>
              ))}
            </div>
            <Link href={NEXT_HREF} style={{ display:'flex', alignItems:'center', gap:'5px', padding:'0 16px', height:'100%', fontFamily:'var(--fm)', fontSize:'.72rem', color:'var(--lec-ink3)', borderLeft:'1px solid var(--lec-border)', whiteSpace:'nowrap', flexShrink:0, textDecoration:'none' }}>
              Lecture 3 →
            </Link>
          </div>

          {/* CONTENT */}
          <div className="lec-content lc-body">

            {/* HEADER */}
            <div style={{borderBottom:'2px solid var(--lec-border)',paddingBottom:'24px',marginBottom:'8px'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'8px',marginBottom:'10px'}}>
                <span style={{fontFamily:'var(--fm)',fontSize:'.7rem',letterSpacing:'.16em',textTransform:'uppercase',color:'var(--lec-accent)'}}>{LEC.course} · {LEC.number}</span>
                <span style={{fontFamily:'var(--fm)',fontSize:'.7rem',color:'var(--lec-ink3)',background:'rgba(0,0,0,.04)',padding:'4px 12px',borderRadius:'20px'}}>{LEC.date}</span>
              </div>
              <h1 style={{fontFamily:'var(--fh)',fontSize:'clamp(2.2rem,5vw,3.2rem)',color:'var(--lec-ink)',margin:'0 0 8px',lineHeight:1.05,fontWeight:400}}>{LEC.title}</h1>
              <p style={{fontStyle:'italic',color:'var(--lec-ink3)',margin:0,fontSize:'1.05rem'}}>{LEC.subtitle}</p>
            </div>

            <p>Last lecture we built the language — matrices, augmented matrices, and row-echelon form. Today we put it to work. By the end you will be able to take <i>any</i> system of linear equations, however large, and either solve it completely or prove it has no solution — using a single, mechanical procedure that never fails.</p>

            {/* ─── BIG QUESTIONS ─── */}
            <Sec id="questions" n="§1">Three Questions We Must Answer</Sec>
            <p>Everything in this lecture is aimed at three practical questions about a system of linear equations:</p>

            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:'16px',margin:'20px 0'}}>
              {[
                { n:'1', color:'#38c9b0', q:'How do we solve a large system?', s:'Two or three variables we can juggle by hand. But 6, 20, a million? We need a method that scales.' },
                { n:'2', color:'#e8a020', q:'Is the system consistent?', s:'Does any solution exist at all — or do the equations contradict each other?' },
                { n:'3', color:'#9b80e8', q:'Is the solution unique?', s:'If a solution exists, is it the only one, or are there infinitely many?' },
              ].map(c=>(
                <div key={c.n} style={{background:'rgba(255,255,255,.97)',border:`1px solid ${c.color}40`,borderTop:`3px solid ${c.color}`,borderRadius:'12px',padding:'18px 20px',boxShadow:'0 2px 14px rgba(60,40,20,.06)'}}>
                  <div style={{fontFamily:'var(--fh)',fontSize:'1.8rem',color:c.color,marginBottom:'6px',fontWeight:600}}>{c.n}</div>
                  <div style={{fontFamily:'var(--fh)',fontSize:'1.05rem',color:'var(--lec-ink)',marginBottom:'8px',fontWeight:600}}>{c.q}</div>
                  <div style={{fontSize:'.86rem',color:'var(--lec-ink2)',lineHeight:1.6}}>{c.s}</div>
                </div>
              ))}
            </div>

            <DefBox term="New word · Consistent" color="amber">
              <p style={{margin:0}}>You will hear the word <b>consistent</b> constantly from now on, so let us pin it down. A system of equations is <b>consistent</b> if it has <b>at least one solution</b> — the equations agree with one another, and some choice of values satisfies them all. A system is <b>inconsistent</b> if it has <b>no solution</b> — the equations contradict each other, like demanding {String.raw`$x+y=3$`} and {String.raw`$x+y=5$`} at the same time. "Consistent" does not mean the solution is unique; a consistent system can have one solution or infinitely many. It simply means a solution exists.</p>
            </DefBox>

            {/* ─── THE MOTTO ─── */}
            <Sec id="motto" n="§2">The Motto of This Course</Sec>

            <Callout icon="🦟" title="Never use your cannon to kill a mosquito" color="rose">
              Over this course you will collect a large arsenal of techniques — some of them heavy machinery built for genuinely hard problems. The motto is a warning: <b>match the tool to the problem.</b> A method designed for a 50×50 system is wasted effort on a 2×2 one. Reaching for the most powerful technique every time is not cleverness — it is wasted time and a wide-open door for errors.
            </Callout>

            <p>{String.raw`Here is what this means in practice. Suppose someone hands you the system $x = 3,\; y = 5$. You could dutifully write the augmented matrix, perform row operations, compute the rank, and announce the solution. Or you could just read it: $x=3$, $y=5$. Done. Firing the full Gaussian-elimination cannon at a system that is already solved is the mathematical equivalent of using artillery on an insect.`}</p>

            <p>{String.raw`A second example: to solve $\frac{x}{2} = 4$, you do not need linear algebra at all — multiply both sides by 2. But to solve a tangle of six equations in six unknowns, mental arithmetic will collapse, and then the cannon is exactly right. The skill we are building this term is not just "knowing methods" — it is `}<b>knowing which method fits</b>.</p>

            <Callout icon="📖" title="Where the saying comes from" color="violet">
              The phrase "to take a cannon to kill a mosquito" (or "a sledgehammer to crack a nut") appears across many cultures — Confucius is often credited with a version: "Why use an ox-cleaver to kill a chicken?" The idea is ancient and universal because the mistake is ancient and universal. In computing it has a modern cousin: do not run a supercomputer to add two numbers. Keep it in mind every time you pick up a new technique this term.
            </Callout>

            {/* ─── RECALL REF ─── */}
            <Sec id="rowops" n="§3">Recall: Row-Echelon Form — and Why We Want It</Sec>

            <p>From Lecture 1: a matrix is in <b>row-echelon form (REF)</b> when (1) all zero rows are at the bottom, (2) the first nonzero entry of each nonzero row is a leading 1, and (3) each leading 1 lies strictly to the right of the one above. Why do we care so much about this shape? Because a system in REF practically solves itself.</p>

            <p>Look at this augmented matrix in REF, and convert it back to equations:</p>

            <div className="sbs">
              <div className="sbs-card">
                <div className="sbs-label">Augmented matrix (REF)</div>
                <p style={{margin:0,textAlign:'center'}}>{String.raw`$$\left(\begin{array}{ccc|c} 1 & 2 & -1 & 3 \\ 0 & 1 & 4 & 5 \\ 0 & 0 & 1 & 2 \end{array}\right)$$`}</p>
              </div>
              <div className="sbs-card">
                <div className="sbs-label">The system it represents</div>
                <p style={{margin:0,textAlign:'center'}}>{String.raw`$$\begin{cases} x + 2y - z = 3 \\ \phantom{x+2}y + 4z = 5 \\ \phantom{x+2y+}z = 2 \end{cases}$$`}</p>
              </div>
            </div>

            <p>{String.raw`The bottom equation already hands us $z = 2$. Substitute upward into the middle: $y + 4(2) = 5 \Rightarrow y = -3$. Then the top: $x + 2(-3) - 2 = 3 \Rightarrow x = 11$. No juggling, no guessing — just read from the bottom and climb. This is `}<b>back-substitution</b>{String.raw`, and it is the whole reason REF is worth chasing.`}</p>

            <p>So here is the plan. Given <i>any</i> system, we will turn its augmented matrix into REF, then back-substitute. The only question left is: <b>how do we transform a matrix into REF without changing the solution of the underlying system?</b></p>

            {/* THE ROW OPERATIONS */}
            <p style={{fontFamily:'var(--fh)',fontSize:'1.3rem',color:'var(--lec-ink)',margin:'40px 0 12px',fontWeight:600}}>The Three Elementary Row Operations</p>

            <p>We are allowed exactly three moves. Each one rearranges the matrix but leaves the solution set <b>untouched</b> — because each corresponds to something we have always been allowed to do to equations. Let us take one system and apply all three, watching the system and the matrix side by side.</p>

            <p>Our starting system and its augmented matrix:</p>
            <div className="sbs">
              <div className="sbs-card">
                <div className="sbs-label">System</div>
                <p style={{margin:0,textAlign:'center'}}>{String.raw`$$\begin{cases} 2x + 4y = 6 \\ x - y = 1 \\ 3x + y = 7 \end{cases}$$`}</p>
              </div>
              <div className="sbs-card">
                <div className="sbs-label">Augmented matrix</div>
                <p style={{margin:0,textAlign:'center'}}>{String.raw`$$\left(\begin{array}{cc|c} 2 & 4 & 6 \\ 1 & -1 & 1 \\ 3 & 1 & 7 \end{array}\right)$$`}</p>
              </div>
            </div>

            {/* OP 1 */}
            <DefBox term="Operation 1 · Interchange two rows" color="teal">
              <p style={{margin:'0 0 6px'}}>{String.raw`Swap two rows. Notation: $R_{23}$ means "interchange row 2 and row 3."`}</p>
              <p style={{margin:0,fontSize:'.9rem'}}>{String.raw`Always write the smaller index first: $R_{23}$ is good notation, $R_{32}$ means the same thing but is considered poor form.`}</p>
            </DefBox>

            <p>{String.raw`Why does this not change the solution? Because swapping two rows of the matrix just means `}<b>writing the equations in a different order</b>{String.raw`. The system "$2x+4y=6$ and $x-y=1$" is exactly the same system as "$x-y=1$ and $2x+4y=6$." Order never mattered. Apply $R_{12}$ (swap rows 1 and 2) to get a leading 1 at the top:`}</p>

            <div className="sbs">
              <div className="sbs-card">
                <div className="sbs-label">System after R₁₂</div>
                <p style={{margin:0,textAlign:'center'}}>{String.raw`$$\begin{cases} x - y = 1 \\ 2x + 4y = 6 \\ 3x + y = 7 \end{cases}$$`}</p>
              </div>
              <div className="sbs-card">
                <div className="sbs-label">Matrix after R₁₂</div>
                <p style={{margin:0,textAlign:'center'}}>{String.raw`$$\left(\begin{array}{cc|c} 1 & -1 & 1 \\ 2 & 4 & 6 \\ 3 & 1 & 7 \end{array}\right)$$`}</p>
              </div>
            </div>

            {/* OP 2 */}
            <DefBox term="Operation 2 · Multiply a row by a nonzero constant" color="teal">
              <p style={{margin:'0 0 6px'}}>{String.raw`Scale every entry of a row by the same nonzero number. Notation: $3R_2$ means "multiply row 2 by 3"; every entry in that row is multiplied.`}</p>
              <p style={{margin:0,fontSize:'.9rem'}}>{String.raw`The constant must be `}<b>nonzero</b>{String.raw` — multiplying by 0 would erase the equation and destroy information.`}</p>
            </DefBox>

            <p>{String.raw`Why is the solution preserved? Multiplying an equation by a nonzero number gives an `}<b>equivalent equation</b>{String.raw` — "$2x + 4y = 6$" and "$x + 2y = 3$" (after $\tfrac{1}{2}R_1$) have exactly the same solutions. Apply $\tfrac{1}{2}R_2$ to the second row:`}</p>

            <div className="sbs">
              <div className="sbs-card">
                <div className="sbs-label">System after ½R₂</div>
                <p style={{margin:0,textAlign:'center'}}>{String.raw`$$\begin{cases} x - y = 1 \\ x + 2y = 3 \\ 3x + y = 7 \end{cases}$$`}</p>
              </div>
              <div className="sbs-card">
                <div className="sbs-label">Matrix after ½R₂</div>
                <p style={{margin:0,textAlign:'center'}}>{String.raw`$$\left(\begin{array}{cc|c} 1 & -1 & 1 \\ 1 & 2 & 3 \\ 3 & 1 & 7 \end{array}\right)$$`}</p>
              </div>
            </div>

            {/* OP 3 */}
            <DefBox term="Operation 3 · Add a multiple of one row to another" color="teal">
              <p style={{margin:'0 0 6px'}}>{String.raw`Notation: $R_3 - 2R_1$ means "replace row 3 by (row 3 minus twice row 1)."`}</p>
              <p style={{margin:0,fontSize:'.9rem'}}>{String.raw`Only `}<b>$R_3$ changes</b>{String.raw`. We compute $2R_1$ and subtract it from $R_3$; rows 1 and 2 are left exactly as they were. The row being replaced is the one written first.`}</p>
            </DefBox>

            <p>{String.raw`This is the workhorse — it is how we create zeros below a pivot. Why does it preserve the solution? Because any values $(x,y)$ that satisfy both row 1 and row 3 will also satisfy "row 3 minus twice row 1" — you are just combining two true equations into another true one. Apply $R_2 - R_1$ and $R_3 - 3R_1$ to clear column 1 below the top pivot:`}</p>

            <div className="sbs">
              <div className="sbs-card">
                <div className="sbs-label">System after R₂−R₁, R₃−3R₁</div>
                <p style={{margin:0,textAlign:'center'}}>{String.raw`$$\begin{cases} x - y = 1 \\ 3y = 2 \\ 4y = 4 \end{cases}$$`}</p>
              </div>
              <div className="sbs-card">
                <div className="sbs-label">Matrix (column 1 cleared)</div>
                <p style={{margin:0,textAlign:'center'}}>{String.raw`$$\left(\begin{array}{cc|c} 1 & -1 & 1 \\ 0 & 3 & 2 \\ 0 & 4 & 4 \end{array}\right)$$`}</p>
              </div>
            </div>

            <p>Notice how the matrix is marching toward REF: the first column now has its leading 1 on top and zeros below. We would continue — scale row 2 to get a leading 1, clear below it, and so on — but first let us name what we have just done.</p>

            <DefBox term="Elementary row operations" color="amber">
              <p style={{margin:'0 0 8px'}}>The three moves above are called the <b>elementary row operations</b>:</p>
              <p style={{margin:'0 0 4px'}}>{String.raw`1. `}<b>Interchange</b>{String.raw` two rows  $(R_{ij})$.`}</p>
              <p style={{margin:'0 0 4px'}}>{String.raw`2. `}<b>Multiply</b>{String.raw` a row by a nonzero constant  $(kR_i)$.`}</p>
              <p style={{margin:'0 0 8px'}}>{String.raw`3. `}<b>Add</b>{String.raw` a multiple of one row to another  $(R_i + kR_j)$.`}</p>
              <p style={{margin:0}}>Each one leaves the solution set unchanged. And here is the powerful fact that makes the whole method work:</p>
            </DefBox>

            <Callout icon="✅" title="The fundamental fact" color="teal">
              <b>Every matrix can be carried to row-echelon form by a finite sequence of elementary row operations.</b> No matter how messy the starting matrix, this is always possible. That guarantee is what makes the next method universal.
            </Callout>

            {/* ─── GAUSSIAN ELIMINATION ─── */}
            <Sec id="gauss" n="§4">Gaussian Elimination</Sec>

            <DefBox term="Gaussian elimination" color="violet">
              <p style={{margin:0}}>{String.raw`The `}<b>Gaussian elimination</b>{String.raw` method solves a linear system by: (1) writing its augmented matrix, (2) using elementary row operations to reduce it to row-echelon form, working pivot by pivot from the top-left, and (3) reading the solution by back-substitution. Working column by column: make the pivot a leading 1, then use it to clear every entry below it; move to the next pivot; repeat.`}</p>
            </DefBox>

            <p>The target, step by step: get a leading 1 in the first pivot position, use it to zero out everything below in that column, move down-right to the next pivot, make it a leading 1, clear below it, and continue until the matrix is in REF. Then back-substitute. Watch the entire process play out on a 4-variable system — click through one step at a time:</p>

            <RowReduceApplet />

            <p>Now a fully worked example you can follow on paper:</p>

            <Example n="A" title="Gaussian elimination, start to finish">
              <p>{String.raw`Solve $\begin{cases} 2x + y - z = 8 \\ -3x - y + 2z = -11 \\ -2x + y + 2z = -3 \end{cases}$`}</p>
              <p>{String.raw`**Augmented matrix:** $\left(\begin{array}{ccc|c} 2 & 1 & -1 & 8 \\ -3 & -1 & 2 & -11 \\ -2 & 1 & 2 & -3 \end{array}\right)$`}</p>
              <p>{String.raw`$\tfrac{1}{2}R_1$ (make first pivot a leading 1): $\left(\begin{array}{ccc|c} 1 & \tfrac12 & -\tfrac12 & 4 \\ -3 & -1 & 2 & -11 \\ -2 & 1 & 2 & -3 \end{array}\right)$`}</p>
              <p>{String.raw`$R_2 + 3R_1$ and $R_3 + 2R_1$ (clear below): $\left(\begin{array}{ccc|c} 1 & \tfrac12 & -\tfrac12 & 4 \\ 0 & \tfrac12 & \tfrac12 & 1 \\ 0 & 2 & 1 & 5 \end{array}\right)$`}</p>
              <p>{String.raw`$2R_2$ (second pivot to 1): $\left(\begin{array}{ccc|c} 1 & \tfrac12 & -\tfrac12 & 4 \\ 0 & 1 & 1 & 2 \\ 0 & 2 & 1 & 5 \end{array}\right)$, then $R_3 - 2R_2$: $\left(\begin{array}{ccc|c} 1 & \tfrac12 & -\tfrac12 & 4 \\ 0 & 1 & 1 & 2 \\ 0 & 0 & -1 & 1 \end{array}\right)$`}</p>
              <p>{String.raw`$-R_3$ (third pivot to 1): $\left(\begin{array}{ccc|c} 1 & \tfrac12 & -\tfrac12 & 4 \\ 0 & 1 & 1 & 2 \\ 0 & 0 & 1 & -1 \end{array}\right)$ — this is REF.`}</p>
              <p>{String.raw`**Back-substitute:** bottom row gives $z = -1$. Middle: $y + (-1) = 2 \Rightarrow y = 3$. Top: $x + \tfrac12(3) - \tfrac12(-1) = 4 \Rightarrow x + 2 = 4 \Rightarrow x = 2$.`}</p>
              <p>{String.raw`**Solution:** $(x, y, z) = (2, 3, -1)$. Check in equation 1: $2(2)+3-(-1) = 4+3+1 = 8$ ✓.`}</p>
            </Example>

            {/* ─── INFINITE SOLUTIONS ─── */}
            <Sec id="infinite" n="§5">Writing Infinitely Many Solutions</Sec>

            <p>Sometimes elimination leaves us with fewer "real" equations than variables. The system is still consistent — but instead of one answer, there is a whole family. We need a clean way to write that family. Consider this augmented matrix, already in REF, with <b>6 variables</b>{String.raw` $x_1, \dots, x_6$:`}</p>

            <p style={{textAlign:'center'}}>{String.raw`$$\left(\begin{array}{cccccc|c} 1 & 2 & 0 & 3 & 1 & 0 & -1 \\ 0 & 0 & 1 & -1 & 1 & 0 & 2 \\ 0 & 0 & 0 & 0 & 0 & 1 & 3 \\ 0 & 0 & 0 & 0 & 0 & 0 & 0 \end{array}\right)$$`}</p>

            <p>Before solving, let us count carefully — this counting is the heart of the whole consistency story:</p>

            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))',gap:'14px',margin:'20px 0'}}>
              {[
                {label:'Variables', val:'6', sub:'x₁ … x₆', color:'#38c9b0'},
                {label:'Equations (rows)', val:'4', sub:'one is all-zero', color:'#e8a020'},
                {label:'Pivot entries', val:'3', sub:'cols 1, 3, 6', color:'#9b80e8'},
              ].map(c=>(
                <div key={c.label} style={{background:'rgba(255,255,255,.97)',border:`1px solid ${c.color}40`,borderTop:`3px solid ${c.color}`,borderRadius:'12px',padding:'16px',textAlign:'center'}}>
                  <div style={{fontFamily:'var(--fh)',fontSize:'2rem',color:c.color,fontWeight:600}}>{c.val}</div>
                  <div style={{fontFamily:'var(--fm)',fontSize:'.66rem',letterSpacing:'.08em',textTransform:'uppercase',color:'var(--lec-ink2)',marginTop:'4px'}}>{c.label}</div>
                  <div style={{fontSize:'.78rem',color:'var(--lec-ink3)',marginTop:'2px'}}>{c.sub}</div>
                </div>
              ))}
            </div>

            <DefBox term="Two facts that are always true" color="amber">
              <p style={{margin:'0 0 6px'}}>{String.raw`For any system, count the pivot entries in the REF of the augmented matrix. Then:`}</p>
              <p style={{margin:'0 0 4px'}}>{String.raw`• `}<b>{String.raw`(number of variables) $\ge$ (number of pivots)`}</b>{String.raw` — pivots sit in distinct columns, and there are only as many columns as variables.`}</p>
              <p style={{margin:0}}>{String.raw`• `}<b>{String.raw`(number of equations) $\ge$ (number of pivots)`}</b>{String.raw` — each pivot heads a distinct nonzero row, and there are only as many rows as equations.`}</p>
            </DefBox>

            <p>{String.raw`In our example: variables $= 6$, pivots $= 3$, so variables $> $ pivots. That gap is exactly what produces freedom. The variables whose columns contain a pivot are `}<b>determined</b>{String.raw`; the rest are `}<b>free</b>.</p>

            <DefBox term="Free variables" color="teal">
              <p style={{margin:0}}>{String.raw`The number of `}<b>free variables</b>{String.raw` is $(\text{variables}) - (\text{pivots})$. In our example, $6 - 3 = 3$ free variables. The pivot columns are 1, 3, 6, so $x_1, x_3, x_6$ are determined; the non-pivot columns are 2, 4, 5, so `}<b>$x_2, x_4, x_5$ are free</b>{String.raw` — they may take any value.`}</p>
            </DefBox>

            <DefBox term="Parameters" color="violet">
              <p style={{margin:0}}>{String.raw`To write the solution, we assign a `}<b>parameter</b>{String.raw` to each free variable. In this course we use $r, s, t, u, \dots$. A solution containing free parameters is an `}<b>infinite family</b>{String.raw` of solutions — each choice of parameter values gives one specific solution. So "infinitely many solutions" simply means the answer carries free parameters.`}</p>
            </DefBox>

            <Example n="B" title="Writing the infinite solution set, in exam format">
              <p>{String.raw`Assign parameters to the free variables: $x_2 = s,\quad x_4 = t,\quad x_5 = u$.`}</p>
              <p>{String.raw`Read each pivot row as an equation and solve for its pivot variable:`}</p>
              <p>{String.raw`Row 3: $x_6 = 3$.`}</p>
              <p>{String.raw`Row 2: $x_3 - x_4 + x_5 = 2 \Rightarrow x_3 = 2 + x_4 - x_5 = 2 + t - u$.`}</p>
              <p>{String.raw`Row 1: $x_1 + 2x_2 + 3x_4 + x_5 = -1 \Rightarrow x_1 = -1 - 2s - 3t - u$.`}</p>
              <p>{String.raw`**Write the full solution as a column vector** — this is the format we expect in the exam:`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$\begin{pmatrix} x_1 \\ x_2 \\ x_3 \\ x_4 \\ x_5 \\ x_6 \end{pmatrix} = \begin{pmatrix} -1 - 2s - 3t - u \\ s \\ 2 + t - u \\ t \\ u \\ 3 \end{pmatrix}, \qquad s, t, u \in \mathbb{R}.$$`}</p>
              <p>{String.raw`Every choice of $(s, t, u)$ gives one solution; since there are infinitely many such choices, the system has infinitely many solutions.`}</p>
            </Example>

            <Callout icon="✍️" title="Exam requirement" color="rose">
              When a system has infinitely many solutions, you must write the answer in this <b>column-vector-with-parameters</b> form, stating which symbols are free parameters. A vague "infinitely many solutions" earns little credit — show the structure.
            </Callout>

            {/* ─── RANK & CONSISTENCY ─── */}
            <Sec id="rank" n="§6">Rank, and the Complete Consistency Test</Sec>

            <DefBox term="Rank of a matrix" color="amber">
              <p style={{margin:0}}>The <b>rank</b> of a matrix is the number of <b>nonzero rows</b> in its row-echelon form — equivalently, the number of <b>pivots (leading 1s)</b>. It measures how much genuine, non-redundant information the matrix carries.</p>
            </DefBox>

            <Example n="C" title="Reading rank off REF">
              <p>{String.raw`(a) $\left(\begin{array}{ccc} 1 & 2 & 3 \\ 0 & 1 & 4 \\ 0 & 0 & 1 \end{array}\right)$ — three nonzero rows, three pivots. **Rank $= 3$.**`}</p>
              <p>{String.raw`(b) $\left(\begin{array}{ccc} 1 & 2 & 0 \\ 0 & 1 & 5 \\ 0 & 0 & 0 \end{array}\right)$ — two nonzero rows. **Rank $= 2$.**`}</p>
              <p>{String.raw`(c) $\left(\begin{array}{cccc} 1 & 0 & 3 & 0 \\ 0 & 1 & 2 & 0 \\ 0 & 0 & 0 & 1 \\ 0 & 0 & 0 & 0 \end{array}\right)$ — three pivots (cols 1, 2, 4). **Rank $= 3$.**`}</p>
            </Example>

            <Callout icon="⚠️" title="Rank of an augmented matrix" color="amber">
              {String.raw`When you take the rank of an augmented matrix $(A \mid b)$, `}<b>ignore the separating bar</b>{String.raw` — treat it as one full matrix and count all the nonzero rows. The bar is a reading aid, not a boundary for counting rank.`}
            </Callout>

            <Example n="D" title="Your turn — find the rank" advanced>
              <p>{String.raw`Find the rank of each (all already in REF):`}</p>
              <p>{String.raw`(i) $\left(\begin{array}{ccc} 1 & 3 & 1 \\ 0 & 1 & 2 \\ 0 & 0 & 0 \end{array}\right)$ \quad (ii) $\left(\begin{array}{cccc} 1 & 0 & 2 & 5 \\ 0 & 1 & 1 & 3 \end{array}\right)$ \quad (iii) $\left(\begin{array}{ccc|c} 1 & 2 & 1 & 0 \\ 0 & 0 & 1 & 4 \\ 0 & 0 & 0 & 1 \end{array}\right)$`}</p>
              <Reveal label="Show answers">
                <p style={{margin:0}}>{String.raw`(i) Rank $= 2$ (two nonzero rows). (ii) Rank $= 2$. (iii) Treating it as a full matrix ignoring the bar: three nonzero rows, so rank $= 3$. Note this is the rank of $(A\mid b)$; the rank of $A$ alone (first three columns) is only $2$, since its third row $(0\,0\,0)$ is zero — a mismatch we are about to learn to read.`}</p>
              </Reveal>
            </Example>

            {/* worked 1.2.5(g) */}
            <Example n="E" title="Book Exercise 1.2.5(g) — a consistent system with a free variable">
              <p>{String.raw`Solve $\begin{cases} x + y + z = 2 \\ x + z = 1 \\ 2x + 5y + 2z = 7 \end{cases}$ by Gaussian elimination.`}</p>
              <p>{String.raw`**Augmented:** $\left(\begin{array}{ccc|c} 1 & 1 & 1 & 2 \\ 1 & 0 & 1 & 1 \\ 2 & 5 & 2 & 7 \end{array}\right)$`}</p>
              <p>{String.raw`$R_2 - R_1$, $R_3 - 2R_1$: $\left(\begin{array}{ccc|c} 1 & 1 & 1 & 2 \\ 0 & -1 & 0 & -1 \\ 0 & 3 & 0 & 3 \end{array}\right)$`}</p>
              <p>{String.raw`$-R_2$: $\left(\begin{array}{ccc|c} 1 & 1 & 1 & 2 \\ 0 & 1 & 0 & 1 \\ 0 & 3 & 0 & 3 \end{array}\right)$, then $R_3 - 3R_2$: $\left(\begin{array}{ccc|c} 1 & 1 & 1 & 2 \\ 0 & 1 & 0 & 1 \\ 0 & 0 & 0 & 0 \end{array}\right)$ — REF, with a `}<b>zero row</b>{String.raw` at the bottom.`}</p>
              <p>{String.raw`**Count:** variables $= 3$, pivots $= 2$ (columns 1, 2). Free variables $= 3 - 2 = 1$. The non-pivot column is 3, so `}<b>$z$ is free</b>{String.raw`. Set $z = t$.`}</p>
              <p>{String.raw`Row 2: $y = 1$. Row 1: $x + y + z = 2 \Rightarrow x = 2 - 1 - t = 1 - t$.`}</p>
              <p>{String.raw`**Solution:** $\begin{pmatrix} x \\ y \\ z \end{pmatrix} = \begin{pmatrix} 1 - t \\ 1 \\ t \end{pmatrix},\quad t \in \mathbb{R}.$ Consistent, infinitely many solutions.`}</p>
            </Example>

            {/* modified -> no solution */}
            <Example n="F" title="The same system, one number changed — now impossible">
              <p>{String.raw`Change the last constant from 7 to 8: $\begin{cases} x + y + z = 2 \\ x + z = 1 \\ 2x + 5y + 2z = 8 \end{cases}$`}</p>
              <p>{String.raw`The identical row operations now give: $\left(\begin{array}{ccc|c} 1 & 1 & 1 & 2 \\ 0 & 1 & 0 & 1 \\ 0 & 0 & 0 & 1 \end{array}\right)$`}</p>
              <p>{String.raw`Look at the bottom row: $0x + 0y + 0z = 1$, i.e. $0 = 1$. `}<b>Impossible.</b>{String.raw` Whenever elimination produces a zero row on the left with a `}<b>nonzero</b>{String.raw` constant on the right, stop immediately — the system has `}<b>no solution</b>{String.raw`. It is inconsistent.`}</p>
              <p>{String.raw`In rank language: $\operatorname{rank}(A) = 2$ but $\operatorname{rank}(A\mid b) = 3$. Since `}<b>{String.raw`$\operatorname{rank}(A) < \operatorname{rank}(A\mid b)$`}</b>{String.raw`, no solution exists.`}</p>
            </Example>

            {/* unique example */}
            <Example n="G" title="A system with a unique solution">
              <p>{String.raw`Recall Example A: it reduced to $\left(\begin{array}{ccc|c} 1 & \tfrac12 & -\tfrac12 & 4 \\ 0 & 1 & 1 & 2 \\ 0 & 0 & 1 & -1 \end{array}\right)$ with solution $(2, 3, -1)$.`}</p>
              <p>{String.raw`Here variables $= 3$ and pivots $= 3$ — every variable has a pivot, no free variables. $\operatorname{rank}(A) = \operatorname{rank}(A\mid b) = 3 = $ number of variables. That is exactly the fingerprint of a `}<b>unique solution</b>.</p>
            </Example>

            <DefBox term="The complete consistency test" color="violet">
              <p style={{margin:'0 0 8px'}}>{String.raw`For a system $AX = b$ with $n$ variables, compare $\operatorname{rank}(A)$ and $\operatorname{rank}(A\mid b)$:`}</p>
              <p style={{margin:'0 0 5px'}}>{String.raw`• `}<b>{String.raw`$\operatorname{rank}(A) < \operatorname{rank}(A\mid b)$`}</b>{String.raw`  →  `}<b>inconsistent</b>{String.raw` (no solution).`}</p>
              <p style={{margin:'0 0 5px'}}>{String.raw`• `}<b>{String.raw`$\operatorname{rank}(A) = \operatorname{rank}(A\mid b) = n$`}</b>{String.raw`  →  consistent, `}<b>unique</b>{String.raw` solution.`}</p>
              <p style={{margin:0}}>{String.raw`• `}<b>{String.raw`$\operatorname{rank}(A) = \operatorname{rank}(A\mid b) < n$`}</b>{String.raw`  →  consistent, `}<b>infinitely many</b>{String.raw` solutions ($n - \operatorname{rank}$ free variables).`}</p>
            </DefBox>

            <Callout icon="🎯" title="Answers to our three opening questions" color="teal">
              <b>(1) How to solve large systems?</b> Gaussian elimination — reduce to REF, back-substitute. It scales to any size. <b>(2) Is it consistent?</b>{String.raw` Yes exactly when $\operatorname{rank}(A) = \operatorname{rank}(A\mid b)$; if the ranks differ, it is inconsistent. `}<b>(3) Is the solution unique?</b> Unique exactly when that common rank also equals the number of variables; if it is smaller, there are infinitely many solutions.
            </Callout>

            {/* parametric a,b problem */}
            <Sec id="exercises" n="§7">Worked Problem & Exercises</Sec>

            <Example n="H" title="Book Exercise 1.2.9(c) — solve for the parameters a and b" advanced>
              <p>{String.raw`For which values of $a$ and $b$ does $\begin{cases} -x + 3y + 2z = -8 \\ x + z = 2 \\ 3x + 3y + az = b \end{cases}$ have (1) no solution, (2) infinitely many, (3) a unique solution?`}</p>
              <Reveal label="Show full solution">
                <p style={{margin:'0 0 10px'}}>{String.raw`**Augmented:** $\left(\begin{array}{ccc|c} -1 & 3 & 2 & -8 \\ 1 & 0 & 1 & 2 \\ 3 & 3 & a & b \end{array}\right)$. Use row 2 as the top pivot via $R_{12}$:`}</p>
                <p style={{margin:'0 0 10px'}}>{String.raw`$\left(\begin{array}{ccc|c} 1 & 0 & 1 & 2 \\ -1 & 3 & 2 & -8 \\ 3 & 3 & a & b \end{array}\right)$. Then $R_2 + R_1$ and $R_3 - 3R_1$:`}</p>
                <p style={{margin:'0 0 10px'}}>{String.raw`$\left(\begin{array}{ccc|c} 1 & 0 & 1 & 2 \\ 0 & 3 & 3 & -6 \\ 0 & 3 & a-3 & b-6 \end{array}\right)$. Then $\tfrac13 R_2$ and $R_3 - 3R_2$ (i.e. $R_3 - (3)R_2$ after scaling, equivalently subtract original row 2):`}</p>
                <p style={{margin:'0 0 10px'}}>{String.raw`$\left(\begin{array}{ccc|c} 1 & 0 & 1 & 2 \\ 0 & 1 & 1 & -2 \\ 0 & 0 & a-6 & b \end{array}\right)$. The bottom equation is $(a-6)\,z = b$.`}</p>
                <p style={{margin:'0 0 6px'}}>{String.raw`**Case 1 — unique solution:** if $a - 6 \ne 0$, i.e. `}<b>{String.raw`$a \ne 6$`}</b>{String.raw` (any $b$). Then $z$ is determined, and back-substitution fixes $y$ and $x$. Three pivots, three variables.`}</p>
                <p style={{margin:'0 0 6px'}}>{String.raw`**Case 2 — no solution:** if $a = 6$ and `}<b>{String.raw`$b \ne 0$`}</b>{String.raw`, the bottom row is $0 = b \ne 0$. Inconsistent: $\operatorname{rank}(A) = 2 < 3 = \operatorname{rank}(A\mid b)$.`}</p>
                <p style={{margin:0}}>{String.raw`**Case 3 — infinitely many:** if $a = 6$ and `}<b>{String.raw`$b = 0$`}</b>{String.raw`, the bottom row is $0 = 0$. Then $\operatorname{rank}(A) = \operatorname{rank}(A\mid b) = 2 < 3$, leaving one free variable.`}</p>
              </Reveal>
            </Example>

            <p style={{fontFamily:'var(--fh)',fontSize:'1.3rem',color:'var(--lec-ink)',margin:'40px 0 12px',fontWeight:600}}>Exercises from the textbook (Nicholson §1.2)</p>
            <p>Work these by hand first, then reveal the worked solution to check. These are the kind of problems you will see on quizzes and the midterm.</p>

            {/* 1.2.17 */}
            <Example n="1.2.17" title="Car rental rates">
              <p>{String.raw`Three Nissans, two Fords, and four Chevrolets rent for \$106/day. Two Nissans, four Fords, three Chevrolets cost \$107/day. Four Nissans, three Fords, two Chevrolets cost \$102/day. Find each rate.`}</p>
              <Reveal>
                <p style={{margin:'0 0 8px'}}>{String.raw`Let $n, f, c$ be the daily rates (Nissan, Ford, Chevrolet). System: $\begin{cases} 3n + 2f + 4c = 106 \\ 2n + 4f + 3c = 107 \\ 4n + 3f + 2c = 102 \end{cases}$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`Augmented matrix $\left(\begin{array}{ccc|c}3&2&4&106\\2&4&3&107\\4&3&2&102\end{array}\right)$. Reducing to REF and back-substituting gives a unique solution (three pivots, three variables).`}</p>
                <p style={{margin:0}}>{String.raw`**Solution:** `}<b>{String.raw`$n = 10$, $f = 12$, $c = 13$`}</b>{String.raw` dollars per day. Check: eq 1 $= 3(10)+2(12)+4(13) = 30+24+52 = 106$ ✓; eq 2 $= 2(10)+4(12)+3(13) = 20+48+39 = 107$ ✓; eq 3 $= 4(10)+3(12)+2(13) = 40+36+26 = 102$ ✓.`}</p>
              </Reveal>
            </Example>

            {/* 1.2.18 */}
            <Example n="1.2.18" title="Club membership in equilibrium">
              <p>{String.raw`A school has three clubs; each student belongs to exactly one. After switching: Club A keeps $\tfrac{4}{10}$, sends $\tfrac{1}{10}$ to B, $\tfrac{5}{10}$ to C. Club B keeps $\tfrac{7}{10}$, sends $\tfrac{2}{10}$ to A, $\tfrac{1}{10}$ to C. Club C keeps $\tfrac{6}{10}$, sends $\tfrac{2}{10}$ to A, $\tfrac{2}{10}$ to B. If each club's fraction of the population is unchanged, find these fractions.`}</p>
              <Reveal>
                <p style={{margin:'0 0 8px'}}>{String.raw`Let $a, b, c$ be the population fractions of clubs A, B, C. "Unchanged" means the total inflow to each club equals its current fraction. Reading the inflows (A keeps $\tfrac{4}{10}$ of itself, receives $\tfrac{2}{10}$ of B and $\tfrac{2}{10}$ of C, and so on):`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\begin{cases} \tfrac{4}{10}a + \tfrac{2}{10}b + \tfrac{2}{10}c = a \\ \tfrac{1}{10}a + \tfrac{7}{10}b + \tfrac{2}{10}c = b \\ \tfrac{5}{10}a + \tfrac{1}{10}b + \tfrac{6}{10}c = c \end{cases}$ together with $a + b + c = 1$.`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`Moving every variable to one side gives a homogeneous system $(M - I)\,\mathbf{x} = \mathbf{0}$. Its row reduction leaves one free variable (the three equilibrium equations are dependent), so the family of solutions is a single line; the normalisation $a+b+c=1$ picks out the one point on it that is a genuine set of population fractions.`}</p>
                <p style={{margin:0}}>{String.raw`**Solution:** `}<b>{String.raw`$a = \tfrac{1}{4}$, $b = \tfrac{7}{20}$, $c = \tfrac{2}{5}$`}</b>{String.raw` — that is, $0.25$, $0.35$, $0.40$. Check they sum to $1$ ✓, and substituting back leaves each club's fraction unchanged ✓.`}</p>
              </Reveal>
            </Example>

            {/* 1.2.20 */}
            <Example n="1.2.20" title="Recovering lost scores" advanced>
              <p>{String.raw`Three players' scores are lost. We know the totals for players 1&2, for 2&3, and for 3&1. (a) Show the individual scores can be recovered. (b) Is it possible with four players, knowing totals for 1&2, 2&3, 3&4, and 4&1?`}</p>
              <Reveal>
                <p style={{margin:'0 0 8px'}}>{String.raw`(a) Let scores be $x_1, x_2, x_3$ and totals $x_1+x_2 = s_1$, $x_2+x_3 = s_2$, $x_3+x_1 = s_3$. The coefficient matrix $\left(\begin{array}{ccc}1&1&0\\0&1&1\\1&0&1\end{array}\right)$ reduces to rank 3 — three pivots, three variables — so the solution is `}<b>unique</b>{String.raw`: the scores are recoverable. Explicitly $x_1 = \tfrac{s_1 - s_2 + s_3}{2}$, and similarly for the others.`}</p>
                <p style={{margin:0}}>{String.raw`(b) With four players and totals $x_1+x_2, x_2+x_3, x_3+x_4, x_4+x_1$, the coefficient matrix has `}<b>rank 3, not 4</b>{String.raw` (the four equations are dependent: total of 1&2 plus total of 3&4 equals total of 2&3 plus total of 4&1). So the scores `}<b>cannot</b>{String.raw` be uniquely recovered — there is one free parameter.`}</p>
              </Reveal>
            </Example>

            {/* 1.2.21 */}
            <Example n="1.2.21" title="Coins adding to $1.05">
              <p>{String.raw`A boy finds \$1.05 in dimes (10¢), nickels (5¢), and pennies (1¢). There are 17 coins in all. How many of each type can he have?`}</p>
              <Reveal>
                <p style={{margin:'0 0 8px'}}>{String.raw`Let $d, n, p$ be the counts. $\begin{cases} d + n + p = 17 \\ 10d + 5n + p = 105 \end{cases}$ — two equations, three unknowns, so expect a free variable (but constrained to non-negative integers).`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`Subtracting the equations: $9d + 4n = 88$. We need non-negative integers, so $88 - 9d$ must be divisible by 4 and $\ge 0$. Testing $d = 0, 1, 2, \dots$: only $d = 4$ (giving $n = 13$) and $d = 8$ (giving $n = 4$) work; then $p = 17 - d - n$.`}</p>
                <p style={{margin:0}}>{String.raw`**Two solutions:** `}<b>{String.raw`$(d, n, p) = (4, 13, 0)$`}</b>{String.raw` — 4 dimes, 13 nickels, 0 pennies; or `}<b>{String.raw`$(d, n, p) = (8, 4, 5)$`}</b>{String.raw` — 8 dimes, 4 nickels, 5 pennies. Check the first: value $= 40 + 65 + 0 = 105$¢ ✓, coins $= 17$ ✓. The integer/non-negativity constraint is what collapses the algebraic "infinitely many" family down to just these two real-world answers.`}</p>
              </Reveal>
            </Example>

            {/* 1.2.19 */}
            <Example n="1.2.19" title="Three points on a parabola" advanced>
              <p>{String.raw`Given points $(p_1, q_1), (p_2, q_2), (p_3, q_3)$ with $p_1, p_2, p_3$ distinct, show they lie on a curve $y = a + bx + cx^2$. (Hint: solve for $a, b, c$.)`}</p>
              <Reveal>
                <p style={{margin:'0 0 8px'}}>{String.raw`Requiring each point to satisfy $y = a + bx + cx^2$ gives three linear equations in the unknowns $a, b, c$:`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\begin{cases} a + b p_1 + c p_1^2 = q_1 \\ a + b p_2 + c p_2^2 = q_2 \\ a + b p_3 + c p_3^2 = q_3 \end{cases}$`}</p>
                <p style={{margin:0}}>{String.raw`The coefficient matrix is a $3\times 3$ Vandermonde matrix. Because $p_1, p_2, p_3$ are `}<b>distinct</b>{String.raw`, its rows are independent (rank 3), so the system has a `}<b>unique</b>{String.raw` solution $(a, b, c)$. Those values define a curve $y = a + bx + cx^2$ passing through all three points.`}</p>
              </Reveal>
            </Example>

            {/* 1.2.13 */}
            <Example n="1.2.13" title="Row operations between two arrays" advanced>
              <p>{String.raw`Find a sequence of row operations carrying $\left(\begin{array}{ccc} b_1+c_1 & b_2+c_2 & b_3+c_3 \\ c_1+a_1 & c_2+a_2 & c_3+a_3 \\ a_1+b_1 & a_2+b_2 & a_3+b_3 \end{array}\right)$ to $\left(\begin{array}{ccc} a_1 & a_2 & a_3 \\ b_1 & b_2 & b_3 \\ c_1 & c_2 & c_3 \end{array}\right)$.`}</p>
              <Reveal>
                <p style={{margin:'0 0 8px'}}>{String.raw`Label the start rows $R_1 = b+c$, $R_2 = c+a$, $R_3 = a+b$ (each a row vector). Their sum is $R_1+R_2+R_3 = 2(a+b+c)$, so $\tfrac12(R_1+R_2+R_3) = a+b+c$.`}</p>
                <p style={{margin:0}}>{String.raw`Then: $a = (a+b+c) - (b+c) = \tfrac12(R_1+R_2+R_3) - R_1$. Similarly $b = \tfrac12(R_1+R_2+R_3) - R_2$ and $c = \tfrac12(R_1+R_2+R_3) - R_3$. Each target row is a combination of the starting rows, achievable by elementary row operations: form the half-sum, then subtract the appropriate original row. (Care: forming the half-sum in place requires a sequence of add/scale operations — write them out step by step.)`}</p>
              </Reveal>
            </Example>

            {/* 1.2.12 conceptual */}
            <Example n="1.2.12" title="True or false — reasoning about consistency" advanced>
              <p>{String.raw`A system has augmented matrix $A$ and coefficient matrix $C$. Decide each (prove or give a counterexample):`}</p>
              <p style={{margin:'4px 0',fontSize:'.95rem'}}>{String.raw`a. More than one solution $\Rightarrow$ $A$ has a row of zeros. b. $A$ has a row of zeros $\Rightarrow$ more than one solution. c. No solution $\Rightarrow$ REF of $C$ has a zero row. d. REF of $C$ has a zero row $\Rightarrow$ no solution. e. No system is inconsistent for every choice of constants. f. Consistent for some constants $\Rightarrow$ consistent for every choice.`}</p>
              <p style={{margin:'4px 0',fontSize:'.95rem'}}>{String.raw`Now assume $A$ has 3 rows and 5 columns: g. consistent $\Rightarrow$ more than one solution. h. rank $A \le 3$. i. rank $A = 3 \Rightarrow$ consistent. j. rank $C = 3 \Rightarrow$ consistent.`}</p>
              <Reveal label="Show answers & reasoning">
                <p style={{margin:'0 0 6px'}}>{String.raw`**a. False.** A unique-vs-multiple distinction is about free variables, not zero rows of $A$; e.g. a $2\times2$ system with a free variable need not show a zero row in $(A\mid b)$ depending on form. (More precisely, multiple solutions $\Leftrightarrow$ a non-pivot column in $C$, which is not the same as a zero row in $A$.)`}</p>
                <p style={{margin:'0 0 6px'}}>{String.raw`**b. False.** A zero row in $A$ means a redundant equation, but the remaining equations could still pin down a unique solution if they involve all variables.`}</p>
                <p style={{margin:'0 0 6px'}}>{String.raw`**c. True.** No solution requires $\operatorname{rank}(C) < \operatorname{rank}(A)$, which forces $C$ to have fewer pivots than its rows — hence a zero row in the REF of $C$.`}</p>
                <p style={{margin:'0 0 6px'}}>{String.raw`**d. False.** A zero row in REF of $C$ only means $\operatorname{rank}(C) <$ number of rows; the system can still be consistent (e.g. with infinitely many solutions) if $\operatorname{rank}(A) = \operatorname{rank}(C)$.`}</p>
                <p style={{margin:'0 0 6px'}}>{String.raw`**e. True.** The system $0 = $ (constants) aside, any system with $b = 0$ (all-zero constants) is always consistent — $x = 0$ works. So no system is inconsistent for `}<i>every</i>{String.raw` choice of constants.`}</p>
                <p style={{margin:'0 0 6px'}}>{String.raw`**f. False.** Consistency can depend on the constants — Example F showed one constant turning a consistent system inconsistent.`}</p>
                <p style={{margin:'0 0 6px'}}>{String.raw`**g. False.** A $3\times5$ augmented matrix means 4 variables (5 columns minus the constant column). Consistent could still be unique if rank $= 4$… but rank $\le 3$ here (only 3 rows), and $3 < 4$, so actually it `}<i>will</i>{String.raw` have free variables — making g `}<b>True</b>{String.raw` in this specific shape. (Worth checking carefully: with 3 rows, rank $\le 3 < 4$ variables, so a consistent system has $\ge 1$ free variable, hence more than one solution.)`}</p>
                <p style={{margin:'0 0 6px'}}>{String.raw`**h. True.** Rank cannot exceed the number of rows, which is 3.`}</p>
                <p style={{margin:'0 0 6px'}}>{String.raw`**i. False.** Here $A$ is the augmented matrix. We could have $\operatorname{rank}(A) = 3$ while $\operatorname{rank}(C) = 2$ — the extra independent direction coming from the constant column. For example $C = \left(\begin{array}{cccc}1&0&0&0\\0&1&0&0\\0&0&0&0\end{array}\right)$ with constants $\left(\begin{array}{c}0\\0\\1\end{array}\right)$: then $\operatorname{rank}(C) = 2 < 3 = \operatorname{rank}(A)$, so the system is inconsistent. Knowing $\operatorname{rank}(A) = 3$ alone does not guarantee consistency.`}</p>
                <p style={{margin:0}}>{String.raw`**j. True.** $\operatorname{rank} C = 3$ with 3 rows means $C$'s REF has no zero row, so $\operatorname{rank}(A) = \operatorname{rank}(C)$ — consistent.`}</p>
                <p style={{margin:'10px 0 0',fontSize:'.85rem',fontStyle:'italic'}}>These conceptual problems reward careful rank reasoning over computation — exactly the motto in action: think before you compute.</p>
              </Reveal>
            </Example>

            <Callout icon="🔭" title="Why this matters — beyond the classroom" color="violet">
              Gaussian elimination is among the most-used algorithms on Earth. It is the core of how engineers solve circuit equations, how economists balance input–output models, how Google's early PageRank handled linear systems, and how every "solve" button in MATLAB, NumPy, and Excel works under the hood. The rank test you learned today is how software decides whether a model is well-posed or whether your data is contradictory. You are not learning a classroom trick — you are learning the computational spine of applied mathematics.
            </Callout>

            <div style={{ marginTop:'64px', paddingTop:'28px', borderTop:'2px solid var(--lec-border)', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'12px' }}>
              <div style={{ fontFamily:'var(--fm)', fontSize:'.76rem', color:'var(--lec-ink3)', fontStyle:'italic' }}>Lecture 2 — complete</div>
              <div style={{ fontFamily:'var(--fm)', fontSize:'.76rem', color:'var(--lec-ink3)' }}>MATH-120 · Shoaib Khan · LUMS · June 2026</div>
            </div>

          </div>

          {/* FOOTER NAV */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'22px 48px', borderTop:'1px solid var(--lec-border)', background:'var(--lec-paper)', flexWrap:'wrap', gap:'12px' }}>
            <Link href={PREV_HREF} style={{ fontFamily:'var(--fm)', fontSize:'.74rem', letterSpacing:'.08em', textTransform:'uppercase', color:'var(--lec-accent)', textDecoration:'none' }}>← Lecture 1</Link>
            <Link href={NEXT_HREF} style={{ fontFamily:'var(--fm)', fontSize:'.74rem', letterSpacing:'.08em', textTransform:'uppercase', color:'var(--lec-accent)', textDecoration:'none' }}>Lecture 3 →</Link>
          </div>
        </main>
      </div>

      <Footer />
    </>
  );
}