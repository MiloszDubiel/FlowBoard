import { NextResponse } from "next/server";
import { createDemoSession } from "@/lib/demo/create-demo-session";
import { createToken } from "@/lib/auth";

export async function POST() {
  if (process.env.IS_DEMO !== "1") {
    return NextResponse.json(
      { message: "Demo jest wyłączone." },
      { status: 404 },
    );
  }

  const session = await createDemoSession();

  const token = await createToken(session.userId);

  const response = NextResponse.json({
    success: true,
  });

  response.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: session.expiresAt,
  });

  return response;
}
