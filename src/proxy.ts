import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

async function verifyToken(token: string) {
  try {
    const encoder = new TextEncoder();
    const { payload } = await jwtVerify(
      token,
      encoder.encode(process.env.JWT_ACCESS_SECRET),
    );
    return payload;
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === "/login";

  let accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  let decodedToken = null;

  if (accessToken) {
    decodedToken = await verifyToken(accessToken);
  }

  if (!decodedToken && refreshToken) {
    try {
      const refreshUrl = new URL("/api/refresh", request.url);
      const refreshResponse = await fetch(refreshUrl, {
        method: "POST",
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
      });

      if (refreshResponse.ok) {
        const setCookieHeader = refreshResponse.headers.get("set-cookie");
        if (setCookieHeader) {
          const newTokenMatch = setCookieHeader.match(/accessToken=([^;]+)/);
          if (newTokenMatch) {
            accessToken = newTokenMatch[1];
            decodedToken = await verifyToken(accessToken);
          }
        }
      }
    } catch {
      console.error("Silent refresh failed in middleware");
    }
  }

  const isAuthenticated = !!decodedToken;
  const userRole = decodedToken?.role;

  let response = NextResponse.next();

  if (isLoginPage && isAuthenticated) {
    response = NextResponse.redirect(
      new URL(userRole === "ADMIN" ? "/admin" : "/employee", request.url),
    );
  } else if (!isLoginPage && !isAuthenticated) {
    response = NextResponse.redirect(new URL("/login", request.url));
  } else if (isAuthenticated) {
    if (pathname.startsWith("/admin") && userRole !== "ADMIN") {
      response = NextResponse.redirect(new URL("/employee", request.url));
    }

    if (pathname.startsWith("/employee") && userRole !== "EMPLOYEE") {
      response = NextResponse.redirect(new URL("/admin", request.url));
    }

    if (pathname === "/") {
      response = NextResponse.redirect(
        new URL(userRole === "ADMIN" ? "/admin" : "/employee", request.url),
      );
    }
  }

  if (!request.cookies.has("accessToken") && accessToken && isAuthenticated) {
    response.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 60,
      path: "/",
      sameSite: "lax",
    });
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.svg$).*)",
  ],
};
