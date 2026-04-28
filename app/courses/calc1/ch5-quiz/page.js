'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';


// ─── Supabase ─────────────────────────────────────────────────────────────────
const SUPABASE_URL = 'https://ujmxucxfqohlvssoxpsc.supabase.co';
const SUPABASE_KEY = 'sb_publishable_Oh6eOOEaCpb420HxsaMreA_lB0BRzN7';

async function sbInsert(data) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/quiz_attempts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify(data),
  });
  return res.ok;
}

async function sbGetStats() {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/quiz_attempts?select=score,percentage,status,time_seconds`,
    { headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` } }
  );
  return res.ok ? await res.json() : [];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }
function frac(num, den) {
  if (den === 0) return '∞';
  if (num % den === 0) return String(num / den);
  const g = gcd(Math.abs(num), Math.abs(den));
  if (den / g < 0) return `\\frac{${-num / g}}{${-den / g}}`;
  return `\\frac{${num / g}}{${den / g}}`;
}
function gradeLabel(pct) {
  if (pct >= 90) return { label: 'Excellent — A', cls: 'A' };
  if (pct >= 75) return { label: 'Good — B', cls: 'B' };
  if (pct >= 60) return { label: 'Satisfactory — C', cls: 'C' };
  return { label: 'Needs Improvement — F', cls: 'F' };
}
function formatTime(sec) {
  const m = Math.floor(sec / 60).toString().padStart(2, '0');
  const s = (sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

// ─── Question Bank ────────────────────────────────────────────────────────────
const QUESTION_BANK = [
  // Q1 — Power Rule negative exponent
  () => {
    const n = randInt(2, 5);
    return {
      text: `Rewrite and integrate: $\\displaystyle\\int \\dfrac{1}{x^{${n}}}\\,dx$`,
      topic: 'Power Rule — Negative Exponent',
      options: shuffle([
        { tex: `$\\dfrac{-1}{${n-1}}x^{-${n-1}} + C$`, correct: true },
        { tex: `$\\ln|x^{${n}}| + C$`, correct: false },
        { tex: `$\\dfrac{1}{${n+1}}x^{${n+1}} + C$`, correct: false },
        { tex: `$-${n}x^{-${n+1}} + C$`, correct: false },
      ]),
      explanation: `Rewrite as $x^{-${n}}$. Power rule: $\\int x^{-${n}}\\,dx = \\dfrac{x^{-${n}+1}}{-${n}+1}+C = \\dfrac{-1}{${n-1}x^{${n-1}}}+C$.`,
    };
  },

  // Q2 — Constant Multiple fractional coefficient
  () => {
    const k = randInt(2, 5), n = randInt(2, 5), denom = randInt(2, 4);
    const numAns = k, denAns = denom * (n + 1);
    const g = gcd(numAns, denAns);
    return {
      text: `Find $\\displaystyle\\int \\dfrac{${k}}{${denom}}x^{${n}}\\,dx$`,
      topic: 'Constant Multiple — Fractional Coefficient',
      options: shuffle([
        { tex: `$\\dfrac{${numAns/g}}{${denAns/g}}x^{${n+1}} + C$`, correct: true },
        { tex: `$\\dfrac{${k}}{${denom*n}}x^{${n}} + C$`, correct: false },
        { tex: `$\\dfrac{${k}}{${denom}}x^{${n+1}} + C$`, correct: false },
        { tex: `$\\dfrac{${k*n}}{${denom}}x^{${n-1}} + C$`, correct: false },
      ]),
      explanation: `Pull the constant out: $\\dfrac{${k}}{${denom}}\\int x^{${n}}\\,dx = \\dfrac{${k}}{${denom*(n+1)}}x^{${n+1}}+C = \\dfrac{${numAns/g}}{${denAns/g}}x^{${n+1}}+C$.`,
    };
  },

  // Q3 — Exponential linear exponent
  () => {
    const a = randInt(2, 6), b = randInt(1, 8);
    return {
      text: `Find $\\displaystyle\\int e^{${a}x + ${b}}\\,dx$`,
      topic: 'Exponential — Linear Exponent',
      options: shuffle([
        { tex: `$\\dfrac{e^{${a}x+${b}}}{${a}} + C$`, correct: true },
        { tex: `$${a}e^{${a}x+${b}} + C$`, correct: false },
        { tex: `$e^{${a}x+${b}} + C$`, correct: false },
        { tex: `$(${a}x+${b})e^{${a}x+${b}} + C$`, correct: false },
      ]),
      explanation: `Let $u=${a}x+${b}$, $du=${a}\\,dx$. Then $\\int e^u\\dfrac{du}{${a}} = \\dfrac{e^{${a}x+${b}}}{${a}}+C$.`,
    };
  },

  // Q4 — Logarithmic rule disguised
  () => {
    const k = randInt(2, 8), a = randInt(2, 7);
    const g = gcd(k, a);
    return {
      text: `Find $\\displaystyle\\int \\dfrac{${k}}{${a}x}\\,dx$`,
      topic: 'Logarithmic Rule — Disguised Form',
      options: shuffle([
        { tex: `$\\dfrac{${k/g}}{${a/g}}\\ln|x| + C$`, correct: true },
        { tex: `$\\dfrac{${k}}{${a}}\\ln|${a}x| + C$`, correct: false },
        { tex: `$\\dfrac{${k}}{${2*a}}x^{-2} + C$`, correct: false },
        { tex: `$${k}\\ln|${a}x| + C$`, correct: false },
      ]),
      explanation: `$\\int\\dfrac{${k}}{${a}x}\\,dx = \\dfrac{${k}}{${a}}\\ln|x|+C = \\dfrac{${k/g}}{${a/g}}\\ln|x|+C$.`,
    };
  },

  // Q5 — Substitution linear
  () => {
    const a = randInt(2, 5), b = randInt(1, 6), n = randInt(3, 6);
    const denom = a * (n + 1);
    return {
      text: `Find $\\displaystyle\\int (${a}x + ${b})^{${n}}\\,dx$. Which step comes immediately after letting $u = ${a}x+${b}$?`,
      topic: 'Substitution — Identifying the Next Step',
      options: shuffle([
        { tex: `Replace $dx = \\dfrac{du}{${a}}$ and integrate $\\dfrac{1}{${a}}\\int u^{${n}}\\,du$`, correct: true },
        { tex: `Integrate directly: $\\dfrac{(${a}x+${b})^{${n+1}}}{${n+1}}+C$`, correct: false },
        { tex: `Replace $dx = ${a}\\,du$ and integrate $${a}\\int u^{${n}}\\,du$`, correct: false },
        { tex: `Expand $(${a}x+${b})^{${n}}$ using the binomial theorem`, correct: false },
      ]),
      explanation: `If $u=${a}x+${b}$ then $du=${a}\\,dx$, so $dx=\\dfrac{du}{${a}}$. The integral becomes $\\dfrac{1}{${a}}\\int u^{${n}}\\,du = \\dfrac{(${a}x+${b})^{${n+1}}}{${denom}}+C$.`,
    };
  },

  // Q6 — Substitution quadratic coefficient mismatch
  () => {
    const c = randInt(1, 8), n = randInt(2, 4), k = randInt(3, 7);
    const numAns = k, denAns = 2 * (n + 1);
    const g = gcd(numAns, denAns);
    return {
      text: `Find $\\displaystyle\\int ${k}x(x^2+${c})^{${n}}\\,dx$`,
      topic: 'Substitution — Adjusting for the Coefficient',
      options: shuffle([
        { tex: `$\\dfrac{${numAns/g}}{${denAns/g}}(x^2+${c})^{${n+1}} + C$`, correct: true },
        { tex: `$\\dfrac{${k}}{${n+1}}(x^2+${c})^{${n+1}} + C$`, correct: false },
        { tex: `$\\dfrac{1}{${2*(n+1)}}(x^2+${c})^{${n+1}} + C$`, correct: false },
        { tex: `$${k}(x^2+${c})^{${n+1}} + C$`, correct: false },
      ]),
      explanation: `Let $u=x^2+${c}$, $du=2x\\,dx$, $x\\,dx=\\dfrac{du}{2}$. So $\\dfrac{${numAns/g}}{${denAns/g}}(x^2+${c})^{${n+1}}+C$.`,
    };
  },

  // Q7 — Definite Integral negative lower limit
  () => {
    const a = -(randInt(1, 3)), b = randInt(2, 5);
    const nEven = randInt(2, 4) % 2 === 0 ? randInt(2,4) : randInt(2,4)+1;
    const numVal = Math.pow(b, nEven+1) - Math.pow(a, nEven+1);
    const denVal = nEven + 1;
    const g = gcd(Math.abs(numVal), denVal);
    return {
      text: `Evaluate $\\displaystyle\\int_{${a}}^{${b}} x^{${nEven}}\\,dx$`,
      topic: 'Definite Integral — Negative Lower Limit',
      options: shuffle([
        { tex: `$${frac(numVal, denVal)}$`, correct: true },
        { tex: `$${frac(Math.pow(b,nEven+1), denVal)}$`, correct: false },
        { tex: `$${frac(numVal, nEven)}$`, correct: false },
        { tex: `$${frac(-numVal, denVal)}$`, correct: false },
      ]),
      explanation: `$\\left[\\dfrac{x^{${nEven+1}}}{${nEven+1}}\\right]_{${a}}^{${b}} = \\dfrac{${Math.pow(b,nEven+1)} - (${Math.pow(a,nEven+1)})}{${nEven+1}} = ${frac(numVal,denVal)}$.`,
    };
  },

  // Q8 — Definite exponential with coefficient
  () => {
    const k = randInt(2, 4), b = randInt(1, 3);
    return {
      text: `Evaluate $\\displaystyle\\int_{0}^{${b}} e^{${k}x}\\,dx$`,
      topic: 'Definite Integral — Exponential with Coefficient',
      options: shuffle([
        { tex: `$\\dfrac{e^{${k*b}}-1}{${k}}$`, correct: true },
        { tex: `$e^{${k*b}}-1$`, correct: false },
        { tex: `$\\dfrac{e^{${k*b}}}{${k}}$`, correct: false },
        { tex: `$${k}(e^{${k*b}}-1)$`, correct: false },
      ]),
      explanation: `$\\left[\\dfrac{e^{${k}x}}{${k}}\\right]_0^{${b}} = \\dfrac{e^{${k*b}}-1}{${k}}$.`,
    };
  },

  // Q9 — Substitution in definite integral, limits must change
  () => {
    const a = randInt(1, 4), k = randInt(2, 4);
    const lo = k, hi = a*a+k;
    return {
      text: `Evaluate $\\displaystyle\\int_0^{${a}} \\dfrac{x}{(x^2+${k})^3}\\,dx$ using substitution $u=x^2+${k}$.`,
      topic: 'Substitution — Definite, Rational Integrand',
      options: shuffle([
        { tex: `$\\dfrac{1}{4}\\!\\left(\\dfrac{1}{${lo}^2} - \\dfrac{1}{${hi}^2}\\right)$`, correct: true },
        { tex: `$\\dfrac{1}{2}\\!\\left(\\dfrac{1}{${lo}^2} - \\dfrac{1}{${hi}^2}\\right)$`, correct: false },
        { tex: `$\\dfrac{1}{4}\\!\\left(\\dfrac{1}{${hi}^2} - \\dfrac{1}{${lo}^2}\\right)$`, correct: false },
        { tex: `$\\dfrac{-1}{4${hi}^2}$`, correct: false },
      ]),
      explanation: `$u=x^2+${k}$, limits $u=${lo}$ to $u=${hi}$. $= \\tfrac{1}{2}\\int_{${lo}}^{${hi}} u^{-3}\\,du = \\dfrac{1}{4}\\!\\left(\\dfrac{1}{${lo}^2}-\\dfrac{1}{${hi}^2}\\right)$.`,
    };
  },

  // Q10 — IVP cubic
  () => {
    const a = randInt(2, 5), b = randInt(2, 7), x0 = randInt(1, 3), y0 = randInt(1, 8);
    const C = y0 - (a*x0*x0*x0/3 + b*x0);
    const Cstr = C >= 0 ? `+${C}` : `${C}`;
    const wrongC1 = y0, wrongC2 = C + 1;
    return {
      text: `If $f'(x) = ${a}x^2 + ${b}$ and $f(${x0}) = ${y0}$, find $f(x)$.`,
      topic: 'Initial Value Problem — Cubic',
      options: shuffle([
        { tex: `$\\dfrac{${a}}{3}x^3 + ${b}x ${Cstr}$`, correct: true },
        { tex: `$\\dfrac{${a}}{3}x^3 + ${b}x + ${wrongC1}$`, correct: false },
        { tex: `$${a}x^2 + ${b}x + ${y0}$`, correct: false },
        { tex: `$\\dfrac{${a}}{3}x^3 + ${b}x + ${wrongC2}$`, correct: false },
      ]),
      explanation: `Integrate: $f(x)=\\dfrac{${a}}{3}x^3+${b}x+C$. Apply $f(${x0})=${y0}$ to get $C=${C}$.`,
    };
  },

  // Q11 — Area, curve below axis
  () => {
    const k = randInt(2, 4);
    const negNet = -4*k*k*k/3;
    return {
      text: `The curve $f(x) = x^2 - ${k*k}$ lies below the $x$-axis on $[-${k}, ${k}]$. Which value represents the <em>total area</em> enclosed?`,
      topic: 'Area — Curve Below Axis',
      options: shuffle([
        { tex: `$\\dfrac{${4*k*k*k}}{3}$`, correct: true },
        { tex: `$${negNet}$`, correct: false },
        { tex: `$0$`, correct: false },
        { tex: `$\\dfrac{${2*k*k*k}}{3}$`, correct: false },
      ]),
      explanation: `Since $f(x)\\leq 0$, the definite integral gives $${negNet}$ (negative). Total area $= \\dfrac{${4*k*k*k}}{3}$. Area is always positive.`,
    };
  },

  // Q12 — Net change, velocity changes sign
  () => {
    const sq = [4,9,16][randInt(0,2)];
    const sqRoot = Math.sqrt(sq);
    const T = sqRoot * 2;
    const net = sq*T - T*T*T/3;
    return {
      text: `A particle moves with $v(t) = ${sq} - t^2$ m/s for $0 \\leq t \\leq ${T}$. The velocity is zero at $t = ${sqRoot}$. Find the net displacement over $[0, ${T}]$.`,
      topic: 'Net Change — Velocity Changes Sign',
      options: shuffle([
        { tex: `$${net}$ m`, correct: true },
        { tex: `$${sq*T}$ m`, correct: false },
        { tex: `$0$ m`, correct: false },
        { tex: `$${Math.abs(net)+sq}$ m`, correct: false },
      ]),
      explanation: `Net displacement $=\\int_0^{${T}}(${sq}-t^2)\\,dt = ${sq}\\cdot${T} - \\dfrac{${T}^3}{3} = ${net}$ m.`,
    };
  },

  // Q13 — Choosing substitution, reasoning
  () => {
    const c = randInt(1, 6);
    return {
      text: `For $\\displaystyle\\int x^2 e^{x^3 + ${c}}\\,dx$, a student considers (I) $u = x^3+${c}$ and (II) $u = x^2$. Which works and why?`,
      topic: 'Choosing the Substitution — Reasoning',
      options: shuffle([
        { tex: `Only (I): because $du = 3x^2\\,dx$, so $x^2\\,dx = \\dfrac{du}{3}$ appears in the integrand`, correct: true },
        { tex: `Only (II): because the $x^2$ factor is already written out`, correct: false },
        { tex: `Both work equally well`, correct: false },
        { tex: `Neither works; expand $e^{x^3+${c}}$ instead`, correct: false },
      ]),
      explanation: `With $u=x^3+${c}$: $du=3x^2\\,dx \\Rightarrow x^2\\,dx=\\dfrac{du}{3}$. Substitution (II) fails — no lone $x$ remains.`,
    };
  },

  // Q14 — Rule identification mixed integrand
  () => {
    const k = randInt(2, 6), n = randInt(2, 4), m = randInt(2, 5);
    return {
      text: `To evaluate $\\displaystyle\\int\\!\\left(${k}x^{${n}} + \\dfrac{1}{x} + e^{${m}x}\\right)dx$, which combination of rules is needed?`,
      topic: 'Rule Identification — Mixed Integrand',
      options: shuffle([
        { tex: `Power rule, Logarithmic rule, Exponential rule`, correct: true },
        { tex: `Power rule three times`, correct: false },
        { tex: `Substitution rule for all three terms`, correct: false },
        { tex: `Power rule, Power rule ($n=-1$), Exponential rule`, correct: false },
      ]),
      explanation: `Term 1: power rule. Term 2: $\\int\\dfrac{1}{x}\\,dx=\\ln|x|$ (log rule, not power rule — power rule fails at $n=-1$). Term 3: exponential rule.`,
    };
  },

  // Q15 — Same limits trap
  () => {
    const a = randInt(2, 9), p = randInt(3, 7), q = randInt(2, 6), r = randInt(1, 8);
    return {
      text: `Evaluate $\\displaystyle\\int_{${a}}^{${a}} \\left( x^{${p}} - ${q}x^{${r}} + e^{x} \\right) dx$`,
      topic: 'Conceptual Trap — Same Limits',
      options: shuffle([
        { tex: `$0$`, correct: true },
        { tex: `$e^{${a}} - ${a}$`, correct: false },
        { tex: `$\\dfrac{${a}^{${p+1}}}{${p+1}} - ${q}\\cdot\\dfrac{${a}^{${r+1}}}{${r+1}} + e^{${a}}$`, correct: false },
        { tex: `$1$`, correct: false },
      ]),
      explanation: `When the upper and lower limits are identical, the integral is always $0$ — regardless of how complex the integrand looks.`,
    };
  },

  // Q16 — Same limits trap v2
  () => {
    const a = randInt(3, 12), k = randInt(2, 9), n = randInt(2, 5);
    return {
      text: `Evaluate $\\displaystyle\\int_{${a}}^{${a}} \\dfrac{${k}x^{${n}} + \\sqrt{x}}{x^2 + 1}\\,dx$`,
      topic: 'Conceptual Trap — Same Limits',
      options: shuffle([
        { tex: `$0$`, correct: true },
        { tex: `$${k}$`, correct: false },
        { tex: `$\\ln(${a}^2+1)$`, correct: false },
        { tex: `$${a}$`, correct: false },
      ]),
      explanation: `$\\int_a^a f(x)\\,dx = 0$ always, regardless of the integrand.`,
    };
  },

  // Q17 — Net signed area with SVG graph
  () => {
    const posA = randInt(3, 10), negA = randInt(2, 8);
    const p = randInt(2, 5), q = p + randInt(2, 4);
    const net = posA - negA, total = posA + negA;
    const W=320, H=180, padL=38, padR=10, padT=12, padB=32;
    const gW=W-padL-padR, gH=H-padT-padB;
    const xMax=q+0.5;
    const px = x => padL + (x/xMax)*gW;
    const py = y => padT + gH - ((y+2)/5)*gH;
    const y0 = py(0);
    const peakY = py(1.8), troughY = py(-1.6);
    const svg = `<svg width="100%" viewBox="0 0 ${W} ${H}" style="display:block;margin:12px auto 4px;max-width:320px;border-radius:8px;background:#fdf8f0;border:1px solid #e0d6c8;">
<path d="M${px(0)},${y0} Q${px(p*0.5)},${peakY} ${px(p)},${y0}" fill="rgba(26,107,107,0.18)" stroke="none"/>
<path d="M${px(p)},${y0} Q${px((p+q)/2)},${troughY} ${px(q)},${y0}" fill="rgba(192,57,43,0.18)" stroke="none"/>
<line x1="${padL}" y1="${y0}" x2="${W-padR}" y2="${y0}" stroke="#555" stroke-width="1.5"/>
<line x1="${padL}" y1="${padT}" x2="${padL}" y2="${H-padB}" stroke="#555" stroke-width="1.5"/>
<path d="M${px(0)},${y0} Q${px(p*0.5)},${peakY} ${px(p)},${y0} Q${px((p+q)/2)},${troughY} ${px(q)},${y0}" fill="none" stroke="#1a6b6b" stroke-width="2.2"/>
<text x="${px(0)}" y="${H-padB+14}" text-anchor="middle" font-size="11" font-family="IBM Plex Mono,monospace" fill="#555">0</text>
<text x="${px(p)}" y="${H-padB+14}" text-anchor="middle" font-size="11" font-family="IBM Plex Mono,monospace" fill="#1a6b6b" font-weight="700">${p}</text>
<text x="${px(q)}" y="${H-padB+14}" text-anchor="middle" font-size="11" font-family="IBM Plex Mono,monospace" fill="#c0392b" font-weight="700">${q}</text>
<text x="${px(p*0.5)}" y="${py(0.7)}" text-anchor="middle" font-size="11" font-family="IBM Plex Mono,monospace" fill="#1a6b6b" font-weight="700">+${posA}</text>
<text x="${px((p+q)/2)}" y="${py(-0.7)}" text-anchor="middle" font-size="11" font-family="IBM Plex Mono,monospace" fill="#c0392b" font-weight="700">−${negA}</text>
<text x="${W-padR-4}" y="${padT+14}" text-anchor="end" font-size="11" font-family="serif" font-style="italic" fill="#1a6b6b">f(x)</text>
</svg>`;
    return {
      text: `The graph of $f(x)$ is shown. The teal region $(0$ to $${p})$ has signed area $+${posA}$. The red region $(${p}$ to $${q})$ has signed area $-${negA}$. Find $\\displaystyle\\int_0^{${q}} f(x)\\,dx$.\n${svg}`,
      topic: 'Graph — Net Signed Area',
      options: shuffle([
        { tex: `$${net}$`, correct: true },
        { tex: `$${total}$`, correct: false },
        { tex: `$${-net}$`, correct: false },
        { tex: `$${posA}$`, correct: false },
      ]),
      explanation: `Signed area: $\\int_0^{${q}} f\\,dx = +${posA} + (-${negA}) = ${net}$.`,
    };
  },

  // Q18 — Net vs Total Area, 3 regions
  () => {
    const a1=randInt(4,10), a2=randInt(3,8), a3=randInt(2,6);
    const c1=randInt(2,3), c2=c1+randInt(2,3), c3=c2+randInt(2,3);
    const net=a1-a2+a3, total=a1+a2+a3;
    const W=320,H=180,pL=40,pR=12,pT=14,pB=30;
    const gW=W-pL-pR,gH=H-pT-pB,xMax=c3+0.7,yMin=-2.2,yMax=2.5,yRng=yMax-yMin;
    const px=x=>(pL+(x/xMax)*gW).toFixed(1);
    const py=y=>(pT+gH-((y-yMin)/yRng)*gH).toFixed(1);
    const y0=py(0),mid1=c1/2,mid2=(c1+c2)/2,mid3=(c2+c3)/2;
    const h1=1.75,h2=-1.6,h3=1.6;
    const cp=`M${px(0)},${y0} Q${px(mid1)},${py(h1)} ${px(c1)},${y0} Q${px(mid2)},${py(h2)} ${px(c2)},${y0} Q${px(mid3)},${py(h3)} ${px(c3)},${y0}`;
    const svg=`<svg width="100%" viewBox="0 0 ${W} ${H}" style="display:block;margin:10px auto 6px;max-width:320px;border-radius:10px;background:#fdf8f0;border:1.5px solid #e0d6c8;">
<path d="M${px(0)},${y0} Q${px(mid1)},${py(h1)} ${px(c1)},${y0} Z" fill="rgba(26,107,107,0.20)" stroke="rgba(26,107,107,0.5)" stroke-width="1"/>
<path d="M${px(c1)},${y0} Q${px(mid2)},${py(h2)} ${px(c2)},${y0} Z" fill="rgba(192,57,43,0.18)" stroke="rgba(192,57,43,0.5)" stroke-width="1"/>
<path d="M${px(c2)},${y0} Q${px(mid3)},${py(h3)} ${px(c3)},${y0} Z" fill="rgba(26,107,107,0.20)" stroke="rgba(26,107,107,0.5)" stroke-width="1"/>
<line x1="${pL}" y1="${pT}" x2="${pL}" y2="${H-pB+4}" stroke="#888" stroke-width="1.5"/>
<line x1="${pL-4}" y1="${H-pB}" x2="${W-pR}" y2="${H-pB}" stroke="#888" stroke-width="1.5"/>
<polygon points="${pL},${pT} ${pL-4},${pT+8} ${pL+4},${pT+8}" fill="#888"/>
<polygon points="${W-pR},${H-pB} ${W-pR-8},${H-pB-4} ${W-pR-8},${H-pB+4}" fill="#888"/>
<line x1="${pL}" y1="${y0}" x2="${W-pR}" y2="${y0}" stroke="#ccc" stroke-width="1" stroke-dasharray="3,3"/>
<path d="${cp}" fill="none" stroke="#1a6b6b" stroke-width="2.2" stroke-linecap="round"/>
<text x="${px(c1)}" y="${H-pB+16}" text-anchor="middle" font-size="11" font-family="IBM Plex Mono,monospace" fill="#555">${c1}</text>
<text x="${px(c2)}" y="${H-pB+16}" text-anchor="middle" font-size="11" font-family="IBM Plex Mono,monospace" fill="#555">${c2}</text>
<text x="${px(c3)}" y="${H-pB+16}" text-anchor="middle" font-size="11" font-family="IBM Plex Mono,monospace" fill="#c0392b" font-weight="700">${c3}</text>
<text x="${px(mid1)}" y="${py(h1/1.8)}" text-anchor="middle" font-size="11" font-family="IBM Plex Mono,monospace" fill="#1a6b6b" font-weight="700">+${a1}</text>
<text x="${px(mid2)}" y="${py(h2/1.8)}" text-anchor="middle" font-size="11" font-family="IBM Plex Mono,monospace" fill="#c0392b" font-weight="700">−${a2}</text>
<text x="${px(mid3)}" y="${py(h3/1.8)}" text-anchor="middle" font-size="11" font-family="IBM Plex Mono,monospace" fill="#1a6b6b" font-weight="700">+${a3}</text>
</svg>`;
    return {
      text:`The graph of $f(x)$ is shown with three shaded regions. What is $\\displaystyle\\int_0^{${c3}} f(x)\\,dx$?\n${svg}`,
      topic:'Graph — Net vs Total Area',
      options:shuffle([{tex:`$${net}$`,correct:true},{tex:`$${total}$`,correct:false},{tex:`$${a1-a2}$`,correct:false},{tex:`$${a1+a3}$`,correct:false}]),
      explanation:`$\\int_0^{${c3}} f\\,dx = (+${a1})+(-${a2})+(+${a3}) = ${net}$. Teal positive, red negative.`,
    };
  },

  // Q19 — Subdivision rule
  () => {
    const c=randInt(2,5), b=c+randInt(2,5), full=randInt(8,25), part1=randInt(2,full-2), part2=full-part1;
    return {
      text:`From a graph: $\\displaystyle\\int_{0}^{${b}} f(x)\\,dx = ${full}$ and $\\displaystyle\\int_{0}^{${c}} f(x)\\,dx = ${part1}$. Find $\\displaystyle\\int_{${c}}^{${b}} f(x)\\,dx$.`,
      topic:'Graph — Subdivision Rule',
      options:shuffle([{tex:`$${part2}$`,correct:true},{tex:`$${full+part1}$`,correct:false},{tex:`$${part2+1}$`,correct:false},{tex:`$${part1}$`,correct:false}]),
      explanation:`$\\int_{${c}}^{${b}} f\\,dx = ${full} - ${part1} = ${part2}$.`,
    };
  },

  // Q20 — Reversed limits
  () => {
    const posA=randInt(3,15), a=randInt(1,4), b=a+randInt(2,5);
    return {
      text:`It is known that $\\displaystyle\\int_{${a}}^{${b}} f(x)\\,dx = ${posA}$. What is $\\displaystyle\\int_{${b}}^{${a}} f(x)\\,dx$?`,
      topic:'Conceptual — Reversed Limits',
      options:shuffle([{tex:`$-${posA}$`,correct:true},{tex:`$${posA}$`,correct:false},{tex:`$0$`,correct:false},{tex:`$\\dfrac{1}{${posA}}$`,correct:false}]),
      explanation:`Reversing limits negates: $\\int_b^a f\\,dx = -\\int_a^b f\\,dx = -${posA}$.`,
    };
  },

  // Q21 — Constant multiple on known integral
  () => {
    const k=randInt(2,8), val=randInt(3,12), a=randInt(0,3), b=a+randInt(2,6);
    const ans=k*val;
    return {
      text:`If $\\displaystyle\\int_{${a}}^{${b}} f(x)\\,dx = ${val}$, find $\\displaystyle\\int_{${a}}^{${b}} ${k}f(x)\\,dx$.`,
      topic:'Conceptual — Constant Multiple',
      options:shuffle([{tex:`$${ans}$`,correct:true},{tex:`$${val}$`,correct:false},{tex:`$${val+k}$`,correct:false},{tex:`$${ans+k}$`,correct:false}]),
      explanation:`Constant multiple rule: $${k}\\times${val} = ${ans}$.`,
    };
  },

  // Q22 — Linear combination of two known integrals
  () => {
    const fVal=randInt(3,10), gVal=randInt(2,8), k1=randInt(2,5), k2=randInt(2,5);
    const a=randInt(0,2), b=a+randInt(3,6), ans=k1*fVal-k2*gVal;
    return {
      text:`Given $\\displaystyle\\int_{${a}}^{${b}} f(x)\\,dx = ${fVal}$ and $\\displaystyle\\int_{${a}}^{${b}} g(x)\\,dx = ${gVal}$, evaluate $\\displaystyle\\int_{${a}}^{${b}} \\left[${k1}f(x) - ${k2}g(x)\\right]dx$.`,
      topic:'Conceptual — Linear Combination',
      options:shuffle([{tex:`$${ans}$`,correct:true},{tex:`$${k1*fVal+k2*gVal}$`,correct:false},{tex:`$${fVal-gVal}$`,correct:false},{tex:`$${k1*fVal}$`,correct:false}]),
      explanation:`$${k1}(${fVal}) - ${k2}(${gVal}) = ${ans}$.`,
    };
  },

  // Q23 — Marginal cost application
  () => {
    const coeff=randInt(2,6), cons=randInt(10,40), x1=randInt(10,40), x2=x1+randInt(10,30);
    const ans=coeff*(x2*x2-x1*x1)/2+cons*(x2-x1);
    return {
      text:`A factory's marginal cost is $C'(x) = ${coeff}x + ${cons}$ (PKR per unit). Find the increase in total cost when production rises from $x=${x1}$ to $x=${x2}$ units.`,
      topic:'Application — Marginal Cost',
      options:shuffle([{tex:`$\\text{PKR }${ans}$`,correct:true},{tex:`$\\text{PKR }${ans+cons}$`,correct:false},{tex:`$\\text{PKR }${coeff*(x2-x1)+cons}$`,correct:false},{tex:`$\\text{PKR }${ans-(x2-x1)*coeff}$`,correct:false}]),
      explanation:`Cost increase $= \\int_{${x1}}^{${x2}}(${coeff}x+${cons})\\,dx = \\text{PKR }${ans}$.`,
    };
  },

  // Q24 — Displacement vs distance
  () => {
    const v0=randInt(2,6), k=randInt(1,3), T=(v0/k)*2, zero=v0/k;
    const net=v0*T-k*T*T/2, dist1=v0*zero-k*zero*zero/2;
    const totalDist=dist1*2;
    return {
      text:`A particle moves with velocity $v(t) = ${v0} - ${k}t$ m/s for $0 \\leq t \\leq ${T}$. Which of the following is true?`,
      topic:'Application — Displacement vs Distance',
      options:shuffle([
        {tex:`Net displacement $= ${net}$ m; total distance $= ${totalDist}$ m`,correct:true},
        {tex:`Net displacement $= ${totalDist}$ m; total distance $= ${net}$ m`,correct:false},
        {tex:`Net displacement $= ${dist1}$ m; total distance $= ${dist1}$ m`,correct:false},
        {tex:`Both are equal to $${totalDist}$ m`,correct:false},
      ]),
      explanation:`Net displacement $= ${net}$ m. Reverses at $t=${zero}$. Total distance $= 2\\times${dist1} = ${totalDist}$ m.`,
    };
  },

  // Q25 — FTC Part 1
  () => {
    const a=randInt(0,3), p=randInt(2,5), c=randInt(1,8);
    return {
      text:`If $G(x) = \\displaystyle\\int_{${a}}^{x} \\left(t^{${p}} + ${c}\\right) dt$, find $G'(x)$.`,
      topic:'Conceptual — FTC Part 1',
      options:shuffle([
        {tex:`$x^{${p}} + ${c}$`,correct:true},
        {tex:`$\\dfrac{x^{${p+1}}}{${p+1}} + ${c}x$`,correct:false},
        {tex:`$\\dfrac{x^{${p+1}}}{${p+1}} + ${c}x - \\dfrac{${a}^{${p+1}}}{${p+1}} - ${c*a}$`,correct:false},
        {tex:`$${p}x^{${p-1}}$`,correct:false},
      ]),
      explanation:`By FTC Part 1: $\\dfrac{d}{dx}\\int_a^x f(t)\\,dt = f(x)$. So $G'(x) = x^{${p}} + ${c}$.`,
    };
  },

  // Q26 — Identifying antiderivatives
  () => {
    const a=randInt(2,6), b=randInt(1,8), n=randInt(2,4);
    return {
      text:`Which of the following is a correct antiderivative of $f(x) = ${a}x^{${n}} + \\dfrac{${b}}{x}$?`,
      topic:'Conceptual — Identifying Antiderivatives',
      options:shuffle([
        {tex:`$\\dfrac{${a}}{${n+1}}x^{${n+1}} + ${b}\\ln|x| + C$`,correct:true},
        {tex:`$\\dfrac{${a}}{${n+1}}x^{${n+1}} - \\dfrac{${b}}{x^2} + C$`,correct:false},
        {tex:`$${a*n}x^{${n-1}} - \\dfrac{${b}}{x^2} + C$`,correct:false},
        {tex:`$${a}x^{${n+1}} + ${b}\\ln|x| + C$`,correct:false},
      ]),
      explanation:`Power rule + log rule: $\\dfrac{${a}}{${n+1}}x^{${n+1}} + ${b}\\ln|x| + C$.`,
    };
  },

  // Q27 — Constant of integration meaning
  () => {
    const a=randInt(2,7), n=randInt(2,5), extra=randInt(2,9);
    return {
      text:`Two students find antiderivatives of $f(x) = ${a}x^{${n}}$. Student A writes $F(x) = \\dfrac{${a}}{${n+1}}x^{${n+1}}$ and Student B writes $G(x) = \\dfrac{${a}}{${n+1}}x^{${n+1}} + ${extra}$. Which statement is correct?`,
      topic:'Conceptual — The Constant of Integration',
      options:shuffle([
        {tex:`Both are correct — any two antiderivatives of the same function differ by a constant`,correct:true},
        {tex:`Only $F(x)$ is correct — the constant must be zero`,correct:false},
        {tex:`Only $G(x)$ is correct — you must always include a non-zero constant`,correct:false},
        {tex:`Neither is correct — the $+C$ must be written explicitly`,correct:false},
      ]),
      explanation:`$F'(x)=G'(x)=f(x)$. Both are valid antiderivatives. The $+C$ represents the entire family.`,
    };
  },

  // Q28 — Subdivision rule v2
  () => {
    const total=randInt(8,20), val_total=randInt(10,30), val_part1=randInt(3,val_total-1);
    const part1=randInt(3,total-2), val_part2=val_total-val_part1;
    return {
      text:`Given $\\displaystyle\\int_0^{${total}} f(x)\\,dx = ${val_total}$ and $\\displaystyle\\int_0^{${part1}} f(x)\\,dx = ${val_part1}$, find $\\displaystyle\\int_{${part1}}^{${total}} f(x)\\,dx$.`,
      topic:'Subdivision Rule',
      options:shuffle([{tex:`$${val_part2}$`,correct:true},{tex:`$${val_total+val_part1}$`,correct:false},{tex:`$${val_part2+1}$`,correct:false},{tex:`$${val_part1}$`,correct:false}]),
      explanation:`$\\int_{${part1}}^{${total}} f\\,dx = ${val_total} - ${val_part1} = ${val_part2}$.`,
    };
  },
];

const TOTAL_Q = 10;

function pickQuestions() {
  return shuffle([...QUESTION_BANK]).slice(0, TOTAL_Q).map(fn => fn());
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const ink='#1a1a2e', paper='#fdf8f0', cream='#f5ede0', accent='#c0392b';
const gold='#d4a017', teal='#1a6b6b', sky='#2980b9', green='#27ae60', muted='#7f8c8d';
const border='#e0d6c8', shadow='0 4px 24px rgba(26,26,46,.10)';
const fm="'IBM Plex Mono', monospace", fb="'Source Sans 3', sans-serif", fh="'Playfair Display', Georgia, serif";

const gradeColors = { A:[39,174,96], B:[26,107,107], C:[212,160,23], F:[192,57,43] };
const gradeCssColors = { A: green, B: teal, C: gold, F: accent, W: muted };

// ─── Main Quiz Component ──────────────────────────────────────────────────────
export default function Calc1Ch5Quiz() {
  // Phases: 'form' | 'quiz' | 'result'
  const [phase, setPhase] = useState('form');
  const [studentInfo, setStudentInfo] = useState({ name:'', cls:'', inst:'LUMS', id:'' });
  const [formError, setFormError] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [chosen, setChosen] = useState(-1);
  const [answered, setAnswered] = useState(false);
  const [timerSec, setTimerSec] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [tabWarning, setTabWarning] = useState(false);
  const [tabCount, setTabCount] = useState(0);
  const [withdrawModal, setWithdrawModal] = useState(false);
  const [resultData, setResultData] = useState(null);
  const [stats, setStats] = useState({ total:'—', completed:'—', withdrawn:'—', avgPct:'—%', avgTime:'—' });
  const questionRef = useRef(null);
  const feedbackRef = useRef(null);
  const timerRef = useRef(null);
  const quizActiveRef = useRef(false);
  const tabCountRef = useRef(0);

  // Load stats on mount
  useEffect(() => {
    sbGetStats().then(rows => {
      if (!rows.length) return;
      const completed = rows.filter(r => r.status === 'completed');
      const withdrawn = rows.filter(r => r.status === 'withdrawn' || r.status === 'tab_cheat');
      let avgPct = '—%', avgTime = '—';
      if (completed.length) {
        avgPct = (completed.reduce((s,r) => s+(r.percentage||0), 0) / completed.length).toFixed(1) + '%';
        const ts = completed.filter(r => r.time_seconds > 0);
        if (ts.length) avgTime = formatTime(Math.round(ts.reduce((s,r) => s+r.time_seconds,0)/ts.length));
      }
      setStats({ total: String(rows.length), completed: String(completed.length), withdrawn: String(withdrawn.length), avgPct, avgTime });
    }).catch(() => {});
  }, []);

  // Tab visibility
  useEffect(() => {
    const onVis = () => {
      if (!quizActiveRef.current) return;
      if (document.hidden) {
        tabCountRef.current += 1;
        if (tabCountRef.current === 1) {
          setTabWarning(true);
        } else {
          quizActiveRef.current = false;
          stopTimer();
          finishQuiz('tab_cheat', answers);
        }
      }
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, [answers]);

  // Timer
  const stopTimer = useCallback(() => {
    clearInterval(timerRef.current);
    setTimerActive(false);
  }, []);

  const startTimer = useCallback(() => {
    setTimerSec(0);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setTimerSec(s => s + 1), 1000);
    setTimerActive(true);
  }, []);

  // MathJax re-typeset when question or feedback changes
  useEffect(() => {
    if (questionRef.current && window.MathJax?.typesetPromise) {
      window.MathJax.typesetPromise([questionRef.current]);
    }
  }, [currentQ, answered]);

  useEffect(() => {
    if (feedbackRef.current && window.MathJax?.typesetPromise && answered) {
      window.MathJax.typesetPromise([feedbackRef.current]);
    }
  }, [answered]);

  // Cleanup timer on unmount
  useEffect(() => () => clearInterval(timerRef.current), []);

  // ── Start Quiz ──
  const startQuiz = () => {
    if (!studentInfo.name || !studentInfo.cls || !studentInfo.inst) {
      setFormError(true); return;
    }
    setFormError(false);
    const qs = pickQuestions();
    setQuestions(qs);
    setAnswers([]);
    setCurrentQ(0);
    setAnswered(false);
    setChosen(-1);
    setTabWarning(false);
    tabCountRef.current = 0;
    quizActiveRef.current = true;
    startTimer();
    setPhase('quiz');
  };

  // ── Select Answer ──
  const selectOption = (i) => {
    if (answered) return;
    const q = questions[currentQ];
    const isCorrect = q.options[i].correct;
    setChosen(i);
    setAnswered(true);
    setAnswers(prev => [...prev, { chosen: i, correct: isCorrect, topic: q.topic }]);
  };

  // ── Next Question ──
  const nextQuestion = () => {
    if (currentQ + 1 >= TOTAL_Q) {
      quizActiveRef.current = false;
      stopTimer();
      finishQuiz('completed', [...answers, { chosen, correct: questions[currentQ].options[chosen]?.correct, topic: questions[currentQ].topic }]);
    } else {
      setCurrentQ(q => q + 1);
      setAnswered(false);
      setChosen(-1);
    }
  };

  // ── Finish Quiz ──
  const finishQuiz = useCallback(async (status, finalAnswers) => {
    const score = finalAnswers.filter(a => a.correct).length;
    const pct = finalAnswers.length ? Math.round(score / TOTAL_Q * 100) : 0;
    const grade = gradeLabel(pct);
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' });
    setResultData({ score, pct, grade, dateStr, status, finalAnswers, timeTaken: timerRef.current ? timerSec : timerSec });
    setPhase('result');

    try {
      await sbInsert({
        student_name: studentInfo.name,
        student_class: studentInfo.cls,
        institute: studentInfo.inst,
        campus_id: studentInfo.id || null,
        score, total: TOTAL_Q, percentage: pct, status,
        time_seconds: timerSec,
      });
      // Refresh stats
      const rows = await sbGetStats();
      const completed = rows.filter(r => r.status === 'completed');
      const withdrawn = rows.filter(r => r.status === 'withdrawn' || r.status === 'tab_cheat');
      let avgPct = '—%', avgTime = '—';
      if (completed.length) {
        avgPct = (completed.reduce((s,r) => s+(r.percentage||0),0)/completed.length).toFixed(1)+'%';
        const ts = completed.filter(r => r.time_seconds > 0);
        if (ts.length) avgTime = formatTime(Math.round(ts.reduce((s,r) => s+r.time_seconds,0)/ts.length));
      }
      setStats({ total: String(rows.length), completed: String(completed.length), withdrawn: String(withdrawn.length), avgPct, avgTime });
    } catch(e) {}
  }, [studentInfo, timerSec]);

  // ── Withdraw ──
  const confirmWithdraw = () => {
    setWithdrawModal(false);
    quizActiveRef.current = false;
    stopTimer();
    finishQuiz('withdrawn', answers);
  };

  // ── Retake ──
  const retake = () => {
    stopTimer();
    quizActiveRef.current = false;
    setPhase('form');
    setStudentInfo(s => ({ ...s, name:'', cls:'', id:'' }));
    setAnswers([]);
    setCurrentQ(0);
    setAnswered(false);
    setChosen(-1);
    setTimerSec(0);
    setTabWarning(false);
    tabCountRef.current = 0;
  };

  // ── Download PDF ──
  const downloadPDF = () => {
    if (!resultData || !window.jspdf) return;
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation:'portrait', unit:'mm', format:'a4' });
    const { score, pct, grade, dateStr, finalAnswers, timeTaken } = resultData;
    const W=210, pad=20;
    const gc = gradeColors[grade.cls] || [127,140,141];
    const gcCss = gradeCssColors[grade.cls] || muted;

    doc.setFillColor(26,26,46); doc.rect(0,0,W,60,'F');
    doc.setFont('helvetica','bold'); doc.setFontSize(9); doc.setTextColor(212,160,23);
    doc.text('MATH-101 · CALCULUS I · LUMS', W/2, 18, {align:'center'});
    doc.setFontSize(22); doc.setTextColor(253,248,240);
    doc.text('Integration Quiz — Chapter 5', W/2, 32, {align:'center'});
    doc.setFont('helvetica','normal'); doc.setFontSize(10); doc.setTextColor(200,190,180);
    doc.text('Official Result Card', W/2, 42, {align:'center'});
    doc.text(dateStr, W/2, 50, {align:'center'});
    doc.setDrawColor(...gc); doc.setLineWidth(2); doc.circle(W/2, 82, 18);
    doc.setFont('helvetica','bold'); doc.setFontSize(22); doc.setTextColor(...gc);
    doc.text(String(score), W/2, 87, {align:'center'});
    doc.setFontSize(9); doc.setTextColor(127,140,141); doc.text(`/ ${TOTAL_Q}`, W/2, 94, {align:'center'});
    doc.setFont('helvetica','bold'); doc.setFontSize(16); doc.setTextColor(26,26,46);
    doc.text(studentInfo.name, W/2, 112, {align:'center'});
    doc.setFont('helvetica','normal'); doc.setFontSize(10); doc.setTextColor(127,140,141);
    doc.text(`${studentInfo.cls}  ·  ${studentInfo.inst}`, W/2, 119, {align:'center'});
    if (studentInfo.id) doc.text(`Campus ID: ${studentInfo.id}`, W/2, 125, {align:'center'});
    doc.setFillColor(...gc); doc.roundedRect(W/2-30,130,60,10,3,3,'F');
    doc.setFont('helvetica','bold'); doc.setFontSize(9); doc.setTextColor(255,255,255);
    doc.text(grade.label.toUpperCase(), W/2, 136.5, {align:'center'});
    const boxes=[{label:'Score',value:`${score} / ${TOTAL_Q}`},{label:'Percentage',value:`${pct}%`},{label:'Time Taken',value:formatTime(timeTaken)},{label:'Institute',value:studentInfo.inst}];
    const bw=(W-pad*2-15)/4;
    boxes.forEach((b,i) => {
      const bx=pad+i*(bw+5);
      doc.setFillColor(245,237,224); doc.roundedRect(bx,148,bw,18,3,3,'F');
      doc.setFont('helvetica','normal'); doc.setFontSize(6.5); doc.setTextColor(127,140,141);
      doc.text(b.label.toUpperCase(), bx+bw/2, 154, {align:'center'});
      doc.setFont('helvetica','bold'); doc.setFontSize(10); doc.setTextColor(26,107,107);
      doc.text(b.value, bx+bw/2, 161, {align:'center'});
    });
    doc.setFont('helvetica','bold'); doc.setFontSize(10); doc.setTextColor(26,26,46);
    doc.text('Question Breakdown', pad, 178);
    doc.setLineWidth(0.3); doc.setDrawColor(224,214,200); doc.line(pad,180,W-pad,180);
    finalAnswers.forEach((a,i) => {
      const y=186+i*7;
      doc.setFont('helvetica','normal'); doc.setFontSize(8.5); doc.setTextColor(26,26,46);
      doc.text(`Q${i+1}: ${a.topic}`, pad, y);
      doc.setFont('helvetica','bold'); doc.setTextColor(...(a.correct?[39,174,96]:[192,57,43]));
      doc.text(a.correct?'✓ Correct':'✗ Wrong', W-pad, y, {align:'right'});
      doc.setDrawColor(224,214,200); doc.setLineWidth(0.2); doc.line(pad,y+1.5,W-pad,y+1.5);
    });
    const sigY=262;
    doc.setDrawColor(224,214,200); doc.setLineWidth(0.5); doc.line(W-pad-60,sigY,W-pad,sigY);
    doc.setFont('helvetica','bolditalic'); doc.setFontSize(13); doc.setTextColor(26,26,46);
    doc.text('Muhammad Shoaib Khan', W-pad, sigY-3, {align:'right'});
    doc.setFont('helvetica','normal'); doc.setFontSize(8); doc.setTextColor(127,140,141);
    doc.text('Teaching Fellow · Calculus I · LUMS', W-pad, sigY+5, {align:'right'});
    doc.setFillColor(26,26,46); doc.rect(0,275,W,22,'F');
    doc.setFont('helvetica','normal'); doc.setFontSize(8); doc.setTextColor(200,190,180);
    doc.text('mathwithshoaib.github.io  ·  bssk.khan@gmail.com  ·  LUMS, Lahore, Pakistan', W/2, 283, {align:'center'});
    doc.setTextColor(212,160,23); doc.text(`Generated ${dateStr}`, W/2, 289, {align:'center'});
    doc.save(`Calculus_Quiz_${studentInfo.name.replace(/\s+/g,'_')}.pdf`);
  };

  const q = questions[currentQ];
  const optLetters = ['A','B','C','D'];
  const rd = resultData;
  const scoreForResult = rd ? rd.finalAnswers.filter(a => a.correct).length : 0;
  const gradeCssColor = rd ? (gradeCssColors[rd.grade.cls] || muted) : teal;

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
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js" strategy="afterInteractive" />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=IBM+Plex+Mono:wght@400;600&family=Source+Sans+3:wght@300;400;500;600&display=swap');
        *{box-sizing:border-box}
        .opt-btn:hover:not(:disabled){border-color:${teal}!important;background:#eef7f7!important}
        .start-btn:hover{background:#145555!important;transform:translateY(-1px);box-shadow:0 6px 20px rgba(26,107,107,.3)}
        .nav-btn-primary:hover{background:#145555!important}
        .action-btn-primary:hover{background:#145555!important}
        .withdraw-btn:hover{background:${accent}!important;color:#fff!important}
        .modal-danger:hover{background:#a93226!important}
        .modal-cancel:hover{border-color:${teal}!important}
        .lec-nav-a:hover{color:${accent}!important;border-color:${accent}!important}
        @media(max-width:580px){
          .quiz-container{padding:20px 16px 40px!important}
          .quiz-card{padding:22px 18px!important}
          .stats-bar{gap:18px!important}
          .quiz-page-hero{padding:36px 16px 28px!important}
          .mcq-grid{grid-template-columns:1fr!important}
        }
      `}</style>

      {/* ── BREADCRUMB + COURSE SWITCHER ── */}
      <div style={{position:'sticky',top:'calc(var(--nav-h) + 3px)',zIndex:500,background:'var(--bg2)',borderBottom:'1px solid var(--border)'}}>
        <div style={{padding:'8px 24px',display:'flex',alignItems:'center',gap:'8px',fontFamily:'var(--fm)',fontSize:'.72rem',color:'var(--text3)',borderBottom:'1px solid var(--border)'}}>
          <Link href="/" style={{color:'var(--amber)',textDecoration:'none'}}>Home</Link><span>›</span>
          <Link href="/courses" style={{color:'var(--amber)',textDecoration:'none'}}>Courses</Link><span>›</span>
          <Link href="/courses/calc1" style={{color:'var(--amber)',textDecoration:'none'}}>Calculus I</Link><span>›</span>
          <span style={{color:'var(--text2)',fontWeight:500}}>Chapter 5 Quiz</span>
        </div>
        <div style={{display:'flex',alignItems:'center',padding:'0 24px',overflowX:'auto'}}>
          {[{href:'/courses/precalc',label:'Pre-Calculus'},{href:'/courses/calc1',label:'Calculus I',active:true},{href:'/courses/linalg',label:'Linear Algebra I'}].map(({href,label,active})=>(
            <Link key={href} href={href} style={{fontFamily:'var(--fm)',fontSize:'.72rem',letterSpacing:'.06em',textTransform:'uppercase',color:active?'var(--amber)':'var(--text3)',padding:'9px 18px',borderBottom:active?'2px solid var(--amber)':'2px solid transparent',whiteSpace:'nowrap',textDecoration:'none'}}>{label}</Link>
          ))}
        </div>
      </div>

      {/* ── HERO ── */}
      <div className="quiz-page-hero" style={{background:ink,color:paper,padding:'52px 24px 40px',textAlign:'center',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,background:'repeating-linear-gradient(45deg,transparent,transparent 40px,rgba(255,255,255,.025) 40px,rgba(255,255,255,.025) 41px)',pointerEvents:'none'}}/>
        <div style={{fontFamily:fm,fontSize:'.68rem',letterSpacing:'.24em',textTransform:'uppercase',color:gold,marginBottom:'10px',position:'relative'}}>MATH-101 · Calculus I · LUMS</div>
        <h1 style={{fontFamily:fh,fontSize:'clamp(1.6rem,4vw,2.6rem)',fontWeight:700,position:'relative',marginBottom:'6px'}}>
          Integration Quiz — <em style={{color:gold,fontStyle:'italic'}}>Chapter 5</em>
        </h1>
        <p style={{fontSize:'.95rem',color:'#c9c2b8',position:'relative'}}>Indefinite Integration · Substitution · Definite Integrals · Applications</p>
      </div>

      {/* ── STATS BAR ── */}
      <div className="stats-bar" style={{background:'#fff',borderBottom:`1px solid ${border}`,padding:'14px 24px',display:'flex',justifyContent:'center',gap:'36px',flexWrap:'wrap'}}>
        {[['Total Attempts',stats.total],['Completed',stats.completed],['Withdrawn',stats.withdrawn],['Avg Score %',stats.avgPct],['Avg Time',stats.avgTime]].map(([lbl,val])=>(
          <div key={lbl} style={{textAlign:'center'}}>
            <span style={{fontFamily:fm,fontSize:'1.3rem',fontWeight:700,color:teal,display:'block'}}>{val}</span>
            <span style={{fontFamily:fm,fontSize:'.58rem',letterSpacing:'.14em',textTransform:'uppercase',color:muted}}>{lbl}</span>
          </div>
        ))}
      </div>

      {/* ── WITHDRAW MODAL ── */}
      {withdrawModal && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.5)',zIndex:9999,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{background:'#fff',borderRadius:'16px',padding:'36px 40px',maxWidth:'400px',width:'90%',boxShadow:'0 20px 60px rgba(0,0,0,.3)',textAlign:'center'}}>
            <h3 style={{fontFamily:fh,fontSize:'1.4rem',color:ink,marginBottom:'10px'}}>Withdraw from Quiz?</h3>
            <p style={{color:muted,fontSize:'.93rem',marginBottom:'24px'}}>Your progress will not be saved. This attempt will be recorded as <strong>Withdrawn</strong>. Are you sure?</p>
            <div style={{display:'flex',gap:'12px',justifyContent:'center'}}>
              <button className="modal-cancel" onClick={()=>setWithdrawModal(false)} style={{padding:'10px 28px',borderRadius:'8px',fontFamily:fm,fontSize:'.76rem',letterSpacing:'.1em',textTransform:'uppercase',cursor:'pointer',border:`1px solid ${border}`,background:cream,color:ink}}>Keep Going</button>
              <button className="modal-danger" onClick={confirmWithdraw} style={{padding:'10px 28px',borderRadius:'8px',fontFamily:fm,fontSize:'.76rem',letterSpacing:'.1em',textTransform:'uppercase',cursor:'pointer',border:'none',background:accent,color:'#fff'}}>Yes, Withdraw</button>
            </div>
          </div>
        </div>
      )}

      {/* ── MAIN CONTAINER ── */}
      <div className="quiz-container" style={{maxWidth:'720px',margin:'0 auto',padding:'32px 24px 60px',fontFamily:fb,color:ink,background:paper}}>

        {/* ── FORM PHASE ── */}
        {phase === 'form' && (
          <div className="quiz-card" style={{background:'#fff',border:`1px solid ${border}`,borderRadius:'14px',padding:'32px 36px',boxShadow:shadow}}>
            <div style={{fontFamily:fh,fontSize:'1.5rem',fontWeight:700,color:ink,marginBottom:'6px'}}>Before You Begin</div>
            <div style={{color:muted,fontSize:'.92rem',marginBottom:'28px'}}>Enter your details. Your name will appear on your result card.</div>
            {[
              {label:'Full Name *', key:'name', placeholder:'e.g. Muhammad Shoaib Khan'},
              {label:'Class / Section *', key:'cls', placeholder:'e.g. MATH-101 Section A'},
              {label:'Institute *', key:'inst', placeholder:'e.g. LUMS'},
            ].map(({label,key,placeholder})=>(
              <div key={key} style={{marginBottom:'20px'}}>
                <label style={{display:'block',fontFamily:fm,fontSize:'.68rem',letterSpacing:'.14em',textTransform:'uppercase',color:muted,marginBottom:'7px'}}>{label}</label>
                <input type="text" value={studentInfo[key]} onChange={e=>setStudentInfo(s=>({...s,[key]:e.target.value}))} placeholder={placeholder}
                  style={{width:'100%',padding:'11px 14px',border:`1.5px solid ${border}`,borderRadius:'8px',fontFamily:fb,fontSize:'1rem',color:ink,background:paper,outline:'none'}}/>
              </div>
            ))}
            <div style={{marginBottom:'20px'}}>
              <label style={{display:'block',fontFamily:fm,fontSize:'.68rem',letterSpacing:'.14em',textTransform:'uppercase',color:muted,marginBottom:'7px'}}>Campus ID <span style={{fontFamily:fm,fontSize:'.64rem',color:'#aaa',marginLeft:'6px'}}>(optional)</span></label>
              <input type="text" value={studentInfo.id} onChange={e=>setStudentInfo(s=>({...s,id:e.target.value}))} placeholder="e.g. 24010001"
                style={{width:'100%',padding:'11px 14px',border:`1.5px solid ${border}`,borderRadius:'8px',fontFamily:fb,fontSize:'1rem',color:ink,background:paper,outline:'none'}}/>
            </div>
            <button className="start-btn" onClick={startQuiz} style={{width:'100%',padding:'14px',background:teal,color:'#fff',border:'none',borderRadius:'10px',fontFamily:fm,fontSize:'.82rem',letterSpacing:'.12em',textTransform:'uppercase',cursor:'pointer',transition:'all .2s',marginTop:'8px'}}>Start Quiz →</button>
            {formError && <div style={{color:accent,fontFamily:fm,fontSize:'.78rem',marginTop:'12px'}}>Please fill in your name, class, and institute before starting.</div>}
          </div>
        )}

        {/* ── QUIZ PHASE ── */}
        {phase === 'quiz' && q && (
          <div>
            {/* Meta */}
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'14px',flexWrap:'wrap',gap:'10px'}}>
              <div style={{fontFamily:fh,fontSize:'1.05rem',color:ink}}>Good luck, {studentInfo.name}!</div>
              <div style={{fontFamily:fm,fontSize:'.75rem',color:muted}}>Question {currentQ+1} of {TOTAL_Q}</div>
            </div>
            {/* Progress bar */}
            <div style={{background:cream,borderRadius:'99px',height:'6px',marginBottom:'12px',overflow:'hidden'}}>
              <div style={{height:'100%',background:teal,borderRadius:'99px',transition:'width .4s ease',width:`${(currentQ/TOTAL_Q)*100}%`}}/>
            </div>
            {/* Tab warning */}
            {tabWarning && (
              <div style={{background:'#fff3cd',border:`1.5px solid ${gold}`,borderRadius:'10px',padding:'12px 18px',marginBottom:'14px',fontFamily:fm,fontSize:'.78rem',color:'#856404',display:'flex',alignItems:'center',gap:'10px'}}>
                ⚠ <strong>Warning:</strong>&nbsp; Tab switching detected. Switch again and you will be automatically withdrawn.
              </div>
            )}
            {/* Timer bar */}
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',background:cream,borderRadius:'10px',padding:'8px 16px',marginBottom:'16px',fontFamily:fm,fontSize:'.78rem',gap:'12px',flexWrap:'wrap'}}>
              <div style={{display:'flex',alignItems:'center',gap:'8px',color:timerSec>900?accent:teal,fontWeight:700,fontSize:'.92rem'}}>
                <span style={{width:'8px',height:'8px',borderRadius:'50%',background:timerSec>900?accent:teal,display:'inline-block',animation:'pulse 1.2s infinite'}}/>
                Time: {formatTime(timerSec)}
              </div>
              <button className="withdraw-btn" onClick={()=>setWithdrawModal(true)} style={{padding:'6px 14px',background:'transparent',border:`1.5px solid ${accent}`,borderRadius:'7px',color:accent,fontFamily:fm,fontSize:'.68rem',letterSpacing:'.08em',textTransform:'uppercase',cursor:'pointer',transition:'all .2s'}}>✕ Withdraw</button>
            </div>
            {/* Question card */}
            <div className="quiz-card" ref={questionRef} style={{background:'#fff',border:`1px solid ${border}`,borderRadius:'14px',padding:'32px 36px',boxShadow:shadow}}>
              <div style={{fontFamily:fm,fontSize:'.66rem',letterSpacing:'.2em',textTransform:'uppercase',color:accent,marginBottom:'10px'}}>Question {currentQ+1} of {TOTAL_Q} · {q.topic}</div>
              <div style={{fontFamily:fh,fontSize:'1.18rem',fontWeight:400,color:ink,marginBottom:'22px',lineHeight:1.6}} dangerouslySetInnerHTML={{__html:q.text}}/>
              <div style={{fontFamily:fm,fontSize:'.68rem',color:muted,marginBottom:'18px'}}>1 mark</div>
              {/* Options */}
              <div className="mcq-grid" style={{display:'flex',flexDirection:'column',gap:'10px',marginBottom:'20px'}}>
                {q.options.map((opt,i)=>{
                  let borderColor=border, bg=paper, color=ink;
                  if(answered){
                    if(opt.correct){borderColor=green;bg='#f0faf4';color=green;}
                    else if(i===chosen&&!opt.correct){borderColor=accent;bg='#fff5f5';color=accent;}
                  }
                  return (
                    <button key={i} className="opt-btn" onClick={()=>selectOption(i)} disabled={answered}
                      style={{padding:'13px 18px',border:`1.5px solid ${borderColor}`,borderRadius:'10px',background:bg,color,fontFamily:fb,fontSize:'.97rem',cursor:answered?'default':'pointer',textAlign:'left',transition:'all .2s',display:'flex',alignItems:'center',gap:'12px'}}>
                      <span style={{width:'28px',height:'28px',borderRadius:'50%',background:opt.correct&&answered?green:(i===chosen&&answered&&!opt.correct?accent:cream),display:'flex',alignItems:'center',justifyContent:'center',fontFamily:fm,fontSize:'.75rem',fontWeight:600,flexShrink:0,color:answered&&(opt.correct||(i===chosen&&!opt.correct))?'#fff':ink,transition:'all .2s'}}>{optLetters[i]}</span>
                      <span dangerouslySetInnerHTML={{__html:opt.tex}}/>
                    </button>
                  );
                })}
              </div>
              {/* Feedback */}
              {answered && (
                <div ref={feedbackRef} style={{padding:'12px 16px',borderRadius:'8px',fontSize:'.93rem',marginBottom:'16px',background:q.options[chosen]?.correct?'#f0faf4':'#fff5f5',borderLeft:`3px solid ${q.options[chosen]?.correct?green:accent}`,color:q.options[chosen]?.correct?'#1a5c36':'#7a1a1a'}}
                  dangerouslySetInnerHTML={{__html:(q.options[chosen]?.correct?'✓ Correct! ':'✗ Incorrect. ')+q.explanation}}/>
              )}
              {/* Next button */}
              {answered && (
                <div style={{display:'flex',justifyContent:'flex-end',gap:'12px',marginTop:'8px'}}>
                  <button className="nav-btn-primary" onClick={nextQuestion} style={{padding:'10px 24px',borderRadius:'8px',fontFamily:fm,fontSize:'.76rem',letterSpacing:'.1em',textTransform:'uppercase',cursor:'pointer',border:'none',background:teal,color:'#fff',transition:'all .2s'}}>
                    {currentQ===TOTAL_Q-1?'See Results →':'Next Question →'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── RESULT PHASE ── */}
        {phase === 'result' && rd && (
          <div className="quiz-card" style={{background:'#fff',border:`1px solid ${border}`,borderRadius:'14px',padding:'32px 36px',boxShadow:shadow}}>
            {/* Score circle */}
            <div style={{textAlign:'center',marginBottom:'28px'}}>
              <div style={{width:'120px',height:'120px',borderRadius:'50%',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',margin:'0 auto 16px',border:`4px solid ${gradeCssColor}`}}>
                <div style={{fontFamily:fm,fontSize:'2rem',fontWeight:700,color:gradeCssColor,lineHeight:1}}>{rd.status==='completed'?scoreForResult:'—'}</div>
                <div style={{fontFamily:fm,fontSize:'.82rem',color:muted}}>{rd.status==='completed'?`/ ${TOTAL_Q}`:''}</div>
              </div>
              <div style={{fontFamily:fh,fontSize:'1.4rem',color:ink,marginBottom:'4px'}}>{studentInfo.name}</div>
              <div style={{fontFamily:fm,fontSize:'.9rem',letterSpacing:'.1em',textTransform:'uppercase',color:gradeCssColor}}>
                {rd.status==='tab_cheat'?'Disqualified':rd.status==='withdrawn'?'Withdrawn':rd.grade.label}
              </div>
              {(rd.status==='withdrawn'||rd.status==='tab_cheat')&&(
                <div style={{marginTop:'8px',fontFamily:fm,fontSize:'.78rem',color:muted}}>
                  {rd.status==='tab_cheat'?'Automatically withdrawn — tab switching detected.':'Quiz withdrawn by student.'}
                </div>
              )}
            </div>
            {/* Stats row */}
            <div style={{display:'flex',gap:'14px',flexWrap:'wrap',marginBottom:'20px'}}>
              {[['Score',rd.status==='completed'?`${scoreForResult} / ${TOTAL_Q}`:`${scoreForResult} answered`],['Percentage',rd.status==='completed'?`${rd.pct}%`:'—'],['Time Taken',formatTime(rd.timeTaken)],['Institute',studentInfo.inst]].map(([lbl,val])=>(
                <div key={lbl} style={{flex:1,minWidth:'120px',background:cream,borderRadius:'10px',padding:'12px 16px',textAlign:'center'}}>
                  <div style={{fontFamily:fm,fontSize:'.58rem',letterSpacing:'.14em',textTransform:'uppercase',color:muted,marginBottom:'4px'}}>{lbl}</div>
                  <div style={{fontFamily:fm,fontSize:'1rem',fontWeight:700,color:teal}}>{val}</div>
                </div>
              ))}
            </div>
            {/* Breakdown */}
            <div style={{margin:'20px 0'}}>
              {rd.finalAnswers.map((a,i)=>(
                <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 0',borderBottom:`1px solid ${border}`,fontSize:'.93rem'}}>
                  <div><strong>Q{i+1}:</strong> {a.topic}</div>
                  <div style={{fontFamily:fm,fontSize:'.8rem',color:a.correct?green:accent}}>{a.correct?'✓ Correct':'✗ Wrong'}</div>
                </div>
              ))}
            </div>
            {/* Signature */}
            <div style={{marginTop:'28px',paddingTop:'20px',borderTop:`1px solid ${border}`,textAlign:'right'}}>
              <div style={{fontFamily:fh,fontSize:'1.3rem',fontStyle:'italic',color:ink}}>Muhammad Shoaib Khan</div>
              <div style={{fontFamily:fm,fontSize:'.68rem',color:muted,marginTop:'2px'}}>Teaching Fellow · Calculus I · LUMS</div>
              <div style={{fontFamily:fm,fontSize:'.68rem',color:muted,marginTop:'4px'}}>{rd.dateStr}</div>
            </div>
            {/* Actions */}
            <div style={{display:'flex',gap:'12px',flexWrap:'wrap',marginTop:'24px'}}>
              {rd.status==='completed'&&(
                <button className="action-btn-primary" onClick={downloadPDF} style={{flex:1,minWidth:'140px',padding:'12px 20px',borderRadius:'10px',fontFamily:fm,fontSize:'.76rem',letterSpacing:'.1em',textTransform:'uppercase',cursor:'pointer',border:'none',background:teal,color:'#fff',transition:'all .2s'}}>⬇ Download Result Card (PDF)</button>
              )}
              <button onClick={retake} style={{flex:1,minWidth:'140px',padding:'12px 20px',borderRadius:'10px',fontFamily:fm,fontSize:'.76rem',letterSpacing:'.1em',textTransform:'uppercase',cursor:'pointer',border:`1px solid ${border}`,background:cream,color:ink,transition:'all .2s'}}>↺ Try Again</button>
            </div>
          </div>
        )}
      </div>

      {/* Pulse animation for timer dot */}
      <style>{`@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.85)}}`}</style>

      <Footer />
    </>
  );
}