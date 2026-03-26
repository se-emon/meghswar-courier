import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isOnLoginPage = req.nextUrl.pathname.startsWith("/login")
  const isApiAuthRoute = req.nextUrl.pathname.startsWith("/api/auth")
  const isStaticFile = req.nextUrl.pathname.includes("_next/static") || 
                       req.nextUrl.pathname.includes("_next/image") ||
                       req.nextUrl.pathname.includes("favicon.ico")

  if (isApiAuthRoute || isStaticFile) {
    return NextResponse.next()
  }

  if (!isLoggedIn && isOnLoginPage) {
    return NextResponse.next()
  }

  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.nextUrl))
  }

  if (isLoggedIn && isOnLoginPage) {
    return NextResponse.redirect(new URL("/", req.nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}