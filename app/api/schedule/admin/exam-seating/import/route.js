// app/api/schedule/admin/exam-seating/import/route.js
// POST { exam, csv } -> bulk-loads a roster for one exam from a CSV file's
// raw text content (the admin panel reads the uploaded file client-side
// and sends its text here — no multipart handling needed). Columns are
// matched by header name (Roll Number / Name / Room / Seat Number, a few
// common wording variants each), not fixed position, and existing rows
// for the same course+exam+roll are overwritten (upsert), so re-uploading
// a corrected sheet is safe to do as many times as needed.

import { cookies } from 'next/headers';
import { readAdminSession } from '../../../../../../lib/scheduleAuth';
import { sbUpsert } from '../../../../../../lib/supabaseAdmin';
import { COURSE_CODE } from '../../../../../../lib/scheduleConfig';

function normalize(s) {
  return (s || '').trim().toUpperCase();
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
    const roomIdx = findCol(headers, ['room']);
    const seatIdx = findCol(headers, ['seat number', 'seat no', 'seat']);

    if ([rollIdx, nameIdx, roomIdx, seatIdx].some((i) => i === -1)) {
      return Response.json({ error: 'Could not find Roll Number / Name / Room / Seat Number columns — check the header row.' }, { status: 400 });
    }

    const payload = [];
    let skipped = 0;
    for (const r of rows.slice(1)) {
      const roll = normalize(r[rollIdx]);
      const name = (r[nameIdx] || '').trim();
      const room = (r[roomIdx] || '').trim();
      const seat = (r[seatIdx] || '').trim();
      if (!roll || !name || !room || !seat) { skipped++; continue; }
      payload.push({
        course_code: COURSE_CODE,
        exam: exam.trim(),
        roll_number: roll,
        student_name: name,
        room,
        seat_number: seat,
      });
    }

    if (payload.length === 0) {
      return Response.json({ error: 'No valid rows found — check every row has Roll Number, Name, Room, and Seat filled in.' }, { status: 400 });
    }

    await sbUpsert('exam_seating', payload, 'course_code,exam,roll_number');

    return Response.json({ ok: true, imported: payload.length, skipped });
  } catch (err) {
    console.error('admin/exam-seating/import error:', err);
    return Response.json({ error: 'Server error.' }, { status: 500 });
  }
}
