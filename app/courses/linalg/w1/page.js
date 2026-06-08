'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import Navbar from '../../../../components/Navbar';
import Footer from '../../../../components/Footer';

/* ════════════════════════════════════════════════════════════════
   MATH-120 · LECTURE 1  (FIRST HALF)
   Route: /courses/linalg/w1/lec1
   Sequences → indices → matrices → history → linear systems intro.

   ▸ SECOND HALF GOES WHERE MARKED "◀◀ SECOND HALF SLOTS IN HERE ▶▶"
     near the bottom of the JSX. Append-only — nothing above it moves.
   ════════════════════════════════════════════════════════════════ */

/* ─────────── LECTURE META (edit per lecture) ─────────── */
const LEC = {
  course: 'MATH-120 · Linear Algebra',
  number: 'Lecture 1',
  title: 'The Language of Matrices',
  subtitle: 'From sequences to systems of linear equations',
  date: '9 June 2026',
};

/* ─────────── SIDEBAR TOC (this lecture's sections) ─────────── */
const TOC = [
  ['seq', '1 · Sequences & the nth Term'],
  ['gen', '2 · The General Term aₙ'],
  ['idx', '3 · Adding a Second Index'],
  ['mat', '4 · Definition of a Matrix'],
  ['ord', '5 · Order, Rows & Columns'],
  ['types', '6 · Types of Matrices'],
  ['notation', '7 · Notation & Entries'],
  ['diag', '8 · Diagonals'],
  ['history', '9 · A Short History'],
  ['sys', '10 · Solving Linear Equations'],
  ['solutions', '11 · Types of Solutions'],
  ['r3', '12 · From 2D to 3D'],
  ['planes',  '13 · Picturing Planes'],
  ['elim3',   '14 · Elimination in 3 Variables'],
  ['dir',     '15 · Slope & Direction Ratios'],
  ['scale',   '16 · Scaling to 4, 5, 6 Variables'],
  ['matform', '17 · Matrix Form Ax = b'],
  ['aug',     '18 · Augmented Matrix (A | b)'],
  ['why',     '19 · A Matrix That Solves Itself'],
  ['ref',     '20 · Row-Echelon Form'],
  ['check',   '21 · Your Turn: Is It in REF?'],
];

/* ════════════════ REUSABLE LECTURE COMPONENTS ════════════════
   These are written to be lifted into app/courses/linalg/_components/
   later with zero changes. For now they live here.
   ════════════════════════════════════════════════════════════ */

// Collapsible derivation / "show me why" toggle.
function Reveal({ label = 'Show derivation', children }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ margin: '14px 0' }}>
      <button onClick={() => setOpen(o => !o)} style={{
        fontFamily: 'var(--fm)', fontSize: '.78rem', letterSpacing: '.04em',
        color: 'var(--amber)', background: 'rgba(232,160,32,.08)',
        border: '1px solid rgba(232,160,32,.35)', borderRadius: '8px',
        padding: '7px 14px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px',
      }}>
        <span style={{ transform: open ? 'rotate(90deg)' : 'none', transition: 'transform .2s' }}>▶</span>
        {open ? 'Hide' : label}
      </button>
      {open && (
        <div style={{ marginTop: '10px', padding: '14px 18px', background: 'rgba(0,0,0,.03)', border: '1px solid var(--lec-border)', borderRadius: '10px' }}>
          {children}
        </div>
      )}
    </div>
  );
}

// Definition box — accent left border.
function DefBox({ term, children }) {
  return (
    <div style={{ background: 'rgba(56,201,176,.08)', borderLeft: '4px solid #2a9d8f', borderRadius: '0 10px 10px 0', padding: '16px 20px', margin: '20px 0' }}>
      {term && <div style={{ fontFamily: 'var(--fm)', fontSize: '.7rem', letterSpacing: '.14em', textTransform: 'uppercase', color: '#2a9d8f', marginBottom: '6px' }}>Definition · {term}</div>}
      <div>{children}</div>
    </div>
  );
}

// Worked-example card — can hold several subparts.
function Example({ n, title, children }) {
  return (
    <div style={{ background: '#fff', border: '1px solid var(--lec-border)', borderRadius: '12px', padding: '22px 26px', margin: '22px 0', boxShadow: '0 2px 14px rgba(60,40,20,.05)' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '12px' }}>
        <span style={{ fontFamily: 'var(--fm)', fontSize: '.72rem', letterSpacing: '.1em', textTransform: 'uppercase', color: '#c8860a', background: 'rgba(232,160,32,.12)', padding: '3px 10px', borderRadius: '6px' }}>Example {n}</span>
        {title && <span style={{ fontFamily: 'var(--fh)', fontSize: '1.05rem', color: 'var(--lec-ink)' }}>{title}</span>}
      </div>
      {children}
    </div>
  );
}

// Section heading + anchor.
function Sec({ id, n, children }) {
  return (
    <h2 id={id} style={{ scrollMarginTop: 'calc(var(--nav-h) + 30px)', fontFamily: 'var(--fh)', fontSize: '1.7rem', color: 'var(--lec-ink)', margin: '48px 0 16px', display: 'flex', alignItems: 'baseline', gap: '12px' }}>
      <span style={{ fontFamily: 'var(--fm)', fontSize: '.9rem', color: '#c8860a' }}>{n}</span>
      {children}
    </h2>
  );
}

// Dark interactive-widget shell (matches your --dark-widget convention).
function Widget({ title, children }) {
  return (
    <div className="dark-widget" style={{ background: '#1a1a2e', borderRadius: '14px', padding: '20px', margin: '22px 0', color: '#e8e8f0' }}>
      {title && <div style={{ fontFamily: 'var(--fm)', fontSize: '.72rem', letterSpacing: '.12em', textTransform: 'uppercase', color: '#8a8ac0', marginBottom: '14px' }}>{title}</div>}
      {children}
    </div>
  );
}

/* ════════════════ 3D INTERACTIVE WIDGET ════════════════
   Plane in R³: ax + by + cz = d, drawn on a rotating 3D canvas.
   Pure canvas (no three.js) so it matches your existing widgets.
   ════════════════════════════════════════════════════════ */
function PlaneWidget() {
  const canvasRef = useRef(null);
  const [a, setA] = useState(2);
  const [b, setB] = useState(3);
  const [c, setC] = useState(0);   // c=0 → the "z not written" case
  const [d, setD] = useState(4);
  const [yaw, setYaw] = useState(-0.6);
  const [pitch, setPitch] = useState(-0.5);
  const drag = useRef(null);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    const W = 560, H = 380;
    cv.width = W; cv.height = H;
    const cx = W / 2, cy = H / 2, scale = 26;

    // 3D → 2D projection (rotate by yaw around vertical, pitch around horizontal)
    function project([x, y, z]) {
      const cosY = Math.cos(yaw), sinY = Math.sin(yaw);
      let x1 = x * cosY - y * sinY;
      let y1 = x * sinY + y * cosY;
      let z1 = z;
      const cosP = Math.cos(pitch), sinP = Math.sin(pitch);
      let y2 = y1 * cosP - z1 * sinP;
      let z2 = y1 * sinP + z1 * cosP;
      return [cx + x1 * scale, cy - z2 * scale, y2];
    }

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, W, H);

    const R = 5;
    // axes
    const axes = [
      { p: [[-R, 0, 0], [R, 0, 0]], col: '#e06b6b', label: 'x', tip: [R, 0, 0] },
      { p: [[0, -R, 0], [0, R, 0]], col: '#38c9b0', label: 'y', tip: [0, R, 0] },
      { p: [[0, 0, -R], [0, 0, R]], col: '#9b80e8', label: 'z', tip: [0, 0, R] },
    ];
    axes.forEach(ax => {
      const [s, e] = ax.p.map(project);
      ctx.strokeStyle = ax.col; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.moveTo(s[0], s[1]); ctx.lineTo(e[0], e[1]); ctx.stroke();
      const tp = project(ax.tip);
      ctx.fillStyle = ax.col; ctx.font = '13px monospace';
      ctx.fillText(ax.label, tp[0] + 4, tp[1] - 4);
    });

    // Plane ax+by+cz=d : sample a patch and shade it.
    // Solve for whichever variable has the largest coefficient to avoid div-by-0.
    const tris = [];
    const span = 4, step = 0.5;
    function zOf(x, y) {
      if (Math.abs(c) > 1e-6) return (d - a * x - b * y) / c;
      return null; // vertical plane (the z-free case): handle separately
    }
    if (Math.abs(c) > 1e-6) {
      for (let x = -span; x < span; x += step) {
        for (let y = -span; y < span; y += step) {
          const corners = [[x, y], [x + step, y], [x + step, y + step], [x, y + step]]
            .map(([px, py]) => project([px, py, zOf(px, py)]));
          const depth = (corners[0][2] + corners[2][2]) / 2;
          tris.push({ corners, depth });
        }
      }
    } else {
      // c = 0 → plane is vertical: ax+by=d for all z. Draw as a ribbon swept in z.
      // param the line ax+by=d in the xy-plane, sweep z from -span..span.
      const pts2d = [];
      for (let t = -span; t <= span; t += step) {
        let px, py;
        if (Math.abs(b) > 1e-6) { px = t; py = (d - a * t) / b; }
        else { py = t; px = (d - b * t) / a; }
        pts2d.push([px, py]);
      }
      for (let i = 0; i < pts2d.length - 1; i++) {
        const [x0, y0] = pts2d[i], [x1, y1] = pts2d[i + 1];
        const corners = [[x0, y0, -span], [x1, y1, -span], [x1, y1, span], [x0, y0, span]].map(project);
        const depth = (corners[0][2] + corners[2][2]) / 2;
        tris.push({ corners, depth });
      }
    }
    tris.sort((p, q) => p.depth - q.depth);
    tris.forEach(({ corners }) => {
      ctx.beginPath();
      ctx.moveTo(corners[0][0], corners[0][1]);
      for (let i = 1; i < corners.length; i++) ctx.lineTo(corners[i][0], corners[i][1]);
      ctx.closePath();
      ctx.fillStyle = 'rgba(232,160,32,.28)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(232,160,32,.55)';
      ctx.lineWidth = 0.6;
      ctx.stroke();
    });
  }, [a, b, c, d, yaw, pitch]);

  function onDown(e) { drag.current = { x: e.clientX, y: e.clientY, yaw, pitch }; }
  function onMove(e) {
    if (!drag.current) return;
    setYaw(drag.current.yaw + (e.clientX - drag.current.x) * 0.01);
    setPitch(drag.current.pitch + (e.clientY - drag.current.y) * 0.01);
  }
  function onUp() { drag.current = null; }

  const sliderRow = (label, val, set, min, max) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
      <span style={{ fontFamily: 'monospace', width: '18px', color: '#e8a020' }}>{label}</span>
      <input type="range" min={min} max={max} step="1" value={val} onChange={e => set(+e.target.value)} style={{ flex: 1 }} />
      <span style={{ fontFamily: 'monospace', width: '30px', textAlign: 'right' }}>{val}</span>
    </div>
  );

  return (
    <Widget title="Interactive · The plane ax + by + cz = d in ℝ³">
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <canvas
          ref={canvasRef}
          onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
          style={{ borderRadius: '10px', cursor: 'grab', touchAction: 'none', maxWidth: '100%' }}
        />
        <div style={{ flex: '1 1 200px', minWidth: '200px' }}>
          <div style={{ fontFamily: 'monospace', fontSize: '1.05rem', color: '#fff', marginBottom: '12px' }}>
            {a}x {b >= 0 ? '+' : '−'} {Math.abs(b)}y {c >= 0 ? '+' : '−'} {Math.abs(c)}z = {d}
          </div>
          {sliderRow('a', a, setA, -5, 5)}
          {sliderRow('b', b, setB, -5, 5)}
          {sliderRow('c', c, setC, -5, 5)}
          {sliderRow('d', d, setD, -8, 8)}
          <button onClick={() => setC(0)} style={{ marginTop: '8px', fontFamily: 'monospace', fontSize: '.74rem', color: '#9b80e8', background: 'rgba(155,128,232,.12)', border: '1px solid rgba(155,128,232,.4)', borderRadius: '7px', padding: '6px 12px', cursor: 'pointer' }}>
            Set c = 0 (the “no z” case)
          </button>
          <p style={{ fontSize: '.78rem', color: '#a0a0c8', marginTop: '12px', lineHeight: 1.5 }}>
            Drag the canvas to rotate. When <b style={{ color: '#9b80e8' }}>c = 0</b>, z is free — the equation holds for <i>every</i> z, so the line in the xy-plane sweeps upward into a vertical plane.
          </p>
        </div>
      </div>
    </Widget>
  );
}

// Interactive REF checker. Students decide Yes/No, get instant feedback.
const REF_EXAMPLES = [
  {
    m: [[1, 2, 3, 4], [0, 0, 1, 5], [0, 0, 0, 0]],
    isRef: true,
    why: 'Valid. Leading 1s in column 1 then column 3 (staircase moves right), the zero row is at the bottom. ✓',
  },
  {
    m: [[1, 0, 0], [0, 1, 0], [0, 0, 1]],
    isRef: true,
    why: 'Valid — this is the identity matrix. Leading 1s march down the diagonal; it is even in reduced form.',
  },
  {
    m: [[1, 2, 3, 4, 5], [0, 0, 0, 0, 0], [0, 1, 2, 4, 5], [0, 0, 0, 0, 0]],
    isRef: false,
    why: 'Not valid. A zero row (row 2) sits ABOVE a nonzero row (row 3). All zero rows must be at the bottom.',
  },
  {
    m: [[1, 2, 1, 3, 4], [0, 0, 0, 1, 2], [0, 0, 0, -1, 2]],
    isRef: false,
    why: 'Not valid, for two reasons: the leading entry of row 3 is −1, not 1; and rows 2 and 3 have their leading entries in the SAME column (4), so the staircase does not move right.',
  },
  {
    m: [[1, 5, 0, 2], [0, 1, 3, 0], [0, 0, 1, 7]],
    isRef: true,
    why: 'Valid. Leading 1s in columns 1, 2, 3 — each strictly to the right of the one above. No zero rows to worry about.',
  },
  {
    m: [[2, 4, 1], [0, 1, 3], [0, 0, 1]],
    isRef: false,
    why: 'Not valid in this course. The first leading entry is 2, not 1 (condition 2 fails). The staircase shape is fine, but we require leading 1s.',
  },
  {
    m: [[0, 1, 3, 0, 2], [0, 0, 0, 1, 4], [0, 0, 0, 0, 0]],
    isRef: true,
    why: 'Valid — and a good trap. Column 1 is all zeros, which is allowed. The leading 1s are in columns 2 and 4 (moving right), zero row at the bottom. ✓',
  },
];
 
function MatrixDisplay({ m, highlightPivots }) {
  // find first nonzero (leading) entry column per row, for optional highlight
  const pivotCol = m.map(row => {
    const idx = row.findIndex(v => v !== 0);
    return idx;
  });
  return (
    <div style={{ display: 'inline-flex', alignItems: 'stretch', gap: '6px', margin: '4px 0' }}>
      <div style={{ width: '3px', background: '#8a8ac0', borderRadius: '2px' }} />
      <table style={{ borderCollapse: 'collapse', fontFamily: 'monospace', fontSize: '1rem' }}>
        <tbody>
          {m.map((row, i) => (
            <tr key={i}>
              {row.map((v, j) => {
                const isPivot = highlightPivots && j === pivotCol[i] && v !== 0;
                return (
                  <td key={j} style={{
                    padding: '4px 11px', textAlign: 'center', color: isPivot ? '#1a1a2e' : '#e8e8f0',
                    background: isPivot ? '#e8a020' : 'transparent',
                    borderRadius: isPivot ? '5px' : 0, fontWeight: isPivot ? 700 : 400,
                  }}>{v}</td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ width: '3px', background: '#8a8ac0', borderRadius: '2px' }} />
    </div>
  );
}
 
function RefChecker() {
  const [idx, setIdx] = useState(0);
  const [answered, setAnswered] = useState(null); // user's choice: true/false
  const [score, setScore] = useState({ right: 0, done: 0 });
  const ex = REF_EXAMPLES[idx];
 
  function answer(choice) {
    if (answered !== null) return;
    const correct = choice === ex.isRef;
    setAnswered(choice);
    setScore(s => ({ right: s.right + (correct ? 1 : 0), done: s.done + 1 }));
  }
  function next() {
    setAnswered(null);
    setIdx(i => (i + 1) % REF_EXAMPLES.length);
  }
 
  const wasCorrect = answered !== null && answered === ex.isRef;
 
  return (
    <Widget title={`Interactive · Is this matrix in row-echelon form?  (${idx + 1} / ${REF_EXAMPLES.length})`}>
      <div style={{ display: 'flex', justifyContent: 'center', padding: '6px 0 16px' }}>
        <MatrixDisplay m={ex.m} highlightPivots={answered !== null} />
      </div>
 
      {answered === null ? (
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button onClick={() => answer(true)} style={btnYes}>Yes — it IS in REF</button>
          <button onClick={() => answer(false)} style={btnNo}>No — it is NOT</button>
        </div>
      ) : (
        <div>
          <div style={{
            padding: '12px 16px', borderRadius: '10px', marginBottom: '12px',
            background: wasCorrect ? 'rgba(56,201,176,.15)' : 'rgba(224,107,107,.15)',
            border: `1px solid ${wasCorrect ? '#38c9b0' : '#e06b6b'}`,
          }}>
            <div style={{ fontWeight: 700, color: wasCorrect ? '#38c9b0' : '#e06b6b', marginBottom: '6px' }}>
              {wasCorrect ? '✓ Correct!' : '✗ Not quite.'} The answer is {ex.isRef ? 'YES, it is in REF.' : 'NO, it is not in REF.'}
            </div>
            <div style={{ fontSize: '.88rem', color: '#d0d0e8', lineHeight: 1.55 }}>{ex.why}</div>
            {ex.isRef && <div style={{ fontSize: '.8rem', color: '#9b80e8', marginTop: '8px' }}>The highlighted gold entries are the <b>pivots</b> (leading 1s).</div>}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button onClick={next} style={btnNext}>Next matrix →</button>
          </div>
        </div>
      )}
 
      <div style={{ textAlign: 'center', marginTop: '14px', fontFamily: 'monospace', fontSize: '.78rem', color: '#8a8ac0' }}>
        Score: {score.right} / {score.done}
      </div>
    </Widget>
  );
}
 
const btnBase = { fontFamily: 'var(--fb, sans-serif)', fontSize: '.86rem', fontWeight: 600, padding: '10px 18px', borderRadius: '9px', cursor: 'pointer', border: '1px solid' };
const btnYes = { ...btnBase, color: '#38c9b0', background: 'rgba(56,201,176,.12)', borderColor: '#38c9b0' };
const btnNo = { ...btnBase, color: '#e06b6b', background: 'rgba(224,107,107,.12)', borderColor: '#e06b6b' };
const btnNext = { ...btnBase, color: '#e8a020', background: 'rgba(232,160,32,.12)', borderColor: '#e8a020' };

/* ════════════════════════════ PAGE ════════════════════════════ */
export default function Lec1() {
  // MathJax — config + typeset via useEffect (the pattern that avoids
  // the Next.js "beforeInteractive in component" error).
  useEffect(() => {
    window.MathJax = {
      tex: { inlineMath: [['$', '$'], ['\\(', '\\)']], displayMath: [['$$', '$$'], ['\\[', '\\]']] },
      options: { skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre'] },
    };
    const ti = setInterval(() => {
      if (window.MathJax?.typesetPromise) { window.MathJax.typesetPromise(); clearInterval(ti); }
    }, 100);
    return () => clearInterval(ti);
  }, []);

  return (
    <>
      <Script src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js" strategy="afterInteractive" />

      {/* scoped colour rules: dark ink on cream content, light on dark widgets */}
      <style>{`
        :root { --lec-paper:#fdf8f0; --lec-ink:#2d2417; --lec-ink2:#5a4d38; --lec-border:#e8ddc8; }
        .lec-content { color: var(--lec-ink); }
        .lec-content p { color: var(--lec-ink2); line-height: 1.8; margin: 12px 0; }
        .lec-content mjx-container { color: var(--lec-ink) !important; }
        .dark-widget, .dark-widget * { color: #e8e8f0; }
        .dark-widget mjx-container { color: #e8e8f0 !important; }
        .lec-content b, .lec-content strong { color: var(--lec-ink); }
      `}</style>

      <Navbar activePage="courses" />

      {/* BREADCRUMB */}
      <div style={{ position: 'sticky', top: 'calc(var(--nav-h) + 3px)', zIndex: 500, background: 'var(--bg2)', borderBottom: '1px solid var(--border)', padding: '8px 24px', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--fm)', fontSize: '.72rem', color: 'var(--text3)' }}>
        <Link href="/" style={{ color: 'var(--amber)' }}>Home</Link><span>›</span>
        <Link href="/courses" style={{ color: 'var(--amber)' }}>Courses</Link><span>›</span>
        <Link href="/courses/linalg" style={{ color: 'var(--amber)' }}>Linear Algebra</Link><span>›</span>
        <span style={{ color: 'var(--text2)' }}>Week 1 · Lecture 1</span>
      </div>

      <div style={{ display: 'flex', paddingTop: 'calc(var(--nav-h) + 3px)', minHeight: '100vh' }}>

        {/* SIDEBAR TOC */}
        <aside style={{ width: '256px', flexShrink: 0, position: 'sticky', top: 'calc(var(--nav-h) + 40px)', height: 'calc(100vh - var(--nav-h) - 40px)', overflowY: 'auto', background: 'var(--bg2)', borderRight: '1px solid var(--border)', padding: '20px 0' }}>
          <div style={{ padding: '0 18px 12px', borderBottom: '1px solid var(--border)', marginBottom: '8px' }}>
            <div style={{ fontFamily: 'var(--fm)', fontSize: '.6rem', letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--amber)' }}>On This Page</div>
          </div>
          {TOC.map(([id, label]) => (
            <a key={id} href={`#${id}`} style={{ display: 'block', padding: '7px 18px', fontFamily: 'var(--fm)', fontSize: '.72rem', color: 'var(--text2)', lineHeight: 1.4, textDecoration: 'none' }}>{label}</a>
          ))}
        </aside>

        {/* PAPER CONTENT */}
        <main style={{ flex: 1, minWidth: 0, background: 'var(--lec-paper)' }}>
          <div className="lec-content" style={{ maxWidth: '780px', margin: '0 auto', padding: '40px 40px 80px' }}>

            {/* HEADER with dateline */}
            <div style={{ borderBottom: '2px solid var(--lec-border)', paddingBottom: '20px', marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ fontFamily: 'var(--fm)', fontSize: '.74rem', letterSpacing: '.14em', textTransform: 'uppercase', color: '#c8860a' }}>{LEC.course} · {LEC.number}</span>
                <span style={{ fontFamily: 'var(--fm)', fontSize: '.74rem', color: 'var(--lec-ink2)' }}>{LEC.date}</span>
              </div>
              <h1 style={{ fontFamily: 'var(--fh)', fontSize: 'clamp(2rem,4vw,2.8rem)', color: 'var(--lec-ink)', margin: '10px 0 4px', lineHeight: 1.1 }}>{LEC.title}</h1>
              <p style={{ fontStyle: 'italic', color: 'var(--lec-ink2)' }}>{LEC.subtitle}</p>
            </div>

            <p>Welcome to the first lecture of Linear Algebra. Before we solve a single equation, we spend today building the <b>language</b> of the course — the objects we will speak in for the next seven weeks. That object is the <b>matrix</b>. But a matrix does not appear out of nowhere; it grows naturally out of something you already know well: a <b>sequence</b>.</p>

            {/* ── 1. SEQUENCES ── */}
            <Sec id="seq" n="1">Sequences &amp; the nth Term</Sec>
            <p>A <b>sequence</b> is simply an ordered list of numbers. Order matters — the list $2, 4, 6, 8, \dots$ is different from $8, 6, 4, 2, \dots$ even though the same numbers appear.</p>
            <p>Each number in the list is called a <b>term</b>. We label them by their position: the 1st term, the 2nd term, the 3rd term, and so on. The position number is called the <b>index</b>.</p>
            <Example n="1" title="A first sequence">
              <p>Consider the even numbers: $2, 4, 6, 8, 10, \dots$</p>
              <p>The 1st term is $2$, the 2nd term is $4$, the 5th term is $10$. If I ask for the 100th term, you don't want to write out 100 numbers — you want a <i>formula</i>. Notice each term is $2 \times \text{its position}$. So the term at position $n$ is $2n$. The 100th term is $2 \times 100 = 200$.</p>
            </Example>

            {/* ── 2. GENERAL TERM ── */}
            <Sec id="gen" n="2">The General Term $a_n$</Sec>
            <p>Writing "the term at position $n$" every time is clumsy. So we give the sequence a name — say $a$ — and write the term at position $n$ as $a_n$ (read "a-sub-n" or "a-n"). The little $n$ sitting below is the <b>index</b>.</p>
            <DefBox term="General term">
              <p style={{ margin: 0 }}>A sequence can be written compactly as $(a_n)$, where $a_n$ is a <b>rule</b> that tells you the term for each value of the index $n$. We usually state the condition on $n$, like $n \ge 1$, so we know where the sequence starts.</p>
            </DefBox>
            <Example n="2" title="Reading the general term">
              <p>(a) The even numbers: $a_n = 2n, \quad n \ge 1$. Then $a_1 = 2,\ a_2 = 4,\ a_7 = 14$.</p>
              <p>(b) The squares: $a_n = n^2,\quad n \ge 1$ gives $1, 4, 9, 16, \dots$</p>
              <p>(c) A sequence can start anywhere: $a_n = n - 3,\ n \ge 0$ gives $-3, -2, -1, 0, \dots$. The condition $n \ge 0$ matters — change it and you change the sequence.</p>
            </Example>
            <p>The key idea: <b>one index, one direction.</b> The index $n$ moves along a single line of positions — first, second, third. Now we ask the question that opens the whole course.</p>

            {/* ── 3. SECOND INDEX ── */}
            <Sec id="idx" n="3">What If We Add a Second Index?</Sec>
            <p>A single index $n$ locates a term in a <b>line</b> of numbers. But what if our data is naturally arranged in a <b>grid</b> — rows and columns — instead of a line? One index is not enough to say "which row <i>and</i> which column." We need <b>two</b>.</p>
            <p>So we write $a_{ij}$, with <i>two</i> indices: $i$ tells you the <b>row</b>, $j$ tells you the <b>column</b>. The full collection is written</p>
            <p style={{ textAlign: 'center' }}>$$\left(a_{ij}\right)_{\substack{1 \le i \le m \\ 1 \le j \le n}}$$</p>
            <p>This says: let $i$ run from $1$ to $m$ (so there are $m$ rows) and let $j$ run from $1$ to $n$ (so there are $n$ columns). Every pair $(i, j)$ picks out exactly one number $a_{ij}$ in the grid.</p>
            <Reveal label="Why two indices, intuitively">
              <p style={{ margin: 0 }}>Think of a seating chart in a classroom. To name a seat you need both the <i>row</i> and the <i>seat-in-that-row</i>. "Row 3, seat 5" is $a_{35}$. One number ("seat 5") is ambiguous — seat 5 in which row? Two indices remove the ambiguity. A matrix is just a fully labelled seating chart of numbers.</p>
            </Reveal>

            {/* ── 4. DEFINITION OF MATRIX ── */}
            <Sec id="mat" n="4">The Definition of a Matrix</Sec>
            <DefBox term="Matrix">
              <p style={{ margin: 0 }}>A <b>matrix</b> is a sequence with <b>two indices</b> — a rectangular array of numbers arranged in rows and columns. The collection $(a_{ij})$ with $1 \le i \le m$ and $1 \le j \le n$ written out in full is:</p>
            </DefBox>
            <p style={{ textAlign: 'center' }}>$$A = \begin{pmatrix} a_{11} &amp; a_{12} &amp; \cdots &amp; a_{1n} \\ a_{21} &amp; a_{22} &amp; \cdots &amp; a_{2n} \\ \vdots &amp; \vdots &amp; \ddots &amp; \vdots \\ a_{m1} &amp; a_{m2} &amp; \cdots &amp; a_{mn} \end{pmatrix}$$</p>
            <p>Read the subscripts carefully: $a_{ij}$ sits in <b>row $i$, column $j$</b> — row first, column second. So $a_{23}$ is the entry in the 2nd row, 3rd column. This row-then-column rule never changes; memorise it now and it will save you constantly.</p>

            {/* ── 5. ORDER ── */}
            <Sec id="ord" n="5">Order, Rows &amp; Columns</Sec>
            <p>A matrix with $m$ rows and $n$ columns is said to have <b>order</b> (or <b>size</b>) $m \times n$, read "$m$ by $n$". Again — <b>rows first, columns second.</b></p>
            <Example n="3" title="Reading the order">
              <p>$B = \begin{pmatrix} 1 &amp; 5 &amp; -2 \\ 0 &amp; 3 &amp; 7 \end{pmatrix}$ has $2$ rows and $3$ columns, so $B$ is a $2 \times 3$ matrix. It holds $2 \times 3 = 6$ entries in total.</p>
            </Example>

            {/* ── 6. TYPES ── */}
            <Sec id="types" n="6">Types of Matrices</Sec>
            <p>Some shapes come up so often they get their own names:</p>
            <Example n="4" title="A field guide">
              <p><b>Row matrix</b> — a single row, order $1 \times n$: $\quad \begin{pmatrix} 4 &amp; 1 &amp; 9 \end{pmatrix}$.</p>
              <p><b>Column matrix</b> — a single column, order $m \times 1$: $\quad \begin{pmatrix} 4 \\ 1 \\ 9 \end{pmatrix}$.</p>
              <p><b>Square matrix</b> — equal rows and columns, order $n \times n$: $\quad \begin{pmatrix} 2 &amp; 1 \\ 0 &amp; 5 \end{pmatrix}$ is $2\times 2$. Square matrices are special — most of this course lives among them.</p>
              <p><b>Zero matrix</b> — every entry is $0$, written $O$.</p>
              <p><b>Diagonal matrix</b> — square, with zeros everywhere off the main diagonal: $\quad \begin{pmatrix} 3 &amp; 0 \\ 0 &amp; 7 \end{pmatrix}$.</p>
              <p><b>Identity matrix</b> $I$ — a diagonal matrix with $1$s on the diagonal: $\quad I_2 = \begin{pmatrix} 1 &amp; 0 \\ 0 &amp; 1 \end{pmatrix}$. It plays the role of the number $1$ for matrices.</p>
            </Example>

            {/* ── 7. NOTATION ── */}
            <Sec id="notation" n="7">Notation &amp; Picking Out Entries</Sec>
            <p>We name matrices with <b>capital letters</b> and their entries with the matching small letter carrying two indices: $A = (a_{ij})$. To find a specific entry, read row then column.</p>
            <Example n="5" title="Find $a_{23}$">
              <p>Let $A = \begin{pmatrix} 2 &amp; 9 &amp; 1 \\ 4 &amp; 0 &amp; 6 \\ 7 &amp; 3 &amp; 8 \end{pmatrix}$.</p>
              <p>$a_{23}$ means row $2$, column $3$. Go to the 2nd row $(4, 0, 6)$, then the 3rd entry: $a_{23} = 6$.</p>
              <p>Check yourself: $a_{31} = 7$ (row 3, column 1), and $a_{12} = 9$ (row 1, column 2). Notice $a_{12}$ and $a_{21} = 4$ are different entries — order of the indices matters.</p>
            </Example>

            {/* ── 8. DIAGONALS ── */}
            <Sec id="diag" n="8">Diagonals</Sec>
            <DefBox term="Main diagonal">
              <p style={{ margin: 0 }}>In a matrix $A = (a_{ij})$, the entries where the row index equals the column index — that is $a_{11}, a_{22}, a_{33}, \dots$ — form the <b>main diagonal</b> (also called the <b>diagonal entries</b>). They run from the top-left corner downward to the right.</p>
            </DefBox>
            <Example n="6" title="Spotting the diagonals">
              <p>In $A = \begin{pmatrix} \mathbf{2} &amp; 9 &amp; 1 \\ 4 &amp; \mathbf{0} &amp; 6 \\ 7 &amp; 3 &amp; \mathbf{8} \end{pmatrix}$ the <b>main diagonal</b> is $2, 0, 8$ (the bold entries: $a_{11}, a_{22}, a_{33}$).</p>
              <p>The <b>secondary diagonal</b> runs the other way, top-right to bottom-left: $1, 0, 7$. In this course we will care far more about the main diagonal than the secondary one — it controls things like the identity matrix, traces, and (later) eigenvalues.</p>
            </Example>

            {/* ── 9. HISTORY ── */}
            <Sec id="history" n="9">A Short History</Sec>
            <p>The grid of numbers is ancient — Chinese mathematicians solved systems with array methods two thousand years ago in the <i>Nine Chapters on the Mathematical Art</i>. But the <b>word</b> and the <b>theory</b> are surprisingly recent.</p>
            <p>The term <b>"matrix"</b> was coined in 1850 by <b>James Joseph Sylvester</b>, an English mathematician. He used the Latin word for "womb" — the idea being that a matrix is the array <i>from which</i> smaller determinants are born. Sylvester led a colourful life: he was barred from degrees in England for being Jewish, taught in the United States, and was a passionate amateur poet who once wrote a 400-line poem in which every line rhymed with "Rosalind."</p>
            <p>His close friend <b>Arthur Cayley</b> took the next step. In his 1858 <i>Memoir on the Theory of Matrices</i>, Cayley treated matrices as objects you can <b>add and multiply in their own right</b> — not just as shorthand for systems of equations. This is the leap that turned a bookkeeping device into a branch of algebra. Strikingly, Cayley was a working lawyer for fourteen years and did much of his mathematics in the evenings.</p>
            <p>And looming over all of it is <b>Carl Friedrich Gauss</b>, whose systematic elimination method for solving linear systems — which we meet next — is so fundamental it still carries his name: <b>Gaussian elimination</b>. Gauss developed it to compute the orbit of the dwarf planet Ceres from a handful of telescope observations, and his prediction let astronomers find Ceres again after it had been lost behind the sun.</p>
            <p style={{ fontStyle: 'italic', color: 'var(--lec-ink2)' }}>The lesson worth carrying: matrices were not invented for their own sake. They were forged to <b>solve real problems</b> — orbits, networks, systems of equations. That is exactly where we now turn.</p>

            {/* ── 10. LINEAR EQUATIONS ── */}
            <Sec id="sys" n="10">Solving Linear Equations</Sec>
            <p>Here begins the first main theme of the course. We start with the simplest building block.</p>
            <DefBox term="Linear equation">
              <p style={{ margin: 0 }}>A <b>linear equation</b> in the variables $x$ and $y$ is one of the form $ax + by = c$, where $a, b, c$ are constants. "Linear" means each variable appears only to the first power — no $x^2$, no $xy$, no $\sqrt{x}$.</p>
            </DefBox>
            <p><b>Graphical meaning.</b> In the plane, the set of all points $(x, y)$ satisfying $ax + by = c$ is a <b>straight line</b> — that is why the equation is called linear. For example $x + y = 3$ is the line passing through $(3, 0)$ and $(0, 3)$.</p>
            <p>Now suppose we have <b>two</b> linear equations at once — a <b>system</b>:</p>
            <p style={{ textAlign: 'center' }}>$$\begin{cases} x + y = 3 \\ x - y = 1 \end{cases}$$</p>
            <p>To <b>solve</b> the system is to find the pair $(x, y)$ that satisfies <i>both</i> equations — geometrically, the point where the two lines <b>cross</b>.</p>
            <Example n="7" title="Solving by elimination">
              <p>Take the system above. <b>Elimination</b> means combining the equations to cancel a variable.</p>
              <p>Add the two equations: $(x + y) + (x - y) = 3 + 1$, which gives $2x = 4$, so $x = 2$.</p>
              <p>Substitute $x = 2$ into the first equation: $2 + y = 3$, so $y = 1$.</p>
              <p>The solution is $(x, y) = (2, 1)$ — the single point where the lines meet. You can check: $2 + 1 = 3$ ✓ and $2 - 1 = 1$ ✓.</p>
            </Example>

            {/* ── 11. TYPES OF SOLUTIONS ── */}
            <Sec id="solutions" n="11">Three Things That Can Happen</Sec>
            <p>Two lines in a plane can meet in exactly three ways — and this gives the three possible outcomes for a linear system.</p>
            <Example n="8" title="(a) Exactly one solution">
              <p>$\begin{cases} x + y = 3 \\ x - y = 1 \end{cases}$ — the lines cross at one point $(2,1)$. The system has <b>a unique solution</b>. This is the case we just solved.</p>
            </Example>
            <Example n="9" title="(b) No solution">
              <p>$\begin{cases} x + y = 3 \\ x + y = 5 \end{cases}$ — these are <b>parallel</b> lines (same slope, different intercept). They never meet, so there is <b>no solution</b>. Algebraically, subtracting gives $0 = 2$, which is impossible — a signal that the system is inconsistent.</p>
            </Example>
            <Example n="10" title="(c) Infinitely many solutions">
              <p>$\begin{cases} x + y = 3 \\ 2x + 2y = 6 \end{cases}$ — the second equation is just the first one doubled. Both describe the <b>same line</b>, so every point on that line is a solution. There are <b>infinitely many</b> solutions.</p>
            </Example>
            <p>So a linear system has either <b>one</b>, <b>none</b>, or <b>infinitely many</b> solutions — never, say, exactly two. Keep this trichotomy in mind; it will return in a more powerful form once we have matrices doing the work.</p>

            {/* ── 12. INTO 3D ── */}
            <Sec id="r3" n="12">From 2D to 3D</Sec>
            <p>So far our equations lived in the plane, $\mathbb{R}^2$, with two variables $x$ and $y$. What happens when we add a third variable $z$ and move into space, $\mathbb{R}^3$?</p>
            <p>Here is a subtle and important question. In the plane, $2x + 3y = 4$ is a <b>line</b>. But what does the <i>same</i> equation $2x + 3y = 4$ describe in $\mathbb{R}^3$ — still a line, or something else?</p>
            <p>The answer: in $\mathbb{R}^3$ it is a <b>plane</b>, not a line. Here is why. The equation places <i>no condition at all</i> on $z$. So if $(x, y)$ satisfies $2x + 3y = 4$, then the point $(x, y, z)$ lies on the graph <b>for every value of $z$</b>. The solution line in the floor (the $xy$-plane) gets "swept" straight up and down through all heights $z$ — and a swept line is a plane.</p>
            <DefBox term="The role of a missing variable">
              <p style={{ margin: 0 }}>When a variable is absent from an equation in $\mathbb{R}^3$, that variable is <b>free</b> — it can take any value. Geometrically, the graph extends without restriction in that variable's direction. A missing $z$ means the figure is a vertical sweep: a line becomes a plane.</p>
            </DefBox>
            <p>Use the widget below to see it. Start with the general plane $ax + by + cz = d$, then press <b>“Set $c = 0$”</b> to remove $z$ from the equation. Watch the figure become a vertical plane — the swept-up line. Drag to rotate and convince yourself.</p>

            <PlaneWidget />

            <p>This idea — that the <b>number of variables</b> sets the <b>dimension of the space</b>, and that a single linear equation carves out a "flat" object one dimension lower (a line in 2D, a plane in 3D) — is the geometric heart of everything ahead. A system of equations in 3D becomes a question about how several planes intersect.</p>

            {/* ════════════════════════════════════════════════════
                ◀◀  SECOND HALF SLOTS IN HERE  ▶▶
                Append new <Sec>, <Example>, <DefBox>, <Widget>,
                <Reveal> blocks below this line. Also add their ids
                to the TOC array at the top. Nothing above moves.
               ════════════════════════════════════════════════════ */}

                        {/* ── 13. PLANES GRAPHICALLY ── */}
            <Sec id="planes" n="13">Picturing Planes in Space</Sec>
            <p>We just saw that one linear equation in three variables is a <b>plane</b>. A system of three such equations is therefore three planes hanging in space, and solving the system asks: <b>where do all three planes meet at once?</b></p>
            <p>Just as two lines in the plane had three possible outcomes, three planes in space have their own gallery of possibilities — they might meet at a single point, along a whole line, or not all together at all. Rotate the widget from the previous section and imagine a second and third plane sliding through it; the common intersection is the solution set.</p>
            <DefBox term="Geometry of a 3-variable system">
              <p style={{ margin: 0 }}>A system of three equations in $x, y, z$ is three planes. The solution is their <b>common intersection</b>: a single point (unique solution), a line or plane (infinitely many solutions), or empty (no solution). The same trichotomy as before — one, infinitely many, or none — survives into higher dimensions.</p>
            </DefBox>
 
            {/* ── 14. ELIMINATION IN 3 VARIABLES ── */}
            <Sec id="elim3" n="14">Elimination With Three Variables</Sec>
            <p>The method does not change — we still eliminate variables by combining equations. What changes is the <b>length</b>. Watch how much more work a single extra variable demands.</p>
            <Example n="11" title="Solving a 3×3 system by elimination">
              <p>$$\begin{cases} x + y + z = 6 \\ 2x - y + z = 3 \\ x + 2y - z = 3 \end{cases}$$</p>
              <p><b>Step 1 — eliminate $x$ from the 2nd and 3rd equations.</b></p>
              <p>Equation 2 minus $2\times$Equation 1: $(2x - y + z) - 2(x + y + z) = 3 - 12$, giving $-3y - z = -9$.</p>
              <p>Equation 3 minus Equation 1: $(x + 2y - z) - (x + y + z) = 3 - 6$, giving $y - 2z = -3$.</p>
              <p><b>Step 2 — now a 2-variable system in $y, z$:</b> $\;-3y - z = -9\;$ and $\;y - 2z = -3$.</p>
              <p>From the second, $y = 2z - 3$. Substitute: $-3(2z - 3) - z = -9 \Rightarrow -7z + 9 = -9 \Rightarrow z = \tfrac{18}{7}$… </p>
              <p><b>Step 3 — back-substitute</b> to get $y$, then $x$. Even with friendly-looking numbers, we needed three coordinated stages and careful bookkeeping.</p>
            </Example>
            <p>Notice the pattern: with <b>two</b> variables, one elimination step finished the job. With <b>three</b>, we needed to eliminate one variable to drop to a 2-variable system, then solve that, then climb back up. The work roughly <i>compounds</i> with each new variable.</p>
 
            {/* ── 15. DIRECTION RATIOS ── */}
            <Sec id="dir" n="15">Slope, and Its Generalisation</Sec>
            <p>In two variables, a line $ax + by = c$ has a <b>slope</b> — a single number describing its direction. We can repackage that direction as a pair of numbers called <b>direction ratios</b>: the line's direction is captured by how much $x$ and $y$ change together.</p>
            <p>In three variables this idea must grow. A direction in space cannot be pinned down by one number — you need <b>three</b> direction ratios, describing change in $x$, $y$ and $z$ together. The single "slope" of school algebra is really the 2D shadow of a richer object. As dimensions rise, direction needs more and more numbers to describe — another hint that we need a better bookkeeping tool than scribbling equations one symbol at a time.</p>
 
            {/* ── 16. THE SCALING PROBLEM ── */}
            <Sec id="scale" n="16">What Happens at 4, 5, 6 Variables?</Sec>
            <p>Suppose we push on. A system in <b>four</b> variables: elimination still works in principle, but each stage now juggles four coefficients per equation, and we need more stages to peel the variables off one by one. The number of arithmetic steps grows fast, and — more dangerously — <b>so does the chance of a small slip</b>. One dropped minus sign early on poisons everything downstream.</p>
            <p>At <b>five</b> or <b>six</b> variables, hand elimination on the raw equations becomes genuinely impractical: pages of rewriting the same symbols $x, y, z, w, \dots$ over and over, each line a fresh opportunity for error.</p>
            <p style={{ fontStyle: 'italic', color: 'var(--lec-ink2)' }}>The symbols $x, y, z$ are <b>carried along uselessly</b> through every step — they never change, only their coefficients do. So why keep writing them? This is the insight that gives birth to the matrix method: <b>strip away the variables, keep only the numbers, and operate on the numbers directly.</b></p>
 
            {/* ── 17. MATRIX FORM ── */}
            <Sec id="matform" n="17">Converting a System to Matrix Form</Sec>
            <p>Take any linear system. Collect the <b>coefficients</b> into one array, the <b>unknowns</b> into a column, and the <b>constants</b> into another column. The whole system then becomes a single equation between arrays:</p>
            <div style={{ textAlign: 'center', margin: '24px 0' }}>
              <p style={{ margin: 0 }}>$$\underbrace{\begin{pmatrix} a_{11} & a_{12} & \cdots & a_{1n} \\ a_{21} & a_{22} & \cdots & a_{2n} \\ \vdots & \vdots & \ddots & \vdots \\ a_{m1} & a_{m2} & \cdots & a_{mn} \end{pmatrix}}_{\textstyle A\ \text{(coefficient matrix)}} \underbrace{\begin{pmatrix} x_1 \\ x_2 \\ \vdots \\ x_n \end{pmatrix}}_{\textstyle X\ \text{(unknowns)}} = \underbrace{\begin{pmatrix} b_1 \\ b_2 \\ \vdots \\ b_m \end{pmatrix}}_{\textstyle b\ \text{(constants)}}$$</p>
              <p style={{ fontFamily: 'var(--fm)', fontSize: '1.3rem', color: 'var(--lec-ink)', marginTop: '16px' }}>$$A\,X = b$$</p>
            </div>
            <p>This compact statement $AX = b$ <i>is</i> the system — every equation packed into one. The matrix $A$ holds the coefficients, the column $X$ holds the unknowns we are solving for, and the column $b$ holds the right-hand constants.</p>
            <DefBox term="Sort before you convert">
              <p style={{ margin: 0 }}>Before building $A$, <b>line up the variables in the same order in every equation</b>, with each variable in its own column and constants on the right. A coefficient of a missing variable is $0$ — write the $0$. If the equations are not sorted, the matrix scrambles which number means what. Sorting is not optional housekeeping; it is what makes the matrix mean anything.</p>
            </DefBox>
 
            {/* ── 18. AUGMENTED MATRIX ── */}
            <Sec id="aug" n="18">The Augmented Matrix $(A \mid b)$</Sec>
            <p>For solving, it is handier to glue the constants onto the coefficient matrix as one extra column, separated by a bar. This is the <b>augmented matrix</b>, written $(A \mid b)$:</p>
            <p style={{ textAlign: 'center' }}>$$(A \mid b) = \left(\begin{array}{cccc|c} a_{11} & a_{12} & \cdots & a_{1n} & b_1 \\ a_{21} & a_{22} & \cdots & a_{2n} & b_2 \\ \vdots & \vdots & \ddots & \vdots & \vdots \\ a_{m1} & a_{m2} & \cdots & a_{mn} & b_m \end{array}\right)$$</p>
            <p>The bar is just a reminder of where the equals sign was. Everything left of it is a coefficient; the single column on the right holds the constants.</p>
 
            <Example n="12" title="Both notations, side by side">
              <p>System: $\;\begin{cases} 2x + 3y = 8 \\ x - y = -1 \end{cases}$</p>
              <p><b>As $AX = b$:</b> $\quad \begin{pmatrix} 2 & 3 \\ 1 & -1 \end{pmatrix}\begin{pmatrix} x \\ y \end{pmatrix} = \begin{pmatrix} 8 \\ -1 \end{pmatrix}$</p>
              <p><b>As an augmented matrix:</b> $\quad \left(\begin{array}{cc|c} 2 & 3 & 8 \\ 1 & -1 & -1 \end{array}\right)$</p>
            </Example>
            <Example n="13" title="With a three-variable system">
              <p>System: $\;\begin{cases} x + y + z = 6 \\ 2x - y + z = 3 \\ x + 2y - z = 3 \end{cases}$</p>
              <p><b>$AX = b$:</b> $\quad \begin{pmatrix} 1 & 1 & 1 \\ 2 & -1 & 1 \\ 1 & 2 & -1 \end{pmatrix}\begin{pmatrix} x \\ y \\ z \end{pmatrix} = \begin{pmatrix} 6 \\ 3 \\ 3 \end{pmatrix}$</p>
              <p><b>$(A \mid b)$:</b> $\quad \left(\begin{array}{ccc|c} 1 & 1 & 1 & 6 \\ 2 & -1 & 1 & 3 \\ 1 & 2 & -1 & 3 \end{array}\right)$</p>
            </Example>
            <Example n="14" title="Watch the missing variables">
              <p>System: $\;\begin{cases} 2x - y = 4 \\ z = 3 \end{cases}$</p>
              <p>Sort carefully. The first equation has no $z$; the second has no $x$ or $y$. Fill the gaps with $0$:</p>
              <p>$$\left(\begin{array}{ccc|c} 2 & -1 & 0 & 4 \\ 0 & 0 & 1 & 3 \end{array}\right)$$</p>
              <p>Now a tempting mistake: should we pad it to a square $3\times 3$ system by adding a third row of zeros?</p>
              <p>$$\left(\begin{array}{ccc|c} 2 & -1 & 0 & 4 \\ 0 & 0 & 1 & 3 \\ 0 & 0 & 0 & 0 \end{array}\right)$$</p>
              <p>That bottom row reads $0x + 0y + 0z = 0$, i.e. $0 = 0$ — true for <i>every</i> choice of $x, y, z$. It is a <b>redundant (trivial) row</b>: it adds no information at all. You could append a thousand such rows and the system would be unchanged. So while it is not <i>wrong</i>, it is clutter — <b>leave it out.</b> Write only the rows that say something.</p>
            </Example>
 
            {/* ── 19. WHY THIS SHAPE HELPS ── */}
            <Sec id="why" n="19">Why Bother? A Matrix That Solves Itself</Sec>
            <p>Here is the pay-off. Suppose, after some tidying, a system's augmented matrix looked like this:</p>
            <p style={{ textAlign: 'center' }}>$$\left(\begin{array}{ccc|c} 1 & 2 & -1 & 3 \\ 0 & 1 & 4 & 5 \\ 0 & 0 & 1 & 2 \end{array}\right)$$</p>
            <p>Translate the bottom row back into an equation: it says $z = 2$ — solved already, for free. The middle row says $y + 4z = 5$; since $z = 2$, we get $y = 5 - 8 = -3$. The top row says $x + 2y - z = 3$; plugging in, $x = 3 - 2(-3) + 2 = 11$.</p>
            <p>No elimination loops, no juggling — just read the bottom equation, then climb upward substituting as you go. This is <b>back-substitution</b>, and it is almost effortless. The whole game of solving systems becomes: <b>use row operations to massage the augmented matrix into this lovely staircase shape</b>, then back-substitute. That staircase shape has a name.</p>
 
            {/* ── 20. ROW-ECHELON FORM ── */}
            <Sec id="ref" n="20">Row-Echelon Form</Sec>
            <p>Look again at what made that matrix so easy. Three features stand out:</p>
            <p>(1) the <b>first nonzero entry of each row is a 1</b> (we will call it the <b>leading 1</b>); (2) <b>below each leading 1, the column is all zeros</b>; and (3) each leading 1 sits <b>further right</b> than the one above it, so the count of leading zeros grows as you go down — the staircase.</p>
            <DefBox term="Row-echelon form (this course)">
              <p style={{ margin: '0 0 8px' }}>A matrix is in <b>row-echelon form (REF)</b> when:</p>
              <p style={{ margin: '0 0 4px' }}>1. All zero rows (if any) sit at the bottom.</p>
              <p style={{ margin: '0 0 4px' }}>2. The first nonzero entry in each nonzero row is a $1$ — the <b>leading 1</b>.</p>
              <p style={{ margin: 0 }}>3. Each leading 1 is to the right of every leading 1 in the rows above it.</p>
            </DefBox>
            <Reveal label="A note on the general definition">
              <p style={{ margin: 0 }}>Be aware that textbooks differ. In the most general definition, the leading entry of a row — called the <b>pivot</b> — only needs to be <b>nonzero</b>, not necessarily $1$. Books like Lay and Strang use that looser version. The book we follow in this course (Nicholson) <i>requires</i> the leading entries to be $1$, so that is the rule we will use throughout: <b>pivots are leading 1s</b>. Just know that if you open a different book and see pivots that aren't $1$, it isn't a contradiction — only a different convention.</p>
            </Reveal>
            <DefBox term="Reduced row-echelon form (RREF)">
              <p style={{ margin: 0 }}>If a row-echelon matrix <i>also</i> has <b>each leading 1 as the only nonzero entry in its whole column</b> (zeros above it as well as below), it is in <b>reduced row-echelon form</b>. RREF is the tidiest possible shape — it hands you the solution with no back-substitution at all.</p>
            </DefBox>
            <p>The leading 1s have a special name: they are the <b>pivots</b> of the matrix. The pivots are the load-bearing entries — they mark where each variable gets "solved," and we will keep meeting them all term.</p>
            <Example n="15" title="Spotting the pivots">
              <p>In $\left(\begin{array}{cccc} 1 & 2 & 3 & 4 \\ 0 & 1 & 5 & 6 \\ 0 & 0 & 1 & 7 \end{array}\right)$ the pivots are the three leading 1s, sitting in columns 1, 2 and 3 — stepping down and to the right. This matrix is in REF.</p>
            </Example>
 
            {/* ── 21. REF APPLET ── */}
            <Sec id="check" n="21">Your Turn: Is It in REF?</Sec>
            <p>Time to test yourself. For each matrix below, decide whether it is in <b>row-echelon form</b> using our three conditions (remember: leading 1s, staircase to the right, zero rows at the bottom). Click your answer for instant feedback — the pivots light up in gold when you're right or wrong.</p>
 
            <RefChecker />
 
            <p>If you can reliably tell REF from not-REF, you are ready for next lecture, where we learn the <b>row operations</b> that actually transform any matrix into this form — the engine behind Gaussian elimination.</p>
 
    <<< end JSX to paste >>>  */</end>   

            {/* END OF FIRST HALF */}
            <div style={{ marginTop: '60px', paddingTop: '24px', borderTop: '2px solid var(--lec-border)', textAlign: 'center', fontFamily: 'var(--fm)', fontSize: '.8rem', color: 'var(--lec-ink2)', fontStyle: 'italic' }}>
              — to be continued —
            </div>

          </div>

          {/* FOOTER NAV */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 40px', borderTop: '1px solid var(--lec-border)', background: 'var(--lec-paper)', flexWrap: 'wrap', gap: '12px' }}>
            <Link href="/courses/linalg" style={{ fontFamily: 'var(--fm)', fontSize: '.74rem', letterSpacing: '.08em', textTransform: 'uppercase', color: '#c8860a', textDecoration: 'none' }}>← Course Home</Link>
            <span style={{ fontFamily: 'var(--fm)', fontSize: '.74rem', color: 'var(--lec-ink2)' }}>Lecture 2 · coming soon</span>
          </div>
        </main>
      </div>

      <Footer />
    </>
  );
}