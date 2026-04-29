'use client';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Script from 'next/script';

// ─── Styles ────────────────────────────────────────────────────────────────
const S = {
  stickySubnav: { position: 'sticky', top: 'calc(var(--nav-h) + 3px)', zIndex: 500, background: 'var(--bg2)', borderBottom: '1px solid var(--border)' },
  bcRow: { padding: '8px 24px', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--fm)', fontSize: '.72rem', color: 'var(--text3)', borderBottom: '1px solid var(--border)' },
  bcLink: { color: 'var(--amber)', textDecoration: 'none' },
  bcCur: { color: 'var(--text2)', fontWeight: 500 },
  courseSwitcher: { display: 'flex', alignItems: 'center', padding: '0 24px', overflowX: 'auto' },
  cswLink: { fontFamily: 'var(--fm)', fontSize: '.72rem', letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--text3)', padding: '9px 18px', borderBottom: '2px solid transparent', whiteSpace: 'nowrap', transition: 'all .2s', textDecoration: 'none' },
  cswActive: { color: 'var(--amber)', borderBottom: '2px solid var(--amber)' },
  courseFrame: { display: 'flex', paddingTop: 'calc(var(--nav-h) + 3px)', minHeight: '100vh' },
  csb: { width: '252px', flexShrink: 0, position: 'sticky', top: 'calc(var(--nav-h) + 3px + 37px + 40px)', height: 'calc(100vh - var(--nav-h) - 80px)', overflowY: 'auto', background: 'var(--bg2)', borderRight: '1px solid var(--border)' },
  csbHead: { padding: '18px 16px 12px', borderBottom: '1px solid var(--border)' },
  csbTag: { fontFamily: 'var(--fm)', fontSize: '.6rem', letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--amber)', marginBottom: '4px' },
  csbTitle: { fontFamily: 'var(--fh)', fontSize: '.95rem', color: 'var(--text)', lineHeight: 1.3 },
  csbBack: { display: 'inline-flex', alignItems: 'center', gap: '5px', fontFamily: 'var(--fm)', fontSize: '.68rem', color: 'var(--text3)', marginTop: '8px', textDecoration: 'none' },
  cmain: { flex: 1, minWidth: 0, background: '#fdf8f0', overflow: 'hidden', fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.05rem', lineHeight: 1.8, color: '#1a1a2e' },
  lecInner: { maxWidth: '100%', margin: '0 auto', padding: '0 52px 60px' },
  lecHero: { background: '#1a1a2e', color: '#fdf8f0', padding: '52px 40px 44px', textAlign: 'center', position: 'relative', overflow: 'hidden' },
  lecHeroTag: { fontFamily: "'IBM Plex Mono', monospace", fontSize: '.72rem', letterSpacing: '.22em', textTransform: 'uppercase', color: '#d4a017', marginBottom: '14px', position: 'relative' },
  lecHeroH1: { fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(2rem,4vw,3.4rem)', fontWeight: 700, lineHeight: 1.12, marginBottom: '14px', position: 'relative' },
  lecHeroP: { fontSize: '1rem', color: '#c9c2b8', maxWidth: '560px', margin: '0 auto 24px', position: 'relative' },
  lecHeroLine: { width: '56px', height: '3px', background: '#d4a017', margin: '0 auto' },
  lecNav: { background: 'rgba(253,248,240,.97)', backdropFilter: 'blur(8px)', borderBottom: '1px solid #e0d6c8', padding: '8px 20px', display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center' },
  lecNavA: { fontFamily: "'IBM Plex Mono', monospace", fontSize: '.64rem', letterSpacing: '.08em', textTransform: 'uppercase', color: '#7f8c8d', textDecoration: 'none', padding: '4px 11px', borderRadius: '20px', border: '1px solid #e0d6c8', transition: 'all .2s' },
  card: { background: '#fff', border: '1px solid #e0d6c8', borderRadius: '12px', padding: '30px 34px', boxShadow: '0 4px 24px rgba(26,26,46,.10)', marginBottom: '26px' },
  cardAl: { borderLeft: '4px solid #c0392b' },
  cardGl: { borderLeft: '4px solid #d4a017' },
  cardTl: { borderLeft: '4px solid #1a6b6b' },
  cardSl: { borderLeft: '4px solid #2980b9' },
  cardPl: { borderLeft: '4px solid #27ae60' },
  defBox: { background: '#eef7f7', border: '1.5px solid #1a6b6b', borderRadius: '8px', padding: '22px 26px', margin: '22px 0' },
  thmBox: { background: '#fff8ec', border: '1.5px solid #d4a017', borderRadius: '8px', padding: '22px 26px', margin: '22px 0' },
  noteBox: { background: '#f0f4ff', border: '1.5px solid #2980b9', borderRadius: '8px', padding: '20px 24px', margin: '20px 0' },
  lbl: { fontFamily: "'IBM Plex Mono', monospace", fontSize: '.68rem', letterSpacing: '.15em', textTransform: 'uppercase', fontWeight: 600, marginBottom: '8px' },
  callout: { background: '#fdf0ef', borderLeft: '4px solid #c0392b', borderRadius: '0 8px 8px 0', padding: '15px 20px', margin: '18px 0', fontSize: '.97rem' },
  calloutTeal: { background: '#eef7f7', borderLeft: '4px solid #1a6b6b', borderRadius: '0 8px 8px 0', padding: '15px 20px', margin: '18px 0', fontSize: '.97rem' },
  calloutGold: { background: '#fff8ec', borderLeft: '4px solid #d4a017', borderRadius: '0 8px 8px 0', padding: '15px 20px', margin: '18px 0', fontSize: '.97rem' },
  calloutGreen: { background: '#f0faf4', borderLeft: '4px solid #27ae60', borderRadius: '0 8px 8px 0', padding: '15px 20px', margin: '18px 0', fontSize: '.97rem' },
  toggleBtn: { fontFamily: "'IBM Plex Mono', monospace", fontSize: '.76rem', letterSpacing: '.1em', textTransform: 'uppercase', background: '#1a1a2e', color: '#d4a017', border: 'none', borderRadius: '6px', padding: '9px 20px', cursor: 'pointer', marginTop: '10px', transition: 'opacity .2s' },
  answerBox: { background: '#f0f9f0', border: '1.5px solid #27ae60', borderRadius: '8px', padding: '18px 22px', marginTop: '12px' },
  secLabel: { fontFamily: "'IBM Plex Mono', monospace", fontSize: '.68rem', letterSpacing: '.26em', textTransform: 'uppercase', color: '#c0392b', marginBottom: '8px' },
  subsec: { fontFamily: "'IBM Plex Mono', monospace", fontSize: '.74rem', letterSpacing: '.18em', textTransform: 'uppercase', color: '#2980b9', margin: '44px 0 6px', paddingBottom: '6px', borderBottom: '1px solid #e0d6c8' },
  bf: { textAlign: 'center', fontSize: '1.12rem', padding: '26px 18px', background: '#f5ede0', borderRadius: '10px', margin: '22px 0' },
  divider: { width: '100%', height: '1px', background: '#e0d6c8', margin: '52px 0' },
  subDivider: { width: '100%', height: '1px', background: '#e0d6c8', margin: '36px 0' },
  ruleHL: { background: '#f5ede0', borderRadius: '8px', padding: '18px 20px', textAlign: 'center', margin: '14px 0', fontSize: '1.05rem' },
  widget: { background: '#1a1a2e', borderRadius: '16px', padding: '26px 26px 18px', margin: '30px 0', color: '#e8e2d9' },
  wt: { fontFamily: "'IBM Plex Mono', monospace", fontSize: '.75rem', letterSpacing: '.18em', textTransform: 'uppercase', color: '#d4a017', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' },
  lecFooterNav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '28px 40px', borderTop: '1px solid #e0d6c8', flexWrap: 'wrap', gap: '12px', background: '#fdf8f0' },
  lnfBtnPrev: { display: 'inline-flex', alignItems: 'center', gap: '8px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '.74rem', letterSpacing: '.08em', textTransform: 'uppercase', color: '#2980b9', border: '1px solid #2980b9', background: '#f0f4ff', padding: '8px 18px', borderRadius: '8px', textDecoration: 'none' },
  lnfBtnNext: { display: 'inline-flex', alignItems: 'center', gap: '8px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '.74rem', letterSpacing: '.08em', textTransform: 'uppercase', color: '#1a6b6b', border: '1px solid #1a6b6b', background: '#eef7f7', padding: '8px 18px', borderRadius: '8px', textDecoration: 'none' },
  table: { width: '100%', borderCollapse: 'collapse', margin: '14px 0', fontSize: '.94rem' },
  th: { background: '#1a1a2e', color: '#d4a017', fontFamily: "'IBM Plex Mono', monospace", fontSize: '.72rem', letterSpacing: '.1em', padding: '9px 13px', textAlign: 'left' },
  td: { padding: '8px 13px', borderBottom: '1px solid #e0d6c8' },
  tdEven: { padding: '8px 13px', borderBottom: '1px solid #e0d6c8', background: '#f5ede0' },
  h2: { fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(1.7rem,4vw,2.55rem)', fontWeight: 700, marginBottom: '20px', lineHeight: 1.2, color: '#1a1a2e' },
  h3teal: { fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.32rem', fontWeight: 700, margin: '30px 0 12px', color: '#1a6b6b' },
  h4red: { fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.1rem', fontWeight: 700, margin: '0 0 8px', color: '#c0392b' },
  h4gold: { fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.1rem', fontWeight: 700, margin: '0 0 8px', color: '#d4a017' },
  h4teal: { fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.1rem', fontWeight: 700, margin: '0 0 8px', color: '#1a6b6b' },
  h4blue: { fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.1rem', fontWeight: 700, margin: '0 0 8px', color: '#2980b9' },
  h4green: { fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.1rem', fontWeight: 700, margin: '0 0 8px', color: '#27ae60' },
  sep: { borderTop: '1px solid #e0d6c8', paddingTop: '14px', marginTop: '14px' },
  p: { marginBottom: '16px', color: '#1a1a2e' },
  approachStep: { background: '#fff', border: '1px solid #e0d6c8', borderRadius: '10px', padding: '20px 24px', marginBottom: '16px' },
  stepLabel: { fontFamily: "'IBM Plex Mono', monospace", fontSize: '.62rem', letterSpacing: '.16em', textTransform: 'uppercase', color: '#c0392b', marginBottom: '6px' },
  stepTitle: { fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.05rem', fontWeight: 700, color: '#1a1a2e', marginBottom: '8px' },
  ruleCard: { background: '#fff', border: '1px solid #e0d6c8', borderRadius: '10px', padding: '18px 22px' },
  rlbl: { fontFamily: "'IBM Plex Mono', monospace", fontSize: '.62rem', letterSpacing: '.14em', textTransform: 'uppercase', color: '#1a6b6b', marginBottom: '8px' },
};

// ─── TOC ──────────────────────────────────────────────────────────────────
const TOC = [
  { ch: 'Course Overview', items: [{ label: 'Course Overview', href: '/courses/calc1' }] },
  { ch: 'Ch 1 — Functions, Graphs & Limits', items: ['1.1 · Functions','1.2 · The Graph of a Function','1.3 · Lines and Linear Functions','1.4 · Functional Models','1.5 · Limits','1.6 · One-Sided Limits and Continuity'].map(l=>({label:l,soon:true})) },
  { ch: 'Ch 2 — Differentiation: Basic Concepts', items: ['2.1 · The Derivative','2.2 · Techniques of Differentiation','2.3 · Product and Quotient Rules','2.4 · The Chain Rule','2.5 · Marginal Analysis','2.6 · Implicit Differentiation'].map(l=>({label:l,soon:true})) },
  { ch: 'Ch 3 — Applications of the Derivative', items: ['3.1 · Increasing & Decreasing Functions','3.2 · Concavity & Inflection Points','3.3 · Curve Sketching','3.4 · Optimization; Elasticity','3.5 · Additional Optimization'].map(l=>({label:l,soon:true})) },
  { ch: 'Ch 4 — Exponential & Logarithmic Functions', items: ['4.1 · Exponential Functions','4.2 · Logarithmic Functions','4.3 · Differentiation of Exp & Log','4.4 · Exponential Models'].map(l=>({label:l,soon:true})) },
  { ch: 'Ch 5 — Integration', items: [
    { label: '5.1 · Indefinite Integration', href: '/courses/calc1/s51', live: true },
    { label: '5.2 · Integration by Substitution', href: '/courses/calc1/s52', live: true },
    { label: '5.3 · The Definite Integral & FTC', href: '/courses/calc1/s53', active: true, live: true },
    { label: '5.4 · Applying Definite Integration', soon: true },
    { label: '5.5 · Applications to Business', soon: true },
  ]},
  { ch: 'Ch 6 — Additional Integration Topics', items: ['6.1 · Integration by Parts','6.2 · Numerical Integration','6.3 · Improper Integrals','6.4 · Continuous Probability'].map(l=>({label:l,soon:true})) },
];

// ─── ToggleAnswer ─────────────────────────────────────────────────────────
function ToggleAnswer({ label = 'Show Solution', children }) {
  const ref = useRef(null);
  const toggle = () => {
    const el = ref.current;
    if (!el) return;
    const visible = el.style.display === 'block';
    el.style.display = visible ? 'none' : 'block';
    if (!visible && window.MathJax?.typesetPromise) window.MathJax.typesetPromise([el]);
  };
  return (
    <>
      <button style={S.toggleBtn} onClick={toggle}>{label}</button>
      <div ref={ref} style={{ ...S.answerBox, display: 'none' }}>{children}</div>
    </>
  );
}

// ─── Canvas draw helpers (run client-side only) ────────────────────────────
const FDATA = {
  sq:       { fn: x => x*x/10+0.5,                               exact: (a,b) => (Math.pow(b,3)-Math.pow(a,3))/30+0.5*(b-a) },
  sin:      { fn: x => 2*Math.sin(x/2)+2.5,                      exact: (a,b) => -4*Math.cos(b/2)+4*Math.cos(a/2)+2.5*(b-a) },
  bell:     { fn: x => 4*Math.exp(-Math.pow(x-5,2)/4),           exact: null },
  wave:     { fn: x => 3*Math.sin(x/3)+Math.cos(x)+3,            exact: (a,b) => -9*Math.cos(b/3)+9*Math.cos(a/3)+Math.sin(b)-Math.sin(a)+3*(b-a) },
  sqrt:     { fn: x => Math.sqrt(2*x)+1,                         exact: (a,b) => Math.SQRT2*(2/3)*(Math.pow(b,1.5)-Math.pow(a,1.5))+(b-a) },
  logistic: { fn: x => 5/(1+Math.exp(-(x-5))),                   exact: null },
};

function numInt(fn, a, b) {
  const steps = 4000, dx = (b-a)/steps;
  let s = 0;
  for (let i = 0; i < steps; i++) s += fn(a+(i+0.5)*dx)*dx;
  return s;
}

function drawRiemannCanvas(canvas, fnKey, rule, rN) {
  if (!canvas || !canvas.clientWidth) return;
  const d = FDATA[fnKey] || FDATA.sq;
  const fn = d.fn, a = 0, b = 10;
  const W = canvas.clientWidth, H = 260;
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');
  const padL=52, padR=20, padT=18, padB=34;
  const gW = W-padL-padR, gH = H-padT-padB;
  let yMax = 0;
  for (let i=0;i<=400;i++){const y=fn(a+(b-a)*i/400); if(y>yMax) yMax=y;}
  yMax = yMax*1.25; if(yMax<0.5) yMax=1;
  const tX = x => padL+(x-a)/(b-a)*gW;
  const tY = y => padT+gH-Math.max(0,y)/yMax*gH;
  ctx.fillStyle='#111827'; ctx.fillRect(0,0,W,H);
  ctx.font='10px IBM Plex Mono,monospace';
  for (let gi=0;gi<=4;gi++){
    const gy=yMax*gi/4;
    ctx.strokeStyle='#1f2937'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(padL,tY(gy)); ctx.lineTo(padL+gW,tY(gy)); ctx.stroke();
    ctx.fillStyle='#6b7280'; ctx.textAlign='right';
    ctx.fillText(gy.toFixed(1),padL-5,tY(gy)+4);
  }
  const dx = (b-a)/rN; let sumArea = 0;
  for (let i=0;i<rN;i++){
    let xs; if(rule==='left') xs=a+i*dx; else if(rule==='right') xs=a+(i+1)*dx; else xs=a+(i+0.5)*dx;
    const h=fn(xs); if(h<=0) continue; sumArea+=h*dx;
    const rx=tX(a+i*dx), rw=Math.max(1,tX(a+(i+1)*dx)-rx);
    ctx.fillStyle='rgba(212,160,23,0.30)'; ctx.fillRect(rx,tY(h),rw,tY(0)-tY(h));
    ctx.strokeStyle='#d4a017'; ctx.lineWidth=rN>80?0.5:1.2; ctx.strokeRect(rx,tY(h),rw,tY(0)-tY(h));
  }
  ctx.beginPath(); ctx.moveTo(tX(a),tY(fn(a)));
  for(let i=1;i<=500;i++){const x=a+(b-a)*i/500; ctx.lineTo(tX(x),tY(fn(x)));}
  ctx.strokeStyle='#60a5fa'; ctx.lineWidth=2.5; ctx.stroke();
  ctx.strokeStyle='#4b5563'; ctx.lineWidth=1.5;
  ctx.beginPath(); ctx.moveTo(padL,padT); ctx.lineTo(padL,padT+gH); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(padL,padT+gH); ctx.lineTo(padL+gW,padT+gH); ctx.stroke();
  ctx.fillStyle='#9ca3af'; ctx.textAlign='center';
  for (let xi=0;xi<=10;xi+=2) ctx.fillText(xi,tX(xi),H-6);
  const ex = d.exact ? d.exact(a,b) : numInt(fn,a,b);
  return { dx: dx.toFixed(3), approx: sumArea.toFixed(4), exact: ex.toFixed(4), err: Math.abs(sumArea-ex).toFixed(4) };
}

function drawSignedCanvas(canvas, b) {
  if (!canvas) return;
  const dpr = window.devicePixelRatio||1;
  canvas.width = canvas.offsetWidth*dpr; canvas.height = 240*dpr;
  const ctx = canvas.getContext('2d'); ctx.scale(dpr,dpr);
  const W=canvas.offsetWidth, H=240, pad={l:44,r:16,t:14,b:30};
  const gW=W-pad.l-pad.r, gH=H-pad.t-pad.b;
  const dA=0, dB=10, yMin=-1.3, yMax=1.3;
  const tX=x=>pad.l+(x-dA)/(dB-dA)*gW;
  const tY=y=>pad.t+gH-(y-yMin)/(yMax-yMin)*gH;
  const fn=x=>Math.sin(x);
  ctx.fillStyle='#111827'; ctx.fillRect(0,0,W,H);
  ctx.strokeStyle='#374151'; ctx.lineWidth=1;
  ctx.beginPath(); ctx.moveTo(pad.l,tY(0)); ctx.lineTo(pad.l+gW,tY(0)); ctx.stroke();
  ctx.strokeStyle='#4b5563'; ctx.lineWidth=1.5;
  ctx.beginPath(); ctx.moveTo(pad.l,pad.t); ctx.lineTo(pad.l,pad.t+gH); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(pad.l,pad.t+gH); ctx.lineTo(pad.l+gW,pad.t+gH); ctx.stroke();
  for(let i=0;i<500;i++){
    const x1=i/500*b,x2=(i+1)/500*b,y1=fn(x1),y2=fn(x2),avgY=(y1+y2)/2;
    ctx.beginPath(); ctx.moveTo(tX(x1),tY(0)); ctx.lineTo(tX(x1),tY(y1)); ctx.lineTo(tX(x2),tY(y2)); ctx.lineTo(tX(x2),tY(0)); ctx.closePath();
    ctx.fillStyle=avgY>=0?'rgba(41,128,185,.5)':'rgba(192,57,43,.5)'; ctx.fill();
  }
  ctx.beginPath(); ctx.moveTo(tX(0),tY(fn(0)));
  for(let i=1;i<=400;i++){const x=dA+(dB-dA)*i/400; ctx.lineTo(tX(x),tY(fn(x)));}
  ctx.strokeStyle='#a78bfa'; ctx.lineWidth=2.5; ctx.stroke();
  ctx.fillStyle='#9ca3af'; ctx.font='11px IBM Plex Mono,monospace';
  [{v:0,l:'0'},{v:Math.PI,l:'π'},{v:2*Math.PI,l:'2π'},{v:3*Math.PI,l:'3π'}].forEach(({v,l})=>{
    if(v<=dB) ctx.fillText(l,tX(v)-5,H-6);
  });
  let pos=0,neg=0; const dx2=b/2000;
  for(let i=0;i<2000;i++){const y=fn(i*dx2); if(y>=0) pos+=y*dx2; else neg+=y*dx2;}
  return { pos: pos.toFixed(4), neg: neg.toFixed(4), net: (pos+neg).toFixed(4) };
}

function drawAccumCanvas(canvas, x) {
  if (!canvas) return;
  const dpr = window.devicePixelRatio||1;
  canvas.width = canvas.offsetWidth*dpr; canvas.height = 270*dpr;
  const ctx = canvas.getContext('2d'); ctx.scale(dpr,dpr);
  const W=canvas.offsetWidth, H=270, pad={l:50,r:16,t:14,b:30};
  const gW=W-pad.l-pad.r, gH=H-pad.t-pad.b;
  const dA=0, dB=3.5, yMax=12;
  const fn=t=>t*t;
  const tX=v=>pad.l+(v-dA)/(dB-dA)*gW;
  const tY=v=>pad.t+gH-v/yMax*gH;
  ctx.fillStyle='#111827'; ctx.fillRect(0,0,W,H);
  [0,3,6,9,12].forEach(y=>{
    ctx.strokeStyle='#1f2937'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(pad.l,tY(y)); ctx.lineTo(pad.l+gW,tY(y)); ctx.stroke();
    ctx.fillStyle='#6b7280'; ctx.font='11px IBM Plex Mono,monospace';
    ctx.fillText(y,4,tY(y)+4);
  });
  ctx.beginPath(); ctx.moveTo(tX(0),tY(0));
  for(let i=0;i<=200;i++){const t=x*i/200; ctx.lineTo(tX(t),tY(fn(t)));}
  ctx.lineTo(tX(x),tY(0)); ctx.closePath();
  ctx.fillStyle='rgba(212,160,23,.28)'; ctx.fill();
  ctx.strokeStyle='#d4a017'; ctx.lineWidth=1.3; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(tX(0),tY(0));
  for(let i=1;i<=300;i++){const t=dA+(dB-dA)*i/300; ctx.lineTo(tX(t),tY(fn(t)));}
  ctx.strokeStyle='#60a5fa'; ctx.lineWidth=2.5; ctx.stroke();
  ctx.setLineDash([5,4]); ctx.strokeStyle='#d4a017'; ctx.lineWidth=1.3;
  ctx.beginPath(); ctx.moveTo(tX(x),tY(0)); ctx.lineTo(tX(x),tY(fn(x))); ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle='#fbbf24'; ctx.beginPath(); ctx.arc(tX(x),tY(fn(x)),6,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle='#4b5563'; ctx.lineWidth=1.5;
  ctx.beginPath(); ctx.moveTo(pad.l,pad.t); ctx.lineTo(pad.l,pad.t+gH); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(pad.l,pad.t+gH); ctx.lineTo(pad.l+gW,pad.t+gH); ctx.stroke();
  ctx.fillStyle='#9ca3af'; ctx.font='11px IBM Plex Mono,monospace';
  [0,1,2,3].forEach(v=>ctx.fillText(v,tX(v)-4,H-6));
  ctx.fillStyle='#fbbf24'; ctx.font='bold 12px IBM Plex Mono,monospace';
  ctx.fillText('x='+x.toFixed(2),tX(x)+8,tY(fn(x))-8);
  const area = Math.pow(x,3)/3;
  return { area: area.toFixed(4), fx: area.toFixed(4), deriv: (x*x).toFixed(4) };
}

// ─── Riemann Widget ───────────────────────────────────────────────────────
function RiemannWidget() {
  const canvasRef = useRef(null);
  const [fnKey, setFnKey] = useState('sq');
  const [rule, setRule] = useState('right');
  const [rN, setRN] = useState(6);
  const [inputVal, setInputVal] = useState('6');
  const [inputError, setInputError] = useState(false);
  const [stats, setStats] = useState({ dx:'—', approx:'—', exact:'—', err:'—' });

  const redraw = (fk, rl, n) => {
    const s = drawRiemannCanvas(canvasRef.current, fk, rl, n);
    if (s) setStats(s);
  };

  const handleInputChange = (e) => {
    const raw = e.target.value;
    setInputVal(raw);
    const n = parseInt(raw);
    if (!raw || isNaN(n) || n < 1 || n > 200) {
      setInputError(true);
    } else {
      setInputError(false);
      setRN(n);
      redraw(fnKey, rule, n);
    }
  };

  const handleSlider = (e) => {
    const v = parseInt(e.target.value);
    setRN(v);
    setInputVal(String(v));
    setInputError(false);
    redraw(fnKey, rule, v);
  };

  useEffect(() => { redraw(fnKey, rule, rN); }, []);
  useEffect(() => {
    const handler = () => redraw(fnKey, rule, rN);
    window.addEventListener('resize', handler, { passive: true });
    return () => window.removeEventListener('resize', handler);
  }, [fnKey, rule, rN]);

  return (
    <div style={S.widget}>
      <div style={S.wt}>⬛ Interactive Riemann Sum Explorer</div>
      <canvas ref={canvasRef} style={{ display:'block', width:'100%', height:'260px', borderRadius:'8px', background:'#111827' }} />
      <div style={{ display:'flex', flexWrap:'wrap', gap:'18px', marginTop:'18px', alignItems:'flex-end' }}>

        {/* Function selector */}
        <div style={{ display:'flex', flexDirection:'column', gap:'5px', minWidth:'160px', flex:1 }}>
          <label style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.7rem', letterSpacing:'.1em', textTransform:'uppercase', color:'#9ca3af' }}>Function</label>
          <select value={fnKey} onChange={e=>{setFnKey(e.target.value); redraw(e.target.value,rule,rN);}} style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.8rem', background:'#1f2937', color:'#e8e2d9', border:'1px solid #374151', borderRadius:'6px', padding:'5px 11px', cursor:'pointer' }}>
            <option value="sq">f(x) = x²/10 + 0.5</option>
            <option value="sin">f(x) = 2sin(x/2) + 2.5</option>
            <option value="bell">f(x) = 4e^(−(x−5)²/4)</option>
            <option value="wave">f(x) = 3sin(x/3)+cos(x)+3</option>
            <option value="sqrt">f(x) = √(2x) + 1</option>
            <option value="logistic">f(x) = 5/(1+e^(−(x−5)))</option>
          </select>
        </div>

        {/* Rectangles — text input + slider stacked */}
        <div style={{ display:'flex', flexDirection:'column', gap:'4px', minWidth:'160px', flex:1 }}>
          <label style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.7rem', letterSpacing:'.1em', textTransform:'uppercase', color:'#9ca3af' }}>
            Rectangles <span style={{ color:'#d4a017', fontWeight:600 }}>{rN}</span>
          </label>
          {/* Small text input */}
          <input
            type="number"
            value={inputVal}
            min="1"
            max="200"
            onChange={handleInputChange}
            style={{
              fontFamily:"'IBM Plex Mono',monospace",
              fontSize:'.8rem',
              width:'72px',
              background: inputError ? 'rgba(192,57,43,.18)' : '#1f2937',
              color: inputError ? '#e06b6b' : '#e8e2d9',
              border: `1px solid ${inputError ? '#c0392b' : '#374151'}`,
              borderRadius:'6px',
              padding:'3px 8px',
              outline:'none',
              transition:'border .2s, background .2s',
            }}
          />
          {/* Error message */}
          {inputError && (
            <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.62rem', color:'#e06b6b', letterSpacing:'.04em' }}>
              Enter 1 – 200
            </span>
          )}
          {/* Slider */}
          <input
            type="range"
            min="1" max="200"
            value={rN}
            onInput={handleSlider}
            style={{ WebkitAppearance:'none', width:'100%', height:'5px', background:'#374151', borderRadius:'3px', outline:'none', marginTop:'2px' }}
          />
        </div>

        {/* Sample Point selector */}
        <div style={{ display:'flex', flexDirection:'column', gap:'5px', minWidth:'160px', flex:1 }}>
          <label style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.7rem', letterSpacing:'.1em', textTransform:'uppercase', color:'#9ca3af' }}>Sample Point</label>
          <select value={rule} onChange={e=>{setRule(e.target.value); redraw(fnKey,e.target.value,rN);}} style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.8rem', background:'#1f2937', color:'#e8e2d9', border:'1px solid #374151', borderRadius:'6px', padding:'5px 11px', cursor:'pointer' }}>
            <option value="right">Right endpoint</option>
            <option value="left">Left endpoint</option>
            <option value="mid">Midpoint</option>
          </select>
        </div>

      </div>
      <div style={{ display:'flex', gap:'14px', flexWrap:'wrap', marginTop:'14px' }}>
        {[['n =', rN],['Δx =',stats.dx],['Approx ≈',stats.approx],['Exact =',stats.exact],['Error =',stats.err]].map(([l,v],i)=>(
          <div key={i} style={{ background:'#1f2937', borderRadius:'8px', padding:'9px 16px', fontFamily:"'IBM Plex Mono',monospace", fontSize:'.8rem' }}>
            {l} <span style={{ color:'#d4a017', fontWeight:700 }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Signed Area Widget ───────────────────────────────────────────────────
function SignedAreaWidget() {
  const canvasRef = useRef(null);
  const [bVal, setBVal] = useState(Math.PI);
  const [stats, setStats] = useState({ pos:'—', neg:'—', net:'—' });

  const redraw = (b) => {
    const s = drawSignedCanvas(canvasRef.current, b);
    if (s) setStats(s);
  };

  useEffect(() => { redraw(Math.PI); }, []);
  useEffect(() => {
    const handler = () => redraw(bVal);
    window.addEventListener('resize', handler, { passive: true });
    return () => window.removeEventListener('resize', handler);
  }, [bVal]);

  return (
    <div style={S.widget}>
      <div style={S.wt}>📐 Signed Area Explorer — {'$\\int_0^b \\sin(x)\\,dx$'}</div>
      <canvas ref={canvasRef} style={{ display:'block', width:'100%', height:'240px', borderRadius:'8px', background:'#111827' }} />
      <div style={{ display:'flex', flexWrap:'wrap', gap:'18px', marginTop:'18px', alignItems:'flex-end' }}>
        <div style={{ display:'flex', flexDirection:'column', gap:'5px', flex:1 }}>
          <label style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.7rem', letterSpacing:'.1em', textTransform:'uppercase', color:'#9ca3af' }}>
            Upper limit $b$ = <span style={{ color:'#d4a017', fontWeight:600 }}>{bVal.toFixed(2)}</span>
          </label>
          <input type="range" min="0.1" max="9.4" step="0.05" value={bVal} onInput={e=>{const v=parseFloat(e.target.value); setBVal(v); redraw(v);}} style={{ WebkitAppearance:'none', width:'100%', height:'5px', background:'#374151', borderRadius:'3px', outline:'none' }} />
        </div>
      </div>
      <div style={{ display:'flex', gap:'14px', flexWrap:'wrap', marginTop:'14px' }}>
        {[['Positive area:',stats.pos],['Negative area:',stats.neg],['Net integral:',stats.net]].map(([l,v],i)=>(
          <div key={i} style={{ background:'#1f2937', borderRadius:'8px', padding:'9px 16px', fontFamily:"'IBM Plex Mono',monospace", fontSize:'.8rem' }}>
            {l} <span style={{ color:'#d4a017', fontWeight:700 }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Accumulation Widget ──────────────────────────────────────────────────
function AccumWidget() {
  const canvasRef = useRef(null);
  const [xVal, setXVal] = useState(1.5);
  const [stats, setStats] = useState({ area:'—', fx:'—', deriv:'—' });

  const redraw = (x) => {
    const s = drawAccumCanvas(canvasRef.current, x);
    if (s) setStats(s);
  };

  useEffect(() => { redraw(1.5); }, []);
  useEffect(() => {
    const handler = () => redraw(xVal);
    window.addEventListener('resize', handler, { passive: true });
    return () => window.removeEventListener('resize', handler);
  }, [xVal]);

  return (
    <div style={S.widget}>
      <div style={S.wt}>🔗 Accumulation Function {'$A(x) = \\int_0^x t^2\\,dt$'}</div>
      <canvas ref={canvasRef} style={{ display:'block', width:'100%', height:'270px', borderRadius:'8px', background:'#111827' }} />
      <div style={{ display:'flex', flexWrap:'wrap', gap:'18px', marginTop:'18px', alignItems:'flex-end' }}>
        <div style={{ display:'flex', flexDirection:'column', gap:'5px', flex:1 }}>
          <label style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.7rem', letterSpacing:'.1em', textTransform:'uppercase', color:'#9ca3af' }}>
            Upper limit $x$ = <span style={{ color:'#d4a017', fontWeight:600 }}>{xVal.toFixed(2)}</span>
          </label>
          <input type="range" min="0.01" max="3" step="0.05" value={xVal} onInput={e=>{const v=parseFloat(e.target.value); setXVal(v); redraw(v);}} style={{ WebkitAppearance:'none', width:'100%', height:'5px', background:'#374151', borderRadius:'3px', outline:'none' }} />
        </div>
      </div>
      <div style={{ display:'flex', gap:'14px', flexWrap:'wrap', marginTop:'14px' }}>
        {[['Shaded area A(x) =',stats.area],['F(x) = x³/3 =',stats.fx],["A'(x) = x² =",stats.deriv]].map(([l,v],i)=>(
          <div key={i} style={{ background:'#1f2937', borderRadius:'8px', padding:'9px 16px', fontFamily:"'IBM Plex Mono',monospace", fontSize:'.8rem' }}>
            {l} <span style={{ color:'#d4a017', fontWeight:700 }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────
export default function Calc1S53() {
  const [sidebarOpen, setSidebarOpen] = useState({ 5: true });

  useEffect(() => {
    const handleScroll = () => {
      const el = document.documentElement;
      const bar = document.getElementById('sk-progress-bar');
      if (bar) bar.style.width = (el.scrollTop/(el.scrollHeight-el.clientHeight)*100)+'%';
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    const typesetInterval = setInterval(() => {
      if (window.MathJax?.typesetPromise) { window.MathJax.typesetPromise(); clearInterval(typesetInterval); }
    }, 100);
    return () => { window.removeEventListener('scroll', handleScroll); clearInterval(typesetInterval); };
  }, []);

  return (
    <>
      <Navbar activePage="courses" />
      <Script id="mjax-cfg" strategy="beforeInteractive">{`
        window.MathJax = {
          tex: { inlineMath:[['$','$'],['\\\\(','\\\\)']], displayMath:[['$$','$$'],['\\\\[','\\\\]']] },
          options:{ skipHtmlTags:['script','noscript','style','textarea','pre'] }
        };
      `}</Script>
      <Script src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js" strategy="afterInteractive" />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=IBM+Plex+Mono:wght@400;600&family=Source+Sans+3:wght@300;400;600&display=swap');
        .lec-sec { padding:52px 0 0; }
        .lec-sec:first-child { padding-top:44px; }
        .toc-live::after { content:'✶'; font-size:.58rem; color:var(--teal); margin-left:auto; }
        .lec-inner-m p, .lec-inner-m li { color: #1a1a2e !important; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance:none; width:18px; height:18px; background:#d4a017; border-radius:50%; cursor:pointer; }
        .rules-grid-jsx { display:grid; grid-template-columns:1fr 1fr; gap:14px; margin:20px 0; }
        @media(max-width:860px){
          .csb-hide{display:none!important;}
          .lec-inner-m{padding:0 18px 40px!important;}
          .lec-hero-m{padding:36px 20px 32px!important;}
          .lec-fnav-m{padding:20px 18px!important;}
          .rules-grid-jsx{grid-template-columns:1fr!important;}
        }
      `}</style>

      {/* STICKY SUBNAV */}
      <div style={S.stickySubnav}>
        <div style={S.bcRow}>
          <Link href="/" style={S.bcLink}>Home</Link><span>›</span>
          <Link href="/courses" style={S.bcLink}>Courses</Link><span>›</span>
          <Link href="/courses/calc1" style={S.bcLink}>Calculus I</Link><span>›</span>
          <span style={S.bcCur}>§5.3 The Definite Integral & FTC</span>
        </div>
        <div style={S.courseSwitcher}>
          <Link href="/courses/precalc" style={S.cswLink}>Pre-Calculus</Link>
          <Link href="/courses/calc1" style={{...S.cswLink,...S.cswActive}}>Calculus I</Link>
          <Link href="/courses/linalg" style={S.cswLink}>Linear Algebra I</Link>
        </div>
      </div>

      {/* COURSE FRAME */}
      <div style={S.courseFrame}>

        {/* SIDEBAR */}
        <aside style={S.csb} className="csb-hide">
          <div style={S.csbHead}>
            <div style={S.csbTag}>MATH-101 · Calculus I</div>
            <div style={S.csbTitle}>Course Contents</div>
            <Link href="/courses/calc1" style={S.csbBack}>← All Courses</Link>
          </div>
          <div style={{ padding:'8px 0 4px' }}>
            <Link href="/courses/calc1" style={{ display:'flex', alignItems:'center', gap:'8px', padding:'7px 16px', fontFamily:'var(--fm)', fontSize:'.72rem', color:'var(--text3)', textDecoration:'none', lineHeight:1.35 }}>
              <span style={{ width:'4px', height:'4px', borderRadius:'50%', background:'var(--border2)', flexShrink:0, display:'inline-block' }}></span>
              Course Overview
            </Link>
          </div>
          <nav style={{ padding:'4px 0 24px' }}>
            {TOC.map((sec,i) => {
              if (sec.ch === 'Course Overview') return null;
              const isOpen = !!sidebarOpen[i];
              const hasLive = sec.items.some(item => item.live || item.href);
              return (
                <div key={sec.ch} style={{ borderBottom:'1px solid var(--border)' }}>
                  <button onClick={()=>setSidebarOpen(prev=>({...prev,[i]:!prev[i]}))} style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 16px', background:'none', border:'none', cursor:'pointer', fontFamily:'var(--fm)', fontSize:'.68rem', letterSpacing:'.1em', textTransform:'uppercase', color:hasLive?'var(--teal)':'var(--text3)', textAlign:'left' }}>
                    <span>{sec.ch}</span>
                    <span style={{ fontSize:'.6rem', transition:'transform .2s', display:'inline-block', transform:isOpen?'rotate(180deg)':'rotate(0deg)' }}>▾</span>
                  </button>
                  {isOpen && (
                    <div style={{ paddingBottom:'6px' }}>
                      {sec.items.map(item =>
                        item.soon ? (
                          <div key={item.label} style={{ display:'flex', alignItems:'center', gap:'8px', padding:'5px 16px 5px 24px', fontFamily:'var(--fm)', fontSize:'.71rem', color:'var(--text3)', opacity:.38, lineHeight:1.35 }}>
                            <span style={{ width:'3px', height:'3px', borderRadius:'50%', background:'var(--border2)', flexShrink:0, display:'inline-block' }}></span>
                            {item.label}
                          </div>
                        ) : item.active ? (
                          <div key={item.label} style={{ display:'flex', alignItems:'center', gap:'8px', padding:'5px 16px 5px 24px', fontFamily:'var(--fm)', fontSize:'.71rem', color:'var(--amber)', borderLeft:'2px solid var(--amber)', background:'rgba(232,160,32,.08)', lineHeight:1.35 }}>
                            <span style={{ fontSize:'.55rem' }}>✦</span>{item.label}
                          </div>
                        ) : (
                          <Link key={item.label} href={item.href||'#'} style={{ display:'flex', alignItems:'center', gap:'8px', padding:'5px 16px 5px 24px', fontFamily:'var(--fm)', fontSize:'.71rem', color:'var(--teal)', textDecoration:'none', lineHeight:1.35 }}>
                            <span style={{ fontSize:'.55rem' }}>✦</span>{item.label}
                          </Link>
                        )
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </aside>

        {/* MAIN */}
        <main style={S.cmain}>

          {/* HERO */}
          <div style={S.lecHero} className="lec-hero-m">
            <div style={{ position:'absolute', inset:0, background:'repeating-linear-gradient(45deg,transparent,transparent 40px,rgba(255,255,255,.03) 40px,rgba(255,255,255,.03) 41px)', pointerEvents:'none' }} />
            <div style={S.lecHeroTag}>Calculus I &nbsp;·&nbsp; Chapter 5 &nbsp;·&nbsp; Section 5.3</div>
            <h1 style={S.lecHeroH1}>The Definite Integral &amp;<br /><em style={{ color:'#d4a017', fontStyle:'italic' }}>The Fundamental Theorem</em></h1>
            <p style={S.lecHeroP}>From infinite slices of area to the most powerful bridge in mathematics — connecting differentiation and integration into one breathtaking theorem.</p>
            <div style={S.lecHeroLine} />
          </div>

          {/* SECTION NAV */}
          <nav style={S.lecNav}>
            {[['#story','Real-Life Story'],['#objectives','Objectives'],['#riemann','Riemann Sums'],['#limit','Area as Limit'],['#defint','Definite Integral'],['#ftc','FTC'],['#geometric','Geometry of FTC'],['#rules','Integration Rules'],['#substitution','Substitution'],['#netchange','Net Change'],['#applied','Applied Problems']].map(([href,label])=>(
              <a key={href} href={href} style={S.lecNavA}>{label}</a>
            ))}
          </nav>

          <div style={S.lecInner} className="lec-inner-m">

            {/* ══ STORY ══ */}
            <section id="story" className="lec-sec">
              <div style={S.secLabel}>Opening Story</div>
              <h2 style={S.h2}>A Monsoon, a River, and<br />a Question of Survival</h2>

              <div style={{...S.card,...S.cardGl,background:'linear-gradient(135deg,#fffdf5,#fff8ec)'}}>
                <p style={{...S.p,fontSize:'1.07rem',lineHeight:2}}>It is July 2022. The monsoon has arrived in Sindh, and the Indus River is rising. Engineers at the Tarbela Dam need to answer one urgent question: <em>how much water will flow through this point in the next 72 hours?</em></p>
                <p style={{...S.p,fontSize:'1.07rem',lineHeight:2}}>They have sensors reading the flow rate $R(t)$ in cubic metres per second, updated every hour. The rate changes constantly — faster after heavy rain, slower in the early morning. Nobody can memorise a continuously changing function. But every engineer in that room knows one thing: <strong>the total volume of water is the area under the $R(t)$ curve.</strong></p>
                <p style={{...S.p,fontSize:'1.07rem',lineHeight:2,marginBottom:0}}>{'They need to compute $\\displaystyle\\int_0^{72} R(t)\\,dt$. The decision to open the spillway — potentially displacing millions of people — depends on getting this number right. This is not a textbook exercise. This is the definite integral saving lives.'}</p>
              </div>

              <p style={{...S.p,marginTop:'20px'}}>This story captures exactly why the definite integral exists. Whenever a quantity accumulates continuously — water, money, distance, electrical charge, heat — the tool that measures the total accumulation is the definite integral. And the tool that lets us compute it efficiently, without adding millions of rectangles by hand, is the <strong>Fundamental Theorem of Calculus</strong>.</p>

              <div style={S.calloutGold}><strong>The Big Picture:</strong> The Fundamental Theorem reveals that differentiation and integration — which appear to be completely different operations — are actually inverse processes of each other. This is one of the most surprising and beautiful results in all of mathematics.</div>
            </section>

            {/* ══ OBJECTIVES ══ */}
            <section id="objectives" className="lec-sec">
              <div style={S.secLabel}>Learning Objectives</div>
              <h2 style={S.h2}>What You Will Master<br />in This Section</h2>
              <div style={{...S.card,...S.cardGl}}>
                {[
                  'Show how area under a curve can be expressed as the limit of a Riemann sum.',
                  'Define the definite integral and explore its algebraic properties and rules.',
                  'State the Fundamental Theorem of Calculus and use it to evaluate definite integrals efficiently.',
                  'Use the FTC to solve applied problems involving net change and accumulation.',
                  'Provide a geometric justification of the Fundamental Theorem of Calculus.',
                ].map((text,i)=>(
                  <div key={i} style={{ display:'flex', gap:'16px', alignItems:'flex-start', marginBottom: i<4 ? '14px' : 0 }}>
                    <div style={{ width:'32px', height:'32px', background:'#d4a017', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', color:'#1a1a2e', fontFamily:"'IBM Plex Mono',monospace", fontWeight:700, fontSize:'.85rem', flexShrink:0 }}>{i+1}</div>
                    <p style={{...S.p,margin:0,paddingTop:'5px'}}>{text}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* ══ RIEMANN SUMS ══ */}
            <section id="riemann" className="lec-sec">
              <div style={S.secLabel}>§ 1 — Area as the Limit of a Sum</div>
              <h2 style={S.h2}>From One Rectangle<br />to Infinite Precision</h2>
              <p style={S.p}>{'Let us find the area under $f(x) = x^2$ from $x = 0$ to $x = 2$. We will start crudely and progressively improve.'}</p>

              {/* Approximation 1 */}
              <div style={S.approachStep}>
                <div style={S.stepLabel}>Approximation 1</div>
                <div style={S.stepTitle}>One Rectangle — Very Rough</div>
                <p style={S.p}>{'Use a single rectangle spanning the entire interval $[0, 2]$. Take the height as $f(2) = 4$ (right endpoint).'}</p>
                <div style={S.bf}>{'Area $\\approx f(2) \\cdot 2 = 4 \\times 2 = 8$'}</div>

                <svg viewBox="0 0 400 230" xmlns="http://www.w3.org/2000/svg" style={{ width:'100%', maxWidth:'580px', display:'block', margin:'24px auto', borderRadius:'10px' }}>
                  <rect width="400" height="230" fill="#fdf8f0" rx="8"/>
                  <line x1="163.3" y1="20" x2="163.3" y2="205" stroke="#e0d8cc" strokeWidth="0.7" strokeDasharray="3,3"/>
                  <line x1="266.6" y1="20" x2="266.6" y2="205" stroke="#e0d8cc" strokeWidth="0.7" strokeDasharray="3,3"/>
                  <line x1="60" y1="174.2" x2="370" y2="174.2" stroke="#e0d8cc" strokeWidth="0.7" strokeDasharray="3,3"/>
                  <line x1="60" y1="81.7" x2="370" y2="81.7" stroke="#e0d8cc" strokeWidth="0.7" strokeDasharray="3,3"/>
                  <rect x="60" y="81.7" width="206.6" height="123.3" fill="rgba(212,160,23,0.22)" stroke="#d4a017" strokeWidth="1.8"/>
                  <line x1="60" y1="205" x2="378" y2="205" stroke="#555" strokeWidth="1.8"/>
                  <line x1="60" y1="205" x2="60" y2="12" stroke="#555" strokeWidth="1.8"/>
                  <polygon points="378,205 372,202 372,208" fill="#555"/>
                  <polygon points="60,12 57,18 63,18" fill="#555"/>
                  <path d="M 60,205 C 90,205 140,185 163.3,174.2 S 230,120 266.6,81.7 S 300,35 318.3,12.4" fill="none" stroke="#2980b9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="163.3" y1="202" x2="163.3" y2="208" stroke="#555" strokeWidth="1.2"/>
                  <line x1="266.6" y1="202" x2="266.6" y2="208" stroke="#555" strokeWidth="1.2"/>
                  <line x1="370" y1="202" x2="370" y2="208" stroke="#555" strokeWidth="1.2"/>
                  <line x1="57" y1="174.2" x2="63" y2="174.2" stroke="#555" strokeWidth="1.2"/>
                  <line x1="57" y1="81.7" x2="63" y2="81.7" stroke="#555" strokeWidth="1.2"/>
                  <text x="163.3" y="218" fontSize="11" fontFamily="monospace" fill="#555" textAnchor="middle">1</text>
                  <text x="266.6" y="218" fontSize="11" fontFamily="monospace" fill="#d4a017" textAnchor="middle" fontWeight="700">2</text>
                  <text x="370" y="218" fontSize="11" fontFamily="monospace" fill="#999" textAnchor="middle">3</text>
                  <text x="60" y="218" fontSize="11" fontFamily="monospace" fill="#555" textAnchor="middle">0</text>
                  <text x="48" y="209" fontSize="11" fontFamily="monospace" fill="#555" textAnchor="end">0</text>
                  <text x="48" y="178" fontSize="11" fontFamily="monospace" fill="#555" textAnchor="end">1</text>
                  <text x="48" y="85.7" fontSize="11" fontFamily="monospace" fill="#d4a017" textAnchor="end" fontWeight="700">4</text>
                  <text x="382" y="209" fontSize="12" fontFamily="monospace" fill="#555">x</text>
                  <text x="53" y="10" fontSize="12" fontFamily="monospace" fill="#555">y</text>
                  <circle cx="266.6" cy="81.7" r="4" fill="#d4a017" stroke="#fff" strokeWidth="1.5"/>
                  <text x="163" y="152" fontSize="13" fontFamily="monospace" fill="#b8860b" fontWeight="700" textAnchor="middle">Area ≈ 8</text>
                  <text x="305" y="68" fontSize="13" fontFamily="serif" fill="#2980b9" fontStyle="italic">f(x) = x²</text>
                </svg>

                <p style={{...S.p,marginBottom:0}}>{'The true area is $\\frac{8}{3} \\approx 2.667$. Our estimate of $8$ is a big overestimate — the rectangle towers over the curve everywhere. We can do better by using more rectangles.'}</p>
              </div>

              {/* Approximation 2 */}
              <div style={S.approachStep}>
                <div style={S.stepLabel}>Approximation 2</div>
                <div style={S.stepTitle}>Two Rectangles — Getting Closer</div>
                <p style={S.p}>{'Divide $[0, 2]$ into '}<strong>2 equal subintervals</strong>{' of width $\\Delta x = 1$. Use the '}<strong>right endpoint</strong>{' of each.'}</p>
                <div style={S.bf}>{'Area $\\approx f(1)\\cdot 1 + f(2)\\cdot 1 = 1 + 4 = 5$'}</div>

                <svg viewBox="0 0 400 230" xmlns="http://www.w3.org/2000/svg" style={{ width:'100%', maxWidth:'580px', display:'block', margin:'24px auto', borderRadius:'10px' }}>
                  <rect width="400" height="230" fill="#fdf8f0" rx="8"/>
                  <line x1="163.3" y1="20" x2="163.3" y2="205" stroke="#e0d8cc" strokeWidth="0.7" strokeDasharray="3,3"/>
                  <line x1="266.6" y1="20" x2="266.6" y2="205" stroke="#e0d8cc" strokeWidth="0.7" strokeDasharray="3,3"/>
                  <line x1="60" y1="174.2" x2="370" y2="174.2" stroke="#e0d8cc" strokeWidth="0.7" strokeDasharray="3,3"/>
                  <line x1="60" y1="81.7" x2="370" y2="81.7" stroke="#e0d8cc" strokeWidth="0.7" strokeDasharray="3,3"/>
                  <rect x="60" y="174.2" width="103.3" height="30.8" fill="rgba(52,152,219,0.22)" stroke="#2980b9" strokeWidth="1.8"/>
                  <rect x="163.3" y="81.7" width="103.3" height="123.3" fill="rgba(212,160,23,0.22)" stroke="#d4a017" strokeWidth="1.8"/>
                  <line x1="60" y1="205" x2="378" y2="205" stroke="#555" strokeWidth="1.8"/>
                  <line x1="60" y1="205" x2="60" y2="12" stroke="#555" strokeWidth="1.8"/>
                  <polygon points="378,205 372,202 372,208" fill="#555"/>
                  <polygon points="60,12 57,18 63,18" fill="#555"/>
                  <path d="M 60,205 C 90,205 140,185 163.3,174.2 S 230,120 266.6,81.7 S 300,35 318.3,12.4" fill="none" stroke="#2980b9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="163.3" y1="202" x2="163.3" y2="208" stroke="#555" strokeWidth="1.2"/>
                  <line x1="266.6" y1="202" x2="266.6" y2="208" stroke="#555" strokeWidth="1.2"/>
                  <text x="60" y="218" fontSize="11" fontFamily="monospace" fill="#555" textAnchor="middle">0</text>
                  <text x="163.3" y="218" fontSize="11" fontFamily="monospace" fill="#2980b9" textAnchor="middle" fontWeight="700">1</text>
                  <text x="266.6" y="218" fontSize="11" fontFamily="monospace" fill="#d4a017" textAnchor="middle" fontWeight="700">2</text>
                  <text x="48" y="178" fontSize="11" fontFamily="monospace" fill="#2980b9" textAnchor="end" fontWeight="700">1</text>
                  <text x="48" y="85.7" fontSize="11" fontFamily="monospace" fill="#d4a017" textAnchor="end" fontWeight="700">4</text>
                  <text x="382" y="209" fontSize="12" fontFamily="monospace" fill="#555">x</text>
                  <text x="53" y="10" fontSize="12" fontFamily="monospace" fill="#555">y</text>
                  <circle cx="163.3" cy="174.2" r="4" fill="#2980b9" stroke="#fff" strokeWidth="1.5"/>
                  <circle cx="266.6" cy="81.7" r="4" fill="#d4a017" stroke="#fff" strokeWidth="1.5"/>
                  <text x="111.6" y="192" fontSize="11" fontFamily="monospace" fill="#2980b9" fontWeight="700" textAnchor="middle">1×1=1</text>
                  <text x="215" y="140" fontSize="11" fontFamily="monospace" fill="#b8860b" fontWeight="700" textAnchor="middle">4×1=4</text>
                  <text x="305" y="68" fontSize="13" fontFamily="serif" fill="#2980b9" fontStyle="italic">f(x) = x²</text>
                </svg>

                <div style={{ background:'#fffbf0', borderLeft:'3px solid #d4a017', padding:'10px 14px', margin:'10px 0', borderRadius:'4px', fontFamily:'monospace', fontSize:'0.93em', lineHeight:1.9 }}>
                  <div><strong>Δx = (2 − 0) / 2 = 1</strong></div>
                  <div>Rectangle 1 → right endpoint x = 1, f(1) = 1² = <strong>1</strong> → area = 1 × 1 = <strong>1</strong></div>
                  <div>Rectangle 2 → right endpoint x = 2, f(2) = 2² = <strong>4</strong> → area = 4 × 1 = <strong>4</strong></div>
                  <div style={{ borderTop:'1px solid #e0d0a0', marginTop:'6px', paddingTop:'6px' }}>Total ≈ 1 + 4 = <strong>5</strong></div>
                </div>
                <p style={{...S.p,marginBottom:0}}>{'The true area is $\\frac{8}{3} \\approx 2.667$. Two rectangles give us $5$ — still an overestimate, but already much better than $8$. More rectangles means a closer approximation.'}</p>
              </div>

              {/* Approximation 3 */}
              <div style={S.approachStep}>
                <div style={S.stepLabel}>Approximation 3</div>
                <div style={S.stepTitle}>Four Rectangles — Much Better</div>
                <p style={S.p}>{'Divide $[0,2]$ into 4 equal sub-intervals, each of width $\\Delta x = 0.5$. Use right endpoints for height.'}</p>
                <table style={S.table}>
                  <thead><tr><th style={S.th}>Sub-interval</th><th style={S.th}>Right endpoint $x_i$</th><th style={S.th}>Height $f(x_i) = x_i^2$</th><th style={S.th}>Area of rectangle</th></tr></thead>
                  <tbody>
                    <tr><td style={S.td}>{'$[0, 0.5]$'}</td><td style={S.td}>$0.5$</td><td style={S.td}>$0.25$</td><td style={S.td}>$0.25 \times 0.5 = 0.125$</td></tr>
                    <tr><td style={S.tdEven}>{'$[0.5, 1]$'}</td><td style={S.tdEven}>$1.0$</td><td style={S.tdEven}>$1.00$</td><td style={S.tdEven}>$1.00 \times 0.5 = 0.500$</td></tr>
                    <tr><td style={S.td}>{'$[1, 1.5]$'}</td><td style={S.td}>$1.5$</td><td style={S.td}>$2.25$</td><td style={S.td}>$2.25 \times 0.5 = 1.125$</td></tr>
                    <tr><td style={S.tdEven}>{'$[1.5, 2]$'}</td><td style={S.tdEven}>$2.0$</td><td style={S.tdEven}>$4.00$</td><td style={S.tdEven}>$4.00 \times 0.5 = 2.000$</td></tr>
                  </tbody>
                </table>
                <div style={S.bf}>{'Total Area $\\approx 0.125 + 0.500 + 1.125 + 2.000 = \\mathbf{3.75}$'}</div>

                <svg viewBox="0 0 400 230" xmlns="http://www.w3.org/2000/svg" style={{ width:'100%', maxWidth:'580px', display:'block', margin:'24px auto', borderRadius:'10px' }}>
                  <rect width="400" height="230" fill="#fdf8f0" rx="8"/>
                  <line x1="111.67" y1="20" x2="111.67" y2="205" stroke="#e0d8cc" strokeWidth="0.7" strokeDasharray="3,3"/>
                  <line x1="163.33" y1="20" x2="163.33" y2="205" stroke="#e0d8cc" strokeWidth="0.7" strokeDasharray="3,3"/>
                  <line x1="215" y1="20" x2="215" y2="205" stroke="#e0d8cc" strokeWidth="0.7" strokeDasharray="3,3"/>
                  <line x1="266.67" y1="20" x2="266.67" y2="205" stroke="#e0d8cc" strokeWidth="0.7" strokeDasharray="3,3"/>
                  <line x1="60" y1="174.17" x2="370" y2="174.17" stroke="#e0d8cc" strokeWidth="0.7" strokeDasharray="3,3"/>
                  <line x1="60" y1="136.13" x2="370" y2="136.13" stroke="#e0d8cc" strokeWidth="0.7" strokeDasharray="3,3"/>
                  <line x1="60" y1="81.67" x2="370" y2="81.67" stroke="#e0d8cc" strokeWidth="0.7" strokeDasharray="3,3"/>
                  <rect x="60" y="197.29" width="51.67" height="7.71" fill="rgba(52,152,219,0.22)" stroke="#2980b9" strokeWidth="1.5"/>
                  <rect x="111.67" y="174.17" width="51.67" height="30.83" fill="rgba(39,174,96,0.22)" stroke="#27ae60" strokeWidth="1.5"/>
                  <rect x="163.33" y="136.13" width="51.67" height="68.87" fill="rgba(155,89,182,0.22)" stroke="#8e44ad" strokeWidth="1.5"/>
                  <rect x="215" y="81.67" width="51.67" height="123.33" fill="rgba(212,160,23,0.22)" stroke="#d4a017" strokeWidth="1.5"/>
                  <line x1="60" y1="205" x2="378" y2="205" stroke="#555" strokeWidth="1.8"/>
                  <line x1="60" y1="205" x2="60" y2="12" stroke="#555" strokeWidth="1.8"/>
                  <polygon points="378,205 372,202 372,208" fill="#555"/>
                  <polygon points="60,12 57,18 63,18" fill="#555"/>
                  <path d="M 60,205 C 90,205 140,185 163.33,174.17 S 230,120 266.67,81.67 S 300,35 318.33,12.4" fill="none" stroke="#2980b9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <text x="60" y="218" fontSize="11" fontFamily="monospace" fill="#555" textAnchor="middle">0</text>
                  <text x="111.67" y="218" fontSize="11" fontFamily="monospace" fill="#2980b9" textAnchor="middle" fontWeight="700">0.5</text>
                  <text x="163.33" y="218" fontSize="11" fontFamily="monospace" fill="#27ae60" textAnchor="middle" fontWeight="700">1</text>
                  <text x="215" y="218" fontSize="11" fontFamily="monospace" fill="#8e44ad" textAnchor="middle" fontWeight="700">1.5</text>
                  <text x="266.67" y="218" fontSize="11" fontFamily="monospace" fill="#d4a017" textAnchor="middle" fontWeight="700">2</text>
                  <text x="190" y="110" fontSize="12" fontFamily="monospace" fill="#7a5c00" fontWeight="700" textAnchor="middle">Area ≈ 3.75</text>
                  <text x="305" y="65" fontSize="13" fontFamily="serif" fill="#2980b9" fontStyle="italic">f(x) = x²</text>
                  <circle cx="111.67" cy="197.29" r="3.5" fill="#2980b9" stroke="#fff" strokeWidth="1.5"/>
                  <circle cx="163.33" cy="174.17" r="3.5" fill="#27ae60" stroke="#fff" strokeWidth="1.5"/>
                  <circle cx="215" cy="136.13" r="3.5" fill="#8e44ad" stroke="#fff" strokeWidth="1.5"/>
                  <circle cx="266.67" cy="81.67" r="3.5" fill="#d4a017" stroke="#fff" strokeWidth="1.5"/>
                  <text x="382" y="209" fontSize="12" fontFamily="monospace" fill="#555">x</text>
                  <text x="53" y="10" fontSize="12" fontFamily="monospace" fill="#555">y</text>
                </svg>

                <p style={{...S.p,marginBottom:0}}>{'With 4 rectangles we get $3.75$ vs. the true $\\frac{8}{3} \\approx 2.667$. Still overshooting (right endpoints overestimate for increasing functions), but much closer than before. The key insight: '}<em>more rectangles means more accuracy.</em></p>
              </div>

              {/* n rectangles */}
              <div style={S.approachStep}>
                <div style={S.stepLabel}>General Formula</div>
                <div style={S.stepTitle}>$n$ Rectangles — The Riemann Sum</div>
                <p style={S.p}>{'Divide $[a, b]$ into $n$ equal sub-intervals, each of width $\\Delta x = \\dfrac{b-a}{n}$. The right endpoint of the $i$-th sub-interval is $x_i = a + i\\Delta x$.'}</p>
                <div style={S.defBox}>
                  <div style={{...S.lbl,color:'#1a6b6b'}}>Riemann Sum</div>
                  <p style={{textAlign:'center'}}>{'$$S_n = \\sum_{i=1}^{n} f(x_i)\\,\\Delta x = \\sum_{i=1}^{n} f\\!\\left(a + i\\cdot\\frac{b-a}{n}\\right)\\cdot\\frac{b-a}{n}$$'}</p>
                </div>
                <p style={S.p}>{'For our example $f(x)=x^2$, $[0,2]$, using right endpoints:'}</p>
                <p style={{textAlign:'center'}}>{'$$S_n = \\sum_{i=1}^{n} \\left(\\frac{2i}{n}\\right)^2 \\cdot \\frac{2}{n} = \\frac{8}{n^3}\\sum_{i=1}^{n}i^2 = \\frac{8}{n^3}\\cdot\\frac{n(n+1)(2n+1)}{6} = \\frac{4(n+1)(2n+1)}{3n^2}$$'}</p>
                <table style={S.table}>
                  <thead><tr><th style={S.th}>$n$</th><th style={S.th}>$S_n$</th><th style={S.th}>Error from $\frac{"{"}8{"}"}{"{"}3{"}"}$</th></tr></thead>
                  <tbody>
                    <tr><td style={S.td}>$1$</td><td style={S.td}>$8.000$</td><td style={S.td}>$5.333$</td></tr>
                    <tr><td style={S.tdEven}>$4$</td><td style={S.tdEven}>$3.750$</td><td style={S.tdEven}>$1.083$</td></tr>
                    <tr><td style={S.td}>$10$</td><td style={S.td}>$2.960$</td><td style={S.td}>$0.293$</td></tr>
                    <tr><td style={S.tdEven}>$100$</td><td style={S.tdEven}>$2.6934$</td><td style={S.tdEven}>$0.0267$</td></tr>
                    <tr><td style={S.td}>$1000$</td><td style={S.td}>$2.6693$</td><td style={S.td}>$0.0027$</td></tr>
                    <tr><td style={S.tdEven}>{'$\\infty$'}</td><td style={S.tdEven}>{'$\\dfrac{8}{3} \\approx 2.6\\overline{6}$'}</td><td style={S.tdEven}>$0$</td></tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* ══ INTERACTIVE RIEMANN ══ */}
            <section id="limit" className="lec-sec">
              <div style={S.secLabel}>§ 2 — Interactive Exploration</div>
              <h2 style={S.h2}>Play With It:<br />The Riemann Sum Explorer</h2>
              <p style={S.p}>Drag the slider to increase the number of rectangles and watch the approximation converge to the exact area. Try different functions and endpoint rules.</p>

              <RiemannWidget />

              <div style={S.thmBox}>
                <div style={{...S.lbl,color:'#d4a017'}}>Area as a Limit</div>
                <p style={S.p}>{'The exact area under $f(x)$ from $a$ to $b$ is defined as the limit of the Riemann sum as $n \\to \\infty$:'}</p>
                <p style={{textAlign:'center'}}>{'$$\\text{Area} = \\lim_{n \\to \\infty} S_n = \\lim_{n \\to \\infty} \\sum_{i=1}^{n} f(x_i^*)\\,\\Delta x$$'}</p>
                <p style={{...S.p,marginBottom:0}}>{'This limit exists whenever $f$ is continuous on $[a,b]$. The beautiful fact is: '}<em>it does not matter which sample point $x_i^*$ we choose — left, right, or midpoint — the limit is always the same.</em></p>
              </div>

              <div style={{...S.card,...S.cardAl}}>
                <h4 style={S.h4red}>Example — Area Using the Limit</h4>
                <p style={S.p}>{'Find the area under $f(x) = 3x$ from $x = 0$ to $x = 2$ using the limit definition.'}</p>

                {/* Side-by-side: diagram left, solution right */}
                <div style={{ display:'flex', gap:'28px', alignItems:'flex-start', flexWrap:'wrap', margin:'18px 0' }}>

                    {/* SVG Diagram */}
                    <svg viewBox="0 0 340 300" xmlns="http://www.w3.org/2000/svg"
                    style={{ flex:'0 0 340px', width:'340px', maxWidth:'100%', borderRadius:'10px', background:'#fdf8f0', border:'1px solid #e0d6c8' }}>

                    {/* Grid lines */}
                    <line x1="60" y1="240" x2="310" y2="240" stroke="#e0d6c8" strokeWidth="1"/>
                    <line x1="60" y1="180" x2="310" y2="180" stroke="#e0d6c8" strokeWidth="1" strokeDasharray="4,3"/>
                    <line x1="60" y1="120" x2="310" y2="120" stroke="#e0d6c8" strokeWidth="1" strokeDasharray="4,3"/>
                    <line x1="60" y1="60"  x2="310" y2="60"  stroke="#e0d6c8" strokeWidth="1" strokeDasharray="4,3"/>
                    <line x1="60"  y1="40" x2="60"  y2="250" stroke="#e0d6c8" strokeWidth="1"/>
                    <line x1="185" y1="40" x2="185" y2="250" stroke="#e0d6c8" strokeWidth="1" strokeDasharray="4,3"/>
                    <line x1="310" y1="40" x2="310" y2="250" stroke="#e0d6c8" strokeWidth="1" strokeDasharray="4,3"/>

                    {/* Shaded triangle — the exact area */}
                    <polygon points="60,240 310,240 310,60" fill="rgba(192,57,43,0.12)" stroke="none"/>

                    {/* 4 sample Riemann rectangles (right endpoints) */}
                    {/* Δx = 0.5 units = 62.5px, right endpoints at x=0.5,1,1.5,2 → f=1.5,3,4.5,6 */}
                    {/* x→px: 60 + x*125.  y→px: 240 - y*30 */}
                    {/* Rect 1: x∈[0,0.5], h=f(0.5)=1.5 → top=240-45=195 */}
                    <rect x="60"   y="195" width="62.5" height="45"  fill="rgba(41,128,185,0.20)" stroke="#2980b9" strokeWidth="1.2"/>
                    {/* Rect 2: x∈[0.5,1], h=f(1)=3 → top=240-90=150 */}
                    <rect x="122.5" y="150" width="62.5" height="90"  fill="rgba(39,174,96,0.20)"  stroke="#27ae60" strokeWidth="1.2"/>
                    {/* Rect 3: x∈[1,1.5], h=f(1.5)=4.5 → top=240-135=105 */}
                    <rect x="185"  y="105" width="62.5" height="135" fill="rgba(142,68,173,0.20)"  stroke="#8e44ad" strokeWidth="1.2"/>
                    {/* Rect 4: x∈[1.5,2], h=f(2)=6 → top=240-180=60 */}
                    <rect x="247.5" y="60" width="62.5" height="180" fill="rgba(212,160,23,0.20)"  stroke="#d4a017" strokeWidth="1.2"/>

                    {/* f(x) = 3x line */}
                    <line x1="60" y1="240" x2="310" y2="60" stroke="#c0392b" strokeWidth="2.5" strokeLinecap="round"/>

                    {/* Axes */}
                    <line x1="50" y1="240" x2="318" y2="240" stroke="#555" strokeWidth="1.8"/>
                    <line x1="60" y1="250" x2="60"  y2="32"  stroke="#555" strokeWidth="1.8"/>
                    <polygon points="318,240 311,237 311,243" fill="#555"/>
                    <polygon points="60,32 57,39 63,39"       fill="#555"/>

                    {/* x-axis ticks & labels */}
                    <line x1="185" y1="237" x2="185" y2="243" stroke="#555" strokeWidth="1.2"/>
                    <line x1="310" y1="237" x2="310" y2="243" stroke="#555" strokeWidth="1.2"/>
                    <text x="60"  y="256" fontSize="11" fontFamily="monospace" fill="#555" textAnchor="middle">0</text>
                    <text x="185" y="256" fontSize="11" fontFamily="monospace" fill="#555" textAnchor="middle">1</text>
                    <text x="310" y="256" fontSize="11" fontFamily="monospace" fill="#c0392b" textAnchor="middle" fontWeight="700">2</text>
                    <text x="322" y="244" fontSize="12" fontFamily="monospace" fill="#555">x</text>

                    {/* y-axis ticks & labels */}
                    <line x1="57" y1="180" x2="63" y2="180" stroke="#555" strokeWidth="1.2"/>
                    <line x1="57" y1="120" x2="63" y2="120" stroke="#555" strokeWidth="1.2"/>
                    <line x1="57" y1="60"  x2="63" y2="60"  stroke="#555" strokeWidth="1.2"/>
                    <text x="50" y="244"  fontSize="11" fontFamily="monospace" fill="#555"    textAnchor="end">0</text>
                    <text x="50" y="184"  fontSize="11" fontFamily="monospace" fill="#555"    textAnchor="end">2</text>
                    <text x="50" y="124"  fontSize="11" fontFamily="monospace" fill="#555"    textAnchor="end">4</text>
                    <text x="50" y="64"   fontSize="11" fontFamily="monospace" fill="#c0392b" textAnchor="end" fontWeight="700">6</text>
                    <text x="53" y="30"   fontSize="12" fontFamily="monospace" fill="#555">y</text>

                    {/* Dots at right endpoints on line */}
                    <circle cx="122.5" cy="195" r="3.5" fill="#2980b9" stroke="#fff" strokeWidth="1.5"/>
                    <circle cx="185"   cy="150" r="3.5" fill="#27ae60" stroke="#fff" strokeWidth="1.5"/>
                    <circle cx="247.5" cy="105" r="3.5" fill="#8e44ad" stroke="#fff" strokeWidth="1.5"/>
                    <circle cx="310"   cy="60"  r="3.5" fill="#d4a017" stroke="#fff" strokeWidth="1.5"/>

                    {/* f(x) label */}
                    <text x="170" y="148" fontSize="12" fontFamily="serif" fill="#c0392b" fontStyle="italic" fontWeight="700">f(x) = 3x</text>

                    {/* Shaded area label */}
                    <text x="250" y="195" fontSize="11" fontFamily="monospace" fill="#c0392b" textAnchor="middle" fontWeight="700">Area = 6</text>
                    <text x="250" y="208" fontSize="10" fontFamily="monospace" fill="#888"    textAnchor="middle">(exact)</text>

                    {/* Δx brace label under first rect */}
                    <line x1="60" y1="268" x2="122.5" y2="268" stroke="#555" strokeWidth="1.2"/>
                    <line x1="60"   y1="264" x2="60"   y2="272" stroke="#555" strokeWidth="1.2"/>
                    <line x1="122.5" y1="264" x2="122.5" y2="272" stroke="#555" strokeWidth="1.2"/>
                    <text x="91" y="280" fontSize="10" fontFamily="monospace" fill="#555" textAnchor="middle">Δx = 2/n</text>

                    {/* Legend */}
                    <rect x="62" y="16" width="10" height="10" fill="rgba(192,57,43,0.15)" stroke="#c0392b" strokeWidth="1"/>
                    <text x="76" y="25" fontSize="10" fontFamily="monospace" fill="#555">Exact triangle (Area = 6)</text>
                    <rect x="62" y="30" width="10" height="10" fill="rgba(41,128,185,0.20)" stroke="#2980b9" strokeWidth="1"/>
                    <text x="76" y="39" fontSize="10" fontFamily="monospace" fill="#555">Rectangles (n = 4 shown)</text>
                    </svg>

                    {/* Solution text */}
                    <div style={{ flex:1, minWidth:'220px' }}>
                    <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.65rem', letterSpacing:'.14em', textTransform:'uppercase', color:'#c0392b', marginBottom:'10px' }}>Solution</div>
                    <p style={S.p}>{'Right endpoints: $x_i = \\dfrac{2i}{n}$, width $\\Delta x = \\dfrac{2}{n}$'}</p>
                    <p style={{textAlign:'center'}}>{'$$S_n = \\sum_{i=1}^{n} 3\\cdot\\frac{2i}{n}\\cdot\\frac{2}{n} = \\frac{12}{n^2}\\sum_{i=1}^{n}i$$'}</p>
                    <p style={{textAlign:'center'}}>{'$$= \\frac{12}{n^2}\\cdot\\frac{n(n+1)}{2} = \\frac{6(n+1)}{n}$$'}</p>
                    <p style={{textAlign:'center'}}>{'$$\\text{Area} = \\lim_{n\\to\\infty}\\frac{6(n+1)}{n} = 6$$'}</p>
                    <div style={{ background:'#f0faf4', border:'1.5px solid #27ae60', borderRadius:'8px', padding:'12px 16px', marginTop:'12px' }}>
                        <p style={{...S.p,marginBottom:0}}>{'✓ Geometric check: $f(x)=3x$ forms a right triangle with base $2$ and height $f(2)=6$.'}</p>
                        <p style={{textAlign:'center',marginBottom:0}}>{'$$\\text{Area} = \\tfrac{1}{2}(2)(6) = \\mathbf{6}$$'}</p>
                    </div>
                    </div>

                </div>
                </div>
            </section>

            {/* ══ DEFINITE INTEGRAL ══ */}
            <section id="defint" className="lec-sec">
              <div style={S.secLabel}>§ 3 — The Definite Integral</div>
              <h2 style={S.h2}>Defining the<br />Definite Integral</h2>

              <div style={S.defBox}>
                <div style={{...S.lbl,color:'#1a6b6b'}}>Definition — The Definite Integral</div>
                <p style={S.p}>{'If $f$ is continuous on $[a,b]$, the '}<strong>definite integral of $f$ from $a$ to $b$</strong>{' is:'}</p>
                <p style={{textAlign:'center'}}>{'$$\\int_a^b f(x)\\,dx = \\lim_{n\\to\\infty}\\sum_{i=1}^{n}f(x_i^*)\\,\\Delta x$$'}</p>
                <p style={{...S.p,marginBottom:0}}>{'The number $a$ is the '}<strong>lower limit</strong>{' and $b$ is the '}<strong>upper limit</strong>{' of integration. The result is a '}<em>number</em>{', not a function.'}</p>
              </div>

              <h3 style={S.h3teal}>Area as a Definite Integral</h3>
              <p style={S.p}>{'When $f(x) \\geq 0$ on $[a,b]$, the definite integral equals the area under the curve:'}</p>
              <div style={S.bf}>{'$$\\text{Area} = \\int_a^b f(x)\\,dx$$'}</div>
              <p style={S.p}>{'When $f(x)$ takes negative values, the integral computes the '}<strong>signed area</strong>{' — area above the $x$-axis counts positive, area below counts negative.'}</p>

              <SignedAreaWidget />

              <div style={S.callout}><strong>Important:</strong> {'$\\displaystyle\\int_a^b f(x)\\,dx$ gives '}<em>signed</em>{' area. If you want total (unsigned) area when $f$ dips below the axis, you must split the integral at the zeros and add absolute values.'}</div>
            </section>

            {/* ══ FTC ══ */}
            <section id="ftc" className="lec-sec">
              <div style={S.secLabel}>§ 4 — The Bridge Between Two Worlds</div>
              <h2 style={S.h2}>The Fundamental<br />Theorem of Calculus</h2>

              <p style={S.p}>{'Without the FTC, computing $\\displaystyle\\int_0^2 x^2\\,dx$ requires evaluating a limit of a sum — tedious. The FTC provides a miraculous shortcut.'}</p>

              <div style={S.thmBox}>
                <div style={{...S.lbl,color:'#d4a017'}}>The Fundamental Theorem of Calculus</div>
                <p style={S.p}>{'If $f$ is continuous on $[a,b]$ and $F$ is any antiderivative of $f$ (i.e. $F\'(x) = f(x)$), then:'}</p>
                <p style={{textAlign:'center',fontSize:'1.2rem'}}>{'$$\\int_a^b f(x)\\,dx = F(b) - F(a)$$'}</p>
                <p style={{...S.p,marginBottom:0,color:'#1a6b6b',fontStyle:'italic'}}>{'We write $F(b) - F(a)$ as $\\Big[F(x)\\Big]_a^b$.'}</p>
              </div>

              <div style={S.calloutTeal}><strong>What this means:</strong> {'To compute a definite integral, find any antiderivative $F(x)$, then simply subtract: $F(b) - F(a)$. The $+C$ cancels out, so we can ignore it.'}</div>

              <h3 style={S.h3teal}>Using the FTC — Examples</h3>

              <div style={{...S.card,...S.cardAl}}>
                <h4 style={S.h4red}>Example 1 — Power Function</h4>
                <p style={S.p}>{'Compute $\\displaystyle\\int_0^2 x^2\\,dx$.'}</p>
                <p style={S.p}>{'Step 1: Find an antiderivative: $F(x) = \\dfrac{x^3}{3}$'}</p>
                <p style={S.p}>Step 2: Apply the FTC:</p>
                <p style={{textAlign:'center'}}>{'$$\\int_0^2 x^2\\,dx = \\left[\\frac{x^3}{3}\\right]_0^2 = \\frac{2^3}{3} - \\frac{0^3}{3} = \\frac{8}{3} - 0 = \\frac{8}{3}$$'}</p>
                <p style={{...S.p,marginBottom:0}}>This confirms our Riemann sum limit from earlier. The FTC computed it in two lines.</p>
              </div>

              <div style={{...S.card,...S.cardGl}}>
                <h4 style={S.h4gold}>Example 2 — Mixed Terms</h4>
                <p style={S.p}>{'Compute $\\displaystyle\\int_1^3 (2x + e^x)\\,dx$.'}</p>
                <ToggleAnswer>
                  <p style={{textAlign:'center'}}>{'$$\\int_1^3 (2x+e^x)\\,dx = \\Big[x^2 + e^x\\Big]_1^3 = (9+e^3)-(1+e) = 8 + e^3 - e \\approx 8 + 20.09 - 2.72 \\approx 25.37$$'}</p>
                </ToggleAnswer>
              </div>

              <div style={{...S.card,...S.cardTl}}>
                <h4 style={S.h4teal}>Example 3 — Rational Integrand</h4>
                <p style={S.p}>{'Compute $\\displaystyle\\int_1^e \\frac{3}{x}\\,dx$.'}</p>
                <ToggleAnswer>
                  <p style={{textAlign:'center'}}>{'$$\\int_1^e \\frac{3}{x}\\,dx = \\Big[3\\ln|x|\\Big]_1^e = 3\\ln e - 3\\ln 1 = 3(1) - 3(0) = 3$$'}</p>
                </ToggleAnswer>
              </div>

              <div style={{...S.card,...S.cardSl}}>
                <h4 style={S.h4blue}>Example 4 — Negative Exponent</h4>
                <p style={S.p}>{'Compute $\\displaystyle\\int_1^4 \\frac{1}{\\sqrt{x}}\\,dx$.'}</p>
                <ToggleAnswer>
                  <p style={{textAlign:'center'}}>{'$$\\int_1^4 x^{-1/2}\\,dx = \\Big[2x^{1/2}\\Big]_1^4 = 2\\sqrt{4} - 2\\sqrt{1} = 4 - 2 = 2$$'}</p>
                </ToggleAnswer>
              </div>
            </section>

            {/* ══ GEOMETRIC JUSTIFICATION ══ */}
            <section id="geometric" className="lec-sec">
              <div style={S.secLabel}>§ 5 — Geometric Justification</div>
              <h2 style={S.h2}>Why Does the FTC Work?<br />A Visual Argument</h2>

              <p style={S.p}>{'Define the '}<strong>accumulation function</strong>{' $A(x) = \\displaystyle\\int_a^x f(t)\\,dt$ — the area under $f$ from $a$ up to $x$.'}</p>

              <AccumWidget />

              <div style={S.noteBox}>
                <div style={{...S.lbl,color:'#2980b9'}}>The Key Geometric Insight</div>
                <p style={S.p}>{'When $x$ increases by a tiny amount $h$, the extra area added is approximately a thin rectangle:'}</p>
                <p style={{textAlign:'center'}}>{'$$A(x+h) - A(x) \\approx f(x) \\cdot h$$'}</p>
                <p style={S.p}>Dividing both sides by $h$ and taking $h \to 0$:</p>
                <p style={{textAlign:'center'}}>{'$$A\'(x) = \\lim_{h\\to 0}\\frac{A(x+h)-A(x)}{h} = f(x)$$'}</p>
                <p style={{...S.p,marginBottom:0}}>{'So $A(x)$ is an antiderivative of $f(x)$! Since $A(a) = 0$, and any antiderivative $F$ satisfies $F(x) = A(x) + C$, we get $\\int_a^b f(x)\\,dx = A(b) = F(b) - F(a)$.'}</p>
              </div>

              <div style={S.calloutGold}><strong>The Profound Truth:</strong> {'The FTC says that accumulation (integration) and rate of change (differentiation) are inverse operations. The area function, when differentiated, gives back the original function. This is why $\\frac{d}{dx}\\int_a^x f(t)\\,dt = f(x)$.'}</div>
            </section>

            {/* ══ INTEGRATION RULES ══ */}
            <section id="rules" className="lec-sec">
              <div style={S.secLabel}>§ 6 — Properties of the Definite Integral</div>
              <h2 style={S.h2}>Integration Rules for<br />Definite Integrals</h2>
              <p style={S.p}>These rules let us manipulate definite integrals algebraically without recomputing from scratch.</p>

              <div className="rules-grid-jsx">
                {[
                  { lbl:'Constant Multiple Rule', math:'$$\\int_a^b k\\,f(x)\\,dx = k\\int_a^b f(x)\\,dx$$', desc:'Pull constants outside the integral.' },
                  { lbl:'Sum / Difference Rule', math:'$$\\int_a^b [f \\pm g]\\,dx = \\int_a^b f\\,dx \\pm \\int_a^b g\\,dx$$', desc:'Split across addition or subtraction.' },
                  { lbl:'Same Limits Rule', math:'$$\\int_a^a f(x)\\,dx = 0$$', desc:'No width means no area.' },
                  { lbl:'Reversed Limits Rule', math:'$$\\int_b^a f(x)\\,dx = -\\int_a^b f(x)\\,dx$$', desc:'Switching limits negates the integral.' },
                  { lbl:'Subdivision Rule', math:'$$\\int_a^b f\\,dx = \\int_a^c f\\,dx + \\int_c^b f\\,dx$$', desc:'Split the interval at any interior point $c$.' },
                  { lbl:'Dominance Rule', math:'$$\\text{If } f(x)\\geq g(x) \\text{ on } [a,b]: \\int_a^b f\\,dx \\geq \\int_a^b g\\,dx$$', desc:'Larger function, larger integral.' },
                ].map((r,i)=>(
                  <div key={i} style={S.ruleCard}>
                    <div style={S.rlbl}>{r.lbl}</div>
                    <p style={{textAlign:'center',marginBottom:'6px'}}>{r.math}</p>
                    <p style={{...S.p,fontSize:'.88rem',marginBottom:0}}>{r.desc}</p>
                  </div>
                ))}
              </div>

              <h3 style={S.h3teal}>Examples Using the Rules</h3>

              <div style={{...S.card,...S.cardAl}}>
                <h4 style={S.h4red}>Example 1 — Constant Multiple + Sum</h4>
                <p style={S.p}>{'Given $\\displaystyle\\int_0^3 f(x)\\,dx = 7$ and $\\displaystyle\\int_0^3 g(x)\\,dx = 4$, find $\\displaystyle\\int_0^3 [5f(x) - 2g(x)]\\,dx$.'}</p>
                <ToggleAnswer>
                  <p style={{textAlign:'center'}}>{'$$\\int_0^3 [5f(x)-2g(x)]\\,dx = 5\\int_0^3 f\\,dx - 2\\int_0^3 g\\,dx = 5(7)-2(4) = 35-8 = 27$$'}</p>
                </ToggleAnswer>
              </div>

              <div style={{...S.card,...S.cardGl}}>
                <h4 style={S.h4gold}>Example 2 — Subdivision Rule</h4>
                <p style={S.p}>{'Given $\\displaystyle\\int_0^5 f(x)\\,dx = 12$ and $\\displaystyle\\int_0^3 f(x)\\,dx = 7$, find $\\displaystyle\\int_3^5 f(x)\\,dx$.'}</p>
                <ToggleAnswer>
                  <p style={S.p}>{'By the subdivision rule: $\\displaystyle\\int_0^5 f\\,dx = \\int_0^3 f\\,dx + \\int_3^5 f\\,dx$'}</p>
                  <p style={{textAlign:'center'}}>{'$$\\int_3^5 f\\,dx = 12 - 7 = 5$$'}</p>
                </ToggleAnswer>
              </div>

              <div style={{...S.card,...S.cardTl}}>
                <h4 style={S.h4teal}>Example 3 — Reversed Limits</h4>
                <p style={S.p}>{'Compute $\\displaystyle\\int_4^1 \\sqrt{x}\\,dx$.'}</p>
                <ToggleAnswer>
                  <p style={{textAlign:'center'}}>{'$$\\int_4^1 \\sqrt{x}\\,dx = -\\int_1^4 \\sqrt{x}\\,dx = -\\Big[\\frac{2}{3}x^{3/2}\\Big]_1^4 = -\\left(\\frac{2}{3}(8) - \\frac{2}{3}(1)\\right) = -\\frac{14}{3}$$'}</p>
                </ToggleAnswer>
              </div>

              <div style={{...S.card,...S.cardSl}}>
                <h4 style={S.h4blue}>Example 4 — All Rules Combined</h4>
                <p style={S.p}>{'Compute $\\displaystyle\\int_{-1}^{2}(3x^2 - 4x + 1)\\,dx$.'}</p>
                <ToggleAnswer>
                  <p style={{textAlign:'center'}}>{'$$\\Big[x^3 - 2x^2 + x\\Big]_{-1}^{2} = (8-8+2)-(-1-2-1) = 2-(-4) = 6$$'}</p>
                </ToggleAnswer>
              </div>
            </section>

            {/* ══ SUBSTITUTION ══ */}
            <section id="substitution" className="lec-sec">
              <div style={S.secLabel}>§ 7 — Substitution in Definite Integrals</div>
              <h2 style={S.h2}>Using Substitution with<br />Definite Integrals</h2>
              <p style={S.p}>When a definite integral requires substitution, you have two approaches. The cleaner method is to <strong>change the limits of integration</strong> along with the variable.</p>

              <div style={S.thmBox}>
                <div style={{...S.lbl,color:'#d4a017'}}>Substitution Rule for Definite Integrals</div>
                <p style={S.p}>{"If $u = g(x)$ and $g'$ is continuous on $[a,b]$, then:"}</p>
                <p style={{textAlign:'center'}}>{"$$\\int_a^b f(g(x))\\cdot g'(x)\\,dx = \\int_{g(a)}^{g(b)} f(u)\\,du$$"}</p>
                <p style={{...S.p,marginBottom:0,fontStyle:'italic',color:'#1a6b6b'}}>{'Key: when $x = a$, $u = g(a)$; when $x = b$, $u = g(b)$. Change both limits!'}</p>
              </div>

              <div style={{...S.card,...S.cardAl}}>
                <h4 style={S.h4red}>Example 1 — Change the Limits</h4>
                <p style={S.p}>{'Compute $\\displaystyle\\int_0^2 2x(x^2+1)^3\\,dx$.'}</p>
                <p style={S.p}>{'Let $u = x^2+1$, $du = 2x\\,dx$.'}</p>
                <p style={S.p}>{'New limits: When $x=0$: $u = 1$. When $x=2$: $u = 5$.'}</p>
                <p style={{textAlign:'center'}}>{'$$\\int_1^5 u^3\\,du = \\left[\\frac{u^4}{4}\\right]_1^5 = \\frac{625}{4} - \\frac{1}{4} = \\frac{624}{4} = 156$$'}</p>
                <p style={{...S.p,marginBottom:0}}>No back-substitution needed! The new limits handle everything.</p>
              </div>

              <div style={{...S.card,...S.cardGl}}>
                <h4 style={S.h4gold}>Example 2 — Exponential with Substitution</h4>
                <p style={S.p}>{'Compute $\\displaystyle\\int_0^1 xe^{x^2}\\,dx$.'}</p>
                <ToggleAnswer>
                  <p style={S.p}>{'Let $u = x^2$, $du = 2x\\,dx$, so $x\\,dx = \\dfrac{du}{2}$.'}</p>
                  <p style={S.p}>{'New limits: $x=0 \\Rightarrow u=0$; $x=1 \\Rightarrow u=1$.'}</p>
                  <p style={{textAlign:'center'}}>{'$$\\int_0^1 e^u\\cdot\\frac{du}{2} = \\frac{1}{2}\\Big[e^u\\Big]_0^1 = \\frac{1}{2}(e-1) \\approx \\frac{1}{2}(1.718) \\approx 0.859$$'}</p>
                </ToggleAnswer>
              </div>

              <div style={{...S.card,...S.cardTl}}>
                <h4 style={S.h4teal}>Example 3 — Rational with Substitution</h4>
                <p style={S.p}>{'Compute $\\displaystyle\\int_0^3 \\frac{x}{(x^2+1)^2}\\,dx$.'}</p>
                <ToggleAnswer>
                  <p style={S.p}>{'Let $u = x^2+1$, $du = 2x\\,dx$, so $x\\,dx = \\dfrac{du}{2}$.'}</p>
                  <p style={S.p}>{'New limits: $x=0 \\Rightarrow u=1$; $x=3 \\Rightarrow u=10$.'}</p>
                  <p style={{textAlign:'center'}}>{'$$\\int_1^{10} \\frac{1}{u^2}\\cdot\\frac{du}{2} = \\frac{1}{2}\\left[-\\frac{1}{u}\\right]_1^{10} = \\frac{1}{2}\\left(-\\frac{1}{10}+1\\right) = \\frac{1}{2}\\cdot\\frac{9}{10} = \\frac{9}{20}$$'}</p>
                </ToggleAnswer>
              </div>
            </section>

            {/* ══ NET CHANGE ══ */}
            <section id="netchange" className="lec-sec">
              <div style={S.secLabel}>§ 8 — Net Change</div>
              <h2 style={S.h2}>The Net Change Theorem</h2>

              <div style={S.thmBox}>
                <div style={{...S.lbl,color:'#d4a017'}}>Net Change Theorem</div>
                <p style={S.p}>{"If $F'(x) = f(x)$, then the net change in $F$ from $x = a$ to $x = b$ is:"}</p>
                <p style={{textAlign:'center'}}>{"$$F(b) - F(a) = \\int_a^b f(x)\\,dx = \\int_a^b F'(x)\\,dx$$"}</p>
                <p style={{...S.p,marginBottom:0,color:'#1a6b6b',fontStyle:'italic'}}>The integral of a rate of change gives the total (net) change in the quantity.</p>
              </div>

              <p style={S.p}>This is simply the FTC rewritten with emphasis on its interpretation. It tells us:</p>
              <table style={S.table}>
                <thead><tr><th style={S.th}>If $f(x)$ represents...</th><th style={S.th}>Then $\int_a^b f(x)\,dx$ gives...</th></tr></thead>
                <tbody>
                  <tr><td style={S.td}>Velocity $v(t)$</td><td style={S.td}>Net displacement (not total distance)</td></tr>
                  <tr><td style={S.tdEven}>{"Marginal cost $C'(x)$"}</td><td style={S.tdEven}>Change in total cost from $x=a$ to $x=b$</td></tr>
                  <tr><td style={S.td}>{"Rate of population growth $P'(t)$"}</td><td style={S.td}>Net change in population</td></tr>
                  <tr><td style={S.tdEven}>Flow rate $R(t)$ (water, current)</td><td style={S.tdEven}>Total volume/charge accumulated</td></tr>
                  <tr><td style={S.td}>Rate of profit change</td><td style={S.td}>Net profit gained or lost</td></tr>
                </tbody>
              </table>

              <div style={{...S.card,...S.cardAl}}>
                <h4 style={S.h4red}>Example 1 — Displacement vs. Distance</h4>
                <p style={S.p}>{'A particle moves along a line with velocity $v(t) = t^2 - 4t + 3$ m/s for $0 \\leq t \\leq 4$.'}</p>
                <p style={S.p}>Find (a) the net displacement and (b) the total distance traveled.</p>
                <ToggleAnswer>
                  <p style={S.p}><strong>(a) Net displacement:</strong></p>
                  <p style={{textAlign:'center'}}>{'$$\\int_0^4 (t^2-4t+3)\\,dt = \\left[\\frac{t^3}{3}-2t^2+3t\\right]_0^4 = \\left(\\frac{64}{3}-32+12\\right)-0 = \\frac{64}{3}-20 = \\frac{4}{3} \\approx 1.33 \\text{ m}$$'}</p>
                  <p style={S.p}><strong>(b) Total distance:</strong> {'First find where $v(t)=0$: $t^2-4t+3=(t-1)(t-3)=0$, so $t=1$ and $t=3$.'}</p>
                  <p style={S.p}>{'$v > 0$ on $[0,1]$, $v < 0$ on $[1,3]$, $v > 0$ on $[3,4]$.'}</p>
                  <p style={{textAlign:'center'}}>{'$$d = \\int_0^1(t^2-4t+3)\\,dt + \\left|\\int_1^3(t^2-4t+3)\\,dt\\right| + \\int_3^4(t^2-4t+3)\\,dt$$'}</p>
                  <p style={{textAlign:'center'}}>{'$$= \\frac{4}{3} + \\left|-\\frac{4}{3}\\right| + \\frac{4}{3} = \\frac{4}{3}+\\frac{4}{3}+\\frac{4}{3} = 4 \\text{ m}$$'}</p>
                </ToggleAnswer>
              </div>

              <div style={{...S.card,...S.cardGl}}>
                <h4 style={S.h4gold}>Example 2 — Marginal Cost</h4>
                <p style={S.p}>{"A factory's marginal cost is $C'(x) = 0.006x^2 - 0.6x + 30$ PKR/unit. Find the increase in cost when production goes from 50 to 100 units."}</p>
                <ToggleAnswer>
                  <p style={{textAlign:'center'}}>{'$$\\int_{50}^{100}(0.006x^2-0.6x+30)\\,dx = \\Big[0.002x^3-0.3x^2+30x\\Big]_{50}^{100}$$'}</p>
                  <p style={{textAlign:'center'}}>{'$$= (2000-3000+3000)-(250-750+1500) = 2000-1000 = \\text{PKR }1000$$'}</p>
                </ToggleAnswer>
              </div>
            </section>

            {/* ══ APPLIED PROBLEMS ══ */}
            <section id="applied" className="lec-sec">
              <div style={S.secLabel}>§ 9 — Applied Problems</div>
              <h2 style={S.h2}>Integration in Practice</h2>

              {/* Example 1 */}
              <div style={{...S.card,...S.cardPl}}>
                <h4 style={S.h4green}>🌍 Example 1 — Land Survey Along the Ravi River</h4>
                <p style={S.p}>A land surveyor in Lahore is measuring a plot between two boundary roads. The northern boundary follows the curve {'$f(x) = -x^2 + 8x$'} and the southern boundary follows {'$g(x) = x^2 - 4x$'}, where $x$ is in hundreds of metres. Find the total area of the plot enclosed between the two curves.</p>
                <ToggleAnswer>
                  <p style={S.p}><strong>Step 1 — Find where the boundaries meet (intersection points).</strong></p>
                  <p style={S.p}>{'Set $f(x) = g(x)$:'}</p>
                  <p style={{textAlign:'center'}}>{'$$-x^2 + 8x = x^2 - 4x \\implies 0 = 2x^2 - 12x = 2x(x-6) \\implies x = 0 \\text{ and } x = 6$$'}</p>
                  <p style={S.p}><strong>Step 2 — Determine which curve is on top.</strong></p>
                  <p style={S.p}>{'Test $x = 3$ (midpoint): $f(3) = -9+24 = 15$, $g(3) = 9-12 = -3$. Since $f(3) > g(3)$, the northern boundary $f(x)$ lies above $g(x)$ throughout $[0,6]$.'}</p>
                  <p style={S.p}><strong>Step 3 — Set up the area integral.</strong></p>
                  <p style={{textAlign:'center'}}>{'$$\\text{Area} = \\int_0^6 \\Bigl[(-x^2+8x)-(x^2-4x)\\Bigr]\\,dx = \\int_0^6 (-2x^2+12x)\\,dx$$'}</p>
                  <p style={S.p}><strong>Step 4 — Integrate and evaluate:</strong></p>
                  <p style={{textAlign:'center'}}>{'$$= \\left[-\\frac{2x^3}{3} + 6x^2\\right]_0^6 = \\left(-\\frac{2(216)}{3} + 6(36)\\right) - 0 = (-144 + 216) = 72$$'}</p>
                  <p style={S.p}><strong>Step 5 — Convert to real units:</strong></p>
                  <p style={{textAlign:'center'}}>{'$$\\text{Area} = 72 \\times (100)^2 = 720{,}000 \\text{ m}^2 = \\boxed{72 \\text{ hectares}}$$'}</p>
                  <div style={{...S.calloutGreen,marginTop:'14px',marginBottom:0}}>
                    <strong>Why this works:</strong> When a region is bounded above by $f(x)$ and below by $g(x)$, you subtract the lower from the upper before integrating. This automatically handles the fact that $g(x)$ dips below the $x$-axis — you never need to split the integral or worry about signs, because the <em>difference</em> {'$f(x)-g(x)$'} is always positive on {'$[0,6]$'}.
                  </div>
                </ToggleAnswer>
              </div>

              {/* Example 2 */}
              <div style={{...S.card,...S.cardAl}}>
                <h4 style={S.h4red}>⚡ Example 2 — Electricity Consumption at LUMS</h4>
                <p style={S.p}>{"LUMS's power consumption rate (in MW) during a 12-hour working day is modelled by"}</p>
                <p style={{textAlign:'center'}}>{'$$P(t) = 0.01t^3 - 0.18t^2 + 0.9t + 1.5, \\qquad 0 \\leq t \\leq 12,$$'}</p>
                <p style={S.p}>{'where $t$ is in hours. Find the total energy consumed (in MWh) over the full 12-hour period.'}</p>
                <ToggleAnswer>
                  <p style={S.p}><strong>Step 1 — Set up the integral.</strong></p>
                  <p style={{textAlign:'center'}}>{'$$\\text{Total energy} = \\int_0^{12} P(t)\\,dt = \\int_0^{12}\\!\\left(0.01t^3 - 0.18t^2 + 0.9t + 1.5\\right)dt$$'}</p>
                  <p style={S.p}><strong>Step 2 — Find the antiderivative term by term:</strong></p>
                  <p style={{textAlign:'center'}}>{'$$F(t) = \\frac{t^4}{400} - \\frac{3t^3}{50} + \\frac{9t^2}{20} + \\frac{3t}{2}$$'}</p>
                  <p style={S.p}><strong>Step 3 — Evaluate at the upper limit $t = 12$:</strong></p>
                  <p style={{textAlign:'center'}}>{'$$F(12) = \\frac{20736}{400} - \\frac{3\\cdot 1728}{50} + \\frac{9\\cdot 144}{20} + 18 = 51.84 - 103.68 + 64.8 + 18 = 30.96$$'}</p>
                  <p style={S.p}><strong>Step 4 — Apply the FTC:</strong></p>
                  <p style={{textAlign:'center'}}>{'$$E = F(12) - F(0) = 30.96 - 0 = \\boxed{30.96 \\text{ MWh}}$$'}</p>
                  <div style={{...S.calloutTeal,marginTop:'14px',marginBottom:0}}>
                    <strong>Sanity check:</strong> {'The average power over 12 hours is $\\dfrac{30.96}{12} \\approx 2.58$ MW. Since $P(0)=1.5$ MW and $P(12) = 3.66$ MW, an average of $\\approx 2.58$ MW is very reasonable. ✓'}
                  </div>
                </ToggleAnswer>
              </div>

              {/* Example 3 */}
              <div style={{...S.card,...S.cardTl}}>
                <h4 style={S.h4teal}>📈 Example 3 — Revenue Accumulation at a Karachi Textile Firm</h4>
                <p style={S.p}>A Karachi textile firm's revenue rate (in million PKR/month) follows</p>
                <p style={{textAlign:'center'}}>{'$$R\'(t) = \\frac{3t}{\\sqrt{2t^2 + 7}}, \\qquad 0 \\leq t \\leq 9,$$'}</p>
                <p style={S.p}>where $t$ is in months.</p>
                <p style={S.p}><strong>(a)</strong> Find the total revenue earned over the first 9 months.<br /><strong>(b)</strong> Find the revenue earned in the <em>second</em> 3-month period only (i.e. from $t=3$ to $t=6$).</p>
                <ToggleAnswer>
                  <p style={S.p}><strong>Part (a) — Total revenue over 9 months.</strong></p>
                  <p style={S.p}>{'Let $u = 2t^2 + 7$, $du = 4t\\,dt$, so $t\\,dt = \\dfrac{du}{4}$.'}</p>
                  <p style={S.p}>{'Limits: $t=0 \\Rightarrow u=7$; $t=9 \\Rightarrow u=169$.'}</p>
                  <p style={{textAlign:'center'}}>{'$$\\int_0^9 \\frac{3t}{\\sqrt{2t^2+7}}\\,dt = \\frac{3}{4}\\int_7^{169} u^{-1/2}\\,du = \\frac{3}{4}\\Big[2u^{1/2}\\Big]_7^{169} = \\frac{3}{2}\\left(13 - \\sqrt{7}\\right) \\approx \\boxed{15.53 \\text{ million PKR}}$$'}</p>
                  <p style={S.p}><strong>Part (b) — Revenue from $t = 3$ to $t = 6$ only.</strong></p>
                  <p style={S.p}>{'Limits: $t=3 \\Rightarrow u=25$; $t=6 \\Rightarrow u=79$.'}</p>
                  <p style={{textAlign:'center'}}>{'$$\\int_3^6 \\frac{3t}{\\sqrt{2t^2+7}}\\,dt = \\frac{3}{2}\\Big[\\sqrt{u}\\Big]_{25}^{79} = \\frac{3}{2}\\left(\\sqrt{79} - 5\\right) \\approx \\frac{3}{2}(3.888) \\approx \\boxed{5.83 \\text{ million PKR}}$$'}</p>
                  <div style={{...S.calloutTeal,marginTop:'16px',marginBottom:0}}>
                    <strong>Key insight:</strong> You do <em>not</em> recompute the antiderivative for part (b) — the same substitution and antiderivative {'$\\tfrac{3}{2}\\sqrt{2t^2+7}$'} works. Only the limits change.
                  </div>
                </ToggleAnswer>
              </div>

              {/* Example 4 */}
              <div style={{...S.card,...S.cardGl}}>
                <h4 style={S.h4gold}>🏃 Example 4 — LUMS Athletics Track Event</h4>
                <p style={S.p}>During a LUMS inter-faculty athletics event, a runner's speed (in km/min) is modelled by</p>
                <p style={{textAlign:'center'}}>{'$$v(t) = \\frac{4t^3 - 2t}{t^4 - t^2 + 3}, \\qquad 0 \\leq t \\leq 4,$$'}</p>
                <p style={S.p}>where $t$ is in minutes.</p>
                <p style={S.p}><strong>(a)</strong> Find the total distance covered over the full 4 minutes.<br /><strong>(b)</strong> Find the distance covered in the <em>first</em> minute only, and express it as an exact logarithm.</p>
                <ToggleAnswer>
                  <p style={S.p}><strong>Part (a) — Total distance over 4 minutes.</strong></p>
                  <p style={S.p}>{'Let $u = t^4 - t^2 + 3$, then $\\dfrac{du}{dt} = 4t^3 - 2t$ — the numerator is exactly $\\dfrac{du}{dt}$. This is a $\\int \\dfrac{u\'}{u}\\,dt = \\ln|u| + C$ pattern.'}</p>
                  <p style={S.p}>{'Limits: $t=0 \\Rightarrow u=3$; $t=4 \\Rightarrow u=243$.'}</p>
                  <p style={{textAlign:'center'}}>{'$$\\int_0^4 \\frac{4t^3-2t}{t^4-t^2+3}\\,dt = \\int_3^{243}\\frac{du}{u} = \\Big[\\ln u\\Big]_3^{243} = \\ln 243 - \\ln 3 = \\ln 81 = 4\\ln 3 \\approx \\boxed{4.394 \\text{ km}}$$'}</p>
                  <p style={S.p}><strong>Part (b) — Distance in the first minute only.</strong></p>
                  <p style={S.p}>{'Limits: $t=0 \\Rightarrow u=3$, $t=1 \\Rightarrow u = 1-1+3 = 3$.'}</p>
                  <p style={{textAlign:'center'}}>{'$$\\int_0^1 \\frac{4t^3-2t}{t^4-t^2+3}\\,dt = \\Big[\\ln u\\Big]_3^{3} = \\ln 3 - \\ln 3 = \\boxed{0 \\text{ km}}$$'}</p>
                  <div style={{...S.calloutGold,marginTop:'16px',marginBottom:0}}>
                    <strong>What just happened?</strong> When $t=0$ and $t=1$ both give $u=3$, the upper and lower limits of the transformed integral are <em>identical</em> — so by the same-limits rule {'$\\int_a^a f\\,du = 0$'}, the net distance is zero. This is a powerful reminder: always check your transformed limits carefully before concluding.
                  </div>
                </ToggleAnswer>
              </div>

              <div style={S.divider} />
              <div style={S.calloutTeal}><strong style={{color:'#1a6b6b'}}>Coming up next —</strong> §5.4 Applying Definite Integration: Distribution of Wealth and Average Value — where we use integrals to measure economic inequality with the Lorenz curve and Gini coefficient.</div>

              {/* Chapter Quiz link */}
              <div style={{ marginBottom:'32px', marginTop:'24px' }}>
                <div style={{ fontFamily:'var(--fm)', fontSize:'.6rem', letterSpacing:'.2em', textTransform:'uppercase', color:'var(--text3)', padding:'6px 0', borderBottom:'1px solid var(--border)', marginBottom:'16px' }}>Chapter 5 Assessment</div>
                <Link href="/courses/calc1/ch5-quiz" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'20px 24px', background:'linear-gradient(135deg,rgba(26,107,107,.12),rgba(26,107,107,.06))', border:'1.5px solid rgba(26,107,107,.35)', borderRadius:'12px', textDecoration:'none', color:'inherit', transition:'all .2s' }}>
                  <div>
                    <div style={{ fontFamily:'var(--fm)', fontSize:'.62rem', letterSpacing:'.16em', textTransform:'uppercase', color:'var(--teal)', marginBottom:'6px' }}>⚡ Live Quiz · Auto-Graded</div>
                    <div style={{ fontFamily:'var(--fh)', fontSize:'1.1rem', color:'var(--text)', marginBottom:'4px' }}>Chapter 5 Integration Quiz</div>
                    <div style={{ fontFamily:'var(--fm)', fontSize:'.72rem', color:'var(--text3)' }}>5 randomised questions · instant feedback · downloadable result card</div>
                  </div>
                  <div style={{ flexShrink:0, marginLeft:'20px', background:'var(--teal)', color:'#fff', fontFamily:'var(--fm)', fontSize:'.72rem', letterSpacing:'.1em', textTransform:'uppercase', padding:'10px 18px', borderRadius:'8px' }}>Take Quiz →</div>
                </Link>
              </div>
            </section>

          </div>{/* end lec-inner */}

          {/* FOOTER NAV */}
          <div style={S.lecFooterNav} className="lec-fnav-m">
            <Link href="/courses/calc1/s52" style={S.lnfBtnPrev}>← §5.2 Substitution</Link>
            <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:'.7rem', color:'#7f8c8d', textAlign:'center' }}>§5.3 · Chapter 5 · Calculus I</div>
            <Link href="/courses/calc1" style={S.lnfBtnNext}>§5.4 Applying Integration →</Link>
          </div>

        </main>
      </div>

      <Footer />
    </>
  );
}