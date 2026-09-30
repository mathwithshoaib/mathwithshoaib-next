'use client';

import { useState, useMemo } from 'react';

/* ══════════════════════════════════════════════════════
   Paper Folding to the Moon — an interactive look at exponential
   growth. Standard paper is ~0.1mm thick; each fold doubles the
   thickness. The question: how many folds until the stack is
   taller than the distance to the Moon (384,400 km)?
   ══════════════════════════════════════════════════════ */

const PAPER_MM = 0.1;
const MOON_KM = 384400;
const MOON_MM = MOON_KM * 1_000_000; // km -> mm

function formatLength(mm) {
  if (mm < 10) return `${mm.toFixed(2)} mm`;
  if (mm < 1000) return `${mm.toFixed(1)} mm`;
  if (mm < 1_000_000) return `${(mm / 1000).toFixed(2)} m`;
  return `${(mm / 1_000_000).toFixed(1)} km`;
}

export default function PaperFolding() {
  const [folds, setFolds] = useState(0);

  const thicknessMm = useMemo(() => PAPER_MM * Math.pow(2, folds), [folds]);
  const reachedMoon = thicknessMm >= MOON_MM;
  const progressPct = Math.min(100, (Math.log2(thicknessMm / PAPER_MM) / Math.log2(MOON_MM / PAPER_MM)) * 100);
  const answerFolds = Math.ceil(Math.log2(MOON_MM / PAPER_MM));

  return (
    <div className="pf-wrap">
      <p className="pf-question">
        Standard paper is about <strong>0.1mm</strong> thick. Each fold doubles that. Can you guess how many folds
        it takes for the stack to exceed the <strong>384,400 km</strong> distance to the Moon?
      </p>

      <div className="pf-slider-row">
        <input
          type="range"
          min={0}
          max={50}
          value={folds}
          onChange={(e) => setFolds(Number(e.target.value))}
          className="pf-slider"
        />
        <div className="pf-fold-count">{folds} fold{folds === 1 ? '' : 's'}</div>
      </div>

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
        <span className="pf-progress-rocket" style={{ left: `${progressPct}%` }}>🚀</span>
        <span className="pf-progress-moon">🌕</span>
      </div>

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
        .pf-slider-row { display: flex; align-items: center; gap: 16px; }
        .pf-slider { flex: 1; accent-color: var(--amber); cursor: pointer; }
        .pf-fold-count { font-family: var(--fm); font-size: .85rem; color: var(--amber); font-weight: 700; white-space: nowrap; min-width: 70px; text-align: right; }
        .pf-readout { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .pf-readout-tile { background: var(--bg2); border: 1px solid var(--border); border-radius: 8px; padding: 12px 14px; text-align: center; }
        .pf-readout-label { font-family: var(--fm); font-size: .62rem; color: var(--text3); letter-spacing: .06em; text-transform: uppercase; margin-bottom: 4px; }
        .pf-readout-value { font-family: var(--fm); font-size: 1.15rem; font-weight: 700; color: var(--text); }
        .pf-progress-track { position: relative; height: 10px; background: var(--bg2); border-radius: 6px; border: 1px solid var(--border); margin: 10px 0 24px; }
        .pf-progress-fill { height: 100%; border-radius: 6px; background: linear-gradient(90deg, var(--teal), var(--amber)); transition: width .2s; }
        .pf-progress-rocket { position: absolute; top: -16px; transform: translateX(-50%); transition: left .2s; font-size: 1rem; }
        .pf-progress-moon { position: absolute; right: -4px; top: -18px; font-size: 1.1rem; }
        .pf-result { font-size: .88rem; color: var(--text2); line-height: 1.7; background: rgba(232,160,32,.08); border: 1px solid rgba(232,160,32,.3); border-radius: 8px; padding: 14px 16px; }
      `}</style>
    </div>
  );
}
