// app/api/schedule/admin/exam-results/rows/[id]/route.js
// DELETE -> removes one student's result row permanently.

import { cookies } from 'next/headers';
import { readAdminSession } from '../../../../../../../lib/scheduleAuth';
import { sbDelete } from '../../../../../../../lib/supabaseAdmin';
import { COURSE_CODE } from '../../../../../../../lib/scheduleConfig';

export async function DELETE(req, { params }) {
  const cookieStore = await cookies();
  if (!readAdminSession(cookieStore)) {
    return Response.json({ error: 'Admin login required.' }, { status: 401 });
  }

  try {
    const { id } = await params;
    await sbDelete('exam_results', `id=eq.${Number(id)}&course_code=eq.${COURSE_CODE}`);
    return Response.json({ ok: true });
  } catch (err) {
    console.error('admin/exam-results/rows DELETE error:', err);
    return Response.json({ error: 'Server error.' }, { status: 500 });
  }
}
