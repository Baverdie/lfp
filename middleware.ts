import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const { pathname, hostname } = request.nextUrl;

  // Vérifier si c'est le sous-domaine admin
  const isAdminSubdomain = hostname.startsWith('admin.');

  // Si sous-domaine admin, rediriger vers /admin
  if (isAdminSubdomain && !pathname.startsWith('/admin') && !pathname.startsWith('/api')) {
    return NextResponse.redirect(new URL('/admin' + pathname, request.url));
  }

  // Protéger les routes /admin (sauf /admin/login)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // Si pas de token, rediriger vers login
    if (!token) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Vérifier si l'utilisateur est actif (via le token)
    if (!token.id) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Pour les routes admin, ajouter les headers noindex
  if (pathname.startsWith('/admin')) {
    const response = NextResponse.next();
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|images|fonts).*)',
  ],
};
