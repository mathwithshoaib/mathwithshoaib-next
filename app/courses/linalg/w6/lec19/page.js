'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import Navbar from '../../../../components/Navbar';
import Footer from '../../../../components/Footer';

/* ════════════════════════════════════════════════════════════
   MATH-120 · LECTURE 19
   Orthogonal Projections onto Subspaces, Orthogonal Complements,
   and Orthogonal Diagonalization of Symmetric Matrices — §8.1–8.2
   Route: /courses/linalg/w6/lec19
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
const THIS_SLUG = 'w6/lec19';
const PREV_HREF  = '/courses/linalg/w5/lec18';
const NEXT_HREF  = '/courses/linalg/w6/lec20';

const LEC = {
  course: 'MATH-120 · Linear Algebra',
  number: 'Lecture 19',
  title: 'Orthogonal Projections, Complements & the Best-Behaved Matrices in the Course',
  subtitle: 'How to drop a perpendicular onto a subspace, split any vector into "in U" and "perpendicular to U," and discover why symmetric matrices are always, effortlessly diagonalizable',
  date: '13 July 2026',
};

const ANCHORS = [
  ['Motivation & History', 'motivation'],
  ['Shortest Distance', 'shortest-distance'],
  ['Example 8.1.4', 'ex814'],
  ['Orthogonal Complements', 'orth-complement'],
  ['Basis of U⊥', 'complement-example'],
  ['Decomposing a Vector', 'decomposition-example'],
  ['Symmetric Matrices', 'symmetric-matrices'],
  ['Eigenvectors Are Orthogonal', 'orth-eigenvectors-proof'],
  ['Orthogonal Diagonalization', 'orth-diagonalization'],
  ['Worked Diagonalization', 'sym-example'],
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

/* Inline SVG figure: point P above a plane U, with the perpendicular
   dropped onto its foot — the orthogonal projection of P onto U. */
function ProjectionFigure() {
  return (
    <div style={{ margin:'22px 0', padding:'20px', background:'rgba(255,253,240,.7)', border:'1px solid var(--lec-border)', borderRadius:'14px' }}>
      <svg viewBox="0 0 560 320" style={{ width:'100%', height:'auto', maxWidth:'480px', display:'block', margin:'0 auto' }}>
        <defs>
          <marker id="projArrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" fill="#4a4030" />
          </marker>
        </defs>
        {/* the plane U, drawn as a tilted parallelogram */}
        <polygon points="70,230 380,230 470,140 160,140" fill="rgba(232,160,32,.10)" stroke="#c8860a" strokeWidth="1.6" />
        <text x="100" y="222" fontSize="16" fontFamily="var(--fh)" fill="#c8860a" fontStyle="italic">U</text>

        {/* O, a point in the plane */}
        <circle cx="220" cy="196" r="3.5" fill="#4a4030" />
        <text x="200" y="216" fontSize="13" fontFamily="var(--fh)" fill="#241e14">O</text>

        {/* F, the foot of the perpendicular = orthogonal projection of P */}
        <circle cx="330" cy="180" r="4" fill="#2a9d8f" />
        <text x="336" y="205" fontSize="13" fontFamily="var(--fm)" fill="#2a9d8f">{`ProjU(P)`}</text>

        {/* thin reference line O to F, both lying in the plane */}
        <line x1="220" y1="196" x2="330" y2="180" stroke="#7a6e5e" strokeWidth="1" strokeDasharray="2 3" />

        {/* P, above the plane */}
        <circle cx="330" cy="60" r="4" fill="#241e14" />
        <text x="342" y="58" fontSize="16" fontFamily="var(--fh)" fill="#241e14">P</text>

        {/* the perpendicular dropped from P to its foot F */}
        <line x1="330" y1="64" x2="330" y2="176" stroke="#d85555" strokeWidth="2.2" strokeDasharray="6 4" markerEnd="url(#projArrow)" />

        {/* right-angle marker at F */}
        <path d="M 314 180 L 314 166 L 330 166" fill="none" stroke="#2a9d8f" strokeWidth="2" />
      </svg>
      <p style={{ textAlign:'center', fontSize:'.85rem', fontStyle:'italic', color:'var(--lec-ink3)', margin:'10px 0 0' }}>
        {String.raw`The dashed segment from $P$ meets the plane $U$ at a right angle. Its foot is the orthogonal projection $\text{Proj}_U(P)$ — and that foot is the closest point in $U$ to $P$.`}
      </p>
    </div>
  );
}

/* Inline SVG figure: the "cartoon" of a direct sum — V split into a
   U half and a U-perp half. */
function ComplementFigure() {
  return (
    <div style={{ margin:'22px 0', padding:'20px', background:'rgba(255,253,240,.7)', border:'1px solid var(--lec-border)', borderRadius:'14px' }}>
      <svg viewBox="0 0 520 200" style={{ width:'100%', height:'auto', maxWidth:'420px', display:'block', margin:'0 auto' }}>
        <rect x="40" y="30" width="440" height="140" fill="none" stroke="#4a4030" strokeWidth="2" rx="10" />
        <line x1="260" y1="30" x2="260" y2="170" stroke="#4a4030" strokeWidth="1.6" strokeDasharray="5 5" />
        <rect x="40" y="30" width="220" height="140" fill="rgba(56,201,176,.10)" rx="10" />
        <rect x="260" y="30" width="220" height="140" fill="rgba(155,128,232,.10)" rx="10" />
        <text x="150" y="108" textAnchor="middle" fontSize="26" fontFamily="var(--fh)" fill="#2a9d8f" fontStyle="italic">U</text>
        <text x="370" y="100" textAnchor="middle" fontSize="26" fontFamily="var(--fh)" fill="#9b80e8" fontStyle="italic">{`U⊥`}</text>
        <text x="370" y="122" textAnchor="middle" fontSize="12" fontFamily="var(--fm)" fill="#9b80e8">(U-perp)</text>
        <text x="260" y="16" textAnchor="middle" fontSize="13" fontFamily="var(--fm)" fill="#7a6e5e">{`V`}</text>
      </svg>
      <p style={{ textAlign:'center', fontSize:'.85rem', fontStyle:'italic', color:'var(--lec-ink3)', margin:'10px 0 0' }}>
        {String.raw`$V = U \oplus U^{\perp}$ — every vector in $V$ splits `}<b>uniquely</b>{String.raw` into a piece that lies in $U$ and a piece that lies in $U^{\perp}$, and the two pieces are orthogonal to each other.`}
      </p>
    </div>
  );
}

/* ═══════════════ PAGE ═══════════════ */
export default function Lec19() {
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
        <span style={{color:'var(--text2)'}}>Week 6 · Lecture 19</span>
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
            <Link href={PREV_HREF} style={{ display:'flex', alignItems:'center', padding:'0 16px', height:'100%', fontFamily:'var(--fm)', fontSize:'.72rem', color:'var(--lec-ink3)', borderRight:'1px solid var(--lec-border)', whiteSpace:'nowrap', flexShrink:0, textDecoration:'none' }}>← Lecture 18</Link>
            <div style={{ flex:1, display:'flex', justifyContent:'center', alignItems:'center', gap:'4px', overflowX:'auto', padding:'0 8px' }}>
              <span style={{ fontFamily:'var(--fm)', fontSize:'.6rem', letterSpacing:'.12em', textTransform:'uppercase', color:'var(--lec-accent)', flexShrink:0, marginRight:'6px' }}>On this page</span>
              {ANCHORS.map(([label,id],i)=>(
                <span key={id} style={{display:'inline-flex',alignItems:'center',flexShrink:0}}>
                  {i>0&&<span style={{color:'var(--lec-border)',margin:'0 7px'}}>·</span>}
                  <a href={`#${id}`} onClick={e=>jump(e,id)} style={{fontFamily:'var(--fm)',fontSize:'.73rem',color:'var(--lec-ink2)',textDecoration:'none',whiteSpace:'nowrap'}}>{label}</a>
                </span>
              ))}
            </div>
            <Link href={NEXT_HREF} style={{ display:'flex', alignItems:'center', padding:'0 16px', height:'100%', fontFamily:'var(--fm)', fontSize:'.72rem', color:'var(--lec-ink3)', borderLeft:'1px solid var(--lec-border)', whiteSpace:'nowrap', flexShrink:0, textDecoration:'none' }}>Lecture 20 →</Link>
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
              <div style={{ marginTop:'12px', fontFamily:'var(--fm)', fontSize:'.72rem', color:'#9b80e8', letterSpacing:'.06em' }}>Week 6 begins — Monday, 13 July 2026</div>
            </div>

            {/* ─── §1 MOTIVATION ─── */}
            <Sec id="motivation" n="§1">Motivation — Getting as Close as Possible</Sec>

            <p>{String.raw`Every lecture since Week 5 has been building toward one very human question: given a target you `}<i>cannot</i>{String.raw` reach exactly, what is the best you `}<i>can</i>{String.raw` do? You cannot always solve $A\mathbf{x}=\mathbf{b}$ exactly — but you can always find the closest point in a subspace to a point outside it. That single idea, "closest point," is the entire engine behind GPS positioning, noise-cancelling headphones, recommendation engines, and — as you will use constantly in later courses — least-squares regression, where you fit a line or curve that cannot pass through every data point but gets as close as mathematically possible to all of them at once.`}</p>

            <Callout icon="📜" title="A bit of history — principal axes, 1829" color="violet">
              {String.raw`Long before anyone wrote the words "eigenvector" or "orthogonal complement," physicists needed to solve a very physical problem: a spinning rigid body (a planet, a wheel, a tumbling asteroid) has a `}<i>moment of inertia</i>{String.raw` described by a symmetric matrix. The body spins most naturally about certain special, mutually perpendicular axes — its `}<b>principal axes</b>{String.raw` — and finding them was a real engineering necessity, not an abstract exercise. In 1829, `}<b>Augustin-Louis Cauchy</b>{String.raw` proved what we now call the spectral theorem for symmetric matrices: that these principal axes always exist, are always perpendicular to each other, and the matrix always simplifies completely in that rotated frame. What you'll prove today, in a few clean lines, is the same theorem Cauchy needed heavy 19th-century machinery for.`}
            </Callout>

            <Callout icon="🧭" title="Where the Gram–Schmidt process comes in" color="teal">
              {String.raw`The names `}<b>Jørgen Pedersen Gram</b>{String.raw` (a Danish actuary, 1883) and `}<b>Erhard Schmidt</b>{String.raw` (a German mathematician, 1907) are attached to the orthogonalization process you already built in Lecture 18. Today it stops being a standalone trick and becomes the `}<i>tool</i>{String.raw` that makes everything else in this lecture computable — every orthogonal projection below is built from an orthogonal basis, and Gram–Schmidt is how you get one. If you need a refresher on the mechanics, Lecture 18, §"Gram–Schmidt: How" has the full derivation — we will not repeat it here, only use it.`}
            </Callout>

            {/* ═══════════ PART A ═══════════ */}
            <Sec id="shortest-distance" n="§2">Part A — Shortest Distance From a Point to a Plane</Sec>

            <p>{String.raw`Here is the motivating problem for the entire lecture, stated as simply as possible: `}<b>determine the shortest distance between a point $P$ and a subspace $U$ through the origin</b>{String.raw` (in $\mathbb{R}^3$, picture $U$ as a plane through the origin, and $P$ as a point floating somewhere off that plane).`}</p>

            <ProjectionFigure/>

            <p>{String.raw`Intuitively — and this is exactly what the picture shows — the shortest path from $P$ down to the plane is a straight perpendicular drop. Where that perpendicular lands is a special point in $U$, called the `}<b>orthogonal projection</b>{String.raw` of $P$ onto $U$, written $\text{Proj}_U(P)$.`}</p>

            <DefBox term="The key fact" color="amber">
              <p style={{margin:0}}>{String.raw`$$\text{shortest distance from } P \text{ to } U \;=\; \text{distance from } P \text{ to } \text{Proj}_U(P) \;=\; \|P - \text{Proj}_U(P)\|.$$`}</p>
            </DefBox>

            <Callout icon="⚠️" title="The one thing you must not skip" color="rose">
              {String.raw`To actually `}<i>compute</i>{String.raw` $\text{Proj}_U(P)$, you need an `}<b>orthogonal</b>{String.raw` basis of $U$ — not just any basis. The projection formula below only works term-by-term because the basis vectors don't interfere with each other; feed it a non-orthogonal basis and the formula silently gives the wrong answer. This is precisely why Gram–Schmidt exists: it is the machine that turns any basis of $U$ into an orthogonal one, and it is a `}<i>required</i>{String.raw` step, not an optional cleanup, every single time you project onto a subspace of dimension $2$ or higher.`}
            </Callout>

            {/* ─── §3 EXAMPLE 8.1.4 ─── */}
            <Sec id="ex814" n="§3">Example 8.1.4 — Finding the Closest Point in a Plane</Sec>

            <Example n="1" title="Example 8.1.4 — closest point to (2,-1,-3) in the plane 2x+y-z=0" advanced>
              <p>{String.raw`Find the point in the plane $U = \{(x,y,z) : 2x+y-z=0\}$ closest to the point $P=(2,-1,-3)$, and find that shortest distance.`}</p>
              <Reveal label="Show full solution">

                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Step 1 — parametrize the plane.}$ Let $x=t$ and $z=s$ be free. From $2x+y-z=0$, we get $y = z-2x = s-2t$. So every point of $U$ has the form $(t,\,s-2t,\,s)$.`}</p>

                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Step 2 — write it as a linear combination.}$`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$u = (t,\, s-2t,\, s) = t(1,-2,0) + s(0,1,1).$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`So $U = \operatorname{span}\{u_2, u_1\}$ where $u_2=(1,-2,0)$ (the $t$-part) and $u_1=(0,1,1)$ (the $s$-part). Since neither is a multiple of the other, $\{u_1,u_2\}$ is a basis of $U$ — but check: $u_1\cdot u_2 = (0)(1)+(1)(-2)+(1)(0) = -2 \neq 0$. `}<b>Not orthogonal.</b>{String.raw` Gram–Schmidt is required before we can project.`}</p>

                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Step 3 — Gram–Schmidt.}$ Take $v_1=u_1=(0,1,1)$, then`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$v_2 = u_2 - \frac{u_2\cdot v_1}{v_1\cdot v_1}\,v_1.$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`Compute the two dot products first: $u_2\cdot v_1 = (1)(0)+(-2)(1)+(0)(1) = -2$, and $v_1\cdot v_1 = 0+1+1=2$. So`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$v_2 = (1,-2,0) - \frac{-2}{2}(0,1,1) = (1,-2,0) + (0,1,1) = (1,-1,1).$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Quick check:}$ $v_1\cdot v_2 = (0)(1)+(1)(-1)+(1)(1) = -1+1=0$. ✓ Orthogonal, as required. So $\{v_1,v_2\} = \{(0,1,1),\,(1,-1,1)\}$ is an `}<b>orthogonal basis</b>{String.raw` of $U$.`}</p>

                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Step 4 — the projection-splitting formula.}$ Because (and `}<i>only</i>{String.raw` because) $v_1\perp v_2$, the projection onto their span splits cleanly into a sum of two one-dimensional projections:`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$\text{Proj}_U(P) = \text{proj}_{v_1}(P) + \text{proj}_{v_2}(P) = \left(\frac{P\cdot v_1}{v_1\cdot v_1}\right)v_1 + \left(\frac{P\cdot v_2}{v_2\cdot v_2}\right)v_2.$$`}</p>

                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Step 5 — plug in } P=(2,-1,-3).$`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$P\cdot v_1 = (2)(0)+(-1)(1)+(-3)(1) = -4, \qquad v_1\cdot v_1=2 \;\Rightarrow\; \text{proj}_{v_1}(P) = \frac{-4}{2}(0,1,1) = (0,-2,-2).$$`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$P\cdot v_2 = (2)(1)+(-1)(-1)+(-3)(1) = 2+1-3 = 0 \;\Rightarrow\; \text{proj}_{v_2}(P) = \frac{0}{3}(1,-1,1) = (0,0,0).$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`Adding the two pieces:`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$\text{Proj}_U(P) = (0,-2,-2) + (0,0,0) = (0,-2,-2).$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`Sanity check: does $(0,-2,-2)$ satisfy $2x+y-z=0$? $\;2(0)+(-2)-(-2)=0$. ✓ It is genuinely in $U$.`}</p>

                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{The shortest distance:}$`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$\|P-\text{Proj}_U(P)\| = \|(2,-1,-3)-(0,-2,-2)\| = \|(2,1,-1)\| = \sqrt{4+1+1}=\sqrt{6}.$$`}</p>

                <p style={{margin:0}}>{String.raw`$\blacksquare$ `}<b>Cross-check against the point-to-plane formula:</b>{String.raw` for a plane $ax+by+cz=0$, the distance from a point $P_0$ is $|a x_0+b y_0+c z_0|/\sqrt{a^2+b^2+c^2}$. Here $a,b,c=(2,1,-1)$ and $P_0=(2,-1,-3)$, giving $|2(2)+1(-1)-1(-3)|/\sqrt6 = |4-1+3|/\sqrt6 = 6/\sqrt6=\sqrt6$. Exactly the same answer, computed two completely different ways.`}</p>
              </Reveal>
            </Example>

            <Callout icon="👀" title="Notice something remarkable" color="teal">
              {String.raw`The leftover vector $P - \text{Proj}_U(P) = (2,1,-1)$ is `}<i>exactly</i>{String.raw` the normal vector of the plane $2x+y-z=0$. That is not a coincidence — it is a perfect first example of the idea we build formally next: the leftover piece of $P$, after removing everything that lies in $U$, lands in a special subspace perpendicular to all of $U$. That subspace has a name — the `}<b>orthogonal complement</b>{String.raw` of $U$ — and we meet it right now.`}
            </Callout>

            {/* ═══════════ PART C ═══════════ */}
            <Sec id="orth-complement" n="§4">Part C — Orthogonal Complements</Sec>

            <DefBox term="Orthogonal complement" color="violet">
              <p style={{margin:0}}>{String.raw`If $U$ is a subspace of $\mathbb{R}^n$, its `}<b>orthogonal complement</b>{String.raw` is $$U^{\perp} = \{\,\mathbf{v} \text{ in } \mathbb{R}^n : \mathbf{v}\cdot\mathbf{u}=0 \text{ for every } \mathbf{u} \text{ in } U\,\} —$$ the set of `}<i>every</i>{String.raw` vector that is orthogonal to `}<i>all of</i>{String.raw` $U$ at once, not just to one vector in it.`}</p>
            </DefBox>

            <ComplementFigure/>

            <p>{String.raw`Two facts make $U^{\perp}$ worth naming: it is always itself a subspace (a short closure check, exactly like every other subspace proof you've done), and together $U$ and $U^{\perp}$ split the whole space with `}<b>no overlap and no gaps</b>{String.raw` — every vector decomposes uniquely into a piece from each, which is exactly what Part D will demonstrate by hand.`}</p>

            {/* ─── §5 COMPLEMENT EXAMPLE ─── */}
            <Sec id="complement-example" n="§5">Finding a Basis of U⊥ — the Easy Way, for a Plane</Sec>

            <Example n="2" title="A basis of U⊥ for U = {(x,y,z) : 2x+y-z=0}">
              <p style={{margin:'0 0 8px'}}>{String.raw`Look again at how $U$ was defined: $U = \{(x,y,z) : 2x+y-z=0\}$. The left-hand side $2x+y-z$ is `}<i>literally</i>{String.raw` the dot product of $(x,y,z)$ with the fixed vector $\mathbf{n}=(2,1,-1)$. So the defining equation of $U$ `}<b>is</b>{String.raw` a dot-product-equals-zero condition:`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$U = \{\mathbf{v} : \mathbf{n}\cdot\mathbf{v}=0\}.$$`}</p>
              <p style={{margin:'0 0 8px'}}>{String.raw`That says every vector in $U$ is already orthogonal to $\mathbf{n}$ — so $\mathbf{n}$ itself is orthogonal to all of $U$, meaning $\mathbf{n}\in U^{\perp}$. Since $U$ is $2$-dimensional inside $\mathbb{R}^3$, its complement must be $3-2=1$-dimensional, and one nonzero vector in $U^{\perp}$ is enough to span it:`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$U^{\perp} = \operatorname{span}\{(2,1,-1)\}.$$`}</p>
              <p style={{margin:0}}>{String.raw`This matches the leftover vector we found by direct computation two sections ago — no coincidence at all.`}</p>
            </Example>

            <Callout icon="🧠" title="Why this shortcut works — and when it stops working" color="amber">
              {String.raw`A plane through the origin in $\mathbb{R}^3$ is `}<i>always</i>{String.raw` defined by a single dot-product-equals-zero condition, and its normal vector `}<i>always</i>{String.raw` spans the (one-dimensional) orthogonal complement — no Gram–Schmidt needed, because there's only one direction to worry about. This is a special case of a general fact: $\dim U + \dim U^{\perp} = \dim V$ always holds. But for a `}<i>higher</i>{String.raw` dimensional $U$ (say a $3$-dimensional subspace of $\mathbb{R}^5$), reading off $U^{\perp}$ isn't a one-line trick — you would typically need to solve a homogeneous system (find every vector orthogonal to a spanning set of $U$) and, if you want an `}<i>orthogonal</i>{String.raw` basis of the result, run Gram–Schmidt on whatever basis that system produces.`}
            </Callout>

            {/* ─── §6 DECOMPOSITION EXAMPLE ─── */}
            <Sec id="decomposition-example" n="§6">Part D — Decomposing a Vector into U and U⊥</Sec>

            <p>{String.raw`Here is the general skill Part A's projection formula was secretly teaching: splitting `}<i>any</i>{String.raw` vector into its "inside $U$" piece and its "perpendicular to $U$" piece.`}</p>

            <Example n="3" title="Write (1,5,7) as a sum of a vector in U and a vector in U⊥" advanced>
              <p>{String.raw`Let $U = \operatorname{span}\{(1,-2,3),\,(-1,1,1)\}$. Write $(1,5,7)$ as the sum of a vector in $U$ and a vector in $U^{\perp}$.`}</p>
              <Reveal label="Show full solution">

                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Step 1 — check whether the spanning set is already orthogonal.}$`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$(1,-2,3)\cdot(-1,1,1) = -1-2+3 = 0.$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`It's already $0$ — no Gram–Schmidt needed here. Take $v_1=(1,-2,3)$ and $v_2=(-1,1,1)$ directly as the orthogonal basis of $U$.`}</p>

                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Step 2 — project } p=(1,5,7) \textbf{ onto each of } v_1, v_2.$`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$p\cdot v_1 = (1)(1)+(5)(-2)+(7)(3) = 1-10+21 = 12, \qquad v_1\cdot v_1 = 1+4+9=14,$$`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$\text{proj}_{v_1}(p) = \frac{12}{14}(1,-2,3) = \frac{6}{7}(1,-2,3) = \left(\tfrac{6}{7},-\tfrac{12}{7},\tfrac{18}{7}\right).$$`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$p\cdot v_2 = (1)(-1)+(5)(1)+(7)(1) = -1+5+7=11, \qquad v_2\cdot v_2 = 1+1+1=3,$$`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$\text{proj}_{v_2}(p) = \frac{11}{3}(-1,1,1) = \left(-\tfrac{11}{3},\tfrac{11}{3},\tfrac{11}{3}\right).$$`}</p>

                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Step 3 — add the two pieces to get }\text{Proj}_U(p)$ (common denominator $21$):`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$\text{Proj}_U(p) = \left(\tfrac{18}{21}-\tfrac{77}{21},\; -\tfrac{36}{21}+\tfrac{77}{21},\; \tfrac{54}{21}+\tfrac{77}{21}\right) = \left(-\tfrac{59}{21},\;\tfrac{41}{21},\;\tfrac{131}{21}\right).$$`}</p>

                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Step 4 — the } U^{\perp} \textbf{ piece is what's left over: } p - \text{Proj}_U(p).$`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$\left(1,5,7\right) - \left(-\tfrac{59}{21},\tfrac{41}{21},\tfrac{131}{21}\right) = \left(\tfrac{21}{21}+\tfrac{59}{21},\;\tfrac{105}{21}-\tfrac{41}{21},\;\tfrac{147}{21}-\tfrac{131}{21}\right) = \left(\tfrac{80}{21},\tfrac{64}{21},\tfrac{16}{21}\right).$$`}</p>

                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Step 5 — verify it's genuinely in } U^{\perp}$ by dotting it with $v_1$ and $v_2$ separately:`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$\left(\tfrac{80}{21},\tfrac{64}{21},\tfrac{16}{21}\right)\cdot(1,-2,3) = \tfrac{80-128+48}{21} = \tfrac{0}{21}=0. \qquad \left(\tfrac{80}{21},\tfrac{64}{21},\tfrac{16}{21}\right)\cdot(-1,1,1) = \tfrac{-80+64+16}{21}=\tfrac{0}{21}=0.$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`Both vanish — orthogonal to every spanning vector of $U$, hence orthogonal to all of $U$. Confirmed: this piece really is in $U^{\perp}$.`}</p>

                <p style={{margin:0}}>{String.raw`$\textbf{Final answer:}$`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$(1,5,7) = \underbrace{\left(-\tfrac{59}{21},\tfrac{41}{21},\tfrac{131}{21}\right)}_{\displaystyle \in\, U} \;+\; \underbrace{\left(\tfrac{80}{21},\tfrac{64}{21},\tfrac{16}{21}\right)}_{\displaystyle \in\, U^{\perp}}. \qquad \blacksquare$$`}</p>
              </Reveal>
            </Example>

            {/* ═══════════ PART E ═══════════ */}
            <Sec id="symmetric-matrices" n="§7">Part E — Symmetric Matrices</Sec>

            <p>{String.raw`We now turn from subspaces to a single, extraordinary class of matrices — the reward for everything built so far.`}</p>

            <DefBox term="Symmetric matrix" color="teal">
              <p style={{margin:0}}>{String.raw`A square matrix $A$ is `}<b>symmetric</b>{String.raw` if $A^T = A$ — that is, $A$ equals its own transpose, so $a_{ij}=a_{ji}$ for every $i,j$: the matrix is a mirror image of itself across its main diagonal.`}</p>
            </DefBox>

            <Callout icon="✨" title="The headline fact" color="amber">
              {String.raw`A symmetric matrix is `}<b>always</b>{String.raw` diagonalizable — no exceptions, no "if the eigenvalues happen to work out." Every symmetric matrix, no matter how it's built, has a full set of eigenvectors, and — as we're about to prove — those eigenvectors arrange themselves into `}<i>orthogonal</i>{String.raw` directions almost for free. One instructor's handwritten notes call this section `}<i>"Purely Magical."</i>{String.raw` It's a fair description.`}
            </Callout>

            {/* ─── §8 PROOF ─── */}
            <Sec id="orth-eigenvectors-proof" n="§8">Proof — Eigenvectors of a Symmetric Matrix Are Orthogonal</Sec>

            <p>{String.raw`Let $A$ be symmetric, and suppose $A\mathbf{x}=\lambda\mathbf{x}$ and $A\mathbf{y}=\mu\mathbf{y}$ for eigenvalues $\lambda \neq \mu$. We compute the single number $\mathbf{x}^T A\mathbf{y}$ `}<b>two different ways</b>{String.raw` and compare.`}</p>

            <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{First way — substitute } A\mathbf{y}=\mu\mathbf{y}$ directly:`}</p>
            <p style={{textAlign:'center'}}>{String.raw`$$\mathbf{x}^TA\mathbf{y} = \mathbf{x}^T(\mu\mathbf{y}) = \mu\,\mathbf{x}^T\mathbf{y}.$$`}</p>

            <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Second way — use symmetry, } A^T=A$, to move $A$ onto $\mathbf{x}$ instead:`}</p>
            <p style={{textAlign:'center'}}>{String.raw`$$\mathbf{x}^TA\mathbf{y} = (A^T\mathbf{x})^T\mathbf{y} = (A\mathbf{x})^T\mathbf{y} = (\lambda\mathbf{x})^T\mathbf{y} = \lambda\,\mathbf{x}^T\mathbf{y}.$$`}</p>

            <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Both computed the same quantity, so they must agree:}$`}</p>
            <p style={{textAlign:'center'}}>{String.raw`$$\lambda\,\mathbf{x}^T\mathbf{y} = \mu\,\mathbf{x}^T\mathbf{y} \quad\Longrightarrow\quad (\lambda-\mu)\,\mathbf{x}^T\mathbf{y}=0.$$`}</p>

            <p style={{margin:'0 0 8px'}}>{String.raw`Since $\lambda\neq\mu$, the factor $(\lambda-\mu)$ is nonzero, which forces the other factor to vanish:`}</p>
            <p style={{textAlign:'center'}}>{String.raw`$$\mathbf{x}^T\mathbf{y}=0, \quad \text{i.e.} \quad \mathbf{x}\cdot\mathbf{y}=0.$$`}</p>

            <DefBox term="Conclusion" color="rose">
              <p style={{margin:0}}>{String.raw`$\blacksquare$ `}<b>Eigenvectors of a symmetric matrix, corresponding to distinct eigenvalues, are automatically orthogonal.</b>{String.raw` No Gram–Schmidt is even needed across different eigenspaces — the symmetry of $A$ does that work for you.`}</p>
            </DefBox>

            {/* ─── §9 ORTHOGONAL DIAGONALIZATION ─── */}
            <Sec id="orth-diagonalization" n="§9">Theorem — Orthogonal Diagonalization</Sec>

            <ThmBox title="Orthogonal Diagonalization Theorem">
              <p style={{margin:0}}>{String.raw`Every symmetric matrix $A$ can be written as`}</p>
              <p style={{textAlign:'center', margin:'10px 0'}}>{String.raw`$$A = PDP^T$$`}</p>
              <p style={{margin:0}}>{String.raw`where $D$ is the diagonal matrix of eigenvalues of $A$, and $P$ is an `}<b>orthogonal matrix</b>{String.raw` — its columns are the corresponding eigenvectors of $A$, each first `}<b>normalized</b>{String.raw` to unit length before being placed in $P$.`}</p>
            </ThmBox>

            <Callout icon="💡" title="Why this matters — the practical payoff" color="teal">
              {String.raw`Compare with ordinary diagonalization, $A=PDP^{-1}$, which in general requires you to actually compute a matrix inverse — real work, and numerically delicate for large matrices. Because the columns of $P$ here are `}<b>orthonormal</b>{String.raw` (mutually orthogonal `}<i>and</i>{String.raw` unit length), $P^TP=I$, which means`}
              <p style={{textAlign:'center', margin:'10px 0 0'}}>{String.raw`$$P^{-1} = P^T.$$`}</p>
              {String.raw`Transposing a matrix costs nothing — you just relabel rows as columns. `}<b>No inversion, ever.</b>{String.raw` This is the entire practical reason orthogonal diagonalization is worth learning as its own theorem rather than a special case of ordinary diagonalization: for symmetric matrices, which are everywhere in applications (covariance matrices in statistics, stress tensors in engineering, adjacency matrices of undirected graphs, Hessians in optimization), diagonalizing is dramatically cheaper.`}
            </Callout>

            {/* ─── §10 WORKED EXAMPLE ─── */}
            <Sec id="sym-example" n="§10">A Fully Worked Orthogonal Diagonalization</Sec>

            <Example n="4" title="Orthogonally diagonalize A = [[2,1],[1,2]]" advanced>
              <p>{String.raw`Find an orthogonal matrix $P$ and diagonal matrix $D$ such that $A=PDP^T$, for $A=\begin{bmatrix}2&1\\1&2\end{bmatrix}$.`}</p>
              <Reveal label="Show full solution">

                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Step 1 — check symmetry.}$ $A^T = \begin{bmatrix}2&1\\1&2\end{bmatrix} = A$. ✓ Symmetric, so orthogonal diagonalization is guaranteed to work.`}</p>

                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Step 2 — eigenvalues.}$ $\det(A-\lambda I) = (2-\lambda)^2 - 1 = 0 \;\Rightarrow\; 2-\lambda=\pm1 \;\Rightarrow\; \lambda=1 \text{ or } \lambda=3.$`}</p>

                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Step 3 — eigenvectors.}$ For $\lambda=1$: $(A-I)\mathbf{x}=\mathbf{0} \Rightarrow \begin{bmatrix}1&1\\1&1\end{bmatrix}\mathbf{x}=\mathbf{0} \Rightarrow x_1=-x_2$, giving eigenvector $(1,-1)$. For $\lambda=3$: $(A-3I)\mathbf{x}=\mathbf{0} \Rightarrow \begin{bmatrix}-1&1\\1&-1\end{bmatrix}\mathbf{x}=\mathbf{0} \Rightarrow x_1=x_2$, giving eigenvector $(1,1)$.`}</p>

                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Step 4 — confirm orthogonality}$ (guaranteed by the theorem just proved, since $\lambda\neq\mu$): $(1,-1)\cdot(1,1) = 1-1=0$. ✓`}</p>

                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Step 5 — normalize each eigenvector}$ to unit length: $\|(1,-1)\|=\sqrt2$ and $\|(1,1)\|=\sqrt2$, giving $\left(\tfrac{1}{\sqrt2},-\tfrac{1}{\sqrt2}\right)$ and $\left(\tfrac{1}{\sqrt2},\tfrac{1}{\sqrt2}\right)$.`}</p>

                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Step 6 — assemble } P \textbf{ and } D$ (columns of $P$ in the same order as the eigenvalues on the diagonal of $D$):`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$P = \begin{bmatrix} \tfrac{1}{\sqrt2} & \tfrac{1}{\sqrt2} \\[4pt] -\tfrac{1}{\sqrt2} & \tfrac{1}{\sqrt2} \end{bmatrix}, \qquad D = \begin{bmatrix} 1 & 0 \\ 0 & 3 \end{bmatrix}.$$`}</p>

                <p style={{margin:0}}>{String.raw`$\blacksquare$ `}<b>Check:</b>{String.raw` $P^TP = I$ (both columns are unit length and orthogonal to each other), so $P^{-1}=P^T$ with zero extra work — and $PDP^T$ does reconstruct $A$ exactly (you can verify this by direct multiplication).`}</p>
              </Reveal>
            </Example>

            {/* ─── §11 EXERCISES ─── */}
            <Sec id="exercises" n="§11">Exercises</Sec>

            <p style={{fontStyle:'italic', color:'var(--lec-ink3)'}}>{String.raw`Three problems, one for each idea in this lecture. Hints only — work through the method yourself before checking.`}</p>

            <Exercise id="A" title="Closest point in a plane">
              <p>{String.raw`Find the point in the plane $x-y+2z=0$ closest to $(3,0,1)$, and the shortest distance.`}</p>
              <Callout icon="🧭" title="Hint" color="teal">
                {String.raw`Same four moves as Example 8.1.4: parametrize the plane to get a (non-orthogonal) spanning set, run Gram–Schmidt to get an orthogonal basis $\{v_1,v_2\}$, project the point onto each $v_i$ and add, then subtract from the original point to get the distance vector. Cross-check your final distance against $|n\cdot P_0|/\|n\|$ with $n=(1,-1,2)$ — they must agree.`}
              </Callout>
            </Exercise>

            <Exercise id="B" title="Decompose into U and U⊥">
              <p>{String.raw`Let $U = \operatorname{span}\{(2,0,-1),\,(1,3,2)\}$. Write $(4,1,5)$ as the sum of a vector in $U$ and a vector in $U^{\perp}$.`}</p>
              <Callout icon="🧭" title="Hint" color="teal">
                {String.raw`Check the two spanning vectors' dot product first — if it's already $0$ (as in Example 3), you can skip Gram–Schmidt entirely and project directly. Follow the same five steps as Example 3: project onto each basis vector, add for $\text{Proj}_U(p)$, subtract from $p$ for the $U^{\perp}$ piece, and verify by dotting that piece against both basis vectors of $U$.`}
              </Callout>
            </Exercise>

            <Exercise id="C" title="Orthogonally diagonalize another symmetric matrix">
              <p>{String.raw`Find an orthogonal matrix $P$ and diagonal matrix $D$ with $A=PDP^T$, for $A=\begin{bmatrix}3&1\\1&3\end{bmatrix}$.`}</p>
              <Callout icon="🧭" title="Hint" color="teal">
                {String.raw`Follow Example 4 exactly: confirm $A$ is symmetric, find the two eigenvalues from $(3-\lambda)^2-1=0$, find one eigenvector per eigenvalue, confirm they're orthogonal (guaranteed, since the eigenvalues are distinct), normalize both to unit length, and assemble $P$ and $D$ with matching column/diagonal order.`}
              </Callout>
            </Exercise>

            <Callout icon="🔭" title="Where this leads next" color="violet">
              {String.raw`Everything today — projections, complements, orthogonal diagonalization — has been about decomposing space and simplifying matrices that already act "nicely." Lecture 20 turns the question around: instead of studying special matrices, we study `}<b>linear transformations</b>{String.raw` themselves — the general maps that matrices represent — and ask what survives when you change coordinate systems entirely.`}
            </Callout>

            {/* CLOSING */}
            <div style={{ marginTop:'48px', padding:'28px 32px', background:'rgba(56,201,176,.08)', border:'2px solid rgba(56,201,176,.35)', borderRadius:'16px' }}>
              <div style={{ fontFamily:'var(--fm)', fontSize:'.7rem', letterSpacing:'.16em', textTransform:'uppercase', color:'#2a9d8f', marginBottom:'12px' }}>Looking back</div>
              <p style={{ fontFamily:'var(--fh)', fontSize:'1.4rem', color:'var(--lec-ink)', margin:'0 0 16px', fontWeight:400, lineHeight:1.3 }}>
                Drop a perpendicular, split a vector in two, and watch a symmetric matrix diagonalize itself for free.
              </p>
              <p style={{ color:'var(--lec-ink2)', fontSize:'.97rem', lineHeight:1.8, margin:0 }}>
                {String.raw`The orthogonal projection formula, the direct-sum split $V=U\oplus U^{\perp}$, and the spectral theorem for symmetric matrices are not three separate topics — they are one idea, applied three times. Once you have an orthogonal basis, everything in linear algebra gets cheaper: coordinates become dot products, projections become sums, and matrix inversion becomes a transpose.`}
              </p>
            </div>

            {/* ANNOUNCEMENTS — administrative note, kept separate from the mathematics */}
            <div style={{ marginTop:'40px', padding:'20px 24px', background:'rgba(0,0,0,.025)', border:'1px dashed var(--lec-border)', borderRadius:'14px' }}>
              <div style={{ fontFamily:'var(--fm)', fontSize:'.68rem', letterSpacing:'.14em', textTransform:'uppercase', color:'var(--lec-ink3)', marginBottom:'10px' }}>📌 Course Administration — not examinable, informational only</div>
              <p style={{ fontSize:'.92rem', color:'var(--lec-ink3)', lineHeight:1.75, margin:0 }}>
                {String.raw`The Final Exam is worth `}<b>80 marks</b>{String.raw`. There appears to be a partial midterm-replacement policy for students who scored `}<b>40 or above</b>{String.raw` on the midterm, involving a ratio structure (roughly `}<b>20:80</b>{String.raw` and `}<b>1:4</b>{String.raw`) that governs how final-exam performance can offset the midterm grade. `}<b>The exact mechanics are unclear from the lecture notes this was transcribed from</b>{String.raw` — please confirm the precise wording, thresholds, and eligibility directly with the instructor rather than relying on this summary.`}
              </p>
            </div>

            <div style={{ marginTop:'64px', paddingTop:'28px', borderTop:'2px solid var(--lec-border)', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'12px' }}>
              <div style={{ fontFamily:'var(--fm)', fontSize:'.76rem', color:'var(--lec-ink3)', fontStyle:'italic' }}>Lecture 19 — complete</div>
              <div style={{ fontFamily:'var(--fm)', fontSize:'.76rem', color:'var(--lec-ink3)' }}>MATH-120 · Shoaib Khan · LUMS · July 2026</div>
            </div>
          </div>

          {/* FOOTER NAV */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'22px 48px', borderTop:'1px solid var(--lec-border)', background:'var(--lec-paper)', flexWrap:'wrap', gap:'12px' }}>
            <Link href={PREV_HREF} style={{ fontFamily:'var(--fm)', fontSize:'.74rem', letterSpacing:'.08em', textTransform:'uppercase', color:'var(--lec-accent)', textDecoration:'none' }}>← Lecture 18</Link>
            <Link href={NEXT_HREF} style={{ fontFamily:'var(--fm)', fontSize:'.74rem', letterSpacing:'.08em', textTransform:'uppercase', color:'var(--lec-accent)', textDecoration:'none' }}>Lecture 20 →</Link>
          </div>
        </main>
      </div>

      <Footer/>
    </>
  );
}
