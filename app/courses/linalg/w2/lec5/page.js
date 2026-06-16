'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import Navbar from '../../../../components/Navbar';
import Footer from '../../../../components/Footer';

/* ════════════════════════════════════════════════════════════
   MATH-120 · LECTURE 5
   Matrix Algebra: Addition, Scalar Multiplication, and Transpose
   Route: /courses/linalg/w2/lec5
   ════════════════════════════════════════════════════════════ */

const LECTURES = [
  { week: 1, n: 1, slug: 'w1/lec1', title: 'The Language of Matrices', live: true },
  { week: 1, n: 2, slug: 'w1/lec2', title: 'Row Operations & Gaussian Elimination', live: true },
  { week: 1, n: 3, slug: 'w1/lec3', title: 'RREF, Homogeneous Systems & Linear Combinations', live: true },
  { week: 1, n: 4, slug: 'w1/lec4', title: 'Solution Structure & Applications', live: true },
  { week: 2, n: 5, slug: 'w2/lec5', title: 'Matrix Algebra: Addition, Scalar Multiplication & Transpose', live: true },
];
const THIS_SLUG = 'w2/lec5';
const PREV_HREF  = '/courses/linalg/w1/lec4';
const NEXT_HREF  = '/courses/linalg/w2/lec6';

const LEC = {
  course: 'MATH-120 · Linear Algebra',
  number: 'Lecture 5',
  title: 'Matrix Algebra: Addition, Scalar Multiplication & Transpose',
  subtitle: 'The first operations of matrix arithmetic — and the algebraic laws that make matrices behave like numbers',
  date: '15 June 2026',
};

const ANCHORS = [
  ['Matrices', 'matrices'],
  ['Addition', 'addition'],
  ['Scalar Mult.', 'scalar'],
  ['Transpose', 'transpose'],
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

function NoteBox({ children }) {
  return (
    <div style={{ background:'rgba(0,0,0,.04)', borderLeft:'4px solid #7a6e5e', borderRadius:'0 10px 10px 0', padding:'14px 20px', margin:'20px 0' }}>
      <div style={{ color:'var(--lec-ink2)', lineHeight:1.75, fontSize:'.96rem' }}>{children}</div>
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

function SubH({ children }) {
  return <p style={{ fontFamily:'var(--fh)', fontSize:'1.3rem', color:'var(--lec-ink)', margin:'36px 0 12px', fontWeight:600 }}>{children}</p>;
}

/* ═══════════════ PAGE ═══════════════ */
export default function Lec5() {
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
        <span style={{color:'var(--text2)'}}>Week 2 · Lecture 5</span>
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
            <Link href={PREV_HREF} style={{ display:'flex', alignItems:'center', padding:'0 16px', height:'100%', fontFamily:'var(--fm)', fontSize:'.72rem', color:'var(--lec-ink3)', borderRight:'1px solid var(--lec-border)', whiteSpace:'nowrap', flexShrink:0, textDecoration:'none' }}>← Lecture 4</Link>
            <div style={{ flex:1, display:'flex', justifyContent:'center', alignItems:'center', gap:'4px', overflowX:'auto', padding:'0 8px' }}>
              <span style={{ fontFamily:'var(--fm)', fontSize:'.6rem', letterSpacing:'.12em', textTransform:'uppercase', color:'var(--lec-accent)', flexShrink:0, marginRight:'6px' }}>On this page</span>
              {ANCHORS.map(([label,id],i)=>(
                <span key={id} style={{display:'inline-flex',alignItems:'center',flexShrink:0}}>
                  {i>0&&<span style={{color:'var(--lec-border)',margin:'0 7px'}}>·</span>}
                  <a href={`#${id}`} onClick={e=>jump(e,id)} style={{fontFamily:'var(--fm)',fontSize:'.73rem',color:'var(--lec-ink2)',textDecoration:'none',whiteSpace:'nowrap'}}>{label}</a>
                </span>
              ))}
            </div>
            <Link href={NEXT_HREF} style={{ display:'flex', alignItems:'center', padding:'0 16px', height:'100%', fontFamily:'var(--fm)', fontSize:'.72rem', color:'var(--lec-ink3)', borderLeft:'1px solid var(--lec-border)', whiteSpace:'nowrap', flexShrink:0, textDecoration:'none' }}>Lecture 6 →</Link>
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

            {/* ─── §1 A QUICK LOOK AT MATRICES ─── */}
            <Sec id="matrices" n="§1">A Quick Look at Matrices</Sec>

            <p>A <b>matrix</b> is a rectangular array of numbers arranged in rows and columns. The numbers are called the <b>entries</b> of the matrix. Matrices are usually denoted by capital letters: {String.raw`$A$`}, {String.raw`$B$`}, {String.raw`$C$`}, …</p>

            <p style={{textAlign:'center'}}>{String.raw`$$A = \begin{bmatrix} 1 & 2 & -1 \\ 0 & 5 & 6 \end{bmatrix}, \qquad B = \begin{bmatrix} 1 & -1 \\ 0 & 2 \end{bmatrix}, \qquad C = \begin{bmatrix} 1 \\ 3 \\ 2 \end{bmatrix}.$$`}</p>

            <p>A matrix with {String.raw`$m$`} rows and {String.raw`$n$`} columns is called an {String.raw`$m\times n$`} matrix (read "{String.raw`$m$`} by {String.raw`$n$`}") and is said to have <b>size</b> {String.raw`$m\times n$`}. Above, {String.raw`$A$`} is {String.raw`$2\times3$`}, {String.raw`$B$`} is {String.raw`$2\times2$`}, and {String.raw`$C$`} is {String.raw`$3\times1$`}.</p>

            <ul style={{ color:'var(--lec-ink2)', lineHeight:1.85, fontSize:'1.02rem', paddingLeft:'22px' }}>
              <li>A {String.raw`$1\times n$`} matrix is called a <b>row matrix</b>.</li>
              <li>An {String.raw`$m\times 1$`} matrix is called a <b>column matrix</b> (or <b>column vector</b>).</li>
              <li>An {String.raw`$n\times n$`} matrix is called a <b>square matrix</b>.</li>
            </ul>

            <p><b>Entry notation.</b> The <b>{String.raw`$(i,j)$`}-entry</b> of {String.raw`$A$`} is the number in row {String.raw`$i$`} and column {String.raw`$j$`}, written {String.raw`$a_{ij}$`}. So {String.raw`$A = [a_{ij}]$`}. The first subscript is always the row, the second is always the column.</p>

            <Example n="1.1">
              <p>{String.raw`For $A = \begin{bmatrix} 1 & 2 & -1 \\ 0 & 5 & 6 \end{bmatrix}$: $a_{11}=1$, $a_{12}=2$, $a_{13}=-1$, $a_{21}=0$, $a_{22}=5$, $a_{23}=6$.`}</p>
            </Example>

            <p><b>Equality.</b> Two matrices {String.raw`$A=[a_{ij}]$`} and {String.raw`$B=[b_{ij}]$`} are <b>equal</b> (written {String.raw`$A=B$`}) if and only if they have the same size <i>and</i> every corresponding entry is equal:</p>
            <p style={{textAlign:'center'}}>{String.raw`$$A = B \iff a_{ij} = b_{ij} \text{ for all } i,j.$$`}</p>

            {/* ─── §2 MATRIX ADDITION ─── */}
            <Sec id="addition" n="§2">Matrix Addition</Sec>

            <DefBox term="Matrix Addition" color="violet">
              <p style={{margin:0}}>{String.raw`Let $A=[a_{ij}]$ and $B=[b_{ij}]$ be two matrices `}<i>of the same size</i>{String.raw` $m\times n$. Their `}<b>sum</b>{String.raw` $A+B$ is the $m\times n$ matrix obtained by adding corresponding entries: $A + B = [a_{ij}+b_{ij}].$`}</p>
            </DefBox>

            <NoteBox>
              <b>Important.</b> Addition is only defined when {String.raw`$A$`} and {String.raw`$B$`} have <i>exactly</i> the same size. You cannot add a {String.raw`$2\times3$`} matrix to a {String.raw`$2\times2$`} matrix.
            </NoteBox>

            <Example n="2.1" title="Basic addition">
              <p style={{textAlign:'center'}}>{String.raw`$$\begin{bmatrix} 1 & -1 \\ 2 & 3 \end{bmatrix} + \begin{bmatrix} 4 & 2 \\ -1 & 0 \end{bmatrix} = \begin{bmatrix} 1+4 & -1+2 \\ 2+(-1) & 3+0 \end{bmatrix} = \begin{bmatrix} 5 & 1 \\ 1 & 3 \end{bmatrix}.$$`}</p>
            </Example>

            <Example n="2.2" title="Three matrices added together">
              <p style={{textAlign:'center'}}>{String.raw`$$\begin{bmatrix}1&0&-2\\3&1&4\end{bmatrix} +\begin{bmatrix}0&2&1\\-1&0&2\end{bmatrix} +\begin{bmatrix}2&-1&0\\0&3&-3\end{bmatrix} =\begin{bmatrix}3&1&-1\\2&4&3\end{bmatrix}.$$`}</p>
            </Example>

            <Example n="2.3" title="Addition with variables — solve for entries">
              <p>{String.raw`Find $a$ and $b$ if`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$\begin{bmatrix}a & 2\\1 & b\end{bmatrix} +\begin{bmatrix}3 & -1\\0 & 4\end{bmatrix} =\begin{bmatrix}5 & 1\\1 & 6\end{bmatrix}.$$`}</p>
              <p>{String.raw`$\textit{Solution.}$ Entry-by-entry: $(1,1)$: $a+3=5 \Rightarrow a=2$; $\quad$ $(2,2)$: $b+4=6 \Rightarrow b=2$.`}</p>
            </Example>

            <Example n="2.4" title="Finding an unknown matrix by addition">
              <p>{String.raw`Find matrix $X$ if $X + \begin{bmatrix}2&1\\-1&3\end{bmatrix} = \begin{bmatrix}5&0\\2&1\end{bmatrix}.$`}</p>
              <p>{String.raw`$\textit{Solution.}$ Subtract the known matrix from both sides (entry by entry):`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$X = \begin{bmatrix}5&0\\2&1\end{bmatrix} - \begin{bmatrix}2&1\\-1&3\end{bmatrix} = \begin{bmatrix}3&-1\\3&-2\end{bmatrix}.$$`}</p>
            </Example>

            <SubH>Matrix Subtraction</SubH>
            <p>The <b>difference</b> {String.raw`$A - B$`} is defined entry-by-entry in the same way: {String.raw`$A - B = [a_{ij} - b_{ij}].$`}</p>

            <Example n="2.5">
              <p style={{textAlign:'center'}}>{String.raw`$$\begin{bmatrix}5&3\\-1&2\end{bmatrix} -\begin{bmatrix}2&-1\\4&0\end{bmatrix} =\begin{bmatrix}3&4\\-5&2\end{bmatrix}.$$`}</p>
            </Example>

            <SubH>Laws of Matrix Addition</SubH>
            <p>Matrix addition satisfies the same basic laws as ordinary addition of numbers.</p>

            <ThmBox title="Laws of Matrix Addition">
              <p style={{margin:'0 0 8px'}}>{String.raw`Let $A$, $B$, $C$ be $m\times n$ matrices. Then:`}</p>
              <ol style={{ margin:0, paddingLeft:'22px', lineHeight:1.9 }}>
                <li><b>Commutative:</b> {String.raw`$A+B = B+A$`}.</li>
                <li><b>Associative:</b> {String.raw`$A+(B+C)=(A+B)+C$`}.</li>
                <li><b>Zero matrix:</b> {String.raw`There is an $m\times n$ zero matrix $0$ such that $A+0=A$ for every $A$.`}</li>
                <li><b>Additive inverse:</b> {String.raw`For each $A$ there is a matrix $-A$ such that $A+(-A)=0$. ($-A$ is obtained by negating every entry of $A$.)`}</li>
              </ol>
            </ThmBox>

            <p><b>Why is addition commutative?</b> Because real-number addition is commutative: {String.raw`$a_{ij}+b_{ij}=b_{ij}+a_{ij}$`} for every entry. The matrix law follows immediately.</p>

            <Example n="2.6">
              <p>{String.raw`Let $A=\begin{bmatrix}1&2\\3&4\end{bmatrix}$ and $B=\begin{bmatrix}5&6\\7&8\end{bmatrix}$.`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$A+B=\begin{bmatrix}6&8\\10&12\end{bmatrix}=B+A. \quad\checkmark$$`}</p>
            </Example>

            <p>The <b>zero matrix</b> {String.raw`$O_{m\times n}$`} (all entries zero) plays the role of "{String.raw`$0$`}" for {String.raw`$m\times n$`} matrices:</p>
            <p style={{textAlign:'center'}}>{String.raw`$$A + O = A \quad \text{and} \quad A + (-A) = O.$$`}</p>

            {/* ─── §3 SCALAR MULTIPLICATION ─── */}
            <Sec id="scalar" n="§3">Scalar Multiplication</Sec>

            <DefBox term="Scalar Multiplication" color="violet">
              <p style={{margin:0}}>{String.raw`Let $A=[a_{ij}]$ be an $m\times n$ matrix and let $k$ be any real number (called a `}<b>scalar</b>{String.raw`). The `}<b>scalar multiple</b>{String.raw` $kA$ is the $m\times n$ matrix obtained by multiplying every entry of $A$ by $k$: $kA = [k\,a_{ij}].$`}</p>
            </DefBox>

            <Example n="3.1" title="Basic scalar multiplication">
              <p style={{textAlign:'center'}}>{String.raw`$$3\begin{bmatrix}1&-2\\0&4\end{bmatrix} = \begin{bmatrix}3\cdot1&3\cdot(-2)\\3\cdot0&3\cdot4\end{bmatrix} = \begin{bmatrix}3&-6\\0&12\end{bmatrix}.$$`}</p>
            </Example>

            <Example n="3.2" title="Negative scalar">
              <p style={{textAlign:'center'}}>{String.raw`$$-2\begin{bmatrix}1&3\\-1&5\end{bmatrix} =\begin{bmatrix}-2&-6\\2&-10\end{bmatrix}.$$`}</p>
            </Example>

            <Example n="3.3" title="Fractional scalar">
              <p style={{textAlign:'center'}}>{String.raw`$$\frac{1}{2}\begin{bmatrix}4&-6\\2&8\end{bmatrix} =\begin{bmatrix}2&-3\\1&4\end{bmatrix}.$$`}</p>
            </Example>

            <Example n="3.4" title="Combining addition and scalar multiplication">
              <p>{String.raw`Let $A=\begin{bmatrix}1&0\\-1&2\end{bmatrix}$ and $B=\begin{bmatrix}2&-1\\3&0\end{bmatrix}$. Find $2A-3B$.`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$2A = \begin{bmatrix}2&0\\-2&4\end{bmatrix}, \qquad 3B = \begin{bmatrix}6&-3\\9&0\end{bmatrix}.$$`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$2A-3B = \begin{bmatrix}2-6&0-(-3)\\-2-9&4-0\end{bmatrix} = \begin{bmatrix}-4&3\\-11&4\end{bmatrix}.$$`}</p>
            </Example>

            <SubH>Algebraic Laws (Theorem 2.1.1 — Nicholson)</SubH>

            <ThmBox title="Theorem 2.1.1">
              <p style={{margin:'0 0 8px'}}>{String.raw`Let $A$, $B$, $C$ be $m\times n$ matrices and let $k$, $p$ be scalars.`}</p>
              <ol style={{ margin:0, paddingLeft:'22px', lineHeight:1.9 }}>
                <li>{String.raw`$A+B = B+A$`}</li>
                <li>{String.raw`$A+(B+C)=(A+B)+C$`}</li>
                <li>{String.raw`There is an $m\times n$ matrix $O$ such that $O+A=A$ for each $A$.`}</li>
                <li>{String.raw`For each $A$ there is an $m\times n$ matrix $-A$ such that $A+(-A)=O$.`}</li>
                <li>{String.raw`$k(A+B)=kA+kB$`}</li>
                <li>{String.raw`$(k+p)A = kA+pA$`}</li>
                <li>{String.raw`$(kp)A = k(pA)$`}</li>
                <li>{String.raw`$1A = A$`}</li>
              </ol>
            </ThmBox>

            <p>Laws 1–4 are the addition laws stated earlier. Laws 5–8 describe how scalars interact with matrix addition and with each other.</p>

            <Example n="3.5" title="Using Law 5 — distributivity">
              <p>{String.raw`Let $k=3$, $A=\begin{bmatrix}1&2\\0&-1\end{bmatrix}$, $B=\begin{bmatrix}-1&0\\2&3\end{bmatrix}$.`}</p>
              <p>{String.raw`$\textit{Method 1 (compute $A+B$ first, then multiply):}$`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$A+B=\begin{bmatrix}0&2\\2&2\end{bmatrix}, \qquad 3(A+B)=\begin{bmatrix}0&6\\6&6\end{bmatrix}.$$`}</p>
              <p>{String.raw`$\textit{Method 2 (distribute first):}$`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$3A=\begin{bmatrix}3&6\\0&-3\end{bmatrix},\quad 3B=\begin{bmatrix}-3&0\\6&9\end{bmatrix},\quad 3A+3B=\begin{bmatrix}0&6\\6&6\end{bmatrix}. \checkmark$$`}</p>
            </Example>

            <Example n="3.6" title="Using Law 6">
              <p>{String.raw`Show that $(2+5)A = 2A+5A$ for $A=\begin{bmatrix}1&-1\\3&0\end{bmatrix}$.`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$7A=\begin{bmatrix}7&-7\\21&0\end{bmatrix}, \qquad 2A+5A=\begin{bmatrix}2&-2\\6&0\end{bmatrix} +\begin{bmatrix}5&-5\\15&0\end{bmatrix} =\begin{bmatrix}7&-7\\21&0\end{bmatrix}. \checkmark$$`}</p>
            </Example>

            <Example n="3.7" title="Using Law 7">
              <p>{String.raw`Show that $(2\cdot3)A = 2(3A)$ for $A=\begin{bmatrix}1&2\\-1&4\end{bmatrix}$.`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$6A=\begin{bmatrix}6&12\\-6&24\end{bmatrix}, \qquad 3A=\begin{bmatrix}3&6\\-3&12\end{bmatrix},\quad 2(3A)=\begin{bmatrix}6&12\\-6&24\end{bmatrix}. \checkmark$$`}</p>
            </Example>

            {/* ─── §4 TRANSPOSE ─── */}
            <Sec id="transpose" n="§4">Transpose of a Matrix</Sec>

            <DefBox term="Transpose" color="violet">
              <p style={{margin:0}}>{String.raw`The `}<b>transpose</b>{String.raw` of an $m\times n$ matrix $A=[a_{ij}]$ is the $n\times m$ matrix $A^{\mathsf{T}}=[a_{ji}]$ obtained by writing the rows of $A$ as the columns of $A^{\mathsf{T}}$. That is, the $(i,j)$-entry of $A^{\mathsf{T}}$ equals the $(j,i)$-entry of $A$: $\bigl(A^{\mathsf{T}}\bigr)_{ij} = a_{ji}.$`}</p>
            </DefBox>

            <p>Visually: <b>flip the matrix across its main diagonal</b>.</p>

            <Example n="4.1" title="Transpose of a 2×3 matrix">
              <p style={{textAlign:'center'}}>{String.raw`$$A = \begin{bmatrix}1&2&3\\4&5&6\end{bmatrix}_{2\times3} \implies A^{\mathsf{T}} = \begin{bmatrix}1&4\\2&5\\3&6\end{bmatrix}_{3\times2}.$$`}</p>
              <p>{String.raw`Row 1 of $A$ becomes column 1 of $A^{\mathsf{T}}$; row 2 becomes column 2.`}</p>
            </Example>

            <Example n="4.2" title="Various transposes">
              <p style={{textAlign:'center'}}>{String.raw`$$\begin{bmatrix}1&-1\\2&3\end{bmatrix}^{\mathsf{T}} =\begin{bmatrix}1&2\\-1&3\end{bmatrix}, \qquad \begin{bmatrix}1\\2\\3\end{bmatrix}^{\mathsf{T}} =\begin{bmatrix}1&2&3\end{bmatrix}, \qquad \begin{bmatrix}1&2&-1\end{bmatrix}^{\mathsf{T}} =\begin{bmatrix}1\\2\\-1\end{bmatrix}.$$`}</p>
            </Example>

            <Example n="4.3" title="Square matrix transpose">
              <p style={{textAlign:'center'}}>{String.raw`$$A = \begin{bmatrix}1&2&3\\0&-1&4\\5&6&0\end{bmatrix} \implies A^{\mathsf{T}} = \begin{bmatrix}1&0&5\\2&-1&6\\3&4&0\end{bmatrix}.$$`}</p>
              <p>{String.raw`Notice how the main diagonal ($1,-1,0$) stays fixed.`}</p>
            </Example>

            <SubH>Symmetric and Skew-Symmetric Matrices</SubH>

            <DefBox term="Symmetric matrix" color="teal">
              <p style={{margin:0}}>{String.raw`A square matrix $A$ is called `}<b>symmetric</b>{String.raw` if $A^{\mathsf{T}} = A$, that is, if $a_{ij}=a_{ji}$ for all $i,j$. Equivalently, $A$ is symmetric if it equals its own transpose.`}</p>
            </DefBox>

            <DefBox term="Skew-symmetric matrix" color="rose">
              <p style={{margin:0}}>{String.raw`A square matrix $A$ is called `}<b>skew-symmetric</b>{String.raw` (or `}<b>antisymmetric</b>{String.raw`) if $A^{\mathsf{T}} = -A$, that is, if $a_{ij}=-a_{ji}$ for all $i,j$. This forces every diagonal entry to be $0$.`}</p>
            </DefBox>

            <Example n="4.4" title="Symmetric matrices">
              <p style={{textAlign:'center'}}>{String.raw`$$\begin{bmatrix}2&3\\3&5\end{bmatrix}, \qquad \begin{bmatrix}1&0&-2\\0&4&7\\-2&7&0\end{bmatrix}, \qquad \begin{bmatrix}5\end{bmatrix}.$$`}</p>
              <p>In each case, the matrix is its own mirror-image across the main diagonal.</p>
            </Example>

            <Example n="4.5" title="A skew-symmetric matrix">
              <p style={{textAlign:'center'}}>{String.raw`$$A = \begin{bmatrix}0&2&-3\\-2&0&5\\3&-5&0\end{bmatrix}.$$`}</p>
              <p>{String.raw`Check: $a_{12}=2$ and $a_{21}=-2=-a_{12}$; diagonal entries are all $0$. So $A^{\mathsf{T}}=-A$.`}</p>
            </Example>

            <Example n="4.6" title="Testing for symmetry">
              <p>{String.raw`Is $A=\begin{bmatrix}1&2&3\\2&0&-1\\3&-1&4\end{bmatrix}$ symmetric?`}</p>
              <p>{String.raw`$A^{\mathsf{T}}=\begin{bmatrix}1&2&3\\2&0&-1\\3&-1&4\end{bmatrix} = A$. Yes, $A$ is symmetric.`}</p>
            </Example>

            <SubH>Theorem 2.1.2 — Properties of Transpose (Nicholson)</SubH>

            <ThmBox title="Theorem 2.1.2">
              <p style={{margin:'0 0 8px'}}>{String.raw`Let $A$ and $B$ be matrices of the same size and let $k$ be a scalar.`}</p>
              <ol style={{ margin:0, paddingLeft:'22px', lineHeight:1.9 }}>
                <li>{String.raw`If $A$ is an $m\times n$ matrix, then $A^{\mathsf{T}}$ is an $n\times m$ matrix.`}</li>
                <li>{String.raw`$(A^{\mathsf{T}})^{\mathsf{T}} = A$.`}</li>
                <li>{String.raw`$(kA)^{\mathsf{T}} = k\,A^{\mathsf{T}}$.`}</li>
                <li>{String.raw`$(A+B)^{\mathsf{T}} = A^{\mathsf{T}} + B^{\mathsf{T}}$.`}</li>
              </ol>
            </ThmBox>

            <p><b>Intuition.</b></p>
            <ul style={{ color:'var(--lec-ink2)', lineHeight:1.85, fontSize:'1.02rem', paddingLeft:'22px' }}>
              <li>Property 2 says "transposing twice gets you back where you started."</li>
              <li>Property 3 says "scalars pull through the transpose."</li>
              <li>Property 4 says "transpose distributes over addition."</li>
            </ul>

            <Example n="4.7" title="Verifying (Aᵀ)ᵀ = A">
              <p style={{textAlign:'center'}}>{String.raw`$$A=\begin{bmatrix}1&2\\3&4\\5&6\end{bmatrix}, \quad A^{\mathsf{T}}=\begin{bmatrix}1&3&5\\2&4&6\end{bmatrix}, \quad (A^{\mathsf{T}})^{\mathsf{T}}=\begin{bmatrix}1&2\\3&4\\5&6\end{bmatrix}=A. \checkmark$$`}</p>
            </Example>

            <Example n="4.8" title="Verifying (kA)ᵀ = kAᵀ">
              <p>{String.raw`Let $k=2$, $A=\begin{bmatrix}1&-1\\2&3\end{bmatrix}$.`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$(2A)^{\mathsf{T}}=\begin{bmatrix}2&-2\\4&6\end{bmatrix}^{\mathsf{T}} =\begin{bmatrix}2&4\\-2&6\end{bmatrix}, \quad 2A^{\mathsf{T}}=2\begin{bmatrix}1&2\\-1&3\end{bmatrix} =\begin{bmatrix}2&4\\-2&6\end{bmatrix}. \checkmark$$`}</p>
            </Example>

            <Example n="4.9" title="Verifying (A+B)ᵀ = Aᵀ+Bᵀ">
              <p>{String.raw`$A=\begin{bmatrix}1&0\\2&1\end{bmatrix}$, $B=\begin{bmatrix}3&-1\\0&2\end{bmatrix}$.`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$(A+B)^{\mathsf{T}}=\begin{bmatrix}4&-1\\2&3\end{bmatrix}^{\mathsf{T}} =\begin{bmatrix}4&2\\-1&3\end{bmatrix}.$$`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$A^{\mathsf{T}}+B^{\mathsf{T}}=\begin{bmatrix}1&2\\0&1\end{bmatrix} +\begin{bmatrix}3&0\\-1&2\end{bmatrix} =\begin{bmatrix}4&2\\-1&3\end{bmatrix}. \checkmark$$`}</p>
            </Example>

            <Example n="4.10" title="A worked example using Theorem 2.1.2 — from Nicholson" advanced>
              <p>{String.raw`Solve for $A$ if $\left(2A^{\mathsf{T}} - 3\begin{bmatrix}1&2\\-1&1\end{bmatrix}\right)^{\mathsf{T}} = \begin{bmatrix}2&3\\-1&2\end{bmatrix}.$`}</p>
              <p>{String.raw`$\textit{Solution.}$ Apply the transpose rules to the left side:`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$\left(2A^{\mathsf{T}} - 3\begin{bmatrix}1&2\\-1&1\end{bmatrix}\right)^{\mathsf{T}} = 2(A^{\mathsf{T}})^{\mathsf{T}} - 3\begin{bmatrix}1&2\\-1&1\end{bmatrix}^{\mathsf{T}} = 2A - 3\begin{bmatrix}1&-1\\2&1\end{bmatrix}.$$`}</p>
              <p>{String.raw`The equation becomes`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$2A - 3\begin{bmatrix}1&-1\\2&1\end{bmatrix} = \begin{bmatrix}2&3\\-1&2\end{bmatrix}.$$`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$2A = \begin{bmatrix}2&3\\-1&2\end{bmatrix} + 3\begin{bmatrix}1&-1\\2&1\end{bmatrix} = \begin{bmatrix}5&0\\5&5\end{bmatrix}.$$`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$A = \dfrac{1}{2}\begin{bmatrix}5&0\\5&5\end{bmatrix} = \begin{bmatrix}\tfrac52&0\\[4pt]\tfrac52&\tfrac52\end{bmatrix}.$$`}</p>
            </Example>

            <Example n="4.11" title="Sum of symmetric matrices — Example 2.1.11 from Nicholson" advanced>
              <p>{String.raw`If $A$ and $B$ are symmetric $n\times n$ matrices, show that $A+B$ is symmetric.`}</p>
              <p>{String.raw`$\textit{Proof.}$ Since $A^{\mathsf{T}}=A$ and $B^{\mathsf{T}}=B$, Theorem 2.1.2(4) gives`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$(A+B)^{\mathsf{T}} = A^{\mathsf{T}} + B^{\mathsf{T}} = A + B.$$`}</p>
              <p>{String.raw`Hence $A+B$ is symmetric.`}</p>
            </Example>

            <Example n="4.12" title="A = 2Aᵀ implies A = 0 — Example 2.1.12 from Nicholson" advanced>
              <p>{String.raw`Let $A$ be a square matrix satisfying $A=2A^{\mathsf{T}}$. Show $A=0$.`}</p>
              <p>{String.raw`$\textit{Proof.}$ Transpose both sides of $A=2A^{\mathsf{T}}$:`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$A^{\mathsf{T}} = (2A^{\mathsf{T}})^{\mathsf{T}} = 2(A^{\mathsf{T}})^{\mathsf{T}} = 2A.$$`}</p>
              <p>{String.raw`Substituting $A^{\mathsf{T}}=2A$ back into $A=2A^{\mathsf{T}}$:`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$A = 2(2A) = 4A.$$`}</p>
              <p>{String.raw`Subtracting $A$ from both sides: $3A=0$, so $A=\tfrac13\cdot 0 = 0$.`}</p>
            </Example>

            {/* ─── §5 EXERCISES ─── */}
            <Sec id="exercises" n="§5">Exercises with Solutions</Sec>

            <Exercise id="2.1.5" title="Find A in terms of B">
              <p>{String.raw`$\textbf{(a)}$ $A + B = 3A + 2B$.`}</p>
              <p>{String.raw`Rearrange: $A - 3A = 2B - B$, so $-2A = B$, hence $\boxed{A = -\tfrac{1}{2}B.}$`}</p>
              <p>{String.raw`$\textbf{(b)}$ $2A - B = 5(A + 2B)$.`}</p>
              <p>{String.raw`Expand: $2A - B = 5A + 10B$. Rearrange: $2A - 5A = 10B + B$, so $-3A = 11B$, hence $\boxed{A = -\tfrac{11}{3}B.}$`}</p>
            </Exercise>

            <Exercise id="2.1.6" title="Solve for X and Y in terms of A and B">
              <p>{String.raw`The system has the same structure as a linear system of two equations in two unknowns, except that the "unknowns" $X$, $Y$ and the "constants" $A$, $B$ are matrices (of the same size). We can therefore apply exactly the same elimination procedure as we use for numbers.`}</p>
              <p>{String.raw`Write the system as an augmented matrix whose entries are the coefficient scalars on the left and the matrix constants on the right:`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$\left[\begin{array}{cc|c} \text{coeff of }X & \text{coeff of }Y & \text{RHS} \end{array}\right].$$`}</p>

              <p style={{marginTop:'18px'}}><b>(a)</b> {String.raw`$5X + 3Y = A$ $\quad$ and $\quad$ $2X + Y = B$.`}</p>
              <p>Write the augmented representation and eliminate:</p>
              <p style={{textAlign:'center'}}>{String.raw`$$\left[\begin{array}{cc|c} 5 & 3 & A \\ 2 & 1 & B \end{array}\right] \xrightarrow{R_1 - 2R_2} \left[\begin{array}{cc|c} 1 & 1 & A-2B \\ 2 & 1 & B \end{array}\right] \xrightarrow{R_2 - 2R_1} \left[\begin{array}{cc|c} 1 & 1 & A-2B \\ 0 & -1 & B-2(A-2B) \end{array}\right]$$`}</p>
              <p>{String.raw`Simplify the bottom-right entry: $B - 2A + 4B = 5B - 2A$.`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$\left[\begin{array}{cc|c} 1 & 1 & A-2B \\ 0 & -1 & 5B-2A \end{array}\right] \xrightarrow{-R_2} \left[\begin{array}{cc|c} 1 & 1 & A-2B \\ 0 & 1 & 2A-5B \end{array}\right] \xrightarrow{R_1 - R_2} \left[\begin{array}{cc|c} 1 & 0 & 3B-A \\ 0 & 1 & 2A-5B \end{array}\right]$$`}</p>
              <p>Reading off directly from the RREF:</p>
              <p style={{textAlign:'center'}}>{String.raw`$$\boxed{X = 3B - A, \qquad Y = 2A - 5B.}$$`}</p>
              <p>{String.raw`$\textit{Verification:}$`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$5X+3Y = 5(3B-A)+3(2A-5B) = 15B-5A+6A-15B = A.\;\checkmark$$`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$2X+Y = 2(3B-A)+(2A-5B) = 6B-2A+2A-5B = B.\;\checkmark$$`}</p>

              <p style={{marginTop:'18px'}}><b>(b)</b> {String.raw`$4X + 3Y = A$ $\quad$ and $\quad$ $5X + 4Y = B$.`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$\left[\begin{array}{cc|c} 4 & 3 & A \\ 5 & 4 & B \end{array}\right] \xrightarrow{4R_2 - 5R_1} \left[\begin{array}{cc|c} 4 & 3 & A \\ 0 & 1 & 4B-5A \end{array}\right] \xrightarrow{R_1 - 3R_2} \left[\begin{array}{cc|c} 4 & 0 & A - 3(4B-5A) \\ 0 & 1 & 4B-5A \end{array}\right]$$`}</p>
              <p>{String.raw`Simplify: $A - 12B + 15A = 16A - 12B$.`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$\left[\begin{array}{cc|c} 4 & 0 & 16A-12B \\ 0 & 1 & 4B-5A \end{array}\right] \xrightarrow{\frac{1}{4}R_1} \left[\begin{array}{cc|c} 1 & 0 & 4A-3B \\ 0 & 1 & -5A+4B \end{array}\right]$$`}</p>
              <p>Reading off:</p>
              <p style={{textAlign:'center'}}>{String.raw`$$\boxed{X = 4A - 3B, \qquad Y = -5A + 4B.}$$`}</p>
              <p>{String.raw`$\textit{Verification:}$`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$4X+3Y = 4(4A-3B)+3(-5A+4B) = 16A-12B-15A+12B = A.\;\checkmark$$`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$5X+4Y = 5(4A-3B)+4(-5A+4B) = 20A-15B-20A+16B = B.\;\checkmark$$`}</p>
            </Exercise>

            <Exercise id="2.1.8" title="Simplify">
              <p><b>(a)</b> {String.raw`$2[9(A-B)+7(2B-A)] - 2[3(2B+A)-2(A+3B)-5(A+B)]$.`}</p>
              <p>{String.raw`$\textit{Inner brackets first:}$`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$9(A-B)+7(2B-A) = 9A-9B+14B-7A = 2A+5B.$$`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$3(2B+A)-2(A+3B)-5(A+B) = 6B+3A-2A-6B-5A-5B = -4A-5B.$$`}</p>
              <p>{String.raw`$\textit{Now the full expression:}$`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$2(2A+5B) - 2(-4A-5B) = 4A+10B+8A+10B = \boxed{12A+20B.}$$`}</p>

              <p style={{marginTop:'18px'}}><b>(b)</b> {String.raw`$5[3(A-B+2C)-2(3C-B)-A]+2[3(3A-B+C)+2(B-2A)-2C]$.`}</p>
              <p>{String.raw`$\textit{Inner brackets:}$`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$3(A-B+2C)-2(3C-B)-A = 3A-3B+6C-6C+2B-A = 2A-B.$$`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$3(3A-B+C)+2(B-2A)-2C = 9A-3B+3C+2B-4A-2C = 5A-B+C.$$`}</p>
              <p>{String.raw`$\textit{Full expression:}$`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$5(2A-B)+2(5A-B+C) = 10A-5B+10A-2B+2C = \boxed{20A-7B+2C.}$$`}</p>
            </Exercise>

            <Exercise id="2.1.9" title="Every 2×2 matrix is a combination of basis matrices">
              <p>{String.raw`$\textbf{(a)}$ Let $A=\begin{bmatrix}a&b\\c&d\end{bmatrix}$ be any $2\times2$ matrix. Then:`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$A = a\begin{bmatrix}1&0\\0&0\end{bmatrix} + b\begin{bmatrix}0&1\\0&0\end{bmatrix} + c\begin{bmatrix}0&0\\1&0\end{bmatrix} + d\begin{bmatrix}0&0\\0&1\end{bmatrix}.$$`}</p>
              <p>{String.raw`$\textit{Proof.}$ Add the four scalar multiples entry by entry:`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$\begin{bmatrix}a&0\\0&0\end{bmatrix} +\begin{bmatrix}0&b\\0&0\end{bmatrix} +\begin{bmatrix}0&0\\c&0\end{bmatrix} +\begin{bmatrix}0&0\\0&d\end{bmatrix} =\begin{bmatrix}a&b\\c&d\end{bmatrix}=A.$$`}</p>
              <p>{String.raw`Setting $a,b,c,d$ equal to the entries of $A$ gives the required representation.`}</p>

              <p style={{marginTop:'18px'}}>{String.raw`$\textbf{(b)}$ We claim $A = p\begin{bmatrix}1&0\\0&1\end{bmatrix} +q\begin{bmatrix}1&1\\0&0\end{bmatrix} +r\begin{bmatrix}1&0\\1&0\end{bmatrix} +s\begin{bmatrix}0&1\\1&0\end{bmatrix}$ for some $p,q,r,s$.`}</p>
              <p>Expanding:</p>
              <p style={{textAlign:'center'}}>{String.raw`$$\begin{bmatrix}p+q+r & q+s \\ r+s & p\end{bmatrix} = \begin{bmatrix}a&b\\c&d\end{bmatrix}.$$`}</p>
              <p>{String.raw`Matching entries: $p=d$, $r+s=c$, $q+s=b$, $p+q+r=a$. From $p=d$: $q+r = a-d$. From $q+s=b$ and $r+s=c$: subtracting gives $q-r=b-c$, so $q=\tfrac{(a-d)+(b-c)}{2}$, $r=\tfrac{(a-d)-(b-c)}{2}$, $s=b-q$. This always has a solution, so the representation exists for any $A$.`}</p>
            </Exercise>

            <Exercise id="2.1.10" title="Show r = s = t = 0">
              <p>{String.raw`Given $A=[1\;1\;{-1}]$, $B=[0\;1\;2]$, $C=[3\;0\;1]$, and $rA+sB+tC=0$ for scalars $r,s,t$. Writing this out entry by entry:`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$\text{entry 1:}\; r + 0 + 3t = 0,\quad \text{entry 2:}\; r + s + 0 = 0,\quad \text{entry 3:}\; -r + 2s + t = 0.$$`}</p>
              <p>{String.raw`This is a homogeneous system in $r,s,t$:`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$\begin{bmatrix}1&0&3\\1&1&0\\-1&2&1\end{bmatrix} \begin{pmatrix}r\\s\\t\end{pmatrix}=\begin{pmatrix}0\\0\\0\end{pmatrix}.$$`}</p>
              <p>{String.raw`Computing the determinant: $1(1\cdot1-0\cdot2)-0+3(1\cdot2-1\cdot(-1)) = 1+3(3)=10\neq0$. Since the coefficient matrix is nonsingular, the only solution is $r=s=t=0$.`}</p>
            </Exercise>

            <Exercise id="2.1.11">
              <p>{String.raw`$\textbf{(a)}$ Suppose $Q+A=A$ holds for every $m\times n$ matrix $A$. Show $Q=O_{mn}$.`}</p>
              <p>{String.raw`$\textit{Proof.}$ By hypothesis, $Q+A=A$. Subtracting $A$: $Q=A-A=O$.`}</p>
              <p>{String.raw`$\textbf{(b)}$ Suppose $A+A'=O_{mn}$. Show $A'=-A$.`}</p>
              <p>{String.raw`$\textit{Proof.}$ $A+A'=O$ means $A'=O-A=-A$.`}</p>
            </Exercise>

            <Exercise id="2.1.12" title="A = −A if and only if A = 0">
              <p>{String.raw`$\textbf{($\Rightarrow$)}$ Assume $A=-A$. Then $A+A=0$, so $2A=O$, hence $A=\tfrac{1}{2}O=O$.`}</p>
              <p>{String.raw`$\textbf{($\Leftarrow$)}$ If $A=O$, then $-A=-O=O=A$.`}</p>
              <p>{String.raw`Therefore $A=-A$ if and only if $A=O$.`}</p>
            </Exercise>

            <Exercise id="2.1.13" title="Diagonal matrices are closed under +, −, kA">
              <DefBox term="Diagonal matrix" color="amber">
                <p style={{margin:0}}>{String.raw`A square matrix $D=[d_{ij}]$ is called a `}<b>diagonal matrix</b>{String.raw` if every off-diagonal entry is zero: $d_{ij}=0$ whenever $i\neq j$. In other words, only the main-diagonal entries $d_{11},d_{22},\ldots, d_{nn}$ can be nonzero.`}</p>
              </DefBox>
              <p>{String.raw`Let $A=[a_{ij}]$ and $B=[b_{ij}]$ be diagonal $n\times n$ matrices, so $a_{ij}=0$ and $b_{ij}=0$ for all $i\neq j$.`}</p>
              <p>{String.raw`$\textbf{(a)}$ $A+B$ is diagonal. The $(i,j)$-entry of $A+B$ is $a_{ij}+b_{ij}$. For $i\neq j$: $a_{ij}+b_{ij}=0+0=0$. So all off-diagonal entries of $A+B$ are zero; hence $A+B$ is diagonal.`}</p>
              <p>{String.raw`$\textbf{(b)}$ $A-B$ is diagonal. The $(i,j)$-entry of $A-B$ is $a_{ij}-b_{ij}$. For $i\neq j$: $a_{ij}-b_{ij}=0-0=0$. So $A-B$ is diagonal.`}</p>
              <p>{String.raw`$\textbf{(c)}$ $kA$ is diagonal for any scalar $k$. The $(i,j)$-entry of $kA$ is $k\,a_{ij}$. For $i\neq j$: $k\cdot a_{ij}=k\cdot0=0$. So $kA$ is diagonal.`}</p>
            </Exercise>

            <Exercise id="2.1.14" title="Find s and t for symmetry">
              <p>{String.raw`A matrix is symmetric iff $a_{ij}=a_{ji}$ for all $i\neq j$.`}</p>
              <p>{String.raw`$\textbf{(a)}$ $\begin{bmatrix}1&s\\-2&t\end{bmatrix}$ symmetric requires $a_{12}=a_{21}$, i.e. $s=-2$. No condition on $t$ (it is a diagonal entry). Answer: $\boxed{s=-2,\; t\in\mathbb{R}}$ (any $t$).`}</p>
              <p>{String.raw`$\textbf{(b)}$ $\begin{bmatrix}s&t\\st&1\end{bmatrix}$ symmetric requires $a_{12}=a_{21}$, i.e. $t=st$. $t=st \Rightarrow t(s-1)=0 \Rightarrow t=0$ or $s=1$.`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$\boxed{t=0 \text{ (any }s),\quad\text{or}\quad s=1 \text{ (any }t).}$$`}</p>
              <p>{String.raw`$\textbf{(c)}$ $\begin{bmatrix}s&2s&st\\t&-1&s\\t&s^2&s\end{bmatrix}$ symmetric requires:`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$\begin{aligned} a_{12}&=a_{21}: & 2s&=t,\\ a_{13}&=a_{31}: & st&=t,\\ a_{23}&=a_{32}: & s&=s^2. \end{aligned}$$`}</p>
              <p>{String.raw`From $s=s^2$: $s(s-1)=0$, so $s=0$ or $s=1$.`}</p>
              <ul style={{ color:'var(--lec-ink2)', lineHeight:1.85, fontSize:'1.02rem', paddingLeft:'22px' }}>
                <li>{String.raw`$s=0$: $t=2(0)=0$. Check $st=0=t$. $\checkmark$ $\boxed{s=0,\;t=0.}$`}</li>
                <li>{String.raw`$s=1$: $t=2(1)=2$. Check $st=2=t$. $\checkmark$ $\boxed{s=1,\;t=2.}$`}</li>
              </ul>
              <p>{String.raw`$\textbf{(d)}$ $\begin{bmatrix}2&s&t\\2s&0&s+t\\3&3&t\end{bmatrix}$ symmetric requires:`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$\begin{aligned} a_{12}&=a_{21}: & s&=2s \implies s=0,\\ a_{13}&=a_{31}: & t&=3,\\ a_{23}&=a_{32}: & s+t&=3 \implies 0+3=3.\checkmark \end{aligned}$$`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$\boxed{s=0,\; t=3.}$$`}</p>
            </Exercise>

            <Exercise id="2.1.15" title="Find the matrix A">
              <p>{String.raw`$\textbf{(a)}$ $\left(A+3\begin{bmatrix}1&-1&0\\1&2&4\end{bmatrix}\right)^{\mathsf{T}} =\begin{bmatrix}2&1\\0&5\\3&8\end{bmatrix}$.`}</p>
              <p>{String.raw`Transpose both sides using $(P+Q)^{\mathsf{T}}=P^{\mathsf{T}}+Q^{\mathsf{T}}$ and $(M^{\mathsf{T}})^{\mathsf{T}}=M$:`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$A + 3\begin{bmatrix}1&-1&0\\1&2&4\end{bmatrix} = \begin{bmatrix}2&1\\0&5\\3&8\end{bmatrix}^{\mathsf{T}} = \begin{bmatrix}2&0&3\\1&5&8\end{bmatrix}.$$`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$A = \begin{bmatrix}2&0&3\\1&5&8\end{bmatrix} - 3\begin{bmatrix}1&-1&0\\1&2&4\end{bmatrix} = \begin{bmatrix}2-3&0+3&3-0\\1-3&5-6&8-12\end{bmatrix} = \boxed{\begin{bmatrix}-1&3&3\\-2&-1&-4\end{bmatrix}.}$$`}</p>

              <p style={{marginTop:'18px'}}>{String.raw`$\textbf{(b)}$ $\left(3A^{\mathsf{T}}+2\begin{bmatrix}1&0\\0&2\end{bmatrix}\right)^{\mathsf{T}} =\begin{bmatrix}8&0\\3&1\end{bmatrix}$.`}</p>
              <p>{String.raw`Apply $(P+Q)^{\mathsf{T}}=P^{\mathsf{T}}+Q^{\mathsf{T}}$ and $(kA)^{\mathsf{T}}=kA^{\mathsf{T}}$:`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$3(A^{\mathsf{T}})^{\mathsf{T}}+2\begin{bmatrix}1&0\\0&2\end{bmatrix}^{\mathsf{T}} =\begin{bmatrix}8&0\\3&1\end{bmatrix} \implies 3A+2\begin{bmatrix}1&0\\0&2\end{bmatrix} =\begin{bmatrix}8&0\\3&1\end{bmatrix}.$$`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$3A=\begin{bmatrix}8&0\\3&1\end{bmatrix} -\begin{bmatrix}2&0\\0&4\end{bmatrix} =\begin{bmatrix}6&0\\3&-3\end{bmatrix}.$$`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$A=\tfrac{1}{3}\begin{bmatrix}6&0\\3&-3\end{bmatrix} =\boxed{\begin{bmatrix}2&0\\1&-1\end{bmatrix}.}$$`}</p>

              <p style={{marginTop:'18px'}}>{String.raw`$\textbf{(c)}$ $(2A-3[1\;2\;0])^{\mathsf{T}} = 3A^{\mathsf{T}}+[2\;1\;{-1}]^{\mathsf{T}}$.`}</p>
              <p>{String.raw`Apply $(\cdot)^{\mathsf{T}}$ rules to the left side. Since both sides involve $A^{\mathsf{T}}$, note $[1\;2\;0]$ is $1\times3$, so $A$ must be $1\times3$. Transposing the left side:`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$(2A-3[1\;2\;0])^{\mathsf{T}} = 2A^{\mathsf{T}}-3[1\;2\;0]^{\mathsf{T}} = 2A^{\mathsf{T}}-3\begin{bmatrix}1\\2\\0\end{bmatrix}.$$`}</p>
              <p>The equation is then:</p>
              <p style={{textAlign:'center'}}>{String.raw`$$2A^{\mathsf{T}}-3\begin{bmatrix}1\\2\\0\end{bmatrix} = 3A^{\mathsf{T}}+\begin{bmatrix}2\\1\\-1\end{bmatrix}.$$`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$2A^{\mathsf{T}}-3A^{\mathsf{T}} = \begin{bmatrix}2\\1\\-1\end{bmatrix}+\begin{bmatrix}3\\6\\0\end{bmatrix} \implies -A^{\mathsf{T}} = \begin{bmatrix}5\\7\\-1\end{bmatrix} \implies A^{\mathsf{T}} = \begin{bmatrix}-5\\-7\\1\end{bmatrix}.$$`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$A = (A^{\mathsf{T}})^{\mathsf{T}} = \boxed{[-5\;-7\;1].}$$`}</p>

              <p style={{marginTop:'18px'}}>{String.raw`$\textbf{(d)}$ $\left(2A^{\mathsf{T}}-5\begin{bmatrix}1&0\\-1&2\end{bmatrix}\right)^{\mathsf{T}} = 4A-9\begin{bmatrix}1&1\\-1&0\end{bmatrix}$.`}</p>
              <p>Transpose the left side:</p>
              <p style={{textAlign:'center'}}>{String.raw`$$2(A^{\mathsf{T}})^{\mathsf{T}} - 5\begin{bmatrix}1&0\\-1&2\end{bmatrix}^{\mathsf{T}} = 2A-5\begin{bmatrix}1&-1\\0&2\end{bmatrix}.$$`}</p>
              <p>The equation becomes:</p>
              <p style={{textAlign:'center'}}>{String.raw`$$2A-5\begin{bmatrix}1&-1\\0&2\end{bmatrix} =4A-9\begin{bmatrix}1&1\\-1&0\end{bmatrix}.$$`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$2A-4A = -9\begin{bmatrix}1&1\\-1&0\end{bmatrix} +5\begin{bmatrix}1&-1\\0&2\end{bmatrix} = \begin{bmatrix}-9&-9\\9&0\end{bmatrix}+\begin{bmatrix}5&-5\\0&10\end{bmatrix} = \begin{bmatrix}-4&-14\\9&10\end{bmatrix}.$$`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$-2A=\begin{bmatrix}-4&-14\\9&10\end{bmatrix} \implies A=\boxed{\begin{bmatrix}2&7\\-\frac{9}{2}&-5\end{bmatrix}.}$$`}</p>
            </Exercise>

            {/* CLOSING */}
            <div style={{ marginTop:'48px', padding:'28px 32px', background:'rgba(56,201,176,.08)', border:'2px solid rgba(56,201,176,.35)', borderRadius:'16px' }}>
              <div style={{ fontFamily:'var(--fm)', fontSize:'.7rem', letterSpacing:'.16em', textTransform:'uppercase', color:'#2a9d8f', marginBottom:'12px' }}>Looking ahead</div>
              <p style={{ fontFamily:'var(--fh)', fontSize:'1.4rem', color:'var(--lec-ink)', margin:'0 0 16px', fontWeight:400, lineHeight:1.3 }}>
                We can now add matrices, scale them, and flip them. But how do we <em>multiply</em> two matrices?
              </p>
              <p style={{ color:'var(--lec-ink2)', fontSize:'.97rem', lineHeight:1.8, margin:0 }}>
                Matrix multiplication is the operation that makes linear algebra powerful — and its definition is far less obvious than addition. Next lecture we build matrix–vector and matrix–matrix products, discover why multiplication is <b>not</b> commutative, and connect it back to the linear systems we have been solving all along.
              </p>
            </div>

            <div style={{ marginTop:'64px', paddingTop:'28px', borderTop:'2px solid var(--lec-border)', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'12px' }}>
              <div style={{ fontFamily:'var(--fm)', fontSize:'.76rem', color:'var(--lec-ink3)', fontStyle:'italic' }}>Lecture 5 — complete</div>
              <div style={{ fontFamily:'var(--fm)', fontSize:'.76rem', color:'var(--lec-ink3)' }}>MATH-120 · Shoaib Khan · LUMS · June 2026</div>
            </div>
          </div>

          {/* FOOTER NAV */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'22px 48px', borderTop:'1px solid var(--lec-border)', background:'var(--lec-paper)', flexWrap:'wrap', gap:'12px' }}>
            <Link href={PREV_HREF} style={{ fontFamily:'var(--fm)', fontSize:'.74rem', letterSpacing:'.08em', textTransform:'uppercase', color:'var(--lec-accent)', textDecoration:'none' }}>← Lecture 4</Link>
            <Link href={NEXT_HREF} style={{ fontFamily:'var(--fm)', fontSize:'.74rem', letterSpacing:'.08em', textTransform:'uppercase', color:'var(--lec-accent)', textDecoration:'none' }}>Lecture 6 →</Link>
          </div>
        </main>
      </div>

      <Footer/>
    </>
  );
}