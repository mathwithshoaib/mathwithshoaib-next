'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Confetti from '../../components/explore/Confetti';
import {
  DIFFICULTIES, LEVELS, OPERATIONS, OPS_BY_DIFFICULTY, LIMIT,
  initAttempt, applyOperation, undoLast, restartAttempt,
  formatValue, formatTime, isIntegerValue,
  aggregateLeaderboard, hasBlockedWord, makeDeviceId,
} from '../rootRushEngine';
import { submitScore, fetchScores, clearLeaderboard } from '../rootRushApi';

/* ══════════════════════════════════════════════════════
   Root Rush — reach the target number using a handful of operation
   buttons, never going over 60. Game logic (the attempt reducer, the
   leaderboard ranking, the verified fewest-possible-steps per level)
   lives in rootRushEngine.js, kept framework-free so it can be (and
   was) checked by a script before shipping. This file is the UI.

   `onEvent(name)` is optional instrumentation for the Explore hub
   (progress tracking) — fired once on the first real button press.
   ══════════════════════════════════════════════════════ */

const THEME = {
  easy: { label: 'Easy', bg: '#0a1222', bg2: '#0e1930', accent: '#36d399', accentDim: 'rgba(54,211,153,.16)', glow: 'rgba(54,211,153,.45)' },
  medium: { label: 'Medium', bg: '#0a1222', bg2: '#0e1930', accent: '#f5b942', accentDim: 'rgba(245,185,66,.16)', glow: 'rgba(245,185,66,.45)' },
  hard: { label: 'Hard', bg: '#120709', bg2: '#1a0a0d', accent: '#ff4d5e', accentDim: 'rgba(255,77,94,.18)', glow: 'rgba(255,77,94,.55)' },
};

const OP_COLORS = { teal: '#2dd4bf', orange: '#fb923c', gold: '#f5c518', pink: '#ec4899', purple: '#a78bfa' };

const HINTS = [
  'Try working backwards from the target — which numbers can reach it in one step?',
  '√ only lands on a whole number when the number on screen is a perfect square (1, 4, 9, 16, 25, 36, 49) — otherwise you get a decimal.',
  "Undo doesn't cost you a step, so it's safe to backtrack and try a different path.",
  'Keep an eye on the Limit: 60 meter — a big jump near the top can end the attempt instantly.',
];

const NAME_KEY = 'rr_profile';
const DIFFICULTY_LABEL = { easy: 'Easy', medium: 'Medium', hard: 'Hard' };

function loadProfile() {
  try {
    const raw = localStorage.getItem(NAME_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw);
    if (!p || typeof p.name !== 'string' || !p.deviceId) return null;
    return p;
  } catch {
    return null;
  }
}
function saveProfile(p) {
  try { localStorage.setItem(NAME_KEY, JSON.stringify(p)); } catch { /* storage may be blocked */ }
}

export default function RootRush({ onEvent } = {}) {
  const [profile, setProfile] = useState(undefined); // undefined = not loaded yet, null = needs onboarding
  const [screen, setScreen] = useState('home'); // 'name' | 'consent' | 'home' | 'play' | 'summary' | 'leaderboard'
  const [difficulty, setDifficulty] = useState(null);
  const [levelIdx, setLevelIdx] = useState(0);
  const [attempt, setAttempt] = useState(null);
  const [timerStartedAt, setTimerStartedAt] = useState(null);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [levelResults, setLevelResults] = useState([]);
  const [hintIdx, setHintIdx] = useState(null);
  const [confettiFire, setConfettiFire] = useState(0);
  const submittedRef = useRef(false);
  const interactedRef = useRef(false);

  // ── profile load (client-only, avoids hydration mismatch) ──
  useEffect(() => {
    const p = loadProfile();
    if (p) { setProfile(p); setScreen('home'); }
    else { setProfile(null); setScreen('name'); }
  }, []);

  // ── timer tick ──
  useEffect(() => {
    if (!attempt || attempt.phase !== 'active' || timerStartedAt == null) return;
    const id = setInterval(() => setElapsedMs(Date.now() - timerStartedAt), 200);
    return () => clearInterval(id);
  }, [attempt, timerStartedAt]);

  // ── submit score + confetti once a level is solved ──
  useEffect(() => {
    if (!attempt || attempt.phase !== 'solved' || submittedRef.current) return;
    submittedRef.current = true;
    setConfettiFire((c) => c + 1);
    const level = levelIdx + 1;
    const steps = attempt.steps;
    setLevelResults((prev) => [...prev, { level, steps, timeMs: elapsedMs, perfect: steps === LEVELS[difficulty][levelIdx].minSteps }]);
    if (profile?.shareOnLeaderboard && profile?.name) {
      submitScore({ difficulty, level, playerName: profile.name, deviceId: profile.deviceId, steps, timeMs: elapsedMs });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempt?.phase]);

  function markInteracted() {
    if (interactedRef.current) return;
    interactedRef.current = true;
    onEvent?.('interacted');
  }

  // ── name / consent onboarding ──
  function NameScreen() {
    const [draft, setDraft] = useState(profile?.name || '');
    const [error, setError] = useState('');
    function next() {
      const trimmed = draft.trim();
      if (!trimmed) { setError('Enter a nickname to continue.'); return; }
      if (trimmed.length > 20) { setError('Keep it to 20 characters or fewer.'); return; }
      if (hasBlockedWord(trimmed)) { setError('Please choose a different nickname.'); return; }
      const deviceId = profile?.deviceId || makeDeviceId();
      setProfile((prev) => ({ ...(prev || {}), name: trimmed, deviceId, shareOnLeaderboard: prev?.shareOnLeaderboard ?? null }));
      setScreen('consent');
    }
    return (
      <div className="rr-card rr-onboard">
        <span className="eyebrow">Root Rush</span>
        <h3 style={{ marginTop: '6px' }}>What should we call you?</h3>
        <input
          className="rr-input"
          value={draft}
          maxLength={20}
          placeholder="Nickname"
          onChange={(e) => { setDraft(e.target.value); setError(''); }}
          onKeyDown={(e) => { if (e.key === 'Enter') next(); }}
        />
        <p className="rr-hint-text">Use a nickname, no full names. Max 20 characters.</p>
        {error && <p className="rr-error">{error}</p>}
        <button type="button" className="btn" onClick={next}>Continue</button>
      </div>
    );
  }

  function ConsentScreen() {
    function choose(share) {
      const next = { ...profile, shareOnLeaderboard: share, seenHard: profile?.seenHard || false };
      setProfile(next);
      saveProfile(next);
      setScreen('home');
    }
    return (
      <div className="rr-card rr-onboard">
        <span className="eyebrow">Root Rush</span>
        <h3 style={{ marginTop: '6px' }}>Show your name on the leaderboard?</h3>
        <p style={{ color: 'var(--text2)', lineHeight: 1.7 }}>
          If yes, your best step count for each level is recorded under &ldquo;{profile?.name}&rdquo; on the shared leaderboard. If no, you can still play — nothing is recorded and your name appears nowhere.
        </p>
        <div className="rr-row">
          <button type="button" className="btn" onClick={() => choose(true)}>Yes, show my name</button>
          <button type="button" className="btn btn-outline" onClick={() => choose(false)}>No, just let me play</button>
        </div>
      </div>
    );
  }

  // ── start / navigate ──
  function startDifficulty(d) {
    setDifficulty(d);
    setLevelIdx(0);
    setAttempt(initAttempt(LEVELS[d][0].start, 1));
    setTimerStartedAt(null);
    setElapsedMs(0);
    setLevelResults([]);
    setHintIdx(null);
    submittedRef.current = false;
    setScreen('play');
    if (d === 'hard' && profile && !profile.seenHard) {
      const next = { ...profile, seenHard: true };
      setProfile(next);
      saveProfile(next);
    }
  }
  function goLevel(idx) {
    setLevelIdx(idx);
    setAttempt(initAttempt(LEVELS[difficulty][idx].start, 1));
    setTimerStartedAt(null);
    setElapsedMs(0);
    setHintIdx(null);
    submittedRef.current = false;
  }
  function pressOp(opId) {
    if (!attempt || attempt.phase !== 'active') return;
    markInteracted();
    let startedAt = timerStartedAt;
    if (startedAt == null) { startedAt = Date.now(); setTimerStartedAt(startedAt); }
    const level = LEVELS[difficulty][levelIdx];
    setAttempt((prev) => applyOperation(prev, opId, level.target));
    setHintIdx(null);
  }
  function pressUndo() {
    if (!attempt || attempt.phase !== 'active') return;
    setAttempt((prev) => undoLast(prev));
  }
  function pressRestart() {
    const level = LEVELS[difficulty][levelIdx];
    setAttempt((prev) => restartAttempt(prev, level.start));
    setTimerStartedAt(null);
    setElapsedMs(0);
    setHintIdx(null);
    submittedRef.current = false;
  }
  function pressNext() {
    if (levelIdx < 2) goLevel(levelIdx + 1);
    else setScreen('summary');
  }
  function changeName() { setScreen('name'); }
  function toHome() { setScreen('home'); setDifficulty(null); setAttempt(null); }

  if (profile === undefined) return null; // avoid a flash before localStorage is read

  const level = difficulty ? LEVELS[difficulty][levelIdx] : null;
  const theme = difficulty ? THEME[difficulty] : THEME.easy;
  const currentValue = attempt ? attempt.trail[attempt.trail.length - 1] : 0;
  const pct = attempt ? Math.min(100, Math.max(0, (Math.max(0, currentValue) / LIMIT) * 100)) : 0;
  const meterClass = pct > 91.6 ? 'over' : pct > 75 ? 'warn' : '';
  const isDecimal = attempt && !isIntegerValue(currentValue);

  return (
    <div className="rr-root" style={{ '--rr-bg': theme.bg, '--rr-bg2': theme.bg2, '--rr-accent': theme.accent, '--rr-accent-dim': theme.accentDim, '--rr-glow': theme.glow }}>
      <Confetti fire={confettiFire} />

      {screen === 'name' && <NameScreen />}
      {screen === 'consent' && <ConsentScreen />}

      {screen === 'home' && (
        <div className="rr-card">
          <div className="rr-home-head">
            <div>
              <span className="eyebrow">Root Rush</span>
              <h3 style={{ margin: '6px 0 0' }}>{profile?.name ? `Hey, ${profile.name}!` : 'Pick a difficulty'}</h3>
            </div>
            <button type="button" className="rr-link" onClick={changeName}>Change name</button>
          </div>
          <p style={{ color: 'var(--text2)' }}>Chase the target number with a handful of buttons — never go over 60.</p>
          <div className="rr-diff-grid">
            {DIFFICULTIES.map((d) => (
              <button key={d} type="button" className={`rr-diff-tile rr-diff-${d}`} onClick={() => startDifficulty(d)}>
                <strong>{THEME[d].label}</strong>
                <span>{OPS_BY_DIFFICULTY[d].map((id) => OPERATIONS[id].label).join('  ·  ')}</span>
                {d === 'hard' && !profile?.seenHard && <span className="rr-badge-new">New operations!</span>}
              </button>
            ))}
          </div>
          <button type="button" className="btn btn-outline" onClick={() => setScreen('leaderboard')}>🏆 Leaderboard</button>
        </div>
      )}

      {screen === 'play' && attempt && level && (
        <div className={`rr-card rr-play rr-theme-${difficulty}`}>
          <div className="rr-topbar">
            <span className="rr-chip">{DIFFICULTY_LABEL[difficulty]}</span>
            <div className="rr-dots" aria-label={`Level ${levelIdx + 1} of 3`}>
              {[0, 1, 2].map((i) => <span key={i} className={`rr-dot ${i === levelIdx ? 'on' : i < levelIdx ? 'done' : ''}`} />)}
            </div>
            <span className="rr-target-badge">{level.start} → {level.target}</span>
          </div>

          <div className={`rr-display ${attempt.phase === 'failed' ? 'rr-fail-flash' : ''} ${attempt.phase === 'solved' ? 'rr-solved-glow' : ''}`}>
            <div className="rr-value">{formatValue(currentValue)}</div>
          </div>

          <div className="rr-meter-wrap">
            <div className={`rr-meter ${meterClass}`}><div className="rr-meter-fill" style={{ width: pct + '%' }} /></div>
            <span className="rr-meter-label">Limit: 60</span>
          </div>

          <div className="rr-trail" aria-label="Path so far">
            {attempt.trail.map((v, i) => (
              <span key={i}>{i > 0 && <span className="rr-trail-arrow"> → </span>}{formatValue(v)}</span>
            ))}
          </div>

          {isDecimal && attempt.phase === 'active' && <p className="rr-note">Decimal! Try Undo.</p>}

          <div className="rr-stats-row">
            <span>Steps: <b>{attempt.steps}</b></span>
            <span>Time: <b>{formatTime(elapsedMs)}</b></span>
            <span>Attempt #{attempt.attemptNum}</span>
          </div>

          {attempt.phase === 'active' && (
            <>
              <div className={`rr-ops-grid ${OPS_BY_DIFFICULTY[difficulty].length === 4 ? 'rr-ops-4' : 'rr-ops-3'}`}>
                {OPS_BY_DIFFICULTY[difficulty].map((opId) => {
                  const op = OPERATIONS[opId];
                  return (
                    <button
                      key={opId}
                      type="button"
                      className="rr-op"
                      style={{ '--op-color': OP_COLORS[op.color] }}
                      onClick={() => pressOp(opId)}
                    >
                      {op.label}
                    </button>
                  );
                })}
              </div>
              <div className="rr-row">
                <button type="button" className="btn btn-outline" onClick={pressUndo} disabled={attempt.trail.length <= 1}>↶ Undo</button>
                <button type="button" className="btn btn-outline" onClick={pressRestart}>↻ Restart level</button>
                <button type="button" className="btn btn-outline" onClick={() => setHintIdx((i) => (i == null ? 0 : (i + 1) % HINTS.length))}>💡 Hint</button>
              </div>
              {hintIdx != null && <p className="rr-hint-box">{HINTS[hintIdx]}</p>}
            </>
          )}

          {attempt.phase === 'failed' && (
            <div className="rr-fail-panel">
              <div className="rr-fail-banner">TASK FAILED: the number went over 60</div>
              <button type="button" className="btn" onClick={pressRestart}>Try again</button>
            </div>
          )}

          {attempt.phase === 'solved' && (
            <div className="rr-solved-panel">
              {attempt.steps === level.minSteps
                ? <span className="rr-perfect">Perfect! 🌟</span>
                : <span className="rr-best">Best possible: {level.minSteps} steps</span>}
              <button type="button" className="btn" onClick={pressNext}>{levelIdx < 2 ? 'Next level →' : 'See summary →'}</button>
            </div>
          )}

          <button type="button" className="rr-link rr-back" onClick={toHome}>← Choose another difficulty</button>
        </div>
      )}

      {screen === 'summary' && difficulty && (
        <div className={`rr-card rr-theme-${difficulty}`}>
          <span className="eyebrow">{DIFFICULTY_LABEL[difficulty]} — complete!</span>
          <h3 style={{ margin: '6px 0 16px' }}>Nice run, {profile?.name || 'friend'}.</h3>
          <div className="rr-summary-list">
            {levelResults.map((r) => (
              <div key={r.level} className="rr-summary-row">
                <span>Level {r.level}</span>
                <span>{r.steps} steps{r.perfect ? ' · Perfect!' : ''}</span>
                <span>{formatTime(r.timeMs)}</span>
              </div>
            ))}
          </div>
          <div className="rr-row">
            <button type="button" className="btn" onClick={() => startDifficulty(difficulty)}>Replay {DIFFICULTY_LABEL[difficulty]}</button>
            <button type="button" className="btn btn-outline" onClick={toHome}>Choose another</button>
          </div>
        </div>
      )}

      {screen === 'leaderboard' && (
        <LeaderboardScreen onBack={() => setScreen('home')} />
      )}

      <style>{ROOT_RUSH_CSS}</style>
    </div>
  );
}

function medal(rank) {
  if (rank === 0) return '🥇';
  if (rank === 1) return '🥈';
  if (rank === 2) return '🥉';
  return null;
}

function LeaderboardScreen({ onBack }) {
  const [difficulty, setDifficulty] = useState('easy');
  const [level, setLevel] = useState(1);
  const [rows, setRows] = useState(null);
  const [expanded, setExpanded] = useState(null); // steps value currently expanded
  const [ownerOpen, setOwnerOpen] = useState(false);
  const [ownerSecret, setOwnerSecret] = useState('');
  const [ownerMsg, setOwnerMsg] = useState('');

  useEffect(() => {
    let cancelled = false;
    setRows(null);
    setExpanded(null);
    fetchScores(difficulty, level).then((r) => { if (!cancelled) setRows(r); });
    return () => { cancelled = true; };
  }, [difficulty, level]);

  const groups = useMemo(() => (rows ? aggregateLeaderboard(rows) : []), [rows]);

  async function doClear() {
    setOwnerMsg('Clearing…');
    const res = await clearLeaderboard(ownerSecret, difficulty, level);
    if (res.ok) { setOwnerMsg('Cleared.'); fetchScores(difficulty, level).then(setRows); }
    else setOwnerMsg(res.error || 'Could not clear.');
  }

  return (
    <div className="rr-card">
      <div className="rr-home-head">
        <span className="eyebrow">Leaderboard</span>
        <button type="button" className="rr-link" onClick={onBack}>← Back</button>
      </div>
      <div className="rr-row rr-lb-tabs">
        {DIFFICULTIES.map((d) => (
          <button key={d} type="button" className={`rr-chip-btn ${difficulty === d ? 'on' : ''}`} onClick={() => setDifficulty(d)}>{DIFFICULTY_LABEL[d]}</button>
        ))}
      </div>
      <div className="rr-row rr-lb-tabs">
        {[1, 2, 3].map((l) => (
          <button key={l} type="button" className={`rr-chip-btn ${level === l ? 'on' : ''}`} onClick={() => setLevel(l)}>Level {l}</button>
        ))}
      </div>

      {rows === null && <p style={{ color: 'var(--text3)' }}>Loading…</p>}
      {rows !== null && groups.length === 0 && <p style={{ color: 'var(--text3)' }}>Nobody has solved this one yet — be the first!</p>}

      <div className="rr-lb-list">
        {groups.map((g, i) => (
          <div key={g.steps} className="rr-lb-row">
            <div className="rr-lb-rank">{medal(i) || `#${i + 1}`}</div>
            <div className="rr-lb-name">{g.first.playerName}</div>
            <div className="rr-lb-steps">{g.steps} steps</div>
            <div className="rr-lb-time">{formatTime(g.first.timeMs)}</div>
            {g.othersCount > 0 && (
              <button type="button" className="rr-link rr-lb-others" onClick={() => setExpanded(expanded === g.steps ? null : g.steps)}>
                +{g.othersCount} other{g.othersCount === 1 ? '' : 's'}
              </button>
            )}
            {expanded === g.steps && (
              <div className="rr-lb-expand">
                {g.all.map((p, j) => <div key={j}>{j + 1}. {p.playerName}</div>)}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="rr-owner">
        <button type="button" className="rr-link" onClick={() => setOwnerOpen((o) => !o)}>Owner tools</button>
        {ownerOpen && (
          <div className="rr-row" style={{ marginTop: '8px' }}>
            <input className="rr-input" type="password" placeholder="Admin passcode" value={ownerSecret} onChange={(e) => setOwnerSecret(e.target.value)} style={{ maxWidth: '200px' }} />
            <button type="button" className="btn btn-outline" onClick={doClear}>Clear this leaderboard</button>
            {ownerMsg && <span style={{ color: 'var(--text3)', fontSize: '.8rem' }}>{ownerMsg}</span>}
          </div>
        )}
      </div>
    </div>
  );
}

const ROOT_RUSH_CSS = `
.rr-root { display: flex; flex-direction: column; gap: 16px; }
.rr-card {
  background: var(--rr-bg, var(--bg2)); border: 1px solid var(--border); border-radius: var(--radius);
  padding: 22px 24px; display: flex; flex-direction: column; gap: 14px; transition: background .3s ease;
}
.rr-onboard { max-width: 440px; margin: 0 auto; text-align: center; align-items: center; }
.rr-input {
  width: 100%; padding: 10px 14px; border-radius: 8px; border: 1px solid var(--border2);
  background: var(--rr-bg2, var(--bg2)); color: var(--text); font-family: var(--fb); font-size: .95rem;
}
.rr-hint-text { color: var(--text3); font-size: .78rem; margin: 0; }
.rr-error { color: var(--rose); font-size: .82rem; margin: 0; }
.rr-row { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }
.rr-link { background: none; border: none; color: var(--rr-accent, var(--amber)); font-family: var(--fm); font-size: .76rem; cursor: pointer; padding: 0; text-decoration: underline; }
.rr-home-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; }

.rr-diff-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; }
.rr-diff-tile {
  position: relative; display: flex; flex-direction: column; gap: 6px; padding: 18px 16px; border-radius: 12px;
  border: 1px solid var(--border2); background: var(--bg3); cursor: pointer; text-align: left; min-height: 44px;
}
.rr-diff-tile strong { font-family: var(--fh); font-size: 1.2rem; }
.rr-diff-tile span { font-family: var(--fm); font-size: .72rem; color: var(--text3); }
.rr-diff-easy:hover { border-color: ${THEME.easy.accent}; }
.rr-diff-medium:hover { border-color: ${THEME.medium.accent}; }
.rr-diff-hard:hover { border-color: ${THEME.hard.accent}; }
.rr-badge-new {
  position: absolute; top: -8px; right: 10px; background: ${THEME.hard.accent}; color: #1a0a0d;
  font-family: var(--fm); font-size: .62rem; padding: 3px 8px; border-radius: 20px; font-weight: 700;
}

.rr-theme-easy, .rr-theme-medium, .rr-theme-hard { background: var(--rr-bg); }
.rr-theme-hard { animation: rr-pulse-bg 3s ease-in-out infinite; }
@keyframes rr-pulse-bg { 50% { box-shadow: inset 0 0 60px var(--rr-glow); } }

.rr-topbar { display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; }
.rr-chip { font-family: var(--fm); font-size: .68rem; letter-spacing: .08em; text-transform: uppercase; color: var(--rr-accent); background: var(--rr-accent-dim); padding: 4px 10px; border-radius: 20px; }
.rr-dots { display: flex; gap: 6px; }
.rr-dot { width: 9px; height: 9px; border-radius: 50%; background: var(--border2); }
.rr-dot.on { background: var(--rr-accent); box-shadow: 0 0 8px var(--rr-glow); }
.rr-dot.done { background: var(--rr-accent); opacity: .5; }
.rr-target-badge { font-family: var(--fm); font-size: .76rem; color: var(--text2); }

.rr-display {
  background: var(--rr-bg2); border: 1px solid var(--border2); border-radius: 14px; padding: 28px 16px;
  text-align: center; box-shadow: 0 0 30px var(--rr-glow) inset, 0 0 24px var(--rr-glow);
}
.rr-value { font-family: var(--fm); font-size: clamp(2.4rem, 10vw, 3.4rem); font-weight: 700; color: var(--rr-accent); text-shadow: 0 0 18px var(--rr-glow); }
.rr-fail-flash { animation: rr-shake .4s ease, rr-flash-red .6s ease; }
@keyframes rr-shake { 0%,100%{transform:translateX(0);} 20%{transform:translateX(-8px);} 40%{transform:translateX(8px);} 60%{transform:translateX(-6px);} 80%{transform:translateX(6px);} }
@keyframes rr-flash-red { 0%{background:#ff2d3d;} 100%{background:var(--rr-bg2);} }
.rr-solved-glow { box-shadow: 0 0 40px var(--teal), 0 0 24px var(--teal) inset; }

.rr-meter-wrap { display: flex; align-items: center; gap: 10px; }
.rr-meter { flex: 1; height: 8px; border-radius: 6px; background: var(--bg3); border: 1px solid var(--border); overflow: hidden; }
.rr-meter-fill { height: 100%; background: var(--teal); transition: width .25s ease, background .25s ease; }
.rr-meter.warn .rr-meter-fill { background: var(--amber); }
.rr-meter.over .rr-meter-fill { background: var(--rose); }
.rr-meter-label { font-family: var(--fm); font-size: .68rem; color: var(--text3); white-space: nowrap; }

.rr-trail { font-family: var(--fm); font-size: .8rem; color: var(--text2); display: flex; flex-wrap: wrap; gap: 2px; min-height: 1.4em; }
.rr-trail-arrow { color: var(--text3); }
.rr-note { color: var(--amber); font-size: .82rem; margin: 0; }

.rr-stats-row { display: flex; gap: 18px; flex-wrap: wrap; font-size: .8rem; color: var(--text2); font-family: var(--fm); }

.rr-ops-grid { display: grid; gap: 10px; }
.rr-ops-3 { grid-template-columns: repeat(auto-fit, minmax(84px, 1fr)); }
.rr-ops-4 { grid-template-columns: repeat(4, 1fr); }
@media(max-width: 480px) { .rr-ops-4 { grid-template-columns: repeat(2, 1fr); } }
.rr-op {
  min-height: 56px; border-radius: 14px; border: none; cursor: pointer; font-family: var(--fm); font-weight: 700; font-size: 1.1rem;
  background: var(--op-color); color: #0a0a12; box-shadow: 0 4px 0 rgba(0,0,0,.25); transition: transform .08s ease, box-shadow .08s ease;
}
.rr-op:active { transform: translateY(3px); box-shadow: 0 1px 0 rgba(0,0,0,.25); }

.rr-fail-panel { display: flex; flex-direction: column; align-items: center; gap: 14px; }
.rr-fail-banner { background: #ff2d3d; color: #fff; font-family: var(--fh); font-weight: 700; font-size: 1.2rem; padding: 14px 18px; border-radius: 10px; text-align: center; width: 100%; }

.rr-solved-panel { display: flex; flex-direction: column; align-items: center; gap: 12px; }
.rr-perfect { font-family: var(--fh); font-size: 1.3rem; color: var(--teal); }
.rr-best { font-family: var(--fm); font-size: .9rem; color: var(--text2); }

.rr-hint-box { font-size: .82rem; color: var(--text2); background: var(--bg3); border-left: 3px solid var(--rr-accent); border-radius: 0 8px 8px 0; padding: 10px 14px; }
.rr-back { align-self: center; }

.rr-summary-list { display: flex; flex-direction: column; gap: 8px; }
.rr-summary-row { display: grid; grid-template-columns: auto 1fr auto; gap: 12px; font-family: var(--fm); font-size: .85rem; color: var(--text2); background: var(--bg3); border-radius: 8px; padding: 8px 12px; }

.rr-lb-tabs { margin-bottom: -4px; }
.rr-chip-btn { font-family: var(--fm); font-size: .76rem; padding: 7px 14px; border-radius: 20px; border: 1px solid var(--border2); background: var(--bg3); color: var(--text2); cursor: pointer; min-height: 36px; }
.rr-chip-btn.on { background: var(--amber); border-color: var(--amber); color: var(--bg); font-weight: 700; }
.rr-lb-list { display: flex; flex-direction: column; gap: 8px; }
.rr-lb-row { display: grid; grid-template-columns: 2.4rem 1fr auto auto auto; align-items: center; gap: 10px; background: var(--bg3); border-radius: 10px; padding: 10px 14px; position: relative; }
.rr-lb-rank { font-size: 1.1rem; text-align: center; }
.rr-lb-name { font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.rr-lb-steps { font-family: var(--fm); font-size: .82rem; color: var(--amber); }
.rr-lb-time { font-family: var(--fm); font-size: .76rem; color: var(--text3); }
.rr-lb-others { grid-column: 1 / -1; justify-self: start; }
.rr-lb-expand { grid-column: 1 / -1; font-family: var(--fm); font-size: .76rem; color: var(--text2); display: flex; flex-direction: column; gap: 2px; padding-top: 4px; border-top: 1px dashed var(--border2); margin-top: 4px; }
.rr-owner { margin-top: 8px; padding-top: 10px; border-top: 1px dashed var(--border); }

@media(prefers-reduced-motion: reduce) {
  .rr-fail-flash, .rr-theme-hard, .rr-op { animation: none; }
}
`;
