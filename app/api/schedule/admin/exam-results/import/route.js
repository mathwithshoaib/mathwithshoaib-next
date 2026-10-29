// app/api/schedule/admin/exam-results/import/route.js
// POST { exam, csv } -> bulk-loads a results sheet for one exam. Columns
// matched by header name (Name / ID / Section / Venue / MCQs Marks /
// Question 2-4 / Bonus / Bonus Total / Total — a leading "Number" column
// and "Seat No." are both ignored, not needed for results), and existing
// rows for the same course+exam+roll are overwritten (upsert), so
// re-uploading a corrected sheet is safe to do as many times as needed.
//
// Reports a real diff, not just "existed before vs. new": each row is
// compared field-by-field against whatever was already in the database
// (added / changed / unchanged), since a plain upsert-count can't tell a
// contestation-driven correction apart from re-saving identical marks.
// Rows that got skipped (missing a required field) are named individually
// — roll/name as typed and which field was missing — rather than left as
// a bare count, so a bad row in the sheet doesn't silently vanish.
//
// Same "Name, 26100123" comma-joined format as the seating roster — only
// the part before the comma is kept as the display name.

import { cookies } from 'next/headers';
import { readAdminSession } from '../../../../../../lib/scheduleAuth';
import { sbSelect, sbUpsert } from '../../../../../../lib/supabaseAdmin';
import { COURSE_CODE } from '../../../../../../lib/scheduleConfig';
import { normalizeId } from '../../../../../../lib/examResultsAuth';

// Minimal CSV parser — handles quoted fields (with embedded commas/quotes)
// and both \n and \r\n line endings. No dependency needed for this.
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ',') {
      row.push(field); field = '';
    } else if (c === '\n') {
      row.push(field); rows.push(row); row = []; field = '';
    } else if (c === '\r') {
      // ignore — the following \n (if any) ends the row
    } else {
      field += c;
    }
  }
  if (field.length > 0 || row.length > 0) { row.push(field); rows.push(row); }
  return rows.filter((r) => r.some((cell) => cell.trim() !== ''));
}

function findCol(headers, candidates) {
  const norm = headers.map((h) => h.trim().toLowerCase());
  for (const cand of candidates) {
    const idx = norm.findIndex((h) => h === cand);
    if (idx !== -1) return idx;
  }
  for (const cand of candidates) {
    const idx = norm.findIndex((h) => h.includes(cand));
    if (idx !== -1) return idx;
  }
  return -1;
}

export async function POST(req) {
  const cookieStore = await cookies();
  if (!readAdminSession(cookieStore)) {
    return Response.json({ error: 'Admin login required.' }, { status: 401 });
  }

  try {
    const { exam, csv } = await req.json();
    if (!exam || !exam.trim()) {
      return Response.json({ error: 'Pick which exam this results sheet is for.' }, { status: 400 });
    }
    if (!csv || typeof csv !== 'string') {
      return Response.json({ error: 'No file content received.' }, { status: 400 });
    }

    const rows = parseCsv(csv);
    if (rows.length < 2) {
      return Response.json({ error: 'That file has no data rows.' }, { status: 400 });
    }

    const headers = rows[0];
    const rollIdx = findCol(headers, ['roll number', 'roll no', 'roll', 'campus id', 'student id', 'id']);
    const nameIdx = findCol(headers, ['name', 'student name', 'full name']);
    const sectionIdx = findCol(headers, ['section']);
    const venueIdx = findCol(headers, ['venue', 'room']);
    const mcqsIdx = findCol(headers, ['mcqs marks', 'mcq marks', 'mcqs']);
    const q2Idx = findCol(headers, ['question 2', 'q2']);
    const q3Idx = findCol(headers, ['question 3', 'q3']);
    const q4Idx = findCol(headers, ['question 4', 'q4']);
    const totalIdx = findCol(headers, ['total marks', 'grand total', 'total']);

    if ([rollIdx, nameIdx, sectionIdx, venueIdx, totalIdx].some((i) => i === -1)) {
      return Response.json({ error: 'Could not find Name / ID / Section / Venue / Total columns — check the header row.' }, { status: 400 });
    }

    // "Bonus" and "Bonus Total" are two different columns — resolve them
    // independently rather than via the shared findCol helper above, since
    // "bonus" is a substring of "bonus total" and would otherwise collide.
    const plainBonusIdx = headers.findIndex((h) => h.trim().toLowerCase() === 'bonus');
    const bonusTotalColIdx = headers.findIndex((h) => h.trim().toLowerCase() === 'bonus total');

    const byRoll = new Map();
    const skippedRows = [];
    let duplicateInFile = 0;
    rows.slice(1).forEach((r, i) => {
      const fileRow = i + 2; // +1 for the header row, +1 for 1-based numbering
      const roll = normalizeId(r[rollIdx]);
      const nameRaw = (r[nameIdx] || '').trim();
      const name = nameRaw.includes(',') ? nameRaw.split(',')[0].trim() : nameRaw;
      const section = (r[sectionIdx] || '').trim();
      const venue = (r[venueIdx] || '').trim();
      const total = (r[totalIdx] || '').trim();
      if (!roll || !name || !section || !venue || !total) {
        const missing = [];
        if (!roll) missing.push('ID');
        if (!name) missing.push('Name');
        if (!section) missing.push('Section');
        if (!venue) missing.push('Venue');
        if (!total) missing.push('Total');
        skippedRows.push({ row: fileRow, roll: r[rollIdx] || '', name: nameRaw || '', missing: missing.join(', ') });
        return;
      }
      if (byRoll.has(roll)) duplicateInFile++;
      byRoll.set(roll, {
        course_code: COURSE_CODE,
        exam: exam.trim(),
        roll_number: roll,
        student_name: name,
        section,
        venue,
        mcqs_marks: mcqsIdx !== -1 ? (r[mcqsIdx] || '').trim() || null : null,
        q2: q2Idx !== -1 ? (r[q2Idx] || '').trim() || null : null,
        q3: q3Idx !== -1 ? (r[q3Idx] || '').trim() || null : null,
        q4: q4Idx !== -1 ? (r[q4Idx] || '').trim() || null : null,
        bonus: plainBonusIdx !== -1 ? (r[plainBonusIdx] || '').trim() || null : null,
        bonus_total: bonusTotalColIdx !== -1 ? (r[bonusTotalColIdx] || '').trim() || null : null,
        total,
      });
    });
    const payload = [...byRoll.values()];

    if (payload.length === 0) {
      return Response.json({ error: 'No valid rows found — check every row has Name, ID, Section, Venue, and Total filled in.' }, { status: 400 });
    }

    const existingRows = await sbSelect(
      'exam_results',
      `course_code=eq.${COURSE_CODE}&exam=eq.${encodeURIComponent(exam.trim())}&select=roll_number,student_name,section,venue,mcqs_marks,q2,q3,q4,bonus,bonus_total,total`
    );
    const existingByRoll = new Map(existingRows.map((r) => [r.roll_number, r]));

    const FIELDS = ['student_name', 'section', 'venue', 'mcqs_marks', 'q2', 'q3', 'q4', 'bonus', 'bonus_total', 'total'];
    let added = 0;
    let changed = 0;
    let unchanged = 0;
    for (const p of payload) {
      const existing = existingByRoll.get(p.roll_number);
      if (!existing) { added++; continue; }
      const differs = FIELDS.some((f) => (existing[f] ?? null) !== (p[f] ?? null));
      if (differs) changed++; else unchanged++;
    }

    await sbUpsert('exam_results', payload, 'course_code,exam,roll_number');

    return Response.json({
      ok: true, imported: payload.length, added, changed, unchanged, duplicateInFile,
      skipped: skippedRows.length, skippedRows,
    });
  } catch (err) {
    console.error('admin/exam-results/import error:', err);
    return Response.json({ error: 'Server error.' }, { status: 500 });
  }
}
