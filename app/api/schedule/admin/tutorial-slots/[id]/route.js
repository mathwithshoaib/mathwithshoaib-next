// app/api/schedule/admin/tutorial-slots/[id]/route.js
// PATCH -> edit a slot's day/time/location. DELETE -> remove it (cascades,
// dropping any TA's booking in it).

import { cookies } from 'next/headers';
import { readAdminSession } from '../../../../../../lib/scheduleAuth';
import { sbRpc, sbDelete } from '../../../../../../lib/supabaseAdmin';
import { COURSE_CODE } from '../../../../../../lib/scheduleConfig';
import { validateTutorialSlot, rpcErrorMessage } from '../../../../../../lib/scheduleValidate';

export async function PATCH(req, { params }) {
  const cookieStore = await cookies();
  if (!readAdminSession(cookieStore)) {
    return Response.json({ error: 'Admin login required.' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const err = validateTutorialSlot(body);
    if (err) return Response.json({ error: err }, { status: 400 });

    const [result] = await sbRpc('admin_upsert_tutorial_slot', {
      p_id: Number(id),
      p_course: COURSE_CODE,
      p_day: Number(body.day),
      p_start: Number(body.start),
      p_end: Number(body.end),
      p_location: body.location || null,
    });

    if (!result?.ok) {
      return Response.json({ error: rpcErrorMessage(result?.error) }, { status: 409 });
    }
    return Response.json({ ok: true });
  } catch (err) {
    console.error('admin/tutorial-slots PATCH error:', err);
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
    await sbDelete('tutorial_slots', `id=eq.${Number(id)}&course_code=eq.${COURSE_CODE}`);
    return Response.json({ ok: true });
  } catch (err) {
    console.error('admin/tutorial-slots DELETE error:', err);
    return Response.json({ error: 'Server error.' }, { status: 500 });
  }
}
