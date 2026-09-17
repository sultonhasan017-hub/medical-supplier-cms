import { NextResponse } from 'next/server';
import { logoutSession } from '@/lib/auth';

export async function POST(request: Request) {
  await logoutSession();

  const url = new URL(request.url);
  const referer = request.headers.get('referer');

  let redirectUrl = `${url.origin}/id/admin/login`;
  if (referer) {
    try {
      const refererUrl = new URL(referer);
      const localeMatch = refererUrl.pathname.match(/^\/(en|id)\//);
      const locale = localeMatch ? localeMatch[1] : 'id';
      redirectUrl = `${url.origin}/${locale}/admin/login`;
    } catch {
      // Fallback ke /id/admin/login
    }
  }

  return NextResponse.redirect(redirectUrl, 303);
}
