'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import Navbar from '../../../../components/Navbar';
import Footer from '../../../../components/Footer';

/* ════════════════════════════════════════════════════════════
   MATH-120 · LECTURE 20
   Introduction to Linear Transformations — §2.6 / §7.1
   Route: /courses/linalg/w6/lec20
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
  { week: 6, n: 19, slug: 'w6/lec19', title: 'Orthogonal Projections, Complements & Symmetric Matrices', live: true },
  { week: 6, n: 20, slug: 'w6/lec20', title: 'Introduction to Linear Transformations', live: true },
];
const THIS_SLUG = 'w6/lec20';
const PREV_HREF  = '/courses/linalg/w6/lec19';
const NEXT_HREF  = '/courses/linalg';

const LEC = {
  course: 'MATH-120 · Linear Algebra',
  number: 'Lecture 20',
  title: 'Introduction to Linear Transformations',
  subtitle: 'The maps that respect addition and scaling — and the surprising fact that every single one of them is secretly just a matrix in disguise',
  date: '14 July 2026',
};

const ANCHORS = [
  ['Quick Recall', 'recall'],
  ['Definition', 'definition'],
  ['Basic Examples', 'basic-examples'],
  ['L(0) = 0', 'zero-property'],
  ['Composition', 'composition'],
  ['The Big Question', 'big-question'],
  ['Matrix of a Transformation', 'matrix-of-transformation'],
  ['Derivative as a Transformation', 'derivative'],
  ['Matrix of D', 'matrix-of-d'],
  ['Reflection Example', 'reflection'],
  ['Is It Linear? — Practice', 'practice-set'],
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
        {open ? 'Hide' : label}
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

/* Inline SVG figure: reflecting (x,y) across the x-axis to (x,-y). */
function ReflectionFigure() {
  return (
    <div style={{ margin:'22px 0', padding:'20px', background:'rgba(255,253,240,.7)', border:'1px solid var(--lec-border)', borderRadius:'14px' }}>
      <svg viewBox="0 0 420 260" style={{ width:'100%', height:'auto', maxWidth:'340px', display:'block', margin:'0 auto' }}>
        <defs>
          <marker id="reflArrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" fill="#4a4030" />
          </marker>
        </defs>
        {/* axes */}
        <line x1="20" y1="130" x2="400" y2="130" stroke="#4a4030" strokeWidth="1.6" markerEnd="url(#reflArrow)" />
        <line x1="70" y1="240" x2="70" y2="20" stroke="#4a4030" strokeWidth="1.6" markerEnd="url(#reflArrow)" />
        <text x="392" y="122" fontSize="12" fontFamily="var(--fm)" fill="#7a6e5e">x</text>
        <text x="76" y="28" fontSize="12" fontFamily="var(--fm)" fill="#7a6e5e">y</text>

        {/* point (x,y) above the axis */}
        <circle cx="260" cy="70" r="4.5" fill="#2a9d8f" />
        <text x="270" y="66" fontSize="14" fontFamily="var(--fh)" fill="#2a9d8f">(x, y)</text>

        {/* its reflection (x,-y) below the axis */}
        <circle cx="260" cy="190" r="4.5" fill="#d85555" />
        <text x="270" y="204" fontSize="14" fontFamily="var(--fh)" fill="#d85555">(x, −y)</text>

        {/* dashed connector through the x-axis */}
        <line x1="260" y1="74" x2="260" y2="186" stroke="#7a6e5e" strokeWidth="1.4" strokeDasharray="5 5" />
        <circle cx="260" cy="130" r="3" fill="#4a4030" />
      </svg>
      <p style={{ textAlign:'center', fontSize:'.85rem', fontStyle:'italic', color:'var(--lec-ink3)', margin:'10px 0 0' }}>
        {String.raw`Reflection across the x-axis keeps the x-coordinate and flips the sign of the y-coordinate — additive and scalar structure both survive the flip, which is exactly what makes it linear.`}
      </p>
    </div>
  );
}

/* ═══════════════ PAGE ═══════════════ */
export default function Lec20() {
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
        .lc-qgrid { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin:22px 0; }
        @media(max-width:640px){ .lc-qgrid{ grid-template-columns:1fr; } }
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
        <span style={{color:'var(--text2)'}}>Week 6 · Lecture 20</span>
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
            <Link href={PREV_HREF} style={{ display:'flex', alignItems:'center', padding:'0 16px', height:'100%', fontFamily:'var(--fm)', fontSize:'.72rem', color:'var(--lec-ink3)', borderRight:'1px solid var(--lec-border)', whiteSpace:'nowrap', flexShrink:0, textDecoration:'none' }}>← Lecture 19</Link>
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
              <div style={{ marginTop:'12px', fontFamily:'var(--fm)', fontSize:'.72rem', color:'#9b80e8', letterSpacing:'.06em' }}>Week 6 · Tuesday, 14 July 2026</div>
            </div>

            {/* ─── §1 QUICK RECALL ─── */}
            <Sec id="recall" n="§1">Quick Recall — and a New Direction</Sec>

            <Callout icon="🔁" title="Where we left off" color="teal">
              {String.raw`Lecture 19 showed that every symmetric matrix orthogonally diagonalizes as $A=PDP^T$, with $P$'s columns the normalized eigenvectors and $D$ the diagonal matrix of eigenvalues — no matrix inversion required, since $P^{-1}=P^T$. Today we step back from any one special class of matrix and ask a much bigger question: `}<i>what is a matrix, really — and is that all there is?</i>
            </Callout>

            <p>{String.raw`One loose thread before we move on. Diagonalization can fail when an eigenvalue `}<b>repeats</b>{String.raw` — say $\lambda=2$ is a root of the characteristic polynomial `}<i>twice</i>{String.raw` (its `}<b>algebraic multiplicity</b>{String.raw` is $2$). Whether the matrix is still diagonalizable depends on whether the corresponding eigenspace is also $2$-dimensional (its `}<b>geometric multiplicity</b>{String.raw`) — if the eigenspace comes up "too small," the matrix is not diagonalizable at all. This is a real subtlety worth flagging, though today's lecture goes elsewhere; file it away for when repeated eigenvalues actually show up in a problem.`}</p>

            <Callout icon="🗑️" title="A Junkyard Question" color="violet">
              {String.raw`"I have a matrix in my junkyard of order $2\times5$ — is there any use for it?" Yes, plenty! A $2\times5$ matrix defines a perfectly good linear transformation from $\mathbb{R}^5$ to $\mathbb{R}^2$ — exactly the kind of map that takes $5$-dimensional data and squashes it down to $2$ dimensions you can actually plot on a screen. Non-square matrices like this one are not leftover scrap; they're the workhorses of dimensionality reduction, data compression, and any least-squares system where you have more unknowns than equations (or the reverse). Nothing in a junkyard, mathematically speaking, goes to waste.`}
            </Callout>

            {/* ─── §2 DEFINITION ─── */}
            <Sec id="definition" n="§2">Definition of a Linear Transformation</Sec>

            <DefBox term="Linear transformation" color="teal">
              <p style={{margin:'0 0 8px'}}>{String.raw`A function $L : V \to W$ between two vector spaces is a `}<b>linear transformation</b>{String.raw` if it satisfies both:`}</p>
              <p style={{textAlign:'center', margin:'8px 0'}}>{String.raw`$$L(v_1+v_2) = L(v_1)+L(v_2), \qquad \forall\, v_1,v_2 \in V \quad \textbf{(additivity)}$$`}</p>
              <p style={{textAlign:'center', margin:'8px 0 0'}}>{String.raw`$$L(\alpha v) = \alpha L(v), \qquad \forall\, \alpha\in\mathbb{R},\; v\in V \quad \textbf{(homogeneity)}$$`}</p>
            </DefBox>

            <p>{String.raw`In words: a linear transformation doesn't care whether you combine vectors first and then map them, or map them first and then combine — the two operations commute. This is the exact same pair of rules you've already used dozens of times when checking that a `}<i>set</i>{String.raw` is a subspace; now we're checking that a `}<i>function</i>{String.raw` respects that structure.`}</p>

            {/* ─── §3 BASIC EXAMPLES ─── */}
            <Sec id="basic-examples" n="§3">Three Basic Examples</Sec>

            <StepList items={[
              <span key="e1">{String.raw`$L = \operatorname{id}$, the `}<b>identity map</b>{String.raw`: $L(v)=v$ for every $v$. Trivially linear.`}</span>,
              <span key="e2">{String.raw`$L = 0$, the `}<b>zero map</b>{String.raw`: $L(v)=\mathbf{0}$ for every $v$. Also trivially linear.`}</span>,
              <span key="e3">{String.raw`$L : V\to V$ given by $L(v) = c\cdot v$ for some fixed scalar $c$ — `}<b>uniform scaling</b>{String.raw`. Linear for every choice of $c$ (check: $c(v_1+v_2)=cv_1+cv_2$ and $c(\alpha v)=\alpha(cv)$, both immediate from ordinary scalar-vector algebra).`}</span>,
            ]}/>

            {/* ─── §4 L(0)=0 ─── */}
            <Sec id="zero-property" n="§4">Every Linear Transformation Sends 0 to 0</Sec>

            <DefBox term="A property every linear transformation shares" color="amber">
              <p style={{margin:0}}>{String.raw`$$L(\mathbf{0}) = \mathbf{0} \quad \text{always.}$$ One line proves it: $L(\mathbf{0}) = L(0\cdot v) = 0\cdot L(v) = \mathbf{0}$, using homogeneity with $\alpha=0$.`}</p>
            </DefBox>

            <Callout icon="🔑" title="Why this is a useful quick check" color="teal">
              {String.raw`This gives you an instant `}<i>disqualifying</i>{String.raw` test: if a function sends $\mathbf{0}$ to something other than $\mathbf{0}$, it cannot possibly be linear — no need to check additivity or homogeneity at all. It won't `}<i>confirm</i>{String.raw` linearity (plenty of non-linear functions still send $0\to0$, like $T(x)=x^2$ below), but it's a fast way to rule candidates `}<i>out</i>{String.raw`.`}
            </Callout>

            {/* ─── §5 COMPOSITION ─── */}
            <Sec id="composition" n="§5">Composing Linear Transformations</Sec>

            <p>{String.raw`Given $L : V\to W$ and $T : W \to X$, their `}<b>composition</b>{String.raw` is the map`}</p>
            <p style={{textAlign:'center'}}>{String.raw`$$T\circ L(v) := T(L(v)), \qquad v \in V.$$`}</p>
            <p>{String.raw`Feed a vector into $L$, land in $W$, then feed that result into $T$ to land in $X$. The composition of two linear transformations is itself linear (a short, mechanical check using the same additivity/homogeneity rules on each map in turn) — a fact that will matter as soon as you start chaining transformations together, exactly the way you already chain matrix multiplications.`}</p>

            {/* ─── §6 BIG QUESTION ─── */}
            <Sec id="big-question" n="§6">The Big Structural Question</Sec>

            <p>{String.raw`Here is the question this whole lecture is really building toward: can we comprehend `}<b>all possible</b>{String.raw` linear transformations operating between a space $V$ of dimension $n$ and a space $W$ of dimension $m$?`}</p>
            <p style={{textAlign:'center'}}>{String.raw`$$T : V_n \longrightarrow W_m$$`}</p>

            <Callout icon="✅" title="The answer is yes" color="amber">
              {String.raw`Every linear transformation $T:V_n\to W_m$ has an associated `}<b>matrix of transformation</b>{String.raw` $A$, of size $m\times n$, such that`}
              <p style={{textAlign:'center', margin:'10px 0 0'}}>{String.raw`$$T(v) = \underset{m\times n}{A}\;\underset{n\times1}{v} \;\in\; W, \qquad v\in V$$`}</p>
              {String.raw`— once you fix a basis for $V$ and a basis for $W$ (which basis, and how the matrix depends on that choice, is exactly the subject of Lecture 21). For today: the existence of that matrix is the point.`}
            </Callout>

            {/* ─── §7 MATRIX OF A TRANSFORMATION ─── */}
            <Sec id="matrix-of-transformation" n="§7">Every Matrix Gives Us a Linear Transformation</Sec>

            <DefBox term="Headline takeaway" color="rose">
              <p style={{margin:0, fontSize:'1.1rem', fontFamily:'var(--fh)'}}>{String.raw`Every matrix gives us a linear transformation.`}</p>
            </DefBox>

            <p>{String.raw`This is the flip side of the Big Question above, and together the two directions say something remarkable: `}<b>matrices and linear transformations are the same object</b>{String.raw`, just viewed from two angles. Any $m\times n$ matrix $A$ defines a linear transformation $T(v)=Av$ from $\mathbb{R}^n\to\mathbb{R}^m$ (linearity of matrix multiplication — $A(v_1+v_2)=Av_1+Av_2$ and $A(\alpha v)=\alpha Av$ — is something you've been using since Lecture 5, you just hadn't named it "linear transformation" yet). Conversely, every linear transformation between finite-dimensional spaces comes from `}<i>some</i>{String.raw` matrix. Neither direction is the "real" one — they're the same fact, told twice.`}</p>

            {/* ─── §8 DERIVATIVE ─── */}
            <Sec id="derivative" n="§8">The Derivative as a Linear Transformation</Sec>

            <Callout icon="🧪" title="A crazy little lab (just for fun — don't try this at home)" color="rose">
              {String.raw`Take $x^2-x+4=0$ and differentiate both sides "with respect to $x$," treating $x$ as undetermined: you get $2x-1=0$. Differentiate `}<i>again</i>{String.raw`: you get $2=0$. Something has clearly gone wrong — you cannot legitimately differentiate an equation that only holds for specific root values of $x$ as if $x$ were a free variable. This little absurdity is a useful warning sign, not a technique: differentiation is only a well-behaved operation when applied to `}<i>functions</i>{String.raw` (entire polynomials, say — elements of a vector space), never to a single equation that pins $x$ down to isolated numbers. With that warning issued, let's see what differentiation `}<i>actually</i>{String.raw` is, done properly.`}
            </Callout>

            <p>{String.raw`Differentiation, applied to functions rather than equations, has exactly the property we need:`}</p>
            <p style={{textAlign:'center'}}>{String.raw`$$\frac{d}{dx}\big(a\,f(x)+b\,g(x)\big) = a\,\frac{d}{dx}f(x) + b\,\frac{d}{dx}g(x).$$`}</p>

            <DefBox term="Conclusion" color="teal">
              <p style={{margin:0}}>{String.raw`$\blacksquare$ `}<b>Differentiation is a linear transformation.</b>{String.raw` (By the same reasoning — the integral of a sum is the sum of the integrals, and constants pull straight out — `}<b>integration is linear too</b>{String.raw`.)`}</p>
            </DefBox>

            {/* ─── §9 MATRIX OF D ─── */}
            <Sec id="matrix-of-d" n="§9">A Formal Example — The Derivative Operator on Polynomials</Sec>

            <Example n="1" title="D : P₃ → P₂, the derivative operator" advanced>
              <p>{String.raw`Define $D:P_3\to P_2$ by $$D(a_0+a_1x+a_2x^2+a_3x^3) = a_1 + 2a_2x + 3a_3x^2.$$ Since $D$ is linear, $D$ is a linear transformation — no further check required beyond confirming the two defining rules, which is exactly the sum/constant rule from §8.`}</p>
              <p style={{margin:'12px 0 0'}}>{String.raw`Relative to the standard bases $\{1,x,x^2,x^3\}$ of $P_3$ and $\{1,x,x^2\}$ of $P_2$, coordinates $(a_0,a_1,a_2,a_3)$ map to $(a_1,2a_2,3a_3)$, which is exactly matrix–vector multiplication by`}</p>
              <p style={{textAlign:'center', margin:'10px 0 0'}}>{String.raw`$$D = \begin{pmatrix} 0&1&0&0\\ 0&0&2&0\\ 0&0&0&3 \end{pmatrix}.$$`}</p>
              <p style={{margin:'10px 0 0'}}>{String.raw`Check the shape: $P_3$ has dimension $4$, $P_2$ has dimension $3$, so $D$ is a $3\times4$ matrix — exactly matching the $m\times n$ pattern from §6 ($n=4$, $m=3$). And the arithmetic checks out directly: $D\cdot(a_0,a_1,a_2,a_3)^T = (a_1,\,2a_2,\,3a_3)^T$, which is precisely $a_1+2a_2x+3a_3x^2$ written in coordinates.`}</p>
            </Example>

            {/* ─── §10 REFLECTION ─── */}
            <Sec id="reflection" n="§10">A Geometric Example — Reflection Across the x-Axis</Sec>

            <Example n="2" title="L(x,y) = (x,-y) in R²">
              <p style={{margin:0}}>{String.raw`Define $L:\mathbb{R}^2\to\mathbb{R}^2$ by $L(x,y)=(x,-y)$ — flip every point to its mirror image across the $x$-axis. In matrix form:`}</p>
              <p style={{textAlign:'center', margin:'10px 0'}}>{String.raw`$$\begin{pmatrix}1&0\\0&-1\end{pmatrix}\begin{pmatrix}x\\y\end{pmatrix} = \begin{pmatrix}x\\-y\end{pmatrix}, \qquad L = \begin{pmatrix}1&0\\0&-1\end{pmatrix}.$$`}</p>
              <p style={{margin:0}}>{String.raw`A geometric operation — reflecting — turns out to be nothing more than multiplication by a fixed $2\times2$ matrix.`}</p>
            </Example>

            <ReflectionFigure/>

            {/* ─── §11 PRACTICE SET ─── */}
            <Sec id="practice-set" n="§11">Practice Set — Is It a Linear Transformation?</Sec>

            <p style={{fontStyle:'italic', color:'var(--lec-ink3)'}}>{String.raw`For each map below, check additivity and homogeneity, then classify it as linear or not. Try each one before revealing the discussion.`}</p>

            <div className="lc-qgrid">
              <Example n="Q1" title="Dot product with a fixed vector">
                <p style={{margin:'0 0 10px'}}>{String.raw`$T:\mathbb{R}^3\to\mathbb{R}$, with $w=(1,0,1)$ fixed: $$T(v) = v\cdot w.$$`}</p>
                <Reveal label="Show discussion">
                  <p style={{margin:0}}>{String.raw`$\textbf{Linear.}$ The dot product distributes over vector addition, $\,(v_1+v_2)\cdot w = v_1\cdot w+v_2\cdot w$, and pulls scalars straight out, $\,(\alpha v)\cdot w=\alpha(v\cdot w)$ — both are basic properties of the dot product you proved back in Lecture 18. Both defining rules hold, so $T$ is linear.`}</p>
                </Reveal>
              </Example>

              <Example n="Q2" title="The determinant">
                <p style={{margin:'0 0 10px'}}>{String.raw`$T:M_{2\times2}\to\mathbb{R}$: $$T(A) = \det(A).$$`}</p>
                <Reveal label="Show discussion">
                  <p style={{margin:0}}>{String.raw`$\textbf{Not linear.}$ Homogeneity already fails: for a $2\times2$ matrix, $\det(2A) = 4\det(A)$ (each of the two rows contributes a factor of $2$), not $2\det(A)$, unless $\det(A)=0$. One counterexample is enough — $T$ is not a linear transformation.`}</p>
                </Reveal>
              </Example>

              <Example n="Q3" title="Squaring">
                <p style={{margin:'0 0 10px'}}>{String.raw`$T:\mathbb{R}\to\mathbb{R}$: $$T(x) = x^2.$$`}</p>
                <Reveal label="Show discussion">
                  <p style={{margin:0}}>{String.raw`$\textbf{Not linear}$ — and cleanly so, on both counts. Homogeneity fails: $T(2x)=(2x)^2=4x^2$, but $2T(x)=2x^2$ — these agree only when $x=0$. Additivity fails too: $T(x+y)=(x+y)^2=x^2+2xy+y^2 \neq x^2+y^2=T(x)+T(y)$ in general. A textbook counterexample worth remembering.`}</p>
                </Reveal>
              </Example>

              <Example n="Q4" title="The trace">
                <p style={{margin:'0 0 10px'}}>{String.raw`$T:M_{2\times2}\to\mathbb{R}$: $$T(A) = \operatorname{tr}(A).$$`}</p>
                <Reveal label="Show discussion">
                  <p style={{margin:0}}>{String.raw`$\textbf{Linear.}$ The trace is just the sum of the diagonal entries, and sums distribute cleanly under matrix addition and scalar multiplication: $\operatorname{tr}(A+B)=\operatorname{tr}(A)+\operatorname{tr}(B)$ and $\operatorname{tr}(cA)=c\operatorname{tr}(A)$. Both rules hold, so $T$ is linear.`}</p>
                </Reveal>
              </Example>
            </div>

            <p style={{fontSize:'.82rem', fontStyle:'italic', color:'var(--lec-ink3)', textAlign:'center'}}>{String.raw`Cf. Nicholson §2.6 — Linear Transformations in ℝⁿ.`}</p>

            <Callout icon="🔭" title="Where this leads next" color="violet">
              {String.raw`We've established that a matrix `}<i>exists</i>{String.raw` for every linear transformation — Lecture 21 is about actually `}<i>finding</i>{String.raw` it, by tracking where a transformation sends each basis vector. From there, two new subspaces attached to every linear transformation — its `}<b>kernel</b>{String.raw` and `}<b>range</b>{String.raw` — tell us exactly what a transformation destroys and what it can produce, echoing the null space and image you already met for plain matrices back in Lecture 14.`}
            </Callout>

            {/* CLOSING */}
            <div style={{ marginTop:'48px', padding:'28px 32px', background:'rgba(56,201,176,.08)', border:'2px solid rgba(56,201,176,.35)', borderRadius:'16px' }}>
              <div style={{ fontFamily:'var(--fm)', fontSize:'.7rem', letterSpacing:'.16em', textTransform:'uppercase', color:'#2a9d8f', marginBottom:'12px' }}>Looking back</div>
              <p style={{ fontFamily:'var(--fh)', fontSize:'1.4rem', color:'var(--lec-ink)', margin:'0 0 16px', fontWeight:400, lineHeight:1.3 }}>
                Additivity and homogeneity are the only two rules that matter — and every function obeying them, however exotic, turns out to be a matrix wearing a disguise.
              </p>
              <p style={{ color:'var(--lec-ink2)', fontSize:'.97rem', lineHeight:1.8, margin:0 }}>
                {String.raw`Differentiation, reflection, projection, rotation, dot products with a fixed vector — wildly different-looking operations, all secretly the same kind of object. That unification is the entire point of calling them all "linear transformations" instead of studying each one separately.`}
              </p>
            </div>

            {/* ANNOUNCEMENTS — administrative note, kept separate from the mathematics */}
            <div style={{ marginTop:'40px', padding:'20px 24px', background:'rgba(0,0,0,.025)', border:'1px dashed var(--lec-border)', borderRadius:'14px' }}>
              <div style={{ fontFamily:'var(--fm)', fontSize:'.68rem', letterSpacing:'.14em', textTransform:'uppercase', color:'var(--lec-ink3)', marginBottom:'10px' }}>📌 Course Administration — not examinable, informational only</div>
              <p style={{ fontSize:'.92rem', color:'var(--lec-ink3)', lineHeight:1.75, margin:'0 0 8px' }}>
                {String.raw`For the upcoming `}<b>Quiz and Exam</b>{String.raw`: sections `}<b>§7.1, §7.2</b>{String.raw`.`}
              </p>
              <p style={{ fontSize:'.92rem', color:'var(--lec-ink3)', lineHeight:1.75, margin:'0 0 8px' }}>
                {String.raw`There is a `}<b>double quiz on Monday</b>{String.raw`, covering §8.1, §8.2, §7.1, and §7.2.`}
              </p>
              <p style={{ fontSize:'.92rem', color:'var(--lec-ink3)', lineHeight:1.75, margin:0 }}>
                {String.raw`A policy referred to in passing as the `}<b>"n−2 policy"</b>{String.raw` was also mentioned — see the official course policy document for the exact details rather than relying on this summary.`}
              </p>
            </div>

            <div style={{ marginTop:'64px', paddingTop:'28px', borderTop:'2px solid var(--lec-border)', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'12px' }}>
              <div style={{ fontFamily:'var(--fm)', fontSize:'.76rem', color:'var(--lec-ink3)', fontStyle:'italic' }}>Lecture 20 — complete</div>
              <div style={{ fontFamily:'var(--fm)', fontSize:'.76rem', color:'var(--lec-ink3)' }}>MATH-120 · Shoaib Khan · LUMS · July 2026</div>
            </div>
          </div>

          {/* FOOTER NAV */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'22px 48px', borderTop:'1px solid var(--lec-border)', background:'var(--lec-paper)', flexWrap:'wrap', gap:'12px' }}>
            <Link href={PREV_HREF} style={{ fontFamily:'var(--fm)', fontSize:'.74rem', letterSpacing:'.08em', textTransform:'uppercase', color:'var(--lec-accent)', textDecoration:'none' }}>← Lecture 19</Link>
            <Link href={NEXT_HREF} style={{ fontFamily:'var(--fm)', fontSize:'.74rem', letterSpacing:'.08em', textTransform:'uppercase', color:'var(--lec-accent)', textDecoration:'none' }}>Course Home →</Link>
          </div>
        </main>
      </div>

      <Footer/>
    </>
  );
}
