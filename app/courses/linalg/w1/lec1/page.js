'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import Navbar from '../../../../components/Navbar';
import Footer from '../../../../components/Footer';

/* ════════════════════════════════════════════════════════════════
   MATH-120 · LECTURE 1 — COMPLETE
   Route: /courses/linalg/w1/lec1
   All math is wrapped as {String.raw`...`} so JSX never parses the
   { } & < > inside LaTeX. Follow the same pattern for new math.
   ════════════════════════════════════════════════════════════════ */

const LEC = {
  course: 'MATH-120 · Linear Algebra',
  number: 'Lecture 1',
  title: 'The Language of Matrices',
  subtitle: 'From sequences to systems of linear equations',
  date: '9 June 2026',
};

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
  ['planes', '13 · Picturing Planes'],
  ['elim3', '14 · Elimination in 3 Variables'],
  ['dir', '15 · Slope & Direction Ratios'],
  ['scale', '16 · Scaling to 4, 5, 6 Variables'],
  ['matform', '17 · Matrix Form Ax = b'],
  ['aug', '18 · Augmented Matrix (A | b)'],
  ['why', '19 · A Matrix That Solves Itself'],
  ['ref', '20 · Row-Echelon Form'],
  ['check', '21 · Your Turn: Is It in REF?'],
];

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

function DefBox({ term, children }) {
  return (
    <div style={{ background: 'rgba(56,201,176,.08)', borderLeft: '4px solid #2a9d8f', borderRadius: '0 10px 10px 0', padding: '16px 20px', margin: '20px 0' }}>
      {term && <div style={{ fontFamily: 'var(--fm)', fontSize: '.7rem', letterSpacing: '.14em', textTransform: 'uppercase', color: '#2a9d8f', marginBottom: '6px' }}>Definition · {term}</div>}
      <div>{children}</div>
    </div>
  );
}

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

function Sec({ id, n, children }) {
  return (
    <h2 id={id} style={{ scrollMarginTop: 'calc(var(--nav-h) + 30px)', fontFamily: 'var(--fh)', fontSize: '1.7rem', color: 'var(--lec-ink)', margin: '48px 0 16px', display: 'flex', alignItems: 'baseline', gap: '12px' }}>
      <span style={{ fontFamily: 'var(--fm)', fontSize: '.9rem', color: '#c8860a' }}>{n}</span>
      {children}
    </h2>
  );
}

function Widget({ title, children }) {
  return (
    <div className="dark-widget" style={{ background: '#1a1a2e', borderRadius: '14px', padding: '20px', margin: '22px 0', color: '#e8e8f0' }}>
      {title && <div style={{ fontFamily: 'var(--fm)', fontSize: '.72rem', letterSpacing: '.12em', textTransform: 'uppercase', color: '#8a8ac0', marginBottom: '14px' }}>{title}</div>}
      {children}
    </div>
  );
}

function PlaneWidget() {
  const canvasRef = useRef(null);
  const [a, setA] = useState(2);
  const [b, setB] = useState(3);
  const [c, setC] = useState(0);
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

    const tris = [];
    const span = 4, step = 0.5;
    function zOf(x, y) {
      if (Math.abs(c) > 1e-6) return (d - a * x - b * y) / c;
      return null;
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

const REF_EXAMPLES = [
  { m: [[1, 2, 3, 4], [0, 0, 1, 5], [0, 0, 0, 0]], isRef: true,
    why: 'Valid. Leading 1s in column 1 then column 3 (staircase moves right), the zero row is at the bottom.' },
  { m: [[1, 0, 0], [0, 1, 0], [0, 0, 1]], isRef: true,
    why: 'Valid — this is the identity matrix. Leading 1s march down the diagonal; it is even in reduced form.' },
  { m: [[1, 2, 3, 4, 5], [0, 0, 0, 0, 0], [0, 1, 2, 4, 5], [0, 0, 0, 0, 0]], isRef: false,
    why: 'Not valid. A zero row (row 2) sits ABOVE a nonzero row (row 3). All zero rows must be at the bottom.' },
  { m: [[1, 2, 1, 3, 4], [0, 0, 0, 1, 2], [0, 0, 0, -1, 2]], isRef: false,
    why: 'Not valid, for two reasons: the leading entry of row 3 is −1, not 1; and rows 2 and 3 have their leading entries in the SAME column (4), so the staircase does not move right.' },
  { m: [[1, 5, 0, 2], [0, 1, 3, 0], [0, 0, 1, 7]], isRef: true,
    why: 'Valid. Leading 1s in columns 1, 2, 3 — each strictly to the right of the one above. No zero rows to worry about.' },
  { m: [[2, 4, 1], [0, 1, 3], [0, 0, 1]], isRef: false,
    why: 'Not valid in this course. The first leading entry is 2, not 1 (condition 2 fails). The staircase shape is fine, but we require leading 1s.' },
  { m: [[0, 1, 3, 0, 2], [0, 0, 0, 1, 4], [0, 0, 0, 0, 0]], isRef: true,
    why: 'Valid — and a good trap. Column 1 is all zeros, which is allowed. The leading 1s are in columns 2 and 4 (moving right), zero row at the bottom.' },
];

function MatrixDisplay({ m, highlightPivots }) {
  const pivotCol = m.map(row => row.findIndex(v => v !== 0));
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
  const [answered, setAnswered] = useState(null);
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

export default function Lec1() {
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

      <div style={{ position: 'sticky', top: 'calc(var(--nav-h) + 3px)', zIndex: 500, background: 'var(--bg2)', borderBottom: '1px solid var(--border)', padding: '8px 24px', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--fm)', fontSize: '.72rem', color: 'var(--text3)' }}>
        <Link href="/" style={{ color: 'var(--amber)' }}>Home</Link><span>›</span>
        <Link href="/courses" style={{ color: 'var(--amber)' }}>Courses</Link><span>›</span>
        <Link href="/courses/linalg" style={{ color: 'var(--amber)' }}>Linear Algebra</Link><span>›</span>
        <span style={{ color: 'var(--text2)' }}>Week 1 · Lecture 1</span>
      </div>

      <div style={{ display: 'flex', paddingTop: 'calc(var(--nav-h) + 3px)', minHeight: '100vh' }}>

        <aside style={{ width: '256px', flexShrink: 0, position: 'sticky', top: 'calc(var(--nav-h) + 40px)', height: 'calc(100vh - var(--nav-h) - 40px)', overflowY: 'auto', background: 'var(--bg2)', borderRight: '1px solid var(--border)', padding: '20px 0' }}>
          <div style={{ padding: '0 18px 12px', borderBottom: '1px solid var(--border)', marginBottom: '8px' }}>
            <div style={{ fontFamily: 'var(--fm)', fontSize: '.6rem', letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--amber)' }}>On This Page</div>
          </div>
          {TOC.map(([id, label]) => (
            <a key={id} href={`#${id}`} style={{ display: 'block', padding: '7px 18px', fontFamily: 'var(--fm)', fontSize: '.72rem', color: 'var(--text2)', lineHeight: 1.4, textDecoration: 'none' }}>{label}</a>
          ))}
        </aside>

        <main style={{ flex: 1, minWidth: 0, background: 'var(--lec-paper)' }}>
          <div className="lec-content" style={{ maxWidth: '780px', margin: '0 auto', padding: '40px 40px 80px' }}>

            <div style={{ borderBottom: '2px solid var(--lec-border)', paddingBottom: '20px', marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ fontFamily: 'var(--fm)', fontSize: '.74rem', letterSpacing: '.14em', textTransform: 'uppercase', color: '#c8860a' }}>{LEC.course} · {LEC.number}</span>
                <span style={{ fontFamily: 'var(--fm)', fontSize: '.74rem', color: 'var(--lec-ink2)' }}>{LEC.date}</span>
              </div>
              <h1 style={{ fontFamily: 'var(--fh)', fontSize: 'clamp(2rem,4vw,2.8rem)', color: 'var(--lec-ink)', margin: '10px 0 4px', lineHeight: 1.1 }}>{LEC.title}</h1>
              <p style={{ fontStyle: 'italic', color: 'var(--lec-ink2)' }}>{LEC.subtitle}</p>
            </div>

            <p>Welcome to the first lecture of Linear Algebra. Before we solve a single equation, we spend today building the <b>language</b> of the course — the objects we will speak in for the next seven weeks. That object is the <b>matrix</b>. But a matrix does not appear out of nowhere; it grows naturally out of something you already know well: a <b>sequence</b>.</p>

            <Sec id="seq" n="1">Sequences &amp; the nth Term</Sec>
            <p>{String.raw`A `}<b>sequence</b>{String.raw` is simply an ordered list of numbers. Order matters — the list $2, 4, 6, 8, \dots$ is different from $8, 6, 4, 2, \dots$ even though the same numbers appear.`}</p>
            <p>Each number in the list is called a <b>term</b>. We label them by their position: the 1st term, the 2nd term, the 3rd term, and so on. The position number is called the <b>index</b>.</p>
            <Example n="1" title="A first sequence">
              <p>{String.raw`Consider the even numbers: $2, 4, 6, 8, 10, \dots$`}</p>
              <p>{String.raw`The 1st term is $2$, the 2nd is $4$, the 5th is $10$. If I ask for the 100th term, you don't want to write out 100 numbers — you want a `}<i>formula</i>{String.raw`. Each term is $2 \times \text{its position}$, so the term at position $n$ is $2n$. The 100th term is $2 \times 100 = 200$.`}</p>
            </Example>

            <Sec id="gen" n="2">{String.raw`The General Term $a_n$`}</Sec>
            <p>{String.raw`Writing "the term at position $n$" every time is clumsy. So we give the sequence a name — say $a$ — and write the term at position $n$ as $a_n$ (read "a-sub-n"). The little $n$ below is the `}<b>index</b>.</p>
            <DefBox term="General term">
              <p style={{ margin: 0 }}>{String.raw`A sequence can be written compactly as $(a_n)$, where $a_n$ is a `}<b>rule</b>{String.raw` giving the term for each value of the index $n$. We usually state the condition on $n$, like $n \ge 1$, so we know where the sequence starts.`}</p>
            </DefBox>
            <Example n="2" title="Reading the general term">
              <p>{String.raw`(a) Even numbers: $a_n = 2n,\ n \ge 1$. Then $a_1 = 2,\ a_2 = 4,\ a_7 = 14$.`}</p>
              <p>{String.raw`(b) Squares: $a_n = n^2,\ n \ge 1$ gives $1, 4, 9, 16, \dots$`}</p>
              <p>{String.raw`(c) A sequence can start anywhere: $a_n = n - 3,\ n \ge 0$ gives $-3, -2, -1, 0, \dots$. The condition $n \ge 0$ matters — change it and you change the sequence.`}</p>
            </Example>
            <p>The key idea: <b>one index, one direction.</b> The index moves along a single line of positions. Now we ask the question that opens the whole course.</p>

            <Sec id="idx" n="3">What If We Add a Second Index?</Sec>
            <p>A single index locates a term in a <b>line</b> of numbers. But what if our data is arranged in a <b>grid</b> — rows and columns? One index cannot say "which row <i>and</i> which column." We need <b>two</b>.</p>
            <p>{String.raw`So we write $a_{ij}$, with `}<i>two</i>{String.raw` indices: $i$ is the `}<b>row</b>{String.raw`, $j$ is the `}<b>column</b>. The full collection is written</p>
            <p style={{ textAlign: 'center' }}>{String.raw`$$\left(a_{ij}\right)_{\substack{1 \le i \le m \\ 1 \le j \le n}}$$`}</p>
            <p>{String.raw`This says: let $i$ run from $1$ to $m$ (so $m$ rows) and $j$ from $1$ to $n$ (so $n$ columns). Every pair $(i, j)$ picks out exactly one number $a_{ij}$ in the grid.`}</p>
            <Reveal label="Why two indices, intuitively">
              <p style={{ margin: 0 }}>{String.raw`Think of a seating chart. To name a seat you need both the row and the seat within it. "Row 3, seat 5" is $a_{35}$. One number is ambiguous — seat 5 in which row? Two indices remove the ambiguity. A matrix is just a fully labelled seating chart of numbers.`}</p>
            </Reveal>

            <Sec id="mat" n="4">The Definition of a Matrix</Sec>
            <DefBox term="Matrix">
              <p style={{ margin: 0 }}>{String.raw`A `}<b>matrix</b>{String.raw` is a sequence with `}<b>two indices</b>{String.raw` — a rectangular array of numbers in rows and columns. The collection $(a_{ij})$ with $1 \le i \le m$ and $1 \le j \le n$ written in full is:`}</p>
            </DefBox>
            <p style={{ textAlign: 'center' }}>{String.raw`$$A = \begin{pmatrix} a_{11} & a_{12} & \cdots & a_{1n} \\ a_{21} & a_{22} & \cdots & a_{2n} \\ \vdots & \vdots & \ddots & \vdots \\ a_{m1} & a_{m2} & \cdots & a_{mn} \end{pmatrix}$$`}</p>
            <p>{String.raw`Read the subscripts carefully: $a_{ij}$ sits in `}<b>{String.raw`row $i$, column $j$`}</b>{String.raw` — row first, column second. So $a_{23}$ is the entry in the 2nd row, 3rd column. This row-then-column rule never changes.`}</p>

            <Sec id="ord" n="5">Order, Rows &amp; Columns</Sec>
            <p>{String.raw`A matrix with $m$ rows and $n$ columns has `}<b>order</b>{String.raw` (or `}<b>size</b>{String.raw`) $m \times n$, read "$m$ by $n$". Again — `}<b>rows first, columns second.</b></p>
            <Example n="3" title="Reading the order">
              <p>{String.raw`$B = \begin{pmatrix} 1 & 5 & -2 \\ 0 & 3 & 7 \end{pmatrix}$ has $2$ rows and $3$ columns, so $B$ is a $2 \times 3$ matrix — $6$ entries in total.`}</p>
            </Example>

            <Sec id="types" n="6">Types of Matrices</Sec>
            <p>Some shapes come up so often they get their own names:</p>
            <Example n="4" title="A field guide">
              <p><b>Row matrix</b>{String.raw` — a single row, order $1 \times n$: $\quad \begin{pmatrix} 4 & 1 & 9 \end{pmatrix}$.`}</p>
              <p><b>Column matrix</b>{String.raw` — a single column, order $m \times 1$: $\quad \begin{pmatrix} 4 \\ 1 \\ 9 \end{pmatrix}$.`}</p>
              <p><b>Square matrix</b>{String.raw` — equal rows and columns, order $n \times n$: $\quad \begin{pmatrix} 2 & 1 \\ 0 & 5 \end{pmatrix}$ is $2\times 2$. Most of this course lives among square matrices.`}</p>
              <p><b>Zero matrix</b>{String.raw` — every entry is $0$, written $O$.`}</p>
              <p><b>Diagonal matrix</b>{String.raw` — square, zeros off the main diagonal: $\quad \begin{pmatrix} 3 & 0 \\ 0 & 7 \end{pmatrix}$.`}</p>
              <p><b>Identity matrix</b>{String.raw` $I$ — a diagonal matrix with $1$s on the diagonal: $\quad I_2 = \begin{pmatrix} 1 & 0 \\ 0 & 1 \end{pmatrix}$. It plays the role of $1$ for matrices.`}</p>
            </Example>

            <Sec id="notation" n="7">Notation &amp; Picking Out Entries</Sec>
            <p>{String.raw`We name matrices with `}<b>capital letters</b>{String.raw` and entries with the matching small letter and two indices: $A = (a_{ij})$. To find a specific entry, read row then column.`}</p>
            <Example n="5" title="Find a₂₃">
              <p>{String.raw`Let $A = \begin{pmatrix} 2 & 9 & 1 \\ 4 & 0 & 6 \\ 7 & 3 & 8 \end{pmatrix}$.`}</p>
              <p>{String.raw`$a_{23}$ means row $2$, column $3$. Go to the 2nd row $(4, 0, 6)$, then the 3rd entry: $a_{23} = 6$.`}</p>
              <p>{String.raw`Check: $a_{31} = 7$, $a_{12} = 9$. Notice $a_{12}$ and $a_{21} = 4$ differ — index order matters.`}</p>
            </Example>

            <Sec id="diag" n="8">Diagonals</Sec>
            <DefBox term="Main diagonal">
              <p style={{ margin: 0 }}>{String.raw`In $A = (a_{ij})$, the entries where row index equals column index — $a_{11}, a_{22}, a_{33}, \dots$ — form the `}<b>main diagonal</b>{String.raw`. They run from top-left downward to the right.`}</p>
            </DefBox>
            <Example n="6" title="Spotting the diagonals">
              <p>{String.raw`In $A = \begin{pmatrix} \mathbf{2} & 9 & 1 \\ 4 & \mathbf{0} & 6 \\ 7 & 3 & \mathbf{8} \end{pmatrix}$ the `}<b>main diagonal</b>{String.raw` is $2, 0, 8$.`}</p>
              <p>The <b>secondary diagonal</b> runs top-right to bottom-left: 1, 0, 7. In this course we care far more about the main diagonal — it controls the identity matrix, traces, and (later) eigenvalues.</p>
            </Example>

            <Sec id="history" n="9">A Short History</Sec>
            <p>The grid of numbers is ancient — Chinese mathematicians solved systems with array methods two thousand years ago in the <i>Nine Chapters on the Mathematical Art</i>. But the <b>word</b> and the <b>theory</b> are surprisingly recent.</p>
            <p>The term <b>"matrix"</b> was coined in 1850 by <b>James Joseph Sylvester</b>, using the Latin word for "womb" — the array <i>from which</i> smaller determinants are born. His close friend <b>Arthur Cayley</b> took the next step: in his 1858 <i>Memoir on the Theory of Matrices</i>, he treated matrices as objects you can <b>add and multiply in their own right</b>, turning a bookkeeping device into a branch of algebra.</p>
            <p>And looming over all of it is <b>Carl Friedrich Gauss</b>, whose systematic elimination method still carries his name: <b>Gaussian elimination</b>. Gauss developed it to compute the orbit of the dwarf planet Ceres from a few telescope observations, and his prediction let astronomers find Ceres again after it was lost behind the sun.</p>
            <p style={{ fontStyle: 'italic', color: 'var(--lec-ink2)' }}>The lesson worth carrying: matrices were forged to <b>solve real problems</b> — orbits, networks, systems of equations. That is where we now turn.</p>

            <Sec id="sys" n="10">Solving Linear Equations</Sec>
            <p>Here begins the first main theme of the course. We start with the simplest building block.</p>
            <DefBox term="Linear equation">
              <p style={{ margin: 0 }}>{String.raw`A `}<b>linear equation</b>{String.raw` in $x$ and $y$ has the form $ax + by = c$, where $a, b, c$ are constants. "Linear" means each variable appears only to the first power — no $x^2$, no $xy$, no $\sqrt{x}$.`}</p>
            </DefBox>
            <p>{String.raw`**Graphical meaning.** In the plane, the points $(x, y)$ satisfying $ax + by = c$ form a `}<b>straight line</b>{String.raw`. For example $x + y = 3$ passes through $(3, 0)$ and $(0, 3)$.`}</p>
            <p>Now suppose we have <b>two</b> linear equations at once — a <b>system</b>:</p>
            <p style={{ textAlign: 'center' }}>{String.raw`$$\begin{cases} x + y = 3 \\ x - y = 1 \end{cases}$$`}</p>
            <p>{String.raw`To `}<b>solve</b>{String.raw` the system is to find the pair $(x, y)$ satisfying `}<i>both</i>{String.raw` equations — the point where the two lines `}<b>cross</b>.</p>
            <Example n="7" title="Solving by elimination">
              <p><b>Elimination</b> means combining the equations to cancel a variable.</p>
              <p>{String.raw`Add them: $(x + y) + (x - y) = 3 + 1$, so $2x = 4$, giving $x = 2$.`}</p>
              <p>{String.raw`Substitute into the first: $2 + y = 3$, so $y = 1$.`}</p>
              <p>{String.raw`Solution: $(x, y) = (2, 1)$. Check: $2 + 1 = 3$ ✓ and $2 - 1 = 1$ ✓.`}</p>
            </Example>

            <Sec id="solutions" n="11">Three Things That Can Happen</Sec>
            <p>Two lines in a plane can meet in exactly three ways — giving the three possible outcomes for a linear system.</p>
            <Example n="8" title="(a) Exactly one solution">
              <p>{String.raw`$\begin{cases} x + y = 3 \\ x - y = 1 \end{cases}$ — lines cross at one point $(2,1)$. `}<b>A unique solution.</b></p>
            </Example>
            <Example n="9" title="(b) No solution">
              <p>{String.raw`$\begin{cases} x + y = 3 \\ x + y = 5 \end{cases}$ — `}<b>parallel</b>{String.raw` lines. They never meet: `}<b>no solution</b>{String.raw`. Subtracting gives $0 = 2$, impossible — the system is inconsistent.`}</p>
            </Example>
            <Example n="10" title="(c) Infinitely many solutions">
              <p>{String.raw`$\begin{cases} x + y = 3 \\ 2x + 2y = 6 \end{cases}$ — the second is the first doubled. `}<b>Same line</b>{String.raw`, so `}<b>infinitely many</b>{String.raw` solutions.`}</p>
            </Example>
            <p>So a linear system has <b>one</b>, <b>none</b>, or <b>infinitely many</b> solutions — never exactly two. Keep this trichotomy in mind; it returns in a more powerful form once matrices do the work.</p>

            <Sec id="r3" n="12">From 2D to 3D</Sec>
            <p>{String.raw`So far our equations lived in the plane $\mathbb{R}^2$, with two variables. What happens when we add a third variable $z$ and move into space $\mathbb{R}^3$?`}</p>
            <p>{String.raw`In the plane, $2x + 3y = 4$ is a `}<b>line</b>{String.raw`. But what does the `}<i>same</i>{String.raw` equation describe in $\mathbb{R}^3$ — still a line, or something else?`}</p>
            <p>{String.raw`The answer: a `}<b>plane</b>{String.raw`. The equation places `}<i>no condition</i>{String.raw` on $z$. So if $(x, y)$ satisfies $2x + 3y = 4$, the point $(x, y, z)$ lies on the graph `}<b>{String.raw`for every value of $z$`}</b>{String.raw`. The line in the floor gets "swept" up and down through all heights — and a swept line is a plane.`}</p>
            <DefBox term="The role of a missing variable">
              <p style={{ margin: 0 }}>{String.raw`When a variable is absent from an equation in $\mathbb{R}^3$, it is `}<b>free</b>{String.raw` — it can take any value, and the graph extends without restriction in that direction. A missing $z$ means a vertical sweep: a line becomes a plane.`}</p>
            </DefBox>
            <p>{String.raw`Use the widget below. Start with $ax + by + cz = d$, then press `}<b>{String.raw`“Set $c = 0$”`}</b>{String.raw` to remove $z$. Watch the figure become a vertical plane. Drag to rotate.`}</p>

            <PlaneWidget />

            <p>This idea — that the <b>number of variables</b> sets the <b>dimension</b>, and a single linear equation carves out a flat object one dimension lower (a line in 2D, a plane in 3D) — is the geometric heart of everything ahead.</p>

            <Sec id="planes" n="13">Picturing Planes in Space</Sec>
            <p>One linear equation in three variables is a <b>plane</b>. A system of three such equations is three planes in space, and solving asks: <b>where do all three meet at once?</b></p>
            <p>Just as two lines had three outcomes, three planes have their own gallery — they might meet at a single point, along a whole line, or not all together at all. Rotate the widget above and imagine a second and third plane sliding through it; the common intersection is the solution set.</p>
            <DefBox term="Geometry of a 3-variable system">
              <p style={{ margin: 0 }}>{String.raw`A system of three equations in $x, y, z$ is three planes. The solution is their `}<b>common intersection</b>: a single point, a line or plane (infinitely many), or empty (none). The same trichotomy survives into higher dimensions.</p>
            </DefBox>

            <Sec id="elim3" n="14">Elimination With Three Variables</Sec>
            <p>The method does not change — we still eliminate variables by combining equations. What changes is the <b>length</b>.</p>
            <Example n="11" title="Solving a 3×3 system by elimination">
              <p style={{ textAlign: 'center' }}>{String.raw`$$\begin{cases} x + y + z = 6 \\ 2x - y + z = 3 \\ x + 2y - z = 3 \end{cases}$$`}</p>
              <p><b>{String.raw`Step 1 — eliminate $x$ from equations 2 and 3.`}</b></p>
              <p>{String.raw`Eq 2 minus $2\times$Eq 1: $(2x - y + z) - 2(x + y + z) = 3 - 12$, giving $-3y - z = -9$.`}</p>
              <p>{String.raw`Eq 3 minus Eq 1: $(x + 2y - z) - (x + y + z) = 3 - 6$, giving $y - 2z = -3$.`}</p>
              <p><b>{String.raw`Step 2 — a 2-variable system in $y, z$:`}</b>{String.raw` $-3y - z = -9$ and $y - 2z = -3$. From the second, $y = 2z - 3$; substituting, $-3(2z-3) - z = -9 \Rightarrow z = \tfrac{18}{7}$.`}</p>
              <p><b>Step 3 — back-substitute</b> to get y, then x. Even with friendly numbers we needed three coordinated stages and careful bookkeeping.</p>
            </Example>
            <p>With <b>two</b> variables, one step finished the job. With <b>three</b>, we eliminated down to a 2-variable system, solved it, then climbed back up. The work <i>compounds</i> with each new variable.</p>

            <Sec id="dir" n="15">Slope, and Its Generalisation</Sec>
            <p>{String.raw`In two variables, a line $ax + by = c$ has a `}<b>slope</b>{String.raw` — one number for its direction. We can repackage that as a pair of `}<b>direction ratios</b>{String.raw`: how much $x$ and $y$ change together.`}</p>
            <p>{String.raw`In three variables the idea must grow: a direction in space needs `}<b>three</b>{String.raw` direction ratios, for change in $x$, $y$, $z$. The single "slope" of school algebra is the 2D shadow of a richer object. As dimensions rise, direction needs more numbers — another hint we need a better bookkeeping tool.`}</p>

            <Sec id="scale" n="16">What Happens at 4, 5, 6 Variables?</Sec>
            <p>A system in <b>four</b> variables: elimination still works, but each stage juggles four coefficients per equation, and we need more stages. The number of steps grows fast and — more dangerously — <b>so does the chance of a slip</b>. One dropped minus sign early poisons everything downstream.</p>
            <p>{String.raw`At `}<b>five</b>{String.raw` or `}<b>six</b>{String.raw` variables, hand elimination on raw equations becomes impractical: pages of rewriting the same symbols $x, y, z, w, \dots$ over and over.`}</p>
            <p style={{ fontStyle: 'italic', color: 'var(--lec-ink2)' }}>{String.raw`The symbols $x, y, z$ are `}<b>carried along uselessly</b>{String.raw` through every step — they never change, only their coefficients do. So why keep writing them? This is the insight behind the matrix method: `}<b>strip away the variables, keep only the numbers, operate on the numbers.</b></p>

            <Sec id="matform" n="17">Converting a System to Matrix Form</Sec>
            <p>Collect the <b>coefficients</b> into one array, the <b>unknowns</b> into a column, the <b>constants</b> into another. The whole system becomes a single equation between arrays:</p>
            <div style={{ textAlign: 'center', margin: '24px 0' }}>
              <p style={{ margin: 0 }}>{String.raw`$$\underbrace{\begin{pmatrix} a_{11} & a_{12} & \cdots & a_{1n} \\ a_{21} & a_{22} & \cdots & a_{2n} \\ \vdots & \vdots & \ddots & \vdots \\ a_{m1} & a_{m2} & \cdots & a_{mn} \end{pmatrix}}_{\textstyle A\ \text{(coefficient matrix)}} \underbrace{\begin{pmatrix} x_1 \\ x_2 \\ \vdots \\ x_n \end{pmatrix}}_{\textstyle X\ \text{(unknowns)}} = \underbrace{\begin{pmatrix} b_1 \\ b_2 \\ \vdots \\ b_m \end{pmatrix}}_{\textstyle b\ \text{(constants)}}$$`}</p>
              <p style={{ fontFamily: 'var(--fm)', fontSize: '1.3rem', color: 'var(--lec-ink)', marginTop: '16px' }}>{String.raw`$$A\,X = b$$`}</p>
            </div>
            <p>{String.raw`This compact statement $AX = b$ `}<i>is</i>{String.raw` the system. $A$ holds the coefficients, $X$ the unknowns, $b$ the right-hand constants.`}</p>
            <DefBox term="Sort before you convert">
              <p style={{ margin: 0 }}>{String.raw`Before building $A$, `}<b>line up the variables in the same order in every equation</b>{String.raw`, each in its own column, constants on the right. A missing variable has coefficient $0$ — write the $0$. If equations aren't sorted, the matrix scrambles which number means what. Sorting is what makes the matrix mean anything.`}</p>
            </DefBox>

            <Sec id="aug" n="18">{String.raw`The Augmented Matrix $(A \mid b)$`}</Sec>
            <p>{String.raw`For solving, glue the constants onto $A$ as one extra column, separated by a bar — the `}<b>augmented matrix</b>{String.raw` $(A \mid b)$:`}</p>
            <p style={{ textAlign: 'center' }}>{String.raw`$$(A \mid b) = \left(\begin{array}{cccc|c} a_{11} & a_{12} & \cdots & a_{1n} & b_1 \\ a_{21} & a_{22} & \cdots & a_{2n} & b_2 \\ \vdots & \vdots & \ddots & \vdots & \vdots \\ a_{m1} & a_{m2} & \cdots & a_{mn} & b_m \end{array}\right)$$`}</p>
            <p>The bar marks where the equals sign was. Left of it, coefficients; the single column right of it, the constants.</p>
            <Example n="12" title="Both notations, side by side">
              <p>{String.raw`System: $\begin{cases} 2x + 3y = 8 \\ x - y = -1 \end{cases}$`}</p>
              <p><b>{String.raw`As $AX = b$:`}</b>{String.raw` $\quad \begin{pmatrix} 2 & 3 \\ 1 & -1 \end{pmatrix}\begin{pmatrix} x \\ y \end{pmatrix} = \begin{pmatrix} 8 \\ -1 \end{pmatrix}$`}</p>
              <p><b>Augmented:</b>{String.raw` $\quad \left(\begin{array}{cc|c} 2 & 3 & 8 \\ 1 & -1 & -1 \end{array}\right)$`}</p>
            </Example>
            <Example n="13" title="With a three-variable system">
              <p>{String.raw`System: $\begin{cases} x + y + z = 6 \\ 2x - y + z = 3 \\ x + 2y - z = 3 \end{cases}$`}</p>
              <p><b>{String.raw`$AX = b$:`}</b>{String.raw` $\quad \begin{pmatrix} 1 & 1 & 1 \\ 2 & -1 & 1 \\ 1 & 2 & -1 \end{pmatrix}\begin{pmatrix} x \\ y \\ z \end{pmatrix} = \begin{pmatrix} 6 \\ 3 \\ 3 \end{pmatrix}$`}</p>
              <p><b>{String.raw`$(A \mid b)$:`}</b>{String.raw` $\quad \left(\begin{array}{ccc|c} 1 & 1 & 1 & 6 \\ 2 & -1 & 1 & 3 \\ 1 & 2 & -1 & 3 \end{array}\right)$`}</p>
            </Example>
            <Example n="14" title="Watch the missing variables">
              <p>{String.raw`System: $\begin{cases} 2x - y = 4 \\ z = 3 \end{cases}$. The first has no $z$; the second no $x$ or $y$. Fill gaps with $0$:`}</p>
              <p style={{ textAlign: 'center' }}>{String.raw`$$\left(\begin{array}{ccc|c} 2 & -1 & 0 & 4 \\ 0 & 0 & 1 & 3 \end{array}\right)$$`}</p>
              <p>{String.raw`Tempting mistake: should we pad to a square $3\times 3$ by adding a row of zeros?`}</p>
              <p style={{ textAlign: 'center' }}>{String.raw`$$\left(\begin{array}{ccc|c} 2 & -1 & 0 & 4 \\ 0 & 0 & 1 & 3 \\ 0 & 0 & 0 & 0 \end{array}\right)$$`}</p>
              <p>{String.raw`That bottom row reads $0x + 0y + 0z = 0$, i.e. $0 = 0$ — true for `}<i>every</i>{String.raw` $x, y, z$. It is a `}<b>redundant (trivial) row</b>{String.raw`: no information at all. You could add a thousand and the system would be unchanged. Not `}<i>wrong</i>{String.raw`, but clutter — `}<b>leave it out.</b></p>
            </Example>

            <Sec id="why" n="19">Why Bother? A Matrix That Solves Itself</Sec>
            <p>Here is the pay-off. Suppose a system's augmented matrix looked like this:</p>
            <p style={{ textAlign: 'center' }}>{String.raw`$$\left(\begin{array}{ccc|c} 1 & 2 & -1 & 3 \\ 0 & 1 & 4 & 5 \\ 0 & 0 & 1 & 2 \end{array}\right)$$`}</p>
            <p>{String.raw`The bottom row says $z = 2$ — solved for free. The middle row says $y + 4z = 5$; since $z = 2$, $y = 5 - 8 = -3$. The top row says $x + 2y - z = 3$; plugging in, $x = 3 - 2(-3) + 2 = 11$.`}</p>
            <p>No elimination loops — just read the bottom equation, then climb upward substituting. This is <b>back-substitution</b>. The whole game becomes: <b>use row operations to massage the matrix into this staircase shape</b>, then back-substitute. That shape has a name.</p>

            <Sec id="ref" n="20">Row-Echelon Form</Sec>
            <p>Three features made that matrix easy: (1) the <b>first nonzero entry of each row is a 1</b> (the <b>leading 1</b>); (2) <b>below each leading 1, the column is all zeros</b>; (3) each leading 1 sits <b>further right</b> than the one above — the staircase.</p>
            <DefBox term="Row-echelon form (this course)">
              <p style={{ margin: '0 0 8px' }}>A matrix is in <b>row-echelon form (REF)</b> when:</p>
              <p style={{ margin: '0 0 4px' }}>1. All zero rows (if any) sit at the bottom.</p>
              <p style={{ margin: '0 0 4px' }}>{String.raw`2. The first nonzero entry in each nonzero row is a $1$ — the `}<b>leading 1</b>.</p>
              <p style={{ margin: 0 }}>3. Each leading 1 is to the right of every leading 1 in the rows above it.</p>
            </DefBox>
            <Reveal label="A note on the general definition">
              <p style={{ margin: 0 }}>{String.raw`Textbooks differ. In the most general definition, the leading entry of a row — the `}<b>pivot</b>{String.raw` — only needs to be `}<b>nonzero</b>{String.raw`, not necessarily $1$ (Lay, Strang use this). The book we follow (Nicholson) `}<i>requires</i>{String.raw` leading 1s, so that is our rule throughout: `}<b>pivots are leading 1s</b>{String.raw`. If another book shows pivots that aren't $1$, it is just a different convention.`}</p>
            </Reveal>
            <DefBox term="Reduced row-echelon form (RREF)">
              <p style={{ margin: 0 }}>If a row-echelon matrix <i>also</i> has <b>each leading 1 as the only nonzero entry in its whole column</b>, it is in <b>reduced row-echelon form</b> — the tidiest shape, handing you the solution with no back-substitution.</p>
            </DefBox>
            <p>The leading 1s are the <b>pivots</b> — the load-bearing entries marking where each variable gets solved. We will keep meeting them all term.</p>
            <Example n="15" title="Spotting the pivots">
              <p>{String.raw`In $\left(\begin{array}{cccc} 1 & 2 & 3 & 4 \\ 0 & 1 & 5 & 6 \\ 0 & 0 & 1 & 7 \end{array}\right)$ the pivots are the three leading 1s, in columns 1, 2, 3 — stepping down and right. This is in REF.`}</p>
            </Example>

            <Sec id="check" n="21">Your Turn: Is It in REF?</Sec>
            <p>For each matrix below, decide whether it is in <b>row-echelon form</b> using our three conditions (leading 1s, staircase to the right, zero rows at the bottom). Click your answer for instant feedback — the pivots light up in gold.</p>

            <RefChecker />

            <p>If you can reliably tell REF from not-REF, you are ready for next lecture, where we learn the <b>row operations</b> that transform any matrix into this form — the engine behind Gaussian elimination.</p>

            <div style={{ marginTop: '60px', paddingTop: '24px', borderTop: '2px solid var(--lec-border)', textAlign: 'center', fontFamily: 'var(--fm)', fontSize: '.8rem', color: 'var(--lec-ink2)', fontStyle: 'italic' }}>
              — end of Lecture 1 —
            </div>

          </div>

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