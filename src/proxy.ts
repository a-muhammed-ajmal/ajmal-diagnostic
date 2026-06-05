import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

function getHost(value: string | null) {
  if (!value) return null;

  try {
    return new URL(value).host.toLowerCase();
  } catch {
    return value.replace(/^https?:\/\//, '').split('/')[0]?.toLowerCase() || null;
  }
}

export function proxy(req: NextRequest) {
  // Add basic origin checking for API routes
  if (req.nextUrl.pathname.startsWith('/api/')) {
    const origin = req.headers.get('origin');
    const originHost = getHost(origin);

    // Allow same-origin API calls first, then optional deployment aliases.
    const allowedHosts = new Set(
      [
        req.nextUrl.host,
        req.headers.get('host'),
        req.headers.get('x-forwarded-host'),
        getHost(process.env.NEXT_PUBLIC_SITE_URL ?? null),
        getHost(process.env.VERCEL_URL ?? null),
        getHost(process.env.VERCEL_PROJECT_PRODUCTION_URL ?? null),
      ]
        .filter((host): host is string => Boolean(host))
        .map((host) => host.toLowerCase())
    );

    // Allow requests without an Origin header, such as direct server-to-server calls.
    if (originHost && !allowedHosts.has(originHost)) {
      return NextResponse.json(
        { success: false, error: 'Forbidden: Invalid Origin' },
        { status: 403 }
      );
    }
  }
  return NextResponse.next();
}

// Ensure the proxy ONLY intercepts API routes to avoid blocking regular page loads
export const config = { 
  matcher: ['/api/:path*'] 
};
