// app/api/schedule/admin/exam-seating/import/route.js
// POST { exam, csv } -> bulk-loads a roster for one exam from a CSV file's
// raw text content (the admin panel reads the uploaded file client-side
// and sends its text here — no multipart handling needed). Columns are
// matched by header name (Name / ID / Section / Venue / Seat Number, a
// few common wording variants each — a leading "Number" column is simply
// ignored), not fixed position, and existing rows for the same
// course+exam+roll are overwritten (upsert), so re-uploading a corrected
// sheet is safe to do as many times as needed.
//
// The roster's "Name" column comes as "Actual Name, 26100123" (name and
// ID comma-joined) even though there's also a separate clean ID column —
// only the part before the comma is kept as the display name.

import { cookies } from 'next/headers';
import { readAdminSession } from '../../../../../../lib/scheduleAuth';
import { sbSelect, sbUpsert } from '../../../../../../lib/supabaseAdmin';
import { COURSE_CODE } from '../../../../../../lib/scheduleConfig';

// LUMS IDs are 8 digits, but students sometimes type/paste them dashed
// like "2026-01-0123" — strip everything but digits and, if that leaves
// the dashed form's 10 digits, drop the redundant leading "20" so both
// forms normalize to the same 8-digit key. Also restores a lone leading
// zero that Excel's numeric auto-formatting sometimes drops.
function normalizeId(s) {
  let digits = (s || '').replace(/\D/g, '');
  if (digits.length === 10 && digits.startsWith('20')) digits = digits.slice(2);
  if (digits.length === 7) digits = '0' + digits;
  return digits;
}

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
      return Response.json({ error: 'Pick which exam this roster is for.' }, { status: 400 });
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
    const seatIdx = findCol(headers, ['seat number', 'seat no', 'seat']);

    if ([rollIdx, nameIdx, sectionIdx, venueIdx, seatIdx].some((i) => i === -1)) {
      return Response.json({ error: 'Could not find Name / ID / Section / Venue / Seat Number columns — check the header row.' }, { status: 400 });
    }

    // De-dupe rows sharing the same ID within the file itself (keeping the
    // last occurrence, same as how the upsert below would resolve it) so
    // the counts reported back distinguish "already in the file twice"
    // from "already in the database from a previous import".
    const byRoll = new Map();
    let skipped = 0;
    let duplicateInFile = 0;
    for (const r of rows.slice(1)) {
      const roll = normalizeId(r[rollIdx]);
      const nameRaw = (r[nameIdx] || '').trim();
      const name = nameRaw.includes(',') ? nameRaw.split(',')[0].trim() : nameRaw;
      const section = (r[sectionIdx] || '').trim();
      const venue = (r[venueIdx] || '').trim();
      const seat = (r[seatIdx] || '').trim();
      if (!roll || !name || !section || !venue || !seat) { skipped++; continue; }
      if (byRoll.has(roll)) duplicateInFile++;
      byRoll.set(roll, {
        course_code: COURSE_CODE,
        exam: exam.trim(),
        roll_number: roll,
        student_name: name,
        section,
        venue,
        seat_number: seat,
      });
    }
    const payload = [...byRoll.values()];

    if (payload.length === 0) {
      return Response.json({ error: 'No valid rows found — check every row has Name, ID, Section, Venue, and Seat filled in.' }, { status: 400 });
    }

    // Which of these IDs were already loaded for this exam (from an
    // earlier import) vs. genuinely new, so the admin gets an
    // added/updated breakdown instead of just one combined "imported" count.
    const existingRows = await sbSelect(
      'exam_seating',
      `course_code=eq.${COURSE_CODE}&exam=eq.${encodeURIComponent(exam.trim())}&select=roll_number`
    );
    const existingRolls = new Set(existingRows.map((r) => r.roll_number));
    const added = payload.filter((p) => !existingRolls.has(p.roll_number)).length;
    const updated = payload.length - added;

    await sbUpsert('exam_seating', payload, 'course_code,exam,roll_number');

    return Response.json({ ok: true, imported: payload.length, added, updated, duplicateInFile, skipped });
  } catch (err) {
    console.error('admin/exam-seating/import error:', err);
    return Response.json({ error: 'Server error.' }, { status: 500 });
  }
}
