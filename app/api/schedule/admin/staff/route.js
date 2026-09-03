// app/api/schedule/admin/staff/route.js
// POST { role: 'instructor'|'tf', name, email, office } -> add someone to the
// roster. This is the single list the course page's Teaching Team section
// and the fixed-events "Person" dropdown both read from.

import { cookies } from 'next/headers';
import { readAdminSession } from '../../../../../lib/scheduleAuth';
import { sbInsert } from '../../../../../lib/supabaseAdmin';
import { COURSE_CODE } from '../../../../../lib/scheduleConfig';

export async function POST(req) {
  const cookieStore = await cookies();
  if (!readAdminSession(cookieStore)) {
    return Response.json({ error: 'Admin login required.' }, { status: 401 });
  }

  try {
    const { role, name, email, office } = await req.json();
    if (role !== 'instructor' && role !== 'tf') {
      return Response.json({ error: 'Role must be instructor or tf.' }, { status: 400 });
    }
    if (!name || typeof name !== 'string' || !name.trim()) {
      return Response.json({ error: 'Name is required.' }, { status: 400 });
    }

    const [row] = await sbInsert('course_staff', {
      course_code: COURSE_CODE,
      role,
      name: name.trim(),
      email: email || null,
      office: office || null,
    });

    return Response.json({ ok: true, id: row.id });
  } catch (err) {
    console.error('admin/staff POST error:', err);
    return Response.json({ error: 'Server error.' }, { status: 500 });
  }
}
