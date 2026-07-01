'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import Navbar from '../../../../components/Navbar';
import Footer from '../../../../components/Footer';

/* ════════════════════════════════════════════════════════════
   MATH-120 · LECTURE 12
   Diagonalization, Similarity, Cayley–Hamilton & Linear Dynamical Systems — §3.3
   Route: /courses/linalg/w4/lec12
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
  { week: 3, n: 11, slug: 'w3/lec11', title: 'Eigenvalues & Eigenvectors', live: true },
  { week: 4, n: 12, slug: 'w4/lec12', title: 'Diagonalization & Dynamical Systems', live: true },
];
const THIS_SLUG = 'w4/lec12';
const PREV_HREF  = '/courses/linalg/w3/lec11';
const NEXT_HREF  = '/courses/linalg/w4/lec13';

const LEC = {
  course: 'MATH-120 · Linear Algebra',
  number: 'Lecture 12',
  title: 'Diagonalization and Dynamical Systems',
  subtitle: 'Splitting a matrix into P·D·P⁻¹, similar matrices, the Cayley–Hamilton theorem, and using eigenvalues to predict the long-term future',
  date: '29 June 2026',
};

const ANCHORS = [
  ['Recall', 'recall'],
  ['Why Powers', 'why'],
  ['Graph Paths', 'graph'],
  ['Diagonal Matrices', 'diag'],
  ['Diagonalizing', 'diagonalize'],
  ['When Possible?', 'when'],
  ['Examples', 'examples'],
  ['Powers Aⁿ', 'powers'],
  ['Similar Matrices', 'similar'],
  ['Invariants', 'invariants'],
  ['Cayley–Hamilton', 'cayley'],
  ['Charpoly Info', 'charinfo'],
  ['λ² Question', 'lamsq'],
  ['Dynamical Systems', 'dynamical'],
  ['Trajectories', 'trajectories'],
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

/* ═══════════════ GRAPH PATH-COUNTING FIGURE ═══════════════ */
function GraphPathFigure() {
  // Vertices 1,2,3,4; undirected edges 1-2, 1-3, 2-3, 3-4
  const nodes = {1:[90,60], 2:[240,60], 3:[165,175], 4:[300,175]};
  const edges = [[1,2],[1,3],[2,3],[3,4]];
  const W=390, H=240;
  return (
    <div style={{ textAlign:'center', margin:'10px 0', overflowX:'auto' }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ maxWidth:'100%', height:'auto', background:'#fffdf5', border:'1px solid var(--lec-border)', borderRadius:'12px' }}>
        {edges.map(([a,b],i)=>(
          <line key={i} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]} stroke="#9b80e8" strokeWidth={2.4}/>
        ))}
        {Object.entries(nodes).map(([id,[x,y]])=>(
          <g key={id}>
            <circle cx={x} cy={y} r={20} fill="#2a9d8f" stroke="#1f7a6e" strokeWidth={2}/>
            <text x={x} y={y+5} textAnchor="middle" fontFamily="var(--fm)" fontSize="15" fontWeight="700" fill="#fff">{id}</text>
          </g>
        ))}
      </svg>
      <div style={{ fontFamily:'var(--fm)', fontSize:'.72rem', color:'var(--lec-ink3)', marginTop:'8px' }}>
        A graph on 4 vertices with edges 1–2, 1–3, 2–3, 3–4.
      </div>
    </div>
  );
}

/* ═══════════════ DIAGONALIZATION + POWER CALCULATOR ═══════════════ */
function DiagCalculator() {
  const [m2, setM2] = useState([[4,2],[1,3]]);
  const [power, setPower] = useState(3);

  function setEntry(i,j,val){
    const copy = m2.map(r=>[...r]);
    copy[i][j] = (val===''||val==='-') ? val : (isNaN(parseFloat(val))?0:parseFloat(val));
    setM2(copy);
  }
  const A = m2.map(r=>r.map(e=> (e===''||e==='-') ? 0 : Number(e)));

  // 2x2 eigen
  const [[a,b],[c,d]]=A;
  const tr=a+d, det=a*d-b*c, disc=tr*tr-4*det;
  let out;
  if(disc < -1e-9){
    out={ diagonalizable:false, reason:'Complex eigenvalues — not diagonalizable over the real numbers.' };
  } else {
    const s=Math.sqrt(Math.max(disc,0));
    const l1=(tr+s)/2, l2=(tr-s)/2;
    const repeated = Math.abs(l1-l2)<1e-7;
    const ev=(l)=>{ let vx=b,vy=l-a; if(Math.abs(vx)<1e-9&&Math.abs(vy)<1e-9){vx=l-d;vy=c;} if(Math.abs(vx)<1e-9&&Math.abs(vy)<1e-9){vx=1;vy=0;} return [vx,vy]; };
    if(repeated){
      // check if A is already scalar (a multiple of I) -> diagonalizable, else defective
      const scalar = Math.abs(b)<1e-9 && Math.abs(c)<1e-9 && Math.abs(a-d)<1e-9;
      out = scalar
        ? { diagonalizable:true, scalar:true, l1, l2, v1:[1,0], v2:[0,1] }
        : { diagonalizable:false, reason:`Repeated eigenvalue λ = ${fmtNum(l1)} but only one eigen-direction (multiplicity 2, one parameter). Not diagonalizable.` };
    } else {
      out = { diagonalizable:true, l1, l2, v1:ev(l1), v2:ev(l2) };
    }
  }

  function fmtNum(x){ return Math.abs(x-Math.round(x))<1e-4 ? String(Math.round(x)) : x.toFixed(3); }
  function scaleVec(v){ const mx=Math.max(Math.abs(v[0]),Math.abs(v[1]))||1; return [v[0]/mx, v[1]/mx].map(fmtNum); }

  // A^power via P D^power P^-1 when diagonalizable
  let Apow=null;
  if(out.diagonalizable && out.v1 && out.v2){
    const P=[[out.v1[0],out.v2[0]],[out.v1[1],out.v2[1]]];
    const dtp=P[0][0]*P[1][1]-P[0][1]*P[1][0];
    if(Math.abs(dtp)>1e-9){
      const Pinv=[[P[1][1]/dtp,-P[0][1]/dtp],[-P[1][0]/dtp,P[0][0]/dtp]];
      const Dp=[[Math.pow(out.l1,power),0],[0,Math.pow(out.l2,power)]];
      const mul=(X,Y)=>[[X[0][0]*Y[0][0]+X[0][1]*Y[1][0], X[0][0]*Y[0][1]+X[0][1]*Y[1][1]],
                        [X[1][0]*Y[0][0]+X[1][1]*Y[1][0], X[1][0]*Y[0][1]+X[1][1]*Y[1][1]]];
      Apow=mul(mul(P,Dp),Pinv);
    }
  }

  const inputStyle={ width:'54px', textAlign:'center', fontFamily:'var(--fm)', fontSize:'.9rem', padding:'6px 4px', borderRadius:'6px', border:'1px solid rgba(180,190,230,.35)', background:'#1c1c38', color:'#e8ecff' };
  const cellStyle={ fontFamily:'var(--fm)', fontSize:'.86rem', padding:'6px 12px', color:'#c4cae8', textAlign:'center' };

  return (
    <div style={{ background:'#1a1a2e', border:'1px solid rgba(120,130,180,.3)', borderRadius:'16px', padding:'22px 24px', margin:'26px 0', color:'#e8ecff' }}>
      <div style={{ fontFamily:'var(--fm)', fontSize:'.72rem', letterSpacing:'.16em', textTransform:'uppercase', color:'#8fd9cc', marginBottom:'16px' }}>🎛 Diagonalize &amp; Power Calculator (2×2)</div>
      <div style={{ display:'flex', flexWrap:'wrap', gap:'26px', alignItems:'flex-start' }}>
        <div>
          <div style={{ fontFamily:'var(--fm)', fontSize:'.66rem', color:'#8892b8', marginBottom:'8px', letterSpacing:'.1em' }}>ENTER MATRIX A</div>
          <div style={{ display:'inline-flex', alignItems:'center', gap:'10px' }}>
            <span style={{ fontSize:'2.4rem', color:'#6672a0' }}>[</span>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(2, auto)', gap:'6px' }}>
              {m2.map((row,i)=>row.map((val,j)=>(
                <input key={`${i}-${j}`} value={val} onChange={e=>setEntry(i,j,e.target.value)} style={inputStyle}/>
              )))}
            </div>
            <span style={{ fontSize:'2.4rem', color:'#6672a0' }}>]</span>
          </div>
          <div style={{ marginTop:'16px', fontFamily:'var(--fm)', fontSize:'.66rem', color:'#8892b8', letterSpacing:'.1em' }}>POWER n</div>
          <input type="range" min="1" max="12" value={power} onChange={e=>setPower(parseInt(e.target.value))} style={{ width:'160px', marginTop:'6px' }}/>
          <span style={{ fontFamily:'var(--fm)', marginLeft:'10px', color:'#8fd9cc' }}>n = {power}</span>
        </div>

        <div style={{ flex:1, minWidth:'240px' }}>
          {!out.diagonalizable && <div style={{ color:'#e8a020', fontSize:'.9rem', lineHeight:1.6 }}>{out.reason}</div>}
          {out.diagonalizable && (
            <>
              <div style={{ background:'#22223e', borderRadius:'10px', padding:'12px 14px', marginBottom:'10px', borderLeft:'3px solid #38c9b0' }}>
                <div style={{ fontFamily:'var(--fm)', fontSize:'.82rem', color:'#8fd9cc' }}>Diagonalizable ✓</div>
                <div style={{ fontFamily:'var(--fm)', fontSize:'.82rem', color:'#c4cae8', marginTop:'6px' }}>
                  λ₁ = {fmtNum(out.l1)}, eigenvector ({scaleVec(out.v1).join(', ')})<br/>
                  λ₂ = {fmtNum(out.l2)}, eigenvector ({scaleVec(out.v2).join(', ')})
                </div>
                <div style={{ fontFamily:'var(--fm)', fontSize:'.78rem', color:'#9aa2c8', marginTop:'8px' }}>
                  D = diag({fmtNum(out.l1)}, {fmtNum(out.l2)})
                </div>
              </div>
              {Apow && (
                <div style={{ background:'#22223e', borderRadius:'10px', padding:'12px 14px', borderLeft:'3px solid #9b80e8' }}>
                  <div style={{ fontFamily:'var(--fm)', fontSize:'.78rem', color:'#b9a8f0', marginBottom:'6px' }}>A^{power} = P · D^{power} · P⁻¹ =</div>
                  <table style={{ borderCollapse:'collapse', margin:'0 auto' }}>
                    <tbody>
                      <tr><td style={cellStyle}>{fmtNum(Apow[0][0])}</td><td style={cellStyle}>{fmtNum(Apow[0][1])}</td></tr>
                      <tr><td style={cellStyle}>{fmtNum(Apow[1][0])}</td><td style={cellStyle}>{fmtNum(Apow[1][1])}</td></tr>
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
          <div style={{ fontFamily:'var(--fm)', fontSize:'.64rem', color:'#7079a0', marginTop:'8px', lineHeight:1.6 }}>
            Numerical values — verify by hand. Try [[4,2],[1,3]] (clean), [[1,1],[0,1]] (defective), [[2,0],[0,2]] (scalar).
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════ DYNAMICAL SYSTEM TRAJECTORY PLOTTER ═══════════════ */
function TrajectoryPlotter() {
  const presets = {
    attractor: { A:[[0.5,0],[0,0.34]], label:'Attractor (both |λ|<1)' },
    repellor:  { A:[[1.5,0],[0,1.34]], label:'Repellor (both |λ|>1)' },
    saddle:    { A:[[1,-0.5],[-0.5,1]], label:'Saddle (one |λ|>1, one <1)' },
    spiral:    { A:[[0,0.5],[-0.5,0]], label:'Spiral (complex λ)' },
  };
  const [key,setKey]=useState('attractor');
  const canvasRef=useRef(null);
  const A=presets[key].A;

  useEffect(()=>{
    const cv=canvasRef.current; if(!cv) return;
    const ctx=cv.getContext('2d');
    const W=cv.width,H=cv.height,cx=W/2,cy=H/2,s=70;
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle='#12122a'; ctx.fillRect(0,0,W,H);
    ctx.strokeStyle='rgba(120,130,180,.15)'; ctx.lineWidth=1;
    for(let i=-6;i<=6;i++){ ctx.beginPath();ctx.moveTo(cx+i*s,0);ctx.lineTo(cx+i*s,H);ctx.stroke();
      ctx.beginPath();ctx.moveTo(0,cy+i*s);ctx.lineTo(W,cy+i*s);ctx.stroke(); }
    ctx.strokeStyle='rgba(180,190,230,.5)';ctx.lineWidth=1.4;
    ctx.beginPath();ctx.moveTo(cx,0);ctx.lineTo(cx,H);ctx.stroke();
    ctx.beginPath();ctx.moveTo(0,cy);ctx.lineTo(W,cy);ctx.stroke();
    const starts=[[1,1],[-1,1],[1,-1],[-1,-1],[1.4,0.2],[-0.2,1.4]];
    const cols=['#38c9b0','#e8a020','#9b80e8','#e06b6b','#4fa8e8','#e070c0'];
    starts.forEach((v0,idx)=>{
      let v=[...v0]; const pts=[];
      for(let k=0;k<26;k++){ pts.push([...v]); v=[A[0][0]*v[0]+A[0][1]*v[1], A[1][0]*v[0]+A[1][1]*v[1]]; }
      ctx.strokeStyle=cols[idx]; ctx.lineWidth=1.6; ctx.beginPath();
      pts.forEach((p,i)=>{ const X=cx+p[0]*s,Y=cy-p[1]*s; i?ctx.lineTo(X,Y):ctx.moveTo(X,Y); });
      ctx.stroke();
      pts.forEach(p=>{ const X=cx+p[0]*s,Y=cy-p[1]*s; if(X>=0&&X<=W&&Y>=0&&Y<=H){ ctx.fillStyle=cols[idx]; ctx.beginPath();ctx.arc(X,Y,2.4,0,7);ctx.fill(); } });
    });
    ctx.fillStyle='#fff'; ctx.beginPath();ctx.arc(cx,cy,3.5,0,7);ctx.fill();
  },[key]);

  return (
    <div style={{ background:'#1a1a2e', border:'1px solid rgba(120,130,180,.3)', borderRadius:'16px', padding:'22px 24px', margin:'26px 0', color:'#e8ecff' }}>
      <div style={{ fontFamily:'var(--fm)', fontSize:'.72rem', letterSpacing:'.16em', textTransform:'uppercase', color:'#8fd9cc', marginBottom:'14px' }}>🎛 Trajectory Plotter — vₖ₊₁ = Avₖ</div>
      <div style={{ display:'flex', gap:'6px', flexWrap:'wrap', marginBottom:'14px' }}>
        {Object.entries(presets).map(([k,p])=>(
          <button key={k} onClick={()=>setKey(k)} style={{
            fontFamily:'var(--fm)', fontSize:'.68rem', padding:'6px 12px', borderRadius:'20px', cursor:'pointer',
            border:'1px solid '+(key===k?'#38c9b0':'rgba(180,190,230,.3)'),
            background: key===k?'rgba(56,201,176,.2)':'transparent', color: key===k?'#8fd9cc':'#aab', fontWeight:600,
          }}>{p.label}</button>
        ))}
      </div>
      <canvas ref={canvasRef} width={420} height={340} style={{ display:'block', margin:'0 auto', borderRadius:'12px', maxWidth:'100%' }}/>
      <div style={{ fontFamily:'var(--fm)', fontSize:'.66rem', color:'#8892b8', marginTop:'8px', textAlign:'center' }}>
        Each coloured path is a trajectory from a different starting point v₀. White dot = origin.
      </div>
    </div>
  );
}

/* ═══════════════ PAGE ═══════════════ */
export default function Lec12() {
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
        <span style={{color:'var(--text2)'}}>Week 4 · Lecture 12</span>
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
            <Link href={PREV_HREF} style={{ display:'flex', alignItems:'center', padding:'0 16px', height:'100%', fontFamily:'var(--fm)', fontSize:'.72rem', color:'var(--lec-ink3)', borderRight:'1px solid var(--lec-border)', whiteSpace:'nowrap', flexShrink:0, textDecoration:'none' }}>← Lecture 11</Link>
            <div style={{ flex:1, display:'flex', justifyContent:'center', alignItems:'center', gap:'4px', overflowX:'auto', padding:'0 8px' }}>
              <span style={{ fontFamily:'var(--fm)', fontSize:'.6rem', letterSpacing:'.12em', textTransform:'uppercase', color:'var(--lec-accent)', flexShrink:0, marginRight:'6px' }}>On this page</span>
              {ANCHORS.map(([label,id],i)=>(
                <span key={id} style={{display:'inline-flex',alignItems:'center',flexShrink:0}}>
                  {i>0&&<span style={{color:'var(--lec-border)',margin:'0 7px'}}>·</span>}
                  <a href={`#${id}`} onClick={e=>jump(e,id)} style={{fontFamily:'var(--fm)',fontSize:'.73rem',color:'var(--lec-ink2)',textDecoration:'none',whiteSpace:'nowrap'}}>{label}</a>
                </span>
              ))}
            </div>
            <Link href={NEXT_HREF} style={{ display:'flex', alignItems:'center', padding:'0 16px', height:'100%', fontFamily:'var(--fm)', fontSize:'.72rem', color:'var(--lec-ink3)', borderLeft:'1px solid var(--lec-border)', whiteSpace:'nowrap', flexShrink:0, textDecoration:'none' }}>Lecture 13 →</Link>
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

            <p>In Lecture 11 we learned to find the special directions of a matrix. Two ideas from there are the foundation of everything today.</p>
            <p style={{margin:'4px 0'}}>{String.raw`• A number $\lambda$ and a nonzero vector $\mathbf{x}$ form an `}<b>eigenvalue–eigenvector pair</b>{String.raw` of $A$ when $A\mathbf{x} = \lambda\mathbf{x}$: the matrix only stretches $\mathbf{x}$, it does not turn it.`}</p>
            <p style={{margin:'4px 0'}}>{String.raw`• We find eigenvalues as the roots of the `}<b>characteristic polynomial</b>{String.raw` $c_A(x) = \det(xI - A)$, and eigenvectors as the nonzero solutions of $(\lambda I - A)\mathbf{x} = \mathbf{0}$.`}</p>

            <Callout icon="🎯" title="The goal of this lecture" color="teal">
              {String.raw`Eigenvectors let us `}<b>rebuild a matrix in a simpler form</b>{String.raw`. If we line up the eigenvectors as columns of a matrix $P$, then $P^{-1}AP$ becomes a `}<i>diagonal</i>{String.raw` matrix — the simplest kind there is. This single move makes hard problems (like computing $A^{100}$ or predicting the far future of a population) almost trivial.`}
            </Callout>

            {/* ─── §2 WHY POWERS ─── */}
            <Sec id="why" n="§2">The Motivation: Why We Care About Powers of a Matrix</Sec>

            <p>{String.raw`Here is a problem that looks impossible by hand. Suppose $A$ is a $2\times2$ matrix and you need $A^{50}$. Multiplying $A$ by itself fifty times is hopeless — the numbers explode and the arithmetic is enormous. Yet powers of matrices appear everywhere:`}</p>
            <p style={{margin:'4px 0'}}>{String.raw`• `}<b>Populations over time.</b>{String.raw` If a population this year is $\mathbf{v}_0$ and next year is $A\mathbf{v}_0$, then in $k$ years it is $A^k\mathbf{v}_0$. To predict the far future you need high powers of $A$.`}</p>
            <p style={{margin:'4px 0'}}>{String.raw`• `}<b>Counting paths in a network.</b>{String.raw` As we are about to see, $A^k$ literally counts the number of routes of length $k$ between points in a graph.`}</p>
            <p style={{margin:'4px 0'}}>{String.raw`• `}<b>Google, Markov chains, random walks.</b>{String.raw` All are questions about $A^k$ for large $k$.`}</p>

            <p>{String.raw`Diagonalization is the trick that makes $A^k$ easy. The reason is a small miracle: powers of a `}<i>diagonal</i>{String.raw` matrix are trivial. That is where we start.`}</p>

            {/* ─── §3 GRAPH PATHS ─── */}
            <Sec id="graph" n="§3">A Concrete Reason: Counting Paths in a Graph</Sec>

            <p>Consider a small network of four locations. We draw a dot (vertex) for each location and a line (edge) between two locations if you can travel directly between them.</p>

            <GraphPathFigure/>

            <p>{String.raw`We record this network in an `}<b>adjacency matrix</b>{String.raw` $A$, where the entry in row $i$, column $j$ is $1$ if there is an edge between vertex $i$ and vertex $j$, and $0$ otherwise. For the graph above:`}</p>

            <p style={{textAlign:'center'}}>{String.raw`$$A = \begin{bmatrix} 0 & 1 & 1 & 0 \\ 1 & 0 & 1 & 0 \\ 1 & 1 & 0 & 1 \\ 0 & 0 & 1 & 0 \end{bmatrix}.$$`}</p>

            <p>{String.raw`(Row 1 has $1$s in columns 2 and 3 because vertex 1 connects to vertices 2 and 3, and so on. The matrix is symmetric because the edges have no direction.)`}</p>

            <DefBox term="The path-counting theorem" color="violet">
              <p style={{margin:0}}>{String.raw`The $(i,j)$-entry of $A^k$ is exactly the `}<b>number of walks of length $k$</b>{String.raw` from vertex $i$ to vertex $j$ (a walk of length $k$ is a sequence of $k$ edges, steps allowed to repeat).`}</p>
            </DefBox>

            <p>{String.raw`$\textbf{Why this is true (the key idea).}$ Look at $A^2$. Its $(i,j)$-entry is $\sum_m A_{im}A_{mj}$. The term $A_{im}A_{mj}$ equals $1$ exactly when there is an edge $i\to m$ `}<i>and</i>{String.raw` an edge $m\to j$ — that is, one walk $i\to m\to j$ of length $2$. Summing over all middle vertices $m$ counts every length-2 walk. The same bookkeeping repeats for $A^3$, $A^4$, and beyond.`}</p>

            <p>{String.raw`Computing the powers gives:`}</p>
            <p style={{textAlign:'center'}}>{String.raw`$$A^2 = \begin{bmatrix} 2 & 1 & 1 & 1 \\ 1 & 2 & 1 & 1 \\ 1 & 1 & 3 & 0 \\ 1 & 1 & 0 & 1 \end{bmatrix}, \qquad A^3 = \begin{bmatrix} 2 & 3 & 4 & 1 \\ 3 & 2 & 4 & 1 \\ 4 & 4 & 2 & 3 \\ 1 & 1 & 3 & 0 \end{bmatrix}.$$`}</p>

            <p>{String.raw`Reading off: the $(1,1)$-entry of $A^2$ is $2$, so there are two walks of length 2 from vertex 1 back to itself ($1\to2\to1$ and $1\to3\to1$). The $(3,3)$-entry is $3$: three length-2 loops at vertex 3 (via $1$, via $2$, via $4$). And $A^3_{13} = 4$ says there are four length-3 walks from vertex 1 to vertex 3.`}</p>

            <Callout icon="💡" title="The punchline" color="amber">
              {String.raw`To answer "how many routes of length 100 connect these two cities?" you need $A^{100}$. Diagonalization is how you compute such a power without doing 100 matrix multiplications.`}
            </Callout>

            {/* ─── §4 DIAGONAL MATRICES ─── */}
            <Sec id="diag" n="§4">Why Diagonal Matrices Are So Easy</Sec>

            <DefBox term="Diagonal matrix" color="teal">
              <p style={{margin:'0 0 8px'}}>{String.raw`A square matrix $D$ is `}<b>diagonal</b>{String.raw` if every entry off the main diagonal is zero. We write`}</p>
              <p style={{textAlign:'center', margin:'6px 0'}}>{String.raw`$$D = \operatorname{diag}(\lambda_1, \lambda_2, \ldots, \lambda_n) = \begin{bmatrix} \lambda_1 & 0 & \cdots & 0 \\ 0 & \lambda_2 & \cdots & 0 \\ \vdots & \vdots & \ddots & \vdots \\ 0 & 0 & \cdots & \lambda_n \end{bmatrix}.$$`}</p>
            </DefBox>

            <p>{String.raw`Diagonal matrices multiply and add entry-by-entry down the diagonal. If $D = \operatorname{diag}(\lambda_1,\ldots,\lambda_n)$ and $E = \operatorname{diag}(\mu_1,\ldots,\mu_n)$, then`}</p>
            <p style={{textAlign:'center'}}>{String.raw`$$DE = \operatorname{diag}(\lambda_1\mu_1, \ldots, \lambda_n\mu_n), \qquad D + E = \operatorname{diag}(\lambda_1+\mu_1, \ldots, \lambda_n+\mu_n).$$`}</p>

            <p>{String.raw`The consequence we care about most: `}<b>powers are effortless.</b>{String.raw` Multiplying $D$ by itself just raises each diagonal entry to that power:`}</p>
            <p style={{textAlign:'center'}}>{String.raw`$$D^k = \operatorname{diag}(\lambda_1^k, \lambda_2^k, \ldots, \lambda_n^k).$$`}</p>

            <p>{String.raw`So $\operatorname{diag}(2,3)^{10} = \operatorname{diag}(2^{10}, 3^{10}) = \operatorname{diag}(1024, 59049)$ — no matrix multiplication at all. If only every matrix were diagonal. Diagonalization is the art of `}<i>making</i>{String.raw` a matrix diagonal by changing coordinates.`}</p>

            {/* ─── §5 DIAGONALIZING ─── */}
            <Sec id="diagonalize" n="§5">What Diagonalization Means</Sec>

            <DefBox term="Diagonalizable matrix" color="violet">
              <p style={{margin:0}}>{String.raw`An $n\times n$ matrix $A$ is `}<b>diagonalizable</b>{String.raw` if there is an invertible matrix $P$ such that $$P^{-1}AP = D$$ is diagonal. The matrix $P$ is called a `}<b>diagonalizing matrix</b>{String.raw` for $A$. Equivalently, $A = PDP^{-1}$.`}</p>
            </DefBox>

            <p>{String.raw`So what are $P$ and $D$? This is the heart of the lecture, and the answer connects directly to Lecture 11.`}</p>

            <ThmBox title="Theorem 3.3.4 — the recipe for P and D">
              <p style={{margin:'0 0 8px'}}>{String.raw`Let $A$ be an $n\times n$ matrix.`}</p>
              <p style={{margin:'4px 0'}}>{String.raw`$\textbf{1.}$ $A$ is diagonalizable if and only if it has $n$ eigenvectors $\mathbf{x}_1, \ldots, \mathbf{x}_n$ such that the matrix $P = [\,\mathbf{x}_1 \; \mathbf{x}_2 \; \cdots \; \mathbf{x}_n\,]$ (eigenvectors as columns) is invertible.`}</p>
              <p style={{margin:'4px 0'}}>{String.raw`$\textbf{2.}$ In that case $P^{-1}AP = \operatorname{diag}(\lambda_1, \ldots, \lambda_n)$, where $\lambda_i$ is the eigenvalue belonging to the eigenvector $\mathbf{x}_i$.`}</p>
            </ThmBox>

            <Callout icon="🧩" title="In one sentence" color="teal">
              {String.raw`$P$ is the matrix whose `}<b>columns are the eigenvectors</b>{String.raw`, and $D$ is the diagonal matrix whose `}<b>diagonal entries are the matching eigenvalues</b>{String.raw`, `}<i>in the same order</i>{String.raw`.`}
            </Callout>

            <p>{String.raw`$\textbf{Why the recipe works.}$ Saying $P^{-1}AP = D$ is the same as saying $AP = PD$. Write $P = [\mathbf{x}_1 \cdots \mathbf{x}_n]$ by columns. The left side $AP$ has columns $A\mathbf{x}_1, \ldots, A\mathbf{x}_n$. The right side $PD$, with $D = \operatorname{diag}(\lambda_1,\ldots,\lambda_n)$, has columns $\lambda_1\mathbf{x}_1, \ldots, \lambda_n\mathbf{x}_n$. Matching columns gives`}</p>
            <p style={{textAlign:'center'}}>{String.raw`$$A\mathbf{x}_i = \lambda_i\mathbf{x}_i \quad \text{for each } i.$$`}</p>
            <p>{String.raw`That is exactly the eigenvalue equation. So $P^{-1}AP$ is diagonal precisely when the columns of $P$ are eigenvectors and the diagonal of $D$ holds their eigenvalues.`}</p>

            <p><b>The concrete 3×3 picture.</b> {String.raw`If $A$ is $3\times3$ with eigenvalues $\lambda_1, \lambda_2, \lambda_3$ and corresponding eigenvectors $\mathbf{v}_1, \mathbf{v}_2, \mathbf{v}_3$, then`}</p>
            <p style={{textAlign:'center'}}>{String.raw`$$P = \big[\,\mathbf{v}_1 \; \mathbf{v}_2 \; \mathbf{v}_3\,\big], \qquad D = \begin{bmatrix} \lambda_1 & 0 & 0 \\ 0 & \lambda_2 & 0 \\ 0 & 0 & \lambda_3 \end{bmatrix}.$$`}</p>

            <Callout icon="🔀" title="The order is your choice" color="violet">
              {String.raw`If you reorder the eigenvector columns of $P$, the eigenvalues on the diagonal of $D$ reorder to match. Putting $\mathbf{v}_2$ first gives $\lambda_2$ in the top-left slot. So you can arrange the eigenvalues along $D$ in `}<i>any</i>{String.raw` order you like — just keep each eigenvector paired with its own eigenvalue.`}
            </Callout>

            <RedBox title="The repeated-eigenvalue case">
              <p style={{margin:0}}>{String.raw`When an eigenvalue repeats, the recipe still works — `}<i>if</i>{String.raw` that eigenvalue supplies enough independent eigenvectors. A twice-repeated eigenvalue needs `}<b>two</b>{String.raw` independent eigenvectors (a whole plane of them) to fill two columns of $P$. If it only gives one, $P$ has too few columns to be invertible, and $A$ is `}<b>not</b>{String.raw` diagonalizable. We make this precise next.`}</p>
            </RedBox>

            {/* ─── §6 WHEN POSSIBLE ─── */}
            <Sec id="when" n="§6">How to Tell If a Matrix Is Diagonalizable</Sec>

            <p>This is the first key question. There are three checkpoints, from quickest to most careful.</p>

            <DefBox term="Multiplicity" color="amber">
              <p style={{margin:0}}>{String.raw`An eigenvalue $\lambda$ has `}<b>multiplicity $m$</b>{String.raw` if it occurs $m$ times as a root of the characteristic polynomial. For instance, $c_A(x) = (x-2)(x+1)^2$ has $\lambda = 2$ with multiplicity 1 and $\lambda = -1$ with multiplicity 2.`}</p>
            </DefBox>

            <ThmBox title="The three tests for diagonalizability">
              <p style={{margin:'4px 0'}}>{String.raw`$\textbf{Test 1 (definition).}$ $A$ is diagonalizable if there exist an invertible $P$ and diagonal $D$ with $A = PDP^{-1}$.`}</p>
              <p style={{margin:'4px 0'}}>{String.raw`$\textbf{Test 2 (distinct eigenvalues — the easy win).}$ If an $n\times n$ matrix has $n$ `}<b>distinct</b>{String.raw` eigenvalues, it is automatically diagonalizable (Theorem 3.3.6). Distinct eigenvalues always give independent eigenvectors.`}</p>
              <p style={{margin:'4px 0'}}>{String.raw`$\textbf{Test 3 (the general rule — Theorem 3.3.5).}$ $A$ is diagonalizable if and only if `}<b>every</b>{String.raw` eigenvalue of multiplicity $m$ produces exactly $m$ basic eigenvectors — that is, the solution of $(\lambda I - A)\mathbf{x} = \mathbf{0}$ has exactly $m$ free parameters.`}</p>
            </ThmBox>

            <ThmBox title="Diagonalization Algorithm">
              <p style={{margin:'4px 0'}}>{String.raw`$\textbf{Step 1.}$ Find the distinct eigenvalues of $A$ (roots of $c_A(x)$).`}</p>
              <p style={{margin:'4px 0'}}>{String.raw`$\textbf{Step 2.}$ For each eigenvalue, find its basic eigenvectors as basic solutions of $(\lambda I - A)\mathbf{x} = \mathbf{0}$.`}</p>
              <p style={{margin:'4px 0'}}>{String.raw`$\textbf{Step 3.}$ $A$ is diagonalizable if and only if there are $n$ basic eigenvectors in total.`}</p>
              <p style={{margin:'4px 0'}}>{String.raw`$\textbf{Step 4.}$ If so, put those eigenvectors as columns of $P$; then $P$ is invertible and $P^{-1}AP$ is diagonal with the matching eigenvalues.`}</p>
            </ThmBox>

            <Callout icon="📝" title="A common trap" color="rose">
              {String.raw`"$n$ distinct eigenvalues" is `}<i>sufficient</i>{String.raw` but not `}<i>necessary</i>{String.raw`. A matrix with repeated eigenvalues can still be diagonalizable — it just has to pass Test 3. Example 2 below shows exactly this: a repeated eigenvalue that supplies its full quota of eigenvectors.`}
            </Callout>

            {/* ─── §7 EXAMPLES ─── */}
            <Sec id="examples" n="§7">Worked Examples: Every Scenario</Sec>

            <Example n="1" title="Distinct eigenvalues — the clean case" advanced>
              <p>{String.raw`Diagonalize $A = \begin{bmatrix} 2 & 0 & 0 \\ 1 & 2 & -1 \\ 1 & 3 & -2 \end{bmatrix}$ (the matrix from Lecture 11, Example 4).`}</p>
              <Reveal label="Show full solution">
                <p style={{margin:'0 0 8px'}}>{String.raw`From Lecture 11 we found the eigenvalues $\lambda_1 = 2$, $\lambda_2 = 1$, $\lambda_3 = -1$ (all distinct — Test 2 already guarantees diagonalizability), with basic eigenvectors`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$\mathbf{x}_1 = \begin{bmatrix} 1\\1\\1 \end{bmatrix}, \quad \mathbf{x}_2 = \begin{bmatrix} 0\\1\\1 \end{bmatrix}, \quad \mathbf{x}_3 = \begin{bmatrix} 0\\1\\3 \end{bmatrix}.$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`Assemble $P$ with these as columns and $D$ with the matching eigenvalues:`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$P = \begin{bmatrix} 1 & 0 & 0 \\ 1 & 1 & 1 \\ 1 & 1 & 3 \end{bmatrix}, \qquad P^{-1}AP = D = \begin{bmatrix} 2 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & -1 \end{bmatrix}.$$`}</p>
                <p style={{margin:0}}>{String.raw`$P$ is invertible (its columns are independent), so Theorem 3.3.4 confirms the diagonalization. To check without inverting $P$, verify the easier equation $AP = PD$ directly.`}</p>
              </Reveal>
            </Example>

            <Example n="2" title="Repeated eigenvalue — still diagonalizable" advanced>
              <p>{String.raw`Diagonalize $A = \begin{bmatrix} 0 & 1 & 1 \\ 1 & 0 & 1 \\ 1 & 1 & 0 \end{bmatrix}$.`}</p>
              <Reveal label="Show full solution">
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Characteristic polynomial.}$ A slick way: add rows 2 and 3 of $xI - A$ to row 1, which makes row 1 equal to $(x-2, x-2, x-2)$; factor out $(x-2)$ and simplify:`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$c_A(x) = \det\begin{bmatrix} x & -1 & -1 \\ -1 & x & -1 \\ -1 & -1 & x \end{bmatrix} = (x-2)(x+1)^2.$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`So $\lambda_1 = 2$ (multiplicity 1) and $\lambda_2 = -1$ (multiplicity 2).`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Eigenvector for $\lambda_1 = 2$.}$ Solving $(2I - A)\mathbf{x} = \mathbf{0}$ gives the single basic eigenvector $\mathbf{x}_1 = \begin{bmatrix} 1\\1\\1 \end{bmatrix}$.`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Eigenvectors for $\lambda_2 = -1$.}$ Solving $(-I - A)\mathbf{x} = \mathbf{0}$: the single equation reduces to $x_1 + x_2 + x_3 = 0$, giving a `}<i>two-parameter</i>{String.raw` family. Two basic eigenvectors are`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$\mathbf{x}_2 = \begin{bmatrix} -1\\1\\0 \end{bmatrix}, \qquad \mathbf{y}_2 = \begin{bmatrix} -1\\0\\1 \end{bmatrix}.$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Diagonalizable?}$ Multiplicity 2 gave exactly 2 basic eigenvectors, so Test 3 passes. Total basic eigenvectors $= 3 = n$. Set`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$P = \begin{bmatrix} 1 & -1 & -1 \\ 1 & 1 & 0 \\ 1 & 0 & 1 \end{bmatrix}, \qquad P^{-1}AP = \operatorname{diag}(2, -1, -1).$$`}</p>
                <p style={{margin:0}}>{String.raw`The lesson: a repeated eigenvalue is fine `}<i>as long as it delivers its full quota</i>{String.raw` of independent eigenvectors.`}</p>
              </Reveal>
            </Example>

            <Example n="3" title="Repeated eigenvalue — NOT diagonalizable" advanced>
              <p>{String.raw`Show that $A = \begin{bmatrix} 1 & 1 \\ 0 & 1 \end{bmatrix}$ is not diagonalizable.`}</p>
              <Reveal label="Show full solution">
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Characteristic polynomial.}$ $c_A(x) = (x-1)^2$, so the only eigenvalue is $\lambda = 1$ with multiplicity 2.`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Eigenvectors.}$ Solve $(1\cdot I - A)\mathbf{x} = \mathbf{0}$, i.e. $\begin{bmatrix} 0 & -1 \\ 0 & 0 \end{bmatrix}\mathbf{x} = \mathbf{0}$. This forces $x_2 = 0$ with $x_1$ free — a `}<i>one</i>{String.raw`-parameter family. The only basic eigenvector is $\begin{bmatrix} 1\\0 \end{bmatrix}$.`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Verdict.}$ Multiplicity is 2 but we get only 1 basic eigenvector. Test 3 fails, so $A$ is `}<b>not diagonalizable</b>{String.raw`.`}</p>
                <p style={{margin:0}}>{String.raw`$\textbf{A second, elegant proof.}$ If $A$ were diagonalizable, then since its only eigenvalue is $1$, we would have $P^{-1}AP = I$, giving $A = PIP^{-1} = I$. But $A \neq I$. Contradiction — so $A$ cannot be diagonalized. $\;\blacksquare$`}</p>
              </Reveal>
            </Example>

            <SubH>Try it yourself</SubH>
            <p>{String.raw`Enter a $2\times2$ matrix below. The tool tells you whether it is diagonalizable, gives $P$ and $D$, and computes $A^n$ for you. Test the three scenarios: $\begin{bmatrix} 4&2\\1&3 \end{bmatrix}$ (distinct), $\begin{bmatrix} 2&0\\0&2 \end{bmatrix}$ (repeated but scalar — diagonalizable), $\begin{bmatrix} 1&1\\0&1 \end{bmatrix}$ (defective).`}</p>

            <DiagCalculator/>

            {/* ─── §8 POWERS ─── */}
            <Sec id="powers" n="§8">The Payoff: Computing Aⁿ</Sec>

            <p>{String.raw`Here is where all the setup pays for itself. If $A = PDP^{-1}$, then squaring telescopes beautifully:`}</p>
            <p style={{textAlign:'center'}}>{String.raw`$$A^2 = (PDP^{-1})(PDP^{-1}) = PD\underbrace{(P^{-1}P)}_{I}DP^{-1} = PD^2P^{-1}.$$`}</p>
            <p>{String.raw`The inner $P^{-1}P$ collapses to the identity. The same cancellation repeats for every power, giving the master formula:`}</p>

            <ThmBox title="Power formula">
              <p style={{margin:0}}>{String.raw`If $A = PDP^{-1}$ with $D$ diagonal, then for every $n \geq 1$, $$A^n = PD^nP^{-1} = P\operatorname{diag}(\lambda_1^n, \ldots, \lambda_k^n)P^{-1}.$$ Computing $A^n$ costs just `}<b>two matrix multiplications</b>{String.raw`, no matter how large $n$ is — because $D^n$ is free.`}</p>
            </ThmBox>

            <Example n="4" title="Computing Aⁿ (Exercise 3.3.8a)">
              <p>{String.raw`Find $A^n$ for $A = \begin{bmatrix} 6 & -5 \\ 2 & -1 \end{bmatrix}$, using the given $P = \begin{bmatrix} 1 & 5 \\ 1 & 2 \end{bmatrix}$.`}</p>
              <Reveal label="Show full solution">
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Step 1 — diagonalize.}$ Compute $P^{-1}AP$. With $P^{-1} = \dfrac{1}{2-5}\begin{bmatrix} 2 & -5 \\ -1 & 1 \end{bmatrix} = \dfrac{1}{-3}\begin{bmatrix} 2 & -5 \\ -1 & 1 \end{bmatrix}$, one finds`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$D = P^{-1}AP = \begin{bmatrix} 1 & 0 \\ 0 & 4 \end{bmatrix}.$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`So the eigenvalues are $1$ and $4$ (the columns of $P$ are their eigenvectors).`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Step 2 — raise $D$ to the power.}$ $D^n = \operatorname{diag}(1^n, 4^n) = \operatorname{diag}(1, 4^n)$.`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Step 3 — reassemble.}$ $A^n = PD^nP^{-1}$:`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$A^n = \frac{1}{3}\begin{bmatrix} 5\cdot 4^n - 2 & 5 - 5\cdot 4^n \\ 2\cdot 4^n - 2 & 5 - 2\cdot 4^n \end{bmatrix}.$$`}</p>
                <p style={{margin:0}}>{String.raw`$\textbf{Sanity check.}$ At $n = 1$ this gives $\tfrac13\begin{bmatrix} 18 & -15 \\ 6 & -3 \end{bmatrix} = \begin{bmatrix} 6 & -5 \\ 2 & -1 \end{bmatrix} = A$. ✓`}</p>
              </Reveal>
            </Example>

            {/* ─── §9 SIMILAR MATRICES ─── */}
            <Sec id="similar" n="§9">Similar Matrices — The Bigger Idea</Sec>

            <p>{String.raw`Diagonalization is a special case of a broader relationship. The move $P^{-1}AP$ appears so often it earns its own name.`}</p>

            <DefBox term="Similar matrices" color="violet">
              <p style={{margin:0}}>{String.raw`Two $n\times n$ matrices $A$ and $B$ are `}<b>similar</b>{String.raw`, written $A \sim B$, if there is an invertible matrix $P$ with $$A = PBP^{-1} \quad(\text{equivalently } B = P^{-1}AP).$$ A matrix is diagonalizable precisely when it is similar to a diagonal matrix.`}</p>
            </DefBox>

            <p>{String.raw`$\textbf{The right mental model.}$ Similar matrices are the `}<i>same linear transformation</i>{String.raw` seen from two different coordinate systems. The matrix $P$ is the "dictionary" translating between the two viewpoints. Nothing essential about the transformation changes — only the numbers used to describe it.`}</p>

            <Callout icon="🤔" title="How many matrices are similar to a given one?" color="amber">
              {String.raw`Ask: how many matrices are similar to $\begin{bmatrix} 1 & 2 \\ -1 & 0 \end{bmatrix}$? The answer is `}<b>infinitely many</b>{String.raw` — one for `}<i>each</i>{String.raw` invertible $P$. Every choice of $P$ gives a matrix $B = P^{-1}AP$ that looks different but represents the same transformation. To produce five of them, just pick five different invertible matrices $P$ and compute $P^{-1}AP$ for each. The interesting question is not how to make them, but what they all `}<i>share</i>{String.raw` — which is the next section.`}
            </Callout>

            {/* ─── §10 INVARIANTS ─── */}
            <Sec id="invariants" n="§10">What Similar Matrices Share (Invariants)</Sec>

            <p>{String.raw`Similar matrices are not identical, but they agree on every quantity that describes the underlying transformation. These shared quantities are called `}<b>invariants</b>{String.raw`.`}</p>

            <ThmBox title="Similar matrices share their characteristic polynomial">
              <p style={{margin:0}}>{String.raw`If $A \sim B$, then $c_A(x) = c_B(x)$. Consequently they have the same `}<b>eigenvalues</b>{String.raw`, the same `}<b>determinant</b>{String.raw`, and the same `}<b>trace</b>{String.raw`.`}</p>
            </ThmBox>

            <p>{String.raw`$\textbf{Proof, step by step.}$ Suppose $B = P^{-1}AP$. We compute $c_B(x) = \det(xI - B)$ and show it equals $c_A(x)$.`}</p>
            <p style={{margin:'4px 0'}}>{String.raw`$\textbf{Step 1.}$ Substitute $B$: $\;xI - B = xI - P^{-1}AP$.`}</p>
            <p style={{margin:'4px 0'}}>{String.raw`$\textbf{Step 2.}$ Rewrite $xI$ using $P^{-1}P = I$: since $xI = P^{-1}(xI)P$ (the scalar $x$ passes through), we get $xI - B = P^{-1}(xI)P - P^{-1}AP = P^{-1}(xI - A)P$.`}</p>
            <p style={{margin:'4px 0'}}>{String.raw`$\textbf{Step 3.}$ Take determinants and use the product rule $\det(XYZ) = \det X\det Y\det Z$ (Lecture 10):`}</p>
            <p style={{textAlign:'center'}}>{String.raw`$$c_B(x) = \det(xI - B) = \det(P^{-1})\det(xI - A)\det(P).$$`}</p>
            <p style={{margin:'4px 0'}}>{String.raw`$\textbf{Step 4.}$ Since $\det(P^{-1})\det(P) = \det(P^{-1}P) = \det(I) = 1$, the two $P$-factors cancel:`}</p>
            <p style={{textAlign:'center'}}>{String.raw`$$c_B(x) = \det(xI - A) = c_A(x). \qquad\blacksquare$$`}</p>

            <p>{String.raw`Because eigenvalues are the roots of the characteristic polynomial, determinant is the product of eigenvalues, and trace is their sum, all three are automatically shared once the polynomials match.`}</p>

            <DefBox term="More shared invariants" color="teal">
              <p style={{margin:'4px 0'}}>{String.raw`If $A \sim B$ via $B = P^{-1}AP$, then also:`}</p>
              <p style={{margin:'4px 0'}}>{String.raw`• $\textbf{Rank}$ and $\textbf{invertibility}$ agree (multiplying by invertible $P$, $P^{-1}$ cannot change rank).`}</p>
              <p style={{margin:'4px 0'}}>{String.raw`• $\textbf{Powers stay similar}$: $B^k = P^{-1}A^kP$, proven by the same telescoping cancellation as the power formula.`}</p>
              <p style={{margin:'4px 0'}}>{String.raw`• $\textbf{Similarity is an equivalence relation}$: $A \sim A$ (take $P = I$); if $A \sim B$ then $B \sim A$; and if $A \sim B$, $B \sim C$ then $A \sim C$. So "similar" cleanly partitions all matrices into families.`}</p>
            </DefBox>

            <RedBox title="A warning: the converse fails">
              <p style={{margin:0}}>{String.raw`Equal characteristic polynomials do `}<b>not</b>{String.raw` force similarity. In Exercise 3.3.26 you meet two matrices with the identical polynomial $(x+1)^2(x-2)$ where one is diagonalizable and the other is not — so they cannot be similar. Same eigenvalues is necessary for similarity, but not sufficient.`}</p>
            </RedBox>

            {/* ─── §11 CAYLEY-HAMILTON ─── */}
            <Sec id="cayley" n="§11">The Cayley–Hamilton Theorem</Sec>

            <Callout icon="👥" title="A note on the mathematicians" color="amber">
              {String.raw`$\textbf{Arthur Cayley}$ (1821–1895) was an English mathematician who, alongside a full career as a lawyer, essentially invented matrix algebra as we know it. $\textbf{William Rowan Hamilton}$ (1805–1865) was an Irish prodigy who could read several languages as a child and later discovered the quaternions — reportedly carving the defining equation into a Dublin bridge in a flash of insight. The theorem that carries both names says something almost magical: `}<i>every matrix satisfies its own characteristic equation.</i>{String.raw``}
            </Callout>

            <ThmBox title="Cayley–Hamilton Theorem">
              <p style={{margin:0}}>{String.raw`Every square matrix $A$ satisfies its own characteristic polynomial: if $c_A(x)$ is the characteristic polynomial of $A$, then substituting the matrix $A$ for the variable gives the zero matrix, $$c_A(A) = 0.$$ (Here a constant term $c_0$ becomes $c_0 I$, since you cannot add a plain number to a matrix.)`}</p>
            </ThmBox>

            <p>{String.raw`$\textbf{What "$c_A(A)$" means.}$ If $c_A(x) = x^2 - 5x + 6$, then $c_A(A) = A^2 - 5A + 6I$. Cayley–Hamilton promises this equals the zero matrix. This is the `}<b>evaluation of a polynomial at a matrix</b>{String.raw`: replace each power of $x$ by the same power of $A$, and replace the constant by that constant times $I$.`}</p>

            <p>{String.raw`$\textbf{Proof for the diagonalizable case}$ (the general case needs Chapter 8). Suppose $A = PDP^{-1}$ with $D = \operatorname{diag}(\lambda_1, \ldots, \lambda_n)$. We use two facts:`}</p>
            <p style={{margin:'4px 0'}}>{String.raw`$\textbf{Fact 1.}$ For any polynomial $p$, $p(A) = P\,p(D)\,P^{-1}$. (Each power $A^k = PD^kP^{-1}$ by the power formula, and the $P, P^{-1}$ factors pull outside the whole sum.)`}</p>
            <p style={{margin:'4px 0'}}>{String.raw`$\textbf{Fact 2.}$ For a diagonal matrix, $p(D) = \operatorname{diag}\big(p(\lambda_1), \ldots, p(\lambda_n)\big)$ — you just evaluate $p$ at each diagonal entry.`}</p>
            <p style={{margin:'8px 0'}}>{String.raw`Now take $p = c_A$, the characteristic polynomial. Every eigenvalue $\lambda_i$ is a root, so $c_A(\lambda_i) = 0$ for each $i$. Therefore`}</p>
            <p style={{textAlign:'center'}}>{String.raw`$$c_A(D) = \operatorname{diag}\big(c_A(\lambda_1), \ldots, c_A(\lambda_n)\big) = \operatorname{diag}(0, \ldots, 0) = 0.$$`}</p>
            <p style={{margin:'8px 0'}}>{String.raw`Feeding this back through Fact 1:`}</p>
            <p style={{textAlign:'center'}}>{String.raw`$$c_A(A) = P\,c_A(D)\,P^{-1} = P\cdot 0\cdot P^{-1} = 0. \qquad\blacksquare$$`}</p>

            <Callout icon="⚙️" title="Why this is useful" color="violet">
              {String.raw`Cayley–Hamilton lets you express high powers of $A$ in terms of low ones. For a $2\times2$ matrix, $A^2 = (\operatorname{tr}A)A - (\det A)I$, so every power $A^n$ can be rewritten using just $A$ and $I$. It also gives a slick way to compute $A^{-1}$ as a polynomial in $A$. The same trick powers many algorithms in control theory and computer graphics.`}
            </Callout>

            <Example n="5" title="Diagonalizable matrices inherit eigenvalue identities (Example 3.3.11)">
              <p>{String.raw`If $\lambda^3 = 5\lambda$ for every eigenvalue of a diagonalizable matrix $A$, show that $A^3 = 5A$.`}</p>
              <Reveal label="Show solution">
                <p style={{margin:'0 0 8px'}}>{String.raw`Write $A = PDP^{-1}$ with $D = \operatorname{diag}(\lambda_1, \ldots, \lambda_n)$. Since $\lambda_i^3 = 5\lambda_i$ for each $i$,`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$D^3 = \operatorname{diag}(\lambda_1^3, \ldots, \lambda_n^3) = \operatorname{diag}(5\lambda_1, \ldots, 5\lambda_n) = 5D.$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`Then, using the power formula,`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$A^3 = PD^3P^{-1} = P(5D)P^{-1} = 5(PDP^{-1}) = 5A. \qquad\blacksquare$$`}</p>
                <p style={{margin:0}}>{String.raw`The general principle: if $p(\lambda) = 0$ for every eigenvalue of a diagonalizable $A$, then $p(A) = 0$ — the same reasoning as the Cayley–Hamilton proof, with $p(x) = x^3 - 5x$ here.`}</p>
              </Reveal>
            </Example>

            {/* ─── §12 CHARPOLY INFO ─── */}
            <Sec id="charinfo" n="§12">What the Characteristic Polynomial Encodes</Sec>

            <p>{String.raw`The final question: how much of a matrix is captured by its characteristic polynomial? Let us dissect the $2\times2$ case fully.`}</p>

            <p>{String.raw`For $A = \begin{bmatrix} a & b \\ c & d \end{bmatrix}$, expand $c_A(x) = \det(xI - A)$:`}</p>
            <p style={{textAlign:'center'}}>{String.raw`$$c_A(x) = \begin{vmatrix} x-a & -b \\ -c & x-d \end{vmatrix} = (x-a)(x-d) - bc = x^2 - (a+d)x + (ad - bc).$$`}</p>

            <p>{String.raw`Two familiar quantities jump out of the coefficients:`}</p>
            <p style={{margin:'4px 0'}}>{String.raw`• The coefficient of $x$ is $-(a+d)$. The number $a + d$ — the sum of the diagonal — is the `}<b>trace</b>{String.raw`, written $\operatorname{tr}(A)$.`}</p>
            <p style={{margin:'4px 0'}}>{String.raw`• The constant term is $ad - bc$, which is exactly $\det(A)$.`}</p>

            <DefBox term="Trace and determinant live in the characteristic polynomial" color="teal">
              <p style={{margin:0}}>{String.raw`For any $2\times2$ matrix, $$c_A(x) = x^2 - \operatorname{tr}(A)\,x + \det(A).$$ Reading off the roots: the two eigenvalues `}<b>sum to the trace</b>{String.raw` and `}<b>multiply to the determinant</b>{String.raw`.`}</p>
            </DefBox>

            <p>{String.raw`$\textbf{The pattern continues for $3\times3$.}$ Expanding $c_A(x)$ for a $3\times3$ matrix gives`}</p>
            <p style={{textAlign:'center'}}>{String.raw`$$c_A(x) = x^3 - \operatorname{tr}(A)\,x^2 + (\text{sum of principal } 2\times2 \text{ minors})\,x - \det(A).$$`}</p>
            <p>{String.raw`The leading behaviour and the two ends are always the same story: the $x^{n-1}$ coefficient is $-\operatorname{tr}(A)$, and the constant term is $(-1)^n\det(A)$. So trace and determinant are `}<i>always</i>{String.raw` encoded in the characteristic polynomial, for any size.`}</p>

            <DefBox term="Monic polynomial" color="amber">
              <p style={{margin:0}}>{String.raw`A polynomial is `}<b>monic</b>{String.raw` if its leading coefficient (the coefficient of the highest power) is $1$. For example $x^2 - 7x + 10$ is monic; $2x^2 - 3$ is not.`}</p>
            </DefBox>

            <Callout icon="🔑" title="Why monic matters here" color="violet">
              {String.raw`Every characteristic polynomial $c_A(x) = \det(xI - A)$ is `}<b>monic of degree $n$</b>{String.raw`: the highest term always comes out as $x^n$ with coefficient exactly $1$ (it is the product of the $n$ diagonal entries $x - a_{ii}$). This is why we can factor $c_A(x) = (x-\lambda_1)(x-\lambda_2)\cdots(x-\lambda_n)$ with leading coefficient $1$, and why the eigenvalues sum to the trace and multiply to $(-1)^n$ times the constant term. Being monic keeps all these bookkeeping relations clean.`}
            </Callout>

            <p>{String.raw`$\textbf{Generalizing to $n\times n$.}$ For an $n\times n$ matrix, $c_A(x)$ is a monic degree-$n$ polynomial, its roots are the $n$ eigenvalues (with multiplicity), the sum of the roots is $\operatorname{tr}(A)$, and the product of the roots is $(-1)^n$ times the constant term, which equals $\det(A)$. The characteristic polynomial is a compact fingerprint carrying the eigenvalues, the trace, and the determinant all at once.`}</p>

            {/* ─── §13 LAMBDA SQUARED ─── */}
            <Sec id="lamsq" n="§13">A Key Question: Eigenvalues of A²</Sec>

            <p>{String.raw`$\textbf{Question.}$ If $\lambda$ is an eigenvalue of $A$, what is the matching eigenvalue of $A^2$?`}</p>
            <p>{String.raw`$\textbf{Answer.}$ It is $\lambda^2$, with the `}<i>same</i>{String.raw` eigenvector. Here is the one-line reason:`}</p>
            <p style={{textAlign:'center'}}>{String.raw`$$A\mathbf{v} = \lambda\mathbf{v} \;\Longrightarrow\; A^2\mathbf{v} = A(A\mathbf{v}) = A(\lambda\mathbf{v}) = \lambda(A\mathbf{v}) = \lambda(\lambda\mathbf{v}) = \lambda^2\mathbf{v}.$$`}</p>

            <Callout icon="👁" title="Seeing why it works" color="teal">
              {String.raw`Geometrically: applying $A$ stretches $\mathbf{v}$ by $\lambda$. Applying $A$ a second time stretches the result by $\lambda$ again. Two stretches by $\lambda$ compound to a single stretch by $\lambda \cdot \lambda = \lambda^2$. The direction never changes because $\mathbf{v}$ is an eigenvector at every step. So $A^k\mathbf{v} = \lambda^k\mathbf{v}$ for every power $k$.`}
            </Callout>

            <p>{String.raw`$\textbf{The relationship between $c_A(x)$ and $c_{A^2}(x)$.}$ Since the eigenvalues of $A^2$ are the squares of the eigenvalues of $A$, their characteristic polynomials are tightly linked. The precise identity (Exercise 3.3.22) is`}</p>
            <p style={{textAlign:'center'}}>{String.raw`$$c_{A^2}(x^2) = (-1)^n\,c_A(x)\,c_A(-x).$$`}</p>
            <p>{String.raw`$\textbf{Why this holds.}$ Factor $c_A(x) = \prod_i (x - \lambda_i)$. Then $c_A(x)c_A(-x) = \prod_i (x-\lambda_i)(-x-\lambda_i) = \prod_i -(x-\lambda_i)(x+\lambda_i) = (-1)^n\prod_i (x^2 - \lambda_i^2)$. Meanwhile $c_{A^2}(y) = \prod_i (y - \lambda_i^2)$, so $c_{A^2}(x^2) = \prod_i (x^2 - \lambda_i^2)$. Comparing the two gives the identity. The squares $\lambda_i^2$ are precisely the eigenvalues of $A^2$, exactly as the geometric argument predicted.`}</p>

            {/* ─── §14 DYNAMICAL SYSTEMS ─── */}
            <Sec id="dynamical" n="§14">Linear Dynamical Systems: Predicting the Future</Sec>

            <p>{String.raw`Now we cash in everything. A `}<b>linear dynamical system</b>{String.raw` is a sequence of vectors where each one is obtained from the previous by multiplying by a fixed matrix.`}</p>

            <DefBox term="Linear dynamical system" color="violet">
              <p style={{margin:0}}>{String.raw`Given a starting vector $\mathbf{v}_0$ and a square matrix $A$, the sequence defined by $$\mathbf{v}_{k+1} = A\mathbf{v}_k \quad (k = 0, 1, 2, \ldots)$$ is a linear dynamical system. Unwinding the recurrence, $\mathbf{v}_k = A^k\mathbf{v}_0$.`}</p>
            </DefBox>

            <p>{String.raw`So the whole future is governed by powers of $A$ — and we now know how to compute those with diagonalization. If $A = PDP^{-1}$ with eigenvalues $\lambda_i$ and eigenvectors $\mathbf{x}_i$, a short calculation gives an exact `}<i>formula</i>{String.raw` for every step. Writing $\mathbf{b} = P^{-1}\mathbf{v}_0 = (b_1, \ldots, b_n)^{\mathsf{T}}$:`}</p>
            <p style={{textAlign:'center'}}>{String.raw`$$\mathbf{v}_k = b_1\lambda_1^k\,\mathbf{x}_1 + b_2\lambda_2^k\,\mathbf{x}_2 + \cdots + b_n\lambda_n^k\,\mathbf{x}_n.$$`}</p>
            <p>{String.raw`Each eigenvector contributes a term that grows or shrinks like its eigenvalue raised to the $k$. This is the exact behaviour of the system, written in "eigen-coordinates."`}</p>

            <Example n="6" title="A bird population (Example 3.3.12)">
              <p>{String.raw`Adult and juvenile female birds satisfy $a_{k+1} = \tfrac12 a_k + \tfrac14 j_k$ and $j_{k+1} = 2a_k$, starting from $a_0 = 100$, $j_0 = 40$. Find formulas for $a_k$ and $j_k$, and the long-term behaviour.`}</p>
              <Reveal label="Show full solution">
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Set up the matrix.}$ With $\mathbf{v}_k = \begin{bmatrix} a_k \\ j_k \end{bmatrix}$, the rules say $\mathbf{v}_{k+1} = A\mathbf{v}_k$ where $A = \begin{bmatrix} \tfrac12 & \tfrac14 \\ 2 & 0 \end{bmatrix}$.`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Diagonalize.}$ $c_A(x) = x^2 - \tfrac12 x - \tfrac12 = (x-1)\big(x+\tfrac12\big)$, so $\lambda_1 = 1$ and $\lambda_2 = -\tfrac12$. Basic eigenvectors (scaled to integers) are $\mathbf{x}_1 = \begin{bmatrix} 1\\2 \end{bmatrix}$ and $\mathbf{x}_2 = \begin{bmatrix} -1\\4 \end{bmatrix}$. Thus $P = \begin{bmatrix} 1 & -1 \\ 2 & 4 \end{bmatrix}$ and $D = \operatorname{diag}(1, -\tfrac12)$.`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Find the coefficients.}$ $\mathbf{b} = P^{-1}\mathbf{v}_0 = \tfrac16\begin{bmatrix} 4 & 1 \\ -2 & 1 \end{bmatrix}\begin{bmatrix} 100\\40 \end{bmatrix} = \begin{bmatrix} 220/3 \\ -80/3 \end{bmatrix}$.`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Assemble the exact formula} $ $\mathbf{v}_k = b_1\lambda_1^k\mathbf{x}_1 + b_2\lambda_2^k\mathbf{x}_2$, and read off the components:`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$a_k = \frac{220}{3} + \frac{80}{3}\Big(-\frac12\Big)^k, \qquad j_k = \frac{440}{3} + \frac{320}{3}\Big(-\frac12\Big)^k.$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Long-term behaviour.}$ As $k$ grows, $\big(-\tfrac12\big)^k \to 0$, so`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$a_k \approx \frac{220}{3} \approx 73, \qquad j_k \approx \frac{440}{3} \approx 147.$$`}</p>
                <p style={{margin:0}}>{String.raw`The population stabilizes with roughly `}<b>twice as many juveniles as adults</b>{String.raw`. The eigenvalue $\lambda_1 = 1$ (whose term never dies) sets the stable state; the eigenvalue $-\tfrac12$ (whose term vanishes) is just a transient.`}</p>
              </Reveal>
            </Example>

            <DefBox term="Dominant eigenvalue" color="teal">
              <p style={{margin:0}}>{String.raw`An eigenvalue $\lambda_1$ is `}<b>dominant</b>{String.raw` if it has multiplicity 1 and $|\lambda_1| > |\lambda_i|$ for every other eigenvalue. When a dominant eigenvalue exists, factoring $\lambda_1^k$ out of the exact formula shows all other terms shrink relative to the first, so for large $k$, $$\mathbf{v}_k \approx b_1\lambda_1^k\,\mathbf{x}_1.$$ The long-term direction of the system is simply the dominant eigenvector.`}</p>
            </DefBox>

            <Example n="7" title="Solving a linear recurrence (Example 3.3.14)">
              <p>{String.raw`A sequence satisfies $x_0 = 1$, $x_1 = -1$, and $x_{k+2} = 2x_k - x_{k+1}$ for all $k \geq 0$. Find a closed formula for $x_k$.`}</p>
              <Reveal label="Show full solution">
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Turn the recurrence into a system.}$ Let $\mathbf{v}_k = \begin{bmatrix} x_k \\ x_{k+1} \end{bmatrix}$. Then $\mathbf{v}_{k+1} = \begin{bmatrix} x_{k+1} \\ x_{k+2} \end{bmatrix} = \begin{bmatrix} x_{k+1} \\ 2x_k - x_{k+1} \end{bmatrix} = A\mathbf{v}_k$ with $A = \begin{bmatrix} 0 & 1 \\ 2 & -1 \end{bmatrix}$.`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Diagonalize.}$ $c_A(x) = x^2 + x - 2 = (x+2)(x-1)$, so $\lambda_1 = -2$, $\lambda_2 = 1$, with eigenvectors $\mathbf{x}_1 = \begin{bmatrix} 1\\-2 \end{bmatrix}$ and $\mathbf{x}_2 = \begin{bmatrix} 1\\1 \end{bmatrix}$. So $P = \begin{bmatrix} 1 & 1 \\ -2 & 1 \end{bmatrix}$.`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Coefficients.}$ $\mathbf{v}_0 = \begin{bmatrix} 1 \\ -1 \end{bmatrix}$ (using $x_0 = 1$, $x_1 = -1$), and $\mathbf{b} = P^{-1}\mathbf{v}_0 = \tfrac13\begin{bmatrix} 2 \\ 1 \end{bmatrix}$.`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Exact formula.}$ $\mathbf{v}_k = \tfrac23(-2)^k\begin{bmatrix} 1\\-2 \end{bmatrix} + \tfrac13(1)^k\begin{bmatrix} 1\\1 \end{bmatrix}$. Taking the top entry:`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$x_k = \frac13\Big[\,2(-2)^k + 1\,\Big].$$`}</p>
                <p style={{margin:0}}>{String.raw`$\textbf{Check.}$ $x_0 = \tfrac13(2+1) = 1$ ✓, $x_1 = \tfrac13(-4+1) = -1$ ✓, $x_2 = \tfrac13(8+1) = 3$ ✓, $x_3 = \tfrac13(-16+1) = -5$ ✓. Matches the recurrence.`}</p>
              </Reveal>
            </Example>

            {/* ─── §15 TRAJECTORIES ─── */}
            <Sec id="trajectories" n="§15">Picturing the Behaviour: Trajectories</Sec>

            <p>{String.raw`Plotting the sequence $\mathbf{v}_0, \mathbf{v}_1, \mathbf{v}_2, \ldots$ as points in the plane gives the `}<b>trajectory</b>{String.raw` of the system. The eigenvalues completely determine the shape. There are four archetypes, decided by the sizes of $|\lambda|$.`}</p>

            <p style={{margin:'4px 0'}}>{String.raw`• `}<b>Attractor</b>{String.raw` — both $|\lambda| < 1$. Every trajectory spirals or slides `}<i>into</i>{String.raw` the origin. The origin is stable.`}</p>
            <p style={{margin:'4px 0'}}>{String.raw`• `}<b>Repellor</b>{String.raw` — both $|\lambda| > 1$. Every trajectory flees `}<i>away</i>{String.raw` from the origin.`}</p>
            <p style={{margin:'4px 0'}}>{String.raw`• `}<b>Saddle</b>{String.raw` — one $|\lambda| > 1$ and one $|\lambda| < 1$. Trajectories approach along one eigen-line and escape along the other. Only the special starting points on the shrinking line reach the origin.`}</p>
            <p style={{margin:'4px 0'}}>{String.raw`• `}<b>Spiral</b>{String.raw` — complex eigenvalues. Trajectories rotate around the origin (spiralling in if $|\lambda| < 1$, out if $|\lambda| > 1$). No real eigen-lines exist, so the motion turns.`}</p>

            <p>Switch between the four cases and watch how the paths change:</p>

            <TrajectoryPlotter/>

            <Callout icon="🌐" title="Where this leads: Google PageRank" color="amber">
              {String.raw`The web is a giant dynamical system. Each page's importance depends on the importance of pages linking to it — a self-referential loop that is exactly $\mathbf{v} = A\mathbf{v}$ for a connectivity matrix $A$. Google's original PageRank is the `}<b>dominant eigenvector</b>{String.raw` of that matrix (scaled so its entries are positive and sum to 1). Repeatedly applying $A$ to any starting guess converges to that dominant eigenvector — the far-future state of the dynamical system. The single most important algorithm on the internet is a diagonalization problem in disguise.`}
            </Callout>

            {/* SUMMARY */}
            <div style={{ marginTop:'40px', padding:'24px 28px', background:'rgba(232,160,32,.08)', border:'2px solid rgba(232,160,32,.35)', borderRadius:'16px' }}>
              <div style={{ fontFamily:'var(--fm)', fontSize:'.7rem', letterSpacing:'.16em', textTransform:'uppercase', color:'#c8860a', marginBottom:'12px' }}>Summary of key points</div>
              <ul style={{ color:'var(--lec-ink2)', fontSize:'1rem', lineHeight:1.9, margin:0, paddingLeft:'22px' }}>
                <li>{String.raw`$A$ is diagonalizable if $P^{-1}AP = D$ for an invertible $P$ and diagonal $D$; then $A = PDP^{-1}$.`}</li>
                <li>{String.raw`$P$ = eigenvectors as columns; $D$ = matching eigenvalues on the diagonal (Theorem 3.3.4).`}</li>
                <li>{String.raw`$n$ distinct eigenvalues $\Rightarrow$ diagonalizable. In general: each eigenvalue of multiplicity $m$ must give $m$ basic eigenvectors (Theorem 3.3.5).`}</li>
                <li>{String.raw`Power formula: $A^n = PD^nP^{-1}$, and $D^n$ just raises each diagonal entry to the $n$.`}</li>
                <li>{String.raw`$A \sim B$ (similar) means $B = P^{-1}AP$; similar matrices share $c_A(x)$, eigenvalues, trace, determinant, and rank.`}</li>
                <li>{String.raw`Cayley–Hamilton: every matrix satisfies its own characteristic polynomial, $c_A(A) = 0$.`}</li>
                <li>{String.raw`$c_A(x)$ is monic of degree $n$; it encodes the eigenvalues, with $\operatorname{tr}(A)$ and $\det(A)$ in its coefficients.`}</li>
                <li>{String.raw`If $\lambda$ is an eigenvalue of $A$, then $\lambda^k$ is one of $A^k$ (same eigenvector).`}</li>
                <li>{String.raw`Dynamical system $\mathbf{v}_k = A^k\mathbf{v}_0 = \sum_i b_i\lambda_i^k\mathbf{x}_i$; long-term behaviour is set by the dominant eigenvalue.`}</li>
              </ul>
            </div>

            {/* ─── §16 EXERCISES ─── */}
            <Sec id="exercises" n="§16">Solutions to Section 3.3 Exercises (Diagonalization)</Sec>

            <p style={{fontStyle:'italic', color:'var(--lec-ink3)'}}>{String.raw`The eigenvalue/eigenvector-only exercises (3.3.3–3.3.7, 3.3.18–3.3.23) were solved in Lecture 11. Here we cover the diagonalization exercises.`}</p>

            <Exercise id="3.3.1" title="Find eigenvalues, eigenvectors, and (if possible) P diagonalizing A">
              <p>{String.raw`For each matrix, we give $c_A(x)$, the eigenvalues, and whether $A$ is diagonalizable (and $P$ when it is). Row reduction details are omitted for brevity.`}</p>
              <Reveal label="Show selected solutions (a, b, c, d, f, g, h)">
                <p style={{margin:'0 0 6px'}}>{String.raw`$\textbf{(a)}\;A = \begin{bmatrix} 1 & 2 \\ 3 & 2 \end{bmatrix}$: $c_A(x) = (x-4)(x+1)$. Eigenvalues $4, -1$ (distinct $\Rightarrow$ diagonalizable). Eigenvectors $\begin{bmatrix} 2\\3 \end{bmatrix}$ (for $4$) and $\begin{bmatrix} -1\\1 \end{bmatrix}$ (for $-1$). $P = \begin{bmatrix} 2 & -1 \\ 3 & 1 \end{bmatrix}$, $D = \operatorname{diag}(4, -1)$.`}</p>
                <p style={{margin:'0 0 6px'}}>{String.raw`$\textbf{(b)}\;A = \begin{bmatrix} 2 & -4 \\ -1 & -1 \end{bmatrix}$: $c_A(x) = (x-3)(x+2)$. Eigenvalues $3, -2$ (diagonalizable). Eigenvectors $\begin{bmatrix} -4\\1 \end{bmatrix}$ (for $3$) and $\begin{bmatrix} 1\\1 \end{bmatrix}$ (for $-2$). $P = \begin{bmatrix} -4 & 1 \\ 1 & 1 \end{bmatrix}$, $D = \operatorname{diag}(3, -2)$.`}</p>
                <p style={{margin:'0 0 6px'}}>{String.raw`$\textbf{(c)}\;A = \begin{bmatrix} 7 & 0 & -4 \\ 0 & 5 & 0 \\ 5 & 0 & -2 \end{bmatrix}$: $c_A(x) = (x-5)(x-3)(x-2)$. Three distinct eigenvalues $\Rightarrow$ diagonalizable. Eigenvectors: $\begin{bmatrix} 0\\1\\0 \end{bmatrix}$ (for $5$), $\begin{bmatrix} 1\\0\\1 \end{bmatrix}$ (for $3$), $\begin{bmatrix} 4\\0\\5 \end{bmatrix}$ (for $2$). $D = \operatorname{diag}(5,3,2)$ with $P$ those columns.`}</p>
                <p style={{margin:'0 0 6px'}}>{String.raw`$\textbf{(d)}\;A = \begin{bmatrix} 1 & 1 & -3 \\ 2 & 0 & 6 \\ 1 & -1 & 5 \end{bmatrix}$: $c_A(x) = (x-2)^3$. Only eigenvalue $2$ (multiplicity 3), but $(2I-A)\mathbf{x}=\mathbf{0}$ has only 2 parameters (basic eigenvectors $\begin{bmatrix} 1\\1\\0 \end{bmatrix}, \begin{bmatrix} -3\\0\\1 \end{bmatrix}$). Since $2 < 3$, $A$ is $\textbf{not diagonalizable}$.`}</p>
                <p style={{margin:'0 0 6px'}}>{String.raw`$\textbf{(f)}\;A = \begin{bmatrix} 0 & 1 & 0 \\ 3 & 0 & 1 \\ 2 & 0 & 0 \end{bmatrix}$: $c_A(x) = (x-2)(x+1)^2$. For $\lambda=-1$ (multiplicity 2) the system yields only $\textbf{one}$ basic eigenvector, so $A$ is $\textbf{not diagonalizable}$.`}</p>
                <p style={{margin:'0 0 6px'}}>{String.raw`$\textbf{(g)}\;A = \begin{bmatrix} 3 & 1 & 1 \\ -4 & -2 & -5 \\ 2 & 2 & 5 \end{bmatrix}$: $c_A(x) = (x-1)(x-2)(x-3)$. Three distinct eigenvalues $\Rightarrow$ diagonalizable. Eigenvectors: $\begin{bmatrix} 1\\-3\\1 \end{bmatrix}$ (for $1$), $\begin{bmatrix} -1\\1\\0 \end{bmatrix}$ (for $2$), $\begin{bmatrix} 0\\-1\\1 \end{bmatrix}$ (for $3$). $D = \operatorname{diag}(1,2,3)$.`}</p>
                <p style={{margin:'0 0 0'}}>{String.raw`$\textbf{(h)}\;A = \begin{bmatrix} 2 & 1 & 1 \\ 0 & 1 & 0 \\ 1 & -1 & 2 \end{bmatrix}$: $c_A(x) = (x-3)(x-1)^2$. For $\lambda=1$ (multiplicity 2) only $\textbf{one}$ basic eigenvector appears, so $A$ is $\textbf{not diagonalizable}$.`}</p>
              </Reveal>
              <Reveal label="Show remaining solutions (e, i)">
                <p style={{margin:'0 0 6px'}}>{String.raw`$\textbf{(e)}\;A = \begin{bmatrix} 1 & -2 & 3 \\ 2 & 6 & -6 \\ 1 & 2 & -1 \end{bmatrix}$: $c_A(x) = (x-2)^3$. Only eigenvalue $2$ (multiplicity 3), but the eigenspace has just 2 parameters (basic eigenvectors $\begin{bmatrix} -2\\1\\0 \end{bmatrix}, \begin{bmatrix} 3\\0\\1 \end{bmatrix}$). Since $2 < 3$, $A$ is $\textbf{not diagonalizable}$.`}</p>
                <p style={{margin:'0'}}>{String.raw`$\textbf{(i)}\;A = \begin{bmatrix} \lambda & 0 & 0 \\ 0 & \lambda & 0 \\ 0 & 0 & \mu \end{bmatrix}$, $\lambda \neq \mu$: already diagonal, so $c_A(x) = (x-\lambda)^2(x-\mu)$ and $A$ is trivially diagonalizable with $P = I$. The eigenvalue $\lambda$ has multiplicity 2 and a full 2-dimensional eigenspace (the standard vectors $\mathbf{e}_1, \mathbf{e}_2$); $\mu$ has eigenvector $\mathbf{e}_3$.`}</p>
              </Reveal>
            </Exercise>

            <Exercise id="3.3.8" title="Find P⁻¹AP, then compute Aⁿ">
              <Reveal label="Show both solutions">
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{(a)}\;A = \begin{bmatrix} 6 & -5 \\ 2 & -1 \end{bmatrix}$, $P = \begin{bmatrix} 1 & 5 \\ 1 & 2 \end{bmatrix}$. Then $P^{-1}AP = \operatorname{diag}(1, 4) = D$. Using $A^n = PD^nP^{-1}$ with $P^{-1} = \tfrac{1}{-3}\begin{bmatrix} 2 & -5 \\ -1 & 1 \end{bmatrix}$:`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$A^n = \frac13\begin{bmatrix} 5\cdot 4^n - 2 & 5 - 5\cdot 4^n \\ 2\cdot 4^n - 2 & 5 - 2\cdot 4^n \end{bmatrix}.$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`(Check $n=1$: $\tfrac13\begin{bmatrix} 18 & -15 \\ 6 & -3 \end{bmatrix} = A$. ✓)`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{(b)}\;A = \begin{bmatrix} -7 & -12 \\ 6 & 10 \end{bmatrix}$, $P = \begin{bmatrix} -3 & 4 \\ 2 & -3 \end{bmatrix}$. Then $P^{-1}AP = \operatorname{diag}(1, 2) = D$. With $P^{-1} = \begin{bmatrix} 3 & 4 \\ 2 & 3 \end{bmatrix}$ (since $\det P = 1$):`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$A^n = PD^nP^{-1} = \begin{bmatrix} 9 - 8\cdot 2^n & 12 - 12\cdot 2^n \\ 6\cdot 2^n - 6 & 9\cdot 2^n - 8 \end{bmatrix}.$$`}</p>
                <p style={{margin:0}}>{String.raw`(Check $n=1$: $\begin{bmatrix} 9-16 & 12-24 \\ 12-6 & 18-8 \end{bmatrix} = \begin{bmatrix} -7 & -12 \\ 6 & 10 \end{bmatrix} = A$. ✓)`}</p>
              </Reveal>
            </Exercise>

            <Exercise id="3.3.9" title="A, B diagonalizable but AB not; and D + A not diagonalizable">
              <Reveal label="Show both parts">
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{(a)}$ $A = \begin{bmatrix} 1 & 3 \\ 0 & 2 \end{bmatrix}$ has distinct eigenvalues $1, 2$ (diagonalizable); $B = \begin{bmatrix} 2 & 0 \\ 0 & 1 \end{bmatrix}$ is already diagonal. But $AB = \begin{bmatrix} 2 & 3 \\ 0 & 2 \end{bmatrix}$ has $c_{AB}(x) = (x-2)^2$ with a single eigenvector, so $AB$ is $\textbf{not diagonalizable}$. Diagonalizability is not preserved under products.`}</p>
                <p style={{margin:0}}>{String.raw`$\textbf{(b)}$ Take $D = \begin{bmatrix} 1 & 0 \\ 0 & -1 \end{bmatrix}$ and $A = \begin{bmatrix} 0 & 1 \\ 0 & 0 \end{bmatrix}$ (which is diagonalizable? no — but the exercise wants $A$ diagonalizable). Better: let $A = \begin{bmatrix} -1 & 1 \\ 0 & 1 \end{bmatrix}$, diagonalizable (eigenvalues $-1, 1$). Then $D + A = \begin{bmatrix} 0 & 1 \\ 0 & 0 \end{bmatrix}$, which has $c(x) = x^2$ but only one eigenvector — $\textbf{not diagonalizable}$. So the sum of diagonalizable matrices need not be diagonalizable.`}</p>
              </Reveal>
            </Exercise>

            <Exercise id="3.3.10" title="A is diagonalizable ⟺ Aᵀ is diagonalizable">
              <Reveal label="Show solution">
                <p style={{margin:'0 0 8px'}}>{String.raw`Suppose $A$ is diagonalizable: $P^{-1}AP = D$ for some invertible $P$ and diagonal $D$. Transpose both sides. Using $(XYZ)^{\mathsf{T}} = Z^{\mathsf{T}}Y^{\mathsf{T}}X^{\mathsf{T}}$ and $D^{\mathsf{T}} = D$ (diagonal matrices are symmetric):`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$D = D^{\mathsf{T}} = (P^{-1}AP)^{\mathsf{T}} = P^{\mathsf{T}}A^{\mathsf{T}}(P^{-1})^{\mathsf{T}} = P^{\mathsf{T}}A^{\mathsf{T}}(P^{\mathsf{T}})^{-1}.$$`}</p>
                <p style={{margin:0}}>{String.raw`Setting $Q = (P^{\mathsf{T}})^{-1}$, this says $Q^{-1}A^{\mathsf{T}}Q = D$, so $A^{\mathsf{T}}$ is diagonalized by $Q$. The reverse direction is identical (apply the same argument to $A^{\mathsf{T}}$, whose transpose is $A$). $\;\blacksquare$`}</p>
              </Reveal>
            </Exercise>

            <Exercise id="3.3.11" title="Diagonalizable ⟹ so are Aⁿ, kA, p(A), U⁻¹AU, kI + A">
              <Reveal label="Show all five parts">
                <p style={{margin:'0 0 6px'}}>{String.raw`Write $P^{-1}AP = D = \operatorname{diag}(\lambda_1,\ldots,\lambda_n)$ throughout. Each part shows the `}<i>same</i>{String.raw` $P$ (or a related invertible matrix) diagonalizes the new matrix.`}</p>
                <p style={{margin:'2px 0'}}>{String.raw`$\textbf{(a)}\;A^n$: $P^{-1}A^nP = (P^{-1}AP)^n = D^n = \operatorname{diag}(\lambda_1^n,\ldots,\lambda_n^n)$, diagonal. ✓`}</p>
                <p style={{margin:'2px 0'}}>{String.raw`$\textbf{(b)}\;kA$: $P^{-1}(kA)P = k(P^{-1}AP) = kD = \operatorname{diag}(k\lambda_1,\ldots,k\lambda_n)$, diagonal. ✓`}</p>
                <p style={{margin:'2px 0'}}>{String.raw`$\textbf{(c)}\;p(A)$: $P^{-1}p(A)P = p(P^{-1}AP) = p(D) = \operatorname{diag}(p(\lambda_1),\ldots,p(\lambda_n))$, diagonal. ✓`}</p>
                <p style={{margin:'2px 0'}}>{String.raw`$\textbf{(d)}\;U^{-1}AU$ for invertible $U$: let $Q = U^{-1}P$. Then $Q^{-1}(U^{-1}AU)Q = P^{-1}U\cdot U^{-1}AU\cdot U^{-1}P = P^{-1}AP = D$, diagonal. ✓`}</p>
                <p style={{margin:'2px 0'}}>{String.raw`$\textbf{(e)}\;kI + A$: $P^{-1}(kI + A)P = kI + D = \operatorname{diag}(k+\lambda_1,\ldots,k+\lambda_n)$, diagonal. ✓ $\;\blacksquare$`}</p>
              </Reveal>
            </Exercise>

            <Exercise id="3.3.13" title="If ±1 are the only eigenvalues of diagonalizable A, then A⁻¹ = A">
              <Reveal label="Show solution">
                <p style={{margin:'0 0 8px'}}>{String.raw`Write $A = PDP^{-1}$ with $D = \operatorname{diag}(\lambda_1,\ldots,\lambda_n)$, each $\lambda_i \in \{1, -1\}$. For any such value, $\lambda_i^2 = 1$, so $D^2 = I$. Then`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$A^2 = PD^2P^{-1} = PIP^{-1} = I.$$`}</p>
                <p style={{margin:0}}>{String.raw`From $A^2 = I$ we get $A\cdot A = I$, which means $A^{-1} = A$. (Every such $A$ is its own inverse.) $\;\blacksquare$`}</p>
              </Reveal>
            </Exercise>

            <Exercise id="3.3.14" title="If 0 and 1 are the only eigenvalues of diagonalizable A, then A² = A">
              <Reveal label="Show solution">
                <p style={{margin:'0 0 8px'}}>{String.raw`Write $A = PDP^{-1}$ with each diagonal entry $\lambda_i \in \{0, 1\}$. For both values, $\lambda_i^2 = \lambda_i$, so $D^2 = D$. Then`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$A^2 = PD^2P^{-1} = PDP^{-1} = A.$$`}</p>
                <p style={{margin:0}}>{String.raw`So $A$ is `}<b>idempotent</b>{String.raw` ($A^2 = A$). $\;\blacksquare$`}</p>
              </Reveal>
            </Exercise>

            <Exercise id="3.3.15" title="If every eigenvalue λ ≥ 0, then A = B² for some B">
              <Reveal label="Show solution">
                <p style={{margin:'0 0 8px'}}>{String.raw`Write $A = PDP^{-1}$ with $D = \operatorname{diag}(\lambda_1,\ldots,\lambda_n)$ and each $\lambda_i \geq 0$. Because the eigenvalues are non-negative, each has a real square root $\sqrt{\lambda_i}$. Define`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$B = P\operatorname{diag}\big(\sqrt{\lambda_1}, \ldots, \sqrt{\lambda_n}\big)P^{-1}.$$`}</p>
                <p style={{margin:0}}>{String.raw`Then $B^2 = P\operatorname{diag}(\sqrt{\lambda_i})^2 P^{-1} = P\operatorname{diag}(\lambda_1,\ldots,\lambda_n)P^{-1} = PDP^{-1} = A$. So $B$ is the required "square root" of $A$. $\;\blacksquare$`}</p>
              </Reveal>
            </Exercise>

            <Exercise id="3.3.16" title="If P⁻¹AP and P⁻¹BP are both diagonal, then AB = BA">
              <Reveal label="Show solution">
                <p style={{margin:'0 0 8px'}}>{String.raw`Let $D_1 = P^{-1}AP$ and $D_2 = P^{-1}BP$ be diagonal. Diagonal matrices always commute: $D_1D_2 = D_2D_1$ (both equal $\operatorname{diag}$ of the products of corresponding entries). Now`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$AB = (PD_1P^{-1})(PD_2P^{-1}) = PD_1D_2P^{-1} = PD_2D_1P^{-1} = (PD_2P^{-1})(PD_1P^{-1}) = BA.$$`}</p>
                <p style={{margin:0}}>{String.raw`The inner $P^{-1}P = I$ cancels each time. So $A$ and $B$ commute. $\;\blacksquare$`}</p>
              </Reveal>
            </Exercise>

            <Exercise id="3.3.17" title="Find all nilpotent diagonalizable matrices">
              <Reveal label="Show solution">
                <p style={{margin:'0 0 8px'}}>{String.raw`Suppose $A$ is both nilpotent ($A^m = 0$ for some $m$) and diagonalizable, $A = PDP^{-1}$. From Lecture 11 (Exercise 3.3.23), the only eigenvalue of a nilpotent matrix is $0$, so $D = \operatorname{diag}(0,\ldots,0) = 0$. Then`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$A = P\cdot 0\cdot P^{-1} = 0.$$`}</p>
                <p style={{margin:0}}>{String.raw`So the `}<b>only</b>{String.raw` nilpotent diagonalizable matrix is the zero matrix. (Any nonzero nilpotent matrix — like a shear — fails to be diagonalizable.) $\;\blacksquare$`}</p>
              </Reveal>
            </Exercise>

            <Exercise id="3.3.26" title="Same characteristic polynomial, but one diagonalizable and one not">
              <p>{String.raw`Let $A = \begin{bmatrix} 2 & 3 & -3 \\ 1 & 0 & -1 \\ 1 & 1 & -2 \end{bmatrix}$ and $B = \begin{bmatrix} 0 & 1 & 0 \\ 3 & 0 & 1 \\ 2 & 0 & 0 \end{bmatrix}$. Show $c_A(x) = c_B(x) = (x+1)^2(x-2)$, but $A$ is diagonalizable and $B$ is not.`}</p>
              <Reveal label="Show solution">
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{Same polynomial.}$ Computing both determinants $\det(xI - A)$ and $\det(xI - B)$ gives $(x+1)^2(x-2)$ in each case. So both have eigenvalues $-1$ (multiplicity 2) and $2$ (multiplicity 1).`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{$A$ is diagonalizable.}$ For $\lambda = -1$, solving $(-I - A)\mathbf{x} = \mathbf{0}$ gives a `}<b>two-parameter</b>{String.raw` solution — two independent basic eigenvectors. Together with the eigenvector for $\lambda = 2$, that is 3 basic eigenvectors, so $A$ passes Test 3. Diagonalizable. ✓`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{$B$ is not.}$ For $\lambda = -1$, solving $(-I - B)\mathbf{x} = \mathbf{0}$ gives only a `}<b>one-parameter</b>{String.raw` solution — a single basic eigenvector. Multiplicity 2 but only 1 eigenvector, so Test 3 fails. Not diagonalizable.`}</p>
                <p style={{margin:0}}>{String.raw`$\textbf{Moral.}$ Equal characteristic polynomials do not force equal behaviour. $A$ and $B$ have identical eigenvalues yet are `}<i>not similar</i>{String.raw` — because similar matrices must have matching eigenspace dimensions, and here they differ (2 vs 1). $\;\blacksquare$`}</p>
              </Reveal>
            </Exercise>

            <Exercise id="3.3.27" title="Only diagonalizable matrix with a single eigenvalue is λI; is a given matrix diagonalizable?">
              <Reveal label="Show both parts">
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{(a)}$ Suppose $A$ is diagonalizable with a single eigenvalue $\lambda$. Then $A = PDP^{-1}$ where $D = \operatorname{diag}(\lambda, \ldots, \lambda) = \lambda I$. But then $A = P(\lambda I)P^{-1} = \lambda PP^{-1} = \lambda I$. So the only such matrix is the scalar matrix $\lambda I$. $\;\blacksquare$`}</p>
                <p style={{margin:0}}>{String.raw`$\textbf{(b)}$ Is $\begin{bmatrix} 3 & -2 \\ 2 & -1 \end{bmatrix}$ diagonalizable? Its characteristic polynomial is $x^2 - 2x + 1 = (x-1)^2$, so the only eigenvalue is $1$. If it were diagonalizable, part (a) would force it to equal $1\cdot I = I$. But it is not $I$. Therefore it is `}<b>not diagonalizable</b>{String.raw`.`}</p>
              </Reveal>
            </Exercise>

            <Exercise id="3.3.28" title="Characterize diagonalizable A with A² − 3A + 2I = 0">
              <Reveal label="Show solution">
                <p style={{margin:'0 0 8px'}}>{String.raw`The condition $A^2 - 3A + 2I = 0$ means $A$ satisfies the polynomial $p(x) = x^2 - 3x + 2 = (x-1)(x-2)$. For a diagonalizable $A = PDP^{-1}$, we have $p(A) = P\,p(D)\,P^{-1} = 0$, which forces $p(\lambda_i) = 0$ for every eigenvalue.`}</p>
                <p style={{margin:0}}>{String.raw`Since $p(\lambda) = 0$ means $\lambda = 1$ or $\lambda = 2$, the diagonalizable matrices satisfying the equation are exactly those whose eigenvalues all lie in $\{1, 2\}$. Conversely any diagonalizable matrix with eigenvalues in $\{1,2\}$ satisfies the equation. $\;\blacksquare$`}</p>
              </Reveal>
            </Exercise>

            <Exercise id="3.3.29" title="Block-diagonal matrices: diagonalize A = diag(B, C)">
              <Reveal label="Show both parts">
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{(a)}$ Suppose $Q^{-1}BQ$ and $R^{-1}CR$ are diagonal. Let $P = \begin{bmatrix} Q & 0 \\ 0 & R \end{bmatrix}$. Block matrix algebra gives $P^{-1} = \begin{bmatrix} Q^{-1} & 0 \\ 0 & R^{-1} \end{bmatrix}$, and`}</p>
                <p style={{textAlign:'center'}}>{String.raw`$$P^{-1}AP = \begin{bmatrix} Q^{-1} & 0 \\ 0 & R^{-1} \end{bmatrix}\begin{bmatrix} B & 0 \\ 0 & C \end{bmatrix}\begin{bmatrix} Q & 0 \\ 0 & R \end{bmatrix} = \begin{bmatrix} Q^{-1}BQ & 0 \\ 0 & R^{-1}CR \end{bmatrix},$$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`which is diagonal (both blocks are). So $A$ is diagonalized by $P$. $\;\blacksquare$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{(b)}$ For $B = \begin{bmatrix} 5 & 3 \\ 3 & 5 \end{bmatrix}$: eigenvalues $8, 2$ with eigenvectors $\begin{bmatrix} 1\\1 \end{bmatrix}, \begin{bmatrix} 1\\-1 \end{bmatrix}$, so $Q = \begin{bmatrix} 1 & 1 \\ 1 & -1 \end{bmatrix}$, $Q^{-1}BQ = \operatorname{diag}(8, 2)$. For $C = \begin{bmatrix} 7 & -1 \\ -1 & 7 \end{bmatrix}$: eigenvalues $8, 6$ with the same eigenvectors, so $R = \begin{bmatrix} 1 & 1 \\ 1 & -1 \end{bmatrix}$, $R^{-1}CR = \operatorname{diag}(6, 8)$.`}</p>
                <p style={{margin:0}}>{String.raw`Then $P = \begin{bmatrix} Q & 0 \\ 0 & R \end{bmatrix}$ diagonalizes $A$ to $\operatorname{diag}(8, 2, 6, 8)$. $\;\blacksquare$`}</p>
              </Reveal>
            </Exercise>

            <Exercise id="3.3.30" title="Block-diagonal: c_A = c_B · c_C, and eigenvectors">
              <Reveal label="Show both parts">
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{(a)}$ For $A = \begin{bmatrix} B & 0 \\ 0 & C \end{bmatrix}$, the matrix $xI - A = \begin{bmatrix} xI - B & 0 \\ 0 & xI - C \end{bmatrix}$ is block diagonal. By the block-triangular determinant rule (Lecture 9), $$c_A(x) = \det(xI - A) = \det(xI - B)\det(xI - C) = c_B(x)\,c_C(x).$$ So the eigenvalues of $A$ are those of $B$ together with those of $C$. $\;\blacksquare$`}</p>
                <p style={{margin:'0 0 8px'}}>{String.raw`$\textbf{(b)}$ If $B\mathbf{x} = \lambda\mathbf{x}$, then $A\begin{bmatrix} \mathbf{x} \\ \mathbf{0} \end{bmatrix} = \begin{bmatrix} B\mathbf{x} \\ \mathbf{0} \end{bmatrix} = \lambda\begin{bmatrix} \mathbf{x} \\ \mathbf{0} \end{bmatrix}$, so $\begin{bmatrix} \mathbf{x} \\ \mathbf{0} \end{bmatrix}$ is an eigenvector of $A$. Similarly, if $C\mathbf{y} = \mu\mathbf{y}$ then $\begin{bmatrix} \mathbf{0} \\ \mathbf{y} \end{bmatrix}$ is an eigenvector of $A$.`}</p>
                <p style={{margin:0}}>{String.raw`Every eigenvector of $A$ decomposes this way: splitting $\mathbf{z} = \begin{bmatrix} \mathbf{x} \\ \mathbf{y} \end{bmatrix}$, the equation $A\mathbf{z} = \nu\mathbf{z}$ separates into $B\mathbf{x} = \nu\mathbf{x}$ and $C\mathbf{y} = \nu\mathbf{y}$, so each nonzero piece is an eigenvector of the corresponding block. $\;\blacksquare$`}</p>
              </Reveal>
            </Exercise>

            {/* CLOSING */}
            <div style={{ marginTop:'48px', padding:'28px 32px', background:'rgba(56,201,176,.08)', border:'2px solid rgba(56,201,176,.35)', borderRadius:'16px' }}>
              <div style={{ fontFamily:'var(--fm)', fontSize:'.7rem', letterSpacing:'.16em', textTransform:'uppercase', color:'#2a9d8f', marginBottom:'12px' }}>Looking ahead</div>
              <p style={{ fontFamily:'var(--fh)', fontSize:'1.4rem', color:'var(--lec-ink)', margin:'0 0 16px', fontWeight:400, lineHeight:1.3 }}>
                Diagonalization turned powers, populations, and even the web into simple eigenvalue arithmetic.
              </p>
              <p style={{ color:'var(--lec-ink2)', fontSize:'.97rem', lineHeight:1.8, margin:0 }}>
                {String.raw`But not every matrix is diagonalizable, and some of the most useful transformations — rotations, oscillations — have complex eigenvalues. Ahead lies the study of matrices that resist diagonalization, orthogonal diagonalization of symmetric matrices (where the eigenvectors become perpendicular axes), and the singular value decomposition, the workhorse behind modern data compression and machine learning. Every one of them grows from the seed planted here: find the right coordinates, and a hard matrix becomes easy.`}
              </p>
            </div>

            <div style={{ marginTop:'64px', paddingTop:'28px', borderTop:'2px solid var(--lec-border)', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'12px' }}>
              <div style={{ fontFamily:'var(--fm)', fontSize:'.76rem', color:'var(--lec-ink3)', fontStyle:'italic' }}>Lecture 12 — complete</div>
              <div style={{ fontFamily:'var(--fm)', fontSize:'.76rem', color:'var(--lec-ink3)' }}>MATH-120 · Shoaib Khan · LUMS · June 2026</div>
            </div>
          </div>

          {/* FOOTER NAV */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'22px 48px', borderTop:'1px solid var(--lec-border)', background:'var(--lec-paper)', flexWrap:'wrap', gap:'12px' }}>
            <Link href={PREV_HREF} style={{ fontFamily:'var(--fm)', fontSize:'.74rem', letterSpacing:'.08em', textTransform:'uppercase', color:'var(--lec-accent)', textDecoration:'none' }}>← Lecture 11</Link>
            <Link href={NEXT_HREF} style={{ fontFamily:'var(--fm)', fontSize:'.74rem', letterSpacing:'.08em', textTransform:'uppercase', color:'var(--lec-accent)', textDecoration:'none' }}>Lecture 13 →</Link>
          </div>
        </main>
      </div>

      <Footer/>
    </>
  );
}