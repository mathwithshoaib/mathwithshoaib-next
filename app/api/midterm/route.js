// app/api/midterm/route.js
//
// Server-side only. The service-account key never reaches the browser.
// This route does three separate jobs depending on the "action" field:
//   1. "lookup"  -> find a student by 8-digit ID, return name + which quizzes to ask (NO marks)
//   2. "verify"  -> check submitted quiz marks against the sheet, return result ONLY if they match
//
// The whole sheet is read on the server. The client only ever receives:
//   - on lookup: the student's name + a list of quiz numbers to ask for (never the answers)
//   - on verify (success): that ONE student's result + class mean/sd
// The full gradebook is never sent to the browser.

import { google } from "googleapis";

const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const SA_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
// Vercel stores the private key with literal \n; convert back to real newlines.
const SA_KEY = (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n");

const RANGE = "Sheet1!A2:M86"; // data rows only, headers are row 1

// Column index map (0-based within the A:M range)
const COL = {
  NAME: 0,   // A
  Q1: 1,     // B  Quiz 1
  Q2: 2,     // C  Quiz 2
  Q3: 3,     // D  Quiz 3
  MCQ1: 4,   // E  MCQs 1-10
  MCQ2: 5,   // F  MCQs 11-15
  QN1: 6,    // G  Q1
  QN2: 7,    // H  Q2
  QN3: 8,    // I  Q3
  QN4: 9,    // J  Q4
  TOTAL: 10, // K  Total
  ICP: 11,   // L  ICPs
  NEWTOTAL: 12, // M  New Total  <- the out-of-55 midterm mark
};

// ---- helpers ----

// Pull every 8-digit number out of a cell (handles "Name, id" and "Name, id,id"
// and inconsistent spacing). Robust to separator style.
function parseIds(cell) {
  const s = String(cell || "");
  const matches = s.match(/\b\d{8}\b/g);
  return matches || [];
}

// Name = text before the first 8-digit id.
function parseName(cell) {
  const s = String(cell || "");
  const m = s.match(/\d{8}/);
  if (!m) return s.trim();
  return s.slice(0, m.index).replace(/[,\s]+$/, "").trim();
}

// Treat "", "-", null, "0", 0 as "no mark for this quiz".
function isNonZero(v) {
  if (v === null || v === undefined) return false;
  const t = String(v).trim();
  if (t === "" || t === "-") return false;
  const n = Number(t);
  if (Number.isNaN(n)) return false;
  return n !== 0;
}

function toNum(v) {
  const t = String(v ?? "").trim();
  if (t === "" || t === "-") return null;
  const n = Number(t);
  return Number.isNaN(n) ? null : n;
}

// Compare submitted mark to sheet mark tolerantly (so "40" matches "40.0", "40" matches 40).
function marksMatch(submitted, actual) {
  const a = Number(String(submitted).trim());
  const b = Number(String(actual).trim());
  if (Number.isNaN(a) || Number.isNaN(b)) return false;
  return Math.abs(a - b) < 0.001;
}

async function getRows() {
  const auth = new google.auth.JWT({
    email: SA_EMAIL,
    key: SA_KEY,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
  const sheets = google.sheets({ version: "v4", auth });
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: RANGE,
  });
  return res.data.values || [];
}

function findRowById(rows, id) {
  for (let i = 0; i < rows.length; i++) {
    const ids = parseIds(rows[i][COL.NAME]);
    if (ids.includes(id)) return { index: i, row: rows[i] };
  }
  return null;
}

function classStats(rows) {
  const nums = [];
  for (const r of rows) {
    const v = toNum(r[COL.NEWTOTAL]);
    if (v !== null) nums.push(v);
  }
  if (nums.length === 0) return null;
  const n = nums.length;
  const mean = nums.reduce((a, b) => a + b, 0) / n;
  const variance = nums.reduce((a, b) => a + (b - mean) ** 2, 0) / n; // population
  const sd = Math.sqrt(variance);
  return { n, mean: Math.round(mean * 100) / 100, sd: Math.round(sd * 100) / 100 };
}

// Which quiz numbers does this student have a non-zero mark for?
function answeredQuizzes(row) {
  const out = [];
  if (isNonZero(row[COL.Q1])) out.push(1);
  if (isNonZero(row[COL.Q2])) out.push(2);
  if (isNonZero(row[COL.Q3])) out.push(3);
  return out;
}

// pick up to 2 quizzes to ask about
function pickQuizzesToAsk(answered) {
  if (answered.length >= 2) {
    // pick 2 at random
    const shuffled = [...answered].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 2);
  }
  return answered; // 1 or 0
}

// ---- route ----

export async function POST(req) {
  try {
    if (!SHEET_ID || !SA_EMAIL || !SA_KEY) {
      return Response.json(
        { error: "Server not configured. Contact the TA." },
        { status: 500 }
      );
    }

    const body = await req.json();
    const action = body.action;

    // -------- ACTION 1: lookup --------
    if (action === "lookup") {
      const id = String(body.studentId || "").trim();
      if (!/^\d{8}$/.test(id)) {
        return Response.json({ error: "ID must be exactly 8 digits." }, { status: 400 });
      }

      const rows = await getRows();
      const found = findRowById(rows, id);
      if (!found) {
        return Response.json({ found: false });
      }

      const name = parseName(found.row[COL.NAME]);
      const answered = answeredQuizzes(found.row);

      if (answered.length === 0) {
        // No quiz marks to gate with. Secure fallback: block, tell them to contact TA.
        return Response.json({
          found: true,
          gateBlocked: true,
          name,
        });
      }

      const quizzesToAsk = pickQuizzesToAsk(answered);

      // Return name + which quizzes to ask. NEVER return the marks.
      return Response.json({
        found: true,
        name,
        rowIndex: found.index, // opaque-ish; still verified server-side on next call
        studentId: id,
        quizzesToAsk, // e.g. [2,3] or [1]
      });
    }

    // -------- ACTION 2: verify --------
    if (action === "verify") {
      const id = String(body.studentId || "").trim();
      if (!/^\d{8}$/.test(id)) {
        return Response.json({ error: "Bad request." }, { status: 400 });
      }
      // body.quizAnswers: { "2": "18", "3": "20" }  (quizNum -> submitted mark)
      const quizAnswers = body.quizAnswers || {};

      const rows = await getRows();
      const found = findRowById(rows, id);
      if (!found) {
        return Response.json({ error: "Not found." }, { status: 404 });
      }
      const row = found.row;

      const quizCol = { 1: COL.Q1, 2: COL.Q2, 3: COL.Q3 };
      const perQuiz = {}; // quizNum -> boolean
      let allMatch = true;
      const askedNums = Object.keys(quizAnswers);

      if (askedNums.length === 0) {
        return Response.json({ error: "No answers submitted." }, { status: 400 });
      }

      for (const qn of askedNums) {
        const actual = row[quizCol[qn]];
        const ok = marksMatch(quizAnswers[qn], actual);
        perQuiz[qn] = ok;
        if (!ok) allMatch = false;
      }

      if (!allMatch) {
        // Tell them which were wrong (green/red on client) but reveal nothing else.
        return Response.json({ verified: false, perQuiz });
      }

      // Passed the gate. Build the result payload for THIS student only.
      const stats = classStats(rows);
      const num = (i) => {
        const v = toNum(row[i]);
        return v === null ? "-" : v;
      };

      return Response.json({
        verified: true,
        perQuiz,
        name: parseName(row[COL.NAME]),
        newTotal: num(COL.NEWTOTAL), // out of 55
        breakdown: {
          mcq1_10: num(COL.MCQ1),
          mcq11_15: num(COL.MCQ2),
          q1: num(COL.QN1),
          q2: num(COL.QN2),
          q3: num(COL.QN3),
          q4: num(COL.QN4),
          total: num(COL.TOTAL),
          icps: num(COL.ICP),
          newTotal: num(COL.NEWTOTAL),
        },
        classStats: stats, // { n, mean, sd }
      });
    }

    return Response.json({ error: "Unknown action." }, { status: 400 });
  } catch (err) {
    console.error("midterm route error:", err);
    return Response.json({ error: "Server error. Contact the TA." }, { status: 500 });
  }
}