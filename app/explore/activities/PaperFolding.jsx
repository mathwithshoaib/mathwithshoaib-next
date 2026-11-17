'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import Confetti from '../../components/explore/Confetti';

/* ══════════════════════════════════════════════════════
   Paper Folding to the Moon — an interactive look at exponential
   growth. Standard paper is ~0.1mm thick; each fold doubles the
   thickness. The question: how many folds until the stack is
   taller than the distance to the Moon (384,400 km)?

   Everything on screen derives from one number, `folds`:
     layers    = 2^folds
     thickness = 0.1mm × 2^folds
     footprint = A4 sheet halved once per fold (alternating axes)

   Milestone fold-counts are computed at runtime as
   ceil(log2(target_mm / 0.1)), so they can never drift from the math.

   `onEvent(name)` is optional instrumentation for the Explore hub
   (progress tracking / badges) — it never affects the math.
   Events: 'interacted' (any control), 'reached-moon' (once).
   ══════════════════════════════════════════════════════ */

const PAPER_MM = 0.1;
const MOON_KM = 384400;
const MOON_MM = MOON_KM * 1_000_000; // km -> mm
const MAX_FOLDS = 52;
const SHEET_W_MM = 297; // A4
const SHEET_H_MM = 210;
const HAIR_MM = 0.07; // human hair ≈ 70 µm

const mk = (o) => ({ ...o, folds: Math.ceil(Math.log2(o.mm / PAPER_MM) - 1e-9) });

const PAPER_REF = mk({
  icon: '📄', label: 'A sheet of paper', short: 'a sheet', of: 'a single sheet of paper', mm: PAPER_MM,
  fact: 'Printer paper is roughly as thick as a human hair — you can barely feel it.',
});

// Real-world thickness / height comparisons (ascending). `major` ones get a label on the scene.
const MILESTONES = [
  mk({ icon: '🪙', label: 'A US quarter', short: 'a coin', of: 'the thickness of a coin', mm: 1.75, fact: 'A US quarter is 1.75 mm thick.' }),
  mk({ icon: '💳', label: 'A credit card', short: 'a credit card', of: 'the thickness of a credit card', mm: 0.76, fact: 'A credit card is 0.76 mm — only about 8 sheets of paper.' }),
  mk({ icon: '📱', label: 'A smartphone', short: 'a phone', of: 'the thickness of a smartphone', mm: 8, fact: 'A typical smartphone is about 8 mm thick.' }),
  mk({ icon: '📚', label: 'A hardcover book', short: 'a hardcover book', of: 'the thickness of a hardcover book', mm: 30, fact: 'A chunky hardcover is about 3 cm thick.' }),
  mk({ icon: '🍽️', label: 'A dining table', short: 'a dining table', of: 'the height of a dining table', mm: 750, fact: 'Dining-table height is around 75 cm.' }),
  mk({ icon: '🚪', label: 'A door', short: 'a door', of: 'the height of a door', mm: 2000, fact: 'A standard door is about 2 m tall.' }),
  mk({ icon: '🦒', label: 'A giraffe', short: 'a giraffe', of: 'the height of a giraffe', mm: 5000, major: true, fact: 'A tall giraffe reaches about 5 m — you could feed it from the top of your stack.' }),
  mk({ icon: '🗽', label: 'Statue of Liberty', short: 'Statue of Liberty', of: 'the height of the Statue of Liberty', mm: 93000, fact: 'The Statue of Liberty is about 93 m from ground to torch.' }),
  mk({ icon: '🗼', label: 'The Eiffel Tower', short: 'Eiffel Tower', of: 'the height of the Eiffel Tower', mm: 330000, major: true, fact: 'The Eiffel Tower is about 330 m tall, antenna included.' }),
  mk({ icon: '🏙️', label: 'Burj Khalifa', short: 'Burj Khalifa', of: 'the height of the Burj Khalifa', mm: 828000, fact: 'The Burj Khalifa is 828 m — the world’s tallest building.' }),
  mk({ icon: '🏔️', label: 'Mount Everest', short: 'Mt Everest', of: 'the height of Mount Everest', mm: 8849000, major: true, fact: 'Mount Everest rises 8,849 m above sea level.' }),
  mk({ icon: '🏃', label: 'A marathon', short: 'a marathon', of: 'the length of a marathon', mm: 42195000, fact: 'A marathon is 42.195 km — your stack is now as tall as the whole race is long.' }),
  mk({ icon: '🌌', label: 'The edge of space', short: 'edge of space', of: 'the height of the edge of space', mm: 100000000, major: true, fact: 'The Kármán line, 100 km up, is where space officially begins.' }),
  mk({ icon: '🛰️', label: 'The ISS orbit', short: 'ISS orbit', of: 'the altitude of the space station', mm: 400000000, fact: 'The International Space Station orbits about 400 km above Earth.' }),
  mk({ icon: '🌍', label: 'Earth’s width', short: 'Earth’s width', of: 'the width of the whole Earth', mm: 12742 * 1_000_000, major: true, fact: 'Earth is 12,742 km across — your stack could now reach through the planet.' }),
  mk({ icon: '🌕', label: 'The Moon', short: 'the Moon', of: 'the distance to the Moon', mm: MOON_MM, fact: 'The Moon is about 384,400 km away on average.' }),
];
const SUN = mk({ icon: '☀️', label: 'The Sun', short: 'the Sun', of: 'the distance to the Sun', mm: 149_600_000 * 1_000_000, fact: 'The Sun is about 149.6 million km away — its light takes ~8 minutes to reach us.' });
const REFS = [PAPER_REF, ...MILESTONES, SUN];
const MOON = MILESTONES[MILESTONES.length - 1];
const ANSWER_FOLDS = MOON.folds;

const GUESSES = [
  { n: 10, label: '10' },
  { n: 25, label: '25' },
  { n: 42, label: '42' },
  { n: 100, label: '100' },
  { n: 1000, label: '1,000' },
  { n: 1_000_000, label: '1 million' },
];

const SPEEDS = [
  { label: '🐢 Slow', ms: 900 },
  { label: '🚶 Normal', ms: 550 },
  { label: '🐇 Fast', ms: 260 },
];

// Deterministic star field (no Math.random → stable renders).
const STARS = Array.from({ length: 46 }, (_, i) => ({
  x: (i * 37 + 11) % 100,
  y: (i * 53 + 7) % 96,
  s: 1 + (i % 3),
  d: (i % 7) * 0.55,
}));

const SUP = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };

/* ── formatting helpers ───────────────────────────── */
const fmtInt = (n) => Math.round(n).toLocaleString('en-US');

function formatLength(mm) {
  if (mm < 10) return `${mm.toFixed(2)} mm`;
  if (mm < 1000) return `${mm.toFixed(1)} mm`;
  if (mm < 1_000_000) {
    const m = mm / 1000;
    return `${m < 100 ? m.toFixed(2) : fmtInt(m)} m`;
  }
  const km = mm / 1_000_000;
  if (km < 10) return `${km.toFixed(2)} km`;
  if (km < 1000) return `${km.toFixed(1)} km`;
  if (km < 1_000_000) return `${fmtInt(km)} km`;
  return `${Number((km / 1_000_000).toFixed(1)).toLocaleString('en-US')} million km`;
}

function fmtWords(n) {
  if (n < 1_000_000) return fmtInt(n);
  const units = [['quadrillion', 1e15], ['trillion', 1e12], ['billion', 1e9], ['million', 1e6]];
  for (const [w, v] of units) {
    if (n >= v) return `${Number((n / v).toFixed(n / v < 10 ? 1 : 0))} ${w}`;
  }
  return fmtInt(n);
}

function fmtSmall(mm) {
  if (mm >= 1) return `${mm.toFixed(mm < 10 ? 1 : 0)} mm`;
  const um = mm * 1e3;
  if (um >= 1) return `${um.toFixed(um < 10 ? 1 : 0)} µm`;
  const nm = mm * 1e6;
  return `${nm.toFixed(nm < 10 ? 1 : 0)} nm`;
}

function fmtPct(p) {
  if (p >= 100) return `${fmtInt(p)}%`;
  if (p >= 1) return `${p.toFixed(1)}%`;
  if (p >= 0.01) return `${p.toFixed(2)}%`;
  const [m, e] = p.toExponential(1).split('e');
  const exp = String(Math.abs(Number(e))).split('').map((d) => SUP[d]).join('');
  return `${m} × 10${Number(e) < 0 ? '⁻' : ''}${exp}%`;
}

function pctFor(mm) {
  return Math.min(100, Math.max(0, (Math.log2(mm / PAPER_MM) / Math.log2(MOON_MM / PAPER_MM)) * 100));
}

function bestRef(mm) {
  let ref = REFS[0];
  for (const r of REFS) if (mm >= r.mm * 0.9999) ref = r;
  return ref;
}

function ratioText(r) {
  return r < 10 ? r.toFixed(1) : r < 1_000_000 ? fmtInt(r) : fmtWords(r);
}

export default function PaperFolding({ onEvent } = {}) {
  const [folds, setFolds] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [guess, setGuess] = useState(null);
  const [flap, setFlap] = useState(null);
  const [toast, setToast] = useState(null);
  const [confettiFire, setConfettiFire] = useState(0);
  const firedReachedMoon = useRef(false);
  const prevFolds = useRef(0);
  const prevPassed = useRef(0);
  const ladderRef = useRef(null);
  const tableRef = useRef(null);

  const thicknessMm = useMemo(() => PAPER_MM * Math.pow(2, folds), [folds]);
  const layers = Math.pow(2, folds);
  const reachedMoon = thicknessMm >= MOON_MM;
  const progressPct = pctFor(thicknessMm);
  const linearPct = (thicknessMm / MOON_MM) * 100;

  const passed = MILESTONES.filter((m) => thicknessMm >= m.mm);
  const latestMilestone = passed[passed.length - 1];
  const nextTarget = [...MILESTONES, SUN].find((m) => thicknessMm < m.mm);
  const nextIdx = nextTarget ? MILESTONES.indexOf(nextTarget) : -1;

  const ref = bestRef(thicknessMm);
  const ratio = thicknessMm / ref.mm;

  const footW = SHEET_W_MM / Math.pow(2, Math.ceil(folds / 2));
  const footH = SHEET_H_MM / Math.pow(2, Math.floor(folds / 2));
  const footMax = Math.max(footW, footH);

  // Folded-sheet geometry for the top-view drawing (A4-ish ratio).
  const VIEW_W = 170;
  const VIEW_H = 120;
  const sheetPxW = Math.max(2, VIEW_W / Math.pow(2, Math.ceil(folds / 2)));
  const sheetPxH = Math.max(2, VIEW_H / Math.pow(2, Math.floor(folds / 2)));
  const creaseCols = Math.pow(2, Math.ceil(folds / 2));
  const creaseRows = Math.pow(2, Math.floor(folds / 2));
  const showCreases = folds >= 1 && folds <= 8;

  const stackLayers = Math.min(layers, 32);

  /* ── events / effects ─────────────────────────── */
  useEffect(() => {
    if (reachedMoon && !firedReachedMoon.current) {
      firedReachedMoon.current = true;
      onEvent?.('reached-moon');
      setConfettiFire((c) => c + 1);
    }
  }, [reachedMoon, onEvent]);

  // Auto-fold: self-scheduling, one fold at a time, stops at the Moon.
  useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => {
      const next = Math.min(ANSWER_FOLDS, folds + 1);
      setFolds(next);
      if (next >= ANSWER_FOLDS) setPlaying(false);
    }, SPEEDS[speed].ms);
    return () => clearTimeout(t);
  }, [playing, folds, speed]);

  // Flap animation only for a single +1 fold (not for slider jumps).
  useEffect(() => {
    if (folds === prevFolds.current + 1) setFlap({ n: folds });
    else setFlap(null);
    prevFolds.current = folds;
  }, [folds]);

  // "You just passed…" toast.
  useEffect(() => {
    const c = passed.length;
    if (c > prevPassed.current && latestMilestone) setToast({ key: `${latestMilestone.label}-${c}`, m: latestMilestone });
    if (c < prevPassed.current) setToast(null);
    prevPassed.current = c;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [passed.length]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(t);
  }, [toast]);

  // Keep the "next target" row and the current table row in view (scrolls only the inner lists).
  useEffect(() => {
    const box = ladderRef.current;
    const el = box?.querySelector('[data-next="1"]');
    if (box && el) box.scrollTo({ top: Math.max(0, el.offsetTop - 70), behavior: 'smooth' });
  }, [nextIdx]);

  useEffect(() => {
    const box = tableRef.current;
    const el = box?.querySelector('[data-cur="1"]');
    if (box && el) box.scrollTo({ top: Math.max(0, el.offsetTop - 90), behavior: 'smooth' });
  }, [folds]);

  /* ── handlers ─────────────────────────────────── */
  function stepFolds(delta) {
    setPlaying(false);
    onEvent?.('interacted');
    setFolds((f) => Math.max(0, Math.min(MAX_FOLDS, f + delta)));
  }
  function jumpTo(n) {
    setPlaying(false);
    onEvent?.('interacted');
    setFolds(Math.max(0, Math.min(MAX_FOLDS, n)));
  }
  function togglePlay() {
    onEvent?.('interacted');
    if (!playing && folds >= ANSWER_FOLDS) setFolds(0);
    setPlaying((p) => !p);
  }
  function pickGuess(n) {
    onEvent?.('interacted');
    setGuess(n);
  }

  /* ── derived text ─────────────────────────────── */
  const compareLine = folds === 0
    ? { lead: 'Just one sheet', tail: 'of paper — the starting line.' }
    : ratio < 1.25
      ? { lead: 'About the same as', tail: ref.of }
      : { lead: `≈ ${ratioText(ratio)} ×`, tail: ref.of };

  const addedMm = folds === 0 ? 0 : thicknessMm / 2;
  const stackMm = (folds + 1) * PAPER_MM;
  const foldVsStack = layers / (folds + 1);

  const guessMsg = guess == null ? null
    : guess === ANSWER_FOLDS ? `You guessed ${guess} — spot on! 🎯`
      : guess > ANSWER_FOLDS ? `You guessed ${guess.toLocaleString('en-US')} — way too many. Doubling is that powerful.`
        : `You guessed ${guess} — not quite enough, the Moon is further than it looks.`;

  const hairTimes = footMax < HAIR_MM ? HAIR_MM / footMax : null;

  return (
    <div className="pf-wrap">
      <Confetti fire={confettiFire} />

      {/* ── Intro + guess ───────────────────────── */}
      <div className="pf-intro">
        <p className="pf-question">
          Standard paper is about <strong>0.1&nbsp;mm</strong> thick. Each fold <strong>doubles</strong> the stack. How many
          folds until it&rsquo;s taller than the <strong>384,400&nbsp;km</strong> to the Moon?
        </p>
        <div className="pf-guess" role="group" aria-label="Make a guess before you fold">
          <span className="pf-guess-label">🤔 Your guess?</span>
          {GUESSES.map((g) => (
            <button
              key={g.n}
              type="button"
              className={`pf-chip ${guess === g.n ? 'on' : ''}`}
              aria-pressed={guess === g.n}
              onClick={() => pickGuess(g.n)}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Controls ────────────────────────────── */}
      <div className="pf-controls">
        <div className="pf-btn-row">
          <button type="button" className="pf-mini" onClick={() => jumpTo(0)} disabled={folds === 0} title="Start over">↺ Reset</button>
          <button type="button" className="pf-mini" onClick={() => stepFolds(-1)} disabled={folds === 0} title="Unfold once">↩ Unfold</button>
          <button type="button" className="pf-fold-btn" onClick={() => stepFolds(1)} disabled={folds >= MAX_FOLDS}>
            <span className="pf-fold-btn-ico">📄</span>
            <span>Fold it! <small>→ fold {Math.min(MAX_FOLDS, folds + 1)}</small></span>
          </button>
          <button type="button" className={`pf-mini ${playing ? 'live' : ''}`} onClick={togglePlay}>
            {playing ? '⏸ Pause' : folds >= ANSWER_FOLDS ? '🔁 Replay' : '▶ Auto-fold to the Moon'}
          </button>
          <button
            type="button"
            className="pf-mini"
            onClick={() => { onEvent?.('interacted'); setSpeed((s) => (s + 1) % SPEEDS.length); }}
            title="Change auto-fold speed"
          >
            {SPEEDS[speed].label}
          </button>
        </div>

        <div className="pf-slider-row">
          <div className="pf-slider-box">
            <input
              type="range"
              min={0}
              max={MAX_FOLDS}
              value={folds}
              aria-label="Number of folds"
              onChange={(e) => jumpTo(Number(e.target.value))}
              className="pf-slider"
            />
            <div className="pf-slider-marks" aria-hidden="true">
              <span style={{ left: 'calc(8px + (100% - 16px) * 0)' }}>0</span>
              <span style={{ left: `calc(8px + (100% - 16px) * ${ANSWER_FOLDS / MAX_FOLDS})` }}>🌕 {ANSWER_FOLDS}</span>
              <span style={{ left: `calc(8px + (100% - 16px) * ${SUN.folds / MAX_FOLDS})` }}>☀️ {SUN.folds}</span>
            </div>
          </div>
          <div className="pf-fold-count" key={folds}>{folds} fold{folds === 1 ? '' : 's'}</div>
        </div>
      </div>

      {/* ── Stage: space scene + paper ──────────── */}
      <div className="pf-stage">
        <div
          className={`pf-scene ${reachedMoon ? 'arrived' : ''}`}
          role="img"
          aria-label={`Space scene. After ${folds} folds the paper stack is ${formatLength(thicknessMm)} tall, ${fmtPct(linearPct)} of the way to the Moon.`}
        >
          {STARS.map((s, i) => (
            <i key={i} className="pf-star" style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.s, height: s.s, animationDelay: `${s.d}s` }} />
          ))}

          <div className="pf-scale-note">LOG SCALE · each fold ≈ same step</div>

          <div className={`pf-moon ${reachedMoon ? 'hit' : ''}`}>
            <span className="pf-crater c1" /><span className="pf-crater c2" /><span className="pf-crater c3" />
          </div>
          <div className="pf-moon-label">384,400 km</div>
          {reachedMoon && <div className="pf-ring" />}

          <div className="pf-earth" />
          <div className="pf-earth-label">🌍 Earth · 0.1 mm sheet</div>

          <div className="pf-track">
            {MILESTONES.map((m) => {
              const on = thicknessMm >= m.mm;
              return (
                <div
                  key={m.label}
                  className={`pf-tick ${on ? 'on' : ''} ${m.major ? 'major' : ''}`}
                  style={{ bottom: `${pctFor(m.mm)}%` }}
                  title={`${m.label} — ${formatLength(m.mm)} (fold ${m.folds})`}
                >
                  {m.major && <span className="pf-tick-label">{m.icon} {m.label.replace(/^The /, '')}</span>}
                  <i />
                </div>
              );
            })}

            <div className="pf-beam" style={{ height: `max(3px, ${progressPct}%)` }} />
            <div className="pf-tip" style={{ bottom: `${progressPct}%` }}>
              <span className="pf-tip-dot" />
              <span className="pf-bubble" key={folds}>{formatLength(thicknessMm)}</span>
            </div>
          </div>

          {toast && (
            <div className="pf-toast" key={toast.key} role="status">
              <span className="pf-toast-ico">{toast.m.icon}</span>
              <span>Passed <strong>{toast.m.label}</strong>!</span>
            </div>
          )}
        </div>

        <div className="pf-side">
          {/* Paper panel */}
          <div className="pf-card">
            <div className="pf-card-title">📄 The paper, folded {folds}×</div>
            <div className="pf-views">
              <figure className="pf-fig">
                <div className="pf-topview" style={{ width: VIEW_W, height: VIEW_H }}>
                  <div
                    className="pf-ghost"
                    style={showCreases ? {
                      backgroundImage: 'linear-gradient(90deg, rgba(232,160,32,.5) 1px, transparent 1px), linear-gradient(0deg, rgba(232,160,32,.5) 1px, transparent 1px)',
                      backgroundSize: `${VIEW_W / creaseCols}px ${VIEW_H / creaseRows}px`,
                    } : undefined}
                  />
                  <div className="pf-sheet" style={{ width: sheetPxW, height: sheetPxH }}>
                    {flap && (
                      <div key={flap.n} className={`pf-flap ${flap.n % 2 === 1 ? 'fx' : 'fy'}`} />
                    )}
                  </div>
                </div>
                <figcaption>Top view</figcaption>
              </figure>

              <figure className="pf-fig">
                <div className="pf-sideview">
                  {layers > 32 && <div className="pf-cut">⋮</div>}
                  <div className="pf-stack" style={{ height: stackLayers * 5 }} />
                </div>
                <figcaption>Side view · <strong>{fmtWords(layers)}</strong> layer{layers === 1 ? '' : 's'}</figcaption>
              </figure>
            </div>
            <p className="pf-foot-note">
              Folded footprint: <strong>{fmtSmall(Math.max(footW, footH))} × {fmtSmall(Math.min(footW, footH))}</strong> (from an A4 sheet)
              {hairTimes && hairTimes >= 2 && <> — about <strong>{fmtInt(hairTimes)}× thinner</strong> than a human hair!</>}
            </p>
          </div>

          {/* Real-life comparison */}
          <div className="pf-card pf-real" aria-live="polite">
            <div className="pf-card-title">🌎 What is this in real life?</div>
            <div className="pf-real-main" key={`${ref.label}-${folds}`}>
              <div className="pf-real-ico">{ref.icon}</div>
              <div>
                <div className="pf-real-lead">{compareLine.lead}</div>
                <div className="pf-real-tail">{compareLine.tail}</div>
              </div>
            </div>
            <p className="pf-real-fact">{ref.fact}</p>
            {nextTarget && (
              <div className="pf-next">
                <span>Next: <strong>{nextTarget.icon} {nextTarget.label}</strong> ({formatLength(nextTarget.mm)})</span>
                <button type="button" className="pf-link" onClick={() => jumpTo(nextTarget.folds)}>
                  in {nextTarget.folds - folds} fold{nextTarget.folds - folds === 1 ? '' : 's'} →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Moon result ─────────────────────────── */}
      {reachedMoon && (
        <div className="pf-result">
          <div className="pf-result-title">🌕 You&rsquo;ve reached the Moon!</div>
          <p>
            It takes exactly <strong>{ANSWER_FOLDS} folds</strong>: 0.1&nbsp;mm × 2<sup>{ANSWER_FOLDS}</sup> ={' '}
            <strong>{formatLength(PAPER_MM * Math.pow(2, ANSWER_FOLDS))}</strong>. One fold earlier (
            {ANSWER_FOLDS - 1}) you&rsquo;d only have {formatLength(PAPER_MM * Math.pow(2, ANSWER_FOLDS - 1))} — just short.
            Half of the whole trip happens on the very last fold. That&rsquo;s exponential growth.
          </p>
          {guessMsg && <p className="pf-result-guess">{guessMsg}</p>}
          <p>
            🚀 Bonus: fold <strong>{ANSWER_FOLDS + 1}</strong> makes it a round trip — the Moon <em>and back</em>.{' '}
            {folds < SUN.folds
              ? <>Keep folding: fold <strong>{SUN.folds}</strong> reaches the <strong>Sun</strong>!</>
              : <>And you&rsquo;ve even reached the Sun ☀️!</>}
          </p>
        </div>
      )}

      {/* ── Live stats ──────────────────────────── */}
      <div className="pf-stats">
        <div className="pf-stat">
          <div className="pf-stat-label">Layers (2<sup>{folds}</sup>)</div>
          <div className="pf-stat-val pf-pop" key={`l${folds}`}>{fmtWords(layers)}</div>
        </div>
        <div className="pf-stat">
          <div className="pf-stat-label">Stack thickness</div>
          <div className="pf-stat-val pf-pop" key={`t${folds}`} style={{ color: reachedMoon ? 'var(--amber)' : 'var(--teal)' }}>{formatLength(thicknessMm)}</div>
        </div>
        <div className="pf-stat">
          <div className="pf-stat-label">Real trip done</div>
          <div className="pf-stat-val pf-pop" key={`p${folds}`}>{fmtPct(linearPct)}</div>
        </div>
        <div className="pf-stat">
          <div className="pf-stat-label">{reachedMoon ? 'Past the Moon by' : 'Still to go'}</div>
          <div className="pf-stat-val pf-pop" key={`r${folds}`}>{formatLength(Math.abs(MOON_MM - thicknessMm))}</div>
        </div>
      </div>

      {/* ── Step comparisons ────────────────────── */}
      <div className="pf-compare">
        <div className="pf-card">
          <div className="pf-card-title">⚖️ Before vs after this fold</div>
          {folds === 0 ? (
            <p className="pf-muted">Press <strong>Fold it!</strong> — the stack will double and you&rsquo;ll see the before/after here.</p>
          ) : (
            <div key={folds}>
              <div className="pf-bar-row">
                <span className="pf-bar-name">Before (fold {folds - 1})</span>
                <div className="pf-bar"><div className="pf-bar-fill before" style={{ width: '50%' }} /></div>
                <span className="pf-bar-val">{formatLength(thicknessMm / 2)}</span>
              </div>
              <div className="pf-bar-row">
                <span className="pf-bar-name">After (fold {folds})</span>
                <div className="pf-bar"><div className="pf-bar-fill after" style={{ width: '100%' }} /></div>
                <span className="pf-bar-val">{formatLength(thicknessMm)}</span>
              </div>
              <p className="pf-insight">
                This fold added <strong>{formatLength(addedMm)}</strong> — as much as <strong>everything before it combined</strong>.
              </p>
            </div>
          )}
        </div>

        <div className="pf-card">
          <div className="pf-card-title">🥊 Folding vs. just stacking sheets</div>
          <div className="pf-bar-row">
            <span className="pf-bar-name">Stack one sheet per step ({fmtInt(folds + 1)} sheets)</span>
            <div className="pf-bar"><div className="pf-bar-fill lin" style={{ width: `${Math.max(0.8, 100 / foldVsStack)}%` }} /></div>
            <span className="pf-bar-val">{formatLength(stackMm)}</span>
          </div>
          <div className="pf-bar-row">
            <span className="pf-bar-name">Fold in half each step ({fmtWords(layers)} layers)</span>
            <div className="pf-bar"><div className="pf-bar-fill after" style={{ width: '100%' }} /></div>
            <span className="pf-bar-val">{formatLength(thicknessMm)}</span>
          </div>
          <p className="pf-insight">
            {foldVsStack < 1.05
              ? 'Same so far — but watch what happens as you keep folding.'
              : <>Folding is <strong>{ratioText(foldVsStack)}×</strong> taller than adding one sheet at a time.</>}
          </p>
        </div>
      </div>

      {/* ── Ladder + every-step table ───────────── */}
      <div className="pf-compare">
        <div className="pf-card">
          <div className="pf-card-title">🪜 Milestone ladder <span className="pf-hint">tap to jump</span></div>
          <div className="pf-list" ref={ladderRef}>
            {MILESTONES.map((m, i) => {
              const on = thicknessMm >= m.mm;
              const isNext = i === nextIdx;
              return (
                <button
                  type="button"
                  key={m.label}
                  className={`pf-row ${on ? 'on' : ''} ${isNext ? 'next' : ''}`}
                  data-next={isNext ? '1' : undefined}
                  onClick={() => jumpTo(m.folds)}
                >
                  <span className="pf-row-ico">{m.icon}</span>
                  <span className="pf-row-main">
                    <span className="pf-row-name">{m.label}</span>
                    <span className="pf-row-size">{formatLength(m.mm)}</span>
                  </span>
                  <span className="pf-row-fold">
                    {on ? '✓' : isNext ? '🎯' : ''} fold {m.folds}
                  </span>
                </button>
              );
            })}
            <button
              type="button"
              className={`pf-row bonus ${thicknessMm >= SUN.mm ? 'on' : ''} ${nextIdx === -1 && thicknessMm < SUN.mm ? 'next' : ''}`}
              data-next={nextIdx === -1 && thicknessMm < SUN.mm ? '1' : undefined}
              onClick={() => jumpTo(SUN.folds)}
            >
              <span className="pf-row-ico">{SUN.icon}</span>
              <span className="pf-row-main">
                <span className="pf-row-name">{SUN.label} <em>bonus</em></span>
                <span className="pf-row-size">{formatLength(SUN.mm)}</span>
              </span>
              <span className="pf-row-fold">{thicknessMm >= SUN.mm ? '✓' : ''} fold {SUN.folds}</span>
            </button>
          </div>
        </div>

        <div className="pf-card">
          <div className="pf-card-title">📋 Every fold, side by side <span className="pf-hint">tap to jump</span></div>
          <div className="pf-th">
            <span>Fold</span><span>Layers</span><span>Thickness</span><span>Like…</span>
          </div>
          <div className="pf-list pf-table" ref={tableRef}>
            {Array.from({ length: MAX_FOLDS + 1 }, (_, n) => {
              const mm = PAPER_MM * Math.pow(2, n);
              const r = bestRef(mm);
              const q = mm / r.mm;
              return (
                <button
                  type="button"
                  key={n}
                  className={`pf-tr ${n === folds ? 'cur' : ''} ${n < folds ? 'done' : ''}`}
                  data-cur={n === folds ? '1' : undefined}
                  onClick={() => jumpTo(n)}
                >
                  <span>{n}</span>
                  <span>{fmtWords(Math.pow(2, n))}</span>
                  <span>{formatLength(mm)}</span>
                  <span>{r.icon} {n === 0 ? 'one sheet' : q < 1.25 ? r.short : `${ratioText(q)}× ${r.short}`}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Reality check ───────────────────────── */}
      <div className="pf-card pf-reality">
        <div className="pf-card-title">🧪 Reality check</div>
        <ul>
          <li>
            Every fold <strong>halves</strong> the footprint while <strong>doubling</strong> the height. After 42 folds an A4 sheet would be only
            about <strong>{fmtSmall(SHEET_W_MM / Math.pow(2, 21))}</strong> wide — yet 439,805&nbsp;km tall.
          </li>
          <li>With ordinary paper, most people can&rsquo;t manage more than about <strong>7 folds</strong>.</li>
          <li>
            In 2002, student Britney Gallivan folded a ~1.2&nbsp;km roll of toilet paper <strong>12 times</strong> — the record for
            this challenge — by working out the exact length needed with maths.
          </li>
        </ul>
      </div>

      <style>{`
        .pf-wrap { display: flex; flex-direction: column; gap: 18px; }
        .pf-wrap * { box-sizing: border-box; }
        .pf-question { color: var(--text2); line-height: 1.75; margin: 0 0 10px; }
        .pf-muted { color: var(--text3); font-size: .85rem; line-height: 1.6; margin: 0; }

        /* guess */
        .pf-guess { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
        .pf-guess-label { font-family: var(--fm); font-size: .72rem; color: var(--text3); letter-spacing: .05em; text-transform: uppercase; margin-right: 2px; }
        .pf-chip { font-family: var(--fm); font-size: .78rem; padding: 5px 12px; border-radius: 999px; border: 1px solid var(--border2); background: var(--bg2); color: var(--text2); cursor: pointer; transition: all .15s; }
        .pf-chip:hover { border-color: var(--amber); color: var(--amber); transform: translateY(-1px); }
        .pf-chip.on { background: var(--amber); border-color: var(--amber); color: #1a1405; font-weight: 700; }

        /* controls */
        .pf-controls { display: flex; flex-direction: column; gap: 12px; padding: 14px; background: var(--bg2); border: 1px solid var(--border); border-radius: 14px; }
        .pf-btn-row { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
        .pf-mini { font-family: var(--fm); font-size: .76rem; padding: 8px 12px; border-radius: 10px; border: 1px solid var(--border2); background: var(--bg); color: var(--text2); cursor: pointer; transition: all .15s; white-space: nowrap; }
        .pf-mini:hover:not(:disabled) { border-color: var(--amber); color: var(--amber); }
        .pf-mini:disabled { opacity: .4; cursor: not-allowed; }
        .pf-mini.live { border-color: var(--teal); color: var(--teal); animation: pf-glow 1.2s ease-in-out infinite; }
        .pf-fold-btn { display: inline-flex; align-items: center; gap: 10px; font-weight: 800; font-size: 1rem; padding: 11px 22px; border-radius: 14px; border: 0; cursor: pointer; color: #1a1405; background: linear-gradient(135deg, #ffd166, #e8a020 60%, #f08a24); box-shadow: 0 4px 0 #a86a0c, 0 8px 22px rgba(232,160,32,.35); transition: transform .08s, box-shadow .08s, filter .15s; }
        .pf-fold-btn small { font-family: var(--fm); font-weight: 600; opacity: .7; margin-left: 4px; font-size: .7rem; }
        .pf-fold-btn:hover:not(:disabled) { filter: brightness(1.07); }
        .pf-fold-btn:active:not(:disabled) { transform: translateY(3px); box-shadow: 0 1px 0 #a86a0c, 0 3px 10px rgba(232,160,32,.3); }
        .pf-fold-btn:disabled { opacity: .45; cursor: not-allowed; }
        .pf-fold-btn-ico { display: inline-block; font-size: 1.25rem; }
        .pf-fold-btn:active .pf-fold-btn-ico { animation: pf-wiggle .3s; }
        .pf-slider-row { display: flex; align-items: flex-start; gap: 12px; }
        .pf-slider-box { position: relative; flex: 1; padding-bottom: 20px; }
        .pf-slider { width: 100%; accent-color: var(--amber); cursor: pointer; margin: 0; display: block; height: 22px; }
        .pf-slider-marks { position: absolute; left: 0; right: 0; bottom: 0; height: 16px; font-family: var(--fm); font-size: .62rem; color: var(--text3); }
        .pf-slider-marks span { position: absolute; transform: translateX(-50%); white-space: nowrap; }
        .pf-fold-count { font-family: var(--fm); font-size: .9rem; color: var(--amber); font-weight: 800; white-space: nowrap; min-width: 78px; text-align: right; animation: pf-pop .3s ease-out; padding-top: 2px; }

        /* stage */
        .pf-stage { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr); gap: 16px; align-items: stretch; }
        .pf-side { display: flex; flex-direction: column; gap: 14px; min-width: 0; }
        .pf-card { background: var(--bg2); border: 1px solid var(--border); border-radius: 14px; padding: 14px 16px; min-width: 0; }
        .pf-card-title { font-family: var(--fm); font-size: .72rem; letter-spacing: .06em; text-transform: uppercase; color: var(--text3); margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
        .pf-hint { margin-left: auto; text-transform: none; letter-spacing: 0; font-size: .66rem; opacity: .75; }

        /* space scene (always dark — it's space) */
        .pf-scene { position: relative; min-height: 440px; border-radius: 16px; overflow: hidden; border: 1px solid rgba(255,255,255,.1);
          background: linear-gradient(180deg, #04050d 0%, #0a1130 52%, #16305f 84%, #28629f 100%); color: #e8e2d8; isolation: isolate; }
        .pf-star { position: absolute; background: #fff; border-radius: 50%; opacity: .25; animation: pf-twinkle 3.2s ease-in-out infinite; }
        .pf-scale-note { position: absolute; left: 12px; top: 10px; font-family: var(--fm); font-size: .56rem; letter-spacing: .08em; color: rgba(232,226,216,.45); z-index: 3; }

        .pf-moon { position: absolute; left: 50%; top: 26px; width: 84px; height: 84px; margin-left: -42px; border-radius: 50%;
          background: radial-gradient(circle at 34% 30%, #fffdf0, #ece4c8 52%, #b8b098 100%);
          box-shadow: 0 0 40px 8px rgba(255,246,205,.28); animation: pf-float 6s ease-in-out infinite; z-index: 1; }
        .pf-moon.hit { box-shadow: 0 0 70px 18px rgba(255,226,140,.65); animation: pf-float 6s ease-in-out infinite, pf-moonpulse 1.1s ease-in-out infinite; }
        .pf-crater { position: absolute; border-radius: 50%; background: radial-gradient(circle at 40% 40%, rgba(0,0,0,.05), rgba(0,0,0,.16)); }
        .pf-crater.c1 { width: 20px; height: 20px; left: 14px; top: 46px; }
        .pf-crater.c2 { width: 13px; height: 13px; left: 50px; top: 18px; }
        .pf-crater.c3 { width: 24px; height: 24px; left: 46px; top: 48px; }
        .pf-moon-label { position: absolute; left: 50%; top: 116px; transform: translateX(-50%); font-family: var(--fm); font-size: .62rem; color: rgba(255,246,205,.8); z-index: 2; white-space: nowrap; }
        .pf-ring { position: absolute; left: 50%; top: 26px; width: 84px; height: 84px; margin-left: -42px; border-radius: 50%; border: 2px solid rgba(255,226,140,.8); animation: pf-ripple 1.8s ease-out infinite; z-index: 0; }

        .pf-earth { position: absolute; left: 50%; bottom: -452px; width: 580px; height: 580px; margin-left: -290px; border-radius: 50%;
          background:
            radial-gradient(ellipse 70px 22px at 36% 5%, #3fae6a 0 55%, transparent 60%),
            radial-gradient(ellipse 54px 18px at 64% 7%, #3fae6a 0 55%, transparent 60%),
            radial-gradient(circle at 50% 4%, #63d3ff 0%, #2d82e6 20%, #1b4fa8 50%, #0b2a66 100%);
          box-shadow: 0 0 60px 10px rgba(110,190,255,.45), inset 0 8px 24px rgba(255,255,255,.25); z-index: 1; }
        .pf-earth-label { position: absolute; left: 0; right: 0; bottom: 8px; text-align: center; font-family: var(--fm); font-size: .62rem; color: rgba(255,255,255,.85); z-index: 3; }

        .pf-track { position: absolute; left: 0; right: 0; top: 112px; bottom: 126px; z-index: 2; }
        .pf-beam { position: absolute; left: 50%; bottom: 0; width: 10px; margin-left: -5px; border-radius: 3px 3px 0 0; overflow: hidden;
          background: repeating-linear-gradient(0deg, #fff7de 0 2px, #e8c97a 2px 4px); box-shadow: 0 0 14px rgba(255,220,130,.85), 0 0 34px rgba(255,200,90,.4);
          transition: height .65s cubic-bezier(.22,1,.36,1); }
        .pf-beam::after { content: ''; position: absolute; inset: 0; background: linear-gradient(0deg, transparent 0%, rgba(255,255,255,.75) 50%, transparent 100%); background-size: 100% 60px; animation: pf-shimmer 1.8s linear infinite; }
        .pf-tip { position: absolute; left: 50%; width: 0; height: 0; transition: bottom .65s cubic-bezier(.22,1,.36,1); }
        .pf-tip-dot { position: absolute; left: -7px; top: -7px; width: 14px; height: 14px; border-radius: 50%; background: #fff6d0; box-shadow: 0 0 0 4px rgba(255,214,102,.35), 0 0 20px 6px rgba(255,214,102,.8); animation: pf-beacon 1.4s ease-in-out infinite; }
        .pf-bubble { position: absolute; left: 16px; top: -12px; white-space: nowrap; font-family: var(--fm); font-size: .72rem; font-weight: 700; color: #1a1405; background: linear-gradient(135deg, #ffd166, #e8a020); padding: 3px 9px; border-radius: 8px; animation: pf-pop .3s ease-out; box-shadow: 0 2px 10px rgba(0,0,0,.35); }
        .pf-bubble::before { content: ''; position: absolute; left: -5px; top: 9px; border: 5px solid transparent; border-right-color: #ffd166; border-left: 0; }

        .pf-tick { position: absolute; right: calc(50% + 10px); display: flex; align-items: center; gap: 5px; transform: translateY(50%); opacity: .38; transition: opacity .3s; pointer-events: auto; cursor: help; }
        .pf-tick i { display: block; width: 10px; height: 2px; border-radius: 2px; background: rgba(255,255,255,.7); }
        .pf-tick.on { opacity: 1; }
        .pf-tick.on i { background: #ffd166; box-shadow: 0 0 8px #ffd166; }
        .pf-tick-label { font-size: .66rem; font-family: var(--fm); color: rgba(255,255,255,.88); white-space: nowrap; text-shadow: 0 1px 3px rgba(0,0,0,.7); }

        .pf-toast { position: absolute; left: 50%; top: 150px; transform: translateX(-50%); z-index: 6; display: flex; align-items: center; gap: 8px; padding: 8px 14px; border-radius: 999px; font-size: .78rem; white-space: nowrap;
          background: rgba(10,16,40,.88); border: 1px solid rgba(255,214,102,.6); box-shadow: 0 6px 24px rgba(0,0,0,.45); animation: pf-toast 2.8s ease both; }
        .pf-toast-ico { font-size: 1.15rem; }

        /* paper panel */
        .pf-views { display: flex; gap: 18px; align-items: flex-end; justify-content: center; flex-wrap: wrap; }
        .pf-fig { margin: 0; text-align: center; }
        .pf-fig figcaption { font-family: var(--fm); font-size: .64rem; color: var(--text3); margin-top: 8px; }
        .pf-topview { position: relative; perspective: 700px; }
        .pf-ghost { position: absolute; inset: 0; border: 1px dashed var(--border2); border-radius: 3px; background-color: rgba(232,160,32,.05); }
        .pf-sheet { position: absolute; left: 0; top: 0; background: linear-gradient(135deg, #fffdf4, #efe6cf); border: 1px solid rgba(60,50,20,.35);
          box-shadow: 1px 1px 0 #d6cba9, 2px 2px 0 #cbbf9b, 3px 3px 6px rgba(0,0,0,.28); transform-style: preserve-3d; transition: width .12s, height .12s; }
        .pf-flap { position: absolute; background: linear-gradient(135deg, #fffdf4, #efe6cf); border: 1px solid rgba(60,50,20,.35); box-shadow: 0 0 12px rgba(0,0,0,.25); backface-visibility: visible; }
        .pf-flap.fx { left: 100%; top: -1px; width: 100%; height: calc(100% + 2px); transform-origin: 0 50%; animation: pf-flap-x .55s cubic-bezier(.45,.05,.3,1) both; }
        .pf-flap.fy { left: -1px; top: 100%; width: calc(100% + 2px); height: 100%; transform-origin: 50% 0; animation: pf-flap-y .55s cubic-bezier(.45,.05,.3,1) both; }
        .pf-sideview { width: 96px; height: 190px; display: flex; flex-direction: column; justify-content: flex-end; align-items: center; border-bottom: 2px solid var(--border2); }
        .pf-stack { width: 84px; background: repeating-linear-gradient(180deg, #fffaf0 0 3px, #c9b98f 3px 5px); border: 1px solid rgba(60,50,20,.35); border-bottom: 0; box-shadow: 0 0 10px rgba(255,214,102,.25); transition: height .4s cubic-bezier(.22,1,.36,1); }
        .pf-cut { color: var(--amber); font-weight: 900; line-height: .8; font-size: 1.2rem; animation: pf-bob 1.2s ease-in-out infinite; }
        .pf-foot-note { font-size: .78rem; color: var(--text2); line-height: 1.6; margin: 12px 0 0; text-align: center; }

        /* real-life */
        .pf-real { border-color: rgba(232,160,32,.35); background: linear-gradient(135deg, rgba(232,160,32,.08), var(--bg2) 70%); }
        .pf-real-main { display: flex; align-items: center; gap: 14px; animation: pf-pop .35s ease-out; }
        .pf-real-ico { font-size: 2.6rem; line-height: 1; animation: pf-float 3.2s ease-in-out infinite; }
        .pf-real-lead { font-family: var(--fm); font-size: 1.35rem; font-weight: 800; color: var(--amber); }
        .pf-real-tail { color: var(--text); font-size: .95rem; font-weight: 600; }
        .pf-real-fact { color: var(--text2); font-size: .82rem; line-height: 1.6; margin: 10px 0 0; }
        .pf-next { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 8px; margin-top: 12px; padding-top: 10px; border-top: 1px dashed var(--border2); font-size: .8rem; color: var(--text2); }
        .pf-link { background: none; border: 0; color: var(--teal); font-family: var(--fm); font-size: .76rem; font-weight: 700; cursor: pointer; padding: 2px 4px; }
        .pf-link:hover { text-decoration: underline; }

        /* result */
        .pf-result { font-size: .9rem; color: var(--text2); line-height: 1.7; background: linear-gradient(135deg, rgba(232,160,32,.16), rgba(56,201,176,.08)); border: 1px solid rgba(232,160,32,.5); border-radius: 14px; padding: 16px 18px; animation: pf-rise .5s ease-out; }
        .pf-result p { margin: 8px 0 0; }
        .pf-result-title { font-size: 1.15rem; font-weight: 800; color: var(--amber); }
        .pf-result-guess { color: var(--text); font-weight: 600; }

        /* stats */
        .pf-stats { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; }
        .pf-stat { background: var(--bg2); border: 1px solid var(--border); border-radius: 12px; padding: 12px 10px; text-align: center; overflow: hidden; }
        .pf-stat-label { font-family: var(--fm); font-size: .6rem; color: var(--text3); letter-spacing: .06em; text-transform: uppercase; margin-bottom: 4px; }
        .pf-stat-val { font-family: var(--fm); font-size: 1.05rem; font-weight: 800; color: var(--text); overflow-wrap: anywhere; }
        .pf-pop { animation: pf-pop .3s ease-out; }

        /* comparison bars */
        .pf-compare { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; align-items: start; }
        .pf-bar-row { display: grid; grid-template-columns: 1fr auto; gap: 4px 10px; align-items: center; margin-bottom: 12px; }
        .pf-bar-name { grid-column: 1 / -1; font-size: .74rem; color: var(--text2); }
        .pf-bar { height: 14px; background: var(--bg); border: 1px solid var(--border); border-radius: 7px; overflow: hidden; }
        .pf-bar-fill { height: 100%; border-radius: 7px; transform-origin: left; animation: pf-grow .6s cubic-bezier(.22,1,.36,1) both; }
        .pf-bar-fill.before { background: linear-gradient(90deg, #6b7a99, #8fa0c4); }
        .pf-bar-fill.after { background: linear-gradient(90deg, var(--teal), var(--amber)); }
        .pf-bar-fill.lin { background: linear-gradient(90deg, #7c6bd6, #9b80e8); min-width: 3px; }
        .pf-bar-val { font-family: var(--fm); font-size: .78rem; font-weight: 700; color: var(--text); min-width: 74px; text-align: right; }
        .pf-insight { margin: 4px 0 0; font-size: .82rem; color: var(--text2); line-height: 1.6; }

        /* lists */
        .pf-list { position: relative; max-height: 400px; overflow-y: auto; display: flex; flex-direction: column; gap: 4px; padding-right: 4px; scrollbar-width: thin; }
        .pf-row { display: grid; grid-template-columns: 34px 1fr auto; gap: 10px; align-items: center; text-align: left; width: 100%; padding: 8px 10px; border-radius: 10px; border: 1px solid transparent; background: var(--bg); color: var(--text3); cursor: pointer; transition: all .2s; }
        .pf-row:hover { border-color: var(--border2); transform: translateX(2px); }
        .pf-row-ico { font-size: 1.35rem; text-align: center; filter: grayscale(1); opacity: .55; transition: all .3s; }
        .pf-row-main { display: flex; flex-direction: column; min-width: 0; }
        .pf-row-name { font-size: .84rem; font-weight: 600; }
        .pf-row-name em { font-style: normal; font-family: var(--fm); font-size: .58rem; color: var(--amber); border: 1px solid var(--amber); border-radius: 6px; padding: 0 5px; margin-left: 4px; vertical-align: middle; }
        .pf-row-size, .pf-row-fold { font-family: var(--fm); font-size: .68rem; }
        .pf-row.on { color: var(--text); background: rgba(56,201,176,.08); }
        .pf-row.on .pf-row-ico { filter: none; opacity: 1; }
        .pf-row.on .pf-row-fold { color: var(--teal); font-weight: 700; }
        .pf-row.next { border-color: var(--amber); background: rgba(232,160,32,.1); color: var(--text); animation: pf-glow 1.6s ease-in-out infinite; }
        .pf-row.next .pf-row-ico { filter: none; opacity: 1; }
        .pf-row.next .pf-row-fold { color: var(--amber); font-weight: 700; }

        .pf-th, .pf-tr { display: grid; grid-template-columns: 38px 1fr 1fr 1.5fr; gap: 8px; align-items: center; }
        .pf-th { font-family: var(--fm); font-size: .6rem; letter-spacing: .06em; text-transform: uppercase; color: var(--text3); padding: 0 8px 6px; }
        .pf-tr { width: 100%; text-align: left; padding: 6px 8px; border-radius: 8px; border: 1px solid transparent; background: transparent; color: var(--text3); font-family: var(--fm); font-size: .7rem; cursor: pointer; transition: background .15s; }
        .pf-tr:hover { background: var(--bg); }
        .pf-tr.done { color: var(--text2); }
        .pf-tr.cur { background: rgba(232,160,32,.14); border-color: var(--amber); color: var(--text); font-weight: 700; }
        .pf-tr span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

        .pf-reality ul { margin: 0; padding-left: 18px; color: var(--text2); font-size: .84rem; line-height: 1.7; display: flex; flex-direction: column; gap: 6px; }

        /* keyframes */
        @keyframes pf-flap-x { from { transform: rotateY(0deg); background: #fffdf4; } to { transform: rotateY(-180deg); background: #efe6cf; } }
        @keyframes pf-flap-y { from { transform: rotateX(0deg); background: #fffdf4; } to { transform: rotateX(180deg); background: #efe6cf; } }
        @keyframes pf-pop { 0% { transform: scale(.85); opacity: .4; } 60% { transform: scale(1.08); } 100% { transform: scale(1); opacity: 1; } }
        @keyframes pf-grow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        @keyframes pf-rise { from { transform: translateY(14px); opacity: 0; } to { transform: none; opacity: 1; } }
        @keyframes pf-twinkle { 0%, 100% { opacity: .15; } 50% { opacity: .95; } }
        @keyframes pf-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
        @keyframes pf-beacon { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.35); } }
        @keyframes pf-shimmer { from { background-position: 0 60px; } to { background-position: 0 -60px; } }
        @keyframes pf-moonpulse { 0%, 100% { box-shadow: 0 0 60px 14px rgba(255,226,140,.55); } 50% { box-shadow: 0 0 100px 30px rgba(255,226,140,.85); } }
        @keyframes pf-ripple { from { transform: scale(1); opacity: .9; } to { transform: scale(2.4); opacity: 0; } }
        @keyframes pf-toast { 0% { opacity: 0; transform: translate(-50%, 14px) scale(.9); } 12% { opacity: 1; transform: translate(-50%, 0) scale(1.03); } 18% { transform: translate(-50%, 0) scale(1); } 82% { opacity: 1; } 100% { opacity: 0; transform: translate(-50%, -10px); } }
        @keyframes pf-glow { 0%, 100% { box-shadow: 0 0 0 0 rgba(232,160,32,0); } 50% { box-shadow: 0 0 14px 1px rgba(232,160,32,.35); } }
        @keyframes pf-wiggle { 0%, 100% { transform: rotate(0); } 30% { transform: rotate(-18deg); } 70% { transform: rotate(14deg); } }
        @keyframes pf-bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }

        /* responsive */
        @media (max-width: 760px) {
          .pf-stage, .pf-compare { grid-template-columns: minmax(0, 1fr); }
          .pf-stats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .pf-scene { min-height: 400px; }
          .pf-fold-btn { flex: 1 1 100%; justify-content: center; order: -1; }
        }

        @media (prefers-reduced-motion: reduce) {
          .pf-wrap *, .pf-wrap *::before, .pf-wrap *::after { animation: none !important; transition: none !important; }
          .pf-flap { display: none; }
        }
      `}</style>
    </div>
  );
}
