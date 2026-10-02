'use client';

import { useState, useEffect, useCallback } from 'react';
import Confetti from '../../components/explore/Confetti';

/* ══════════════════════════════════════════════════════
   Nim — the classic pile game, rebuilt natively (the old site's
   version was an unreachable embed, so this is a fresh
   implementation of the same rules/idea).

   Rules: players alternate removing 1+ objects from a single
   pile; whoever takes the LAST object wins. The "smart" computer
   opponent plays the real optimal strategy discovered by Charles
   Bouton (1901): compute the binary XOR of all pile sizes (the
   "nim-sum"). If it's nonzero, there's always a move that brings
   it back to zero — and a player facing a zero nim-sum is lost
   against a perfect opponent. The Hint button and the "Show the
   math" panel both surface this exact piece of math instead of
   just playing the move for you.

   `onEvent(name)` is optional instrumentation for the Explore hub
   (progress tracking / badges) — it never affects game logic.
   ══════════════════════════════════════════════════════ */

const PRESETS = [
  { label: '3 piles · 3, 5, 7', piles: [3, 5, 7] },
  { label: '4 piles · 1, 3, 5, 7', piles: [1, 3, 5, 7], hardest: true },
  { label: '3 piles · 2, 4, 6', piles: [2, 4, 6] },
];

const ANIMATION_MS = 260;

function nimSum(piles) {
  return piles.reduce((a, b) => a ^ b, 0);
}

function bestComputerMove(piles) {
  const sum = nimSum(piles);
  if (sum !== 0) {
    for (let i = 0; i < piles.length; i++) {
      const target = piles[i] ^ sum;
      if (target < piles[i]) return { pileIndex: i, newSize: target };
    }
  }
  // Losing position — no move preserves it, so just take 1 from the largest pile.
  let idx = 0;
  for (let i = 1; i < piles.length; i++) if (piles[i] > piles[idx]) idx = i;
  return { pileIndex: idx, newSize: Math.max(0, piles[idx] - 1) };
}

function removalKey(pileIndex, stoneIndex) {
  return `${pileIndex}:${stoneIndex}`;
}

function toBinaryBits(n, width) {
  return n.toString(2).padStart(width, '0').split('');
}

export default function NimGame({ onEvent } = {}) {
  const [piles, setPiles] = useState(PRESETS[0].piles);
  const [mode, setMode] = useState('vsComputer'); // 'vsComputer' | 'twoPlayer'
  const [turn, setTurn] = useState('player'); // 'player' | 'computer' | 'p1' | 'p2'
  const [winner, setWinner] = useState(null);
  const [hint, setHint] = useState(null);
  const [thinking, setThinking] = useState(false);
  const [activePreset, setActivePreset] = useState(PRESETS[0]);
  const [removing, setRemoving] = useState(() => new Set());
  const [hoverPreview, setHoverPreview] = useState(null); // { pileIndex, stoneIndex }
  const [moveLog, setMoveLog] = useState([]);
  const [showMath, setShowMath] = useState(false);
  const [confettiFire, setConfettiFire] = useState(0);

  const locked = removing.size > 0;
  const total = piles.reduce((a, b) => a + b, 0);
  const currentLabel = mode === 'vsComputer' ? (turn === 'player' ? 'Your turn' : "Computer's turn") : (turn === 'p1' ? "Player 1's turn" : "Player 2's turn");
  const maxBits = Math.max(1, ...piles.map((p) => p.toString(2).length));
  const sum = nimSum(piles);

  const reset = useCallback((newPiles, preset) => {
    setPiles(newPiles);
    setTurn(mode === 'vsComputer' ? 'player' : 'p1');
    setWinner(null);
    setHint(null);
    setThinking(false);
    setRemoving(new Set());
    setHoverPreview(null);
    setMoveLog([]);
    if (preset) setActivePreset(preset);
  }, [mode]);

  function logMove(text) {
    setMoveLog((log) => [text, ...log].slice(0, 8));
  }

  function commitMove(pileIndex, newSize, moverLabel, fromSize) {
    const newPiles = piles.map((p, i) => (i === pileIndex ? newSize : p));
    logMove(`${moverLabel} took ${fromSize - newSize} from Pile ${pileIndex + 1} (${fromSize} → ${newSize})`);
    setPiles(newPiles);
    setRemoving(new Set());

    const remaining = newPiles.reduce((a, b) => a + b, 0);
    if (remaining === 0) {
      setWinner(moverLabel);
      if (moverLabel !== 'Computer') setConfettiFire((c) => c + 1);
      if (moverLabel === 'You' && mode === 'vsComputer' && activePreset.hardest) {
        onEvent?.('nim-master');
      }
      return;
    }
    if (mode === 'vsComputer') {
      setTurn(moverLabel === 'You' ? 'computer' : 'player');
    } else {
      setTurn((t) => (t === 'p1' ? 'p2' : 'p1'));
    }
  }

  const takeStonesUpTo = (pileIndex, keepCount) => {
    if (winner || thinking || locked) return;
    if (mode === 'vsComputer' && turn !== 'player') return;

    onEvent?.('interacted');
    setHoverPreview(null);
    setHint(null);

    const fromSize = piles[pileIndex];
    const keys = [];
    for (let s = keepCount; s < fromSize; s++) keys.push(removalKey(pileIndex, s));
    setRemoving(new Set(keys));

    const mover = mode === 'vsComputer' ? 'You' : (turn === 'p1' ? 'Player 1' : 'Player 2');
    setTimeout(() => commitMove(pileIndex, keepCount, mover, fromSize), ANIMATION_MS);
  };

  // Computer's move, after a short "thinking" delay, then the same removal animation.
  useEffect(() => {
    if (mode !== 'vsComputer' || turn !== 'computer' || winner) return;
    setThinking(true);
    let innerTimer;
    const outerTimer = setTimeout(() => {
      const { pileIndex, newSize } = bestComputerMove(piles);
      const fromSize = piles[pileIndex];
      const keys = [];
      for (let s = newSize; s < fromSize; s++) keys.push(removalKey(pileIndex, s));
      setRemoving(new Set(keys));
      setThinking(false);
      innerTimer = setTimeout(() => commitMove(pileIndex, newSize, 'Computer', fromSize), ANIMATION_MS);
    }, 700);
    return () => { clearTimeout(outerTimer); clearTimeout(innerTimer); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turn, mode]);

  const showHint = () => {
    const s = nimSum(piles);
    if (s === 0) {
      setHint("This is a losing position under perfect play — the nim-sum (XOR of all piles) is 0. Any move you make, a perfect opponent can answer.");
    } else {
      const { pileIndex, newSize } = bestComputerMove(piles);
      setHint(`Nim-sum is ${s} (not zero) — a winning move exists. Try reducing pile ${pileIndex + 1} to ${newSize}.`);
    }
  };

  return (
    <div className="nim-wrap">
      <Confetti fire={confettiFire} />

      <div className="nim-controls">
        <div className="nim-mode-toggle">
          <button type="button" disabled={locked} className={mode === 'vsComputer' ? 'active' : ''} onClick={() => { setMode('vsComputer'); reset(piles); }}>vs Computer</button>
          <button type="button" disabled={locked} className={mode === 'twoPlayer' ? 'active' : ''} onClick={() => { setMode('twoPlayer'); setTurn('p1'); setWinner(null); setHint(null); }}>2 Player</button>
        </div>
        <div className="nim-presets">
          {PRESETS.map((p) => (
            <button key={p.label} type="button" disabled={locked} onClick={() => reset(p.piles, p)}>
              {p.label}{p.hardest ? ' 🔥' : ''}
            </button>
          ))}
        </div>
      </div>

      <div className="nim-status">
        {winner ? (
          <span className="nim-winner">🎉 {winner} won!</span>
        ) : (
          <span>{currentLabel}{thinking ? '…' : ''} · {total} object{total === 1 ? '' : 's'} left</span>
        )}
      </div>

      <div className="nim-piles">
        {piles.map((size, pileIndex) => {
          const previewTake = hoverPreview?.pileIndex === pileIndex ? size - hoverPreview.stoneIndex : null;
          return (
            <div key={pileIndex} className="nim-pile">
              <div className="nim-pile-label">
                Pile {pileIndex + 1}
                {previewTake != null && <span className="nim-preview-badge"> · take {previewTake}</span>}
              </div>
              <div className="nim-stones">
                {Array.from({ length: size }).map((_, stoneIndex) => {
                  const inPreview = hoverPreview?.pileIndex === pileIndex && stoneIndex >= hoverPreview.stoneIndex;
                  const isRemoving = removing.has(removalKey(pileIndex, stoneIndex));
                  const rotate = ((pileIndex * 13 + stoneIndex * 29) % 17) - 8;
                  return (
                    <button
                      key={stoneIndex}
                      type="button"
                      className={`nim-stone ${inPreview ? 'preview' : ''} ${isRemoving ? 'removing' : ''}`}
                      style={{ transform: `rotate(${rotate}deg)` }}
                      title={`Take ${size - stoneIndex} from this pile`}
                      onMouseEnter={() => setHoverPreview({ pileIndex, stoneIndex })}
                      onMouseLeave={() => setHoverPreview(null)}
                      onFocus={() => setHoverPreview({ pileIndex, stoneIndex })}
                      onBlur={() => setHoverPreview(null)}
                      onClick={() => takeStonesUpTo(pileIndex, stoneIndex)}
                      disabled={!!winner || thinking || locked || (mode === 'vsComputer' && turn !== 'player')}
                    />
                  );
                })}
                {size === 0 && <span className="nim-empty">empty</span>}
              </div>
            </div>
          );
        })}
      </div>

      <div className="nim-actions">
        <button type="button" className="btn btn-outline" onClick={showHint} disabled={!!winner || locked}>💡 Hint</button>
        <button type="button" className="btn btn-outline" onClick={() => setShowMath((s) => !s)} aria-expanded={showMath}>
          {showMath ? '🔢 Hide the math' : '🔢 Show the math'}
        </button>
        <button type="button" className="btn btn-outline" disabled={locked} onClick={() => reset(PRESETS[0].piles, PRESETS[0])}>↻ Reset</button>
      </div>

      {hint && <div className="nim-hint">{hint}</div>}

      {showMath && (
        <div className="nim-math">
          <div className="nim-math-title">Nim-sum — XOR every pile size, bit by bit</div>
          {piles.map((p, i) => (
            <div key={i} className="nim-math-row">
              <span className="nim-math-label">Pile {i + 1}</span>
              <span className="nim-math-bits">
                {toBinaryBits(p, maxBits).map((bit, bi) => (
                  <span key={bi} className={`nim-bit ${bit === '1' ? 'on' : ''}`}>{bit}</span>
                ))}
              </span>
              <span className="nim-math-dec">{p}</span>
            </div>
          ))}
          <div className="nim-math-row nim-math-sum">
            <span className="nim-math-label">XOR</span>
            <span className="nim-math-bits">
              {toBinaryBits(sum, maxBits).map((bit, bi) => (
                <span key={bi} className={`nim-bit ${bit === '1' ? 'on' : ''}`}>{bit}</span>
              ))}
            </span>
            <span className="nim-math-dec">{sum}</span>
          </div>
          <p className="nim-math-note">
            {sum === 0
              ? 'Nim-sum is 0 — a loss for whoever moves next, against perfect play.'
              : 'Nim-sum is nonzero — a winning move exists. Try Hint to see it.'}
          </p>
        </div>
      )}

      {moveLog.length > 0 && (
        <div className="nim-log">
          <div className="nim-log-title">Move history</div>
          <ul>
            {moveLog.map((m, i) => <li key={i}>{m}</li>)}
          </ul>
        </div>
      )}

      <p className="nim-note">Click a stone to remove it and every stone after it in that pile. Take the last object to win.</p>

      <style>{`
        .nim-wrap { display: flex; flex-direction: column; gap: 16px; }
        .nim-controls { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
        .nim-mode-toggle, .nim-presets { display: flex; gap: 6px; flex-wrap: wrap; }
        .nim-mode-toggle button, .nim-presets button {
          font-family: var(--fm); font-size: .72rem; padding: 6px 12px; border-radius: 7px;
          border: 1px solid var(--border); background: var(--bg2); color: var(--text2); cursor: pointer;
        }
        .nim-mode-toggle button:disabled, .nim-presets button:disabled { opacity: .5; cursor: default; }
        .nim-mode-toggle button.active { border-color: var(--amber); color: var(--amber); background: rgba(232,160,32,.08); }
        .nim-presets button:hover:not(:disabled) { border-color: var(--teal); color: var(--teal); }
        .nim-status { font-family: var(--fm); font-size: .85rem; color: var(--text2); }
        .nim-winner { color: var(--amber); font-weight: 700; }
        .nim-piles { display: flex; flex-direction: column; gap: 14px; }
        .nim-pile-label { font-family: var(--fm); font-size: .68rem; color: var(--text3); letter-spacing: .06em; text-transform: uppercase; margin-bottom: 6px; }
        .nim-preview-badge { color: var(--amber); text-transform: none; letter-spacing: 0; }
        .nim-stones { display: flex; flex-wrap: wrap; gap: 7px; min-height: 30px; align-items: center; }
        .nim-stone {
          width: 26px; height: 26px; border: none; cursor: pointer; position: relative;
          border-radius: 42% 58% 54% 46%;
          background: linear-gradient(145deg, var(--teal), #2a9d8a);
          box-shadow: 0 2px 6px rgba(0,0,0,.35), inset 0 1px 2px rgba(255,255,255,.25);
          transition: transform .18s ease, opacity .18s ease, background .18s ease, box-shadow .18s ease;
        }
        .nim-stone:hover:not(:disabled) { background: linear-gradient(145deg, var(--amber), var(--amber-bd)) !important; transform: scale(1.2) !important; }
        .nim-stone.preview { background: linear-gradient(145deg, var(--amber), var(--amber-bd)) !important; box-shadow: 0 0 0 2px rgba(232,160,32,.5), 0 2px 6px rgba(0,0,0,.35); }
        .nim-stone.removing { transform: scale(.15) rotate(220deg) !important; opacity: 0; }
        .nim-stone:disabled { cursor: default; }
        .nim-empty { font-family: var(--fm); font-size: .72rem; color: var(--text3); opacity: .6; }
        .nim-actions { display: flex; gap: 10px; flex-wrap: wrap; }
        .nim-hint { font-size: .84rem; color: var(--text2); background: var(--bg2); border-left: 3px solid var(--amber); border-radius: 0 8px 8px 0; padding: 12px 14px; }
        .nim-note { font-size: .76rem; color: var(--text3); margin: 0; }

        .nim-math { background: var(--bg2); border: 1px solid var(--border); border-radius: 10px; padding: 16px 18px; display: flex; flex-direction: column; gap: 8px; }
        .nim-math-title { font-family: var(--fm); font-size: .68rem; letter-spacing: .06em; text-transform: uppercase; color: var(--text3); margin-bottom: 4px; }
        .nim-math-row { display: flex; align-items: center; gap: 10px; }
        .nim-math-label { font-family: var(--fm); font-size: .72rem; color: var(--text2); width: 46px; flex-shrink: 0; }
        .nim-math-bits { display: flex; gap: 3px; font-family: var(--fm); }
        .nim-bit { display: inline-flex; align-items: center; justify-content: center; width: 20px; height: 24px; border-radius: 4px; background: rgba(255,255,255,.04); color: var(--text3); font-size: .78rem; }
        .nim-bit.on { background: var(--teal-lt); color: var(--teal); font-weight: 700; }
        .nim-math-sum .nim-bit.on { background: var(--amber-lt); color: var(--amber); }
        .nim-math-dec { font-family: var(--fm); font-size: .72rem; color: var(--text3); }
        .nim-math-sum { border-top: 1px dashed var(--border2); padding-top: 8px; margin-top: 2px; }
        .nim-math-note { font-size: .78rem; color: var(--text2); margin: 2px 0 0; }

        .nim-log { font-size: .78rem; }
        .nim-log-title { font-family: var(--fm); font-size: .68rem; letter-spacing: .06em; text-transform: uppercase; color: var(--text3); margin-bottom: 6px; }
        .nim-log ul { display: flex; flex-direction: column; gap: 4px; max-height: 140px; overflow-y: auto; }
        .nim-log li { color: var(--text2); list-style: none; }

        @media(prefers-reduced-motion: reduce) {
          .nim-stone, .nim-stone.removing, .nim-stone:hover:not(:disabled) { transition: none; }
        }
      `}</style>
    </div>
  );
}
