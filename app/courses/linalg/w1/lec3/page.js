'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import Navbar from '../../../../components/Navbar';
import Footer from '../../../../components/Footer';

/* ════════════════════════════════════════════════════════════
   MATH-120 · LECTURE 3
   RREF, Gauss-Jordan, Homogeneous Systems & Linear Combinations
   Route: /courses/linalg/w1/lec3
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
];

const THIS_SLUG = 'w1/lec3';
const PREV_HREF  = '/courses/linalg/w1/lec2';
const NEXT_HREF  = '/courses/linalg/w1/lec4';

const LEC = {
  course: 'MATH-120 · Linear Algebra',
  number: 'Lecture 3',
  title: 'RREF, Homogeneous Systems & Linear Combinations',
  subtitle: 'Completing the elimination story — then meeting the two most fundamental ideas in linear algebra',
  date: '10 June 2026',
};

const ANCHORS = [
  ['Recall', 'recall'],
  ['Rank Facts', 'rank'],
  ['RREF', 'rref'],
  ['Gauss–Jordan', 'gj'],
  ['Homogeneous', 'homo'],
  ['Linear Combinations', 'lincomb'],
  ['Geometry', 'geometry'],
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
      }}>
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

function RedBox({ title, children }) {
  return (
    <div style={{ background:'rgba(224,107,107,.09)', border:'2px solid #d85555', borderRadius:'12px', padding:'18px 22px', margin:'24px 0' }}>
      {title && <div style={{ fontFamily:'var(--fm)', fontSize:'.72rem', letterSpacing:'.14em', textTransform:'uppercase', color:'#d85555', marginBottom:'10px', fontWeight:700, display:'flex', alignItems:'center', gap:'8px' }}>
        ⚠️ {title}
      </div>}
      <div style={{ color:'var(--lec-ink2)', lineHeight:1.75 }}>{children}</div>
    </div>
  );
}

function Example({ n, title, advanced, children }) {
  return (
    <div style={{ background:advanced?'rgba(155,128,232,.05)':'rgba(255,253,240,.97)', border:`1px solid ${advanced?'rgba(155,128,232,.35)':'var(--lec-border)'}`, borderRadius:'14px', padding:'24px 28px', margin:'22px 0', boxShadow:'0 2px 18px rgba(60,40,20,.06)' }}>
      <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'14px', flexWrap:'wrap' }}>
        <span style={{ fontFamily:'var(--fm)', fontSize:'.7rem', letterSpacing:'.1em', textTransform:'uppercase', color:advanced?'#9b80e8':'#c8860a', background:advanced?'rgba(155,128,232,.14)':'rgba(232,160,32,.14)', padding:'4px 12px', borderRadius:'20px' }}>
          {advanced?`★ Challenge ${n}`:`Example ${n}`}
        </span>
        {title && <span style={{ fontFamily:'var(--fh)', fontSize:'1.08rem', color:'var(--lec-ink)', fontWeight:600 }}>{title}</span>}
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

function Widget({ title, children }) {
  return (
    <div className="dark-widget" style={{ background:'#0f1525', border:'1px solid rgba(255,255,255,.08)', borderRadius:'16px', padding:'22px', margin:'24px 0', color:'#e8e8f0', boxShadow:'0 8px 40px rgba(0,0,0,.4)' }}>
      {title && <div style={{ fontFamily:'var(--fm)', fontSize:'.7rem', letterSpacing:'.14em', textTransform:'uppercase', color:'#6a6a9a', marginBottom:'16px' }}>{title}</div>}
      {children}
    </div>
  );
}

/* ═══════════════ GEOMETRY: HOMO vs NON-HOMO SVGs ═══════════════ */

/* Static side-by-side: two homogeneous lines (through origin) vs
   two non-homogeneous lines (shifted). Pure SVG, no state. */
function HomoNonHomoSVG() {
  // helper to map math coords (-5..5) to svg pixels in a 220x220 box
  const M = (v) => 110 + v * 18; // x: origin at 110, scale 18px/unit
  const MY = (v) => 110 - v * 18; // y flips

  const Grid = () => (
    <g>
      {[-4,-3,-2,-1,1,2,3,4].map(i=>(
        <g key={i}>
          <line x1={M(i)} y1="14" x2={M(i)} y2="206" stroke="#eee" strokeWidth="1"/>
          <line x1="14" y1={MY(i)} x2="206" y2={MY(i)} stroke="#eee" strokeWidth="1"/>
        </g>
      ))}
      <line x1="14" y1="110" x2="206" y2="110" stroke="#bbb" strokeWidth="1.4"/>
      <line x1="110" y1="14" x2="110" y2="206" stroke="#bbb" strokeWidth="1.4"/>
    </g>
  );

  return (
    <div className="sbs">
      {/* LEFT: homogeneous */}
      <div className="sbs-card">
        <div className="sbs-label">Homogeneous · both through origin</div>
        <svg viewBox="0 0 220 220" style={{width:'100%',maxWidth:'260px',margin:'0 auto',display:'block'}}>
          <Grid/>
          {/* line 1: x - y = 0  -> y = x */}
          <line x1={M(-5)} y1={MY(-5)} x2={M(5)} y2={MY(5)} stroke="#38c9b0" strokeWidth="2.4"/>
          {/* line 2: x + 2y = 0 -> y = -x/2 */}
          <line x1={M(-5)} y1={MY(2.5)} x2={M(5)} y2={MY(-2.5)} stroke="#9b80e8" strokeWidth="2.4"/>
          {/* origin (shared solution) */}
          <circle cx={M(0)} cy={MY(0)} r="4.5" fill="#e8a020"/>
          <text x={M(0)+8} y={MY(0)-6} fontSize="10" fill="#c8860a" fontFamily="monospace">(0,0)</text>
        </svg>
        <p style={{fontSize:'.82rem',color:'var(--lec-ink2)',marginTop:'8px',marginBottom:0,lineHeight:1.6}}>
          Both lines <b>must</b> pass through the origin — the trivial solution is always shared. They meet there (unique = trivial only) unless they coincide.
        </p>
      </div>

      {/* RIGHT: non-homogeneous */}
      <div className="sbs-card">
        <div className="sbs-label">Non-homogeneous · shifted off origin</div>
        <svg viewBox="0 0 220 220" style={{width:'100%',maxWidth:'260px',margin:'0 auto',display:'block'}}>
          <Grid/>
          {/* line 1: x - y = 2 -> y = x - 2 */}
          <line x1={M(-3)} y1={MY(-5)} x2={M(5)} y2={MY(3)} stroke="#38c9b0" strokeWidth="2.4"/>
          {/* line 2: x + 2y = -2 -> y = -(x+2)/2, parallel-ish different intercept */}
          <line x1={M(-5)} y1={MY(1.5)} x2={M(5)} y2={MY(-3.5)} stroke="#9b80e8" strokeWidth="2.4"/>
          {/* intersection point of the two: solve x-y=2, x+2y=-2 -> x=2/3*... compute */}
          {/* x - y = 2 ; x + 2y = -2  => subtract: -3y=4 => y=-4/3, x=2-4/3=2/3 */}
          <circle cx={M(2/3)} cy={MY(-4/3)} r="4.5" fill="#e06b6b"/>
          <text x={M(2/3)+8} y={MY(-4/3)+12} fontSize="9.5" fill="#d85555" fontFamily="monospace">unique pt</text>
          {/* origin marked but NOT on either line */}
          <circle cx={M(0)} cy={MY(0)} r="3" fill="none" stroke="#bbb" strokeWidth="1.4"/>
        </svg>
        <p style={{fontSize:'.82rem',color:'var(--lec-ink2)',marginTop:'8px',marginBottom:0,lineHeight:1.6}}>
          Neither line need pass through the origin. They can cross at one point, run parallel (no solution), or coincide — inconsistency becomes possible.
        </p>
      </div>
    </div>
  );
}

/* Interactive: one homogeneous line ax+by=0 (fixed through origin) and its
   shifted twin ax+by=c. Drag c to watch the line translate; the homogeneous
   line stays pinned at the origin. */
function ShiftLineApplet() {
  const [c, setC] = useState(2);
  const a = 1, b = -1; // line: x - y = c  (slope 1)

  const W = 360, H = 320;
  const ox = W/2, oy = H/2, s = 26; // origin + scale px/unit
  const PX = (x)=> ox + x*s;
  const PY = (y)=> oy - y*s;

  // line x - y = k  => y = x - k. Draw between x=-6..6
  const linePts = (k) => {
    const x1=-6, y1=x1-k, x2=6, y2=x2-k;
    return { x1:PX(x1), y1:PY(y1), x2:PX(x2), y2:PY(y2) };
  };
  const homo = linePts(0);
  const shifted = linePts(c);

  // particular solution with params=0: x=c... we use x-y=c, set y=0 => x=c. Point (c,0)
  const px = PX(c), py = PY(0);

  return (
    <Widget title="Interactive · Drag c — watch the line slide off the origin">
      <div style={{display:'flex',gap:'20px',flexWrap:'wrap',alignItems:'flex-start',justifyContent:'center'}}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{width:'100%',maxWidth:'380px',background:'#0b1020',borderRadius:'10px'}}>
          {/* grid */}
          {[-6,-5,-4,-3,-2,-1,1,2,3,4,5,6].map(i=>(
            <g key={i}>
              <line x1={PX(i)} y1="0" x2={PX(i)} y2={H} stroke="rgba(255,255,255,.05)" strokeWidth="1"/>
              <line x1="0" y1={PY(i)} x2={W} y2={PY(i)} stroke="rgba(255,255,255,.05)" strokeWidth="1"/>
            </g>
          ))}
          {/* axes */}
          <line x1="0" y1={oy} x2={W} y2={oy} stroke="#5a5a8a" strokeWidth="1.4"/>
          <line x1={ox} y1="0" x2={ox} y2={H} stroke="#5a5a8a" strokeWidth="1.4"/>
          {/* homogeneous line (dashed teal, pinned at origin) */}
          <line x1={homo.x1} y1={homo.y1} x2={homo.x2} y2={homo.y2} stroke="#38c9b0" strokeWidth="2.5" strokeDasharray="7 5"/>
          {/* shifted line (solid amber) */}
          <line x1={shifted.x1} y1={shifted.y1} x2={shifted.x2} y2={shifted.y2} stroke="#e8a020" strokeWidth="2.6"/>
          {/* origin */}
          <circle cx={ox} cy={oy} r="4.5" fill="#38c9b0"/>
          <text x={ox+7} y={oy+15} fontSize="11" fill="#38c9b0" fontFamily="monospace">(0,0)</text>
          {/* particular point */}
          <circle cx={px} cy={py} r="5" fill="#e8a020"/>
          <text x={px+8} y={py-7} fontSize="11" fill="#e8a020" fontFamily="monospace">xₚ=({c},0)</text>
          {/* shift arrow from origin to particular point */}
          {c!==0 && <line x1={ox} y1={oy} x2={px} y2={py} stroke="#9b80e8" strokeWidth="2" strokeDasharray="3 3"/>}
        </svg>

        <div style={{flex:'1 1 200px',minWidth:'200px'}}>
          <div style={{fontFamily:'monospace',fontSize:'1rem',color:'#e8a020',padding:'8px 12px',background:'rgba(232,160,32,.08)',borderRadius:'8px',marginBottom:'14px'}}>
            x − y = {c}
          </div>
          <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'14px'}}>
            <span style={{fontFamily:'monospace',color:'#e8a020',width:'18px'}}>c</span>
            <input type="range" min={-5} max={5} step={1} value={c} onChange={e=>setC(+e.target.value)} style={{flex:1,accentColor:'#e8a020'}}/>
            <span style={{fontFamily:'monospace',color:'#e8e8f0',width:'28px',textAlign:'right'}}>{c}</span>
          </div>
          <div style={{fontSize:'.82rem',color:'#a0a0d0',lineHeight:1.65}}>
            <p style={{margin:'0 0 8px'}}><span style={{color:'#38c9b0'}}>━━</span> dashed teal: the homogeneous line <b style={{color:'#38c9b0'}}>x − y = 0</b>, locked through the origin.</p>
            <p style={{margin:'0 0 8px'}}><span style={{color:'#e8a020'}}>━━</span> solid amber: the full line <b style={{color:'#e8a020'}}>x − y = c</b>. Same slope, shifted.</p>
            <p style={{margin:0}}>Set <b style={{color:'#e8a020'}}>c = 0</b> and the two lines coincide — the shift vanishes and the full system <i>is</i> the homogeneous one.</p>
          </div>
        </div>
      </div>
    </Widget>
  );
}

/* ═══════════════ PAGE ═══════════════ */
export default function Lec3() {
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
        .dark-widget mjx-container { color:#e8e8f0 !important; }
        .dark-widget * { color:#e8e8f0; }
        .lec-content b, .lec-content strong { color:var(--lec-ink); }
        .lc-shell { display:flex; padding-top:calc(var(--nav-h) + 3px + 37px); min-height:100vh; }
        .lc-sidebar { width:256px; flex-shrink:0; position:sticky; top:calc(var(--nav-h)+3px+37px); height:calc(100vh - var(--nav-h) - 40px); overflow-y:auto; background:var(--bg2); border-right:1px solid var(--border); z-index:510; }
        .lc-backdrop { display:none; }
        .lc-menu-btn { display:none; }
        .lc-main { flex:1; min-width:0; background:var(--lec-paper); }
        .lc-body { max-width:880px; margin:0 auto; padding:36px 48px 96px; }
        .sbs { display:grid; grid-template-columns:1fr 1fr; gap:18px; margin:20px 0; }
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

      <Navbar activePage="courses"/>

      {/* BREADCRUMB */}
      <div style={{ position:'sticky', top:'calc(var(--nav-h) + 3px)', zIndex:500, background:'var(--bg2)', borderBottom:'1px solid var(--border)', padding:'0 24px', display:'flex', alignItems:'center', gap:'8px', fontFamily:'var(--fm)', fontSize:'.72rem', color:'var(--text3)', height:'37px', overflowX:'auto', whiteSpace:'nowrap' }}>
        <Link href="/" style={{color:'var(--amber)'}}>Home</Link><span>›</span>
        <Link href="/courses" style={{color:'var(--amber)'}}>Courses</Link><span>›</span>
        <Link href="/courses/linalg" style={{color:'var(--amber)'}}>Linear Algebra</Link><span>›</span>
        <span style={{color:'var(--text2)'}}>Week 1 · Lecture 3</span>
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
            <Link href={PREV_HREF} style={{ display:'flex', alignItems:'center', padding:'0 16px', height:'100%', fontFamily:'var(--fm)', fontSize:'.72rem', color:'var(--lec-ink3)', borderRight:'1px solid var(--lec-border)', whiteSpace:'nowrap', flexShrink:0, textDecoration:'none' }}>← Lecture 2</Link>
            <div style={{ flex:1, display:'flex', justifyContent:'center', alignItems:'center', gap:'4px', overflowX:'auto', padding:'0 8px' }}>
              <span style={{ fontFamily:'var(--fm)', fontSize:'.6rem', letterSpacing:'.12em', textTransform:'uppercase', color:'var(--lec-accent)', flexShrink:0, marginRight:'6px' }}>On this page</span>
              {ANCHORS.map(([label,id],i)=>(
                <span key={id} style={{display:'inline-flex',alignItems:'center',flexShrink:0}}>
                  {i>0&&<span style={{color:'var(--lec-border)',margin:'0 7px'}}>·</span>}
                  <a href={`#${id}`} onClick={e=>jump(e,id)} style={{fontFamily:'var(--fm)',fontSize:'.73rem',color:'var(--lec-ink2)',textDecoration:'none',whiteSpace:'nowrap'}}>{label}</a>
                </span>
              ))}
            </div>
            <Link href={NEXT_HREF} style={{ display:'flex', alignItems:'center', padding:'0 16px', height:'100%', fontFamily:'var(--fm)', fontSize:'.72rem', color:'var(--lec-ink3)', borderLeft:'1px solid var(--lec-border)', whiteSpace:'nowrap', flexShrink:0, textDecoration:'none' }}>Lecture 4 →</Link>
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

            {/* ─── §1 QUICK RECALL ─── */}
            <Sec id="recall" n="§1">Quick Recall</Sec>
            <p>Last two lectures we built the full machinery of Gaussian elimination. Before we push further, let us nail down a few facts that are easy to forget but come up in every problem.</p>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'14px', margin:'20px 0' }}>
              {[
                {c:'#38c9b0', h:'REF', b:'Leading 1s, staircase right, zero rows at bottom. Produced by Gaussian elimination.'},
                {c:'#e8a020', h:'Rank', b:'Number of pivots (leading 1s) in REF. Equals the number of nonzero rows.'},
                {c:'#9b80e8', h:'Consistency', b:'rank(A) = rank(A|b) ⟺ consistent. Unique iff also equals n variables.'},
              ].map(r=>(
                <div key={r.h} style={{ background:'rgba(255,255,255,.97)', border:`1px solid ${r.c}40`, borderTop:`3px solid ${r.c}`, borderRadius:'12px', padding:'16px 18px' }}>
                  <div style={{ fontFamily:'var(--fh)', fontSize:'1.1rem', color:r.c, marginBottom:'6px', fontWeight:600 }}>{r.h}</div>
                  <div style={{ fontSize:'.88rem', color:'var(--lec-ink2)', lineHeight:1.6 }}>{r.b}</div>
                </div>
              ))}
            </div>

            {/* ─── §2 RANK BOUNDS & FULL RANK ─── */}
            <Sec id="rank" n="§2">Rank Bounds &amp; Full Rank</Sec>
            <DefBox term="Rank bound" color="amber">
              <p style={{margin:0}}>{String.raw`For any $m \times n$ matrix $A$, the rank satisfies $\operatorname{rank}(A) \le \min(m, n)$. The pivots live in distinct rows (at most $m$) AND in distinct columns (at most $n$), so neither limit can be exceeded.`}</p>
            </DefBox>
            <DefBox term="Full rank" color="teal">
              <p style={{margin:0}}>{String.raw`A matrix has `}<b>full rank</b>{String.raw` when $\operatorname{rank}(A) = \min(m, n)$ — as large as possible. A square $n \times n$ matrix with $\operatorname{rank}(A) = n$ is called `}<b>full rank</b>{String.raw` (or nonsingular). This turns out to be equivalent to it having an inverse — something we will prove properly in a later lecture.`}</p>
            </DefBox>
            <Example n="1" title="Reading rank bounds">
              <p>{String.raw`(a) A $3 \times 5$ matrix: $\operatorname{rank} \le \min(3,5) = 3$. At most 3 pivots, however many columns there are.`}</p>
              <p>{String.raw`(b) A $6 \times 2$ matrix: $\operatorname{rank} \le \min(6,2) = 2$. Tall matrices are always bounded by their column count.`}</p>
              <p>{String.raw`(c) $I_4$ (the $4 \times 4$ identity): rank $= 4 = \min(4,4)$ — full rank. It already is in REF with four pivots.`}</p>
            </Example>

            {/* ─── REF NON-UNIQUENESS ─── */}
            <Callout icon="⚠️" title="REF is NOT unique — but the pivot count is" color="amber">
              {String.raw`Different sequences of row operations on the same matrix can produce different row-echelon forms. The entries outside the pivot positions can vary. However, no matter which valid sequence you choose, you will always land on the `}<b>same number of pivots in the same columns</b>{String.raw`. The pivot columns — and hence the rank — are an intrinsic property of the matrix, not of the method.`}
            </Callout>

            <p>Here is a concrete demonstration. We apply two different elimination strategies to the same matrix and see two valid but different REFs:</p>

            <Example n="2" title="Two different REFs of the same matrix">
              <p>{String.raw`Start with $A = \begin{pmatrix} 2 & 4 & 6 \\ 1 & 2 & 4 \\ 3 & 6 & 10 \end{pmatrix}$.`}</p>
              <p><b>Route 1</b>{String.raw` — scale first: $\tfrac{1}{2}R_1$, then $R_2 - R_1$, $R_3 - 3R_1$, then $R_3 - R_2$:`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$A \xrightarrow{\tfrac{1}{2}R_1} \begin{pmatrix}1&2&3\\1&2&4\\3&6&10\end{pmatrix} \xrightarrow{R_2-R_1,\,R_3-3R_1} \begin{pmatrix}1&2&3\\0&0&1\\0&0&1\end{pmatrix} \xrightarrow{R_3-R_2} \underbrace{\begin{pmatrix}1&2&3\\0&0&1\\0&0&0\end{pmatrix}}_{\textbf{REF}_1}$$`}</p>
              <p><b>Route 2</b>{String.raw` — swap first: $R_{12}$, then $R_2 - 2R_1$, $R_3 - 3R_1$, then $-\tfrac{1}{2}R_2$:`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$A \xrightarrow{R_{12}} \begin{pmatrix}1&2&4\\2&4&6\\3&6&10\end{pmatrix} \xrightarrow{R_2-2R_1,\,R_3-3R_1} \begin{pmatrix}1&2&4\\0&0&-2\\0&0&-2\end{pmatrix} \xrightarrow{-\tfrac{1}{2}R_2,\,R_3-R_2} \underbrace{\begin{pmatrix}1&2&4\\0&0&1\\0&0&0\end{pmatrix}}_{\textbf{REF}_2}$$`}</p>
              <p>{String.raw`$\textbf{REF}_1 \ne \textbf{REF}_2$ (different entries in column 3, row 1). But both have pivots in columns 1 and 3 — so `}<b>rank = 2</b>{String.raw` in both cases. The pivot count and pivot columns are the same. ✓`}</p>
            </Example>

            {/* TRICKS */}
            <p style={{fontFamily:'var(--fh)',fontSize:'1.3rem',color:'var(--lec-ink)',margin:'40px 0 12px',fontWeight:600}}>Practical tricks for faster row reduction</p>
            <p>Gaussian elimination always works, but smart choices save significant effort. Here are the most useful ones:</p>

            <Example n="3" title="Trick 1 — Swap to put the sparsest row on top">
              <p>{String.raw`Consider $\begin{pmatrix}1&2&13&11&7\\2&-1&1&1&0\\1&0&0&1&3\end{pmatrix}$. Naïvely, we'd use row 1 as the pivot and compute $R_2-2R_1$, $R_3-R_1$ — but row 1 has five nonzero entries, meaning every subtraction touches five numbers.`}</p>
              <p>{String.raw`Better: apply $R_{13}$ (swap rows 1 and 3) first. Now row 1 is $(1,0,0,1,3)$ — three zeros. The operation $R_2-2R_1$ only modifies the two nonzero columns; $R_2 - R_1$ similarly cheap. Fewer nonzeros in the pivot row = fewer multiplications in every subsequent step.`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$\begin{pmatrix}1&2&13&11&7\\2&-1&1&1&0\\1&0&0&1&3\end{pmatrix}\xrightarrow{R_{13}}\begin{pmatrix}1&0&0&1&3\\2&-1&1&1&0\\1&2&13&11&7\end{pmatrix}$$`}</p>
              <p>{String.raw`Eliminating column 1: $R_2-2R_1$ and $R_3-R_1$ now only change 2 and 4 entries respectively, instead of 5. The savings compound as the matrix grows.`}</p>
            </Example>

            <Example n="4" title="More tricks to keep in mind" advanced>
              <p><b>Trick 2 — Avoid fractions as long as possible.</b>{String.raw` If the pivot is $2$, you can scale $R_1 \to \tfrac{1}{2}R_1$ immediately, but this introduces fractions into every other entry. Often it is cleaner to use the operation $R_2 - 2R_1$ to zero out the entry below first, then scale at the end. Only make the pivot a leading 1 when you are ready to move to the next column.`}</p>
              <p><b>Trick 3 — Look for a row with a 1 entry and put it on top.</b>{String.raw` A pivot of $1$ requires no scaling, saving one entire step per pivot column.`}</p>
              <p><b>Trick 4 — Use integer multiples before fractions.</b>{String.raw` If you need to zero out entry $3$ in column 1 with pivot $2$: instead of scaling $\tfrac{1}{2}R_1$ and then subtracting, do $2R_3 - 3R_1$ directly (this keeps integers). The operation $R_i \to 2R_i - 3R_j$ is a valid row operation even though it scales $R_i$ — it is a combination of "multiply" and "add a multiple."`}</p>
              <p><b>Trick 5 — Zero columns are free.</b>{String.raw` A column of all zeros never produces a pivot. Skip it immediately and move to the next column.`}</p>
            </Example>

            {/* ─── §3 RREF ─── */}
            <Sec id="rref" n="§3">Reduced Row-Echelon Form — the Overachiever</Sec>

            <Callout icon="💪" title="REF's big brother" color="violet">
              If REF is a tidy bedroom, RREF is a bedroom <em>with colour-coded labels on every drawer, Marie Kondo'd to perfection</em>. It does more work than required — but the reward is that the solution reads off instantly, with zero back-substitution.
            </Callout>

            <DefBox term="Reduced Row-Echelon Form (RREF)" color="violet">
              <p style={{margin:'0 0 8px'}}>A matrix is in <b>reduced row-echelon form (RREF)</b> if it satisfies all three REF conditions, plus:</p>
              <p style={{margin:0}}><b>4.</b> Each leading 1 (pivot) is the <b>only nonzero entry in its entire column</b> — zeros above it as well as below.</p>
            </DefBox>

            <p>Every matrix has a <b>unique</b> RREF — unlike REF. This is one reason RREF is theoretically important: it is a canonical representative of the matrix's row space.</p>

            <Example n="5" title="Recognising RREF — and spotting the difference">
              <div className="sbs">
                <div className="sbs-card">
                  <div className="sbs-label">In RREF ✓</div>
                  <p style={{margin:0,textAlign:'center'}}>{String.raw`$$\begin{pmatrix}1&0&0&2\\0&1&0&-3\\0&0&1&5\end{pmatrix}$$`}</p>
                  <p style={{fontSize:'.85rem',color:'var(--lec-ink2)',marginTop:'10px',marginBottom:0}}>Each pivot column is a standard basis vector. Read off: solution is immediate.</p>
                </div>
                <div className="sbs-card">
                  <div className="sbs-label">In REF but NOT RREF ✗</div>
                  <p style={{margin:0,textAlign:'center'}}>{String.raw`$$\begin{pmatrix}1&2&-1&3\\0&0&1&-1\\0&0&0&0\end{pmatrix}$$`}</p>
                  <p style={{fontSize:'.85rem',color:'var(--lec-ink2)',marginTop:'10px',marginBottom:0}}>REF: staircase ✓, leading 1s ✓. But row 2's pivot (col 3) has nonzero entry above it.</p>
                </div>
              </div>
            </Example>

            <Example n="6" title="Benefits of RREF in practice">
              <p><b>Benefit 1 — No back-substitution.</b>{String.raw` In RREF, each pivot variable is immediately expressed in terms of free variables. No substitution chain needed.`}</p>
              <p><b>Benefit 2 — Uniqueness.</b>{String.raw` Every matrix has exactly one RREF. Comparing two matrices' RREFs tells you whether they have the same row space.`}</p>
              <p><b>Benefit 3 — Reading off the null space.</b>{String.raw` The free-variable columns of RREF directly give the null space of $A$ — fundamental for solving $Ax = 0$, coming shortly.`}</p>
              <p><b>Benefit 4 — Inverting matrices.</b>{String.raw` The RREF of $(A \mid I)$ gives $(I \mid A^{-1})$ when $A$ is invertible — a clean algorithm we will use in Chapter 2.`}</p>
            </Example>

            {/* ─── §4 GAUSS-JORDAN ─── */}
            <Sec id="gj" n="§4">The Gauss–Jordan Reduction Method</Sec>

            <DefBox term="Gauss–Jordan reduction" color="amber">
              <p style={{margin:0}}><b>Gauss–Jordan reduction</b> extends Gaussian elimination: after reaching REF (the forward pass — working top to bottom), continue with a <b>backward pass</b> — working bottom to top, using each pivot to zero out <em>all</em> entries above it (not just below). The result is RREF. The solution then reads off directly: no back-substitution required.</p>
            </DefBox>

            <p>The two passes:</p>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px',margin:'16px 0 24px'}}>
              {[
                {color:'#e8a020',step:'Forward pass (Gaussian)',desc:'Left to right, top to bottom. Create each pivot; zero everything below it. Produces REF.'},
                {color:'#38c9b0',step:'Backward pass (Jordan)',desc:'Right to left, bottom to top. Use each pivot to zero everything above it. Produces RREF.'},
              ].map(r=>(
                <div key={r.step} style={{background:'rgba(255,255,255,.97)',border:`1px solid ${r.color}40`,borderLeft:`3px solid ${r.color}`,borderRadius:'10px',padding:'14px 18px'}}>
                  <div style={{fontFamily:'var(--fm)',fontSize:'.7rem',color:r.color,letterSpacing:'.1em',textTransform:'uppercase',marginBottom:'6px'}}>{r.step}</div>
                  <div style={{fontSize:'.9rem',color:'var(--lec-ink2)',lineHeight:1.6}}>{r.desc}</div>
                </div>
              ))}
            </div>

            <Example n="7" title="Gauss–Jordan from start to RREF">
              <p>{String.raw`Solve $\begin{cases} x + 2y - z = 1 \\ 2x + y + z = 8 \\ x - y + 2z = 5 \end{cases}$ by Gauss–Jordan.`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$\left(\begin{array}{ccc|c}1&2&-1&1\\2&1&1&8\\1&-1&2&5\end{array}\right)\xrightarrow{R_2-2R_1,\,R_3-R_1}\left(\begin{array}{ccc|c}1&2&-1&1\\0&-3&3&6\\0&-3&3&4\end{array}\right)$$`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$\xrightarrow{-\tfrac{1}{3}R_2}\left(\begin{array}{ccc|c}1&2&-1&1\\0&1&-1&-2\\0&-3&3&4\end{array}\right)\xrightarrow{R_3+3R_2}\left(\begin{array}{ccc|c}1&2&-1&1\\0&1&-1&-2\\0&0&0&-2\end{array}\right)$$`}</p>
              <p>{String.raw`The bottom row reads $0 = -2$. `}<b>No solution — inconsistent.</b>{String.raw` Gauss–Jordan stops here: there is nothing to RREF. Notice: $\operatorname{rank}(A) = 2 < 3 = \operatorname{rank}(A\mid b)$.`}</p>
            </Example>

            <Example n="8" title="Gauss–Jordan — unique solution">
              <Reveal label="Show worked solution">
                <p style={{margin:'0 0 10px'}}>{String.raw`Solve $\begin{cases} 2x + y - z = 8 \\ -3x - y + 2z = -11 \\ -2x + y + 2z = -3 \end{cases}$ (this is the system from Lecture 2, now carried all the way to RREF).`}</p>
                <p>{String.raw`We showed REF was $\left(\begin{array}{ccc|c}1&\tfrac12&-\tfrac12&4\\0&1&1&2\\0&0&1&-1\end{array}\right)$. Now the backward pass:`}</p>
                <p>{String.raw`$R_2 - R_3$ (zero above pivot in col 3): $\left(\begin{array}{ccc|c}1&\tfrac12&-\tfrac12&4\\0&1&0&3\\0&0&1&-1\end{array}\right)$. Then $R_1 + \tfrac12 R_3$:`}</p>
                <p>{String.raw`$\left(\begin{array}{ccc|c}1&\tfrac12&0&\tfrac72\\0&1&0&3\\0&0&1&-1\end{array}\right)$. Then $R_1 - \tfrac12 R_2$:`}</p>
                <p>{String.raw`$\left(\begin{array}{ccc|c}1&0&0&2\\0&1&0&3\\0&0&1&-1\end{array}\right)$ — RREF. Read off immediately: $x=2,\,y=3,\,z=-1$. No substitution needed.`}</p>
              </Reveal>
            </Example>

            <Example n="9" title="Gauss–Jordan — infinite solutions" advanced>
              <Reveal label="Show worked solution">
                <p style={{margin:'0 0 10px'}}>{String.raw`Solve $\begin{cases} x + y + z = 6 \\ x + z = 1 \\ 2x + 5y + 2z = 7 \end{cases}$ (Exercise 1.2.5(g) from Lecture 2, now taken to RREF).`}</p>
                <p>{String.raw`From last lecture we found REF: $\left(\begin{array}{ccc|c}1&1&1&6\\0&1&0&5\\0&0&0&0\end{array}\right)$. Wait — let us redo carefully. REF was $\left(\begin{array}{ccc|c}1&1&1&2\\0&1&0&1\\0&0&0&0\end{array}\right)$. Backward pass: $R_1 - R_2$:`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$\left(\begin{array}{ccc|c}1&0&1&1\\0&1&0&1\\0&0&0&0\end{array}\right)\quad\text{— this is RREF.}$$`}</p>
                <p>{String.raw`Row 2: $y = 1$. Row 1: $x + z = 1 \Rightarrow x = 1 - t$. Free variable $z = t$. Solution:`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$\begin{pmatrix}x\\y\\z\end{pmatrix} = \begin{pmatrix}1-t\\1\\t\end{pmatrix}, \quad t \in \mathbb{R}.$$`}</p>
              </Reveal>
            </Example>

            <RedBox title="NEVER divide by an unknown during row operations">
              <p style={{margin:'0 0 8px'}}>{String.raw`It is tempting, when a row contains $ax + by = c$ with $a$ unknown, to "divide by $a$" to get a leading 1. `}<b>Do not do this without knowing $a \ne 0$.</b>{String.raw` If $a = 0$, you have divided by zero — the operation is undefined and everything downstream is garbage.`}</p>
              <p style={{margin:0}}>{String.raw`You may only multiply a row by a nonzero constant. If $a$ is a symbol (like in Exercise 1.3.2), you must consider the case $a = 0$ separately, or avoid dividing altogether until you have established $a \ne 0$. This caution will save you from systematic errors in parametric problems.`}</p>
            </RedBox>

            {/* ─── §5 HOMOGENEOUS SYSTEMS ─── */}
            <Sec id="homo" n="§5">Homogeneous Systems — Welcome to the Scariest Room</Sec>

            <p>Before we define homogeneous systems properly, I want to show you one first.</p>

            <Widget title="The scariest system you have ever seen — what is its solution?">
              <p style={{margin:'0 0 16px',fontSize:'.9rem',color:'#a0a0d0',lineHeight:1.6}}>Four variables, extreme coefficients, nested exponentials. Look at the right-hand side very carefully before panicking.</p>
              <div style={{fontFamily:'monospace',fontSize:'.95rem',lineHeight:2.4,textAlign:'center',color:'#e8e8f0'}}>
                {String.raw`$e^{\pi^{e^{\ln \pi}}} x_1 \;-\; 10^{10^{10}} x_2 \;+\; \sqrt[7]{e^{\pi^2}} \, x_3 \;-\; \dfrac{\pi^e}{e^{\pi}} x_4 \;=\; 0$`}
              </div>
              <div style={{fontFamily:'monospace',fontSize:'.95rem',lineHeight:2.4,textAlign:'center',color:'#e8e8f0'}}>
                {String.raw`$10^{100} x_1 \;+\; e^{e^{e^e}} x_2 \;-\; \pi^{\pi^\pi} x_3 \;+\; \sqrt{2}^{\sqrt{3}} x_4 \;=\; 0$`}
              </div>
              <div style={{fontFamily:'monospace',fontSize:'.95rem',lineHeight:2.4,textAlign:'center',color:'#e8e8f0'}}>
                {String.raw`$\dfrac{e^{\ln 7}}{7^{\ln e}} x_1 \;-\; \pi^{1000} x_2 \;+\; e^{\sqrt{\pi}} x_3 \;+\; 10^{e^\pi} x_4 \;=\; 0$`}
              </div>
              <div style={{fontFamily:'monospace',fontSize:'.95rem',lineHeight:2.4,textAlign:'center',color:'#e8e8f0'}}>
                {String.raw`$\ln(\pi^e) x_1 \;+\; e^{\pi \ln 2} x_2 \;-\; \pi^{e^2} x_3 \;+\; \sqrt[3]{e^{\pi^3}} x_4 \;=\; 0$`}
              </div>
              <div style={{marginTop:'24px',background:'rgba(232,160,32,.12)',border:'1px solid rgba(232,160,32,.3)',borderRadius:'10px',padding:'14px 18px',textAlign:'center',color:'#e8a020',fontFamily:'var(--fm)',fontSize:'.86rem',letterSpacing:'.04em'}}>
                Can you tell me one solution to this system — without doing any work?
              </div>
            </Widget>

            <p>Look at every equation: the right-hand side is <b>zero</b> in all four. Now try {String.raw`$x_1 = x_2 = x_3 = x_4 = 0$`}. Every equation becomes {String.raw`$(\text{something}) \cdot 0 + (\text{something}) \cdot 0 + \cdots = 0$`}. True. Every time. No matter what the coefficients are.</p>

            <p style={{fontSize:'1.1rem',textAlign:'center',fontFamily:'var(--fh)',color:'var(--lec-ink)',margin:'24px 0'}}><b>Welcome to the world of homogeneous systems.</b></p>

            <DefBox term="Homogeneous system" color="teal">
              <p style={{margin:'0 0 8px'}}>{String.raw`A system $AX = b$ is `}<b>homogeneous</b>{String.raw` when $b = 0$ — that is, when every right-hand side is zero. It is written $AX = 0$ and also called the `}<b>null system</b>{String.raw` of $A$.`}</p>
              <p style={{margin:0}}>{String.raw`The solution $X = 0$ (all variables zero) is called the `}<b>trivial solution</b>{String.raw` and always exists. Any other solution is called a `}<b>non-trivial solution</b>.</p>
            </DefBox>

            <Callout icon="🔑" title="No-solution is impossible for a homogeneous system" color="teal">
              {String.raw`For $AX = b$ with $b \ne 0$, inconsistency is possible. But $AX = 0$ always has $X = 0$. So the only question is: is $X = 0$ the `}<em>only</em>{String.raw` solution, or are there non-trivial ones? The trichotomy collapses: a homogeneous system has either `}<b>exactly one solution</b>{String.raw` ($X = 0$ only) or `}<b>infinitely many</b>{String.raw`. That is it.`}
            </Callout>

            <p>When does {String.raw`$AX = 0$`} have a non-trivial solution?</p>

            <DefBox term="When non-trivial solutions exist" color="violet">
              <p style={{margin:0}}>{String.raw`For an $m \times n$ homogeneous system $AX = 0$: a non-trivial solution exists if and only if `}<b>{String.raw`$\operatorname{rank}(A) < n$`}</b>{String.raw` (fewer pivots than variables). Equivalently, the REF has at least one free variable. If $\operatorname{rank}(A) = n$, the only solution is $X = 0$.`}</p>
            </DefBox>

            <Callout icon="📌" title="Important corollary — more unknowns than equations" color="amber">
              {String.raw`If $m < n$ (more unknowns than equations), then $\operatorname{rank}(A) \le m < n$, so rank is automatically less than $n$. Therefore: `}<b>any homogeneous system with more unknowns than equations has a non-trivial solution.</b>
            </Callout>

            <RedBox title="Don't guess — convert to REF first">
              <p style={{margin:0}}>{String.raw`You might look at a homogeneous system and think "the coefficients are small, probably only the trivial solution." That intuition is unreliable. Always reduce to REF to count pivots. If $\operatorname{rank}(A) = n$, only $X=0$; if $\operatorname{rank}(A) < n$, non-trivial solutions exist. `}<b>No guessing.</b></p>
            </RedBox>

            {/* EXERCISE 1.3.2 */}
            <Example n="10" title="Exercise 1.3.2 — For which a does the system have a non-trivial solution?" advanced>
              <p style={{textAlign:'center'}}>{String.raw`$$\begin{cases} x - 2y + z = 0 \\ x + ay - 3z = 0 \\ -x + 6y - 5z = 0 \end{cases}$$`}</p>
              <Reveal label="Show full solution">
                <p style={{margin:'0 0 10px'}}>{String.raw`We need $\operatorname{rank}(A) < 3$, i.e. $\det(A) = 0$. Let us reduce instead (good practice).`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$\left(\begin{array}{ccc|c}1&-2&1&0\\1&a&-3&0\\-1&6&-5&0\end{array}\right)\xrightarrow{R_2-R_1,\,R_3+R_1}\left(\begin{array}{ccc|c}1&-2&1&0\\0&a+2&-4&0\\0&4&-4&0\end{array}\right)$$`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$\xrightarrow{\tfrac{1}{4}R_3}\left(\begin{array}{ccc|c}1&-2&1&0\\0&a+2&-4&0\\0&1&-1&0\end{array}\right)\xrightarrow{R_{23}}\left(\begin{array}{ccc|c}1&-2&1&0\\0&1&-1&0\\0&a+2&-4&0\end{array}\right)$$`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$\xrightarrow{R_3-(a+2)R_2}\left(\begin{array}{ccc|c}1&-2&1&0\\0&1&-1&0\\0&0&-4+(a+2)&0\end{array}\right) = \left(\begin{array}{ccc|c}1&-2&1&0\\0&1&-1&0\\0&0&a-2&0\end{array}\right)$$`}</p>
                <p>{String.raw`For a non-trivial solution we need rank$(A) < 3$, so the bottom pivot must vanish: `}<b>{String.raw`$a - 2 = 0 \Rightarrow a = 2$`}</b>.</p>
                <p>{String.raw`With $a = 2$: the bottom row is all zero. Free variable: $z = t$. Row 2: $y = z = t$. Row 1: $x = 2y - z = 2t - t = t$.`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$\begin{pmatrix}x\\y\\z\end{pmatrix} = t\begin{pmatrix}1\\1\\1\end{pmatrix}, \quad t \in \mathbb{R}.$$`}</p>
                <p>The entire line through the origin in direction $(1,1,1)^T$ is a solution. For any other value of $a$, the only solution is the trivial one.</p>
              </Reveal>
            </Example>

            {/* ─── §6 LINEAR COMBINATIONS ─── */}
            <Sec id="lincomb" n="§6">Linear Combinations</Sec>

            <p>We have been solving systems all lecture. But solving {String.raw`$AX = b$`} can be read another way — as asking whether {String.raw`$b$`} can be built as a weighted sum of the columns of {String.raw`$A$`}. This reading leads to one of the most important ideas in all of mathematics.</p>

            <Callout icon="💡" title="Motivation — why linear combinations?" color="violet">
              Think of vectors as arrows. You have a collection of arrows pointing in different directions. A linear combination asks: by stretching, compressing, flipping, and adding those arrows, can you reach a given target point? The answer determines whether the target is "reachable" from your starting collection — a question that underlies computer graphics, signal processing, machine learning, and quantum mechanics.
            </Callout>

            <DefBox term="Linear combination" color="amber">
              <p style={{margin:0}}>{String.raw`Given vectors $\mathbf{v}_1, \mathbf{v}_2, \dots, \mathbf{v}_k$, a `}<b>linear combination</b>{String.raw` is any expression $c_1\mathbf{v}_1 + c_2\mathbf{v}_2 + \cdots + c_k\mathbf{v}_k$ where $c_1, c_2, \dots, c_k$ are scalars (real numbers). The set of `}<i>all</i>{String.raw` linear combinations of $\mathbf{v}_1, \dots, \mathbf{v}_k$ is called their `}<b>span</b>.</p>
            </DefBox>

            <Example n="11" title="Linear combinations in ℝ²">
              <p>{String.raw`Let $\mathbf{u} = \begin{pmatrix}1\\0\end{pmatrix}$ and $\mathbf{v} = \begin{pmatrix}0\\1\end{pmatrix}$. Then $3\mathbf{u} + 5\mathbf{v} = \begin{pmatrix}3\\5\end{pmatrix}$. In fact $\begin{pmatrix}x\\y\end{pmatrix} = x\mathbf{u} + y\mathbf{v}$ for `}<i>any</i>{String.raw` real $x, y$. Every vector in $\mathbb{R}^2$ is a linear combination of $\mathbf{u}$ and $\mathbf{v}$. The pair $\{(1,0)^T,(0,1)^T\}$ is the `}<b>standard basis</b>{String.raw` — the coordinate axes themselves.`}</p>
            </Example>

            <Example n="12" title="Not all sets span everything">
              <p>{String.raw`Let $\mathbf{a} = \begin{pmatrix}1\\2\end{pmatrix}$ and $\mathbf{b} = \begin{pmatrix}2\\4\end{pmatrix} = 2\mathbf{a}$. Since $\mathbf{b}$ is a multiple of $\mathbf{a}$, every linear combination $c_1\mathbf{a} + c_2\mathbf{b} = (c_1+2c_2)\mathbf{a}$ stays on the line through $\mathbf{a}$. You can never reach $\begin{pmatrix}1\\0\end{pmatrix}$, for example. The span is a `}<i>line</i>{String.raw`, not all of $\mathbb{R}^2$.`}</p>
            </Example>

            <Example n="13" title="Linear combinations in ℝ³">
              <p>{String.raw`The standard basis of $\mathbb{R}^3$ is $\mathbf{e}_1=\begin{pmatrix}1\\0\\0\end{pmatrix}$, $\mathbf{e}_2=\begin{pmatrix}0\\1\\0\end{pmatrix}$, $\mathbf{e}_3=\begin{pmatrix}0\\0\\1\end{pmatrix}$. Any vector $\begin{pmatrix}a\\b\\c\end{pmatrix} = a\mathbf{e}_1 + b\mathbf{e}_2 + c\mathbf{e}_3$. The components of a vector `}<i>are</i>{String.raw` the coefficients in the linear combination with the standard basis. This is why we write vectors in column form: the column shows the coefficients.`}</p>
            </Example>

            {/* DESCARTES STORY */}
            <Callout icon="🦟" title="The fly that invented the coordinate plane — René Descartes" color="teal">
              <p style={{margin:'0 0 8px'}}>The story goes that Descartes, notorious for sleeping until noon, was lying in bed one morning in 1637 when he noticed a fly crawling on the ceiling of his bedroom. He began wondering: how can I describe precisely where that fly is at any moment? He realised that if he knew the fly's distance from two walls, he could pin down its position completely. Two numbers, two walls — that was enough. He published the idea in an appendix to his <i>Discourse on the Method</i> and the coordinate plane — now called the Cartesian plane in his honour — was born.</p>
              <p style={{margin:0}}>The moral: the desire to locate a point precisely in space is exactly what linear combinations formalise. Every point in the plane <em>is</em> a linear combination of the two coordinate directions. Every point in space is a linear combination of three. Descartes, thanks to one lazy morning and one annoying fly, gave us the language.
              </p>
            </Callout>

            {/* MAIN QUESTION */}
            <Example n="14" title="Can V be written as a linear combination of X, Y, Z?" advanced>
              <p>{String.raw`Let $X = \begin{pmatrix}2\\1\\-1\end{pmatrix}$, $Y = \begin{pmatrix}1\\0\\1\end{pmatrix}$, $Z = \begin{pmatrix}1\\1\\-2\end{pmatrix}$. Can $V = \begin{pmatrix}0\\1\\3\end{pmatrix}$ be written as $aX + bY + cZ = V$?`}</p>
              <p>Setting up the system:{String.raw` $a\begin{pmatrix}2\\1\\-1\end{pmatrix}+b\begin{pmatrix}1\\0\\1\end{pmatrix}+c\begin{pmatrix}1\\1\\-2\end{pmatrix}=\begin{pmatrix}0\\1\\3\end{pmatrix}$`} gives three equations.</p>
              <Reveal label="Show full solution">
                <p style={{margin:'0 0 10px'}}>{String.raw`The augmented matrix, column $j$ being $\mathbf{v}_j$:`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$\left(\begin{array}{ccc|c}2&1&1&0\\1&0&1&1\\-1&1&-2&3\end{array}\right)\xrightarrow{R_{12}}\left(\begin{array}{ccc|c}1&0&1&1\\2&1&1&0\\-1&1&-2&3\end{array}\right)$$`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$\xrightarrow{R_2-2R_1,\,R_3+R_1}\left(\begin{array}{ccc|c}1&0&1&1\\0&1&-1&-2\\0&1&-1&4\end{array}\right)\xrightarrow{R_3-R_2}\left(\begin{array}{ccc|c}1&0&1&1\\0&1&-1&-2\\0&0&0&6\end{array}\right)$$`}</p>
                <p>{String.raw`Bottom row: $0 = 6$. Inconsistent. $\operatorname{rank}(A) = 2 < 3 = \operatorname{rank}(A\mid b)$.`}</p>
                <p><b>{String.raw`$V$ is NOT a linear combination of $X, Y, Z$`}</b>{String.raw`. Geometrically: $X, Y, Z$ span only a `}<em>plane</em>{String.raw` in $\mathbb{R}^3$ (their coefficient matrix has rank 2, not 3), and $V$ happens to lie off that plane.`}</p>
              </Reveal>
            </Example>

            {/* ─── §7 GEOMETRY ─── */}
            <Sec id="geometry" n="§7">Geometric Picture — Homogeneous vs Non-Homogeneous</Sec>

            <p>Everything we have done algebraically has a clean geometric picture. Understanding it will make the rest of the course click.</p>

            <p style={{fontFamily:'var(--fh)',fontSize:'1.25rem',color:'var(--lec-ink)',margin:'32px 0 12px',fontWeight:600}}>In 2D — two lines</p>

            <div className="sbs">
              <div className="sbs-card">
                <div className="sbs-label">Homogeneous — Ax = 0</div>
                <p style={{fontSize:'.9rem',color:'var(--lec-ink2)',lineHeight:1.7,margin:0}}>{String.raw`Every line $ax + by = 0$ passes through the origin $(0,0)$. The trivial solution $x=y=0$ is always on the line. Two such lines always share the origin, so they are always consistent. They either coincide (infinitely many solutions — a whole line through the origin) or cross only at the origin (unique solution = trivial only).`}</p>
              </div>
              <div className="sbs-card">
                <div className="sbs-label">Non-homogeneous — Ax = b, b ≠ 0</div>
                <p style={{fontSize:'.9rem',color:'var(--lec-ink2)',lineHeight:1.7,margin:0}}>{String.raw`The line $ax + by = c$ with $c \ne 0$ is a `}<em>shift</em>{String.raw` of the line $ax + by = 0$ — same slope, moved away from the origin. Two non-homogeneous lines may be parallel (no solution), cross at a single point (unique solution), or coincide (infinitely many). Inconsistency is possible — a new phenomenon compared to the homogeneous case.`}</p>
              </div>
            </div>

            {/* paste this block inside §7, right after the closing </div> of the
                existing "In 2D — two lines" .sbs comparison block, and before the
                "Generalisation to higher dimensions" heading */}

            <p>Here is the same idea drawn out. On the left, two <b>homogeneous</b> lines — both forced through the origin. On the right, two <b>non-homogeneous</b> lines that have floated off the origin:</p>

            <HomoNonHomoSVG/>

            <p>Now make it move. The slider below controls the constant <span style={{fontFamily:'var(--fm)'}}>c</span> in {String.raw`$x - y = c$`}. Watch the amber line slide while its homogeneous twin (dashed teal) stays pinned at the origin. The purple arrow is the shift — your particular solution {String.raw`$\mathbf{x}_p$`}:</p>

            <ShiftLineApplet/>

            <p>This is the whole story of §7 in one picture: a non-homogeneous solution set is just the homogeneous one, <b>picked up and carried</b> by a particular solution. Set {String.raw`$c = 0$`} and the carry distance shrinks to nothing — the two lines merge.</p>

            <p style={{fontFamily:'var(--fh)',fontSize:'1.25rem',color:'var(--lec-ink)',margin:'32px 0 12px',fontWeight:600}}>Generalisation to higher dimensions</p>

            <DefBox term="Corresponding homogeneous system" color="teal">
              <p style={{margin:0}}>{String.raw`For any system $AX = b$, the `}<b>corresponding homogeneous system</b>{String.raw` is $AX = 0$ — same coefficient matrix $A$, right-hand side replaced by zero. Geometrically, this is the "translation to the origin" of $AX = b$: every solution set of $AX = b$ (if it exists) is a `}<b>translated copy</b>{String.raw` of the solution set of $AX = 0$. One is a flat object through the origin; the other is the same flat object shifted by a particular solution.`}</p>
            </DefBox>

            <p>Simple examples: a line away from the origin in {String.raw`$\mathbb{R}^2$`} corresponds to a line through the origin with the same slope. A plane in {String.raw`$\mathbb{R}^3$`} not through the origin corresponds to the parallel plane through the origin. The homogeneous version always has more symmetry — it includes the origin.</p>

            {/* CLOSING QUESTION */}
            <div style={{ marginTop:'48px', padding:'28px 32px', background:'rgba(155,128,232,.08)', border:'2px solid rgba(155,128,232,.35)', borderRadius:'16px' }}>
              <div style={{ fontFamily:'var(--fm)', fontSize:'.7rem', letterSpacing:'.16em', textTransform:'uppercase', color:'#9b80e8', marginBottom:'12px' }}>Closing question — think about this before Lecture 4</div>
              <p style={{ fontFamily:'var(--fh)', fontSize:'1.5rem', color:'var(--lec-ink)', margin:'0 0 16px', fontWeight:400, lineHeight:1.3 }}>
                If we know a solution to {String.raw`$AX = 0$`}, can we guess a solution to {String.raw`$AX = b$`}?
              </p>
              <p style={{ color:'var(--lec-ink2)', fontSize:'.97rem', lineHeight:1.8, margin:0 }}>
                Suppose {String.raw`$\mathbf{x}_0$`} is any particular solution to {String.raw`$AX = b$`} (we found one by Gaussian elimination), and {String.raw`$\mathbf{x}_h$`} is any solution to the homogeneous system {String.raw`$AX = 0$`}. What is {String.raw`$A(\mathbf{x}_0 + \mathbf{x}_h)$`}? What does this tell you about the structure of the complete solution set of {String.raw`$AX = b$`}? Think about it — we will prove the answer rigorously next lecture.
              </p>
            </div>

            <div style={{ marginTop:'64px', paddingTop:'28px', borderTop:'2px solid var(--lec-border)', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'12px' }}>
              <div style={{ fontFamily:'var(--fm)', fontSize:'.76rem', color:'var(--lec-ink3)', fontStyle:'italic' }}>Lecture 3 — complete</div>
              <div style={{ fontFamily:'var(--fm)', fontSize:'.76rem', color:'var(--lec-ink3)' }}>MATH-120 · Shoaib Khan · LUMS · June 2026</div>
            </div>
          </div>

          {/* FOOTER NAV */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'22px 48px', borderTop:'1px solid var(--lec-border)', background:'var(--lec-paper)', flexWrap:'wrap', gap:'12px' }}>
            <Link href={PREV_HREF} style={{ fontFamily:'var(--fm)', fontSize:'.74rem', letterSpacing:'.08em', textTransform:'uppercase', color:'var(--lec-accent)', textDecoration:'none' }}>← Lecture 2</Link>
            <Link href={NEXT_HREF} style={{ fontFamily:'var(--fm)', fontSize:'.74rem', letterSpacing:'.08em', textTransform:'uppercase', color:'var(--lec-accent)', textDecoration:'none' }}>Lecture 4 →</Link>
          </div>
        </main>
      </div>

      <Footer/>
    </>
  );
}
