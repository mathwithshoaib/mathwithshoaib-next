'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import Navbar from '../../../../components/Navbar';
import Footer from '../../../../components/Footer';

/* ════════════════════════════════════════════════════════════
   MATH-120 · LECTURE 14
   Subspaces and Spanning — §5.1  (first look at vector-space ideas)
   Route: /courses/linalg/w4/lec14
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
];
const THIS_SLUG = 'w4/lec14';
const PREV_HREF  = '/courses/linalg/w4/lec13';
const NEXT_HREF  = '/courses/linalg/w4/lec15';

const LEC = {
  course: 'MATH-120 · Linear Algebra',
  number: 'Lecture 14',
  title: 'Subspaces and Spanning',
  subtitle: 'The first step into vector spaces: which subsets of ℝⁿ are self-contained worlds of their own, and how a handful of vectors can build an entire space',
  date: '2 July 2026',
};

const ANCHORS = [
  ['Motivation', 'motivation'],
  ['Recall', 'recall'],
  ['Subspace Defined', 'subspace'],
  ['First Examples', 'first-ex'],
  ['Lines & Planes', 'lines'],
  ['Null & Image', 'nullimage'],
  ['Not Subspaces', 'not-sub'],
  ['Spanning: Why', 'span-why'],
  ['Linear Combinations', 'lincomb'],
  ['Span Defined', 'span-def'],
  ['Span Examples', 'span-ex'],
  ['Theorem 5.1.1', 'thm'],
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



/* ═══════════════ SUBSPACE CHECKER (2D) ═══════════════ */
function SubspaceChecker() {
  const cases = {
    line0:  { label:'Line through origin', desc:'U = { (t, 2t) : t ∈ ℝ }', pass:true },
    lineoff:{ label:'Line NOT through origin', desc:'U = { (t, 2t + 1) : t ∈ ℝ }', pass:false },
    quad1:  { label:'First quadrant', desc:'U = { (x, y) : x ≥ 0, y ≥ 0 }', pass:false },
    allR2:  { label:'All of ℝ²', desc:'U = ℝ²', pass:true },
  };
  const [key,setKey]=useState('line0');
  const canvasRef=useRef(null);
  const c=cases[key];

  useEffect(()=>{
    const cv=canvasRef.current; if(!cv) return;
    const ctx=cv.getContext('2d');
    const W=cv.width,H=cv.height,cx=W/2,cy=H/2,s=28;
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#12122a'; ctx.fillRect(0,0,W,H);
    // grid
    ctx.strokeStyle='rgba(120,130,180,.15)'; ctx.lineWidth=1;
    for(let i=-8;i<=8;i++){ ctx.beginPath();ctx.moveTo(cx+i*s,0);ctx.lineTo(cx+i*s,H);ctx.stroke();
      ctx.beginPath();ctx.moveTo(0,cy+i*s);ctx.lineTo(W,cy+i*s);ctx.stroke(); }
    ctx.strokeStyle='rgba(180,190,230,.5)'; ctx.lineWidth=1.3;
    ctx.beginPath();ctx.moveTo(cx,0);ctx.lineTo(cx,H);ctx.stroke();
    ctx.beginPath();ctx.moveTo(0,cy);ctx.lineTo(W,cy);ctx.stroke();

    const col = c.pass ? '#38c9b0' : '#e06b6b';
    ctx.fillStyle = col+'33'; ctx.strokeStyle=col; ctx.lineWidth=2.4;
    if(key==='line0'){
      ctx.beginPath(); ctx.moveTo(cx-6*s, cy+12*s); ctx.lineTo(cx+6*s, cy-12*s); ctx.stroke();
    } else if(key==='lineoff'){
      // y=2x+1 : passes through (0,1)
      ctx.beginPath(); ctx.moveTo(cx-6*s, cy-(-12+1)*s); ctx.lineTo(cx+6*s, cy-(12+1)*s); ctx.stroke();
    } else if(key==='quad1'){
      ctx.fillRect(cx, 0, W-cx, cy);
    } else if(key==='allR2'){
      ctx.fillStyle=col+'22'; ctx.fillRect(0,0,W,H);
    }
    // origin dot: green if 0 in U, else red ring
    const zeroIn = (key!=='lineoff');
    ctx.fillStyle = zeroIn ? '#fff' : '#e06b6b';
    ctx.beginPath(); ctx.arc(cx,cy,5,0,7); ctx.fill();
    if(!zeroIn){ ctx.strokeStyle='#e06b6b'; ctx.lineWidth=2; ctx.beginPath();ctx.arc(cx,cy,9,0,7);ctx.stroke(); }
  },[key]);

  return (
    <div style={{ background:'#1a1a2e', border:'1px solid rgba(120,130,180,.3)', borderRadius:'16px', padding:'22px 24px', margin:'26px 0', color:'#e8ecff' }}>
      <div style={{ fontFamily:'var(--fm)', fontSize:'.72rem', letterSpacing:'.16em', textTransform:'uppercase', color:'#8fd9cc', marginBottom:'14px' }}>🎛 Is It a Subspace?</div>
      <div style={{ display:'flex', gap:'6px', flexWrap:'wrap', marginBottom:'14px' }}>
        {Object.entries(cases).map(([k,cc])=>(
          <button key={k} onClick={()=>setKey(k)} style={{
            fontFamily:'var(--fm)', fontSize:'.68rem', padding:'6px 12px', borderRadius:'20px', cursor:'pointer',
            border:'1px solid '+(key===k?'#38c9b0':'rgba(180,190,230,.3)'),
            background: key===k?'rgba(56,201,176,.2)':'transparent', color: key===k?'#8fd9cc':'#aab', fontWeight:600,
          }}>{cc.label}</button>
        ))}
      </div>
      <div style={{ display:'flex', gap:'22px', flexWrap:'wrap', alignItems:'flex-start' }}>
        <canvas ref={canvasRef} width={300} height={300} style={{ borderRadius:'12px', maxWidth:'100%' }}/>
        <div style={{ flex:1, minWidth:'220px' }}>
          <div style={{ fontFamily:'var(--fm)', fontSize:'.86rem', color:'#c4cae8', marginBottom:'12px' }}>{c.desc}</div>
          <div style={{ background:'#22223e', borderRadius:'10px', padding:'12px 14px', borderLeft:`3px solid ${c.pass?'#38c9b0':'#e06b6b'}` }}>
            <div style={{ fontFamily:'var(--fh)', fontSize:'1.05rem', color:c.pass?'#8fd9cc':'#f0a0a0', marginBottom:'6px' }}>
              {c.pass ? '✓ Subspace' : '✗ Not a subspace'}
            </div>
            <div style={{ fontFamily:'var(--fm)', fontSize:'.76rem', color:'#c4cae8', lineHeight:1.7 }}>
              {key==='line0' && 'Passes through 0, and adding or scaling any point keeps you on the line. All three axioms hold.'}
              {key==='lineoff' && 'The origin (red ring) is NOT on this line, so S1 fails immediately. No need to check further.'}
              {key==='quad1' && 'Contains 0 and is closed under addition, but scaling by −1 flips a point out of the quadrant. S3 fails.'}
              {key==='allR2' && 'The whole space is trivially a subspace of itself — all three axioms hold everywhere.'}
            </div>
          </div>
          <div style={{ fontFamily:'var(--fm)', fontSize:'.62rem', color:'#7079a0', marginTop:'8px' }}>
            White dot = origin is inside U · red ring = origin is outside U.
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════ SPAN VISUALIZER (2D) ═══════════════ */
function SpanVisualizer() {
  const [mode,setMode]=useState('one'); // 'zero','one','two'
  const canvasRef=useRef(null);

  useEffect(()=>{
    const cv=canvasRef.current; if(!cv) return;
    const ctx=cv.getContext('2d');
    const W=cv.width,H=cv.height,cx=W/2,cy=H/2,s=30;
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#12122a'; ctx.fillRect(0,0,W,H);
    ctx.strokeStyle='rgba(120,130,180,.15)'; ctx.lineWidth=1;
    for(let i=-8;i<=8;i++){ ctx.beginPath();ctx.moveTo(cx+i*s,0);ctx.lineTo(cx+i*s,H);ctx.stroke();
      ctx.beginPath();ctx.moveTo(0,cy+i*s);ctx.lineTo(W,cy+i*s);ctx.stroke(); }
    ctx.strokeStyle='rgba(180,190,230,.5)'; ctx.lineWidth=1.3;
    ctx.beginPath();ctx.moveTo(cx,0);ctx.lineTo(cx,H);ctx.stroke();
    ctx.beginPath();ctx.moveTo(0,cy);ctx.lineTo(W,cy);ctx.stroke();

    const v1=[2,1], v2=[-1,2];
    const drawArrow=(a,b,col,lw)=>{
      const x2=cx+a*s,y2=cy-b*s;
      ctx.strokeStyle=col; ctx.fillStyle=col; ctx.lineWidth=lw;
      ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(x2,y2);ctx.stroke();
      const ang=Math.atan2(y2-cy,x2-cx),ah=9;
      ctx.beginPath();ctx.moveTo(x2,y2);
      ctx.lineTo(x2-ah*Math.cos(ang-0.4),y2-ah*Math.sin(ang-0.4));
      ctx.lineTo(x2-ah*Math.cos(ang+0.4),y2-ah*Math.sin(ang+0.4));
      ctx.closePath();ctx.fill();
    };
    if(mode==='zero'){
      ctx.fillStyle='#fff'; ctx.beginPath();ctx.arc(cx,cy,6,0,7);ctx.fill();
    }
    if(mode==='one'){
      // span of one vector = a line
      ctx.strokeStyle='#38c9b055'; ctx.lineWidth=1; ctx.setLineDash([4,6]);
      ctx.beginPath();ctx.moveTo(cx-v1[0]*s*8,cy+v1[1]*s*8);ctx.lineTo(cx+v1[0]*s*8,cy-v1[1]*s*8);ctx.stroke();
      ctx.setLineDash([]);
      drawArrow(v1[0],v1[1],'#38c9b0',3);
    }
    if(mode==='two'){
      // span of two independent = whole plane (fill)
      ctx.fillStyle='rgba(155,128,232,.12)'; ctx.fillRect(0,0,W,H);
      drawArrow(v1[0],v1[1],'#38c9b0',3);
      drawArrow(v2[0],v2[1],'#e8a020',3);
    }
  },[mode]);

  const info = {
    zero:{ t:'span{ } = span of nothing = { 0 }', d:'The span of the empty set (or just the zero vector) is a single point: the origin. A zero-dimensional subspace.' },
    one:{ t:'span{ v } = a line through the origin', d:'All scalar multiples t·v trace out a line. One vector spans a 1-dimensional subspace.' },
    two:{ t:'span{ v, w } = the whole plane ℝ²', d:'Two vectors pointing in different directions reach every point via a·v + b·w. They span all of ℝ² — a 2-dimensional subspace.' },
  }[mode];

  return (
    <div style={{ background:'#1a1a2e', border:'1px solid rgba(120,130,180,.3)', borderRadius:'16px', padding:'22px 24px', margin:'26px 0', color:'#e8ecff' }}>
      <div style={{ fontFamily:'var(--fm)', fontSize:'.72rem', letterSpacing:'.16em', textTransform:'uppercase', color:'#8fd9cc', marginBottom:'14px' }}>🎛 What Does a Span Look Like?</div>
      <div style={{ display:'flex', gap:'6px', flexWrap:'wrap', marginBottom:'14px' }}>
        {[['zero','0 vectors'],['one','1 vector'],['two','2 vectors']].map(([k,label])=>(
          <button key={k} onClick={()=>setMode(k)} style={{
            fontFamily:'var(--fm)', fontSize:'.7rem', padding:'6px 14px', borderRadius:'20px', cursor:'pointer',
            border:'1px solid '+(mode===k?'#38c9b0':'rgba(180,190,230,.3)'),
            background: mode===k?'rgba(56,201,176,.2)':'transparent', color: mode===k?'#8fd9cc':'#aab', fontWeight:600,
          }}>{label}</button>
        ))}
      </div>
      <div style={{ display:'flex', gap:'22px', flexWrap:'wrap', alignItems:'flex-start' }}>
        <canvas ref={canvasRef} width={300} height={300} style={{ borderRadius:'12px', maxWidth:'100%' }}/>
        <div style={{ flex:1, minWidth:'220px' }}>
          <div style={{ background:'#22223e', borderRadius:'10px', padding:'12px 14px', borderLeft:'3px solid #9b80e8' }}>
            <div style={{ fontFamily:'var(--fh)', fontSize:'1.02rem', color:'#b9a8f0', marginBottom:'6px' }}>{info.t}</div>
            <div style={{ fontFamily:'var(--fm)', fontSize:'.78rem', color:'#c4cae8', lineHeight:1.7 }}>{info.d}</div>
          </div>
          <div style={{ fontFamily:'var(--fm)', fontSize:'.62rem', color:'#7079a0', marginTop:'8px', lineHeight:1.6 }}>
            The span always contains 0 and is always closed — that is why every span is automatically a subspace (Theorem 5.1.1).
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════ PAGE ═══════════════ */
export default function Lec14() {
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
        <span style={{color:'var(--text2)'}}>Week 4 · Lecture 14</span>
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
            <Link href={PREV_HREF} style={{ display:'flex', alignItems:'center', padding:'0 16px', height:'100%', fontFamily:'var(--fm)', fontSize:'.72rem', color:'var(--lec-ink3)', borderRight:'1px solid var(--lec-border)', whiteSpace:'nowrap', flexShrink:0, textDecoration:'none' }}>← Lecture 13</Link>
            <div style={{ flex:1, display:'flex', justifyContent:'center', alignItems:'center', gap:'4px', overflowX:'auto', padding:'0 8px' }}>
              <span style={{ fontFamily:'var(--fm)', fontSize:'.6rem', letterSpacing:'.12em', textTransform:'uppercase', color:'var(--lec-accent)', flexShrink:0, marginRight:'6px' }}>On this page</span>
              {ANCHORS.map(([label,id],i)=>(
                <span key={id} style={{display:'inline-flex',alignItems:'center',flexShrink:0}}>
                  {i>0&&<span style={{color:'var(--lec-border)',margin:'0 7px'}}>·</span>}
                  <a href={`#${id}`} onClick={e=>jump(e,id)} style={{fontFamily:'var(--fm)',fontSize:'.73rem',color:'var(--lec-ink2)',textDecoration:'none',whiteSpace:'nowrap'}}>{label}</a>
                </span>
              ))}
            </div>
            <Link href={NEXT_HREF} style={{ display:'flex', alignItems:'center', padding:'0 16px', height:'100%', fontFamily:'var(--fm)', fontSize:'.72rem', color:'var(--lec-ink3)', borderLeft:'1px solid var(--lec-border)', whiteSpace:'nowrap', flexShrink:0, textDecoration:'none' }}>Lecture 15 →</Link>
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
            <Sec id="motivation" n="§1">A Story Before We Begin</Sec>

            <p>{String.raw`Imagine you run a delivery company in a flat city. Every route your trucks can take is some combination of "go east" and "go north." You never need a third instruction — from those two moves you can reach any address in town. Those two directions `}<b>span</b>{String.raw` the whole city.`}</p>

            <p>{String.raw`Now suppose one truck is stuck on a single straight highway. No matter how it drives — forward, backward, fast, slow — it stays on that one line. The set of places it can reach is smaller than the whole city, but it is still `}<i>self-contained</i>{String.raw`: combine any two reachable points and you land on another reachable point. That smaller self-contained world is a `}<b>subspace</b>{String.raw`.`}</p>

            <Callout icon="🌍" title="Where this really matters" color="amber">
              {String.raw`This is not just a story. When Google compresses an image, it keeps only the few "directions" in the data that carry most of the picture and throws away the rest — it replaces a huge space with a small subspace that is almost as good. When engineers model the vibrations of a bridge, each natural mode of shaking is one direction in a space of motions. Signal processing, machine learning, quantum states, error-correcting codes on your phone — all of them work by asking: `}<i>which subspace does my data live in, and what small set of vectors spans it?</i>{String.raw` Those two questions — subspace and span — are the whole of today's lecture.`}
            </Callout>

            <Callout icon="📜" title="A bit of history" color="violet">
              {String.raw`The word "vector" comes from the Latin for "carrier." The idea of adding arrows was used by physicists (forces, velocities) long before anyone made it abstract. It was Giuseppe Peano in 1888 who first wrote down the modern axioms — the exact rules a set must obey to be a "space of vectors." For decades almost no one read his work. Today those axioms are the foundation of a huge part of mathematics. We are taking the first step into that world now.`}
            </Callout>

            {/* ─── §2 RECALL ─── */}
            <Sec id="recall" n="§2">Quick Recall & A Word on Where We Are</Sec>

            <p>{String.raw`You already know $\mathbb{R}^n$: the set of all lists of $n$ real numbers, which we call vectors. You can `}<b>add</b>{String.raw` two of them and `}<b>scale</b>{String.raw` one by a number, and the result is again in $\mathbb{R}^n$. From Lecture 1 you also know a `}<b>homogeneous system</b>{String.raw` $A\mathbf{x} = \mathbf{0}$ and its solutions.`}</p>

            <Callout icon="🧭" title="Honest framing: what this lecture is (and isn't)" color="teal">
              {String.raw`Today we study `}<b>subspaces of $\mathbb{R}^n$</b>{String.raw` (Nicholson §5.1). This is a `}<i>preview</i>{String.raw` of a larger idea. Later you will meet the full definition of an abstract "vector space," where the vectors need not be lists of numbers at all — they can be polynomials, functions, or matrices. For now we keep both feet inside the familiar $\mathbb{R}^n$, so every example is concrete. Keep in the back of your mind: the three rules below are the seed of that bigger theory.`}
            </Callout>

            {/* ─── §3 SUBSPACE DEFINED ─── */}
            <Sec id="subspace" n="§3">What Is a Subspace?</Sec>

            <p>{String.raw`A subspace is a subset of $\mathbb{R}^n$ that is a self-contained world: you cannot escape it by adding its vectors or scaling them. Three simple rules capture exactly this.`}</p>

            <DefBox term="Subspace of ℝⁿ" color="teal">
              <p style={{margin:'0 0 8px'}}>{String.raw`A set $U$ of vectors in $\mathbb{R}^n$ is called a `}<b>subspace</b>{String.raw` of $\mathbb{R}^n$ if it satisfies all three:`}</p>
              <p style={{margin:'4px 0'}}>{String.raw`$\textbf{S1.}$ The zero vector $\mathbf{0}$ is in $U$.`}</p>
              <p style={{margin:'4px 0'}}>{String.raw`$\textbf{S2.}$ If $\mathbf{x}$ and $\mathbf{y}$ are in $U$, then $\mathbf{x} + \mathbf{y}$ is in $U$.`}</p>
              <p style={{margin:'4px 0'}}>{String.raw`$\textbf{S3.}$ If $\mathbf{x}$ is in $U$, then $a\mathbf{x}$ is in $U$ for every real number $a$.`}</p>
            </DefBox>

            <p>{String.raw`We say $U$ is `}<b>closed under addition</b>{String.raw` when S2 holds, and `}<b>closed under scalar multiplication</b>{String.raw` when S3 holds. "Closed" is the key word: you stay inside $U$ no matter what you do.`}</p>

            <Callout icon="⚡" title="A fast shortcut for S1" color="amber">
              {String.raw`If S3 holds, you can scale any vector $\mathbf{x}$ in $U$ by $a = 0$ to get $\mathbf{0}$. So if $U$ is non-empty and closed under scalar multiplication, it automatically contains $\mathbf{0}$. The usual quick test is: first check that $\mathbf{0}$ is in $U$ (it rules out most impostors instantly), then check S2 and S3.`}
            </Callout>

            {/* ─── §4 FIRST EXAMPLES ─── */}
            <Sec id="first-ex" n="§4">The Two "Free" Subspaces</Sec>

            <p>{String.raw`Every $\mathbb{R}^n$ comes with two subspaces you get for free, sitting at the two extremes of size.`}</p>

            <Example n="1" title="The whole space and the zero space">
              <p>{String.raw`$\textbf{(a) } \mathbb{R}^n$ itself is a subspace of $\mathbb{R}^n$. It obviously contains $\mathbf{0}$, and adding or scaling vectors in $\mathbb{R}^n$ lands you back in $\mathbb{R}^n$. All three axioms hold trivially.`}</p>
              <p>{String.raw`$\textbf{(b) } U = \{\mathbf{0}\}$, the set containing only the zero vector, is a subspace. Check: $\mathbf{0}$ is in it (S1); $\mathbf{0} + \mathbf{0} = \mathbf{0}$ stays in it (S2); $a\mathbf{0} = \mathbf{0}$ stays in it (S3). This is the smallest possible subspace.`}</p>
              <p style={{margin:0}}>{String.raw`These two — the whole space and the zero space — are called the `}<b>improper</b>{String.raw` subspaces (some texts say "trivial"). Any `}<i>other</i>{String.raw` subspace, sitting strictly between them in size, is called a `}<b>proper</b>{String.raw` subspace. The interesting geometry lives in the proper ones.`}</p>
            </Example>

            {/* ─── §5 LINES AND PLANES ─── */}
            <Sec id="lines" n="§5">Lines and Planes Through the Origin</Sec>

            <p>{String.raw`The proper subspaces of $\mathbb{R}^3$ turn out to be exactly the `}<b>lines and planes that pass through the origin</b>{String.raw`. The "through the origin" part is not optional — it is what makes S1 work. Let us prove it for a plane.`}</p>

            <Example n="2" title="A plane through the origin is a subspace" advanced>
              <p>{String.raw`Let $U = \{ (x, y, z) : ax + by + cz = 0 \}$ be the set of points on a plane through the origin in $\mathbb{R}^3$ (here $a, b, c$ are fixed numbers, not all zero). Show $U$ is a subspace.`}</p>
              <Reveal label="Show proof">
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{S1 (zero is in $U$).}$ Plug in $(0,0,0)$: $a(0) + b(0) + c(0) = 0$. True, so $\mathbf{0}$ is in $U$. ✓`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{S2 (closed under addition).}$ Take two points $\mathbf{p} = (x_1, y_1, z_1)$ and $\mathbf{q} = (x_2, y_2, z_2)$ in $U$. That means $ax_1 + by_1 + cz_1 = 0$ and $ax_2 + by_2 + cz_2 = 0$. Add the coordinates: $\mathbf{p} + \mathbf{q} = (x_1+x_2,\, y_1+y_2,\, z_1+z_2)$. Test it in the plane equation:`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$a(x_1+x_2) + b(y_1+y_2) + c(z_1+z_2) = (ax_1+by_1+cz_1) + (ax_2+by_2+cz_2) = 0 + 0 = 0.$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`So $\mathbf{p} + \mathbf{q}$ is in $U$. ✓`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{S3 (closed under scaling).}$ Take $\mathbf{p}$ in $U$ and any number $t$. Then $t\mathbf{p} = (tx_1, ty_1, tz_1)$, and`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$a(tx_1) + b(ty_1) + c(tz_1) = t(ax_1 + by_1 + cz_1) = t(0) = 0.$$`}</p>
                <p style={{margin:0}}>{String.raw`So $t\mathbf{p}$ is in $U$. ✓ All three axioms hold, so the plane is a subspace. The identical argument (with one equation less) shows a `}<b>line through the origin</b>{String.raw` is also a subspace. $\;\blacksquare$`}</p>
              </Reveal>
            </Example>

            <p>{String.raw`Play with the four cases below. Watch how "through the origin" is exactly the dividing line between a subspace and an impostor.`}</p>

            <SubspaceChecker/>

            {/* ─── §6 NULL AND IMAGE ─── */}
            <Sec id="nullimage" n="§6">Two Subspaces Every Matrix Carries</Sec>

            <p>{String.raw`Every matrix quietly creates two subspaces. They are among the most useful objects in all of linear algebra.`}</p>

            <DefBox term="Null space and image" color="violet">
              <p style={{margin:'0 0 8px'}}>{String.raw`Let $A$ be an $m \times n$ matrix.`}</p>
              <p style={{margin:'4px 0'}}>{String.raw`• The `}<b>null space</b>{String.raw` is $\operatorname{null} A = \{\mathbf{x} \text{ in } \mathbb{R}^n : A\mathbf{x} = \mathbf{0}\}$ — all the inputs that $A$ crushes to zero.`}</p>
              <p style={{margin:'4px 0'}}>{String.raw`• The `}<b>image</b>{String.raw` is $\operatorname{im} A = \{A\mathbf{x} : \mathbf{x} \text{ in } \mathbb{R}^n\}$ — all the outputs $A$ can produce.`}</p>
            </DefBox>

            <Example n="3" title="Null space is a subspace of ℝⁿ" advanced>
              <p>{String.raw`Show that for an $m \times n$ matrix $A$, $\operatorname{null} A$ is a subspace of $\mathbb{R}^n$.`}</p>
              <Reveal label="Show proof">
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{S1.}$ $A\mathbf{0} = \mathbf{0}$ is always true, so $\mathbf{0}$ is in $\operatorname{null} A$. ✓`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{S2.}$ Suppose $\mathbf{x}$ and $\mathbf{y}$ are in $\operatorname{null} A$, so $A\mathbf{x} = \mathbf{0}$ and $A\mathbf{y} = \mathbf{0}$. Then, using the distributive rule for matrix multiplication (Lecture 5),`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$A(\mathbf{x} + \mathbf{y}) = A\mathbf{x} + A\mathbf{y} = \mathbf{0} + \mathbf{0} = \mathbf{0},$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`so $\mathbf{x} + \mathbf{y}$ is in $\operatorname{null} A$. ✓`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{S3.}$ For $\mathbf{x}$ in $\operatorname{null} A$ and any scalar $a$: $A(a\mathbf{x}) = a(A\mathbf{x}) = a\mathbf{0} = \mathbf{0}$, so $a\mathbf{x}$ is in $\operatorname{null} A$. ✓ $\;\blacksquare$`}</p>
                <p style={{margin:0}}>{String.raw`The same two-line argument shows $\operatorname{im} A$ is a subspace of $\mathbb{R}^m$: it contains $\mathbf{0} = A\mathbf{0}$, and sums/scalings of outputs are again outputs because $A\mathbf{x} + A\mathbf{y} = A(\mathbf{x}+\mathbf{y})$ and $a(A\mathbf{x}) = A(a\mathbf{x})$.`}</p>
              </Reveal>
            </Example>

            <Callout icon="🔑" title="Why you should care" color="teal">
              {String.raw`The null space answers "what does this matrix destroy?" and the image answers "what can this matrix produce?" Together they tell you everything about how a matrix transforms space. You met $\operatorname{null} A$ already — it is just the solution set of $A\mathbf{x} = \mathbf{0}$ from Lecture 1. Now you know that solution set has a `}<i>shape</i>{String.raw`: it is always a subspace.`}
            </Callout>

            {/* ─── §7 NOT SUBSPACES ─── */}
            <Sec id="not-sub" n="§7">Impostors: Sets That Are NOT Subspaces</Sec>

            <p>{String.raw`Do not fall into thinking every subset of $\mathbb{R}^n$ is a subspace. Most are not. To `}<b>disprove</b>{String.raw` a subspace claim, you only need `}<i>one</i>{String.raw` axiom to fail — and one specific counterexample is enough.`}</p>

            <Example n="4" title="Two sets that fail">
              <p>{String.raw`$\textbf{Impostor 1: } U_1 = \{ (x, y) \text{ in } \mathbb{R}^2 : x \geq 0 \}$ — the right half-plane.`}</p>
              <p>{String.raw`This one contains $\mathbf{0}$ and is closed under addition (two points with $x \geq 0$ add to a point with $x \geq 0$). But S3 fails. Take the point $(1, 0)$, which is in $U_1$, and scale by $a = -1$:`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$(-1)\cdot(1, 0) = (-1, 0), \quad \text{which has } x = -1 < 0.$$`}</p>
              <p>{String.raw`So $(-1, 0)$ is `}<i>not</i>{String.raw` in $U_1$. Scaling knocked us out of the set. Not a subspace.`}</p>
              <div style={{height:'12px'}}/>
              <p>{String.raw`$\textbf{Impostor 2: } U_2 = \{ (x, y) \text{ in } \mathbb{R}^2 : x^2 = y^2 \}$.`}</p>
              <p>{String.raw`This set is the two diagonal lines $y = x$ and $y = -x$. It contains $\mathbf{0}$ and is closed under scaling (if $x^2 = y^2$ then $(ax)^2 = (ay)^2$). But S2 fails. Both $(1, 1)$ and $(1, -1)$ are in $U_2$ (each satisfies $x^2 = y^2$). Add them:`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$(1, 1) + (1, -1) = (2, 0), \quad \text{but } 2^2 = 4 \neq 0 = 0^2.$$`}</p>
              <p style={{margin:0}}>{String.raw`So $(2, 0)$ is not in $U_2$. Adding two members left the set. Not a subspace. `}<b>Lesson:</b>{String.raw` a set built from a non-linear condition (an inequality, a square, a product) almost always fails one of the closure rules.`}</p>
            </Example>

            {/* ════════ PART B: SPANNING ════════ */}

            {/* ─── §8 SPAN WHY ─── */}
            <Sec id="span-why" n="§8">Part B — Spanning: Building a Space From a Few Vectors</Sec>

            <p>{String.raw`Subspaces can be infinite — a plane has infinitely many points. It would be hopeless to list them all. The magic of `}<b>spanning</b>{String.raw` is that you can describe an entire infinite subspace with just a `}<i>handful</i>{String.raw` of vectors, plus one instruction: "take all combinations of these."`}</p>

            <Callout icon="🎨" title="An everyday version" color="amber">
              {String.raw`Think of mixing paint. From just three tubes — red, green, blue — you can mix `}<i>every</i>{String.raw` colour a screen can show. Those three colours `}<b>span</b>{String.raw` the space of all screen colours. You do not need a separate tube for orange or teal; they are combinations. Spanning is exactly this: a small "starter kit" of vectors from which everything else is built by mixing.`}
            </Callout>

            {/* ─── §9 LINEAR COMBINATIONS ─── */}
            <Sec id="lincomb" n="§9">Linear Combinations</Sec>

            <DefBox term="Linear combination" color="teal">
              <p style={{margin:0}}>{String.raw`A `}<b>linear combination</b>{String.raw` of vectors $\mathbf{v}_1, \mathbf{v}_2, \ldots, \mathbf{v}_k$ is any vector of the form $$a_1\mathbf{v}_1 + a_2\mathbf{v}_2 + \cdots + a_k\mathbf{v}_k,$$ where the numbers $a_1, a_2, \ldots, a_k$ are called the `}<b>coefficients</b>{String.raw`. You scale each vector by a number and add the results.`}</p>
            </DefBox>

            <Example n="5" title="A concrete linear combination">
              <p>{String.raw`Let $\mathbf{v}_1 = (1, 0)$ and $\mathbf{v}_2 = (0, 1)$ in $\mathbb{R}^2$. Then`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$3\mathbf{v}_1 + 5\mathbf{v}_2 = 3(1,0) + 5(0,1) = (3, 0) + (0, 5) = (3, 5).$$`}</p>
              <p style={{margin:0}}>{String.raw`So $(3, 5)$ is a linear combination of $\mathbf{v}_1$ and $\mathbf{v}_2$ with coefficients $3$ and $5$. In fact `}<i>every</i>{String.raw` vector $(x, y)$ in $\mathbb{R}^2$ is $x\mathbf{v}_1 + y\mathbf{v}_2$ — these two build the whole plane.`}</p>
            </Example>

            {/* ─── §10 SPAN DEFINED ─── */}
            <Sec id="span-def" n="§10">The Span of a Set of Vectors</Sec>

            <DefBox term="Span" color="violet">
              <p style={{margin:0}}>{String.raw`The `}<b>span</b>{String.raw` of vectors $\mathbf{v}_1, \mathbf{v}_2, \ldots, \mathbf{v}_k$ is the set of `}<i>all</i>{String.raw` their linear combinations: $$\operatorname{span}\{\mathbf{v}_1, \ldots, \mathbf{v}_k\} = \{\, a_1\mathbf{v}_1 + a_2\mathbf{v}_2 + \cdots + a_k\mathbf{v}_k \;:\; a_1, \ldots, a_k \text{ in } \mathbb{R} \,\}.$$ If $U = \operatorname{span}\{\mathbf{v}_1, \ldots, \mathbf{v}_k\}$, we say the vectors `}<b>span</b>{String.raw` $U$, or that $U$ is `}<b>spanned by</b>{String.raw` them, and we call $\{\mathbf{v}_1, \ldots, \mathbf{v}_k\}$ a `}<b>spanning set</b>{String.raw` for $U$.`}</p>
            </DefBox>

            <p>{String.raw`In words: the span is everything you can reach by mixing the given vectors with every possible choice of coefficients. Let us see what different numbers of vectors produce.`}</p>

            <p style={{margin:'4px 0'}}>{String.raw`• `}<b>One nonzero vector</b>{String.raw` $\mathbf{v}$: $\operatorname{span}\{\mathbf{v}\} = \{t\mathbf{v}\}$ is a `}<b>line</b>{String.raw` through the origin.`}</p>
            <p style={{margin:'4px 0'}}>{String.raw`• `}<b>Two vectors</b>{String.raw` in different directions: their span is a `}<b>plane</b>{String.raw` through the origin.`}</p>
            <p style={{margin:'4px 0'}}>{String.raw`• `}<b>Three independent vectors</b>{String.raw` in $\mathbb{R}^3$: their span is `}<b>all of $\mathbb{R}^3$</b>{String.raw`.`}</p>

            <p>{String.raw`Watch this happen live — go from zero, to one, to two vectors and see the span grow from a point to a line to a plane:`}</p>

            <SpanVisualizer/>

            {/* ─── §11 SPAN EXAMPLES ─── */}
            <Sec id="span-ex" n="§11">Testing Membership: Is a Vector in the Span?</Sec>

            <p>{String.raw`The core skill is answering: "is a given vector $\mathbf{p}$ in $\operatorname{span}\{\ldots\}$?" This is just asking whether $\mathbf{p}$ can be written as a linear combination — which turns into solving a linear system.`}</p>

            <Example n="6" title="Example 5.1.4 — membership in a span" advanced>
              <p>{String.raw`Let $\mathbf{x} = (2, -1, 2, 1)$ and $\mathbf{y} = (3, 4, -1, 1)$ in $\mathbb{R}^4$. Determine whether $\mathbf{p} = (0, -11, 8, 1)$ or $\mathbf{q} = (2, 3, 1, 2)$ lies in $U = \operatorname{span}\{\mathbf{x}, \mathbf{y}\}$.`}</p>
              <Reveal label="Show full solution">
                <p style={{margin:'0 0 8px'}}>{String.raw`$\mathbf{p}$ or $\mathbf{q}$ is in $U$ exactly when we can find numbers $a, b$ with $a\mathbf{x} + b\mathbf{y}$ equal to it. That is four equations (one per coordinate) in two unknowns.`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Testing } \mathbf{p} = (0, -11, 8, 1).$ We need $a\mathbf{x} + b\mathbf{y} = \mathbf{p}$:`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$\begin{aligned} 2a + 3b &= 0 \\ -a + 4b &= -11 \\ 2a - b &= 8 \\ a + b &= 1 \end{aligned}$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`From the first equation $a = -\tfrac{3}{2}b$. Substituting into the second: $\tfrac32 b + 4b = -11$, so $\tfrac{11}{2}b = -11$, giving $b = -2$ and $a = 3$.`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Now check the remaining two equations}$ with $a = 3, b = -2$: third gives $2(3) - (-2) = 8$ ✓, fourth gives $3 + (-2) = 1$ ✓. All four hold, so`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$\mathbf{p} = 3\mathbf{x} - 2\mathbf{y}, \qquad \text{so } \mathbf{p} \text{ IS in } U.$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Testing } \mathbf{q} = (2, 3, 1, 2).$ We need $a\mathbf{x} + b\mathbf{y} = \mathbf{q}$:`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$\begin{aligned} 2a + 3b &= 2 \\ -a + 4b &= 3 \\ 2a - b &= 1 \\ a + b &= 2 \end{aligned}$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`Solve the `}<i>first two</i>{String.raw` equations: from them $a = -\tfrac{1}{11}$, $b = \tfrac{8}{11}$. Now test the third equation: $2(-\tfrac{1}{11}) - \tfrac{8}{11} = -\tfrac{10}{11} \neq 1$. It fails.`}</p>
                <p style={{margin:0}}>{String.raw`The system is `}<b>inconsistent</b>{String.raw` — no single pair $(a, b)$ can satisfy all four equations. So $\mathbf{q}$ is `}<b>NOT</b>{String.raw` in $U$. `}<b>Key habit:</b>{String.raw` you must check `}<i>all</i>{String.raw` coordinates. Solving just enough of them to find $a, b$ is not the answer — the leftover equations are where a vector reveals it is outside the span.`}</p>
              </Reveal>
            </Example>

            {/* ─── §12 THEOREM ─── */}
            <Sec id="thm" n="§12">Theorem 5.1.1 — Every Span Is a Subspace</Sec>

            <p>{String.raw`The two big ideas of today — subspace and span — are secretly the same idea. This theorem is the bridge.`}</p>

            <ThmBox title="Theorem 5.1.1">
              <p style={{margin:'0 0 8px'}}>{String.raw`Let $U = \operatorname{span}\{\mathbf{x}_1, \mathbf{x}_2, \ldots, \mathbf{x}_k\}$ in $\mathbb{R}^n$. Then:`}</p>
              <p style={{margin:'4px 0'}}>{String.raw`$\textbf{1.}$ $U$ is a subspace of $\mathbb{R}^n$ containing each $\mathbf{x}_i$.`}</p>
              <p style={{margin:'4px 0'}}>{String.raw`$\textbf{2.}$ If $W$ is any subspace that contains each $\mathbf{x}_i$, then $U \subseteq W$.`}</p>
            </ThmBox>

            <Callout icon="🧠" title="What this theorem is really saying" color="teal">
              {String.raw`$\textbf{Part 1}$ says spans come for free as subspaces. You never have to check the three axioms for a span — it is `}<i>automatically</i>{String.raw` a subspace, and it contains the very vectors you built it from. (Makes sense: $\mathbf{x}_1 = 1\mathbf{x}_1 + 0\mathbf{x}_2 + \cdots$ is itself a linear combination.)`}
            </Callout>

            <Callout icon="🎯" title="Part 2 in plain words: the span is the SMALLEST subspace" color="violet">
              {String.raw`Part 2 says $U$ is the `}<b>smallest</b>{String.raw` subspace containing your vectors. Any subspace $W$ that holds $\mathbf{x}_1, \ldots, \mathbf{x}_k$ is forced (by closure) to also hold all their combinations — which is exactly $U$. So $U$ fits inside every such $W$. Picture it: you drop a few vectors into space, and the span is the tightest subspace that wraps around them with no room to spare. Give it two independent vectors in $\mathbb{R}^3$ and the smallest subspace containing them is the plane they span — nothing smaller works, and you do not get the whole of $\mathbb{R}^3$ either.`}
            </Callout>

            <p>{String.raw`We will not prove this formally, but you already have the pieces: Part 1 is just checking S1, S2, S3 for combinations (each holds because a combination of combinations is still a combination), and Part 2 is the closure argument in the box above.`}</p>

            {/* ─── §13 MORE EXAMPLES ─── */}
            <Sec id="more-ex" n="§13">Four Classic Spanning Facts</Sec>

            <Example n="7" title="Example 5.1.5 — two spanning sets can describe the same subspace" advanced>
              <p>{String.raw`If $\mathbf{x}$ and $\mathbf{y}$ are in $\mathbb{R}^n$, show that $\operatorname{span}\{\mathbf{x}, \mathbf{y}\} = \operatorname{span}\{\mathbf{x} + \mathbf{y}, \mathbf{x} - \mathbf{y}\}$.`}</p>
              <Reveal label="Show proof">
                <p style={{margin:'0 0 8px'}}>{String.raw`To prove two spans are equal, show each sits inside the other (two-way containment).`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{($\subseteq$) Show } \operatorname{span}\{\mathbf{x}, \mathbf{y}\} \subseteq \operatorname{span}\{\mathbf{x}+\mathbf{y}, \mathbf{x}-\mathbf{y}\}.$ It is enough to write $\mathbf{x}$ and $\mathbf{y}$ as combinations of $\mathbf{x}+\mathbf{y}$ and $\mathbf{x}-\mathbf{y}$:`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$\mathbf{x} = \tfrac12(\mathbf{x}+\mathbf{y}) + \tfrac12(\mathbf{x}-\mathbf{y}), \qquad \mathbf{y} = \tfrac12(\mathbf{x}+\mathbf{y}) - \tfrac12(\mathbf{x}-\mathbf{y}).$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`Since $\mathbf{x}$ and $\mathbf{y}$ are reachable, so is every combination of them.`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{($\supseteq$) Show the reverse.}$ Both $\mathbf{x}+\mathbf{y}$ and $\mathbf{x}-\mathbf{y}$ are obviously combinations of $\mathbf{x}$ and $\mathbf{y}$, so they lie in $\operatorname{span}\{\mathbf{x}, \mathbf{y}\}$, and hence so do all their combinations.`}</p>
                <p style={{margin:0}}>{String.raw`Each span contains the other, so they are equal. $\;\blacksquare$ `}<b>Takeaway:</b>{String.raw` a subspace does not have a `}<i>unique</i>{String.raw` spanning set — different starter kits can build the exact same space.`}</p>
              </Reveal>
            </Example>

            <Example n="8" title="Example 5.1.6 — the standard vectors span ℝⁿ">
              <p>{String.raw`Show that $\mathbb{R}^n = \operatorname{span}\{\mathbf{e}_1, \mathbf{e}_2, \ldots, \mathbf{e}_n\}$, where $\mathbf{e}_1, \ldots, \mathbf{e}_n$ are the columns of the identity matrix $I_n$.`}</p>
              <Reveal label="Show solution">
                <p style={{margin:'0 0 8px'}}>{String.raw`The vector $\mathbf{e}_i$ has a $1$ in position $i$ and $0$ everywhere else. Any vector $\mathbf{v} = (v_1, v_2, \ldots, v_n)$ breaks apart as`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$\mathbf{v} = v_1\mathbf{e}_1 + v_2\mathbf{e}_2 + \cdots + v_n\mathbf{e}_n.$$`}</p>
                <p style={{margin:0}}>{String.raw`So every vector in $\mathbb{R}^n$ is a linear combination of the $\mathbf{e}_i$ — they span the whole space. For example in $\mathbb{R}^3$, $(4, -7, 2) = 4\mathbf{e}_1 - 7\mathbf{e}_2 + 2\mathbf{e}_3$. These $\mathbf{e}_i$ are the most natural spanning set there is.`}</p>
              </Reveal>
            </Example>

            <Example n="9" title="Example 5.1.7 — the null space as a span">
              <p>{String.raw`For an $m \times n$ matrix $A$, let $\mathbf{x}_1, \ldots, \mathbf{x}_k$ be the basic solutions of $A\mathbf{x} = \mathbf{0}$ produced by the Gaussian algorithm. Then $\operatorname{null} A = \operatorname{span}\{\mathbf{x}_1, \ldots, \mathbf{x}_k\}$.`}</p>
              <Reveal label="Show the idea">
                <p style={{margin:'0 0 8px'}}>{String.raw`Recall from Lecture 1: when you row-reduce a homogeneous system, the general solution comes out as`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$\mathbf{x} = t_1\mathbf{x}_1 + t_2\mathbf{x}_2 + \cdots + t_k\mathbf{x}_k,$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`where the $t_i$ are the free parameters and the $\mathbf{x}_i$ are the basic solutions. But that expression is exactly a general linear combination of $\mathbf{x}_1, \ldots, \mathbf{x}_k$ — that is, exactly $\operatorname{span}\{\mathbf{x}_1, \ldots, \mathbf{x}_k\}$.`}</p>
                <p style={{margin:0}}>{String.raw`So the null space is not just some abstract solution set: the Gaussian algorithm hands you a concrete `}<b>spanning set</b>{String.raw` for it. This is how you actually describe a null space in practice.`}</p>
              </Reveal>
            </Example>

            <Example n="10" title="Example 5.1.8 — the image as the span of the columns">
              <p>{String.raw`Let $\mathbf{c}_1, \mathbf{c}_2, \ldots, \mathbf{c}_n$ be the columns of an $m \times n$ matrix $A$. Then $\operatorname{im} A = \operatorname{span}\{\mathbf{c}_1, \mathbf{c}_2, \ldots, \mathbf{c}_n\}$.`}</p>
              <Reveal label="Show the idea">
                <p style={{margin:'0 0 8px'}}>{String.raw`The product $A\mathbf{x}$ can be rewritten as a combination of the columns of $A$ weighted by the entries of $\mathbf{x}$:`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$A\mathbf{x} = x_1\mathbf{c}_1 + x_2\mathbf{c}_2 + \cdots + x_n\mathbf{c}_n.$$`}</p>
                <p style={{margin:0}}>{String.raw`As $\mathbf{x}$ ranges over all of $\mathbb{R}^n$, the coefficients $x_1, \ldots, x_n$ range over all possible values, so $A\mathbf{x}$ ranges over `}<i>every</i>{String.raw` linear combination of the columns. That is precisely $\operatorname{span}\{\mathbf{c}_1, \ldots, \mathbf{c}_n\}$. This is why $\operatorname{im} A$ is also called the `}<b>column space</b>{String.raw` of $A$.`}</p>
              </Reveal>
            </Example>

            <Callout icon="🔗" title="The big picture" color="amber">
              {String.raw`Look at what just happened: the null space and the image — two subspaces that seemed abstract — both turned out to be `}<b>spans</b>{String.raw` of concrete, computable vectors. Spanning is not a side topic; it is how every subspace in this course gets described. Whenever someone hands you a subspace, your first question should be: `}<i>what spans it?</i>{String.raw``}
            </Callout>

            {/* ─── §14 EXERCISES ─── */}
            <Sec id="exercises" n="§14">Exercises</Sec>

            <p style={{fontStyle:'italic', color:'var(--lec-ink3)'}}>{String.raw`Instructive problems are solved in full. Where several are the same type, one is worked and the rest carry hints. The proof problems are worth your time — do not just read the solution, try them first.`}</p>

            <Exercise id="5.1.1" title="Which sets U are subspaces of ℝ³?  [SOLVED — with the reasoning]">
              <p>{String.raw`For each set, we check the axioms. Remember: one failing axiom (with a counterexample) is enough to disqualify.`}</p>
              <Reveal label="Show solutions (a–f)">
                <p style={{margin:'0 0 6px'}}>{String.raw`$\textbf{(a) } U = \{(1, s, t)\}.$ `}<b>NOT a subspace.</b>{String.raw` The first coordinate is fixed at $1$, so $\mathbf{0} = (0,0,0)$ would need $1 = 0$. S1 fails.`}</p>
                <p style={{margin:'0 0 6px'}}>{String.raw`$\textbf{(b) } U = \{(0, s, t)\}.$ `}<b>IS a subspace</b>{String.raw` (the plane $x = 0$). Contains $\mathbf{0}$ (take $s=t=0$); adding or scaling keeps the first coordinate $0$. All three axioms hold.`}</p>
                <p style={{margin:'0 0 6px'}}>{String.raw`$\textbf{(c) } U = \{(r, s, t) : -r + 3s + 2t = 0\}.$ `}<b>IS a subspace.</b>{String.raw` This is a homogeneous linear equation — a plane through the origin. (This is the $\operatorname{null}$-space / plane argument from §5 and §6.)`}</p>
                <p style={{margin:'0 0 6px'}}>{String.raw`$\textbf{(d) } U = \{(r, 3s, r-2)\}.$ `}<b>NOT a subspace.</b>{String.raw` For $\mathbf{0}$ we would need $r = 0$ (first coord) `}<i>and</i>{String.raw` $r - 2 = 0$ (third coord) at once — impossible. S1 fails.`}</p>
                <p style={{margin:'0 0 6px'}}>{String.raw`$\textbf{(e) } U = \{(r, 0, s) : r^2 + s^2 = 0\}.$ `}<b>IS a subspace</b>{String.raw` — a sneaky one. Over the reals, $r^2 + s^2 = 0$ forces $r = 0$ and $s = 0$, so $U = \{(0,0,0)\} = \{\mathbf{0}\}$, the zero subspace.`}</p>
                <p style={{margin:0}}>{String.raw`$\textbf{(f) } U = \{(2r, -s^2, t)\}.$ `}<b>NOT a subspace.</b>{String.raw` The middle coordinate $-s^2$ is always $\leq 0$. Take $(0, -1, 0)$ in $U$ (with $s = 1$) and scale by $-1$: you get $(0, 1, 0)$, which needs $-s^2 = 1$ — impossible. S3 fails.`}</p>
              </Reveal>
            </Exercise>

            <Exercise id="5.1.2" title="Is x in span{y, z}? If so, write it as a combination  [ONE SOLVED, REST HINTED]">
              <p>{String.raw`$\textbf{(a)}$ $\mathbf{x} = (2, -1, 0, 1)$, $\mathbf{y} = (1, 0, 0, 1)$, $\mathbf{z} = (0, 1, 0, 1)$.`}</p>
              <Reveal label="Show solution to (a)">
                <p style={{margin:'0 0 8px'}}>{String.raw`We need $a, b$ with $a\mathbf{y} + b\mathbf{z} = \mathbf{x}$, i.e.`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$a = 2,\quad b = -1,\quad 0 = 0,\quad a + b = 1.$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`The first two coordinates give $a = 2$, $b = -1$ directly. Check the rest: third is $0 = 0$ ✓, fourth is $2 + (-1) = 1$ ✓. All hold, so`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$\mathbf{x} = 2\mathbf{y} - \mathbf{z}, \qquad \text{so } \mathbf{x} \text{ IS in } \operatorname{span}\{\mathbf{y}, \mathbf{z}\}.$$`}</p>
              </Reveal>
              <p style={{marginTop:'12px'}}>{String.raw`$\textbf{(b)}$ $\mathbf{x} = (1, 2, 15, 11)$, $\mathbf{y} = (2, -1, 0, 2)$, $\mathbf{z} = (1, -1, -3, 1)$. $\quad\textbf{(c)}$ $\mathbf{x} = (8, 3, -13, 20)$, $\mathbf{y} = (2, 1, -3, 5)$, $\mathbf{z} = (-1, 0, 2, -3)$. $\quad\textbf{(d)}$ $\mathbf{x} = (2, 5, 8, 3)$, $\mathbf{y} = (2, -1, 0, 5)$, $\mathbf{z} = (-1, 2, 2, -3)$.`}</p>
              <Callout icon="🧭" title="Hints for (b), (c), (d)" color="teal">
                {String.raw`Same method as (a): set up $a\mathbf{y} + b\mathbf{z} = \mathbf{x}$, solve two coordinates for $a, b$, then `}<b>check the other two</b>{String.raw`. Results to check yourself: (d) works, giving $\mathbf{x} = 3\mathbf{y} + 4\mathbf{z}$. But (b) and (c) `}<b>fail</b>{String.raw` — in each, the first three coordinates are consistent but the `}<i>fourth</i>{String.raw` coordinate does not match, so the vector is not in the span. This is exactly the trap from Example 6: always verify every coordinate.`}
              </Callout>
            </Exercise>

            <Exercise id="5.1.3" title="Do the given vectors span ℝ⁴?  [HINT ONLY]">
              <p>{String.raw`$\textbf{(a)}$ $\{(1,1,1,1),(0,1,1,1),(0,0,1,1),(0,0,0,1)\}$. $\quad\textbf{(b)}$ $\{(1,3,-5,0),(-2,1,0,0),(0,2,1,-1),(1,-4,5,0)\}$.`}</p>
              <Callout icon="🧭" title="Hint" color="teal">
                {String.raw`Four vectors span $\mathbb{R}^4$ exactly when the $4\times4$ matrix with them as columns is invertible — equivalently, has non-zero determinant, equivalently, has rank $4$. Build the matrix and row-reduce. One of these two sets spans $\mathbb{R}^4$ and the other does not: (a) reduces to full rank (it is triangular with non-zero diagonal — spans), while (b) collapses to rank $3$ (the vectors are dependent — does not span). Compute and confirm which is which.`}
              </Callout>
            </Exercise>

            <Exercise id="5.1.4" title="Can {(1,2,0),(2,0,3)} span U = {(r, s, 0) : r, s ∈ ℝ}?  [SOLVED — subtle]">
              <Reveal label="Show solution">
                <p style={{margin:'0 0 8px'}}>{String.raw`$U$ is the plane $z = 0$ — every vector in it has third coordinate $0$. Look at the proposed spanning vectors: $(1, 2, 0)$ has third coordinate $0$ (fine), but $(2, 0, 3)$ has third coordinate $\mathbf{3 \neq 0}$.`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`So $(2, 0, 3)$ is not even `}<i>in</i>{String.raw` $U$. Its span therefore contains vectors sticking out of $U$ (anything with a non-zero third coordinate), so`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$\operatorname{span}\{(1,2,0), (2,0,3)\} \neq U.$$`}</p>
                <p style={{margin:0}}>{String.raw`$\textbf{No}$ — it is not possible. `}<b>The subtle point:</b>{String.raw` this fails for a different reason than "too few vectors." Even the count is right (2 vectors for a 2-dimensional plane), but one of them points out of $U$ entirely. A spanning set for $U$ must consist of vectors that `}<i>live in</i>{String.raw` $U$.`}</p>
              </Reveal>
            </Exercise>

            <Exercise id="5.1.5 / 5.1.6" title="Spanning set for {0}; and is ℝ² a subspace of ℝ³?  [HINTS — think first]">
              <Callout icon="🧭" title="Hints" color="teal">
                {String.raw`$\textbf{5.1.5:}$ what is the smallest possible spanning set for the zero subspace $\{\mathbf{0}\}$? Consider the empty set, or just $\{\mathbf{0}\}$ itself — both span only $\mathbf{0}$. $\;\;\textbf{5.1.6:}$ is $\mathbb{R}^2$ a subspace of $\mathbb{R}^3$? Careful — vectors in $\mathbb{R}^2$ have `}<i>two</i>{String.raw` coordinates, vectors in $\mathbb{R}^3$ have `}<i>three</i>{String.raw`. A pair $(a, b)$ is not literally a member of $\mathbb{R}^3$ at all, so strictly $\mathbb{R}^2 \not\subseteq \mathbb{R}^3$. (The `}<i>copy</i>{String.raw` $\{(a, b, 0)\}$ is a subspace, but that is a different set.)`}
              </Callout>
            </Exercise>

            <Exercise id="5.1.7 / 5.1.8" title="span{x, y, z} = span{x + tz, y, z} and span{x + y, y + z, z + x}  [PROOF — SOLVE 5.1.7 shown, 5.1.8 hinted]">
              <Reveal label="Show proof of 5.1.7">
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Claim:}$ if $U = \operatorname{span}\{\mathbf{x}, \mathbf{y}, \mathbf{z}\}$, then $U = \operatorname{span}\{\mathbf{x} + t\mathbf{z}, \mathbf{y}, \mathbf{z}\}$ for any scalar $t$. Prove by two-way containment.`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{($\supseteq$):}$ Each of $\mathbf{x} + t\mathbf{z}$, $\mathbf{y}$, $\mathbf{z}$ is a combination of $\mathbf{x}, \mathbf{y}, \mathbf{z}$ (obvious for $\mathbf{y}, \mathbf{z}$; and $\mathbf{x} + t\mathbf{z}$ is $1\mathbf{x} + 0\mathbf{y} + t\mathbf{z}$). So all three lie in $U$, hence so does their span.`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{($\subseteq$):}$ Conversely, we recover the originals from the new set: $\mathbf{y}$ and $\mathbf{z}$ are already there, and $\mathbf{x} = (\mathbf{x} + t\mathbf{z}) - t\mathbf{z}$ is a combination of $\mathbf{x} + t\mathbf{z}$ and $\mathbf{z}$. So $\mathbf{x}, \mathbf{y}, \mathbf{z}$ all lie in $\operatorname{span}\{\mathbf{x} + t\mathbf{z}, \mathbf{y}, \mathbf{z}\}$, hence so does $U$.`}</p>
                <p style={{margin:0}}>{String.raw`Both containments hold, so the spans are equal. $\;\blacksquare$ This is the spanning-set version of a row operation: adding a multiple of one vector to another does not change the span.`}</p>
              </Reveal>
              <Callout icon="🧭" title="Hint for 5.1.8" color="teal">
                {String.raw`Show $\operatorname{span}\{\mathbf{x}, \mathbf{y}, \mathbf{z}\} = \operatorname{span}\{\mathbf{x}+\mathbf{y}, \mathbf{y}+\mathbf{z}, \mathbf{z}+\mathbf{x}\}$ by the same two-way method. The "$\supseteq$" direction is easy (each new vector is a combination of the old). For "$\subseteq$", solve for $\mathbf{x}, \mathbf{y}, \mathbf{z}$ in terms of the three sums — e.g. $\mathbf{x} = \tfrac12[(\mathbf{x}+\mathbf{y}) - (\mathbf{y}+\mathbf{z}) + (\mathbf{z}+\mathbf{x})]$. Find the analogous expressions for $\mathbf{y}$ and $\mathbf{z}$.`}
              </Callout>
            </Exercise>

            <Exercise id="5.1.9 / 5.1.10 / 5.1.11" title="Spans and scalar multiples  [MIXED: 5.1.9 hinted, 5.1.11 solved]">
              <Callout icon="🧭" title="Hint for 5.1.9 & 5.1.10" color="teal">
                {String.raw`$\textbf{5.1.9:}$ show $\operatorname{span}\{a\mathbf{x}\} = \operatorname{span}\{\mathbf{x}\}$ when $a \neq 0$. Any multiple of $a\mathbf{x}$ is a multiple of $\mathbf{x}$ and vice versa (use $\mathbf{x} = \tfrac{1}{a}(a\mathbf{x})$). $\;\textbf{5.1.10}$ generalizes this to several vectors — same idea, scale each one by its own non-zero constant.`}
              </Callout>
              <Reveal label="Show solution to 5.1.11">
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{5.1.11:}$ if $\mathbf{x} \neq \mathbf{0}$ in $\mathbb{R}^n$, find all subspaces of $\operatorname{span}\{\mathbf{x}\}$.`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\operatorname{span}\{\mathbf{x}\}$ is a line through the origin. Its subspaces $W$ must satisfy $W \subseteq \operatorname{span}\{\mathbf{x}\}$. There are exactly `}<b>two</b>{String.raw`:`}</p>
                <p style={{margin:'2px 0'}}>{String.raw`• $W = \{\mathbf{0}\}$ — the zero subspace.`}</p>
                <p style={{margin:'2px 0'}}>{String.raw`• $W = \operatorname{span}\{\mathbf{x}\}$ — the whole line.`}</p>
                <p style={{margin:0}}>{String.raw`$\textbf{Why nothing in between:}$ if $W$ contains any non-zero vector $c\mathbf{x}$ (with $c \neq 0$), then by closure under scaling it contains $\tfrac{1}{c}(c\mathbf{x}) = \mathbf{x}$, and therefore all multiples of $\mathbf{x}$ — the whole line. So a subspace of a line is either just the origin or the entire line. $\;\blacksquare$`}</p>
              </Reveal>
            </Exercise>

            <Exercise id="5.1.20" title="U ⊆ ℝⁿ is a subspace ⟺ S2 and S3 hold  [PROOF — SOLVED]">
              <p>{String.raw`Let $U$ be a `}<b>non-empty</b>{String.raw` subset of $\mathbb{R}^n$. Show $U$ is a subspace if and only if S2 (closed under addition) and S3 (closed under scalar multiplication) both hold.`}</p>
              <Reveal label="Show proof">
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{($\Rightarrow$)}$ If $U$ is a subspace, then S2 and S3 hold by definition. Nothing to do.`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{($\Leftarrow$)}$ Suppose $U$ is non-empty and satisfies S2 and S3. We must produce S1, that $\mathbf{0} \in U$. Since $U$ is non-empty, pick any vector $\mathbf{x} \in U$. By S3, we may scale it by any real number — in particular by $0$:`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$0 \cdot \mathbf{x} = \mathbf{0} \in U.$$`}</p>
                <p style={{margin:0}}>{String.raw`So S1 holds automatically, and all three axioms are satisfied — $U$ is a subspace. $\;\blacksquare$ `}<b>Why this matters:</b>{String.raw` it shortens every subspace check. You do not need to verify S1 separately; as long as $U$ is non-empty and closed under the two operations, the zero vector comes for free. (The non-empty condition is essential — the empty set vacuously satisfies S2 and S3 but has no $\mathbf{0}$.)`}</p>
              </Reveal>
            </Exercise>

            <Exercise id="5.1.22" title="Intersection and sum of subspaces are subspaces  [PROOF — SOLVED]">
              <p>{String.raw`Let $U$ and $W$ be subspaces of $\mathbb{R}^n$. Define $U \cap W = \{\mathbf{x} : \mathbf{x} \in U \text{ and } \mathbf{x} \in W\}$ and $U + W = \{\mathbf{u} + \mathbf{w} : \mathbf{u} \in U, \mathbf{w} \in W\}$. Show both are subspaces of $\mathbb{R}^n$.`}</p>
              <Reveal label="Show proof">
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{(a) } U \cap W \textbf{ is a subspace.}$`}</p>
                <p style={{margin:'2px 0'}}>{String.raw`S1: $\mathbf{0} \in U$ and $\mathbf{0} \in W$ (both are subspaces), so $\mathbf{0} \in U \cap W$. ✓`}</p>
                <p style={{margin:'2px 0'}}>{String.raw`S2: if $\mathbf{x}, \mathbf{y} \in U \cap W$, then both are in $U$ (so $\mathbf{x} + \mathbf{y} \in U$) and both in $W$ (so $\mathbf{x} + \mathbf{y} \in W$). Hence $\mathbf{x} + \mathbf{y} \in U \cap W$. ✓`}</p>
                <p style={{margin:'2px 0'}}>{String.raw`S3: if $\mathbf{x} \in U \cap W$ and $a$ is a scalar, then $a\mathbf{x} \in U$ and $a\mathbf{x} \in W$, so $a\mathbf{x} \in U \cap W$. ✓`}</p>
                <p style={{margin:'10px 0 8px'}}>{String.raw`$\textbf{(b) } U + W \textbf{ is a subspace.}$`}</p>
                <p style={{margin:'2px 0'}}>{String.raw`S1: $\mathbf{0} = \mathbf{0} + \mathbf{0}$ with $\mathbf{0} \in U$ and $\mathbf{0} \in W$, so $\mathbf{0} \in U + W$. ✓`}</p>
                <p style={{margin:'2px 0'}}>{String.raw`S2: take $\mathbf{x}_1 = \mathbf{u}_1 + \mathbf{w}_1$ and $\mathbf{x}_2 = \mathbf{u}_2 + \mathbf{w}_2$ in $U + W$. Then $\mathbf{x}_1 + \mathbf{x}_2 = (\mathbf{u}_1 + \mathbf{u}_2) + (\mathbf{w}_1 + \mathbf{w}_2)$. Since $\mathbf{u}_1 + \mathbf{u}_2 \in U$ and $\mathbf{w}_1 + \mathbf{w}_2 \in W$, the sum is in $U + W$. ✓`}</p>
                <p style={{margin:'2px 0'}}>{String.raw`S3: $a\mathbf{x}_1 = a\mathbf{u}_1 + a\mathbf{w}_1$, with $a\mathbf{u}_1 \in U$ and $a\mathbf{w}_1 \in W$, so $a\mathbf{x}_1 \in U + W$. ✓ $\;\blacksquare$`}</p>
                <p style={{margin:0}}>{String.raw`$\textbf{A warning worth remembering:}$ the `}<i>union</i>{String.raw` $U \cup W$ is usually `}<b>not</b>{String.raw` a subspace — adding a vector from $U$ to one from $W$ can land outside both. That is exactly the gap that $U + W$ (the smallest subspace containing both) fills.`}</p>
              </Reveal>
            </Exercise>

            <Exercise id="5.1.24" title="Every proper subspace of ℝ² is a line through the origin  [PROOF — HINT, think geometrically]">
              <Callout icon="🧭" title="Hint" color="violet">
                {String.raw`Let $U$ be a proper subspace of $\mathbb{R}^2$ (so $U \neq \{\mathbf{0}\}$ and $U \neq \mathbb{R}^2$). Since $U \neq \{\mathbf{0}\}$, pick a non-zero $\mathbf{d} \in U$; then the whole line $L = \mathbb{R}\mathbf{d} = \{t\mathbf{d}\}$ lies in $U$ (closure under scaling). The claim is $U = L$. Suppose not — then there is some $\mathbf{u} \in U$ not on $L$. Argue geometrically: two vectors $\mathbf{u}$ and $\mathbf{d}$ pointing in different directions span all of $\mathbb{R}^2$ (every vector $\mathbf{v}$ is a combination of them), which would force $U = \mathbb{R}^2$, contradicting "proper." Hence no such $\mathbf{u}$ exists and $U = L$, a line through the origin. This is why $\mathbb{R}^2$ has only three kinds of subspace: the origin, lines through it, and everything.`}
              </Callout>
            </Exercise>

            <Callout icon="📌" title="What to take from these exercises" color="amber">
              {String.raw`The subspace checks (5.1.1) train your eye for which axiom fails. The span-membership problems (5.1.2, 5.1.4) drill the "set up a system, check every coordinate" habit. The proofs (5.1.7, 5.1.20, 5.1.22, 5.1.24) are the real prize — they show that subspaces and spans behave predictably under intersection, sum, and re-combination. Those structural facts are what the rest of the course is built on.`}
            </Callout>

            {/* CLOSING */}
            <div style={{ marginTop:'48px', padding:'28px 32px', background:'rgba(56,201,176,.08)', border:'2px solid rgba(56,201,176,.35)', borderRadius:'16px' }}>
              <div style={{ fontFamily:'var(--fm)', fontSize:'.7rem', letterSpacing:'.16em', textTransform:'uppercase', color:'#2a9d8f', marginBottom:'12px' }}>Looking ahead</div>
              <p style={{ fontFamily:'var(--fh)', fontSize:'1.4rem', color:'var(--lec-ink)', margin:'0 0 16px', fontWeight:400, lineHeight:1.3 }}>
                A subspace is a self-contained world; a span is how you build one from a few vectors.
              </p>
              <p style={{ color:'var(--lec-ink2)', fontSize:'.97rem', lineHeight:1.8, margin:0 }}>
                {String.raw`We now know a subspace can be described by a spanning set — but a spanning set can be wasteful. In Example 5, two different sets described the same subspace, and one might carry a redundant vector that adds nothing. That raises the sharpest question in linear algebra: what is the `}<i>smallest</i>{String.raw` set of vectors that still spans a subspace, with no waste? Vectors that carry no redundancy are called `}<b>linearly independent</b>{String.raw`, and a smallest spanning set is a `}<b>basis</b>{String.raw`. Those two ideas — independence and basis — are where we go next, and they unlock the notion of `}<b>dimension</b>{String.raw`.`}
              </p>
            </div>

            <div style={{ marginTop:'64px', paddingTop:'28px', borderTop:'2px solid var(--lec-border)', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'12px' }}>
              <div style={{ fontFamily:'var(--fm)', fontSize:'.76rem', color:'var(--lec-ink3)', fontStyle:'italic' }}>Lecture 14 — complete</div>
              <div style={{ fontFamily:'var(--fm)', fontSize:'.76rem', color:'var(--lec-ink3)' }}>MATH-120 · Shoaib Khan · LUMS · July 2026</div>
            </div>
          </div>

          {/* FOOTER NAV */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'22px 48px', borderTop:'1px solid var(--lec-border)', background:'var(--lec-paper)', flexWrap:'wrap', gap:'12px' }}>
            <Link href={PREV_HREF} style={{ fontFamily:'var(--fm)', fontSize:'.74rem', letterSpacing:'.08em', textTransform:'uppercase', color:'var(--lec-accent)', textDecoration:'none' }}>← Lecture 13</Link>
            <Link href={NEXT_HREF} style={{ fontFamily:'var(--fm)', fontSize:'.74rem', letterSpacing:'.08em', textTransform:'uppercase', color:'var(--lec-accent)', textDecoration:'none' }}>Lecture 15 →</Link>
          </div>
        </main>
      </div>

      <Footer/>
    </>
  );
}