'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import Confetti from '../../components/explore/Confetti';

/* ══════════════════════════════════════════════════════
   Paper Folding to the Moon — an interactive look at exponential
   growth. Standard paper is ~0.1mm thick; each fold doubles the
   thickness. The question: how many folds until the stack is
   taller than the distance to the Moon (384,400 km)?

   The real-world milestone ladder below is just decoration on top
   of the same math: fold-count thresholds were computed as
   ceil(log2(target_mm / 0.1)) and verified by script.

   `onEvent(name)` is optional instrumentation for the Explore hub
   (progress tracking / badges) — it never affects the slider or
   the math, and the interaction is unchanged from the original.
   ══════════════════════════════════════════════════════ */

const PAPER_MM = 0.1;
const MOON_KM = 384400;
const MOON_MM = MOON_KM * 1_000_000; // km -> mm
const MAX_FOLDS = 50;

// Real-world thickness comparisons, each independently verified:
// folds = ceil(log2(target_mm / 0.1)).
const MILESTONES = [
  { icon: '💳', label: 'A credit card', mm: 0.76, folds: 3 },
  { icon: '📱', label: 'A smartphone', mm: 8, folds: 7 },
  { icon: '📚', label: 'A hardcover book', mm: 30, folds: 9 },
  { icon: '🍽️', label: 'A dining table', mm: 750, folds: 13 },
  { icon: '🦒', label: 'A giraffe', mm: 5000, folds: 16 },
  { icon: '🗼', label: 'The Eiffel Tower', mm: 330000, folds: 22 },
  { icon: '🏔️', label: 'Mount Everest', mm: 8849000, folds: 27 },
  { icon: '🌌', label: 'The edge of space', mm: 100000000, folds: 30 },
  { icon: '🛰️', label: 'The ISS orbit', mm: 400000000, folds: 32 },
];

function formatLength(mm) {
  if (mm < 10) return `${mm.toFixed(2)} mm`;
  if (mm < 1000) return `${mm.toFixed(1)} mm`;
  if (mm < 1_000_000) return `${(mm / 1000).toFixed(2)} m`;
  return `${(mm / 1_000_000).toFixed(1)} km`;
}

function pctFor(mm) {
  return Math.min(100, Math.max(0, (Math.log2(mm / PAPER_MM) / Math.log2(MOON_MM / PAPER_MM)) * 100));
}

export default function PaperFolding({ onEvent } = {}) {
  const [folds, setFolds] = useState(0);
  const [playing, setPlaying] = useState(false);
  const firedReachedMoon = useRef(false);
  const [confettiFire, setConfettiFire] = useState(0);

  const thicknessMm = useMemo(() => PAPER_MM * Math.pow(2, folds), [folds]);
  const reachedMoon = thicknessMm >= MOON_MM;
  const progressPct = pctFor(thicknessMm);
  const answerFolds = Math.ceil(Math.log2(MOON_MM / PAPER_MM));

  const passedMilestones = MILESTONES.filter((m) => thicknessMm >= m.mm);
  const latestMilestone = passedMilestones[passedMilestones.length - 1];

  useEffect(() => {
    if (reachedMoon && !firedReachedMoon.current) {
      firedReachedMoon.current = true;
      onEvent?.('reached-moon');
      setConfettiFire((c) => c + 1);
    }
  }, [reachedMoon, onEvent]);

  // Self-scheduling "auto-fold" playback — one step at a time until the Moon.
  useEffect(() => {
    if (!playing) return;
    if (folds >= answerFolds) { setPlaying(false); return; }
    const t = setTimeout(() => setFolds((f) => Math.min(answerFolds, f + 1)), 220);
    return () => clearTimeout(t);
  }, [playing, folds, answerFolds]);

  function stepFolds(delta) {
    setPlaying(false);
    onEvent?.('interacted');
    setFolds((f) => Math.max(0, Math.min(MAX_FOLDS, f + delta)));
  }

  return (
    <div className="pf-wrap">
      <Confetti fire={confettiFire} />

      <p className="pf-question">
        Standard paper is about <strong>0.1mm</strong> thick. Each fold doubles that. Can you guess how many folds
        it takes for the stack to exceed the <strong>384,400 km</strong> distance to the Moon?
      </p>

      <div className="pf-slider-row">
        <button type="button" className="pf-step" aria-label="One fewer fold" onClick={() => stepFolds(-1)}>−</button>
        <input
          type="range"
          min={0}
          max={MAX_FOLDS}
          value={folds}
          onChange={(e) => { setPlaying(false); onEvent?.('interacted'); setFolds(Number(e.target.value)); }}
          className="pf-slider"
        />
        <button type="button" className="pf-step" aria-label="One more fold" onClick={() => stepFolds(1)}>+</button>
        <div className="pf-fold-count">{folds} fold{folds === 1 ? '' : 's'}</div>
      </div>

      <button
        type="button"
        className="btn btn-outline"
        style={{ alignSelf: 'flex-start' }}
        onClick={() => { onEvent?.('interacted'); setPlaying((p) => !p); }}
      >
        {playing ? '⏸ Pause' : '▶ Auto-fold to the Moon'}
      </button>

      <div className="pf-readout">
        <div className="pf-readout-tile">
          <div className="pf-readout-label">Stack Thickness</div>
          <div className="pf-readout-value" style={{ color: reachedMoon ? 'var(--amber)' : 'var(--teal)' }}>{formatLength(thicknessMm)}</div>
        </div>
        <div className="pf-readout-tile">
          <div className="pf-readout-label">Distance to Moon</div>
          <div className="pf-readout-value">384,400 km</div>
        </div>
      </div>

      <div className="pf-progress-track">
        <div className="pf-progress-fill" style={{ width: `${progressPct}%` }} />
        {MILESTONES.map((m) => {
          const passed = thicknessMm >= m.mm;
          return (
            <span
              key={m.label}
              className={`pf-milestone ${passed ? 'passed' : ''}`}
              style={{ left: `${pctFor(m.mm)}%` }}
              title={`${m.label} — ${formatLength(m.mm)} (fold ${m.folds})`}
            >
              {m.icon}
            </span>
          );
        })}
        <span className="pf-progress-rocket" style={{ left: `${progressPct}%` }}>🚀</span>
        <span className="pf-progress-moon">🌕</span>
      </div>

      {!reachedMoon && latestMilestone && (
        <p className="pf-milestone-caption">
          📏 You&rsquo;ve just passed: <strong>{latestMilestone.label}</strong> ({formatLength(latestMilestone.mm)})
        </p>
      )}

      {reachedMoon && (
        <div className="pf-result">
          🌕 You&rsquo;ve reached the Moon! It only took <strong>{folds} folds</strong> — the answer is exactly{' '}
          <strong>{answerFolds} folds</strong> ({formatLength(PAPER_MM * Math.pow(2, answerFolds))}), because
          thickness doubles each time: 0.1mm × 2<sup>n</sup>. That&rsquo;s the surprising power of exponential growth —
          each fold sounds small, but by fold 42 you&rsquo;ve blown past the Moon.
        </div>
      )}

      <style>{`
        .pf-wrap { display: flex; flex-direction: column; gap: 18px; }
        .pf-question { color: var(--text2); line-height: 1.75; margin: 0; }
        .pf-slider-row { display: flex; align-items: center; gap: 12px; }
        .pf-step {
          width: 32px; height: 32px; flex-shrink: 0; border-radius: 50%; border: 1px solid var(--border2);
          background: var(--bg2); color: var(--text2); font-size: 1rem; line-height: 1; cursor: pointer;
          display: flex; align-items: center; justify-content: center; transition: border-color .15s, color .15s;
        }
        .pf-step:hover { border-color: var(--amber); color: var(--amber); }
        .pf-slider { flex: 1; accent-color: var(--amber); cursor: pointer; }
        .pf-fold-count { font-family: var(--fm); font-size: .85rem; color: var(--amber); font-weight: 700; white-space: nowrap; min-width: 70px; text-align: right; }
        .pf-readout { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .pf-readout-tile { background: var(--bg2); border: 1px solid var(--border); border-radius: 8px; padding: 12px 14px; text-align: center; }
        .pf-readout-label { font-family: var(--fm); font-size: .62rem; color: var(--text3); letter-spacing: .06em; text-transform: uppercase; margin-bottom: 4px; }
        .pf-readout-value { font-family: var(--fm); font-size: 1.15rem; font-weight: 700; color: var(--text); }
        .pf-progress-track { position: relative; height: 10px; background: var(--bg2); border-radius: 6px; border: 1px solid var(--border); margin: 30px 0 28px; }
        .pf-progress-fill { height: 100%; border-radius: 6px; background: linear-gradient(90deg, var(--teal), var(--amber)); transition: width .2s; }
        .pf-progress-rocket { position: absolute; top: -16px; transform: translateX(-50%); transition: left .2s; font-size: 1rem; }
        .pf-progress-moon { position: absolute; right: -4px; top: -18px; font-size: 1.1rem; }
        .pf-milestone { position: absolute; top: -24px; transform: translateX(-50%); font-size: .8rem; opacity: .32; transition: opacity .25s; cursor: help; }
        .pf-milestone.passed { opacity: 1; }
        .pf-milestone::after { content: ''; position: absolute; left: 50%; top: 21px; width: 1px; height: 7px; background: var(--border2); transform: translateX(-50%); }
        .pf-milestone-caption { font-size: .82rem; color: var(--text2); margin: -14px 0 0; }
        .pf-result { font-size: .88rem; color: var(--text2); line-height: 1.7; background: rgba(232,160,32,.08); border: 1px solid rgba(232,160,32,.3); border-radius: 8px; padding: 14px 16px; }
        @media(prefers-reduced-motion: reduce) {
          .pf-progress-fill, .pf-progress-rocket, .pf-milestone { transition: none; }
        }
      `}</style>
    </div>
  );
}
