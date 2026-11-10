import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./lib/auth";
import { prisma } from "@/lib/prisma";

const isDemo = process.env.IS_DEMO === "1";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("token")?.value;

  const isDemoRoute = pathname === "/demo";
  const isGuestRoute = pathname === "/login" || pathname === "/register";

  if (isDemoRoute && !isDemo) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isDemo) {
    if (isDemoRoute) {
      if (!token) {
        return NextResponse.next();
      }

      try {
        const user = await verifyToken(token);

        if (user?.isDemo) {
          return NextResponse.redirect(new URL("/projects", request.url));
        }
      } catch {}

      return NextResponse.next();
    }

    if (!token) {
      return NextResponse.redirect(new URL("/demo", request.url));
    }

    try {
      const user = await verifyToken(token);

      const userData = await prisma.user.findUnique({
        where: {
          id: Number(user.userID),
        },
      });

      if (!user || !userData?.isDemo) {
        return NextResponse.redirect(new URL("/demo", request.url));
      }

      if (isGuestRoute) {
        return NextResponse.redirect(new URL("/projects", request.url));
      }

      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL("/demo", request.url));
    }
  }

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
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
