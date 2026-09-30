import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./lib/auth";

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  const isGuestRoute =
    request.nextUrl.pathname === "/login" ||
    request.nextUrl.pathname === "/register";

  if (isGuestRoute) {
    if (!token) {
      return NextResponse.next();
    }

    try {
      const user = await verifyToken(token);

      if (user) {
        return NextResponse.redirect(new URL("/projects", request.url));
      }

      return NextResponse.next();
    } catch {
      return NextResponse.next();
    }
  }
  if (!token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
    const user = await verifyToken(token);

    if (!user) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: [
    "/projects/:path*",
    "/board/:path*",
    "/login/:path*",
    "/register/:path*",
    "/settings/:path*",
  ],
};
