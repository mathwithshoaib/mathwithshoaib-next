// app/api/schedule/admin/fixed-events/route.js
// POST -> create a lecture / instructor-office-hour / TF-recitation entry.
// Goes through the admin_upsert_fixed_event() RPC so the "would this push
// any hour over the global cap of 2" check and the insert happen atomically.

import { cookies } from 'next/headers';
import { readAdminSession } from '../../../../../lib/scheduleAuth';
import { sbRpc } from '../../../../../lib/supabaseAdmin';
import { COURSE_CODE } from '../../../../../lib/scheduleConfig';
import { validateFixedEvent, rpcErrorMessage } from '../../../../../lib/scheduleValidate';

export async function POST(req) {
  const cookieStore = await cookies();
  if (!readAdminSession(cookieStore)) {
    return Response.json({ error: 'Admin login required.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const err = validateFixedEvent(body);
    if (err) return Response.json({ error: err }, { status: 400 });

    const [result] = await sbRpc('admin_upsert_fixed_event', {
      p_id: null,
      p_course: COURSE_CODE,
      p_category: body.category,
      p_day: Number(body.day),
      p_start: Number(body.start),
      p_end: Number(body.end),
      p_title: body.title,
      p_person: body.person || null,
      p_location: body.location || null,
    });

    if (!result?.ok) {
      return Response.json({ error: rpcErrorMessage(result?.error) }, { status: 409 });
    }
    return Response.json({ ok: true, id: result.id });
  } catch (err) {
    console.error('admin/fixed-events POST error:', err);
    return Response.json({ error: 'Server error.' }, { status: 500 });
  }
}
