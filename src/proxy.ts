import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  // Add basic origin checking for API routes
  if (req.nextUrl.pathname.startsWith('/api/')) {
    const origin = req.headers.get('origin');
    
    // Check if the origin matches your site URL (or allow if no origin header is present, e.g., direct server call)
    if (origin && !origin.includes(process.env.NEXT_PUBLIC_SITE_URL || '')) {
      return new NextResponse('Forbidden: Invalid Origin', { status: 403 });
    }
  }
  return NextResponse.next();
}

// Ensure the middleware ONLY intercepts API routes to avoid blocking regular page loads
export const config = { 
  matcher: ['/api/:path*'] 
};