import { cookies } from 'next/headers';
import { TA_COOKIE } from '../../../../../lib/scheduleAuth';

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete(TA_COOKIE);
  return Response.json({ ok: true });
}
