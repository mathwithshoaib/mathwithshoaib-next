'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import Navbar from '../../../../components/Navbar';
import Footer from '../../../../components/Footer';

/* ════════════════════════════════════════════════════════════════
   MATH-120 · LECTURE 1 — The Language of Matrices
   Route: /courses/linalg/w1/lec1
   ════════════════════════════════════════════════════════════════ */

const LECTURES = [
  { week: 1, n: 1, slug: 'w1/lec1', title: 'The Language of Matrices', live: true },
];
const THIS_SLUG = 'w1/lec1';
const PREV_HREF = '/courses/linalg';          // first lecture → back to course home
const NEXT_HREF = '/courses/linalg/w1/lec2';  // will go live once Lecture 2 exists

const LEC = {
  course: 'MATH-120 · Linear Algebra',
  number: 'Lecture 1',
  title: 'The Language of Matrices',
  subtitle: 'From sequences to systems — building the bookkeeping that runs modern science',
  date: '9 June 2026',
};

const ANCHORS = [
  ['Sequences', 'seq'],
  ['Matrices', 'idx'],
  ['Matrix Anatomy', 'ord'],
  ['History', 'history'],
  ['Linear Systems', 'sys'],
  ['Matrix Form & REF', 'matform'],
];

function lecturesByWeek() {
  const w = {};
  LECTURES.forEach(l => { (w[l.week] = w[l.week] || []).push(l); });
  return Object.keys(w).map(Number).sort((a, b) => a - b).map(week => ({ week, lectures: w[week] }));
}

/* ══════════════ LECTURE COMPONENTS ══════════════ */

function Reveal({ label = 'Show derivation', children }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ margin: '18px 0' }}>
      <button onClick={() => setOpen(o => !o)} style={{
        fontFamily: 'var(--fm)', fontSize: '.78rem', letterSpacing: '.04em',
        color: 'var(--amber)', background: 'rgba(232,160,32,.08)',
        border: '1px solid rgba(232,160,32,.35)', borderRadius: '8px',
        padding: '8px 16px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px',
      }}>
        <span style={{ transform: open ? 'rotate(90deg)' : 'none', transition: 'transform .2s', display: 'inline-block' }}>▶</span>
        {open ? 'Hide' : label}
      </button>
      {open && (
        <div style={{ marginTop: '12px', padding: '16px 20px', background: 'rgba(0,0,0,.035)', border: '1px solid var(--lec-border)', borderRadius: '10px', lineHeight: 1.8 }}>
          {children}
        </div>
      )}
    </div>
  );
}

function DefBox({ term, color = 'teal', children }) {
  const c = color === 'amber' ? { bg: 'rgba(232,160,32,.07)', bd: '#c8860a', tc: '#c8860a' }
           : color === 'violet' ? { bg: 'rgba(155,128,232,.08)', bd: '#9b80e8', tc: '#9b80e8' }
           : { bg: 'rgba(56,201,176,.07)', bd: '#2a9d8f', tc: '#2a9d8f' };
  return (
    <div style={{ background: c.bg, borderLeft: `4px solid ${c.bd}`, borderRadius: '0 12px 12px 0', padding: '18px 22px', margin: '24px 0' }}>
      {term && (
        <div style={{ fontFamily: 'var(--fm)', fontSize: '.68rem', letterSpacing: '.16em', textTransform: 'uppercase', color: c.tc, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: c.tc, display: 'inline-block' }}></span>
          Definition · {term}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
}

function Example({ n, title, advanced, children }) {
  return (
    <div style={{
      background: advanced ? 'rgba(155,128,232,.05)' : 'rgba(255,253,240,.97)',
      border: `1px solid ${advanced ? 'rgba(155,128,232,.35)' : 'var(--lec-border)'}`,
      borderRadius: '14px', padding: '24px 28px', margin: '24px 0',
      boxShadow: '0 2px 18px rgba(60,40,20,.06)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px', flexWrap: 'wrap' }}>
        <span style={{
          fontFamily: 'var(--fm)', fontSize: '.7rem', letterSpacing: '.1em', textTransform: 'uppercase',
          color: advanced ? '#9b80e8' : '#c8860a',
          background: advanced ? 'rgba(155,128,232,.14)' : 'rgba(232,160,32,.14)',
          padding: '4px 12px', borderRadius: '20px',
        }}>
          {advanced ? `★ Challenge ${n}` : `Example ${n}`}
        </span>
        {title && <span style={{ fontFamily: 'var(--fh)', fontSize: '1.08rem', color: 'var(--lec-ink)', fontWeight: 600 }}>{title}</span>}
      </div>
      {children}
    </div>
  );
}

function Sec({ id, n, children }) {
  return (
    <h2 id={id} style={{
      scrollMarginTop: 'calc(var(--nav-h) + 3px + 37px + 48px + 16px)',
      fontFamily: 'var(--fh)', fontSize: 'clamp(1.6rem,3vw,2.1rem)',
      color: 'var(--lec-ink)', margin: '56px 0 18px',
      display: 'flex', alignItems: 'baseline', gap: '14px',
      borderBottom: '1px solid var(--lec-border)', paddingBottom: '10px',
    }}>
      <span style={{ fontFamily: 'var(--fm)', fontSize: '.82rem', color: '#c8860a', flexShrink: 0 }}>{n}</span>
      {children}
    </h2>
  );
}

/* coloured callout strip for motivating facts / real-world connections */
function Callout({ icon, title, color = 'amber', children }) {
  const c = color === 'teal' ? 'rgba(56,201,176,.09)' : color === 'violet' ? 'rgba(155,128,232,.09)' : 'rgba(232,160,32,.09)';
  const bc = color === 'teal' ? 'var(--teal)' : color === 'violet' ? 'var(--violet)' : 'var(--amber)';
  return (
    <div style={{ background: c, border: `1px solid ${bc}40`, borderRadius: '12px', padding: '18px 22px', margin: '24px 0', display: 'flex', gap: '16px' }}>
      <span style={{ fontSize: '1.6rem', flexShrink: 0, lineHeight: 1 }}>{icon}</span>
      <div>
        {title && <div style={{ fontFamily: 'var(--fm)', fontSize: '.72rem', letterSpacing: '.12em', textTransform: 'uppercase', color: bc, marginBottom: '6px' }}>{title}</div>}
        <div style={{ fontSize: '.95rem', color: 'var(--lec-ink2)', lineHeight: 1.75 }}>{children}</div>
      </div>
    </div>
  );
}

function Widget({ title, children }) {
  return (
    <div className="dark-widget" style={{ background: '#0f1525', border: '1px solid rgba(255,255,255,.08)', borderRadius: '16px', padding: '22px', margin: '24px 0', color: '#e8e8f0', boxShadow: '0 8px 40px rgba(0,0,0,.4)' }}>
      {title && <div style={{ fontFamily: 'var(--fm)', fontSize: '.7rem', letterSpacing: '.14em', textTransform: 'uppercase', color: '#6a6a9a', marginBottom: '16px' }}>{title}</div>}
      {children}
    </div>
  );
}

/* ══════════════ 3D PLANE WIDGET ══════════════ */
function PlaneWidget() {
  const canvasRef = useRef(null);
  const [a, setA] = useState(2);
  const [b, setB] = useState(3);
  const [c, setC] = useState(0);
  const [d, setD] = useState(4);
  const [yaw, setYaw] = useState(-0.6);
  const [pitch, setPitch] = useState(-0.5);
  const drag = useRef(null);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    const W = 520, H = 360;
    cv.width = W; cv.height = H;
    const cx = W / 2, cy = H / 2, scale = 24;
    function project([x, y, z]) {
      const cosY = Math.cos(yaw), sinY = Math.sin(yaw);
      let x1 = x * cosY - y * sinY, y1 = x * sinY + y * cosY, z1 = z;
      const cosP = Math.cos(pitch), sinP = Math.sin(pitch);
      let y2 = y1 * cosP - z1 * sinP, z2 = y1 * sinP + z1 * cosP;
      return [cx + x1 * scale, cy - z2 * scale, y2];
    }
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#0f1525'; ctx.fillRect(0, 0, W, H);
    const R = 5;
    [{ p: [[-R,0,0],[R,0,0]], col:'#e06b6b', label:'x', tip:[R,0,0]},
     { p: [[0,-R,0],[0,R,0]], col:'#38c9b0', label:'y', tip:[0,R,0]},
     { p: [[0,0,-R],[0,0,R]], col:'#9b80e8', label:'z', tip:[0,0,R]}].forEach(ax => {
      const [s,e] = ax.p.map(project);
      ctx.strokeStyle = ax.col; ctx.lineWidth = 1.8;
      ctx.beginPath(); ctx.moveTo(s[0],s[1]); ctx.lineTo(e[0],e[1]); ctx.stroke();
      const tp = project(ax.tip);
      ctx.fillStyle = ax.col; ctx.font = 'bold 13px monospace';
      ctx.fillText(ax.label, tp[0]+5, tp[1]-4);
    });
    const tris = [], span = 4, step = 0.5;
    if (Math.abs(c) > 1e-6) {
      for (let x=-span; x<span; x+=step) for (let y=-span; y<span; y+=step) {
        const z0 = (d-a*x-b*y)/c;
        const corners = [[x,y],[x+step,y],[x+step,y+step],[x,y+step]].map(([px,py])=>project([px,py,(d-a*px-b*py)/c]));
        tris.push({ corners, depth:(corners[0][2]+corners[2][2])/2 });
      }
    } else {
      const pts = [];
      for (let t=-span; t<=span; t+=step) {
        let px,py;
        if (Math.abs(b)>1e-6) {px=t;py=(d-a*t)/b;} else {py=t;px=(d-b*t)/a;}
        pts.push([px,py]);
      }
      for (let i=0;i<pts.length-1;i++) {
        const [x0,y0]=pts[i],[x1,y1]=pts[i+1];
        const corners=[[x0,y0,-span],[x1,y1,-span],[x1,y1,span],[x0,y0,span]].map(project);
        tris.push({corners,depth:(corners[0][2]+corners[2][2])/2});
      }
    }
    tris.sort((p,q)=>p.depth-q.depth);
    tris.forEach(({corners})=>{
      ctx.beginPath(); ctx.moveTo(corners[0][0],corners[0][1]);
      for(let i=1;i<corners.length;i++) ctx.lineTo(corners[i][0],corners[i][1]);
      ctx.closePath();
      ctx.fillStyle='rgba(232,160,32,.22)'; ctx.fill();
      ctx.strokeStyle='rgba(232,160,32,.5)'; ctx.lineWidth=0.5; ctx.stroke();
    });
  }, [a,b,c,d,yaw,pitch]);

  const onDown = e => { drag.current={x:e.clientX,y:e.clientY,yaw,pitch}; };
  const onMove = e => {
    if(!drag.current) return;
    setYaw(drag.current.yaw+(e.clientX-drag.current.x)*.011);
    setPitch(drag.current.pitch+(e.clientY-drag.current.y)*.011);
  };
  const onUp = () => { drag.current=null; };

  const row = (lbl,val,set,mn,mx) => (
    <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'9px'}}>
      <span style={{fontFamily:'monospace',width:'16px',color:'#e8a020',fontSize:'.9rem'}}>{lbl}</span>
      <input type="range" min={mn} max={mx} step="1" value={val} onChange={e=>set(+e.target.value)} style={{flex:1,accentColor:'#e8a020'}}/>
      <span style={{fontFamily:'monospace',width:'28px',textAlign:'right',color:'#e8e8f0'}}>{val}</span>
    </div>
  );

  return (
    <Widget title="Interactive · Drag to rotate · Adjust sliders to reshape the plane">
      <div style={{display:'flex',gap:'22px',flexWrap:'wrap',alignItems:'flex-start'}}>
        <canvas ref={canvasRef} onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
          style={{borderRadius:'10px',cursor:'grab',touchAction:'none',maxWidth:'100%',border:'1px solid rgba(255,255,255,.06)'}}/>
        <div style={{flex:'1 1 180px',minWidth:'180px'}}>
          <div style={{fontFamily:'monospace',fontSize:'1rem',color:'#e8a020',marginBottom:'14px',padding:'8px 12px',background:'rgba(232,160,32,.08)',borderRadius:'8px',letterSpacing:'.02em'}}>
            {a}x {b>=0?'+':'−'} {Math.abs(b)}y {c>=0?'+':'−'} {Math.abs(c)}z = {d}
          </div>
          {row('a',a,setA,-5,5)}
          {row('b',b,setB,-5,5)}
          {row('c',c,setC,-5,5)}
          {row('d',d,setD,-8,8)}
          <button onClick={()=>setC(0)} style={{marginTop:'10px',fontFamily:'monospace',fontSize:'.72rem',color:'#9b80e8',background:'rgba(155,128,232,.1)',border:'1px solid rgba(155,128,232,.4)',borderRadius:'8px',padding:'7px 13px',cursor:'pointer',width:'100%'}}>
            Set c = 0 — see the "missing z" case
          </button>
          <p style={{fontSize:'.75rem',color:'#7a7ab0',marginTop:'10px',lineHeight:1.55}}>
            When <b style={{color:'#9b80e8'}}>c = 0</b>, z is absent — free to be anything. The line in the floor sweeps straight up into a vertical plane.
          </p>
        </div>
      </div>
    </Widget>
  );
}

/* ══════════════ REF CHECKER ══════════════ */
const REF_EXAMPLES = [
  { m:[[1,2,3,4],[0,0,1,5],[0,0,0,0]], isRef:true,
    why:'✓ Valid. Leading 1s in columns 1 then 3 (staircase steps right), zero row safely at the bottom.' },
  { m:[[1,0,0],[0,1,0],[0,0,1]], isRef:true,
    why:'✓ Valid — the identity matrix. Leading 1s on the diagonal, already in reduced form.' },
  { m:[[1,2,3,4,5],[0,0,0,0,0],[0,1,2,4,5],[0,0,0,0,0]], isRef:false,
    why:'✗ Not valid. Row 2 is a zero row, but row 3 is nonzero — all zero rows must be at the bottom.' },
  { m:[[1,2,1,3,4],[0,0,0,1,2],[0,0,0,-1,2]], isRef:false,
    why:'✗ Not valid for two reasons: (1) the leading entry of row 3 is −1, not 1; (2) rows 2 and 3 both have their leading entry in column 4, so the staircase doesn\'t step right.' },
  { m:[[1,5,0,2],[0,1,3,0],[0,0,1,7]], isRef:true,
    why:'✓ Valid. Leading 1s in columns 1, 2, 3 — each strictly right of the one above.' },
  { m:[[2,4,1],[0,1,3],[0,0,1]], isRef:false,
    why:'✗ Not valid here. The first leading entry is 2, not 1. The staircase shape is correct, but Nicholson requires leading 1s.' },
  { m:[[0,1,3,0,2],[0,0,0,1,4],[0,0,0,0,0]], isRef:true,
    why:'✓ Valid — a good trap. Column 1 being all zeros is fine. Leading 1s are in columns 2 and 4 (stepping right), zero row at the bottom.' },
  { m:[[1,2,0,5],[0,1,0,3],[0,0,0,1]], isRef:true,
    why:'✓ Valid. Leading 1s in columns 1, 2, 4 — column 3 is simply skipped, which is allowed.' },
  { m:[[1,0,0,2],[0,0,1,3],[0,1,0,4]], isRef:false,
    why:'✗ Not valid. The leading 1s fall in columns 1, 3, 2 — the staircase moves backward (column 2 < column 3).' },
];

function MatrixDisplay({ m, highlightPivots }) {
  const pivotCol = m.map(row => row.findIndex(v => v !== 0));
  return (
    <div style={{ display:'inline-flex', alignItems:'stretch', gap:'5px', margin:'6px 0' }}>
      <div style={{ width:'3px', background:'#5a5a8a', borderRadius:'2px' }}/>
      <table style={{ borderCollapse:'collapse', fontFamily:'monospace', fontSize:'1rem' }}>
        <tbody>
          {m.map((row,i) => (
            <tr key={i}>
              {row.map((v,j) => {
                const isPivot = highlightPivots && j===pivotCol[i] && v!==0;
                return (
                  <td key={j} style={{
                    padding:'5px 12px', textAlign:'center',
                    color: isPivot ? '#0f1525' : '#e8e8f0',
                    background: isPivot ? '#e8a020' : 'transparent',
                    borderRadius: isPivot ? '6px' : 0, fontWeight: isPivot ? 700 : 400,
                    transition:'background .2s',
                  }}>{v}</td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ width:'3px', background:'#5a5a8a', borderRadius:'2px' }}/>
    </div>
  );
}

function RefChecker() {
  const [idx, setIdx] = useState(0);
  const [answered, setAnswered] = useState(null);
  const [score, setScore] = useState({ right:0, done:0 });
  const ex = REF_EXAMPLES[idx];

  function answer(choice) {
    if (answered!==null) return;
    const correct = choice===ex.isRef;
    setAnswered(choice);
    setScore(s=>({right:s.right+(correct?1:0),done:s.done+1}));
  }
  function next() { setAnswered(null); setIdx(i=>(i+1)%REF_EXAMPLES.length); }
  const wasCorrect = answered!==null && answered===ex.isRef;

  return (
    <Widget title={`Practice · Is this matrix in row-echelon form?  (${idx+1} / ${REF_EXAMPLES.length})`}>
      <div style={{ display:'flex', justifyContent:'center', padding:'8px 0 20px' }}>
        <MatrixDisplay m={ex.m} highlightPivots={answered!==null}/>
      </div>
      {answered===null ? (
        <div style={{ display:'flex', gap:'12px', justifyContent:'center', flexWrap:'wrap' }}>
          <button onClick={()=>answer(true)} style={btnYes}>✓ Yes — it IS in REF</button>
          <button onClick={()=>answer(false)} style={btnNo}>✗ No — it is NOT</button>
        </div>
      ) : (
        <div>
          <div style={{
            padding:'14px 18px', borderRadius:'12px', marginBottom:'14px',
            background: wasCorrect ? 'rgba(56,201,176,.12)' : 'rgba(224,107,107,.12)',
            border: `1px solid ${wasCorrect?'#38c9b0':'#e06b6b'}`,
          }}>
            <div style={{ fontWeight:700, color:wasCorrect?'#38c9b0':'#e06b6b', marginBottom:'8px', fontSize:'.95rem' }}>
              {wasCorrect?'Well done!':'Not quite — study the reason below.'}
            </div>
            <div style={{ fontSize:'.88rem', color:'#c8c8e8', lineHeight:1.6 }}>{ex.why}</div>
            {ex.isRef && <div style={{ fontSize:'.8rem', color:'#9b80e8', marginTop:'10px' }}>Gold entries = <b>pivots</b> (the leading 1s).</div>}
          </div>
          <div style={{ display:'flex', justifyContent:'center' }}>
            <button onClick={next} style={btnNext}>Next matrix →</button>
          </div>
        </div>
      )}
      <div style={{ textAlign:'center', marginTop:'16px', fontFamily:'monospace', fontSize:'.78rem', color:'#5a5a8a' }}>
        Score: {score.right} / {score.done} {score.done>0&&<span style={{color:score.right===score.done?'#38c9b0':'#e06b6b'}}>{score.right===score.done?'— perfect!':''}</span>}
      </div>
    </Widget>
  );
}

const btnBase = { fontFamily:'var(--fb,sans-serif)', fontSize:'.86rem', fontWeight:600, padding:'10px 20px', borderRadius:'10px', cursor:'pointer', border:'1px solid', transition:'all .2s' };
const btnYes  = { ...btnBase, color:'#38c9b0', background:'rgba(56,201,176,.1)',  borderColor:'#38c9b0' };
const btnNo   = { ...btnBase, color:'#e06b6b', background:'rgba(224,107,107,.1)', borderColor:'#e06b6b' };
const btnNext = { ...btnBase, color:'#e8a020', background:'rgba(232,160,32,.1)',  borderColor:'#e8a020' };

/* ══════════════ PAGE ══════════════ */
export default function Lec1() {
  const [menuOpen, setMenuOpen] = useState(false);
  const weeks = lecturesByWeek();

  useEffect(() => {
    window.MathJax = {
      tex: { inlineMath:[['$','$'],['\\(','\\)']], displayMath:[['$$','$$'],['\\[','\\]']] },
      options: { skipHtmlTags:['script','noscript','style','textarea','pre'] },
    };
    const ti = setInterval(()=>{ if(window.MathJax?.typesetPromise){window.MathJax.typesetPromise();clearInterval(ti);} },100);
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
        :root {
          --lec-paper: #faf7f2;
          --lec-ink:   #241e14;
          --lec-ink2:  #4a4030;
          --lec-ink3:  #7a6e5e;
          --lec-border:#e2d8c8;
          --lec-accent:#c8860a;
        }
        .lec-content { color: var(--lec-ink); }
        .lec-content p { color: var(--lec-ink2); line-height: 1.85; margin: 14px 0; font-size: 1.02rem; }
        .lec-content mjx-container { color: var(--lec-ink) !important; }
        .dark-widget mjx-container { color: #e8e8f0 !important; }
        .dark-widget * { color: #e8e8f0; }
        .lec-content b, .lec-content strong { color: var(--lec-ink); }

        .lc-shell { display:flex; padding-top:calc(var(--nav-h) + 3px + 37px); min-height:100vh; }
        .lc-sidebar {
          width:256px; flex-shrink:0; position:sticky;
          top:calc(var(--nav-h)+3px+37px); height:calc(100vh - var(--nav-h) - 40px);
          overflow-y:auto; background:var(--bg2); border-right:1px solid var(--border); z-index:510;
        }
        .lc-backdrop { display:none; }
        .lc-menu-btn { display:none; }
        .lc-main { flex:1; min-width:0; background:var(--lec-paper); }
        .lc-body { max-width:880px; margin:0 auto; padding:36px 48px 96px; }

        @media(max-width:960px) {
          .lc-body { padding:28px 28px 80px; }
        }
        @media(max-width:860px) {
          .lc-sidebar {
            position:fixed; top:0; left:0; height:100vh; width:272px;
            transform:translateX(-100%); transition:transform .25s ease;
            padding-top:calc(var(--nav-h)+14px);
          }
          .lc-sidebar.open { transform:translateX(0); box-shadow:0 0 40px rgba(0,0,0,.5); }
          .lc-backdrop.open { display:block; position:fixed; inset:0; background:rgba(0,0,0,.55); z-index:505; }
          .lc-menu-btn {
            display:inline-flex; align-items:center; gap:7px;
            position:fixed; bottom:22px; left:22px; z-index:506;
            background:var(--amber); color:#1a1a2e; border:none;
            font-family:var(--fm); font-size:.8rem; font-weight:600;
            padding:12px 18px; border-radius:32px; cursor:pointer;
            box-shadow:0 4px 20px rgba(0,0,0,.35);
          }
          .lc-body { padding:24px 18px 72px; }
          .lec-content p { font-size:.97rem; }
          .lec-content h1 { font-size:clamp(1.6rem,7vw,2.2rem) !important; }
        }
      `}</style>

      <Navbar activePage="courses"/>

      {/* BREADCRUMB */}
      <div style={{ position:'sticky', top:'calc(var(--nav-h) + 3px)', zIndex:500, background:'var(--bg2)', borderBottom:'1px solid var(--border)', padding:'0 24px', display:'flex', alignItems:'center', gap:'8px', fontFamily:'var(--fm)', fontSize:'.72rem', color:'var(--text3)', height:'37px', overflowX:'auto', whiteSpace:'nowrap' }}>
        <Link href="/" style={{color:'var(--amber)'}}>Home</Link><span>›</span>
        <Link href="/courses" style={{color:'var(--amber)'}}>Courses</Link><span>›</span>
        <Link href="/courses/linalg" style={{color:'var(--amber)'}}>Linear Algebra</Link><span>›</span>
        <span style={{color:'var(--text2)'}}>Week 1 · Lecture 1</span>
      </div>

      <button className="lc-menu-btn" onClick={()=>setMenuOpen(o=>!o)}>☰ Lectures</button>
      <div className={`lc-backdrop ${menuOpen?'open':''}`} onClick={()=>setMenuOpen(false)}/>

      <div className="lc-shell">

        {/* SIDEBAR */}
        <aside className={`lc-sidebar ${menuOpen?'open':''}`}>
          <div style={{padding:'18px 16px 12px',borderBottom:'1px solid var(--border)'}}>
            <div style={{fontFamily:'var(--fm)',fontSize:'.6rem',letterSpacing:'.2em',textTransform:'uppercase',color:'var(--amber)',marginBottom:'4px'}}>MATH-120 · Linear Algebra</div>
            <div style={{fontFamily:'var(--fh)',fontSize:'.95rem',color:'var(--text)',lineHeight:1.3}}>Lectures</div>
            <Link href="/courses/linalg" style={{display:'inline-flex',alignItems:'center',gap:'5px',fontFamily:'var(--fm)',fontSize:'.68rem',color:'var(--text3)',marginTop:'8px',textDecoration:'none'}}>← Course Home</Link>
          </div>
          <nav style={{padding:'8px 0 24px'}}>
            {weeks.map(({week,lectures})=>(
              <div key={week}>
                <span style={{fontFamily:'var(--fm)',fontSize:'.58rem',letterSpacing:'.22em',textTransform:'uppercase',color:'var(--text3)',padding:'12px 16px 4px',display:'block'}}>Week {week}</span>
                {lectures.map(lec=>{
                  const isCurrent = lec.slug===THIS_SLUG;
                  const label = lec.title||`Lecture ${lec.n}`;
                  const body = (
                    <div style={{padding:'8px 16px',borderLeft:isCurrent?'3px solid var(--amber)':'3px solid transparent',background:isCurrent?'var(--amber-lt)':'transparent'}}>
                      <div style={{fontFamily:'var(--fm)',fontSize:'.72rem',lineHeight:1.4,color:isCurrent?'var(--amber)':(lec.live?'var(--text2)':'var(--text3)'),opacity:(lec.live||isCurrent)?1:.5}}>
                        <span style={{color:isCurrent?'var(--amber)':'var(--text3)'}}>Lec {lec.n}</span> · {label}{!lec.live&&<span style={{fontStyle:'italic'}}> · soon</span>}
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

        {/* MAIN */}
        <main className="lc-main">

          {/* STICKY ANCHOR BAR — prev | anchors (centered) | next */}
          <div style={{ position:'sticky', top:'calc(var(--nav-h) + 3px + 37px)', zIndex:480, background:'var(--lec-paper)', borderBottom:'1px solid var(--lec-border)', height:'48px', display:'flex', alignItems:'center' }}>
            {/* PREV */}
            <Link href={PREV_HREF} style={{ display:'flex', alignItems:'center', gap:'5px', padding:'0 16px', height:'100%', fontFamily:'var(--fm)', fontSize:'.72rem', color:'var(--lec-ink3)', borderRight:'1px solid var(--lec-border)', whiteSpace:'nowrap', flexShrink:0, textDecoration:'none' }}>
              ← Course Home
            </Link>
            {/* ANCHORS centered */}
            <div style={{ flex:1, display:'flex', justifyContent:'center', alignItems:'center', gap:'4px', overflowX:'auto', padding:'0 8px' }}>
              <span style={{ fontFamily:'var(--fm)', fontSize:'.6rem', letterSpacing:'.12em', textTransform:'uppercase', color:'var(--lec-accent)', flexShrink:0, marginRight:'6px' }}>On this page</span>
              {ANCHORS.map(([label,id],i)=>(
                <span key={id} style={{display:'inline-flex',alignItems:'center',flexShrink:0}}>
                  {i>0&&<span style={{color:'var(--lec-border)',margin:'0 7px'}}>·</span>}
                  <a href={`#${id}`} onClick={e=>jump(e,id)} style={{fontFamily:'var(--fm)',fontSize:'.73rem',color:'var(--lec-ink2)',textDecoration:'none',whiteSpace:'nowrap'}}>{label}</a>
                </span>
              ))}
            </div>
            {/* NEXT */}
            <Link href={NEXT_HREF} style={{ display:'flex', alignItems:'center', gap:'5px', padding:'0 16px', height:'100%', fontFamily:'var(--fm)', fontSize:'.72rem', color:'var(--lec-ink3)', borderLeft:'1px solid var(--lec-border)', whiteSpace:'nowrap', flexShrink:0, textDecoration:'none' }}>
              Lecture 2 →
            </Link>
          </div>

          {/* CONTENT */}
          <div className="lec-content lc-body">

            {/* HEADER */}
            <div style={{borderBottom:'2px solid var(--lec-border)',paddingBottom:'24px',marginBottom:'8px'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'8px',marginBottom:'10px'}}>
                <span style={{fontFamily:'var(--fm)',fontSize:'.7rem',letterSpacing:'.16em',textTransform:'uppercase',color:'var(--lec-accent)'}}>{LEC.course} · {LEC.number}</span>
                <span style={{fontFamily:'var(--fm)',fontSize:'.7rem',color:'var(--lec-ink3)',background:'rgba(0,0,0,.04)',padding:'4px 12px',borderRadius:'20px'}}>{LEC.date}</span>
              </div>
              <h1 style={{fontFamily:'var(--fh)',fontSize:'clamp(2.2rem,5vw,3.2rem)',color:'var(--lec-ink)',margin:'0 0 8px',lineHeight:1.05,fontWeight:400}}>{LEC.title}</h1>
              <p style={{fontStyle:'italic',color:'var(--lec-ink3)',margin:0,fontSize:'1.05rem'}}>{LEC.subtitle}</p>
            </div>

            {/* OPENING — hook */}
            <p>In 1801 the astronomer Giuseppe Piazzi spotted a faint moving object in the night sky — a tiny rocky body between Mars and Jupiter. He tracked it for 41 days before it vanished behind the sun. The world feared it was lost forever. Then a 24-year-old mathematician named <b>Carl Friedrich Gauss</b> sat down with a system of equations, invented a systematic method for solving it, and predicted exactly where the object — now known as <b>Ceres</b> — would reappear. Ten months later, it was found almost precisely where Gauss had said. That method, refined over two centuries, is the engine of this course. We call it <b>Gaussian elimination</b>, and by the end of this lecture you will understand its foundation.</p>

            <Callout icon="🎯" title="What this lecture builds">
              Today we lay the language: what a matrix is, where it comes from, and why it is the right tool for solving systems of linear equations. Every technique in linear algebra — eigenvalues, transformations, SVD — is built on what we do today.
            </Callout>

            {/* ─── SEQUENCES ─── */}
            <Sec id="seq" n="§1">Sequences &amp; the nth Term</Sec>
            <p>Mathematics rarely introduces a big idea from nowhere. Every concept has a simpler ancestor. The ancestor of a matrix is a <b>sequence</b> — something you have been working with since school without perhaps realising it.</p>
            <p>A <b>sequence</b> is an ordered list of numbers. Order matters: $2, 4, 6, 8$ and $8, 6, 4, 2$ are different sequences even though they share the same four numbers. Each number is called a <b>term</b>, and its position in the list is its <b>index</b>.</p>

            <Example n="1" title="From list to formula">
              <p>{String.raw`The even numbers: $2, 4, 6, 8, 10, \dots$ are easy to write out — but suppose I ask for the 1000th term. Writing out 1000 numbers is absurd. Notice each term equals $2 \times \text{its position}$. So the term at position $n$ is simply $2n$. The 1000th term is $2000$.`}</p>
              <p>{String.raw`A compact formula replaces an infinite list. That is the power of algebra.`}</p>
            </Example>

            <Sec id="gen" n="§2">{String.raw`The General Term $a_n$`}</Sec>
            <p>{String.raw`We make this compact by naming the sequence. Call it $a$. Write the term at position $n$ as $a_n$ — read "a sub n." The tiny $n$ is the index, sitting just below and to the right of the letter.`}</p>

            <DefBox term="General term of a sequence" color="teal">
              <p style={{margin:0}}>{String.raw`A sequence is written $(a_n)_{n \ge 1}$, where $a_n$ is a formula giving the value at position $n$. The condition $n \ge 1$ (or $n \ge 0$, depending on context) tells you where the list starts.`}</p>
            </DefBox>

            <Example n="2" title="Reading and writing general terms">
              <p>{String.raw`(a) $a_n = 2n,\ n \ge 1$ gives $2, 4, 6, 8, \dots$ (even numbers). Here $a_7 = 14$.`}</p>
              <p>{String.raw`(b) $a_n = n^2,\ n \ge 1$ gives $1, 4, 9, 16, 25, \dots$ (perfect squares). Here $a_{10} = 100$.`}</p>
              <p>{String.raw`(c) $a_n = \tfrac{1}{n},\ n \ge 1$ gives $1, \tfrac{1}{2}, \tfrac{1}{3}, \tfrac{1}{4}, \dots$ — terms shrinking toward zero.`}</p>
              <p>{String.raw`(d) The condition matters: $a_n = n - 3,\ n \ge 0$ gives $-3, -2, -1, 0, 1, \dots$ while the same formula with $n \ge 1$ gives $-2, -1, 0, 1, \dots$ — a different sequence starting one step later.`}</p>
            </Example>

            <Example n="3" title="Recognising the pattern — working backward" advanced>
              <p>{String.raw`Given the terms, find the rule. This is harder but very useful.`}</p>
              <p>{String.raw`(a) $3, 7, 11, 15, \dots$ — the gap between terms is always $4$, so the sequence is arithmetic: $a_n = 4n - 1$ for $n \ge 1$. (Check: $a_1 = 3$, $a_2 = 7$. ✓)`}</p>
              <p>{String.raw`(b) $2, 6, 12, 20, 30, \dots$ — the gaps are $4, 6, 8, 10$, growing by 2 each time, so the rule is not linear. Notice: $2 = 1\cdot 2$, $6 = 2\cdot 3$, $12 = 3\cdot 4$, $20 = 4\cdot 5$. So $a_n = n(n+1)$. Spotting structure beats blind guessing.`}</p>
              <p>{String.raw`(c) $1, -1, 1, -1, \dots$ — signs alternate. $a_n = (-1)^{n+1}$ works: $a_1 = (-1)^2 = 1$, $a_2 = (-1)^3 = -1$. Sequences can involve more than polynomial rules.`}</p>
            </Example>

            <p>One crucial observation: a single index $n$ moves along <b>one line</b> of positions — first, second, third. Now suppose the data is not a line but a grid. One index is no longer enough.</p>

            {/* ─── SECOND INDEX / MATRIX DEF ─── */}
            <Sec id="idx" n="§3">Adding a Second Index — Birth of the Matrix</Sec>

            <Callout icon="💡" title="The key question" color="violet">
              What if our data is naturally arranged in rows <i>and</i> columns — a table rather than a list? A single index can only say <i>which row</i> or <i>which column</i>. To say both, we need two.
            </Callout>

            <p>{String.raw`Introduce a second index. Write $a_{ij}$ for the entry in `}<b>row $i$</b>{String.raw`, `}<b>column $j$</b>{String.raw`. The full collection of entries arranged in a grid, with $i$ running from $1$ to $m$ and $j$ from $1$ to $n$, is written:`}</p>
            <p style={{textAlign:'center'}}>{String.raw`$$\left(a_{ij}\right)_{\substack{1 \le i \le m \\ 1 \le j \le n}}$$`}</p>
            <p>{String.raw`Every pair $(i,j)$ names exactly one entry. This double-indexed collection is a `}<b>matrix</b>.</p>

            <Reveal label="Intuition — a seating chart">
              <p style={{margin:0}}>{String.raw`Imagine a lecture hall with $m$ rows and $n$ seats per row. To identify one seat you need both the row number and the seat number within that row. One number alone is ambiguous. $a_{35}$ means row 3, seat 5 — not seat 35 in some unknown row. A matrix is precisely a labelled seating chart of numbers.`}</p>
            </Reveal>

            {/* ─── MATRIX ANATOMY ─── */}
            <Sec id="ord" n="§4">The Definition, Order, and Anatomy of a Matrix</Sec>

            <DefBox term="Matrix" color="amber">
              <p style={{margin:0}}>{String.raw`A `}<b>matrix</b>{String.raw` is a rectangular array of numbers arranged in rows and columns. The $(a_{ij})$ written out in full for $1 \le i \le m$, $1 \le j \le n$:`}</p>
            </DefBox>

            <p style={{textAlign:'center'}}>{String.raw`$$A = \begin{pmatrix} a_{11} & a_{12} & \cdots & a_{1n} \\ a_{21} & a_{22} & \cdots & a_{2n} \\ \vdots & \vdots & \ddots & \vdots \\ a_{m1} & a_{m2} & \cdots & a_{mn} \end{pmatrix}$$`}</p>

            <p>{String.raw`The entry $a_{ij}$ sits in `}<b>row $i$, column $j$</b>{String.raw`. Row first, column second — always. A matrix with $m$ rows and $n$ columns has `}<b>order $m \times n$</b>{String.raw` ("$m$ by $n$"). We name matrices with capital letters: $A = (a_{ij})$.`}</p>

            <Example n="4" title="Reading order and entries">
              <p>{String.raw`$B = \begin{pmatrix} 1 & 5 & -2 \\ 0 & 3 & 7 \end{pmatrix}$ has $2$ rows and $3$ columns: order $2 \times 3$, holding $6$ entries in total. Here $b_{12} = 5$ (row 1, column 2) and $b_{23} = 7$ (row 2, column 3).`}</p>
              <p>{String.raw`Notice: $b_{12} \ne b_{21}$ in general — the order of the indices is not interchangeable.`}</p>
            </Example>

            <Example n="5" title="Catalogue of matrix types">
              <p><b>Row matrix:</b>{String.raw` One row, order $1 \times n$: $\quad \begin{pmatrix} 4 & 1 & -3 & 9 \end{pmatrix}$. Used to represent a data point with multiple features.`}</p>
              <p><b>Column matrix (vector):</b>{String.raw` One column, order $m \times 1$: $\quad \begin{pmatrix} 4 \\ 1 \\ 9 \end{pmatrix}$. The language of vectors in machine learning, physics, economics.`}</p>
              <p><b>Square matrix:</b>{String.raw` $n \times n$. Most of the interesting theory (eigenvalues, determinants, inverses) lives here.`}</p>
              <p><b>Zero matrix $O$:</b>{String.raw` All entries $0$. The additive identity: $A + O = A$.`}</p>
              <p><b>Identity matrix $I_n$:</b>{String.raw` Diagonal $1$s, off-diagonal $0$s. The multiplicative identity: $AI_n = I_n A = A$ (when $A$ is $n\times n$). Think of it as the number $1$ for matrices.`}</p>
              <p><b>Diagonal matrix:</b>{String.raw` Square matrix with zeros everywhere except the main diagonal.`}</p>
            </Example>

            <Example n="6" title="Symmetric and triangular matrices — shapes you will see all term" advanced>
              <p>{String.raw`A `}<b>symmetric matrix</b>{String.raw` satisfies $a_{ij} = a_{ji}$ for every $i, j$ — it equals its own "mirror" across the main diagonal:`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$S = \begin{pmatrix} 4 & 2 & -1 \\ 2 & 7 & 5 \\ -1 & 5 & 3 \end{pmatrix}.$$`}</p>
              <p>{String.raw`Check the $2$s in positions $(1,2)$ and $(2,1)$, the $-1$s in $(1,3)$ and $(3,1)$, the $5$s in $(2,3)$ and $(3,2)$. All correct. In data science, covariance matrices are symmetric.`}</p>
              <p>{String.raw`An `}<b>upper-triangular matrix</b>{String.raw` has zeros everywhere `}<i>below</i>{String.raw` the main diagonal. A `}<b>lower-triangular</b>{String.raw` one has zeros above. These shapes matter because row-echelon form — coming shortly — is triangular.`}</p>
            </Example>

            <Example n="7" title="Building a matrix from an index formula" advanced>
              <p>{String.raw`Suppose $A = (a_{ij})$ is $3 \times 4$ with rule $a_{ij} = 3i - j$. Compute each entry:`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$A = \begin{pmatrix} 2 & 1 & 0 & -1 \\ 5 & 4 & 3 & 2 \\ 8 & 7 & 6 & 5 \end{pmatrix}.$$`}</p>
              <p>{String.raw`Row 1 ($i=1$): $3(1)-1=2$, $3(1)-2=1$, $3(1)-3=0$, $3(1)-4=-1$. Each row increases by 3 going down; each column decreases by 1 going right. This is the "sequence with two indices" made concrete.`}</p>
            </Example>

            {/* DIAGONALS */}
            <p style={{fontFamily:'var(--fh)',fontSize:'1.3rem',color:'var(--lec-ink)',margin:'36px 0 12px',fontWeight:600}}>Diagonals</p>

            <DefBox term="Main diagonal & secondary diagonal">
              <p style={{margin:0}}>{String.raw`In a square matrix $A$, the `}<b>main diagonal</b>{String.raw` consists of entries $a_{ii}$ where row index equals column index: $a_{11}, a_{22}, a_{33}, \dots$ — running top-left to bottom-right. The `}<b>secondary diagonal</b>{String.raw` runs top-right to bottom-left. In this course the main diagonal is what matters — it controls the identity matrix, the trace, eigenvalues, and determinants.`}</p>
            </DefBox>

            <Example n="8" title="Spotting both diagonals">
              <p>{String.raw`In $A = \begin{pmatrix} \mathbf{5} & 1 & \mathbf{3} \\ 2 & \mathbf{0} & 4 \\ \mathbf{7} & 6 & \mathbf{-2} \end{pmatrix}$: main diagonal (bold-top-left to bottom-right) = $5, 0, -2$; secondary diagonal (bold-top-right to bottom-left) = $3, 0, 7$. The zero on the main diagonal is perfectly fine.`}</p>
            </Example>

            {/* ─── HISTORY ─── */}
            <Sec id="history" n="§5">A Short History — Where Matrices Came From</Sec>

            <Callout icon="📜" title="2000 years older than the name" color="teal">
              Rectangular arrays of numbers appear in the Chinese mathematical classic <i>Nine Chapters on the Mathematical Art</i>, written around 200 BCE. Chapter 8 solves systems of equations by arranging coefficients in columns and systematically eliminating unknowns — a method identical in spirit to what we do today. The word "matrix" did not exist yet, but the idea was already two thousand years old.
            </Callout>

            <p>The <b>word</b> "matrix" arrived in 1850, coined by the English mathematician <b>James Joseph Sylvester</b>. He chose the Latin for "womb" — the idea that the array is the object <i>from which</i> smaller arrays (determinants) are born. Sylvester's life was remarkable: Oxford barred him from a degree because he was Jewish. He practised law for fourteen years while doing mathematics in his spare time. He eventually became a professor at Johns Hopkins, where he founded the first American mathematics research journal, and later returned to Oxford as the Savilian Professor of Geometry.</p>

            <p>Sylvester's close friend <b>Arthur Cayley</b> took the decisive step. In his 1858 <i>Memoir on the Theory of Matrices</i>, Cayley defined how to <b>add</b> and <b>multiply</b> matrices as algebraic objects in their own right — not merely as shorthand for systems. This was the leap that made linear algebra a branch of mathematics rather than a computational trick. Cayley too had a double life: he spent fourteen years as a conveyancing barrister before becoming Sadlerian Professor of Pure Mathematics at Cambridge. He produced nearly a thousand papers. His students reported he could write mathematics faster than most people could write longhand, and never had to cross anything out.</p>

            <p>But looming over both is <b>Gauss</b>, whose 1801 prediction of Ceres opened this lecture. The elimination method he used is now called <b>Gaussian elimination</b>. Gauss was also the first to apply what we now call least-squares fitting — the foundation of modern statistics and machine learning — to the problem of fitting an orbit to imperfect telescope measurements. He was 18. He did not publish it until he was 25, by which point a French mathematician named Legendre had independently discovered the same method. The resulting priority dispute is one of the bitterest in mathematical history.</p>

            <Callout icon="🚀" title="Why this matters to you" color="amber">
              Every GPS calculation, every Netflix recommendation, every CT scan reconstruction, every neural network — all run on the same matrix machinery Gauss, Sylvester, and Cayley built. This is not ancient history. This is the infrastructure of the modern world.
            </Callout>

            {/* ─── LINEAR SYSTEMS ─── */}
            <Sec id="sys" n="§6">Solving Linear Equations</Sec>
            <p>Here begins the first main theme of the course. We start with the simplest building block, then scale up until we hit the wall that matrices are designed to break.</p>

            <DefBox term="Linear equation" color="teal">
              <p style={{margin:0}}>{String.raw`A `}<b>linear equation</b>{String.raw` in variables $x_1, x_2, \dots, x_n$ has the form $a_1 x_1 + a_2 x_2 + \cdots + a_n x_n = b$, where the $a_i$ and $b$ are constants. "Linear" means each variable appears to the first power only — no squares, no products like $xy$, no $\sqrt{x}$.`}</p>
            </DefBox>

            <p><b>Geometrically:</b>{String.raw` in two variables, $ax + by = c$ is a straight `}<b>line</b>{String.raw` in the plane. That is why it is called linear. In three variables, $ax + by + cz = d$ is a `}<b>plane</b>{String.raw` in space. We will return to this shortly — it is more subtle than it looks.`}</p>

            <Example n="9" title="Recognising linearity">
              <p>{String.raw`Linear: $\quad 3x - 2y = 7, \quad x + y + z = 0, \quad 2x_1 - x_2 + 5x_3 - x_4 = 11$.`}</p>
              <p>{String.raw`Not linear: $\quad x^2 + y = 4$ (square), $\quad xy = 1$ (product), $\quad \sin(x) = 0.5$ (transcendental). Even $\sqrt{x} + y = 3$ is not linear.`}</p>
            </Example>

            <p>A <b>system of linear equations</b> is a collection of linear equations that must all be satisfied simultaneously. Solving the system means finding the values of the unknowns that make every equation true at once.</p>

            <Example n="10" title="Elimination in two variables — the method">
              <p style={{textAlign:'center'}}>{String.raw`$$\begin{cases} x + y = 3 \\ x - y = 1 \end{cases}$$`}</p>
              <p><b>Elimination:</b>{String.raw` add both equations to cancel $y$: $(x+y)+(x-y) = 3+1$, so $2x = 4$, giving $x = 2$. Substitute back: $2 + y = 3$, so $y = 1$.`}</p>
              <p>{String.raw`Solution $(x,y) = (2,1)$. `}<b>Verify in both equations:</b>{String.raw` $2+1=3$ ✓ and $2-1=1$ ✓. Always check.`}</p>
              <p>{String.raw`Geometrically: each equation is a line. The solution is the `}<b>intersection point</b>{String.raw` of the two lines.`}</p>
            </Example>

            {/* THREE OUTCOMES */}
            <p style={{fontFamily:'var(--fh)',fontSize:'1.3rem',color:'var(--lec-ink)',margin:'36px 0 12px',fontWeight:600}}>The Three Possible Outcomes</p>
            <p>Two lines in a plane can relate in exactly three ways. This gives the fundamental trichotomy — which persists into all higher dimensions.</p>

            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:'16px',margin:'20px 0'}}>
              {[
                { icon:'✦', color:'#38c9b0', head:'Unique solution', body: String.raw`Lines cross at one point. E.g. $\begin{cases}x+y=3\\x-y=1\end{cases}$ → $(2,1)$.` },
                { icon:'∥', color:'#e06b6b', head:'No solution', body: String.raw`Parallel lines — same slope, different intercept. E.g. $\begin{cases}x+y=3\\x+y=5\end{cases}$ → $0=2$, impossible.` },
                { icon:'∞', color:'#9b80e8', head:'Infinitely many', body: String.raw`Same line — one equation is a multiple of the other. E.g. $\begin{cases}x+y=3\\2x+2y=6\end{cases}$ → one redundant equation.` },
              ].map(c=>(
                <div key={c.head} style={{background:'rgba(255,255,255,.97)',border:`1px solid ${c.color}40`,borderTop:`3px solid ${c.color}`,borderRadius:'12px',padding:'18px 20px',boxShadow:'0 2px 14px rgba(60,40,20,.06)'}}>
                  <div style={{fontSize:'1.4rem',color:c.color,marginBottom:'8px'}}>{c.icon}</div>
                  <div style={{fontFamily:'var(--fh)',fontSize:'1.05rem',color:'var(--lec-ink)',marginBottom:'8px',fontWeight:600}}>{c.head}</div>
                  <div style={{fontSize:'.88rem',color:'var(--lec-ink2)',lineHeight:1.65}}>{c.body}</div>
                </div>
              ))}
            </div>

            <DefBox term="The fundamental trichotomy" color="teal">
              <p style={{margin:0}}>A system of linear equations has either <b>exactly one solution</b>, <b>no solution</b>, or <b>infinitely many solutions</b>. There is no fourth possibility — you cannot have, say, exactly two solutions. This fact, which seems almost obvious in 2D, remains true in any number of dimensions and will be proved rigorously later in the course.</p>
            </DefBox>

            {/* FROM 2D TO 3D */}
            <p style={{fontFamily:'var(--fh)',fontSize:'1.3rem',color:'var(--lec-ink)',margin:'36px 0 12px',fontWeight:600}}>From 2D to 3D — Something Subtle</p>

            <p>{String.raw`In the plane $\mathbb{R}^2$, the equation $2x + 3y = 4$ is a `}<b>line</b>{String.raw`. Now move to space $\mathbb{R}^3$ and ask: what does `}<i>the same equation</i>{String.raw` describe there?`}</p>
            <p>{String.raw`Your first instinct might be "still a line" — but it is wrong. The equation says nothing about $z$. So $z$ is completely `}<b>free</b>{String.raw` — any value of $z$ works. The solution set in $\mathbb{R}^3$ is every point $(x,y,z)$ where $2x+3y=4$ and $z$ is arbitrary. Imagine the line $2x+3y=4$ in the floor of a room; now sweep it straight up and down through every height. The result is a vertical `}<b>plane</b>.</p>

            <DefBox term="Missing variable = free variable" color="violet">
              <p style={{margin:0}}>{String.raw`When a variable does not appear in an equation, it is `}<b>free</b>{String.raw` — unconstrained, able to take any value. In $\mathbb{R}^3$, an equation missing $z$ sweeps its 2D graph into a plane. In $\mathbb{R}^4$, missing $z$ and $w$ would sweep a 2D solution into a 2D affine subspace. The general principle: each missing variable adds one dimension to the solution set.`}</p>
            </DefBox>

            <p>Interact with this below. Set {String.raw`$c = 0$`} to remove $z$ and watch the tilted plane flatten into a vertical sheet.</p>

            <PlaneWidget/>

            <Example n="11" title="Elimination in three variables — the method gets longer">
              <p style={{textAlign:'center'}}>{String.raw`$$\begin{cases} x + y + z = 6 \\ x - y + z = 2 \\ 2x + y - z = 1 \end{cases}$$`}</p>
              <p><b>Step 1.</b>{String.raw` Eliminate $x$ from equations 2 and 3.`}</p>
              <p>{String.raw`Eq 1 $-$ Eq 2: $2y = 4$, so $y = 2$ immediately.`}</p>
              <p>{String.raw`Eq 3 $- 2\times$Eq 1: $-y - 3z = -11$; substituting $y=2$: $z = 3$.`}</p>
              <p><b>Step 2.</b>{String.raw` Back-substitute into Eq 1: $x + 2 + 3 = 6 \Rightarrow x = 1$.`}</p>
              <p>{String.raw`Solution $(1, 2, 3)$. Check in Eq 3: $2(1)+2-3 = 1$ ✓. With 2 variables we needed one step; with 3, we needed three coordinated stages.`}</p>
            </Example>

            <Example n="12" title="When the numbers are not friendly" advanced>
              <p style={{textAlign:'center'}}>{String.raw`$$\begin{cases} x + y + z = 6 \\ 2x - y + z = 3 \\ x + 2y - z = 3 \end{cases}$$`}</p>
              <p>{String.raw`Eq 2 $- 2\times$Eq 1 gives $-3y - z = -9$; Eq 3 $-$ Eq 1 gives $y - 2z = -3$. From the second, $y = 2z-3$. Substituting: $-3(2z-3)-z = -9 \Rightarrow -7z = -18 \Rightarrow z = \tfrac{18}{7}$. Now $y$ and $x$ are also fractions. Nothing went wrong — this is what `}<i>generic</i>{String.raw` systems look like. The point: elimination works but `}<b>the work compounds alarmingly as variables increase</b>.</p>
            </Example>

            <p>With two variables, one elimination step was enough. With three, we needed two stages. With four variables we would need three stages; five variables, four stages; and so on. The work grows as the square of the number of variables. For the kind of systems that arise in modern applications — machine learning models regularly solve systems with millions of variables — raw elimination on the original equations is completely impractical. We need a smarter representation.</p>

            <Callout icon="💬" title="Slope in higher dimensions" color="violet">
              {String.raw`A line $ax + by = c$ has slope $-a/b$ — one number capturing its direction. In 3D a direction needs three numbers (direction ratios). In $n$ dimensions it needs $n$ numbers. The variables $x, y, z, \dots$ are just labels for these dimensions. They tell us nothing that the coefficients do not already tell us. So why keep writing them?`}
            </Callout>

            {/* ─── MATRIX FORM & REF ─── */}
            <Sec id="matform" n="§7">The Matrix Method — Strip the Variables, Keep the Numbers</Sec>

            <p>Here is the key insight: in every step of elimination, the variables $x, y, z$ play no role. We add and subtract equations — but it is only the <b>coefficients</b> and <b>constants</b> that change. The variables are passengers. So we throw them off the bus.</p>

            <p>Collect the coefficients into one matrix, the unknowns into a column, the constants into another column. The system becomes:</p>

            <div style={{textAlign:'center',margin:'28px 0'}}>
              <p style={{margin:0}}>{String.raw`$$\underbrace{\begin{pmatrix} a_{11} & a_{12} & \cdots & a_{1n} \\ a_{21} & a_{22} & \cdots & a_{2n} \\ \vdots & \vdots & \ddots & \vdots \\ a_{m1} & a_{m2} & \cdots & a_{mn} \end{pmatrix}}_{\large A\ (\text{coefficient matrix})} \underbrace{\begin{pmatrix} x_1 \\ x_2 \\ \vdots \\ x_n \end{pmatrix}}_{\large X\ (\text{unknowns})} = \underbrace{\begin{pmatrix} b_1 \\ b_2 \\ \vdots \\ b_m \end{pmatrix}}_{\large b\ (\text{constants})}$$`}</p>
              <p style={{fontFamily:'var(--fh)',fontSize:'1.5rem',color:'var(--lec-ink)',marginTop:'20px',marginBottom:0}}>{String.raw`$$A\,X = b$$`}</p>
            </div>

            <DefBox term="Sort before you convert" color="amber">
              <p style={{margin:0}}>Before building $A$, <b>align the variables in the same order in every equation</b>. A missing variable contributes a coefficient of $0$ — write it. If the equations are not aligned, the matrix is meaningless — different columns will correspond to different variables in different rows.</p>
            </DefBox>

            <Example n="13" title="Converting to Ax = b, correctly and incorrectly">
              <p>{String.raw`System: $\begin{cases} 2x + 3y = 8 \\ x - y = -1 \end{cases}$. Both equations already list $x$ then $y$, so:`}</p>
              <p>{String.raw`$\quad A = \begin{pmatrix}2&3\\1&-1\end{pmatrix},\quad X = \begin{pmatrix}x\\y\end{pmatrix},\quad b = \begin{pmatrix}8\\-1\end{pmatrix}.$`}</p>
              <p>{String.raw`Now consider $\begin{cases} y + 2x = 8 \\ x - y = -1\end{cases}$. The first equation lists $y$ before $x$. If you copy the coefficients naively you get $A' = \begin{pmatrix}1&2\\1&-1\end{pmatrix}$ — `}<b>wrong</b>{String.raw`, because now column 1 means $y$ in row 1 but $x$ in row 2. Always re-sort to $x$ first, then $y$, before extracting coefficients.`}</p>
            </Example>

            {/* AUGMENTED MATRIX */}
            <p style={{fontFamily:'var(--fh)',fontSize:'1.3rem',color:'var(--lec-ink)',margin:'36px 0 12px',fontWeight:600}}>The Augmented Matrix</p>

            <p>{String.raw`For solving, we attach the constants to the coefficient matrix as one extra column separated by a bar. This is the `}<b>augmented matrix</b>{String.raw` $(A\mid b)$:`}</p>
            <p style={{textAlign:'center'}}>{String.raw`$$(A\mid b)=\left(\begin{array}{cccc|c}a_{11}&a_{12}&\cdots&a_{1n}&b_1\\a_{21}&a_{22}&\cdots&a_{2n}&b_2\\\vdots&\vdots&\ddots&\vdots&\vdots\\a_{m1}&a_{m2}&\cdots&a_{mn}&b_m\end{array}\right)$$`}</p>
            <p>The bar marks where the equals sign was. Everything left of it is a coefficient; the single column right of it holds the constants. Operating on the augmented matrix is equivalent to performing elimination on the equations — but without ever writing $x$, $y$, or $z$.</p>

            <Example n="14" title="Full conversion — both notations">
              <p>{String.raw`System: $\begin{cases} x + y + z = 6 \\ 2x - y + z = 3 \\ x + 2y - z = 3 \end{cases}$`}</p>
              <p>{String.raw`As $AX = b$: $\quad \begin{pmatrix}1&1&1\\2&-1&1\\1&2&-1\end{pmatrix}\begin{pmatrix}x\\y\\z\end{pmatrix}=\begin{pmatrix}6\\3\\3\end{pmatrix}$`}</p>
              <p>{String.raw`Augmented: $\quad \left(\begin{array}{ccc|c}1&1&1&6\\2&-1&1&3\\1&2&-1&3\end{array}\right)$`}</p>
            </Example>

            <Example n="15" title="Handling missing variables">
              <p>{String.raw`System: $\begin{cases} 2x - y = 4 \\ z = 3 \end{cases}$. The first has no $z$; the second has no $x$ or $y$. Fill with zeros:`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$\left(\begin{array}{ccc|c}2&-1&0&4\\0&0&1&3\end{array}\right)$$`}</p>
              <p>{String.raw`Temptation: should we add a third row of zeros to make it square? The row $(0\ 0\ 0\mid 0)$ reads $0=0$ — true always, containing zero information. This `}<b>redundant (trivial) row</b>{String.raw` can be appended endlessly without changing the system. It is not wrong, but it is clutter. Leave it out.`}</p>
            </Example>

            <Example n="16" title="Reading disaster from a row" advanced>
              <p>{String.raw`Suppose elimination on some system produces:`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$\left(\begin{array}{ccc|c}1&2&-1&4\\0&1&3&2\\0&0&0&5\end{array}\right).$$`}</p>
              <p>{String.raw`Read the bottom row: $0x + 0y + 0z = 5$, i.e. $0 = 5$. `}<b>Impossible.</b>{String.raw` No values of $x, y, z$ can satisfy this. The system has `}<b>no solution</b>{String.raw`. Whenever elimination produces a row of the form $(0\ 0\ \cdots\ 0 \mid k)$ with $k \neq 0$, you can stop: the system is inconsistent. One glance at the augmented matrix answers the question.`}</p>
            </Example>

            {/* WHY REF */}
            <p style={{fontFamily:'var(--fh)',fontSize:'1.3rem',color:'var(--lec-ink)',margin:'36px 0 12px',fontWeight:600}}>A Matrix That Reads Off Its Own Solution</p>

            <p>All the hard work is justified by one payoff. Suppose, after operating on the augmented matrix, we arrive at:</p>
            <p style={{textAlign:'center'}}>{String.raw`$$\left(\begin{array}{ccc|c}1&2&-1&3\\0&1&4&5\\0&0&1&2\end{array}\right)$$`}</p>
            <p>{String.raw`Bottom row: $z = 2$. Middle row: $y + 4(2) = 5 \Rightarrow y = -3$. Top row: $x + 2(-3) - 2 = 3 \Rightarrow x = 11$. No elimination loops — just `}<b>read from the bottom up</b>{String.raw`. This is `}<b>back-substitution</b>{String.raw`, and it is trivial once the matrix is in the right shape. The shape is called `}<b>row-echelon form</b>.</p>

            {/* REF */}
            <Sec id="ref" n="§8">Row-Echelon Form &amp; Pivots</Sec>

            <p>What made that matrix so readable? Three things:</p>
            <p>{String.raw`(1) The first nonzero entry of each row is a `}<b>1</b>{String.raw`. (2) Everything `}<b>below</b>{String.raw` that 1 in its column is `}<b>zero</b>{String.raw`. (3) Each leading 1 sits `}<b>further right</b>{String.raw` than the one in the row above — a staircase stepping down and to the right.`}</p>

            <DefBox term="Row-echelon form (Nicholson's definition)" color="amber">
              <p style={{margin:'0 0 10px'}}>A matrix is in <b>row-echelon form (REF)</b> if:</p>
              <p style={{margin:'0 0 6px'}}><b>1.</b> All zero rows sit at the bottom.</p>
              <p style={{margin:'0 0 6px'}}>{String.raw`**2.** The first nonzero entry in each nonzero row is a $\mathbf{1}$ — called the `}<b>leading 1</b>{String.raw` (or `}<b>pivot</b>{String.raw`) for that row.`}</p>
              <p style={{margin:0}}><b>3.</b> Each leading 1 is strictly to the right of the leading 1 in every row above it.</p>
            </DefBox>

            <Reveal label="Convention note — other textbooks differ">
              <p style={{margin:0}}>{String.raw`Many books (Lay, Strang) define REF with a weaker condition: the pivot need only be `}<i>nonzero</i>{String.raw`, not necessarily 1. Under their definition, $\begin{pmatrix}2&4&1\\0&3&5\\0&0&7\end{pmatrix}$ is in REF. Under `}<b>Nicholson's definition</b>{String.raw` (which we follow) it is not, because the pivots are 2, 3, 7 rather than 1. Neither convention is "wrong" — they are choices. In this course: `}<b>pivots are always 1</b>{String.raw`. If you open a different book and see non-1 pivots in "REF," it is a convention difference, not an error.`}</p>
            </Reveal>

            <DefBox term="Reduced row-echelon form (RREF)" color="violet">
              <p style={{margin:0}}>A row-echelon matrix is in <b>reduced row-echelon form</b> if, in addition, each leading 1 is the <b>only nonzero entry in its entire column</b> — zeros above it as well as below. RREF eliminates the need for back-substitution: the solution reads off directly.</p>
            </DefBox>

            <Example n="17" title="REF versus RREF — the same system carried further">
              <p>{String.raw`After elimination on $\begin{cases}x+2y=5\\3x+5y=12\end{cases}$ we reach `}<b>REF</b>{String.raw`:`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$\left(\begin{array}{cc|c}1&2&5\\0&1&3\end{array}\right).$$`}</p>
              <p>{String.raw`Back-substitute: $y=3$, then $x+6=5 \Rightarrow x=-1$. Now do one more step — subtract $2\times$row 2 from row 1 — to reach `}<b>RREF</b>{String.raw`:`}</p>
              <p style={{textAlign:'center'}}>{String.raw`$$\left(\begin{array}{cc|c}1&0&-1\\0&1&3\end{array}\right).$$`}</p>
              <p>{String.raw`Read off: $x=-1$, $y=3$. No substitution. RREF does more work up front to eliminate all work at the end.`}</p>
            </Example>

            <Example n="18" title="Spotting pivots" advanced>
              <p>{String.raw`In $\left(\begin{array}{ccccc}1&3&0&2&-1\\0&0&1&4&5\\0&0&0&1&2\\0&0&0&0&0\end{array}\right)$ the pivots are the three leading 1s, in columns 1, 3, 4 — column 2 is simply skipped (allowed). Zero row safely at the bottom. The `}<b>pivot columns</b>{String.raw` (1, 3, 4) are fundamental: they correspond to the "determined" variables. The `}<b>free columns</b>{String.raw` (2, 5) correspond to variables you can set freely. This distinction drives everything in the next two lectures.`}</p>
            </Example>

            {/* APPLET */}
            <Sec id="check" n="§9">Practise — Is It in REF?</Sec>
            <p>Before we learn <i>how</i> to produce row-echelon form, you need to be able to <i>recognise</i> it. Work through each matrix below. Apply the three conditions from the definition. Click your answer and read the explanation.</p>

            <RefChecker/>

            <Callout icon="🔜" title="What comes next" color="teal">
              In Lecture 2 we learn the <b>three elementary row operations</b> — the actual mechanical steps for converting any matrix into row-echelon form. These operations are the engine of Gaussian elimination; everything above is the language that lets us describe what the engine is doing.
            </Callout>

            <div style={{ marginTop:'64px', paddingTop:'28px', borderTop:'2px solid var(--lec-border)', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'12px' }}>
              <div style={{ fontFamily:'var(--fm)', fontSize:'.76rem', color:'var(--lec-ink3)', fontStyle:'italic' }}>Lecture 1 — complete</div>
              <div style={{ fontFamily:'var(--fm)', fontSize:'.76rem', color:'var(--lec-ink3)' }}>MATH-120 · Shoaib Khan · LUMS · June 2026</div>
            </div>

          </div>

          {/* FOOTER NAV */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'22px 48px', borderTop:'1px solid var(--lec-border)', background:'var(--lec-paper)', flexWrap:'wrap', gap:'12px' }}>
            <Link href={PREV_HREF} style={{ fontFamily:'var(--fm)', fontSize:'.74rem', letterSpacing:'.08em', textTransform:'uppercase', color:'var(--lec-accent)', textDecoration:'none' }}>← Course Home</Link>
            <Link href={NEXT_HREF} style={{ fontFamily:'var(--fm)', fontSize:'.74rem', letterSpacing:'.08em', textTransform:'uppercase', color:'var(--lec-accent)', textDecoration:'none' }}>Lecture 2 →</Link>
          </div>
        </main>
      </div>

      <Footer/>
    </>
  );
}