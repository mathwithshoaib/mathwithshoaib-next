// app/api/schedule/admin/staff/[id]/route.js
// PATCH { name, email, office } -> edit. DELETE -> remove from the roster.
// Existing fixed_events keep whatever text they already stored for "person"
// (they're not a live reference) — only new/re-saved entries pick up a
// rename, which is a deliberate simplicity trade-off (see admin panel notes).

import { cookies } from 'next/headers';
import { readAdminSession } from '../../../../../../lib/scheduleAuth';
import { sbUpdate, sbDelete } from '../../../../../../lib/supabaseAdmin';
import { COURSE_CODE } from '../../../../../../lib/scheduleConfig';

export async function PATCH(req, { params }) {
  const cookieStore = await cookies();
  if (!readAdminSession(cookieStore)) {
    return Response.json({ error: 'Admin login required.' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const { name, email, office } = await req.json();
    if (!name || typeof name !== 'string' || !name.trim()) {
      return Response.json({ error: 'Name is required.' }, { status: 400 });
    }

    const rows = await sbUpdate('course_staff', `id=eq.${Number(id)}&course_code=eq.${COURSE_CODE}`, {
      name: name.trim(),
      email: email || null,
      office: office || null,
    });
    if (!rows?.length) return Response.json({ error: 'Not found.' }, { status: 404 });
    return Response.json({ ok: true });
  } catch (err) {
    console.error('admin/staff PATCH error:', err);
    return Response.json({ error: 'Server error.' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const cookieStore = await cookies();
  if (!readAdminSession(cookieStore)) {
    return Response.json({ error: 'Admin login required.' }, { status: 401 });
  }

  try {
    const { id } = await params;
    await sbDelete('course_staff', `id=eq.${Number(id)}&course_code=eq.${COURSE_CODE}`);
    return Response.json({ ok: true });
  } catch (err) {
    console.error('admin/staff DELETE error:', err);
    return Response.json({ error: 'Server error.' }, { status: 500 });
  }
}
