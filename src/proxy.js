import { NextResponse } from 'next/server';
export function proxy(request){if(!request.cookies.get('promptgrid_token')){const login=new URL('/login',request.url);login.searchParams.set('next',request.nextUrl.pathname+request.nextUrl.search);return NextResponse.redirect(login)}return NextResponse.next()}
export const config={matcher:['/dashboard/:path*','/prompts/:path*','/payment/:path*']};
