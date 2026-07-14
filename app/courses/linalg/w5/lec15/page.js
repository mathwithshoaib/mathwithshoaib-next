'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import Navbar from '../../../../components/Navbar';
import Footer from '../../../../components/Footer';

/* ════════════════════════════════════════════════════════════
   MATH-120 · LECTURE 15
   Independence and Dimension — §5.2
   Route: /courses/linalg/w5/lec15
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
];
const THIS_SLUG = 'w5/lec15';
const PREV_HREF  = '/courses/linalg/w4/lec14';
const NEXT_HREF  = '/courses/linalg/w5/lec16';

const LEC = {
  course: 'MATH-120 · Linear Algebra',
  number: 'Lecture 15',
  title: 'Independence and Dimension',
  subtitle: 'When does a spanning set have no waste? Linear independence, unique representations, bases, and the single number that measures the size of a subspace — its dimension',
  date: '6 July 2026',
};

const ANCHORS = [
  ['Motivation', 'motivation'],
  ['Independence', 'independence'],
  ['Unique Rep.', 'unique'],
  ['The Test', 'test'],
  ['Examples', 'examples'],
  ['Dependence', 'dependence'],
  ['Theorems 5.2.2–3', 'thms'],
  ['Det Method', 'det-method'],
  ['Dimension: Why', 'dim-why'],
  ['Fundamental Thm', 'fundamental'],
  ['Basis', 'basis'],
  ['Dimension', 'dimension'],
  ['Dimension Examples', 'dim-ex'],
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




/* ═══════════════ INDEPENDENCE TESTER (interactive, ℝ² & ℝ³) ═══════════════ */
const IT_COLORS = ['#38c9b0','#e8a020','#9b80e8','#e06b6b','#5fb8e0'];
const IT_DEFAULTS = {
  2: [['2','1'],['-1','2'],['1','1'],['3','-1'],['-2','-1']],
  3: [['2','1','0'],['-1','2','1'],['0','1','2'],['2','-1','1'],['1','2','-1']],
};

// rank of a `dim`×N matrix (columns = vectors), via elimination
function rankOfVectors(vectors, dim){
  let cols = vectors.map(v=>v.slice());
  let rank = 0, rowsUsed = [];
  for (let row=0; row<dim; row++){
    let pivotCol=-1;
    for (let c=0; c<cols.length; c++){
      if (!rowsUsed.includes(c) && Math.abs(cols[c][row])>1e-9){ pivotCol=c; break; }
    }
    if (pivotCol<0) continue;
    rowsUsed.push(pivotCol); rank++;
    for (let c=0; c<cols.length; c++){
      if (c===pivotCol) continue;
      const f = cols[c][row]/cols[pivotCol][row];
      for (let r2=0; r2<dim; r2++) cols[c][r2] -= f*cols[pivotCol][r2];
    }
  }
  return rank;
}

function IndependenceTester() {
  const [dim, setDim] = useState(2);              // 2 or 3
  const [count, setCount] = useState(2);           // 1..5
  const [vectors, setVectors] = useState([['2','1'],['-1','2']]); // strings, length = count, each of length dim
  const [rot, setRot] = useState({ yaw: 0.7, pitch: 0.32 });
  const canvasRef = useRef(null);
  const dragRef = useRef(null);

  // keep vectors array in sync with dim/count, preserving already-edited values
  useEffect(() => {
    setVectors(prev => {
      const next = [];
      for (let i=0; i<count; i++){
        const existing = prev[i];
        next.push(existing && existing.length===dim ? existing : IT_DEFAULTS[dim][i%5]);
      }
      return next;
    });
  }, [dim, count]);

  function setComponent(vi, ci, raw){
    const clean = raw.replace(/[^0-9.\-]/g, '');
    setVectors(prev => prev.map((v,i)=> i===vi ? v.map((c,j)=> j===ci ? clean : c) : v));
  }

  const numericVectors = vectors.map(v => v.map(c => { const n=parseFloat(c); return Number.isFinite(n)?n:0; }));
  const rank = rankOfVectors(numericVectors, dim);
  const independent = numericVectors.length>0 && rank===numericVectors.length;
  const dimLabel = dim===2 ? 'ℝ²' : 'ℝ³';

  // ── draw: flat 2D axes, or a rotatable 3D scene ──
  useEffect(() => {
    const cv = canvasRef.current; if (!cv) return;
    const ctx = cv.getContext('2d');
    const W = cv.width, H = cv.height, cx = W/2, cy = H/2;
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#12122a'; ctx.fillRect(0,0,W,H);

    if (dim===2){
      const s=30;
      ctx.strokeStyle='rgba(120,130,180,.15)'; ctx.lineWidth=1;
      for(let i=-8;i<=8;i++){ ctx.beginPath();ctx.moveTo(cx+i*s,0);ctx.lineTo(cx+i*s,H);ctx.stroke();
        ctx.beginPath();ctx.moveTo(0,cy+i*s);ctx.lineTo(W,cy+i*s);ctx.stroke(); }
      ctx.strokeStyle='rgba(180,190,230,.5)'; ctx.lineWidth=1.3;
      ctx.beginPath();ctx.moveTo(cx,0);ctx.lineTo(cx,H);ctx.stroke();
      ctx.beginPath();ctx.moveTo(0,cy);ctx.lineTo(W,cy);ctx.stroke();
      numericVectors.forEach((v,i)=>{
        const x2=cx+v[0]*s, y2=cy-v[1]*s;
        ctx.strokeStyle=IT_COLORS[i%5]; ctx.fillStyle=IT_COLORS[i%5]; ctx.lineWidth=3;
        ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(x2,y2);ctx.stroke();
        const ang=Math.atan2(y2-cy,x2-cx), ah=9;
        ctx.beginPath();ctx.moveTo(x2,y2);
        ctx.lineTo(x2-ah*Math.cos(ang-0.4),y2-ah*Math.sin(ang-0.4));
        ctx.lineTo(x2-ah*Math.cos(ang+0.4),y2-ah*Math.sin(ang+0.4));
        ctx.closePath();ctx.fill();
      });
      return;
    }

    // dim === 3 — orthographic projection with yaw/pitch rotation
    const s=42, { yaw, pitch } = rot;
    const cosY=Math.cos(yaw), sinY=Math.sin(yaw), cosX=Math.cos(pitch), sinX=Math.sin(pitch);
    function proj(x,y,z){
      const x1=x*cosY+z*sinY, z1=-x*sinY+z*cosY, y1=y;
      const y2=y1*cosX-z1*sinX, z2=y1*sinX+z1*cosX;
      const depth=1+z2*0.045;
      return [cx+x1*s/depth, cy-y2*s/depth, z2];
    }
    ctx.strokeStyle='rgba(120,130,180,.12)'; ctx.lineWidth=1;
    for(let i=-3;i<=3;i++){
      let a=proj(i,0,-3), b=proj(i,0,3); ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();
      let c=proj(-3,0,i), d=proj(3,0,i); ctx.beginPath();ctx.moveTo(c[0],c[1]);ctx.lineTo(d[0],d[1]);ctx.stroke();
    }
    const O=proj(0,0,0);
    [[[3.4,0,0],'rgba(224,107,107,.75)','x'],[[0,3.4,0],'rgba(120,220,160,.75)','y'],[[0,0,3.4],'rgba(120,170,230,.75)','z']]
      .forEach(([p,col,label])=>{
        const P=proj(...p);
        ctx.strokeStyle=col; ctx.lineWidth=1.4;
        ctx.beginPath();ctx.moveTo(O[0],O[1]);ctx.lineTo(P[0],P[1]);ctx.stroke();
        ctx.fillStyle=col; ctx.font='11px var(--fm)'; ctx.fillText(label,P[0]+4,P[1]);
      });
    numericVectors
      .map((v,i)=>({ v, i, z: proj(...v)[2] }))
      .sort((a,b)=>a.z-b.z)
      .forEach(({v,i})=>{
        const P=proj(...v);
        ctx.strokeStyle=IT_COLORS[i%5]; ctx.fillStyle=IT_COLORS[i%5]; ctx.lineWidth=3;
        ctx.beginPath();ctx.moveTo(O[0],O[1]);ctx.lineTo(P[0],P[1]);ctx.stroke();
        ctx.beginPath();ctx.arc(P[0],P[1],4,0,7);ctx.fill();
      });
    ctx.fillStyle='#fff'; ctx.beginPath();ctx.arc(O[0],O[1],3.5,0,7);ctx.fill();
  }, [dim, vectors, rot]);

  // ── drag-to-rotate (mouse + touch, via Pointer Events) ──
  function onPointerDown(e){
    if (dim!==3) return;
    dragRef.current = { x:e.clientX, y:e.clientY, yaw:rot.yaw, pitch:rot.pitch };
    e.currentTarget.setPointerCapture(e.pointerId);
  }
  function onPointerMove(e){
    if (!dragRef.current) return;
    const dx=e.clientX-dragRef.current.x, dy=e.clientY-dragRef.current.y;
    setRot({ yaw: dragRef.current.yaw + dx*0.008, pitch: Math.max(-1.4, Math.min(1.4, dragRef.current.pitch - dy*0.008)) });
  }
  function onPointerUp(){ dragRef.current = null; }

  const btnStyle = active => ({
    fontFamily:'var(--fm)', fontSize:'.72rem', padding:'6px 14px', borderRadius:'20px', cursor:'pointer',
    border:'1px solid '+(active?'#38c9b0':'rgba(180,190,230,.3)'),
    background: active?'rgba(56,201,176,.2)':'transparent', color: active?'#8fd9cc':'#aab', fontWeight:600,
  });
  const labelStyle = { fontFamily:'var(--fm)', fontSize:'.6rem', letterSpacing:'.14em', textTransform:'uppercase', color:'#7079a0', marginBottom:'6px' };

  return (
    <div style={{ background:'#1a1a2e', border:'1px solid rgba(120,130,180,.3)', borderRadius:'16px', padding:'22px 24px', margin:'26px 0', color:'#e8ecff' }}>
      <div style={{ fontFamily:'var(--fm)', fontSize:'.72rem', letterSpacing:'.16em', textTransform:'uppercase', color:'#8fd9cc', marginBottom:'16px' }}>🎛 Independent or Dependent? — Enter Your Own Vectors</div>

      {/* space + count controls */}
      <div style={{ display:'flex', gap:'26px', flexWrap:'wrap', marginBottom:'18px' }}>
        <div>
          <div style={labelStyle}>Space</div>
          <div style={{ display:'flex', gap:'6px' }}>
            <button onClick={()=>setDim(2)} style={btnStyle(dim===2)}>ℝ²</button>
            <button onClick={()=>setDim(3)} style={btnStyle(dim===3)}>ℝ³</button>
          </div>
        </div>
        <div>
          <div style={labelStyle}>Number of vectors</div>
          <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
            <button onClick={()=>setCount(c=>Math.max(1,c-1))} disabled={count<=1} style={{ ...btnStyle(false), padding:'4px 12px', opacity:count<=1?.4:1 }}>−</button>
            <span style={{ fontFamily:'var(--fm)', fontSize:'.85rem', minWidth:'14px', textAlign:'center' }}>{count}</span>
            <button onClick={()=>setCount(c=>Math.min(5,c+1))} disabled={count>=5} style={{ ...btnStyle(false), padding:'4px 12px', opacity:count>=5?.4:1 }}>+</button>
            <span style={{ fontFamily:'var(--fm)', fontSize:'.62rem', color:'#7079a0' }}>max 5</span>
          </div>
        </div>
      </div>

      {/* vector component inputs */}
      <div style={{ display:'flex', flexDirection:'column', gap:'8px', marginBottom:'18px' }}>
        {vectors.map((v,i)=>(
          <div key={i} style={{ display:'flex', alignItems:'center', gap:'8px', flexWrap:'wrap' }}>
            <span style={{ width:'30px', flexShrink:0, fontFamily:'var(--fm)', fontSize:'.8rem', fontWeight:700, color:IT_COLORS[i%5] }}>v{i+1}</span>
            {v.map((c,j)=>(
              <input
                key={j}
                value={c}
                onChange={e=>setComponent(i,j,e.target.value)}
                inputMode="decimal"
                placeholder={['x','y','z'][j]}
                style={{
                  width:'52px', textAlign:'center', fontFamily:'var(--fm)', fontSize:'.82rem',
                  background:'#22223e', border:'1px solid rgba(180,190,230,.3)', borderRadius:'7px',
                  color:'#e8ecff', padding:'6px 4px', outline:'none',
                }}
              />
            ))}
          </div>
        ))}
      </div>

      {/* canvas + result */}
      <div style={{ display:'flex', gap:'22px', flexWrap:'wrap', alignItems:'flex-start' }}>
        <div>
          <canvas
            ref={canvasRef} width={320} height={300}
            onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerLeave={onPointerUp}
            style={{ borderRadius:'12px', maxWidth:'100%', touchAction:'none', cursor: dim===3 ? 'grab' : 'default' }}
          />
          {dim===3 && (
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'6px' }}>
              <span style={{ fontFamily:'var(--fm)', fontSize:'.62rem', color:'#7079a0' }}>🖱 drag to rotate</span>
              <button onClick={()=>setRot({ yaw:0.7, pitch:0.32 })} style={{ fontFamily:'var(--fm)', fontSize:'.62rem', color:'#8fd9cc', background:'transparent', border:'none', cursor:'pointer', textDecoration:'underline' }}>reset view</button>
            </div>
          )}
        </div>
        <div style={{ flex:1, minWidth:'220px' }}>
          <div style={{ background:'#22223e', borderRadius:'10px', padding:'12px 14px', borderLeft:`3px solid ${independent?'#38c9b0':'#e06b6b'}` }}>
            <div style={{ fontFamily:'var(--fh)', fontSize:'1.05rem', color:independent?'#8fd9cc':'#f0a0a0', marginBottom:'6px' }}>
              {independent ? '✓ Independent' : '✗ Dependent'}
            </div>
            <div style={{ fontFamily:'var(--fm)', fontSize:'.76rem', color:'#c4cae8', lineHeight:1.7 }}>
              {numericVectors.length>dim && `${numericVectors.length} vectors can never be independent in ${dimLabel} — there's only room for ${dim}. `}
              {independent
                ? 'The only linear combination that reaches 0 is the trivial one — every coefficient must be zero.'
                : 'There is a nontrivial combination of these vectors that equals the zero vector — at least one carries no new direction.'}
            </div>
          </div>
          <div style={{ fontFamily:'var(--fm)', fontSize:'.62rem', color:'#7079a0', marginTop:'8px' }}>
            rank = {rank} · {numericVectors.length} vector{numericVectors.length===1?'':'s'} · they span a {rank}-dimensional subspace of {dimLabel}.
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════ DIMENSION / BASIS VISUALIZER (3D-ish, 2D projection) ═══════════════ */
function DimensionVisualizer() {
  const [dim,setDim]=useState(1); // 0,1,2,3
  const canvasRef=useRef(null);

  useEffect(()=>{
    const cv=canvasRef.current; if(!cv) return;
    const ctx=cv.getContext('2d');
    const W=cv.width,H=cv.height,cx=W/2,cy=H/2+20,s=34;
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#12122a'; ctx.fillRect(0,0,W,H);
    // isometric-ish axes
    const proj=(x,y,z)=>[cx + (x-y)*0.87*s, cy - (x+y)*0.5*s - z*s];
    // grid floor
    ctx.strokeStyle='rgba(120,130,180,.12)'; ctx.lineWidth=1;
    for(let i=-3;i<=3;i++){
      let p1=proj(i,-3,0),p2=proj(i,3,0); ctx.beginPath();ctx.moveTo(...p1);ctx.lineTo(...p2);ctx.stroke();
      let p3=proj(-3,i,0),p4=proj(3,i,0); ctx.beginPath();ctx.moveTo(...p3);ctx.lineTo(...p4);ctx.stroke();
    }
    const O=proj(0,0,0);
    const drawVec=(x,y,z,col)=>{
      const P=proj(x,y,z);
      ctx.strokeStyle=col;ctx.fillStyle=col;ctx.lineWidth=3;
      ctx.beginPath();ctx.moveTo(...O);ctx.lineTo(...P);ctx.stroke();
      ctx.beginPath();ctx.arc(...P,4,0,7);ctx.fill();
    };
    if(dim===0){
      ctx.fillStyle='#fff'; ctx.beginPath();ctx.arc(...O,6,0,7);ctx.fill();
    }
    if(dim>=1){ // line
      ctx.strokeStyle='#38c9b055'; ctx.lineWidth=1; ctx.setLineDash([4,6]);
      let a=proj(-3,-3,0),b=proj(3,3,0); ctx.beginPath();ctx.moveTo(...a);ctx.lineTo(...b);ctx.stroke(); ctx.setLineDash([]);
      drawVec(2,2,0,'#38c9b0');
    }
    if(dim>=2){ // plane fill
      ctx.fillStyle='rgba(232,160,32,.14)';
      ctx.beginPath();
      const c1=proj(-3,3,0),c2=proj(3,3,0),c3=proj(3,-3,0),c4=proj(-3,-3,0);
      ctx.moveTo(...c1);ctx.lineTo(...c2);ctx.lineTo(...c3);ctx.lineTo(...c4);ctx.closePath();ctx.fill();
      drawVec(2,-1,0,'#e8a020');
    }
    if(dim>=3){ // add vertical vector -> fills space
      drawVec(0,0,2.6,'#9b80e8');
      ctx.fillStyle='rgba(155,128,232,.08)'; ctx.fillRect(0,0,W,H);
    }
    ctx.fillStyle='#fff'; ctx.beginPath();ctx.arc(...O,3.5,0,7);ctx.fill();
  },[dim]);

  const info=[
    { t:'dim 0 — the origin', d:'The zero subspace {0}. Basis = the empty set. No directions of freedom.' },
    { t:'dim 1 — a line', d:'One basis vector. Every point is a scalar multiple of it. One degree of freedom.' },
    { t:'dim 2 — a plane', d:'Two independent basis vectors. Every point is a·v₁ + b·v₂. Two degrees of freedom.' },
    { t:'dim 3 — all of ℝ³', d:'Three independent basis vectors fill space. Every point is reachable. Three degrees of freedom.' },
  ][dim];

  return (
    <div style={{ background:'#1a1a2e', border:'1px solid rgba(120,130,180,.3)', borderRadius:'16px', padding:'22px 24px', margin:'26px 0', color:'#e8ecff' }}>
      <div style={{ fontFamily:'var(--fm)', fontSize:'.72rem', letterSpacing:'.16em', textTransform:'uppercase', color:'#8fd9cc', marginBottom:'14px' }}>🎛 Dimension = Number of Basis Vectors</div>
      <div style={{ display:'flex', gap:'6px', flexWrap:'wrap', marginBottom:'14px' }}>
        {[0,1,2,3].map(d=>(
          <button key={d} onClick={()=>setDim(d)} style={{
            fontFamily:'var(--fm)', fontSize:'.72rem', padding:'6px 14px', borderRadius:'20px', cursor:'pointer',
            border:'1px solid '+(dim===d?'#38c9b0':'rgba(180,190,230,.3)'),
            background: dim===d?'rgba(56,201,176,.2)':'transparent', color: dim===d?'#8fd9cc':'#aab', fontWeight:600,
          }}>dim {d}</button>
        ))}
      </div>
      <div style={{ display:'flex', gap:'22px', flexWrap:'wrap', alignItems:'flex-start' }}>
        <canvas ref={canvasRef} width={320} height={300} style={{ borderRadius:'12px', maxWidth:'100%' }}/>
        <div style={{ flex:1, minWidth:'220px' }}>
          <div style={{ background:'#22223e', borderRadius:'10px', padding:'12px 14px', borderLeft:'3px solid #9b80e8' }}>
            <div style={{ fontFamily:'var(--fh)', fontSize:'1.02rem', color:'#b9a8f0', marginBottom:'6px' }}>{info.t}</div>
            <div style={{ fontFamily:'var(--fm)', fontSize:'.78rem', color:'#c4cae8', lineHeight:1.7 }}>{info.d}</div>
          </div>
          <div style={{ fontFamily:'var(--fm)', fontSize:'.62rem', color:'#7079a0', marginTop:'8px', lineHeight:1.6 }}>
            Add one independent direction, gain one dimension. The dimension counts the basis vectors — no more, no less.
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════ PAGE ═══════════════ */
export default function Lec15() {
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
        <span style={{color:'var(--text2)'}}>Week 5 · Lecture 15</span>
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
            <Link href={PREV_HREF} style={{ display:'flex', alignItems:'center', padding:'0 16px', height:'100%', fontFamily:'var(--fm)', fontSize:'.72rem', color:'var(--lec-ink3)', borderRight:'1px solid var(--lec-border)', whiteSpace:'nowrap', flexShrink:0, textDecoration:'none' }}>← Lecture 14</Link>
            <div style={{ flex:1, display:'flex', justifyContent:'center', alignItems:'center', gap:'4px', overflowX:'auto', padding:'0 8px' }}>
              <span style={{ fontFamily:'var(--fm)', fontSize:'.6rem', letterSpacing:'.12em', textTransform:'uppercase', color:'var(--lec-accent)', flexShrink:0, marginRight:'6px' }}>On this page</span>
              {ANCHORS.map(([label,id],i)=>(
                <span key={id} style={{display:'inline-flex',alignItems:'center',flexShrink:0}}>
                  {i>0&&<span style={{color:'var(--lec-border)',margin:'0 7px'}}>·</span>}
                  <a href={`#${id}`} onClick={e=>jump(e,id)} style={{fontFamily:'var(--fm)',fontSize:'.73rem',color:'var(--lec-ink2)',textDecoration:'none',whiteSpace:'nowrap'}}>{label}</a>
                </span>
              ))}
            </div>
            <Link href={NEXT_HREF} style={{ display:'flex', alignItems:'center', padding:'0 16px', height:'100%', fontFamily:'var(--fm)', fontSize:'.72rem', color:'var(--lec-ink3)', borderLeft:'1px solid var(--lec-border)', whiteSpace:'nowrap', flexShrink:0, textDecoration:'none' }}>Lecture 16 →</Link>
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

            <p>{String.raw`In Lecture 14 you learned that a handful of vectors can `}<b>span</b>{String.raw` an entire subspace. But Example 5 there showed something unsettling: `}<i>different</i>{String.raw` spanning sets can describe the `}<i>same</i>{String.raw` subspace. Some of them might carry a passenger — a vector that adds nothing, because it is already a combination of the others.`}</p>

            <p>{String.raw`Think of a set of directions for navigating a city. "Go east, go north, go northeast" — the third instruction is `}<b>redundant</b>{String.raw`, because northeast is just east-plus-north. You could delete it and still reach everywhere. A good set of directions has `}<b>no waste</b>{String.raw`: every instruction adds a genuinely new direction. That "no waste" property is called `}<b>linear independence</b>{String.raw`, and it is the whole subject of today.`}</p>

            <Callout icon="🎯" title="Why we chase independence" color="amber">
              {String.raw`A spanning set tells you a subspace is `}<i>reachable</i>{String.raw`. An `}<b>independent</b>{String.raw` spanning set — a `}<b>basis</b>{String.raw` — tells you it is reachable in `}<b>exactly one way</b>{String.raw`. Unique coordinates. No ambiguity. This is why GPS uses exactly three satellites' worth of independent directions, why colour screens use exactly three independent primaries, and why data scientists hunt for the smallest independent set of features that still captures their data. Independence is the mathematics of "no redundancy," and dimension is the number you get when you count what is left.`}
            </Callout>

            <Callout icon="💡" title="The payoff at the end" color="teal">
              {String.raw`By the end of this lecture you will be able to attach a single number — the `}<b>dimension</b>{String.raw` — to any subspace, capturing exactly how many independent directions it contains. A line is 1-dimensional, a plane is 2-dimensional, and this finally makes those words precise.`}
            </Callout>

            {/* ─── §2 INDEPENDENCE ─── */}
            <Sec id="independence" n="§2">What Is Linear Independence?</Sec>

            <p>{String.raw`We start from the goal: we want spanning sets where every vector has `}<b>exactly one</b>{String.raw` representation as a linear combination. It turns out this is captured by a clean condition on the zero vector.`}</p>

            <DefBox term="Linearly independent set" color="teal">
              <p style={{margin:0}}>{String.raw`A set of vectors $\{\mathbf{x}_1, \mathbf{x}_2, \ldots, \mathbf{x}_k\}$ in $\mathbb{R}^n$ is `}<b>linearly independent</b>{String.raw` (or just `}<b>independent</b>{String.raw`) if the only way to build the zero vector as a combination $$t_1\mathbf{x}_1 + t_2\mathbf{x}_2 + \cdots + t_k\mathbf{x}_k = \mathbf{0}$$ is with `}<b>every coefficient zero</b>{String.raw`: $t_1 = t_2 = \cdots = t_k = 0$.`}</p>
            </DefBox>

            <p>{String.raw`In plain words: no vector in an independent set can be built from the others. If you could — say $\mathbf{x}_3 = 2\mathbf{x}_1 - \mathbf{x}_2$ — then $2\mathbf{x}_1 - \mathbf{x}_2 - \mathbf{x}_3 = \mathbf{0}$ would be a way to reach zero `}<i>without</i>{String.raw` all-zero coefficients, and the set would fail the test. Independence means each vector points in a genuinely new direction.`}</p>

            <IndependenceTester/>

            {/* ─── §3 UNIQUE REP ─── */}
            <Sec id="unique" n="§3">Why Independence Matters: Unique Representation</Sec>

            <p>{String.raw`Here is the theorem that justifies the whole idea. Independence is `}<i>exactly</i>{String.raw` the condition that makes coordinates unambiguous.`}</p>

            <ThmBox title="Theorem 5.2.1 — unique representation">
              <p style={{margin:0}}>{String.raw`If $\{\mathbf{x}_1, \mathbf{x}_2, \ldots, \mathbf{x}_k\}$ is an independent set in $\mathbb{R}^n$, then every vector in $\operatorname{span}\{\mathbf{x}_1, \ldots, \mathbf{x}_k\}$ has `}<b>exactly one</b>{String.raw` representation as a linear combination of the $\mathbf{x}_i$.`}</p>
            </ThmBox>

            <Callout icon="🧠" title="What this theorem is really saying" color="violet">
              {String.raw`Take any vector $\mathbf{v}$ in the span. There is one and only one list of coefficients $(t_1, \ldots, t_k)$ with $\mathbf{v} = t_1\mathbf{x}_1 + \cdots + t_k\mathbf{x}_k$. Those coefficients are the `}<b>coordinates</b>{String.raw` of $\mathbf{v}$ in this system. Without independence, the same $\mathbf{v}$ could have many different coordinate lists — like a GPS that gives two different addresses for one house. Independence is what makes coordinates well-defined. `}<i>That</i>{String.raw` is why we care about it.`}
            </Callout>

            {/* ─── §4 THE TEST ─── */}
            <Sec id="test" n="§4">The Independence Test</Sec>

            <p>{String.raw`It helps to restate independence in compact language. Say a linear combination `}<b>vanishes</b>{String.raw` if it equals the zero vector, and call it `}<b>trivial</b>{String.raw` if every coefficient is zero. Then:`}</p>

            <DefBox term="Independence, restated" color="amber">
              <p style={{margin:0}}>{String.raw`A set of vectors is `}<b>independent</b>{String.raw` if and only if the `}<i>only</i>{String.raw` linear combination that vanishes is the trivial one.`}</p>
            </DefBox>

            <ThmBox title="Independence Test — the procedure">
              <p style={{margin:'4px 0'}}>{String.raw`To check that $\{\mathbf{x}_1, \ldots, \mathbf{x}_k\}$ is independent:`}</p>
              <p style={{margin:'4px 0'}}>{String.raw`$\textbf{1.}$ Set a general linear combination equal to zero: $t_1\mathbf{x}_1 + t_2\mathbf{x}_2 + \cdots + t_k\mathbf{x}_k = \mathbf{0}$.`}</p>
              <p style={{margin:'4px 0'}}>{String.raw`$\textbf{2.}$ Solve the resulting homogeneous system and show every $t_i = 0$.`}</p>
              <p style={{margin:'4px 0'}}>{String.raw`If you can force all coefficients to zero, the set is independent. If some `}<i>nontrivial</i>{String.raw` solution exists (coefficients not all zero), the set is dependent.`}</p>
            </ThmBox>

            <Callout icon="🔧" title="This is just a homogeneous system" color="teal">
              {String.raw`Step 1 always turns into a homogeneous system $A\mathbf{t} = \mathbf{0}$, where the columns of $A$ are your vectors. From Lecture 1 you know: this has `}<i>only</i>{String.raw` the trivial solution exactly when there are no free variables — that is, when the rank equals the number of vectors. So "independent" and "the vectors form full-rank columns" are the same statement.`}
            </Callout>

            {/* ─── §5 EXAMPLES ─── */}
            <Sec id="examples" n="§5">Worked Examples</Sec>

            <Example n="1" title="Example 5.2.1 — testing independence directly" advanced>
              <p>{String.raw`Determine whether $\{(1, 0, -2, 5), (2, 1, 0, -1), (1, 1, 2, 1)\}$ is independent in $\mathbb{R}^4$.`}</p>
              <Reveal label="Show full solution">
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Step 1 — set a combination to zero.}$ Suppose $t_1(1,0,-2,5) + t_2(2,1,0,-1) + t_3(1,1,2,1) = \mathbf{0}$. Reading each coordinate gives a homogeneous system:`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$\begin{aligned} t_1 + 2t_2 + t_3 &= 0 \\ t_2 + t_3 &= 0 \\ -2t_1 + 2t_3 &= 0 \\ 5t_1 - t_2 + t_3 &= 0 \end{aligned}$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Step 2 — solve.}$ The third equation gives $t_1 = t_3$. The second gives $t_2 = -t_3$. Substitute both into the first: $t_3 + 2(-t_3) + t_3 = 0$, which is $0 = 0$ — no new info yet. But the fourth equation: $5t_3 - (-t_3) + t_3 = 7t_3 = 0$, so $t_3 = 0$. Then $t_1 = 0$ and $t_2 = 0$.`}</p>
                <p style={{margin:0}}>{String.raw`Every coefficient is forced to zero, so the only vanishing combination is trivial. The set is `}<b>independent</b>{String.raw`. ✓`}</p>
              </Reveal>
            </Example>

            <Example n="2" title="Example 5.2.3 — independence survives an invertible mix" advanced>
              <p>{String.raw`If $\{\mathbf{x}, \mathbf{y}\}$ is independent, show that $\{2\mathbf{x} + 3\mathbf{y},\; \mathbf{x} - 5\mathbf{y}\}$ is also independent.`}</p>
              <Reveal label="Show full solution">
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Set a combination to zero:}$ suppose $s(2\mathbf{x} + 3\mathbf{y}) + t(\mathbf{x} - 5\mathbf{y}) = \mathbf{0}$. Group the $\mathbf{x}$ and $\mathbf{y}$ terms:`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$(2s + t)\mathbf{x} + (3s - 5t)\mathbf{y} = \mathbf{0}.$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Use independence of $\{\mathbf{x}, \mathbf{y}\}$.}$ Since $\mathbf{x}$ and $\mathbf{y}$ are independent, the only way this vanishes is if both coefficients are zero:`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$2s + t = 0 \quad\text{and}\quad 3s - 5t = 0.$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Solve.}$ From the first, $t = -2s$. Substitute: $3s - 5(-2s) = 13s = 0$, so $s = 0$, and then $t = 0$.`}</p>
                <p style={{margin:0}}>{String.raw`Both coefficients are zero, so $\{2\mathbf{x}+3\mathbf{y}, \mathbf{x}-5\mathbf{y}\}$ is `}<b>independent</b>{String.raw`. (Behind the scenes: the mixing matrix $\begin{bmatrix} 2 & 1 \\ 3 & -5 \end{bmatrix}$ has determinant $-13 \neq 0$, so it is invertible — that is exactly why independence is preserved.)`}</p>
              </Reveal>
            </Example>

            <Example n="3" title="Example 5.2.4 — the zero vector poisons independence">
              <p>{String.raw`Show that the zero vector in $\mathbb{R}^n$ can never belong to an independent set.`}</p>
              <Reveal label="Show solution">
                <p style={{margin:0}}>{String.raw`Suppose a set contains $\mathbf{0}$, say $\{\mathbf{0}, \mathbf{x}_2, \ldots, \mathbf{x}_k\}$. Then $$1\cdot\mathbf{0} + 0\cdot\mathbf{x}_2 + \cdots + 0\cdot\mathbf{x}_k = \mathbf{0}$$ is a vanishing combination — but its first coefficient is $1$, not zero. So there is a `}<b>nontrivial</b>{String.raw` way to reach $\mathbf{0}$, and the set is dependent. Any set containing the zero vector is automatically dependent. $\;\blacksquare$`}</p>
              </Reveal>
            </Example>

            <Example n="4" title="Example 5.2.5 — a single vector">
              <p>{String.raw`For $\mathbf{x}$ in $\mathbb{R}^n$, show that $\{\mathbf{x}\}$ is independent if and only if $\mathbf{x} \neq \mathbf{0}$.`}</p>
              <Reveal label="Show solution">
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{If $\mathbf{x} \neq \mathbf{0}$:}$ the equation $t\mathbf{x} = \mathbf{0}$ forces $t = 0$ (a nonzero vector times a nonzero scalar is nonzero). Only the trivial combination vanishes, so $\{\mathbf{x}\}$ is independent.`}</p>
                <p style={{margin:0}}>{String.raw`$\textbf{If $\mathbf{x} = \mathbf{0}$:}$ then $\{\mathbf{0}\}$ is dependent by Example 3. So a single-vector set is independent exactly when the vector is nonzero. $\;\blacksquare$`}</p>
              </Reveal>
            </Example>

            {/* ─── §6 DEPENDENCE ─── */}
            <Sec id="dependence" n="§6">Linear Dependence</Sec>

            <DefBox term="Linearly dependent set" color="rose">
              <p style={{margin:0}}>{String.raw`A set of vectors in $\mathbb{R}^n$ is `}<b>linearly dependent</b>{String.raw` (or just `}<b>dependent</b>{String.raw`) if it is `}<i>not</i>{String.raw` independent — equivalently, if `}<b>some nontrivial linear combination vanishes</b>{String.raw`. That means at least one vector can be written in terms of the others; it is a redundant passenger.`}</p>
            </DefBox>

            <Callout icon="⚖️" title="The two words, side by side" color="teal">
              {String.raw`$\textbf{Independent:}$ the `}<i>only</i>{String.raw` vanishing combination is trivial (all coefficients zero). No redundancy. $\;\;\textbf{Dependent:}$ `}<i>some</i>{String.raw` nontrivial combination vanishes (some coefficient nonzero). At least one vector is redundant. Every set is one or the other.`}
            </Callout>

            {/* ─── §7 THEOREMS ─── */}
            <Sec id="thms" n="§7">Two Powerful Theorems</Sec>

            <p>{String.raw`These connect independence and spanning to things you already know how to compute: matrix equations and invertibility.`}</p>

            <ThmBox title="Theorem 5.2.2 — columns of a matrix">
              <p style={{margin:'0 0 8px'}}>{String.raw`Let $A$ be an $m \times n$ matrix with columns $\{\mathbf{c}_1, \mathbf{c}_2, \ldots, \mathbf{c}_n\}$.`}</p>
              <p style={{margin:'4px 0'}}>{String.raw`$\textbf{1.}$ The columns are `}<b>independent</b>{String.raw` in $\mathbb{R}^m$ if and only if $A\mathbf{x} = \mathbf{0}$ (for $\mathbf{x}$ in $\mathbb{R}^n$) forces $\mathbf{x} = \mathbf{0}$.`}</p>
              <p style={{margin:'4px 0'}}>{String.raw`$\textbf{2.}$ The columns `}<b>span</b>{String.raw` $\mathbb{R}^m$ if and only if $A\mathbf{x} = \mathbf{b}$ has a solution for `}<i>every</i>{String.raw` $\mathbf{b}$ in $\mathbb{R}^m$.`}</p>
            </ThmBox>

            <Callout icon="🧠" title="What Theorem 5.2.2 means" color="violet">
              {String.raw`It translates the two big ideas into system-solving. `}<b>Independence</b>{String.raw` = "the homogeneous system has only the zero solution." `}<b>Spanning</b>{String.raw` = "every right-hand side is achievable." You already know how to test both by row reduction — so you already know how to test independence and spanning. No new computation, just new vocabulary.`}
            </Callout>

            <ThmBox title="Theorem 5.2.3 — five faces of an invertible matrix">
              <p style={{margin:'0 0 8px'}}>{String.raw`For an $n \times n$ (square) matrix $A$, the following are `}<b>equivalent</b>{String.raw` — each one implies all the others:`}</p>
              <p style={{margin:'3px 0'}}>{String.raw`$\textbf{1.}$ $A$ is invertible.`}</p>
              <p style={{margin:'3px 0'}}>{String.raw`$\textbf{2.}$ The columns of $A$ are linearly independent.`}</p>
              <p style={{margin:'3px 0'}}>{String.raw`$\textbf{3.}$ The columns of $A$ span $\mathbb{R}^n$.`}</p>
              <p style={{margin:'3px 0'}}>{String.raw`$\textbf{4.}$ The rows of $A$ are linearly independent.`}</p>
              <p style={{margin:'3px 0'}}>{String.raw`$\textbf{5.}$ The rows of $A$ span the set of all $1 \times n$ rows.`}</p>
            </ThmBox>

            <Callout icon="🔑" title="Why Theorem 5.2.3 is a gift" color="amber">
              {String.raw`For a `}<b>square</b>{String.raw` matrix, "independent," "spanning," and "invertible" all collapse into one thing. And from Lecture 10, invertible means $\det A \neq 0$. So to test whether $n$ vectors in $\mathbb{R}^n$ are independent, you do not need to solve a system at all — just `}<b>stack them into a square matrix and check the determinant</b>{String.raw`. Non-zero determinant $\Rightarrow$ independent. This is the fastest test you have.`}
            </Callout>

            {/* ─── §8 DET METHOD ─── */}
            <Sec id="det-method" n="§8">The Determinant Shortcut in Action</Sec>

            <Example n="5" title="Example 5.2.9 — independence via determinant" advanced>
              <p>{String.raw`Show that $S = \{(2, -2, 5), (-3, 1, 1), (2, 7, -4)\}$ is independent in $\mathbb{R}^3$, using Theorem 5.2.3.`}</p>
              <Reveal label="Show full solution">
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Step 1 — stack as a square matrix.}$ We have three vectors in $\mathbb{R}^3$, so they form a $3\times3$ matrix (as columns):`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$A = \begin{bmatrix} 2 & -3 & 2 \\ -2 & 1 & 7 \\ 5 & 1 & -4 \end{bmatrix}.$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Step 2 — compute the determinant}$ (cofactor expansion along the first row):`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$\det A = 2\begin{vmatrix} 1 & 7 \\ 1 & -4 \end{vmatrix} - (-3)\begin{vmatrix} -2 & 7 \\ 5 & -4 \end{vmatrix} + 2\begin{vmatrix} -2 & 1 \\ 5 & 1 \end{vmatrix}.$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`Each $2\times2$: $\begin{vmatrix} 1 & 7 \\ 1 & -4 \end{vmatrix} = -4 - 7 = -11$; $\begin{vmatrix} -2 & 7 \\ 5 & -4 \end{vmatrix} = 8 - 35 = -27$; $\begin{vmatrix} -2 & 1 \\ 5 & 1 \end{vmatrix} = -2 - 5 = -7$. So`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$\det A = 2(-11) + 3(-27) + 2(-7) = -22 - 81 - 14 = -117.$$`}</p>
                <p style={{margin:0}}>{String.raw`$\textbf{Step 3 — conclude.}$ Since $\det A = -117 \neq 0$, the matrix is invertible, so by Theorem 5.2.3 its columns are `}<b>independent</b>{String.raw`. Done — no system-solving needed. ✓`}</p>
              </Reveal>
            </Example>

            {/* ════════ PART B: DIMENSION ════════ */}

            {/* ─── §9 DIM WHY ─── */}
            <Sec id="dim-why" n="§9">Part B — Dimension: Measuring the Size of a Subspace</Sec>

            <p>{String.raw`We casually say a line is "one-dimensional" and a plane is "two-dimensional." But what does that number actually count? Now we can say it precisely: `}<b>dimension is the number of independent directions</b>{String.raw` a subspace contains — equivalently, the size of any basis for it.`}</p>

            <Callout icon="🌐" title="Why dimension is everywhere" color="amber">
              {String.raw`Dimension is one of the most important numbers in mathematics and science. A robot arm's `}<i>degrees of freedom</i>{String.raw` is the dimension of its space of motions. The `}<i>number of independent features</i>{String.raw` in a dataset is a dimension — and "dimensionality reduction" (the heart of modern machine learning) is literally the art of finding a smaller-dimensional subspace that still holds your data. Physicists argue about whether spacetime is $4$-dimensional or $11$-dimensional. In every case, the question "what is the dimension?" means "how many independent directions do I really have?"`}
            </Callout>

            <Callout icon="🎲" title="A surprising fact" color="violet">
              {String.raw`Here is something remarkable that we are about to prove: `}<i>every</i>{String.raw` basis of a given subspace has `}<b>the same number of vectors</b>{String.raw`. You cannot span a plane with a basis of $2$ vectors and also with a basis of $3$ — the plane "knows" it is $2$-dimensional, and no honest basis can disagree. This is not obvious, and it is what makes "dimension" a well-defined number at all.`}
            </Callout>

            {/* ─── §10 FUNDAMENTAL ─── */}
            <Sec id="fundamental" n="§10">The Fundamental Theorem</Sec>

            <ThmBox title="Theorem 5.2.4 — Fundamental Theorem">
              <p style={{margin:0}}>{String.raw`Let $U$ be a subspace of $\mathbb{R}^n$. If $U$ is spanned by $m$ vectors, and if $U$ contains a set of $k$ linearly independent vectors, then $$k \leq m.$$`}</p>
            </ThmBox>

            <Callout icon="🧠" title="What the Fundamental Theorem is saying" color="teal">
              {String.raw`In plain words: `}<b>you can never have more independent vectors than you have spanning vectors</b>{String.raw`. If $m$ vectors are enough to build the whole subspace, then no independent set inside it can be bigger than $m$. Intuitively, independent vectors each demand their own "room," and a spanning set of size $m$ only provides $m$ rooms. Try to fit $k > m$ independent vectors and at least one must be a combination of the others — contradicting independence. This one inequality is the engine behind everything that follows, including the fact that all bases have the same size.`}
            </Callout>

            {/* ─── §11 BASIS ─── */}
            <Sec id="basis" n="§11">Basis: A Spanning Set With No Waste</Sec>

            <p>{String.raw`Now we name the ideal spanning set — one that spans, but has no redundant passengers.`}</p>

            <DefBox term="Basis (Definition 5.4)" color="violet">
              <p style={{margin:'0 0 8px'}}>{String.raw`If $U$ is a subspace of $\mathbb{R}^n$, a set $\{\mathbf{x}_1, \mathbf{x}_2, \ldots, \mathbf{x}_m\}$ of vectors in $U$ is a `}<b>basis</b>{String.raw` of $U$ if it satisfies `}<i>both</i>{String.raw`:`}</p>
              <p style={{margin:'4px 0'}}>{String.raw`$\textbf{1.}$ $\{\mathbf{x}_1, \ldots, \mathbf{x}_m\}$ is linearly independent (no waste), and`}</p>
              <p style={{margin:'4px 0'}}>{String.raw`$\textbf{2.}$ $U = \operatorname{span}\{\mathbf{x}_1, \ldots, \mathbf{x}_m\}$ (it builds all of $U$).`}</p>
            </DefBox>

            <Callout icon="🎯" title="Basis = the two ideas together" color="teal">
              {String.raw`A basis is the perfect middle ground. `}<b>Spanning</b>{String.raw` alone might have redundancy (too many vectors). `}<b>Independence</b>{String.raw` alone might not reach everything (too few). A `}<b>basis</b>{String.raw` is `}<i>exactly enough</i>{String.raw`: independent, so nothing is wasted; spanning, so nothing is missing. It is the most efficient description of a subspace.`}
            </Callout>

            <ThmBox title="Theorem 5.2.5 — Invariance Theorem">
              <p style={{margin:0}}>{String.raw`If $\{\mathbf{x}_1, \ldots, \mathbf{x}_m\}$ and $\{\mathbf{y}_1, \ldots, \mathbf{y}_k\}$ are both bases of a subspace $U$, then $m = k$.`}</p>
            </ThmBox>

            <Callout icon="🧠" title="What the Invariance Theorem means (and why it works)" color="violet">
              {String.raw`Every basis of $U$ has the `}<b>same size</b>{String.raw`. This follows from the Fundamental Theorem applied twice. The first basis spans (with $m$ vectors) and the second is independent (with $k$ vectors), so $k \leq m$. But the second also spans (with $k$) and the first is independent (with $m$), so $m \leq k$. Together $m \leq k$ and $k \leq m$ force $m = k$. Because the count never changes, it is safe to `}<i>define</i>{String.raw` a number from it — the dimension.`}
            </Callout>

            {/* ─── §12 DIMENSION ─── */}
            <Sec id="dimension" n="§12">Dimension Defined</Sec>

            <DefBox term="Dimension (Definition 5.5)" color="amber">
              <p style={{margin:0}}>{String.raw`If $U$ is a subspace of $\mathbb{R}^n$ and $\{\mathbf{x}_1, \ldots, \mathbf{x}_m\}$ is `}<i>any</i>{String.raw` basis of $U$, the number $m$ of vectors in that basis is the `}<b>dimension</b>{String.raw` of $U$, written $\dim U = m$.`}</p>
            </DefBox>

            <p>{String.raw`This definition only makes sense because of the Invariance Theorem — since every basis has the same size, it does not matter `}<i>which</i>{String.raw` basis you pick; you always get the same number. A line has dimension $1$, a plane has dimension $2$, the zero subspace $\{\mathbf{0}\}$ has dimension $0$ (its basis is the empty set), and $\mathbb{R}^n$ itself has dimension $n$.`}</p>

            <DimensionVisualizer/>

            {/* ─── §13 DIM EXAMPLES ─── */}
            <Sec id="dim-ex" n="§13">Finding a Basis and Dimension</Sec>

            <Example n="6" title="Example 5.2.11 — subspace, basis, and dimension" advanced>
              <p>{String.raw`Let $U = \{ (r, s, r) : r, s \in \mathbb{R} \}$. Show $U$ is a subspace of $\mathbb{R}^3$, find a basis, and compute $\dim U$.`}</p>
              <Reveal label="Show full solution">
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Step 1 — show it is a subspace.}$ The fastest route is to write $U$ as a span (recall from Lecture 14: every span is automatically a subspace). Split a general element by its free parameters:`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$(r, s, r) = r(1, 0, 1) + s(0, 1, 0).$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`So $U = \operatorname{span}\{(1,0,1),\, (0,1,0)\}$, which is a subspace by Theorem 5.1.1. ✓`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Step 2 — check the spanning set is independent.}$ Suppose $a(1,0,1) + b(0,1,0) = \mathbf{0}$. Coordinate-wise: $a = 0$ (first), $b = 0$ (second). Only the trivial combination vanishes, so $\{(1,0,1), (0,1,0)\}$ is independent.`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Step 3 — conclude.}$ The set spans $U$ and is independent, so it is a `}<b>basis</b>{String.raw`. It has $2$ vectors, so`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$\dim U = 2.$$`}</p>
                <p style={{margin:0}}>{String.raw`Geometrically, $U$ is a plane through the origin in $\mathbb{R}^3$ (the points where the first and third coordinates are equal) — and indeed a plane is $2$-dimensional.`}</p>
              </Reveal>
            </Example>

            <Example n="7" title="Extra practice — a subspace given by an equation">
              <p>{String.raw`Find a basis and dimension of $W = \{ (x, y, z) : x + y + z = 0 \}$ in $\mathbb{R}^3$.`}</p>
              <Reveal label="Show solution">
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Solve the constraint.}$ The condition $x + y + z = 0$ means $x = -y - z$, with $y, z$ free. A general element is`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$(x, y, z) = (-y - z,\; y,\; z) = y(-1, 1, 0) + z(-1, 0, 1).$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`So $W = \operatorname{span}\{(-1,1,0),\, (-1,0,1)\}$. These two are independent (neither is a multiple of the other — check the second coordinates: one has $1$, the other $0$). So they form a basis, and`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$\dim W = 2.$$`}</p>
                <p style={{margin:0}}>{String.raw`One linear equation on $\mathbb{R}^3$ cut the dimension down by exactly one, from $3$ to $2$ — a plane through the origin. This pattern is general: each independent linear constraint removes one dimension.`}</p>
              </Reveal>
            </Example>

            <Example n="8" title="Extra practice — a span that secretly collapses" advanced>
              <p>{String.raw`Find the dimension of $V = \operatorname{span}\{(1, -1, 2, 0),\, (2, 3, 0, 3),\, (1, 9, -6, 6)\}$ in $\mathbb{R}^4$.`}</p>
              <Reveal label="Show solution">
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Watch for redundancy.}$ Three spanning vectors does `}<i>not</i>{String.raw` automatically mean dimension $3$ — only if they are independent. Test them: is the third a combination of the first two? Try $(1,9,-6,6) = a(1,-1,2,0) + b(2,3,0,3)$.`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`From the first two coordinates: $a + 2b = 1$ and $-a + 3b = 9$. Adding gives $5b = 10$, so $b = 2$ and $a = -3$. Check the rest: third coordinate $2(-3) + 0(2) = -6$ ✓, fourth $0(-3) + 3(2) = 6$ ✓. So`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$(1, 9, -6, 6) = -3(1,-1,2,0) + 2(2,3,0,3).$$`}</p>
                <p style={{margin:0}}>{String.raw`The third vector is redundant! So $V = \operatorname{span}\{(1,-1,2,0), (2,3,0,3)\}$, and those two are independent (not multiples of each other). Therefore $\dim V = \mathbf{2}$, not $3$. `}<b>Lesson:</b>{String.raw` always check independence before declaring a dimension — a spanning set can hide passengers.`}</p>
              </Reveal>
            </Example>

            <Callout icon="🛠" title="The general recipe for basis and dimension" color="teal">
              {String.raw`(1) Write the subspace as a span by solving out its free parameters or constraints. (2) Check whether those spanning vectors are independent. (3) If yes, they are a basis and the dimension is how many there are. (4) If no, discard the redundant ones until what remains is independent — that trimmed set is a basis. The dimension is the size of the trimmed set.`}
            </Callout>

            {/* ─── §14 EXERCISES ─── */}
            <Sec id="exercises" n="§14">Exercises</Sec>

            <p style={{fontStyle:'italic', color:'var(--lec-ink3)'}}>{String.raw`The true/false set (5.2.7) is worth real attention — several claims are subtly false, and two are "technically true" traps. Work them before reading the answers.`}</p>

            <Exercise id="5.2.7" title="True or false? (with counterexamples)  [FULLY SOLVED]">
              <p>{String.raw`For each claim, decide if it is always true; if false, give a counterexample.`}</p>
              <Reveal label="Show all nine answers">
                <p style={{margin:'0 0 6px'}}>{String.raw`$\textbf{(a)} \{\mathbf{x}, \mathbf{y}\}$ indep $\Rightarrow \{\mathbf{x}, \mathbf{y}, \mathbf{x}+\mathbf{y}\}$ indep?`}</p>
                <p style={{margin:'0 0 10px'}}>{String.raw`$\textbf{FALSE.}$ Since $\mathbf{x} + \mathbf{y} = 1\mathbf{x} + 1\mathbf{y}$, the combination $\mathbf{x} + \mathbf{y} - (\mathbf{x}+\mathbf{y}) = \mathbf{0}$ vanishes nontrivially. Counterexample: $\mathbf{x}=(1,0)$, $\mathbf{y}=(0,1)$; then $\{(1,0),(0,1),(1,1)\}$ is dependent.`}</p>

                <p style={{margin:'0 0 6px'}}>{String.raw`$\textbf{(b)} \{\mathbf{x}, \mathbf{y}, \mathbf{z}\}$ indep $\Rightarrow \{\mathbf{y}, \mathbf{z}\}$ indep?`}</p>
                <p style={{margin:'0 0 10px'}}>{String.raw`$\textbf{TRUE.}$ Any subset of an independent set is independent — removing vectors cannot create a redundancy that was not there.`}</p>

                <p style={{margin:'0 0 6px'}}>{String.raw`$\textbf{(c)} \{\mathbf{y}, \mathbf{z}\}$ dependent $\Rightarrow \{\mathbf{x}, \mathbf{y}, \mathbf{z}\}$ dependent for any $\mathbf{x}$?`}</p>
                <p style={{margin:'0 0 10px'}}>{String.raw`$\textbf{TRUE.}$ If some nontrivial combination of $\mathbf{y}, \mathbf{z}$ is $\mathbf{0}$, the same combination (with $\mathbf{x}$-coefficient $0$) is a nontrivial vanishing combination in the bigger set. Adding vectors never fixes dependence.`}</p>

                <p style={{margin:'0 0 6px'}}>{String.raw`$\textbf{(d)}$ all $\mathbf{x}_i$ nonzero $\Rightarrow \{\mathbf{x}_1, \ldots, \mathbf{x}_k\}$ indep?`}</p>
                <p style={{margin:'0 0 10px'}}>{String.raw`$\textbf{FALSE.}$ Nonzero is not enough — they can still be multiples. Counterexample: $\{(1,0), (2,0)\}$, both nonzero, but $(2,0) = 2(1,0)$, so dependent.`}</p>

                <p style={{margin:'0 0 6px'}}>{String.raw`$\textbf{(e)}$ one of the $\mathbf{x}_i$ is $\mathbf{0} \Rightarrow$ the set is dependent?`}</p>
                <p style={{margin:'0 0 10px'}}>{String.raw`$\textbf{TRUE.}$ Put coefficient $1$ on the zero vector and $0$ on the rest: that is a nontrivial vanishing combination. (This is Example 3.)`}</p>

                <p style={{margin:'0 0 6px'}}>{String.raw`$\textbf{(f)} a\mathbf{x} + b\mathbf{y} + c\mathbf{z} = \mathbf{0} \Rightarrow \{\mathbf{x},\mathbf{y},\mathbf{z}\}$ indep?`}</p>
                <p style={{margin:'0 0 10px'}}>{String.raw`$\textbf{FALSE.}$ The equation holding for `}<i>some</i>{String.raw` $a,b,c$ says nothing — the trivial $a=b=c=0$ always works. Independence requires the coefficients to be `}<i>forced</i>{String.raw` to zero. Counterexample: $\mathbf{x}=(1,0)$, $\mathbf{y}=(0,1)$, $\mathbf{z}=(1,1)$ satisfy $1\mathbf{x}+1\mathbf{y}-1\mathbf{z}=\mathbf{0}$ with nonzero coefficients, so they are dependent.`}</p>

                <p style={{margin:'0 0 6px'}}>{String.raw`$\textbf{(g)} \{\mathbf{x},\mathbf{y},\mathbf{z}\}$ indep $\Rightarrow a\mathbf{x}+b\mathbf{y}+c\mathbf{z}=\mathbf{0}$ for some $a,b,c$?`}</p>
                <p style={{margin:'0 0 10px'}}>{String.raw`$\textbf{TRUE — but a trap.}$ It is true because you can always take $a=b=c=0$. The claim never says "not all zero," so the trivial choice satisfies it. Read carefully: this is `}<i>vacuously</i>{String.raw` true and tells you nothing about independence.`}</p>

                <p style={{margin:'0 0 6px'}}>{String.raw`$\textbf{(h)} \{\mathbf{x}_1, \ldots, \mathbf{x}_k\}$ dependent $\Rightarrow t_1\mathbf{x}_1 + \cdots + t_k\mathbf{x}_k = \mathbf{0}$ for some $t_i$ not all zero?`}</p>
                <p style={{margin:'0 0 10px'}}>{String.raw`$\textbf{TRUE.}$ This is exactly the definition of dependent.`}</p>

                <p style={{margin:'0 0 6px'}}>{String.raw`$\textbf{(i)} \{\mathbf{x}_1, \ldots, \mathbf{x}_k\}$ indep $\Rightarrow t_1\mathbf{x}_1 + \cdots + t_k\mathbf{x}_k = \mathbf{0}$ for some $t_i$?`}</p>
                <p style={{margin:0}}>{String.raw`$\textbf{TRUE — the same trap as (g).}$ Take all $t_i = 0$. Since the claim does not require the $t_i$ to be nonzero, the trivial combination satisfies it. $\textbf{Moral of (f), (g), (i):}$ independence is entirely about whether the coefficients are `}<b>forced</b>{String.raw` to be zero — "for some coefficients" statements are almost always trivially true and test nothing.`}</p>
              </Reveal>
            </Exercise>

            <Exercise id="5.2.2" title="{x,y,z,w} independent — which transformed sets stay independent?  [ONE SOLVED, REST HINTED]">
              <p>{String.raw`$\textbf{(a)}\ \{\mathbf{x}-\mathbf{y}, \mathbf{y}-\mathbf{z}, \mathbf{z}-\mathbf{x}\}\quad\textbf{(b)}\ \{\mathbf{x}+\mathbf{y}, \mathbf{y}+\mathbf{z}, \mathbf{z}+\mathbf{x}\}\quad\textbf{(c)}\ \{\mathbf{x}-\mathbf{y}, \mathbf{y}-\mathbf{z}, \mathbf{z}-\mathbf{w}, \mathbf{w}-\mathbf{x}\}\quad\textbf{(d)}\ \{\mathbf{x}+\mathbf{y}, \mathbf{y}+\mathbf{z}, \mathbf{z}+\mathbf{w}, \mathbf{w}+\mathbf{x}\}$`}</p>
              <Reveal label="Show solution to (a)">
                <p style={{margin:'0 0 8px'}}>{String.raw`Set $s_1(\mathbf{x}-\mathbf{y}) + s_2(\mathbf{y}-\mathbf{z}) + s_3(\mathbf{z}-\mathbf{x}) = \mathbf{0}$ and group by $\mathbf{x}, \mathbf{y}, \mathbf{z}$:`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$(s_1 - s_3)\mathbf{x} + (s_2 - s_1)\mathbf{y} + (s_3 - s_2)\mathbf{z} = \mathbf{0}.$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`Since $\{\mathbf{x},\mathbf{y},\mathbf{z}\}$ is independent, each coefficient is zero: $s_1 = s_3$, $s_2 = s_1$, $s_3 = s_2$. These are all satisfied by $s_1 = s_2 = s_3 = 1$ (any common value) — a `}<b>nontrivial</b>{String.raw` solution. So the set is $\textbf{DEPENDENT}$. (Indeed $(\mathbf{x}-\mathbf{y}) + (\mathbf{y}-\mathbf{z}) + (\mathbf{z}-\mathbf{x}) = \mathbf{0}$ — the three differences cancel in a loop.)`}</p>
              </Reveal>
              <Callout icon="🧭" title="Hints for (b), (c), (d)" color="teal">
                {String.raw`Same method: expand, group by the original vectors, and use their independence to get a system in the new coefficients. The "loop" structure is the key — a `}<i>cycle</i>{String.raw` of differences or sums often cancels. Results to confirm: $\textbf{(b)}$ is `}<b>independent</b>{String.raw` (the coefficient matrix has determinant $2 \neq 0$). $\textbf{(c)}$ and $\textbf{(d)}$ are both `}<b>dependent</b>{String.raw` — each has a cyclic cancellation (for (c), the four differences sum to $\mathbf{0}$; for (d), take alternating signs $+,-,+,-$).`}
              </Callout>
            </Exercise>

            <Exercise id="5.2.3" title="Basis and dimension of span{(1,−1,2,0),(2,3,0,3),(1,9,−6,6)}  [SOLVED — see Example 8]">
              <Callout icon="✅" title="Already worked" color="violet">
                {String.raw`This is exactly Example 8 above. The third vector equals $-3$(first)$+ 2$(second), so it is redundant. A basis is $\{(1,-1,2,0),\, (2,3,0,3)\}$ and $\dim = 2$.`}
              </Callout>
            </Exercise>

            <Exercise id="5.2.4" title="Basis and dimension of four subspaces of ℝ⁴  [ONE SOLVED, REST HINTED]">
              <Reveal label="Show solution to (a)">
                <p style={{margin:'0 0 8px'}}>{String.raw`$U = \{(a,\, a+b,\, a-b,\, b) : a, b \in \mathbb{R}\}$. Split by the free parameters $a, b$:`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$(a,\, a+b,\, a-b,\, b) = a(1, 1, 1, 0) + b(0, 1, -1, 1).$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`So $U = \operatorname{span}\{(1,1,1,0),\, (0,1,-1,1)\}$. These two are independent (the first has a $0$ in the last slot where the second has $1$, and vice versa in the first slot — neither is a multiple of the other). So they form a basis and $\dim U = 2$.`}</p>
              </Reveal>
              <Callout icon="🧭" title="Hints for (b), (c), (d)" color="teal">
                {String.raw`Same recipe: rewrite each general element as a combination of constant vectors, one per free parameter, then check those vectors for independence. Answers to confirm: $\textbf{(b)}$ $(a+b, a-b, b, a) = a(1,1,0,1) + b(1,-1,1,0)$, so $\dim = 2$. $\textbf{(c)}$ has three free parameters $a,b,c$ giving three independent vectors, so $\dim = 3$. $\textbf{(d)}$ also works out to $\dim = 3$ (three parameters, and the resulting vectors turn out independent — verify by checking no one is a combination of the others).`}
              </Callout>
            </Exercise>

            <Exercise id="5.2.6" title="Which sets are a basis? (use Theorem 5.2.3)  [ONE SOLVED, REST HINTED]">
              <Reveal label="Show solution to (a) and the method">
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{(a)} \{(3, -1), (2, 2)\}$ in $\mathbb{R}^2$. Two vectors in $\mathbb{R}^2$ — the right count for a basis. By Theorem 5.2.3, they form a basis iff the matrix $\begin{bmatrix} 3 & 2 \\ -1 & 2 \end{bmatrix}$ is invertible, i.e. has nonzero determinant.`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$\det = (3)(2) - (2)(-1) = 6 + 2 = 8 \neq 0.$$`}</p>
                <p style={{margin:0}}>{String.raw`Nonzero, so $\{(3,-1), (2,2)\}$ `}<b>is a basis</b>{String.raw` of $\mathbb{R}^2$. The method for every part: check the count matches the space's dimension, stack into a square matrix, compute the determinant.`}</p>
              </Reveal>
              <Callout icon="🧭" title="Hints for (b)–(e)" color="teal">
                {String.raw`Stack each set as a square matrix and take the determinant — nonzero means basis. First check the `}<i>count</i>{String.raw`: you need exactly $n$ vectors to be a basis of $\mathbb{R}^n$ (three for $\mathbb{R}^3$, four for $\mathbb{R}^4$). Results to confirm: $\textbf{(b)}$ det $= -2 \neq 0$, `}<b>basis</b>{String.raw`. $\textbf{(c)}$ det $= 0$, `}<b>not</b>{String.raw` a basis. $\textbf{(d)}$ det $= 12 \neq 0$, `}<b>basis</b>{String.raw`. $\textbf{(e)}$ det $= 0$, `}<b>not</b>{String.raw` a basis.`}
              </Callout>
            </Exercise>

            <Exercise id="5.2.9–5.2.12" title="Proof problems  [HINTS — these are worth attempting]">
              <Callout icon="🧭" title="Hints" color="violet">
                {String.raw`$\textbf{5.2.9:}$ given independent $\{\mathbf{x},\mathbf{y},\mathbf{z}\}$ in $\mathbb{R}^4$, show adding some standard vector $\mathbf{e}_k$ makes a basis of $\mathbb{R}^4$. Since $\dim \mathbb{R}^4 = 4$, you need one more independent vector; argue that not `}<i>all</i>{String.raw` four $\mathbf{e}_k$ can lie in $\operatorname{span}\{\mathbf{x},\mathbf{y},\mathbf{z}\}$ (that span is only $3$-dimensional), so some $\mathbf{e}_k$ is outside it — adding that one keeps independence and reaches dimension $4$. $\;\;\textbf{5.2.10:}$ a subset of an independent set is independent — this is exactly the reasoning in 5.2.7(b), generalized. $\;\;\textbf{5.2.11:}$ if the columns $\mathbf{b}_i$ are independent and each $A\mathbf{x}_i = \mathbf{b}_i$, show the $\mathbf{x}_i$ are independent — set $\sum t_i\mathbf{x}_i = \mathbf{0}$, apply $A$, and use independence of the $\mathbf{b}_i$. $\;\;\textbf{5.2.12:}$ show $\{\mathbf{x}_1, \mathbf{x}_1+\mathbf{x}_2, \ldots, \mathbf{x}_1+\cdots+\mathbf{x}_k\}$ is independent — set a combination to zero and peel off coefficients from the last term backward.`}
              </Callout>
            </Exercise>

            {/* SUMMARY */}
            <div style={{ marginTop:'40px', padding:'24px 28px', background:'rgba(232,160,32,.08)', border:'2px solid rgba(232,160,32,.35)', borderRadius:'16px' }}>
              <div style={{ fontFamily:'var(--fm)', fontSize:'.7rem', letterSpacing:'.16em', textTransform:'uppercase', color:'#c8860a', marginBottom:'12px' }}>Summary of key points</div>
              <ul style={{ color:'var(--lec-ink2)', fontSize:'1rem', lineHeight:1.9, margin:0, paddingLeft:'22px' }}>
                <li>{String.raw`A set is `}<b>independent</b>{String.raw` if the only vanishing combination $t_1\mathbf{x}_1 + \cdots + t_k\mathbf{x}_k = \mathbf{0}$ is the trivial one (all $t_i = 0$).`}</li>
                <li>{String.raw`Independence $\Leftrightarrow$ every vector in the span has a `}<b>unique</b>{String.raw` representation (Theorem 5.2.1).`}</li>
                <li>{String.raw`$\textbf{Test:}$ set the combination to $\mathbf{0}$, solve the homogeneous system, show all coefficients are forced to zero.`}</li>
                <li>{String.raw`$\textbf{Dependent}$ = not independent = some `}<i>nontrivial</i>{String.raw` combination vanishes = a vector is redundant.`}</li>
                <li>{String.raw`For $n$ vectors in $\mathbb{R}^n$: independent $\Leftrightarrow$ spanning $\Leftrightarrow$ invertible $\Leftrightarrow \det \neq 0$ (Theorem 5.2.3). Use the determinant as a shortcut.`}</li>
                <li>{String.raw`$\textbf{Fundamental Theorem:}$ independent count $\leq$ spanning count. You can't have more independent vectors than spanning ones.`}</li>
                <li>{String.raw`A `}<b>basis</b>{String.raw` is independent `}<i>and</i>{String.raw` spanning — exactly enough, no waste, nothing missing.`}</li>
                <li>{String.raw`$\textbf{Invariance:}$ every basis of a subspace has the same size — so `}<b>dimension</b>{String.raw` $\dim U$ is well-defined as that common size.`}</li>
                <li>{String.raw`$\textbf{Recipe:}$ write the subspace as a span, trim to an independent set — that is a basis, and its size is the dimension.`}</li>
              </ul>
            </div>

            {/* CLOSING */}
            <div style={{ marginTop:'48px', padding:'28px 32px', background:'rgba(56,201,176,.08)', border:'2px solid rgba(56,201,176,.35)', borderRadius:'16px' }}>
              <div style={{ fontFamily:'var(--fm)', fontSize:'.7rem', letterSpacing:'.16em', textTransform:'uppercase', color:'#2a9d8f', marginBottom:'12px' }}>Looking ahead</div>
              <p style={{ fontFamily:'var(--fh)', fontSize:'1.4rem', color:'var(--lec-ink)', margin:'0 0 16px', fontWeight:400, lineHeight:1.3 }}>
                Independence removes waste; a basis is the perfect spanning set; dimension counts what remains.
              </p>
              <p style={{ color:'var(--lec-ink2)', fontSize:'.97rem', lineHeight:1.8, margin:0 }}>
                {String.raw`With dimension in hand, a whole toolkit opens up. Next we connect these ideas to matrices directly through `}<b>rank</b>{String.raw` — the dimension of the column space — and see how the dimensions of a matrix's null space and image are locked together by the elegant Rank–Nullity Theorem. The single number you learned to compute today turns out to govern the entire behaviour of linear systems.`}
              </p>
            </div>

            <div style={{ marginTop:'64px', paddingTop:'28px', borderTop:'2px solid var(--lec-border)', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'12px' }}>
              <div style={{ fontFamily:'var(--fm)', fontSize:'.76rem', color:'var(--lec-ink3)', fontStyle:'italic' }}>Lecture 15 — complete</div>
              <div style={{ fontFamily:'var(--fm)', fontSize:'.76rem', color:'var(--lec-ink3)' }}>MATH-120 · Shoaib Khan · LUMS · July 2026</div>
            </div>
          </div>

          {/* FOOTER NAV */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'22px 48px', borderTop:'1px solid var(--lec-border)', background:'var(--lec-paper)', flexWrap:'wrap', gap:'12px' }}>
            <Link href={PREV_HREF} style={{ fontFamily:'var(--fm)', fontSize:'.74rem', letterSpacing:'.08em', textTransform:'uppercase', color:'var(--lec-accent)', textDecoration:'none' }}>← Lecture 14</Link>
            <Link href={NEXT_HREF} style={{ fontFamily:'var(--fm)', fontSize:'.74rem', letterSpacing:'.08em', textTransform:'uppercase', color:'var(--lec-accent)', textDecoration:'none' }}>Lecture 16 →</Link>
          </div>
        </main>
      </div>

      <Footer/>
    </>
  );
}