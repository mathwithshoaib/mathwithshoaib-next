// app/api/schedule/admin/tas/[id]/route.js
// PATCH  -> update a TA's duty settings: officeHoursOnly (can they hold a
//           tutorial seat at all?) and/or ohCapHours (their own weekly
//           office-hours limit, in hours — independent of officeHoursOnly,
//           so e.g. a half TA can be "1 tutorial + 1h OH" just as easily as
//           "4h OH only"). Either or both fields may be sent; existing
//           bookings are untouched either way (lowering someone's cap below
//           what they've already booked doesn't retroactively remove hours —
//           it just blocks booking more until they're under the new cap).
// DELETE -> removes a TA from the roster. This is the "TA who left" path:
// the FK ON DELETE CASCADE on tutorial_bookings/ta_office_hours means their
// tutorial seat and any booked office hours are freed in the same instant.

import { cookies } from 'next/headers';
import { readAdminSession } from '../../../../../../lib/scheduleAuth';
import { sbDelete, sbUpdate } from '../../../../../../lib/supabaseAdmin';
import { COURSE_CODE } from '../../../../../../lib/scheduleConfig';

export async function PATCH(req, { params }) {
  const cookieStore = await cookies();
  if (!readAdminSession(cookieStore)) {
    return Response.json({ error: 'Admin login required.' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const { officeHoursOnly, ohCapHours } = await req.json();
    const patch = {};
    if (officeHoursOnly !== undefined) {
      if (typeof officeHoursOnly !== 'boolean') {
        return Response.json({ error: 'officeHoursOnly must be true/false.' }, { status: 400 });
      }
      patch.office_hours_only = officeHoursOnly;
    }
    if (ohCapHours !== undefined) {
      const cap = Number(ohCapHours);
      if (!Number.isFinite(cap) || cap < 0) {
        return Response.json({ error: 'Weekly OH cap must be a number ≥ 0.' }, { status: 400 });
      }
      patch.oh_cap_hours = cap;
    }
    if (Object.keys(patch).length === 0) {
      return Response.json({ error: 'Nothing to update.' }, { status: 400 });
    }

    const [row] = await sbUpdate('tas', `id=eq.${Number(id)}&course_code=eq.${COURSE_CODE}`, patch);
    if (!row) return Response.json({ error: 'TA not found.' }, { status: 404 });
    return Response.json({ ok: true, id: row.id, officeHoursOnly: row.office_hours_only, ohCapHours: Number(row.oh_cap_hours) });
  } catch (err) {
    console.error('admin/tas PATCH error:', err);
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
    await sbDelete('tas', `id=eq.${Number(id)}&course_code=eq.${COURSE_CODE}`);
    return Response.json({ ok: true });
  } catch (err) {
    console.error('admin/tas DELETE error:', err);
    return Response.json({ error: 'Server error.' }, { status: 500 });
  }
}
