// app/api/schedule/announcements/route.js
//
// Public read endpoint for student-facing announcements — no auth required.
// Only returns rows the admin has marked active; expired (deadline already
// passed) ones are filtered out client-side using the visitor's own clock,
// so the "time left" countdown and the filtering always agree.

import { sbSelect } from '../../../../lib/supabaseAdmin';
import { COURSE_CODE } from '../../../../lib/scheduleConfig';

export async function GET() {
  try {
    const rows = await sbSelect(
      'announcements',
      `course_code=eq.${COURSE_CODE}&active=eq.true&select=id,title,message,type,category,deadline,pinned,created_at,link_url,link_label,show_button&order=pinned.desc,created_at.desc`
    );

    return Response.json({
      announcements: rows.map((a) => ({
        id: a.id,
        title: a.title,
        message: a.message,
        type: a.type,
        category: a.category,
        deadline: a.deadline,
        pinned: a.pinned,
        createdAt: a.created_at,
        linkUrl: a.link_url,
        linkLabel: a.link_label,
        showButton: a.show_button,
      })),
    });
  } catch (err) {
    console.error('schedule/announcements error:', err);
    return Response.json({ announcements: [] });
  }
}
