import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isLoginPage = pathname === "/login";

  const accessToken = request.cookies.get("accessToken")?.value;
  let decodedToken: jwt.JwtPayload | null = null;

  if (accessToken && process.env.JWT_ACCESS_SECRET) {
    try {
      decodedToken = jwt.verify(
        accessToken,
        process.env.JWT_ACCESS_SECRET,
      ) as jwt.JwtPayload;
    } catch {
      decodedToken = null;
    }
  }

  const isAuthenticated = !!decodedToken;
  const userRole = decodedToken?.role;

  if (isLoginPage && isAuthenticated) {
    return NextResponse.redirect(
      new URL(userRole === "admin" ? "/admin" : "/employee", request.url),
    );
  }

  if (!isLoginPage && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthenticated) {
    if (pathname.startsWith("/admin") && userRole !== "admin") {
      return NextResponse.redirect(new URL("/employee", request.url));
    }

    if (pathname.startsWith("/employee") && userRole !== "employee") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    if (pathname === "/") {
      return NextResponse.redirect(
        new URL(userRole === "admin" ? "/admin" : "/employee", request.url),
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.svg$).*)",
  ],
};
