import { withAuth } from "@/lib/withAuth";
import { NextResponse, NextRequest } from "next/server";

export const GET = withAuth(async (user, request) => {
  console.log(request.method);

  return NextResponse.json({
    message: "Witaj",
  });
});
