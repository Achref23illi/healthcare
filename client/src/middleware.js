// src/middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  // No server-side auth checking for now, let client handle it
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*'],
};