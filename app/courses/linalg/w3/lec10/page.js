'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import Navbar from '../../../../components/Navbar';
import Footer from '../../../../components/Footer';

/* ════════════════════════════════════════════════════════════
   MATH-120 · LECTURE 10
   Determinants and Matrix Inverses — Product Theorem, Adjugate & Cramer's Rule
   Route: /courses/linalg/w3/lec10
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
];
const THIS_SLUG = 'w3/lec10';
const PREV_HREF  = '/courses/linalg/w3/lec9';
const NEXT_HREF  = '/courses/linalg/w3/lec11';

const LEC = {
  course: 'MATH-120 · Linear Algebra',
  number: 'Lecture 10',
  title: 'Determinants and Matrix Inverses',
  subtitle: 'The product theorem, the invertibility test, the adjugate formula for the inverse, and Cramer\u2019s rule',
  date: '23 June 2026',
};

const ANCHORS = [
  ['Motivation', 'motivation'],
  ['Product Theorem', 'product'],
  ['Invertibility Test', 'invertibility'],
  ['Transpose', 'transpose'],
  ['Adjugate & Inverse', 'adjugate'],
  ['Cramer\u2019s Rule', 'cramer'],
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

/* ═══════════════ PAGE ═══════════════ */
export default function Lec10() {
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
        <span style={{color:'var(--text2)'}}>Week 3 · Lecture 10</span>
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
            <Link href={PREV_HREF} style={{ display:'flex', alignItems:'center', padding:'0 16px', height:'100%', fontFamily:'var(--fm)', fontSize:'.72rem', color:'var(--lec-ink3)', borderRight:'1px solid var(--lec-border)', whiteSpace:'nowrap', flexShrink:0, textDecoration:'none' }}>← Lecture 9</Link>
            <div style={{ flex:1, display:'flex', justifyContent:'center', alignItems:'center', gap:'4px', overflowX:'auto', padding:'0 8px' }}>
              <span style={{ fontFamily:'var(--fm)', fontSize:'.6rem', letterSpacing:'.12em', textTransform:'uppercase', color:'var(--lec-accent)', flexShrink:0, marginRight:'6px' }}>On this page</span>
              {ANCHORS.map(([label,id],i)=>(
                <span key={id} style={{display:'inline-flex',alignItems:'center',flexShrink:0}}>
                  {i>0&&<span style={{color:'var(--lec-border)',margin:'0 7px'}}>·</span>}
                  <a href={`#${id}`} onClick={e=>jump(e,id)} style={{fontFamily:'var(--fm)',fontSize:'.73rem',color:'var(--lec-ink2)',textDecoration:'none',whiteSpace:'nowrap'}}>{label}</a>
                </span>
              ))}
            </div>
            <Link href={NEXT_HREF} style={{ display:'flex', alignItems:'center', padding:'0 16px', height:'100%', fontFamily:'var(--fm)', fontSize:'.72rem', color:'var(--lec-ink3)', borderLeft:'1px solid var(--lec-border)', whiteSpace:'nowrap', flexShrink:0, textDecoration:'none' }}>Lecture 11 →</Link>
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
            <Sec id="motivation" n="§1">A Short Motivation</Sec>

            <p>So far we have learned how to compute a determinant. But the determinant is much more than a number you grind out by cofactor expansion — it is a detective. A single number tells you whether a matrix can be inverted, how two matrices interact when multiplied, and even lets you write down an exact formula for the solution of a linear system.</p>

            <p>{String.raw`Here is the central question of this lecture. Suppose you multiply two matrices $A$ and $B$. The matrices themselves can be complicated, and computing $AB$ takes work. Yet their determinants behave in the simplest way you could hope for:`}</p>

            <p style={{textAlign:'center'}}>{String.raw`$$\det(AB) = (\det A)(\det B).$$`}</p>

            <p>{String.raw`The determinant of a product is just the product of the determinants. This one clean rule unlocks almost everything else in this section: a test for invertibility, a formula for the inverse, and Cramer's rule for solving systems. Let us build it up step by step.`}</p>

            {/* ─── §2 PRODUCT THEOREM ─── */}
            <Sec id="product" n="§2">The Product Theorem</Sec>

            <ThmBox title="Theorem 3.2.1 — Product Theorem">
              <p style={{margin:'0 0 8px'}}>{String.raw`If $A$ and $B$ are $n\times n$ matrices, then $$\det(AB) = (\det A)(\det B).$$`}</p>
              <p style={{margin:0}}>In words: to find the determinant of a product, you do not have to multiply the matrices first. Just take the determinant of each one and multiply those two numbers.</p>
            </ThmBox>

            <Example n="1" title="Checking the Product Theorem">
              <p>{String.raw`Let $A = \begin{bmatrix} 2 & 1 \\ 3 & 4 \end{bmatrix}$, $B = \begin{bmatrix} 1 & 5 \\ 2 & 1 \end{bmatrix}$.`}</p>
              <p>First the easy way (each determinant separately):</p>
              <p style={{textAlign:'center'}}>{String.raw`$$\det A = (2)(4) - (1)(3) = 5, \qquad \det B = (1)(1) - (5)(2) = -9,$$`}</p>
              <p>{String.raw`so the theorem predicts $\det(AB) = (5)(-9) = -45$.`}</p>
              <p>Now check directly. Multiplying,</p>
              <p style={{textAlign:'center'}}>{String.raw`$$AB = \begin{bmatrix} 2 & 1 \\ 3 & 4 \end{bmatrix}\begin{bmatrix} 1 & 5 \\ 2 & 1 \end{bmatrix} = \begin{bmatrix} 4 & 11 \\ 11 & 19 \end{bmatrix}, \quad \det(AB) = (4)(19) - (11)(11) = 76 - 121 = -45. \;\checkmark$$`}</p>
              <p style={{margin:0}}>Both routes give {String.raw`$-45$`}, but the first one never required multiplying the matrices.</p>
            </Example>

            <Callout icon="💡" title="A handy consequence" color="amber">
              {String.raw`Applying the theorem to $A$ and itself, $\det(A^2) = (\det A)^2$, and more generally $\det(A^k) = (\det A)^k$ for any positive integer $k$. So powers of a matrix have easily predictable determinants.`}
            </Callout>

            {/* ─── §3 INVERTIBILITY ─── */}
            <Sec id="invertibility" n="§3">The Invertibility Test</Sec>

            <p>The Product Theorem immediately answers a question we have been circling around: which matrices have an inverse?</p>

            <ThmBox title="Theorem 3.2.2 — Determinant Test for Invertibility">
              <p style={{margin:0}}>{String.raw`An $n\times n$ matrix $A$ is invertible if and only if $\det A \neq 0$. When $A$ is invertible, $$\det(A^{-1}) = \frac{1}{\det A}.$$`}</p>
            </ThmBox>

            <Callout icon="🧠" title="Why the formula for det(A⁻¹) is true" color="violet">
              {String.raw`If $A$ is invertible then $AA^{-1} = I$. Take determinants of both sides and use the Product Theorem: $\det(A)\det(A^{-1}) = \det(I) = 1$, so $\det(A^{-1}) = \dfrac{1}{\det A}$. Notice this also forces $\det A \neq 0$: if $\det A$ were $0$, the left side would be $0$, never equal to $1$. So a matrix with zero determinant cannot possibly have an inverse.`}
            </Callout>

            <Example n="2" title="Example 3.2.2 — For which c is A invertible?">
              <p>{String.raw`For which values of $c$ does $A = \begin{bmatrix} 1 & 0 & -c \\ -1 & 3 & 1 \\ 0 & 2c & -4 \end{bmatrix}$ have an inverse?`}</p>
              <Reveal label="Show solution">
                <p style={{margin:'0 0 8px'}}>{String.raw`By Theorem 3.2.2, $A$ is invertible exactly when $\det A \neq 0$, so we compute $\det A$. Expand along the first column (it has a zero, which saves work):`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$\det A = 1\begin{vmatrix} 3 & 1 \\ 2c & -4 \end{vmatrix} - (-1)\begin{vmatrix} 0 & -c \\ 2c & -4 \end{vmatrix} + 0.$$`}</p>
                <p style={{margin:'0 0 8px'}}>The two small determinants are</p>
                <p style={{textAlign:'center'}}>{String.raw`$$\begin{vmatrix} 3 & 1 \\ 2c & -4 \end{vmatrix} = -12 - 2c, \qquad \begin{vmatrix} 0 & -c \\ 2c & -4 \end{vmatrix} = 0 - (-c)(2c) = 2c^2.$$`}</p>
                <p style={{margin:'0 0 8px'}}>Therefore</p>
                <p style={{textAlign:'center'}}>{String.raw`$$\det A = (-12 - 2c) + (2c^2) = 2c^2 - 2c - 12 = 2(c-3)(c+2).$$`}</p>
                <p style={{margin:0}}>{String.raw`This is zero when $c = 3$ or $c = -2$. Hence $A$ is invertible for every $c$ except $c = 3$ and $c = -2$.`}</p>
              </Reveal>
            </Example>

            {/* ─── §4 TRANSPOSE ─── */}
            <Sec id="transpose" n="§4">Determinant of the Transpose</Sec>

            <ThmBox title="Theorem 3.2.3">
              <p style={{margin:0}}>{String.raw`If $A$ is any square matrix, then $\det(A^{\mathsf{T}}) = \det A$.`}</p>
            </ThmBox>

            <p>This is the reason that every property we proved for rows also holds for columns: transposing turns rows into columns without changing the determinant.</p>

            <Example n="3" title="Transpose has the same determinant">
              <p>{String.raw`Let $A = \begin{bmatrix} 2 & 1 & 3 \\ 0 & 4 & 1 \\ 5 & 0 & -2 \end{bmatrix}$, $A^{\mathsf{T}} = \begin{bmatrix} 2 & 0 & 5 \\ 1 & 4 & 0 \\ 3 & 1 & -2 \end{bmatrix}$.`}</p>
              <p>{String.raw`We computed $\det A = -81$ earlier (Lecture 9). Expanding $\det A^{\mathsf{T}}$ along its first column:`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$\det A^{\mathsf{T}} = 2\begin{vmatrix} 4 & 0 \\ 1 & -2 \end{vmatrix} - 1\begin{vmatrix} 0 & 5 \\ 1 & -2 \end{vmatrix} + 3\begin{vmatrix} 0 & 5 \\ 4 & 0 \end{vmatrix} = 2(-8) - 1(-5) + 3(-20) = -16 + 5 - 60 = -81.$$`}</p>
              <p style={{margin:0}}>{String.raw`So $\det A^{\mathsf{T}} = \det A = -81$. The point is that you never get a different answer by transposing.`}</p>
            </Example>

            <Callout icon="📈" title="Application" color="teal">
              {String.raw`Combined with the Product Theorem, Theorem 3.2.3 gives $\det(A^{\mathsf{T}}A) = \det(A^{\mathsf{T}})\det(A) = (\det A)^2 \geq 0$. So a matrix of the form $A^{\mathsf{T}}A$ always has a non-negative determinant — a fact used constantly in statistics and least-squares problems.`}
            </Callout>

            {/* ─── §5 ADJUGATE ─── */}
            <Sec id="adjugate" n="§5">The Adjugate and a Formula for the Inverse</Sec>

            <p>{String.raw`We now build a genuine formula for $A^{-1}$ — not an algorithm, but an explicit expression using determinants. To get there we need one new idea: the adjugate. Let us assemble it slowly.`}</p>

            <p style={{margin:'4px 0'}}>{String.raw`$\textbf{Step 1 — recall the cofactor.}$ For a square matrix $A$, the $(i,j)$-cofactor $c_{ij}(A)$ is the signed minor we met in Lecture 9: delete row $i$ and column $j$, take the determinant of what remains, and attach the sign $(-1)^{i+j}$.`}</p>
            <p style={{margin:'4px 0'}}>{String.raw`$\textbf{Step 2 — collect the cofactors into a matrix.}$ Replace every entry of $A$ by its cofactor. The result is the cofactor matrix, written $[c_{ij}(A)]$. It is the same size as $A$.`}</p>
            <p style={{margin:'4px 0'}}>{String.raw`$\textbf{Step 3 — transpose it.}$ The adjugate of $A$ is the transpose of the cofactor matrix.`}</p>

            <DefBox term="Definition 3.3 — Adjugate" color="teal">
              <p style={{margin:0}}>{String.raw`The adjugate of $A$, written $\operatorname{adj}(A)$, is the transpose of the cofactor matrix: $$\operatorname{adj}(A) = \big[c_{ij}(A)\big]^{\mathsf{T}}.$$`}</p>
            </DefBox>

            <Callout icon="🔁" title="The transpose is easy to forget — here is how to keep it straight" color="violet">
              {String.raw`The cofactor of position $(i,j)$ is computed at row $i$, column $j$, but in the adjugate it goes into row $j$, column $i$. In short: compute cofactors in the normal order, then flip across the main diagonal. For $2\times2$ matrices this gives the familiar swap-and-negate rule: $A = \begin{bmatrix} a & b \\ c & d \end{bmatrix} \Rightarrow \operatorname{adj}(A) = \begin{bmatrix} d & -b \\ -c & a \end{bmatrix}$. (Swap $a$ and $d$; put minus signs on $b$ and $c$.)`}
            </Callout>

            <Example n="4" title="Warm-up — a 2×2 adjugate and inverse">
              <p>{String.raw`Let $D = \begin{bmatrix} 4 & 2 \\ 3 & 1 \end{bmatrix}$. Then $\det D = (4)(1) - (2)(3) = -2$, and by the swap-and-negate rule $\operatorname{adj}(D) = \begin{bmatrix} 1 & -2 \\ -3 & 4 \end{bmatrix}$.`}</p>
              <p>{String.raw`Quick check that $D\operatorname{adj}(D) = (\det D)I$:`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$\begin{bmatrix} 4 & 2 \\ 3 & 1 \end{bmatrix}\begin{bmatrix} 1 & -2 \\ -3 & 4 \end{bmatrix} = \begin{bmatrix} -2 & 0 \\ 0 & -2 \end{bmatrix} = -2I. \;\checkmark$$`}</p>
              <p style={{margin:0}}>{String.raw`So $D^{-1} = \dfrac{1}{-2}\begin{bmatrix} 1 & -2 \\ -3 & 4 \end{bmatrix} = \begin{bmatrix} -\tfrac12 & 1 \\ \tfrac32 & -2 \end{bmatrix}$.`}</p>
            </Example>

            <Example n="5" title="Example 3.2.6 — computing an adjugate" advanced>
              <p>{String.raw`Compute the adjugate of $A = \begin{bmatrix} 1 & 3 & -2 \\ 0 & 1 & 5 \\ -2 & -6 & 7 \end{bmatrix}$ and verify $A(\operatorname{adj}A) = (\operatorname{adj}A)A$.`}</p>
              <Reveal label="Show solution">
                <p style={{margin:'0 0 8px'}}>{String.raw`We need all nine cofactors. Remember the sign pattern $\begin{bmatrix} + & - & + \\ - & + & - \\ + & - & + \end{bmatrix}$.`}</p>
                <p style={{margin:'0 0 4px'}}><b>Row 1 cofactors:</b></p>
                <p style={{textAlign:'center'}}>{String.raw`$$c_{11} = +\begin{vmatrix} 1 & 5 \\ -6 & 7 \end{vmatrix} = 37, \; c_{12} = -\begin{vmatrix} 0 & 5 \\ -2 & 7 \end{vmatrix} = -10, \; c_{13} = +\begin{vmatrix} 0 & 1 \\ -2 & -6 \end{vmatrix} = 2.$$`}</p>
                <p style={{margin:'0 0 4px'}}><b>Row 2 cofactors:</b></p>
                <p style={{textAlign:'center'}}>{String.raw`$$c_{21} = -\begin{vmatrix} 3 & -2 \\ -6 & 7 \end{vmatrix} = -9, \; c_{22} = +\begin{vmatrix} 1 & -2 \\ -2 & 7 \end{vmatrix} = 3, \; c_{23} = -\begin{vmatrix} 1 & 3 \\ -2 & -6 \end{vmatrix} = 0.$$`}</p>
                <p style={{margin:'0 0 4px'}}><b>Row 3 cofactors:</b></p>
                <p style={{textAlign:'center'}}>{String.raw`$$c_{31} = +\begin{vmatrix} 3 & -2 \\ 1 & 5 \end{vmatrix} = 17, \; c_{32} = -\begin{vmatrix} 1 & -2 \\ 0 & 5 \end{vmatrix} = -5, \; c_{33} = +\begin{vmatrix} 1 & 3 \\ 0 & 1 \end{vmatrix} = 1.$$`}</p>
                <p style={{margin:'0 0 8px'}}>The cofactor matrix and its transpose (the adjugate) are</p>
                <p style={{textAlign:'center'}}>{String.raw`$$[c_{ij}] = \begin{bmatrix} 37 & -10 & 2 \\ -9 & 3 & 0 \\ 17 & -5 & 1 \end{bmatrix}, \qquad \operatorname{adj}(A) = [c_{ij}]^{\mathsf{T}} = \begin{bmatrix} 37 & -9 & 17 \\ -10 & 3 & -5 \\ 2 & 0 & 1 \end{bmatrix}.$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`Now multiply (and recall $\det A = 3$):`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$A\operatorname{adj}(A) = \begin{bmatrix} 3 & 0 & 0 \\ 0 & 3 & 0 \\ 0 & 0 & 3 \end{bmatrix} = 3I, \qquad \operatorname{adj}(A)A = \begin{bmatrix} 3 & 0 & 0 \\ 0 & 3 & 0 \\ 0 & 0 & 3 \end{bmatrix} = 3I.$$`}</p>
                <p style={{margin:0}}>{String.raw`Both products equal $(\det A)I = 3I$, exactly as the next theorem promises.`}</p>
              </Reveal>
            </Example>

            <ThmBox title="Theorem 3.2.4 — Adjugate Formula">
              <p style={{margin:'0 0 8px'}}>{String.raw`If $A$ is any square matrix, then $$A(\operatorname{adj}A) = (\det A)I = (\operatorname{adj}A)A.$$`}</p>
              <p style={{margin:0}}>{String.raw`In particular, if $\det A \neq 0$, the inverse of $A$ is $$A^{-1} = \frac{1}{\det A}\operatorname{adj}(A).$$`}</p>
            </ThmBox>

            <Example n="6" title="Finding an inverse with the adjugate formula">
              <p>{String.raw`Let $C = \begin{bmatrix} 2 & 1 & 0 \\ 1 & 3 & 1 \\ 0 & 1 & 2 \end{bmatrix}$. First, $\det C$. Expand along the first column:`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$\det C = 2\begin{vmatrix} 3 & 1 \\ 1 & 2 \end{vmatrix} - 1\begin{vmatrix} 1 & 0 \\ 1 & 2 \end{vmatrix} = 2(5) - 1(2) = 8.$$`}</p>
              <p>Computing the nine cofactors (same method as Example 3.2.6) gives the cofactor matrix, whose transpose is</p>
              <p style={{textAlign:'center'}}>{String.raw`$$\operatorname{adj}(C) = \begin{bmatrix} 5 & -2 & 1 \\ -2 & 4 & -2 \\ 1 & -2 & 5 \end{bmatrix}.$$`}</p>
              <p>By the Adjugate Formula,</p>
              <p style={{textAlign:'center'}}>{String.raw`$$C^{-1} = \frac{1}{8}\begin{bmatrix} 5 & -2 & 1 \\ -2 & 4 & -2 \\ 1 & -2 & 5 \end{bmatrix} = \begin{bmatrix} \tfrac58 & -\tfrac14 & \tfrac18 \\ -\tfrac14 & \tfrac12 & -\tfrac14 \\ \tfrac18 & -\tfrac14 & \tfrac58 \end{bmatrix}.$$`}</p>
            </Example>

            <RedBox title="Is this a good way to compute inverses? No.">
              <p style={{margin:0}}>{String.raw`For a $10\times10$ matrix, the adjugate needs $10^2 = 100$ determinants of $9\times9$ matrices, which is a huge amount of work. Row reduction finds the inverse with far less effort. So Theorem 3.2.4 is not a practical numerical tool. Its value is theoretical: it gives an exact, closed-form expression for $A^{-1}$ that we can reason about in proofs.`}</p>
            </RedBox>

            {/* ─── §6 CRAMER ─── */}
            <Sec id="cramer" n="§6">Cramer's Rule</Sec>

            <p>{String.raw`$\textbf{The need.}$ Suppose you have a square system $A\mathbf{x} = \mathbf{b}$ with $\det A \neq 0$. We already know it has a unique solution. Sometimes, though, you only want one of the unknowns — say $x_1$ — and you would like a direct formula for it rather than solving the whole system. Cramer's rule provides exactly that: a determinant formula for each variable, one at a time.`}</p>

            <ThmBox title="Theorem 3.2.5 — Cramer's Rule">
              <p style={{margin:'0 0 8px'}}>{String.raw`Let $A\mathbf{x} = \mathbf{b}$ be a system of $n$ equations in $n$ unknowns with $\det A \neq 0$. Then the unique solution is given by $$x_i = \frac{\det A_i}{\det A}, \qquad i = 1, 2, \ldots, n,$$ where $A_i$ is the matrix obtained from $A$ by replacing its $i$-th column with the column of constants $\mathbf{b}$.`}</p>
              <p style={{margin:0}}>{String.raw`In plain language: to find $x_i$, swap the $i$-th column of $A$ for the right-hand side $\mathbf{b}$, take that determinant, and divide by $\det A$.`}</p>
            </ThmBox>

            <Example n="7" title="Example 3.2.9 — finding just one variable">
              <p>Find {String.raw`$x_1$`} for the system</p>
              <p style={{textAlign:'center'}}>{String.raw`$$5x_1 + x_2 - x_3 = 4, \quad 9x_1 + x_2 - x_3 = 1, \quad x_1 - x_2 + 5x_3 = 2.$$`}</p>
              <Reveal label="Show solution">
                <p style={{margin:'0 0 8px'}}>The coefficient matrix and its first-column replacement are</p>
                <p style={{textAlign:'center'}}>{String.raw`$$A = \begin{bmatrix} 5 & 1 & -1 \\ 9 & 1 & -1 \\ 1 & -1 & 5 \end{bmatrix}, \qquad A_1 = \begin{bmatrix} 4 & 1 & -1 \\ 1 & 1 & -1 \\ 2 & -1 & 5 \end{bmatrix}$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`(the first column of $A$ has been replaced by the constants $4, 1, 2$). Computing, $\det A = -16$, $\det A_1 = 12$. By Cramer's rule,`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$x_1 = \frac{\det A_1}{\det A} = \frac{12}{-16} = -\frac{3}{4}.$$`}</p>
                <p style={{margin:0}}>{String.raw`Notice we found $x_1$ without ever computing $x_2$ or $x_3$.`}</p>
              </Reveal>
            </Example>

            <Example n="8" title="Solving a 2×2 system completely">
              <p>{String.raw`Solve $3x + 2y = 7$, $x - y = 1$. Here $A = \begin{bmatrix} 3 & 2 \\ 1 & -1 \end{bmatrix}$, $\mathbf{b} = \begin{bmatrix} 7 \\ 1 \end{bmatrix}$, and $\det A = (3)(-1) - (2)(1) = -5$.`}</p>
              <p>{String.raw`Replace column 1 by $\mathbf{b}$ for $x$, and column 2 by $\mathbf{b}$ for $y$:`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$x = \frac{\begin{vmatrix} 7 & 2 \\ 1 & -1 \end{vmatrix}}{-5} = \frac{-7-2}{-5} = \frac{-9}{-5} = \frac{9}{5}, \qquad y = \frac{\begin{vmatrix} 3 & 7 \\ 1 & 1 \end{vmatrix}}{-5} = \frac{3-7}{-5} = \frac{-4}{-5} = \frac{4}{5}.$$`}</p>
              <p style={{margin:0}}>{String.raw`So $(x, y) = \left(\tfrac{9}{5}, \tfrac{4}{5}\right)$.`}</p>
            </Example>

            <Example n="9" title="A full 3×3 solution by Cramer's rule" advanced>
              <p>Solve {String.raw`$2x + y + z = 7$, $x - y + z = 2$, $x + 2y - z = 2$.`}</p>
              <Reveal label="Show solution">
                <p style={{margin:'0 0 8px'}}>{String.raw`The coefficient matrix is $A = \begin{bmatrix} 2 & 1 & 1 \\ 1 & -1 & 1 \\ 1 & 2 & -1 \end{bmatrix}$ with $\det A = 3$. Replacing each column in turn by the constants $\mathbf{b} = (7, 2, 2)$:`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$\det A_1 = \begin{vmatrix} 7 & 1 & 1 \\ 2 & -1 & 1 \\ 2 & 2 & -1 \end{vmatrix} = 3, \; \det A_2 = \begin{vmatrix} 2 & 7 & 1 \\ 1 & 2 & 1 \\ 1 & 2 & -1 \end{vmatrix} = 6, \; \det A_3 = \begin{vmatrix} 2 & 1 & 7 \\ 1 & -1 & 2 \\ 1 & 2 & 2 \end{vmatrix} = 9.$$`}</p>
                <p style={{margin:'0 0 8px'}}>Therefore</p>
                <p style={{textAlign:'center'}}>{String.raw`$$x = \frac{3}{3} = 1, \qquad y = \frac{6}{3} = 2, \qquad z = \frac{9}{3} = 3.$$`}</p>
                <p style={{margin:0}}>{String.raw`The solution is $(x, y, z) = (1, 2, 3)$, which you can confirm by substituting back into all three equations.`}</p>
              </Reveal>
            </Example>

            <RedBox title="Is Cramer's rule a good way to solve systems? Again, no.">
              <p style={{margin:0}}>It looks attractive because it can give one variable without the others. But for a large system, computing even one of these determinants costs about as much work as solving the whole system by Gaussian elimination. Worse, Cramer's rule only works when the coefficient matrix is square and invertible, whereas elimination handles every case. Like the adjugate formula, Cramer's rule is a beautiful theoretical result, not a practical computational method.</p>
            </RedBox>

            {/* SUMMARY */}
            <div style={{ marginTop:'40px', padding:'24px 28px', background:'rgba(232,160,32,.08)', border:'2px solid rgba(232,160,32,.35)', borderRadius:'16px' }}>
              <div style={{ fontFamily:'var(--fm)', fontSize:'.7rem', letterSpacing:'.16em', textTransform:'uppercase', color:'#c8860a', marginBottom:'12px' }}>Summary of Lecture 10</div>
              <ul style={{ color:'var(--lec-ink2)', fontSize:'1rem', lineHeight:1.9, margin:0, paddingLeft:'22px' }}>
                <li>{String.raw`$\textbf{Product Theorem:}$ $\det(AB) = (\det A)(\det B)$. Consequence: $\det(A^k) = (\det A)^k$.`}</li>
                <li>{String.raw`$\textbf{Invertibility test:}$ $A$ is invertible $\iff \det A \neq 0$, and then $\det(A^{-1}) = 1/\det A$.`}</li>
                <li>{String.raw`$\textbf{Transpose:}$ $\det(A^{\mathsf{T}}) = \det A$ — this is why row and column rules match.`}</li>
                <li>{String.raw`$\textbf{Adjugate:}$ $\operatorname{adj}(A) = [c_{ij}(A)]^{\mathsf{T}}$ (cofactor matrix, then transpose).`}</li>
                <li>{String.raw`$\textbf{Adjugate Formula:}$ $A(\operatorname{adj}A) = (\det A)I$, so $A^{-1} = \tfrac{1}{\det A}\operatorname{adj}(A)$ when $\det A \neq 0$.`}</li>
                <li>{String.raw`$\textbf{Cramer's Rule:}$ $x_i = \dfrac{\det A_i}{\det A}$, where $A_i$ replaces column $i$ of $A$ by $\mathbf{b}$.`}</li>
              </ul>
            </div>

            {/* ─── §7 EXERCISES ─── */}
            <Sec id="exercises" n="§7">Solutions to Section 3.2 Exercises</Sec>

            <Exercise id="3.2.1" title="Find the adjugate of each matrix">
              <p>{String.raw`$\textbf{Recipe.}$ For each entry compute its cofactor (signed minor), assemble the cofactor matrix, then transpose it to get the adjugate. The sign pattern is $\begin{bmatrix} + & - & + \\ - & + & - \\ + & - & + \end{bmatrix}$.`}</p>
              <Reveal label="Show all four solutions">
                <p style={{margin:'0 0 6px'}}>{String.raw`$\textbf{(a)}\;A = \begin{bmatrix} 5 & 1 & 3 \\ -1 & 2 & 3 \\ 1 & 4 & 8 \end{bmatrix}$. The cofactor matrix and its transpose are`}</p>
                <p style={{textAlign:'center',margin:'2px 0 6px'}}>{String.raw`$[c_{ij}] = \begin{bmatrix} 4 & 11 & -6 \\ 4 & 37 & -19 \\ -3 & -18 & 11 \end{bmatrix}, \; \operatorname{adj}(A) = \begin{bmatrix} 4 & 4 & -3 \\ 11 & 37 & -18 \\ -6 & -19 & 11 \end{bmatrix}.$`}</p>
                <p style={{margin:'2px 0 10px'}}>{String.raw`(For instance $c_{11} = +\begin{vmatrix} 2 & 3 \\ 4 & 8 \end{vmatrix} = 4$, $c_{12} = -\begin{vmatrix} -1 & 3 \\ 1 & 8 \end{vmatrix} = 11$, and so on.)`}</p>
                <p style={{margin:'0 0 6px'}}>{String.raw`$\textbf{(b)}\;B = \begin{bmatrix} 1 & -1 & 2 \\ 3 & 1 & 0 \\ 0 & -1 & 1 \end{bmatrix}$.`}</p>
                <p style={{textAlign:'center',margin:'2px 0 10px'}}>{String.raw`$[c_{ij}] = \begin{bmatrix} 1 & -3 & -3 \\ -1 & 1 & 1 \\ -2 & 6 & 4 \end{bmatrix}, \; \operatorname{adj}(B) = \begin{bmatrix} 1 & -1 & -2 \\ -3 & 1 & 6 \\ -3 & 1 & 4 \end{bmatrix}.$`}</p>
                <p style={{margin:'0 0 6px'}}>{String.raw`$\textbf{(c)}\;C = \begin{bmatrix} 1 & 0 & -1 \\ -1 & 1 & 0 \\ 0 & -1 & 1 \end{bmatrix}$. Every cofactor turns out to be $1$, so $\operatorname{adj}(C) = \begin{bmatrix} 1 & 1 & 1 \\ 1 & 1 & 1 \\ 1 & 1 & 1 \end{bmatrix}$.`}</p>
                <p style={{margin:'2px 0 10px'}}>{String.raw`Watch out: here $\det C = 0$, yet the adjugate is not zero. The adjugate is defined for every square matrix, invertible or not. What fails when $\det C = 0$ is the inverse formula, not the adjugate itself. As a check, $C\operatorname{adj}(C) = (\det C)I = 0$, and indeed multiplying gives the zero matrix.`}</p>
                <p style={{margin:'0 0 6px'}}>{String.raw`$\textbf{(d)}\;D = \tfrac{1}{3}\begin{bmatrix} -1 & 2 & 2 \\ 2 & -1 & 2 \\ 2 & 2 & -1 \end{bmatrix}$. It is easiest to first find the adjugate of the inner integer matrix $M = \begin{bmatrix} -1 & 2 & 2 \\ 2 & -1 & 2 \\ 2 & 2 & -1 \end{bmatrix}$, whose cofactor matrix is symmetric:`}</p>
                <p style={{textAlign:'center',margin:'2px 0 6px'}}>{String.raw`$\operatorname{adj}(M) = \begin{bmatrix} -3 & 6 & 6 \\ 6 & -3 & 6 \\ 6 & 6 & -3 \end{bmatrix}.$`}</p>
                <p style={{margin:'2px 0'}}>{String.raw`Since $D = \tfrac13 M$ is $3\times3$, the scaling rule $\operatorname{adj}(uM) = u^{n-1}\operatorname{adj}(M)$ with $u = \tfrac13$, $n = 3$ gives $u^{n-1} = \left(\tfrac13\right)^2 = \tfrac19$:`}</p>
                <p style={{textAlign:'center',margin:'2px 0 6px'}}>{String.raw`$\operatorname{adj}(D) = \tfrac19\begin{bmatrix} -3 & 6 & 6 \\ 6 & -3 & 6 \\ 6 & 6 & -3 \end{bmatrix} = \tfrac13\begin{bmatrix} -1 & 2 & 2 \\ 2 & -1 & 2 \\ 2 & 2 & -1 \end{bmatrix} = D.$`}</p>
                <p style={{margin:'2px 0 0'}}>{String.raw`A neat coincidence: here $\det D = 1$ and $\operatorname{adj}(D) = D$, so $D^{-1} = \tfrac{1}{\det D}\operatorname{adj}(D) = D$. The matrix is its own inverse.`}</p>
              </Reveal>
            </Exercise>

            <Exercise id="3.2.2" title="Which real values of c make each matrix invertible?">
              <p>A matrix is invertible exactly when its determinant is nonzero, so we compute the determinant as a function of {String.raw`$c$`} and see where it is zero.</p>
              <Reveal label="Show both solutions">
                <p style={{margin:'0 0 6px'}}>{String.raw`$\textbf{(a)}\;A = \begin{bmatrix} 1 & 0 & 3 \\ 3 & -4 & c \\ 2 & 5 & 8 \end{bmatrix}$. Expanding along the first row:`}</p>
                <p style={{textAlign:'center',margin:'2px 0'}}>{String.raw`$\det A = 1\begin{vmatrix} -4 & c \\ 5 & 8 \end{vmatrix} - 0 + 3\begin{vmatrix} 3 & -4 \\ 2 & 5 \end{vmatrix} = (-32 - 5c) + 3(15 + 8) = -32 - 5c + 69 = 37 - 5c.$`}</p>
                <p style={{margin:'2px 0 10px'}}>{String.raw`This is zero when $c = \tfrac{37}{5}$. Hence $A$ is invertible for all $c \neq \tfrac{37}{5}$.`}</p>
                <p style={{margin:'0 0 6px'}}>{String.raw`$\textbf{(b)}\;B = \begin{bmatrix} 0 & c & -c \\ -1 & 2 & 1 \\ c & -c & c \end{bmatrix}$. Expanding along the first column:`}</p>
                <p style={{textAlign:'center',margin:'2px 0'}}>{String.raw`$\det B = 0 - (-1)\begin{vmatrix} c & -c \\ -c & c \end{vmatrix} + c\begin{vmatrix} c & -c \\ 2 & 1 \end{vmatrix} = (c^2 - c^2) + c(c + 2c) = 0 + 3c^2 = 3c^2.$`}</p>
                <p style={{margin:'2px 0 0'}}>{String.raw`This is zero only when $c = 0$. Hence $B$ is invertible for all $c \neq 0$.`}</p>
              </Reveal>
            </Exercise>

            <Exercise id="3.2.3" title="Given det A = −1, det B = 2, det C = 3, evaluate">
              <p>{String.raw`$\textbf{Tools.}$ $\det(XY) = \det X\det Y$, $\det(X^{\mathsf{T}}) = \det X$, and $\det(X^{-1}) = 1/\det X$. Determinants are ordinary numbers, so we can freely rearrange the product.`}</p>
              <Reveal label="Show both solutions">
                <p style={{margin:'0 0 6px'}}>{String.raw`$\textbf{(a)}\;\det(A^3 B C^{\mathsf{T}} B^{-1})$:`}</p>
                <p style={{textAlign:'center',margin:'2px 0'}}>{String.raw`$= (\det A)^3(\det B)(\det C^{\mathsf{T}})(\det B^{-1}) = (\det A)^3(\det B)(\det C)\dfrac{1}{\det B} = (\det A)^3(\det C).$`}</p>
                <p style={{margin:'2px 0 10px'}}>{String.raw`The two $\det B$ factors cancel. Plugging in: $(-1)^3(3) = \mathbf{-3}$.`}</p>
                <p style={{margin:'0 0 6px'}}>{String.raw`$\textbf{(b)}\;\det(B^2 C^{-1} A B^{-1} C^{\mathsf{T}})$:`}</p>
                <p style={{textAlign:'center',margin:'2px 0'}}>{String.raw`$= (\det B)^2\dfrac{1}{\det C}(\det A)\dfrac{1}{\det B}(\det C) = (\det B)^2(\det A)\dfrac{1}{\det B} = (\det B)(\det A).$`}</p>
                <p style={{margin:'2px 0 0'}}>{String.raw`The $\det C$ factors cancel, and one $\det B$ cancels. Plugging in: $(2)(-1) = \mathbf{-2}$.`}</p>
              </Reveal>
            </Exercise>

            <Exercise id="3.2.4" title="Let A and B be invertible n×n matrices. Evaluate">
              <Reveal label="Show both solutions">
                <p style={{margin:'0 0 6px'}}>{String.raw`$\textbf{(a)}\;\det(B^{-1}AB)$:`}</p>
                <p style={{textAlign:'center',margin:'2px 0'}}>{String.raw`$= (\det B^{-1})(\det A)(\det B) = \dfrac{1}{\det B}(\det A)(\det B) = \det A.$`}</p>
                <p style={{margin:'2px 0 10px'}}>{String.raw`(The matrix $B^{-1}AB$ is called a conjugate of $A$; this shows conjugate matrices always have the same determinant.)`}</p>
                <p style={{margin:'0 0 6px'}}>{String.raw`$\textbf{(b)}\;\det(A^{-1}B^{-1}AB)$:`}</p>
                <p style={{textAlign:'center',margin:'2px 0'}}>{String.raw`$= \dfrac{1}{\det A}\cdot\dfrac{1}{\det B}\cdot(\det A)(\det B) = 1.$`}</p>
                <p style={{margin:'2px 0 0'}}>{String.raw`(The matrix $A^{-1}B^{-1}AB$ is the commutator; its determinant is always $1$.)`}</p>
              </Reveal>
            </Exercise>

            <Exercise id="3.2.5" title="A is 3×3 and det(2A⁻¹) = −4 = det(A³(B⁻¹)ᵀ). Find det A and det B">
              <Reveal label="Show solution">
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Find $\det A$.}$ Use $\det(uA^{-1}) = u^n\det(A^{-1}) = u^n/\det A$ with $n = 3$, $u = 2$:`}</p>
                <p style={{textAlign:'center',margin:'2px 0'}}>{String.raw`$\det(2A^{-1}) = \dfrac{2^3}{\det A} = \dfrac{8}{\det A} = -4 \Rightarrow \det A = \dfrac{8}{-4} = -2.$`}</p>
                <p style={{margin:'8px 0 8px'}}>{String.raw`$\textbf{Find $\det B$.}$ Expand the second expression:`}</p>
                <p style={{textAlign:'center',margin:'2px 0'}}>{String.raw`$\det\!\big(A^3(B^{-1})^{\mathsf{T}}\big) = (\det A)^3\det\!\big((B^{-1})^{\mathsf{T}}\big) = (\det A)^3\det(B^{-1}) = \dfrac{(\det A)^3}{\det B}.$`}</p>
                <p style={{margin:'8px 0 8px'}}>{String.raw`Setting this equal to $-4$ and using $\det A = -2$, so $(\det A)^3 = -8$:`}</p>
                <p style={{textAlign:'center',margin:'2px 0 0'}}>{String.raw`$\dfrac{-8}{\det B} = -4 \Rightarrow \det B = \dfrac{-8}{-4} = 2.$`}</p>
              </Reveal>
            </Exercise>

            <Exercise id="3.2.6" title="Let A with det A = 3. Compute det(2B⁻¹) and det(2C⁻¹)" >
              <p>{String.raw`Throughout, $A = \begin{bmatrix} a & b & c \\ p & q & r \\ u & v & w \end{bmatrix}$ with $\det A = 3$.`}</p>
              <Reveal label="Show both solutions">
                <p style={{margin:'0 0 6px'}}>{String.raw`$\textbf{(a)}\;\det(2B^{-1})$ where $B = \begin{bmatrix} 4u & 2a & -p \\ 4v & 2b & -q \\ 4w & 2c & -r \end{bmatrix}$.`}</p>
                <p style={{margin:'2px 0'}}>{String.raw`$\textbf{Step 1 — relate $\det B$ to $\det A$.}$ Pull the constants out of each column (Property 3, applied to columns): column 1 has factor $4$, column 2 has factor $2$, column 3 has factor $-1$:`}</p>
                <p style={{textAlign:'center',margin:'2px 0'}}>{String.raw`$\det B = (4)(2)(-1)\det\begin{bmatrix} u & a & p \\ v & b & q \\ w & c & r \end{bmatrix} = -8\det\begin{bmatrix} u & a & p \\ v & b & q \\ w & c & r \end{bmatrix}.$`}</p>
                <p style={{margin:'2px 0'}}>{String.raw`$\textbf{Step 2 — recognise the remaining matrix.}$ Its columns are $(u,v,w)$, $(a,b,c)$, $(p,q,r)$, which are the columns of $A^{\mathsf{T}}$ reordered. Taking the transpose (no change) gives rows $(u,a,p),(v,b,q),(w,c,r)$; reordering to $(a,b,c),(p,q,r),(u,v,w)$ works out to $\det\begin{bmatrix} u & a & p \\ v & b & q \\ w & c & r \end{bmatrix} = \det A = 3$. Hence $\det B = -8(3) = -24$.`}</p>
                <p style={{margin:'2px 0 10px'}}>{String.raw`$\textbf{Step 3 — finish.}$ With $n = 3$, $\det(2B^{-1}) = \dfrac{2^3}{\det B} = \dfrac{8}{-24} = -\dfrac{1}{3}.$`}</p>
                <p style={{margin:'0 0 6px'}}>{String.raw`$\textbf{(b)}\;\det(2C^{-1})$ where $C = \begin{bmatrix} 2p & -a+u & 3u \\ 2q & -b+v & 3v \\ 2r & -c+w & 3w \end{bmatrix}$.`}</p>
                <p style={{margin:'2px 0'}}>{String.raw`$\textbf{Step 1 — factor columns.}$ Column 1 has factor $2$, column 3 has factor $3$: $\det C = (2)(3)\det\begin{bmatrix} p & -a+u & u \\ q & -b+v & v \\ r & -c+w & w \end{bmatrix}.$`}</p>
                <p style={{margin:'2px 0'}}>{String.raw`$\textbf{Step 2 — clean the middle column.}$ Column 2 is $-(a\text{-col}) + (u\text{-col})$. Since column 3 is the $u$-column, add column 3 to column 2 to cancel the $u$ part (Property 5 for columns), leaving $-(a\text{-col})$, then pull out the $-1$:`}</p>
                <p style={{textAlign:'center',margin:'2px 0'}}>{String.raw`$\det C = 6\det\begin{bmatrix} p & -a & u \\ q & -b & v \\ r & -c & w \end{bmatrix} = 6(-1)\det\begin{bmatrix} p & a & u \\ q & b & v \\ r & c & w \end{bmatrix} = -6\det\begin{bmatrix} p & a & u \\ q & b & v \\ r & c & w \end{bmatrix}.$`}</p>
                <p style={{margin:'2px 0'}}>{String.raw`$\textbf{Step 3 — reorder to $A$.}$ The columns are $(p,q,r),(a,b,c),(u,v,w)$. Swapping columns 1 and 2 gives the columns of $A$; one swap contributes $-1$: $\det C = -6(-1)\det A = 6\det A = 6(3) = 18.$`}</p>
                <p style={{margin:'2px 0 0'}}>{String.raw`$\textbf{Step 4 — finish.}$ $\det(2C^{-1}) = \dfrac{2^3}{\det C} = \dfrac{8}{18} = \dfrac{4}{9}.$`}</p>
              </Reveal>
            </Exercise>

            <Exercise id="3.2.7" title="If det[[a,b],[c,d]] = −2, calculate a 3×3 determinant">
              <p>{String.raw`Given $\det\begin{bmatrix} a & b \\ c & d \end{bmatrix} = -2$, calculate $\det\begin{bmatrix} 2 & -2 & 0 \\ c+1 & -1 & 2a \\ d-2 & 2 & 2b \end{bmatrix}$.`}</p>
              <Reveal label="Show solution">
                <p style={{margin:'0 0 8px'}}>Call the target matrix {String.raw`$M$`}. Expand along the first row (it has a zero):</p>
                <p style={{textAlign:'center',margin:'2px 0'}}>{String.raw`$\det M = 2\begin{vmatrix} -1 & 2a \\ 2 & 2b \end{vmatrix} - (-2)\begin{vmatrix} c+1 & 2a \\ d-2 & 2b \end{vmatrix} + 0.$`}</p>
                <p style={{margin:'8px 0 4px'}}>The two {String.raw`$2\times2$`} determinants are</p>
                <p style={{textAlign:'center',margin:'2px 0'}}>{String.raw`$\begin{vmatrix} -1 & 2a \\ 2 & 2b \end{vmatrix} = -2b - 4a, \quad \begin{vmatrix} c+1 & 2a \\ d-2 & 2b \end{vmatrix} = 2b(c+1) - 2a(d-2) = 2bc + 2b - 2ad + 4a.$`}</p>
                <p style={{margin:'8px 0 4px'}}>Therefore</p>
                <p style={{textAlign:'center',margin:'2px 0'}}>{String.raw`$\det M = 2(-2b - 4a) + 2(2bc + 2b - 2ad + 4a) = -4b - 8a + 4bc + 4b - 4ad + 8a = 4bc - 4ad.$`}</p>
                <p style={{margin:'8px 0 0'}}>{String.raw`This simplifies to $\det M = -4(ad - bc) = -4\det\begin{bmatrix} a & b \\ c & d \end{bmatrix} = -4(-2) = \mathbf{8}.$`}</p>
              </Reveal>
            </Exercise>

            <Exercise id="3.2.8" title="Solve each system by Cramer's rule">
              <p>{String.raw`$\textbf{Reminder.}$ For $A\mathbf{x} = \mathbf{b}$, $x_i = \dfrac{\det A_i}{\det A}$, where $A_i$ replaces column $i$ of $A$ with $\mathbf{b}$.`}</p>
              <Reveal label="Show all four solutions">
                <p style={{margin:'0 0 6px'}}>{String.raw`$\textbf{(a)}\;2x+y=1,\;3x+7y=-2$ with $A = \begin{bmatrix} 2 & 1 \\ 3 & 7 \end{bmatrix}$, $\det A = 11$.`}</p>
                <p style={{textAlign:'center',margin:'2px 0'}}>{String.raw`$x = \dfrac{\begin{vmatrix} 1 & 1 \\ -2 & 7 \end{vmatrix}}{11} = \dfrac{9}{11}, \quad y = \dfrac{\begin{vmatrix} 2 & 1 \\ 3 & -2 \end{vmatrix}}{11} = \dfrac{-7}{11}.$ So $(x,y) = \left(\tfrac{9}{11}, -\tfrac{7}{11}\right).$`}</p>
                <p style={{margin:'8px 0 6px'}}>{String.raw`$\textbf{(b)}\;3x+4y=9,\;2x-y=-1$ with $A = \begin{bmatrix} 3 & 4 \\ 2 & -1 \end{bmatrix}$, $\det A = -11$.`}</p>
                <p style={{textAlign:'center',margin:'2px 0'}}>{String.raw`$x = \dfrac{\begin{vmatrix} 9 & 4 \\ -1 & -1 \end{vmatrix}}{-11} = \dfrac{-5}{-11} = \dfrac{5}{11}, \quad y = \dfrac{\begin{vmatrix} 3 & 9 \\ 2 & -1 \end{vmatrix}}{-11} = \dfrac{-21}{-11} = \dfrac{21}{11}.$ So $(x,y) = \left(\tfrac{5}{11}, \tfrac{21}{11}\right).$`}</p>
                <p style={{margin:'8px 0 6px'}}>{String.raw`$\textbf{(c)}\;5x+y-z=-7,\;2x-y-2z=6,\;3x+2z=-7$ with $A = \begin{bmatrix} 5 & 1 & -1 \\ 2 & -1 & -2 \\ 3 & 0 & 2 \end{bmatrix}$, $\det A = -23$.`}</p>
                <p style={{margin:'2px 0'}}>{String.raw`Replacing each column by $\mathbf{b} = (-7, 6, -7)$ gives $\det A_1 = 23$, $\det A_2 = 92$, $\det A_3 = 46$, so`}</p>
                <p style={{textAlign:'center',margin:'2px 0'}}>{String.raw`$x = \dfrac{23}{-23} = -1, \; y = \dfrac{92}{-23} = -4, \; z = \dfrac{46}{-23} = -2.$ So $(x,y,z) = (-1, -4, -2).$`}</p>
                <p style={{margin:'8px 0 6px'}}>{String.raw`$\textbf{(d)}\;4x-y+3z=1,\;6x+2y-z=0,\;3x+3y+2z=-1$ with $A = \begin{bmatrix} 4 & -1 & 3 \\ 6 & 2 & -1 \\ 3 & 3 & 2 \end{bmatrix}$, $\det A = 79$.`}</p>
                <p style={{margin:'2px 0'}}>{String.raw`Replacing each column by $\mathbf{b} = (1, 0, -1)$ gives $\det A_1 = 12$, $\det A_2 = -37$, $\det A_3 = -2$, so`}</p>
                <p style={{textAlign:'center',margin:'2px 0 0'}}>{String.raw`$x = \dfrac{12}{79}, \; y = -\dfrac{37}{79}, \; z = -\dfrac{2}{79}.$ So $(x,y,z) = \left(\tfrac{12}{79}, -\tfrac{37}{79}, -\tfrac{2}{79}\right).$`}</p>
              </Reveal>
            </Exercise>

            <Exercise id="3.2.10" title="What can be said about det A if…">
              <p>{String.raw`$\textbf{Key idea.}$ Take determinants of both sides of the given equation and use $\det(XY) = \det X\det Y$, $\det(X^{\mathsf{T}}) = \det X$, and $\det(uX) = u^n\det X$. Let $t = \det A$; each part becomes a small equation in $t$.`}</p>
              <Reveal label="Show all seven parts">
                <p style={{margin:'2px 0'}}>{String.raw`$\textbf{(a)}\;A^2 = A$. Then $\det(A^2) = \det A$, i.e. $t^2 = t$, so $t(t-1) = 0$. Hence $\det A = 0$ or $1$.`}</p>
                <p style={{margin:'2px 0'}}>{String.raw`$\textbf{(b)}\;A^2 = I$. Then $t^2 = \det I = 1$, so $\det A = \pm 1$.`}</p>
                <p style={{margin:'2px 0'}}>{String.raw`$\textbf{(c)}\;A^3 = A$. Then $t^3 = t$, i.e. $t(t^2 - 1) = 0$, so $\det A \in \{0, 1, -1\}$.`}</p>
                <p style={{margin:'2px 0'}}>{String.raw`$\textbf{(d)}\;PA = P$ with $P$ invertible. Multiply on the left by $P^{-1}$: $A = I$, so $\det A = 1$. (Equivalently, $\det P\det A = \det P$ and $\det P \neq 0$ force $\det A = 1$.)`}</p>
                <p style={{margin:'2px 0'}}>{String.raw`$\textbf{(e)}\;A^2 = uA$, $A$ is $n\times n$. Then $\det(A^2) = \det(uA)$, i.e. $t^2 = u^n t$, so $t(t - u^n) = 0$. Hence $\det A = 0$ or $u^n$.`}</p>
                <p style={{margin:'2px 0'}}>{String.raw`$\textbf{(f)}\;A = -A^{\mathsf{T}}$, $A$ is $n\times n$ (a skew-symmetric matrix). Take determinants: $t = \det(-A^{\mathsf{T}}) = (-1)^n\det(A^{\mathsf{T}}) = (-1)^n t$. If $n$ is odd, this says $t = -t$, forcing $\det A = 0$. If $n$ is even it gives no restriction.`}</p>
                <p style={{margin:'2px 0 0'}}>{String.raw`$\textbf{(g)}\;A^2 + I = 0$, $A$ is $n\times n$ (so $A^2 = -I$). Take determinants: $t^2 = \det(-I) = (-1)^n$. Since $t^2 \geq 0$ for a real determinant, we need $(-1)^n = 1$, i.e. $n$ must be even; then $t^2 = 1$, so $\det A = \pm 1$. If $n$ is odd, no real matrix $A$ can satisfy $A^2 = -I$.`}</p>
              </Reveal>
            </Exercise>

            {/* CLOSING */}
            <div style={{ marginTop:'48px', padding:'28px 32px', background:'rgba(56,201,176,.08)', border:'2px solid rgba(56,201,176,.35)', borderRadius:'16px' }}>
              <div style={{ fontFamily:'var(--fm)', fontSize:'.7rem', letterSpacing:'.16em', textTransform:'uppercase', color:'#2a9d8f', marginBottom:'12px' }}>Looking ahead</div>
              <p style={{ fontFamily:'var(--fh)', fontSize:'1.4rem', color:'var(--lec-ink)', margin:'0 0 16px', fontWeight:400, lineHeight:1.3 }}>
                The determinant is now a full toolkit: it tests invertibility, multiplies cleanly, and hands you exact formulas for the inverse and for solutions.
              </p>
              <p style={{ color:'var(--lec-ink2)', fontSize:'.97rem', lineHeight:1.8, margin:0 }}>
                {String.raw`With the product theorem, the adjugate, and Cramer's rule in hand, we are ready to leave the world of computation behind and start asking deeper structural questions — vector spaces, linear independence, and eventually eigenvalues, where the determinant returns as the star of the characteristic equation.`}
              </p>
            </div>

            <div style={{ marginTop:'64px', paddingTop:'28px', borderTop:'2px solid var(--lec-border)', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'12px' }}>
              <div style={{ fontFamily:'var(--fm)', fontSize:'.76rem', color:'var(--lec-ink3)', fontStyle:'italic' }}>Lecture 10 — complete</div>
              <div style={{ fontFamily:'var(--fm)', fontSize:'.76rem', color:'var(--lec-ink3)' }}>MATH-120 · Shoaib Khan · LUMS · July 2026</div>
            </div>
          </div>

          {/* FOOTER NAV */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'22px 48px', borderTop:'1px solid var(--lec-border)', background:'var(--lec-paper)', flexWrap:'wrap', gap:'12px' }}>
            <Link href={PREV_HREF} style={{ fontFamily:'var(--fm)', fontSize:'.74rem', letterSpacing:'.08em', textTransform:'uppercase', color:'var(--lec-accent)', textDecoration:'none' }}>← Lecture 9</Link>
            <Link href={NEXT_HREF} style={{ fontFamily:'var(--fm)', fontSize:'.74rem', letterSpacing:'.08em', textTransform:'uppercase', color:'var(--lec-accent)', textDecoration:'none' }}>Lecture 11 →</Link>
          </div>
        </main>
      </div>

      <Footer/>
    </>
  );
}