'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import Navbar from '../../../../components/Navbar';
import Footer from '../../../../components/Footer';

/* ════════════════════════════════════════════════════════════
   MATH-120 · LECTURE 18
   Dot Product, Length & Distance (§5.3) → Orthogonal Complements
   and the Gram–Schmidt Process (§8.1)
   Route: /courses/linalg/w5/lec18
   ════════════════════════════════════════════════════════════ */

const LECTURES = [
  { week: 1, n: 1, slug: 'w1/lec1', title: 'The Language of Matrices', live: true },
  { week: 1, n: 2, slug: 'w1/lec2', title: 'Row Operations & Gaussian Elimination', live: true },
  { week: 1, n: 3, slug: 'w1/lec3', title: 'RREF, Homogeneous Systems & Linear Combinations', live: true },
  { week: 1, n: 4, slug: 'w1/lec4', title: 'Solution Structure & Applications', live: true },
  { week: 2, n: 5, slug: 'w2/lec5', title: 'Matrix Algebra: Addition, Scalar Multiplication & Transpose', live: true },
  { week: 2, n: 6, slug: 'w2/lec6', title: 'The Inverse of a Matrix', live: true },
  { week: 2, n: 7, slug: 'w2/lec7', title: 'Elementary Matrices & Solving Systems', live: true },
  { week: 2, n: 8, slug: 'w2/lec8', title: 'LU-Factorization & Input–Output Models', live: true },
  { week: 3, n: 9, slug: 'w3/lec9', title: 'Determinants: Cofactor Expansion & Properties', live: true },
  { week: 3, n: 10, slug: 'w3/lec10', title: 'Determinants & Matrix Inverses', live: true },
  { week: 3, n: 11, slug: 'w3/lec11', title: 'Eigenvalues & Eigenvectors', live: true },
  { week: 4, n: 12, slug: 'w4/lec12', title: 'Diagonalization & Dynamical Systems', live: true },
  { week: 4, n: 13, slug: 'w4/lec13', title: 'Polynomial Interpolation & Linear Recurrences', live: true },
  { week: 4, n: 14, slug: 'w4/lec14', title: 'Subspaces & Spanning', live: true },
  { week: 5, n: 15, slug: 'w5/lec15', title: 'Independence & Dimension', live: true },
  { week: 5, n: 16, slug: 'w5/lec16', title: 'Vector Spaces (Abstract)', live: true },
  { week: 5, n: 17, slug: 'w5/lec17', title: 'Extending a Basis; Row, Column & Null Space', live: true },
  { week: 5, n: 18, slug: 'w5/lec18', title: 'Dot Product, Distance & Gram–Schmidt', live: true },
];
const THIS_SLUG = 'w5/lec18';
const PREV_HREF  = '/courses/linalg/w5/lec17';
const NEXT_HREF  = '/courses/linalg';

const LEC = {
  course: 'MATH-120 · Linear Algebra',
  number: 'Lecture 18',
  title: 'Geometry Arrives: Dot Product, Distance & Gram–Schmidt',
  subtitle: 'Everything so far has been algebra — spans, bases, dimension. Today we add angles, lengths, and the idea of "perpendicular," and build a machine that manufactures perpendicular bases on demand',
  date: '9 July 2026',
};

const ANCHORS = [
  ['The Dot Product', 'dot-product'],
  ['Length of a Vector', 'length'],
  ['Distance', 'distance'],
  ['Orthogonality', 'orthogonality'],
  ['Normalizing', 'normalizing'],
  ['Orthogonal Lemma', 'orth-lemma'],
  ['Gram–Schmidt: How', 'gs-how'],
  ['Gram–Schmidt: Worked', 'gs-worked'],
  ['Exercises', 'exercises'],
];

function lecturesByWeek() {
  const w = {};
  LECTURES.forEach(l => { (w[l.week] = w[l.week] || []).push(l); });
  return Object.keys(w).map(Number).sort((a,b)=>a-b).map(week=>({week,lectures:w[week]}));
}

/* ═══════════════ COMPONENTS ═══════════════ */

function Reveal({ label = 'Show solution', children }) {
  const [open, setOpen] = useState(false);
  const bodyRef = useRef(null);
  useEffect(() => {
    if (!open) return;
    let n = 0;
    const t = setInterval(() => {
      n++;
      if (window.MathJax?.typesetPromise && bodyRef.current) {
        window.MathJax.typesetPromise([bodyRef.current]);
        clearInterval(t);
      }
      if (n > 20) clearInterval(t);
    }, 80);
    return () => clearInterval(t);
  }, [open]);
  return (
    <div style={{ margin: '16px 0' }}>
      <button onClick={() => setOpen(o=>!o)} style={{
        fontFamily:'var(--fm)', fontSize:'.78rem', letterSpacing:'.04em',
        color:'#c8860a', background:'rgba(232,160,32,.10)',
        border:'1px solid rgba(232,160,32,.4)', borderRadius:'8px',
        padding:'9px 18px', cursor:'pointer', display:'inline-flex', alignItems:'center', gap:'8px', fontWeight:600,
        transition:'background .15s',
      }}
      onMouseEnter={e=>{e.currentTarget.style.background='rgba(232,160,32,.18)';}}
      onMouseLeave={e=>{e.currentTarget.style.background='rgba(232,160,32,.10)';}}
      >
        <span style={{ transform:open?'rotate(90deg)':'none', transition:'transform .2s', display:'inline-block' }}>▶</span>
        {open ? 'Hide solution' : label}
      </button>
      {open && (
        <div ref={bodyRef} style={{ marginTop:'12px', padding:'18px 22px', background:'rgba(56,201,176,.06)', border:'1px solid #cfe8e2', borderRadius:'12px', lineHeight:1.8 }}>
          {children}
        </div>
      )}
    </div>
  );
}

function DefBox({ term, color='teal', children }) {
  const c = color==='amber'?{bg:'rgba(232,160,32,.07)',bd:'#c8860a',tc:'#c8860a'}
           :color==='violet'?{bg:'rgba(155,128,232,.08)',bd:'#9b80e8',tc:'#9b80e8'}
           :color==='rose'?{bg:'rgba(224,107,107,.08)',bd:'#d85555',tc:'#d85555'}
           :{bg:'rgba(56,201,176,.07)',bd:'#2a9d8f',tc:'#2a9d8f'};
  return (
    <div style={{ background:c.bg, borderLeft:`4px solid ${c.bd}`, borderRadius:'0 12px 12px 0', padding:'18px 22px', margin:'22px 0' }}>
      {term && <div style={{ fontFamily:'var(--fm)', fontSize:'.68rem', letterSpacing:'.16em', textTransform:'uppercase', color:c.tc, marginBottom:'8px', display:'flex', alignItems:'center', gap:'8px' }}>
        <span style={{ width:'6px', height:'6px', borderRadius:'50%', background:c.tc, display:'inline-block' }}></span>
        {term}
      </div>}
      <div>{children}</div>
    </div>
  );
}

function ThmBox({ title, children }) {
  return (
    <div style={{ background:'rgba(155,128,232,.06)', border:'2px solid #9b80e8', borderRadius:'12px', padding:'20px 24px', margin:'24px 0' }}>
      {title && <div style={{ fontFamily:'var(--fm)', fontSize:'.72rem', letterSpacing:'.14em', textTransform:'uppercase', color:'#9b80e8', marginBottom:'12px', fontWeight:700 }}>
        {title}
      </div>}
      <div style={{ color:'var(--lec-ink2)', lineHeight:1.8 }}>{children}</div>
    </div>
  );
}

function Example({ n, title, advanced, children }) {
  return (
    <div style={{ background:advanced?'rgba(155,128,232,.05)':'rgba(255,253,240,.97)', border:`1px solid ${advanced?'rgba(155,128,232,.35)':'var(--lec-border)'}`, borderRadius:'14px', padding:'24px 28px', margin:'22px 0', boxShadow:'0 2px 18px rgba(60,40,20,.06)' }}>
      <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'14px', flexWrap:'wrap' }}>
        <span style={{ fontFamily:'var(--fm)', fontSize:'.7rem', letterSpacing:'.1em', textTransform:'uppercase', color:advanced?'#9b80e8':'#c8860a', background:advanced?'rgba(155,128,232,.14)':'rgba(232,160,32,.14)', padding:'4px 12px', borderRadius:'20px' }}>
          {advanced?`★ ${n}`:`Example ${n}`}
        </span>
        {title && <span style={{ fontFamily:'var(--fh)', fontSize:'1.08rem', color:'var(--lec-ink)', fontWeight:600 }}>{title}</span>}
      </div>
      {children}
    </div>
  );
}

function Exercise({ id, title, children }) {
  return (
    <div style={{ background:'rgba(56,201,176,.05)', border:'1px solid rgba(56,201,176,.3)', borderRadius:'14px', padding:'24px 28px', margin:'22px 0' }}>
      <div style={{ display:'flex', alignItems:'baseline', gap:'12px', marginBottom:'14px', flexWrap:'wrap' }}>
        <span style={{ fontFamily:'var(--fm)', fontSize:'.7rem', letterSpacing:'.1em', textTransform:'uppercase', color:'#2a9d8f', background:'rgba(56,201,176,.14)', padding:'4px 12px', borderRadius:'20px' }}>Exercise {id}</span>
        {title && <span style={{ fontFamily:'var(--fh)', fontSize:'1.05rem', color:'var(--lec-ink)', fontWeight:600 }}>{title}</span>}
      </div>
      {children}
    </div>
  );
}

function Sec({ id, n, children }) {
  return (
    <h2 id={id} style={{ scrollMarginTop:'calc(var(--nav-h) + 3px + 37px + 48px + 16px)', fontFamily:'var(--fh)', fontSize:'clamp(1.6rem,3vw,2.1rem)', color:'var(--lec-ink)', margin:'56px 0 18px', display:'flex', alignItems:'baseline', gap:'14px', borderBottom:'1px solid var(--lec-border)', paddingBottom:'10px' }}>
      <span style={{ fontFamily:'var(--fm)', fontSize:'.82rem', color:'#c8860a', flexShrink:0 }}>{n}</span>
      {children}
    </h2>
  );
}

function Callout({ icon, title, color='amber', children }) {
  const c = color==='teal'?'rgba(56,201,176,.09)':color==='violet'?'rgba(155,128,232,.09)':color==='rose'?'rgba(224,107,107,.09)':'rgba(232,160,32,.09)';
  const bc = color==='teal'?'var(--teal)':color==='violet'?'var(--violet)':color==='rose'?'var(--rose)':'var(--amber)';
  return (
    <div style={{ background:c, border:`1px solid ${bc}40`, borderRadius:'12px', padding:'18px 22px', margin:'22px 0', display:'flex', gap:'16px' }}>
      <span style={{ fontSize:'1.6rem', flexShrink:0, lineHeight:1 }}>{icon}</span>
      <div>
        {title && <div style={{ fontFamily:'var(--fm)', fontSize:'.72rem', letterSpacing:'.12em', textTransform:'uppercase', color:bc, marginBottom:'6px' }}>{title}</div>}
        <div style={{ fontSize:'.95rem', color:'var(--lec-ink2)', lineHeight:1.75 }}>{children}</div>
      </div>
    </div>
  );
}

function SubH({ children }) {
  return <p style={{ fontFamily:'var(--fh)', fontSize:'1.3rem', color:'var(--lec-ink)', margin:'36px 0 12px', fontWeight:600 }}>{children}</p>;
}

function StepList({ items }) {
  return (
    <ol style={{ margin:'10px 0', paddingLeft:'0', listStyle:'none', display:'flex', flexDirection:'column', gap:'10px' }}>
      {items.map((it, i) => (
        <li key={i} style={{ display:'flex', gap:'12px', alignItems:'flex-start' }}>
          <span style={{ flexShrink:0, fontFamily:'var(--fm)', fontSize:'.7rem', fontWeight:700, color:'#c8860a', background:'rgba(232,160,32,.14)', borderRadius:'999px', width:'24px', height:'24px', display:'flex', alignItems:'center', justifyContent:'center', marginTop:'2px' }}>{i+1}</span>
          <span style={{ fontSize:'1rem', lineHeight:1.75, color:'var(--lec-ink2)' }}>{it}</span>
        </li>
      ))}
    </ol>
  );
}

function BulletList({ items, dense }) {
  return (
    <ul style={{ margin: dense ? '6px 0' : '14px 0', paddingLeft:'0', listStyle:'none', display:'flex', flexDirection:'column', gap: dense ? '6px' : '10px' }}>
      {items.map((it, i) => (
        <li key={i} style={{ display:'flex', gap:'10px', alignItems:'flex-start' }}>
          <span style={{ flexShrink:0, color:'#c8860a', fontWeight:700, lineHeight:1.6 }}>•</span>
          <span style={{ fontSize:'1rem', lineHeight:1.8, color:'var(--lec-ink2)' }}>{it}</span>
        </li>
      ))}
    </ul>
  );
}

/* Inline SVG figure: the distance-as-a-triangle diagram, motivated by R^3 */
function DistanceFigure() {
  return (
    <div style={{ margin:'22px 0', padding:'20px', background:'rgba(255,253,240,.7)', border:'1px solid var(--lec-border)', borderRadius:'14px' }}>
      <svg viewBox="0 0 620 300" style={{ width:'100%', height:'auto', maxWidth:'560px', display:'block', margin:'0 auto' }}>
        <defs>
          <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" fill="#4a4030" />
          </marker>
          <marker id="arrowheadTeal" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" fill="#2a9d8f" />
          </marker>
        </defs>
        {/* Panel 1: x, y, and x - y from the origin */}
        <g>
          <text x="130" y="24" textAnchor="middle" fontSize="13" fontFamily="var(--fm)" fill="#7a6e5e" letterSpacing="1">d(x,y) = ‖x − y‖</text>
          <line x1="40" y1="250" x2="230" y2="60" stroke="#4a4030" strokeWidth="2" markerEnd="url(#arrowhead)"/>
          <text x="220" y="55" fontSize="15" fontFamily="var(--fh)" fill="#241e14">x</text>
          <line x1="40" y1="250" x2="200" y2="230" stroke="#4a4030" strokeWidth="2" markerEnd="url(#arrowhead)"/>
          <text x="205" y="245" fontSize="15" fontFamily="var(--fh)" fill="#241e14">y</text>
          <line x1="200" y1="230" x2="230" y2="60" stroke="#2a9d8f" strokeWidth="2" strokeDasharray="6 4" markerEnd="url(#arrowheadTeal)"/>
          <text x="255" y="150" fontSize="14" fontFamily="var(--fh)" fill="#2a9d8f">x − y</text>
          <circle cx="40" cy="250" r="3" fill="#4a4030"/>
          <text x="26" y="270" fontSize="12" fontFamily="var(--fm)" fill="#7a6e5e">O</text>
        </g>
        {/* Divider */}
        <line x1="330" y1="20" x2="330" y2="280" stroke="var(--lec-border)" strokeWidth="1"/>
        {/* Panel 2: triangle inequality among three points */}
        <g>
          <text x="475" y="24" textAnchor="middle" fontSize="13" fontFamily="var(--fm)" fill="#7a6e5e" letterSpacing="1">d(x,z) ≤ d(x,y) + d(y,z)</text>
          <line x1="370" y1="250" x2="600" y2="230" stroke="#d85555" strokeWidth="2.4"/>
          <line x1="370" y1="250" x2="480" y2="70" stroke="#4a4030" strokeWidth="2"/>
          <line x1="480" y1="70" x2="600" y2="230" stroke="#4a4030" strokeWidth="2"/>
          <circle cx="370" cy="250" r="3.5" fill="#241e14"/>
          <circle cx="480" cy="70" r="3.5" fill="#241e14"/>
          <circle cx="600" cy="230" r="3.5" fill="#241e14"/>
          <text x="356" y="270" fontSize="14" fontFamily="var(--fh)" fill="#241e14">x</text>
          <text x="480" y="58" fontSize="14" fontFamily="var(--fh)" fill="#241e14">y</text>
          <text x="606" y="248" fontSize="14" fontFamily="var(--fh)" fill="#241e14">z</text>
          <text x="470" y="255" fontSize="12" fontFamily="var(--fm)" fill="#d85555">d(x,z) — direct path</text>
          <text x="392" y="150" fontSize="11" fontFamily="var(--fm)" fill="#4a4030">d(x,y)</text>
          <text x="548" y="140" fontSize="11" fontFamily="var(--fm)" fill="#4a4030">d(y,z)</text>
        </g>
      </svg>
      <p style={{ textAlign:'center', fontSize:'.85rem', fontStyle:'italic', color:'var(--lec-ink3)', margin:'10px 0 0' }}>
        {String.raw`Left: the distance between $\mathbf{x}$ and $\mathbf{y}$ is the length of the connecting vector $\mathbf{x}-\mathbf{y}$. Right: going straight from $\mathbf{x}$ to $\mathbf{z}$ is never longer than detouring through $\mathbf{y}$.`}
      </p>
    </div>
  );
}

/* Interactive SVG figure: drag the angle between two vectors and watch
   the dot product — and a live right-angle marker — respond. */
function OrthogonalityLab() {
  const [angleDeg, setAngleDeg] = useState(60);
  const [unit, setUnit] = useState(false);

  const magX = unit ? 1 : 3;
  const magY = unit ? 1 : 2;
  const rad = (angleDeg * Math.PI) / 180;
  const dot = magX * magY * Math.cos(rad);
  const isOrthogonal = angleDeg === 90;

  const originX = 110, originY = 220, s = 34;
  const pxLenX = unit ? 100 : magX * s;
  const pxLenY = unit ? 100 : magY * s;
  const xEnd = [originX + pxLenX, originY];
  const yEnd = [originX + pxLenY * Math.cos(rad), originY - pxLenY * Math.sin(rad)];

  const arcR = 30;
  const arcEnd = [originX + arcR * Math.cos(rad), originY - arcR * Math.sin(rad)];
  const arcLabelPos = [originX + (arcR + 18) * Math.cos(rad / 2), originY - (arcR + 18) * Math.sin(rad / 2)];

  const lineCol = isOrthogonal ? '#2a9d8f' : '#4a4030';

  return (
    <div style={{ margin:'22px 0', padding:'20px', background: isOrthogonal ? 'rgba(56,201,176,.08)' : 'rgba(255,253,240,.7)', border:`1px solid ${isOrthogonal ? 'rgba(56,201,176,.5)' : 'var(--lec-border)'}`, borderRadius:'14px', transition:'background .2s, border-color .2s' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'10px', marginBottom:'6px' }}>
        <span style={{ fontFamily:'var(--fm)', fontSize:'.68rem', letterSpacing:'.14em', textTransform:'uppercase', color:'#c8860a' }}>🎛 Drag the angle between x and y</span>
        {isOrthogonal && (
          <span style={{ fontFamily:'var(--fm)', fontSize:'.7rem', fontWeight:700, color:'#2a9d8f', background:'rgba(56,201,176,.16)', border:'1px solid rgba(56,201,176,.5)', borderRadius:'20px', padding:'3px 12px' }}>⊥ Orthogonal — dot product is exactly 0</span>
        )}
      </div>

      <svg viewBox="0 0 620 260" style={{ width:'100%', height:'auto', maxWidth:'560px', display:'block', margin:'0 auto' }}>
        <defs>
          <marker id="orthoArrowX" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" fill="#4a4030" />
          </marker>
          <marker id="orthoArrowY" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d={`M0,0 L8,4 L0,8 Z`} fill={lineCol} />
          </marker>
        </defs>

        {/* angle arc */}
        <path d={`M ${originX + arcR} ${originY} A ${arcR} ${arcR} 0 0 0 ${arcEnd[0]} ${arcEnd[1]}`} fill="none" stroke="#c8860a" strokeWidth="1.6" />
        <text x={arcLabelPos[0]} y={arcLabelPos[1]} textAnchor="middle" fontSize="13" fontFamily="var(--fh)" fill="#c8860a">{`θ = ${angleDeg}°`}</text>

        {/* right-angle marker, only when exactly orthogonal (x is horizontal, y vertical) */}
        {isOrthogonal && (
          <path d={`M ${originX + 16} ${originY} L ${originX + 16} ${originY - 16} L ${originX} ${originY - 16}`} fill="none" stroke="#2a9d8f" strokeWidth="2" />
        )}

        {/* x vector */}
        <line x1={originX} y1={originY} x2={xEnd[0]} y2={xEnd[1]} stroke="#4a4030" strokeWidth="2.4" markerEnd="url(#orthoArrowX)" />
        <text x={xEnd[0] + 10} y={xEnd[1] + 4} fontSize="15" fontFamily="var(--fh)" fill="#241e14">{`x  (‖x‖=${magX})`}</text>

        {/* y vector */}
        <line x1={originX} y1={originY} x2={yEnd[0]} y2={yEnd[1]} stroke={lineCol} strokeWidth="2.4" markerEnd="url(#orthoArrowY)" />
        <text x={yEnd[0] + (yEnd[0] >= originX ? 10 : -10)} y={yEnd[1] - 6} fontSize="15" fontFamily="var(--fh)" fill={lineCol} textAnchor={yEnd[0] >= originX ? 'start' : 'end'}>{`y  (‖y‖=${magY})`}</text>

        <circle cx={originX} cy={originY} r="3" fill="#241e14" />
        <text x={originX - 16} y={originY + 16} fontSize="12" fontFamily="var(--fm)" fill="#7a6e5e">O</text>

        {/* live formula panel */}
        <text x="400" y="40" fontSize="14" fontFamily="var(--fm)" fill="#4a4030">{`x · y = ‖x‖ ‖y‖ cos θ`}</text>
        <text x="400" y="64" fontSize="14" fontFamily="var(--fm)" fill={lineCol} fontWeight={isOrthogonal ? '700' : '400'}>{`      = ${magX} × ${magY} × cos(${angleDeg}°) = ${dot.toFixed(2)}`}</text>
      </svg>

      <div style={{ display:'flex', flexDirection:'column', gap:'10px', maxWidth:'560px', margin:'14px auto 0' }}>
        <input
          type="range" min="0" max="180" step="1" value={angleDeg}
          onChange={e => setAngleDeg(Number(e.target.value))}
          style={{ width:'100%', accentColor:'#c8860a' }}
        />
        <div style={{ display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:'8px' }}>
          <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
            {[30,60,90,120,150].map(a => (
              <button key={a} onClick={() => setAngleDeg(a)} style={{
                fontFamily:'var(--fm)', fontSize:'.68rem', padding:'5px 11px', borderRadius:'20px', cursor:'pointer',
                border:'1px solid '+(angleDeg===a?'#2a9d8f':'var(--lec-border)'),
                background: angleDeg===a?'rgba(56,201,176,.16)':'transparent', color: angleDeg===a?'#2a9d8f':'#7a6e5e', fontWeight:600,
              }}>{a}°</button>
            ))}
          </div>
          <button onClick={() => setUnit(u => !u)} style={{
            fontFamily:'var(--fm)', fontSize:'.68rem', padding:'5px 11px', borderRadius:'20px', cursor:'pointer',
            border:'1px solid '+(unit?'#9b80e8':'var(--lec-border)'),
            background: unit?'rgba(155,128,232,.14)':'transparent', color: unit?'#9b80e8':'#7a6e5e', fontWeight:600,
          }}>{unit ? '✓ normalized to unit length' : 'normalize to unit length'}</button>
        </div>
      </div>

      <p style={{ textAlign:'center', fontSize:'.85rem', fontStyle:'italic', color:'var(--lec-ink3)', margin:'14px 0 0' }}>
        {String.raw`Drag the slider or tap a preset angle. The dot product is positive for acute angles, negative for obtuse ones, and lands on exactly $0$ only at $\theta=90°$ — that instant is orthogonality. Toggle "normalize" to see the same picture with `}<i>unit-length</i>{String.raw` vectors — an `}<i>orthonormal</i>{String.raw` pair, once $\theta=90°$.`}
      </p>
    </div>
  );
}

/* ═══════════════ PAGE ═══════════════ */
export default function Lec18() {
  const [menuOpen, setMenuOpen] = useState(false);
  const weeks = lecturesByWeek();

  useEffect(() => {
    window.MathJax = {
      tex: { inlineMath:[['$','$'],['\\(','\\)']], displayMath:[['$$','$$'],['\\[','\\]']] },
      options: { skipHtmlTags:['script','noscript','style','textarea','pre'] },
    };
    let n=0;
    const ti = setInterval(()=>{ n++; if(window.MathJax?.typesetPromise) window.MathJax.typesetPromise(); if(n>12) clearInterval(ti); },350);
    return ()=>clearInterval(ti);
  },[]);

  function jump(e, id) {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({behavior:'smooth',block:'start'});
  }

  return (
    <>
      <Script src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js" strategy="afterInteractive"/>

      <style>{`
        :root { --lec-paper:#faf7f2; --lec-ink:#241e14; --lec-ink2:#4a4030; --lec-ink3:#7a6e5e; --lec-border:#e2d8c8; --lec-accent:#c8860a; }
        .lec-content { color:var(--lec-ink); }
        .lec-content p { color:var(--lec-ink2); line-height:1.85; margin:14px 0; font-size:1.02rem; }
        .lec-content mjx-container { color:var(--lec-ink) !important; }
        .lec-content b, .lec-content strong { color:var(--lec-ink); }
        .lc-shell { display:flex; padding-top:calc(var(--nav-h) + 3px + 37px); min-height:100vh; }
        .lc-sidebar { width:256px; flex-shrink:0; position:sticky; top:calc(var(--nav-h)+3px+37px); height:calc(100vh - var(--nav-h) - 40px); overflow-y:auto; background:var(--bg2); border-right:1px solid var(--border); z-index:510; }
        .lc-backdrop { display:none; }
        .lc-menu-btn { display:none; }
        .lc-main { flex:1; min-width:0; background:var(--lec-paper); }
        .lc-body { max-width:880px; margin:0 auto; padding:36px 48px 96px; }
        @media(max-width:960px){ .lc-body{ padding:28px 28px 80px; } }
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

      <Navbar activePage="courses"/>

      {/* BREADCRUMB */}
      <div style={{ position:'sticky', top:'calc(var(--nav-h) + 3px)', zIndex:500, background:'var(--bg2)', borderBottom:'1px solid var(--border)', padding:'0 24px', display:'flex', alignItems:'center', gap:'8px', fontFamily:'var(--fm)', fontSize:'.72rem', color:'var(--text3)', height:'37px', overflowX:'auto', whiteSpace:'nowrap' }}>
        <Link href="/" style={{color:'var(--amber)'}}>Home</Link><span>›</span>
        <Link href="/courses" style={{color:'var(--amber)'}}>Courses</Link><span>›</span>
        <Link href="/courses/linalg" style={{color:'var(--amber)'}}>Linear Algebra</Link><span>›</span>
        <span style={{color:'var(--text2)'}}>Week 5 · Lecture 18</span>
      </div>

      <button className="lc-menu-btn" onClick={()=>setMenuOpen(o=>!o)}>☰ Lectures</button>
      <div className={`lc-backdrop ${menuOpen?'open':''}`} onClick={()=>setMenuOpen(false)}/>

      <div className="lc-shell">
        {/* SIDEBAR */}
        <aside className={`lc-sidebar ${menuOpen?'open':''}`}>
          <div style={{ padding:'18px 16px 12px', borderBottom:'1px solid var(--border)' }}>
            <div style={{ fontFamily:'var(--fm)', fontSize:'.6rem', letterSpacing:'.2em', textTransform:'uppercase', color:'var(--amber)', marginBottom:'4px' }}>MATH-120 · Linear Algebra</div>
            <div style={{ fontFamily:'var(--fh)', fontSize:'.95rem', color:'var(--text)', lineHeight:1.3 }}>Lectures</div>
            <Link href="/courses/linalg" style={{ display:'inline-flex', alignItems:'center', gap:'5px', fontFamily:'var(--fm)', fontSize:'.68rem', color:'var(--text3)', marginTop:'8px', textDecoration:'none' }}>← Course Home</Link>
          </div>
          <nav style={{ padding:'8px 0 24px' }}>
            {weeks.map(({week,lectures})=>(
              <div key={week}>
                <span style={{ fontFamily:'var(--fm)', fontSize:'.58rem', letterSpacing:'.22em', textTransform:'uppercase', color:'var(--text3)', padding:'12px 16px 4px', display:'block' }}>Week {week}</span>
                {lectures.map(lec=>{
                  const isCurrent = lec.slug===THIS_SLUG;
                  const label = lec.title||`Lecture ${lec.n}`;
                  const body = (
                    <div style={{ padding:'8px 16px', borderLeft:isCurrent?'3px solid var(--amber)':'3px solid transparent', background:isCurrent?'var(--amber-lt)':'transparent' }}>
                      <div style={{ fontFamily:'var(--fm)', fontSize:'.72rem', lineHeight:1.4, color:isCurrent?'var(--amber)':(lec.live?'var(--text2)':'var(--text3)'), opacity:(lec.live||isCurrent)?1:.5 }}>
                        <span style={{ color:isCurrent?'var(--amber)':'var(--text3)' }}>Lec {lec.n}</span> · {label}{!lec.live&&<span style={{fontStyle:'italic'}}> · soon</span>}
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

        <main className="lc-main">
          {/* STICKY ANCHOR BAR */}
          <div style={{ position:'sticky', top:'calc(var(--nav-h) + 3px + 37px)', zIndex:480, background:'var(--lec-paper)', borderBottom:'1px solid var(--lec-border)', height:'48px', display:'flex', alignItems:'center' }}>
            <Link href={PREV_HREF} style={{ display:'flex', alignItems:'center', padding:'0 16px', height:'100%', fontFamily:'var(--fm)', fontSize:'.72rem', color:'var(--lec-ink3)', borderRight:'1px solid var(--lec-border)', whiteSpace:'nowrap', flexShrink:0, textDecoration:'none' }}>← Lecture 17</Link>
            <div style={{ flex:1, display:'flex', justifyContent:'center', alignItems:'center', gap:'4px', overflowX:'auto', padding:'0 8px' }}>
              <span style={{ fontFamily:'var(--fm)', fontSize:'.6rem', letterSpacing:'.12em', textTransform:'uppercase', color:'var(--lec-accent)', flexShrink:0, marginRight:'6px' }}>On this page</span>
              {ANCHORS.map(([label,id],i)=>(
                <span key={id} style={{display:'inline-flex',alignItems:'center',flexShrink:0}}>
                  {i>0&&<span style={{color:'var(--lec-border)',margin:'0 7px'}}>·</span>}
                  <a href={`#${id}`} onClick={e=>jump(e,id)} style={{fontFamily:'var(--fm)',fontSize:'.73rem',color:'var(--lec-ink2)',textDecoration:'none',whiteSpace:'nowrap'}}>{label}</a>
                </span>
              ))}
            </div>
            <Link href={NEXT_HREF} style={{ display:'flex', alignItems:'center', padding:'0 16px', height:'100%', fontFamily:'var(--fm)', fontSize:'.72rem', color:'var(--lec-ink3)', borderLeft:'1px solid var(--lec-border)', whiteSpace:'nowrap', flexShrink:0, textDecoration:'none' }}>Course Home →</Link>
          </div>

          {/* CONTENT */}
          <div className="lec-content lc-body">

            {/* HEADER */}
            <div style={{ borderBottom:'2px solid var(--lec-border)', paddingBottom:'24px', marginBottom:'8px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'8px', marginBottom:'10px' }}>
                <span style={{ fontFamily:'var(--fm)', fontSize:'.7rem', letterSpacing:'.16em', textTransform:'uppercase', color:'var(--lec-accent)' }}>{LEC.course} · {LEC.number}</span>
                <span style={{ fontFamily:'var(--fm)', fontSize:'.7rem', color:'var(--lec-ink3)', background:'rgba(0,0,0,.04)', padding:'4px 12px', borderRadius:'20px' }}>{LEC.date}</span>
              </div>
              <h1 style={{ fontFamily:'var(--fh)', fontSize:'clamp(2rem,5vw,3rem)', color:'var(--lec-ink)', margin:'0 0 8px', lineHeight:1.05, fontWeight:400 }}>{LEC.title}</h1>
              <p style={{ fontStyle:'italic', color:'var(--lec-ink3)', margin:0, fontSize:'1.05rem' }}>{LEC.subtitle}</p>
            </div>

            {/* ─── §1 MOTIVATION ─── */}
            <Sec id="motivation" n="§1">Motivation — Why Geometry, Why Now?</Sec>

            <p>{String.raw`Every lecture since Week 4 has been purely algebraic: a vector was just an object you could add and scale, obeying eight axioms. That abstraction was powerful — it let matrices and polynomials become "vectors" too — but it threw away something $\mathbb{R}^n$ has that a general vector space doesn't: `}<b>geometry</b>{String.raw`. In $\mathbb{R}^2$ and $\mathbb{R}^3$, vectors have `}<i>length</i>{String.raw`, and pairs of vectors have an `}<i>angle</i>{String.raw` between them. Today we bring that geometry back, formalize it for any $\mathbb{R}^n$, and then use it to build the single most useful construction in applied linear algebra: a way to manufacture a `}<b>perpendicular</b>{String.raw` basis out of any basis at all.`}</p>

            <Callout icon="🌍" title="A real fact worth sitting with" color="teal">
              {String.raw`Google's original PageRank algorithm, GPS positioning, JPEG image compression, noise-cancelling headphones, and every least-squares regression line you've ever fit to data all lean on the same two ideas from this lecture: the `}<b>dot product</b>{String.raw` (which measures how much two directions "agree") and `}<b>orthogonal projection</b>{String.raw` (which finds the closest point in a subspace to a given point). GPS, for instance, has to solve an over-determined system — more satellite-distance equations than unknowns — and it does so by projecting onto a subspace exactly the way we will today.`}
            </Callout>

            <p>{String.raw`The plan: first, revisit the dot product, length, and distance from Nicholson §5.3 — tools you have used informally since high school, now placed on rigorous footing in $\mathbb{R}^n$. Then, in §8.1, we ask a sharper question: given `}<i>any</i>{String.raw` basis of a subspace, can we always replace it with an equally good basis whose vectors are mutually perpendicular? The answer is yes, and the algorithm that does it — the `}<b>Gram–Schmidt process</b>{String.raw` — is today's main event.`}</p>

            {/* ─── §2 DOT PRODUCT ─── */}
            <Sec id="dot-product" n="§2">The Dot Product</Sec>

            <DefBox term="Definition — dot product" color="teal">
              <p style={{margin:0}}>{String.raw`If $\mathbf{x}=(x_1,x_2,\ldots,x_n)$ and $\mathbf{y}=(y_1,y_2,\ldots,y_n)$ are vectors in $\mathbb{R}^n$, their `}<b>dot product</b>{String.raw` is the number`}</p>
              <p style={{textAlign:'center', margin:'10px 0 0'}}>{String.raw`$$\mathbf{x}\cdot\mathbf{y} = x_1y_1 + x_2y_2 + \cdots + x_ny_n.$$`}</p>
            </DefBox>

            <p>{String.raw`Notice immediately that $\mathbf{x}\cdot\mathbf{y}$ is a single `}<b>number</b>{String.raw` (a scalar), not a vector — this is the first genuinely new kind of operation we've met: it takes two vectors in and produces a number out.`}</p>

            <Example n="1" title="Computing a dot product">
              <p style={{margin:0}}>{String.raw`If $\mathbf{x}=(1,-2,3,0)$ and $\mathbf{y}=(4,1,-1,5)$, then`}</p>
              <p style={{textAlign:'center', margin:'8px 0 0'}}>{String.raw`$$\mathbf{x}\cdot\mathbf{y} = (1)(4)+(-2)(1)+(3)(-1)+(0)(5) = 4-2-3+0 = -1.$$`}</p>
            </Example>

            {/* ─── §3 AS A MATRIX PRODUCT ─── */}
            <Sec id="matrix-product" n="§3">An Observation: Dot Product as Matrix Product</Sec>

            <Callout icon="🔍" title="Observation" color="amber">
              {String.raw`If $\mathbf{x}$ and $\mathbf{y}$ are written as `}<b>columns</b>{String.raw`, then $\mathbf{x}\cdot\mathbf{y} = \mathbf{x}^T\mathbf{y}$ is a matrix product (and $\mathbf{x}\cdot\mathbf{y} = \mathbf{x}\mathbf{y}^T$ if they are written as `}<b>rows</b>{String.raw`). Here $\mathbf{x}\cdot\mathbf{y}$ is a $1\times1$ matrix, which we take to be a number.`}
            </Callout>

            <p>{String.raw`This is not a new definition — it is the same number, seen through the matrix-multiplication rule from Week 2. Recall that multiplying a $1\times n$ row by an $n\times1$ column produces a $1\times1$ matrix, whose single entry is exactly "multiply matching entries and add them up." That is precisely the dot product formula.`}</p>

            <Example n="2" title="The same number, two ways">
              <p style={{margin:'0 0 8px'}}>{String.raw`With $\mathbf{x}=\begin{bmatrix}1\\-2\\3\end{bmatrix}$ and $\mathbf{y}=\begin{bmatrix}2\\0\\1\end{bmatrix}$ as columns,`}</p>
              <p style={{textAlign:'center', margin:'0 0 8px'}}>{String.raw`$$\mathbf{x}^T\mathbf{y} = \begin{bmatrix}1&-2&3\end{bmatrix}\begin{bmatrix}2\\0\\1\end{bmatrix} = (1)(2)+(-2)(0)+(3)(1) = 5,$$`}</p>
              <p style={{margin:0}}>{String.raw`which matches $\mathbf{x}\cdot\mathbf{y} = (1)(2)+(-2)(0)+(3)(1)=5$ computed directly. Same number — the matrix-product viewpoint is just useful bookkeeping, and it is why some textbooks write $\mathbf{x}^T\mathbf{y}$ instead of $\mathbf{x}\cdot\mathbf{y}$.`}</p>
            </Example>

            {/* ─── §4 LENGTH ─── */}
            <Sec id="length" n="§4">The Length of a Vector</Sec>

            <p>{String.raw`In $\mathbb{R}^2$, the Pythagorean theorem gives the length of $(x_1,x_2)$ as $\sqrt{x_1^2+x_2^2}$. The dot product lets us extend this to any $\mathbb{R}^n$ at once, since $\mathbf{x}\cdot\mathbf{x} = x_1^2+x_2^2+\cdots+x_n^2$ is exactly the sum of squares under that root.`}</p>

            <DefBox term="Definition 5.6 — length (norm)" color="violet">
              <p style={{margin:0}}>{String.raw`As in $\mathbb{R}^3$, the `}<b>length</b>{String.raw` $\|\mathbf{x}\|$ of the vector $\mathbf{x}$ is defined by`}</p>
              <p style={{textAlign:'center', margin:'10px 0'}}>{String.raw`$$\|\mathbf{x}\| = \sqrt{\mathbf{x}\cdot\mathbf{x}} = \sqrt{x_1^2+x_2^2+\cdots+x_n^2},$$`}</p>
              <p style={{margin:0}}>{String.raw`where $\sqrt{\phantom{x}}$ indicates the positive square root. A vector $\mathbf{x}$ of length $1$ is called a `}<b>unit vector</b>{String.raw`.`}</p>
            </DefBox>

            <Example n="3" title="Computing a length">
              <p style={{margin:0}}>{String.raw`For $\mathbf{x}=(1,2,-2,4)$ in $\mathbb{R}^4$: $\;\|\mathbf{x}\| = \sqrt{1^2+2^2+(-2)^2+4^2} = \sqrt{1+4+4+16} = \sqrt{25} = 5$.`}</p>
            </Example>

            <Example n="4" title="Building a unit vector">
              <p style={{margin:'0 0 8px'}}>{String.raw`Turn $\mathbf{x}=(3,0,4)$ into a unit vector pointing in the same direction. First find its length: $\|\mathbf{x}\|=\sqrt{9+0+16}=\sqrt{25}=5$.`}</p>
              <p style={{margin:0}}>{String.raw`Then scale $\mathbf{x}$ by $\frac{1}{\|\mathbf{x}\|}$: $\;\hat{\mathbf{x}} = \frac{1}{5}(3,0,4) = \left(\frac{3}{5},0,\frac{4}{5}\right)$. Check: $\left(\frac{3}{5}\right)^2+0^2+\left(\frac{4}{5}\right)^2 = \frac{9}{25}+\frac{16}{25}=\frac{25}{25}=1$ ✓. This "divide by the length" move — called `}<b>normalizing</b>{String.raw` — is one of the most-used moves in this entire lecture.`}</p>
            </Example>

            {/* ─── §5 THEOREM 5.3.1 ─── */}
            <Sec id="thm531" n="§5">Theorem 5.3.1 — The Algebra of Dot Products</Sec>

            <ThmBox title="Theorem 5.3.1">
              <p style={{margin:'0 0 10px'}}>{String.raw`Let $\mathbf{x}$, $\mathbf{y}$, and $\mathbf{z}$ denote vectors in $\mathbb{R}^n$. Then:`}</p>
              <BulletList dense items={[
                <span key="p1"><b>1.</b>{String.raw` $\mathbf{x}\cdot\mathbf{y} = \mathbf{y}\cdot\mathbf{x}$.`}</span>,
                <span key="p2"><b>2.</b>{String.raw` $\mathbf{x}\cdot(\mathbf{y}+\mathbf{z}) = \mathbf{x}\cdot\mathbf{y}+\mathbf{x}\cdot\mathbf{z}$.`}</span>,
                <span key="p3"><b>3.</b>{String.raw` $(a\mathbf{x})\cdot\mathbf{y} = a(\mathbf{x}\cdot\mathbf{y}) = \mathbf{x}\cdot(a\mathbf{y})$ for all scalars $a$.`}</span>,
                <span key="p4"><b>4.</b>{String.raw` $\|\mathbf{x}\|^2 = \mathbf{x}\cdot\mathbf{x}$.`}</span>,
                <span key="p5"><b>5.</b>{String.raw` $\|\mathbf{x}\|\geq0$, and $\|\mathbf{x}\|=0$ if and only if $\mathbf{x}=\mathbf{0}$.`}</span>,
                <span key="p6"><b>6.</b>{String.raw` $\|a\mathbf{x}\| = |a|\,\|\mathbf{x}\|$ for all scalars $a$.`}</span>,
              ]}/>
            </ThmBox>

            <Callout icon="💡" title="What this theorem is really saying" color="teal">
              {String.raw`Think of these six rules as the "grammar" that makes the dot product and length behave the way your intuition already expects. `}<b>Rules 1–3</b>{String.raw` say the dot product acts like ordinary multiplication: order doesn't matter, it distributes over addition, and scalars can be pulled out. `}<b>Rule 4</b>{String.raw` is really just restating Definition 5.6 — length is, by construction, the square root of a dot product. `}<b>Rule 5</b>{String.raw` says length is a genuine measure of size: never negative, and zero only for the zero vector — nothing else can have "no size." `}<b>Rule 6</b>{String.raw` says stretching a vector by a factor $a$ stretches its length by $|a|$ (the absolute value matters: flipping a vector's direction with $a=-1$ doesn't change how long it is).`}
            </Callout>

            {/* ─── §6 EXAMPLE 5.3.2 ─── */}
            <Sec id="ex532" n="§6">Expanding ‖x + y‖²</Sec>

            <Example n="5" title="Example 5.3.2 — the algebraic expansion" advanced>
              <p>{String.raw`Show that $\|\mathbf{x}+\mathbf{y}\|^2 = \|\mathbf{x}\|^2 + 2(\mathbf{x}\cdot\mathbf{y}) + \|\mathbf{y}\|^2$ for any $\mathbf{x}$ and $\mathbf{y}$ in $\mathbb{R}^n$.`}</p>
              <Reveal label="Show full solution">
                <p style={{margin:'0 0 8px'}}>{String.raw`By Theorem 5.3.1, rule 4, $\|\mathbf{x}+\mathbf{y}\|^2 = (\mathbf{x}+\mathbf{y})\cdot(\mathbf{x}+\mathbf{y})$. Expand using rule 2 (distributivity), applied twice:`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$(\mathbf{x}+\mathbf{y})\cdot(\mathbf{x}+\mathbf{y}) = \mathbf{x}\cdot(\mathbf{x}+\mathbf{y}) + \mathbf{y}\cdot(\mathbf{x}+\mathbf{y}) = \mathbf{x}\cdot\mathbf{x} + \mathbf{x}\cdot\mathbf{y} + \mathbf{y}\cdot\mathbf{x} + \mathbf{y}\cdot\mathbf{y}.$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`By rule 1 (symmetry), $\mathbf{y}\cdot\mathbf{x} = \mathbf{x}\cdot\mathbf{y}$, so the two middle terms combine:`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$\mathbf{x}\cdot\mathbf{x} + 2(\mathbf{x}\cdot\mathbf{y}) + \mathbf{y}\cdot\mathbf{y}.$$`}</p>
                <p style={{margin:0}}>{String.raw`Finally, $\mathbf{x}\cdot\mathbf{x}=\|\mathbf{x}\|^2$ and $\mathbf{y}\cdot\mathbf{y}=\|\mathbf{y}\|^2$ (rule 4 again), giving`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$\|\mathbf{x}+\mathbf{y}\|^2 = \|\mathbf{x}\|^2 + 2(\mathbf{x}\cdot\mathbf{y}) + \|\mathbf{y}\|^2. \qquad \blacksquare$$`}</p>
                <p style={{margin:'10px 0 0', fontStyle:'italic'}}>{String.raw`This is exactly the vector version of $(a+b)^2=a^2+2ab+b^2$ — and it is the identity that will let us prove the Orthogonal Lemma's key fact later in this lecture, since when $\mathbf{x}\cdot\mathbf{y}=0$ the middle term vanishes and this becomes a Pythagorean theorem for vectors.`}</p>
              </Reveal>
            </Example>

            {/* ─── §7 EXAMPLE 5.3.3 ─── */}
            <Sec id="ex533" n="§7">Orthogonal to a Spanning Set Forces x = 0</Sec>

            <Example n="6" title="Example 5.3.3 — a vector that dots to zero with a full spanning set" advanced>
              <p>{String.raw`Suppose that $\mathbb{R}^n = \operatorname{span}\{\mathbf{f}_1,\mathbf{f}_2,\ldots,\mathbf{f}_k\}$ for some vectors $\mathbf{f}_i$. If $\mathbf{x}\cdot\mathbf{f}_i=0$ for each $i$, where $\mathbf{x}$ is in $\mathbb{R}^n$, show that $\mathbf{x}=\mathbf{0}$.`}</p>
              <Reveal label="Show full solution">
                <p style={{margin:'0 0 8px'}}>{String.raw`Since $\mathbb{R}^n = \operatorname{span}\{\mathbf{f}_1,\ldots,\mathbf{f}_k\}$ and $\mathbf{x}\in\mathbb{R}^n$, we may write $\mathbf{x}$ itself as a combination of the $\mathbf{f}_i$'s:`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$\mathbf{x} = c_1\mathbf{f}_1 + c_2\mathbf{f}_2 + \cdots + c_k\mathbf{f}_k$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`for some scalars $c_1,\ldots,c_k$. Now dot both sides with $\mathbf{x}$ itself, using distributivity (Theorem 5.3.1, rules 2–3):`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$\mathbf{x}\cdot\mathbf{x} = c_1(\mathbf{x}\cdot\mathbf{f}_1) + c_2(\mathbf{x}\cdot\mathbf{f}_2) + \cdots + c_k(\mathbf{x}\cdot\mathbf{f}_k).$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`By hypothesis, every $\mathbf{x}\cdot\mathbf{f}_i=0$, so the entire right-hand side is $0$. Hence $\mathbf{x}\cdot\mathbf{x}=0$, i.e. $\|\mathbf{x}\|^2=0$, and by Theorem 5.3.1 rule 5, $\|\mathbf{x}\|=0$ forces $\mathbf{x}=\mathbf{0}$.`}</p>
                <p style={{margin:0}}>{String.raw`$\blacksquare$ This is a preview of a very important idea: if you dot a vector against `}<i>every</i>{String.raw` member of a spanning set and always get $0$, the vector had no room left to be anything but $\mathbf{0}$. We'll lean on exactly this fact when discussing orthogonal complements.`}</p>
              </Reveal>
            </Example>

            {/* ─── §8 DISTANCE ─── */}
            <Sec id="distance" n="§8">Measuring the Gap Between Two Vectors</Sec>

            <p>{String.raw`Length tells us the size of a single vector. A closely related question: how "far apart" are two vectors $\mathbf{x}$ and $\mathbf{y}$? The natural answer, exactly as in $\mathbb{R}^2$ and $\mathbb{R}^3$, is to measure the length of the vector connecting them.`}</p>

            <DefBox term="Definition 5.7 — distance" color="rose">
              <p style={{margin:0}}>{String.raw`If $\mathbf{x}$ and $\mathbf{y}$ are two vectors in $\mathbb{R}^n$, we define the `}<b>distance</b>{String.raw` $d(\mathbf{x},\mathbf{y})$ between $\mathbf{x}$ and $\mathbf{y}$ by`}</p>
              <p style={{textAlign:'center', margin:'10px 0 0'}}>{String.raw`$$d(\mathbf{x},\mathbf{y}) = \|\mathbf{x}-\mathbf{y}\|.$$`}</p>
            </DefBox>

            <Callout icon="📐" title="The motivation, again from R³" color="amber">
              {String.raw`Picture $\mathbf{x}$ and $\mathbf{y}$ as two arrows from a common origin $O$, with tips $X$ and $Y$. The vector $\mathbf{x}-\mathbf{y}$ is exactly the arrow that connects tip $Y$ to tip $X$ — so its length $\|\mathbf{x}-\mathbf{y}\|$ is precisely the straight-line distance between the two tips, matching what "distance" already means in $\mathbb{R}^3$. The formula $d(\mathbf{x},\mathbf{y})=\|\mathbf{x}-\mathbf{y}\|$ is doing nothing more than converting "distance between two points" into "length of the vector between them" — a move we can now make sense of in `}<i>any</i>{String.raw` $\mathbb{R}^n$, however large.`}
            </Callout>

            <DistanceFigure/>

            <Example n="7" title="Computing a distance">
              <p style={{margin:0}}>{String.raw`For $\mathbf{x}=(1,3,-2)$ and $\mathbf{y}=(4,-1,0)$: $\;\mathbf{x}-\mathbf{y}=(-3,4,-2)$, so $d(\mathbf{x},\mathbf{y}) = \sqrt{(-3)^2+4^2+(-2)^2} = \sqrt{9+16+4}=\sqrt{29}$.`}</p>
            </Example>

            {/* ─── §9 THEOREM 5.3.3 ─── */}
            <Sec id="thm533" n="§9">Theorem 5.3.3 — Properties of Distance</Sec>

            <ThmBox title="Theorem 5.3.3">
              <p style={{margin:'0 0 10px'}}>{String.raw`If $\mathbf{x}$, $\mathbf{y}$, and $\mathbf{z}$ are three vectors in $\mathbb{R}^n$ we have:`}</p>
              <BulletList dense items={[
                <span key="d1"><b>1.</b>{String.raw` $d(\mathbf{x},\mathbf{y}) \geq 0$ for all $\mathbf{x}$ and $\mathbf{y}$.`}</span>,
                <span key="d2"><b>2.</b>{String.raw` $d(\mathbf{x},\mathbf{y}) = 0$ if and only if $\mathbf{x}=\mathbf{y}$.`}</span>,
                <span key="d3"><b>3.</b>{String.raw` $d(\mathbf{x},\mathbf{y}) = d(\mathbf{y},\mathbf{x})$.`}</span>,
                <span key="d4"><b>4.</b>{String.raw` $d(\mathbf{x},\mathbf{z}) \leq d(\mathbf{x},\mathbf{y}) + d(\mathbf{y},\mathbf{z})$. `}<i>(Triangle inequality.)</i></span>,
              ]}/>
            </ThmBox>

            <Callout icon="💡" title="Why each of these is true — no proofs, just the idea" color="teal">
              <p style={{margin:'0 0 10px'}}><b>Property 1.</b>{String.raw` Distance is a length ($d(\mathbf{x},\mathbf{y})=\|\mathbf{x}-\mathbf{y}\|$), and Theorem 5.3.1 rule 5 already told us every length is $\geq0$. Nothing new — distance simply inherits non-negativity from length.`}</p>
              <p style={{margin:'0 0 10px'}}><b>Property 2.</b>{String.raw` Also inherited from rule 5: $\|\mathbf{x}-\mathbf{y}\|=0$ exactly when $\mathbf{x}-\mathbf{y}=\mathbf{0}$, i.e. exactly when $\mathbf{x}=\mathbf{y}$. Geometrically: the only way two points have zero distance between them is if they're the same point.`}</p>
              <p style={{margin:'0 0 10px'}}><b>Property 3.</b>{String.raw` Distance shouldn't care which point you call "first." Algebraically, $\mathbf{x}-\mathbf{y}$ and $\mathbf{y}-\mathbf{x}$ are negatives of each other, and Theorem 5.3.1 rule 6 (with $a=-1$) says negating a vector doesn't change its length: $\|\mathbf{x}-\mathbf{y}\|=\|-(\mathbf{y}-\mathbf{x})\|=\|\mathbf{y}-\mathbf{x}\|$.`}</p>
              <p style={{margin:0}}><b>Property 4 — the triangle inequality.</b>{String.raw` This is the algebraic version of "the direct route is never longer than a detour." Picture three points $\mathbf{x}$, $\mathbf{y}$, $\mathbf{z}$: walking straight from $\mathbf{x}$ to $\mathbf{z}$ covers distance $d(\mathbf{x},\mathbf{z})$, while walking from $\mathbf{x}$ to $\mathbf{y}$ and then $\mathbf{y}$ to $\mathbf{z}$ covers $d(\mathbf{x},\mathbf{y})+d(\mathbf{y},\mathbf{z})$. Common sense says the detour can only be as short as the direct path, never shorter — and this holds true in `}<i>every</i>{String.raw` $\mathbb{R}^n$, not just the $\mathbb{R}^2$ and $\mathbb{R}^3$ where you can literally draw the triangle.`}</p>
            </Callout>

            {/* ─── §10 ORTHOGONALITY ─── */}
            <Sec id="orthogonality" n="§10">Orthogonality</Sec>

            <p>{String.raw`We now name the single most useful relationship two vectors can have with each other.`}</p>

            <DefBox term="Orthogonal, orthogonal set, orthonormal set" color="violet">
              <BulletList dense items={[
                <span key="o1">{String.raw`Two vectors $\mathbf{x}$ and $\mathbf{y}$ in $\mathbb{R}^n$ are `}<b>orthogonal</b>{String.raw` if $\mathbf{x}\cdot\mathbf{y}=0$.`}</span>,
                <span key="o2">{String.raw`A set of vectors $\{\mathbf{f}_1,\ldots,\mathbf{f}_m\}$ (all nonzero) is an `}<b>orthogonal set</b>{String.raw` if every pair is orthogonal: $\mathbf{f}_i\cdot\mathbf{f}_j=0$ whenever $i\neq j$.`}</span>,
                <span key="o3">{String.raw`An `}<b>orthonormal set</b>{String.raw` is an orthogonal set in which every vector is `}<i>also</i>{String.raw` a unit vector: $\|\mathbf{f}_i\|=1$ for every $i$, in addition to $\mathbf{f}_i\cdot\mathbf{f}_j=0$ for $i\neq j$.`}</span>,
              ]}/>
            </DefBox>

            <Callout icon="📐" title="The geometric picture" color="amber">
              {String.raw`In $\mathbb{R}^2$ and $\mathbb{R}^3$, the dot product relates to the angle $\theta$ between two vectors by $\mathbf{x}\cdot\mathbf{y} = \|\mathbf{x}\|\|\mathbf{y}\|\cos\theta$. Orthogonal means $\mathbf{x}\cdot\mathbf{y}=0$, which forces $\cos\theta=0$ — that is, $\theta=90°$. `}<b>Orthogonal is simply the algebraic word for perpendicular</b>{String.raw`, now generalized to any $\mathbb{R}^n$, where you can no longer draw the angle but can always compute it.`}
            </Callout>

            <OrthogonalityLab/>

            <Example n="8" title="A quick geometric check in R²">
              <p style={{margin:0}}>{String.raw`$\mathbf{x}=(1,1)$ and $\mathbf{y}=(1,-1)$ satisfy $\mathbf{x}\cdot\mathbf{y}=(1)(1)+(1)(-1)=0$, so they are orthogonal — and indeed, plotting them, $\mathbf{x}$ points along the line $y=x$ and $\mathbf{y}$ along $y=-x$, which meet at a right angle. Note also $\|\mathbf{x}\|=\|\mathbf{y}\|=\sqrt{2}$, so $\{\mathbf{x},\mathbf{y}\}$ is orthogonal but `}<i>not yet</i>{String.raw` orthonormal — dividing each by $\sqrt{2}$ would fix that.`}</p>
            </Example>

            {/* ─── §11 WHY ORTHONORMAL ─── */}
            <Sec id="why-orthonormal" n="§11">Motivation — Why Do We Want Orthonormal Sets?</Sec>

            <Callout icon="🎯" title="The payoff" color="rose">
              {String.raw`Recall the Expansion Theorem from an earlier lecture: if $\{\mathbf{f}_1,\ldots,\mathbf{f}_m\}$ is an `}<i>orthogonal</i>{String.raw` basis of a subspace $U$, then any $\mathbf{x}$ in $U$ can be written as`}
              <p style={{textAlign:'center', margin:'10px 0'}}>{String.raw`$$\mathbf{x} = \left(\frac{\mathbf{x}\cdot\mathbf{f}_1}{\|\mathbf{f}_1\|^2}\right)\mathbf{f}_1 + \left(\frac{\mathbf{x}\cdot\mathbf{f}_2}{\|\mathbf{f}_2\|^2}\right)\mathbf{f}_2 + \cdots + \left(\frac{\mathbf{x}\cdot\mathbf{f}_m}{\|\mathbf{f}_m\|^2}\right)\mathbf{f}_m.$$`}</p>
              {String.raw`Compare this with a `}<i>general</i>{String.raw` (non-orthogonal) basis, where finding the coordinates of $\mathbf{x}$ requires solving a full linear system by Gaussian elimination. With an orthogonal basis, each coordinate is found by a single dot product — no elimination, no matrix inversion, just arithmetic. This is the entire reason orthogonal and orthonormal bases are worth the extra effort to build: `}<b>they turn "solve a system" into "compute a few dot products."</b>{String.raw` This single fact underlies projections, least-squares fitting, Fourier series, and the QR-decomposition algorithms used inside virtually every numerical linear algebra library.`}
            </Callout>

            {/* ─── §12 EXAMPLE 5.3.4 ─── */}
            <Sec id="ex534" n="§12">The Standard Basis Is Orthonormal</Sec>

            <Example n="9" title="Example 5.3.4 — the standard basis">
              <p style={{margin:0}}>{String.raw`The standard basis $\{\mathbf{e}_1,\mathbf{e}_2,\ldots,\mathbf{e}_n\}$ is an orthonormal set in $\mathbb{R}^n$: for $i\neq j$, $\mathbf{e}_i\cdot\mathbf{e}_j=0$ since the two vectors have their single $1$-entries in different positions (every term in the dot product sum involves at least one zero factor), and $\|\mathbf{e}_i\| = \sqrt{0^2+\cdots+1^2+\cdots+0^2}=\sqrt{1}=1$ for every $i$. This is the simplest possible orthonormal set — and the benchmark every other orthonormal set is compared to.`}</p>
            </Example>

            {/* ─── §13 NORMALIZING ─── */}
            <Sec id="normalizing" n="§13">Normalizing an Orthogonal Set</Sec>

            <DefBox term="Definition 5.9 — normalizing" color="teal">
              <p style={{margin:0}}>{String.raw`If $\{\mathbf{x}_1,\mathbf{x}_2,\ldots,\mathbf{x}_k\}$ is an orthogonal set, then $\left\{\frac{1}{\|\mathbf{x}_1\|}\mathbf{x}_1,\; \frac{1}{\|\mathbf{x}_2\|}\mathbf{x}_2,\; \ldots,\; \frac{1}{\|\mathbf{x}_k\|}\mathbf{x}_k\right\}$ is an orthonormal set, and we say that it is the result of `}<b>normalizing</b>{String.raw` the orthogonal set $\{\mathbf{x}_1,\mathbf{x}_2,\ldots,\mathbf{x}_k\}$.`}</p>
            </DefBox>

            <p>{String.raw`Rescaling each vector to length $1$ cannot disturb orthogonality — by Theorem 5.3.1 rule 3, $(a\mathbf{x}_i)\cdot(b\mathbf{x}_j) = ab(\mathbf{x}_i\cdot\mathbf{x}_j)$, and if $\mathbf{x}_i\cdot\mathbf{x}_j=0$, this stays $0$ no matter what $a,b$ are. So "make orthogonal" and "make unit length" are independent jobs — normalizing only ever handles the second one.`}</p>

            {/* ─── §14 EXAMPLE 5.3.6 ─── */}
            <Sec id="ex536" n="§14">A Worked Orthonormal Set in R⁴</Sec>

            <Example n="10" title="Example 5.3.6 — verifying orthogonality and normalizing" advanced>
              <p>{String.raw`If $\mathbf{f}_1=\begin{bmatrix}1\\1\\1\\-1\end{bmatrix}$, $\mathbf{f}_2=\begin{bmatrix}1\\0\\1\\2\end{bmatrix}$, $\mathbf{f}_3=\begin{bmatrix}-1\\0\\1\\0\end{bmatrix}$, and $\mathbf{f}_4=\begin{bmatrix}-1\\3\\-1\\1\end{bmatrix}$, then $\{\mathbf{f}_1,\mathbf{f}_2,\mathbf{f}_3,\mathbf{f}_4\}$ is an orthogonal set in $\mathbb{R}^4$, as is easily verified. Find the corresponding orthonormal set.`}</p>
              <Reveal label="Show full solution">
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Step 1 — check all six pairs.}$ With $4$ vectors there are $\binom{4}{2}=6$ pairs to check:`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$\begin{aligned} \mathbf{f}_1\cdot\mathbf{f}_2 &= 1{+}0{+}1{-}2=0, & \mathbf{f}_1\cdot\mathbf{f}_3 &= -1{+}0{+}1{+}0=0, & \mathbf{f}_1\cdot\mathbf{f}_4 &= -1{+}3{-}1{-}1=0,\\ \mathbf{f}_2\cdot\mathbf{f}_3 &= -1{+}0{+}1{+}0=0, & \mathbf{f}_2\cdot\mathbf{f}_4 &= -1{+}0{-}1{+}2=0, & \mathbf{f}_3\cdot\mathbf{f}_4 &= 1{+}0{-}1{+}0=0. \end{aligned}$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`All six vanish, confirming $\{\mathbf{f}_1,\mathbf{f}_2,\mathbf{f}_3,\mathbf{f}_4\}$ is an orthogonal set.`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Step 2 — compute each length.}$`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$\|\mathbf{f}_1\|=\sqrt{1{+}1{+}1{+}1}=\sqrt{4}=2, \quad \|\mathbf{f}_2\|=\sqrt{1{+}0{+}1{+}4}=\sqrt{6}, \quad \|\mathbf{f}_3\|=\sqrt{1{+}0{+}1{+}0}=\sqrt{2}, \quad \|\mathbf{f}_4\|=\sqrt{1{+}9{+}1{+}1}=\sqrt{12}=2\sqrt{3}.$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Step 3 — divide each vector by its own length}$ (Definition 5.9):`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$\left\{\, \tfrac{1}{2}\mathbf{f}_1,\;\; \tfrac{1}{\sqrt6}\mathbf{f}_2,\;\; \tfrac{1}{\sqrt2}\mathbf{f}_3,\;\; \tfrac{1}{2\sqrt3}\mathbf{f}_4 \,\right\}$$`}</p>
                <p style={{margin:0}}>{String.raw`is the corresponding orthonormal set. $\blacksquare$ Notice the method never changes: `}<b>check all pairwise dot products are zero, compute each length, then divide.</b></p>
              </Reveal>
            </Example>

            {/* ─── §15 THEOREM 5.3.5 ─── */}
            <Sec id="thm535" n="§15">Theorem 5.3.5 — Orthogonal Sets Are Independent</Sec>

            <ThmBox title="Theorem 5.3.5">
              <p style={{margin:0}}>{String.raw`Every orthogonal set in $\mathbb{R}^n$ is linearly independent.`}</p>
            </ThmBox>

            <Callout icon="💡" title="Why this is true" color="teal">
              {String.raw`Suppose $\{\mathbf{f}_1,\ldots,\mathbf{f}_m\}$ is orthogonal and $c_1\mathbf{f}_1+c_2\mathbf{f}_2+\cdots+c_m\mathbf{f}_m=\mathbf{0}$. Dot `}<i>both sides</i>{String.raw` with a single fixed $\mathbf{f}_k$. On the right, $\mathbf{0}\cdot\mathbf{f}_k=0$. On the left, distribute the dot product across the sum: every term $c_i(\mathbf{f}_i\cdot\mathbf{f}_k)$ with $i\neq k$ vanishes immediately, `}<i>because the set is orthogonal</i>{String.raw` — that's the whole trick. All that survives is the single term $c_k(\mathbf{f}_k\cdot\mathbf{f}_k) = c_k\|\mathbf{f}_k\|^2$. So the equation collapses to $c_k\|\mathbf{f}_k\|^2=0$, and since $\mathbf{f}_k\neq\mathbf{0}$ (orthogonal sets consist of nonzero vectors), $\|\mathbf{f}_k\|^2\neq0$, forcing $c_k=0$. This argument works for `}<i>every</i>{String.raw` $k$ separately, so all coefficients are forced to $0$ — independence, essentially for free, no elimination needed. This is the second half of why orthogonal sets are so valuable: they are automatically independent, so an orthogonal `}<i>spanning</i>{String.raw` set is automatically a basis.`}
            </Callout>

            {/* ─── §16 §8.1 OPENS ─── */}
            <Sec id="sec81" n="§16">§8.1 — Orthogonal Complements and Projections</Sec>

            <p>{String.raw`We now switch chapters, but not topics — everything above was preparation for this. Recall from Lecture 17 the tool that let us `}<i>grow</i>{String.raw` an independent set into a basis:`}</p>

            <Callout icon="🔁" title="Where we're headed" color="violet">
              {String.raw`If $\{\mathbf{v}_1,\ldots,\mathbf{v}_m\}$ is linearly independent in a general vector space, and if $\mathbf{v}_{m+1}$ is not in $\operatorname{span}\{\mathbf{v}_1,\ldots,\mathbf{v}_m\}$, then $\{\mathbf{v}_1,\ldots,\mathbf{v}_m,\mathbf{v}_{m+1}\}$ is independent — that was the `}<b>Independent Lemma</b>{String.raw` (Lemma 6.4.1). Here is the analog for `}<i>orthogonal</i>{String.raw` sets in $\mathbb{R}^n$: not only can we add a new independent vector, we can engineer it so the new vector is `}<i>automatically orthogonal</i>{String.raw` to all the old ones.`}
            </Callout>

            {/* ─── §17 ORTHOGONAL LEMMA ─── */}
            <Sec id="orth-lemma" n="§17">Lemma 8.1.1 — The Orthogonal Lemma</Sec>

            <ThmBox title="Lemma 8.1.1">
              <p style={{margin:'0 0 10px'}}>{String.raw`Let $\{\mathbf{f}_1,\mathbf{f}_2,\ldots,\mathbf{f}_m\}$ be an orthogonal set in $\mathbb{R}^n$. Given $\mathbf{x}$ in $\mathbb{R}^n$, write`}</p>
              <p style={{textAlign:'center', margin:'0 0 10px'}}>{String.raw`$$\mathbf{f}_{m+1} = \mathbf{x} - \frac{\mathbf{x}\cdot\mathbf{f}_1}{\|\mathbf{f}_1\|^2}\mathbf{f}_1 - \frac{\mathbf{x}\cdot\mathbf{f}_2}{\|\mathbf{f}_2\|^2}\mathbf{f}_2 - \cdots - \frac{\mathbf{x}\cdot\mathbf{f}_m}{\|\mathbf{f}_m\|^2}\mathbf{f}_m.$$`}</p>
              <p style={{margin:'0 0 10px'}}>{String.raw`Then:`}</p>
              <BulletList dense items={[
                <span key="l1"><b>1.</b>{String.raw` $\mathbf{f}_{m+1}\cdot\mathbf{f}_k = 0$ for $k=1,2,\ldots,m$.`}</span>,
                <span key="l2"><b>2.</b>{String.raw` If $\mathbf{x}$ is not in $\operatorname{span}\{\mathbf{f}_1,\ldots,\mathbf{f}_m\}$, then $\mathbf{f}_{m+1}\neq\mathbf{0}$ and $\{\mathbf{f}_1,\ldots,\mathbf{f}_m,\mathbf{f}_{m+1}\}$ is an orthogonal set.`}</span>,
              ]}/>
            </ThmBox>

            <Callout icon="💡" title="Explanation" color="amber">
              {String.raw`Each fraction $\frac{\mathbf{x}\cdot\mathbf{f}_k}{\|\mathbf{f}_k\|^2}\mathbf{f}_k$ is exactly the "amount of $\mathbf{x}$ pointing along $\mathbf{f}_k$" — its `}<b>projection</b>{String.raw` onto $\mathbf{f}_k$ (this is the same formula that appears in the Expansion Theorem). Subtracting off the projection onto every $\mathbf{f}_k$ in turn strips away all the parts of $\mathbf{x}$ that overlap with the existing orthogonal set, leaving only whatever is `}<i>genuinely new</i>{String.raw` — the "leftover" component, $\mathbf{f}_{m+1}$, is by construction the part of $\mathbf{x}$ that has zero overlap with each $\mathbf{f}_k$, which is precisely what "orthogonal to every $\mathbf{f}_k$" means. Part 2 is then intuitive: if $\mathbf{x}$ had `}<i>no</i>{String.raw` genuinely new direction (i.e. $\mathbf{x}\in\operatorname{span}\{\mathbf{f}_1,\ldots,\mathbf{f}_m\}$ already), then subtracting off every projection would leave exactly $\mathbf{0}$ — there'd be nothing left over. So a nonzero leftover $\mathbf{f}_{m+1}$ signals that $\mathbf{x}$ truly added something new, and — being orthogonal to everything before it — it extends the orthogonal set.`}
            </Callout>

            {/* ─── §18 THEOREM 8.1.1 ─── */}
            <Sec id="thm811" n="§18">Theorem 8.1.1</Sec>

            <ThmBox title="Theorem 8.1.1">
              <p style={{margin:'0 0 10px'}}>{String.raw`Let $U$ be a subspace of $\mathbb{R}^n$.`}</p>
              <BulletList dense items={[
                <span key="th1"><b>1.</b>{String.raw` Every orthogonal subset $\{\mathbf{f}_1,\ldots,\mathbf{f}_m\}$ in $U$ is a subset of an orthogonal basis of $U$.`}</span>,
                <span key="th2"><b>2.</b>{String.raw` $U$ has an orthogonal basis.`}</span>,
              ]}/>
            </ThmBox>

            <Callout icon="💡" title="Explanation" color="teal">
              {String.raw`This is the orthogonal counterpart of Lemma 6.4.2 from Lecture 17, and the argument runs exactly the same way, now powered by the Orthogonal Lemma instead of the Independent Lemma. `}<b>Part 1:</b>{String.raw` start with your orthogonal subset. If it doesn't yet span $U$, some vector $\mathbf{x}\in U$ lies outside its span — apply the Orthogonal Lemma with that $\mathbf{x}$ to get a nonzero $\mathbf{f}_{m+1}$, automatically orthogonal to everything so far. Repeat. Because $U$ is finite dimensional (Theorem 6.4.1), this process must terminate, and it can only terminate once the set spans $U$ — at which point it's an orthogonal basis. `}<b>Part 2</b>{String.raw` is the special case where you start from the empty set: run the same process from scratch, and you build an orthogonal basis of $U$ out of nothing. This guarantees that `}<i>every</i>{String.raw` subspace of $\mathbb{R}^n$, no matter how it was originally described, has some orthogonal basis waiting to be found — which is exactly the promise the Gram–Schmidt process below makes good on, explicitly.`}
            </Callout>

            {/* ─── §19 GRAM-SCHMIDT WHY ─── */}
            <Sec id="gs-why" n="§19">The Gram–Schmidt Process — Why It's Worth Learning</Sec>

            <p>{String.raw`Theorem 8.1.1 is an `}<i>existence</i>{String.raw` statement: an orthogonal basis exists. It doesn't tell you how to build one from a basis you already have in hand. The `}<b>Gram–Schmidt process</b>{String.raw` closes that gap completely: give it any basis at all, however skewed and non-perpendicular, and it hands back an orthogonal basis for the exact same subspace — with a fully explicit, step-by-step recipe.`}</p>

            <Callout icon="🏆" title="Why this is one of the most important algorithms in the course" color="rose">
              <BulletList dense items={[
                <span key="w1"><b>{String.raw`It makes the Expansion Theorem usable.`}</b>{String.raw` §11 showed that an orthogonal basis turns "solve a linear system" into "compute a dot product." Gram–Schmidt is what lets you actually get an orthogonal basis for `}<i>any</i>{String.raw` subspace you're handed, not just the lucky ones.`}</span>,
                <span key="w2"><b>{String.raw`It is the engine behind the QR-decomposition,`}</b>{String.raw` the standard tool numerical software uses to solve least-squares problems (curve fitting, regression, GPS positioning) stably and accurately.`}</span>,
                <span key="w3"><b>{String.raw`It is completely constructive.`}</b>{String.raw` Unlike many existence theorems in this course, Gram–Schmidt is an algorithm you can run by hand on a small example (as we're about to) or code up in five lines for a computer.`}</span>,
              ]}/>
            </Callout>

            {/* ─── §20 GRAM-SCHMIDT HOW ─── */}
            <Sec id="gs-how" n="§20">The Gram–Schmidt Process — How It Works</Sec>

            <p>{String.raw`The idea is simply to apply the Orthogonal Lemma over and over, once for each vector of a starting basis $\{\mathbf{x}_1,\mathbf{x}_2,\ldots,\mathbf{x}_k\}$ of a subspace $U$, in order.`}</p>

            <StepList items={[
              <span key="s1"><b>{String.raw`Keep the first vector as-is:`}</b>{String.raw` $\mathbf{f}_1 = \mathbf{x}_1$. (A single nonzero vector is trivially an orthogonal set — there's nothing to compare it to yet.)`}</span>,
              <span key="s2"><b>{String.raw`Strip $\mathbf{x}_2$'s overlap with $\mathbf{f}_1$:`}</b>{String.raw` $\;\mathbf{f}_2 = \mathbf{x}_2 - \dfrac{\mathbf{x}_2\cdot\mathbf{f}_1}{\|\mathbf{f}_1\|^2}\mathbf{f}_1$. By the Orthogonal Lemma, $\mathbf{f}_2\cdot\mathbf{f}_1=0$ automatically.`}</span>,
              <span key="s3"><b>{String.raw`Strip $\mathbf{x}_3$'s overlap with both $\mathbf{f}_1$ and $\mathbf{f}_2$:`}</b>{String.raw` $\;\mathbf{f}_3 = \mathbf{x}_3 - \dfrac{\mathbf{x}_3\cdot\mathbf{f}_1}{\|\mathbf{f}_1\|^2}\mathbf{f}_1 - \dfrac{\mathbf{x}_3\cdot\mathbf{f}_2}{\|\mathbf{f}_2\|^2}\mathbf{f}_2$.`}</span>,
              <span key="s4"><b>{String.raw`Continue the same pattern.`}</b>{String.raw` At step $i$, subtract off the projection of $\mathbf{x}_i$ onto every $\mathbf{f}_j$ built so far ($j<i$):`}
                <p style={{textAlign:'center', margin:'10px 0 0'}}>{String.raw`$$\mathbf{f}_i = \mathbf{x}_i - \sum_{j=1}^{i-1} \frac{\mathbf{x}_i\cdot\mathbf{f}_j}{\|\mathbf{f}_j\|^2}\mathbf{f}_j.$$`}</p>
              </span>,
              <span key="s5"><b>{String.raw`Stop after $k$ steps.`}</b>{String.raw` Since $\{\mathbf{x}_1,\ldots,\mathbf{x}_k\}$ was independent, each $\mathbf{x}_i$ is genuinely outside $\operatorname{span}\{\mathbf{f}_1,\ldots,\mathbf{f}_{i-1}\}$ (it's part of an independent set!), so by the Orthogonal Lemma every $\mathbf{f}_i$ comes out nonzero, and $\{\mathbf{f}_1,\ldots,\mathbf{f}_k\}$ ends up an orthogonal basis of $U$.`}</span>,
              <span key="s6"><b>{String.raw`Optional final step:`}</b>{String.raw` normalize, dividing each $\mathbf{f}_i$ by $\|\mathbf{f}_i\|$, to get a fully orthonormal basis (Definition 5.9).`}</span>,
            ]}/>

            <Callout icon="🧩" title="The one-line summary" color="amber">
              {String.raw`Gram–Schmidt is just "the Orthogonal Lemma, run $k$ times in a row" — build the orthogonal set one vector at a time, and at each step, subtract off everything the next basis vector has in common with what you've already built.`}
            </Callout>

            {/* ─── §21 GRAM-SCHMIDT WORKED ─── */}
            <Sec id="gs-worked" n="§21">Full Worked Example</Sec>

            <Example n="11" title="Gram–Schmidt on a basis of R³" advanced>
              <p>{String.raw`Apply the Gram–Schmidt process to the basis $\mathbf{x}_1=(1,1,0)$, $\mathbf{x}_2=(1,0,1)$, $\mathbf{x}_3=(0,1,1)$ of $\mathbb{R}^3$.`}</p>
              <Reveal label="Show full step-by-step solution">
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Step 1.}$ Set $\mathbf{f}_1 = \mathbf{x}_1 = (1,1,0)$. We'll need its squared length repeatedly: $\|\mathbf{f}_1\|^2 = 1^2+1^2+0^2 = 2$.`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Step 2.}$ Compute $\mathbf{x}_2\cdot\mathbf{f}_1 = (1)(1)+(0)(1)+(1)(0) = 1$. Then`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$\mathbf{f}_2 = \mathbf{x}_2 - \frac{\mathbf{x}_2\cdot\mathbf{f}_1}{\|\mathbf{f}_1\|^2}\mathbf{f}_1 = (1,0,1) - \frac{1}{2}(1,1,0) = \left(\tfrac{1}{2},\,-\tfrac{1}{2},\,1\right).$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`Check: $\mathbf{f}_1\cdot\mathbf{f}_2 = (1)(\tfrac12)+(1)(-\tfrac12)+(0)(1) = \tfrac12-\tfrac12+0=0$ ✓. Its squared length: $\|\mathbf{f}_2\|^2 = \tfrac14+\tfrac14+1=\tfrac32$.`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Step 3.}$ Compute $\mathbf{x}_3\cdot\mathbf{f}_1 = (0)(1)+(1)(1)+(1)(0)=1$ and $\mathbf{x}_3\cdot\mathbf{f}_2 = (0)(\tfrac12)+(1)(-\tfrac12)+(1)(1) = \tfrac12$. Then`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$\mathbf{f}_3 = \mathbf{x}_3 - \frac{1}{2}\mathbf{f}_1 - \frac{1/2}{3/2}\mathbf{f}_2 = (0,1,1) - \tfrac12(1,1,0) - \tfrac13\left(\tfrac12,-\tfrac12,1\right).$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`Computing each coordinate: $x$-coordinate $0-\tfrac12-\tfrac16 = -\tfrac23$; $y$-coordinate $1-\tfrac12+\tfrac16=\tfrac23$; $z$-coordinate $1-0-\tfrac13=\tfrac23$. So`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$\mathbf{f}_3 = \left(-\tfrac23,\,\tfrac23,\,\tfrac23\right).$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`Check: $\mathbf{f}_1\cdot\mathbf{f}_3 = -\tfrac23+\tfrac23+0=0$ ✓, and $\mathbf{f}_2\cdot\mathbf{f}_3 = \tfrac12(-\tfrac23)+(-\tfrac12)(\tfrac23)+1(\tfrac23) = -\tfrac13-\tfrac13+\tfrac23=0$ ✓.`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Cleaning up.}$ Each $\mathbf{f}_i$ may be rescaled by any nonzero constant without disturbing orthogonality (Theorem 5.3.1, rule 3). Scaling $\mathbf{f}_2$ by $2$ and $\mathbf{f}_3$ by $3$ clears the fractions:`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$\{\, (1,1,0),\;\; (1,-1,2),\;\; (-1,1,1) \,\}$$`}</p>
                <p style={{margin:0}}>{String.raw`is a clean, integer-valued orthogonal basis of $\mathbb{R}^3$. (Quick re-check: $(1,1,0)\cdot(1,-1,2)=1-1+0=0$; $(1,1,0)\cdot(-1,1,1)=-1+1+0=0$; $(1,-1,2)\cdot(-1,1,1)=-1-1+2=0$ — all confirmed.) Dividing each by its length, $\sqrt2,\sqrt6,\sqrt3$ respectively, would produce the fully orthonormal version. $\blacksquare$`}</p>
              </Reveal>
            </Example>

            {/* ─── §22 GRAM-SCHMIDT MORE ─── */}
            <Sec id="gs-more" n="§22">Two More — Quicker — Examples</Sec>

            <Example n="12" title="Gram–Schmidt on two vectors">
              <p style={{margin:'0 0 8px'}}>{String.raw`Orthogonalize $\mathbf{x}_1=(1,0,1)$, $\mathbf{x}_2=(1,1,1)$.`}</p>
              <Reveal label="Show solution">
                <p style={{margin:'0 0 8px'}}>{String.raw`$\mathbf{f}_1=\mathbf{x}_1=(1,0,1)$, with $\|\mathbf{f}_1\|^2=2$. Then $\mathbf{x}_2\cdot\mathbf{f}_1 = 1+0+1=2$, so`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$\mathbf{f}_2 = (1,1,1) - \frac{2}{2}(1,0,1) = (0,1,0).$$`}</p>
                <p style={{margin:0}}>{String.raw`Check: $\mathbf{f}_1\cdot\mathbf{f}_2 = 0+0+0=0$ ✓. Orthogonal basis: $\{(1,0,1),\,(0,1,0)\}$.`}</p>
              </Reveal>
            </Example>

            <Example n="13" title="Gram–Schmidt on a staircase basis">
              <p style={{margin:'0 0 8px'}}>{String.raw`Orthogonalize $\mathbf{x}_1=(1,1,1)$, $\mathbf{x}_2=(0,1,1)$, $\mathbf{x}_3=(0,0,1)$.`}</p>
              <Reveal label="Show solution">
                <p style={{margin:'0 0 8px'}}>{String.raw`$\mathbf{f}_1=(1,1,1)$, $\|\mathbf{f}_1\|^2=3$. Then $\mathbf{x}_2\cdot\mathbf{f}_1=0+1+1=2$, so $\mathbf{f}_2 = (0,1,1)-\tfrac23(1,1,1) = \left(-\tfrac23,\tfrac13,\tfrac13\right)$, with $\|\mathbf{f}_2\|^2=\tfrac49+\tfrac19+\tfrac19=\tfrac23$.`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`Next, $\mathbf{x}_3\cdot\mathbf{f}_1=1$ and $\mathbf{x}_3\cdot\mathbf{f}_2=\tfrac13$, so`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$\mathbf{f}_3 = (0,0,1) - \tfrac13(1,1,1) - \frac{1/3}{2/3}\left(-\tfrac23,\tfrac13,\tfrac13\right) = (0,0,1)-\left(\tfrac13,\tfrac13,\tfrac13\right)-\left(-\tfrac13,\tfrac16,\tfrac16\right) = \left(0,\,-\tfrac12,\,\tfrac12\right).$$`}</p>
                <p style={{margin:0}}>{String.raw`Scaling $\mathbf{f}_2$ by $3$ and $\mathbf{f}_3$ by $2$: orthogonal basis $\{(1,1,1),\,(-2,1,1),\,(0,-1,1)\}$. (Check: $(1,1,1)\cdot(-2,1,1)=0$; $(1,1,1)\cdot(0,-1,1)=0$; $(-2,1,1)\cdot(0,-1,1)=0$ — all confirmed.)`}</p>
              </Reveal>
            </Example>

            {/* ─── §23 LOOKING AHEAD ─── */}
            <Sec id="ahead" n="§23">Looking Ahead</Sec>

            <Callout icon="🧭" title="Next: orthogonal complements and projections" color="violet">
              {String.raw`With Gram–Schmidt in hand, every subspace of $\mathbb{R}^n$ has a ready-made orthogonal basis. The next step is to ask: given a subspace $U$, what does the set of vectors `}<i>orthogonal to all of $U$</i>{String.raw` look like — the `}<b>orthogonal complement</b>{String.raw` $U^{\perp}$? And given any vector $\mathbf{x}$, what is the closest point to it inside $U$ — its `}<b>orthogonal projection</b>{String.raw` onto $U$? Both questions are answered directly using the machinery built today: an orthogonal basis of $U$ and the same projection formula from the Orthogonal Lemma.`}
            </Callout>

            {/* ─── §24 EXERCISES ─── */}
            <Sec id="exercises" n="§24">Exercises</Sec>

            <p style={{fontStyle:'italic', color:'var(--lec-ink3)'}}>{String.raw`Four problems to practice on your own, in the same spirit as today's examples. Hints only — try each one properly before reading further.`}</p>

            <Exercise id="A" title="Length and unit vectors">
              <p>{String.raw`Find $\|\mathbf{x}\|$ for $\mathbf{x}=(2,-1,2,4)$, and then find the unit vector pointing in the same direction as $\mathbf{x}$.`}</p>
              <Callout icon="🧭" title="Hint" color="teal">
                {String.raw`Use Definition 5.6 to get $\|\mathbf{x}\|$ first (it comes out to a whole number). Then divide every entry of $\mathbf{x}$ by that length, exactly as in Example 4.`}
              </Callout>
            </Exercise>

            <Exercise id="B" title="Checking orthogonality">
              <p>{String.raw`Determine whether $\{(1,2,-1),\,(2,-1,0),\,(1,2,5)\}$ is an orthogonal set in $\mathbb{R}^3$.`}</p>
              <Callout icon="🧭" title="Hint" color="teal">
                {String.raw`There are $\binom{3}{2}=3$ pairwise dot products to check, exactly as in Example 5.3.6's Step 1. All three must be zero for the set to qualify.`}
              </Callout>
            </Exercise>

            <Exercise id="C" title="The distance triangle inequality, concretely">
              <p>{String.raw`Let $\mathbf{x}=(0,0)$, $\mathbf{y}=(3,0)$, $\mathbf{z}=(3,4)$ in $\mathbb{R}^2$. Compute $d(\mathbf{x},\mathbf{y})$, $d(\mathbf{y},\mathbf{z})$, and $d(\mathbf{x},\mathbf{z})$, and confirm the triangle inequality holds.`}</p>
              <Callout icon="🧭" title="Hint" color="teal">
                {String.raw`Use Definition 5.7 three times. These three points form a right triangle (a 3-4-5 triangle, in fact) — so you should find the triangle inequality holds `}<i>strictly</i>{String.raw` (the direct path is shorter, not equal). Equality would only happen if $\mathbf{x}$, $\mathbf{y}$, $\mathbf{z}$ were collinear with $\mathbf{y}$ sitting directly between the other two.`}
              </Callout>
            </Exercise>

            <Exercise id="D" title="Gram–Schmidt in R⁴">
              <p>{String.raw`Apply the Gram–Schmidt process to $\mathbf{x}_1=(1,1,0,0)$, $\mathbf{x}_2=(1,0,1,0)$.`}</p>
              <Callout icon="🧭" title="Hint" color="teal">
                {String.raw`Only two vectors, so only Steps 1–2 of the process are needed — set $\mathbf{f}_1=\mathbf{x}_1$, compute $\mathbf{x}_2\cdot\mathbf{f}_1$ and $\|\mathbf{f}_1\|^2$, then subtract the projection exactly as in Example 12.`}
              </Callout>
            </Exercise>

            {/* CLOSING */}
            <div style={{ marginTop:'48px', padding:'28px 32px', background:'rgba(56,201,176,.08)', border:'2px solid rgba(56,201,176,.35)', borderRadius:'16px' }}>
              <div style={{ fontFamily:'var(--fm)', fontSize:'.7rem', letterSpacing:'.16em', textTransform:'uppercase', color:'#2a9d8f', marginBottom:'12px' }}>Looking back</div>
              <p style={{ fontFamily:'var(--fh)', fontSize:'1.4rem', color:'var(--lec-ink)', margin:'0 0 16px', fontWeight:400, lineHeight:1.3 }}>
                The dot product measures agreement, orthogonality means zero agreement, and Gram–Schmidt is the machine that manufactures perpendicular directions out of any basis at all.
              </p>
              <p style={{ color:'var(--lec-ink2)', fontSize:'.97rem', lineHeight:1.8, margin:0 }}>
                {String.raw`Every computation today reduced to the same handful of moves: a dot product, a length, and a subtraction. What made them powerful was the pattern they revealed — that "closest point," "no overlap," and "coordinates without solving a system" are all the same idea, seen from different angles. That idea is about to become the backbone of orthogonal projections in the next lecture.`}
              </p>
            </div>

            <div style={{ marginTop:'64px', paddingTop:'28px', borderTop:'2px solid var(--lec-border)', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'12px' }}>
              <div style={{ fontFamily:'var(--fm)', fontSize:'.76rem', color:'var(--lec-ink3)', fontStyle:'italic' }}>Lecture 18 — complete</div>
              <div style={{ fontFamily:'var(--fm)', fontSize:'.76rem', color:'var(--lec-ink3)' }}>MATH-120 · Shoaib Khan · LUMS · July 2026</div>
            </div>
          </div>

          {/* FOOTER NAV */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'22px 48px', borderTop:'1px solid var(--lec-border)', background:'var(--lec-paper)', flexWrap:'wrap', gap:'12px' }}>
            <Link href={PREV_HREF} style={{ fontFamily:'var(--fm)', fontSize:'.74rem', letterSpacing:'.08em', textTransform:'uppercase', color:'var(--lec-accent)', textDecoration:'none' }}>← Lecture 17</Link>
            <Link href={NEXT_HREF} style={{ fontFamily:'var(--fm)', fontSize:'.74rem', letterSpacing:'.08em', textTransform:'uppercase', color:'var(--lec-accent)', textDecoration:'none' }}>Course Home →</Link>
          </div>
        </main>
      </div>

      <Footer/>
    </>
  );
}