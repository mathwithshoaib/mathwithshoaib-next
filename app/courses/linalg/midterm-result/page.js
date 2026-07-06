// app/midterm-result/page.js
"use client";

import { useState } from "react";

// Flow stages
const STAGE = {
  ID: "id",
  CONFIRM: "confirm",
  QUIZ: "quiz",
  RESULT: "result",
};

export default function MidtermResultPage() {
  const [stage, setStage] = useState(STAGE.ID);
  const [studentId, setStudentId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // lookup result
  const [name, setName] = useState("");
  const [quizzesToAsk, setQuizzesToAsk] = useState([]); // e.g. [2,3]

  // not-found modal
  const [notFound, setNotFound] = useState(false);
  const [gateBlocked, setGateBlocked] = useState(false);

  // quiz answers
  const [quizInputs, setQuizInputs] = useState({}); // { "2": "", "3": "" }
  const [perQuiz, setPerQuiz] = useState({}); // { "2": true, "3": false }
  const [quizError, setQuizError] = useState("");

  // final result
  const [result, setResult] = useState(null);
  const [showBreakdown, setShowBreakdown] = useState(false);

  // --- handlers ---

  function onIdChange(e) {
    const v = e.target.value.replace(/\D/g, "").slice(0, 8); // digits only, max 8
    setStudentId(v);
    setError("");
  }

  async function handleLookup() {
    if (studentId.length !== 8) {
      setError("Please enter exactly 8 digits.");
      return;
    }
    setLoading(true);
    setError("");
    setNotFound(false);
    setGateBlocked(false);
    try {
      const res = await fetch("/api/midterm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "lookup", studentId }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else if (!data.found) {
        setNotFound(true);
      } else if (data.gateBlocked) {
        setName(data.name);
        setGateBlocked(true);
      } else {
        setName(data.name);
        setQuizzesToAsk(data.quizzesToAsk);
        const init = {};
        data.quizzesToAsk.forEach((q) => (init[q] = ""));
        setQuizInputs(init);
        setStage(STAGE.CONFIRM);
      }
    } catch {
      setError("Something went wrong. Try again or contact the TA.");
    } finally {
      setLoading(false);
    }
  }

  function confirmYes() {
    setStage(STAGE.QUIZ);
  }
  function confirmNo() {
    // reset back to start
    setStage(STAGE.ID);
    setStudentId("");
    setName("");
  }

  function onQuizInput(qn, val) {
    const clean = val.replace(/[^\d.]/g, ""); // allow decimals
    setQuizInputs((p) => ({ ...p, [qn]: clean }));
    setQuizError("");
  }

  async function handleVerify() {
    // all fields filled?
    for (const qn of quizzesToAsk) {
      if (String(quizInputs[qn]).trim() === "") {
        setQuizError("Enter marks for all quizzes shown.");
        return;
      }
    }
    setLoading(true);
    setQuizError("");
    try {
      const res = await fetch("/api/midterm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "verify",
          studentId,
          quizAnswers: quizInputs,
        }),
      });
      const data = await res.json();
      if (data.error) {
        setQuizError(data.error);
      } else if (!data.verified) {
        setPerQuiz(data.perQuiz || {});
        setQuizError("Marks did not match. Check the highlighted quiz and try again.");
      } else {
        setPerQuiz(data.perQuiz || {});
        setResult(data);
        setStage(STAGE.RESULT);
      }
    } catch {
      setQuizError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  function resetAll() {
    setStage(STAGE.ID);
    setStudentId("");
    setName("");
    setQuizzesToAsk([]);
    setQuizInputs({});
    setPerQuiz({});
    setResult(null);
    setShowBreakdown(false);
    setNotFound(false);
    setGateBlocked(false);
    setError("");
    setQuizError("");
  }

  const quizLabel = { 1: "Quiz 1", 2: "Quiz 2", 3: "Quiz 3" };

  return (
    <main style={s.page}>
      <div style={s.card}>
        <h1 style={s.h1}>MATH-120 Midterm Result</h1>
        <p style={s.sub}>Linear Algebra with Differential Equations — Summer 2026</p>

        {/* ---------- STAGE: ID ---------- */}
        {stage === STAGE.ID && (
          <div>
            <label style={s.label}>Enter your 8-digit Student ID</label>
            <input
              style={s.input}
              inputMode="numeric"
              placeholder="XXXXXXXX"
              value={studentId}
              onChange={onIdChange}
              onKeyDown={(e) => e.key === "Enter" && handleLookup()}
              maxLength={8}
              autoFocus
            />
            <p style={s.hint}>
              Use the 8-digit format (not 20XX-XX-XXXX).
            </p>
            {error && <p style={s.err}>{error}</p>}
            <button style={s.btn} onClick={handleLookup} disabled={loading}>
              {loading ? "Searching…" : "Find my result"}
            </button>

            {notFound && (
              <div style={s.notice}>
                <p style={s.noticeTitle}>ID not found.</p>
                <p style={s.noticeText}>
                  If your Campus ID was changed, try your <b>old</b> Campus ID —
                  your result may be listed under it. If it still doesn&apos;t
                  work, contact the TA (Shoaib).
                </p>
              </div>
            )}
          </div>
        )}

        {/* ---------- STAGE: CONFIRM ---------- */}
        {stage === STAGE.CONFIRM && (
          <div>
            <p style={s.confirmQ}>Is this you?</p>
            <p style={s.nameBig}>{name}</p>
            <div style={s.row}>
              <button style={s.btnGhost} onClick={confirmNo}>
                No, that&apos;s not me
              </button>
              <button style={s.btn} onClick={confirmYes}>
                Yes, that&apos;s me
              </button>
            </div>
          </div>
        )}

        {/* ---------- STAGE: QUIZ GATE ---------- */}
        {stage === STAGE.QUIZ && (
          <div>
            <p style={s.gateIntro}>
              To confirm it&apos;s you, enter your exact marks for the following
              {quizzesToAsk.length > 1 ? " quizzes" : " quiz"}:
            </p>
            {quizzesToAsk.map((qn) => {
              const status = perQuiz[qn];
              const borderColor =
                status === true
                  ? "#38c9b0"
                  : status === false
                  ? "#e06b6b"
                  : "rgba(255,255,255,0.14)";
              return (
                <div key={qn} style={{ marginBottom: 14 }}>
                  <label style={s.label}>{quizLabel[qn]} marks</label>
                  <input
                    style={{ ...s.input, borderColor }}
                    inputMode="decimal"
                    placeholder="Your marks"
                    value={quizInputs[qn] ?? ""}
                    onChange={(e) => onQuizInput(qn, e.target.value)}
                  />
                </div>
              );
            })}
            {quizError && <p style={s.err}>{quizError}</p>}
            <button style={s.btn} onClick={handleVerify} disabled={loading}>
              {loading ? "Checking…" : "Check"}
            </button>
          </div>
        )}

        {/* ---------- STAGE: RESULT ---------- */}
        {stage === STAGE.RESULT && result && (
          <div>
            <p style={s.resultName}>{result.name}</p>
            <div style={s.scoreBox}>
              <span style={s.scoreLabel}>Total Marks in MIDTERM (out of 55)</span>
              <span style={s.scoreBig}>{result.newTotal}</span>
            </div>

            {result.classStats && (
              <div style={s.stats}>
                <div style={s.statItem}>
                  <span style={s.statLabel}>Class Mean</span>
                  <span style={s.statVal}>{result.classStats.mean}</span>
                </div>
                <div style={s.statItem}>
                  <span style={s.statLabel}>Class SD</span>
                  <span style={s.statVal}>{result.classStats.sd}</span>
                </div>
                <div style={s.statItem}>
                  <span style={s.statLabel}>Students</span>
                  <span style={s.statVal}>{result.classStats.n}</span>
                </div>
              </div>
            )}

            <button
              style={s.btnGhost}
              onClick={() => setShowBreakdown((v) => !v)}
            >
              {showBreakdown ? "Hide breakdown" : "See question-wise breakdown"}
            </button>

            {showBreakdown && (
              <div style={s.breakdown}>
                {[
                  ["MCQs 1–10", result.breakdown.mcq1_10],
                  ["MCQs 11–15", result.breakdown.mcq11_15],
                  ["Question 1", result.breakdown.q1],
                  ["Question 2", result.breakdown.q2],
                  ["Question 3", result.breakdown.q3],
                  ["Question 4", result.breakdown.q4],
                  ["Total", result.breakdown.total],
                  ["ICPs", result.breakdown.icps],
                  ["New Total (out of 55)", result.breakdown.newTotal],
                ].map(([label, val], i, arr) => (
                  <div
                    key={label}
                    style={{
                      ...s.bRow,
                      ...(i >= arr.length - 3 ? s.bRowEmph : {}),
                      borderBottom:
                        i === arr.length - 1
                          ? "none"
                          : "1px solid rgba(255,255,255,0.07)",
                    }}
                  >
                    <span>{label}</span>
                    <span style={s.bVal}>{val}</span>
                  </div>
                ))}
              </div>
            )}

            <button style={{ ...s.btn, marginTop: 20 }} onClick={resetAll}>
              Check another ID
            </button>
          </div>
        )}

        {/* ---------- gate blocked (no quiz marks) ---------- */}
        {gateBlocked && stage === STAGE.ID && (
          <div style={s.notice}>
            <p style={s.noticeTitle}>Found: {name}</p>
            <p style={s.noticeText}>
              We can&apos;t verify your identity automatically because there are
              no quiz marks on record for you. Please contact the TA (Shoaib) to
              get your result.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

// --- styles (matches site tokens: navy bg, amber, teal, Cormorant/DM Sans) ---
const s = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
    background: "#181f2e",
    color: "#e8e2d8",
    fontFamily: "'DM Sans', system-ui, sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: 460,
    background: "#1e2840",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 14,
    padding: "36px 32px",
    boxShadow: "0 16px 56px rgba(0,0,0,0.45)",
  },
  h1: {
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: 30,
    fontWeight: 600,
    marginBottom: 4,
    color: "#f5ede0",
  },
  sub: { fontSize: 13, color: "#a8b0c0", marginBottom: 28 },
  label: {
    display: "block",
    fontSize: 13,
    color: "#a8b0c0",
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  input: {
    width: "100%",
    padding: "13px 15px",
    fontSize: 18,
    letterSpacing: 2,
    fontFamily: "'DM Mono', monospace",
    background: "#243050",
    border: "1px solid rgba(255,255,255,0.14)",
    borderRadius: 10,
    color: "#f5ede0",
    outline: "none",
  },
  hint: { fontSize: 12, color: "#5a6478", marginTop: 8 },
  err: { fontSize: 13, color: "#e06b6b", marginTop: 10 },
  btn: {
    width: "100%",
    marginTop: 18,
    padding: "13px",
    fontSize: 15,
    fontWeight: 500,
    background: "#e8a020",
    color: "#181f2e",
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
  },
  btnGhost: {
    width: "100%",
    marginTop: 12,
    padding: "12px",
    fontSize: 14,
    fontWeight: 500,
    background: "transparent",
    color: "#e8a020",
    border: "1px solid #d4901a",
    borderRadius: 10,
    cursor: "pointer",
  },
  row: { display: "flex", gap: 12, marginTop: 20 },
  notice: {
    marginTop: 22,
    padding: "16px 18px",
    background: "rgba(232,160,32,0.12)",
    border: "1px solid #d4901a",
    borderRadius: 10,
  },
  noticeTitle: { fontWeight: 600, marginBottom: 6, color: "#f5ede0" },
  noticeText: { fontSize: 13.5, color: "#e8e2d8", lineHeight: 1.6, margin: 0 },
  confirmQ: { fontSize: 15, color: "#a8b0c0", marginBottom: 8 },
  nameBig: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 26,
    fontWeight: 600,
    color: "#f5ede0",
    marginBottom: 4,
  },
  gateIntro: { fontSize: 14.5, color: "#a8b0c0", marginBottom: 20, lineHeight: 1.6 },
  resultName: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 24,
    fontWeight: 600,
    color: "#f5ede0",
    marginBottom: 16,
  },
  scoreBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "24px",
    background: "rgba(56,201,176,0.10)",
    border: "1px solid #38c9b0",
    borderRadius: 12,
    marginBottom: 20,
  },
  scoreLabel: { fontSize: 12.5, color: "#a8b0c0", marginBottom: 6, textAlign: "center" },
  scoreBig: {
    fontSize: 48,
    fontWeight: 700,
    color: "#38c9b0",
    fontFamily: "'Cormorant Garamond', serif",
    lineHeight: 1,
  },
  stats: {
    display: "flex",
    justifyContent: "space-around",
    padding: "16px 0",
    marginBottom: 8,
    borderTop: "1px solid rgba(255,255,255,0.07)",
    borderBottom: "1px solid rgba(255,255,255,0.07)",
  },
  statItem: { display: "flex", flexDirection: "column", alignItems: "center" },
  statLabel: { fontSize: 11.5, color: "#5a6478", marginBottom: 4 },
  statVal: { fontSize: 20, fontWeight: 600, color: "#e8e2d8", fontFamily: "'DM Mono', monospace" },
  breakdown: {
    marginTop: 14,
    background: "#243050",
    borderRadius: 10,
    padding: "6px 16px",
  },
  bRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "11px 0",
    fontSize: 14,
    color: "#a8b0c0",
  },
  bRowEmph: { color: "#f5ede0", fontWeight: 600 },
  bVal: { fontFamily: "'DM Mono', monospace", color: "#e8e2d8" },
};