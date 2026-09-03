// app/api/schedule/admin/tutorial-venues/[id]/route.js
// DELETE -> remove one date's venue override (falls back to "unknown" on the
// public widget, not to any default — deletion doesn't imply "no session").

import { cookies } from 'next/headers';
import { readAdminSession } from '../../../../../../lib/scheduleAuth';
import { sbDelete } from '../../../../../../lib/supabaseAdmin';

export async function DELETE(req, { params }) {
  const cookieStore = await cookies();
  if (!readAdminSession(cookieStore)) {
    return Response.json({ error: 'Admin login required.' }, { status: 401 });
  }

  try {
    const { id } = await params;
    await sbDelete('tutorial_slot_venues', `id=eq.${Number(id)}`);
    return Response.json({ ok: true });
  } catch (err) {
    console.error('admin/tutorial-venues DELETE error:', err);
    return Response.json({ error: 'Server error.' }, { status: 500 });
  }
}
