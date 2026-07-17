'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import Navbar from '../../../../components/Navbar';
import Footer from '../../../../components/Footer';

/* ════════════════════════════════════════════════════════════
   MATH-120 · LECTURE 11
   Eigenvalues and Eigenvectors — §3.3
   Route: /courses/linalg/w4/lec11
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
const THIS_SLUG = 'w3/lec11';
const PREV_HREF  = '/courses/linalg/w3/lec10';
const NEXT_HREF  = '/courses/linalg/w4/lec12';

const LEC = {
  course: 'MATH-120 · Linear Algebra',
  number: 'Lecture 11',
  title: 'Eigenvalues and Eigenvectors',
  subtitle: 'The special directions a matrix only stretches — the characteristic polynomial, basic eigenvectors, and why they run through all of applied mathematics',
  date: '3 July 2026',
};

const ANCHORS = [
  ['Recall', 'recall'],
  ['Motivation', 'motivation'],
  ['Definition', 'definition'],
  ['Geometry', 'geometry'],
  ['Verifying', 'verify'],
  ['Finding Them', 'procedure'],
  ['Theorem 3.3.2', 'theorem'],
  ['Basic Eigenvectors', 'basic'],
  ['2×2 & 3×3 Examples', 'examples'],
  ['Playground', 'playground'],
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

/* ═══════════════ STATIC GEOMETRY FIGURE (eigenvector vs non-eigenvector) ═══════════════ */
function EigenGeometryFigure() {
  const W=560, H=300, cx=W/2, cy=H/2, s=34;
  const toXY=(a,b)=>[cx+a*s, cy-b*s];
  const arrow=(a,b,col,dash,lw)=>{
    const [x1,y1]=toXY(0,0), [x2,y2]=toXY(a,b);
    const ang=Math.atan2(y2-y1,x2-x1), ah=9;
    return (
      <g key={`${a}-${b}-${col}`}>
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={col} strokeWidth={lw} strokeDasharray={dash?'6 5':'0'}/>
        <polygon points={`${x2},${y2} ${x2-ah*Math.cos(ang-0.4)},${y2-ah*Math.sin(ang-0.4)} ${x2-ah*Math.cos(ang+0.4)},${y2-ah*Math.sin(ang+0.4)}`} fill={col}/>
      </g>
    );
  };
  const grid=[];
  for(let i=-8;i<=8;i++){
    grid.push(<line key={`v${i}`} x1={cx+i*s} y1={0} x2={cx+i*s} y2={H} stroke="#e8ddc9" strokeWidth={i===0?1.4:0.6}/>);
    grid.push(<line key={`h${i}`} x1={0} y1={cy+i*s} x2={W} y2={cy+i*s} stroke="#e8ddc9" strokeWidth={i===0?1.4:0.6}/>);
  }
  return (
    <div style={{ textAlign:'center', margin:'12px 0', overflowX:'auto' }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ maxWidth:'100%', height:'auto', background:'#fffdf5', border:'1px solid var(--lec-border)', borderRadius:'12px' }}>
        {grid}
        <line x1={cx-6*s} y1={cy+6*s} x2={cx+6*s} y2={cy-6*s} stroke="#2a9d8f" strokeWidth={1} strokeDasharray="3 6" opacity={0.5}/>
        {arrow(3,3,'#2a9d8f',false,2.2)}
        {arrow(1,1,'#1f7a6e',false,3)}
        {arrow(2,1,'#c8860a',false,2.2)}
        {arrow(1,0,'#e0a020',false,3)}
        <text x={toXY(1.05,1.05)[0]+4} y={toXY(1.05,1.05)[1]-4} fontFamily="var(--fm)" fontSize="13" fill="#1f7a6e">x</text>
        <text x={toXY(3,3)[0]+6} y={toXY(3,3)[1]} fontFamily="var(--fm)" fontSize="13" fill="#2a9d8f">Ax = 3x</text>
        <text x={toXY(1,0)[0]+2} y={toXY(1,0)[1]+16} fontFamily="var(--fm)" fontSize="13" fill="#e0a020">y</text>
        <text x={toXY(2,1)[0]+6} y={toXY(2,1)[1]-4} fontFamily="var(--fm)" fontSize="13" fill="#c8860a">Ay (turned!)</text>
      </svg>
      <div style={{ fontFamily:'var(--fm)', fontSize:'.72rem', color:'var(--lec-ink3)', marginTop:'8px', maxWidth:'560px', margin:'8px auto 0' }}>
        {String.raw`For $A=\left[\begin{smallmatrix}2&1\\1&2\end{smallmatrix}\right]$: `}the green vector <b>x</b> keeps its direction (only stretched ×3) — an eigenvector.
        The amber vector <b>y</b> gets rotated off its line — <b>not</b> an eigenvector.
      </div>
    </div>
  );
}

/* ═══════════════ INTERACTIVE 2×2 / 3×3 EIGEN PLAYGROUND ═══════════════ */
function EigenPlayground() {
  const [dim, setDim] = useState(2);
  const [m2, setM2] = useState([[2,1],[1,2]]);
  const [m3, setM3] = useState([[2,0,0],[1,2,-1],[1,3,-2]]);
  const canvasRef = useRef(null);

  const M = dim===2 ? m2 : m3;
  const setM = dim===2 ? setM2 : setM3;

  function setEntry(i,j,val){
    const copy = M.map(r=>[...r]);
    copy[i][j] = (val===''||val==='-') ? val : (isNaN(parseFloat(val))?0:parseFloat(val));
    setM(copy);
  }

  const num = M.map(r=>r.map(e=> (e===''||e==='-') ? 0 : Number(e)));

  function eigvec2(A,l){
    const [[a,b],[c,d]]=A;
    let vx=b, vy=l-a;
    if(Math.abs(vx)<1e-9 && Math.abs(vy)<1e-9){ vx=l-d; vy=c; }
    if(Math.abs(vx)<1e-9 && Math.abs(vy)<1e-9){ vx=1; vy=0; }
    const n=Math.hypot(vx,vy)||1;
    return [vx/n, vy/n];
  }
  function eig2(A){
    const [[a,b],[c,d]]=A;
    const tr=a+d, det=a*d-b*c;
    const disc=tr*tr-4*det;
    if(disc<-1e-9){ return {real:false, note:'Complex eigenvalues — this matrix rotates every direction, so it has no real eigenvectors.'}; }
    const sq=Math.sqrt(Math.max(disc,0));
    const l1=(tr+sq)/2, l2=(tr-sq)/2;
    return {real:true, vals:[l1,l2], vecs:[eigvec2(A,l1),eigvec2(A,l2)]};
  }
  function cubicRealRoots(a,b,c,d){
    b/=a;c/=a;d/=a;
    const p=c-b*b/3, qq=2*b*b*b/27 - b*c/3 + d;
    const disc=qq*qq/4 + p*p*p/27;
    const shift=-b/3, out=[];
    if(disc>1e-9){
      const sq=Math.sqrt(disc);
      out.push(Math.cbrt(-qq/2+sq)+Math.cbrt(-qq/2-sq)+shift);
    } else {
      const rr=Math.sqrt(Math.max(-p*p*p/27,0));
      const phi=Math.acos(Math.min(1,Math.max(-1,(-qq/2)/(rr||1))));
      const t=2*Math.cbrt(rr);
      for(let k=0;k<3;k++) out.push(t*Math.cos((phi+2*Math.PI*k)/3)+shift);
    }
    return out.map(x=>Math.round(x*1e6)/1e6);
  }
  function eigvec3(A,l){
    const Mx=[[A[0][0]-l,A[0][1],A[0][2]],[A[1][0],A[1][1]-l,A[1][2]],[A[2][0],A[2][1],A[2][2]-l]];
    const cross=(u,w)=>[u[1]*w[2]-u[2]*w[1], u[2]*w[0]-u[0]*w[2], u[0]*w[1]-u[1]*w[0]];
    let best=[0,0,0], bn=0;
    for(const pair of [[0,1],[0,2],[1,2]]){ const cv=cross(Mx[pair[0]],Mx[pair[1]]); const nn=Math.hypot(cv[0],cv[1],cv[2]); if(nn>bn){bn=nn;best=cv;} }
    if(bn<1e-6) return [1,0,0];
    return best.map(x=>x/bn);
  }
  function eig3(A){
    const a=A[0][0],b=A[0][1],c=A[0][2],d=A[1][0],e=A[1][1],f=A[1][2],g=A[2][0],h=A[2][1],i=A[2][2];
    const p=-(a+e+i);
    const q=(a*e - b*d) + (a*i - c*g) + (e*i - f*h);
    const r=-(a*(e*i-f*h) - b*(d*i-f*g) + c*(d*h-e*g));
    const roots=cubicRealRoots(1,p,q,r);
    return {real:true, vals:roots, vecs:roots.map(l=>eigvec3(A,l))};
  }

  let result=null, err=null;
  try{ result = dim===2 ? eig2(num) : eig3(num); }catch(e){ err='Could not compute.'; }

  useEffect(()=>{
    if(dim!==2) return;
    const cv=canvasRef.current; if(!cv) return;
    const ctx=cv.getContext('2d');
    const W=cv.width, H=cv.height, cx=W/2, cy=H/2, s=26;
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle='#12122a'; ctx.fillRect(0,0,W,H);
    ctx.strokeStyle='rgba(120,130,180,.18)'; ctx.lineWidth=1;
    for(let i=-14;i<=14;i++){ ctx.beginPath(); ctx.moveTo(cx+i*s,0); ctx.lineTo(cx+i*s,H); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0,cy+i*s); ctx.lineTo(W,cy+i*s); ctx.stroke(); }
    ctx.strokeStyle='rgba(180,190,230,.5)'; ctx.lineWidth=1.4;
    ctx.beginPath(); ctx.moveTo(cx,0); ctx.lineTo(cx,H); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0,cy); ctx.lineTo(W,cy); ctx.stroke();
    const drawArrow=(a,b,col,lw)=>{
      const x2=cx+a*s, y2=cy-b*s;
      ctx.strokeStyle=col; ctx.fillStyle=col; ctx.lineWidth=lw;
      ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(x2,y2); ctx.stroke();
      const ang=Math.atan2(y2-cy,x2-cx), ah=10;
      ctx.beginPath(); ctx.moveTo(x2,y2);
      ctx.lineTo(x2-ah*Math.cos(ang-0.4), y2-ah*Math.sin(ang-0.4));
      ctx.lineTo(x2-ah*Math.cos(ang+0.4), y2-ah*Math.sin(ang+0.4));
      ctx.closePath(); ctx.fill();
    };
    if(result && result.real && result.vecs){
      const cols=['#38c9b0','#e8a020'];
      result.vecs.forEach((v,k)=>{
        ctx.strokeStyle=cols[k]+'55'; ctx.setLineDash([4,6]); ctx.lineWidth=1;
        ctx.beginPath(); ctx.moveTo(cx-v[0]*s*14, cy+v[1]*s*14); ctx.lineTo(cx+v[0]*s*14, cy-v[1]*s*14); ctx.stroke();
        ctx.setLineDash([]);
        const sc=2.4;
        drawArrow(v[0]*sc, v[1]*sc, cols[k], 3);
        const l=result.vals[k];
        const cap=Math.sign(l)*Math.min(Math.abs(l),4);
        drawArrow(v[0]*sc*cap, v[1]*sc*cap, cols[k]+'99', 1.6);
      });
    }
  },[dim, JSON.stringify(num)]);

  const fmt=(x)=> Math.abs(x-Math.round(x))<1e-4 ? String(Math.round(x)) : x.toFixed(3);
  const fmtVec=(v)=>{
    const mx=Math.max(...v.map(Math.abs))||1;
    return '('+v.map(x=>fmt(x/mx)).join(', ')+')';
  };
  const inputStyle={ width:'54px', textAlign:'center', fontFamily:'var(--fm)', fontSize:'.9rem', padding:'6px 4px', borderRadius:'6px', border:'1px solid rgba(180,190,230,.35)', background:'#1c1c38', color:'#e8ecff' };

  return (
    <div style={{ background:'#1a1a2e', border:'1px solid rgba(120,130,180,.3)', borderRadius:'16px', padding:'22px 24px', margin:'26px 0', color:'#e8ecff' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'10px', marginBottom:'16px' }}>
        <div style={{ fontFamily:'var(--fm)', fontSize:'.72rem', letterSpacing:'.16em', textTransform:'uppercase', color:'#8fd9cc' }}>🎛 Eigenvector Playground</div>
        <div style={{ display:'flex', gap:'6px' }}>
          {[2,3].map(d=>(
            <button key={d} onClick={()=>setDim(d)} style={{
              fontFamily:'var(--fm)', fontSize:'.72rem', padding:'6px 14px', borderRadius:'20px', cursor:'pointer',
              border:'1px solid '+(dim===d?'#38c9b0':'rgba(180,190,230,.3)'),
              background: dim===d?'rgba(56,201,176,.2)':'transparent', color: dim===d?'#8fd9cc':'#aab', fontWeight:600,
            }}>{d}×{d}</button>
          ))}
        </div>
      </div>

      <div style={{ display:'flex', flexWrap:'wrap', gap:'26px', alignItems:'flex-start' }}>
        <div>
          <div style={{ fontFamily:'var(--fm)', fontSize:'.66rem', color:'#8892b8', marginBottom:'8px', letterSpacing:'.1em' }}>ENTER MATRIX A</div>
          <div style={{ display:'inline-flex', alignItems:'center', gap:'10px' }}>
            <span style={{ fontSize:'2.4rem', color:'#6672a0' }}>[</span>
            <div style={{ display:'grid', gridTemplateColumns:`repeat(${dim}, auto)`, gap:'6px' }}>
              {M.map((row,i)=>row.map((val,j)=>(
                <input key={`${i}-${j}`} value={val} onChange={e=>setEntry(i,j,e.target.value)} style={inputStyle}/>
              )))}
            </div>
            <span style={{ fontSize:'2.4rem', color:'#6672a0' }}>]</span>
          </div>
          {dim===2 && (
            <canvas ref={canvasRef} width={340} height={280} style={{ display:'block', marginTop:'16px', borderRadius:'12px', maxWidth:'100%' }}/>
          )}
          {dim===2 && (
            <div style={{ fontFamily:'var(--fm)', fontSize:'.66rem', color:'#8892b8', marginTop:'6px' }}>
              Solid = eigenvector · faint = A·(eigenvector), staying on the same dashed line.
            </div>
          )}
        </div>

        <div style={{ flex:1, minWidth:'240px' }}>
          <div style={{ fontFamily:'var(--fm)', fontSize:'.66rem', color:'#8892b8', marginBottom:'8px', letterSpacing:'.1em' }}>RESULTS</div>
          {err && <div style={{ color:'#e88' }}>{err}</div>}
          {result && !result.real && <div style={{ color:'#e8a020', fontSize:'.9rem' }}>{result.note}</div>}
          {result && result.real && result.vals.map((l,k)=>(
            <div key={k} style={{ background:'#22223e', borderRadius:'10px', padding:'12px 14px', marginBottom:'10px', borderLeft:`3px solid ${k===0?'#38c9b0':(k===1?'#e8a020':'#9b80e8')}` }}>
              <div style={{ fontFamily:'var(--fm)', fontSize:'.9rem', color:k===0?'#8fd9cc':(k===1?'#f0c060':'#b9a8f0') }}>
                λ{k+1} = {fmt(l)}
              </div>
              <div style={{ fontFamily:'var(--fm)', fontSize:'.82rem', color:'#c4cae8', marginTop:'4px' }}>
                eigenvector ≈ {fmtVec(result.vecs[k])}
              </div>
            </div>
          ))}
          <div style={{ fontFamily:'var(--fm)', fontSize:'.64rem', color:'#7079a0', marginTop:'4px', lineHeight:1.6 }}>
            Eigenvectors are scaled so the largest entry is ±1. Any nonzero multiple is also an eigenvector.
            Values are numerical — always verify by hand with the characteristic polynomial.
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════ PAGE ═══════════════ */
export default function Lec11() {
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
        <span style={{color:'var(--text2)'}}>Week 4 · Lecture 11</span>
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
            <Link href={PREV_HREF} style={{ display:'flex', alignItems:'center', padding:'0 16px', height:'100%', fontFamily:'var(--fm)', fontSize:'.72rem', color:'var(--lec-ink3)', borderRight:'1px solid var(--lec-border)', whiteSpace:'nowrap', flexShrink:0, textDecoration:'none' }}>← Lecture 10</Link>
            <div style={{ flex:1, display:'flex', justifyContent:'center', alignItems:'center', gap:'4px', overflowX:'auto', padding:'0 8px' }}>
              <span style={{ fontFamily:'var(--fm)', fontSize:'.6rem', letterSpacing:'.12em', textTransform:'uppercase', color:'var(--lec-accent)', flexShrink:0, marginRight:'6px' }}>On this page</span>
              {ANCHORS.map(([label,id],i)=>(
                <span key={id} style={{display:'inline-flex',alignItems:'center',flexShrink:0}}>
                  {i>0&&<span style={{color:'var(--lec-border)',margin:'0 7px'}}>·</span>}
                  <a href={`#${id}`} onClick={e=>jump(e,id)} style={{fontFamily:'var(--fm)',fontSize:'.73rem',color:'var(--lec-ink2)',textDecoration:'none',whiteSpace:'nowrap'}}>{label}</a>
                </span>
              ))}
            </div>
            <Link href={NEXT_HREF} style={{ display:'flex', alignItems:'center', padding:'0 16px', height:'100%', fontFamily:'var(--fm)', fontSize:'.72rem', color:'var(--lec-ink3)', borderLeft:'1px solid var(--lec-border)', whiteSpace:'nowrap', flexShrink:0, textDecoration:'none' }}>Lecture 12 →</Link>
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

            <p>Before we meet the new idea, let us gather the three tools from the last two lectures that we will lean on constantly today.</p>
            <p style={{margin:'4px 0'}}>{String.raw`• A `}<b>square matrix</b>{String.raw` $A$ turns a vector $\mathbf{x}$ into another vector $A\mathbf{x}$. Think of $A$ as a machine that moves arrows around the plane (or space).`}</p>
            <p style={{margin:'4px 0'}}>{String.raw`• The `}<b>determinant</b>{String.raw` $\det A$ is a single number, and $A$ is invertible if and only if $\det A \neq 0$ (Lecture 10). We will need this test again in a moment.`}</p>
            <p style={{margin:'4px 0'}}>{String.raw`• A `}<b>homogeneous system</b>{String.raw` $M\mathbf{x} = \mathbf{0}$ has a nonzero solution exactly when $\det M = 0$. Gaussian elimination (Lecture 3) finds all of those solutions.`}</p>

            <Callout icon="🎯" title="Where we are heading" color="teal">
              {String.raw`Today's whole story is: for most vectors, $A\mathbf{x}$ points in a brand-new direction. But a few special vectors are only `}<b>stretched or shrunk</b>{String.raw`, never turned. Those special vectors are the `}<i>eigenvectors</i>{String.raw`, and the stretch factors are the `}<i>eigenvalues</i>{String.raw`.`}
            </Callout>

            {/* ─── §2 MOTIVATION ─── */}
            <Sec id="motivation" n="§2">Why Eigenvalues? The Big Picture</Sec>

            <p>Eigenvalues are, without exaggeration, one of the two or three most useful ideas in all of applied mathematics. Here is a small taste of where they quietly run the show.</p>

            <p style={{margin:'4px 0'}}><b>1. Google was built on an eigenvector.</b> The original PageRank algorithm ranks every web page by finding one special eigenvector of an enormous matrix (billions by billions) describing which pages link to which. A page's importance is its entry in that eigenvector. A multi-trillion-dollar company grew out of one eigenvector.</p>
            <p style={{margin:'4px 0'}}><b>2. Why bridges and buildings fall down.</b> Every structure has natural frequencies of vibration — these are eigenvalues of a stiffness matrix. If an earthquake or a marching crowd hits one of those frequencies, the structure resonates and can tear itself apart. Engineers compute eigenvalues precisely to avoid this.</p>
            <p style={{margin:'4px 0'}}><b>3. Quantum mechanics is eigenvalue theory.</b> The allowed energy levels of an atom are literally the eigenvalues of an operator called the Hamiltonian. When a neon sign glows, the colours you see are differences of eigenvalues.</p>
            <p style={{margin:'4px 0'}}><b>4. Data science and PCA.</b> When you compress an image, recommend a movie, or reduce a huge dataset to its most important patterns, you are almost always computing eigenvectors of a covariance matrix (principal component analysis).</p>

            <Callout icon="📜" title="Where the word comes from" color="amber">
              The prefix <b>eigen-</b> is German for "own" or "characteristic." An eigenvector is a matrix's <i>own</i> special direction — the direction that <i>characterises</i> it. The hybrid German-English word stuck because the theory was developed largely by German-speaking mathematicians (Hilbert used "Eigenwert" around 1904). You will also see the older English names <i>characteristic value</i> and <i>characteristic vector</i>.
            </Callout>

            <p>{String.raw`The unifying reason all of this works: eigenvectors are the directions in which a complicated matrix acts as simply as a single number. If you understand what $A$ does to its eigenvectors, you understand what $A$ does to `}<i>everything</i>{String.raw`, because most vectors can be built out of eigenvectors. That is the payoff we are chasing.`}</p>

            {/* ─── §3 DEFINITION ─── */}
            <Sec id="definition" n="§3">The Definition</Sec>

            <p>{String.raw`Here is the entire idea in one equation. We are looking for a nonzero vector $\mathbf{x}$ that the matrix $A$ does not turn — it only scales it by some number $\lambda$ (the Greek letter "lambda").`}</p>

            <DefBox term="Eigenvalue and Eigenvector" color="teal">
              <p style={{margin:'0 0 8px'}}>{String.raw`Let $A$ be an $n\times n$ matrix. A number $\lambda$ is called an `}<b>eigenvalue</b>{String.raw` of $A$ if there is a `}<b>nonzero</b>{String.raw` vector $\mathbf{x}$ such that`}</p>
              <p style={{textAlign:'center', margin:'6px 0'}}>{String.raw`$$A\mathbf{x} = \lambda\mathbf{x}.$$`}</p>
              <p style={{margin:'0'}}>{String.raw`Every such nonzero vector $\mathbf{x}$ is called an `}<b>eigenvector</b>{String.raw` of $A$ corresponding to $\lambda$ (a $\lambda$-eigenvector).`}</p>
            </DefBox>

            <RedBox title="Two conditions you must never drop">
              <p style={{margin:'0 0 6px'}}>{String.raw`$\textbf{1. The vector must be nonzero.}$ Notice $A\mathbf{0} = \lambda\mathbf{0}$ is true for `}<i>every</i>{String.raw` number $\lambda$, so allowing $\mathbf{x}=\mathbf{0}$ would make every number an "eigenvalue" — useless. Eigenvectors are nonzero by definition.`}</p>
              <p style={{margin:0}}>{String.raw`$\textbf{2. The eigenvalue $\lambda$ can be zero.}$ It is the `}<i>vector</i>{String.raw` that must be nonzero, not the number. In fact $\lambda = 0$ is an eigenvalue exactly when $A$ is not invertible (you will prove this in Exercise 3.3.3).`}</p>
            </RedBox>

            {/* ─── §4 GEOMETRY ─── */}
            <Sec id="geometry" n="§4">Seeing It: The Geometric Picture</Sec>

            <p>{String.raw`The definition becomes obvious once you picture it. Draw a vector $\mathbf{x}$ as an arrow. Apply $A$ to get the arrow $A\mathbf{x}$. Ask one question: `}<b>does the new arrow lie on the same line through the origin as the old one?</b></p>
            <p style={{margin:'4px 0'}}>{String.raw`• `}<b>Yes, same line</b>{String.raw` → $\mathbf{x}$ is an `}<b>eigenvector</b>{String.raw`. The arrow may get longer, shorter, or flip to point backwards, but its `}<i>line</i>{String.raw` is unchanged. The scale factor is the eigenvalue $\lambda$.`}</p>
            <p style={{margin:'4px 0'}}>{String.raw`• `}<b>No, it swung off the line</b>{String.raw` → $\mathbf{x}$ is `}<b>not</b>{String.raw` an eigenvector. $A$ rotated it into a genuinely new direction.`}</p>

            <EigenGeometryFigure/>

            <Callout icon="🔎" title="How to read the figure" color="violet">
              {String.raw`The green arrow $\mathbf{x}$ sits on the dashed eigen-line. After applying $A$ it becomes $A\mathbf{x}$, which is three times as long but `}<i>still on that same dashed line</i>{String.raw` — so $\lambda = 3$. The amber arrow $\mathbf{y}$ started on the horizontal axis, but $A\mathbf{y}$ tilts upward off the axis: its direction changed, so $\mathbf{y}$ is not an eigenvector.`}
            </Callout>

            <p><b>Special cases worth picturing.</b> {String.raw`If $\lambda > 1$ the eigenvector is stretched; if $0 < \lambda < 1$ it is compressed toward the origin; if $\lambda < 0$ it is flipped to the opposite side (and scaled); if $\lambda = 1$ the vector is left exactly where it was; and if $\lambda = 0$ the vector is crushed onto the origin. A pure rotation matrix (turning everything by, say, $90^\circ$) has `}<i>no</i>{String.raw` real eigenvectors at all — every arrow is turned — which is why its eigenvalues turn out to be complex (Exercise 3.3.5).`}</p>

            {/* ─── §5 VERIFY ─── */}
            <Sec id="verify" n="§5">Checking a Candidate by the Definition</Sec>

            <p>If someone hands you a matrix, a number, and a vector, checking whether they fit the definition is pure arithmetic: just multiply and compare.</p>

            <Example n="1" title="A quick verification">
              <p>{String.raw`Let $A = \begin{bmatrix} 3 & 5 \\ 1 & -1 \end{bmatrix}$ and $\mathbf{x} = \begin{bmatrix} 5 \\ 1 \end{bmatrix}$. Is $\mathbf{x}$ an eigenvector?`}</p>
              <p>Multiply:</p>
              <p style={{textAlign:'center'}}>{String.raw`$$A\mathbf{x} = \begin{bmatrix} 3 & 5 \\ 1 & -1 \end{bmatrix}\begin{bmatrix} 5 \\ 1 \end{bmatrix} = \begin{bmatrix} 15+5 \\ 5-1 \end{bmatrix} = \begin{bmatrix} 20 \\ 4 \end{bmatrix} = 4\begin{bmatrix} 5 \\ 1 \end{bmatrix} = 4\mathbf{x}.$$`}</p>
              <p style={{margin:0}}>{String.raw`The output is exactly $4$ times the input, so $A\mathbf{x} = \lambda\mathbf{x}$ holds with $\lambda = 4$. Therefore $\mathbf{x} = (5,1)$ is an eigenvector and $\lambda = 4$ is an eigenvalue of $A$. No characteristic polynomial needed — the definition did all the work.`}</p>
            </Example>

            <Callout icon="🤔" title="But how would we have found λ = 4 on our own?" color="amber">
              {String.raw`Verifying a given guess is easy. The real task is `}<i>discovering</i>{String.raw` the eigenvalues from scratch, with no vector handed to us. And there is a second eigenvalue of this same matrix hiding somewhere. To find both from nothing, we need a general procedure that works for any $n\times n$ matrix. That is next.`}
            </Callout>

            {/* ─── §6 PROCEDURE ─── */}
            <Sec id="procedure" n="§6">Finding Eigenvalues from Scratch</Sec>

            <p>{String.raw`Start from the defining equation and rearrange it until the determinant test from Lecture 10 can be applied. We want a nonzero $\mathbf{x}$ with`}</p>
            <p style={{textAlign:'center'}}>{String.raw`$$A\mathbf{x} = \lambda\mathbf{x}.$$`}</p>
            <p>{String.raw`$\textbf{Step 1 — move everything to one side.}$ Rewrite $\lambda\mathbf{x}$ as $\lambda I\mathbf{x}$ (inserting the identity so both sides are matrix-times-vector), then subtract:`}</p>
            <p style={{textAlign:'center'}}>{String.raw`$$\lambda I\mathbf{x} - A\mathbf{x} = \mathbf{0} \quad\Longrightarrow\quad (\lambda I - A)\mathbf{x} = \mathbf{0}.$$`}</p>
            <p>{String.raw`$\textbf{Step 2 — recognise a homogeneous system.}$ This is a homogeneous system with coefficient matrix $\lambda I - A$. We need it to have a `}<b>nonzero</b>{String.raw` solution $\mathbf{x}$ (remember, eigenvectors cannot be zero).`}</p>
            <p>{String.raw`$\textbf{Step 3 — apply the determinant test.}$ From Lecture 10, a square homogeneous system $M\mathbf{x} = \mathbf{0}$ has a nonzero solution `}<i>if and only if</i>{String.raw` $\det M = 0$. With $M = \lambda I - A$, the eigenvalues are exactly the numbers $\lambda$ making`}</p>
            <p style={{textAlign:'center'}}>{String.raw`$$\det(\lambda I - A) = 0.$$`}</p>
            <p>{String.raw`$\textbf{Step 4 — read it as a polynomial.}$ When you expand $\det(\lambda I - A)$, the result is a polynomial in $\lambda$. Its roots are the eigenvalues. This polynomial deserves a name.`}</p>

            <DefBox term="Characteristic Polynomial" color="violet">
              <p style={{margin:'0 0 8px'}}>{String.raw`The `}<b>characteristic polynomial</b>{String.raw` of a square matrix $A$ is`}</p>
              <p style={{textAlign:'center', margin:'6px 0'}}>{String.raw`$$c_A(x) = \det(xI - A),$$`}</p>
              <p style={{margin:'0'}}>{String.raw`a polynomial in the variable $x$. We write $c_A(x)$ to mean "the characteristic polynomial of the matrix $A$." If $A$ is $n\times n$, then $c_A(x)$ has degree exactly $n$.`}</p>
            </DefBox>

            <Callout icon="💡" title="The one-line summary" color="teal">
              {String.raw`A number $\lambda$ is an eigenvalue of $A$ `}<b>if and only if</b>{String.raw` $c_A(\lambda) = 0$ — that is, if and only if $\lambda$ is a root of the characteristic polynomial. Finding eigenvalues = finding roots of $c_A(x)$.`}
            </Callout>

            <ThmBox title="Procedure — computing eigenvalues and eigenvectors">
              <p style={{margin:'0 0 8px'}}>{String.raw`To find the eigenvalues and eigenvectors of an $n\times n$ matrix $A$:`}</p>
              <p style={{margin:'4px 0'}}>{String.raw`$\textbf{1.}$ Form the matrix $xI - A$ and compute the characteristic polynomial $c_A(x) = \det(xI - A)$.`}</p>
              <p style={{margin:'4px 0'}}>{String.raw`$\textbf{2.}$ Find the roots of $c_A(x) = 0$. These roots are the eigenvalues $\lambda_1, \lambda_2, \ldots$`}</p>
              <p style={{margin:'4px 0'}}>{String.raw`$\textbf{3.}$ For each eigenvalue $\lambda$, solve the homogeneous system $(\lambda I - A)\mathbf{x} = \mathbf{0}$ by Gaussian elimination. The nonzero solutions are the $\lambda$-eigenvectors.`}</p>
            </ThmBox>

            <Example n="2" title="Back to the same matrix — now find both eigenvalues">
              <p>{String.raw`Take $A = \begin{bmatrix} 3 & 5 \\ 1 & -1 \end{bmatrix}$ again, but this time discover its eigenvalues with no vector given.`}</p>
              <p>{String.raw`$\textbf{Step 1 — characteristic polynomial.}$ Form $xI - A = \begin{bmatrix} x-3 & -5 \\ -1 & x+1 \end{bmatrix}$ and take its determinant:`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$c_A(x) = \det(xI - A) = (x-3)(x+1) - (-5)(-1) = x^2 - 2x - 3 - 5 = x^2 - 2x - 8.$$`}</p>
              <p>{String.raw`$\textbf{Step 2 — find the roots.}$ Factor: $x^2 - 2x - 8 = (x-4)(x+2)$. So the roots are $x = 4$ and $x = -2$.`}</p>
              <p style={{margin:0}}>{String.raw`The eigenvalues are $\lambda_1 = 4$ (the one we verified earlier) and $\lambda_2 = -2$ (the hidden second one). The procedure recovered both from nothing but the matrix.`}</p>
            </Example>

            {/* ─── §7 THEOREM ─── */}
            <Sec id="theorem" n="§7">The Master Theorem</Sec>

            <p>Everything above is packaged into one clean statement.</p>

            <ThmBox title="Theorem 3.3.2">
              <p style={{margin:'0 0 8px'}}>{String.raw`Let $A$ be an $n\times n$ matrix.`}</p>
              <p style={{margin:'4px 0'}}>{String.raw`$\textbf{1.}$ The eigenvalues $\lambda$ of $A$ are the roots of the characteristic polynomial $c_A(x)$ of $A$.`}</p>
              <p style={{margin:'4px 0'}}>{String.raw`$\textbf{2.}$ The $\lambda$-eigenvectors $\mathbf{x}$ are the nonzero solutions to the homogeneous system $$(\lambda I - A)\mathbf{x} = \mathbf{0}$$ of linear equations with $\lambda I - A$ as coefficient matrix.`}</p>
            </ThmBox>

            <RedBox title="A word of honesty about difficulty">
              <p style={{margin:0}}>{String.raw`In practice, solving the equations in part 2 is a routine application of Gaussian elimination. But `}<i>finding</i>{String.raw` the eigenvalues — the roots in part 1 — can be genuinely hard, often requiring computers. Our examples and exercises are built so that the roots come out as easy integers, but do not be misled: for the matrices in real applications, eigenvalues are usually not so obliging. There are entire numerical methods (see Section 8.5 of Nicholson) devoted just to approximating them.`}</p>
            </RedBox>

            {/* ─── §8 BASIC EIGENVECTORS ─── */}
            <Sec id="basic" n="§8">How Many Eigenvectors? Basic Eigenvectors</Sec>

            <p>{String.raw`A single eigenvalue does not come with just one eigenvector — it comes with a whole family. Every nonzero solution $\mathbf{x}$ of $(\lambda I - A)\mathbf{x} = \mathbf{0}$ is an eigenvector. And if $\mathbf{x}$ is an eigenvector, so is any nonzero multiple $k\mathbf{x}$, because`}</p>
            <p style={{textAlign:'center'}}>{String.raw`$$A(k\mathbf{x}) = k(A\mathbf{x}) = k(\lambda\mathbf{x}) = \lambda(k\mathbf{x}).$$`}</p>
            <p>{String.raw`Geometrically this is just the statement that the whole eigen-line consists of eigenvectors. Recall from Lecture 3 (Theorem 1.3.2) that the solutions of a homogeneous system are all linear combinations of certain `}<b>basic solutions</b>{String.raw` produced by the Gaussian algorithm. We give those a name here.`}</p>

            <DefBox term="Basic Eigenvectors" color="teal">
              <p style={{margin:0}}>{String.raw`Any set of nonzero multiples of the basic solutions of $(\lambda I - A)\mathbf{x} = \mathbf{0}$ is called a set of `}<b>basic eigenvectors</b>{String.raw` corresponding to $\lambda$. In practice we scale each basic solution to clear fractions, giving the tidiest possible integer eigenvector to represent the whole line (or plane) of eigenvectors.`}</p>
            </DefBox>

            {/* ─── §9 EXAMPLES ─── */}
            <Sec id="examples" n="§9">Full Worked Examples</Sec>

            <Example n="3" title="A complete 2×2: polynomial, eigenvalues, basic eigenvectors">
              <p>{String.raw`Find the characteristic polynomial, the eigenvalues, and basic eigenvectors of $A = \begin{bmatrix} 4 & 2 \\ 1 & 3 \end{bmatrix}$.`}</p>
              <Reveal label="Show full solution">
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Step 1 — characteristic polynomial.}$ $xI - A = \begin{bmatrix} x-4 & -2 \\ -1 & x-3 \end{bmatrix}$, so`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$c_A(x) = (x-4)(x-3) - (-2)(-1) = x^2 - 7x + 12 - 2 = x^2 - 7x + 10 = (x-5)(x-2).$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Step 2 — eigenvalues.}$ The roots are $\lambda_1 = 5$ and $\lambda_2 = 2$.`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Step 3 — eigenvectors for $\lambda_1 = 5$.}$ Solve $(5I - A)\mathbf{x} = \mathbf{0}$:`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$5I - A = \begin{bmatrix} 1 & -2 \\ -1 & 2 \end{bmatrix} \longrightarrow \begin{bmatrix} 1 & -2 \\ 0 & 0 \end{bmatrix}.$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`The equation is $x_1 - 2x_2 = 0$, i.e. $x_1 = 2x_2$. Taking $x_2 = 1$ gives the basic eigenvector $\mathbf{x}_1 = \begin{bmatrix} 2 \\ 1 \end{bmatrix}$.`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Step 4 — eigenvectors for $\lambda_2 = 2$.}$ Solve $(2I - A)\mathbf{x} = \mathbf{0}$:`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$2I - A = \begin{bmatrix} -2 & -2 \\ -1 & -1 \end{bmatrix} \longrightarrow \begin{bmatrix} 1 & 1 \\ 0 & 0 \end{bmatrix}.$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`The equation is $x_1 + x_2 = 0$, i.e. $x_1 = -x_2$. Taking $x_2 = 1$ gives $\mathbf{x}_2 = \begin{bmatrix} -1 \\ 1 \end{bmatrix}$.`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Check.}$ $A\mathbf{x}_1 = \begin{bmatrix} 4&2\\1&3 \end{bmatrix}\begin{bmatrix} 2\\1 \end{bmatrix} = \begin{bmatrix} 10\\5 \end{bmatrix} = 5\mathbf{x}_1$ ✓, and $A\mathbf{x}_2 = \begin{bmatrix} -2\\2 \end{bmatrix} = 2\mathbf{x}_2$ ✓.`}</p>
                <p style={{margin:0}}>{String.raw`$\textbf{Summary.}$ $c_A(x) = (x-5)(x-2)$; eigenvalues $5, 2$; basic eigenvectors $\begin{bmatrix} 2\\1 \end{bmatrix}$ and $\begin{bmatrix} -1\\1 \end{bmatrix}$.`}</p>
              </Reveal>
            </Example>

            <Example n="4" title="A complete 3×3: three distinct eigenvalues" advanced>
              <p>{String.raw`Find the characteristic polynomial, eigenvalues, and basic eigenvectors of $A = \begin{bmatrix} 2 & 0 & 0 \\ 1 & 2 & -1 \\ 1 & 3 & -2 \end{bmatrix}$.`}</p>
              <Reveal label="Show full solution">
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Step 1 — characteristic polynomial.}$ We compute $\det(xI - A)$ where $xI - A = \begin{bmatrix} x-2 & 0 & 0 \\ -1 & x-2 & 1 \\ -1 & -3 & x+2 \end{bmatrix}$. Expand along the first row (only the corner entry survives):`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$c_A(x) = (x-2)\begin{vmatrix} x-2 & 1 \\ -3 & x+2 \end{vmatrix} = (x-2)\big[(x-2)(x+2) - (1)(-3)\big].$$`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$= (x-2)\big[x^2 - 4 + 3\big] = (x-2)(x^2 - 1) = (x-2)(x-1)(x+1).$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Step 2 — eigenvalues.}$ The roots are $\lambda_1 = 2$, $\lambda_2 = 1$, $\lambda_3 = -1$.`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Step 3 — eigenvectors for $\lambda_1 = 2$.}$ Solve $(2I - A)\mathbf{x} = \mathbf{0}$:`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$2I - A = \begin{bmatrix} 0 & 0 & 0 \\ -1 & 0 & 1 \\ -1 & -3 & 4 \end{bmatrix} \longrightarrow \begin{bmatrix} 1 & 0 & -1 \\ 0 & 1 & -1 \\ 0 & 0 & 0 \end{bmatrix}.$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`So $x_1 = x_3$ and $x_2 = x_3$. Taking $x_3 = 1$: basic eigenvector $\mathbf{x}_1 = \begin{bmatrix} 1 \\ 1 \\ 1 \end{bmatrix}$.`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Step 4 — eigenvectors for $\lambda_2 = 1$.}$ Solve $(I - A)\mathbf{x} = \mathbf{0}$:`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$I - A = \begin{bmatrix} -1 & 0 & 0 \\ -1 & -1 & 1 \\ -1 & -3 & 3 \end{bmatrix} \longrightarrow \begin{bmatrix} 1 & 0 & 0 \\ 0 & 1 & -1 \\ 0 & 0 & 0 \end{bmatrix}.$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`So $x_1 = 0$ and $x_2 = x_3$. Taking $x_3 = 1$: basic eigenvector $\mathbf{x}_2 = \begin{bmatrix} 0 \\ 1 \\ 1 \end{bmatrix}$.`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Step 5 — eigenvectors for $\lambda_3 = -1$.}$ Solve $(-I - A)\mathbf{x} = \mathbf{0}$:`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$-I - A = \begin{bmatrix} -3 & 0 & 0 \\ -1 & -3 & 1 \\ -1 & -3 & 1 \end{bmatrix} \longrightarrow \begin{bmatrix} 1 & 0 & 0 \\ 0 & 1 & -\tfrac13 \\ 0 & 0 & 0 \end{bmatrix}.$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`So $x_1 = 0$ and $x_2 = \tfrac13 x_3$. Taking $x_3 = 3$ to clear the fraction: basic eigenvector $\mathbf{x}_3 = \begin{bmatrix} 0 \\ 1 \\ 3 \end{bmatrix}$.`}</p>
                <p style={{margin:0}}>{String.raw`$\textbf{Summary.}$ $c_A(x) = (x-2)(x-1)(x+1)$; eigenvalues $2, 1, -1$; basic eigenvectors $\begin{bmatrix} 1\\1\\1 \end{bmatrix}, \begin{bmatrix} 0\\1\\1 \end{bmatrix}, \begin{bmatrix} 0\\1\\3 \end{bmatrix}$.`}</p>
              </Reveal>
            </Example>

            {/* ─── §10 PLAYGROUND ─── */}
            <Sec id="playground" n="§10">Interactive: The Eigenvector Playground</Sec>

            <p>{String.raw`Type any $2\times2$ or $3\times3$ matrix below. The tool computes its eigenvalues and eigenvectors, and (for $2\times2$) draws each eigenvector together with $A$ applied to it — watch how $A\mathbf{x}$ always lands back on the same dashed eigen-line. Try a rotation like $\begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix}$ to see what "no real eigenvector" looks like.`}</p>

            <EigenPlayground/>

            <Callout icon="🧪" title="Things to try" color="violet">
              {String.raw`Enter $\begin{bmatrix} 2 & 0 \\ 0 & 3 \end{bmatrix}$ (a diagonal matrix — its eigenvectors are the axes, eigenvalues on the diagonal). Enter $\begin{bmatrix} 1 & 1 \\ 0 & 1 \end{bmatrix}$ (a shear — only one eigen-line). Enter $\begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix}$ (a $90^\circ$ rotation — the tool reports complex eigenvalues, no real eigen-lines).`}
            </Callout>

            {/* ─── §11 TRANSPOSE ─── */}
            <Sec id="transpose" n="§11">A and Aᵀ Share Their Eigenvalues</Sec>

            <Example n="5" title="Example 3.3.5 — A and Aᵀ have the same eigenvalues" advanced>
              <p>{String.raw`Show that a square matrix $A$ and its transpose $A^{\mathsf{T}}$ have the same characteristic polynomial, and hence the same eigenvalues.`}</p>
              <Reveal label="Show solution">
                <p style={{margin:'0 0 8px'}}>{String.raw`We compute $c_{A^{\mathsf{T}}}(x)$ and show it equals $c_A(x)$. The key facts are that the transpose distributes over the operations inside, and that a determinant is unchanged by transposing (Theorem 3.2.3, Lecture 10).`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`First note $xI - A^{\mathsf{T}} = (xI)^{\mathsf{T}} - A^{\mathsf{T}} = (xI - A)^{\mathsf{T}}$, since $xI$ is diagonal (so $(xI)^{\mathsf{T}} = xI$) and transposing is linear. Therefore`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$c_{A^{\mathsf{T}}}(x) = \det(xI - A^{\mathsf{T}}) = \det\!\big((xI - A)^{\mathsf{T}}\big) = \det(xI - A) = c_A(x),$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`where the third equality is exactly Theorem 3.2.3: transposing a matrix does not change its determinant.`}</p>
                <p style={{margin:0}}>{String.raw`Since $A$ and $A^{\mathsf{T}}$ have identical characteristic polynomials, they have identical roots, hence the same eigenvalues. (Their `}<i>eigenvectors</i>{String.raw`, however, are generally different.) $\;\blacksquare$`}</p>
              </Reveal>
            </Example>

            {/* SUMMARY */}
            <div style={{ marginTop:'40px', padding:'24px 28px', background:'rgba(232,160,32,.08)', border:'2px solid rgba(232,160,32,.35)', borderRadius:'16px' }}>
              <div style={{ fontFamily:'var(--fm)', fontSize:'.7rem', letterSpacing:'.16em', textTransform:'uppercase', color:'#c8860a', marginBottom:'12px' }}>Summary of key points</div>
              <ul style={{ color:'var(--lec-ink2)', fontSize:'1rem', lineHeight:1.9, margin:0, paddingLeft:'22px' }}>
                <li>{String.raw`$\lambda$ is an eigenvalue of $A$ with eigenvector $\mathbf{x} \neq \mathbf{0}$ means $A\mathbf{x} = \lambda\mathbf{x}$: $A$ only scales $\mathbf{x}$, never turns it.`}</li>
                <li>Eigenvectors must be nonzero; the eigenvalue itself may be zero.</li>
                <li>{String.raw`Characteristic polynomial: $c_A(x) = \det(xI - A)$, of degree $n$ for an $n\times n$ matrix.`}</li>
                <li>{String.raw`$\lambda$ is an eigenvalue $\iff c_A(\lambda) = 0$ (Theorem 3.3.2, part 1).`}</li>
                <li>{String.raw`Eigenvectors for $\lambda$: nonzero solutions of $(\lambda I - A)\mathbf{x} = \mathbf{0}$ (Theorem 3.3.2, part 2).`}</li>
                <li>Scale basic solutions to integers → basic eigenvectors; any nonzero multiple is still an eigenvector.</li>
                <li>{String.raw`$A$ and $A^{\mathsf{T}}$ have the same characteristic polynomial, hence the same eigenvalues.`}</li>
              </ul>
            </div>

            {/* ─── §12 EXERCISES ─── */}
            <Sec id="exercises" n="§12">Solutions to Section 3.3 Exercises</Sec>

            <Exercise id="3.3.3" title="λ = 0 is an eigenvalue ⟺ A is not invertible">
              <Reveal label="Show solution">
                <p style={{margin:'0 0 8px'}}>{String.raw`By Theorem 3.3.2, $\lambda = 0$ is an eigenvalue of $A$ exactly when $c_A(0) = 0$, i.e. when $\det(0\cdot I - A) = 0$. Now $\det(-A) = (-1)^n\det A$, so $\det(-A) = 0$ if and only if $\det A = 0$.`}</p>
                <p style={{margin:0}}>{String.raw`Therefore $\lambda = 0$ is an eigenvalue $\iff \det A = 0 \iff A$ is not invertible (Lecture 10). Equivalently: $\lambda = 0$ works exactly when $A\mathbf{x} = \mathbf{0}$ has a nonzero solution, which is precisely the condition for $A$ to be singular. $\;\blacksquare$`}</p>
              </Reveal>
            </Exercise>

            <Exercise id="3.3.4" title="Shifting: eigenvalues of A₁ = A − αI">
              <p>{String.raw`Let $A$ be $n\times n$ and $A_1 = A - \alpha I$ with $\alpha \in \mathbb{R}$. Show $\lambda$ is an eigenvalue of $A$ if and only if $\lambda - \alpha$ is an eigenvalue of $A_1$. How do the eigenvectors compare?`}</p>
              <Reveal label="Show solution">
                <p style={{margin:'0 0 8px'}}>{String.raw`Suppose $\lambda$ is an eigenvalue of $A$ with eigenvector $\mathbf{x} \neq \mathbf{0}$, so $A\mathbf{x} = \lambda\mathbf{x}$. Then`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$A_1\mathbf{x} = (A - \alpha I)\mathbf{x} = A\mathbf{x} - \alpha\mathbf{x} = \lambda\mathbf{x} - \alpha\mathbf{x} = (\lambda - \alpha)\mathbf{x}.$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`So $\mathbf{x}$ is an eigenvector of $A_1$ with eigenvalue $\lambda - \alpha$. Conversely, if $A_1\mathbf{x} = (\lambda - \alpha)\mathbf{x}$, then adding $\alpha\mathbf{x}$ to both sides gives $A\mathbf{x} = \lambda\mathbf{x}$. The two statements are equivalent.`}</p>
                <p style={{margin:0}}>{String.raw`$\textbf{Eigenvectors.}$ They are exactly the same. Subtracting $\alpha I$ shifts every eigenvalue down by $\alpha$ but leaves every eigenvector unchanged. $\;\blacksquare$`}</p>
              </Reveal>
            </Exercise>

            <Exercise id="3.3.5" title="Eigenvalues of the rotation matrix are e^{±iθ}">
              <Reveal label="Show solution">
                <p style={{margin:'0 0 8px'}}>{String.raw`Let $R = \begin{bmatrix} \cos\theta & -\sin\theta \\ \sin\theta & \cos\theta \end{bmatrix}$. Its characteristic polynomial is`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$c_R(x) = \begin{vmatrix} x-\cos\theta & \sin\theta \\ -\sin\theta & x-\cos\theta \end{vmatrix} = (x-\cos\theta)^2 + \sin^2\theta = x^2 - 2x\cos\theta + (\cos^2\theta + \sin^2\theta).$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`Since $\cos^2\theta + \sin^2\theta = 1$, this is $x^2 - 2x\cos\theta + 1 = 0$. By the quadratic formula,`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$x = \frac{2\cos\theta \pm \sqrt{4\cos^2\theta - 4}}{2} = \cos\theta \pm \sqrt{\cos^2\theta - 1} = \cos\theta \pm \sqrt{-\sin^2\theta} = \cos\theta \pm i\sin\theta.$$`}</p>
                <p style={{margin:0}}>{String.raw`By Euler's formula (Appendix A), $\cos\theta + i\sin\theta = e^{i\theta}$ and $\cos\theta - i\sin\theta = e^{-i\theta}$. So the eigenvalues are $e^{i\theta}$ and $e^{-i\theta}$. They are non-real whenever $\sin\theta \neq 0$ — which matches the geometry: a genuine rotation turns every real vector, so it has no real eigenvectors. $\;\blacksquare$`}</p>
              </Reveal>
            </Exercise>

            <Exercise id="3.3.6" title="Characteristic polynomial and eigenvectors of the identity I">
              <Reveal label="Show solution">
                <p style={{margin:'0 0 8px'}}>{String.raw`For the $n\times n$ identity, $xI - I = (x-1)I$, which is diagonal with every diagonal entry $x-1$. Its determinant is the product of the diagonal (Lecture 9, triangular rule):`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$c_I(x) = \det\big((x-1)I\big) = (x-1)^n.$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`The only root is $x = 1$, so $I$ has exactly one eigenvalue, $\lambda = 1$ (repeated $n$ times).`}</p>
                <p style={{margin:0}}>{String.raw`$\textbf{Eigenvectors.}$ Solve $(1\cdot I - I)\mathbf{x} = \mathbf{0}$, i.e. $0\mathbf{x} = \mathbf{0}$, which holds for `}<i>every</i>{String.raw` $\mathbf{x}$. So every nonzero vector in $\mathbb{R}^n$ is an eigenvector — sensible, since $I\mathbf{x} = \mathbf{x} = 1\cdot\mathbf{x}$ leaves all vectors fixed. $\;\blacksquare$`}</p>
              </Reveal>
            </Exercise>

            <Exercise id="3.3.7" title="Trace formula for a 2×2 characteristic polynomial">
              <p>{String.raw`Given $A = \begin{bmatrix} a & b \\ c & d \end{bmatrix}$, show: (a) $c_A(x) = x^2 - (\operatorname{tr}A)x + \det A$, where $\operatorname{tr}A = a + d$; (b) the eigenvalues are $\tfrac12\big[(a+d) \pm \sqrt{(a-d)^2 + 4bc}\big]$.`}</p>
              <Reveal label="Show solution">
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{(a)}$ Compute directly:`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$c_A(x) = \begin{vmatrix} x-a & -b \\ -c & x-d \end{vmatrix} = (x-a)(x-d) - bc = x^2 - (a+d)x + (ad - bc).$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`Since $\operatorname{tr}A = a + d$ and $\det A = ad - bc$, this is $c_A(x) = x^2 - (\operatorname{tr}A)x + \det A$. $\;\blacksquare$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{(b)}$ Apply the quadratic formula to $x^2 - (a+d)x + (ad-bc) = 0$:`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$x = \frac{(a+d) \pm \sqrt{(a+d)^2 - 4(ad-bc)}}{2}.$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`Simplify the discriminant: $(a+d)^2 - 4(ad-bc) = a^2 + 2ad + d^2 - 4ad + 4bc = a^2 - 2ad + d^2 + 4bc = (a-d)^2 + 4bc$. Hence`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$x = \tfrac12\Big[(a+d) \pm \sqrt{(a-d)^2 + 4bc}\Big]. \;\blacksquare$$`}</p>
                <p style={{margin:0}}>{String.raw`(Note: the printed exercise writes $(a-b)^2$, but the correct discriminant is $(a-d)^2 + 4bc$, as the algebra above shows — a typo in that edition.)`}</p>
              </Reveal>
            </Exercise>

            <Exercise id="3.3.18" title="Eigenvalues of rA and the polynomial c_{rA}(x)">
              <p>{String.raw`Let $A$ be $n\times n$ and $r \neq 0$ a real number.`}</p>
              <Reveal label="Show both parts">
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{(a)}$ Suppose $A\mathbf{x} = \lambda\mathbf{x}$ with $\mathbf{x} \neq \mathbf{0}$. Then $(rA)\mathbf{x} = r(A\mathbf{x}) = r(\lambda\mathbf{x}) = (r\lambda)\mathbf{x}$, so $r\lambda$ is an eigenvalue of $rA$ with the same eigenvector. Conversely, if $(rA)\mathbf{x} = \mu\mathbf{x}$, then $A\mathbf{x} = \tfrac{\mu}{r}\mathbf{x}$ (using $r \neq 0$), so $\mu = r\lambda$ for the eigenvalue $\lambda = \mu/r$ of $A$. Thus the eigenvalues of $rA$ are exactly the numbers $r\lambda$. $\;\blacksquare$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{(b)}$ Using $\det(uM) = u^n\det M$ for $n\times n$ matrices (Lecture 9):`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$c_{rA}(x) = \det(xI - rA) = \det\!\Big(r\big(\tfrac{x}{r}I - A\big)\Big) = r^n\det\!\big(\tfrac{x}{r}I - A\big) = r^n c_A\!\Big(\tfrac{x}{r}\Big). \;\blacksquare$$`}</p>
                <p style={{margin:0}}>{String.raw`(This is consistent with (a): the roots of $r^n c_A(x/r)$ are the values of $x$ with $x/r = \lambda$, i.e. $x = r\lambda$.)`}</p>
              </Reveal>
            </Exercise>

            <Exercise id="3.3.19" title="Constant row sums and column sums give an eigenvalue">
              <Reveal label="Show both parts">
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{(a)}$ Suppose every row of $A$ sums to $s$. Let $\mathbf{1} = (1,1,\ldots,1)^{\mathsf{T}}$ be the all-ones vector. The $i$-th entry of $A\mathbf{1}$ is the sum of row $i$, which is $s$. So $A\mathbf{1} = s\mathbf{1}$. Since $\mathbf{1} \neq \mathbf{0}$, this says $s$ is an eigenvalue of $A$ with eigenvector $\mathbf{1}$. $\;\blacksquare$`}</p>
                <p style={{margin:0}}>{String.raw`$\textbf{(b)}$ Suppose every column of $A$ sums to $s$. Then every `}<i>row</i>{String.raw` of $A^{\mathsf{T}}$ sums to $s$, so by part (a), $s$ is an eigenvalue of $A^{\mathsf{T}}$. By Example 3.3.5, $A$ and $A^{\mathsf{T}}$ have the same eigenvalues, so $s$ is an eigenvalue of $A$ as well. (The eigenvector for $A$ need not be $\mathbf{1}$ in this case.) $\;\blacksquare$`}</p>
              </Reveal>
            </Exercise>

            <Exercise id="3.3.20" title="Eigenvalues of an invertible A and of A⁻¹">
              <p>{String.raw`Let $A$ be an invertible $n\times n$ matrix.`}</p>
              <Reveal label="Show all three parts">
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{(a)}$ If $\lambda = 0$ were an eigenvalue, then by Exercise 3.3.3 $A$ would not be invertible — contradiction. So every eigenvalue of an invertible $A$ is nonzero. $\;\blacksquare$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{(b)}$ Let $A\mathbf{x} = \lambda\mathbf{x}$ with $\mathbf{x} \neq \mathbf{0}$; by (a), $\lambda \neq 0$. Multiply both sides on the left by $A^{-1}$: $\mathbf{x} = \lambda A^{-1}\mathbf{x}$, so $A^{-1}\mathbf{x} = \tfrac{1}{\lambda}\mathbf{x}$. Thus $\tfrac1\lambda$ is an eigenvalue of $A^{-1}$ (same eigenvector $\mathbf{x}$). Running the argument backwards shows every eigenvalue of $A^{-1}$ has this form. $\;\blacksquare$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{(c)}$ Start from $c_{A^{-1}}(x) = \det(xI - A^{-1})$. Factor out $-A^{-1}$: $xI - A^{-1} = -xA^{-1}\big(\tfrac1x I - A\big)$ (check by expanding: $-xA^{-1}\cdot\tfrac1x I = -A^{-1}$ and $-xA^{-1}\cdot(-A) = xI$). Taking determinants with $\det(-xM) = (-x)^n\det M$ and $\det(A^{-1}) = 1/\det A$:`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$c_{A^{-1}}(x) = (-x)^n\det(A^{-1})\det\!\big(\tfrac1x I - A\big) = \frac{(-x)^n}{\det A}\,c_A\!\Big(\tfrac1x\Big). \;\blacksquare$$`}</p>
              </Reveal>
            </Exercise>

            <Exercise id="3.3.21" title="Eigenvalues of matrix powers and polynomials in A">
              <p>{String.raw`Suppose $\lambda$ is an eigenvalue of a square matrix $A$ with eigenvector $\mathbf{x} \neq \mathbf{0}$.`}</p>
              <Reveal label="Show all three parts">
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{(a)}$ Apply $A$ twice: $A^2\mathbf{x} = A(A\mathbf{x}) = A(\lambda\mathbf{x}) = \lambda(A\mathbf{x}) = \lambda(\lambda\mathbf{x}) = \lambda^2\mathbf{x}$. So $\lambda^2$ is an eigenvalue of $A^2$, with the same eigenvector $\mathbf{x}$. $\;\blacksquare$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{(b)}$ By the same repeated-application idea, $A^k\mathbf{x} = \lambda^k\mathbf{x}$ for every $k$. Now apply the matrix $A^3 - 2A + 3I$ to $\mathbf{x}$ term by term:`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$(A^3 - 2A + 3I)\mathbf{x} = A^3\mathbf{x} - 2A\mathbf{x} + 3\mathbf{x} = \lambda^3\mathbf{x} - 2\lambda\mathbf{x} + 3\mathbf{x} = (\lambda^3 - 2\lambda + 3)\mathbf{x}.$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`So $\lambda^3 - 2\lambda + 3$ is an eigenvalue of $A^3 - 2A + 3I$, again with eigenvector $\mathbf{x}$. $\;\blacksquare$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{(c)}$ Let $p(x) = c_k x^k + \cdots + c_1 x + c_0$ be any polynomial, and define $p(A) = c_k A^k + \cdots + c_1 A + c_0 I$. Using $A^j\mathbf{x} = \lambda^j\mathbf{x}$ for each power:`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$p(A)\mathbf{x} = \sum_{j=0}^{k} c_j A^j\mathbf{x} = \sum_{j=0}^{k} c_j \lambda^j\mathbf{x} = \Big(\sum_{j=0}^{k} c_j\lambda^j\Big)\mathbf{x} = p(\lambda)\mathbf{x}.$$`}</p>
                <p style={{margin:0}}>{String.raw`Hence $p(\lambda)$ is an eigenvalue of $p(A)$ with eigenvector $\mathbf{x}$. Parts (a) and (b) are the special cases $p(x) = x^2$ and $p(x) = x^3 - 2x + 3$. $\;\blacksquare$`}</p>
              </Reveal>
            </Exercise>

            <Exercise id="3.3.23" title="Nilpotent matrices have only λ = 0">
              <p>{String.raw`An $n\times n$ matrix $A$ is `}<b>nilpotent</b>{String.raw` if $A^m = 0$ for some $m \geq 1$.`}</p>
              <Reveal label="Show all three parts">
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{(a)}$ Let $A$ be triangular with zeros on the main diagonal (say upper triangular). Multiplying such matrices pushes the nonzero entries further above the diagonal each time: $A$ has zeros on and below the diagonal, $A^2$ pushes the nonzero band one step higher, and so on. After at most $n$ multiplications every entry is pushed out of the $n\times n$ frame, so $A^n = 0$. Hence $A$ is nilpotent. $\;\blacksquare$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{(b)}$ Suppose $\lambda$ is any eigenvalue of a nilpotent $A$ (allowing complex $\lambda$), with eigenvector $\mathbf{x} \neq \mathbf{0}$. By Exercise 3.3.21(a) applied repeatedly, $A^m\mathbf{x} = \lambda^m\mathbf{x}$. But $A^m = 0$, so $\mathbf{0} = A^m\mathbf{x} = \lambda^m\mathbf{x}$. Since $\mathbf{x} \neq \mathbf{0}$, we must have $\lambda^m = 0$, forcing $\lambda = 0$. So $\lambda = 0$ is the only eigenvalue. $\;\blacksquare$`}</p>
                <p style={{margin:0}}>{String.raw`$\textbf{(c)}$ The characteristic polynomial $c_A(x)$ has degree $n$, and over the complex numbers its roots are exactly the eigenvalues of $A$. By part (b) the only eigenvalue is $0$, so $0$ is the only root, repeated $n$ times. A monic degree-$n$ polynomial whose only root is $0$ (with multiplicity $n$) must be $c_A(x) = x^n$. $\;\blacksquare$`}</p>
              </Reveal>
            </Exercise>

            {/* CLOSING */}
            <div style={{ marginTop:'48px', padding:'28px 32px', background:'rgba(56,201,176,.08)', border:'2px solid rgba(56,201,176,.35)', borderRadius:'16px' }}>
              <div style={{ fontFamily:'var(--fm)', fontSize:'.7rem', letterSpacing:'.16em', textTransform:'uppercase', color:'#2a9d8f', marginBottom:'12px' }}>Looking ahead</div>
              <p style={{ fontFamily:'var(--fh)', fontSize:'1.4rem', color:'var(--lec-ink)', margin:'0 0 16px', fontWeight:400, lineHeight:1.3 }}>
                You can now find the special directions a matrix only stretches. Next we use them to make matrices simple.
              </p>
              <p style={{ color:'var(--lec-ink2)', fontSize:'.97rem', lineHeight:1.8, margin:0 }}>
                {String.raw`When a matrix has enough independent eigenvectors, we can rewrite it in a coordinate system where it becomes purely diagonal — a process called `}<i>diagonalization</i>{String.raw`. That single trick makes computing $A^{100}$, solving systems of differential equations, and understanding long-term behaviour almost effortless. Eigenvalues are the doorway; diagonalization is the room they open onto.`}
              </p>
            </div>

            <div style={{ marginTop:'64px', paddingTop:'28px', borderTop:'2px solid var(--lec-border)', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'12px' }}>
              <div style={{ fontFamily:'var(--fm)', fontSize:'.76rem', color:'var(--lec-ink3)', fontStyle:'italic' }}>Lecture 11 — complete</div>
              <div style={{ fontFamily:'var(--fm)', fontSize:'.76rem', color:'var(--lec-ink3)' }}>MATH-120 · Shoaib Khan · LUMS · July 2026</div>
            </div>
          </div>

          {/* FOOTER NAV */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'22px 48px', borderTop:'1px solid var(--lec-border)', background:'var(--lec-paper)', flexWrap:'wrap', gap:'12px' }}>
            <Link href={PREV_HREF} style={{ fontFamily:'var(--fm)', fontSize:'.74rem', letterSpacing:'.08em', textTransform:'uppercase', color:'var(--lec-accent)', textDecoration:'none' }}>← Lecture 10</Link>
            <Link href={NEXT_HREF} style={{ fontFamily:'var(--fm)', fontSize:'.74rem', letterSpacing:'.08em', textTransform:'uppercase', color:'var(--lec-accent)', textDecoration:'none' }}>Lecture 12 →</Link>
          </div>
        </main>
      </div>

      <Footer/>
    </>
  );
}