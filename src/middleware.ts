import { NextResponse } from "next/server"

export function middleware(request: any) {
  const isOnLoginPage = request.nextUrl.pathname.startsWith("/login")
  const isApiAuthRoute = request.nextUrl.pathname.startsWith("/api/auth")
  const isStaticFile = request.nextUrl.pathname.includes("_next/static") || 
                       request.nextUrl.pathname.includes("_next/image") ||
                       request.nextUrl.pathname.includes("favicon.ico")

  if (isApiAuthRoute || isStaticFile) {
    return NextResponse.next()
  }

  if (isOnLoginPage) {
    return NextResponse.next()
  }

  return NextResponse.redirect(new URL("/login", request.nextUrl))
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}