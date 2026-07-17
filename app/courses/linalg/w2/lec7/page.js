'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import Navbar from '../../../../components/Navbar';
import Footer from '../../../../components/Footer';

/* ════════════════════════════════════════════════════════════
   MATH-120 · LECTURE 7
   Elementary Matrices, Their Inverses & Solving Systems
   Route: /courses/linalg/w2/lec7
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

const THIS_SLUG = 'w2/lec7';
const PREV_HREF  = '/courses/linalg/w2/lec6';
const NEXT_HREF  = '/courses/linalg/w2/lec8';

const LEC = {
  course: 'MATH-120 · Linear Algebra',
  number: 'Lecture 7',
  title: 'Elementary Matrices & Solving Systems',
  subtitle: 'The three types of elementary matrices, how to invert them by sight, and using inverses to crack linear systems fast',
  date: '17 June 2026',
};

const ANCHORS = [
  ['Recall', 'recall'],
  ['Type I — Swap', 'type1'],
  ['Type II — Scale', 'type2'],
  ['Type III — Add', 'type3'],
  ['Idempotent', 'idempotent'],
  ['Inverse Shortcut', 'shortcut'],
  ['Solving Systems', 'systems'],
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

/* Three-type reference card */
function TypeCard({ tag, color, name, op, matrix, inv, invop }) {
  return (
    <div style={{ background:'rgba(255,253,240,.97)', border:`1px solid ${color}40`, borderTop:`3px solid ${color}`, borderRadius:'12px', padding:'18px 20px', boxShadow:'0 2px 14px rgba(60,40,20,.05)' }}>
      <div style={{ fontFamily:'var(--fm)', fontSize:'.62rem', letterSpacing:'.14em', textTransform:'uppercase', color:color, marginBottom:'6px' }}>{tag}</div>
      <div style={{ fontFamily:'var(--fh)', fontSize:'1.05rem', color:'var(--lec-ink)', fontWeight:600, marginBottom:'8px' }}>{name}</div>
      <p style={{ fontSize:'.84rem', color:'var(--lec-ink2)', margin:'0 0 10px', lineHeight:1.6 }}>{op}</p>
      <div style={{ textAlign:'center', fontSize:'.9rem' }}>{matrix}</div>
      <div style={{ borderTop:'1px solid var(--lec-border)', margin:'12px 0 8px' }}/>
      <div style={{ fontFamily:'var(--fm)', fontSize:'.6rem', letterSpacing:'.1em', textTransform:'uppercase', color:'var(--lec-ink3)', marginBottom:'4px' }}>Inverse — {invop}</div>
      <div style={{ textAlign:'center', fontSize:'.9rem' }}>{inv}</div>
    </div>
  );
}

/* ═══════════════ PAGE ═══════════════ */
export default function Lec7() {
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
        .type-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:16px; margin:22px 0; }
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
        <span style={{color:'var(--text2)'}}>Week 2 · Lecture 7</span>
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
            <Link href={PREV_HREF} style={{ display:'flex', alignItems:'center', padding:'0 16px', height:'100%', fontFamily:'var(--fm)', fontSize:'.72rem', color:'var(--lec-ink3)', borderRight:'1px solid var(--lec-border)', whiteSpace:'nowrap', flexShrink:0, textDecoration:'none' }}>← Lecture 6</Link>
            <div style={{ flex:1, display:'flex', justifyContent:'center', alignItems:'center', gap:'4px', overflowX:'auto', padding:'0 8px' }}>
              <span style={{ fontFamily:'var(--fm)', fontSize:'.6rem', letterSpacing:'.12em', textTransform:'uppercase', color:'var(--lec-accent)', flexShrink:0, marginRight:'6px' }}>On this page</span>
              {ANCHORS.map(([label,id],i)=>(
                <span key={id} style={{display:'inline-flex',alignItems:'center',flexShrink:0}}>
                  {i>0&&<span style={{color:'var(--lec-border)',margin:'0 7px'}}>·</span>}
                  <a href={`#${id}`} onClick={e=>jump(e,id)} style={{fontFamily:'var(--fm)',fontSize:'.73rem',color:'var(--lec-ink2)',textDecoration:'none',whiteSpace:'nowrap'}}>{label}</a>
                </span>
              ))}
            </div>
            <Link href={NEXT_HREF} style={{ display:'flex', alignItems:'center', padding:'0 16px', height:'100%', fontFamily:'var(--fm)', fontSize:'.72rem', color:'var(--lec-ink3)', borderLeft:'1px solid var(--lec-border)', whiteSpace:'nowrap', flexShrink:0, textDecoration:'none' }}>Lecture 8 →</Link>
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

            {/* ─── §1 RECALL ─── */}
            <Sec id="recall" n="§1">Quick Recall — What Is an Elementary Matrix?</Sec>

            <p>Last lecture we met elementary matrices in passing while building the inverse. Today they take centre stage, so let us refresh the idea cleanly before we go deeper.</p>

            <DefBox term="Elementary matrix" color="violet">
              <p style={{margin:0}}>{String.raw`An `}<b>elementary matrix</b>{String.raw` $E$ is what you get by applying `}<i>exactly one</i>{String.raw` elementary row operation to the identity matrix $I$. Left-multiplying any matrix $A$ by $E$ performs that same row operation on $A$: the matrix $EA$ is $A$ with that one operation done to it.`}</p>
            </DefBox>

            <p>Since there are exactly <b>three kinds</b> of elementary row operation, there are exactly <b>three types</b> of elementary matrix. We will take them one at a time, and for each one learn the single most useful fact: <b>how to write down its inverse instantly</b>, just by reversing the operation.</p>

            <Callout icon="🔑" title="The theme of today" color="amber">
              Every elementary matrix is invertible, and its inverse is <i>another elementary matrix of the same type</i> — the one that undoes the operation. You never need the full Gauss–Jordan method to invert an elementary matrix. You just reverse the move.
            </Callout>

            {/* ─── §2 TYPE I ─── */}
            <Sec id="type1" n="§2">Type I — Swapping Two Rows</Sec>

            <p>The first elementary row operation swaps two rows. Apply it to {String.raw`$I$`} and you get a Type I elementary matrix.</p>

            <Example n="1" title="Building a Type I matrix">
              <p>{String.raw`Start with $I_3$ and swap rows 1 and 2 ($R_1 \leftrightarrow R_2$):`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$I = \begin{bmatrix}1&0&0\\0&1&0\\0&0&1\end{bmatrix} \xrightarrow{R_1 \leftrightarrow R_2} E_1 = \begin{bmatrix}0&1&0\\1&0&0\\0&0&1\end{bmatrix}.$$`}</p>
              <p>{String.raw`Now $E_1 A$ swaps rows 1 and 2 of `}<i>any</i>{String.raw` matrix $A$ it multiplies.`}</p>
            </Example>

            <DefBox term="Inverse of a Type I matrix" color="teal">
              <p style={{margin:0}}>{String.raw`What undoes a swap? `}<b>The same swap again.</b>{String.raw` Swapping rows 1 and 2, then swapping them back, returns the original. So a Type I matrix is its `}<b>own inverse</b>{String.raw`: $E_1^{-1} = E_1$, equivalently $E_1 E_1 = I$. The reverse operation of "$R_1 \leftrightarrow R_2$" is just "$R_1 \leftrightarrow R_2$".`}</p>
            </DefBox>

            <Callout icon="🔄" title="Reverse operation — Type I" color="teal">
              Operation: {String.raw`$R_i \leftrightarrow R_j$`}. &nbsp; Reverse operation: {String.raw`$R_i \leftrightarrow R_j$`} (identical). A swap is its own undo.
            </Callout>

            {/* ─── §3 TYPE II ─── */}
            <Sec id="type2" n="§3">Type II — Multiplying a Row by a Constant</Sec>

            <p>The second operation multiplies one row by a nonzero constant {String.raw`$k$`}. Apply it to {String.raw`$I$`} for a Type II matrix.</p>

            <Example n="2" title="Building a Type II matrix">
              <p>{String.raw`Multiply row 2 of $I_3$ by $5$ ($R_2 \to 5R_2$):`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$I = \begin{bmatrix}1&0&0\\0&1&0\\0&0&1\end{bmatrix} \xrightarrow{R_2 \to 5R_2} E_2 = \begin{bmatrix}1&0&0\\0&5&0\\0&0&1\end{bmatrix}.$$`}</p>
              <p>{String.raw`Multiplying $E_2 A$ scales row 2 of $A$ by $5$.`}</p>
            </Example>

            <DefBox term="Inverse of a Type II matrix" color="teal">
              <p style={{margin:0}}>{String.raw`What undoes "multiply row 2 by $5$"? `}<b>{String.raw`Divide row 2 by $5$`}</b>{String.raw` — that is, multiply it by $\tfrac{1}{5}$. So the inverse just replaces $k$ with $\tfrac{1}{k}$ in the same slot:`}</p>
              <p style={{textAlign:'center',margin:'10px 0 0'}}>{String.raw`$$E_2 = \begin{bmatrix}1&0&0\\0&5&0\\0&0&1\end{bmatrix} \quad\Longrightarrow\quad E_2^{-1} = \begin{bmatrix}1&0&0\\0&\tfrac{1}{5}&0\\0&0&1\end{bmatrix}.$$`}</p>
            </DefBox>

            <Callout icon="🔄" title="Reverse operation — Type II" color="teal">
              Operation: {String.raw`$R_i \to k R_i$`} (with {String.raw`$k \neq 0$`}). &nbsp; Reverse operation: {String.raw`$R_i \to \tfrac{1}{k} R_i$`}. Scaling up is undone by scaling down by the same factor. (This is why {String.raw`$k = 0$`} is forbidden — you cannot undo multiplying by zero.)
            </Callout>

            {/* ─── §4 TYPE III ─── */}
            <Sec id="type3" n="§4">Type III — Adding a Multiple of One Row to Another</Sec>

            <p>The third operation adds (or subtracts) a multiple of one row to another row. This is the workhorse of elimination. Apply it to {String.raw`$I$`} for a Type III matrix.</p>

            <Example n="3" title="Building a Type III matrix">
              <p>{String.raw`Add $2$ times row 1 to row 3 of $I_3$ ($R_3 \to R_3 + 2R_1$):`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$I = \begin{bmatrix}1&0&0\\0&1&0\\0&0&1\end{bmatrix} \xrightarrow{R_3 \to R_3 + 2R_1} E_3 = \begin{bmatrix}1&0&0\\0&1&0\\2&0&1\end{bmatrix}.$$`}</p>
              <p>{String.raw`The $2$ lands in the $(3,1)$ slot — row 3, column 1 — recording "$2$ of row 1 added into row 3."`}</p>
            </Example>

            <DefBox term="Inverse of a Type III matrix" color="teal">
              <p style={{margin:0}}>{String.raw`What undoes "add $2R_1$ to $R_3$"? `}<b>{String.raw`Subtract $2R_1$ from $R_3$.`}</b>{String.raw` So the inverse just flips the sign of the off-diagonal entry:`}</p>
              <p style={{textAlign:'center',margin:'10px 0 0'}}>{String.raw`$$E_3 = \begin{bmatrix}1&0&0\\0&1&0\\2&0&1\end{bmatrix} \quad\Longrightarrow\quad E_3^{-1} = \begin{bmatrix}1&0&0\\0&1&0\\-2&0&1\end{bmatrix}.$$`}</p>
            </DefBox>

            <Callout icon="🔄" title="Reverse operation — Type III" color="teal">
              Operation: {String.raw`$R_i \to R_i + k R_j$`}. &nbsp; Reverse operation: {String.raw`$R_i \to R_i - k R_j$`}. Adding {String.raw`$k$`} copies is undone by subtracting {String.raw`$k$`} copies — just negate the multiplier.
            </Callout>

            {/* THREE-TYPE SUMMARY GRID */}
            <p style={{fontFamily:'var(--fh)',fontSize:'1.3rem',color:'var(--lec-ink)',margin:'40px 0 12px',fontWeight:600}}>The three types at a glance</p>

            <div className="type-grid">
              <TypeCard tag="Type I" color="#9b80e8" name="Row swap"
                op="Swap two rows."
                matrix={`\\[\\begin{bmatrix}0&1\\\\1&0\\end{bmatrix}\\]`}
                inv={`\\[\\begin{bmatrix}0&1\\\\1&0\\end{bmatrix}\\]`}
                invop="same swap"/>
              <TypeCard tag="Type II" color="#38c9b0" name="Row scale"
                op="Multiply a row by k ≠ 0."
                matrix={`\\[\\begin{bmatrix}5&0\\\\0&1\\end{bmatrix}\\]`}
                inv={`\\[\\begin{bmatrix}\\tfrac15&0\\\\0&1\\end{bmatrix}\\]`}
                invop="scale by 1/k"/>
              <TypeCard tag="Type III" color="#e8a020" name="Row add"
                op="Add k times one row to another."
                matrix={`\\[\\begin{bmatrix}1&0\\\\2&1\\end{bmatrix}\\]`}
                inv={`\\[\\begin{bmatrix}1&0\\\\-2&1\\end{bmatrix}\\]`}
                invop="subtract k"/>
            </div>

            {/* ─── §5 IDEMPOTENT ─── */}
            <Sec id="idempotent" n="§5">A Quick Detour — Idempotent Matrices</Sec>

            <p>While we are looking at special matrices, here is a small but important family worth knowing.</p>

            <DefBox term="Idempotent matrix" color="violet">
              <p style={{margin:0}}>{String.raw`A square matrix $M$ is `}<b>idempotent</b>{String.raw` if multiplying it by itself returns itself: $M^2 = M$. Applying it once or a hundred times gives the same result — it "settles" after one step.`}</p>
            </DefBox>

            <Example n="4" title="Some idempotent matrices">
              <p>{String.raw`(a) The identity: $I^2 = I$. ✓`}</p>
              <p>{String.raw`(b) The zero matrix: $0^2 = 0$. ✓`}</p>
              <p>{String.raw`(c) $\begin{bmatrix}1&0\\0&0\end{bmatrix}$: squaring gives $\begin{bmatrix}1&0\\0&0\end{bmatrix}$. ✓`}</p>
              <p style={{margin:0}}>{String.raw`(d) A less obvious one: $\begin{bmatrix}2&-2\\1&-1\end{bmatrix}^2 = \begin{bmatrix}2&-2\\1&-1\end{bmatrix}$. ✓ (Multiply it out and check!)`}</p>
            </Example>

            <Callout icon="🧩" title="Which elementary matrices are idempotent?" color="amber">
              {String.raw`Almost none! A Type I swap satisfies $E^2 = I$, `}<b>not</b>{String.raw` $E^2 = E$ (unless $E = I$). Type II and Type III matrices change under squaring too. In fact, the `}<b>only</b>{String.raw` idempotent invertible matrix is the identity itself: if $M^2 = M$ and $M$ is invertible, multiply both sides by $M^{-1}$ to get $M = I$. Since every elementary matrix is invertible, the only idempotent one is $I$.`}
            </Callout>

            {/* ─── §6 INVERSE SHORTCUT ─── */}
            <Sec id="shortcut" n="§6">The Shortcut — Inverses Without the Full Algorithm</Sec>

            <p>Here is the payoff of knowing how to invert each type by sight. It lets us skip the long Gauss–Jordan method entirely in many situations.</p>

            <p>Recall from Lecture 6 that reducing {String.raw`$A$`} to {String.raw`$I$`} is a chain of elementary operations:</p>
            <p style={{textAlign:'center'}}>{String.raw`$$E_k \cdots E_2 E_1 A = I.$$`}</p>

            <p>This says {String.raw`$E_k \cdots E_2 E_1 = A^{-1}$`}. But watch what happens if we instead want {String.raw`$A$`} back from a known product of elementary matrices.</p>

            <ThmBox title="The reversing principle">
              <p style={{margin:'0 0 8px'}}>{String.raw`Suppose $E_1$ and $E_2$ are elementary matrices and $(E_1 E_2) A = I$. Then`}</p>
              <p style={{textAlign:'center',margin:'8px 0'}}>{String.raw`$$A = (E_1 E_2)^{-1} = E_2^{-1} E_1^{-1}.$$`}</p>
              <p style={{margin:'8px 0 0'}}>{String.raw`Two things to notice. First, the inverse of a product `}<b>reverses the order</b>{String.raw`: $(E_1 E_2)^{-1} = E_2^{-1} E_1^{-1}$ — socks-then-shoes becomes shoes-then-socks. Second, each $E_i^{-1}$ is found `}<i>instantly</i>{String.raw` by reversing its operation, using the rules from $\S2$–$\S4$. No row reduction needed.`}</p>
            </ThmBox>

            <Callout icon="⚡" title="Why this is faster" color="violet">
              If you already know the elementary matrices that reduce {String.raw`$A$`} to {String.raw`$I$`}, you do <b>not</b> have to run the whole {String.raw`$[A \mid I]$`} method to recover {String.raw`$A$`} or {String.raw`$A^{-1}$`}. You just invert each elementary factor by sight (flip a sign, flip a fraction, or leave a swap alone) and multiply them in reverse order. The hard work is already done.
            </Callout>

            <Example n="5" title="Reversing to recover A" advanced>
              <p>{String.raw`Suppose $E_1 = \begin{bmatrix}1&0\\-3&1\end{bmatrix}$ (Type III, $R_2 \to R_2 - 3R_1$) and $E_2 = \begin{bmatrix}1&0\\0&2\end{bmatrix}$ (Type II, $R_2 \to 2R_2$), and we know $E_2 E_1 A = I$. Find $A$.`}</p>
              <Reveal label="Show solution">
                <p style={{margin:'0 0 8px'}}>{String.raw`By the reversing principle, $A = (E_2 E_1)^{-1} = E_1^{-1} E_2^{-1}$.`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`Invert each by sight: $E_1^{-1} = \begin{bmatrix}1&0\\3&1\end{bmatrix}$ (flip the sign: $R_2 \to R_2 + 3R_1$), and $E_2^{-1} = \begin{bmatrix}1&0\\0&\tfrac12\end{bmatrix}$ (flip the fraction).`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`Multiply in reverse order:`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$A = E_1^{-1} E_2^{-1} = \begin{bmatrix}1&0\\3&1\end{bmatrix}\begin{bmatrix}1&0\\0&\tfrac12\end{bmatrix} = \begin{bmatrix}1&0\\3&\tfrac12\end{bmatrix}.$$`}</p>
                <p style={{margin:0}}>No augmented matrix, no row reduction — just two sight-inversions and one product.</p>
              </Reveal>
            </Example>

            {/* ─── §7 SOLVING SYSTEMS ─── */}
            <Sec id="systems" n="§7">Solving Systems Fast With the Inverse</Sec>

            <p>Now the most practical use of everything so far. If {String.raw`$A$`} is invertible, every system {String.raw`$A\mathbf{x} = \mathbf{b}$`} has a one-line solution.</p>

            <ThmBox title="Solving by inverse">
              <p style={{margin:0}}>{String.raw`If $A$ is invertible, the system $A\mathbf{x} = \mathbf{b}$ has the `}<b>unique</b>{String.raw` solution`}</p>
              <p style={{textAlign:'center',margin:'8px 0 0'}}>{String.raw`$$\mathbf{x} = A^{-1}\mathbf{b}.$$`}</p>
              <p style={{margin:'8px 0 0'}}>{String.raw`Multiply both sides of $A\mathbf{x} = \mathbf{b}$ on the `}<b>left</b>{String.raw` by $A^{-1}$: $A^{-1}A\mathbf{x} = A^{-1}\mathbf{b}$, and since $A^{-1}A = I$, this is $\mathbf{x} = A^{-1}\mathbf{b}$.`}</p>
            </ThmBox>

            <Callout icon="🎁" title="The real advantage" color="amber">
              The inverse is a <b>reusable key</b>. If you must solve {String.raw`$A\mathbf{x} = \mathbf{b}$`} for many different right-hand sides {String.raw`$\mathbf{b}_1, \mathbf{b}_2, \mathbf{b}_3, \dots$`} but the <i>same</i> {String.raw`$A$`}, compute {String.raw`$A^{-1}$`} once, then every solution is a quick multiply {String.raw`$A^{-1}\mathbf{b}_i$`}. No re-running elimination each time.
            </Callout>

            <Example n="6" title="A 2×2 system via the inverse">
              <p>{String.raw`Solve $\begin{cases} 2x + 3y = 8 \\ x - y = -1 \end{cases}$ using the inverse.`}</p>
              <p>{String.raw`In matrix form $A\mathbf{x} = \mathbf{b}$ with $A = \begin{bmatrix}2&3\\1&-1\end{bmatrix}$, $\mathbf{b} = \begin{bmatrix}8\\-1\end{bmatrix}$.`}</p>
              <p>{String.raw`Determinant: $\det A = (2)(-1) - (3)(1) = -2 - 3 = -5 \neq 0$, so $A$ is invertible. Using the 2×2 formula:`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$A^{-1} = \frac{1}{-5}\begin{bmatrix}-1 & -3\\-1 & 2\end{bmatrix} = \begin{bmatrix}\tfrac15 & \tfrac35\\[2pt] \tfrac15 & -\tfrac25\end{bmatrix}.$$`}</p>
              <p>{String.raw`Then`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$\mathbf{x} = A^{-1}\mathbf{b} = \begin{bmatrix}\tfrac15 & \tfrac35\\[2pt] \tfrac15 & -\tfrac25\end{bmatrix}\begin{bmatrix}8\\-1\end{bmatrix} = \begin{bmatrix}\tfrac85 - \tfrac35\\[2pt] \tfrac85 + \tfrac25\end{bmatrix} = \begin{bmatrix}1\\2\end{bmatrix}.$$`}</p>
              <p style={{margin:0}}>{String.raw`So $x = 1$, $y = 2$. Check: $2(1)+3(2) = 8$ ✓ and $1 - 2 = -1$ ✓.`}</p>
            </Example>

            <Example n="7" title="A 3×3 system via the inverse" advanced>
              <p>{String.raw`Solve $A\mathbf{x} = \mathbf{b}$ where $A = \begin{bmatrix}1&0&-1\\3&2&0\\-1&-1&0\end{bmatrix}$ and $\mathbf{b} = \begin{bmatrix}1\\8\\-3\end{bmatrix}$.`}</p>
              <p>{String.raw`We already found this $A^{-1}$ in Lecture 6 by the $[A \mid I]$ method:`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$A^{-1} = \begin{bmatrix}0&1&2\\0&-1&-3\\-1&1&2\end{bmatrix}.$$`}</p>
              <Reveal label="Show solution">
                <p style={{margin:'0 0 8px'}}>{String.raw`Just multiply $\mathbf{x} = A^{-1}\mathbf{b}$:`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$\mathbf{x} = \begin{bmatrix}0&1&2\\0&-1&-3\\-1&1&2\end{bmatrix}\begin{bmatrix}1\\8\\-3\end{bmatrix} = \begin{bmatrix}0+8-6\\0-8+9\\-1+8-6\end{bmatrix} = \begin{bmatrix}2\\1\\1\end{bmatrix}.$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`So $x = 2$, $y = 1$, $z = 1$.`}</p>
                <p style={{margin:0}}>{String.raw`Check the first equation: $x - z = 2 - 1 = 1$ ✓. The whole system is solved by a single matrix–vector product, because the hard work lives in $A^{-1}$, computed once.`}</p>
              </Reveal>
            </Example>

            <Callout icon="⚖️" title="When to use which method" color="teal">
              For a <b>one-off</b> system, plain Gaussian elimination is usually fastest — finding the inverse is extra work. The inverse method shines when you reuse the same {String.raw`$A$`} across <b>many</b> right-hand sides, or when you need {String.raw`$A^{-1}$`} itself for theory. Choose the tool that matches the job.
            </Callout>

            {/* ─── §8 EXERCISES ─── */}
            <Sec id="exercises" n="§8">Exercises — Nicholson §2.5</Sec>

            <Exercise id="2.5.3" title="Find E₁, E₂ with C = E₂E₁A">
              <p>{String.raw`Let $A = \begin{bmatrix}1&2\\-1&1\end{bmatrix}$ and $C = \begin{bmatrix}-1&1\\2&1\end{bmatrix}$.`}</p>
              <p><b>(a)</b> {String.raw`Find elementary matrices $E_1$ and $E_2$ such that $C = E_2 E_1 A$.`}</p>
              <Reveal label="Show solution (a)">
                <p style={{margin:'0 0 8px'}}>{String.raw`We reduce $A$ toward $C$ one operation at a time. First swap the rows of $A$ ($R_1 \leftrightarrow R_2$):`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$E_1 = \begin{bmatrix}0&1\\1&0\end{bmatrix}, \qquad E_1 A = \begin{bmatrix}-1&1\\1&2\end{bmatrix}.$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`Now the top row already matches $C$. The bottom row is $(1,2)$; we need $(2,1)$. The operation $R_2 \to R_2 - R_1$ does it: $(1,2) - (-1,1) = (2,1)$. So`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$E_2 = \begin{bmatrix}1&0\\-1&1\end{bmatrix}, \qquad E_2 E_1 A = \begin{bmatrix}-1&1\\2&1\end{bmatrix} = C.$$`} ✓</p>
                <p style={{margin:0}}>{String.raw`So $E_1 = \begin{bmatrix}0&1\\1&0\end{bmatrix}$ (swap) and $E_2 = \begin{bmatrix}1&0\\-1&1\end{bmatrix}$ ($R_2 \to R_2 - R_1$).`}</p>
              </Reveal>
              <p style={{marginTop:'12px'}}><b>(b)</b> {String.raw`Show there is `}<i>no</i>{String.raw` elementary matrix $E$ such that $C = EA$.`}</p>
              <Reveal label="Show solution (b)">
                <p style={{margin:'0 0 8px'}}>{String.raw`If such an $E$ existed, then $E = CA^{-1}$ (since $A$ is invertible). Compute it: $A^{-1} = \tfrac{1}{3}\begin{bmatrix}1&-2\\1&1\end{bmatrix}$, so`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$E = CA^{-1} = \begin{bmatrix}-1&1\\2&1\end{bmatrix}\cdot\tfrac{1}{3}\begin{bmatrix}1&-2\\1&1\end{bmatrix} = \begin{bmatrix}0&1\\1&-1\end{bmatrix}.$$`}</p>
                <p style={{margin:0}}>{String.raw`But $\begin{bmatrix}0&1\\1&-1\end{bmatrix}$ is `}<b>not</b>{String.raw` an elementary matrix — it does not differ from $I$ by a single row operation (it differs in `}<i>both</i>{String.raw` rows at once). Going from $A$ to $C$ genuinely takes two operations, as part (a) showed. Hence no single elementary $E$ works. $\;\blacksquare$`}</p>
              </Reveal>
            </Exercise>

            <Exercise id="2.5.4" title="E elementary ⟹ A and EA differ in at most two rows">
              <Reveal label="Show solution">
                <p style={{margin:'0 0 8px'}}>{String.raw`An elementary matrix $E$ comes from one row operation, and each of the three types touches at most two rows:`}</p>
                <p style={{margin:'4px 0'}}>{String.raw`• `}<b>{String.raw`Type I (swap $R_i \leftrightarrow R_j$):`}</b>{String.raw` only rows $i$ and $j$ move — exactly two rows.`}</p>
                <p style={{margin:'4px 0'}}>{String.raw`• `}<b>{String.raw`Type II ($R_i \to kR_i$):`}</b>{String.raw` only row $i$ changes — just one row.`}</p>
                <p style={{margin:'4px 0'}}>{String.raw`• `}<b>{String.raw`Type III ($R_i \to R_i + kR_j$):`}</b>{String.raw` only row $i$ changes (row $j$ is used but unchanged) — one row.`}</p>
                <p style={{margin:0}}>{String.raw`In every case, at most two rows of $A$ are altered by $EA$. All other rows are identical to those of $A$. $\;\blacksquare$`}</p>
              </Reveal>
            </Exercise>

            <Exercise id="2.5.5" title="Is I elementary? Is 0 elementary?">
              <p><b>(a)</b> {String.raw`Is $I$ an elementary matrix?`}</p>
              <Reveal label="Show answer (a)">
                <p style={{margin:0}}>{String.raw`This depends on convention. Strictly, an elementary matrix is $I$ with `}<i>one</i>{String.raw` row operation applied. The operation "$R_i \to 1\cdot R_i$" (multiply a row by $1$) is a valid Type II operation that leaves $I$ unchanged — so under that reading $I$ `}<b>can</b>{String.raw` be regarded as elementary. Most textbooks accept $I$ as elementary for this reason. (Some authors exclude the trivial operation; either way, $I$ is invertible and behaves like one.)`}</p>
              </Reveal>
              <p style={{marginTop:'12px'}}><b>(b)</b> {String.raw`Is $0$ (the zero matrix) an elementary matrix?`}</p>
              <Reveal label="Show answer (b)">
                <p style={{margin:0}}>{String.raw``}<b>No.</b>{String.raw` Every elementary matrix is `}<b>invertible</b>{String.raw` (each row operation can be undone). But the zero matrix is not invertible — there is no matrix $M$ with $0 \cdot M = I$. Also, no single row operation turns $I$ into $0$. So $0$ is never elementary. $\;\blacksquare$`}</p>
              </Reveal>
            </Exercise>

            <Exercise id="2.5.7" title="Find invertible U with UA = B; express U as a product of elementaries">
              <p><b>(a)</b> {String.raw`$A = \begin{bmatrix}2&1&3\\-1&1&2\end{bmatrix}$, $B = \begin{bmatrix}1&-1&-2\\3&0&1\end{bmatrix}$.`}</p>
              <Reveal label="Show solution (a)">
                <p style={{margin:'0 0 8px'}}>{String.raw`Here $U$ is $2\times2$ and transforms the rows of $A$ into the rows of $B$. Solving $UA = B$ entry by entry gives`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$U = \begin{bmatrix}0&-1\\1&-1\end{bmatrix}.$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`To express $U$ as a product of elementaries, reduce $U$ to $I$ and record the operations:`}</p>
                <p style={{margin:'4px 0'}}>{String.raw`$R_1 \leftrightarrow R_2$: $\begin{bmatrix}1&-1\\0&-1\end{bmatrix}$; then $R_2 \to -R_2$: $\begin{bmatrix}1&-1\\0&1\end{bmatrix}$; then $R_1 \to R_1 + R_2$: $\begin{bmatrix}1&0\\0&1\end{bmatrix} = I$.`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`So $F_3 F_2 F_1 U = I$ where $F_1$ is the swap, $F_2 = \begin{bmatrix}1&0\\0&-1\end{bmatrix}$, $F_3 = \begin{bmatrix}1&1\\0&1\end{bmatrix}$. Therefore`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$U = F_1^{-1} F_2^{-1} F_3^{-1} = \begin{bmatrix}0&1\\1&0\end{bmatrix}\begin{bmatrix}1&0\\0&-1\end{bmatrix}\begin{bmatrix}1&-1\\0&1\end{bmatrix}.$$`}</p>
                <p style={{margin:0}}>{String.raw`(Each factor is elementary; their product is $U$, and $U$ is invertible since it is a product of invertible matrices.)`}</p>
              </Reveal>
              <p style={{marginTop:'12px'}}><b>(b)</b> {String.raw`$A = \begin{bmatrix}2&-1&0\\1&1&1\end{bmatrix}$, $B = \begin{bmatrix}3&0&1\\2&-1&0\end{bmatrix}$.`}</p>
              <Reveal label="Show solution (b)">
                <p style={{margin:'0 0 8px'}}>{String.raw`Solving $UA = B$ gives`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$U = \begin{bmatrix}1&1\\1&0\end{bmatrix}.$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`Reduce $U$ to $I$: $R_2 \to R_2 - R_1$ gives $\begin{bmatrix}1&1\\0&-1\end{bmatrix}$; $R_2 \to -R_2$ gives $\begin{bmatrix}1&1\\0&1\end{bmatrix}$; $R_1 \to R_1 - R_2$ gives $I$. Inverting the order:`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$U = \begin{bmatrix}1&0\\1&1\end{bmatrix}\begin{bmatrix}1&0\\0&-1\end{bmatrix}\begin{bmatrix}1&1\\0&1\end{bmatrix}.$$`}</p>
                <p style={{margin:0}}>{String.raw`Check: this product equals $\begin{bmatrix}1&1\\1&0\end{bmatrix} = U$, and $UA = B$. ✓`}</p>
              </Reveal>
            </Exercise>

            <Exercise id="2.5.9" title="Eᵀ is elementary of the same type">
              <p><b>(a)</b> {String.raw`Show that $E^{\mathsf{T}}$ is also elementary, of the same type as $E$.`}</p>
              <Reveal label="Show solution (a)">
                <p style={{margin:'0 0 8px'}}>{String.raw`Take each type in turn.`}</p>
                <p style={{margin:'4px 0'}}>{String.raw`• `}<b>Type I (swap):</b>{String.raw` a swap matrix is `}<b>symmetric</b>{String.raw` — e.g. $\begin{bmatrix}0&1\\1&0\end{bmatrix}^{\mathsf{T}} = \begin{bmatrix}0&1\\1&0\end{bmatrix}$. So $E^{\mathsf{T}} = E$, still Type I.`}</p>
                <p style={{margin:'4px 0'}}>{String.raw`• `}<b>Type II (scale):</b>{String.raw` a scaling matrix is `}<b>diagonal</b>{String.raw`, hence symmetric: $E^{\mathsf{T}} = E$, still Type II.`}</p>
                <p style={{margin:'4px 0'}}>{String.raw`• `}<b>Type III (add):</b>{String.raw` transposing moves the off-diagonal entry across the diagonal — e.g. $\begin{bmatrix}1&0&0\\0&1&0\\2&0&1\end{bmatrix}^{\mathsf{T}} = \begin{bmatrix}1&0&2\\0&1&0\\0&0&1\end{bmatrix}$. This is still a single Type III matrix (now "$R_1 \to R_1 + 2R_3$" instead of "$R_3 \to R_3 + 2R_1$").`}</p>
                <p style={{margin:0}}>{String.raw`In all three cases $E^{\mathsf{T}}$ is elementary of the same type. $\;\blacksquare$`}</p>
              </Reveal>
              <p style={{marginTop:'12px'}}><b>(b)</b> {String.raw`Show $E^{\mathsf{T}} = E$ if $E$ is of Type I or Type II.`}</p>
              <Reveal label="Show solution (b)">
                <p style={{margin:0}}>{String.raw`From part (a): a Type I swap matrix and a Type II scaling matrix are both `}<b>symmetric</b>{String.raw` (swaps are symmetric by construction; scalings are diagonal, and every diagonal matrix equals its transpose). Therefore $E^{\mathsf{T}} = E$ for Types I and II. Only Type III fails this — its off-diagonal entry moves under transposition. $\;\blacksquare$`}</p>
              </Reveal>
            </Exercise>

            <Exercise id="2.5.11" title="Find elementary F with AF = B">
              <p>{String.raw`Let $A = \begin{bmatrix}1&2\\1&-3\end{bmatrix}$ and $B = \begin{bmatrix}5&2\\-5&-3\end{bmatrix}$. Find an elementary matrix $F$ such that $AF = B$.`}</p>
              <Reveal label="Show solution">
                <p style={{margin:'0 0 8px'}}>{String.raw`Because $F$ multiplies $A$ on the `}<b>right</b>{String.raw`, it performs a `}<b>column</b>{String.raw` operation (not a row operation). Compare $A$ and $B$ column by column: column 2 is unchanged $\big((2,-3) \to (2,-3)\big)$, but column 1 changes from $(1,1)$ to $(5,-5)$.`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`Notice $(5,-5) = (1,1) + 2(2,-3)$ — that is, new column 1 = old column 1 $+\,2\times$ column 2. This is the column operation $C_1 \to C_1 + 2C_2$, whose elementary matrix is`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$F = \begin{bmatrix}1&0\\2&1\end{bmatrix}.$$`}</p>
                <p style={{margin:0}}>{String.raw`Check: $AF = \begin{bmatrix}1&2\\1&-3\end{bmatrix}\begin{bmatrix}1&0\\2&1\end{bmatrix} = \begin{bmatrix}5&2\\-5&-3\end{bmatrix} = B$. ✓ ($F$ is a Type III elementary matrix.)`}</p>
              </Reveal>
            </Exercise>

            {/* CLOSING */}
            <div style={{ marginTop:'48px', padding:'28px 32px', background:'rgba(56,201,176,.08)', border:'2px solid rgba(56,201,176,.35)', borderRadius:'16px' }}>
              <div style={{ fontFamily:'var(--fm)', fontSize:'.7rem', letterSpacing:'.16em', textTransform:'uppercase', color:'#2a9d8f', marginBottom:'12px' }}>Looking ahead</div>
              <p style={{ fontFamily:'var(--fh)', fontSize:'1.4rem', color:'var(--lec-ink)', margin:'0 0 16px', fontWeight:400, lineHeight:1.3 }}>
                Elementary matrices, inverses, and fast solving are now in your toolkit. Next: determinants — the single number that decides invertibility.
              </p>
              <p style={{ color:'var(--lec-ink2)', fontSize:'.97rem', lineHeight:1.8, margin:0 }}>
                We have leaned on "{String.raw`$\det \neq 0$`} means invertible" a few times. Next lecture we define the determinant properly, learn to compute it for any size, and see how it ties together everything — rank, invertibility, and the geometry of how a matrix stretches space.
              </p>
            </div>

            <div style={{ marginTop:'64px', paddingTop:'28px', borderTop:'2px solid var(--lec-border)', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'12px' }}>
              <div style={{ fontFamily:'var(--fm)', fontSize:'.76rem', color:'var(--lec-ink3)', fontStyle:'italic' }}>Lecture 7 — complete</div>
              <div style={{ fontFamily:'var(--fm)', fontSize:'.76rem', color:'var(--lec-ink3)' }}>MATH-120 · Shoaib Khan · LUMS · June 2026</div>
            </div>
          </div>

          {/* FOOTER NAV */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'22px 48px', borderTop:'1px solid var(--lec-border)', background:'var(--lec-paper)', flexWrap:'wrap', gap:'12px' }}>
            <Link href={PREV_HREF} style={{ fontFamily:'var(--fm)', fontSize:'.74rem', letterSpacing:'.08em', textTransform:'uppercase', color:'var(--lec-accent)', textDecoration:'none' }}>← Lecture 6</Link>
            <Link href={NEXT_HREF} style={{ fontFamily:'var(--fm)', fontSize:'.74rem', letterSpacing:'.08em', textTransform:'uppercase', color:'var(--lec-accent)', textDecoration:'none' }}>Lecture 8 →</Link>
          </div>
        </main>
      </div>

      <Footer/>
    </>
  );
}