import { NextResponse } from 'next/server';

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const response = NextResponse.redirect(new URL('/admin', siteUrl));
  response.cookies.delete('admin_session');
  return response;
}
