'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import Navbar from '../../../../components/Navbar';
import Footer from '../../../../components/Footer';

/* ════════════════════════════════════════════════════════════
   MATH-120 · LECTURE 21
   The Matrix of a Linear Transformation from Basis Images;
   Kernel, Range & the Rank–Nullity (Dimension) Theorem — §2.6–7.2
   Route: /courses/linalg/w6/lec21
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
  { week: 6, n: 21, slug: 'w6/lec21', title: 'Matrix of a Transformation; Kernel & Range', live: true },
];
const THIS_SLUG = 'w6/lec21';
const PREV_HREF  = '/courses/linalg/w6/lec20';
const NEXT_HREF  = '/courses/linalg';

const LEC = {
  course: 'MATH-120 · Linear Algebra',
  number: 'Lecture 21',
  title: 'The Matrix of a Transformation, Kernel, Range & the Dimension Theorem',
  subtitle: 'How to read off a transformation’s matrix from where it sends a basis, and the two subspaces — kernel and range — that measure everything a transformation destroys and everything it can reach',
  date: '15 July 2026',
};

const ANCHORS = [
  ['Matrix from Standard Basis', 'matrix-standard'],
  ['Non-Standard Bases', 'nonstandard-basis'],
  ['Worked: T(5,2)', 'ex-t52'],
  ['Kernel & Range — Definitions', 'ker-range-def'],
  ['The Dimension Theorem', 'dimension-theorem'],
  ['Worked: T : R³→R⁴', 'ex-r3r4'],
  ['Why Study Ker & Range?', 'why-ker-range'],
  ['Shortcut via Rank', 'rank-shortcut'],
  ['Worked: T on M₂₂', 'ex-m22'],
  ['Beyond ℝⁿ', 'beyond-rn'],
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

/* Big visual divider marking a new PART of the lecture */
function PartDivider({ label, title }) {
  return (
    <div style={{ margin:'64px 0 8px', textAlign:'center' }}>
      <div style={{ display:'inline-flex', alignItems:'center', gap:'14px' }}>
        <span style={{ height:'1px', width:'40px', background:'var(--lec-border)' }} />
        <span style={{ fontFamily:'var(--fm)', fontSize:'.66rem', letterSpacing:'.24em', textTransform:'uppercase', color:'#9b80e8', fontWeight:700 }}>{label}</span>
        <span style={{ height:'1px', width:'40px', background:'var(--lec-border)' }} />
      </div>
      <div style={{ fontFamily:'var(--fh)', fontSize:'1.5rem', color:'var(--lec-ink)', marginTop:'8px' }}>{title}</div>
    </div>
  );
}

/* ═══════════════ PAGE ═══════════════ */
export default function Lec21() {
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
        .lec-content mjx-container[display="true"] { overflow-x:auto; overflow-y:hidden; }
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
        <span style={{color:'var(--text2)'}}>Week 6 · Lecture 21</span>
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
            <Link href={PREV_HREF} style={{ display:'flex', alignItems:'center', padding:'0 16px', height:'100%', fontFamily:'var(--fm)', fontSize:'.72rem', color:'var(--lec-ink3)', borderRight:'1px solid var(--lec-border)', whiteSpace:'nowrap', flexShrink:0, textDecoration:'none' }}>← Lecture 20</Link>
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
              <div style={{ marginTop:'12px', fontFamily:'var(--fm)', fontSize:'.72rem', color:'#9b80e8', letterSpacing:'.06em' }}>Week 6 · Wednesday, 15 July 2026</div>
            </div>

            {/* ═══════════ PART A ═══════════ */}
            <PartDivider label="Part A" title="The Matrix of a Transformation" />

            {/* ─── §1 MATRIX FROM STANDARD BASIS ─── */}
            <Sec id="matrix-standard" n="§1">Finding A From Where the Standard Basis Lands</Sec>

            <p>{String.raw`Lecture 20 told us every linear transformation $T:\mathbb{R}^2\to\mathbb{R}^2$ has some matrix $A$ with $T(v)=Av$. Here is the practical question: `}<b>given a transformation, how do you actually find $A$?</b></p>

            <DefBox term="The key method" color="teal">
              <p style={{margin:0}}>{String.raw`The columns of $A$ are exactly the images of the standard basis vectors: $$A = \begin{pmatrix} | & | & & | \\ T(\mathbf{e}_1) & T(\mathbf{e}_2) & \cdots & T(\mathbf{e}_n) \\ | & | & & | \end{pmatrix}.$$ Nothing more is needed — knowing where $T$ sends $\mathbf{e}_1,\ldots,\mathbf{e}_n$ pins down $A$ completely, because those columns `}<i>are</i>{String.raw` the matrix.`}</p>
            </DefBox>

            <Example n="1" title="Building A from T(e1) and T(e2)">
              <p style={{margin:0}}>{String.raw`Suppose $T(1,0)=(2,1)$ and $T(0,1)=(0,1)$. Reading these off as columns:`}</p>
              <p style={{textAlign:'center', margin:'10px 0 0'}}>{String.raw`$$A = \begin{pmatrix}2&0\\1&1\end{pmatrix}.$$`}</p>
              <p style={{margin:'10px 0 0'}}>{String.raw`Check: $A\binom{1}{0}=\binom{2}{1}$ ✓ and $A\binom{0}{1}=\binom{0}{1}$ ✓ — both match exactly.`}</p>
            </Example>

            {/* ─── §2 NON-STANDARD BASES ─── */}
            <Sec id="nonstandard-basis" n="§2">Part B — Generalizing to Non-Standard Bases</Sec>

            <p>{String.raw`The standard basis is convenient, but nothing about the underlying idea requires it. The real principle is broader:`}</p>

            <DefBox term="The general principle" color="amber">
              <p style={{margin:0}}>{String.raw`If we know the image of `}<b>every vector in a basis</b>{String.raw` — any basis, not just the standard one — then we can find the image of `}<i>any</i>{String.raw` vector at all. Write the target vector as a combination of the basis, then apply linearity term by term.`}</p>
            </DefBox>

            {/* ─── §3 WORKED T(5,2) ─── */}
            <Sec id="ex-t52" n="§3">Fully Worked Example — Using a Non-Standard Basis</Sec>

            <Example n="2" title="T:R²→R² with T(1,1)=(2,1), T(0,1)=(2,3). Find T(5,2)." advanced>
              <Reveal label="Show full solution">
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Step 1}$ — express $(5,2)$ as a combination of the given basis $\{(1,1),(0,1)\}$.`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$(5,2) = a(1,1) + b(0,1).$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`From the $x$-component: $a=5$. From the $y$-component: $a+b=2 \Rightarrow b = 2-5=-3$. So`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$(5,2) = 5(1,1) - 3(0,1).$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Step 2 — apply linearity.}$ Since $T$ respects both addition and scaling:`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$T(5,2) = 5\,T(1,1) - 3\,T(0,1) = 5(2,1) - 3(2,3) = (10,5)-(6,9) = (4,-4).$$`}</p>
                <p style={{margin:0}}>{String.raw`$\blacksquare$ $$\boxed{T(5,2) = (4,-4)}$$`}</p>
              </Reveal>
            </Example>

            {/* ═══════════ PART B (KERNEL & RANGE) ═══════════ */}
            <PartDivider label="Parts C–H" title="Kernel, Range & the Dimension Theorem" />

            {/* ─── §4 KER/RANGE DEFINITIONS ─── */}
            <Sec id="ker-range-def" n="§4">Kernel and Range — Definitions</Sec>

            <p>{String.raw`Every linear transformation $T:V\to W$ carries two natural subspaces along with it — one living inside $V$, one living inside $W$.`}</p>

            <DefBox term="Kernel" color="rose">
              <p style={{margin:0}}>{String.raw`$$\operatorname{Ker}(T) := \{\,v\in V : T(v)=\mathbf{0}\,\} \subseteq V$$ — every vector $T$ crushes down to zero. `}<b>Ker(T) is a subspace of $V$.</b></p>
            </DefBox>

            <DefBox term="Range (Image)" color="violet">
              <p style={{margin:0}}>{String.raw`$$\operatorname{Range}(T) := \{\,w\in W : \exists\, v \text{ with } T(v)=w\,\} \subseteq W$$ — every output $T$ can actually produce. `}<b>Range(T) is a subspace of $W$.</b></p>
            </DefBox>

            <Exercise id="C.1" title="Convince yourself — Ker(T) and Range(T) really are subspaces">
              <p style={{margin:0}}>{String.raw`For both sets, check the three subspace criteria: contains the zero vector, closed under addition, closed under scalar multiplication.`}</p>
              <Reveal label="Show the quick check">
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Ker}(T)$: $T(\mathbf{0})=\mathbf{0}$ (Lecture 20), so $\mathbf{0}\in\operatorname{Ker}(T)$. If $T(v_1)=T(v_2)=\mathbf{0}$, then $T(v_1+v_2)=T(v_1)+T(v_2)=\mathbf{0}$, so $v_1+v_2\in\operatorname{Ker}(T)$. If $T(v)=\mathbf{0}$ and $\alpha$ is a scalar, $T(\alpha v)=\alpha T(v)=\mathbf{0}$, so $\alpha v\in\operatorname{Ker}(T)$.`}</p>
                <p style={{margin:0}}>{String.raw`$\textbf{Range}(T)$: $\mathbf{0}=T(\mathbf{0})$, so $\mathbf{0}\in\operatorname{Range}(T)$. If $w_1=T(v_1)$ and $w_2=T(v_2)$, then $w_1+w_2=T(v_1)+T(v_2)=T(v_1+v_2)\in\operatorname{Range}(T)$. If $w=T(v)$ and $\alpha$ is a scalar, $\alpha w = \alpha T(v)=T(\alpha v)\in\operatorname{Range}(T)$. Both closures follow directly from linearity — no new ideas needed.`}</p>
              </Reveal>
            </Exercise>

            {/* ─── §5 DIMENSION THEOREM ─── */}
            <Sec id="dimension-theorem" n="§5">The Dimension (Rank–Nullity) Theorem</Sec>

            <ThmBox title="The Dimension Theorem">
              <p style={{textAlign:'center', margin:0}}>{String.raw`$$\dim(\operatorname{Ker}(T)) + \dim(\operatorname{Range}(T)) = \dim(V).$$`}</p>
            </ThmBox>

            <ThmBox title="Equivalent, in matrix language">
              <p style={{textAlign:'center', margin:0}}>{String.raw`$$\operatorname{Nullity}(A) + \operatorname{Rank}(A) = \#\,\text{columns of } A.$$`}</p>
            </ThmBox>

            <Callout icon="🧠" title="Why this deserves to be believed" color="teal">
              {String.raw`Every dimension of $V$ has to go `}<i>somewhere</i>{String.raw` once you apply $T$: it either gets crushed to zero (contributing to $\dim\operatorname{Ker}(T)$) or it survives as a genuinely new independent direction in the output (contributing to $\dim\operatorname{Range}(T)$). There's no third option and no double-counting, so the two pieces add up to exactly the dimension you started with. This is the single most useful bookkeeping tool for the rest of this lecture — every example below ends with this equation checking out.`}
            </Callout>

            {/* ─── §6 WORKED R3→R4 ─── */}
            <Sec id="ex-r3r4" n="§6">Fully Worked Example — T : ℝ³ → ℝ⁴</Sec>

            <Example n="3" title="T(x,y,z) = (x-y+2z, x+y-z, 2x+z, 2y-3z)" advanced>
              <Reveal label="Show full solution">

                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Step 1 — images of the standard basis.}$`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$T(1,0,0)=(1,1,2,0), \quad T(0,1,0)=(-1,1,0,2), \quad T(0,0,1)=(2,-1,1,-3).$$`}</p>

                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Step 2 — matrix of transformation.}$`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$A = \begin{pmatrix}1&-1&2\\1&1&-1\\2&0&1\\0&2&-3\end{pmatrix}.$$`}</p>

                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Step 3 — the kernel.}$ Since $T(v)=Av$, we have $\operatorname{Ker}(T) \leftrightarrow Av=\mathbf{0}$ — `}<b>the kernel of $T$ is exactly the null space of $A$</b>{String.raw`, and its dimension is called the `}<b>nullity</b>{String.raw` of $A$. Solve $Av=\mathbf{0}$:`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$x-y+2z=0, \quad x+y-z=0, \quad 2x+z=0, \quad 2y-3z=0.$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`From the third equation, $z=-2x$. Substitute into the first: $x-y+2(-2x)=x-y-4x=-3x-y=0 \Rightarrow y=-3x$. Check this against the remaining two equations: the second gives $x+(-3x)-(-2x)=x-3x+2x=0$ ✓, and the fourth gives $2(-3x)-3(-2x)=-6x+6x=0$ ✓ — both satisfied identically, for every $x$. So`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$\operatorname{Ker}(T) = \{(x,-3x,-2x) : x\in\mathbb{R}\} = \operatorname{Span}\{(1,-3,-2)\}, \qquad \dim(\operatorname{Ker}(T)) = 1.$$`}</p>

                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Step 4 — the range.}$ Writing the output as a combination of the columns of $A$:`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$\begin{pmatrix}x-y+2z\\x+y-z\\2x+z\\2y-3z\end{pmatrix} = x\begin{pmatrix}1\\1\\2\\0\end{pmatrix} + y\begin{pmatrix}-1\\1\\0\\2\end{pmatrix} + z\begin{pmatrix}2\\-1\\1\\-3\end{pmatrix}, \qquad \operatorname{Range}(T) = \operatorname{Span}(v_1,v_2,v_3).$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`Row reduce $A$ to find the rank of this spanning set:`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$\begin{pmatrix}1&-1&2\\1&1&-1\\2&0&1\\0&2&-3\end{pmatrix} \xrightarrow[R_3\to R_3-2R_1]{R_2\to R_2-R_1} \begin{pmatrix}1&-1&2\\0&2&-3\\0&2&-3\\0&2&-3\end{pmatrix}.$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`The bottom three rows are now identical, so only $2$ rows are independent: $\operatorname{rank}(A)=2$, and`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$\dim(\operatorname{Range}(T)) = 2.$$`}</p>

                <p style={{margin:0}}>{String.raw`$\textbf{Step 5 — sanity check via rank–nullity.}$ $$\dim(\operatorname{Ker}(T)) + \dim(\operatorname{Range}(T)) = 1+2 = 3 = \dim(\mathbb{R}^3). \qquad \checkmark \quad \blacksquare$$`}</p>
              </Reveal>
            </Example>

            {/* ─── §7 WHY STUDY KER/RANGE ─── */}
            <Sec id="why-ker-range" n="§7">Why Do We Study Ker(T) and Range(T)?</Sec>

            <DefBox term="Q: Why do we study Ker(T) and Range(T)? A:" color="amber">
              <p style={{textAlign:'center', margin:'0 0 8px'}}>{String.raw`$$\dim(\operatorname{Ker}(T)) = 0 \iff T \text{ is one-to-one (injective)}.$$`}</p>
              <p style={{textAlign:'center', margin:0}}>{String.raw`$$\dim(\operatorname{Range}(T)) = \dim(W) \iff T \text{ is onto (surjective)}.$$`}</p>
            </DefBox>

            <Callout icon="🔑" title="What these mean in practice" color="teal">
              {String.raw`A `}<b>trivial kernel</b>{String.raw` ($\operatorname{Ker}(T)=\{\mathbf{0}\}$) means $T$ never collapses two different inputs onto the same output — nothing gets lost, so $T$ is injective. A `}<b>full-dimensional range</b>{String.raw` ($\operatorname{Range}(T)=W$) means $T$ can reach every point of the codomain — nothing is unreachable, so $T$ is surjective. Together, if `}<i>both</i>{String.raw` hold (and $\dim V=\dim W$), $T$ is a bijection — an isomorphism — meaning $V$ and $W$ are, for all structural purposes, the same space wearing different labels. Part I closes the lecture with exactly this kind of example.`}
            </Callout>

            {/* ─── §8 SHORTCUT ─── */}
            <Sec id="rank-shortcut" n="§8">The General Shortcut</Sec>

            <ThmBox title="Boxed procedure">
              <p style={{margin:0}}>{String.raw`Given the matrix $A$ of $T:V\to W$, to find $\dim(\operatorname{Ker}\,T)$ and $\dim(\operatorname{Range}\,T)$: `}<b>{String.raw`just find $\operatorname{rank}(A)$.`}</b>{String.raw` If $\operatorname{rank}(A)=r$, then by the dimension theorem:`}</p>
              <p style={{textAlign:'center', margin:'10px 0 0'}}>{String.raw`$$\dim(\operatorname{Ker}(T)) = \dim(V) - r.$$`}</p>
            </ThmBox>

            <p>{String.raw`One row reduction answers both questions at once — $\operatorname{rank}(A)$ `}<i>is</i>{String.raw` $\dim(\operatorname{Range}(T))$ directly, and subtracting from $\dim(V)$ hands you $\dim(\operatorname{Ker}(T))$ for free.`}</p>

            {/* ─── §9 WORKED M22 ─── */}
            <Sec id="ex-m22" n="§9">Fully Worked Example — T : M₂₂ → M₂₂</Sec>

            <Example n="4" title="T([a,b;c,d]) = [a+b, b+c; c+d, d+a]" advanced>
              <Reveal label="Show full solution">

                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Step 1 — the matrix of }T$, relative to the standard basis, ordering coordinates as $(a,b,c,d)$:`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$A = \begin{pmatrix}1&1&0&0\\0&1&1&0\\0&0&1&1\\1&0&0&1\end{pmatrix}$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`(For $\operatorname{Ker}(T)$, we solve $Ax=\mathbf{0}$ after converting the matrix equation $T\!\begin{pmatrix}a&b\\c&d\end{pmatrix}=\mathbf{0}$ into this coordinate-vector form.)`}</p>

                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Step 2 — row reduce to find the rank.}$`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$\begin{pmatrix}1&1&0&0\\0&1&1&0\\0&0&1&1\\1&0&0&1\end{pmatrix} \xrightarrow{R_4\to R_4-R_1} \begin{pmatrix}1&1&0&0\\0&1&1&0\\0&0&1&1\\0&-1&0&1\end{pmatrix} \xrightarrow{R_4\to R_4+R_2} \begin{pmatrix}1&1&0&0\\0&1&1&0\\0&0&1&1\\0&0&1&1\end{pmatrix}.$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`Row $4$ now duplicates Row $3$ — one more subtraction reduces it to a zero row. So $\operatorname{rank}(A)=3$.`}</p>

                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Step 3 — a basis of }\operatorname{Range}(T)$, read off from the three independent (pivot) columns — columns $1,2,3$ of $A$, which are exactly $T(E_{11}), T(E_{12}), T(E_{21})$ — expressed back as $2\times2$ matrices:`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$\left\{ \begin{pmatrix}1&0\\0&1\end{pmatrix},\;\; \begin{pmatrix}1&1\\0&0\end{pmatrix},\;\; \begin{pmatrix}0&1\\1&0\end{pmatrix} \right\}.$$`}</p>

                <p style={{margin:0}}>{String.raw`$\textbf{Step 4 — the kernel dimension.}$ Since $\operatorname{rank}(A)=3$ and $\dim(M_{22})=4$: $$\dim(\operatorname{Ker}(T)) = 4-3 = 1. \qquad \blacksquare$$`}</p>
              </Reveal>
            </Example>

            {/* ═══════════ PART I ═══════════ */}
            <PartDivider label="Part I" title="Beyond the Textbook — Transformations Between Non-ℝⁿ Spaces" />

            {/* ─── §10 BEYOND RN ─── */}
            <Sec id="beyond-rn" n="§10">Two Examples Not in the Book</Sec>

            <p>{String.raw`Everything above used $\mathbb{R}^n$ or a matrix space as domain and codomain. The Ker/Range machinery does not care — it works exactly the same way when the vectors are polynomials.`}</p>

            <Example n="5" title="(a) T : P₃ → R⁴, the coordinate map" advanced>
              <p style={{margin:'0 0 8px'}}>{String.raw`Define $T:P_3\to\mathbb{R}^4$ by $$T(a+bx+cx^2+dx^3) = (a,b,c,d).$$ This is exactly the `}<b>coordinate-vector isomorphism</b>{String.raw` — it says $P_3$ and $\mathbb{R}^4$ are structurally identical, differing only in notation.`}</p>
              <Reveal label="Verify linear, injective, and surjective">
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Linear:}$ $T\big((a_1+b_1x+c_1x^2+d_1x^3)+(a_2+b_2x+c_2x^2+d_2x^3)\big) = (a_1+a_2,b_1+b_2,c_1+c_2,d_1+d_2) = T(\ldots)+T(\ldots)$, and scalars pull straight through each coordinate. Both rules hold.`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Injective:}$ $T(p)=\mathbf{0} \Rightarrow (a,b,c,d)=(0,0,0,0) \Rightarrow p$ is the zero polynomial. So $\operatorname{Ker}(T)=\{0\}$, and by §7, $T$ is one-to-one.`}</p>
                <p style={{margin:0}}>{String.raw`$\textbf{Surjective:}$ every $(a,b,c,d)\in\mathbb{R}^4$ is $T(a+bx+cx^2+dx^3)$ for the obvious choice of polynomial — so $\operatorname{Range}(T)=\mathbb{R}^4$, and by §7, $T$ is onto. $\blacksquare$ Since $\dim P_3=4=\dim\mathbb{R}^4$ and $T$ is both injective and surjective, $T$ is a bijection — $P_3$ and $\mathbb{R}^4$ are, structurally, the same vector space.`}</p>
              </Reveal>
            </Example>

            <Example n="6" title="(b) T : M₂₂ → P₃, a deliberate mirror of the M₂₂ example" advanced>
              <p style={{margin:'0 0 8px'}}>{String.raw`Define $T:M_{22}\to P_3$ by`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$T\begin{pmatrix}a&b\\c&d\end{pmatrix} = (a+b) + (b+c)x + (c+d)x^2 + (d+a)x^3.$$`}</p>
              <p style={{margin:'0 0 8px'}}>{String.raw`This uses exactly the same coefficient pattern as the $M_{22}\to M_{22}$ example in §9 — only now the four output numbers are read off as polynomial coefficients instead of matrix entries. So, relative to the standard bases $\{E_{11},E_{12},E_{21},E_{22}\}$ of $M_{22}$ and $\{1,x,x^2,x^3\}$ of $P_3$, the matrix of $T$ is `}<i>identical</i>{String.raw` to the one in §9:`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$A = \begin{pmatrix}1&1&0&0\\0&1&1&0\\0&0&1&1\\1&0&0&1\end{pmatrix}, \qquad \operatorname{rank}(A)=3 \;\text{ (identical row reduction as before).}$$`}</p>
              <Reveal label="Show the kernel and range, translated into polynomial language">
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Kernel.}$ Solving $a+b=0,\;b+c=0,\;c+d=0,\;d+a=0$: from the first, $b=-a$; from the second, $c=-b=a$; from the third, $d=-c=-a$; check the fourth, $d+a=-a+a=0$ ✓ — consistent for every $a$. So the kernel is one-dimensional, spanned by $(a,b,c,d)=(1,-1,1,-1)$, i.e.`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$\operatorname{Ker}(T) = \operatorname{Span}\left\{\begin{pmatrix}1&-1\\1&-1\end{pmatrix}\right\}, \qquad \dim(\operatorname{Ker}(T))=1.$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`Quick check: $T\begin{pmatrix}1&-1\\1&-1\end{pmatrix} = (1{-}1)+(-1{+}1)x+(1{-}1)x^2+(-1{+}1)x^3 = 0$. ✓`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Range.}$ Exactly as in §9, columns $1,2,3$ of $A$ are the pivot columns, giving a basis of $\operatorname{Range}(T)$ translated into polynomials:`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$\{\,1+x^3,\;\; 1+x,\;\; x+x^2\,\}, \qquad \dim(\operatorname{Range}(T))=3.$$`}</p>
                <p style={{margin:0}}>{String.raw`$\blacksquare$ And the sanity check still closes cleanly: $1+3=4=\dim(M_{22})$.`}</p>
              </Reveal>
            </Example>

            <Callout icon="🔭" title="Where this leads next" color="violet">
              {String.raw`We now have a complete toolkit: build the matrix of any transformation from basis images, and read off injectivity, surjectivity, and dimension all from a single rank computation. The natural next question — one row reduction was doing a lot of work in every example above — is how the matrix of a transformation itself `}<i>changes</i>{String.raw` when you switch to a different basis, which is where change-of-basis and similarity pick the story back up.`}
            </Callout>

            {/* CLOSING */}
            <div style={{ marginTop:'48px', padding:'28px 32px', background:'rgba(56,201,176,.08)', border:'2px solid rgba(56,201,176,.35)', borderRadius:'16px' }}>
              <div style={{ fontFamily:'var(--fm)', fontSize:'.7rem', letterSpacing:'.16em', textTransform:'uppercase', color:'#2a9d8f', marginBottom:'12px' }}>Looking back</div>
              <p style={{ fontFamily:'var(--fh)', fontSize:'1.4rem', color:'var(--lec-ink)', margin:'0 0 16px', fontWeight:400, lineHeight:1.3 }}>
                Where a transformation sends a basis tells you everything; one rank computation tells you the rest.
              </p>
              <p style={{ color:'var(--lec-ink2)', fontSize:'.97rem', lineHeight:1.8, margin:0 }}>
                {String.raw`The matrix of a transformation is built from basis images, its kernel is a null space, its range is a column space, and the dimension theorem ties the two together with no room for anything to go missing or get double-counted. Every worked example today — $\mathbb{R}^2$, $\mathbb{R}^3\to\mathbb{R}^4$, $M_{22}$, $P_3$ — was the exact same three-step recipe, just wearing different notation.`}
              </p>
            </div>

            {/* CLASS ANNOUNCEMENTS — administrative note, kept separate from the mathematics */}
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
              <div style={{ fontFamily:'var(--fm)', fontSize:'.76rem', color:'var(--lec-ink3)', fontStyle:'italic' }}>Lecture 21 — complete</div>
              <div style={{ fontFamily:'var(--fm)', fontSize:'.76rem', color:'var(--lec-ink3)' }}>MATH-120 · Shoaib Khan · LUMS · July 2026</div>
            </div>
          </div>

          {/* FOOTER NAV */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'22px 48px', borderTop:'1px solid var(--lec-border)', background:'var(--lec-paper)', flexWrap:'wrap', gap:'12px' }}>
            <Link href={PREV_HREF} style={{ fontFamily:'var(--fm)', fontSize:'.74rem', letterSpacing:'.08em', textTransform:'uppercase', color:'var(--lec-accent)', textDecoration:'none' }}>← Lecture 20</Link>
            <Link href={NEXT_HREF} style={{ fontFamily:'var(--fm)', fontSize:'.74rem', letterSpacing:'.08em', textTransform:'uppercase', color:'var(--lec-accent)', textDecoration:'none' }}>Course Home →</Link>
          </div>
        </main>
      </div>

      <Footer/>
    </>
  );
}
