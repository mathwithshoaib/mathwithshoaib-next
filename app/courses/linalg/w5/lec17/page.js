'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import Navbar from '../../../../components/Navbar';
import Footer from '../../../../components/Footer';

/* ════════════════════════════════════════════════════════════
   MATH-120 · LECTURE 17
   Extending a Basis; Row Space, Column Space & Null Space — §6.4
   Route: /courses/linalg/w5/lec17
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
];
const THIS_SLUG = 'w5/lec17';
const PREV_HREF  = '/courses/linalg/w5/lec16';
const NEXT_HREF  = '/courses/linalg';

const LEC = {
  course: 'MATH-120 · Linear Algebra',
  number: 'Lecture 17',
  title: 'Extending a Basis',
  subtitle: 'How to grow an independent set into a full basis, how to shrink a spanning set down to one — and the four subspaces every matrix carries with it',
  date: '8 July 2026',
};

const ANCHORS = [
  ['Recall', 'recall'],
  ['Independent Lemma', 'ind-lemma'],
  ['Finite vs Infinite Dim', 'fin-dim'],
  ['Enlarging to a Basis', 'enlarge-lemma'],
  ['Theorem 6.4.1', 'thm641'],
  ['Example 6.4.1 — M₂₂', 'ex641'],
  ['Example 6.4.2 — P₃', 'ex642'],
  ['Example 6.4.3 — dim P = ∞', 'ex643'],
  ['Theorem 6.4.2', 'thm642'],
  ['Example 6.4.5', 'ex645'],
  ['Dependent Lemma', 'dep-lemma'],
  ['Example 6.4.6', 'ex646'],
  ['Row Space', 'row-space'],
  ['Column Space', 'col-space'],
  ['Null Space', 'null-space'],
  ['Rank–Nullity', 'rank-nullity'],
  ['Looking Ahead', 'ahead'],
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

/* ═══════════════ PAGE ═══════════════ */
export default function Lec17() {
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
        <span style={{color:'var(--text2)'}}>Week 5 · Lecture 17</span>
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
            <Link href={PREV_HREF} style={{ display:'flex', alignItems:'center', padding:'0 16px', height:'100%', fontFamily:'var(--fm)', fontSize:'.72rem', color:'var(--lec-ink3)', borderRight:'1px solid var(--lec-border)', whiteSpace:'nowrap', flexShrink:0, textDecoration:'none' }}>← Lecture 16</Link>
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

            {/* ─── §1 RECALL ─── */}
            <Sec id="recall" n="§1">Quick Recall</Sec>

            <p>{String.raw`Lecture 16 gave us the general definition of a vector space and showed that subspaces, spans, independence, basis, and dimension all carry over from $\mathbb{R}^n$ to matrices, polynomials, and functions without a single new proof. Today we ask a very practical question that the earlier lectures never quite settled:`}</p>

            <Callout icon="🎯" title="Today's question" color="amber">
              {String.raw`Given a set of vectors that is `}<i>independent but too small</i>{String.raw` to be a basis, can we always grow it into one? And given a set that `}<i>spans but is too big</i>{String.raw` to be a basis, can we always shrink it into one? The answer to both is yes — and the tools that prove it are two small, sharp lemmas that do almost all of the work in this lecture.`}
            </Callout>

            <BulletList items={[
              <span key="r1"><b>Independent</b>{String.raw`: the only combination $a_1\mathbf{v}_1+\cdots+a_k\mathbf{v}_k=\mathbf{0}$ is the trivial one, $a_1=\cdots=a_k=0$.`}</span>,
              <span key="r2"><b>Spans $V$</b>{String.raw`: every vector of $V$ is `}<i>some</i>{String.raw` linear combination of the set.`}</span>,
              <span key="r3"><b>Basis</b>{String.raw`: independent `}<i>and</i>{String.raw` spans — the two properties meeting in the middle, with no waste and nothing missing.`}</span>,
            ]}/>

            {/* ─── §2 INDEPENDENT LEMMA ─── */}
            <Sec id="ind-lemma" n="§2">Lemma 6.4.1 — The Independent Lemma</Sec>

            <ThmBox title="Lemma 6.4.1">
              <p style={{margin:0}}>{String.raw`Let $\{\mathbf{v}_1, \mathbf{v}_2, \ldots, \mathbf{v}_k\}$ be an independent set of vectors in a vector space $V$. If $\mathbf{u} \in V$ but $\mathbf{u} \notin \operatorname{span}\{\mathbf{v}_1,\mathbf{v}_2,\ldots,\mathbf{v}_k\}$, then $\{\mathbf{u}, \mathbf{v}_1, \mathbf{v}_2, \ldots, \mathbf{v}_k\}$ is also independent.`}</p>
            </ThmBox>

            <Callout icon="💡" title="Explanation" color="teal">
              {String.raw`Independence means no vector in the set is redundant — none can be built from the others. Now bring in a genuinely `}<b>new</b>{String.raw` vector $\mathbf{u}$, one that cannot be reached by combining $\mathbf{v}_1,\ldots,\mathbf{v}_k$ at all. Could adding it suddenly create a dependency? A dependency would mean some nontrivial combination of $\mathbf{u},\mathbf{v}_1,\ldots,\mathbf{v}_k$ equals $\mathbf{0}$. But if the coefficient on $\mathbf{u}$ in that combination were nonzero, you could divide it out and solve for $\mathbf{u}$ in terms of the $\mathbf{v}_i$'s — directly contradicting $\mathbf{u}\notin\operatorname{span}\{\mathbf{v}_1,\ldots,\mathbf{v}_k\}$. So the coefficient on $\mathbf{u}$ must be $0$, which reduces the whole thing to a dependency among $\mathbf{v}_1,\ldots,\mathbf{v}_k$ alone — impossible, since they were already independent. So no nontrivial relation can exist: stepping "outside the span" is exactly what keeps a set independent as it grows.`}
            </Callout>

            {/* ─── §3 FINITE VS INFINITE DIM ─── */}
            <Sec id="fin-dim" n="§3">Finite- vs. Infinite-Dimensional Spaces</Sec>

            <DefBox term="Definition 6.7 — Finite / infinite dimensional" color="teal">
              <p style={{margin:0}}>{String.raw`A vector space $V$ is called `}<b>finite dimensional</b>{String.raw` if it is spanned by a finite set of vectors. Otherwise, $V$ is called `}<b>infinite dimensional</b>{String.raw`.`}</p>
            </DefBox>

            <p>{String.raw`Notice this is purely a statement about `}<i>existence</i>{String.raw`: does even one finite spanning list exist, no matter how large? If yes, the space is finite dimensional — even $\{\mathbf{0}\}$ qualifies, since the single vector $\mathbf{0}$ by itself spans it (`}<i>{String.raw`$\operatorname{span}\{\mathbf{0}\}=\{\mathbf{0}\}$`}</i>{String.raw`), so `}<b>{String.raw`the zero vector space $\{\mathbf{0}\}$ is finite dimensional`}</b>{String.raw`, with $\dim\{\mathbf{0}\}=0$ (the empty set is its basis).`}</p>

            <Callout icon="⚖️" title="The dividing line, with examples" color="amber">
              <BulletList dense items={[
                <span key="f1"><b>Finite dimensional</b>{String.raw`: $\mathbb{R}^n$ (basis $\{\mathbf{e}_1,\ldots,\mathbf{e}_n\}$, size $n$), $P_n$ (basis $\{1,x,\ldots,x^n\}$, size $n{+}1$), $M_{mn}$ (basis the matrix units, size $mn$) — each has a `}<i>finite</i>{String.raw` list that spans everything.`}</span>,
                <span key="f2"><b>Infinite dimensional</b>{String.raw`: $P$, the space of `}<i>all</i>{String.raw` polynomials (Lecture 16, §15, and Example 6.4.3 below), and $F[a,b]$, the space of all functions on an interval — no finite list can ever span them, because you can always produce a polynomial or function of higher degree/complexity than anything your finite list can reach.`}</span>,
              ]}/>
            </Callout>

            {/* ─── §4 ENLARGE LEMMA ─── */}
            <Sec id="enlarge-lemma" n="§4">Lemma 6.4.2 — Enlarging to a Basis</Sec>

            <ThmBox title="Lemma 6.4.2">
              <p style={{margin:0}}>{String.raw`Let $V$ be a finite dimensional vector space. If $U$ is any subspace of $V$, then any independent subset of $U$ can be enlarged to a finite basis of $U$.`}</p>
            </ThmBox>

            <Callout icon="💡" title="Explanation" color="teal">
              {String.raw`This is Lemma 6.4.1, run on repeat. Start with your independent subset of $U$. If it already spans $U$, you're done — it's a basis. If not, then by definition some vector $\mathbf{u}\in U$ lies outside its span, and Lemma 6.4.1 says you may add $\mathbf{u}$ while staying independent. Repeat: as long as the current set doesn't yet span $U$, there is always another vector of $U$ you're allowed to add. The only reason this process is guaranteed to `}<i>stop</i>{String.raw` — rather than grow forever — is that $V$ (and hence $U$) is finite dimensional: an independent set inside a finite-dimensional space can never contain more vectors than a fixed spanning set for that space (Theorem 6.4.1 below makes this precise), so the growing process runs out of room after finitely many steps. At that point, the set spans $U$ too, and — independent and spanning — it is a basis.`}
            </Callout>

            {/* ─── §5 THEOREM 6.4.1 ─── */}
            <Sec id="thm641" n="§5">Theorem 6.4.1</Sec>

            <ThmBox title="Theorem 6.4.1">
              <p style={{margin:'0 0 10px'}}>{String.raw`Let $V$ be a finite dimensional vector space spanned by $m$ vectors.`}</p>
              <BulletList dense items={[
                <span key="t1"><b>1.</b>{String.raw` $V$ has a finite basis, and $\dim V \leq m$.`}</span>,
                <span key="t2"><b>2.</b>{String.raw` Every independent set of vectors in $V$ can be enlarged to a basis of $V$ by adding vectors from any fixed basis of $V$.`}</span>,
                <span key="t3"><b>3.</b>{String.raw` If $U$ is a subspace of $V$, then: `}<b>(a)</b>{String.raw` $U$ is finite dimensional and $\dim U \leq \dim V$; `}<b>(b)</b>{String.raw` every basis of $U$ is part of a basis of $V$.`}</span>,
              ]}/>
            </ThmBox>

            <Callout icon="💡" title="Explanation — part by part" color="violet">
              <p style={{margin:'0 0 10px'}}><b>Part 1.</b>{String.raw` If $m$ vectors already span $V$, no independent set inside $V$ can ever contain more than $m$ vectors — extra vectors beyond what's needed to span would necessarily create redundancy. So the "enlarging" process of Lemma 6.4.2, started from the empty set, must stabilize at some basis with at most $m$ vectors: a finite basis exists, and $\dim V\leq m$.`}</p>
              <p style={{margin:'0 0 10px'}}><b>Part 2.</b>{String.raw` This sharpens Lemma 6.4.2: you don't need to search all of $V$ for vectors to add — it's enough to check a `}<i>single fixed basis</i>{String.raw` you already know, and add whichever of its vectors are not yet in the span of your independent set. This is exactly the strategy Examples 6.4.1 and 6.4.2 below use: reach for the standard basis and test its vectors one at a time.`}</p>
              <p style={{margin:0}}><b>Part 3.</b>{String.raw` A subspace can never have "more room" than the space containing it — (a) says this precisely: $U$ is automatically finite dimensional too, with $\dim U\leq\dim V$. And (b) says the coordinate system you build for $U$ is never wasted: it always extends to a full coordinate system for all of $V$, by the same enlarging process.`}</p>
            </Callout>

            {/* ─── §6 EXAMPLE 6.4.1 ─── */}
            <Sec id="ex641" n="§6">Enlarging a Basis in M₂₂</Sec>

            <Example n="1" title="Example 6.4.1 — enlarge D to a basis of M₂₂" advanced>
              <p>{String.raw`Enlarge the independent set $D = \left\{ \begin{bmatrix}1&1\\1&0\end{bmatrix}, \begin{bmatrix}0&1\\1&1\end{bmatrix}, \begin{bmatrix}1&0\\1&1\end{bmatrix} \right\}$ to a basis of $M_{22}$.`}</p>
              <Reveal label="Show full solution">
                <p style={{margin:'0 0 8px'}}>{String.raw`Write each matrix as a coordinate vector $(a,b,c,d)$ reading $\begin{bmatrix}a&b\\c&d\end{bmatrix}$: $\mathbf{v}_1=(1,1,1,0)$, $\mathbf{v}_2=(0,1,1,1)$, $\mathbf{v}_3=(1,0,1,1)$.`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Confirm independence.}$ Row reduce the $3\times4$ array of coordinates: $R_2\to R_2, \; R_3\to R_3-R_1=(0,-1,0,1)$, then $R_3\to R_3+R_2=(0,0,1,2)$. The result $\begin{bmatrix}1&1&1&0\\0&1&1&1\\0&0&1&2\end{bmatrix}$ has $3$ nonzero pivot rows, so $D$ is indeed independent — confirming what the problem states.`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Add one more vector.}$ Since $\dim M_{22}=4$ and $|D|=3$, Theorem 6.4.1(2) says we may find the missing vector among the standard basis $\{E_{11},E_{12},E_{21},E_{22}\}$. Try $E_{11}=\begin{bmatrix}1&0\\0&0\end{bmatrix}=(1,0,0,0)$.`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`Stack all four coordinate vectors and test invertibility by determinant, expanding along the last row $(1,0,0,0)$ (only one nonzero entry, in column $1$):`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$\det\begin{bmatrix} 1&1&1&0 \\ 0&1&1&1 \\ 1&0&1&1 \\ 1&0&0&0 \end{bmatrix} = (-1)^{4+1}\det\begin{bmatrix}1&1&0\\1&1&1\\0&1&1\end{bmatrix}.$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`The $3\times3$ determinant is $1(1{-}1)-1(1{-}0)+0(1{-}0) = 0-1+0=-1$, so the full determinant is $(-1)\cdot(-1) = 1 \neq 0$.`}</p>
                <p style={{margin:0}}>{String.raw`The four coordinate vectors are independent, so $D\cup\{E_{11}\}$ is an independent set of $4$ vectors in the $4$-dimensional space $M_{22}$ — automatically a basis:`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$\left\{ \begin{bmatrix}1&1\\1&0\end{bmatrix}, \begin{bmatrix}0&1\\1&1\end{bmatrix}, \begin{bmatrix}1&0\\1&1\end{bmatrix}, \begin{bmatrix}1&0\\0&0\end{bmatrix} \right\} \text{ is a basis of } M_{22}. \qquad \blacksquare$$`}</p>
              </Reveal>
            </Example>

            {/* ─── §7 EXAMPLE 6.4.2 ─── */}
            <Sec id="ex642" n="§7">Enlarging a Basis in P₃</Sec>

            <Example n="2" title="Example 6.4.2 — a basis of P₃ containing {1+x, 1+x²}" advanced>
              <p>{String.raw`Find a basis of $P_3$ containing the independent set $\{1+x,\; 1+x^2\}$.`}</p>
              <Reveal label="Show full solution">
                <p style={{margin:'0 0 8px'}}>{String.raw`$\dim P_3 = 4$ and we have $2$ vectors, so $2$ more are needed. As in Theorem 6.4.1(2), try vectors from the standard basis $\{1,x,x^2,x^3\}$ — say $x^2$ and $x^3$.`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Test independence of } \{1+x,\; 1+x^2,\; x^2,\; x^3\}.$ Suppose`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$c_1(1+x) + c_2(1+x^2) + c_3x^2 + c_4x^3 = 0.$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`Matching coefficients of $1,x,x^2,x^3$:`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$\begin{aligned} c_1+c_2 &= 0 \quad(\text{const})\\ c_1 &= 0 \quad(x)\\ c_2+c_3 &= 0 \quad(x^2)\\ c_4 &= 0 \quad(x^3) \end{aligned}$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`From the $x$-equation, $c_1=0$. Then the constant equation gives $c_2=0$, and the $x^2$-equation gives $c_3=0$. The $x^3$-equation gives $c_4=0$ directly. Only the trivial solution exists.`}</p>
                <p style={{margin:0}}>{String.raw`So the set is independent — $4$ independent vectors in the $4$-dimensional space $P_3$ — hence a basis:`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$\{1+x,\; 1+x^2,\; x^2,\; x^3\} \text{ is a basis of } P_3. \qquad \blacksquare$$`}</p>
              </Reveal>
            </Example>

            {/* ─── §8 EXAMPLE 6.4.3 ─── */}
            <Sec id="ex643" n="§8">P Is Infinite Dimensional</Sec>

            <Example n="3" title="Example 6.4.3 — the space P of all polynomials is infinite dimensional" advanced>
              <p>{String.raw`Show that the space $P$ of all polynomials is infinite dimensional.`}</p>
              <Reveal label="Show full solution">
                <p style={{margin:'0 0 8px'}}>{String.raw`Suppose, for contradiction, that $P$ `}<i>were</i>{String.raw` finite dimensional — that is, some finite set $\{q_1, q_2, \ldots, q_m\}$ spans $P$. Let $N$ be the `}<i>largest</i>{String.raw` degree occurring among $q_1,\ldots,q_m$.`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`Every linear combination $a_1q_1+\cdots+a_mq_m$ then has degree at most $N$: adding or scaling polynomials can only cancel terms or leave degree unchanged, never `}<i>raise</i>{String.raw` it past the largest degree already present.`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`But $x^{N+1}$ is a perfectly ordinary member of $P$, with degree $N+1 > N$. It can never be written as such a combination — it is outside $\operatorname{span}\{q_1,\ldots,q_m\}$, contradicting the assumption that this set spans $P$.`}</p>
                <p style={{margin:0}}>{String.raw`So no finite set can span $P$. By Definition 6.7, $P$ is `}<b>infinite dimensional</b>{String.raw`. $\;\blacksquare$`}</p>
              </Reveal>
            </Example>

            {/* ─── §9 THEOREM 6.4.2 ─── */}
            <Sec id="thm642" n="§9">Theorem 6.4.2</Sec>

            <ThmBox title="Theorem 6.4.2">
              <p style={{margin:'0 0 10px'}}>{String.raw`Let $U$ and $W$ be subspaces of the finite dimensional space $V$.`}</p>
              <BulletList dense items={[
                <span key="tt1"><b>1.</b>{String.raw` If $U \subseteq W$, then $\dim U \leq \dim W$.`}</span>,
                <span key="tt2"><b>2.</b>{String.raw` If $U \subseteq W$ and $\dim U = \dim W$, then $U = W$.`}</span>,
              ]}/>
            </ThmBox>

            <Callout icon="💡" title="Explanation" color="teal">
              {String.raw`Both parts are dimension-counting consequences of Theorem 6.4.1. `}<b>Part 1</b>{String.raw` is Theorem 6.4.1(3a) applied twice: $U$ is a subspace of $W$ (since $U\subseteq W\subseteq V$), so $\dim U\leq\dim W$ directly — a smaller nested space cannot have more independent directions than the space containing it.`}<br/><br/>
              <b>Part 2</b>{String.raw` is the sharp, surprising consequence: take any basis of $U$ — it is an independent subset of $W$ too (since $U\subseteq W$), with exactly $\dim U=\dim W$ vectors. By Theorem 6.4.1(2), this basis of $U$ could in principle be enlarged to a basis of $W$ by adding more vectors from $W$ — but there is no room left, since it already has $\dim W$ vectors and a basis of $W$ has exactly that many. So no vectors need to be added: the basis of $U$ `}<i>already</i>{String.raw` spans $W$, which forces $U=W$. In words: `}<b>a subspace that fills up all the available dimension of a larger space must in fact be the whole space.</b>
            </Callout>

            {/* ─── §10 EXAMPLE 6.4.5 ─── */}
            <Sec id="ex645" n="§10">A Basis for {'{p(x) : p(a) = 0}'}</Sec>

            <Example n="4" title="Example 6.4.5 — polynomials in Pₙ with a as a root" advanced>
              <p>{String.raw`If $a$ is a number, let $W$ denote the subspace of all polynomials in $P_n$ that have $a$ as a root: $W = \{p(x) \text{ in } P_n : p(a) = 0\}$. Show that $\{(x-a),\, (x-a)^2,\, \ldots,\, (x-a)^n\}$ is a basis of $W$.`}</p>
              <Reveal label="Show full solution">
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Step 1 — a useful basis of } P_n.$ The substitution $y = x-a$ is an invertible linear change of variable, so translating the monomial basis $\{1,y,y^2,\ldots,y^n\}$ of "degree $\leq n$ polynomials in $y$" back into $x$ shows`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$\{1,\, (x-a),\, (x-a)^2,\, \ldots,\, (x-a)^n\} \text{ is also a basis of } P_n.$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`In particular, every $p(x)\in P_n$ can be written `}<i>uniquely</i>{String.raw` as`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$p(x) = c_0 + c_1(x-a) + c_2(x-a)^2 + \cdots + c_n(x-a)^n.$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Step 2 — the given set lies in } W \text{ and spans it.}$ Setting $x=a$ kills every term except the first: $p(a)=c_0$. If $p\in W$, then $p(a)=0$, forcing $c_0=0$. So every $p\in W$ has the form`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$p(x) = c_1(x-a) + c_2(x-a)^2 + \cdots + c_n(x-a)^n,$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`a linear combination of $\{(x-a),\ldots,(x-a)^n\}$ alone — so this set spans $W$. Conversely each $(x-a)^k$ ($k\geq1$) clearly satisfies $(a-a)^k=0$, so each lies in $W$.`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Step 3 — independence.}$ This set is a subset of the basis $\{1,(x-a),\ldots,(x-a)^n\}$ of $P_n$ found in Step 1 (just omitting the constant term $1$), and any subset of an independent set is independent.`}</p>
                <p style={{margin:0}}>{String.raw`Independent and spanning $W$: $\{(x-a),(x-a)^2,\ldots,(x-a)^n\}$ is a basis of $W$, and $\dim W = n$ — exactly one less than $\dim P_n = n+1$, consistent with Theorem 6.4.2(1) since $W\subsetneq P_n$. $\;\blacksquare$`}</p>
              </Reveal>
            </Example>

            {/* ─── §11 DEPENDENT LEMMA ─── */}
            <Sec id="dep-lemma" n="§11">Lemma 6.4.3 — The Dependent Lemma</Sec>

            <ThmBox title="Lemma 6.4.3">
              <p style={{margin:0}}>{String.raw`A set $D = \{\mathbf{v}_1, \mathbf{v}_2, \ldots, \mathbf{v}_k\}$ of vectors in a vector space $V$ is dependent if and only if some vector in $D$ is a linear combination of the others.`}</p>
            </ThmBox>

            <Callout icon="💡" title="Explanation" color="rose">
              {String.raw`This is the mirror image of the Independent Lemma, and it gives independence its most intuitive meaning: `}<b>a set is dependent exactly when it contains wasted effort</b>{String.raw` — some vector whose "job" could already be done by combining the rest, so it contributes nothing new to the span. If $D$ is dependent, some nontrivial combination $a_1\mathbf{v}_1+\cdots+a_k\mathbf{v}_k=\mathbf{0}$ has a nonzero coefficient, say $a_j\neq0$; dividing through by $a_j$ and solving for $\mathbf{v}_j$ expresses it as a combination of the others. Conversely, if some $\mathbf{v}_j$ is such a combination, moving everything to one side produces a nontrivial relation equal to $\mathbf{0}$ (the coefficient on $\mathbf{v}_j$ is $-1\neq0$), so $D$ is dependent. This is exactly the tool we need to `}<b>shrink</b>{String.raw` an oversized spanning set down to a basis: find a redundant vector, and discard it — the span doesn't change.`}
            </Callout>

            {/* ─── §12 EXAMPLE 6.4.6 ─── */}
            <Sec id="ex646" n="§12">Shrinking a Spanning Set of P₃</Sec>

            <Example n="5" title="Example 6.4.6 — find a basis inside a spanning set" advanced>
              <p>{String.raw`Find a basis of $P_3$ in the spanning set $S = \{1,\; x+x^2,\; 2x-3x^2,\; 1+3x-2x^2,\; x^3\}$.`}</p>
              <Reveal label="Show full solution">
                <p style={{margin:'0 0 8px'}}>{String.raw`Label $s_1=1$, $s_2=x+x^2$, $s_3=2x-3x^2$, $s_4=1+3x-2x^2$, $s_5=x^3$. Since $\dim P_3=4$ and $|S|=5$, exactly one vector must be redundant — the Dependent Lemma says to look for a vector that is a combination of the others.`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Spotting the redundant vector.}$ Try to write $s_4$ in terms of $s_1,s_2,s_3$: solve $s_4 = a\,s_1+b\,s_2+c\,s_3$, i.e. matching coefficients of $1,x,x^2$:`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$\begin{aligned} a &= 1 \\ b+2c &= 3 \\ b-3c &= -2 \end{aligned}$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`Subtracting the last two equations: $5c=5$, so $c=1$, and then $b=3-2(1)=1$. Check: $s_1+s_2+s_3 = 1 + (x+x^2) + (2x-3x^2) = 1+3x-2x^2 = s_4$ ✓. So`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$s_4 = s_1+s_2+s_3,$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`and by the Dependent Lemma, $S$ is dependent with $s_4$ redundant. Discarding $s_4$ does not shrink the span, since anything $s_4$ contributes, $s_1,s_2,s_3$ already provide.`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Checking what remains.}$ Test independence of $\{s_1,s_2,s_3,s_5\} = \{1,\; x+x^2,\; 2x-3x^2,\; x^3\}$ as coordinate vectors $(1,0,0,0)$, $(0,1,1,0)$, $(0,2,-3,0)$, $(0,0,0,1)$. Expanding the determinant along the last row (only entry $1$, in column $4$):`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$\det\begin{bmatrix}1&0&0&0\\0&1&1&0\\0&2&-3&0\\0&0&0&1\end{bmatrix} = \det\begin{bmatrix}1&0&0\\0&1&1\\0&2&-3\end{bmatrix} = 1\cdot\det\begin{bmatrix}1&1\\2&-3\end{bmatrix} = 1(-3-2) = -5 \neq 0.$$`}</p>
                <p style={{margin:0}}>{String.raw`Nonzero determinant, so these $4$ vectors are independent — and $4$ independent vectors in the $4$-dimensional space $P_3$ form a basis:`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$\{1,\; x+x^2,\; 2x-3x^2,\; x^3\} \text{ is a basis of } P_3. \qquad \blacksquare$$`}</p>
              </Reveal>
            </Example>

            <Callout icon="🧭" title="Two techniques, one page" color="amber">
              {String.raw`This closes §6.4's toolkit: if a set is `}<b>too small</b>{String.raw` (independent, not yet spanning), the Independent Lemma tells you `}<i>any</i>{String.raw` outside vector may be added. If a set is `}<b>too big</b>{String.raw` (spans, not independent), the Dependent Lemma tells you to find a vector that's a combination of the others and discard it. Either direction, you arrive at a basis.`}
            </Callout>

            {/* ─── §13 ROW SPACE ─── */}
            <Sec id="row-space" n="§13">Row Space of a Matrix</Sec>

            <p>{String.raw`We now turn from abstract vector spaces to the four subspaces that every matrix carries with it — the natural home of everything we did with Gaussian elimination back in Week 1, now seen through the lens of dimension.`}</p>

            <DefBox term="Definition — row space" color="teal">
              <p style={{margin:0}}>{String.raw`For an $m\times n$ matrix $A$, the `}<b>row space</b>{String.raw` of $A$, written $\operatorname{row}(A)$, is the subspace of $\mathbb{R}^n$ spanned by the rows of $A$ (treated as vectors in $\mathbb{R}^n$).`}</p>
            </DefBox>

            <Example n="6" title="Elementary row operations don't change the row space" advanced>
              <p>{String.raw`Prove: if $B$ is obtained from $A$ by adding a multiple of one row to another, then $\operatorname{row}(A) = \operatorname{row}(B)$.`}</p>
              <Reveal label="Show proof">
                <p style={{margin:'0 0 8px'}}>{String.raw`Say $B$ is obtained from $A$ by replacing row $R_i$ with $R_i + cR_j$ ($i\neq j$), leaving every other row unchanged.`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{row}(B)\subseteq\textbf{row}(A)$: every row of $B$ is either an unchanged row of $A$, or the row $R_i+cR_j$ — which is itself a linear combination of rows of $A$. So every row of $B$ lies in $\operatorname{span}$ of the rows of $A$, giving $\operatorname{row}(B)\subseteq\operatorname{row}(A)$.`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{row}(A)\subseteq\textbf{row}(B)$: conversely, $R_i = (R_i+cR_j) - cR_j$ is a combination of two rows of $B$ (the new row $i$, and unchanged row $j$). Every other row of $A$ is already an unchanged row of $B$. So every row of $A$ lies in $\operatorname{span}$ of the rows of $B$, giving $\operatorname{row}(A)\subseteq\operatorname{row}(B)$.`}</p>
                <p style={{margin:0}}>{String.raw`Both inclusions give $\operatorname{row}(A)=\operatorname{row}(B)$. (Swapping two rows, or scaling a row by a nonzero constant, changes the row space even less obviously — the same rows, or a scalar multiple of one, span an identical space.) $\;\blacksquare$ This is why we may compute $\operatorname{row}(A)$ from `}<i>any</i>{String.raw` row-echelon form of $A$: its nonzero rows form a basis.`}</p>
              </Reveal>
            </Example>

            <Example n="7" title="Computing a row space and its rank" advanced>
              <p>{String.raw`Find a basis for the row space of $A = \begin{bmatrix} 1&2&0&1 \\ 2&4&1&0 \\ 0&0&1&-2 \end{bmatrix}$, and state $\operatorname{rank}(A)$.`}</p>
              <Reveal label="Show full solution">
                <p style={{margin:'0 0 8px'}}>{String.raw`Row reduce: $R_2 \to R_2 - 2R_1 = (0,0,1,-2)$, giving`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$\begin{bmatrix} 1&2&0&1 \\ 0&0&1&-2 \\ 0&0&1&-2 \end{bmatrix} \xrightarrow{R_3\to R_3-R_2} \begin{bmatrix} 1&2&0&1 \\ 0&0&1&-2 \\ 0&0&0&0 \end{bmatrix}.$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`By the previous proof, row reduction preserves the row space, so we may read a basis off this echelon form directly from its nonzero rows:`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$\operatorname{row}(A) = \operatorname{span}\{(1,2,0,1),\;(0,0,1,-2)\}.$$`}</p>
                <p style={{margin:0}}>{String.raw`These two rows are clearly independent (neither is a multiple of the other), so they form a basis, and $\operatorname{rank}(A) = \dim\operatorname{row}(A) = 2$.`}</p>
              </Reveal>
            </Example>

            {/* ─── §14 COLUMN SPACE ─── */}
            <Sec id="col-space" n="§14">Column Space of a Matrix</Sec>

            <DefBox term="Definition — column space" color="violet">
              <p style={{margin:0}}>{String.raw`For an $m\times n$ matrix $A$, the `}<b>column space</b>{String.raw` of $A$, written $\operatorname{col}(A)$, is the subspace of $\mathbb{R}^m$ spanned by the columns of $A$.`}</p>
            </DefBox>

            <Example n="8" title="col(A) is exactly the range of x ↦ Ax" advanced>
              <p>{String.raw`Prove that $\operatorname{col}(A) = \{A\mathbf{x} : \mathbf{x}\in\mathbb{R}^n\}$, and that this set is a subspace of $\mathbb{R}^m$.`}</p>
              <Reveal label="Show proof">
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{The range characterization.}$ If $A$ has columns $\mathbf{c}_1,\ldots,\mathbf{c}_n$ and $\mathbf{x}=(x_1,\ldots,x_n)$, then by the definition of matrix–vector multiplication, $A\mathbf{x} = x_1\mathbf{c}_1+\cdots+x_n\mathbf{c}_n$ — precisely a linear combination of the columns. As $\mathbf{x}$ ranges over all of $\mathbb{R}^n$, the coefficients $x_1,\ldots,x_n$ range over all possible scalars, so $A\mathbf{x}$ ranges over `}<i>every</i>{String.raw` linear combination of the columns — exactly $\operatorname{col}(A)$.`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Subspace check.}$ Using this characterization: $\mathbf{0}=A\mathbf{0}\in\operatorname{col}(A)$ (S1). If $\mathbf{b}_1=A\mathbf{x}_1$ and $\mathbf{b}_2=A\mathbf{x}_2$ are in $\operatorname{col}(A)$, then $\mathbf{b}_1+\mathbf{b}_2 = A\mathbf{x}_1+A\mathbf{x}_2 = A(\mathbf{x}_1+\mathbf{x}_2) \in \operatorname{col}(A)$ (S2). If $\mathbf{b}=A\mathbf{x}\in\operatorname{col}(A)$ and $c$ is a scalar, $c\mathbf{b} = c(A\mathbf{x}) = A(c\mathbf{x}) \in \operatorname{col}(A)$ (S3).`}</p>
                <p style={{margin:0}}>{String.raw`All three subspace axioms hold, confirming $\operatorname{col}(A)$ is a subspace of $\mathbb{R}^m$. $\;\blacksquare$ This range description is exactly why "$A\mathbf{x}=\mathbf{b}$ has a solution" is the same statement as "$\mathbf{b}\in\operatorname{col}(A)$" — a fact you have been using implicitly since Week 1.`}</p>
              </Reveal>
            </Example>

            <Example n="9" title="Computing a column space" advanced>
              <p>{String.raw`Find a basis for $\operatorname{col}(A)$, for the same $A = \begin{bmatrix} 1&2&0&1 \\ 2&4&1&0 \\ 0&0&1&-2 \end{bmatrix}$ used above.`}</p>
              <Reveal label="Show full solution">
                <p style={{margin:'0 0 8px'}}>{String.raw`From Example 7, the echelon form of $A$ has pivots in columns $1$ and $3$. A basis of $\operatorname{col}(A)$ is given by the `}<b>original</b>{String.raw` columns of $A$ (not the reduced ones) in those pivot positions:`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$\operatorname{col}(A) = \operatorname{span}\left\{ \begin{bmatrix}1\\2\\0\end{bmatrix}, \begin{bmatrix}0\\1\\1\end{bmatrix} \right\} \subseteq \mathbb{R}^3.$$`}</p>
                <p style={{margin:0}}>{String.raw`These two columns are clearly independent (neither is a scalar multiple of the other), so $\dim\operatorname{col}(A)=2$. Notice this matches $\dim\operatorname{row}(A)=2$ found in Example 7 — the `}<b>row rank always equals the column rank</b>{String.raw`, a genuinely deep fact (it is why we may speak of a single number, $\operatorname{rank}(A)$, without saying "row rank" or "column rank"), though its proof is beyond what we need here.`}</p>
              </Reveal>
            </Example>

            {/* ─── §15 NULL SPACE ─── */}
            <Sec id="null-space" n="§15">Null Space of a Matrix</Sec>

            <DefBox term="Definition — null space" color="rose">
              <p style={{margin:0}}>{String.raw`For an $m\times n$ matrix $A$, the `}<b>null space</b>{String.raw` of $A$, written $\operatorname{null}(A)$, is the solution set of the homogeneous system $A\mathbf{x}=\mathbf{0}$: $\operatorname{null}(A) = \{\mathbf{x}\in\mathbb{R}^n : A\mathbf{x}=\mathbf{0}\}$, a subspace of $\mathbb{R}^n$.`}</p>
            </DefBox>

            <Example n="10" title="null(A) is a subspace" advanced>
              <p>{String.raw`Prove that $\operatorname{null}(A)$ is a subspace of $\mathbb{R}^n$.`}</p>
              <Reveal label="Show proof">
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{S1.}$ $A\mathbf{0}=\mathbf{0}$, so $\mathbf{0}\in\operatorname{null}(A)$.`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{S2.}$ If $\mathbf{x},\mathbf{y}\in\operatorname{null}(A)$, then $A\mathbf{x}=\mathbf{0}$ and $A\mathbf{y}=\mathbf{0}$, so by linearity of matrix multiplication, $A(\mathbf{x}+\mathbf{y}) = A\mathbf{x}+A\mathbf{y} = \mathbf{0}+\mathbf{0}=\mathbf{0}$. So $\mathbf{x}+\mathbf{y}\in\operatorname{null}(A)$.`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{S3.}$ If $\mathbf{x}\in\operatorname{null}(A)$ and $c$ is a scalar, $A(c\mathbf{x}) = c(A\mathbf{x}) = c\mathbf{0}=\mathbf{0}$. So $c\mathbf{x}\in\operatorname{null}(A)$.`}</p>
                <p style={{margin:0}}>{String.raw`All three hold, so $\operatorname{null}(A)$ is a subspace of $\mathbb{R}^n$. $\;\blacksquare$`}</p>
              </Reveal>
            </Example>

            <Example n="11" title="Computing a null space" advanced>
              <p>{String.raw`Find a basis for $\operatorname{null}(A)$, again for $A = \begin{bmatrix} 1&2&0&1 \\ 2&4&1&0 \\ 0&0&1&-2 \end{bmatrix}$.`}</p>
              <Reveal label="Show full solution">
                <p style={{margin:'0 0 8px'}}>{String.raw`Elementary row operations preserve the solution set of $A\mathbf{x}=\mathbf{0}$ (they produce equivalent systems), so we may solve using the echelon form from Example 7:`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$\begin{aligned} x_1 + 2x_2 + x_4 &= 0 \\ x_3 - 2x_4 &= 0 \end{aligned}$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`The leading variables are $x_1, x_3$; the free variables are $x_2, x_4$. Solving: $x_1 = -2x_2-x_4$ and $x_3 = 2x_4$. Set $x_2=s$, $x_4=t$:`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$\mathbf{x} = (-2s-t,\; s,\; 2t,\; t) = s(-2,1,0,0) + t(-1,0,2,1).$$`}</p>
                <p style={{margin:0}}>{String.raw`So $\operatorname{null}(A) = \operatorname{span}\{(-2,1,0,0),\,(-1,0,2,1)\}$, and these two vectors are independent (neither free variable's vector can reproduce the other's pattern of $0$s and $1$s), so they form a basis: $\dim\operatorname{null}(A)=2$. (You can check directly that $A(-2,1,0,0)^T=\mathbf{0}$ and $A(-1,0,2,1)^T=\mathbf{0}$ using the original, un-reduced $A$.)`}</p>
              </Reveal>
            </Example>

            {/* ─── §16 RANK-NULLITY ─── */}
            <Sec id="rank-nullity" n="§16">The Rank–Nullity Theorem</Sec>

            <ThmBox title="Rank–Nullity Theorem">
              <p style={{margin:0}}>{String.raw`For an $m\times n$ matrix $A$: $$\operatorname{rank}(A) + \operatorname{nullity}(A) = n,$$ where $\operatorname{rank}(A)=\dim\operatorname{row}(A)=\dim\operatorname{col}(A)$ and $\operatorname{nullity}(A)=\dim\operatorname{null}(A)$.`}</p>
            </ThmBox>

            <Callout icon="💡" title="Explanation" color="amber">
              {String.raw`Row-reduce $A$ to echelon form. Every one of the $n$ columns is either a `}<b>pivot column</b>{String.raw` (contributes a leading variable) or a `}<b>free column</b>{String.raw` (contributes a free variable) — every column is exactly one or the other, so pivot columns $+$ free columns $=n$. The number of pivot columns `}<i>is</i>{String.raw` $\operatorname{rank}(A)$ (it's literally how rank is computed). The number of free variables `}<i>is</i>{String.raw` $\dim\operatorname{null}(A)$: each free variable, set to $1$ with the rest set to $0$, generates exactly one basis vector of the null space (as in Example 11 above), and these vectors are always independent because each one is the only basis vector with a $1$ in its own free-variable slot. So $\operatorname{rank}(A)+\operatorname{nullity}(A)$ counts pivot columns plus free columns — which is just $n$, the total number of columns.`}
            </Callout>

            <Example n="12" title="Verifying rank–nullity">
              <p>{String.raw`Verify the Rank–Nullity Theorem for $A = \begin{bmatrix} 1&2&0&1 \\ 2&4&1&0 \\ 0&0&1&-2 \end{bmatrix}$, and then use the theorem directly on a new matrix.`}</p>
              <Reveal label="Show full solution">
                <p style={{margin:'0 0 8px'}}>{String.raw`From Examples 7 and 11: $\operatorname{rank}(A)=2$ and $\operatorname{nullity}(A)=2$. The matrix has $n=4$ columns, and indeed $\operatorname{rank}(A)+\operatorname{nullity}(A) = 2+2=4=n$. ✓`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{A quick second use.}$ Suppose $B$ is a $4\times7$ matrix with $\operatorname{rank}(B)=3$. Without solving any system, the Rank–Nullity Theorem gives`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$\operatorname{nullity}(B) = n - \operatorname{rank}(B) = 7-3 = 4.$$`}</p>
                <p style={{margin:0}}>{String.raw`This is the theorem's real power: once you know the rank, the size of the solution space to $B\mathbf{x}=\mathbf{0}$ is immediate — no row reduction required.`}</p>
              </Reveal>
            </Example>

            {/* ─── §17 LOOKING AHEAD ─── */}
            <Sec id="ahead" n="§17">Looking Ahead</Sec>

            <Callout icon="🧭" title="Next lecture: Orthogonality" color="violet">
              {String.raw`We now have a complete toolkit for the `}<i>algebraic</i>{String.raw` shape of a subspace — spanning sets, independence, dimension, and the four subspaces of a matrix. What's missing is `}<i>geometry</i>{String.raw`: angles, lengths, and the idea of two vectors being "perpendicular." The next lecture introduces `}<b>orthogonality</b>{String.raw` — dot products, orthogonal sets and bases, and orthogonal projection — which will let us decompose $\mathbb{R}^n$ into perpendicular pieces built exactly from the row space, column space, and null space we computed today.`}
            </Callout>

            {/* ─── §18 EXERCISES ─── */}
            <Sec id="exercises" n="§18">Exercises</Sec>

            <p style={{fontStyle:'italic', color:'var(--lec-ink3)'}}>{String.raw`Four problems to practice on your own, in the same spirit as today's examples. Hints only — try each one properly before reading further.`}</p>

            <Exercise id="A" title="Enlarging an independent set in P₂">
              <p>{String.raw`Enlarge the independent set $\{1-x,\; x^2\}$ to a basis of $P_2$.`}</p>
              <Callout icon="🧭" title="Hint" color="teal">
                {String.raw`$\dim P_2 = 3$, and you have $2$ vectors — exactly one more is needed. Try each standard basis vector $1, x, x^2$ in turn (skip $x^2$, it's already in your set) and test independence of the resulting triple, the same way Example 6.4.2 did.`}
              </Callout>
            </Exercise>

            <Exercise id="B" title="Shrinking a spanning set in R³">
              <p>{String.raw`The set $\{(1,1,0),\,(0,1,1),\,(1,2,1),\,(1,0,-1)\}$ spans $\mathbb{R}^3$. Find a basis inside it.`}</p>
              <Callout icon="🧭" title="Hint" color="teal">
                {String.raw`Four vectors in a $3$-dimensional space must be dependent. Use the Dependent Lemma: look for one vector that's a combination of two others (try $(1,2,1)$ as a combination of the first two), discard it, then check the remaining three are independent by computing a $3\times3$ determinant.`}
              </Callout>
            </Exercise>

            <Exercise id="C" title="Row, column, and null space of a 2×3 matrix">
              <p>{String.raw`Let $A = \begin{bmatrix} 1 & -1 & 2 \\ 2 & -2 & 5 \end{bmatrix}$. Find bases for $\operatorname{row}(A)$, $\operatorname{col}(A)$, and $\operatorname{null}(A)$, and verify the Rank–Nullity Theorem.`}</p>
              <Callout icon="🧭" title="Hint" color="teal">
                {String.raw`Row reduce first: $R_2\to R_2-2R_1$ gives a clean echelon form with pivots in columns $1$ and $3$. Read off $\operatorname{row}(A)$ from the echelon rows, $\operatorname{col}(A)$ from the `}<i>original</i>{String.raw` pivot columns, and solve for the one free variable to get $\operatorname{null}(A)$. You should find $\operatorname{rank}(A)=2$ and $\operatorname{nullity}(A)=1$, summing to $n=3$.`}
              </Callout>
            </Exercise>

            <Exercise id="D" title="A theorem 6.4.2 consequence">
              <p>{String.raw`Let $U=\operatorname{null}(A)$ for a $4\times4$ matrix $A$ with $\operatorname{rank}(A)=4$. Explain, using Theorem 6.4.2, why $U=\{\mathbf{0}\}$.`}</p>
              <Callout icon="🧭" title="Hint" color="teal">
                {String.raw`Use Rank–Nullity to find $\dim U$ first. Then compare $U$ with the zero subspace $\{\mathbf{0}\}\subseteq U$ using Theorem 6.4.2(2): equal dimensions between nested subspaces force equality.`}
              </Callout>
            </Exercise>

            {/* CLOSING */}
            <div style={{ marginTop:'48px', padding:'28px 32px', background:'rgba(56,201,176,.08)', border:'2px solid rgba(56,201,176,.35)', borderRadius:'16px' }}>
              <div style={{ fontFamily:'var(--fm)', fontSize:'.7rem', letterSpacing:'.16em', textTransform:'uppercase', color:'#2a9d8f', marginBottom:'12px' }}>Looking back</div>
              <p style={{ fontFamily:'var(--fh)', fontSize:'1.4rem', color:'var(--lec-ink)', margin:'0 0 16px', fontWeight:400, lineHeight:1.3 }}>
                Two lemmas — add what's missing, discard what's redundant — turn any independent or spanning set into a basis. The same two ideas, aimed at a matrix, produce its row space, column space, and null space.
              </p>
              <p style={{ color:'var(--lec-ink2)', fontSize:'.97rem', lineHeight:1.8, margin:0 }}>
                {String.raw`Every computation today came down to the same move: row-reduce, then read the answer off the echelon form. What changes is only which piece of the echelon form you read — the nonzero rows for $\operatorname{row}(A)$, the original pivot columns for $\operatorname{col}(A)$, or the free-variable solutions for $\operatorname{null}(A)$. The Rank–Nullity Theorem is the receipt that these three counts always add up correctly.`}
              </p>
            </div>

            <div style={{ marginTop:'64px', paddingTop:'28px', borderTop:'2px solid var(--lec-border)', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'12px' }}>
              <div style={{ fontFamily:'var(--fm)', fontSize:'.76rem', color:'var(--lec-ink3)', fontStyle:'italic' }}>Lecture 17 — complete</div>
              <div style={{ fontFamily:'var(--fm)', fontSize:'.76rem', color:'var(--lec-ink3)' }}>MATH-120 · Shoaib Khan · LUMS · July 2026</div>
            </div>
          </div>

          {/* FOOTER NAV */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'22px 48px', borderTop:'1px solid var(--lec-border)', background:'var(--lec-paper)', flexWrap:'wrap', gap:'12px' }}>
            <Link href={PREV_HREF} style={{ fontFamily:'var(--fm)', fontSize:'.74rem', letterSpacing:'.08em', textTransform:'uppercase', color:'var(--lec-accent)', textDecoration:'none' }}>← Lecture 16</Link>
            <Link href={NEXT_HREF} style={{ fontFamily:'var(--fm)', fontSize:'.74rem', letterSpacing:'.08em', textTransform:'uppercase', color:'var(--lec-accent)', textDecoration:'none' }}>Course Home →</Link>
          </div>
        </main>
      </div>

      <Footer/>
    </>
  );
}