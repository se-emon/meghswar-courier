import { NextResponse } from "next/server"

export async function middleware(request: any) {
  const token = request.cookies.get("auth-token")?.value
  const pathname = request.nextUrl.pathname
  
  const isApiRoute = pathname.startsWith("/api")
  const isStaticFile = pathname.includes("_next/static") || 
                       pathname.includes("_next/image") ||
                       pathname.includes("favicon.ico")
  const isPublicRoute = pathname === "/" || pathname === "/login"

  if (isApiRoute || isStaticFile) {
    return NextResponse.next()
  }

  if (isPublicRoute) {
    return NextResponse.next()
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}