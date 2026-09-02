// app/api/schedule/state/route.js
//
// Public read endpoint — everything the schedule grid needs, polled every
// few seconds. Returns names only (never passcodes/hashes). No auth
// required to READ; every WRITE lives behind its own admin/TA-gated route.

import { sbSelect } from '../../../../lib/supabaseAdmin';
import { COURSE_CODE } from '../../../../lib/scheduleConfig';

const num = (v) => (v === null || v === undefined ? v : Number(v));

export async function GET() {
  try {
    const courseFilter = `course_code=eq.${COURSE_CODE}`;

    const [settingsRows, fixedEvents, tutorialSlots, taOfficeHours, tas] = await Promise.all([
      sbSelect('schedule_settings', `${courseFilter}&select=start_hour,end_hour`),
      sbSelect('fixed_events', `${courseFilter}&select=*&order=day_of_week.asc,start_hour.asc`),
      sbSelect(
        'tutorial_slots',
        `${courseFilter}&select=*,tutorial_bookings(seat_no,ta_id,tas(name))&order=day_of_week.asc,start_hour.asc`
      ),
      sbSelect('ta_office_hours', `${courseFilter}&select=id,ta_id,day_of_week,hour,tas(name)`),
      sbSelect('tas', `${courseFilter}&select=id,name&order=name.asc`),
    ]);

    const settings = settingsRows?.[0]
      ? { startHour: num(settingsRows[0].start_hour), endHour: num(settingsRows[0].end_hour) }
      : { startHour: 8, endHour: 19 };

    return Response.json({
      courseCode: COURSE_CODE,
      settings,
      fixedEvents: fixedEvents.map((e) => ({
        id: e.id,
        category: e.category,
        day: e.day_of_week,
        start: num(e.start_hour),
        end: num(e.end_hour),
        title: e.title,
        person: e.person_name,
        location: e.location,
      })),
      tutorialSlots: tutorialSlots.map((s) => ({
        id: s.id,
        day: s.day_of_week,
        start: num(s.start_hour),
        end: num(s.end_hour),
        location: s.location,
        seats: [1, 2].map((seatNo) => {
          const booking = (s.tutorial_bookings || []).find((b) => b.seat_no === seatNo);
          return booking ? { taId: booking.ta_id, taName: booking.tas?.name || 'TA' } : null;
        }),
      })),
      taOfficeHours: taOfficeHours.map((o) => ({
        id: o.id,
        taId: o.ta_id,
        taName: o.tas?.name || 'TA',
        day: o.day_of_week,
        hour: o.hour,
      })),
      tas: tas.map((t) => ({ id: t.id, name: t.name })),
    });
  } catch (err) {
    console.error('schedule/state error:', err);
    return Response.json({ error: 'Server error loading the schedule.' }, { status: 500 });
  }
}
