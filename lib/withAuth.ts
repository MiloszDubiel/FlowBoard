import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";

type RouteContext = {
  params: Promise<Record<string, string>>;
};

export function withAuth(
  handler: (
    user: any,
    request: Request,
    context: RouteContext,
  ) => Promise<Response>,
) {
  return async (request: Request, context: RouteContext) => {
    try {
      const user = await requireAuth();

      try {
        return await handler(user, request, context);
      } catch (err) {
        console.log(err);
      }
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
