import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isOnLoginPage = req.nextUrl.pathname === "/login"
  const isApiAuthRoute = req.nextUrl.pathname.startsWith("/api/auth")
  const isStaticFile = req.nextUrl.pathname.includes("_next/static") || 
                       req.nextUrl.pathname.includes("_next/image") ||
                       req.nextUrl.pathname.includes("favicon.ico")

  // Allow API auth routes and static files
  if (isApiAuthRoute || isStaticFile) {
    return NextResponse.next()
  }

  // Allow login page for non-logged-in users
  if (!isLoggedIn && isOnLoginPage) {
    return NextResponse.next()
  }

  // Redirect to login if not logged in
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.nextUrl))
  }

  // Redirect logged-in users away from login page
  if (isLoggedIn && isOnLoginPage) {
    return NextResponse.redirect(new URL("/", req.nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}