// app/api/schedule/admin/settings/route.js
// PATCH { startHour, endHour } -> updates the grid's displayed hour range.

import { cookies } from 'next/headers';
import { readAdminSession } from '../../../../../lib/scheduleAuth';
import { sbUpdate } from '../../../../../lib/supabaseAdmin';
import { COURSE_CODE } from '../../../../../lib/scheduleConfig';

export async function PATCH(req) {
  const cookieStore = await cookies();
  if (!readAdminSession(cookieStore)) {
    return Response.json({ error: 'Admin login required.' }, { status: 401 });
  }

  try {
    const { startHour, endHour } = await req.json();
    const start = Number(startHour), end = Number(endHour);
    if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) {
      return Response.json({ error: 'End hour must be after start hour.' }, { status: 400 });
    }

    const rows = await sbUpdate('schedule_settings', `course_code=eq.${COURSE_CODE}`, {
      start_hour: start,
      end_hour: end,
      updated_at: new Date().toISOString(),
    });
    if (!rows?.length) {
      return Response.json({ error: 'Settings row not found — re-run the schema migration.' }, { status: 500 });
    }
    return Response.json({ ok: true });
  } catch (err) {
    console.error('admin/settings error:', err);
    return Response.json({ error: 'Server error.' }, { status: 500 });
  }
}
