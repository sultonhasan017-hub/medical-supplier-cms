import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';
import { decrypt, updateSession } from './lib/auth';

const handleI18nRouting = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Update session expiration if exists
  await updateSession(request);

  // Periksa apakah rute tersebut adalah area admin (termasuk dengan prefix locale seperti /id/admin/...)
  const isAdminRoute = pathname.includes('/admin') && !pathname.includes('/admin/login');
  
  if (isAdminRoute) {
    const session = request.cookies.get('session')?.value;
    if (!session) {
      // Dapatkan locale dari URL jika ada, atau gunakan default
      const localeMatch = pathname.match(/^\/(en|id)\//);
      const locale = localeMatch ? localeMatch[1] : routing.defaultLocale;
      return NextResponse.redirect(new URL(`/${locale}/admin/login`, request.url));
    }
    
    try {
      await decrypt(session);
    } catch (e) {
      const localeMatch = pathname.match(/^\/(en|id)\//);
      const locale = localeMatch ? localeMatch[1] : routing.defaultLocale;
      return NextResponse.redirect(new URL(`/${locale}/admin/login`, request.url));
    }
  }

  // Lanjutkan ke next-intl middleware
  return handleI18nRouting(request);
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
