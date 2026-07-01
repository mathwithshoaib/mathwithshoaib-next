'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import Navbar from '../../../../components/Navbar';
import Footer from '../../../../components/Footer';

/* ════════════════════════════════════════════════════════════
   MATH-120 · LECTURE 9
   Determinants — Cofactor Expansion, Properties & Applications
   Route: /courses/linalg/w3/lec9
   ════════════════════════════════════════════════════════════ */

const LECTURES = [
  { week: 1, n: 1, slug: 'w1/lec1', title: 'The Language of Matrices', live: true },
  { week: 1, n: 2, slug: 'w1/lec2', title: 'Row Operations & Gaussian Elimination', live: true },
  { week: 1, n: 3, slug: 'w1/lec3', title: 'RREF, Homogeneous Systems & Linear Combinations', live: true },
  { week: 1, n: 4, slug: 'w1/lec4', title: 'Solution Structure & Applications', live: true },
  { week: 2, n: 5, slug: 'w2/lec5', title: 'Matrix Algebra: Addition, Scalar Multiplication & Transpose', live: true },
  { week: 2, n: 6, slug: 'w2/lec6', title: 'The Inverse of a Matrix', live: true },
  { week: 2, n: 7, slug: 'w2/lec7', title: 'Elementary Matrices & Solving Systems', live: true },
  { week: 3, n: 8, slug: 'w3/lec8', title: 'LU-Factorization & Input–Output Models', live: true },
  { week: 3, n: 9, slug: 'w3/lec9', title: 'Determinants: Cofactor Expansion & Properties', live: true },
  { week: 3, n: 10, slug: 'w3/lec10', title: 'Determinants & Matrix Inverses', live: true },
];
const THIS_SLUG = 'w3/lec9';
const PREV_HREF  = '/courses/linalg/w3/lec8';
const NEXT_HREF  = '/courses/linalg/w3/lec10';

const LEC = {
  course: 'MATH-120 · Linear Algebra',
  number: 'Lecture 9',
  title: 'Determinants',
  subtitle: 'Cofactor expansion, the property toolkit, triangular and block shortcuts — the single number that decides invertibility',
  date: '25 June 2026',
};

const ANCHORS = [
  ['Why Determinants', 'why'],
  ['Notation', 'notation'],
  ['Cofactor Expansion', 'cofactor'],
  ['Minors & Signs', 'signs'],
  ['Worked 3×3', 'worked'],
  ['Properties', 'properties'],
  ['Property Examples', 'propex'],
  ['Triangular', 'triangular'],
  ['Block Matrices', 'block'],
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

/* Checkerboard sign-pattern visual */
function SignBoard({ size=4 }) {
  const cells=[];
  for(let i=0;i<size;i++) for(let j=0;j<size;j++) cells.push([i,j]);
  return (
    <div style={{ textAlign:'center', margin:'10px 0' }}>
      <div style={{ display:'inline-grid', gridTemplateColumns:`repeat(${size}, 40px)`, gap:'4px', padding:'10px', background:'rgba(255,253,240,.97)', border:'1px solid var(--lec-border)', borderRadius:'10px' }}>
        {cells.map(([i,j])=>{
          const plus=(i+j)%2===0;
          return (
            <div key={`${i}-${j}`} style={{
              height:'34px', display:'flex', alignItems:'center', justifyContent:'center',
              fontFamily:'var(--fm)', fontSize:'1.1rem', fontWeight:700, borderRadius:'6px',
              background: plus?'rgba(56,201,176,.16)':'rgba(224,107,107,.14)',
              color: plus?'#2a9d8f':'#d85555',
            }}>{plus?'+':'−'}</div>
          );
        })}
      </div>
      <div style={{ fontFamily:'var(--fm)', fontSize:'.72rem', color:'var(--lec-ink3)', marginTop:'8px' }}>
        Top-left is always +; each step flips the sign.
      </div>
    </div>
  );
}

/* ═══════════════ PAGE ═══════════════ */
export default function Lec9() {
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
        <span style={{color:'var(--text2)'}}>Week 3 · Lecture 9</span>
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
            <Link href={PREV_HREF} style={{ display:'flex', alignItems:'center', padding:'0 16px', height:'100%', fontFamily:'var(--fm)', fontSize:'.72rem', color:'var(--lec-ink3)', borderRight:'1px solid var(--lec-border)', whiteSpace:'nowrap', flexShrink:0, textDecoration:'none' }}>← Lecture 8</Link>
            <div style={{ flex:1, display:'flex', justifyContent:'center', alignItems:'center', gap:'4px', overflowX:'auto', padding:'0 8px' }}>
              <span style={{ fontFamily:'var(--fm)', fontSize:'.6rem', letterSpacing:'.12em', textTransform:'uppercase', color:'var(--lec-accent)', flexShrink:0, marginRight:'6px' }}>On this page</span>
              {ANCHORS.map(([label,id],i)=>(
                <span key={id} style={{display:'inline-flex',alignItems:'center',flexShrink:0}}>
                  {i>0&&<span style={{color:'var(--lec-border)',margin:'0 7px'}}>·</span>}
                  <a href={`#${id}`} onClick={e=>jump(e,id)} style={{fontFamily:'var(--fm)',fontSize:'.73rem',color:'var(--lec-ink2)',textDecoration:'none',whiteSpace:'nowrap'}}>{label}</a>
                </span>
              ))}
            </div>
            <Link href={NEXT_HREF} style={{ display:'flex', alignItems:'center', padding:'0 16px', height:'100%', fontFamily:'var(--fm)', fontSize:'.72rem', color:'var(--lec-ink3)', borderLeft:'1px solid var(--lec-border)', whiteSpace:'nowrap', flexShrink:0, textDecoration:'none' }}>Lecture 10 →</Link>
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

            {/* ─── §1 WHY ─── */}
            <Sec id="why" n="§1">Why Determinants? A Bit of Motivation</Sec>

            <p>Imagine you have two arrows (vectors) drawn from the origin. Together they make a parallelogram. A natural question is: how big is the area of that parallelogram? It turns out there is one single number, built from the coordinates of the two arrows, that gives you this area. That number is the <b>determinant</b>.</p>

            <p>The same idea scales up:</p>
            <p style={{margin:'4px 0'}}>{String.raw`• In `}<b>2D</b>{String.raw`, the determinant of a $2\times2$ matrix is the (signed) area of the parallelogram formed by its rows (or columns).`}</p>
            <p style={{margin:'4px 0'}}>{String.raw`• In `}<b>3D</b>{String.raw`, the determinant of a $3\times3$ matrix is the (signed) volume of the parallelepiped (a slanted box) formed by its three rows.`}</p>
            <p style={{margin:'4px 0'}}>{String.raw`• If the determinant is `}<b>zero</b>{String.raw`, the arrows are squashed flat — they lie on the same line or plane — and the box has no area/volume. This is exactly the situation where a matrix has `}<b>no inverse</b>{String.raw`.`}</p>

            <Callout icon="📜" title="An interesting historical fact" color="amber">
              The idea of the determinant is older than the idea of the matrix itself. People were computing these numbers to solve systems of linear equations long before anyone wrote down a "matrix." The Japanese mathematician <b>Seki Takakazu</b> (around 1683) and, a few months later, <b>Leibniz</b> in Europe, both discovered determinants independently while trying to solve linear equations. The word "determinant" was popularised much later by <b>Cauchy</b> in the 1800s — it is the number that <i>determines</i> whether a system has a unique solution.
            </Callout>

            <SubH>Why should you care? Two quick applications</SubH>

            <p style={{margin:'4px 0'}}><b>1. Does a system have a unique solution?</b> {String.raw`For a square system $A\mathbf{x} = \mathbf{b}$, there is exactly one solution if and only if $\det A \neq 0$. So a single number tells you whether your equations are "well behaved" or not.`}</p>
            <p style={{margin:'4px 0'}}><b>2. Change of variables in calculus (the Jacobian).</b> When you switch coordinate systems in a multiple integral (for example from rectangular to polar), the factor that corrects the stretching of area or volume is a determinant called the <b>Jacobian</b>. Without it, your integral would give the wrong answer.</p>

            {/* ─── §2 NOTATION ─── */}
            <Sec id="notation" n="§2">Notation — How We Write a Determinant</Sec>

            <p>{String.raw`For a square matrix $A$, its determinant is a single number. We write it in two common ways: $\det A$ or $|A|$. When we use the bar notation, we replace the square brackets of the matrix by straight vertical bars. For example,`}</p>

            <p style={{textAlign:'center'}}>{String.raw`$$A = \begin{bmatrix} a & b \\ c & d \end{bmatrix} \;\Longrightarrow\; \det A = \begin{vmatrix} a & b \\ c & d \end{vmatrix}.$$`}</p>

            <RedBox title="Warning — brackets vs bars">
              <p style={{margin:0}}>{String.raw`The brackets $[\,\;]$ mean a `}<b>matrix</b>{String.raw` (a table of numbers). The bars $|\,\;|$ mean the `}<b>determinant</b>{String.raw` (a single number). They are `}<i>not</i>{String.raw` the same object, so keep the notation straight.`}</p>
            </RedBox>

            {/* ─── §3 COFACTOR ─── */}
            <Sec id="cofactor" n="§3">The Cofactor Expansion</Sec>

            <p>The determinant is only defined for <b>square</b> matrices. We build it up step by step: first for tiny matrices, then for bigger ones.</p>

            <SubH>The 1×1 case</SubH>
            <p>{String.raw`If $A = [a]$, we simply define $\det A = a$. (And $A$ is invertible exactly when $a \neq 0$.)`}</p>

            <SubH>The 2×2 case</SubH>
            <p>For a 2×2 matrix the rule is short and worth memorising:</p>
            <p style={{textAlign:'center'}}>{String.raw`$$\det \begin{bmatrix} a & b \\ c & d \end{bmatrix} = \begin{vmatrix} a & b \\ c & d \end{vmatrix} = ad - bc.$$`}</p>
            <p>In words: multiply the main diagonal ({String.raw`$a$`} and {String.raw`$d$`}), then subtract the product of the other diagonal ({String.raw`$b$`} and {String.raw`$c$`}).</p>

            <Example n="1" title="Quick 2×2 examples">
              <p style={{margin:'4px 0'}}>{String.raw`$\begin{vmatrix} 3 & 5 \\ 2 & 4 \end{vmatrix} = (3)(4) - (5)(2) = 12 - 10 = 2.$`}</p>
              <p style={{margin:'4px 0'}}>{String.raw`$\begin{vmatrix} 1 & -2 \\ 4 & 0 \end{vmatrix} = (1)(0) - (-2)(4) = 0 + 8 = 8.$`}</p>
            </Example>

            <SubH>Building the 3×3 case: the main idea</SubH>
            <p>The clever idea is this: we compute a big determinant by reducing it to smaller ones. For a 3×3 matrix, we break it into 2×2 determinants, which we already know how to do. Take</p>
            <p style={{textAlign:'center'}}>{String.raw`$$A = \begin{bmatrix} a & b & c \\ d & e & f \\ g & h & i \end{bmatrix}.$$`}</p>
            <p>The recipe is: go along the first row. For each entry, multiply that entry by the 2×2 determinant you get by deleting the row and column that the entry sits in, and attach a {String.raw`$+$`} or {String.raw`$-$`} sign. Then add the results.</p>
            <p style={{textAlign:'center'}}>{String.raw`$$\det A = a\begin{vmatrix} e & f \\ h & i \end{vmatrix} - b\begin{vmatrix} d & f \\ g & i \end{vmatrix} + c\begin{vmatrix} d & e \\ g & h \end{vmatrix}.$$`}</p>
            <p>Carrying out the three small determinants gives the full formula:</p>
            <p style={{textAlign:'center'}}>{String.raw`$$\det A = a(ei - fh) - b(di - fg) + c(dh - eg) = aei + bfg + cdh - ceg - afh - bdi.$$`}</p>

            <Callout icon="❓" title="Where does the minus sign on b come from?" color="violet">
              {String.raw`Notice the middle term has a $-$ in front. That sign is `}<b>not optional</b>{String.raw` and it is `}<b>{String.raw`not part of $b$`}</b>{String.raw`. It comes from a fixed pattern of $+$ and $-$ signs that we explain next.`}
            </Callout>

            {/* ─── §4 MINORS & SIGNS ─── */}
            <Sec id="signs" n="§4">Minors, Cofactors, and the Sign Rule</Sec>

            <DefBox term="Minor and Cofactor" color="teal">
              <p style={{margin:'0 0 8px'}}>{String.raw`Let $A$ be a square matrix.`}</p>
              <p style={{margin:'4px 0'}}>{String.raw`• The `}<b>minor</b>{String.raw` of the entry in row $i$, column $j$ is the determinant of the smaller matrix you get by deleting row $i$ and column $j$. We write it $M_{ij}$.`}</p>
              <p style={{margin:'4px 0'}}>{String.raw`• The `}<b>cofactor</b>{String.raw` of that entry is the minor together with a sign: $c_{ij} = (-1)^{i+j} M_{ij}$.`}</p>
            </DefBox>

            <p><b>Understanding the sign.</b> {String.raw`The factor $(-1)^{i+j}$ is just a tidy way to write "plus or minus." If $i+j$ is `}<b>even</b>{String.raw`, the sign is $+$. If $i+j$ is `}<b>odd</b>{String.raw`, the sign is $-$.`}</p>

            <Callout icon="🏁" title="An easy way to remember: the checkerboard" color="teal">
              Forget the formula and just picture a checkerboard pattern. The top-left corner is always {String.raw`$+$`}, and the signs alternate as you step left/right or up/down. To find the sign of any position, start at the top-left ({String.raw`$+$`}) and count steps to your entry; each step flips the sign.
            </Callout>

            <SignBoard size={4}/>

            <p><b>Keeping track of the signs — more practice.</b> {String.raw`For a $3\times3$ matrix the sign pattern is $\begin{bmatrix} + & - & + \\ - & + & - \\ + & - & + \end{bmatrix}$. A few quick checks:`}</p>
            <p style={{margin:'4px 0'}}>{String.raw`• Position $(2,3)$: $i+j = 5$ (odd) $\Rightarrow$ sign is $-$.`}</p>
            <p style={{margin:'4px 0'}}>{String.raw`• Position $(3,1)$: $i+j = 4$ (even) $\Rightarrow$ sign is $+$.`}</p>
            <p style={{margin:'4px 0'}}>{String.raw`• Position $(2,2)$: $i+j = 4$ (even) $\Rightarrow$ sign is $+$.`}</p>
            <p style={{margin:'8px 0 4px'}}>{String.raw`For a $4\times4$ matrix:`}</p>
            <p style={{margin:'4px 0'}}>{String.raw`• Position $(4,3)$: $i+j = 7$ (odd) $\Rightarrow -$.`}</p>
            <p style={{margin:'4px 0'}}>{String.raw`• Position $(1,4)$: $i+j = 5$ (odd) $\Rightarrow -$.`}</p>

            <ThmBox title="Cofactor Expansion (Definition)">
              <p style={{margin:'0 0 8px'}}>{String.raw`To compute $\det A$, pick any single row or any single column. Multiply each entry in that row/column by its cofactor, and add the results.`}</p>
              <p style={{margin:'4px 0'}}>{String.raw`Expanding along row $i$: $\;\det A = a_{i1}c_{i1} + a_{i2}c_{i2} + \cdots + a_{in}c_{in}.$`}</p>
              <p style={{margin:'4px 0'}}>{String.raw`Expanding along column $j$: $\;\det A = a_{1j}c_{1j} + a_{2j}c_{2j} + \cdots + a_{nj}c_{nj}.$`}</p>
            </ThmBox>

            <Callout icon="💡" title="A very useful fact" color="amber">
              You may expand along <b>any</b> row or <b>any</b> column you like — the answer is always the same. This freedom is powerful: choose the row or column with the most zeros, because every zero entry kills its whole term and saves you work.
            </Callout>

            {/* ─── §5 WORKED 3x3 ─── */}
            <Sec id="worked" n="§5">A Worked 3×3 Example (Same Answer, Different Rows/Columns)</Sec>

            <p style={{textAlign:'center'}}>{String.raw`$$A = \begin{bmatrix} 2 & -1 & 3 \\ 0 & 4 & 1 \\ 5 & 0 & -2 \end{bmatrix}.$$`}</p>

            <Example n="2" title="(a) Expand along the first row">
              <p style={{textAlign:'center'}}>{String.raw`$$\det A = 2\begin{vmatrix} 4 & 1 \\ 0 & -2 \end{vmatrix} - (-1)\begin{vmatrix} 0 & 1 \\ 5 & -2 \end{vmatrix} + 3\begin{vmatrix} 0 & 4 \\ 5 & 0 \end{vmatrix}$$`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$= 2(-8 - 0) + 1(0 - 5) + 3(0 - 20) = -16 - 5 - 60 = -81.$$`}</p>
            </Example>

            <Example n="3" title="(b) Expand along the second column (it has a zero, so less work)">
              <p>{String.raw`The sign pattern down column 2 is $-, +, -$.`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$\det A = -(-1)\begin{vmatrix} 0 & 1 \\ 5 & -2 \end{vmatrix} + 4\begin{vmatrix} 2 & 3 \\ 5 & -2 \end{vmatrix} - 0\begin{vmatrix} 2 & 3 \\ 0 & 1 \end{vmatrix}$$`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$= 1(0 - 5) + 4(-4 - 15) - 0 = -5 + 4(-19) = -5 - 76 = -81.$$`}</p>
            </Example>

            <Example n="4" title="(c) Expand along the first column">
              <p style={{textAlign:'center'}}>{String.raw`$$\det A = 2\begin{vmatrix} 4 & 1 \\ 0 & -2 \end{vmatrix} - 0\begin{vmatrix} -1 & 3 \\ 0 & -2 \end{vmatrix} + 5\begin{vmatrix} -1 & 3 \\ 4 & 1 \end{vmatrix}$$`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$= 2(-8) - 0 + 5(-1 - 12) = -16 + 5(-13) = -16 - 65 = -81.$$`}</p>
              <p style={{margin:0}}>{String.raw`All three give $\det A = -81$. The choice of row or column does not change the answer — it only changes how much arithmetic you do.`}</p>
            </Example>

            {/* ─── §6 PROPERTIES ─── */}
            <Sec id="properties" n="§6">Properties of Determinants</Sec>

            <p>These rules let you compute determinants faster and predict how a determinant changes when you modify the matrix.</p>

            <ThmBox title="Theorem 3.1.2 — Properties of Determinants">
              <p style={{margin:'0 0 8px'}}>{String.raw`Let $A$ be an $n\times n$ matrix.`}</p>
              <p style={{margin:'4px 0'}}>{String.raw`$\textbf{1.}$ If $A$ has a row or column of zeros, then $\det A = 0$.`}</p>
              <p style={{margin:'4px 0'}}>{String.raw`$\textbf{2.}$ If two distinct rows (or columns) are interchanged, the determinant becomes $-\det A$.`}</p>
              <p style={{margin:'4px 0'}}>{String.raw`$\textbf{3.}$ If a row (or column) is multiplied by a constant $u$, the new determinant is $u(\det A)$.`}</p>
              <p style={{margin:'4px 0'}}>{String.raw`$\textbf{4.}$ If two distinct rows (or columns) are identical, then $\det A = 0$.`}</p>
              <p style={{margin:'4px 0'}}>{String.raw`$\textbf{5.}$ If a multiple of one row is added to a different row (or column to column), the determinant is unchanged; it stays $\det A$.`}</p>
            </ThmBox>

            <p><b>A few more properties worth knowing.</b> The following are also true and very commonly used; they fit naturally with the list above.</p>

            <DefBox term="More properties" color="violet">
              <p style={{margin:'4px 0'}}>{String.raw`$\textbf{6. Transpose.}$ $\det(A^{\mathsf{T}}) = \det A$. (This is why every statement above works equally for rows and columns.)`}</p>
              <p style={{margin:'4px 0'}}>{String.raw`$\textbf{7. Product rule.}$ $\det(AB) = (\det A)(\det B)$ for square $A, B$ of the same size.`}</p>
              <p style={{margin:'4px 0'}}>{String.raw`$\textbf{8. Scalar multiple of whole matrix.}$ $\det(uA) = u^n \det A$ for an $n\times n$ matrix. Be careful: multiplying every entry by $u$ multiplies the determinant by $u^n$, not by $u$.`}</p>
              <p style={{margin:'4px 0'}}>{String.raw`$\textbf{9. Invertibility.}$ $A$ is invertible if and only if $\det A \neq 0$, and then $\det(A^{-1}) = \dfrac{1}{\det A}$.`}</p>
              <p style={{margin:'4px 0'}}>{String.raw`$\textbf{10. Triangular matrices.}$ The determinant of a triangular matrix is the product of its diagonal entries.`}</p>
            </DefBox>

            <ThmBox title="Theorem 3.1.3">
              <p style={{margin:0}}>{String.raw`If $A$ is an $n\times n$ matrix, then $\det(uA) = u^n \det A$ for any number $u$.`}</p>
            </ThmBox>

            {/* ─── §7 PROPERTY EXAMPLES ─── */}
            <Sec id="propex" n="§7">Worked Examples and Practice (Property-Style)</Sec>

            <Example n="5" title="Example 3.1.6">
              <p>{String.raw`Suppose $\det \begin{bmatrix} a & b & c \\ p & q & r \\ x & y & z \end{bmatrix} = 6$. Evaluate $\det A$, where $A = \begin{bmatrix} a+x & b+y & c+z \\ 3x & 3y & 3z \\ -p & -q & -r \end{bmatrix}$.`}</p>
              <Reveal label="Show solution">
                <p style={{margin:'0 0 8px'}}>We transform {String.raw`$A$`} back into the original matrix using the properties, tracking how the determinant changes.</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Step 1 — pull constants out of rows (Property 3).}$ Row 2 has a common factor $3$, row 3 has a common factor $-1$:`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$\det A = 3\cdot(-1)\det\begin{bmatrix} a+x & b+y & c+z \\ x & y & z \\ p & q & r \end{bmatrix} = -3\det\begin{bmatrix} a+x & b+y & c+z \\ x & y & z \\ p & q & r \end{bmatrix}.$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Step 2 — clean up row 1 (Property 5).}$ Row 1 is the original first row plus row 2's entries $(x,y,z)$. Subtracting row 2 from row 1 does not change the determinant:`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$= -3\det\begin{bmatrix} a & b & c \\ x & y & z \\ p & q & r \end{bmatrix}.$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Step 3 — restore original row order (Property 2).}$ We have rows $(a\,b\,c), (x\,y\,z), (p\,q\,r)$; the original order is $(a\,b\,c), (p\,q\,r), (x\,y\,z)$. Swapping rows 2 and 3 multiplies by $-1$:`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$= -3\cdot(-1)\det\begin{bmatrix} a & b & c \\ p & q & r \\ x & y & z \end{bmatrix} = 3\cdot 6 = 18.$$`}</p>
                <p style={{margin:0}}>{String.raw`So $\det A = 18$.`}</p>
              </Reveal>
            </Example>

            <Exercise id="Practice" title="Property practice (suppose the base determinant = 4)">
              <p>{String.raw`Throughout, suppose $\det \begin{bmatrix} a & b & c \\ p & q & r \\ x & y & z \end{bmatrix} = 4$. Evaluate each using the properties.`}</p>
              <Reveal label="Show all answers">
                <p style={{margin:'2px 0'}}>{String.raw`$\textbf{1.}\;\det\begin{bmatrix} 2a & 2b & 2c \\ p & q & r \\ x & y & z \end{bmatrix}$: factor $2$ out of row 1 $\Rightarrow 2\cdot 4 = \mathbf{8}$.`}</p>
                <p style={{margin:'2px 0'}}>{String.raw`$\textbf{2.}\;\det\begin{bmatrix} x & y & z \\ p & q & r \\ a & b & c \end{bmatrix}$: swapping rows 1 and 3 is one interchange $\Rightarrow -4 = \mathbf{-4}$.`}</p>
                <p style={{margin:'2px 0'}}>{String.raw`$\textbf{3.}\;\det\begin{bmatrix} a & b & c \\ p+a & q+b & r+c \\ x & y & z \end{bmatrix}$: row 2 is original row 2 plus row 1 (add a multiple of a row, no change) $\Rightarrow \mathbf{4}$.`}</p>
                <p style={{margin:'2px 0'}}>{String.raw`$\textbf{4.}\;\det\begin{bmatrix} a & b & c \\ p & q & r \\ a & b & c \end{bmatrix}$: two identical rows $\Rightarrow \mathbf{0}$.`}</p>
                <p style={{margin:'2px 0'}}>{String.raw`$\textbf{5.}\;\det\begin{bmatrix} 3a & 3b & 3c \\ 3p & 3q & 3r \\ 3x & 3y & 3z \end{bmatrix}$: every entry scaled by 3, use $\det(uA)=u^n\det A \Rightarrow 3^3\cdot 4 = \mathbf{108}$.`}</p>
              </Reveal>
            </Exercise>

            <Example n="6" title="Example 3.1.7 — Solving for x" advanced>
              <p>{String.raw`Find all $x$ with $\det A = 0$, where $A = \begin{bmatrix} 1 & x & x \\ x & 1 & x \\ x & x & 1 \end{bmatrix}$.`}</p>
              <Reveal label="Show solution">
                <p style={{margin:'0 0 8px'}}>{String.raw`Subtract $x$ times row 1 from rows 2 and 3 (Property 5 keeps the determinant the same):`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$\det A = \begin{vmatrix} 1 & x & x \\ 0 & 1-x^2 & x-x^2 \\ 0 & x-x^2 & 1-x^2 \end{vmatrix} = \begin{vmatrix} 1-x^2 & x-x^2 \\ x-x^2 & 1-x^2 \end{vmatrix}.$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`Factor $(1-x)$ out of each row (since $1-x^2 = (1-x)(1+x)$ and $x-x^2 = x(1-x)$):`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$\det A = (1-x)^2\begin{vmatrix} 1+x & x \\ x & 1+x \end{vmatrix} = (1-x)^2\big[(1+x)^2 - x^2\big] = (1-x)^2(2x+1).$$`}</p>
                <p style={{margin:0}}>{String.raw`So $\det A = 0$ means $(1-x)^2(2x+1) = 0$, giving $x = 1$ or $x = -\tfrac{1}{2}$.`}</p>
              </Reveal>
            </Example>

            <Example n="7" title="Example 3.1.8 — A famous pattern (Vandermonde 3×3)" advanced>
              <p>{String.raw`Show that $\det \begin{bmatrix} 1 & a_1 & a_1^2 \\ 1 & a_2 & a_2^2 \\ 1 & a_3 & a_3^2 \end{bmatrix} = (a_3 - a_1)(a_3 - a_2)(a_2 - a_1)$.`}</p>
              <Reveal label="Show solution">
                <p style={{margin:'0 0 8px'}}>{String.raw`Subtract row 1 from rows 2 and 3, then expand along column 1:`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$= \det\begin{bmatrix} 1 & a_1 & a_1^2 \\ 0 & a_2-a_1 & a_2^2-a_1^2 \\ 0 & a_3-a_1 & a_3^2-a_1^2 \end{bmatrix} = \begin{vmatrix} a_2-a_1 & a_2^2-a_1^2 \\ a_3-a_1 & a_3^2-a_1^2 \end{vmatrix}.$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`Factor $(a_2-a_1)$ from row 1 and $(a_3-a_1)$ from row 2:`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$= (a_2-a_1)(a_3-a_1)\begin{vmatrix} 1 & a_2+a_1 \\ 1 & a_3+a_1 \end{vmatrix} = (a_2-a_1)(a_3-a_1)(a_3-a_2).$$`}</p>
              </Reveal>
            </Example>

            {/* ─── §8 TRIANGULAR ─── */}
            <Sec id="triangular" n="§8">Triangular Matrices and Their Determinants</Sec>

            <DefBox term="Triangular matrices" color="teal">
              <p style={{margin:0}}>{String.raw`A square matrix is `}<b>lower triangular</b>{String.raw` if every entry above the main diagonal is zero, and `}<b>upper triangular</b>{String.raw` if every entry below the main diagonal is zero. A `}<b>triangular</b>{String.raw` matrix is either upper or lower triangular. For example, $\begin{bmatrix} a & 0 & 0 \\ u & b & 0 \\ v & w & c \end{bmatrix}$ is lower triangular and $\begin{bmatrix} a & u & v \\ 0 & b & w \\ 0 & 0 & c \end{bmatrix}$ is upper triangular.`}</p>
            </DefBox>

            <ThmBox title="Theorem 3.1.4">
              <p style={{margin:0}}>{String.raw`If $A$ is a square triangular matrix, then $\det A$ is the product of the entries on the main diagonal.`}</p>
            </ThmBox>

            <Callout icon="🧠" title="Why this works (the idea)" color="violet">
              Keep expanding along the row or column that has only one nonzero entry. Each expansion peels off one diagonal entry and leaves a smaller triangular matrix, so the diagonal entries just multiply together.
            </Callout>

            <Example n="8" title="Example 3.1.9">
              <p>{String.raw`Evaluate $\det A$ for the lower triangular matrix $A = \begin{bmatrix} a & 0 & 0 & 0 \\ u & b & 0 & 0 \\ v & w & c & 0 \\ x & y & z & d \end{bmatrix}$.`}</p>
              <p>{String.raw`Expand along the first row. Only the entry $a$ survives:`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$\det A = a\begin{vmatrix} b & 0 & 0 \\ w & c & 0 \\ y & z & d \end{vmatrix} = a\,b\begin{vmatrix} c & 0 \\ z & d \end{vmatrix} = a\,b\,(cd) = abcd.$$`}</p>
              <p style={{margin:0}}>{String.raw`The determinant is just the product of the diagonal entries $a, b, c, d$.`}</p>
            </Example>

            <Example n="9" title="Practice with triangular matrices">
              <p style={{margin:'4px 0'}}>{String.raw`$\begin{vmatrix} 2 & 7 & -1 \\ 0 & 3 & 5 \\ 0 & 0 & 4 \end{vmatrix} = 2\cdot 3\cdot 4 = 24, \qquad \begin{vmatrix} 5 & 0 & 0 \\ 9 & -2 & 0 \\ 1 & 6 & 3 \end{vmatrix} = 5\cdot(-2)\cdot 3 = -30.$`}</p>
              <p style={{margin:0}}>{String.raw`Note: if any diagonal entry is $0$, the whole product is $0$, so a triangular matrix with a zero on its diagonal has determinant $0$.`}</p>
            </Example>

            {/* ─── §9 BLOCK ─── */}
            <Sec id="block" n="§9">Block (Partitioned) Matrices</Sec>

            <p>When a matrix is built out of smaller square blocks arranged triangularly, there is a shortcut.</p>

            <ThmBox title="Theorem 3.1.5 — Block triangular matrices">
              <p style={{margin:0}}>{String.raw`Let $A$ and $B$ be square matrices, and let $X, Y$ be blocks of the right sizes. Then $$\det\begin{bmatrix} A & X \\ 0 & B \end{bmatrix} = (\det A)(\det B), \qquad \det\begin{bmatrix} A & 0 \\ Y & B \end{bmatrix} = (\det A)(\det B).$$`}</p>
            </ThmBox>

            <Example n="10" title="Example 3.1.10" advanced>
              <p>{String.raw`Compute $\det \begin{bmatrix} 2 & 3 & 1 & 3 \\ 1 & -2 & -1 & 1 \\ 0 & 1 & 0 & 1 \\ 0 & 4 & 0 & 1 \end{bmatrix}$.`}</p>
              <Reveal label="Show solution">
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{The idea.}$ This matrix is almost block-triangular, but the bottom-left $2\times2$ corner is not all zeros. Look at the third column: $(1,-1,0,0)^{\mathsf{T}}$. If that column sat in position 2 instead of 3, the bottom-left corner would become all zeros and Theorem 3.1.5 would apply.`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Step 1 — swap columns 2 and 3.}$ By Property 2 (interchanging two columns multiplies the determinant by $-1$):`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$\det\begin{bmatrix} 2 & 3 & 1 & 3 \\ 1 & -2 & -1 & 1 \\ 0 & 1 & 0 & 1 \\ 0 & 4 & 0 & 1 \end{bmatrix} = -\det\begin{bmatrix} 2 & 1 & 3 & 3 \\ 1 & -1 & -2 & 1 \\ 0 & 0 & 1 & 1 \\ 0 & 0 & 4 & 1 \end{bmatrix}.$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Step 2 — read off the blocks.}$ After the swap the bottom-left corner is all zeros, so the matrix is block-triangular with`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$A = \begin{bmatrix} 2 & 1 \\ 1 & -1 \end{bmatrix}, \quad X = \begin{bmatrix} 3 & 3 \\ -2 & 1 \end{bmatrix}, \quad 0 = \begin{bmatrix} 0 & 0 \\ 0 & 0 \end{bmatrix}, \quad B = \begin{bmatrix} 1 & 1 \\ 4 & 1 \end{bmatrix}.$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Step 3 — apply the block rule.}$ Since the bottom-left block is zero, $\det\begin{bmatrix} A & X \\ 0 & B \end{bmatrix} = (\det A)(\det B)$. Here $\det A = (2)(-1)-(1)(1) = -3$ and $\det B = (1)(1)-(1)(4) = -3$. Therefore`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$\det = -\,(\det A)(\det B) = -(-3)(-3) = -9.$$`}</p>
                <p style={{margin:0}}>{String.raw`The leading $-$ is the price of the one column swap.`}</p>
              </Reveal>
            </Example>

            {/* SUMMARY */}
            <div style={{ marginTop:'40px', padding:'24px 28px', background:'rgba(232,160,32,.08)', border:'2px solid rgba(232,160,32,.35)', borderRadius:'16px' }}>
              <div style={{ fontFamily:'var(--fm)', fontSize:'.7rem', letterSpacing:'.16em', textTransform:'uppercase', color:'#c8860a', marginBottom:'12px' }}>Summary of key points</div>
              <ul style={{ color:'var(--lec-ink2)', fontSize:'1rem', lineHeight:1.9, margin:0, paddingLeft:'22px' }}>
                <li>{String.raw`Determinant of $\begin{bmatrix} a & b \\ c & d \end{bmatrix}$ is $ad - bc$.`}</li>
                <li>For larger matrices, use cofactor expansion: entry × cofactor, summed along any row or column.</li>
                <li>{String.raw`Cofactor $= (-1)^{i+j} \times$ (minor); remember the checkerboard of signs.`}</li>
                <li>You may expand along any row or column — choose the one with the most zeros.</li>
                <li>Know the property list (Theorem 3.1.2) cold; it turns hard determinants into easy ones.</li>
                <li>Triangular matrix {String.raw`$\Rightarrow$`} determinant = product of the diagonal.</li>
                <li>{String.raw`$\det A \neq 0 \iff A$ is invertible.`}</li>
              </ul>
            </div>

            {/* ─── §10 EXERCISES ─── */}
            <Sec id="exercises" n="§10">Solutions to Section 3.1 Exercises</Sec>

            <Exercise id="3.1.2" title="Show det A = 0 if A has a row or column of zeros">
              <Reveal label="Show solution">
                <p style={{margin:'0 0 8px'}}>{String.raw`Suppose row $i$ of $A$ is all zeros. Expand the determinant along that very row. Every term has the form $a_{ij}c_{ij}$, where $a_{ij}$ is an entry of row $i$. But every $a_{ij} = 0$, so each term is $0$, and the whole sum is $0$. Hence $\det A = 0$.`}</p>
                <p style={{margin:0}}>{String.raw`If instead a column is all zeros, expand along that column; the same argument applies. (Alternatively, recall $\det(A^{\mathsf{T}}) = \det A$ and use the row case.) $\;\blacksquare$`}</p>
              </Reveal>
            </Exercise>

            <Exercise id="3.1.3" title="Show the (n,n) position always has sign +1">
              <Reveal label="Show solution">
                <p style={{margin:0}}>{String.raw`The entry in the last row and last column sits at position $(n,n)$. Its sign is $(-1)^{i+j} = (-1)^{n+n} = (-1)^{2n}$. Since $2n$ is even for every integer $n$, we get $(-1)^{2n} = +1$. So the bottom-right position always carries a $+$ sign. $\;\blacksquare$`}</p>
              </Reveal>
            </Exercise>

            <Exercise id="3.1.4" title="Show det I = 1 for any identity matrix">
              <Reveal label="Show solution">
                <p style={{margin:0}}>{String.raw`The identity matrix is triangular (in fact both upper and lower triangular), with every main-diagonal entry equal to $1$. By Theorem 3.1.4, $\det I = 1\cdot 1\cdots 1 = 1$. $\;\blacksquare$`}</p>
              </Reveal>
            </Exercise>

            <Exercise id="3.1.5" title="Evaluate each determinant by reducing to upper triangular form">
              <p>{String.raw`$\textbf{Method.}$ Use row operations. Adding a multiple of one row to another does not change the determinant (Property 5). Once upper triangular, the determinant is the product of the diagonal (Theorem 3.1.4). Track any row swaps (each contributes a factor $-1$).`}</p>
              <Reveal label="Show all four solutions">
                <p style={{margin:'0 0 6px'}}>{String.raw`$\textbf{(a)}\;\begin{vmatrix} 1 & -1 & 2 \\ 3 & 1 & 1 \\ 2 & -1 & 3 \end{vmatrix}$. $R_2 \to R_2 - 3R_1$, $R_3 \to R_3 - 2R_1$, then $R_3 \to R_3 - \tfrac14 R_2$:`}</p>
                <p style={{textAlign:'center',margin:'2px 0 10px'}}>{String.raw`$= \begin{vmatrix} 1 & -1 & 2 \\ 0 & 4 & -5 \\ 0 & 0 & \tfrac14 \end{vmatrix} = (1)(4)(\tfrac14) = \mathbf{1}.$`}</p>
                <p style={{margin:'0 0 6px'}}>{String.raw`$\textbf{(b)}\;\begin{vmatrix} -1 & 3 & 1 \\ 2 & 5 & 3 \\ 1 & -2 & 1 \end{vmatrix}$. $R_2 \to R_2 + 2R_1$, $R_3 \to R_3 + R_1$, then $R_3 \to R_3 - \tfrac{1}{11}R_2$:`}</p>
                <p style={{textAlign:'center',margin:'2px 0 10px'}}>{String.raw`$= \begin{vmatrix} -1 & 3 & 1 \\ 0 & 11 & 5 \\ 0 & 0 & \tfrac{17}{11} \end{vmatrix} = (-1)(11)(\tfrac{17}{11}) = \mathbf{-17}.$`}</p>
                <p style={{margin:'0 0 6px'}}>{String.raw`$\textbf{(c)}\;\begin{vmatrix} -1 & -1 & 1 & 0 \\ 2 & 1 & 1 & 3 \\ 0 & 1 & 1 & 2 \\ 1 & 3 & -1 & 2 \end{vmatrix}$. After $R_2 \to R_2+2R_1$, $R_4 \to R_4+R_1$; then $R_3 \to R_3+R_2$, $R_4 \to R_4+2R_2$; then $R_4 \to R_4 - \tfrac{6}{4}R_3$:`}</p>
                <p style={{textAlign:'center',margin:'2px 0 10px'}}>{String.raw`$= \begin{vmatrix} -1 & -1 & 1 & 0 \\ 0 & -1 & 3 & 3 \\ 0 & 0 & 4 & 5 \\ 0 & 0 & 0 & \tfrac12 \end{vmatrix} = (-1)(-1)(4)(\tfrac12) = \mathbf{2}.$`}</p>
                <p style={{margin:'0 0 6px'}}>{String.raw`$\textbf{(d)}\;\begin{vmatrix} 2 & 3 & 1 & 1 \\ 0 & 2 & -1 & 3 \\ 0 & 5 & 1 & 1 \\ 1 & 1 & 2 & 5 \end{vmatrix}$. After $R_4 \to R_4 - \tfrac12 R_1$; then $R_3 \to R_3 - \tfrac52 R_2$, $R_4 \to R_4 + \tfrac14 R_2$; then $R_4 \to R_4 - \tfrac{5}{14}R_3$:`}</p>
                <p style={{textAlign:'center',margin:'2px 0 0'}}>{String.raw`$= \begin{vmatrix} 2 & 3 & 1 & 1 \\ 0 & 2 & -1 & 3 \\ 0 & 0 & \tfrac72 & -\tfrac{13}{2} \\ 0 & 0 & 0 & \tfrac{53}{7} \end{vmatrix} = (2)(2)(\tfrac72)(\tfrac{53}{7}) = \mathbf{106}.$`}</p>
              </Reveal>
            </Exercise>

            <Exercise id="3.1.7" title="Given the base determinant = −1, compute each">
              <p>{String.raw`$\textbf{Strategy.}$ Pull common factors out of each row (Property 3), then restore the rows $a,b,c / p,q,r / x,y,z$ using "add a multiple of a row" (Property 5, no change) and row swaps (Property 2, factor $-1$). Let $D = -1$ be the given determinant.`}</p>
              <Reveal label="Show both solutions">
                <p style={{margin:'0 0 6px'}}>{String.raw`$\textbf{(a)}\;\det\begin{bmatrix} -x & -y & -z \\ 3p+a & 3q+b & 3r+c \\ 2p & 2q & 2r \end{bmatrix}$.`}</p>
                <p style={{margin:'2px 0'}}>{String.raw`Take $-1$ out of row 1 and $2$ out of row 3: $= (-1)(2)\det\begin{bmatrix} x & y & z \\ 3p+a & 3q+b & 3r+c \\ p & q & r \end{bmatrix}$.`}</p>
                <p style={{margin:'2px 0'}}>{String.raw`Row 2 is $3(\text{row }p) + (\text{row }a)$; subtract $3$ times the bottom row from row 2: $= -2\det\begin{bmatrix} x & y & z \\ a & b & c \\ p & q & r \end{bmatrix}$.`}</p>
                <p style={{margin:'2px 0 10px'}}>{String.raw`Restore order $a,p,x$ by two swaps (sign $+1$): $= -2\det\begin{bmatrix} a & b & c \\ p & q & r \\ x & y & z \end{bmatrix} = -2D = (-2)(-1) = \mathbf{2}.$`}</p>
                <p style={{margin:'0 0 6px'}}>{String.raw`$\textbf{(b)}\;\det\begin{bmatrix} -2a & -2b & -2c \\ 2p+x & 2q+y & 2r+z \\ 3x & 3y & 3z \end{bmatrix}$.`}</p>
                <p style={{margin:'2px 0'}}>{String.raw`Factor $-2$ from row 1 and $3$ from row 3: $= (-2)(3)\det\begin{bmatrix} a & b & c \\ 2p+x & 2q+y & 2r+z \\ x & y & z \end{bmatrix}$.`}</p>
                <p style={{margin:'2px 0'}}>{String.raw`Row 2 is $2(\text{row }p) + (\text{row }x)$; subtract the bottom row from row 2, then factor the $2$:`}</p>
                <p style={{margin:'2px 0 0'}}>{String.raw`$= (-6)(2)\det\begin{bmatrix} a & b & c \\ p & q & r \\ x & y & z \end{bmatrix} = -12D = (-12)(-1) = \mathbf{12}.$`}</p>
              </Reveal>
            </Exercise>

            <Exercise id="3.1.8" title="Prove each identity (base determinant = D)">
              <p>{String.raw`$\textbf{Method.}$ Use only Property 5 (add a multiple of one row to another, no change), Property 3 (factor a common row factor), and Property 2 (swap rows, factor $-1$). Write the target rows as $R_1, R_2, R_3$.`}</p>
              <Reveal label="Show both proofs">
                <p style={{margin:'0 0 6px'}}>{String.raw`$\textbf{(a)}\;\det\begin{bmatrix} p+x & q+y & r+z \\ a+x & b+y & c+z \\ a+p & b+q & c+r \end{bmatrix} = 2D.$`}</p>
                <p style={{margin:'2px 0'}}>{String.raw`$R_3 \to R_3 - R_2$ gives row $(p-x,\dots)$. Then $R_1 \to R_1 - R_3$ gives $(2x,2y,2z)$. Factor $2$ from row 1:`}</p>
                <p style={{margin:'2px 0'}}>{String.raw`$= 2\det\begin{bmatrix} x & y & z \\ a+x & b+y & c+z \\ p-x & q-y & r-z \end{bmatrix}$. Now $R_2 \to R_2 - R_1$ gives the $a$-row, $R_3 \to R_3 + R_1$ gives the $p$-row:`}</p>
                <p style={{margin:'2px 0 10px'}}>{String.raw`$= 2\det\begin{bmatrix} x & y & z \\ a & b & c \\ p & q & r \end{bmatrix}$. Two swaps restore order $a,p,x$ (sign $+1$): $= 2D.\;\blacksquare$`}</p>
                <p style={{margin:'0 0 6px'}}>{String.raw`$\textbf{(b)}\;\det\begin{bmatrix} 2a+p & 2b+q & 2c+r \\ 2p+x & 2q+y & 2r+z \\ 2x+a & 2y+b & 2z+c \end{bmatrix} = 9D.$`}</p>
                <p style={{margin:'2px 0'}}>{String.raw`$R_1 \to R_1 + R_2 + R_3$ gives $3(a+p+x,\dots)$; factor $3$, call the new top row $s = a+p+x$:`}</p>
                <p style={{margin:'2px 0'}}>{String.raw`$R_2 \to R_2 - R_1$ gives $(p-a,\dots)$, $R_3 \to R_3 - R_1$ gives $(x-p,\dots)$. Then $R_1 \to R_1 - 2R_2 - R_3$ gives $(3a,\dots)$; factor $3$ again:`}</p>
                <p style={{margin:'2px 0'}}>{String.raw`$= 9\det\begin{bmatrix} a & b & c \\ p-a & q-b & r-c \\ x-p & y-q & z-r \end{bmatrix}$. Finally $R_2 \to R_2 + R_1$ then $R_3 \to R_3 + R_2$ restore the $p$- and $x$-rows:`}</p>
                <p style={{margin:'2px 0'}}>{String.raw`$= 9\det\begin{bmatrix} a & b & c \\ p & q & r \\ x & y & z \end{bmatrix} = 9D.$ The $9$ comes from pulling out the factor $3$ twice. $\;\blacksquare$`}</p>
              </Reveal>
            </Exercise>

            <Exercise id="3.1.10" title="Compute each using Theorem 3.1.5 (block triangular)">
              <Reveal label="Show both solutions">
                <p style={{margin:'0 0 6px'}}>{String.raw`$\textbf{(a)}\;\det\begin{bmatrix} 1 & -1 & 2 & 0 & -2 \\ 0 & 1 & 0 & 4 & 1 \\ 1 & 1 & 5 & 0 & 0 \\ 0 & 0 & 0 & 3 & -1 \\ 0 & 0 & 0 & 1 & 1 \end{bmatrix}$. The bottom-left $2\times3$ block is zero, so it splits as $\begin{bmatrix} A & X \\ 0 & B \end{bmatrix}$ with`}</p>
                <p style={{margin:'2px 0'}}>{String.raw`$A = \begin{bmatrix} 1 & -1 & 2 \\ 0 & 1 & 0 \\ 1 & 1 & 5 \end{bmatrix}$, $B = \begin{bmatrix} 3 & -1 \\ 1 & 1 \end{bmatrix}$. Then $\det B = (3)(1)-(-1)(1) = 4$. For $\det A$, expand along row 2 (sign $+$ at $(2,2)$): $\det A = 1\cdot\begin{vmatrix} 1 & 2 \\ 1 & 5 \end{vmatrix} = 5-2 = 3$.`}</p>
                <p style={{margin:'2px 0 10px'}}>{String.raw`So $\det = (\det A)(\det B) = 3\cdot 4 = \mathbf{12}.$`}</p>
                <p style={{margin:'0 0 6px'}}>{String.raw`$\textbf{(b)}\;\det\begin{bmatrix} 1 & 2 & 0 & 3 & 0 \\ -1 & 3 & 1 & 4 & 0 \\ 0 & 0 & 2 & 1 & 1 \\ 0 & 0 & -1 & 0 & 2 \\ 0 & 0 & 3 & 0 & 1 \end{bmatrix}$. The bottom-left $3\times2$ block is zero, so $\begin{bmatrix} A & X \\ 0 & B \end{bmatrix}$ with`}</p>
                <p style={{margin:'2px 0'}}>{String.raw`$A = \begin{bmatrix} 1 & 2 \\ -1 & 3 \end{bmatrix}$, $B = \begin{bmatrix} 2 & 1 & 1 \\ -1 & 0 & 2 \\ 3 & 0 & 1 \end{bmatrix}$. Here $\det A = (1)(3)-(2)(-1) = 5$. For $\det B$, expand along column 2 (only the top entry $1$ is nonzero, sign $-$ at $(1,2)$): $\det B = -1\cdot\begin{vmatrix} -1 & 2 \\ 3 & 1 \end{vmatrix} = -(-1-6) = 7$.`}</p>
                <p style={{margin:'2px 0 0'}}>{String.raw`So $\det = (\det A)(\det B) = 5\cdot 7 = \mathbf{35}.$`}</p>
              </Reveal>
            </Exercise>

            <Exercise id="3.1.11" title="If det A = 2, det B = −1, det C = 3, find each">
              <Reveal label="Show all four">
                <p style={{margin:'2px 0'}}>{String.raw`$\textbf{(a)}\;\det\begin{bmatrix} A & X & Y \\ 0 & B & Z \\ 0 & 0 & C \end{bmatrix} = (\det A)(\det B)(\det C) = (2)(-1)(3) = \mathbf{-6}.$`}</p>
                <p style={{margin:'2px 0'}}>{String.raw`$\textbf{(b)}\;\det\begin{bmatrix} A & 0 & 0 \\ X & B & 0 \\ Y & Z & C \end{bmatrix} = (\det A)(\det B)(\det C) = \mathbf{-6}.$`}</p>
                <p style={{margin:'2px 0'}}>{String.raw`$\textbf{(c)}$ Expanding along the first block-column: $\det\begin{bmatrix} A & X & Y \\ 0 & B & 0 \\ 0 & Z & C \end{bmatrix} = (\det A)\det\begin{bmatrix} B & 0 \\ Z & C \end{bmatrix} = (\det A)(\det B)(\det C) = \mathbf{-6}.$`}</p>
                <p style={{margin:'2px 0'}}>{String.raw`$\textbf{(d)}$ Expanding along the third block-column: $\det\begin{bmatrix} A & X & 0 \\ 0 & B & 0 \\ Y & Z & C \end{bmatrix} = (\det C)\det\begin{bmatrix} A & X \\ 0 & B \end{bmatrix} = (\det C)(\det A)(\det B) = \mathbf{-6}.$`}</p>
              </Reveal>
            </Exercise>

            <Exercise id="3.1.12" title="Three columns with only the top two entries nonzero ⟹ det A = 0">
              <Reveal label="Show solution">
                <p style={{margin:0}}>{String.raw`Three of the columns have nonzero entries only in the first two rows. Think of those three columns as vectors living in a space of only two coordinates (rows 1 and 2). Three vectors in a 2-dimensional space must be linearly dependent — one is a combination of the other two. By Property 5, subtract that combination from the third column, turning it into a column of zeros without changing the determinant. By Property 1, a matrix with a zero column has $\det = 0$. Hence $\det A = 0$. $\;\blacksquare$`}</p>
              </Reveal>
            </Exercise>

            <Exercise id="3.1.13" title="Scalar-multiple and negation conditions">
              <p><b>(a)</b> {String.raw`Find $\det A$ if $A$ is $3\times3$ and $\det(2A) = 6$.`}</p>
              <Reveal label="Show answer (a)">
                <p style={{margin:0}}>{String.raw`By Theorem 3.1.3, $\det(uA) = u^n \det A$. Here $n=3$, $u=2$, so $\det(2A) = 2^3\det A = 8\det A$. Setting $8\det A = 6$ gives $\det A = \tfrac{6}{8} = \tfrac{3}{4}.$`}</p>
              </Reveal>
              <p style={{marginTop:'12px'}}><b>(b)</b> {String.raw`Under what conditions is $\det(-A) = \det A$?`}</p>
              <Reveal label="Show answer (b)">
                <p style={{margin:0}}>{String.raw`For an $n\times n$ matrix, $\det(-A) = (-1)^n \det A$. If $n$ is even, $(-1)^n = +1$, so $\det(-A) = \det A$ always. If $n$ is odd, $(-1)^n = -1$, so $\det(-A) = -\det A$, which equals $\det A$ only when $\det A = 0$. Therefore $\det(-A) = \det A$ exactly when $n$ is even, or $n$ is odd and $\det A = 0$. $\;\blacksquare$`}</p>
              </Reveal>
            </Exercise>

            <Exercise id="3.1.15" title="Each determinant is written as ax + by + cz">
              <p><b>(a)</b> {String.raw`Find $b$ if $\det\begin{bmatrix} 5 & -1 & x \\ 2 & 6 & y \\ -5 & 4 & z \end{bmatrix} = ax + by + cz$.`}</p>
              <Reveal label="Show answer (a)">
                <p style={{margin:0}}>{String.raw`The coefficient of $y$ is the cofactor of the $(2,3)$ position. Its sign is $(-1)^{2+3} = -1$: $b = (-1)\begin{vmatrix} 5 & -1 \\ -5 & 4 \end{vmatrix} = -\big[(5)(4)-(-1)(-5)\big] = -(20-5) = \mathbf{-15}.$`}</p>
              </Reveal>
              <p style={{marginTop:'12px'}}><b>(b)</b> {String.raw`Find $c$ if $\det\begin{bmatrix} 2 & x & -1 \\ 1 & y & 3 \\ -3 & z & 4 \end{bmatrix} = ax + by + cz$.`}</p>
              <Reveal label="Show answer (b)">
                <p style={{margin:0}}>{String.raw`The coefficient of $z$ is the cofactor of the $(3,2)$ position, sign $(-1)^{3+2} = -1$: $c = (-1)\begin{vmatrix} 2 & -1 \\ 1 & 3 \end{vmatrix} = -\big[(2)(3)-(-1)(1)\big] = -(6+1) = \mathbf{-7}.$`}</p>
              </Reveal>
            </Exercise>

            <Exercise id="3.1.16" title="Find the real numbers x and y such that det A = 0">
              <Reveal label="Show all four">
                <p style={{margin:'2px 0'}}>{String.raw`$\textbf{(a)}\;A = \begin{bmatrix} 0 & x & y \\ y & 0 & x \\ x & y & 0 \end{bmatrix}$: $\det A = -(x^3+y^3)$ (up to sign), which factors as $(x+y)(x^2-xy+y^2)$. The factor $x^2-xy+y^2$ is zero for real $x,y$ only when $x=y=0$ (its discriminant in $x$ is $-3y^2 \le 0$). So the real solutions are $\mathbf{x = -y}$ (any real $y$).`}</p>
                <p style={{margin:'8px 0 2px'}}>{String.raw`$\textbf{(b)}\;A = \begin{bmatrix} 1 & x & x \\ -x & -2 & x \\ -x & -x & -3 \end{bmatrix}$: $\det A = -2(2x^2-3) = -4x^2+6$. Setting to $0$: $2x^2 = 3 \Rightarrow x = \pm\sqrt{\tfrac32} = \pm\dfrac{\sqrt6}{2}.$`}</p>
                <p style={{margin:'8px 0 2px'}}>{String.raw`$\textbf{(c)}\;A = \begin{bmatrix} 1 & x & x^2 & x^3 \\ x & x^2 & x^3 & 1 \\ x^2 & x^3 & 1 & x \\ x^3 & 1 & x & x^2 \end{bmatrix}$: factors cleanly as $\det A = (x-1)^3(x+1)^3(x^2+1)^3 = (x^4-1)^3$. Over the reals $x^2+1\neq 0$, so $\det A = 0$ requires $(x-1)(x+1)=0$: $\mathbf{x = 1}$ or $\mathbf{x = -1}.$`}</p>
                <p style={{margin:'8px 0 2px'}}>{String.raw`$\textbf{(d)}\;A = \begin{bmatrix} x & y & 0 & 0 \\ 0 & x & y & 0 \\ 0 & 0 & x & y \\ y & 0 & 0 & x \end{bmatrix}$: a circulant-type matrix with $\det A = x^4 - y^4 = (x-y)(x+y)(x^2+y^2)$. Over the reals, $x^2+y^2$ vanishes only at $x=y=0$, already covered. So the solutions are $\mathbf{x = y}$ or $\mathbf{x = -y}.$`}</p>
              </Reveal>
            </Exercise>

            {/* CLOSING */}
            <div style={{ marginTop:'48px', padding:'28px 32px', background:'rgba(56,201,176,.08)', border:'2px solid rgba(56,201,176,.35)', borderRadius:'16px' }}>
              <div style={{ fontFamily:'var(--fm)', fontSize:'.7rem', letterSpacing:'.16em', textTransform:'uppercase', color:'#2a9d8f', marginBottom:'12px' }}>Looking ahead</div>
              <p style={{ fontFamily:'var(--fh)', fontSize:'1.4rem', color:'var(--lec-ink)', margin:'0 0 16px', fontWeight:400, lineHeight:1.3 }}>
                You can now compute any determinant and bend it with the property toolkit. Next we put determinants to work.
              </p>
              <p style={{ color:'var(--lec-ink2)', fontSize:'.97rem', lineHeight:1.8, margin:0 }}>
                The determinant unlocks the adjugate formula for the inverse, Cramer's rule for solving systems, and the geometric meaning of area and volume scaling — and later, it is the key to finding eigenvalues. Everything you mastered today feeds directly into what comes next.
              </p>
            </div>

            <div style={{ marginTop:'64px', paddingTop:'28px', borderTop:'2px solid var(--lec-border)', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'12px' }}>
              <div style={{ fontFamily:'var(--fm)', fontSize:'.76rem', color:'var(--lec-ink3)', fontStyle:'italic' }}>Lecture 9 — complete</div>
              <div style={{ fontFamily:'var(--fm)', fontSize:'.76rem', color:'var(--lec-ink3)' }}>MATH-120 · Shoaib Khan · LUMS · June 2026</div>
            </div>
          </div>

          {/* FOOTER NAV */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'22px 48px', borderTop:'1px solid var(--lec-border)', background:'var(--lec-paper)', flexWrap:'wrap', gap:'12px' }}>
            <Link href={PREV_HREF} style={{ fontFamily:'var(--fm)', fontSize:'.74rem', letterSpacing:'.08em', textTransform:'uppercase', color:'var(--lec-accent)', textDecoration:'none' }}>← Lecture 8</Link>
            <Link href={NEXT_HREF} style={{ fontFamily:'var(--fm)', fontSize:'.74rem', letterSpacing:'.08em', textTransform:'uppercase', color:'var(--lec-accent)', textDecoration:'none' }}>Lecture 10 →</Link>
          </div>
        </main>
      </div>

      <Footer/>
    </>
  );
}