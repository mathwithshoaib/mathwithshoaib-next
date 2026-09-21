// app/api/schedule/admin/announcements/[id]/route.js
// PATCH  -> update any subset of fields (title, message, type, deadline,
//           pinned, active). `active: false` is how you hide one without
//           deleting it (e.g. an old midterm reminder kept for reference).
// DELETE -> removes it permanently.

import { cookies } from 'next/headers';
import { readAdminSession } from '../../../../../../lib/scheduleAuth';
import { sbUpdate, sbDelete } from '../../../../../../lib/supabaseAdmin';
import { COURSE_CODE } from '../../../../../../lib/scheduleConfig';

const TYPES = ['info', 'warning', 'urgent'];

export async function PATCH(req, { params }) {
  const cookieStore = await cookies();
  if (!readAdminSession(cookieStore)) {
    return Response.json({ error: 'Admin login required.' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const { title, message, type, category, deadline, pinned, active, linkUrl, linkLabel, showButton, showDeadline } = await req.json();
    const patch = {};
    if (title !== undefined) {
      if (!title.trim()) return Response.json({ error: 'Title cannot be empty.' }, { status: 400 });
      patch.title = title.trim();
    }
    if (message !== undefined) patch.message = message && message.trim() ? message.trim() : null;
    if (category !== undefined) patch.category = category && category.trim() ? category.trim() : null;
    if (type !== undefined) {
      if (!TYPES.includes(type)) return Response.json({ error: 'Invalid type.' }, { status: 400 });
      patch.type = type;
    }
    if (deadline !== undefined) patch.deadline = deadline || null;
    if (pinned !== undefined) patch.pinned = !!pinned;
    if (active !== undefined) patch.active = !!active;
    if (linkUrl !== undefined) patch.link_url = linkUrl && linkUrl.trim() ? linkUrl.trim() : null;
    if (linkLabel !== undefined) patch.link_label = linkLabel && linkLabel.trim() ? linkLabel.trim() : null;
    if (showButton !== undefined) patch.show_button = !!showButton;
    if (showDeadline !== undefined) patch.show_deadline = !!showDeadline;

    if (Object.keys(patch).length === 0) {
      return Response.json({ error: 'Nothing to update.' }, { status: 400 });
    }

    const [row] = await sbUpdate('announcements', `id=eq.${Number(id)}&course_code=eq.${COURSE_CODE}`, patch);
    if (!row) return Response.json({ error: 'Announcement not found.' }, { status: 404 });
    return Response.json({ ok: true });
  } catch (err) {
    console.error('admin/announcements PATCH error:', err);
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
    await sbDelete('announcements', `id=eq.${Number(id)}&course_code=eq.${COURSE_CODE}`);
    return Response.json({ ok: true });
  } catch (err) {
    console.error('admin/announcements DELETE error:', err);
    return Response.json({ error: 'Server error.' }, { status: 500 });
  }
}
