'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import Navbar from '../../../../components/Navbar';
import Footer from '../../../../components/Footer';

/* ════════════════════════════════════════════════════════════
   MATH-120 · LECTURE 6
   The Inverse of a Matrix — Elementary Matrices & Gauss-Jordan
   Route: /courses/linalg/w2/lec6
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

const THIS_SLUG = 'w2/lec6';
const PREV_HREF  = '/courses/linalg/w2/lec5';
const NEXT_HREF  = '/courses/linalg/w2/lec7';

const LEC = {
  course: 'MATH-120 · Linear Algebra',
  number: 'Lecture 6',
  title: 'The Inverse of a Matrix',
  subtitle: 'Elementary matrices, and the Gauss–Jordan algorithm that turns [A | I] into [I | A⁻¹]',
  date: '16 June 2026',
};

const ANCHORS = [
  ['Motivation', 'motivation'],
  ['The Inverse', 'inverse'],
  ['Does it Exist?', 'exist'],
  ['2×2 Formula', 'twobytwo'],
  ['Elementary Matrices', 'elem'],
  ['The Algorithm', 'algorithm'],
  ['Worked Example', 'worked'],
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

/* ═══════════════ INTERACTIVE 2x2 INVERSE WIDGET ═══════════════ */
function InverseExplorer() {
  const [a,setA]=useState(2),[b,setB]=useState(1),[c,setC]=useState(3),[d,setD]=useState(2);
  const det = a*d - b*c;
  const invertible = det !== 0;
  const fmt = (x)=>{
    const v = x/det;
    if (Number.isInteger(v)) return String(v);
    return `${x}/${det}`;
  };
  const Cell = ({val,set})=>(
    <input type="number" value={val} onChange={e=>set(parseInt(e.target.value||'0',10))}
      style={{ width:'46px', textAlign:'center', fontFamily:'monospace', fontSize:'1rem', padding:'6px 2px', borderRadius:'6px', border:'1px solid #3a3a6a', background:'#1a1f35', color:'#e8e8f0' }}/>
  );
  return (
    <div style={{ background:'#0f1525', border:'1px solid rgba(255,255,255,.08)', borderRadius:'16px', padding:'22px', margin:'24px 0', color:'#e8e8f0', boxShadow:'0 8px 40px rgba(0,0,0,.4)' }}>
      <div style={{ fontFamily:'var(--fm)', fontSize:'.7rem', letterSpacing:'.14em', textTransform:'uppercase', color:'#6a6a9a', marginBottom:'16px', textAlign:'center' }}>
        Interactive · Build a 2×2 matrix and watch its inverse
      </div>
      <div style={{ display:'flex', gap:'24px', justifyContent:'center', alignItems:'center', flexWrap:'wrap' }}>
        <div style={{ textAlign:'center' }}>
          <div style={{ fontFamily:'monospace', color:'#8a8ac0', fontSize:'.8rem', marginBottom:'6px' }}>A</div>
          <div style={{ display:'inline-grid', gridTemplateColumns:'auto auto', gap:'6px', padding:'10px', border:'2px solid #3a3a6a', borderRadius:'8px' }}>
            <Cell val={a} set={setA}/><Cell val={b} set={setB}/>
            <Cell val={c} set={setC}/><Cell val={d} set={setD}/>
          </div>
        </div>
        <div style={{ fontFamily:'monospace', fontSize:'1.4rem', color: invertible?'#38c9b0':'#e06b6b' }}>→</div>
        <div style={{ textAlign:'center' }}>
          <div style={{ fontFamily:'monospace', color:'#8a8ac0', fontSize:'.8rem', marginBottom:'6px' }}>
            det = {a}·{d} − {b}·{c} = {det}
          </div>
          {invertible ? (
            <div style={{ display:'inline-grid', gridTemplateColumns:'auto auto', gap:'6px 14px', padding:'10px 14px', border:'2px solid #38c9b0', borderRadius:'8px', fontFamily:'monospace', fontSize:'1rem' }}>
              <span>{fmt(d)}</span><span>{fmt(-b)}</span>
              <span>{fmt(-c)}</span><span>{fmt(a)}</span>
            </div>
          ) : (
            <div style={{ padding:'12px 16px', border:'2px solid #e06b6b', borderRadius:'8px', color:'#e06b6b', fontFamily:'var(--fm)', fontSize:'.84rem', maxWidth:'200px' }}>
              det = 0 → singular. No inverse exists.
            </div>
          )}
        </div>
      </div>
      <p style={{ fontSize:'.78rem', color:'#7a7ab0', textAlign:'center', margin:'16px 0 0', lineHeight:1.6 }}>
        Change any entry. The instant the determinant hits zero, the inverse vanishes — that is the knife-edge between invertible and singular.
      </p>
    </div>
  );
}

/* ═══════════════ PAGE ═══════════════ */
export default function Lec6() {
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
        .rr-grid { display:grid; grid-template-columns:130px 1fr; gap:6px 14px; align-items:center; margin:18px 0; }
        .rr-op { font-family:var(--fm); font-size:.72rem; color:#c8860a; }
        @media(max-width:960px){ .lc-body{ padding:28px 28px 80px; } }
        @media(max-width:780px){ .sbs{ grid-template-columns:1fr; } .rr-grid{ grid-template-columns:1fr; gap:2px; } .rr-op{ margin-top:8px; } }
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
        <span style={{color:'var(--text2)'}}>Week 2 · Lecture 6</span>
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
            <Link href={PREV_HREF} style={{ display:'flex', alignItems:'center', padding:'0 16px', height:'100%', fontFamily:'var(--fm)', fontSize:'.72rem', color:'var(--lec-ink3)', borderRight:'1px solid var(--lec-border)', whiteSpace:'nowrap', flexShrink:0, textDecoration:'none' }}>← Lecture 5</Link>
            <div style={{ flex:1, display:'flex', justifyContent:'center', alignItems:'center', gap:'4px', overflowX:'auto', padding:'0 8px' }}>
              <span style={{ fontFamily:'var(--fm)', fontSize:'.6rem', letterSpacing:'.12em', textTransform:'uppercase', color:'var(--lec-accent)', flexShrink:0, marginRight:'6px' }}>On this page</span>
              {ANCHORS.map(([label,id],i)=>(
                <span key={id} style={{display:'inline-flex',alignItems:'center',flexShrink:0}}>
                  {i>0&&<span style={{color:'var(--lec-border)',margin:'0 7px'}}>·</span>}
                  <a href={`#${id}`} onClick={e=>jump(e,id)} style={{fontFamily:'var(--fm)',fontSize:'.73rem',color:'var(--lec-ink2)',textDecoration:'none',whiteSpace:'nowrap'}}>{label}</a>
                </span>
              ))}
            </div>
            <Link href={NEXT_HREF} style={{ display:'flex', alignItems:'center', padding:'0 16px', height:'100%', fontFamily:'var(--fm)', fontSize:'.72rem', color:'var(--lec-ink3)', borderLeft:'1px solid var(--lec-border)', whiteSpace:'nowrap', flexShrink:0, textDecoration:'none' }}>Lecture 7 →</Link>
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
            <Sec id="motivation" n="§1">Why Bother With an Inverse?</Sec>

            <Callout icon="🎬" title="A story before the math" color="violet">
              In the film <i>The Pursuit of Happyness</i>, Chris Gardner solves a Rubik's cube in a taxi to convince a stockbroker he is worth hiring. The cube looks like chaos, but every scramble can be <b>undone</b> — there is always a sequence of moves that returns it to order. That "undo" is the whole idea of an inverse. A scramble is an operation; the inverse is the operation that cancels it. Matrices are the same: many matrices have a partner that perfectly undoes what they do.
            </Callout>

            <p>For an ordinary number like {String.raw`$5$`}, the "undo" of multiplying by {String.raw`$5$`} is multiplying by {String.raw`$\tfrac{1}{5}$`}, because {String.raw`$5 \cdot \tfrac{1}{5} = 1$`}. The number {String.raw`$\tfrac15$`} is the <b>multiplicative inverse</b> of {String.raw`$5$`}. We want the same thing for matrices: given {String.raw`$A$`}, find a matrix that multiplies with it to give the identity {String.raw`$I$`} — the matrix version of the number {String.raw`$1$`}.</p>

            <Callout icon="📖" title="Two recommendations" color="amber">
              If you enjoy the theme of order, choices, and consequences, the novel <i>The Giver</i> by Lois Lowry is worth your time — and <i>The Pursuit of Happyness</i> is worth the watch. Both are about finding the one path that undoes a hard situation. Keep that picture of "undoing" in mind for this whole lecture.
            </Callout>

            <p>Why do we care so much? Because if {String.raw`$A$`} has an inverse {String.raw`$A^{-1}$`}, then the linear system {String.raw`$A\mathbf{x} = \mathbf{b}$`} is solved in one clean stroke: multiply both sides by {String.raw`$A^{-1}$`} to get {String.raw`$\mathbf{x} = A^{-1}\mathbf{b}$`}. The inverse is a master key that unlocks every system with the same coefficient matrix at once.</p>

            {/* ─── §2 THE INVERSE ─── */}
            <Sec id="inverse" n="§2">The Multiplicative Inverse of a Matrix</Sec>

            <DefBox term="Inverse of a matrix" color="violet">
              <p style={{margin:0}}>{String.raw`A square matrix $A$ is `}<b>invertible</b>{String.raw` if there is a matrix $A^{-1}$ (read "$A$ inverse") such that`}</p>
              <p style={{textAlign:'center',margin:'10px 0 0'}}>{String.raw`$$A^{-1}A = AA^{-1} = I.$$`}</p>
              <p style={{margin:'10px 0 0'}}>{String.raw`The matrix $A^{-1}$ is the `}<b>multiplicative inverse</b>{String.raw` of $A$. A matrix that has no inverse is called `}<b>singular</b>{String.raw`; one that does is `}<b>non-singular</b>{String.raw`.`}</p>
            </DefBox>

            <p>Two requirements are hidden in that definition, and both matter:</p>

            <div className="sbs">
              <div className="sbs-card">
                <div className="sbs-label">Requirement 1 — square</div>
                <p style={{margin:0,fontSize:'.94rem',lineHeight:1.7}}>{String.raw`$A$ must be a `}<b>square</b>{String.raw` matrix. Only an $n\times n$ matrix can satisfy both $A^{-1}A = I$ and $AA^{-1} = I$ with the same partner.`}</p>
              </div>
              <div className="sbs-card">
                <div className="sbs-label">Requirement 2 — same order</div>
                <p style={{margin:0,fontSize:'.94rem',lineHeight:1.7}}>{String.raw`$A^{-1}$ must have the `}<b>same order</b>{String.raw` (size) as $A$. If $A$ is $3\times3$, then $A^{-1}$ is also $3\times3$.`}</p>
              </div>
            </div>

            <Callout icon="🧊" title="The identity matrix is the matrix '1'" color="teal">
              {String.raw`The identity $I$ has $1$s on the main diagonal and $0$s elsewhere, e.g. $I = \begin{pmatrix}1&0\\0&1\end{pmatrix}$. It does nothing when you multiply by it: $IA = AI = A$, exactly like the number $1$. The inverse is whatever brings $A$ back to this "do-nothing" matrix.`}
            </Callout>

            {/* ─── §3 DOES IT EXIST ─── */}
            <Sec id="exist" n="§3">How Do We Know an Inverse Exists?</Sec>

            <p>Not every matrix has an inverse — just as the number {String.raw`$0$`} has no multiplicative inverse (nothing times {String.raw`$0$`} gives {String.raw`$1$`}). So before hunting for {String.raw`$A^{-1}$`}, we need a test.</p>

            <DefBox term="Existence test" color="amber">
              <p style={{margin:0}}>{String.raw`A square matrix $A$ has an inverse `}<b>if and only if it has full rank</b>{String.raw` — equivalently, $A$ is `}<b>non-singular</b>{String.raw`. If $A$ is rank-deficient (a `}<b>singular</b>{String.raw` matrix), then $A^{-1}$ `}<b>does not exist</b>{String.raw`.`}</p>
            </DefBox>

            <Callout icon="🔍" title="Connecting back to rank" color="teal">
              Remember from Lecture 3: a square {String.raw`$n\times n$`} matrix has full rank when {String.raw`$\operatorname{rank}(A) = n$`} — a pivot in every row and column. Full rank means the rows are independent, the columns are independent, and crucially, the reduced form of {String.raw`$A$`} is the identity {String.raw`$I$`} itself. That last fact is the engine of the whole algorithm we build below.
            </Callout>

            {/* ─── §4 2x2 FORMULA ─── */}
            <Sec id="twobytwo" n="§4">The 2×2 Shortcut</Sec>

            <p>For the smallest square matrices there is a formula you can memorise. It is worth knowing cold, because {String.raw`$2\times2$`} inverses appear everywhere.</p>

            <DefBox term="Inverse of a 2×2 matrix" color="violet">
              <p style={{margin:'0 0 8px'}}>{String.raw`For $A = \begin{bmatrix} a & b \\ c & d \end{bmatrix}$, the inverse is`}</p>
              <p style={{textAlign:'center',margin:0}}>{String.raw`$$A^{-1} = \frac{1}{ad - bc}\begin{bmatrix} d & -b \\ -c & a \end{bmatrix},$$`}</p>
              <p style={{margin:'10px 0 0'}}>{String.raw`provided $ad - bc \neq 0$. The quantity $ad - bc$ is the `}<b>determinant</b>{String.raw` of $A$. If it is zero, $A$ is singular and has no inverse.`}</p>
            </DefBox>

            <p>The recipe in words: <b>swap</b> the diagonal entries ({String.raw`$a$`} and {String.raw`$d$`}), <b>negate</b> the off-diagonal entries ({String.raw`$b$`} and {String.raw`$c$`}), then <b>divide</b> by the determinant.</p>

            <Example n="1" title="A clean 2×2 inverse">
              <p>{String.raw`Find the inverse of $A = \begin{bmatrix} 2 & 1 \\ 3 & 2 \end{bmatrix}$.`}</p>
              <p>{String.raw`Determinant: $ad - bc = (2)(2) - (1)(3) = 4 - 3 = 1$. Since it is nonzero, $A$ is invertible.`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$A^{-1} = \frac{1}{1}\begin{bmatrix} 2 & -1 \\ -3 & 2 \end{bmatrix} = \begin{bmatrix} 2 & -1 \\ -3 & 2 \end{bmatrix}.$$`}</p>
              <p>{String.raw`Check: $A A^{-1} = \begin{bmatrix}2&1\\3&2\end{bmatrix}\begin{bmatrix}2&-1\\-3&2\end{bmatrix} = \begin{bmatrix}1&0\\0&1\end{bmatrix} = I.$ ✓`}</p>
            </Example>

            <p>Try it yourself — edit any entry and watch the determinant and inverse update live. Push the determinant to zero and the inverse disappears:</p>

            <InverseExplorer/>

            <Callout icon="❓" title="But what about bigger matrices?" color="amber">
              The {String.raw`$2\times2$`} formula is lovely, but there is no equally simple formula for {String.raw`$3\times3$`}, {String.raw`$4\times4$`}, or larger matrices that is practical to use by hand. For those we need a <b>method</b>, not a formula. That method is the heart of this lecture — and it rests on a beautiful idea called the <b>elementary matrix</b>.
            </Callout>

            {/* ─── §5 ELEMENTARY MATRICES ─── */}
            <Sec id="elem" n="§5">Elementary Matrices — the Secret Ingredient</Sec>

            <p>Here is a fact that looks small but changes everything. Every row operation you perform on a matrix can be achieved by <b>multiplying on the left</b> by a special matrix.</p>

            <DefBox term="Elementary matrix" color="violet">
              <p style={{margin:0}}>{String.raw`An `}<b>elementary matrix</b>{String.raw` $E$ is what you get by applying a `}<i>single</i>{String.raw` row operation to the identity matrix $I$. Multiplying any matrix $A$ on the left by $E$ performs that same row operation on $A$.`}</p>
            </DefBox>

            <p>Let us see it happen. Take {String.raw`$A = \begin{bmatrix}1 & 2\\-1 & 0\end{bmatrix}$`} and the row operation {String.raw`$R_2 \to R_2 + R_1$`}.</p>

            <div className="sbs">
              <div className="sbs-card">
                <div className="sbs-label">Step 1 — build E from I</div>
                <p style={{margin:0,fontSize:'.92rem',lineHeight:1.7}}>{String.raw`Apply $R_2 \to R_2 + R_1$ to $I = \begin{bmatrix}1&0\\0&1\end{bmatrix}$. Row 2 becomes $(0{+}1,\,1{+}0) = (1,1)$:`}</p>
                <p style={{textAlign:'center',margin:'8px 0 0'}}>{String.raw`$$E = \begin{bmatrix}1&0\\1&1\end{bmatrix}.$$`}</p>
              </div>
              <div className="sbs-card">
                <div className="sbs-label">Step 2 — multiply E·A</div>
                <p style={{margin:0,fontSize:'.92rem',lineHeight:1.7}}>{String.raw`Now left-multiply $A$ by $E$:`}</p>
                <p style={{textAlign:'center',margin:'8px 0 0'}}>{String.raw`$$EA = \begin{bmatrix}1&0\\1&1\end{bmatrix}\begin{bmatrix}1&2\\-1&0\end{bmatrix} = \begin{bmatrix}1&2\\0&2\end{bmatrix}.$$`}</p>
              </div>
            </div>

            <p>The result {String.raw`$\begin{bmatrix}1&2\\0&2\end{bmatrix}$`} is exactly what you would get by doing {String.raw`$R_2 \to R_2 + R_1$`} directly to {String.raw`$A$`}. The row operation and the matrix multiplication are the same thing.</p>

            <ThmBox title="The key chain of ideas">
              <p style={{margin:'0 0 8px'}}>{String.raw`Row-reducing $A$ all the way to its reduced echelon form is a `}<i>sequence</i>{String.raw` of row operations. Each one is a left-multiply by an elementary matrix:`}</p>
              <p style={{textAlign:'center',margin:'8px 0'}}>{String.raw`$$E_k \cdots E_3 E_2 E_1 A = \text{(reduced echelon form of } A).$$`}</p>
              <p style={{margin:'8px 0 0'}}>{String.raw`If $A$ is invertible, its reduced echelon form is the identity $I$. So $E_k \cdots E_2 E_1 A = I$. But that says the product $E_k \cdots E_2 E_1$ `}<b>is</b>{String.raw` $A^{-1}$! The very operations that reduce $A$ to $I$, applied to $I$, build $A^{-1}$.`}</p>
            </ThmBox>

            <Callout icon="💡" title="The punchline" color="teal">
              {String.raw`$A^{-1} = E_k \cdots E_2 E_1$. We never have to write down the elementary matrices separately. Instead we apply the row operations to $I$ at the same time we apply them to $A$ — and when $A$ has become $I$, the copy of $I$ has become $A^{-1}$. That is the whole algorithm.`}
            </Callout>

            {/* ─── §6 THE ALGORITHM ─── */}
            <Sec id="algorithm" n="§6">The Gauss–Jordan Inversion Algorithm</Sec>

            <DefBox term="The [A | I] → [I | A⁻¹] method" color="amber">
              <p style={{margin:0}}>{String.raw`To find $A^{-1}$: write the `}<b>augmented matrix</b>{String.raw` $[\,A \mid I\,]$ — the matrix $A$ next to an identity of the same size. Row-reduce until the left block becomes $I$. The right block is then $A^{-1}$:`}</p>
              <p style={{textAlign:'center',margin:'10px 0 0'}}>{String.raw`$$[\,A \mid I\,] \xrightarrow{\text{row operations}} [\,I \mid A^{-1}\,].$$`}</p>
            </DefBox>

            <div style={{ display:'flex', flexDirection:'column', gap:'2px', margin:'20px 0' }}>
              {[
                ['1','Set up','Write $A$ and $I$ side by side as $[A \\mid I]$.'],
                ['2','Reduce','Apply row operations to the entire augmented matrix, aiming to turn the left block into $I$.'],
                ['3','Read off','When the left block is $I$, the right block is $A^{-1}$.'],
                ['4','Singular check','If a full row of zeros appears in the left block, $A$ cannot reach $I$ — it is singular, and no inverse exists.'],
              ].map(([num,h,d])=>(
                <div key={num} style={{ display:'flex', gap:'14px', alignItems:'flex-start', padding:'12px 16px', background:'rgba(255,253,240,.97)', border:'1px solid var(--lec-border)', borderRadius:'10px' }}>
                  <span style={{ fontFamily:'var(--fm)', fontWeight:700, color:'#c8860a', flexShrink:0, width:'22px' }}>{num}</span>
                  <div>
                    <b style={{fontFamily:'var(--fm)',fontSize:'.78rem',letterSpacing:'.06em',textTransform:'uppercase',color:'var(--lec-ink)'}}>{h}</b>
                    <p style={{margin:'2px 0 0',fontSize:'.94rem'}}>{d}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* ─── §7 WORKED EXAMPLE ─── */}
            <Sec id="worked" n="§7">The Full 3×3 Worked Example — Step by Step</Sec>

            <p>Let us invert the matrix from the notes:</p>
            <p style={{textAlign:'center'}}>{String.raw`$$A = \begin{bmatrix} 1 & 0 & -1 \\ 3 & 2 & 0 \\ -1 & -1 & 0 \end{bmatrix}.$$`}</p>

            <p>We attach the identity and reduce. Each line below shows the augmented matrix <i>after</i> the stated operation. The vertical bar separates {String.raw`$A$`}'s side (left) from {String.raw`$I$`}'s side (right).</p>

            <div style={{ background:'rgba(255,253,240,.97)', border:'1px solid var(--lec-border)', borderRadius:'14px', padding:'22px 24px', margin:'22px 0', boxShadow:'0 2px 18px rgba(60,40,20,.06)' }}>

              <div style={{fontFamily:'var(--fm)',fontSize:'.72rem',color:'#c8860a',marginBottom:'4px'}}>Start &nbsp;[ A | I ]</div>
              <p style={{textAlign:'center',margin:'0 0 18px'}}>{String.raw`$$\left[\begin{array}{ccc|ccc} 1 & 0 & -1 & 1 & 0 & 0 \\ 3 & 2 & 0 & 0 & 1 & 0 \\ -1 & -1 & 0 & 0 & 0 & 1 \end{array}\right]$$`}</p>

              <div style={{fontFamily:'var(--fm)',fontSize:'.72rem',color:'#c8860a',marginBottom:'4px'}}>{String.raw`$R_2 \to R_2 - 3R_1$ &nbsp;(clear below the first pivot)`}</div>
              <p style={{textAlign:'center',margin:'0 0 18px'}}>{String.raw`$$\left[\begin{array}{ccc|ccc} 1 & 0 & -1 & 1 & 0 & 0 \\ 0 & 2 & 3 & -3 & 1 & 0 \\ -1 & -1 & 0 & 0 & 0 & 1 \end{array}\right]$$`}</p>

              <div style={{fontFamily:'var(--fm)',fontSize:'.72rem',color:'#c8860a',marginBottom:'4px'}}>{String.raw`$R_3 \to R_3 + R_1$`}</div>
              <p style={{textAlign:'center',margin:'0 0 18px'}}>{String.raw`$$\left[\begin{array}{ccc|ccc} 1 & 0 & -1 & 1 & 0 & 0 \\ 0 & 2 & 3 & -3 & 1 & 0 \\ 0 & -1 & -1 & 1 & 0 & 1 \end{array}\right]$$`}</p>

              <div style={{fontFamily:'var(--fm)',fontSize:'.72rem',color:'#c8860a',marginBottom:'4px'}}>{String.raw`$R_2 \leftrightarrow R_3$ &nbsp;(swap to get a simpler pivot, avoid fractions)`}</div>
              <p style={{textAlign:'center',margin:'0 0 18px'}}>{String.raw`$$\left[\begin{array}{ccc|ccc} 1 & 0 & -1 & 1 & 0 & 0 \\ 0 & -1 & -1 & 1 & 0 & 1 \\ 0 & 2 & 3 & -3 & 1 & 0 \end{array}\right]$$`}</p>

              <div style={{fontFamily:'var(--fm)',fontSize:'.72rem',color:'#c8860a',marginBottom:'4px'}}>{String.raw`$R_2 \to -R_2$ &nbsp;(make the pivot $+1$)`}</div>
              <p style={{textAlign:'center',margin:'0 0 18px'}}>{String.raw`$$\left[\begin{array}{ccc|ccc} 1 & 0 & -1 & 1 & 0 & 0 \\ 0 & 1 & 1 & -1 & 0 & -1 \\ 0 & 2 & 3 & -3 & 1 & 0 \end{array}\right]$$`}</p>

              <div style={{fontFamily:'var(--fm)',fontSize:'.72rem',color:'#c8860a',marginBottom:'4px'}}>{String.raw`$R_3 \to R_3 - 2R_2$`}</div>
              <p style={{textAlign:'center',margin:'0 0 18px'}}>{String.raw`$$\left[\begin{array}{ccc|ccc} 1 & 0 & -1 & 1 & 0 & 0 \\ 0 & 1 & 1 & -1 & 0 & -1 \\ 0 & 0 & 1 & -1 & 1 & 2 \end{array}\right]$$`}</p>

              <div style={{fontFamily:'var(--fm)',fontSize:'.72rem',color:'#2a9d8f',marginBottom:'4px'}}>{String.raw`Left block is now upper-triangular with $1$s on the diagonal. Back-substitute upward:`}</div>

              <div style={{fontFamily:'var(--fm)',fontSize:'.72rem',color:'#c8860a',marginBottom:'4px',marginTop:'12px'}}>{String.raw`$R_1 \to R_1 + R_3$ &nbsp;(clear column 3 above)`}</div>
              <p style={{textAlign:'center',margin:'0 0 18px'}}>{String.raw`$$\left[\begin{array}{ccc|ccc} 1 & 0 & 0 & 0 & 1 & 2 \\ 0 & 1 & 1 & -1 & 0 & -1 \\ 0 & 0 & 1 & -1 & 1 & 2 \end{array}\right]$$`}</p>

              <div style={{fontFamily:'var(--fm)',fontSize:'.72rem',color:'#c8860a',marginBottom:'4px'}}>{String.raw`$R_2 \to R_2 - R_3$`}</div>
              <p style={{textAlign:'center',margin:'0 0 8px'}}>{String.raw`$$\left[\begin{array}{ccc|ccc} 1 & 0 & 0 & 0 & 1 & 2 \\ 0 & 1 & 0 & 0 & -1 & -3 \\ 0 & 0 & 1 & -1 & 1 & 2 \end{array}\right]$$`}</p>

              <div style={{fontFamily:'var(--fm)',fontSize:'.72rem',color:'#2a9d8f',marginTop:'12px',marginBottom:0}}>{String.raw`Left block is $I$. Done — the right block is $A^{-1}$.`}</div>
            </div>

            <DefBox term="The answer" color="teal">
              <p style={{textAlign:'center',margin:0}}>{String.raw`$$A^{-1} = \begin{bmatrix} 0 & 1 & 2 \\ 0 & -1 & -3 \\ -1 & 1 & 2 \end{bmatrix}.$$`}</p>
            </DefBox>

            <Example n="2" title="Always verify — multiply back to I">
              <p>{String.raw`A 30-second check catches almost every arithmetic slip. Compute $A A^{-1}$:`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$\begin{bmatrix} 1 & 0 & -1 \\ 3 & 2 & 0 \\ -1 & -1 & 0 \end{bmatrix} \begin{bmatrix} 0 & 1 & 2 \\ 0 & -1 & -3 \\ -1 & 1 & 2 \end{bmatrix} = \begin{bmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{bmatrix} = I.$$`} ✓</p>
              <p>{String.raw`For instance the $(1,1)$ entry is $(1)(0) + (0)(0) + (-1)(-1) = 1$, and the $(1,2)$ entry is $(1)(1) + (0)(-1) + (-1)(1) = 0$. Every entry lands exactly where the identity needs it.`}</p>
            </Example>

            <RedBox title="If the left block can't become I">
              <p style={{margin:0}}>{String.raw`If at any stage a row of the left block becomes all zeros, $A$ does not have full rank. It is `}<b>singular</b>{String.raw`, the reduction cannot reach $I$, and $A^{-1}$ does not exist. Stop — there is no inverse to find.`}</p>
            </RedBox>

            {/* MULTIPLICATION NOTE + BUTTON */}
            <Sec id="exercises" n="§8">A Note on Matrix Multiplication</Sec>

            <Callout icon="✋" title="Multiplication was not covered in this class" color="rose">
              We used matrix multiplication above (in {String.raw`$EA$`}, in checking {String.raw`$AA^{-1}=I$`}) but we did <b>not</b> formally teach the mechanics of it in lecture. If the products above felt unfamiliar, that is expected. To learn how to multiply matrices properly — row-by-column, the size rule, and why it works — please come to the <b>tutorial sessions</b> or visit a <b>TA during office hours</b>. A dedicated note is on the way.
            </Callout>

            <div style={{ display:'flex', justifyContent:'center', margin:'24px 0' }}>
              {true ? (
                <Link href="/courses/linalg/notes/matrix-multiplication" style={{
                  fontFamily:'var(--fm)', fontSize:'.82rem', letterSpacing:'.04em', fontWeight:600,
                  color:'#1a1a2e', background:'var(--amber)', border:'none',
                  borderRadius:'10px', padding:'14px 26px', textDecoration:'none',
                  display:'inline-flex', alignItems:'center', gap:'10px',
                }}>📘 Notes on Matrix Multiplication →</Link>
              ) : (
                <span style={{
                  fontFamily:'var(--fm)', fontSize:'.82rem', letterSpacing:'.04em', fontWeight:600,
                  color:'var(--lec-ink3)', background:'rgba(0,0,0,.05)',
                  border:'1px dashed var(--lec-border)', borderRadius:'10px',
                  padding:'14px 26px', display:'inline-flex', alignItems:'center', gap:'10px', cursor:'not-allowed',
                }}>📘 Notes on Matrix Multiplication · coming soon</span>
              )}
            </div>

            <Callout icon="⚠️" title="One fact you must carry forward" color="amber">
              {String.raw`Matrix multiplication is `}<b>not commutative</b>{String.raw`: in general $AB \neq BA$. Because of this, you `}<b>cannot</b>{String.raw` "cancel" or "factor out" a matrix the way you do with numbers. From $AB = BC$ you `}<i>cannot</i>{String.raw` conclude $A = C$ — $B$ does not simply cancel. Keep left-multiplies and right-multiplies strictly separate.`}
            </Callout>

            <Callout icon="🧩" title="Why you can't square a non-square matrix" color="violet">
              {String.raw`A quick conjecture worth understanding: if $A$ is $m\times n$ with $m \neq n$, then $A^2 = A\cdot A$ is `}<b>impossible</b>{String.raw`. Multiplication $A\cdot A$ needs the columns of the first to match the rows of the second — that needs $n = m$. So you can never square a non-square matrix. But $A\cdot A^{\mathsf{T}}$ (size $m\times m$) and $A^{\mathsf{T}}\cdot A$ (size $n\times n$) `}<b>always</b>{String.raw` work — the transpose fixes the sizes so the product is defined. This is one reason the transpose is so useful.`}
            </Callout>

            {/* EXERCISE 2.1.7 */}
            <Example n="2.1.7" title="Solving a matrix equation with parameters" advanced>
              <p>{String.raw`Solve $3X - 2Y = \begin{bmatrix} 3 & -1 \end{bmatrix}$ where $X = \begin{bmatrix} x_1 & x_2 \end{bmatrix}$ and $Y = \begin{bmatrix} y_1 & y_2 \end{bmatrix}$ are $1\times2$ row matrices.`}</p>
              <Reveal label="Show full solution">
                <p style={{margin:'0 0 8px'}}>{String.raw`Writing the equation entry by entry gives two scalar equations:`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$3x_1 - 2y_1 = 3, \qquad 3x_2 - 2y_2 = -1.$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`Two equations, four unknowns — so two free parameters. Let $y_1 = s$ and $y_2 = t$. Solving for $x_1, x_2$:`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$x_1 = \frac{3 + 2s}{3}, \qquad x_2 = \frac{-1 + 2t}{3}.$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`Therefore`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$X = \begin{bmatrix} \dfrac{3 + 2s}{3} & \dfrac{-1 + 2t}{3} \end{bmatrix}, \qquad Y = \begin{bmatrix} s & t \end{bmatrix}, \qquad s, t \in \mathbb{R}.$$`}</p>
                <p style={{margin:0}}>{String.raw`Check: $3x_1 - 2s = (3 + 2s) - 2s = 3$ ✓ and $3x_2 - 2t = (-1 + 2t) - 2t = -1$ ✓.`}</p>
              </Reveal>
            </Example>

            <Example n="3" title="Find the inverse, or show none exists" advanced>
              <p>{String.raw`Decide whether $B = \begin{bmatrix} 1 & 2 \\ 2 & 4 \end{bmatrix}$ is invertible. If so, find $B^{-1}$.`}</p>
              <Reveal label="Show solution">
                <p style={{margin:'0 0 8px'}}>{String.raw`Determinant: $ad - bc = (1)(4) - (2)(2) = 4 - 4 = 0$.`}</p>
                <p style={{margin:0}}>{String.raw`The determinant is zero, so $B$ is `}<b>singular</b>{String.raw` and `}<b>has no inverse</b>{String.raw`. (Notice row 2 is exactly twice row 1 — the rows are dependent, so the rank is $1 < 2$, not full rank.)`}</p>
              </Reveal>
            </Example>

            {/* CLOSING */}
            <div style={{ marginTop:'48px', padding:'28px 32px', background:'rgba(56,201,176,.08)', border:'2px solid rgba(56,201,176,.35)', borderRadius:'16px' }}>
              <div style={{ fontFamily:'var(--fm)', fontSize:'.7rem', letterSpacing:'.16em', textTransform:'uppercase', color:'#2a9d8f', marginBottom:'12px' }}>Looking ahead</div>
              <p style={{ fontFamily:'var(--fh)', fontSize:'1.4rem', color:'var(--lec-ink)', margin:'0 0 16px', fontWeight:400, lineHeight:1.3 }}>
                We can now undo a matrix. Next: using the inverse to solve systems instantly, and the properties that make inverses behave.
              </p>
              <p style={{ color:'var(--lec-ink2)', fontSize:'.97rem', lineHeight:1.8, margin:0 }}>
                With {String.raw`$A^{-1}$`} in hand, the system {String.raw`$A\mathbf{x} = \mathbf{b}$`} solves as {String.raw`$\mathbf{x} = A^{-1}\mathbf{b}$`} — no row reduction needed once you have the inverse. We will also meet the rules {String.raw`$(AB)^{-1} = B^{-1}A^{-1}$`} and {String.raw`$(A^{-1})^{-1} = A$`}, and see how inverses connect to determinants. First, though, make sure you are comfortable multiplying matrices — bring questions to the tutorial.
              </p>
            </div>

            <div style={{ marginTop:'64px', paddingTop:'28px', borderTop:'2px solid var(--lec-border)', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'12px' }}>
              <div style={{ fontFamily:'var(--fm)', fontSize:'.76rem', color:'var(--lec-ink3)', fontStyle:'italic' }}>Lecture 6 — complete</div>
              <div style={{ fontFamily:'var(--fm)', fontSize:'.76rem', color:'var(--lec-ink3)' }}>MATH-120 · Shoaib Khan · LUMS · June 2026</div>
            </div>
          </div>

          {/* FOOTER NAV */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'22px 48px', borderTop:'1px solid var(--lec-border)', background:'var(--lec-paper)', flexWrap:'wrap', gap:'12px' }}>
            <Link href={PREV_HREF} style={{ fontFamily:'var(--fm)', fontSize:'.74rem', letterSpacing:'.08em', textTransform:'uppercase', color:'var(--lec-accent)', textDecoration:'none' }}>← Lecture 5</Link>
            <Link href={NEXT_HREF} style={{ fontFamily:'var(--fm)', fontSize:'.74rem', letterSpacing:'.08em', textTransform:'uppercase', color:'var(--lec-accent)', textDecoration:'none' }}>Lecture 7 →</Link>
          </div>
        </main>
      </div>

      <Footer/>
    </>
  );
}