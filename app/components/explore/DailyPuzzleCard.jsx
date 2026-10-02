'use client';

import { useEffect, useMemo, useState } from 'react';
import { getTodayPuzzle } from '../../explore/daily/puzzles';
import { buildShareCardBlob } from '../../explore/shareCard';

function todayLocalISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function DailyPuzzleCard({ streak, recordPuzzleSolved }) {
  const puzzle = useMemo(() => getTodayPuzzle(), []);
  const [hintsShown, setHintsShown] = useState(0);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState(null); // 'correct' | 'incorrect' | null
  const [cardUrl, setCardUrl] = useState(null);
  const [cardBlob, setCardBlob] = useState(null);
  const [shareState, setShareState] = useState(null); // null | 'shared' | 'copied' | 'downloaded'

  const alreadySolved = streak?.lastDay === todayLocalISO() || feedback === 'correct';

  // Build the shareable result card once the puzzle is solved. Image only
  // — no answer/spoiler goes into it, so it's always safe to post.
  useEffect(() => {
    if (!alreadySolved) return;
    let objectUrl;
    let cancelled = false;
    buildShareCardBlob({ streakCount: streak?.count || 1, hintsUsed: hintsShown }).then((blob) => {
      if (cancelled || !blob) return;
      objectUrl = URL.createObjectURL(blob);
      setCardUrl(objectUrl);
      setCardBlob(blob);
    });
    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alreadySolved]);

  function checkAnswer(value) {
    const correct = puzzle.type === 'integer'
      ? Number(value) === puzzle.answer
      : value === puzzle.answer;
    if (correct) {
      setFeedback('correct');
      recordPuzzleSolved?.();
    } else {
      setFeedback('incorrect');
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (input.trim() === '') return;
    checkAnswer(Number(input));
  }

  async function handleShare() {
    if (!cardBlob) return;
    const text = "I solved today's Explore puzzle on mathwithshoaib.com! 🧮";
    const file = new File([cardBlob], 'mathwithshoaib-explore-streak.png', { type: 'image/png' });

    try {
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], text, url: 'https://mathwithshoaib.com/explore' });
        setShareState('shared');
        setTimeout(() => setShareState(null), 2500);
        return;
      }
    } catch {
      // share sheet dismissed/unsupported — fall through to the next option
    }

    try {
      if (navigator.clipboard?.write && typeof window.ClipboardItem !== 'undefined') {
        await navigator.clipboard.write([new window.ClipboardItem({ 'image/png': cardBlob })]);
        setShareState('copied');
        setTimeout(() => setShareState(null), 2500);
        return;
      }
    } catch {
      // clipboard image copy unsupported — fall through to download
    }

    try {
      const a = document.createElement('a');
      a.href = cardUrl;
      a.download = 'mathwithshoaib-explore-streak.png';
      a.click();
      setShareState('downloaded');
      setTimeout(() => setShareState(null), 2500);
    } catch {
      // nothing left to fall back to
    }
  }

  const shareLabel = {
    shared: 'Shared!',
    copied: 'Image copied!',
    downloaded: 'Downloaded!',
  }[shareState] || '🔗 Share result';

  return (
    <div className="explore-daily-card">
      <span className="eyebrow" style={{ marginBottom: '6px' }}>Puzzle of the Day</span>
      <p style={{ color: 'var(--text)', fontSize: '.98rem', lineHeight: 1.7, margin: '0 0 16px' }}>
        {puzzle.question}
      </p>

      {alreadySolved ? (
        <div>
          <p style={{ color: 'var(--teal)', fontWeight: 600, fontSize: '.88rem', margin: '0 0 8px' }}>
            ✅ Solved! Answer: {puzzle.answer}
          </p>
          <p style={{ color: 'var(--text2)', fontSize: '.85rem', lineHeight: 1.7, margin: '0 0 14px' }}>
            {puzzle.explanation}
          </p>

          {cardUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={cardUrl}
              alt="Shareable result card: Daily Puzzle solved, with streak and hints-used, and a link to mathwithshoaib.com/explore"
              style={{ width: '100%', maxWidth: '360px', borderRadius: '12px', border: '1px solid var(--border)', marginBottom: '14px', display: 'block' }}
            />
          )}

          <button type="button" className="btn btn-outline" onClick={handleShare} disabled={!cardBlob}>
            {shareLabel}
          </button>
        </div>
      ) : (
        <div>
          {puzzle.type === 'mc' ? (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
              {puzzle.options.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  className="btn btn-outline"
                  style={{ fontSize: '.8rem', padding: '8px 16px' }}
                  onClick={() => { setInput(opt); checkAnswer(opt); }}
                >
                  {opt}
                </button>
              ))}
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '14px', flexWrap: 'wrap' }}>
              <input
                type="number"
                inputMode="numeric"
                value={input}
                onChange={(e) => { setInput(e.target.value); setFeedback(null); }}
                placeholder="Your answer"
                aria-label="Your answer"
                style={{
                  flex: '1 1 140px', minHeight: '44px', padding: '8px 14px', borderRadius: '8px',
                  border: '1px solid var(--border2)', background: 'var(--bg2)', color: 'var(--text)',
                  fontFamily: 'var(--fm)', fontSize: '.9rem',
                }}
              />
              <button type="submit" className="btn">Check</button>
            </form>
          )}

          {feedback === 'incorrect' && (
            <p style={{ color: 'var(--rose)', fontSize: '.82rem', margin: '0 0 14px' }}>
              Not quite — try a hint below.
            </p>
          )}

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['Nudge', 'Bigger hint', 'Full solution'].map((label, i) => (
              <button
                key={label}
                type="button"
                className="btn btn-outline"
                style={{ fontSize: '.76rem', padding: '7px 14px' }}
                onClick={() => setHintsShown((h) => Math.max(h, i + 1))}
                disabled={hintsShown > i}
              >
                💡 {label}
              </button>
            ))}
          </div>

          {hintsShown > 0 && (
            <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {puzzle.hints.slice(0, hintsShown).map((hint, i) => (
                <div
                  key={i}
                  style={{
                    fontSize: '.82rem', color: 'var(--text2)', background: 'var(--bg2)',
                    borderLeft: '3px solid var(--amber)', borderRadius: '0 8px 8px 0', padding: '10px 14px',
                  }}
                >
                  {hint}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
