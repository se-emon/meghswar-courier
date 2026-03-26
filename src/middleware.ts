import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"

export function middleware(request: any) {
  const token = request.cookies.get("auth-token")?.value
  const isOnLoginPage = request.nextUrl.pathname.startsWith("/login")
  const isApiRoute = request.nextUrl.pathname.startsWith("/api")
  const isStaticFile = request.nextUrl.pathname.includes("_next/static") || 
                       request.nextUrl.pathname.includes("_next/image") ||
                       request.nextUrl.pathname.includes("favicon.ico")

  if (isApiRoute || isStaticFile) {
    return NextResponse.next()
  }

  if (isOnLoginPage) {
    if (token) {
      return NextResponse.redirect(new URL("/dashboard", request.nextUrl))
    }
    return NextResponse.next()
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.nextUrl))
  }

  try {
    jwt.verify(token, process.env.NEXTAUTH_SECRET!)
    return NextResponse.next()
  } catch {
    return NextResponse.redirect(new URL("/login", request.nextUrl))
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}