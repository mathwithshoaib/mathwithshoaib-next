'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import Navbar from '../../../../components/Navbar';
import Footer from '../../../../components/Footer';

/* ════════════════════════════════════════════════════════════
   MATH-120 · LECTURE 8
   LU-Factorization & An Application to Input–Output Economics
   Route: /courses/linalg/w3/lec8
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
];
const THIS_SLUG = 'w2/lec8';
const PREV_HREF  = '/courses/linalg/w2/lec7';
const NEXT_HREF  = '/courses/linalg/w3/lec9';

const LEC = {
  course: 'MATH-120 · Linear Algebra',
  number: 'Lecture 8',
  title: 'LU-Factorization & Input–Output Models',
  subtitle: 'Splitting a matrix into triangular pieces for fast solving — and a Nobel-winning application to economics',
  date: '18 June 2026',
};

const ANCHORS = [
  ['Why LU', 'why'],
  ['Triangular Matrices', 'triangular'],
  ['Back Substitution', 'back'],
  ['Forward Substitution', 'forward'],
  ['The Two-Stage Method', 'twostage'],
  ['Triangular Facts', 'lemma'],
  ['Finding L and U', 'finding'],
  ['4×4 Walkthrough', 'walkthrough'],
  ['LU Exercises', 'lu-ex'],
  ['Input–Output', 'io'],
  ['Economics Exercises', 'io-ex'],
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

function SubH({ children }) {
  return <p style={{ fontFamily:'var(--fh)', fontSize:'1.3rem', color:'var(--lec-ink)', margin:'36px 0 12px', fontWeight:600 }}>{children}</p>;
}

/* Visual: a matrix with one region highlighted (diagonal / lower / upper) */
function TriangleHighlight({ kind }) {
  // kind: 'diag' | 'lower' | 'upper'
  const cells = [
    [0,0],[0,1],[0,2],[0,3],
    [1,0],[1,1],[1,2],[1,3],
    [2,0],[2,1],[2,2],[2,3],
    [3,0],[3,1],[3,2],[3,3],
  ];
  const vals = [
    ['a₁₁','a₁₂','a₁₃','a₁₄'],
    ['a₂₁','a₂₂','a₂₃','a₂₄'],
    ['a₃₁','a₃₂','a₃₃','a₃₄'],
    ['a₄₁','a₄₂','a₄₃','a₄₄'],
  ];
  const hl = (i,j)=>{
    if(kind==='diag') return i===j;
    if(kind==='lower') return i>=j;
    if(kind==='upper') return i<=j;
    return false;
  };
  const color = kind==='diag'?'#e8a020':kind==='lower'?'#38c9b0':'#9b80e8';
  const label = kind==='diag'?'Main diagonal':kind==='lower'?'Lower triangle (on & below diagonal)':'Upper triangle (on & above diagonal)';
  return (
    <div style={{ textAlign:'center', margin:'8px 0' }}>
      <div style={{ display:'inline-grid', gridTemplateColumns:'repeat(4, 46px)', gap:'4px', padding:'10px', background:'rgba(255,253,240,.97)', border:'1px solid var(--lec-border)', borderRadius:'10px' }}>
        {cells.map(([i,j])=>(
          <div key={`${i}-${j}`} style={{
            height:'34px', display:'flex', alignItems:'center', justifyContent:'center',
            fontFamily:'monospace', fontSize:'.78rem', borderRadius:'5px',
            background: hl(i,j)?`${color}28`:'transparent',
            border: hl(i,j)?`1px solid ${color}`:'1px solid transparent',
            color: hl(i,j)?'var(--lec-ink)':'var(--lec-ink3)',
            fontWeight: hl(i,j)?700:400,
          }}>{vals[i][j]}</div>
        ))}
      </div>
      <div style={{ fontFamily:'var(--fm)', fontSize:'.72rem', color:color, marginTop:'8px', fontWeight:600 }}>{label}</div>
    </div>
  );
}

/* ═══════════════ PAGE ═══════════════ */
export default function Lec8() {
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
        .tri-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); gap:18px; margin:22px 0; }
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
        <span style={{color:'var(--text2)'}}>Week 3 · Lecture 8</span>
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
            <Link href={PREV_HREF} style={{ display:'flex', alignItems:'center', padding:'0 16px', height:'100%', fontFamily:'var(--fm)', fontSize:'.72rem', color:'var(--lec-ink3)', borderRight:'1px solid var(--lec-border)', whiteSpace:'nowrap', flexShrink:0, textDecoration:'none' }}>← Lecture 7</Link>
            <div style={{ flex:1, display:'flex', justifyContent:'center', alignItems:'center', gap:'4px', overflowX:'auto', padding:'0 8px' }}>
              <span style={{ fontFamily:'var(--fm)', fontSize:'.6rem', letterSpacing:'.12em', textTransform:'uppercase', color:'var(--lec-accent)', flexShrink:0, marginRight:'6px' }}>On this page</span>
              {ANCHORS.map(([label,id],i)=>(
                <span key={id} style={{display:'inline-flex',alignItems:'center',flexShrink:0}}>
                  {i>0&&<span style={{color:'var(--lec-border)',margin:'0 7px'}}>·</span>}
                  <a href={`#${id}`} onClick={e=>jump(e,id)} style={{fontFamily:'var(--fm)',fontSize:'.73rem',color:'var(--lec-ink2)',textDecoration:'none',whiteSpace:'nowrap'}}>{label}</a>
                </span>
              ))}
            </div>
            <Link href={NEXT_HREF} style={{ display:'flex', alignItems:'center', padding:'0 16px', height:'100%', fontFamily:'var(--fm)', fontSize:'.72rem', color:'var(--lec-ink3)', borderLeft:'1px solid var(--lec-border)', whiteSpace:'nowrap', flexShrink:0, textDecoration:'none' }}>Lecture 9 →</Link>
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

            {/* ─── §1 WHY LU ─── */}
            <Sec id="why" n="§1">Why Factor a Matrix at All?</Sec>

            <p>Imagine you run a factory. Every week the same machine {String.raw`$A$`} processes a different batch of orders {String.raw`$\mathbf{b}_1, \mathbf{b}_2, \mathbf{b}_3, \dots$`} — same {String.raw`$A$`}, new {String.raw`$\mathbf{b}$`} each time. Solving {String.raw`$A\mathbf{x} = \mathbf{b}$`} from scratch every week, by full Gaussian elimination, repeats the same expensive work over and over. There has to be a smarter way.</p>

            <Callout icon="🏭" title="The big idea" color="violet">
              Do the hard work <b>once</b>. Split {String.raw`$A$`} into two triangular pieces, {String.raw`$A = LU$`}, where {String.raw`$L$`} is <b>lower triangular</b> and {String.raw`$U$`} is <b>upper triangular</b>. Triangular systems are trivially fast to solve. After paying once to find {String.raw`$L$`} and {String.raw`$U$`}, every future {String.raw`$\mathbf{b}$`} is solved in two quick substitution sweeps. This is the <b>LU-factorization</b>, and it is one of the workhorses of scientific computing.
            </Callout>

            <Callout icon="📜" title="A little history" color="amber">
              The idea traces to the great mathematician <b>Alan Turing</b>, who in 1948 analysed it carefully while studying how computers handle rounding errors — though the underlying elimination is much older, going back to Gauss and even to ancient Chinese mathematics. Today LU-factorization is built into virtually every numerical library on Earth; when your phone, a weather model, or an aircraft simulation solves a linear system, it is almost certainly factoring a matrix this way.
            </Callout>

            {/* ─── §2 TRIANGULAR MATRICES ─── */}
            <Sec id="triangular" n="§2">Triangular Matrices — the Stars of the Show</Sec>

            <p>Everything rests on triangular matrices, so let us define them carefully and see exactly which entries matter. First, the diagonal.</p>

            <DefBox term="Main diagonal" color="amber">
              <p style={{margin:0}}>{String.raw`The `}<b>main diagonal</b>{String.raw` of a matrix runs from the top-left corner downward to the right: the entries $a_{11}, a_{22}, a_{33}, \dots$ where the row index equals the column index.`}</p>
            </DefBox>

            <TriangleHighlight kind="diag"/>

            <DefBox term="Lower triangular" color="teal">
              <p style={{margin:0}}>{String.raw`A matrix is `}<b>lower triangular</b>{String.raw` if every entry `}<i>above</i>{String.raw` the main diagonal is zero. All the nonzero action sits on or below the diagonal — the lower-left wedge.`}</p>
            </DefBox>

            <TriangleHighlight kind="lower"/>

            <DefBox term="Upper triangular" color="violet">
              <p style={{margin:0}}>{String.raw`A matrix is `}<b>upper triangular</b>{String.raw` if every entry `}<i>below</i>{String.raw` the main diagonal is zero. The nonzero entries fill the upper-right wedge, on or above the diagonal.`}</p>
            </DefBox>

            <TriangleHighlight kind="upper"/>

            <SubH>Square examples — the easy case</SubH>

            <Example n="1" title="Square triangular matrices">
              <div className="sbs">
                <div className="sbs-card">
                  <div className="sbs-label">Lower triangular (3×3)</div>
                  <p style={{textAlign:'center',margin:0}}>{String.raw`$$\begin{bmatrix} 2 & 0 & 0 \\ 5 & 1 & 0 \\ -3 & 4 & 7 \end{bmatrix}$$`}</p>
                  <p style={{fontSize:'.84rem',margin:'8px 0 0',color:'var(--lec-ink2)'}}>Zeros fill the whole region above the diagonal.</p>
                </div>
                <div className="sbs-card">
                  <div className="sbs-label">Upper triangular (3×3)</div>
                  <p style={{textAlign:'center',margin:0}}>{String.raw`$$\begin{bmatrix} 1 & 2 & -1 \\ 0 & 3 & 5 \\ 0 & 0 & 4 \end{bmatrix}$$`}</p>
                  <p style={{fontSize:'.84rem',margin:'8px 0 0',color:'var(--lec-ink2)'}}>Zeros fill the whole region below the diagonal.</p>
                </div>
              </div>
            </Example>

            <SubH>Non-square examples — same rule</SubH>

            <p>Triangular-ness is about the diagonal, and the definition works for rectangular matrices too: "lower" means zeros above the diagonal, "upper" means zeros below it, wherever that diagonal runs.</p>

            <Example n="2" title="Non-square triangular matrices" advanced>
              <div className="sbs">
                <div className="sbs-card">
                  <div className="sbs-label">Upper triangular (3×4)</div>
                  <p style={{textAlign:'center',margin:0}}>{String.raw`$$\begin{bmatrix} 1 & 2 & -1 & 3 \\ 0 & 1 & 4 & 0 \\ 0 & 0 & 2 & 5 \end{bmatrix}$$`}</p>
                  <p style={{fontSize:'.84rem',margin:'8px 0 0',color:'var(--lec-ink2)'}}>Every entry below the diagonal (positions {String.raw`$(2,1),(3,1),(3,2)$`}) is zero. This is exactly the shape of a row-echelon matrix.</p>
                </div>
                <div className="sbs-card">
                  <div className="sbs-label">Lower triangular (4×3)</div>
                  <p style={{textAlign:'center',margin:0}}>{String.raw`$$\begin{bmatrix} 2 & 0 & 0 \\ 1 & 3 & 0 \\ 4 & -1 & 5 \\ 0 & 2 & 6 \end{bmatrix}$$`}</p>
                  <p style={{fontSize:'.84rem',margin:'8px 0 0',color:'var(--lec-ink2)'}}>Every entry above the diagonal is zero. Square matrices are easiest, but the idea extends cleanly.</p>
                </div>
              </div>
            </Example>

            <Callout icon="🔑" title="Why we care" color="teal">
              A row-echelon matrix is automatically <b>upper triangular</b> — that is the whole reason elimination produces a triangular shape. And triangular systems, as we are about to see, solve almost instantly. That is the bridge from elimination to fast solving.
            </Callout>

            {/* ─── §3 BACK SUBSTITUTION ─── */}
            <Sec id="back" n="§3">Upper Triangular ⟹ Back Substitution</Sec>

            <p>When the coefficient matrix is upper triangular, the system practically solves itself. The bottom equation has only one unknown; solve it, then climb upward, substituting as you go.</p>

            <Example n="3" title="Back substitution in action">
              <p>{String.raw`Solve $U\mathbf{x} = \mathbf{b}$ where`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$\begin{bmatrix} 1 & 2 & -1 \\ 0 & 1 & 3 \\ 0 & 0 & 2 \end{bmatrix}\begin{bmatrix} x_1 \\ x_2 \\ x_3 \end{bmatrix} = \begin{bmatrix} 3 \\ 4 \\ 6 \end{bmatrix}.$$`}</p>
              <p>{String.raw`The system, written out, is $\begin{cases} x_1 + 2x_2 - x_3 = 3 \\ x_2 + 3x_3 = 4 \\ 2x_3 = 6 \end{cases}$. Start at the `}<b>bottom</b>{String.raw` and work up:`}</p>
              <p style={{margin:'4px 0'}}>{String.raw`Row 3: $2x_3 = 6 \Rightarrow x_3 = 3$.`}</p>
              <p style={{margin:'4px 0'}}>{String.raw`Row 2: $x_2 + 3(3) = 4 \Rightarrow x_2 = 4 - 9 = -5$.`}</p>
              <p style={{margin:'4px 0'}}>{String.raw`Row 1: $x_1 + 2(-5) - 3 = 3 \Rightarrow x_1 = 3 + 10 + 3 = 16$.`}</p>
              <p style={{margin:0}}>{String.raw`So $\mathbf{x} = (16, -5, 3)$. No elimination needed — just substitution from the bottom up. This is `}<b>back substitution</b>{String.raw`.`}</p>
            </Example>

            {/* ─── §4 FORWARD SUBSTITUTION ─── */}
            <Sec id="forward" n="§4">Lower Triangular ⟹ Forward Substitution</Sec>

            <p>A lower triangular system is just as easy, but the other way round. The <i>top</i> equation has only one unknown; solve it, then descend.</p>

            <Example n="4" title="Forward substitution in action">
              <p>{String.raw`Solve $L\mathbf{y} = \mathbf{b}$ where`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$\begin{bmatrix} 2 & 0 & 0 \\ 1 & 3 & 0 \\ -1 & 2 & 1 \end{bmatrix}\begin{bmatrix} y_1 \\ y_2 \\ y_3 \end{bmatrix} = \begin{bmatrix} 4 \\ 7 \\ 1 \end{bmatrix}.$$`}</p>
              <p>{String.raw`The system is $\begin{cases} 2y_1 = 4 \\ y_1 + 3y_2 = 7 \\ -y_1 + 2y_2 + y_3 = 1 \end{cases}$. Start at the `}<b>top</b>{String.raw` and work down:`}</p>
              <p style={{margin:'4px 0'}}>{String.raw`Row 1: $2y_1 = 4 \Rightarrow y_1 = 2$.`}</p>
              <p style={{margin:'4px 0'}}>{String.raw`Row 2: $2 + 3y_2 = 7 \Rightarrow y_2 = \tfrac{5}{3}$.`}</p>
              <p style={{margin:'4px 0'}}>{String.raw`Row 3: $-2 + 2(\tfrac{5}{3}) + y_3 = 1 \Rightarrow y_3 = 1 + 2 - \tfrac{10}{3} = -\tfrac{1}{3}$.`}</p>
              <p style={{margin:0}}>{String.raw`So $\mathbf{y} = (2, \tfrac{5}{3}, -\tfrac{1}{3})$. Top-down substitution — this is `}<b>forward substitution</b>{String.raw`.`}</p>
            </Example>

            <Callout icon="⚡" title="The key takeaway" color="amber">
              Both triangular shapes are <b>cheap</b> to solve — one unknown revealed per row, no elimination. The entire point of LU is to convert a hard general system into <i>two</i> easy triangular ones.
            </Callout>

            {/* ─── §5 TWO-STAGE METHOD ─── */}
            <Sec id="twostage" n="§5">The Two-Stage Method — Solving Ax = b via LU</Sec>

            <p>Now we combine the two. Suppose {String.raw`$A = LU$`}. We want to solve {String.raw`$A\mathbf{x} = \mathbf{b}$`}, i.e. {String.raw`$LU\mathbf{x} = \mathbf{b}$`}. The trick is to give the middle piece {String.raw`$U\mathbf{x}$`} a name.</p>

            <ThmBox title="The two-stage solve">
              <p style={{margin:'0 0 8px'}}>{String.raw`To solve $A\mathbf{x} = \mathbf{b}$ when $A = LU$:`}</p>
              <p style={{margin:'4px 0'}}>{String.raw`$\textbf{Stage 1.}$ Solve $L\mathbf{y} = \mathbf{b}$ for $\mathbf{y}$ by `}<b>forward substitution</b>{String.raw` ($L$ is lower triangular).`}</p>
              <p style={{margin:'4px 0'}}>{String.raw`$\textbf{Stage 2.}$ Solve $U\mathbf{x} = \mathbf{y}$ for $\mathbf{x}$ by `}<b>back substitution</b>{String.raw` ($U$ is upper triangular).`}</p>
              <p style={{margin:'8px 0 0'}}>{String.raw`Then $\mathbf{x}$ solves the original system.`}</p>
            </ThmBox>

            <DefBox term="Why it works — and why it catches every solution" color="violet">
              <p style={{margin:'0 0 8px'}}>{String.raw`The resulting $\mathbf{x}$ is a solution because`}</p>
              <p style={{textAlign:'center',margin:'6px 0'}}>{String.raw`$$A\mathbf{x} = (LU)\mathbf{x} = L(U\mathbf{x}) = L\mathbf{y} = \mathbf{b}. \;\checkmark$$`}</p>
              <p style={{margin:'8px 0 0'}}>{String.raw`Moreover, `}<b>every</b>{String.raw` solution arises this way: given any solution $\mathbf{x}$ of $A\mathbf{x}=\mathbf{b}$, set $\mathbf{y} = U\mathbf{x}$; then $L\mathbf{y} = LU\mathbf{x} = A\mathbf{x} = \mathbf{b}$, so this $\mathbf{y}$ is exactly the one Stage 1 produces. Nothing is lost. And because each stage is pure substitution, the method `}<b>adapts beautifully to a computer</b>{String.raw`.`}</p>
            </DefBox>

            <Example n="5" title="A complete two-stage solve" advanced>
              <p>{String.raw`Solve $A\mathbf{x} = \mathbf{b}$ where $A = LU$ with $L = \begin{bmatrix}1&0&0\\2&1&0\\-1&3&1\end{bmatrix}$, $U = \begin{bmatrix}2&1&-1\\0&1&2\\0&0&3\end{bmatrix}$, and $\mathbf{b} = \begin{bmatrix}1\\4\\6\end{bmatrix}$.`}</p>
              <Reveal label="Show the two stages">
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Stage 1 — forward solve } L\mathbf{y} = \mathbf{b}$:`}</p>
                <p style={{margin:'2px 0'}}>{String.raw`Row 1: $y_1 = 1$. Row 2: $2(1) + y_2 = 4 \Rightarrow y_2 = 2$. Row 3: $-1 + 3(2) + y_3 = 6 \Rightarrow y_3 = 1$. So $\mathbf{y} = (1, 2, 1)$.`}</p>
                <p style={{margin:'10px 0 8px'}}>{String.raw`$\textbf{Stage 2 — back solve } U\mathbf{x} = \mathbf{y}$:`}</p>
                <p style={{margin:'2px 0'}}>{String.raw`Row 3: $3x_3 = 1 \Rightarrow x_3 = \tfrac13$. Row 2: $x_2 + 2(\tfrac13) = 2 \Rightarrow x_2 = \tfrac43$. Row 1: $2x_1 + \tfrac43 - \tfrac13 = 1 \Rightarrow 2x_1 = 0 \Rightarrow x_1 = 0$.`}</p>
                <p style={{margin:0}}>{String.raw`So $\mathbf{x} = (0, \tfrac43, \tfrac13)$. You can verify $A\mathbf{x} = \mathbf{b}$ directly — two easy substitution sweeps replaced a full elimination.`}</p>
              </Reveal>
            </Example>

            {/* ─── §6 LEMMA ─── */}
            <Sec id="lemma" n="§6">Two Facts About Triangular Matrices (Lemma 2.7.1)</Sec>

            <ThmBox title="Lemma 2.7.1">
              <p style={{margin:'0 0 8px'}}>{String.raw`Let $A$ and $B$ be matrices.`}</p>
              <p style={{margin:'4px 0'}}>{String.raw`$\textbf{1.}$ If $A$ and $B$ are both lower (upper) triangular, so is their product $AB$.`}</p>
              <p style={{margin:'4px 0'}}>{String.raw`$\textbf{2.}$ If $A$ is $n\times n$ and lower (upper) triangular, then $A$ is invertible `}<b>if and only if every main-diagonal entry is nonzero</b>{String.raw`. In that case $A^{-1}$ is also lower (upper) triangular.`}</p>
            </ThmBox>

            <Callout icon="🧠" title="Quick intuition for the proofs" color="teal">
              <p style={{margin:'0 0 6px'}}><b>Part 1:</b> when you multiply two lower-triangular matrices, every entry above the diagonal of the product is a sum of terms each containing a zero factor — so it stays zero. The triangular shape is preserved.</p>
              <p style={{margin:0}}><b>Part 2:</b> the diagonal of a triangular matrix <i>is</i> its set of pivots. All diagonal entries nonzero means a pivot in every row — full rank — hence invertible. Inverting by the {String.raw`$[A\mid I]$`} method never disturbs the triangular shape, so {String.raw`$A^{-1}$`} comes out triangular too.</p>
            </Callout>

            {/* ─── §7 FINDING L AND U ─── */}
            <Sec id="finding" n="§7">Finding L and U — Where They Come From</Sec>

            <p>Here is the beautiful part. We already know how to carry {String.raw`$A$`} to a row-echelon (upper triangular) matrix {String.raw`$U$`} using elementary matrices. That very process hands us {String.raw`$L$`} for free.</p>

            <DefBox term="The factorization, derived" color="violet">
              <p style={{margin:'0 0 8px'}}>{String.raw`Reduce $A$ to row-echelon form $U$ with elementary matrices:`}</p>
              <p style={{textAlign:'center',margin:'6px 0'}}>{String.raw`$$E_k E_{k-1} \cdots E_2 E_1 A = U.$$`}</p>
              <p style={{margin:'8px 0'}}>{String.raw`Then $A = LU$ where`}</p>
              <p style={{textAlign:'center',margin:'6px 0'}}>{String.raw`$$L = (E_k \cdots E_1)^{-1} = E_1^{-1} E_2^{-1} \cdots E_k^{-1}.$$`}</p>
              <p style={{margin:'8px 0 0'}}>{String.raw`If we use `}<b>no row interchanges</b>{String.raw` (and never add a row to a row `}<i>above</i>{String.raw` it), every $E_i$ is lower triangular — so by Lemma 2.7.1, $L$ is lower triangular and invertible. This is the `}<b>LU-factorization</b>{String.raw`.`}</p>
            </DefBox>

            <ThmBox title="Theorem 2.7.1 & Definition">
              <p style={{margin:'0 0 8px'}}>{String.raw`If $A$ can be `}<b>lower reduced</b>{String.raw` to a row-echelon matrix $U$ (that is, reduced using no row interchanges), then $A = LU$ where $L$ is lower triangular and invertible and $U$ is upper triangular and row-echelon. Such a factorization $A = LU$ is called an `}<b>LU-factorization</b>{String.raw` of $A$.`}</p>
            </ThmBox>

            <Callout icon="⚠️" title="When LU can fail" color="rose">
              An LU-factorization <b>may not exist</b> — precisely when {String.raw`$A$`} cannot be carried to row-echelon form without a row interchange (see Exercise 2.7.4 below for the smallest example, {String.raw`$\begin{bmatrix}0&1\\1&0\end{bmatrix}$`}). A standard fix, called {String.raw`$PA = LU$`} with a permutation matrix {String.raw`$P$`}, handles those cases — a topic for later. But whenever an LU-factorization <i>does</i> exist, the Gaussian algorithm produces {String.raw`$U$`} and simultaneously builds {String.raw`$L$`}.
            </Callout>

            <DefBox term="The LU-Algorithm (Nicholson)" color="amber">
              <p style={{margin:'0 0 8px'}}>{String.raw`Let $A$ be $m\times n$ of rank $r$, lower-reducible to row-echelon $U$. Then $A = LU$, where $L$ is built as follows:`}</p>
              <p style={{margin:'4px 0'}}>{String.raw`$\textbf{1.}$ If $A = 0$, take $L = I_m$ and $U = 0$.`}</p>
              <p style={{margin:'4px 0'}}>{String.raw`$\textbf{2.}$ If $A \neq 0$, write $A_1 = A$ and let $\mathbf{c}_1$ be its `}<b>leading column</b>{String.raw`. Use $\mathbf{c}_1$ to create the first leading $1$ and zeros below it (by lower reduction). Let $A_2$ be the matrix of rows $2$ to $m$ of the result.`}</p>
              <p style={{margin:'4px 0'}}>{String.raw`$\textbf{3.}$ If $A_2 \neq 0$, let $\mathbf{c}_2$ be its leading column and repeat Step 2 on $A_2$ to create $A_3$.`}</p>
              <p style={{margin:'4px 0'}}>{String.raw`$\textbf{4.}$ Continue until $U$ is reached (all rows below the last leading $1$ are zero). This takes $r$ steps.`}</p>
              <p style={{margin:'4px 0 0'}}>{String.raw`$\textbf{5.}$ Build $L$ by placing $\mathbf{c}_1, \mathbf{c}_2, \dots, \mathbf{c}_r$ at the bottom of the first $r$ columns of $I_m$.`}</p>
            </DefBox>

            <Callout icon="💼" title="Why industry loves it" color="violet">
              When a series of systems {String.raw`$A\mathbf{x} = \mathbf{b}_1, A\mathbf{x} = \mathbf{b}_2, \dots, A\mathbf{x} = \mathbf{b}_k$`} must all be solved with the <b>same</b> {String.raw`$A$`} — as constantly happens in business, engineering, and logistics — you solve the first one by Gaussian elimination while simultaneously building the LU-factorization, then handle every remaining system with cheap forward-and-back substitution. The factorization is computed once and reused forever.
            </Callout>

            {/* ─── §8 4x4 WALKTHROUGH ─── */}
            <Sec id="walkthrough" n="§8">A Full 4×4 Walkthrough</Sec>

            <p>Let us run the book's algorithm completely on a {String.raw`$4\times4$`} matrix, watching the <b>leading column</b> at each stage — that column is exactly what gets stored into {String.raw`$L$`}.</p>

            <p style={{textAlign:'center'}}>{String.raw`$$A = \begin{bmatrix} 2 & 4 & -2 & 6 \\ 1 & 5 & 5 & 0 \\ 3 & 5 & -4 & 12 \\ -1 & 0 & 9 & 5 \end{bmatrix}.$$`}</p>

            <div style={{ background:'rgba(255,253,240,.97)', border:'1px solid var(--lec-border)', borderRadius:'14px', padding:'22px 24px', margin:'22px 0', boxShadow:'0 2px 18px rgba(60,40,20,.06)' }}>

              <div style={{fontFamily:'var(--fm)',fontSize:'.72rem',color:'#38c9b0',marginBottom:'4px',fontWeight:600}}>STEP 1 — leading column c₁ = (2, 1, 3, −1)</div>
              <p style={{margin:'0 0 8px',fontSize:'.95rem'}}>{String.raw`The first column $\mathbf{c}_1 = (2,1,3,-1)$ is the leading column. `}<b style={{color:'#2a9d8f'}}>{String.raw`Store it`}</b>{String.raw` — it becomes column 1 of $L$. Then scale row 1 by $\tfrac12$ and clear below:`}</p>
              <p style={{textAlign:'center',margin:'0 0 14px'}}>{String.raw`$$A \to \begin{bmatrix} 1 & 2 & -1 & 3 \\ 0 & 3 & 6 & -3 \\ 0 & -1 & -1 & 3 \\ 0 & 2 & 8 & 8 \end{bmatrix}$$`}</p>

              <div style={{fontFamily:'var(--fm)',fontSize:'.72rem',color:'#38c9b0',marginBottom:'4px',fontWeight:600}}>STEP 2 — leading column c₂ = (3, −1, 2)</div>
              <p style={{margin:'0 0 8px',fontSize:'.95rem'}}>{String.raw`Look at rows 2–4. The leading column is $\mathbf{c}_2 = (3,-1,2)$ (from rows 2,3,4 of column 2). `}<b style={{color:'#2a9d8f'}}>{String.raw`Store it`}</b>{String.raw` as column 2 of $L$ (placed at the bottom). Scale and clear below:`}</p>
              <p style={{textAlign:'center',margin:'0 0 14px'}}>{String.raw`$$\to \begin{bmatrix} 1 & 2 & -1 & 3 \\ 0 & 1 & 2 & -1 \\ 0 & 0 & 1 & 2 \\ 0 & 0 & 4 & 10 \end{bmatrix}$$`}</p>

              <div style={{fontFamily:'var(--fm)',fontSize:'.72rem',color:'#38c9b0',marginBottom:'4px',fontWeight:600}}>STEP 3 — leading column c₃ = (1, 4)</div>
              <p style={{margin:'0 0 8px',fontSize:'.95rem'}}>{String.raw`Rows 3–4 now. Leading column $\mathbf{c}_3 = (1,4)$. `}<b style={{color:'#2a9d8f'}}>{String.raw`Store it`}</b>{String.raw` as column 3 of $L$. Clear below (row 4 $-\,4\times$ row 3):`}</p>
              <p style={{textAlign:'center',margin:'0 0 14px'}}>{String.raw`$$\to \begin{bmatrix} 1 & 2 & -1 & 3 \\ 0 & 1 & 2 & -1 \\ 0 & 0 & 1 & 2 \\ 0 & 0 & 0 & 2 \end{bmatrix}$$`}</p>

              <div style={{fontFamily:'var(--fm)',fontSize:'.72rem',color:'#38c9b0',marginBottom:'4px',fontWeight:600}}>STEP 4 — leading column c₄ = (2)</div>
              <p style={{margin:'0 0 8px',fontSize:'.95rem'}}>{String.raw`The last submatrix is just the single entry $2$, so $\mathbf{c}_4 = (2)$. `}<b style={{color:'#2a9d8f'}}>{String.raw`Store it`}</b>{String.raw`. Scale row 4 to a leading $1$:`}</p>
              <p style={{textAlign:'center',margin:'0 0 8px'}}>{String.raw`$$U = \begin{bmatrix} 1 & 2 & -1 & 3 \\ 0 & 1 & 2 & -1 \\ 0 & 0 & 1 & 2 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$`}</p>
            </div>

            <p>Now <b>assemble {String.raw`$L$`}</b>: drop the four stored leading columns into the bottom of columns 1–4 of the identity. Column 1 gets {String.raw`$(2,1,3,-1)$`}, column 2 gets {String.raw`$(3,-1,2)$`} (starting at row 2), column 3 gets {String.raw`$(1,4)$`} (starting at row 3), column 4 gets {String.raw`$(2)$`} (row 4):</p>

            <DefBox term="The factorization" color="teal">
              <p style={{textAlign:'center',margin:0}}>{String.raw`$$L = \begin{bmatrix} 2 & 0 & 0 & 0 \\ 1 & 3 & 0 & 0 \\ 3 & -1 & 1 & 0 \\ -1 & 2 & 4 & 2 \end{bmatrix}, \qquad U = \begin{bmatrix} 1 & 2 & -1 & 3 \\ 0 & 1 & 2 & -1 \\ 0 & 0 & 1 & 2 \\ 0 & 0 & 0 & 1 \end{bmatrix}.$$`}</p>
            </DefBox>

            <p>You can multiply {String.raw`$LU$`} and confirm it reproduces {String.raw`$A$`} exactly. Notice the pattern: each stored leading column slots straight into {String.raw`$L$`}, and {String.raw`$U$`} is just the row-echelon form. The factorization fell out of ordinary elimination.</p>

            {/* ─── §9 LU EXERCISES ─── */}
            <Sec id="lu-ex" n="§9">Exercises — Nicholson §2.7</Sec>

            <Exercise id="2.7.1" title="Find an LU-factorization">
              <p><b>(a)</b> {String.raw`$A = \begin{bmatrix} 2 & 6 & -2 & 0 & 2 \\ 3 & 9 & -3 & 3 & 1 \\ -1 & -3 & 1 & -3 & 1 \end{bmatrix}$.`}</p>
              <Reveal label="Show solution (a)">
                <p style={{margin:'0 0 8px'}}>{String.raw`Step 1: leading column $\mathbf{c}_1 = (2,3,-1)$. Scale row 1 by $\tfrac12$, clear below — this gives rows $(0,0,0,3,-2)$ and $(0,0,0,-3,2)$ underneath. Step 2: the next leading column (rows 2–3) is $\mathbf{c}_2 = (3,-3)$ in the fourth column; scale and clear, leaving a zero bottom row. Rank $r = 2$.`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`Place $\mathbf{c}_1$ and $\mathbf{c}_2$ into the first two columns of $I_3$ (the third column stays from the identity):`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$L = \begin{bmatrix} 2 & 0 & 0 \\ 3 & 3 & 0 \\ -1 & -3 & 1 \end{bmatrix}, \qquad U = \begin{bmatrix} 1 & 3 & -1 & 0 & 1 \\ 0 & 0 & 0 & 1 & -\tfrac23 \\ 0 & 0 & 0 & 0 & 0 \end{bmatrix}.$$`}</p>
                <p style={{margin:0}}>{String.raw`Check: $LU = A$. ✓`}</p>
              </Reveal>
              <p style={{marginTop:'12px'}}><b>(b)</b> {String.raw`$A = \begin{bmatrix} 2 & 4 & 2 \\ 1 & -1 & 3 \\ -1 & 7 & -7 \end{bmatrix}$.`}</p>
              <Reveal label="Show solution (b)">
                <p style={{margin:'0 0 8px'}}>{String.raw`Step 1: $\mathbf{c}_1 = (2,1,-1)$. Scale row 1 by $\tfrac12$, clear below. Step 2: the next leading column (rows 2–3) is $\mathbf{c}_2 = (-3, 9)$; scale and clear, leaving a zero bottom row. Rank $r = 2$.`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$L = \begin{bmatrix} 2 & 0 & 0 \\ 1 & -3 & 0 \\ -1 & 9 & 1 \end{bmatrix}, \qquad U = \begin{bmatrix} 1 & 2 & 1 \\ 0 & 1 & -\tfrac23 \\ 0 & 0 & 0 \end{bmatrix}.$$`}</p>
                <p style={{margin:0}}>{String.raw`Check: $LU = A$. ✓`}</p>
              </Reveal>
            </Exercise>

            <Exercise id="2.7.3" title="Use the given LU-decomposition to solve Ax = b">
              <p>{String.raw`$A = \begin{bmatrix} 2 & 0 & 0 \\ 0 & -1 & 0 \\ 1 & 1 & 3 \end{bmatrix}\begin{bmatrix} 1 & 0 & 0 & 1 \\ 0 & 0 & 1 & 2 \\ 0 & 0 & 0 & 1 \end{bmatrix} = LU$, $\;\mathbf{b} = \begin{bmatrix} 1 \\ -1 \\ 2 \end{bmatrix}$. Solve by finding $\mathbf{y}$ with $L\mathbf{y} = \mathbf{b}$, then $\mathbf{x}$ with $U\mathbf{x} = \mathbf{y}$.`}</p>
              <Reveal label="Show solution">
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Stage 1 — forward solve } L\mathbf{y} = \mathbf{b}$:`}</p>
                <p style={{margin:'2px 0'}}>{String.raw`Row 1: $2y_1 = 1 \Rightarrow y_1 = \tfrac12$. Row 2: $-y_2 = -1 \Rightarrow y_2 = 1$. Row 3: $\tfrac12 + 1 + 3y_3 = 2 \Rightarrow 3y_3 = \tfrac12 \Rightarrow y_3 = \tfrac16$.`}</p>
                <p style={{margin:'2px 0 8px'}}>{String.raw`So $\mathbf{y} = (\tfrac12, 1, \tfrac16)$.`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Stage 2 — back solve } U\mathbf{x} = \mathbf{y}$ (note $U$ is $3\times4$, so $\mathbf{x}$ has 4 entries and $x_2$ is free):`}</p>
                <p style={{margin:'2px 0'}}>{String.raw`Row 3: $x_4 = \tfrac16$. Row 2: $x_3 + 2x_4 = 1 \Rightarrow x_3 = 1 - \tfrac13 = \tfrac23$. Row 1: $x_1 + x_4 = \tfrac12 \Rightarrow x_1 = \tfrac12 - \tfrac16 = \tfrac13$. And $x_2 = t$ is free.`}</p>
                <p style={{margin:0}}>{String.raw`So $\mathbf{x} = \big(\tfrac13,\; t,\; \tfrac23,\; \tfrac16\big)$ for any $t \in \mathbb{R}$.`}</p>
              </Reveal>
            </Exercise>

            <Exercise id="2.7.4" title="Show [[0,1],[1,0]] = LU is impossible">
              <p>{String.raw`Show that $\begin{bmatrix} 0 & 1 \\ 1 & 0 \end{bmatrix} = LU$ is impossible, where $L$ is lower triangular and $U$ is upper triangular.`}</p>
              <Reveal label="Show solution">
                <p style={{margin:'0 0 8px'}}>{String.raw`Write $L = \begin{bmatrix} a & 0 \\ b & c \end{bmatrix}$ and $U = \begin{bmatrix} d & e \\ 0 & f \end{bmatrix}$. Then`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$LU = \begin{bmatrix} ad & ae \\ bd & be + cf \end{bmatrix} = \begin{bmatrix} 0 & 1 \\ 1 & 0 \end{bmatrix}.$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`Matching entries: $ad = 0$, $\;ae = 1$, $\;bd = 1$, $\;be + cf = 0$.`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`From $ae = 1$ we need $a \neq 0$. From $bd = 1$ we need $d \neq 0$. But then $ad \neq 0$, `}<b>contradicting</b>{String.raw` $ad = 0$.`}</p>
                <p style={{margin:0}}>{String.raw`No such $L, U$ exist — this matrix has no LU-factorization. (Geometrically, reaching row-echelon form here `}<i>requires</i>{String.raw` a row interchange, which LU forbids.) $\;\blacksquare$`}</p>
              </Reveal>
            </Exercise>

            {/* ─── §10 INPUT-OUTPUT ─── */}
            <Sec id="io" n="§10">Section 2.8 — An Application to Input–Output Economics</Sec>

            <Callout icon="🏆" title="A Nobel Prize built on a matrix" color="violet">
              In <b>1973, Wassily Leontief</b> won the Nobel Prize in Economics for a strikingly simple idea expressed in linear algebra. Picture an economy as a handful of industries — steel, coal, electricity — each producing a good, and each <i>consuming</i> some of what the others produce. Steel needs coal and power; power needs coal and steel; and so on, all interlinked. Leontief asked: at what set of prices does this tangled web sit in perfect balance, with every industry's income exactly covering its costs? The answer is the solution of a homogeneous linear system — the same {String.raw`$AX = 0$`} machinery you met in Week 1.
            </Callout>

            <p>Leontief's "input–output" tables eventually catalogued hundreds of sectors of the U.S. economy, and the computations were among the first serious industrial uses of early computers. A whole branch of economics grew from organising production as a matrix.</p>

            <DefBox term="The equilibrium condition" color="amber">
              <p style={{margin:'0 0 8px'}}>{String.raw`Let $E$ be the `}<b>input–output matrix</b>{String.raw`: the entry $e_{ij}$ is the fraction of industry $j$'s output consumed by industry $i$. A `}<b>price vector</b>{String.raw` $\mathbf{p}$ is an `}<b>equilibrium</b>{String.raw` (each industry breaks even) exactly when`}</p>
              <p style={{textAlign:'center',margin:'6px 0'}}>{String.raw`$$E\mathbf{p} = \mathbf{p}, \qquad\text{equivalently}\qquad (I - E)\mathbf{p} = \mathbf{0}.$$`}</p>
              <p style={{margin:'8px 0 0'}}>{String.raw`We seek a nonzero, nonnegative solution $\mathbf{p}$. Since this is homogeneous, equilibrium prices are determined only up to a positive scale factor — only the `}<i>ratios</i>{String.raw` of prices matter, which makes economic sense (currency units are arbitrary).`}</p>
            </DefBox>

            <Example n="6" title="A basic equilibrium — Exercise 2.8.1(a)">
              <p>{String.raw`Find the equilibrium price structure for the input–output matrix $E = \begin{bmatrix} 0.1 & 0.2 & 0.3 \\ 0.6 & 0.2 & 0.3 \\ 0.3 & 0.6 & 0.4 \end{bmatrix}$.`}</p>
              <p>{String.raw`(Each column sums to $1$ — every industry's entire output is distributed somewhere, as it should be.)`}</p>
              <Reveal label="Show solution">
                <p style={{margin:'0 0 8px'}}>{String.raw`Solve $(I - E)\mathbf{p} = \mathbf{0}$:`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$I - E = \begin{bmatrix} 0.9 & -0.2 & -0.3 \\ -0.6 & 0.8 & -0.3 \\ -0.3 & -0.6 & 0.6 \end{bmatrix}.$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`Row-reducing this homogeneous system gives a one-parameter family of solutions with ratio`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$\mathbf{p} = t\,(2,\; 3,\; 4), \qquad t > 0.$$`}</p>
                <p style={{margin:0}}>{String.raw`So the industries balance when their prices are in the ratio $p_1 : p_2 : p_3 = 2 : 3 : 4$. For instance $\mathbf{p} = (2,3,4)$ is one equilibrium; doubling to $(4,6,8)$ is the same equilibrium in different units.`}</p>
              </Reveal>
            </Example>

            <Example n="7" title="A trickier case — Exercise 2.8.3" advanced>
              <p>{String.raw`Find the equilibrium price structures for three industries whose input–output matrix is $E = \begin{bmatrix} 1 & 0 & 0 \\ 0 & 0 & 1 \\ 0 & 1 & 0 \end{bmatrix}$, and discuss why the answer is unusual.`}</p>
              <Reveal label="Show solution">
                <p style={{margin:'0 0 8px'}}>{String.raw`Compute $I - E = \begin{bmatrix} 0 & 0 & 0 \\ 0 & 1 & -1 \\ 0 & -1 & 1 \end{bmatrix}$. Row-reduce: rows 2 and 3 are negatives of each other, so the system collapses to the single condition $p_2 = p_3$, with $p_1$ completely unconstrained.`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`The solution space is `}<b>two-dimensional</b>{String.raw`:`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$\mathbf{p} = s\,(1, 0, 0) + t\,(0, 1, 1), \qquad s, t \ge 0.$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Why this happens:}$ industry 1 consumes `}<i>only</i>{String.raw` its own output (the $1$ in the top-left corner) — it is economically isolated from the other two. So its price floats free of theirs. Industries 2 and 3 trade exclusively with each other and must price equally. Because the economy `}<b>{String.raw`splits into independent blocks`}</b>{String.raw`, there is no single price ratio — the equilibrium is not unique. A connected economy (where output truly circulates among all industries) avoids this and pins down the ratios uniquely. $\;\blacksquare$`}</p>
              </Reveal>
            </Example>

            {/* ─── §11 IO EXERCISES ─── */}
            <Sec id="io-ex" n="§11">Exercises — Nicholson §2.8</Sec>

            <Exercise id="2.8.1" title="Find equilibrium price structures">
              <p><b>(b)</b> {String.raw`$E = \begin{bmatrix} 0.5 & 0 & 0.5 \\ 0.1 & 0.9 & 0.2 \\ 0.4 & 0.1 & 0.3 \end{bmatrix}$.`}</p>
              <Reveal label="Show solution (b)">
                <p style={{margin:'0 0 8px'}}>{String.raw`Solve $(I - E)\mathbf{p} = \mathbf{0}$ with $I - E = \begin{bmatrix} 0.5 & 0 & -0.5 \\ -0.1 & 0.1 & -0.2 \\ -0.4 & -0.1 & 0.7 \end{bmatrix}$.`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`Row reduction gives a one-parameter family with ratio`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$\mathbf{p} = t\,(1,\; 3,\; 1), \qquad t > 0.$$`}</p>
                <p style={{margin:0}}>{String.raw`The industries balance at price ratio $p_1 : p_2 : p_3 = 1 : 3 : 1$. (Industry 2 commands the highest price — it absorbs the largest share of total output.)`}</p>
              </Reveal>
            </Exercise>

            <Exercise id="2.8.2" title="A cyclic economy: A → B → C → A">
              <p>{String.raw`Industries $A, B, C$ are such that all output of $A$ is used by $B$, all output of $B$ is used by $C$, and all output of $C$ is used by $A$. Find the possible equilibrium price structures.`}</p>
              <Reveal label="Show solution">
                <p style={{margin:'0 0 8px'}}>{String.raw`"All of $A$'s output goes to $B$" means column $A$ of the input–output matrix is entirely in row $B$, and so on around the cycle. So`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$E = \begin{bmatrix} 0 & 0 & 1 \\ 1 & 0 & 0 \\ 0 & 1 & 0 \end{bmatrix}, \qquad I - E = \begin{bmatrix} 1 & 0 & -1 \\ -1 & 1 & 0 \\ 0 & -1 & 1 \end{bmatrix}.$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`Solving $(I-E)\mathbf{p} = \mathbf{0}$: row 1 gives $p_1 = p_3$, row 2 gives $p_2 = p_1$. Hence $p_1 = p_2 = p_3$.`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$\mathbf{p} = t\,(1, 1, 1), \qquad t > 0.$$`}</p>
                <p style={{margin:0}}>{String.raw`All three industries must charge the `}<b>same price</b>{String.raw`. By the perfect symmetry of the cycle, no industry can be worth more than another — a satisfying answer that the matrix delivers instantly. $\;\blacksquare$`}</p>
              </Reveal>
            </Exercise>

            {/* CLOSING */}
            <div style={{ marginTop:'48px', padding:'28px 32px', background:'rgba(56,201,176,.08)', border:'2px solid rgba(56,201,176,.35)', borderRadius:'16px' }}>
              <div style={{ fontFamily:'var(--fm)', fontSize:'.7rem', letterSpacing:'.16em', textTransform:'uppercase', color:'#2a9d8f', marginBottom:'12px' }}>Looking ahead</div>
              <p style={{ fontFamily:'var(--fh)', fontSize:'1.4rem', color:'var(--lec-ink)', margin:'0 0 16px', fontWeight:400, lineHeight:1.3 }}>
                We have split matrices into triangular pieces and watched economies balance. Next, the determinant takes centre stage.
              </p>
              <p style={{ color:'var(--lec-ink2)', fontSize:'.97rem', lineHeight:1.8, margin:0 }}>
                The determinant is the single number that decides invertibility, measures how a matrix scales volume, and — pleasingly — is trivial to read off a triangular matrix (just multiply the diagonal). Everything you learned about triangular shapes today pays off immediately in the next chapter.
              </p>
            </div>

            <div style={{ marginTop:'64px', paddingTop:'28px', borderTop:'2px solid var(--lec-border)', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'12px' }}>
              <div style={{ fontFamily:'var(--fm)', fontSize:'.76rem', color:'var(--lec-ink3)', fontStyle:'italic' }}>Lecture 8 — complete</div>
              <div style={{ fontFamily:'var(--fm)', fontSize:'.76rem', color:'var(--lec-ink3)' }}>MATH-120 · Shoaib Khan · LUMS · June 2026</div>
            </div>
          </div>

          {/* FOOTER NAV */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'22px 48px', borderTop:'1px solid var(--lec-border)', background:'var(--lec-paper)', flexWrap:'wrap', gap:'12px' }}>
            <Link href={PREV_HREF} style={{ fontFamily:'var(--fm)', fontSize:'.74rem', letterSpacing:'.08em', textTransform:'uppercase', color:'var(--lec-accent)', textDecoration:'none' }}>← Lecture 7</Link>
            <Link href={NEXT_HREF} style={{ fontFamily:'var(--fm)', fontSize:'.74rem', letterSpacing:'.08em', textTransform:'uppercase', color:'var(--lec-accent)', textDecoration:'none' }}>Lecture 9 →</Link>
          </div>
        </main>
      </div>

      <Footer/>
    </>
  );
}