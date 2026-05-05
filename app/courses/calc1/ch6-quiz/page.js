'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

// ─── Supabase ─────────────────────────────────────────────────────────────
const SUPABASE_URL = 'https://ujmxucxfqohlvssoxpsc.supabase.co';
const SUPABASE_KEY = 'sb_publishable_Oh6eOOEaCpb420HxsaMreA_lB0BRzN7';
const TABLE = 'quiz_attempts_ch6';

async function sbInsert(data) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE}`, {
    method: 'POST',
    headers: { 'Content-Type':'application/json', 'apikey':SUPABASE_KEY, 'Authorization':`Bearer ${SUPABASE_KEY}`, 'Prefer':'return=minimal' },
    body: JSON.stringify(data),
  });
  return res.ok;
}

async function sbGetStats() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE}?select=score,percentage,status,time_seconds`,
    { headers: { 'apikey':SUPABASE_KEY, 'Authorization':`Bearer ${SUPABASE_KEY}` } });
  return res.ok ? await res.json() : [];
}

// ─── Helpers ──────────────────────────────────────────────────────────────
function randInt(a, b) { return Math.floor(Math.random()*(b-a+1))+a; }
function shuffle(arr) { const a=[...arr]; for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; }
function gcd(a,b){ return b===0?a:gcd(b,a%b); }
function frac(n,d){ if(d===0)return'\\infty'; if(n%d===0)return String(n/d); const g=gcd(Math.abs(n),Math.abs(d)); return `\\frac{${n/g}}{${d/g}}`; }
function gradeLabel(pct) {
  if(pct>=90) return {label:'Excellent — A',cls:'A'};
  if(pct>=80) return {label:'Very Good — B+',cls:'B'};
  if(pct>=70) return {label:'Good — B',cls:'B'};
  if(pct>=60) return {label:'Satisfactory — C',cls:'C'};
  if(pct>=50) return {label:'Pass — D',cls:'C'};
  return {label:'Needs Improvement — F',cls:'F'};
}
function formatTime(sec){ return `${Math.floor(sec/60).toString().padStart(2,'0')}:${(sec%60).toString().padStart(2,'0')}`; }

// ─── MathJax typeset ──────────────────────────────────────────────────────
let mjBusy=false;
function typeset(el){
  if(mjBusy)return; mjBusy=true;
  setTimeout(()=>{
    const target = el || document.body;
    if(window.MathJax?.typesetPromise){
      window.MathJax.typesetPromise([target]).then(()=>{mjBusy=false;}).catch(()=>{mjBusy=false;});
    } else { mjBusy=false; }
  },50);
}

// ─── Question Bank ────────────────────────────────────────────────────────
const QUESTION_BANK = [

  // ── §5.4 Applying Definite Integration ───────────────────────────────

  // Q1 — Area between two curves
  () => {
    const a=randInt(1,3), b=a+randInt(2,4);
    const ans = (b-a) - (b*b-a*a)/2 + (b*b*b-a*a*a)/3;
    const ansR = Math.round(ans*100)/100;
    return {
      text:`Find the area between $f(x)=x-x^2+${a}$ and $g(x)=x^2-x$ on $[${a},${b}]$ where $f(x)\\geq g(x)$.`,
      topic:'§5.4 — Area Between Curves',
      options:shuffle([
        {tex:`$${ansR}$`,correct:true},
        {tex:`$${Math.round((ans+2)*100)/100}$`,correct:false},
        {tex:`$${Math.round((ans*2)*100)/100}$`,correct:false},
        {tex:`$${Math.round((ans-1)*100)/100}$`,correct:false},
      ]),
      explanation:`Area $=\\int_{${a}}^{${b}}[f(x)-g(x)]\\,dx = \\int_{${a}}^{${b}}(2x-2x^2+${a})\\,dx = ${ansR}$.`,
    };
  },

  // Q2 — Average value of a function
  () => {
    const a=randInt(1,4), b=a+randInt(2,5), k=randInt(2,6);
    const avg = k*(b*b-a*a)/(2*(b-a));
    return {
      text:`Find the average value of $f(x)=${k}x$ on $[${a},${b}]$.`,
      topic:'§5.4 — Average Value',
      options:shuffle([
        {tex:`$${avg}$`,correct:true},
        {tex:`$${avg+k}$`,correct:false},
        {tex:`$${avg*2}$`,correct:false},
        {tex:`$${avg-1}$`,correct:false},
      ]),
      explanation:`Average $=\\dfrac{1}{${b}-${a}}\\int_{${a}}^{${b}}${k}x\\,dx = \\dfrac{1}{${b-a}}\\cdot\\dfrac{${k}(${b}^2-${a}^2)}{2} = ${avg}$.`,
    };
  },

  // Q3 — Area between curves, find intersection first
  () => {
    const k=randInt(2,5);
    const ans = k*k*k/6;
    return {
      text:`Find the area enclosed between $y=x^2$ and $y=${k}x$.`,
      topic:'§5.4 — Area Between Curves (Find Intersections)',
      options:shuffle([
        {tex:`$\\dfrac{${k*k*k}}{6}$`,correct:true},
        {tex:`$\\dfrac{${k*k*k}}{3}$`,correct:false},
        {tex:`$\\dfrac{${k*k*k}}{4}$`,correct:false},
        {tex:`$${k*k*k}$`,correct:false},
      ]),
      explanation:`Intersect: $x^2=${k}x\\Rightarrow x=0,${k}$. Area $=\\int_0^{${k}}(${k}x-x^2)\\,dx=\\left[\\frac{${k}x^2}{2}-\\frac{x^3}{3}\\right]_0^{${k}}=\\frac{${k*k*k}}{6}$.`,
    };
  },

  // Q4 — Gini coefficient / Lorenz curve concept
  () => {
    return {
      text:`The Lorenz curve for an economy is $L(x)=x^2$. The Gini coefficient is given by $2\\int_0^1[x-L(x)]\\,dx$. What is the Gini coefficient?`,
      topic:'§5.4 — Gini Coefficient',
      options:shuffle([
        {tex:`$\\dfrac{1}{3}$`,correct:true},
        {tex:`$\\dfrac{1}{2}$`,correct:false},
        {tex:`$\\dfrac{2}{3}$`,correct:false},
        {tex:`$\\dfrac{1}{4}$`,correct:false},
      ]),
      explanation:`$2\\int_0^1(x-x^2)\\,dx = 2\\left[\\frac{x^2}{2}-\\frac{x^3}{3}\\right]_0^1 = 2\\left(\\frac{1}{2}-\\frac{1}{3}\\right)=2\\cdot\\frac{1}{6}=\\frac{1}{3}$.`,
    };
  },

  // Q5 — Average value application
  () => {
    const T=randInt(3,8), k=randInt(2,5);
    const avg = k*T/2;
    return {
      text:`A machine produces output at rate $f(t)=${k}t$ units/hour. What is the average production rate over $[0,${T}]$ hours?`,
      topic:'§5.4 — Average Value Application',
      options:shuffle([
        {tex:`$${avg}$ units/hour`,correct:true},
        {tex:`$${avg*2}$ units/hour`,correct:false},
        {tex:`$${k*T}$ units/hour`,correct:false},
        {tex:`$${avg-k}$ units/hour`,correct:false},
      ]),
      explanation:`Average $=\\frac{1}{${T}}\\int_0^{${T}}${k}t\\,dt = \\frac{1}{${T}}\\cdot\\frac{${k}\\cdot${T}^2}{2}=${avg}$ units/hour.`,
    };
  },

  // ── §5.5 Business Applications ────────────────────────────────────────

  // Q6 — Present value of income stream
  () => {
    const r=0.10, T=randInt(2,5), k=randInt(10,30)*1000;
    const pv = Math.round(k*(1-Math.exp(-r*T))/r);
    return {
      text:`A business generates a continuous income stream of PKR ${k.toLocaleString()} per year. At a ${r*100}% continuous interest rate, what is the present value over ${T} years? (Use $e^{-${r*T}}\\approx${Math.round(Math.exp(-r*T)*100)/100}$)`,
      topic:'§5.5 — Present Value of Income Stream',
      options:shuffle([
        {tex:`$\\approx\\text{PKR }${pv.toLocaleString()}$`,correct:true},
        {tex:`$\\approx\\text{PKR }${Math.round(k*T*0.9).toLocaleString()}$`,correct:false},
        {tex:`$\\approx\\text{PKR }${Math.round(pv*1.2).toLocaleString()}$`,correct:false},
        {tex:`$\\approx\\text{PKR }${Math.round(k*T).toLocaleString()}$`,correct:false},
      ]),
      explanation:`$\\text{PV}=\\int_0^{${T}}${k}e^{-${r}t}\\,dt=\\frac{${k}}{${r}}(1-e^{-${r*T}})\\approx\\text{PKR }${pv.toLocaleString()}$.`,
    };
  },

  // Q7 — Consumer's surplus
  () => {
    const a=randInt(40,80), b=randInt(2,6), q0=randInt(3,7);
    const p0=a-b*q0;
    const cs=b*q0*q0/2;
    return {
      text:`The demand function is $D(q)=${a}-${b}q$. If the market price is $p_0=${p0}$ (i.e., $q_0=${q0}$), find the consumers' surplus.`,
      topic:"§5.5 — Consumers' Surplus",
      options:shuffle([
        {tex:`$${cs}$`,correct:true},
        {tex:`$${cs*2}$`,correct:false},
        {tex:`$${cs+p0}$`,correct:false},
        {tex:`$${Math.round(cs/2)}$`,correct:false},
      ]),
      explanation:`$\\text{CS}=\\int_0^{${q0}}(${a}-${b}q)\\,dq - ${p0}\\cdot${q0}=[${a}q-\\frac{${b}q^2}{2}]_0^{${q0}}-${p0*q0}=${a*q0}-${b*q0*q0/2}-${p0*q0}=${cs}$.`,
    };
  },

  // Q8 — Producer's surplus
  () => {
    const a=randInt(5,15), b=randInt(2,5), q0=randInt(2,6);
    const p0=a+b*q0;
    const ps=b*q0*q0/2;
    return {
      text:`The supply function is $S(q)=${a}+${b}q$. At market equilibrium $q_0=${q0}$, the price is $p_0=${p0}$. Find the producers' surplus.`,
      topic:"§5.5 — Producers' Surplus",
      options:shuffle([
        {tex:`$${ps}$`,correct:true},
        {tex:`$${ps+a}$`,correct:false},
        {tex:`$${ps*2}$`,correct:false},
        {tex:`$${p0*q0}$`,correct:false},
      ]),
      explanation:`$\\text{PS}=${p0}\\cdot${q0}-\\int_0^{${q0}}(${a}+${b}q)\\,dq=${p0*q0}-[${a}q+\\frac{${b}q^2}{2}]_0^{${q0}}=${p0*q0}-${a*q0+b*q0*q0/2}=${ps}$.`,
    };
  },

  // Q9 — Future value
  () => {
    const r=0.08, T=randInt(2,4), k=randInt(5,20)*1000;
    const fv=Math.round(k*(Math.exp(r*T)-1)/r);
    return {
      text:`Money is deposited continuously into an account at PKR ${k.toLocaleString()} per year with ${r*100}% continuous interest. Find the future value after ${T} years. (Use $e^{${r*T}}\\approx${Math.round(Math.exp(r*T)*100)/100}$)`,
      topic:'§5.5 — Future Value',
      options:shuffle([
        {tex:`$\\approx\\text{PKR }${fv.toLocaleString()}$`,correct:true},
        {tex:`$\\approx\\text{PKR }${Math.round(k*T).toLocaleString()}$`,correct:false},
        {tex:`$\\approx\\text{PKR }${Math.round(fv*0.8).toLocaleString()}$`,correct:false},
        {tex:`$\\approx\\text{PKR }${Math.round(fv*1.3).toLocaleString()}$`,correct:false},
      ]),
      explanation:`$\\text{FV}=e^{${r*T}}\\int_0^{${T}}${k}e^{-${r}t}\\,dt=\\frac{${k}}{${r}}(e^{${r*T}}-1)\\approx\\text{PKR }${fv.toLocaleString()}$.`,
    };
  },

  // Q10 — Reading present value from statement
  () => {
    return {
      text:`A company is choosing between two options: (A) receive PKR 500,000 now, or (B) receive a continuous income stream at PKR 120,000/year for 5 years at 8% continuous interest. Which correctly evaluates option B?`,
      topic:'§5.5 — Present Value Concept',
      options:shuffle([
        {tex:`$\\text{PV}_B=\\int_0^5 120{,}000\\,e^{-0.08t}\\,dt$`,correct:true},
        {tex:`$\\text{PV}_B=120{,}000\\times 5=600{,}000$`,correct:false},
        {tex:`$\\text{PV}_B=\\int_0^5 120{,}000\\,e^{0.08t}\\,dt$`,correct:false},
        {tex:`$\\text{PV}_B=\\dfrac{600{,}000}{e^{0.4}}$`,correct:false},
      ]),
      explanation:`Present value discounts future cash flows: $\\text{PV}=\\int_0^T f(t)e^{-rt}\\,dt$. The rate is negative in the exponent because we are discounting back to today.`,
    };
  },

  // ── §6.1 Integration by Parts ─────────────────────────────────────────

  // Q11 — IBP basic
  () => {
    const a=randInt(2,5), b=randInt(1,6);
    return {
      text:`Evaluate $\\displaystyle\\int xe^{${a}x}\\,dx$ using integration by parts.`,
      topic:'§6.1 — IBP: Polynomial × Exponential',
      options:shuffle([
        {tex:`$\\dfrac{xe^{${a}x}}{${a}} - \\dfrac{e^{${a}x}}{${a*a}} + C$`,correct:true},
        {tex:`$\\dfrac{x^2 e^{${a}x}}{2} + C$`,correct:false},
        {tex:`$\\dfrac{e^{${a}x}}{${a}}(x+1)+C$`,correct:false},
        {tex:`$xe^{${a}x}-\\dfrac{e^{${a}x}}{${a}}+C$`,correct:false},
      ]),
      explanation:`$u=x,\\,dv=e^{${a}x}dx \\Rightarrow du=dx,\\,v=\\frac{e^{${a}x}}{${a}}$. IBP: $\\frac{xe^{${a}x}}{${a}}-\\frac{1}{${a}}\\int e^{${a}x}\\,dx=\\frac{xe^{${a}x}}{${a}}-\\frac{e^{${a}x}}{${a*a}}+C$.`,
    };
  },

  // Q12 — IBP with logarithm
  () => {
    const n=randInt(2,4);
    return {
      text:`Evaluate $\\displaystyle\\int x^{${n}}\\ln x\\,dx$.`,
      topic:'§6.1 — IBP: Logarithm × Polynomial',
      options:shuffle([
        {tex:`$\\dfrac{x^{${n+1}}}{${n+1}}\\ln x - \\dfrac{x^{${n+1}}}{${(n+1)*(n+1)}} + C$`,correct:true},
        {tex:`$\\dfrac{x^{${n+1}}\\ln x}{${n+1}} + C$`,correct:false},
        {tex:`$\\dfrac{x^{${n}}}{${n}}\\ln x + C$`,correct:false},
        {tex:`$x^{${n+1}}\\ln x - \\dfrac{x^{${n+1}}}{${n+1}}+C$`,correct:false},
      ]),
      explanation:`By LIATE: $u=\\ln x,\\,dv=x^{${n}}dx$. Then $du=\\frac{dx}{x},\\,v=\\frac{x^{${n+1}}}{${n+1}}$. IBP gives $\\frac{x^{${n+1}}}{${n+1}}\\ln x-\\frac{x^{${n+1}}}{${(n+1)*(n+1)}}+C$.`,
    };
  },

  // Q13 — IBP: choosing u and dv (LIATE)
  () => {
    return {
      text:`For $\\displaystyle\\int x^2 e^{3x}\\,dx$, what is the correct choice of $u$ and $dv$, and how many times must IBP be applied?`,
      topic:'§6.1 — IBP: Choosing u and dv',
      options:shuffle([
        {tex:`$u=x^2,\\,dv=e^{3x}dx$; apply IBP <strong>twice</strong>`,correct:true},
        {tex:`$u=e^{3x},\\,dv=x^2dx$; apply IBP once`,correct:false},
        {tex:`$u=x^2,\\,dv=e^{3x}dx$; apply IBP once`,correct:false},
        {tex:`Use substitution $u=3x$; no IBP needed`,correct:false},
      ]),
      explanation:`LIATE: $u=x^2$ (algebraic), $dv=e^{3x}dx$. After one IBP: $\\int xe^{3x}dx$ — still needs IBP. Two applications total reduce the power to $x^0$.`,
    };
  },

  // Q14 — IBP definite
  () => {
    return {
      text:`Evaluate $\\displaystyle\\int_0^1 xe^x\\,dx$.`,
      topic:'§6.1 — Definite IBP',
      options:shuffle([
        {tex:`$1$`,correct:true},
        {tex:`$e-1$`,correct:false},
        {tex:`$e$`,correct:false},
        {tex:`$e+1$`,correct:false},
      ]),
      explanation:`$u=x,\\,dv=e^x dx$. $\\int_0^1 xe^x\\,dx=[xe^x]_0^1-\\int_0^1 e^x\\,dx = e-[e^x]_0^1 = e-(e-1)=1$.`,
    };
  },

  // Q15 — Using integral table (Form 6)
  () => {
    const a=randInt(2,6), b=randInt(2,5);
    return {
      text:`Use the integral table (Form 6: $\\int\\frac{du}{u(a+bu)}=\\frac{1}{a}\\ln\\left|\\frac{u}{a+bu}\\right|+C$) to evaluate $\\displaystyle\\int\\frac{dx}{x(${a}+${b}x)}$.`,
      topic:'§6.1 — Integral Tables',
      options:shuffle([
        {tex:`$\\dfrac{1}{${a}}\\ln\\left|\\dfrac{x}{${a}+${b}x}\\right|+C$`,correct:true},
        {tex:`$\\dfrac{1}{${b}}\\ln|${a}+${b}x|+C$`,correct:false},
        {tex:`$\\ln|x(${a}+${b}x)|+C$`,correct:false},
        {tex:`$\\dfrac{1}{${a*b}}\\ln\\left|\\dfrac{x}{${a}+${b}x}\\right|+C$`,correct:false},
      ]),
      explanation:`Match Form 6 with $u=x,\\,a=${a},\\,b=${b}$: $\\int\\frac{dx}{x(${a}+${b}x)}=\\frac{1}{${a}}\\ln\\left|\\frac{x}{${a}+${b}x}\\right|+C$.`,
    };
  },

  // Q16 — IBP: ln x alone
  () => {
    return {
      text:`Evaluate $\\displaystyle\\int \\ln x\\,dx$. (Hint: write this as $\\int \\ln x\\cdot 1\\,dx$)`,
      topic:'§6.1 — IBP: Logarithm Alone',
      options:shuffle([
        {tex:`$x\\ln x - x + C$`,correct:true},
        {tex:`$\\dfrac{1}{x}+C$`,correct:false},
        {tex:`$x\\ln x + C$`,correct:false},
        {tex:`$\\dfrac{(\\ln x)^2}{2}+C$`,correct:false},
      ]),
      explanation:`$u=\\ln x,\\,dv=dx\\Rightarrow du=\\frac{dx}{x},\\,v=x$. IBP: $x\\ln x-\\int x\\cdot\\frac{1}{x}\\,dx=x\\ln x-x+C$.`,
    };
  },

  // ── §A.3 L'Hôpital's Rule ─────────────────────────────────────────────

  // Q17 — Basic 0/0
  () => {
    const n=randInt(2,4);
    return {
      text:`Evaluate $\\displaystyle\\lim_{x\\to 0}\\dfrac{x^{${n}}}{x}$ using L'Hôpital's rule.`,
      topic:"§A.3 — L'Hôpital: Basic 0/0",
      options:shuffle([
        {tex:`$0$`,correct:true},
        {tex:`$1$`,correct:false},
        {tex:`$\\infty$`,correct:false},
        {tex:`Does not exist`,correct:false},
      ]),
      explanation:`Form $\\frac{0}{0}$. Apply L'Hôpital: $\\lim_{x\\to 0}\\frac{${n}x^{${n-1}}}{1}=${n}\\cdot 0^{${n-1}}=0$. (Could also simplify directly: $x^{${n-1}}\\to 0$.)`,
    };
  },

  // Q18 — L'Hopital 0/0 with exponential
  () => {
    return {
      text:`Evaluate $\\displaystyle\\lim_{x\\to 0}\\dfrac{e^x - 1 - x}{x^2}$.`,
      topic:"§A.3 — L'Hôpital: Applied Twice",
      options:shuffle([
        {tex:`$\\dfrac{1}{2}$`,correct:true},
        {tex:`$0$`,correct:false},
        {tex:`$1$`,correct:false},
        {tex:`$\\infty$`,correct:false},
      ]),
      explanation:`Form $\\frac{0}{0}$. Round 1: $\\frac{e^x-1}{2x}$ still $\\frac{0}{0}$. Round 2: $\\frac{e^x}{2}\\to\\frac{1}{2}$.`,
    };
  },

  // Q19 — L'Hopital ∞/∞
  () => {
    const n=randInt(2,4);
    return {
      text:`Evaluate $\\displaystyle\\lim_{x\\to\\infty}\\dfrac{x^{${n}}}{e^x}$.`,
      topic:"§A.3 — L'Hôpital: ∞/∞ (Multiple Rounds)",
      options:shuffle([
        {tex:`$0$`,correct:true},
        {tex:`$\\infty$`,correct:false},
        {tex:`$1$`,correct:false},
        {tex:`$${n}$`,correct:false},
      ]),
      explanation:`Form $\\frac{\\infty}{\\infty}$. Apply L'Hôpital ${n} times — each application reduces the power by 1. Eventually: $\\frac{${[2,6,24,120][n-1]}}{e^x}\\to 0$. Exponential always dominates polynomial.`,
    };
  },

  // Q20 — L'Hopital: check form first (not indeterminate)
  () => {
    return {
      text:`A student wants to apply L'Hôpital's rule to $\\lim_{x\\to 0}\\dfrac{x^2+3}{x}$. What is the correct approach?`,
      topic:"§A.3 — L'Hôpital: Check the Form First",
      options:shuffle([
        {tex:`Do NOT apply L'Hôpital — numerator $\\to 3\\neq 0$, so the form is $\\frac{3}{0}$, not indeterminate. The limit is $\\infty$.`,correct:true},
        {tex:`Apply L'Hôpital: $\\lim_{x\\to 0}\\frac{2x}{1}=0$`,correct:false},
        {tex:`The limit does not exist since denominator $\\to 0$`,correct:false},
        {tex:`Apply L'Hôpital twice to get $\\frac{2}{0}=\\infty$`,correct:false},
      ]),
      explanation:`Always check BOTH numerator and denominator. Numerator $\\to 3$, denominator $\\to 0$. This is $\\frac{3}{0}$ — not indeterminate. L'Hôpital does not apply. The limit is $\\infty$.`,
    };
  },

  // Q21 — L'Hopital: 1^∞ form
  () => {
    return {
      text:`What is $\\displaystyle\\lim_{x\\to\\infty}\\left(1+\\dfrac{1}{x}\\right)^x$?`,
      topic:"§A.3 — L'Hôpital: 1^∞ Form",
      options:shuffle([
        {tex:`$e$`,correct:true},
        {tex:`$1$`,correct:false},
        {tex:`$\\infty$`,correct:false},
        {tex:`$e^2$`,correct:false},
      ]),
      explanation:`Form $1^\\infty$. Let $L=\\lim\\left(1+\\frac{1}{x}\\right)^x$. Then $\\ln L=\\lim x\\ln(1+\\frac{1}{x})=\\lim\\frac{\\ln(1+1/x)}{1/x}\\xrightarrow{L'H}1$. So $L=e$.`,
    };
  },

  // Q22 — L'Hopital: 0·∞ form
  () => {
    return {
      text:`Evaluate $\\displaystyle\\lim_{x\\to\\infty} xe^{-x}$.`,
      topic:"§A.3 — L'Hôpital: 0·∞ Form",
      options:shuffle([
        {tex:`$0$`,correct:true},
        {tex:`$1$`,correct:false},
        {tex:`$\\infty$`,correct:false},
        {tex:`$e$`,correct:false},
      ]),
      explanation:`Form $\\infty\\cdot 0$. Rewrite: $\\frac{x}{e^x}\\xrightarrow{L'H}\\frac{1}{e^x}\\to 0$. Exponential decay beats linear growth.`,
    };
  },

  // Q23 — L'Hopital: identify correct application
  () => {
    return {
      text:`Which of the following is the correct first step to evaluate $\\displaystyle\\lim_{x\\to 1}\\dfrac{\\ln x}{x-1}$?`,
      topic:"§A.3 — L'Hôpital: Procedure",
      options:shuffle([
        {tex:`Check: numerator $\\ln 1=0$, denominator $1-1=0$. Form $\\frac{0}{0}$ ✓. Apply L'Hôpital: differentiate top and bottom separately.`,correct:true},
        {tex:`Apply quotient rule to $\\frac{\\ln x}{x-1}$ then take limit.`,correct:false},
        {tex:`The limit doesn't exist because denominator $\\to 0$.`,correct:false},
        {tex:`Form is $\\frac{\\infty}{\\infty}$ — apply L'Hôpital.`,correct:false},
      ]),
      explanation:`$\\ln 1=0$ and $1-1=0$: form is $\\frac{0}{0}$ ✓. L'Hôpital: $\\lim_{x\\to 1}\\frac{1/x}{1}=\\frac{1}{1}=1$.`,
    };
  },

  // Q24 — Mixed: IBP used in business context
  () => {
    return {
      text:`A company's profit grows at rate $P'(t)=te^{0.5t}$ (PKR lakhs/month). Using IBP, the total profit over $[0,4]$ is $\\int_0^4 te^{0.5t}\\,dt$. Which antiderivative is correct?`,
      topic:'§6.1 + §5.5 — IBP in Business Context',
      options:shuffle([
        {tex:`$2te^{0.5t}-4e^{0.5t}+C$`,correct:true},
        {tex:`$0.5t^2 e^{0.5t}+C$`,correct:false},
        {tex:`$te^{0.5t}-e^{0.5t}+C$`,correct:false},
        {tex:`$2te^{0.5t}+C$`,correct:false},
      ]),
      explanation:`IBP: $u=t,\\,dv=e^{0.5t}dt\\Rightarrow du=dt,\\,v=2e^{0.5t}$. Result: $2te^{0.5t}-2\\int e^{0.5t}dt=2te^{0.5t}-4e^{0.5t}+C$.`,
    };
  },

  // Q25 — L'Hopital: ln x / x²
  () => {
    return {
      text:`Evaluate $\\displaystyle\\lim_{x\\to\\infty}\\dfrac{\\ln x}{x^2}$.`,
      topic:"§A.3 — L'Hôpital: Log vs Polynomial",
      options:shuffle([
        {tex:`$0$`,correct:true},
        {tex:`$\\infty$`,correct:false},
        {tex:`$1$`,correct:false},
        {tex:`$\\dfrac{1}{2}$`,correct:false},
      ]),
      explanation:`Form $\\frac{\\infty}{\\infty}$. L'Hôpital: $\\lim\\frac{1/x}{2x}=\\lim\\frac{1}{2x^2}=0$. Even $x^2$ grows faster than $\\ln x$.`,
    };
  },

];

const TOTAL_Q = 12;
function pickQuestions() {
  return shuffle([...QUESTION_BANK]).slice(0, TOTAL_Q).map(fn => fn());
}

// ─── Styles ───────────────────────────────────────────────────────────────
const ink='#1a1a2e', paper='#fdf8f0', cream='#f5ede0', accent='#c0392b';
const gold='#d4a017', teal='#1a6b6b', green='#27ae60', muted='#7f8c8d';
const border='#e0d6c8', shadow='0 4px 24px rgba(26,26,46,.10)';
const fm="'IBM Plex Mono', monospace", fb="'Source Sans 3', sans-serif", fh="'Playfair Display', Georgia, serif";
const gradeColors={A:[39,174,96],B:[26,107,107],C:[212,160,23],F:[192,57,43]};
const gradeCssColors={A:green,B:teal,C:gold,F:accent};

// ─── Main Component ───────────────────────────────────────────────────────
export default function Calc1Ch6Quiz() {
  const [phase, setPhase] = useState('form');
  const [studentInfo, setStudentInfo] = useState({name:'',cls:'',inst:'LUMS',id:''});
  const [formError, setFormError] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [chosen, setChosen] = useState(-1);
  const [answered, setAnswered] = useState(false);
  const [tabWarning, setTabWarning] = useState(false);
  const [withdrawModal, setWithdrawModal] = useState(false);
  const [resultData, setResultData] = useState(null);
  const [stats, setStats] = useState({total:'—',completed:'—',withdrawn:'—',avgPct:'—%',avgTime:'—'});
  const timerRef = useRef(null);
  const timerDisplayRef = useRef(null);
  const quizActiveRef = useRef(false);
  const tabCountRef = useRef(0);
  const timerSecRef = useRef(0);
  const questionRef = useRef(null);

  useEffect(()=>{
    window.MathJax={tex:{inlineMath:[['$','$'],['\\(','\\)']],displayMath:[['$$','$$'],['\\[','\\]']]},options:{skipHtmlTags:['script','noscript','style','textarea','pre']}};
    const s=document.createElement('script'); s.id='mjax-ch6'; s.src='https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js'; s.async=true;
    if(!document.getElementById('mjax-ch6')) document.head.appendChild(s);
  },[]);

  useEffect(()=>{
    if(phase==='quiz') typeset(questionRef.current);
  },[currentQ, answered, phase]);

  useEffect(()=>{
    sbGetStats().then(rows=>{
      if(!rows.length) return;
      const comp=rows.filter(r=>r.status==='completed');
      const with_=rows.filter(r=>r.status==='withdrawn'||r.status==='tab_cheat');
      let avgPct='—%',avgTime='—';
      if(comp.length){
        avgPct=(comp.reduce((s,r)=>s+(r.percentage||0),0)/comp.length).toFixed(1)+'%';
        const ts=comp.filter(r=>r.time_seconds>0);
        if(ts.length) avgTime=formatTime(Math.round(ts.reduce((s,r)=>s+r.time_seconds,0)/ts.length));
      }
      setStats({total:String(rows.length),completed:String(comp.length),withdrawn:String(with_.length),avgPct,avgTime});
    }).catch(()=>{});
  },[]);

  useEffect(()=>{
    const onVis=()=>{
      if(!quizActiveRef.current) return;
      if(document.hidden){
        tabCountRef.current+=1;
        if(tabCountRef.current===1) setTabWarning(true);
        else { quizActiveRef.current=false; stopTimer(); finishQuiz('tab_cheat',answers); }
      }
    };
    document.addEventListener('visibilitychange',onVis);
    return()=>document.removeEventListener('visibilitychange',onVis);
  },[answers]);

  useEffect(()=>()=>clearInterval(timerRef.current),[]);

  const stopTimer=useCallback(()=>clearInterval(timerRef.current),[]);
  const startTimer=useCallback(()=>{
    timerSecRef.current=0;
    clearInterval(timerRef.current);
    timerRef.current=setInterval(()=>{
      timerSecRef.current+=1;
      if(timerDisplayRef.current) timerDisplayRef.current.textContent=formatTime(timerSecRef.current);
    },1000);
  },[]);

  const startQuiz=()=>{
    if(!studentInfo.name||!studentInfo.cls||!studentInfo.inst){setFormError(true);return;}
    setFormError(false);
    const qs=pickQuestions();
    setQuestions(qs); setAnswers([]); setCurrentQ(0); setAnswered(false); setChosen(-1);
    setTabWarning(false); tabCountRef.current=0; quizActiveRef.current=true;
    startTimer(); setPhase('quiz');
  };

  const selectOption=(i)=>{
    if(answered) return;
    const isCorrect=questions[currentQ].options[i].correct;
    setChosen(i); setAnswered(true);
    setAnswers(prev=>[...prev,{chosen:i,correct:isCorrect,topic:questions[currentQ].topic}]);
  };

  const nextQuestion=()=>{
    const newAns=[...answers];
    if(currentQ+1>=TOTAL_Q){ quizActiveRef.current=false; stopTimer(); finishQuiz('completed',newAns); }
    else { setCurrentQ(q=>q+1); setAnswered(false); setChosen(-1); }
  };

  const finishQuiz=useCallback(async(status,finalAnswers)=>{
    const score=finalAnswers.filter(a=>a.correct).length;
    const pct=finalAnswers.length?Math.round(score/TOTAL_Q*100):0;
    const grade=gradeLabel(pct);
    const dateStr=new Date().toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'});
    setResultData({score,pct,grade,dateStr,status,finalAnswers,timeTaken:timerSecRef.current});
    setPhase('result');
    try {
      await sbInsert({student_name:studentInfo.name,student_class:studentInfo.cls,institute:studentInfo.inst,campus_id:studentInfo.id||null,score,total:TOTAL_Q,percentage:pct,status,time_seconds:timerSecRef.current});
      const rows=await sbGetStats();
      const comp=rows.filter(r=>r.status==='completed');
      const with_=rows.filter(r=>r.status==='withdrawn'||r.status==='tab_cheat');
      let avgPct='—%',avgTime='—';
      if(comp.length){ avgPct=(comp.reduce((s,r)=>s+(r.percentage||0),0)/comp.length).toFixed(1)+'%'; const ts=comp.filter(r=>r.time_seconds>0); if(ts.length) avgTime=formatTime(Math.round(ts.reduce((s,r)=>s+r.time_seconds,0)/ts.length)); }
      setStats({total:String(rows.length),completed:String(comp.length),withdrawn:String(with_.length),avgPct,avgTime});
    } catch(e){}
  },[studentInfo]);

  const confirmWithdraw=()=>{ setWithdrawModal(false); quizActiveRef.current=false; stopTimer(); finishQuiz('withdrawn',answers); };

  const retake=()=>{ stopTimer(); quizActiveRef.current=false; setPhase('form'); setStudentInfo(s=>({...s,name:'',cls:'',id:''})); setAnswers([]); setCurrentQ(0); setAnswered(false); setChosen(-1); timerSecRef.current=0; setTabWarning(false); tabCountRef.current=0; };

  const q=questions[currentQ];
  const optLetters=['A','B','C','D'];
  const rd=resultData;
  const scoreForResult=rd?rd.finalAnswers.filter(a=>a.correct).length:0;
  const gradeCssColor=rd?(gradeCssColors[rd.grade.cls]||muted):teal;

  return (
    <>
      <Navbar activePage="courses"/>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=IBM+Plex+Mono:wght@400;600&family=Source+Sans+3:wght@300;400;600&display=swap');
        *{box-sizing:border-box}
        .opt-btn:hover:not(:disabled){border-color:${teal}!important;background:#eef7f7!important}
        .start-btn:hover{background:#145555!important}
        .nav-btn:hover{background:#145555!important}
        .action-primary:hover{background:#145555!important}
        .withdraw-btn:hover{background:${accent}!important;color:#fff!important}
        .modal-danger:hover{background:#a93226!important}
        @media(max-width:580px){.quiz-container{padding:20px 16px 40px!important}.quiz-card{padding:22px 18px!important}.stats-bar{gap:18px!important}.quiz-hero{padding:36px 16px 28px!important}}
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.85)}}
        mjx-container{color:#1a1a2e!important}
        mjx-container svg{color:#1a1a2e!important}
      `}</style>

      {/* BREADCRUMB */}
      <div style={{position:'sticky',top:'calc(var(--nav-h) + 3px)',zIndex:500,background:'var(--bg2)',borderBottom:'1px solid var(--border)'}}>
        <div style={{padding:'8px 24px',display:'flex',alignItems:'center',gap:'8px',fontFamily:'var(--fm)',fontSize:'.72rem',color:'var(--text3)',borderBottom:'1px solid var(--border)'}}>
          <Link href="/" style={{color:'var(--amber)',textDecoration:'none'}}>Home</Link><span>›</span>
          <Link href="/courses" style={{color:'var(--amber)',textDecoration:'none'}}>Courses</Link><span>›</span>
          <Link href="/courses/calc1" style={{color:'var(--amber)',textDecoration:'none'}}>Calculus I</Link><span>›</span>
          <span style={{color:'var(--text2)',fontWeight:500}}>Quiz — §5.4, §5.5, §6.1, §A.3</span>
        </div>
        <div style={{display:'flex',alignItems:'center',padding:'0 24px',overflowX:'auto'}}>
          {[{href:'/courses/precalc',label:'Pre-Calculus'},{href:'/courses/calc1',label:'Calculus I',active:true},{href:'/courses/linalg',label:'Linear Algebra I'}].map(({href,label,active})=>(
            <Link key={href} href={href} style={{fontFamily:'var(--fm)',fontSize:'.72rem',letterSpacing:'.06em',textTransform:'uppercase',color:active?'var(--amber)':'var(--text3)',padding:'9px 18px',borderBottom:active?'2px solid var(--amber)':'2px solid transparent',whiteSpace:'nowrap',textDecoration:'none'}}>{label}</Link>
          ))}
        </div>
      </div>

      {/* HERO */}
      <div className="quiz-hero" style={{background:ink,color:paper,padding:'52px 24px 40px',textAlign:'center',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,background:'repeating-linear-gradient(45deg,transparent,transparent 40px,rgba(255,255,255,.025) 40px,rgba(255,255,255,.025) 41px)',pointerEvents:'none'}}/>
        <div style={{fontFamily:fm,fontSize:'.65rem',letterSpacing:'.22em',textTransform:'uppercase',color:gold,marginBottom:'8px',position:'relative'}}>MATH-101 · Calculus I · LUMS</div>
        <h1 style={{fontFamily:fh,fontSize:'clamp(1.6rem,4vw,2.6rem)',fontWeight:700,position:'relative',marginBottom:'6px'}}>
          Practice Quiz — <em style={{color:gold}}>Sections 5.4 · 5.5 · 6.1 · A.3</em>
        </h1>
        <p style={{fontSize:'.95rem',color:'#c9c2b8',position:'relative',marginBottom:'18px'}}>
          Applying Definite Integration · Business Applications · Integration by Parts · L'Hôpital's Rule
        </p>
        {/* Section badges */}
        <div style={{display:'flex',gap:'8px',flexWrap:'wrap',justifyContent:'center',position:'relative'}}>
          {['§5.4 · Applying Definite Integration','§5.5 · Business Applications','§6.1 · Integration by Parts','§A.3 · L\'Hôpital\'s Rule'].map(s=>(
            <span key={s} style={{fontFamily:fm,fontSize:'.62rem',letterSpacing:'.08em',background:'rgba(212,160,23,.15)',color:gold,border:'1px solid rgba(212,160,23,.3)',borderRadius:'20px',padding:'4px 12px'}}>{s}</span>
          ))}
        </div>
      </div>

      {/* STATS BAR */}
      <div className="stats-bar" style={{background:'#fff',borderBottom:`1px solid ${border}`,padding:'14px 24px',display:'flex',justifyContent:'center',gap:'36px',flexWrap:'wrap'}}>
        {[['Total Attempts',stats.total],['Completed',stats.completed],['Withdrawn',stats.withdrawn],['Avg Score',stats.avgPct],['Avg Time',stats.avgTime]].map(([lbl,val])=>(
          <div key={lbl} style={{textAlign:'center'}}>
            <span style={{fontFamily:fm,fontSize:'1.3rem',fontWeight:700,color:teal,display:'block'}}>{val}</span>
            <span style={{fontFamily:fm,fontSize:'.58rem',letterSpacing:'.14em',textTransform:'uppercase',color:muted}}>{lbl}</span>
          </div>
        ))}
      </div>

      {/* WITHDRAW MODAL */}
      {withdrawModal&&(
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.5)',zIndex:9999,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{background:'#fff',borderRadius:'16px',padding:'36px 40px',maxWidth:'400px',width:'90%',textAlign:'center'}}>
            <h3 style={{fontFamily:fh,fontSize:'1.4rem',color:ink,marginBottom:'10px'}}>Withdraw from Quiz?</h3>
            <p style={{color:muted,fontSize:'.93rem',marginBottom:'24px'}}>This attempt will be recorded as <strong>Withdrawn</strong>.</p>
            <div style={{display:'flex',gap:'12px',justifyContent:'center'}}>
              <button onClick={()=>setWithdrawModal(false)} style={{padding:'10px 28px',borderRadius:'8px',fontFamily:fm,fontSize:'.76rem',letterSpacing:'.1em',textTransform:'uppercase',cursor:'pointer',border:`1px solid ${border}`,background:cream,color:ink}}>Keep Going</button>
              <button className="modal-danger" onClick={confirmWithdraw} style={{padding:'10px 28px',borderRadius:'8px',fontFamily:fm,fontSize:'.76rem',letterSpacing:'.1em',textTransform:'uppercase',cursor:'pointer',border:'none',background:accent,color:'#fff'}}>Yes, Withdraw</button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN */}
      <div className="quiz-container" style={{maxWidth:'720px',margin:'0 auto',padding:'32px 24px 60px',fontFamily:fb,color:ink,background:paper}}>

        {/* FORM */}
        {phase==='form'&&(
          <div className="quiz-card" style={{background:'#fff',border:`1px solid ${border}`,borderRadius:'14px',padding:'32px 36px',boxShadow:shadow}}>
            <div style={{fontFamily:fh,fontSize:'1.5rem',fontWeight:700,color:ink,marginBottom:'6px'}}>Before You Begin</div>
            <div style={{color:muted,fontSize:'.92rem',marginBottom:'8px'}}>Enter your details. This quiz covers:</div>
            <div style={{display:'flex',flexWrap:'wrap',gap:'6px',marginBottom:'24px'}}>
              {['§5.4 Applying Definite Integration','§5.5 Business Applications','§6.1 Integration by Parts & Tables','§A.3 L\'Hôpital\'s Rule'].map(s=>(
                <span key={s} style={{fontFamily:fm,fontSize:'.62rem',background:'rgba(26,107,107,.08)',color:teal,border:`1px solid rgba(26,107,107,.2)`,borderRadius:'5px',padding:'3px 8px'}}>{s}</span>
              ))}
            </div>
            {[{label:'Full Name *',key:'name',ph:'e.g. Muhammad Shoaib Khan'},{label:'Class / Section *',key:'cls',ph:'e.g. MATH-101 Section A'},{label:'Institute *',key:'inst',ph:'e.g. LUMS'}].map(({label,key,ph})=>(
              <div key={key} style={{marginBottom:'20px'}}>
                <label style={{display:'block',fontFamily:fm,fontSize:'.68rem',letterSpacing:'.14em',textTransform:'uppercase',color:muted,marginBottom:'7px'}}>{label}</label>
                <input type="text" value={studentInfo[key]} onChange={e=>setStudentInfo(s=>({...s,[key]:e.target.value}))} placeholder={ph} style={{width:'100%',padding:'11px 14px',border:`1.5px solid ${border}`,borderRadius:'8px',fontFamily:fb,fontSize:'1rem',color:ink,background:paper,outline:'none'}}/>
              </div>
            ))}
            <div style={{marginBottom:'20px'}}>
              <label style={{display:'block',fontFamily:fm,fontSize:'.68rem',letterSpacing:'.14em',textTransform:'uppercase',color:muted,marginBottom:'7px'}}>Campus ID <span style={{fontSize:'.64rem',color:'#aaa',marginLeft:'6px'}}>(optional)</span></label>
              <input type="text" value={studentInfo.id} onChange={e=>setStudentInfo(s=>({...s,id:e.target.value}))} placeholder="e.g. 24010001" style={{width:'100%',padding:'11px 14px',border:`1.5px solid ${border}`,borderRadius:'8px',fontFamily:fb,fontSize:'1rem',color:ink,background:paper,outline:'none'}}/>
            </div>
            <button className="start-btn" onClick={startQuiz} style={{width:'100%',padding:'14px',background:teal,color:'#fff',border:'none',borderRadius:'10px',fontFamily:fm,fontSize:'.82rem',letterSpacing:'.12em',textTransform:'uppercase',cursor:'pointer',transition:'all .2s',marginTop:'8px'}}>Start Quiz →</button>
            {formError&&<div style={{color:accent,fontFamily:fm,fontSize:'.78rem',marginTop:'12px'}}>Please fill in your name, class, and institute.</div>}
          </div>
        )}

        {/* QUIZ */}
        {phase==='quiz'&&q&&(
          <div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'14px',flexWrap:'wrap',gap:'10px'}}>
              <div style={{fontFamily:fh,fontSize:'1.05rem',color:ink}}>Good luck, {studentInfo.name}!</div>
              <div style={{fontFamily:fm,fontSize:'.75rem',color:muted}}>Question {currentQ+1} of {TOTAL_Q}</div>
            </div>
            <div style={{background:cream,borderRadius:'99px',height:'6px',marginBottom:'12px',overflow:'hidden'}}>
              <div style={{height:'100%',background:teal,borderRadius:'99px',transition:'width .4s ease',width:`${(currentQ/TOTAL_Q)*100}%`}}/>
            </div>
            {tabWarning&&<div style={{background:'#fff3cd',border:`1.5px solid ${gold}`,borderRadius:'10px',padding:'12px 18px',marginBottom:'14px',fontFamily:fm,fontSize:'.78rem',color:'#856404'}}>⚠ <strong>Warning:</strong> Tab switching detected. Switch again and you will be withdrawn.</div>}
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',background:cream,borderRadius:'10px',padding:'8px 16px',marginBottom:'16px',fontFamily:fm,fontSize:'.78rem',gap:'12px',flexWrap:'wrap'}}>
              <div style={{display:'flex',alignItems:'center',gap:'8px',color:teal,fontWeight:700,fontSize:'.92rem'}}>
                <span style={{width:'8px',height:'8px',borderRadius:'50%',background:teal,display:'inline-block',animation:'pulse 1.2s infinite'}}/>
                Time: <span ref={timerDisplayRef}>00:00</span>
              </div>
              <button className="withdraw-btn" onClick={()=>setWithdrawModal(true)} style={{padding:'6px 14px',background:'transparent',border:`1.5px solid ${accent}`,borderRadius:'7px',color:accent,fontFamily:fm,fontSize:'.68rem',letterSpacing:'.08em',textTransform:'uppercase',cursor:'pointer',transition:'all .2s'}}>✕ Withdraw</button>
            </div>

            <div className="quiz-card" ref={questionRef} style={{background:'#fff',border:`1px solid ${border}`,borderRadius:'14px',padding:'32px 36px',boxShadow:shadow}}>
              <div style={{fontFamily:fm,fontSize:'.64rem',letterSpacing:'.18em',textTransform:'uppercase',color:accent,marginBottom:'6px'}}>Question {currentQ+1} of {TOTAL_Q}</div>
              <div style={{fontFamily:fm,fontSize:'.62rem',letterSpacing:'.12em',textTransform:'uppercase',color:teal,marginBottom:'12px'}}>{q.topic}</div>
              <div style={{fontFamily:fh,fontSize:'1.12rem',fontWeight:400,color:ink,marginBottom:'22px',lineHeight:1.65}} dangerouslySetInnerHTML={{__html:q.text}}/>
              <div style={{fontFamily:fm,fontSize:'.68rem',color:muted,marginBottom:'18px'}}>1 mark</div>
              <div style={{display:'flex',flexDirection:'column',gap:'10px',marginBottom:'20px'}}>
                {q.options.map((opt,i)=>{
                  let bc=border,bg=paper,col=ink;
                  if(answered){ if(opt.correct){bc=green;bg='#f0faf4';col=green;} else if(i===chosen&&!opt.correct){bc=accent;bg='#fff5f5';col=accent;} }
                  return (
                    <button key={i} className="opt-btn" onClick={()=>selectOption(i)} disabled={answered}
                      style={{padding:'13px 18px',border:`1.5px solid ${bc}`,borderRadius:'10px',background:bg,color:col,fontFamily:fb,fontSize:'.97rem',cursor:answered?'default':'pointer',textAlign:'left',transition:'all .2s',display:'flex',alignItems:'center',gap:'12px'}}>
                      <span style={{width:'28px',height:'28px',borderRadius:'50%',background:opt.correct&&answered?green:(i===chosen&&answered&&!opt.correct?accent:cream),display:'flex',alignItems:'center',justifyContent:'center',fontFamily:fm,fontSize:'.75rem',fontWeight:600,flexShrink:0,color:answered&&(opt.correct||(i===chosen&&!opt.correct))?'#fff':ink,transition:'all .2s'}}>{optLetters[i]}</span>
                      <span dangerouslySetInnerHTML={{__html:opt.tex}}/>
                    </button>
                  );
                })}
              </div>
              {answered&&(
                <div style={{padding:'12px 16px',borderRadius:'8px',fontSize:'.93rem',marginBottom:'16px',background:q.options[chosen]?.correct?'#f0faf4':'#fff5f5',borderLeft:`3px solid ${q.options[chosen]?.correct?green:accent}`,color:q.options[chosen]?.correct?'#1a5c36':'#7a1a1a'}}
                  dangerouslySetInnerHTML={{__html:(q.options[chosen]?.correct?'✓ Correct! ':'✗ Incorrect. ')+q.explanation}}/>
              )}
              {answered&&(
                <div style={{display:'flex',justifyContent:'flex-end',marginTop:'8px'}}>
                  <button className="nav-btn" onClick={nextQuestion} style={{padding:'10px 24px',borderRadius:'8px',fontFamily:fm,fontSize:'.76rem',letterSpacing:'.1em',textTransform:'uppercase',cursor:'pointer',border:'none',background:teal,color:'#fff',transition:'all .2s'}}>
                    {currentQ===TOTAL_Q-1?'See Results →':'Next Question →'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* RESULT */}
        {phase==='result'&&rd&&(
          <div className="quiz-card" style={{background:'#fff',border:`1px solid ${border}`,borderRadius:'14px',padding:'32px 36px',boxShadow:shadow}}>
            <div style={{textAlign:'center',marginBottom:'28px'}}>
              <div style={{width:'120px',height:'120px',borderRadius:'50%',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',margin:'0 auto 16px',border:`4px solid ${gradeCssColor}`}}>
                <div style={{fontFamily:fm,fontSize:'2rem',fontWeight:700,color:gradeCssColor,lineHeight:1}}>{rd.status==='completed'?scoreForResult:'—'}</div>
                <div style={{fontFamily:fm,fontSize:'.82rem',color:muted}}>{rd.status==='completed'?`/ ${TOTAL_Q}`:''}</div>
              </div>
              <div style={{fontFamily:fh,fontSize:'1.4rem',color:ink,marginBottom:'4px'}}>{studentInfo.name}</div>
              <div style={{fontFamily:fm,fontSize:'.9rem',letterSpacing:'.1em',textTransform:'uppercase',color:gradeCssColor}}>
                {rd.status==='tab_cheat'?'Disqualified':rd.status==='withdrawn'?'Withdrawn':rd.grade.label}
              </div>
            </div>
            <div style={{display:'flex',gap:'14px',flexWrap:'wrap',marginBottom:'20px'}}>
              {[['Score',rd.status==='completed'?`${scoreForResult} / ${TOTAL_Q}`:`${scoreForResult} answered`],['Percentage',rd.status==='completed'?`${rd.pct}%`:'—'],['Time',formatTime(rd.timeTaken)],['Institute',studentInfo.inst]].map(([lbl,val])=>(
                <div key={lbl} style={{flex:1,minWidth:'120px',background:cream,borderRadius:'10px',padding:'12px 16px',textAlign:'center'}}>
                  <div style={{fontFamily:fm,fontSize:'.58rem',letterSpacing:'.14em',textTransform:'uppercase',color:muted,marginBottom:'4px'}}>{lbl}</div>
                  <div style={{fontFamily:fm,fontSize:'1rem',fontWeight:700,color:teal}}>{val}</div>
                </div>
              ))}
            </div>
            <div style={{margin:'20px 0'}}>
              {rd.finalAnswers.map((a,i)=>(
                <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 0',borderBottom:`1px solid ${border}`,fontSize:'.93rem'}}>
                  <div><strong>Q{i+1}:</strong> {a.topic}</div>
                  <div style={{fontFamily:fm,fontSize:'.8rem',color:a.correct?green:accent}}>{a.correct?'✓ Correct':'✗ Wrong'}</div>
                </div>
              ))}
            </div>
            <div style={{marginTop:'28px',paddingTop:'20px',borderTop:`1px solid ${border}`,textAlign:'right'}}>
              <div style={{fontFamily:fh,fontSize:'1.3rem',fontStyle:'italic',color:ink}}>Muhammad Shoaib Khan</div>
              <div style={{fontFamily:fm,fontSize:'.68rem',color:muted,marginTop:'2px'}}>Teaching Fellow · Calculus I · LUMS</div>
              <div style={{fontFamily:fm,fontSize:'.68rem',color:muted,marginTop:'4px'}}>{rd.dateStr}</div>
            </div>
            <div style={{display:'flex',gap:'12px',flexWrap:'wrap',marginTop:'24px'}}>
              <button onClick={retake} style={{flex:1,minWidth:'140px',padding:'12px 20px',borderRadius:'10px',fontFamily:fm,fontSize:'.76rem',letterSpacing:'.1em',textTransform:'uppercase',cursor:'pointer',border:`1px solid ${border}`,background:cream,color:ink,transition:'all .2s'}}>↺ Try Again</button>
              <Link href="/courses/calc1" style={{flex:1,minWidth:'140px',padding:'12px 20px',borderRadius:'10px',fontFamily:fm,fontSize:'.76rem',letterSpacing:'.1em',textTransform:'uppercase',textDecoration:'none',textAlign:'center',display:'flex',alignItems:'center',justifyContent:'center',gap:'6px',border:`1px solid ${teal}`,background:'#eef7f7',color:teal}}>← Back to Course</Link>
            </div>
          </div>
        )}
      </div>
      <Footer/>
    </>
  );
}