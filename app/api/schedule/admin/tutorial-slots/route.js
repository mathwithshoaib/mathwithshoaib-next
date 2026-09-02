// app/api/schedule/admin/tutorial-slots/route.js
// POST -> define a new weekly tutorial slot (2 seats, filled later by TAs).

import { cookies } from 'next/headers';
import { readAdminSession } from '../../../../../lib/scheduleAuth';
import { sbRpc } from '../../../../../lib/supabaseAdmin';
import { COURSE_CODE } from '../../../../../lib/scheduleConfig';
import { validateTutorialSlot, rpcErrorMessage } from '../../../../../lib/scheduleValidate';

export async function POST(req) {
  const cookieStore = await cookies();
  if (!readAdminSession(cookieStore)) {
    return Response.json({ error: 'Admin login required.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const err = validateTutorialSlot(body);
    if (err) return Response.json({ error: err }, { status: 400 });

    const [result] = await sbRpc('admin_upsert_tutorial_slot', {
      p_id: null,
      p_course: COURSE_CODE,
      p_day: Number(body.day),
      p_start: Number(body.start),
      p_end: Number(body.end),
      p_location: body.location || null,
    });

    if (!result?.ok) {
      return Response.json({ error: rpcErrorMessage(result?.error) }, { status: 409 });
    }
    return Response.json({ ok: true, id: result.id });
  } catch (err) {
    console.error('admin/tutorial-slots POST error:', err);
    return Response.json({ error: 'Server error.' }, { status: 500 });
  }
}
