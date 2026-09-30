'use client';

import { useState, useEffect, useCallback } from 'react';

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
   against a perfect opponent. The Hint button surfaces this
   exact piece of math instead of just playing the move for you.
   ══════════════════════════════════════════════════════ */

const PRESETS = [
  { label: '3 piles · 3, 5, 7', piles: [3, 5, 7] },
  { label: '4 piles · 1, 3, 5, 7', piles: [1, 3, 5, 7] },
  { label: '3 piles · 2, 4, 6', piles: [2, 4, 6] },
];

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

export default function NimGame() {
  const [piles, setPiles] = useState(PRESETS[0].piles);
  const [mode, setMode] = useState('vsComputer'); // 'vsComputer' | 'twoPlayer'
  const [turn, setTurn] = useState('player'); // 'player' | 'computer' | 'p1' | 'p2'
  const [winner, setWinner] = useState(null);
  const [hint, setHint] = useState(null);
  const [thinking, setThinking] = useState(false);

  const total = piles.reduce((a, b) => a + b, 0);
  const currentLabel = mode === 'vsComputer' ? (turn === 'player' ? 'Your turn' : "Computer's turn") : (turn === 'p1' ? "Player 1's turn" : "Player 2's turn");

  const reset = useCallback((newPiles) => {
    setPiles(newPiles);
    setTurn(mode === 'vsComputer' ? 'player' : 'p1');
    setWinner(null);
    setHint(null);
    setThinking(false);
  }, [mode]);

  const takeStonesUpTo = (pileIndex, keepCount) => {
    if (winner || thinking) return;
    if (mode === 'vsComputer' && turn !== 'player') return;

    const mover = mode === 'vsComputer' ? 'You' : (turn === 'p1' ? 'Player 1' : 'Player 2');
    const newPiles = piles.map((p, i) => (i === pileIndex ? keepCount : p));
    setPiles(newPiles);
    setHint(null);

    if (newPiles.reduce((a, b) => a + b, 0) === 0) {
      setWinner(mover);
      return;
    }

    if (mode === 'vsComputer') setTurn('computer');
    else setTurn(turn === 'p1' ? 'p2' : 'p1');
  };

  // Computer's move, after a short delay for readability.
  useEffect(() => {
    if (mode !== 'vsComputer' || turn !== 'computer' || winner) return;
    setThinking(true);
    const t = setTimeout(() => {
      const { pileIndex, newSize } = bestComputerMove(piles);
      const newPiles = piles.map((p, i) => (i === pileIndex ? newSize : p));
      setPiles(newPiles);
      setThinking(false);
      if (newPiles.reduce((a, b) => a + b, 0) === 0) {
        setWinner('Computer');
      } else {
        setTurn('player');
      }
    }, 700);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turn, mode]);

  const showHint = () => {
    const sum = nimSum(piles);
    if (sum === 0) {
      setHint("This is a losing position under perfect play — the nim-sum (XOR of all piles) is 0. Any move you make, a perfect opponent can answer.");
    } else {
      const { pileIndex, newSize } = bestComputerMove(piles);
      setHint(`Nim-sum is ${sum} (not zero) — a winning move exists. Try reducing pile ${pileIndex + 1} to ${newSize}.`);
    }
  };

  return (
    <div className="nim-wrap">
      <div className="nim-controls">
        <div className="nim-mode-toggle">
          <button type="button" className={mode === 'vsComputer' ? 'active' : ''} onClick={() => { setMode('vsComputer'); reset(piles); }}>vs Computer</button>
          <button type="button" className={mode === 'twoPlayer' ? 'active' : ''} onClick={() => { setMode('twoPlayer'); setTurn('p1'); setWinner(null); setHint(null); }}>2 Player</button>
        </div>
        <div className="nim-presets">
          {PRESETS.map((p) => (
            <button key={p.label} type="button" onClick={() => reset(p.piles)}>{p.label}</button>
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
        {piles.map((size, pileIndex) => (
          <div key={pileIndex} className="nim-pile">
            <div className="nim-pile-label">Pile {pileIndex + 1}</div>
            <div className="nim-stones">
              {Array.from({ length: size }).map((_, stoneIndex) => (
                <button
                  key={stoneIndex}
                  type="button"
                  className="nim-stone"
                  title={`Take ${size - stoneIndex} from this pile`}
                  onClick={() => takeStonesUpTo(pileIndex, stoneIndex)}
                  disabled={!!winner || thinking || (mode === 'vsComputer' && turn !== 'player')}
                />
              ))}
              {size === 0 && <span className="nim-empty">empty</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="nim-actions">
        <button type="button" className="btn btn-outline" onClick={showHint} disabled={!!winner}>💡 Hint</button>
        <button type="button" className="btn btn-outline" onClick={() => reset(PRESETS[0].piles)}>↻ Reset</button>
      </div>

      {hint && <div className="nim-hint">{hint}</div>}

      <p className="nim-note">Click a stone to remove it and every stone after it in that pile. Take the last object to win.</p>

      <style>{`
        .nim-wrap { display: flex; flex-direction: column; gap: 16px; }
        .nim-controls { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
        .nim-mode-toggle, .nim-presets { display: flex; gap: 6px; flex-wrap: wrap; }
        .nim-mode-toggle button, .nim-presets button {
          font-family: var(--fm); font-size: .72rem; padding: 6px 12px; border-radius: 7px;
          border: 1px solid var(--border); background: var(--bg2); color: var(--text2); cursor: pointer;
        }
        .nim-mode-toggle button.active { border-color: var(--amber); color: var(--amber); background: rgba(232,160,32,.08); }
        .nim-presets button:hover { border-color: var(--teal); color: var(--teal); }
        .nim-status { font-family: var(--fm); font-size: .85rem; color: var(--text2); }
        .nim-winner { color: var(--amber); font-weight: 700; }
        .nim-piles { display: flex; flex-direction: column; gap: 14px; }
        .nim-pile-label { font-family: var(--fm); font-size: .68rem; color: var(--text3); letter-spacing: .06em; text-transform: uppercase; margin-bottom: 6px; }
        .nim-stones { display: flex; flex-wrap: wrap; gap: 6px; min-height: 28px; align-items: center; }
        .nim-stone {
          width: 22px; height: 22px; border-radius: 50%; border: none; cursor: pointer;
          background: var(--teal); box-shadow: 0 0 0 1px rgba(56,201,176,.3);
        }
        .nim-stone:hover:not(:disabled) { background: var(--amber); transform: scale(1.15); }
        .nim-stone:disabled { cursor: default; opacity: .8; }
        .nim-empty { font-family: var(--fm); font-size: .72rem; color: var(--text3); opacity: .6; }
        .nim-actions { display: flex; gap: 10px; }
        .nim-hint { font-size: .84rem; color: var(--text2); background: var(--bg2); border-left: 3px solid var(--amber); border-radius: 0 8px 8px 0; padding: 12px 14px; }
        .nim-note { font-size: .76rem; color: var(--text3); margin: 0; }
      `}</style>
    </div>
  );
}
