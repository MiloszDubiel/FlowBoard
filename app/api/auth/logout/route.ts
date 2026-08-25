import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({
    message: "Wylogowano",
  });

  response.cookies.delete("token");

  return response;
}
