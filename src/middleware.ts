import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"

export function middleware(request: any) {
  const token = request.cookies.get("auth-token")?.value
  const pathname = request.nextUrl.pathname
  const isOnLoginPage = pathname === "/login" || pathname.startsWith("/login")
  const isApiRoute = pathname.startsWith("/api")
  const isStaticFile = pathname.includes("_next/static") || 
                       pathname.includes("_next/image") ||
                       pathname.includes("favicon.ico")
  const isRoot = pathname === "/"

  if (isApiRoute || isStaticFile) {
    return NextResponse.next()
  }

  if (isOnLoginPage || isRoot) {
    if (token) {
      try {
        jwt.verify(token, process.env.NEXTAUTH_SECRET!)
        if (isRoot) {
          return NextResponse.redirect(new URL("/dashboard", request.nextUrl))
        }
      } catch {
        // Invalid token, continue to login
      }
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