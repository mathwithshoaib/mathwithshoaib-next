'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import Navbar from '../../../../components/Navbar';
import Footer from '../../../../components/Footer';

/* ════════════════════════════════════════════════════════════
   MATH-120 · SUPPLEMENTARY NOTES
   Matrix Multiplication — The Complete Guide
   Route: /courses/linalg/notes/matrix-multiplication
   ════════════════════════════════════════════════════════════ */

const LEC = {
  course: 'MATH-120 · Linear Algebra',
  number: 'Supplementary Notes',
  title: 'Matrix Multiplication',
  subtitle: 'The one operation that powers all of linear algebra — built from scratch, the way it finally clicks',
  date: 'June 2026',
};

const ANCHORS = [
  ['Why It Matters', 'why'],
  ['The Dot Product', 'dot'],
  ['The Size Rule', 'size'],
  ['How To Multiply', 'how'],
  ['Worked Examples', 'examples'],
  ['Not Commutative', 'noncommute'],
  ['The Identity', 'identity'],
  ['Properties', 'properties'],
  ['Surprises', 'surprises'],
  ['Powers', 'powers'],
  ['Systems', 'systems'],
  ['Practice', 'practice'],
];

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

/* ═══════════════ INTERACTIVE: ROW · COLUMN DOT PRODUCT ═══════════════ */
function DotProductDemo() {
  const A = [[1,2,3],[4,5,6]];
  const B = [[7,8],[9,10],[11,12]];
  const [ri,setRi]=useState(0),[ci,setCi]=useState(0);
  const row = A[ri];
  const col = B.map(r=>r[ci]);
  const terms = row.map((x,k)=>x*col[k]);
  const total = terms.reduce((a,b)=>a+b,0);
  return (
    <div style={{ background:'#0f1525', border:'1px solid rgba(255,255,255,.08)', borderRadius:'16px', padding:'22px', margin:'24px 0', color:'#e8e8f0', boxShadow:'0 8px 40px rgba(0,0,0,.4)' }}>
      <div style={{ fontFamily:'var(--fm)', fontSize:'.7rem', letterSpacing:'.14em', textTransform:'uppercase', color:'#6a6a9a', marginBottom:'16px', textAlign:'center' }}>
        Interactive · Pick a row of A and a column of B to see where each entry of AB comes from
      </div>
      <div style={{ display:'flex', gap:'28px', justifyContent:'center', alignItems:'center', flexWrap:'wrap', marginBottom:'18px' }}>
        {/* A */}
        <div style={{textAlign:'center'}}>
          <div style={{fontFamily:'monospace',color:'#8a8ac0',fontSize:'.8rem',marginBottom:'6px'}}>A (2×3) — pick a row</div>
          {A.map((r,i)=>(
            <div key={i} onClick={()=>setRi(i)} style={{
              display:'flex',gap:'8px',justifyContent:'center',cursor:'pointer',padding:'4px 8px',borderRadius:'6px',marginBottom:'4px',
              background: ri===i?'rgba(232,160,32,.22)':'transparent', border:`1px solid ${ri===i?'#e8a020':'transparent'}`,
            }}>
              {r.map((x,k)=><span key={k} style={{width:'26px',fontFamily:'monospace',color:ri===i?'#e8a020':'#e8e8f0'}}>{x}</span>)}
            </div>
          ))}
        </div>
        {/* B */}
        <div style={{textAlign:'center'}}>
          <div style={{fontFamily:'monospace',color:'#8a8ac0',fontSize:'.8rem',marginBottom:'6px'}}>B (3×2) — pick a column</div>
          <div style={{display:'flex',gap:'8px',justifyContent:'center'}}>
            {[0,1].map(j=>(
              <div key={j} onClick={()=>setCi(j)} style={{
                cursor:'pointer',padding:'6px 8px',borderRadius:'6px',
                background: ci===j?'rgba(56,201,176,.22)':'transparent', border:`1px solid ${ci===j?'#38c9b0':'transparent'}`,
              }}>
                {B.map((r,i)=><div key={i} style={{fontFamily:'monospace',color:ci===j?'#38c9b0':'#e8e8f0'}}>{r[j]}</div>)}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ textAlign:'center', fontFamily:'monospace', fontSize:'.95rem', padding:'12px', background:'rgba(255,255,255,.04)', borderRadius:'10px' }}>
        <span style={{color:'#e8a020'}}>({row.join(', ')})</span> · <span style={{color:'#38c9b0'}}>({col.join(', ')})</span>
        {' = '}
        {terms.map((t,k)=>(
          <span key={k}>{k>0?' + ':''}<span style={{color:'#e8a020'}}>{row[k]}</span>·<span style={{color:'#38c9b0'}}>{col[k]}</span></span>
        ))}
        {' = '}<b style={{color:'#fff',fontSize:'1.1rem'}}>{total}</b>
      </div>
      <p style={{fontSize:'.78rem',color:'#7a7ab0',textAlign:'center',margin:'12px 0 0',lineHeight:1.6}}>
        This number lands in row {ri+1}, column {ci+1} of the product AB. Every entry of AB is one row·column dot product.
      </p>
    </div>
  );
}

/* ═══════════════ SIZE-RULE VISUAL ═══════════════ */
function SizeRuleVisual() {
  return (
    <div style={{ background:'rgba(255,253,240,.97)', border:'1px solid var(--lec-border)', borderRadius:'14px', padding:'22px', margin:'22px 0', textAlign:'center', boxShadow:'0 2px 18px rgba(60,40,20,.06)' }}>
      <div style={{ display:'inline-flex', alignItems:'center', gap:'10px', flexWrap:'wrap', justifyContent:'center', fontFamily:'monospace', fontSize:'1.1rem' }}>
        <span style={{ color:'#c8860a', fontWeight:700 }}>A</span>
        <span style={{ color:'var(--lec-ink3)' }}>(</span>
        <span style={{ color:'#c8860a', fontWeight:700, fontSize:'1.3rem' }}>m</span>
        <span style={{ color:'var(--lec-ink3)' }}>×</span>
        <span style={{ background:'rgba(56,201,176,.2)', padding:'2px 8px', borderRadius:'6px', color:'#2a9d8f', fontWeight:700, fontSize:'1.3rem' }}>n</span>
        <span style={{ color:'var(--lec-ink3)' }}>)</span>
        <span style={{ color:'var(--lec-ink2)', margin:'0 4px' }}>·</span>
        <span style={{ color:'#9b80e8', fontWeight:700 }}>B</span>
        <span style={{ color:'var(--lec-ink3)' }}>(</span>
        <span style={{ background:'rgba(56,201,176,.2)', padding:'2px 8px', borderRadius:'6px', color:'#2a9d8f', fontWeight:700, fontSize:'1.3rem' }}>n</span>
        <span style={{ color:'var(--lec-ink3)' }}>×</span>
        <span style={{ color:'#9b80e8', fontWeight:700, fontSize:'1.3rem' }}>p</span>
        <span style={{ color:'var(--lec-ink3)' }}>)</span>
        <span style={{ color:'var(--lec-ink2)', margin:'0 6px' }}>=</span>
        <span style={{ fontWeight:700 }}>AB</span>
        <span style={{ color:'var(--lec-ink3)' }}>(</span>
        <span style={{ color:'#c8860a', fontWeight:700, fontSize:'1.3rem' }}>m</span>
        <span style={{ color:'var(--lec-ink3)' }}>×</span>
        <span style={{ color:'#9b80e8', fontWeight:700, fontSize:'1.3rem' }}>p</span>
        <span style={{ color:'var(--lec-ink3)' }}>)</span>
      </div>
      <p style={{ margin:'14px 0 0', fontSize:'.88rem', color:'var(--lec-ink2)', lineHeight:1.6 }}>
        The two <span style={{color:'#2a9d8f',fontWeight:700}}>inner numbers</span> must match — they "touch and cancel."
        The two <span style={{color:'#c8860a',fontWeight:700}}>outer</span> <span style={{color:'#9b80e8',fontWeight:700}}>numbers</span> give the size of the answer.
      </p>
    </div>
  );
}

/* ═══════════════ PAGE ═══════════════ */
export default function MatrixMultiplicationNotes() {
  const [menuOpen, setMenuOpen] = useState(false);

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
    setMenuOpen(false);
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
        <span style={{color:'var(--text2)'}}>Notes · Matrix Multiplication</span>
      </div>

      <button className="lc-menu-btn" onClick={()=>setMenuOpen(o=>!o)}>☰ Contents</button>
      <div className={`lc-backdrop ${menuOpen?'open':''}`} onClick={()=>setMenuOpen(false)}/>

      <div className="lc-shell">
        {/* SIDEBAR — table of contents */}
        <aside className={`lc-sidebar ${menuOpen?'open':''}`}>
          <div style={{ padding:'18px 16px 12px', borderBottom:'1px solid var(--border)' }}>
            <div style={{ fontFamily:'var(--fm)', fontSize:'.6rem', letterSpacing:'.2em', textTransform:'uppercase', color:'var(--amber)', marginBottom:'4px' }}>MATH-120 · Supplementary</div>
            <div style={{ fontFamily:'var(--fh)', fontSize:'.95rem', color:'var(--text)', lineHeight:1.3 }}>Matrix Multiplication</div>
            <Link href="/courses/linalg/w2/lec6" style={{ display:'inline-flex', alignItems:'center', gap:'5px', fontFamily:'var(--fm)', fontSize:'.68rem', color:'var(--text3)', marginTop:'8px', textDecoration:'none' }}>← Back to Lecture 6</Link>
          </div>
          <nav style={{ padding:'12px 0 24px' }}>
            <span style={{ fontFamily:'var(--fm)', fontSize:'.58rem', letterSpacing:'.22em', textTransform:'uppercase', color:'var(--text3)', padding:'8px 16px 4px', display:'block' }}>On this page</span>
            {ANCHORS.map(([label,id],i)=>(
              <a key={id} href={`#${id}`} onClick={e=>jump(e,id)} style={{ textDecoration:'none', display:'block' }}>
                <div style={{ padding:'7px 16px', borderLeft:'3px solid transparent' }}>
                  <div style={{ fontFamily:'var(--fm)', fontSize:'.72rem', lineHeight:1.4, color:'var(--text2)' }}>
                    <span style={{ color:'var(--text3)' }}>{i+1}.</span> {label}
                  </div>
                </div>
              </a>
            ))}
          </nav>
        </aside>

        <main className="lc-main">
          {/* STICKY ANCHOR BAR */}
          <div style={{ position:'sticky', top:'calc(var(--nav-h) + 3px + 37px)', zIndex:480, background:'var(--lec-paper)', borderBottom:'1px solid var(--lec-border)', height:'48px', display:'flex', alignItems:'center' }}>
            <Link href="/courses/linalg/w2/lec6" style={{ display:'flex', alignItems:'center', padding:'0 16px', height:'100%', fontFamily:'var(--fm)', fontSize:'.72rem', color:'var(--lec-ink3)', borderRight:'1px solid var(--lec-border)', whiteSpace:'nowrap', flexShrink:0, textDecoration:'none' }}>← Lecture 6</Link>
            <div style={{ flex:1, display:'flex', justifyContent:'center', alignItems:'center', gap:'4px', overflowX:'auto', padding:'0 8px' }}>
              <span style={{ fontFamily:'var(--fm)', fontSize:'.6rem', letterSpacing:'.12em', textTransform:'uppercase', color:'var(--lec-accent)', flexShrink:0, marginRight:'6px' }}>Jump to</span>
              {ANCHORS.map(([label,id],i)=>(
                <span key={id} style={{display:'inline-flex',alignItems:'center',flexShrink:0}}>
                  {i>0&&<span style={{color:'var(--lec-border)',margin:'0 7px'}}>·</span>}
                  <a href={`#${id}`} onClick={e=>jump(e,id)} style={{fontFamily:'var(--fm)',fontSize:'.73rem',color:'var(--lec-ink2)',textDecoration:'none',whiteSpace:'nowrap'}}>{label}</a>
                </span>
              ))}
            </div>
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
            <Sec id="why" n="§1">Why Matrix Multiplication Is Strange — and Why That's Good</Sec>

            <p>Let me be honest with you up front. When you first see how matrices multiply, your reaction will be: <i>"who on earth invented this, and why so complicated?"</i> You would add matrices entry-by-entry — sensible. You'd expect to multiply them entry-by-entry too. But that's <b>not</b> how it works, and there is a beautiful reason.</p>

            <Callout icon="🔗" title="The one-sentence reason" color="violet">
              Matrix multiplication is defined the way it is so that it represents <b>doing one transformation after another</b>. If matrix {String.raw`$A$`} rotates space and matrix {String.raw`$B$`} stretches it, then {String.raw`$AB$`} is the single matrix that "stretches, then rotates." Multiplication is <b>composition of actions</b>. Once you see that, the strange rule becomes the only rule that could possibly work.
            </Callout>

            <p>So forget memorising for a moment. We are going to build the operation from one tiny tool you already know — the <b>dot product</b> — and by the end it will feel inevitable. Stay with me.</p>

            {/* ─── §2 DOT PRODUCT ─── */}
            <Sec id="dot" n="§2">The Building Block — the Dot Product</Sec>

            <p>Everything in matrix multiplication is built from one simple move: take two equal-length lists of numbers, multiply them position-by-position, and add up the results.</p>

            <DefBox term="Dot product" color="teal">
              <p style={{margin:0}}>{String.raw`The `}<b>dot product</b>{String.raw` of two lists of the same length, $(a_1, a_2, \dots, a_n)$ and $(b_1, b_2, \dots, b_n)$, is the single number $a_1 b_1 + a_2 b_2 + \cdots + a_n b_n.$`}</p>
            </DefBox>

            <Example n="1" title="A dot product in action">
              <p>{String.raw`$(1, 2, 3) \cdot (4, 5, 6) = (1)(4) + (2)(5) + (3)(6) = 4 + 10 + 18 = 32.$`}</p>
              <p style={{margin:0}}>One row, one column, one number out. Hold onto this — it is the atom of everything that follows.</p>
            </Example>

            <Callout icon="🎯" title="The mental picture" color="amber">
              A matrix product is nothing more than <b>a whole grid of dot products</b>. Each entry of the answer is one row of the first matrix dotted with one column of the second. That's it. The only thing you must get right is <i>which</i> row meets <i>which</i> column.
            </Callout>

            {/* ─── §3 SIZE RULE ─── */}
            <Sec id="size" n="§3">The Size Rule — When Can You Even Multiply?</Sec>

            <p>Before multiplying, you must check the sizes line up. Unlike addition (which needs identical sizes), multiplication has its own rule — and it is the first thing to check every single time.</p>

            <DefBox term="The size rule" color="violet">
              <p style={{margin:0}}>{String.raw`You can form the product $AB$ only when the `}<b>{String.raw`number of columns of $A$`}</b>{String.raw` equals the `}<b>{String.raw`number of rows of $B$`}</b>{String.raw`. If $A$ is $m\times n$ and $B$ is $n\times p$, then $AB$ exists and has size $m\times p$.`}</p>
            </DefBox>

            <SizeRuleVisual/>

            <Callout icon="🧠" title="The trick to never forget it" color="teal">
              Write the two sizes next to each other: {String.raw`$(m \times n)(n \times p)$`}. The <b>inner</b> pair must match — that's the requirement. The <b>outer</b> pair becomes the answer's size. Inner numbers shake hands and disappear; outer numbers survive.
            </Callout>

            <Example n="2" title="Reading the size rule">
              <p>{String.raw`(a) $A$ is $2\times3$, $B$ is $3\times4$. Inner: $3 = 3$ ✓. Product $AB$ is $2\times4$.`}</p>
              <p>{String.raw`(b) $A$ is $2\times3$, $B$ is $2\times3$. Inner: $3 \neq 2$. The product $AB$ `}<b>does not exist</b>{String.raw`.`}</p>
              <p style={{margin:0}}>{String.raw`(c) $A$ is $3\times1$ (a column), $B$ is $1\times3$ (a row). Inner: $1 = 1$ ✓. Product is $3\times3$ — a full matrix from a column times a row!`}</p>
            </Example>

            {/* ─── §4 HOW ─── */}
            <Sec id="how" n="§4">How To Actually Multiply — Row Meets Column</Sec>

            <DefBox term="The product AB, entry by entry" color="amber">
              <p style={{margin:0}}>{String.raw`The entry in `}<b>{String.raw`row $i$, column $j$`}</b>{String.raw` of $AB$ is the dot product of `}<b>{String.raw`row $i$ of $A$`}</b>{String.raw` with `}<b>{String.raw`column $j$ of $B$`}</b>{String.raw`. In symbols, if $A=[a_{ik}]$ and $B=[b_{kj}]$, then $(AB)_{ij} = \sum_{k} a_{ik}\, b_{kj} = a_{i1}b_{1j} + a_{i2}b_{2j} + \cdots + a_{in}b_{nj}.$`}</p>
            </DefBox>

            <p>Here is the rhythm to say in your head: <b>"row {String.raw`$i$`} of {String.raw`$A$`}, column {String.raw`$j$`} of {String.raw`$B$`} — multiply across, add up, drop it in slot {String.raw`$(i,j)$`}."</b> Play with the demo below: choose any row of {String.raw`$A$`} and any column of {String.raw`$B$`}, and watch exactly which dot product produces which entry.</p>

            <DotProductDemo/>

            {/* ─── §5 WORKED EXAMPLES ─── */}
            <Sec id="examples" n="§5">Worked Examples — From Easy to Confident</Sec>

            <Example n="3" title="The full 2×2 product, slot by slot">
              <p>{String.raw`Compute $AB$ for $A = \begin{bmatrix}1&2\\3&4\end{bmatrix}$, $B = \begin{bmatrix}5&6\\7&8\end{bmatrix}$.`}</p>
              <p>Work each of the four slots as a row·column dot product:</p>
              <p style={{margin:'4px 0'}}>{String.raw`$(1,1)$: row 1 · col 1 $= (1)(5)+(2)(7) = 5+14 = 19$.`}</p>
              <p style={{margin:'4px 0'}}>{String.raw`$(1,2)$: row 1 · col 2 $= (1)(6)+(2)(8) = 6+16 = 22$.`}</p>
              <p style={{margin:'4px 0'}}>{String.raw`$(2,1)$: row 2 · col 1 $= (3)(5)+(4)(7) = 15+28 = 43$.`}</p>
              <p style={{margin:'4px 0'}}>{String.raw`$(2,2)$: row 2 · col 2 $= (3)(6)+(4)(8) = 18+32 = 50$.`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$AB = \begin{bmatrix}19 & 22\\43 & 50\end{bmatrix}.$$`}</p>
            </Example>

            <Example n="4" title="Matrix times a vector">
              <p>{String.raw`A column vector is just a matrix with one column, so the same rule applies. Compute $\begin{bmatrix}2&1\\1&3\end{bmatrix}\begin{bmatrix}4\\5\end{bmatrix}$.`}</p>
              <p style={{margin:'4px 0'}}>{String.raw`Row 1 · the column $= (2)(4)+(1)(5) = 8+5 = 13$.`}</p>
              <p style={{margin:'4px 0'}}>{String.raw`Row 2 · the column $= (1)(4)+(3)(5) = 4+15 = 19$.`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$\begin{bmatrix}2&1\\1&3\end{bmatrix}\begin{bmatrix}4\\5\end{bmatrix} = \begin{bmatrix}13\\19\end{bmatrix}.$$`}</p>
              <p style={{margin:0}}>{String.raw`Notice $(2\times2)(2\times1) = (2\times1)$ — a vector in, a vector out. This is the view of a matrix as a `}<b>machine that transforms vectors</b>{String.raw`.`}</p>
            </Example>

            <Example n="5" title="A non-square product — mind the sizes" advanced>
              <p>{String.raw`Compute $CD$ for $C = \begin{bmatrix}1&2&3\\4&5&6\end{bmatrix}$ $(2\times3)$ and $D = \begin{bmatrix}7&8\\9&10\\11&12\end{bmatrix}$ $(3\times2)$.`}</p>
              <p>{String.raw`Inner numbers $3 = 3$ ✓, so $CD$ exists and is $2\times2$. Each entry dots a length-3 row with a length-3 column:`}</p>
              <p style={{margin:'4px 0'}}>{String.raw`$(1,1) = (1)(7)+(2)(9)+(3)(11) = 7+18+33 = 58.$`}</p>
              <p style={{margin:'4px 0'}}>{String.raw`$(1,2) = (1)(8)+(2)(10)+(3)(12) = 8+20+36 = 64.$`}</p>
              <p style={{margin:'4px 0'}}>{String.raw`$(2,1) = (4)(7)+(5)(9)+(6)(11) = 28+45+66 = 139.$`}</p>
              <p style={{margin:'4px 0'}}>{String.raw`$(2,2) = (4)(8)+(5)(10)+(6)(12) = 32+50+72 = 154.$`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$CD = \begin{bmatrix}58 & 64\\139 & 154\end{bmatrix}.$$`}</p>
            </Example>

            {/* ─── §6 NON-COMMUTATIVE ─── */}
            <Sec id="noncommute" n="§6">The Big Warning — Order Matters</Sec>

            <RedBox title="AB is usually NOT equal to BA">
              <p style={{margin:0}}>{String.raw`With ordinary numbers, $5 \times 3 = 3 \times 5$. With matrices this `}<b>fails</b>{String.raw`. In general $AB \neq BA$. Matrix multiplication is `}<b>not commutative</b>{String.raw`. The order you multiply in changes the answer — sometimes it even changes whether the product exists at all.`}</p>
            </RedBox>

            <Example n="6" title="See it with your own eyes">
              <p>{String.raw`Take the same $A = \begin{bmatrix}1&2\\3&4\end{bmatrix}$ and $B = \begin{bmatrix}5&6\\7&8\end{bmatrix}$. We found $AB = \begin{bmatrix}19&22\\43&50\end{bmatrix}$. Now compute $BA$:`}</p>
              <p style={{margin:'4px 0'}}>{String.raw`$(1,1) = (5)(1)+(6)(3) = 5+18 = 23.$`}</p>
              <p style={{margin:'4px 0'}}>{String.raw`$(1,2) = (5)(2)+(6)(4) = 10+24 = 34.$`}</p>
              <p style={{margin:'4px 0'}}>{String.raw`$(2,1) = (7)(1)+(8)(3) = 7+24 = 31.$`}</p>
              <p style={{margin:'4px 0'}}>{String.raw`$(2,2) = (7)(2)+(8)(4) = 14+32 = 46.$`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$BA = \begin{bmatrix}23 & 34\\31 & 46\end{bmatrix} \neq \begin{bmatrix}19 & 22\\43 & 50\end{bmatrix} = AB.$$`}</p>
              <p style={{margin:0}}>Same two matrices, completely different products. This is why we always say "{String.raw`$A$`} times {String.raw`$B$`}" carefully, and why we distinguish <b>left-multiply</b> from <b>right-multiply</b>.</p>
            </Example>

            <Callout icon="🚫" title="The consequence — you cannot 'cancel'" color="rose">
              {String.raw`Because order matters, you `}<b>cannot</b>{String.raw` cancel matrices like numbers. From $AB = AC$ you `}<i>cannot</i>{String.raw` conclude $B = C$. From $AB = CB$ you `}<i>cannot</i>{String.raw` conclude $A = C$. A matrix does not simply "divide out." Whenever you want to undo a matrix, you must `}<b>multiply by its inverse on the correct side</b>{String.raw` — left or right, and consistently on both sides of the equation.`}
            </Callout>

            {/* ─── §7 IDENTITY ─── */}
            <Sec id="identity" n="§7">The Identity Matrix — Multiplication's "1"</Sec>

            <DefBox term="Identity matrix" color="teal">
              <p style={{margin:0}}>{String.raw`The `}<b>identity matrix</b>{String.raw` $I_n$ is the $n\times n$ matrix with $1$s on the main diagonal and $0$s everywhere else. For example $I_2 = \begin{bmatrix}1&0\\0&1\end{bmatrix}$ and $I_3 = \begin{bmatrix}1&0&0\\0&1&0\\0&0&1\end{bmatrix}.$`}</p>
            </DefBox>

            <p>The identity earns its name: multiplying by it changes nothing, exactly like the number {String.raw`$1$`}.</p>

            <ThmBox title="The identity does nothing">
              <p style={{margin:0}}>{String.raw`For any $m\times n$ matrix $A$, we have $I_m A = A$ and $A I_n = A$. Multiplying by the identity (on either side, with the matching size) returns $A$ unchanged.`}</p>
            </ThmBox>

            <Example n="7" title="The identity in action">
              <p>{String.raw`Let $A = \begin{bmatrix}3&1\\2&5\end{bmatrix}$. Then`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$AI = \begin{bmatrix}3&1\\2&5\end{bmatrix}\begin{bmatrix}1&0\\0&1\end{bmatrix} = \begin{bmatrix}3&1\\2&5\end{bmatrix} = A,$$`}</p>
              <p style={{margin:0}}>{String.raw`and $IA = A$ as well. This is the matrix we are chasing when we look for an inverse: $A^{-1}A = I$ means "$A^{-1}$ undoes $A$ back to the do-nothing matrix."`}</p>
            </Example>

            {/* ─── §8 PROPERTIES ─── */}
            <Sec id="properties" n="§8">The Laws That Still Hold</Sec>

            <p>Multiplication loses commutativity — but it keeps most other good behaviour. Here are the laws you may rely on (assuming all sizes line up so the products exist).</p>

            <ThmBox title="Properties of matrix multiplication">
              <ol style={{ margin:0, paddingLeft:'22px', lineHeight:2 }}>
                <li><b>Associative:</b> {String.raw`$A(BC) = (AB)C$`}. You may regroup, just never reorder.</li>
                <li><b>Left distributive:</b> {String.raw`$A(B + C) = AB + AC$`}.</li>
                <li><b>Right distributive:</b> {String.raw`$(B + C)A = BA + CA$`}.</li>
                <li><b>Scalars slide:</b> {String.raw`$k(AB) = (kA)B = A(kB)$ for any scalar $k$.`}</li>
                <li><b>Identity:</b> {String.raw`$IA = A$ and $AI = A$.`}</li>
                <li><b>Transpose reverses order:</b> {String.raw`$(AB)^{\mathsf{T}} = B^{\mathsf{T}} A^{\mathsf{T}}$.`}</li>
              </ol>
            </ThmBox>

            <Callout icon="🔁" title="Why the transpose flips the order" color="violet">
              {String.raw`Property 6 surprises everyone: $(AB)^{\mathsf{T}} = B^{\mathsf{T}}A^{\mathsf{T}}$, `}<b>not</b>{String.raw` $A^{\mathsf{T}}B^{\mathsf{T}}$. Think of putting on socks then shoes: to reverse it, you take off shoes first, then socks. Reversing a sequence reverses the order. The same logic governs inverses: $(AB)^{-1} = B^{-1}A^{-1}$.`}
            </Callout>

            <Example n="8" title="Checking associativity" advanced>
              <p>{String.raw`Let $A = \begin{bmatrix}1&2\\0&1\end{bmatrix}$, $B = \begin{bmatrix}2&0\\1&3\end{bmatrix}$, $C = \begin{bmatrix}1&1\\2&0\end{bmatrix}$.`}</p>
              <Reveal label="Show the check">
                <p style={{margin:'0 0 8px'}}>{String.raw`First $AB = \begin{bmatrix}1&2\\0&1\end{bmatrix}\begin{bmatrix}2&0\\1&3\end{bmatrix} = \begin{bmatrix}4&6\\1&3\end{bmatrix}$, then $(AB)C = \begin{bmatrix}4&6\\1&3\end{bmatrix}\begin{bmatrix}1&1\\2&0\end{bmatrix} = \begin{bmatrix}16&4\\7&1\end{bmatrix}$.`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`Now the other grouping: $BC = \begin{bmatrix}2&0\\1&3\end{bmatrix}\begin{bmatrix}1&1\\2&0\end{bmatrix} = \begin{bmatrix}2&2\\7&1\end{bmatrix}$, then $A(BC) = \begin{bmatrix}1&2\\0&1\end{bmatrix}\begin{bmatrix}2&2\\7&1\end{bmatrix} = \begin{bmatrix}16&4\\7&1\end{bmatrix}$.`}</p>
                <p style={{margin:0}}>{String.raw`Both give $\begin{bmatrix}16&4\\7&1\end{bmatrix}$. Associativity holds — we may compute $ABC$ in whichever grouping is easier. ✓`}</p>
              </Reveal>
            </Example>

            {/* ─── §9 SURPRISES ─── */}
            <Sec id="surprises" n="§9">Three Surprises That Trip Everyone Up</Sec>

            <p>Matrix multiplication breaks a few "rules" you've trusted since school. Knowing these in advance saves you from confident mistakes.</p>

            <Callout icon="😮" title="Surprise 1 — a product can be zero without either factor being zero" color="rose">
              {String.raw`With numbers, if $xy = 0$ then $x = 0$ or $y = 0$. Matrices break this. Take $A = \begin{bmatrix}1&0\\0&0\end{bmatrix}$ and $B = \begin{bmatrix}0&0\\0&1\end{bmatrix}$. Neither is the zero matrix, yet $AB = \begin{bmatrix}0&0\\0&0\end{bmatrix} = 0$. So $AB = 0$ does `}<b>not</b>{String.raw` let you conclude $A=0$ or $B=0$.`}
            </Callout>

            <Callout icon="😮" title="Surprise 2 — you can't always square a matrix" color="amber">
              {String.raw`To form $A^2 = A \cdot A$, the size rule demands the columns of $A$ match the rows of $A$ — that needs $A$ to be `}<b>square</b>{String.raw`. A $2\times3$ matrix cannot be squared. But $A A^{\mathsf{T}}$ (size $m\times m$) and $A^{\mathsf{T}}A$ (size $n\times n$) are `}<b>always</b>{String.raw` defined — the transpose fixes the sizes so a product exists. This is one reason the transpose is so useful in practice.`}
            </Callout>

            <Callout icon="😮" title="Surprise 3 — (A+B)² is not A² + 2AB + B²" color="violet">
              {String.raw`Expanding $(A+B)^2 = (A+B)(A+B) = A^2 + AB + BA + B^2$. You `}<b>cannot</b>{String.raw` combine $AB + BA$ into $2AB$ unless $A$ and $B$ happen to commute. So the familiar algebra identity quietly fails. Always expand matrix products in full and respect the order.`}
            </Callout>

            {/* ─── §10 POWERS ─── */}
            <Sec id="powers" n="§10">Powers of a Square Matrix</Sec>

            <DefBox term="Matrix powers" color="teal">
              <p style={{margin:0}}>{String.raw`For a `}<b>square</b>{String.raw` matrix $A$, we define $A^2 = AA$, $A^3 = AAA$, and in general $A^k = A \cdot A \cdots A$ ($k$ times). By convention $A^0 = I$. Powers are only defined for square matrices, because only then does $A\cdot A$ satisfy the size rule.`}</p>
            </DefBox>

            <Example n="9" title="Computing a power">
              <p>{String.raw`Let $A = \begin{bmatrix}1&1\\0&1\end{bmatrix}$. Find $A^3$.`}</p>
              <p style={{margin:'4px 0'}}>{String.raw`$A^2 = \begin{bmatrix}1&1\\0&1\end{bmatrix}\begin{bmatrix}1&1\\0&1\end{bmatrix} = \begin{bmatrix}1&2\\0&1\end{bmatrix}.$`}</p>
              <p style={{margin:'4px 0'}}>{String.raw`$A^3 = A^2 A = \begin{bmatrix}1&2\\0&1\end{bmatrix}\begin{bmatrix}1&1\\0&1\end{bmatrix} = \begin{bmatrix}1&3\\0&1\end{bmatrix}.$`}</p>
              <p style={{margin:0}}>{String.raw`A clean pattern emerges: $A^k = \begin{bmatrix}1&k\\0&1\end{bmatrix}$. Matrix powers often reveal patterns like this — they are the engine behind modelling repeated processes (population growth, web-page ranking, and more).`}</p>
            </Example>

            {/* ─── §11 SYSTEMS ─── */}
            <Sec id="systems" n="§11">The Payoff — Systems Become a Single Equation</Sec>

            <p>Here is where all of this pays off, and it connects straight back to everything you solved in Week 1. A whole system of linear equations collapses into one tidy matrix product.</p>

            <Example n="10" title="A system in matrix form">
              <p>{String.raw`The system $\begin{cases}2x + y = 5 \\ x + 3y = 10\end{cases}$ can be written as $A\mathbf{x} = \mathbf{b}$:`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$\underbrace{\begin{bmatrix}2&1\\1&3\end{bmatrix}}_{A}\underbrace{\begin{bmatrix}x\\y\end{bmatrix}}_{\mathbf{x}} = \underbrace{\begin{bmatrix}5\\10\end{bmatrix}}_{\mathbf{b}}.$$`}</p>
              <p>{String.raw`Multiply out the left side using the row·column rule: row 1 gives $2x + y$, row 2 gives $x + 3y$. Setting these equal to $\mathbf{b}$ reproduces the original two equations exactly. The matrix product `}<i>is</i>{String.raw` the system.`}</p>
              <p style={{margin:0}}>{String.raw`And now the connection to Lecture 6: if $A$ is invertible, the solution is simply $\mathbf{x} = A^{-1}\mathbf{b}$. (Here the answer is $x = 1$, $y = 3$.) The inverse and multiplication are two halves of the same machine.`}</p>
            </Example>

            <Callout icon="🌍" title="Where this shows up" color="teal">
              This single idea — "a matrix times a vector packages a whole linear transformation" — is the foundation of computer graphics (every rotation of a 3D game character is a matrix product), Google's original PageRank algorithm, neural networks (each layer is a matrix multiply), economics, and quantum mechanics. The strange rule you just learned runs an enormous share of the modern world.
            </Callout>

            {/* ─── §12 PRACTICE ─── */}
            <Sec id="practice" n="§12">Practice — Test Yourself</Sec>

            <Example n="P1" title="Compute the product">
              <p>{String.raw`Find $AB$ where $A = \begin{bmatrix}2&0\\-1&3\end{bmatrix}$, $B = \begin{bmatrix}1&4\\2&-1\end{bmatrix}$.`}</p>
              <Reveal>
                <p style={{margin:'0 0 6px'}}>{String.raw`$(1,1) = (2)(1)+(0)(2) = 2$; $\;(1,2) = (2)(4)+(0)(-1) = 8$.`}</p>
                <p style={{margin:'0 0 6px'}}>{String.raw`$(2,1) = (-1)(1)+(3)(2) = 5$; $\;(2,2) = (-1)(4)+(3)(-1) = -7$.`}</p>
                <p style={{margin:0,textAlign:'center'}}>{String.raw`$$AB = \begin{bmatrix}2&8\\5&-7\end{bmatrix}.$$`}</p>
              </Reveal>
            </Example>

            <Example n="P2" title="Does the product exist?">
              <p>{String.raw`$A$ is $4\times2$ and $B$ is $4\times2$. (a) Does $AB$ exist? (b) Does $A^{\mathsf{T}}B$ exist, and what size?`}</p>
              <Reveal>
                <p style={{margin:'0 0 6px'}}>{String.raw`(a) $AB$: inner numbers are $2$ (cols of $A$) and $4$ (rows of $B$). $2 \neq 4$, so $AB$ `}<b>does not exist</b>{String.raw`.`}</p>
                <p style={{margin:0}}>{String.raw`(b) $A^{\mathsf{T}}$ is $2\times4$. Then $A^{\mathsf{T}}B$ has inner numbers $4 = 4$ ✓, so it exists and is $2\times2$. The transpose rescued the product — Surprise 2 in action.`}</p>
              </Reveal>
            </Example>

            <Example n="P3" title="Show order matters" advanced>
              <p>{String.raw`For $A = \begin{bmatrix}0&1\\0&0\end{bmatrix}$ and $B = \begin{bmatrix}0&0\\1&0\end{bmatrix}$, compute $AB$ and $BA$ and compare.`}</p>
              <Reveal>
                <p style={{margin:'0 0 6px'}}>{String.raw`$AB = \begin{bmatrix}0&1\\0&0\end{bmatrix}\begin{bmatrix}0&0\\1&0\end{bmatrix} = \begin{bmatrix}1&0\\0&0\end{bmatrix}.$`}</p>
                <p style={{margin:'0 0 6px'}}>{String.raw`$BA = \begin{bmatrix}0&0\\1&0\end{bmatrix}\begin{bmatrix}0&1\\0&0\end{bmatrix} = \begin{bmatrix}0&0\\0&1\end{bmatrix}.$`}</p>
                <p style={{margin:0}}>{String.raw`$AB \neq BA$ — different matrices entirely. A vivid reminder that order is everything.`}</p>
              </Reveal>
            </Example>

            {/* CLOSING */}
            <div style={{ marginTop:'48px', padding:'28px 32px', background:'rgba(232,160,32,.08)', border:'2px solid rgba(232,160,32,.35)', borderRadius:'16px' }}>
              <div style={{ fontFamily:'var(--fm)', fontSize:'.7rem', letterSpacing:'.16em', textTransform:'uppercase', color:'#c8860a', marginBottom:'12px' }}>The whole lecture in five lines</div>
              <ul style={{ color:'var(--lec-ink2)', fontSize:'1rem', lineHeight:1.9, margin:0, paddingLeft:'22px' }}>
                <li>Every entry of {String.raw`$AB$`} is one <b>row of {String.raw`$A$`} dotted with one column of {String.raw`$B$`}</b>.</li>
                <li>The product exists only when <b>columns of {String.raw`$A$`} = rows of {String.raw`$B$`}</b>; the answer is {String.raw`$(\text{rows of }A)\times(\text{cols of }B)$`}.</li>
                <li>Order matters: {String.raw`$AB \neq BA$`} in general, so you can never "cancel" a matrix.</li>
                <li>The identity {String.raw`$I$`} does nothing; the inverse {String.raw`$A^{-1}$`} undoes {String.raw`$A$`} back to {String.raw`$I$`}.</li>
                <li>Multiplication is <b>composition of transformations</b> — that's why it's defined this way.</li>
              </ul>
            </div>

            <p style={{ marginTop:'28px', textAlign:'center', fontStyle:'italic', color:'var(--lec-ink3)' }}>Bring any leftover questions to the tutorial or to TA office hours — and welcome back to Lecture 6, where this all pays off in the inverse.</p>

            <div style={{ marginTop:'40px', paddingTop:'28px', borderTop:'2px solid var(--lec-border)', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'12px' }}>
              <div style={{ fontFamily:'var(--fm)', fontSize:'.76rem', color:'var(--lec-ink3)', fontStyle:'italic' }}>Supplementary notes — complete</div>
              <div style={{ fontFamily:'var(--fm)', fontSize:'.76rem', color:'var(--lec-ink3)' }}>MATH-120 · Shoaib Khan · LUMS · June 2026</div>
            </div>
          </div>

          {/* FOOTER NAV */}
          <div style={{ display:'flex', justifyContent:'center', alignItems:'center', padding:'22px 48px', borderTop:'1px solid var(--lec-border)', background:'var(--lec-paper)' }}>
            <Link href="/courses/linalg/w2/lec6" style={{ fontFamily:'var(--fm)', fontSize:'.74rem', letterSpacing:'.08em', textTransform:'uppercase', color:'var(--lec-accent)', textDecoration:'none' }}>← Back to Lecture 6: The Inverse</Link>
          </div>
        </main>
      </div>

      <Footer/>
    </>
  );
}