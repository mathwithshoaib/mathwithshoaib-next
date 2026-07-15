'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import Navbar from '../../../../components/Navbar';
import Footer from '../../../../components/Footer';

/* ════════════════════════════════════════════════════════════
   MATH-120 · LECTURE 13
   Polynomial Interpolation (§3.2) & Linear Recurrences (§3.4)
   Route: /courses/linalg/w4/lec13
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
];
const THIS_SLUG = 'w4/lec13';
const PREV_HREF  = '/courses/linalg/w4/lec12';
const NEXT_HREF  = '/courses/linalg/w4/lec14';

const LEC = {
  course: 'MATH-120 · Linear Algebra',
  number: 'Lecture 13',
  title: 'Polynomial Interpolation & Linear Recurrences',
  subtitle: 'Two applications: fitting an exact polynomial through data points (via determinants), and turning a recurrence into a matrix so diagonalization hands you a closed formula — Fibonacci included',
  date: '1 July 2026',
};

const ANCHORS = [
  ['Recall', 'recall'],
  ['Interpolation: Why', 'interp-why'],
  ['Tree Example', 'tree'],
  ['The General Setup', 'setup'],
  ['Vandermonde', 'vandermonde'],
  ['Interp. Examples', 'interp-ex'],
  ['Recurrences: Why', 'rec-why'],
  ['Parking Spaces', 'parking'],
  ['The Matrix Trick', 'trick'],
  ['Worked Example', 'rec-ex'],
  ['Fibonacci & Binet', 'fibonacci'],
  ['Collatz', 'collatz'],
  ['Playground', 'playground'],
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


/* ═══════════════ INTERPOLATION PLOTTER ═══════════════ */
function InterpPlotter() {
  // fixed data points; user can toggle how many to use
  const allPts = [[0,1],[1,2],[2,5],[3,10]];
  const [nPts, setNPts] = useState(3);
  const pts = allPts.slice(0, nPts);
  const canvasRef = useRef(null);

  // solve Vandermonde for coefficients via Gaussian elimination
  function solvePoly(points){
    const n = points.length;
    const M = points.map(([x,y]) => {
      const row = [];
      for(let j=0;j<n;j++) row.push(Math.pow(x,j));
      row.push(y);
      return row;
    });
    // gaussian elimination
    for(let i=0;i<n;i++){
      let piv=i;
      for(let r=i+1;r<n;r++) if(Math.abs(M[r][i])>Math.abs(M[piv][i])) piv=r;
      [M[i],M[piv]]=[M[piv],M[i]];
      if(Math.abs(M[i][i])<1e-12) continue;
      for(let r=0;r<n;r++){
        if(r===i) continue;
        const f=M[r][i]/M[i][i];
        for(let c=i;c<=n;c++) M[r][c]-=f*M[i][c];
      }
    }
    return M.map((row,i)=> Math.abs(M[i][i])<1e-12?0:row[n]/M[i][i]);
  }
  const coeffs = solvePoly(pts);
  const evalP = (x)=> coeffs.reduce((s,c,j)=>s+c*Math.pow(x,j),0);

  useEffect(()=>{
    const cv=canvasRef.current; if(!cv) return;
    const ctx=cv.getContext('2d');
    const W=cv.width,H=cv.height, padL=36,padB=28, x0=-0.5,x1=3.5,y0=-1,y1=12;
    const sx=(x)=> padL + (x-x0)/(x1-x0)*(W-padL-12);
    const sy=(y)=> (H-padB) - (y-y0)/(y1-y0)*(H-padB-12);
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle='#fffdf5'; ctx.fillRect(0,0,W,H);
    // grid
    ctx.strokeStyle='#e8ddc9'; ctx.lineWidth=1; ctx.fillStyle='#9a8c72'; ctx.font='10px monospace';
    for(let gx=0;gx<=3;gx++){ ctx.beginPath();ctx.moveTo(sx(gx),12);ctx.lineTo(sx(gx),H-padB);ctx.stroke(); ctx.fillText(gx,sx(gx)-3,H-padB+16); }
    for(let gy=0;gy<=10;gy+=2){ ctx.beginPath();ctx.moveTo(padL,sy(gy));ctx.lineTo(W-12,sy(gy));ctx.stroke(); ctx.fillText(gy,4,sy(gy)+3); }
    // axes
    ctx.strokeStyle='#b8a888'; ctx.lineWidth=1.4;
    ctx.beginPath();ctx.moveTo(padL,12);ctx.lineTo(padL,H-padB);ctx.lineTo(W-12,H-padB);ctx.stroke();
    // polynomial curve
    ctx.strokeStyle='#2a9d8f'; ctx.lineWidth=2.4; ctx.beginPath();
    let first=true;
    for(let px=x0; px<=x1; px+=0.02){ const py=evalP(px); const X=sx(px),Y=sy(py); if(py<y0-2||py>y1+2){first=true;continue;} if(first){ctx.moveTo(X,Y);first=false;}else ctx.lineTo(X,Y); }
    ctx.stroke();
    // estimate at x=1.5
    const xe=1.5, ye=evalP(xe);
    ctx.strokeStyle='#c8860a'; ctx.setLineDash([4,4]); ctx.lineWidth=1.4;
    ctx.beginPath();ctx.moveTo(sx(xe),H-padB);ctx.lineTo(sx(xe),sy(ye));ctx.lineTo(padL,sy(ye));ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle='#c8860a'; ctx.beginPath();ctx.arc(sx(xe),sy(ye),4,0,7);ctx.fill();
    // data points
    ctx.fillStyle='#d85555';
    pts.forEach(([px,py])=>{ ctx.beginPath();ctx.arc(sx(px),sy(py),5,0,7);ctx.fill(); ctx.strokeStyle='#fff';ctx.lineWidth=1.5;ctx.stroke(); });
  },[nPts]);

  const fmt=(c)=> Math.abs(c-Math.round(c))<1e-6?String(Math.round(c)):c.toFixed(3);
  const polyStr = coeffs.map((c,j)=>{
    if(Math.abs(c)<1e-9) return null;
    const term = j===0?fmt(c): j===1?`${fmt(c)}x`:`${fmt(c)}x^${j}`;
    return term;
  }).filter(Boolean).reverse().join(' + ').replace(/\+ -/g,'- ');

  return (
    <div style={{ background:'#1a1a2e', border:'1px solid rgba(120,130,180,.3)', borderRadius:'16px', padding:'22px 24px', margin:'26px 0', color:'#e8ecff' }}>
      <div style={{ fontFamily:'var(--fm)', fontSize:'.72rem', letterSpacing:'.16em', textTransform:'uppercase', color:'#8fd9cc', marginBottom:'14px' }}>🎛 Interpolation Explorer</div>
      <div style={{ display:'flex', flexWrap:'wrap', gap:'24px', alignItems:'flex-start' }}>
        <div>
          <canvas ref={canvasRef} width={340} height={280} style={{ borderRadius:'12px', maxWidth:'100%' }}/>
          <div style={{ fontFamily:'var(--fm)', fontSize:'.64rem', color:'#8892b8', marginTop:'6px' }}>
            Red = data points · green = interpolating polynomial · amber dashes = estimate at x = 1.5
          </div>
        </div>
        <div style={{ flex:1, minWidth:'220px' }}>
          <div style={{ fontFamily:'var(--fm)', fontSize:'.66rem', color:'#8892b8', marginBottom:'8px', letterSpacing:'.1em' }}>HOW MANY POINTS?</div>
          <div style={{ display:'flex', gap:'6px', marginBottom:'16px' }}>
            {[2,3,4].map(k=>(
              <button key={k} onClick={()=>setNPts(k)} style={{
                fontFamily:'var(--fm)', fontSize:'.74rem', padding:'6px 14px', borderRadius:'20px', cursor:'pointer',
                border:'1px solid '+(nPts===k?'#38c9b0':'rgba(180,190,230,.3)'),
                background: nPts===k?'rgba(56,201,176,.2)':'transparent', color: nPts===k?'#8fd9cc':'#aab', fontWeight:600,
              }}>{k} pts</button>
            ))}
          </div>
          <div style={{ background:'#22223e', borderRadius:'10px', padding:'12px 14px', borderLeft:'3px solid #2a9d8f' }}>
            <div style={{ fontFamily:'var(--fm)', fontSize:'.72rem', color:'#8fd9cc', marginBottom:'6px' }}>Degree {Math.max(0,nPts-1)} polynomial:</div>
            <div style={{ fontFamily:'var(--fm)', fontSize:'.86rem', color:'#e8ecff' }}>p(x) = {polyStr || '0'}</div>
            <div style={{ fontFamily:'var(--fm)', fontSize:'.78rem', color:'#c4cae8', marginTop:'8px' }}>p(1.5) ≈ {fmt(evalP(1.5))}</div>
          </div>
          <div style={{ fontFamily:'var(--fm)', fontSize:'.62rem', color:'#7079a0', marginTop:'8px', lineHeight:1.6 }}>
            Using points {JSON.stringify(pts)}. With 4 points the cubic term is 0 here — the data is secretly quadratic.
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════ RECURRENCE EXPLORER ═══════════════ */
function RecurrenceExplorer() {
  // presets: length-2 recurrences x_{k+2} = a*x_{k+1} + b*x_k
  const presets = {
    parking: { a:1, b:1, x0:1, x1:1, label:'Parking / Fibonacci', note:'x_{k+2} = x_{k+1} + x_k' },
    ex342:   { a:1, b:6, x0:1, x1:1, label:'Example 3.4.2', note:'x_{k+2} = x_{k+1} + 6x_k' },
    grow:    { a:3, b:2, x0:1, x1:1, label:'Exercise 3.4.1(a)', note:'x_{k+2} = 2x_{k+1} + 3x_k' },
  };
  const [key,setKey]=useState('parking');
  const p=presets[key];
  const canvasRef=useRef(null);

  // generate terms
  const N=14;
  const terms=[p.x0,p.x1];
  for(let k=0;k<N-2;k++) terms.push(p.a*terms[k+1]+p.b*terms[k]);

  // eigenvalues of [[0,1],[b,a]] : roots of L^2 - a L - b =0
  const disc=p.a*p.a+4*p.b;
  let eig=null;
  if(disc>=0){ const s=Math.sqrt(disc); eig=[(p.a+s)/2,(p.a-s)/2]; }

  useEffect(()=>{
    const cv=canvasRef.current; if(!cv) return;
    const ctx=cv.getContext('2d');
    const W=cv.width,H=cv.height,padL=34,padB=24;
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#12122a'; ctx.fillRect(0,0,W,H);
    const shown=terms.slice(0,10);
    const maxV=Math.max(...shown.map(Math.abs),1);
    const bw=(W-padL-10)/shown.length;
    ctx.fillStyle='#8892b8'; ctx.font='9px monospace';
    shown.forEach((v,i)=>{
      const h=(Math.abs(v)/maxV)*(H-padB-14);
      const x=padL+i*bw+bw*0.15, y=(H-padB)-h;
      ctx.fillStyle = v>=0? '#38c9b0':'#e06b6b';
      ctx.fillRect(x,y,bw*0.7,h);
      ctx.fillStyle='#8892b8'; ctx.fillText('x'+i, x, H-padB+12);
      ctx.fillStyle='#c4cae8'; ctx.font='10px monospace';
      if(Math.abs(v)<1e6) ctx.fillText(String(v), x, y-4);
      ctx.font='9px monospace';
    });
  },[key]);

  const fmt=(x)=> Math.abs(x-Math.round(x))<1e-4?String(Math.round(x)):x.toFixed(3);

  return (
    <div style={{ background:'#1a1a2e', border:'1px solid rgba(120,130,180,.3)', borderRadius:'16px', padding:'22px 24px', margin:'26px 0', color:'#e8ecff' }}>
      <div style={{ fontFamily:'var(--fm)', fontSize:'.72rem', letterSpacing:'.16em', textTransform:'uppercase', color:'#8fd9cc', marginBottom:'14px' }}>🎛 Recurrence Explorer</div>
      <div style={{ display:'flex', gap:'6px', flexWrap:'wrap', marginBottom:'14px' }}>
        {Object.entries(presets).map(([k,pr])=>(
          <button key={k} onClick={()=>setKey(k)} style={{
            fontFamily:'var(--fm)', fontSize:'.7rem', padding:'6px 12px', borderRadius:'20px', cursor:'pointer',
            border:'1px solid '+(key===k?'#38c9b0':'rgba(180,190,230,.3)'),
            background: key===k?'rgba(56,201,176,.2)':'transparent', color: key===k?'#8fd9cc':'#aab', fontWeight:600,
          }}>{pr.label}</button>
        ))}
      </div>
      <div style={{ fontFamily:'var(--fm)', fontSize:'.82rem', color:'#c4cae8', marginBottom:'12px' }}>
        {p.note} &nbsp;·&nbsp; x₀ = {p.x0}, x₁ = {p.x1}
      </div>
      <canvas ref={canvasRef} width={440} height={220} style={{ borderRadius:'12px', maxWidth:'100%', display:'block' }}/>
      <div style={{ display:'flex', flexWrap:'wrap', gap:'16px', marginTop:'12px' }}>
        <div style={{ background:'#22223e', borderRadius:'10px', padding:'10px 14px', borderLeft:'3px solid #9b80e8', flex:1, minWidth:'200px' }}>
          <div style={{ fontFamily:'var(--fm)', fontSize:'.7rem', color:'#b9a8f0', marginBottom:'4px' }}>First terms</div>
          <div style={{ fontFamily:'var(--fm)', fontSize:'.82rem', color:'#e8ecff' }}>{terms.slice(0,9).join(', ')}, …</div>
        </div>
        <div style={{ background:'#22223e', borderRadius:'10px', padding:'10px 14px', borderLeft:'3px solid #38c9b0', flex:1, minWidth:'200px' }}>
          <div style={{ fontFamily:'var(--fm)', fontSize:'.7rem', color:'#8fd9cc', marginBottom:'4px' }}>Eigenvalues (growth rates)</div>
          <div style={{ fontFamily:'var(--fm)', fontSize:'.82rem', color:'#e8ecff' }}>
            {eig ? `λ₁ = ${fmt(eig[0])}, λ₂ = ${fmt(eig[1])}` : 'complex (oscillating)'}
          </div>
        </div>
      </div>
      <div style={{ fontFamily:'var(--fm)', fontSize:'.62rem', color:'#7079a0', marginTop:'8px', lineHeight:1.6 }}>
        Bar height = |xₖ|. The larger eigenvalue is the long-term growth rate per step.
      </div>
    </div>
  );
}

/* ═══════════════ PAGE ═══════════════ */
export default function Lec13() {
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
        <span style={{color:'var(--text2)'}}>Week 4 · Lecture 13</span>
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
            <Link href={PREV_HREF} style={{ display:'flex', alignItems:'center', padding:'0 16px', height:'100%', fontFamily:'var(--fm)', fontSize:'.72rem', color:'var(--lec-ink3)', borderRight:'1px solid var(--lec-border)', whiteSpace:'nowrap', flexShrink:0, textDecoration:'none' }}>← Lecture 12</Link>
            <div style={{ flex:1, display:'flex', justifyContent:'center', alignItems:'center', gap:'4px', overflowX:'auto', padding:'0 8px' }}>
              <span style={{ fontFamily:'var(--fm)', fontSize:'.6rem', letterSpacing:'.12em', textTransform:'uppercase', color:'var(--lec-accent)', flexShrink:0, marginRight:'6px' }}>On this page</span>
              {ANCHORS.map(([label,id],i)=>(
                <span key={id} style={{display:'inline-flex',alignItems:'center',flexShrink:0}}>
                  {i>0&&<span style={{color:'var(--lec-border)',margin:'0 7px'}}>·</span>}
                  <a href={`#${id}`} onClick={e=>jump(e,id)} style={{fontFamily:'var(--fm)',fontSize:'.73rem',color:'var(--lec-ink2)',textDecoration:'none',whiteSpace:'nowrap'}}>{label}</a>
                </span>
              ))}
            </div>
            <Link href={NEXT_HREF} style={{ display:'flex', alignItems:'center', padding:'0 16px', height:'100%', fontFamily:'var(--fm)', fontSize:'.72rem', color:'var(--lec-ink3)', borderLeft:'1px solid var(--lec-border)', whiteSpace:'nowrap', flexShrink:0, textDecoration:'none' }}>Lecture 14 →</Link>
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

            <p>Today is a lecture of two applications. Each leans on one big tool you already own.</p>
            <p style={{margin:'4px 0'}}>{String.raw`• From Lecture 10: a square matrix is `}<b>invertible</b>{String.raw` exactly when its `}<b>determinant is not zero</b>{String.raw`. A system $M\mathbf{x} = \mathbf{b}$ then has one unique solution. We use this for the first topic, interpolation.`}</p>
            <p style={{margin:'4px 0'}}>{String.raw`• From Lecture 12: if a matrix $A$ has enough eigenvectors it is `}<b>diagonalizable</b>{String.raw`, and then $A^k = PD^kP^{-1}$ is easy to compute. We use this for the second topic, recurrences.`}</p>

            <Callout icon="🎯" title="The two questions of the day" color="teal">
              {String.raw`(1) Given a handful of data points, is there a single polynomial passing exactly through all of them — and how do we find it? (2) Given a sequence where each term is built from earlier ones (like $1,1,2,3,5,8,\ldots$), can we get a direct formula for the $k$-th term without listing all the ones before it?`}
            </Callout>

            {/* ════════ PART A: INTERPOLATION ════════ */}

            {/* ─── §2 WHY ─── */}
            <Sec id="interp-why" n="§2">Part A — Polynomial Interpolation: The Idea</Sec>

            <p>{String.raw`Very often two quantities are related, but you do not know the formula linking them. You only have measurements: a few input values $x_1, x_2, \ldots, x_n$ and their matching outputs $y_1, y_2, \ldots, y_n$. The question is simple:`}</p>

            <Callout icon="❓" title="The interpolation question" color="amber">
              {String.raw`Can we find a smooth curve that passes `}<b>exactly</b>{String.raw` through every data point — and then use it to `}<i>estimate</i>{String.raw` the output at some new input $a$ we did not measure?`}
            </Callout>

            <p>{String.raw`The most convenient curve to use is a `}<b>polynomial</b>{String.raw`, because polynomials are easy to write down, easy to evaluate, and easy to work with. A polynomial that passes through all the given points is called an `}<b>interpolating polynomial</b>{String.raw` for the data. Let us see it in action before stating anything general.`}</p>

            {/* ─── §3 TREE EXAMPLE ─── */}
            <Sec id="tree" n="§3">Example 3.2.10 — Guessing a Tree's Age</Sec>

            <Example n="1" title="A forester's problem">
              <p>{String.raw`A forester wants to estimate the age of a tree from the diameter of its trunk. She measures three trees:`}</p>
              <div style={{textAlign:'center', margin:'14px 0'}}>
                <table style={{margin:'0 auto', borderCollapse:'collapse', fontFamily:'var(--fm)', fontSize:'.9rem'}}>
                  <tbody>
                    <tr style={{borderBottom:'1px solid var(--lec-border)'}}><td style={{padding:'6px 16px', color:'var(--lec-ink3)'}}>Diameter (cm)</td><td style={{padding:'6px 16px'}}>5</td><td style={{padding:'6px 16px'}}>10</td><td style={{padding:'6px 16px'}}>15</td></tr>
                    <tr><td style={{padding:'6px 16px', color:'var(--lec-ink3)'}}>Age (years)</td><td style={{padding:'6px 16px'}}>3</td><td style={{padding:'6px 16px'}}>5</td><td style={{padding:'6px 16px'}}>6</td></tr>
                  </tbody>
                </table>
              </div>
              <p>{String.raw`So the data points are $(5, 3)$, $(10, 5)$, $(15, 6)$. Estimate the age of a tree whose trunk diameter is $12$ cm.`}</p>
              <Reveal label="Show full solution">
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Step 1 — pick the right degree.}$ We have $3$ points, so we look for a `}<b>degree-2</b>{String.raw` polynomial (a parabola) $p(x) = r_0 + r_1 x + r_2 x^2$. Why degree 2? Because it has exactly $3$ unknown coefficients $r_0, r_1, r_2$ — one for each data point. Three equations, three unknowns.`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Step 2 — write one equation per point.}$ Each point must satisfy $p(x) = y$:`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$\begin{aligned} p(5) = 3:&\quad r_0 + 5r_1 + 25r_2 = 3 \\ p(10) = 5:&\quad r_0 + 10r_1 + 100r_2 = 5 \\ p(15) = 6:&\quad r_0 + 15r_1 + 225r_2 = 6 \end{aligned}$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Step 3 — solve the system.}$ Solving these three linear equations (by Gaussian elimination) gives`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$r_0 = 0, \qquad r_1 = \frac{7}{10}, \qquad r_2 = -\frac{1}{50}.$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`So the interpolating polynomial is $p(x) = \dfrac{7}{10}x - \dfrac{1}{50}x^2$.`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Step 4 — estimate.}$ Plug in $x = 12$:`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$p(12) = \frac{7}{10}(12) - \frac{1}{50}(144) = 8.4 - 2.88 = 5.52.$$`}</p>
                <p style={{margin:0}}>{String.raw`So a tree with a $12$ cm trunk is about $\mathbf{5.5}$ years old. Notice this sits sensibly between the age-5 tree (10 cm) and the age-6 tree (15 cm), which is a good sanity check.`}</p>
              </Reveal>
            </Example>

            <Callout icon="⚠️" title="What interpolation does and does not promise" color="rose">
              {String.raw`The polynomial passes `}<i>exactly</i>{String.raw` through your measured points. But between and beyond them it is only an `}<b>estimate</b>{String.raw`. Trees do not truly follow a parabola forever — push the diameter to $100$ cm and the formula gives nonsense (the parabola bends back down). Interpolation is trustworthy `}<i>near</i>{String.raw` your data, risky far from it.`}
            </Callout>

            {/* ─── §4 SETUP ─── */}
            <Sec id="setup" n="§4">The General Setup</Sec>

            <p>{String.raw`The tree example shows the whole pattern. Suppose you have $n$ data points $(x_1, y_1), \ldots, (x_n, y_n)$ with all the $x_i$ `}<b>distinct</b>{String.raw` (no two measurements at the same input). Look for a polynomial of degree $n-1$:`}</p>
            <p style={{textAlign:'center'}}>{String.raw`$$p(x) = r_0 + r_1 x + r_2 x^2 + \cdots + r_{n-1}x^{n-1}.$$`}</p>
            <p>{String.raw`It has $n$ unknown coefficients $r_0, \ldots, r_{n-1}$. Demanding $p(x_i) = y_i$ for each point gives $n$ linear equations:`}</p>
            <p style={{textAlign:'center'}}>{String.raw`$$\begin{aligned} r_0 + r_1 x_1 + \cdots + r_{n-1}x_1^{n-1} &= y_1 \\ r_0 + r_1 x_2 + \cdots + r_{n-1}x_2^{n-1} &= y_2 \\ &\;\;\vdots \\ r_0 + r_1 x_n + \cdots + r_{n-1}x_n^{n-1} &= y_n \end{aligned}$$`}</p>
            <p>{String.raw`In matrix form $V\mathbf{r} = \mathbf{y}$, where the coefficient matrix $V$ collects the powers of the inputs:`}</p>
            <p style={{textAlign:'center'}}>{String.raw`$$\underbrace{\begin{bmatrix} 1 & x_1 & x_1^2 & \cdots & x_1^{n-1} \\ 1 & x_2 & x_2^2 & \cdots & x_2^{n-1} \\ \vdots & \vdots & \vdots & & \vdots \\ 1 & x_n & x_n^2 & \cdots & x_n^{n-1} \end{bmatrix}}_{V}\begin{bmatrix} r_0 \\ r_1 \\ \vdots \\ r_{n-1} \end{bmatrix} = \begin{bmatrix} y_1 \\ y_2 \\ \vdots \\ y_n \end{bmatrix}.$$`}</p>

            <ThmBox title="Theorem 3.2.6 — the interpolating polynomial exists and is unique">
              <p style={{margin:0}}>{String.raw`Given $n$ data pairs $(x_1, y_1), \ldots, (x_n, y_n)$ with the $x_i$ all distinct, there is `}<b>exactly one</b>{String.raw` polynomial $p(x)$ of degree at most $n-1$ with $p(x_i) = y_i$ for every $i$.`}</p>
            </ThmBox>

            {/* ─── §5 VANDERMONDE ─── */}
            <Sec id="vandermonde" n="§5">Why It Always Works: The Vandermonde Determinant</Sec>

            <p>{String.raw`Theorem 3.2.6 claims a unique solution always exists. From Lecture 10 we know a square system $V\mathbf{r} = \mathbf{y}$ has a unique solution `}<i>exactly when</i>{String.raw` $\det V \neq 0$. So the whole theorem rests on one fact: the determinant of that special powers-matrix is never zero (as long as the inputs are distinct).`}</p>

            <DefBox term="Vandermonde matrix and determinant" color="violet">
              <p style={{margin:0}}>{String.raw`The matrix $V$ built from powers of $x_1, \ldots, x_n$ is called a `}<b>Vandermonde matrix</b>{String.raw`. Its determinant has a beautiful closed form — it is the product of all the differences of the inputs:`}</p>
              <p style={{textAlign:'center', margin:'8px 0 0'}}>{String.raw`$$\det V = \prod_{i > j}(x_i - x_j).$$`}</p>
            </DefBox>

            <p>{String.raw`$\textbf{Why this settles everything.}$ Each factor $(x_i - x_j)$ is the gap between two of the inputs. If all the inputs are `}<b>distinct</b>{String.raw`, every gap is non-zero, so the whole product is non-zero, so $\det V \neq 0$. That is precisely the condition for a unique solution. The polynomial exists and is one-of-a-kind. $\;\blacksquare$`}</p>

            <Callout icon="🔎" title="A concrete check (n = 2)" color="teal">
              {String.raw`For two points, $V = \begin{bmatrix} 1 & x_1 \\ 1 & x_2 \end{bmatrix}$ and $\det V = x_2 - x_1$. This is zero only if $x_1 = x_2$ — that is, only if you tried to record two different outputs at the `}<i>same</i>{String.raw` input, which is impossible for a real function. Distinct inputs guarantee a straight line through the two points. The general Vandermonde formula is just this idea scaled up.`}
            </Callout>

            {/* ─── §6 INTERP EXAMPLES ─── */}
            <Sec id="interp-ex" n="§6">Worked Example & Explorer</Sec>

            <Example n="2" title="Exercise 3.2.24(a) — a cubic through four points">
              <p>{String.raw`Find the interpolating polynomial of degree 3 for the data $(0, 1)$, $(1, 2)$, $(2, 5)$, $(3, 10)$, and estimate $y$ at $x = 1.5$.`}</p>
              <Reveal label="Show full solution">
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Step 1.}$ Four points $\Rightarrow$ degree-3 polynomial $p(x) = r_0 + r_1 x + r_2 x^2 + r_3 x^3$. The four conditions $p(x_i) = y_i$ are`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$\begin{aligned} p(0) = 1:&\quad r_0 = 1 \\ p(1) = 2:&\quad r_0 + r_1 + r_2 + r_3 = 2 \\ p(2) = 5:&\quad r_0 + 2r_1 + 4r_2 + 8r_3 = 5 \\ p(3) = 10:&\quad r_0 + 3r_1 + 9r_2 + 27r_3 = 10 \end{aligned}$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Step 2 — solve.}$ From the first equation $r_0 = 1$. Substituting and reducing the rest gives`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$r_0 = 1, \quad r_1 = 0, \quad r_2 = 1, \quad r_3 = 0.$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Step 3 — read the polynomial.}$ $p(x) = 1 + x^2$. The cubic and linear coefficients came out `}<b>zero</b>{String.raw` — the data was secretly a parabola all along. Interpolation `}<i>discovered</i>{String.raw` that: if the true relationship has lower degree, the extra coefficients simply vanish.`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Step 4 — estimate.}$ $p(1.5) = 1 + (1.5)^2 = 1 + 2.25 = 3.25$.`}</p>
                <p style={{margin:0}}>{String.raw`So $y \approx \mathbf{3.25}$ at $x = 1.5$.`}</p>
              </Reveal>
            </Example>

            <p>{String.raw`Try it below. Switch between 2, 3, and 4 of the points and watch the polynomial change degree to thread exactly through them. Notice that at 4 points, the curve is the same parabola as at 3 — because this data is quadratic.`}</p>

            <InterpPlotter/>

            {/* ════════ PART B: LINEAR RECURRENCES ════════ */}

            {/* ─── §7 REC WHY ─── */}
            <Sec id="rec-why" n="§7">Part B — Linear Recurrences: The Idea</Sec>

            <p>{String.raw`A `}<b>recursive sequence</b>{String.raw` is one where each new term is built from earlier terms by a fixed rule. You know the first few values, and a formula tells you how to get the next from the ones before it.`}</p>

            <DefBox term="Linear recurrence" color="teal">
              <p style={{margin:0}}>{String.raw`A sequence $x_0, x_1, x_2, \ldots$ satisfies a `}<b>linear recurrence of length $m$</b>{String.raw` if each term is a fixed combination of the $m$ terms before it. For length 2: $$x_{k+2} = a\,x_{k+1} + b\,x_k \quad \text{for all } k \geq 0,$$ once the starting values $x_0$ and $x_1$ are given.`}</p>
            </DefBox>

            <p>{String.raw`Computing terms one by one is easy but slow — to get $x_{100}$ you must first find all $99$ earlier terms. The goal is a `}<b>closed formula</b>{String.raw`: a direct expression for $x_k$ as a function of $k$, so you can jump straight to $x_{100}$. Diagonalization delivers exactly that. But first, where do these sequences even come from?`}</p>

            {/* ─── §8 PARKING ─── */}
            <Sec id="parking" n="§8">Example 3.4.1 — Counting Parking Arrangements</Sec>

            <Example n="3" title="Cars and trucks in a row">
              <p>{String.raw`A row has $k$ parking spaces. A car takes $1$ space, a truck takes $2$. Let $x_k$ be the number of different ways to fill the row exactly. Find the first few values, and a rule connecting them.`}</p>
              <Reveal label="Show the reasoning">
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Count the small cases by hand.}$`}</p>
                <p style={{margin:'2px 0'}}>{String.raw`• $x_0 = 1$: one way to fill zero spaces (park nothing).`}</p>
                <p style={{margin:'2px 0'}}>{String.raw`• $x_1 = 1$: one space, only a car fits — "c".`}</p>
                <p style={{margin:'2px 0'}}>{String.raw`• $x_2 = 2$: two cars "cc" or one truck "T".`}</p>
                <p style={{margin:'2px 0'}}>{String.raw`• $x_3 = 3$: "ccc", "cT", "Tc".`}</p>
                <p style={{margin:'2px 0'}}>{String.raw`• $x_4 = 5$: "cccc", "ccT", "cTc", "Tcc", "TT".`}</p>
                <p style={{margin:'10px 0 8px'}}>{String.raw`$\textbf{Find the pattern (the clever step).}$ Think about the `}<i>very first</i>{String.raw` space in a row of $k+2$ spaces. There are only two possibilities:`}</p>
                <p style={{margin:'2px 0'}}>{String.raw`• A `}<b>car</b>{String.raw` sits in the first space. The remaining $k+1$ spaces can be filled in $x_{k+1}$ ways.`}</p>
                <p style={{margin:'2px 0'}}>{String.raw`• A `}<b>truck</b>{String.raw` sits in the first two spaces. The remaining $k$ spaces can be filled in $x_k$ ways.`}</p>
                <p style={{margin:'10px 0 8px'}}>{String.raw`These two cases never overlap and cover everything, so we `}<b>add</b>{String.raw` them:`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$x_{k+2} = x_{k+1} + x_k \quad \text{for every } k \geq 0. \tag{3.11}$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`Now the whole sequence rolls out from $x_0 = 1$, $x_1 = 1$:`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$1,\; 1,\; 2,\; 3,\; 5,\; 8,\; 13,\; 21,\; \ldots$$`}</p>
                <p style={{margin:0}}>{String.raw`You may recognise these numbers. We will — the closed formula is coming, and it is famous.`}</p>
              </Reveal>
            </Example>

            {/* ─── §9 THE TRICK ─── */}
            <Sec id="trick" n="§9">The Matrix Trick: Turning a Recurrence into Aⱽₖ</Sec>

            <p>{String.raw`A recurrence links `}<i>numbers</i>{String.raw`. Diagonalization works on `}<i>matrices</i>{String.raw`. The bridge is a simple, clever repackaging: instead of tracking one number at a time, track a `}<b>vector</b>{String.raw` holding two consecutive terms.`}</p>

            <p>{String.raw`$\textbf{Step 1 — stack two terms into a vector.}$ Define`}</p>
            <p style={{textAlign:'center'}}>{String.raw`$$\mathbf{v}_k = \begin{bmatrix} x_k \\ x_{k+1} \end{bmatrix}.$$`}</p>
            <p>{String.raw`$\textbf{Step 2 — find the matrix that advances it one step.}$ We want a matrix $A$ with $\mathbf{v}_{k+1} = A\mathbf{v}_k$. The top of $\mathbf{v}_{k+1}$ is $x_{k+1}$ (already in $\mathbf{v}_k$), and the bottom is $x_{k+2} = a x_{k+1} + b x_k$ (the recurrence). So`}</p>
            <p style={{textAlign:'center'}}>{String.raw`$$\mathbf{v}_{k+1} = \begin{bmatrix} x_{k+1} \\ x_{k+2} \end{bmatrix} = \begin{bmatrix} 0\cdot x_k + 1\cdot x_{k+1} \\ b\, x_k + a\, x_{k+1} \end{bmatrix} = \underbrace{\begin{bmatrix} 0 & 1 \\ b & a \end{bmatrix}}_{A}\begin{bmatrix} x_k \\ x_{k+1} \end{bmatrix} = A\mathbf{v}_k.$$`}</p>
            <p>{String.raw`$\textbf{Step 3 — recognise a dynamical system.}$ This is exactly the setup from Lecture 12: $\mathbf{v}_k = A^k\mathbf{v}_0$. And if $A$ is diagonalizable with eigenvalues $\lambda_1, \lambda_2$ and eigenvectors $\mathbf{x}_1, \mathbf{x}_2$, we get the closed formula`}</p>
            <p style={{textAlign:'center'}}>{String.raw`$$\mathbf{v}_k = b_1\lambda_1^k\,\mathbf{x}_1 + b_2\lambda_2^k\,\mathbf{x}_2, \qquad \text{where } \begin{bmatrix} b_1 \\ b_2 \end{bmatrix} = P^{-1}\mathbf{v}_0.$$`}</p>
            <p>{String.raw`Reading off the `}<i>top entry</i>{String.raw` of $\mathbf{v}_k$ gives $x_k$ as a direct formula in $k$. No more stepping through every term.`}</p>

            <ThmBox title="The recipe for solving a length-2 recurrence">
              <p style={{margin:'4px 0'}}>{String.raw`$\textbf{1.}$ Build the matrix $A = \begin{bmatrix} 0 & 1 \\ b & a \end{bmatrix}$ from $x_{k+2} = a x_{k+1} + b x_k$.`}</p>
              <p style={{margin:'4px 0'}}>{String.raw`$\textbf{2.}$ Find eigenvalues (roots of $\lambda^2 - a\lambda - b = 0$) and eigenvectors.`}</p>
              <p style={{margin:'4px 0'}}>{String.raw`$\textbf{3.}$ Compute $\mathbf{b} = P^{-1}\mathbf{v}_0$ with $\mathbf{v}_0 = \begin{bmatrix} x_0 \\ x_1 \end{bmatrix}$.`}</p>
              <p style={{margin:'4px 0'}}>{String.raw`$\textbf{4.}$ Read $x_k$ from the top entry of $b_1\lambda_1^k\mathbf{x}_1 + b_2\lambda_2^k\mathbf{x}_2$.`}</p>
            </ThmBox>

            <Callout icon="💡" title="A shortcut for the eigenvectors" color="violet">
              {String.raw`For this companion matrix $A = \begin{bmatrix} 0 & 1 \\ b & a \end{bmatrix}$, the eigenvector for an eigenvalue $\lambda$ is always $\begin{bmatrix} 1 \\ \lambda \end{bmatrix}$. (Check: $A\begin{bmatrix} 1 \\ \lambda \end{bmatrix} = \begin{bmatrix} \lambda \\ b + a\lambda \end{bmatrix}$, and since $\lambda^2 = a\lambda + b$, the bottom is $\lambda^2$, giving $\lambda\begin{bmatrix} 1 \\ \lambda \end{bmatrix}$.) This saves you the row-reduction every time.`}
            </Callout>

            {/* ─── §10 WORKED ─── */}
            <Sec id="rec-ex" n="§10">Worked Example 3.4.2</Sec>

            <Example n="4" title="x_{k+2} = x_{k+1} + 6x_k, two different starts" advanced>
              <p>{String.raw`Solve the recurrence $x_{k+2} = x_{k+1} + 6x_k$ for two cases: (i) $x_0 = 1, x_1 = 3$, and (ii) $x_0 = 1, x_1 = 1$.`}</p>
              <Reveal label="Show full solution">
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Set up the matrix (shared by both cases).}$ Here $a = 1$, $b = 6$, so $A = \begin{bmatrix} 0 & 1 \\ 6 & 1 \end{bmatrix}$.`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Eigenvalues.}$ Solve $\lambda^2 - \lambda - 6 = 0$, i.e. $(\lambda - 3)(\lambda + 2) = 0$. So $\lambda_1 = 3$, $\lambda_2 = -2$. Using the shortcut, eigenvectors are $\mathbf{x}_1 = \begin{bmatrix} 1 \\ 3 \end{bmatrix}$ and $\mathbf{x}_2 = \begin{bmatrix} 1 \\ -2 \end{bmatrix}$, so $P = \begin{bmatrix} 1 & 1 \\ 3 & -2 \end{bmatrix}$.`}</p>
                <p style={{margin:'12px 0 8px'}}>{String.raw`$\textbf{Case (i): } x_0 = 1, x_1 = 3.$ Then $\mathbf{v}_0 = \begin{bmatrix} 1 \\ 3 \end{bmatrix}$, and $\mathbf{b} = P^{-1}\mathbf{v}_0 = \begin{bmatrix} 1 \\ 0 \end{bmatrix}$. Only the $\lambda_1 = 3$ term survives:`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$x_k = 1\cdot 3^k\cdot 1 + 0 = 3^k.$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`Check: $1, 3, 9, 27, 81, \ldots$ — indeed each term is $3^k$, and $9 = 3 + 6(1)$ ✓. A clean single power because the start lined up perfectly with one eigenvector.`}</p>
                <p style={{margin:'12px 0 8px'}}>{String.raw`$\textbf{Case (ii): } x_0 = 1, x_1 = 1.$ Then $\mathbf{v}_0 = \begin{bmatrix} 1 \\ 1 \end{bmatrix}$, and $\mathbf{b} = P^{-1}\mathbf{v}_0 = \begin{bmatrix} 3/5 \\ 2/5 \end{bmatrix}$. Both terms survive:`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$x_k = \frac{3}{5}\cdot 3^k + \frac{2}{5}\cdot(-2)^k = \frac{1}{5}\Big[3^{k+1} + 2(-2)^k\Big].$$`}</p>
                <p style={{margin:0}}>{String.raw`Check: this gives $1, 1, 7, 13, 55, 133, \ldots$, and $7 = 1 + 6(1)$ ✓, $13 = 7 + 6(1)$ ✓. The two starts, same recurrence, produce completely different formulas — the initial conditions decide which eigenvalue dominates.`}</p>
              </Reveal>
            </Example>

            {/* ─── §11 FIBONACCI ─── */}
            <Sec id="fibonacci" n="§11">The Payoff: Fibonacci and the Binet Formula</Sec>

            <p>{String.raw`Return to the parking sequence $1, 1, 2, 3, 5, 8, 13, 21, \ldots$ with $x_{k+2} = x_{k+1} + x_k$. These are the `}<b>Fibonacci numbers</b>{String.raw`, first written down in 1202 by Leonardo of Pisa (nicknamed Fibonacci). They appear in the spirals of sunflowers, pinecones, and nautilus shells. Let us get their exact formula.`}</p>

            <Example n="5" title="A closed formula for Fibonacci" advanced>
              <p>{String.raw`Solve $x_{k+2} = x_{k+1} + x_k$ with $x_0 = 1$, $x_1 = 1$.`}</p>
              <Reveal label="Show the derivation">
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Matrix and eigenvalues.}$ Here $a = b = 1$, so $A = \begin{bmatrix} 0 & 1 \\ 1 & 1 \end{bmatrix}$ and the eigenvalues solve $\lambda^2 - \lambda - 1 = 0$:`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$\lambda_1 = \frac{1 + \sqrt{5}}{2} \approx 1.618, \qquad \lambda_2 = \frac{1 - \sqrt{5}}{2} \approx -0.618.$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`The bigger one, $\lambda_1 \approx 1.618$, is the famous `}<b>golden ratio</b>{String.raw`, written $\varphi$.`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Coefficients.}$ With $\mathbf{v}_0 = \begin{bmatrix} 1 \\ 1 \end{bmatrix}$ and eigenvectors $\begin{bmatrix} 1 \\ \lambda_1 \end{bmatrix}, \begin{bmatrix} 1 \\ \lambda_2 \end{bmatrix}$, solving $\mathbf{b} = P^{-1}\mathbf{v}_0$ gives $b_1 = \dfrac{\lambda_1}{\sqrt5}$, $b_2 = -\dfrac{\lambda_2}{\sqrt5}$.`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Reading the top entry}$ produces the `}<b>Binet formula</b>{String.raw`:`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$x_k = \frac{1}{\sqrt{5}}\Big[\lambda_1^{\,k+1} - \lambda_2^{\,k+1}\Big] = \frac{1}{\sqrt{5}}\left[\left(\frac{1+\sqrt5}{2}\right)^{k+1} - \left(\frac{1-\sqrt5}{2}\right)^{k+1}\right].$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{The remarkable part.}$ This formula is stuffed with $\sqrt5$ and irrational numbers, yet it always spits out `}<b>whole numbers</b>{String.raw`: $1, 1, 2, 3, 5, 8, \ldots$. The irrational pieces cancel perfectly every time.`}</p>
                <p style={{margin:0}}>{String.raw`$\textbf{Long-term behaviour.}$ Since $|\lambda_2| < 1$, the second term shrinks to nothing. For large $k$, $x_k \approx \dfrac{1}{\sqrt5}\lambda_1^{\,k+1}$. Even at $k = 12$ this approximation gives $232.94$ against the true value $x_{12} = 233$ — already almost exact. The golden ratio $\lambda_1$ is the sequence's growth rate: each Fibonacci number is about $1.618$ times the one before.`}</p>
              </Reveal>
            </Example>

            <Callout icon="🌻" title="Why the golden ratio shows up in nature" color="amber">
              {String.raw`Because $\lambda_1 \approx 1.618$ is the `}<b>dominant eigenvalue</b>{String.raw`, the ratio $x_{k+1}/x_k$ homes in on it as $k$ grows. Plants that add leaves or seeds following a Fibonacci rule end up spacing them by the golden angle — which packs them most efficiently without overlap. The math of the dominant eigenvalue is literally why sunflower spirals look the way they do.`}
            </Callout>

            {/* ─── §12 COLLATZ ─── */}
            <Sec id="collatz" n="§12">A Warning: Not Every Recurrence Is Tame</Sec>

            <p>{String.raw`Diagonalization cracks `}<i>linear</i>{String.raw` recurrences. But a tiny change to the rule can produce a sequence that no one on Earth understands. Here is the most famous unsolved problem in this corner of mathematics.`}</p>

            <Example n="6" title="Example 3.4.4 — the Collatz sequence">
              <p>{String.raw`Define a sequence by a rule that depends on whether the current term is even or odd:`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$x_{k+1} = \begin{cases} \tfrac12 x_k & \text{if } x_k \text{ is even} \\ 3x_k + 1 & \text{if } x_k \text{ is odd.} \end{cases}$$`}</p>
              <p>{String.raw`Starting from $x_0 = 7$, the sequence goes`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$7,\, 22,\, 11,\, 34,\, 17,\, 52,\, 26,\, 13,\, 40,\, 20,\, 10,\, 5,\, 16,\, 8,\, 4,\, 2,\, 1,\, \ldots$$`}</p>
              <p>{String.raw`and then cycles $1, 4, 2, 1, 4, 2, \ldots$ forever. Try $x_0 = 1$: it immediately falls into the same $1, 4, 2$ loop.`}</p>
              <Callout icon="🧩" title="The open question" color="rose">
                {String.raw`Does `}<b>every</b>{String.raw` starting value eventually reach $1$? This is the `}<b>Collatz conjecture</b>{String.raw`. It has been checked by computer for numbers up to about $2^{68}$ and always reaches 1 — but `}<b>no one has proved it must always happen</b>{String.raw`. The rule is not linear (the "even or odd" branch breaks linearity), so our matrix method does not apply, and neither does anything else anyone has tried. A problem a child can understand has defeated every mathematician for ninety years.`}
              </Callout>
              <p style={{margin:0}}>{String.raw`The lesson: the clean closed-form world of linear recurrences is a `}<i>special, lucky</i>{String.raw` case. Diagonalization is powerful precisely because linear structure is exactly what it needs — and exactly what the Collatz rule lacks.`}</p>
            </Example>

            {/* ─── §13 PLAYGROUND ─── */}
            <Sec id="playground" n="§13">Interactive: Recurrence Explorer</Sec>

            <p>{String.raw`Pick a recurrence and watch its terms grow. The bar chart shows $|x_k|$; the panel shows the eigenvalues, which are the growth rates. Notice how the larger eigenvalue sets how fast the bars climb.`}</p>

            <RecurrenceExplorer/>

            {/* SUMMARY */}
            <div style={{ marginTop:'40px', padding:'24px 28px', background:'rgba(232,160,32,.08)', border:'2px solid rgba(232,160,32,.35)', borderRadius:'16px' }}>
              <div style={{ fontFamily:'var(--fm)', fontSize:'.7rem', letterSpacing:'.16em', textTransform:'uppercase', color:'#c8860a', marginBottom:'12px' }}>Summary of key points</div>
              <ul style={{ color:'var(--lec-ink2)', fontSize:'1rem', lineHeight:1.9, margin:0, paddingLeft:'22px' }}>
                <li><b>Interpolation:</b>{String.raw` $n$ data points with distinct inputs $\Rightarrow$ a unique polynomial of degree $\leq n-1$ through them all (Theorem 3.2.6).`}</li>
                <li>{String.raw`Find it by solving $V\mathbf{r} = \mathbf{y}$, where $V$ is the Vandermonde matrix of input powers.`}</li>
                <li>{String.raw`It works because $\det V = \prod_{i>j}(x_i - x_j) \neq 0$ whenever the inputs are distinct.`}</li>
                <li>{String.raw`Interpolation is reliable near the data, unreliable far from it.`}</li>
                <li><b>Recurrences:</b>{String.raw` a length-2 recurrence $x_{k+2} = ax_{k+1} + bx_k$ becomes $\mathbf{v}_{k+1} = A\mathbf{v}_k$ with $A = \begin{bmatrix} 0 & 1 \\ b & a \end{bmatrix}$ and $\mathbf{v}_k = \begin{bmatrix} x_k \\ x_{k+1} \end{bmatrix}$.`}</li>
                <li>{String.raw`Diagonalize $A$: $x_k$ is the top entry of $b_1\lambda_1^k\mathbf{x}_1 + b_2\lambda_2^k\mathbf{x}_2$, with $\mathbf{b} = P^{-1}\mathbf{v}_0$.`}</li>
                <li>{String.raw`Companion-matrix eigenvector shortcut: for eigenvalue $\lambda$, use $\begin{bmatrix} 1 \\ \lambda \end{bmatrix}$.`}</li>
                <li>{String.raw`Fibonacci $\to$ Binet formula; the golden ratio $\varphi \approx 1.618$ is the dominant eigenvalue and long-term growth rate.`}</li>
                <li>{String.raw`Non-linear recurrences (Collatz) fall outside this method — and can be genuinely unsolved.`}</li>
              </ul>
            </div>

            {/* ─── §14 EXERCISES ─── */}
            <Sec id="exercises" n="§14">Exercises</Sec>

            <p style={{fontStyle:'italic', color:'var(--lec-ink3)'}}>{String.raw`Two are solved in full below. The rest are the same type — hints are given, but work them yourself. That is where the learning happens.`}</p>

            <Exercise id="3.4.1(a)" title="Solve x_{k+2} = 2x_{k+1} + 3x_k, with x₀ = 1, x₁ = 1  [SOLVED]">
              <Reveal label="Show full solution">
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Step 1 — matrix.}$ Here $a = 2$, $b = 3$, so $A = \begin{bmatrix} 0 & 1 \\ 3 & 2 \end{bmatrix}$.`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Step 2 — eigenvalues.}$ Solve $\lambda^2 - 2\lambda - 3 = 0$, i.e. $(\lambda - 3)(\lambda + 1) = 0$. So $\lambda_1 = 3$, $\lambda_2 = -1$. Eigenvectors (shortcut): $\begin{bmatrix} 1 \\ 3 \end{bmatrix}$ and $\begin{bmatrix} 1 \\ -1 \end{bmatrix}$, so $P = \begin{bmatrix} 1 & 1 \\ 3 & -1 \end{bmatrix}$.`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Step 3 — coefficients.}$ $\mathbf{v}_0 = \begin{bmatrix} 1 \\ 1 \end{bmatrix}$. Then $P^{-1} = \dfrac{1}{-4}\begin{bmatrix} -1 & -1 \\ -3 & 1 \end{bmatrix}$, giving $\mathbf{b} = P^{-1}\mathbf{v}_0 = \begin{bmatrix} 1/2 \\ 1/2 \end{bmatrix}$.`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Step 4 — read the formula}$ (top entry, both eigenvector tops are 1):`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$x_k = \frac{1}{2}\cdot 3^k + \frac{1}{2}\cdot(-1)^k = \frac{3^k + (-1)^k}{2}.$$`}</p>
                <p style={{margin:0}}>{String.raw`$\textbf{Check.}$ $x_0 = \tfrac{1+1}{2} = 1$ ✓, $x_1 = \tfrac{3-1}{2} = 1$ ✓, $x_2 = \tfrac{9+1}{2} = 5$, and $2(1) + 3(1) = 5$ ✓. First terms: $1, 1, 5, 13, 41, 121, \ldots$`}</p>
              </Reveal>
            </Exercise>

            <Exercise id="3.4.1(b–d)" title="Solve the other length-2 recurrences  [HINTS ONLY]">
              <p style={{margin:'0 0 6px'}}>{String.raw`$\textbf{(b)}\; x_{k+2} = 2x_k - x_{k+1}$, $x_0 = 1, x_1 = 2$.`}</p>
              <p style={{margin:'0 0 6px'}}>{String.raw`$\textbf{(c)}\; x_{k+2} = x_{k+1} + 2x_k$, $x_0 = 0, x_1 = 1$.`}</p>
              <p style={{margin:'0 0 12px'}}>{String.raw`$\textbf{(d)}\; x_{k+2} = 6x_k - x_{k+1}$, $x_0 = 1, x_1 = 1$.`}</p>
              <Callout icon="🧭" title="Hint" color="teal">
                {String.raw`Each is the same four-step recipe as 3.4.1(a). Be careful reading off $a$ and $b$: rewrite each in the standard order $x_{k+2} = a\,x_{k+1} + b\,x_k$ first. For (b), $a = -1$ and $b = 2$, so the matrix is $\begin{bmatrix} 0 & 1 \\ 2 & -1 \end{bmatrix}$. All three factor into integer eigenvalues — if your quadratic does not factor cleanly, recheck the signs of $a$ and $b$.`}
              </Callout>
            </Exercise>

            <Exercise id="3.4.2(a)" title="Solve the length-3 recurrence x_{k+3} = 6x_{k+2} − 11x_{k+1} + 6x_k, x₀=1, x₁=0, x₂=1  [SOLVED]" >
              <p>{String.raw`This is `}<b>length 3</b>{String.raw` — each term uses the `}<i>three</i>{String.raw` before it. The method is the same idea scaled up: stack three terms into a vector.`}</p>
              <Reveal label="Show full solution">
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Step 1 — stack three terms.}$ Let $\mathbf{v}_k = \begin{bmatrix} x_k \\ x_{k+1} \\ x_{k+2} \end{bmatrix}$. The top two entries of $\mathbf{v}_{k+1}$ just shift up; the bottom is the recurrence. This gives a $3\times3$ companion matrix:`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$\mathbf{v}_{k+1} = \begin{bmatrix} 0 & 1 & 0 \\ 0 & 0 & 1 \\ 6 & -11 & 6 \end{bmatrix}\mathbf{v}_k = A\mathbf{v}_k.$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`(The bottom row holds the coefficients $6, -11, 6$ from $x_{k+3} = 6x_k - 11x_{k+1} + 6x_{k+2}$, in order.)`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Step 2 — eigenvalues.}$ The characteristic polynomial factors as $(\lambda - 1)(\lambda - 2)(\lambda - 3)$, so $\lambda = 1, 2, 3$. For a length-3 companion matrix the eigenvector for $\lambda$ is $\begin{bmatrix} 1 \\ \lambda \\ \lambda^2 \end{bmatrix}$, giving`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$P = \begin{bmatrix} 1 & 1 & 1 \\ 1 & 2 & 3 \\ 1 & 4 & 9 \end{bmatrix}.$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Step 3 — coefficients.}$ With $\mathbf{v}_0 = \begin{bmatrix} 1 \\ 0 \\ 1 \end{bmatrix}$, solving $\mathbf{b} = P^{-1}\mathbf{v}_0$ gives $\mathbf{b} = \begin{bmatrix} 7/2 \\ -4 \\ 3/2 \end{bmatrix}$.`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Step 4 — read the top entry}$ (eigenvector tops are all 1):`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$x_k = \frac{7}{2}\cdot 1^k - 4\cdot 2^k + \frac{3}{2}\cdot 3^k = \frac{7}{2} - 4\cdot 2^k + \frac{3}{2}\cdot 3^k.$$`}</p>
                <p style={{margin:0}}>{String.raw`$\textbf{Check.}$ $x_0 = \tfrac72 - 4 + \tfrac32 = 1$ ✓, $x_1 = \tfrac72 - 8 + \tfrac92 = 0$ ✓, $x_2 = \tfrac72 - 16 + \tfrac{27}{2} = 1$ ✓. First terms: $1, 0, 1, 12, 61, 240, \ldots$`}</p>
              </Reveal>
            </Exercise>

            <Exercise id="3.4.2(b)" title="Solve x_{k+3} = −2x_{k+2} + x_{k+1} + 2x_k, x₀=1, x₁=0, x₂=1  [HINT ONLY]">
              <Callout icon="🧭" title="Hint" color="teal">
                {String.raw`Same length-3 method as 3.4.2(a). The companion matrix is $\begin{bmatrix} 0 & 1 & 0 \\ 0 & 0 & 1 \\ 2 & 1 & -2 \end{bmatrix}$ (bottom row = coefficients of $x_k, x_{k+1}, x_{k+2}$). Its characteristic polynomial factors with three distinct integer roots — find them, use eigenvectors $\begin{bmatrix} 1 \\ \lambda \\ \lambda^2 \end{bmatrix}$, then solve $\mathbf{b} = P^{-1}\mathbf{v}_0$ and read the top entry.`}
              </Callout>
            </Exercise>

            <Exercise id="3.4.3" title="Add buses to the parking problem  [HINT ONLY]">
              <p>{String.raw`In the parking problem, now also allow buses, which take `}<b>3</b>{String.raw` spaces. Let $x_k$ count the ways to fill $k$ spaces with cars, trucks, and buses.`}</p>
              <Callout icon="🧭" title="Hint" color="teal">
                {String.raw`Repeat the first-space argument from Example 3. Now there are `}<i>three</i>{String.raw` cases for what fills the front: a car (1 space, $x_{k+2}$ ways left in a row of $k+3$), a truck (2 spaces, $x_{k+1}$ ways), or a bus (3 spaces, $x_k$ ways). Adding these gives the length-3 recurrence $$x_{k+3} = x_{k+2} + x_{k+1} + x_k.$$ Then solve it by the length-3 method above (this is the "Tribonacci" sequence). The hint in the book — "the eigenvalues are of little use" — means the roots are not nice integers, so for a numeric answer like $x_{10}$ it is faster to just iterate the recurrence than to find a closed form.`}
              </Callout>
            </Exercise>

            <Exercise id="3.4.4" title="Climbing stairs one or two at a time  [HINT ONLY]">
              <p>{String.raw`A man climbs $k$ stairs, taking $1$ or $2$ at a time. Let $s_k$ be the number of ways. Find $s_k$.`}</p>
              <Callout icon="🧭" title="Hint" color="teal">
                {String.raw`Look at his `}<b>first</b>{String.raw` move. If he steps 1 stair first, the remaining $k-1$ stairs can be climbed in $s_{k-1}$ ways. If he steps 2 first, the remaining $k-2$ stairs give $s_{k-2}$ ways. So $$s_k = s_{k-1} + s_{k-2}.$$ That is the Fibonacci recurrence again — the book's hint "Fibonacci" confirms it. You already have the closed formula from Example 5; just match the starting values ($s_1 = 1$, $s_2 = 2$).`}
              </Callout>
            </Exercise>

            <Exercise id="3.4.5 / 3.4.6" title="Counting strings with no forbidden pattern  [HINT ONLY]">
              <p>{String.raw`$\textbf{3.4.5:}$ How many "words" of $k$ letters from $\{a, b\}$ have no two $a$'s next to each other? $\quad\textbf{3.4.6:}$ How many sequences of $k$ coin flips have no two heads in a row?`}</p>
              <Callout icon="🧭" title="Hint" color="teal">
                {String.raw`These two are the `}<b>same problem</b>{String.raw` in disguise. Build a valid string of length $k$ by looking at its last letter. If it ends in $b$ (or tails), the first $k-1$ letters can be any valid string: $x_{k-1}$ of them. If it ends in $a$ (or heads), the letter before it is `}<i>forced</i>{String.raw` to be $b$ (to avoid two $a$'s), so the first $k-2$ are any valid string: $x_{k-2}$. Total $x_k = x_{k-1} + x_{k-2}$ — Fibonacci once more. Fix the small starting cases by listing them, then use the closed form.`}
              </Callout>
            </Exercise>

            <Callout icon="📌" title="The pattern across all these exercises" color="violet">
              {String.raw`Notice how many different-sounding problems — parking, stairs, letter strings, coin flips — collapse to the `}<i>same</i>{String.raw` Fibonacci recurrence. That is the real power here: one matrix method solves an entire family of counting problems. The skill to build is spotting the recurrence from the words, not memorizing any single answer.`}
            </Callout>

            {/* CLOSING */}
            <div style={{ marginTop:'48px', padding:'28px 32px', background:'rgba(56,201,176,.08)', border:'2px solid rgba(56,201,176,.35)', borderRadius:'16px' }}>
              <div style={{ fontFamily:'var(--fm)', fontSize:'.7rem', letterSpacing:'.16em', textTransform:'uppercase', color:'#2a9d8f', marginBottom:'12px' }}>Looking ahead</div>
              <p style={{ fontFamily:'var(--fh)', fontSize:'1.4rem', color:'var(--lec-ink)', margin:'0 0 16px', fontWeight:400, lineHeight:1.3 }}>
                Two applications, one lesson: rewrite a hard problem as a matrix, and linear algebra hands you the answer.
              </p>
              <p style={{ color:'var(--lec-ink2)', fontSize:'.97rem', lineHeight:1.8, margin:0 }}>
                {String.raw`Interpolation turned "fit a curve" into "solve $V\mathbf{r} = \mathbf{y}$." Recurrences turned "list every term" into "diagonalize $A$." Both are the same move — find the right matrix, and the structure does the work. Next we leave the concrete world of $\mathbb{R}^n$ and ask the deeper question these tools have been hinting at all along: what `}<i>is</i>{String.raw` a vector space, really? That abstraction is where the rest of the course lives.`}
              </p>
            </div>

            <div style={{ marginTop:'64px', paddingTop:'28px', borderTop:'2px solid var(--lec-border)', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'12px' }}>
              <div style={{ fontFamily:'var(--fm)', fontSize:'.76rem', color:'var(--lec-ink3)', fontStyle:'italic' }}>Lecture 13 — complete</div>
              <div style={{ fontFamily:'var(--fm)', fontSize:'.76rem', color:'var(--lec-ink3)' }}>MATH-120 · Shoaib Khan · LUMS · July 2026</div>
            </div>
          </div>

          {/* FOOTER NAV */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'22px 48px', borderTop:'1px solid var(--lec-border)', background:'var(--lec-paper)', flexWrap:'wrap', gap:'12px' }}>
            <Link href={PREV_HREF} style={{ fontFamily:'var(--fm)', fontSize:'.74rem', letterSpacing:'.08em', textTransform:'uppercase', color:'var(--lec-accent)', textDecoration:'none' }}>← Lecture 12</Link>
            <Link href={NEXT_HREF} style={{ fontFamily:'var(--fm)', fontSize:'.74rem', letterSpacing:'.08em', textTransform:'uppercase', color:'var(--lec-accent)', textDecoration:'none' }}>Lecture 14 →</Link>
          </div>
        </main>
      </div>

      <Footer/>
    </>
  );
}