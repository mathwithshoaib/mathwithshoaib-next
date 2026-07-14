'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import Navbar from '../../../../components/Navbar';
import Footer from '../../../../components/Footer';

/* ════════════════════════════════════════════════════════════
   MATH-120 · LECTURE 16
   Abstract Vector Spaces: Subspaces, Spanning & Independence — §6.2–6.3
   Route: /courses/linalg/w5/lec16
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
const THIS_SLUG = 'w5/lec16';
const PREV_HREF  = '/courses/linalg/w5/lec15';
const NEXT_HREF  = '/courses/linalg';

const LEC = {
  course: 'MATH-120 · Linear Algebra',
  number: 'Lecture 16',
  title: 'Vector Spaces: Going Abstract',
  subtitle: 'Everything we did in ℝⁿ works verbatim for matrices, polynomials, and functions — because it was never really about the arrows',
  date: '7 July 2026',
};

const ANCHORS = [
  ['Why Abstract?', 'motivation'],
  ['Vector Space', 'vspace'],
  ['VS Examples', 'vs-examples'],
  ['Exercise: F[a,b]', 'fab'],
  ['Recall', 'recall'],
  ['Subspaces', 'subspace'],
  ['Subspace Examples', 'sub-ex'],
  ['Span, Once More', 'span'],
  ['Span Example', 'span-ex'],
  ['Standard Spans', 'std-spans'],
  ['Theorem 6.2.2', 'thm'],
  ['Example 6.2.10', 'p3-span'],
  ['Independence', 'independence'],
  ['Basis & Dimension', 'basis-dim'],
  ['dim P = ∞', 'dim-p'],
  ['More Examples', 'more-ex'],
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
        transition:'background .15s, transform .1s',
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

/* ── New: small presentational helpers used only to restyle existing
   content into a cleaner, more scannable layout (no new material) ── */

function AxiomGrid({ items }) {
  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(230px, 1fr))', gap:'10px', margin:'10px 0 4px' }}>
      {items.map(({ tag, body }) => (
        <div key={tag} style={{ display:'flex', gap:'10px', alignItems:'flex-start', background:'rgba(255,255,255,.55)', border:'1px solid rgba(42,157,143,.25)', borderRadius:'10px', padding:'10px 14px' }}>
          <span style={{ flexShrink:0, fontFamily:'var(--fm)', fontSize:'.68rem', fontWeight:700, color:'#2a9d8f', background:'rgba(56,201,176,.16)', borderRadius:'999px', width:'26px', height:'26px', display:'flex', alignItems:'center', justifyContent:'center' }}>{tag}</span>
          <span style={{ fontSize:'.96rem', lineHeight:1.6, color:'var(--lec-ink2)' }}>{body}</span>
        </div>
      ))}
    </div>
  );
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

/* ═══════════════ PAGE ═══════════════ */
export default function Lec16() {
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
        <span style={{color:'var(--text2)'}}>Week 5 · Lecture 16</span>
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
            <Link href={PREV_HREF} style={{ display:'flex', alignItems:'center', padding:'0 16px', height:'100%', fontFamily:'var(--fm)', fontSize:'.72rem', color:'var(--lec-ink3)', borderRight:'1px solid var(--lec-border)', whiteSpace:'nowrap', flexShrink:0, textDecoration:'none' }}>← Lecture 15</Link>
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
            <Sec id="motivation" n="§1">Why Go Abstract?</Sec>

            <p>{String.raw`In lecture, your instructor moved straight from `}<b>{String.raw`subspaces of $\mathbb{R}^n$`}</b>{String.raw` (Lecture 14) to `}<b>independence, basis, and dimension</b>{String.raw` (Lecture 15) without ever writing down the general definition of a "vector space." That was not an oversight — it was a deliberate choice. $\mathbb{R}^n$ is already a vector space, and every idea in those two lectures can be built with plain coordinates, with nothing lost.`}</p>

            <Callout icon="📋" title="A note on what was (and wasn't) covered in lecture" color="rose">
              {String.raw`This lecture note starts with the formal definition of a vector space — a step the lecture itself skipped, on purpose. We add it here for a good reason: once you see the `}<i>real</i>{String.raw` definition, you'll realise that matrices, polynomials, and even functions are "vectors" too, obeying exactly the same rules $\mathbb{R}^n$ obeys. Skim the definition if you like — it is short and mostly a checklist — but know that everything from `}<b>§6.2 onward</b>{String.raw` (Nicholson) is genuinely new material, not review.`}
            </Callout>

            <p>{String.raw`Here is the punchline before the details: every theorem you proved for $\mathbb{R}^n$ — `}<i>"a span is always a subspace," "an independent set has no redundancy," "dimension is a well-defined number"</i>{String.raw` — was never really about arrows with coordinates. It was about the `}<b>rules</b>{String.raw` those arrows obey: you can add them, you can scale them, and a short list of algebra laws holds. `}<b>Any</b>{String.raw` set with those rules is a vector space, and every proof from Lectures 14–15 carries over word for word.`}</p>

            {/* ─── §2 VECTOR SPACE ─── */}
            <Sec id="vspace" n="§2">The Definition of a Vector Space</Sec>

            <p>{String.raw`Keep this as a checklist, not something to memorise line by line — you will almost never write out all eight rules by hand.`}</p>

            <DefBox term="Vector space (Definition 6.1)" color="teal">
              <p style={{margin:'0 0 12px'}}>{String.raw`A `}<b>vector space</b>{String.raw` is a nonempty set $V$ together with a rule for `}<b>addition</b>{String.raw` and a rule for `}<b>scalar multiplication</b>{String.raw` (by real numbers), such that for all $\mathbf{x}, \mathbf{y}, \mathbf{z}$ in $V$ and all scalars $a, b$, the following eight rules hold:`}</p>
              <AxiomGrid items={[
                { tag:'A1', body: String.raw`$\mathbf{x}+\mathbf{y}$ is in $V$, and $\mathbf{x}+\mathbf{y}=\mathbf{y}+\mathbf{x}$.` },
                { tag:'A2', body: String.raw`$(\mathbf{x}+\mathbf{y})+\mathbf{z}=\mathbf{x}+(\mathbf{y}+\mathbf{z})$.` },
                { tag:'A3', body: String.raw`There is a zero vector $\mathbf{0}$ in $V$ with $\mathbf{0}+\mathbf{x}=\mathbf{x}$ for every $\mathbf{x}$.` },
                { tag:'A4', body: String.raw`Every $\mathbf{x}$ in $V$ has a negative $-\mathbf{x}$ in $V$ with $-\mathbf{x}+\mathbf{x}=\mathbf{0}$.` },
                { tag:'A5', body: String.raw`$a\mathbf{x}$ is in $V$ for every scalar $a$.` },
                { tag:'A6', body: String.raw`$a(\mathbf{x}+\mathbf{y})=a\mathbf{x}+a\mathbf{y}$.` },
                { tag:'A7', body: String.raw`$(a+b)\mathbf{x}=a\mathbf{x}+b\mathbf{x}$, and $a(b\mathbf{x})=(ab)\mathbf{x}$.` },
                { tag:'A8', body: String.raw`$1\mathbf{x}=\mathbf{x}$.` },
              ]}/>
            </DefBox>

            <Callout icon="🔑" title="What actually matters in practice" color="amber">
              {String.raw`You will almost never verify all eight axioms by hand. A1–A4 and A6–A8 are usually "obviously true," because addition and scalar multiplication are `}<i>inherited</i>{String.raw` from ordinary arithmetic — adding matrices, adding polynomials, adding functions all reduce to adding real numbers underneath. The only two axioms that can actually `}<b>fail</b>{String.raw` are A1's and A5's closure clauses: `}<i>{String.raw`"$\mathbf{x}+\mathbf{y}$ is again in $V$"`}</i>{String.raw` and `}<i>{String.raw`"$a\mathbf{x}$ is again in $V$."`}</i>{String.raw` That is the shortcut we use for every example below: `}<b>check that the set is closed under addition and scalar multiplication</b>{String.raw` — everything else follows for free from ordinary algebra.`}
            </Callout>

            {/* ─── §3 VS EXAMPLES ─── */}
            <Sec id="vs-examples" n="§3">Examples of Vector Spaces</Sec>

            <p>{String.raw`For each example, ask three questions, in order:`}</p>
            <StepList items={[
              <span key="q1"><b>What is the space?</b>{String.raw` — what are its elements: numbers, matrices, polynomials?`}</span>,
              <span key="q2"><b>What do addition and scalar multiplication mean here?</b></span>,
              <span key="q3"><b>Is it closed?</b></span>,
            ]}/>
            <p>{String.raw`We will not write out all eight axioms each time — just the closure check, as the callout above promised.`}</p>

            <SubH>{String.raw`1. $M_{mn}$ — all $m \times n$ matrices`}</SubH>
            <p>{String.raw`The space $M_{mn}$ is the set of `}<b>all</b>{String.raw` $m \times n$ matrices with real entries. Its "vectors" are entire matrices. Addition is the usual entrywise matrix addition; scalar multiplication is the usual entrywise scaling — both from Lecture 5.`}</p>
            <Example n="1" title="M_{mn} is a vector space">
              <p style={{margin:0}}>{String.raw`If $A$ and $B$ are both $m\times n$, then $A+B$ is computed entrywise and is again $m\times n$ — closed under addition. If $A$ is $m\times n$ and $c$ is a scalar, $cA$ is again $m\times n$ — closed under scalar multiplication. Since matrix addition and scaling are just real-number addition and multiplication applied entry by entry, A1–A4 and A6–A8 hold automatically (they are just the real-number rules, copied into every entry). So $M_{mn}$ is a vector space, with zero vector the $m\times n$ zero matrix.`}</p>
            </Example>

            <SubH>{String.raw`2. $P$ — all polynomials`}</SubH>
            <p>{String.raw`The space $P$ is the set of `}<b>all</b>{String.raw` polynomials $a_0 + a_1x + a_2x^2 + \cdots + a_nx^n$ (any finite degree $n \geq 0$, any real coefficients $a_i$). Addition adds like-degree coefficients; scalar multiplication scales every coefficient — the "foregoing" addition and scalar multiplication the textbook refers to.`}</p>
            <Example n="2" title="P is a vector space">
              <p style={{margin:0}}>{String.raw`If $p$ and $q$ are polynomials, $p+q$ (add coefficient by coefficient) is again a polynomial — closed under addition. If $c$ is a scalar, $cp$ (scale every coefficient) is again a polynomial — closed under scalar multiplication. As with matrices, the remaining axioms are inherited from real-number arithmetic on the coefficients. So $P$ is a vector space, with zero vector the zero polynomial.`}</p>
            </Example>

            <SubH>{String.raw`3. $P_n$ — polynomials of degree at most $n$`}</SubH>
            <p>{String.raw`Given $n \geq 1$, $P_n$ is the set of all polynomials of degree `}<b>at most</b>{String.raw` $n$, together with the zero polynomial: $\{a_0+a_1x+\cdots+a_nx^n : a_i \text{ in } \mathbb{R}\}$.`}</p>
            <Example n="3" title="P_n is a vector space">
              <p style={{margin:0}}>{String.raw`If $p, q$ each have degree $\leq n$, then $p+q$ also has degree $\leq n$ — adding polynomials never `}<i>raises</i>{String.raw` degree, terms can only cancel or combine. Closed under addition. If $c$ is a scalar, $cp$ has degree $\leq n$ too (or becomes the zero polynomial if $c=0$) — closed under scalar multiplication. So $P_n$ is a vector space. (You will soon see it is also a `}<i>subspace</i>{String.raw` of $P$ — more on that idea in a moment.)`}</p>
            </Example>

            {/* ─── §4 EXERCISE: F[a,b] ─── */}
            <Sec id="fab" n="§4">Try It Yourself: Functions on an Interval</Sec>

            <p>{String.raw`One more example, worth sitting with before we move on — here the "vectors" are not lists of numbers or polynomials, but entire functions.`}</p>

            <Exercise id="6.1.4" title="F[a, b] — functions as vectors">
              <p>{String.raw`Fix an interval $[a,b]$ of real numbers. Let $F[a,b]$ be the set of `}<b>all</b>{String.raw` real-valued functions $f : [a,b] \to \mathbb{R}$ — no continuity or smoothness required, just any rule assigning a number to each $x$ in $[a,b]$. Define addition and scalar multiplication `}<b>pointwise</b>{String.raw`:`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$(f+g)(x) = f(x) + g(x), \qquad (cf)(x) = c\cdot f(x), \qquad \text{for every } x \text{ in } [a,b].$$`}</p>
              <p>{String.raw`In words: to add two functions, add their `}<i>output values</i>{String.raw` at every single point $x$. To scale a function by $c$, multiply every output value by $c$. Each single element of $F[a,b]$ is an entire graph, not a number.`}</p>
              <p>{String.raw`Show that $F[a,b]$ is a vector space.`}</p>
              <Callout icon="🧭" title="Hint" color="teal">
                {String.raw`Use the same shortcut as above: check closure. If $f$ and $g$ are both functions on $[a,b]$, is $f+g$ (defined pointwise) also a function on $[a,b]$? Yes — at every $x$ you get a well-defined real number $f(x)+g(x)$, since real numbers can always be added. Is $cf$ also a function on $[a,b]$? Yes, for the same reason. Both closure checks hold "for free." The zero vector is the `}<b>zero function</b>{String.raw` $\mathbf{0}(x) = 0$ for every $x$; the negative of $f$ is $(-f)(x) = -f(x)$. Every remaining axiom (A1–A4, A6–A8) holds pointwise, because it holds for real numbers at each individual $x$. Try writing out A1 yourself: why does $(f+g)(x) = (g+f)(x)$ follow immediately from $f(x)+g(x)=g(x)+f(x)$?`}
              </Callout>
            </Exercise>

            <Callout icon="🌌" title="Why this example matters" color="violet">
              {String.raw`$F[a,b]$ is your first taste of an `}<b>infinite-dimensional</b>{String.raw` vector space — we will come back to what that phrase means later in this lecture. Every continuous function, every polynomial, every wiggly graph you have ever drawn on $[a,b]$ is one single "vector" living inside this space. This is the starting point for Fourier analysis, differential equations, and quantum mechanics — fields where "vector" means "function," and the machinery of this course (span, basis, dimension) still applies, almost unchanged.`}
            </Callout>

            {/* ─── §5 RECALL ─── */}
            <Sec id="recall" n="§5">Recall — And What Changes Now</Sec>

            <p>{String.raw`Lectures 14 and 15 built subspaces, spanning, linear combinations, independence, basis, and dimension — entirely inside $\mathbb{R}^n$. Every definition and every theorem from those lectures carries over to `}<b>any</b>{String.raw` vector space $V$, word for word, with "vector in $\mathbb{R}^n$" replaced by "vector in $V$." We will not re-derive the theorems — we already have them — we will just point the same machinery at new kinds of vectors.`}</p>

            <Callout icon="🔁" title="The dictionary" color="amber">
              <BulletList dense items={[
                <span key="d1"><b>Subspace axioms S1/S2/S3</b>{String.raw` → the exact same three rules, now for a subset $U$ of a vector space $V$.`}</span>,
                <span key="d2"><b>Linear combination and span</b>{String.raw` → the exact same formula $a_1\mathbf{v}_1+\cdots+a_k\mathbf{v}_k$, now with the $\mathbf{v}_i$ possibly matrices or polynomials.`}</span>,
                <span key="d3"><b>Independent / dependent</b>{String.raw` → the exact same "only the trivial combination vanishes" test.`}</span>,
                <span key="d4"><b>Basis, dimension</b>{String.raw` → the exact same "independent `}<i>and</i>{String.raw` spanning" and "size of any basis."`}</span>,
              ]}/>
              <p style={{margin:'10px 0 0'}}>{String.raw`Nothing new to memorise — just new vectors to plug in.`}</p>
            </Callout>

            {/* ─── §6 SUBSPACE ─── */}
            <Sec id="subspace" n="§6">§6.2 — Subspaces of a Vector Space</Sec>

            <DefBox term="Subspace (Definition 6.2)" color="teal">
              <p style={{margin:'0 0 12px'}}>{String.raw`A subset $U$ of a vector space $V$ is called a `}<b>subspace</b>{String.raw` of $V$ if $U$ is itself a vector space, using the same addition and scalar multiplication as $V$. In practice, you check three things:`}</p>
              <AxiomGrid items={[
                { tag:'S1', body: String.raw`The zero vector $\mathbf{0}$ of $V$ is in $U$.` },
                { tag:'S2', body: String.raw`If $\mathbf{x}, \mathbf{y}$ are in $U$, then $\mathbf{x}+\mathbf{y}$ is in $U$.` },
                { tag:'S3', body: String.raw`If $\mathbf{x}$ is in $U$, then $a\mathbf{x}$ is in $U$ for every scalar $a$.` },
              ]}/>
            </DefBox>

            <p>{String.raw`Compare this with §5.1 of Lecture 14 — it is `}<i>identical</i>{String.raw`, with "$\mathbb{R}^n$" replaced by "$V$." Every subspace check you already know how to do (verify $\mathbf{0} \in U$, then closure) works completely unchanged, even when the vectors are matrices or polynomials.`}</p>

            {/* ─── §7 SUBSPACE EXAMPLES ─── */}
            <Sec id="sub-ex" n="§7">Two Subspace Examples</Sec>

            <Example n="4" title="Example 6.2.3 — matrices that commute with A" advanced>
              <p>{String.raw`Let $A$ be a fixed matrix in $M_{nn}$. Show that $U = \{X \text{ in } M_{nn} : AX = XA\}$ is a subspace of $M_{nn}$.`}</p>
              <Reveal label="Show full solution">
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{S1.}$ The zero matrix satisfies $A\mathbf{0} = \mathbf{0} = \mathbf{0}A$, so $\mathbf{0}$ is in $U$. ✓`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{S2.}$ Take $X, Y$ in $U$, so $AX = XA$ and $AY = YA$. Then, using the distributive law for matrices,`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$A(X+Y) = AX + AY = XA + YA = (X+Y)A.$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`So $X+Y$ is in $U$. ✓`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{S3.}$ Take $X$ in $U$ and a scalar $a$. Then $A(aX) = a(AX) = a(XA) = (aX)A$, so $aX$ is in $U$. ✓ $\;\blacksquare$`}</p>
                <p style={{margin:0}}>{String.raw`$U$ is called the `}<b>centralizer</b>{String.raw` of $A$ — every matrix that "commutes" with $A$. Notice how mechanical the proof is: it is literally the same three lines as every null-space proof from Lecture 14, just with matrix multiplication in place of $A\mathbf{x}$.`}</p>
              </Reveal>
            </Example>

            <Example n="5" title="Example 6.2.4 — polynomials with 3 as a root" advanced>
              <p>{String.raw`Consider the set $U$ of all polynomials in $P$ that have $3$ as a root: $U = \{p(x) \text{ in } P : p(3) = 0\}$. Show that $U$ is a subspace of $P$.`}</p>
              <Reveal label="Show full solution">
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{S1.}$ The zero polynomial satisfies $\mathbf{0}(3) = 0$, so it is in $U$. ✓`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{S2.}$ Take $p, q$ in $U$, so $p(3)=0$ and $q(3)=0$. Evaluating the sum at $3$: $(p+q)(3) = p(3)+q(3) = 0+0 = 0$. So $p+q$ is in $U$. ✓`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{S3.}$ Take $p$ in $U$ and a scalar $a$: $(ap)(3) = a\cdot p(3) = a\cdot 0 = 0$. So $ap$ is in $U$. ✓ $\;\blacksquare$`}</p>
                <p style={{margin:0}}>{String.raw`This is a general pattern worth remembering: `}<b>"evaluate at a fixed point and get 0"</b>{String.raw` always defines a subspace, by exactly this three-line argument — it works for evaluation at any fixed number, not just $3$.`}</p>
              </Reveal>
            </Example>

            <Callout icon="🧩" title="Notice the pattern" color="teal">
              {String.raw`Both examples above are defined by a `}<i>condition</i>{String.raw` — "commutes with $A$," "vanishes at $3$" — and both proofs followed the identical three-line shortcut: check $\mathbf{0}$ satisfies the condition, then check the condition survives addition and scaling. Once you have this shortcut, checking a subspace almost never requires new ideas — only patience.`}
            </Callout>

            {/* ─── §8 SPAN (ABSTRACT) ─── */}
            <Sec id="span" n="§8">Linear Combinations and Span, Once More</Sec>

            <DefBox term="Linear combination & span, in any vector space" color="violet">
              <p style={{margin:0}}>{String.raw`For vectors $\mathbf{v}_1, \ldots, \mathbf{v}_k$ in a vector space $V$, a `}<b>linear combination</b>{String.raw` is any vector $a_1\mathbf{v}_1+\cdots+a_k\mathbf{v}_k$ (scalars $a_i$), and the `}<b>span</b>{String.raw` $\operatorname{span}\{\mathbf{v}_1,\ldots,\mathbf{v}_k\}$ is the set of `}<i>all</i>{String.raw` such combinations. Exactly the definitions from Lecture 14, §5.1 — no change at all except that $\mathbf{v}_i$ can now be a matrix or a polynomial.`}</p>
            </DefBox>

            <p>{String.raw`So $\operatorname{span}\{p_1, p_2\}$ for two polynomials means "every $ap_1+bp_2$," and testing whether a target polynomial lies in that span is — exactly as before — a question of solving a linear system for $a$ and $b$.`}</p>

            {/* ─── §9 SPAN EXAMPLE ─── */}
            <Sec id="span-ex" n="§9">Testing Span Membership in P₂</Sec>

            <Example n="6" title="Example 6.2.7 — is a polynomial in the span?" advanced>
              <p>{String.raw`Consider $p_1 = 1+x+4x^2$ and $p_2 = 1+5x+x^2$ in $P_2$. Determine whether $p_1$ and $p_2$ lie in $\operatorname{span}\{1+2x-x^2,\; 3+5x+2x^2\}$.`}</p>
              <Reveal label="Show full solution">
                <p style={{margin:'0 0 8px'}}>{String.raw`Write $w_1 = 1+2x-x^2$ and $w_2 = 3+5x+2x^2$. A polynomial $q$ is in the span exactly when $q = aw_1+bw_2$ for some scalars $a,b$ — three equations (one per coefficient: constant, $x$, $x^2$) in the two unknowns $a,b$.`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Testing } p_1 = 1+x+4x^2.$ We need $aw_1+bw_2=p_1$:`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$\begin{aligned} a + 3b &= 1 \\ 2a + 5b &= 1 \\ -a + 2b &= 4 \end{aligned}$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`From the first two: multiply the first by $2$ to get $2a+6b=2$, then subtract the second: $b=1$, so $a = 1-3(1) = -2$. Check the third: $-(-2)+2(1) = 2+2 = 4$ ✓. All three hold, so`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$p_1 = -2w_1 + w_2, \qquad \text{so } p_1 \text{ IS in the span.}$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Testing } p_2 = 1+5x+x^2.$ We need $aw_1+bw_2=p_2$:`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$\begin{aligned} a + 3b &= 1 \\ 2a + 5b &= 5 \\ -a + 2b &= 1 \end{aligned}$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`From the first two: $2a+6b=2$, subtract the second: $b=-3$, so $a=1-3(-3)=10$. Check the third: $-(10)+2(-3) = -16 \neq 1$. `}<b>Fails.</b>{String.raw` The system is inconsistent — no single $(a,b)$ works — so`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$p_2 \text{ is NOT in the span.}$$`}</p>
                <p style={{margin:0}}>{String.raw`Same habit as Lecture 14: solve using two coordinates, then `}<b>always verify the leftover one</b>{String.raw` — that is exactly where a vector reveals itself as outside the span.`}</p>
              </Reveal>
            </Example>

            {/* ─── §10 STANDARD SPANNING SETS ─── */}
            <Sec id="std-spans" n="§10">Standard Spanning Sets</Sec>

            <p>{String.raw`Just as $\{\mathbf{e}_1,\ldots,\mathbf{e}_n\}$ span $\mathbb{R}^n$ (Lecture 14, Example 5.1.6), each vector space above has its own natural "starter kit":`}</p>

            <BulletList items={[
              <span key="s1"><b>{String.raw`$M_{mn}$:`}</b>{String.raw` the $mn$ `}<b>matrix units</b>{String.raw` $E_{ij}$ (a $1$ in row $i$, column $j$, and $0$ elsewhere), for $i=1,\ldots,m$ and $j=1,\ldots,n$. Any matrix $A = \sum_{i,j} a_{ij}E_{ij}$, so these span $M_{mn}$.`}</span>,
              <span key="s2"><b>$P_n$:</b>{String.raw` the $n+1$ monomials $\{1, x, x^2, \ldots, x^n\}$. Every $a_0+a_1x+\cdots+a_nx^n$ is literally a linear combination of these.`}</span>,
              <span key="s3"><b>$P$:</b>{String.raw` the `}<i>infinite</i>{String.raw` list $\{1, x, x^2, x^3, \ldots\}$.`}</span>,
            ]}/>

            <Callout icon="⚠️" title="A subtlety with infinite spanning sets" color="rose">
              {String.raw`$P$ needs `}<i>infinitely many</i>{String.raw` spanning vectors — but "linear combination" still only ever means a `}<b>finite</b>{String.raw` sum. Every actual polynomial has some finite degree $n$, so it only ever uses finitely many of $1,x,x^2,\ldots$ (namely $1$ through $x^n$) with nonzero coefficient. An infinite spanning set just means you have an infinite `}<i>menu</i>{String.raw` to choose finitely many ingredients from — you never add infinitely many terms at once.`}
            </Callout>

            {/* ─── §11 THEOREM 6.2.2 ─── */}
            <Sec id="thm" n="§11">Theorem 6.2.2 — Span Is Still the Smallest Subspace</Sec>

            <ThmBox title="Theorem 6.2.2">
              <p style={{margin:'0 0 10px'}}>{String.raw`Let $U = \operatorname{span}\{\mathbf{v}_1, \mathbf{v}_2, \ldots, \mathbf{v}_n\}$ in a vector space $V$. Then:`}</p>
              <BulletList dense items={[
                <span key="t1"><b>1.</b>{String.raw` $U$ is a subspace of $V$ containing each of $\mathbf{v}_1, \mathbf{v}_2, \ldots, \mathbf{v}_n$.`}</span>,
                <span key="t2"><b>2.</b>{String.raw` $U$ is the `}<b>"smallest"</b>{String.raw` subspace containing these vectors, in the sense that `}<i>any</i>{String.raw` subspace that contains each of $\mathbf{v}_1, \ldots, \mathbf{v}_n$ must contain $U$.`}</span>,
              ]}/>
            </ThmBox>

            <Callout icon="🧠" title="This is exactly Theorem 5.1.1, one level up" color="teal">
              {String.raw`You already proved the ideas behind this in Lecture 14. `}<b>Part 1</b>{String.raw` holds because a combination of combinations is still a combination (closure), and each $\mathbf{v}_i$ is trivially $0\mathbf{v}_1+\cdots+1\mathbf{v}_i+\cdots+0\mathbf{v}_n$. `}<b>Part 2</b>{String.raw` holds because any subspace $W$ containing all the $\mathbf{v}_i$ must, by closure under addition and scaling, contain every combination of them — which is exactly $U$. Same two-line argument, now stated for an arbitrary $V$.`}
            </Callout>

            {/* ─── §12 EXAMPLE 6.2.10 ─── */}
            <Sec id="p3-span" n="§12">A Spanning Set for P₃</Sec>

            <Example n="7" title="Example 6.2.10 — does this odd-looking set span P₃?" advanced>
              <p>{String.raw`Show that $P_3 = \operatorname{span}\{x^2+x^3,\; x,\; 2x^2+1,\; 3\}$.`}</p>
              <Reveal label="Show full solution">
                <p style={{margin:'0 0 8px'}}>{String.raw`$\dim P_3 = 4$ (basis $\{1,x,x^2,x^3\}$), and we are given exactly $4$ vectors. So it is enough to show these $4$ are `}<b>independent</b>{String.raw` — then, by the theorems from Lecture 15 (which apply here unchanged), $4$ independent vectors in a $4$-dimensional space automatically form a basis, and hence automatically span it.`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`Write each polynomial as a coordinate vector $(\text{const}, x, x^2, x^3)$: $x^2+x^3=(0,0,1,1)$, $x=(0,1,0,0)$, $2x^2+1=(1,0,2,0)$, $3=(3,0,0,0)$. Stack them as columns of a matrix and test invertibility via the determinant:`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$\det\begin{bmatrix} 0 & 0 & 1 & 3 \\ 0 & 1 & 0 & 0 \\ 1 & 0 & 2 & 0 \\ 1 & 0 & 0 & 0 \end{bmatrix}.$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`Expand along row $2$ (only one nonzero entry, a $1$ in column $2$): the cofactor sign is $(-1)^{2+2}=+1$, and the minor (delete row $2$, column $2$) is`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$\begin{vmatrix} 0 & 1 & 3 \\ 1 & 2 & 0 \\ 1 & 0 & 0 \end{vmatrix}.$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`Expand this $3\times3$ along its bottom row (only one nonzero entry, a $1$): sign $(-1)^{3+1}=+1$, minor $\begin{vmatrix}1&3\\2&0\end{vmatrix} = 0-6=-6$. So the $3\times3$ determinant is $-6$, and the full $4\times4$ determinant is $1\cdot(+1)\cdot(-6) = -6$.`}</p>
                <p style={{margin:0}}>{String.raw`$\det = -6 \neq 0$, so the matrix is invertible, so the four polynomials are `}<b>independent</b>{String.raw`. Four independent vectors in the $4$-dimensional space $P_3$ automatically form a basis, so`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$P_3 = \operatorname{span}\{x^2+x^3,\; x,\; 2x^2+1,\; 3\}. \qquad \blacksquare$$`}</p>
              </Reveal>
            </Example>

            {/* ─── §13 INDEPENDENCE ─── */}
            <Sec id="independence" n="§13">§6.3 — Independence, Once More</Sec>

            <DefBox term="Independence, in any vector space (quick recall)" color="teal">
              <p style={{margin:0}}>{String.raw`A set $\{\mathbf{v}_1,\ldots,\mathbf{v}_k\}$ in a vector space $V$ is `}<b>linearly independent</b>{String.raw` if the only scalars making $a_1\mathbf{v}_1+\cdots+a_k\mathbf{v}_k = \mathbf{0}$ true are $a_1=\cdots=a_k=0$. Exactly Lecture 15's definition, unchanged. It is `}<b>dependent</b>{String.raw` otherwise — some nontrivial combination vanishes.`}</p>
            </DefBox>

            <Example n="8" title="Example 6.3.1 — independence in P₂" advanced>
              <p>{String.raw`Show that $\{1+x,\; 3x+x^2,\; 2+x-x^2\}$ is independent in $P_2$.`}</p>
              <Reveal label="Show full solution">
                <p style={{margin:'0 0 8px'}}>{String.raw`Suppose $t_1(1+x) + t_2(3x+x^2) + t_3(2+x-x^2) = 0$. Collecting coefficients of $1, x, x^2$:`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$\begin{aligned} t_1 + 2t_3 &= 0 \quad (\text{const})\\ t_1 + 3t_2 + t_3 &= 0 \quad (x)\\ t_2 - t_3 &= 0 \quad (x^2) \end{aligned}$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`From the third equation, $t_2=t_3$. From the first, $t_1=-2t_3$. Substitute both into the second: $-2t_3 + 3t_3 + t_3 = 2t_3 = 0$, so $t_3=0$, and then $t_2=0$, $t_1=0$.`}</p>
                <p style={{margin:0}}>{String.raw`Only the trivial combination vanishes, so the set is `}<b>independent</b>{String.raw`. $\;\blacksquare$`}</p>
              </Reveal>
            </Example>

            <Example n="9" title="Example 6.3.3 — independence survives a mix" advanced>
              <p>{String.raw`Suppose $\{\mathbf{u}, \mathbf{v}\}$ is an independent set in a vector space $V$. Show that $\{\mathbf{u}+2\mathbf{v},\; \mathbf{u}-3\mathbf{v}\}$ is also independent.`}</p>
              <Reveal label="Show full solution">
                <p style={{margin:'0 0 8px'}}>{String.raw`Suppose $a(\mathbf{u}+2\mathbf{v}) + b(\mathbf{u}-3\mathbf{v}) = \mathbf{0}$. Group the $\mathbf{u}$ and $\mathbf{v}$ terms:`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$(a+b)\mathbf{u} + (2a-3b)\mathbf{v} = \mathbf{0}.$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`Since $\{\mathbf{u},\mathbf{v}\}$ is independent, both coefficients must vanish: $a+b=0$ and $2a-3b=0$. From the first, $a=-b$; substitute: $2(-b)-3b=-5b=0$, so $b=0$, and then $a=0$.`}</p>
                <p style={{margin:0}}>{String.raw`Only the trivial combination works, so $\{\mathbf{u}+2\mathbf{v}, \mathbf{u}-3\mathbf{v}\}$ is `}<b>independent</b>{String.raw`. $\;\blacksquare$ Exactly the "invertible mix" idea from Lecture 15, Example 5.2.3 — but now $\mathbf{u}, \mathbf{v}$ can be anything at all: matrices, polynomials, functions.`}</p>
              </Reveal>
            </Example>

            <Example n="10" title="Example 6.3.5 — powers of a nilpotent matrix" advanced>
              <p>{String.raw`Suppose $A$ is an $n\times n$ matrix with $A^k = 0$ but $A^{k-1} \neq 0$. Show that $B = \{I, A, A^2, \ldots, A^{k-1}\}$ is independent in $M_{nn}$.`}</p>
              <Reveal label="Show full solution">
                <p style={{margin:'0 0 8px'}}>{String.raw`Suppose $t_0 I + t_1 A + t_2 A^2 + \cdots + t_{k-1}A^{k-1} = 0$. We show every $t_i = 0$, one at a time.`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Isolate } t_0.$ Multiply both sides by $A^{k-1}$:`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$t_0A^{k-1} + t_1A^{k} + t_2A^{k+1} + \cdots + t_{k-1}A^{2k-2} = 0.$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`Since $A^k=0$, every power $A^k, A^{k+1}, \ldots$ is also $0$ (each is $A^k$ times something). So every term except the first vanishes, leaving $t_0A^{k-1}=0$. Since $A^{k-1}\neq0$, this forces $\boldsymbol{t_0=0}$ — a nonzero scalar times a nonzero matrix can never be the zero matrix.`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Isolate } t_1.$ With $t_0=0$, the original equation becomes $t_1A + t_2A^2+\cdots+t_{k-1}A^{k-1}=0$. Multiply by $A^{k-2}$: every term from $A^k$ onward vanishes again, leaving $t_1A^{k-1}=0$, so $\boldsymbol{t_1=0}$.`}</p>
                <p style={{margin:0}}>{String.raw`$\textbf{Continue.}$ Repeating — multiply the remaining equation by $A^{k-1-j}$ to isolate $t_jA^{k-1}$ — shows $t_2=0,\ldots,t_{k-1}=0$ in turn. Every coefficient is zero, so $B$ is `}<b>independent</b>{String.raw`. $\;\blacksquare$`}</p>
              </Reveal>
            </Example>

            {/* ─── §14 BASIS & DIMENSION ─── */}
            <Sec id="basis-dim" n="§14">Basis and Dimension, Once More</Sec>

            <DefBox term="Basis and dimension (quick recall)" color="violet">
              <p style={{margin:0}}>{String.raw`A `}<b>basis</b>{String.raw` of a subspace $U$ of $V$ is a set that is both `}<b>independent</b>{String.raw` and `}<b>spans</b>{String.raw` $U$ — no waste, nothing missing. The `}<b>dimension</b>{String.raw` $\dim U$ is the number of vectors in any basis (Lecture 15's Invariance Theorem guarantees this number does not depend on which basis you pick — and that proof did not use anything special about $\mathbb{R}^n$, so it holds here too).`}</p>
            </DefBox>

            <p>{String.raw`Using the standard spanning sets from §10 (each one is also independent — a short check you can carry out the same way as Example 8), the dimensions are:`}</p>

            <BulletList items={[
              <span key="dim1"><b>{String.raw`$\dim \mathbb{R}^n = n$`}</b>{String.raw` (basis $\{\mathbf{e}_1,\ldots,\mathbf{e}_n\}$).`}</span>,
              <span key="dim2"><b>$\dim P_n = n+1$</b>{String.raw` (basis $\{1,x,\ldots,x^n\}$ — count carefully: degree `}<i>at most</i>{String.raw` $n$ means $n+1$ monomials, from $x^0$ to $x^n$).`}</span>,
              <span key="dim3"><b>{String.raw`$\dim M_{mn} = mn$`}</b>{String.raw` (basis the matrix units $\{E_{ij}\}$, of which there are $mn$).`}</span>,
            ]}/>

            {/* ─── §15 DIM P = INFINITY ─── */}
            <Sec id="dim-p" n="§15">An Interesting Fact: dim P = ∞</Sec>

            <Callout icon="🎲" title="P has no finite basis" color="rose">
              {String.raw`Here is something genuinely surprising: $P$, the space of `}<b>all</b>{String.raw` polynomials, has `}<b>no finite basis at all</b>{String.raw`. We say $\dim P = \infty$ — $P$ is `}<b>infinite-dimensional</b>{String.raw`.`}
            </Callout>

            <p>{String.raw`The reason is short. Suppose, for contradiction, that finitely many polynomials $q_1,\ldots,q_m$ spanned $P$. Let $N$ be the `}<i>largest</i>{String.raw` degree among $q_1,\ldots,q_m$. Every linear combination $a_1q_1+\cdots+a_mq_m$ then has degree at most $N$ (combining polynomials never raises degree beyond the largest one you started with). But $x^{N+1}$ is a perfectly good polynomial in $P$ with degree $N+1 > N$ — it can `}<i>never</i>{String.raw` be reached by such a combination. So no finite set can span $P$; you always need infinitely many polynomials, e.g. all of $1, x, x^2, x^3, \ldots$, and that infinite set turns out to be independent too (no finite sub-collection of distinct powers of $x$ can combine to zero, since a nonzero polynomial of degree $N$ genuinely has a nonzero $x^N$ coefficient). An infinite independent spanning set is exactly what "infinite-dimensional" means.`}</p>

            <Callout icon="📜" title="Why this idea matters — some history" color="violet">
              {String.raw`Finite-dimensional spaces like $\mathbb{R}^n$ or $P_n$ can be fully understood with matrices and determinants — everything in this course so far. But the moment mathematicians started asking serious questions about `}<i>functions</i>{String.raw` — Joseph Fourier's early-1800s discovery that a periodic function can be built from infinitely many sine and cosine waves is the first great example — they were secretly doing linear algebra in an infinite-dimensional space, decades before anyone had the vocabulary for it. It took until the early 20th century, with David Hilbert, Stefan Banach, and others, for mathematicians to build a rigorous theory of infinite-dimensional vector spaces (now called `}<i>functional analysis</i>{String.raw`). That theory turned out to be exactly the right language for quantum mechanics — a particle's possible quantum states form an infinite-dimensional vector space (a `}<i>Hilbert space</i>{String.raw`), and predictions in quantum physics are, quite literally, "coordinates" of a vector in that space. The humble fact that $\dim P = \infty$ is the seed of all of that.`}
            </Callout>

            {/* ─── §16 MORE EXAMPLES ─── */}
            <Sec id="more-ex" n="§16">Two More Worked Examples</Sec>

            <Example n="11" title="Example 6.3.10 — dimension of a matrix centralizer" advanced>
              <p>{String.raw`Let $A = \begin{bmatrix} 1 & 1 \\ 0 & 0 \end{bmatrix}$ and consider the subspace $U = \{X \text{ in } M_{22} : AX = XA\}$ of $M_{22}$. Show that $\dim U = 2$ and find a basis of $U$.`}</p>
              <Reveal label="Show full solution">
                <p style={{margin:'0 0 8px'}}>{String.raw`Let $X = \begin{bmatrix} a & b \\ c & d \end{bmatrix}$ be a general element of $M_{22}$. Compute both products:`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$AX = \begin{bmatrix} 1 & 1 \\ 0 & 0 \end{bmatrix}\begin{bmatrix} a & b \\ c & d \end{bmatrix} = \begin{bmatrix} a+c & b+d \\ 0 & 0 \end{bmatrix}, \qquad XA = \begin{bmatrix} a & b \\ c & d \end{bmatrix}\begin{bmatrix} 1 & 1 \\ 0 & 0 \end{bmatrix} = \begin{bmatrix} a & a \\ c & c \end{bmatrix}.$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`Setting $AX=XA$ and matching entries: $a+c=a \Rightarrow c=0$; $\;b+d=a$; the bottom row gives $0=c$ and $0=c$ again — both already satisfied by $c=0$. So the `}<i>only</i>{String.raw` constraints are $c=0$ and $a=b+d$, with $b,d$ completely free:`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$X = \begin{bmatrix} b+d & b \\ 0 & d \end{bmatrix} = b\begin{bmatrix} 1&1\\0&0\end{bmatrix} + d\begin{bmatrix}1&0\\0&1\end{bmatrix} = b\,A + d\,I.$$`}</p>
                <p style={{margin:0}}>{String.raw`So $U = \operatorname{span}\{A, I\}$, and $A, I$ are clearly independent (neither is a scalar multiple of the other — $A$ has a zero row, $I$ does not). Two independent vectors that span $U$ form a basis, so`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$\dim U = 2, \qquad \text{basis } \{I, A\} = \left\{ \begin{bmatrix}1&0\\0&1\end{bmatrix},\; \begin{bmatrix}1&1\\0&0\end{bmatrix} \right\}. \qquad \blacksquare$$`}</p>
              </Reveal>
            </Example>

            <Example n="12" title="Example 6.3.11 — the symmetric 2×2 matrices" advanced>
              <p>{String.raw`Show that the set $V$ of all symmetric $2\times2$ matrices is a vector space, and find $\dim V$.`}</p>
              <Reveal label="Show full solution">
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{It is a vector space (a subspace of $M_{22}$).}$ A matrix $X$ is symmetric when $X^T=X$. The zero matrix is symmetric, so S1 holds. If $X^T=X$ and $Y^T=Y$, then $(X+Y)^T = X^T+Y^T = X+Y$, so $X+Y$ is symmetric — S2 holds. If $X^T=X$ and $c$ is a scalar, $(cX)^T = cX^T = cX$, so $cX$ is symmetric — S3 holds. So $V$ is a subspace of $M_{22}$, and therefore a vector space in its own right.`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Finding the dimension.}$ A general symmetric $2\times2$ matrix has equal off-diagonal entries: $X = \begin{bmatrix} a & b \\ b & d \end{bmatrix}$, with $a, b, d$ completely free (`}<i>three</i>{String.raw` independent parameters, not four — the bottom-left entry is forced to equal the top-right one). Split by the free parameters:`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$\begin{bmatrix} a & b \\ b & d \end{bmatrix} = a\begin{bmatrix}1&0\\0&0\end{bmatrix} + b\begin{bmatrix}0&1\\1&0\end{bmatrix} + d\begin{bmatrix}0&0\\0&1\end{bmatrix}.$$`}</p>
                <p style={{margin:0}}>{String.raw`These three matrices are independent (matching entries forces $a=b=d=0$ immediately) and they span $V$ by construction, so they form a basis. Therefore`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$\dim V = 3. \qquad \blacksquare$$`}</p>
              </Reveal>
            </Example>

            {/* ─── §17 EXERCISES ─── */}
            <Sec id="exercises" n="§17">Exercises</Sec>

            <p style={{fontStyle:'italic', color:'var(--lec-ink3)'}}>{String.raw`Three problems to practice on your own, in the same spirit as today's examples. Hints only — try each one properly before reading further.`}</p>

            <Exercise id="A" title="Skew-symmetric 2×2 matrices">
              <p>{String.raw`Let $U = \{A \text{ in } M_{22} : A^T = -A\}$ (the `}<b>skew-symmetric</b>{String.raw` matrices). Show $U$ is a subspace of $M_{22}$ and find $\dim U$.`}</p>
              <Callout icon="🧭" title="Hint" color="teal">
                {String.raw`The subspace check is the same three-line pattern as Example 6.3.11, with transposes. For the dimension: write $A=\begin{bmatrix}a&b\\c&d\end{bmatrix}$ and impose $A^T=-A$ entry by entry — you should find the diagonal entries are forced to be $0$ and the off-diagonal entries are forced to be negatives of each other, leaving only `}<i>one</i>{String.raw` free parameter.`}
              </Callout>
            </Exercise>

            <Exercise id="B" title="Independence check in P₂">
              <p>{String.raw`Determine whether $\{1-x^2,\; 2+x,\; x+x^2\}$ is independent in $P_2$.`}</p>
              <Callout icon="🧭" title="Hint" color="teal">
                {String.raw`Set $t_1(1-x^2)+t_2(2+x)+t_3(x+x^2)=0$ and match coefficients of $1, x, x^2$ to get three equations in $t_1,t_2,t_3$. Solve exactly as in Example 6.3.1 — chase the equations through in a convenient order until every $t_i$ is forced to $0$.`}
              </Callout>
            </Exercise>

            <Exercise id="C" title="No finite set spans P">
              <p>{String.raw`Using the idea from §15, explain in your own words why `}<b>no finite set</b>{String.raw` of polynomials can span $P$.`}</p>
              <Callout icon="🧭" title="Hint" color="teal">
                {String.raw`Suppose some finite set spanned $P$ and let $N$ be the largest degree appearing in it. What degree does `}<i>every</i>{String.raw` linear combination of that set have, at most? Now compare that to the polynomial $x^{N+1}$.`}
              </Callout>
            </Exercise>

            {/* CLOSING */}
            <div style={{ marginTop:'48px', padding:'28px 32px', background:'rgba(56,201,176,.08)', border:'2px solid rgba(56,201,176,.35)', borderRadius:'16px' }}>
              <div style={{ fontFamily:'var(--fm)', fontSize:'.7rem', letterSpacing:'.16em', textTransform:'uppercase', color:'#2a9d8f', marginBottom:'12px' }}>Looking back</div>
              <p style={{ fontFamily:'var(--fh)', fontSize:'1.4rem', color:'var(--lec-ink)', margin:'0 0 16px', fontWeight:400, lineHeight:1.3 }}>
                Nothing in Lectures 14–15 was really about ℝⁿ. It was about closure, combinations, and counting — and that works anywhere.
              </p>
              <p style={{ color:'var(--lec-ink2)', fontSize:'.97rem', lineHeight:1.8, margin:0 }}>
                {String.raw`Matrices, polynomials, and functions all turned out to be vectors in exactly the technical sense of Definition 6.1 — and every tool from subspaces to dimension carried over without a single new proof. That is the payoff of abstraction: prove something once, in general, and it is true forever after for every new example you meet — including ones, like $F[a,b]$, that you have not fully explored yet.`}
              </p>
            </div>

            <div style={{ marginTop:'64px', paddingTop:'28px', borderTop:'2px solid var(--lec-border)', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'12px' }}>
              <div style={{ fontFamily:'var(--fm)', fontSize:'.76rem', color:'var(--lec-ink3)', fontStyle:'italic' }}>Lecture 16 — complete</div>
              <div style={{ fontFamily:'var(--fm)', fontSize:'.76rem', color:'var(--lec-ink3)' }}>MATH-120 · Shoaib Khan · LUMS · July 2026</div>
            </div>
          </div>

          {/* FOOTER NAV */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'22px 48px', borderTop:'1px solid var(--lec-border)', background:'var(--lec-paper)', flexWrap:'wrap', gap:'12px' }}>
            <Link href={PREV_HREF} style={{ fontFamily:'var(--fm)', fontSize:'.74rem', letterSpacing:'.08em', textTransform:'uppercase', color:'var(--lec-accent)', textDecoration:'none' }}>← Lecture 15</Link>
            <Link href={NEXT_HREF} style={{ fontFamily:'var(--fm)', fontSize:'.74rem', letterSpacing:'.08em', textTransform:'uppercase', color:'var(--lec-accent)', textDecoration:'none' }}>Course Home →</Link>
          </div>
        </main>
      </div>

      <Footer/>
    </>
  );
}