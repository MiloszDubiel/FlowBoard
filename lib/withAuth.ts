import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";

export function withAuth(
  handler: (user: any, request: Request) => Promise<Response>,
) {
  return async (request: Request) => {
    try {
      const user = await requireAuth();
      return await handler(user, request);
    } catch {
      return NextResponse.json(
        {
          message: "Brak autoryzacji",
        },
        {
          status: 401,
        },
      );
    }
  };
}
