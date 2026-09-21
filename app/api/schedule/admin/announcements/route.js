// app/api/schedule/admin/announcements/route.js
// GET  -> full list (active AND inactive/expired) for the admin panel to
//         manage — the public route only ever returns active ones.
// POST -> create a new announcement.

import { cookies } from 'next/headers';
import { readAdminSession } from '../../../../../lib/scheduleAuth';
import { sbSelect, sbInsert } from '../../../../../lib/supabaseAdmin';
import { COURSE_CODE } from '../../../../../lib/scheduleConfig';

const TYPES = ['info', 'warning', 'urgent'];

export async function GET() {
  const cookieStore = await cookies();
  if (!readAdminSession(cookieStore)) {
    return Response.json({ error: 'Admin login required.' }, { status: 401 });
  }

  try {
    const rows = await sbSelect(
      'announcements',
      `course_code=eq.${COURSE_CODE}&select=*&order=pinned.desc,created_at.desc`
    );
    return Response.json({
      announcements: rows.map((a) => ({
        id: a.id, title: a.title, message: a.message, type: a.type, category: a.category,
        deadline: a.deadline, pinned: a.pinned, active: a.active, createdAt: a.created_at,
        linkUrl: a.link_url, linkLabel: a.link_label, showButton: a.show_button,
        showDeadline: a.show_deadline,
      })),
    });
  } catch (err) {
    console.error('admin/announcements GET error:', err);
    return Response.json({ error: 'Server error.' }, { status: 500 });
  }
}

export async function POST(req) {
  const cookieStore = await cookies();
  if (!readAdminSession(cookieStore)) {
    return Response.json({ error: 'Admin login required.' }, { status: 401 });
  }

  try {
    const { title, message, type, category, deadline, pinned, active, linkUrl, linkLabel, showButton, showDeadline } = await req.json();
    if (!title || typeof title !== 'string' || !title.trim()) {
      return Response.json({ error: 'Title is required.' }, { status: 400 });
    }
    if (type !== undefined && !TYPES.includes(type)) {
      return Response.json({ error: 'Invalid type.' }, { status: 400 });
    }

    const [row] = await sbInsert('announcements', {
      course_code: COURSE_CODE,
      title: title.trim(),
      message: message && message.trim() ? message.trim() : null,
      type: type || 'info',
      category: category && category.trim() ? category.trim() : null,
      deadline: deadline || null,
      pinned: !!pinned,
      active: active === undefined ? true : !!active,
      link_url: linkUrl && linkUrl.trim() ? linkUrl.trim() : null,
      link_label: linkLabel && linkLabel.trim() ? linkLabel.trim() : null,
      show_button: !!showButton,
      show_deadline: !!showDeadline,
    });

    return Response.json({ ok: true, id: row.id });
  } catch (err) {
    console.error('admin/announcements POST error:', err);
    return Response.json({ error: 'Server error.' }, { status: 500 });
  }
}
