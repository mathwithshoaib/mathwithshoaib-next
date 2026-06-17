'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import Navbar from '../../../../components/Navbar';
import Footer from '../../../../components/Footer';

/* ════════════════════════════════════════════════════════════
   MATH-120 · LECTURE 4
   Solution Structure, Basic Solutions & Applications
   Route: /courses/linalg/w1/lec4
   ════════════════════════════════════════════════════════════ */

const LECTURES = [
  { week: 1, n: 1, slug: 'w1/lec1', title: 'The Language of Matrices', live: true },
  { week: 1, n: 2, slug: 'w1/lec2', title: 'Row Operations & Gaussian Elimination', live: true },
  { week: 1, n: 3, slug: 'w1/lec3', title: 'RREF, Homogeneous Systems & Linear Combinations', live: true },
  { week: 1, n: 4, slug: 'w1/lec4', title: 'Solution Structure & Applications', live: true },
  { week: 2, n: 5, slug: 'w2/lec5', title: 'Matrix Algebra: Addition, Scalar Multiplication & Transpose', live: true },
  { week: 2, n: 6, slug: 'w2/lec6', title: 'The Inverse of a Matrix', live: true },
];
const THIS_SLUG = 'w1/lec4';
const PREV_HREF  = '/courses/linalg/w1/lec3';
const NEXT_HREF  = '/courses/linalg/w2/lec5';

const LEC = {
  course: 'MATH-120 · Linear Algebra',
  number: 'Lecture 4',
  title: 'Solution Structure & Real-World Applications',
  subtitle: 'Basic solutions, the particular-plus-homogeneous picture, and how linear systems run traffic grids and chemistry',
  date: '11 June 2026',
};

const ANCHORS = [
  ['Recall', 'recall'],
  ['Basic Solutions', 'basic'],
  ['Notation', 'notation'],
  ['Solution Structure', 'structure'],
  ['Network Flow', 'network'],
  ['Braess Paradox', 'braess'],
  ['Chemical Balancing', 'chem'],
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

/* ═══════════════ INTERACTIVE NETWORK FLOW WIDGET ═══════════════ */
/* The network from the notes: A,B,C,D junctions, flows f1..f6.
   General solution: f1=400-f4-f6, f2=f4+f5, f3=100-f5+f6, with f4,f5,f6 free.
   User drags three sliders (f4,f5,f6) and sees all six flows + validity. */
function NetworkFlowApplet() {
  const [f4, setF4] = useState(100);
  const [f5, setF5] = useState(50);
  const [f6, setF6] = useState(80);

  const f1 = 400 - f4 - f6;
  const f2 = f4 + f5;
  const f3 = 100 - f5 + f6;

  const flows = [f1, f2, f3, f4, f5, f6];
  const allNonNeg = flows.every(f => f >= 0);

  const FlowBadge = ({ label, val, free }) => (
    <div style={{
      display:'flex', flexDirection:'column', alignItems:'center', gap:'2px',
      padding:'8px 12px', borderRadius:'8px', minWidth:'56px',
      background: free ? 'rgba(232,160,32,.15)' : (val<0?'rgba(224,107,107,.2)':'rgba(56,201,176,.12)'),
      border: `1px solid ${free?'#e8a020':(val<0?'#e06b6b':'#38c9b0')}`,
    }}>
      <span style={{fontFamily:'monospace',fontSize:'.72rem',color:free?'#e8a020':'#8a8ac0'}}>{label}{free?' (free)':''}</span>
      <span style={{fontFamily:'monospace',fontSize:'1.05rem',fontWeight:700,color:val<0?'#e06b6b':'#e8e8f0'}}>{val}</span>
    </div>
  );

  const Slider = ({label,val,set,max}) => (
    <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'8px'}}>
      <span style={{fontFamily:'monospace',width:'24px',color:'#e8a020',fontSize:'.9rem'}}>{label}</span>
      <input type="range" min={0} max={max} step={10} value={val} onChange={e=>set(+e.target.value)} style={{flex:1,accentColor:'#e8a020'}}/>
      <span style={{fontFamily:'monospace',width:'34px',textAlign:'right',color:'#e8e8f0'}}>{val}</span>
    </div>
  );

  return (
    <Widget title="Interactive · Network flow — drag the free variables, watch the whole grid respond">
      <div style={{display:'flex',flexWrap:'wrap',gap:'10px',justifyContent:'center',marginBottom:'18px'}}>
        <FlowBadge label="f₁" val={f1}/>
        <FlowBadge label="f₂" val={f2}/>
        <FlowBadge label="f₃" val={f3}/>
        <FlowBadge label="f₄" val={f4} free/>
        <FlowBadge label="f₅" val={f5} free/>
        <FlowBadge label="f₆" val={f6} free/>
      </div>

      <div style={{maxWidth:'420px',margin:'0 auto 16px'}}>
        <Slider label="f₄" val={f4} set={setF4} max={400}/>
        <Slider label="f₅" val={f5} set={setF5} max={400}/>
        <Slider label="f₆" val={f6} set={setF6} max={400}/>
      </div>

      <div style={{
        textAlign:'center', padding:'12px 18px', borderRadius:'10px',
        background: allNonNeg ? 'rgba(56,201,176,.12)' : 'rgba(224,107,107,.14)',
        border: `1px solid ${allNonNeg?'#38c9b0':'#e06b6b'}`,
        fontFamily:'var(--fm)', fontSize:'.85rem', color: allNonNeg?'#38c9b0':'#e06b6b',
      }}>
        {allNonNeg
          ? '✓ All flows ≥ 0 — this is a physically valid traffic pattern.'
          : '✗ A flow went negative — impossible for one-way streets. Adjust the sliders.'}
      </div>
      <p style={{fontSize:'.78rem',color:'#7a7ab0',marginTop:'12px',marginBottom:0,textAlign:'center',lineHeight:1.6}}>
        Three free variables means three "knobs." Every valid setting is one real traffic pattern the grid can carry. The infinitely many solutions are not an abstraction — they are every way cars could actually distribute across these roads.
      </p>
    </Widget>
  );
}

/* ═══════════════ PARTICULAR + HOMOGENEOUS VISUAL ═══════════════ */
function AffineLineSVG() {
  return (
    <svg viewBox="0 0 360 300" style={{width:'100%',maxWidth:'420px',margin:'0 auto',display:'block'}}>
      <defs>
        <marker id="arrL4" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#9b80e8"/>
        </marker>
      </defs>
      {/* axes */}
      <line x1="30" y1="270" x2="340" y2="270" stroke="#bbb" strokeWidth="1"/>
      <line x1="60" y1="20" x2="60" y2="290" stroke="#bbb" strokeWidth="1"/>
      <text x="345" y="274" fontSize="11" fill="#999" fontFamily="monospace">x</text>
      <text x="50" y="18" fontSize="11" fill="#999" fontFamily="monospace">y</text>
      {/* homogeneous line x - y = 0 (through origin) */}
      <line x1="30" y1="290" x2="300" y2="20" stroke="#38c9b0" strokeWidth="2.5" strokeDasharray="6 4"/>
      <text x="250" y="60" fontSize="12" fill="#2a9d8f" fontFamily="monospace">x − y = 0</text>
      {/* particular line x - y = 2 (shifted) */}
      <line x1="90" y1="290" x2="340" y2="65" stroke="#c8860a" strokeWidth="2.5"/>
      <text x="300" y="120" fontSize="12" fill="#c8860a" fontFamily="monospace">x − y = 2</text>
      {/* origin dot */}
      <circle cx="60" cy="270" r="4" fill="#38c9b0"/>
      <text x="40" y="285" fontSize="10" fill="#2a9d8f" fontFamily="monospace">(0,0)</text>
      {/* particular point (2,0) */}
      <circle cx="118" cy="270" r="4" fill="#c8860a"/>
      <text x="105" y="288" fontSize="10" fill="#c8860a" fontFamily="monospace">(2,0)</text>
      {/* shift arrow */}
      <line x1="60" y1="270" x2="115" y2="270" stroke="#9b80e8" strokeWidth="2" markerEnd="url(#arrL4)"/>
      <text x="70" y="262" fontSize="10" fill="#9b80e8" fontFamily="monospace">xₚ shift</text>
    </svg>
  );
}

/* ═══════════════ PAGE ═══════════════ */
export default function Lec4() {
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
        <span style={{color:'var(--text2)'}}>Week 1 · Lecture 4</span>
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
            <Link href={PREV_HREF} style={{ display:'flex', alignItems:'center', padding:'0 16px', height:'100%', fontFamily:'var(--fm)', fontSize:'.72rem', color:'var(--lec-ink3)', borderRight:'1px solid var(--lec-border)', whiteSpace:'nowrap', flexShrink:0, textDecoration:'none' }}>← Lecture 3</Link>
            <div style={{ flex:1, display:'flex', justifyContent:'center', alignItems:'center', gap:'4px', overflowX:'auto', padding:'0 8px' }}>
              <span style={{ fontFamily:'var(--fm)', fontSize:'.6rem', letterSpacing:'.12em', textTransform:'uppercase', color:'var(--lec-accent)', flexShrink:0, marginRight:'6px' }}>On this page</span>
              {ANCHORS.map(([label,id],i)=>(
                <span key={id} style={{display:'inline-flex',alignItems:'center',flexShrink:0}}>
                  {i>0&&<span style={{color:'var(--lec-border)',margin:'0 7px'}}>·</span>}
                  <a href={`#${id}`} onClick={e=>jump(e,id)} style={{fontFamily:'var(--fm)',fontSize:'.73rem',color:'var(--lec-ink2)',textDecoration:'none',whiteSpace:'nowrap'}}>{label}</a>
                </span>
              ))}
            </div>
            <Link href={NEXT_HREF} style={{ display:'flex', alignItems:'center', padding:'0 16px', height:'100%', fontFamily:'var(--fm)', fontSize:'.72rem', color:'var(--lec-ink3)', borderLeft:'1px solid var(--lec-border)', whiteSpace:'nowrap', flexShrink:0, textDecoration:'none' }}>Lecture 5 →</Link>
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

            {/* ─── §1 RECALL + CLOSING-QUESTION ANSWER ─── */}
            <Sec id="recall" n="§1">Picking Up Where We Left Off</Sec>
            <p>Last lecture ended with a question hanging in the air: if {String.raw`$\mathbf{x}_0$`} solves {String.raw`$AX = b$`} and {String.raw`$\mathbf{x}_h$`} solves the homogeneous system {String.raw`$AX = 0$`}, what is {String.raw`$A(\mathbf{x}_0 + \mathbf{x}_h)$`}? Let us answer it immediately, because the answer is the spine of this entire lecture.</p>

            <Callout icon="🔑" title="The answer to last lecture's question" color="teal">
              {String.raw`$A(\mathbf{x}_0 + \mathbf{x}_h) = A\mathbf{x}_0 + A\mathbf{x}_h = b + 0 = b$. So $\mathbf{x}_0 + \mathbf{x}_h$ is `}<b>also a solution</b>{String.raw` of $AX = b$! Add any homogeneous solution to one particular solution, and you land on another solution of the full system. This is the single most important structural fact about linear systems.`}
            </Callout>

            <p>We will make this precise in §4. But first we need to understand the homogeneous solutions {String.raw`$\mathbf{x}_h$`} themselves — their internal structure — because they turn out to have a beautiful skeleton built from a small number of fixed vectors.</p>

            {/* ─── §2 BASIC SOLUTIONS ─── */}
            <Sec id="basic" n="§2">Basic Solutions of a Homogeneous System</Sec>

            <p>When we solved {String.raw`$AX = 0$`} last lecture and found infinitely many solutions, we wrote the answer with parameters. Watch what happens when we split that answer apart by parameter.</p>

            <Example n="1" title="Splitting a solution by its parameters">
              <p>{String.raw`Suppose solving a homogeneous system $AX = 0$ gives the general solution`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$X = \begin{pmatrix} 2s + \tfrac{1}{5}t \\ s \\ \tfrac{3}{5}t \\ t \end{pmatrix}.$$`}</p>
              <p>{String.raw`There are two free parameters, $s$ and $t$. Split the vector into the part multiplied by $s$ and the part multiplied by $t$:`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$X = s\underbrace{\begin{pmatrix} 2 \\ 1 \\ 0 \\ 0 \end{pmatrix}}_{\mathbf{v}_1} + t\underbrace{\begin{pmatrix} \tfrac{1}{5} \\ 0 \\ \tfrac{3}{5} \\ 1 \end{pmatrix}}_{\mathbf{v}_2}.$$`}</p>
              <p>{String.raw`Every solution of $AX = 0$ is a linear combination of just two fixed vectors, $\mathbf{v}_1$ and $\mathbf{v}_2$. Set $s=1, t=0$ to read off $\mathbf{v}_1$; set $s=0, t=1$ to read off $\mathbf{v}_2$.`}</p>
            </Example>

            <DefBox term="Basic solutions" color="violet">
              <p style={{margin:0}}>{String.raw`The vectors obtained by setting one parameter to $1$ and the rest to $0$ are called the `}<b>basic solutions</b>{String.raw` of the homogeneous system $AX = 0$. Every solution is a linear combination of the basic solutions. The number of basic solutions equals the number of free variables, which is $n - \operatorname{rank}(A)$.`}</p>
            </DefBox>

            <Callout icon="🧬" title="Why this is profound" color="violet">
              The entire infinite solution set of {String.raw`$AX = 0$`} — which could be a line, a plane, or a higher-dimensional flat — is completely captured by a handful of vectors. Two basic solutions describe an infinite plane of solutions. This compression is the seed of the idea of a <b>basis</b>, one of the deepest concepts in all of linear algebra, which we will study formally in Chapter 5.
            </Callout>

            <DefBox term="The solution of AX = 0 is a linear combination" color="teal">
              <p style={{margin:0}}>{String.raw`In words: the complete solution set of a homogeneous system is the `}<b>span</b>{String.raw` of its basic solutions. If $\mathbf{v}_1, \dots, \mathbf{v}_k$ are the basic solutions, then every solution has the form $\mathbf{x}_h = t_1 \mathbf{v}_1 + \cdots + t_k \mathbf{v}_k$ for scalars $t_1, \dots, t_k$.`}</p>
            </DefBox>

            {/* ─── §3 NOTATION ─── */}
            <Sec id="notation" n="§3">Notation — Vectors From Here On</Sec>

            <p>We are about to use vectors constantly, so let us fix notation once and for all.</p>

            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:'14px',margin:'20px 0'}}>
              {[
                {c:'#38c9b0', sp:'ℝ²', tup:'(x, y)', col:'\\begin{pmatrix}x\\\\y\\end{pmatrix}'},
                {c:'#e8a020', sp:'ℝ³', tup:'(x, y, z)', col:'\\begin{pmatrix}x\\\\y\\\\z\\end{pmatrix}'},
                {c:'#9b80e8', sp:'ℝ⁴', tup:'(x₁,x₂,x₃,x₄)', col:'\\begin{pmatrix}x_1\\\\x_2\\\\x_3\\\\x_4\\end{pmatrix}'},
              ].map(r=>(
                <div key={r.sp} style={{background:'rgba(255,255,255,.97)',border:`1px solid ${r.c}40`,borderTop:`3px solid ${r.c}`,borderRadius:'12px',padding:'16px 18px',textAlign:'center'}}>
                  <div style={{fontFamily:'var(--fh)',fontSize:'1.3rem',color:r.c,fontWeight:600,marginBottom:'6px'}}>{r.sp}</div>
                  <div style={{fontFamily:'monospace',fontSize:'.8rem',color:'var(--lec-ink3)',marginBottom:'8px'}}>{r.tup}</div>
                  <div>{String.raw`$${r.col}$$`}</div>
                </div>
              ))}
            </div>

            <DefBox term="Position vectors" color="amber">
              <p style={{margin:0}}>{String.raw`A point $(x, y)$ in the plane and the column vector $\begin{pmatrix}x\\y\end{pmatrix}$ are two notations for the `}<b>same object</b>{String.raw`. We call it a `}<b>position vector</b>{String.raw`: an arrow from the origin to the point. From here on we write vectors in `}<b>column form</b>{String.raw`, because the column is what multiplies cleanly against a matrix. The tuple form $(x,y)$ and the column form are interchangeable — use whichever reads better, but compute with columns.`}</p>
            </DefBox>

            {/* ─── §4 SOLUTION STRUCTURE ─── */}
            <Sec id="structure" n="§4">The Structure of a General Solution</Sec>

            <p>Now we assemble the big picture. We saw the homogeneous solution set is a span of basic solutions. We saw adding a homogeneous solution to a particular one gives another full solution. Combine these and a clean theorem appears.</p>

            <DefBox term="Solution structure theorem" color="violet">
              <p style={{margin:0}}>{String.raw`If $\mathbf{x}_0$ is any one particular solution of $AX = b$, then `}<b>every</b>{String.raw` solution has the form`}</p>
              <p style={{textAlign:'center',margin:'10px 0 0'}}>{String.raw`$$\mathbf{x} = \underbrace{\mathbf{x}_0}_{\text{particular}} + \underbrace{\mathbf{x}_h}_{\text{homogeneous}},$$`}</p>
              <p style={{margin:'10px 0 0'}}>{String.raw`where $\mathbf{x}_h$ ranges over all solutions of the corresponding homogeneous system $AX = 0$. The full solution set is a `}<b>translated copy</b>{String.raw` of the homogeneous solution set, shifted by $\mathbf{x}_0$.`}</p>
            </DefBox>

            <Example n="2" title="The picture in 2D — x − y = 2">
              <p>{String.raw`Consider the single equation $x - y = 2$. Its corresponding homogeneous equation is $x - y = 0$.`}</p>
              <AffineLineSVG/>
              <p>{String.raw`The dashed teal line $x - y = 0$ passes through the origin — it is the homogeneous solution set. Parametrise it: let $x = t$, then $y = t$, so $\mathbf{x}_h = t\begin{pmatrix}1\\1\end{pmatrix}$.`}</p>
              <p>{String.raw`The solid amber line $x - y = 2$ is the full solution set. Parametrise: let $x = t$, then $y = t - 2$, so`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$\begin{pmatrix}x\\y\end{pmatrix} = \begin{pmatrix}t\\t-2\end{pmatrix} = \underbrace{\begin{pmatrix}0\\-2\end{pmatrix}}_{\mathbf{x}_0\ \text{(particular)}} + \;t\underbrace{\begin{pmatrix}1\\1\end{pmatrix}}_{\mathbf{x}_h\ \text{(homogeneous)}}.$$`}</p>
              <p>{String.raw`The amber line is exactly the teal line shifted by the particular solution $\mathbf{x}_0 = (0,-2)$. Same direction, moved off the origin. That shift `}<i>is</i>{String.raw` the role of $b$.`}</p>
            </Example>

            <Callout icon="🛠️" title="How to compute a particular solution xₚ" color="amber">
              {String.raw`Easy recipe: `}<b>set every free parameter to zero and solve for the rest.</b>{String.raw` In the example above, the parameter was $t$; setting $t = 0$ gives $\mathbf{x}_0 = (0, -2)$ instantly. Any single point on the solution line works as $\mathbf{x}_0$ — setting parameters to zero just picks the most convenient one.`}
            </Callout>

            <Example n="3" title="Same line, a different particular solution" advanced>
              <p>{String.raw`We could equally pick $x = 2, y = 0$ — also on $x - y = 2$. Then $\mathbf{x}_0 = (2, 0)$ and`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$\begin{pmatrix}x\\y\end{pmatrix} = \begin{pmatrix}2\\0\end{pmatrix} + t\begin{pmatrix}1\\1\end{pmatrix}.$$`}</p>
              <p>{String.raw`This looks different from Example 2's answer, yet describes the `}<i>same line</i>{String.raw`. Both are correct. The particular solution is not unique — only the `}<b>direction part</b>{String.raw` $\mathbf{x}_h$ is forced. This is why two students can get "different" answers to the same system and both be right: they chose different $\mathbf{x}_0$.`}</p>
            </Example>

            {/* ─── §5 NETWORK FLOW ─── */}
            <Sec id="network" n="§5">Application 1 — Network &amp; Traffic Flow</Sec>

            <p>Here is where the infinitely-many-solutions story stops being abstract. Traffic engineers, water authorities, and electrical engineers all solve homogeneous-style systems every day, and the free parameters are real choices they get to make.</p>

            <DefBox term="The junction rule" color="teal">
              <p style={{margin:0}}>{String.raw`At every junction in a network, the `}<b>total flow in equals the total flow out</b>{String.raw`. Nothing accumulates and nothing vanishes at a node — cars, water, or current that enter must leave. This single conservation principle turns any network into a system of linear equations.`}</p>
            </DefBox>

            <Callout icon="🚦" title="In flow = Out flow" color="amber">
              This is the same idea as Kirchhoff's current law in circuits and conservation of mass in pipes. One principle, written once per junction, gives one equation per junction. Solve the system and you get every possible flow pattern the network can sustain.
            </Callout>

            <Example n="4" title="A four-junction traffic grid (from the lecture)">
              <p>Cars per hour enter and leave a network through junctions A, B, C, D. Internal road flows are {String.raw`$f_1, \dots, f_6$`}. Applying inflow = outflow at each junction:</p>
              <div className="sbs">
                <div className="sbs-card">
                  <div className="sbs-label">Junction equations</div>
                  <p style={{margin:0}}>{String.raw`$$\begin{aligned} A:&\quad 500 = f_1 + f_2 + f_3 \\ B:&\quad f_1 + f_4 + f_6 = 400 \\ C:&\quad f_3 + f_5 = 100 + f_6 \\ D:&\quad f_2 = f_4 + f_5 \end{aligned}$$`}</p>
                </div>
                <div className="sbs-card">
                  <div className="sbs-label">What we expect</div>
                  <p style={{margin:0,fontSize:'.9rem',color:'var(--lec-ink2)',lineHeight:1.7}}>Four equations, six unknown flows. We anticipate {String.raw`$6 - \operatorname{rank}$`} free parameters — meaning the network has genuine flexibility in how traffic distributes.</p>
                </div>
              </div>
              <Reveal label="Show full solution">
                <p style={{margin:'0 0 10px'}}>{String.raw`Reducing the system (rank turns out to be 3, so $6 - 3 = 3$ free variables — take $f_4, f_5, f_6$ as the free ones):`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$\begin{aligned} f_1 &= 400 - f_4 - f_6 \\ f_2 &= f_4 + f_5 \\ f_3 &= 100 - f_5 + f_6 \end{aligned} \qquad f_4, f_5, f_6 \ \text{free}.$$`}</p>
                <p>{String.raw`As basic-solution structure: $\mathbf{f} = \begin{pmatrix}400\\0\\100\\0\\0\\0\end{pmatrix} + f_4\begin{pmatrix}-1\\1\\0\\1\\0\\0\end{pmatrix} + f_5\begin{pmatrix}0\\1\\-1\\0\\1\\0\end{pmatrix} + f_6\begin{pmatrix}-1\\0\\1\\0\\0\\1\end{pmatrix}.$`}</p>
                <p>{String.raw`The first vector is a `}<b>particular flow</b>{String.raw`; the other three are `}<b>homogeneous (basic) flows</b>{String.raw` — circulation patterns that net zero at every junction. Real constraint: all flows must be $\ge 0$ (one-way streets), which restricts the parameters to a feasible region.`}</p>
              </Reveal>
            </Example>

            <p>Drag the three free flows below and watch the whole grid rebalance in real time. Notice how some settings drive a flow negative — physically impossible on a one-way street:</p>

            <NetworkFlowApplet/>

            {/* ─── §6 BRAESS PARADOX ─── */}
            <Sec id="braess" n="§6">Braess's Paradox — When Adding a Road Makes Traffic Worse</Sec>

            <Callout icon="🤯" title="The paradox that breaks intuition" color="rose">
              In 1968 the German mathematician <b>Dietrich Braess</b> discovered something stunning: adding a new road to a congested network can make <i>everyone's</i> travel time <b>longer</b>, even though no one is forced to use the new road. Removing roads can speed traffic up. This is not a quirk — it has been observed in real cities.
            </Callout>

            <p>The setup: drivers travel from start to finish, choosing the route that is fastest <i>for them</i>. Some road segments have a fixed travel time (say 20 minutes regardless of traffic); others have a time that grows with the number of drivers on them (like {String.raw`$T/10$`} minutes, where {String.raw`$T$`} is the traffic volume). Each driver, acting in pure self-interest, picks the route that looks fastest. The "power of two choices" — having two route options at a junction — is what creates the trap.</p>

            <Callout icon="🌍" title="It really happens" color="violet">
              When Seoul, South Korea, <b>tore down</b> the Cheonggyecheon highway in 2003 and replaced it with a park, traffic flow in the surrounding area actually <i>improved</i> — a real-world Braess effect. Similar improvements were observed when 42nd Street in New York was closed for an event. The mathematics of selfish routing predicts that more capacity is not always better when every agent optimises only for themselves.
            </Callout>

            <Callout icon="🎲" title="The power of two choices" color="teal">
              The flip side of the paradox is a beautiful positive result with the same name. In load-balancing — assigning jobs to servers, or hashing items into bins — giving each item just <b>two</b> random choices and picking the less-loaded one produces dramatically better balance than one choice. Two options, chosen well, tame randomness. The same "two choices" that can trap a road network can, in the right setting, rescue a computer system.
            </Callout>

            {/* ─── §7 CHEMICAL BALANCING ─── */}
            <Sec id="chem" n="§7">Application 2 — Balancing Chemical Equations (§1.6)</Sec>

            <p>Every balanced chemical equation is the solution of a homogeneous linear system. The unknowns are the molecule counts; the equations say each element's atoms are conserved.</p>

            <DefBox term="Conservation of atoms = linear equations" color="teal">
              <p style={{margin:0}}>{String.raw`Assign an unknown coefficient $x_i$ to each molecule. For `}<b>each element</b>{String.raw`, the total atoms on the left must equal the total on the right. This gives one linear equation per element. The system is homogeneous (everything moves to one side $= 0$), so it always has the trivial solution $\mathbf{0}$ — chemically meaningless — and we seek the smallest `}<b>positive integer</b>{String.raw` non-trivial solution.`}</p>
            </DefBox>

            <Example n="5" title="Octane combustion — the engine in your car">
              <p>{String.raw`Balance $x_1\,\mathrm{C_8H_{18}} + x_2\,\mathrm{O_2} \to x_3\,\mathrm{CO_2} + x_4\,\mathrm{H_2O}$ (this is what burns in a petrol engine).`}</p>
              <p>{String.raw`Conservation per element:`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$\begin{aligned} \text{C}:&\quad 8x_1 = x_3 \\ \text{H}:&\quad 18x_1 = 2x_4 \\ \text{O}:&\quad 2x_2 = 2x_3 + x_4 \end{aligned}$$`}</p>
              <Reveal label="Show solution">
                <p style={{margin:'0 0 8px'}}>{String.raw`From C: $x_3 = 8x_1$. From H: $x_4 = 9x_1$. Substitute into O: $2x_2 = 2(8x_1) + 9x_1 = 25x_1$, so $x_2 = \tfrac{25}{2}x_1$.`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`Free variable $x_1$. To clear the fraction pick $x_1 = 2$: then $x_2 = 25$, $x_3 = 16$, $x_4 = 18$.`}</p>
                <p style={{margin:0}}>{String.raw`**Balanced:** `}<b>{String.raw`$2\,\mathrm{C_8H_{18}} + 25\,\mathrm{O_2} \to 16\,\mathrm{CO_2} + 18\,\mathrm{H_2O}$`}</b>{String.raw`. Check — C: $16=16$ ✓, H: $36=36$ ✓, O: $50=50$ ✓.`}</p>
              </Reveal>
            </Example>

            <Callout icon="⚗️" title="Why chemists secretly use linear algebra" color="amber">
              Balancing by trial and error works for simple reactions but collapses for complex ones (try balancing a redox reaction with eight species by hand). Every chemistry-software "balance" button runs Gaussian elimination underneath. The null space of the atom-conservation matrix <i>is</i> the set of balanced equations.
            </Callout>

            <p style={{fontFamily:'var(--fh)',fontSize:'1.3rem',color:'var(--lec-ink)',margin:'40px 0 12px',fontWeight:600}}>Textbook exercises — Nicholson §1.6</p>
            <p>Balance each reaction by setting up and solving the atom-conservation system. Try each by hand, then reveal.</p>

            <Example n="1.6.1" title="Burning methane: CH₄ + O₂ → CO₂ + H₂O">
              <Reveal>
                <p style={{margin:'0 0 8px'}}>{String.raw`$x_1\,\mathrm{CH_4} + x_2\,\mathrm{O_2} \to x_3\,\mathrm{CO_2} + x_4\,\mathrm{H_2O}$. Conservation: C: $x_1 = x_3$; H: $4x_1 = 2x_4$; O: $2x_2 = 2x_3 + x_4$.`}</p>
                <p style={{margin:0}}>{String.raw`Take $x_1 = 1$: $x_3 = 1$, $x_4 = 2$, $2x_2 = 2 + 2 = 4 \Rightarrow x_2 = 2$. `}<b>{String.raw`$\mathrm{CH_4} + 2\,\mathrm{O_2} \to \mathrm{CO_2} + 2\,\mathrm{H_2O}$`}</b>{String.raw`. ✓`}</p>
              </Reveal>
            </Example>

            <Example n="1.6.2" title="NH₃ + CuO → N₂ + Cu + H₂O">
              <Reveal>
                <p style={{margin:'0 0 8px'}}>{String.raw`$x_1\,\mathrm{NH_3} + x_2\,\mathrm{CuO} \to x_3\,\mathrm{N_2} + x_4\,\mathrm{Cu} + x_5\,\mathrm{H_2O}$.`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`N: $x_1 = 2x_3$; H: $3x_1 = 2x_5$; Cu: $x_2 = x_4$; O: $x_2 = x_5$.`}</p>
                <p style={{margin:0}}>{String.raw`Take $x_3 = 1$: $x_1 = 2$, $x_5 = 3$, $x_2 = x_4 = x_5 = 3$. `}<b>{String.raw`$2\,\mathrm{NH_3} + 3\,\mathrm{CuO} \to \mathrm{N_2} + 3\,\mathrm{Cu} + 3\,\mathrm{H_2O}$`}</b>{String.raw`. ✓`}</p>
              </Reveal>
            </Example>

            <Example n="1.6.3" title="Photosynthesis: CO₂ + H₂O → C₆H₁₂O₆ + O₂">
              <Reveal>
                <p style={{margin:'0 0 8px'}}>{String.raw`$x_1\,\mathrm{CO_2} + x_2\,\mathrm{H_2O} \to x_3\,\mathrm{C_6H_{12}O_6} + x_4\,\mathrm{O_2}$.`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`C: $x_1 = 6x_3$; H: $2x_2 = 12x_3$; O: $2x_1 + x_2 = 6x_3 + 2x_4$.`}</p>
                <p style={{margin:0}}>{String.raw`Take $x_3 = 1$: $x_1 = 6$, $x_2 = 6$, then $12 + 6 = 6 + 2x_4 \Rightarrow x_4 = 6$. `}<b>{String.raw`$6\,\mathrm{CO_2} + 6\,\mathrm{H_2O} \to \mathrm{C_6H_{12}O_6} + 6\,\mathrm{O_2}$`}</b>{String.raw`. ✓ — the reaction that feeds all life on Earth.`}</p>
              </Reveal>
            </Example>

            <Example n="1.6.4" title="A monster redox: Pb(N₃)₂ + Cr(MnO₄)₂ → Cr₂O₃ + MnO₂ + Pb₃O₄ + NO" advanced>
              <p>{String.raw`Six species, five elements (Pb, N, Cr, Mn, O). This is where hand-balancing breaks down and linear algebra shines.`}</p>
              <Reveal label="Show full solution">
                <p style={{margin:'0 0 8px'}}>{String.raw`$x_1\mathrm{Pb(N_3)_2} + x_2\mathrm{Cr(MnO_4)_2} \to x_3\mathrm{Cr_2O_3} + x_4\mathrm{MnO_2} + x_5\mathrm{Pb_3O_4} + x_6\mathrm{NO}$.`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`Conservation:`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\text{Pb}: x_1 = 3x_5 \quad \text{N}: 6x_1 = x_6 \quad \text{Cr}: x_2 = 2x_3 \quad \text{Mn}: 2x_2 = x_4 \quad \text{O}: 8x_2 = 3x_3 + 2x_4 + 4x_5 + x_6$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`Solving (one free variable; clear denominators by choosing the smallest integer scaling):`}</p>
                <p style={{margin:0}}>{String.raw`**Balanced:** `}<b>{String.raw`$15\,\mathrm{Pb(N_3)_2} + 44\,\mathrm{Cr(MnO_4)_2} \to 22\,\mathrm{Cr_2O_3} + 88\,\mathrm{MnO_2} + 5\,\mathrm{Pb_3O_4} + 90\,\mathrm{NO}$`}</b>{String.raw`. Check — Pb: $15 = 3(5)$ ✓; N: $6(15)=90$ ✓; Cr: $44 = 2(22)$ ✓; Mn: $2(44)=88$ ✓; O: $8(44)=352 = 3(22)+2(88)+4(5)+90 = 66+176+20+90 = 352$ ✓. All five elements balance.`}</p>
              </Reveal>
            </Example>

            {/* ─── §8 EXERCISES ─── */}
            <Sec id="exercises" n="§8">More Exercises — Nicholson §1.4</Sec>

            <Example n="1.4.2" title="Irrigation canal network" advanced>
              <p>{String.raw`A network of irrigation canals has junctions A, B, C, D. At peak demand the external flows are: $55$ in at A, $20$ out at B, $15$ out at C, $20$ out at D. Internal canal flows are $f_1, \dots, f_5$. (a) Find the possible flows. (b) If canal BC is closed ($f_3 = 0$), what range of flow on AD keeps every canal under 30?`}</p>
              <Reveal label="Show solution (a)">
                <p style={{margin:'0 0 8px'}}>{String.raw`Junction equations (inflow = outflow), reading the standard diagram:`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$A: 55 = f_1 + f_4 \quad B: f_1 = 20 + f_2 + f_3 \quad C: f_3 + f_5 = 15 \quad D: f_4 + f_2 = f_5 + 20$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`Reducing: rank is 3, so $5 - 3 = 2$ free parameters. Taking $f_4, f_5$ free:`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$f_1 = 55 - f_4, \quad f_2 = 20 - f_4 + f_5, \quad f_3 = 15 - f_5, \qquad f_4, f_5 \ \text{free}.$$`}</p>
                <p style={{margin:0}}>{String.raw`Every choice of $f_4, f_5$ (keeping all flows $\ge 0$) is a valid irrigation pattern.`}</p>
              </Reveal>
              <Reveal label="Show solution (b)">
                <p style={{margin:'0 0 8px'}}>{String.raw`Closing BC means $f_3 = 0$, so $15 - f_5 = 0 \Rightarrow f_5 = 15$. Then $f_2 = 20 - f_4 + 15 = 35 - f_4$ and $f_1 = 55 - f_4$. The flow on AD is $f_4$.`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`Require every canal $\le 30$: $f_1 = 55 - f_4 \le 30 \Rightarrow f_4 \ge 25$. And $f_2 = 35 - f_4 \le 30 \Rightarrow f_4 \ge 5$. Also $f_2 \ge 0 \Rightarrow f_4 \le 35$, and $f_4 \le 30$ itself. The binding constraints give `}<b>{String.raw`$25 \le f_4 \le 30$`}</b>{String.raw`.`}</p>
                <p style={{margin:0}}>So AD must carry between 25 and 30 units to keep every canal at or under 30.</p>
              </Reveal>
            </Example>

            <Example n="Conceptual" title="How many parameters? — counting free variables" advanced>
              <p>{String.raw`A non-trivial homogeneous system $AX = 0$ has `}<b>six variables</b>{String.raw` and `}<b>four equations</b>{String.raw`. Determine the number of parameters in the solution for each case:`}</p>
              <p style={{margin:'4px 0'}}>{String.raw`(a) $\operatorname{rank}(A) = 2$ \quad (b) $\operatorname{rank}(A) = 8$ \quad (c) $A$ has 3 rows of zeros in echelon form \quad (d) $A$ has a row of zeros.`}</p>
              <Reveal label="Show answers">
                <p style={{margin:'0 0 6px'}}>{String.raw`Parameters $= n - \operatorname{rank}(A) = 6 - \operatorname{rank}(A)$, and crucially $\operatorname{rank}(A) \le \min(4, 6) = 4$.`}</p>
                <p style={{margin:'0 0 6px'}}>{String.raw`**(a)** $\operatorname{rank} = 2 \Rightarrow 6 - 2 = $ `}<b>4 parameters</b>{String.raw`.`}</p>
                <p style={{margin:'0 0 6px'}}>{String.raw`**(b)** $\operatorname{rank} = 8$ is `}<b>impossible</b>{String.raw` — rank cannot exceed $\min(4,6) = 4$. No such matrix exists.`}</p>
                <p style={{margin:'0 0 6px'}}>{String.raw`**(c)** 3 zero rows out of 4 means 1 nonzero row, so $\operatorname{rank} = 1 \Rightarrow 6 - 1 = $ `}<b>5 parameters</b>{String.raw`.`}</p>
                <p style={{margin:0}}>{String.raw`**(d)** At least one zero row means $\operatorname{rank} \le 3$, so $0 < \operatorname{rank} \le 3$ and parameters range over `}<b>{String.raw`$\{3, 4, 5\}$`}</b>{String.raw` (i.e. $6 - 3$ up to $6 - 1$). We cannot pin down a single value without more information.`}</p>
              </Reveal>
            </Example>

            {/* CLOSING */}
            <div style={{ marginTop:'48px', padding:'28px 32px', background:'rgba(56,201,176,.08)', border:'2px solid rgba(56,201,176,.35)', borderRadius:'16px' }}>
              <div style={{ fontFamily:'var(--fm)', fontSize:'.7rem', letterSpacing:'.16em', textTransform:'uppercase', color:'#2a9d8f', marginBottom:'12px' }}>Looking ahead</div>
              <p style={{ fontFamily:'var(--fh)', fontSize:'1.4rem', color:'var(--lec-ink)', margin:'0 0 16px', fontWeight:400, lineHeight:1.3 }}>
                We can now solve any linear system and describe its full solution set. But what <em>is</em> a matrix really doing to a vector?
              </p>
              <p style={{ color:'var(--lec-ink2)', fontSize:'.97rem', lineHeight:1.8, margin:0 }}>
                So far a matrix has been bookkeeping for a system. Next week we flip the perspective: a matrix is a <b>machine that transforms vectors</b> — rotating, stretching, projecting space itself. Matrix multiplication, the identity, and the inverse all become geometric operations. The algebra you have built is about to come alive as geometry.
              </p>
            </div>

            <div style={{ marginTop:'64px', paddingTop:'28px', borderTop:'2px solid var(--lec-border)', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'12px' }}>
              <div style={{ fontFamily:'var(--fm)', fontSize:'.76rem', color:'var(--lec-ink3)', fontStyle:'italic' }}>Lecture 4 — complete</div>
              <div style={{ fontFamily:'var(--fm)', fontSize:'.76rem', color:'var(--lec-ink3)' }}>MATH-120 · Shoaib Khan · LUMS · June 2026</div>
            </div>
          </div>

          {/* FOOTER NAV */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'22px 48px', borderTop:'1px solid var(--lec-border)', background:'var(--lec-paper)', flexWrap:'wrap', gap:'12px' }}>
            <Link href={PREV_HREF} style={{ fontFamily:'var(--fm)', fontSize:'.74rem', letterSpacing:'.08em', textTransform:'uppercase', color:'var(--lec-accent)', textDecoration:'none' }}>← Lecture 3</Link>
            <Link href={NEXT_HREF} style={{ fontFamily:'var(--fm)', fontSize:'.74rem', letterSpacing:'.08em', textTransform:'uppercase', color:'var(--lec-accent)', textDecoration:'none' }}>Lecture 5 →</Link>
          </div>
        </main>
      </div>

      <Footer/>
    </>
  );
}