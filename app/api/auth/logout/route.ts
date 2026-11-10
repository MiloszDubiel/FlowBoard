import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Brak sesji." }, { status: 401 });
  }

  const payload = await verifyToken(token);

  if (!payload) {
    return NextResponse.json(
      { message: "Nieprawidłowa sesja." },
      { status: 401 },
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      id: Number(payload.userID),
    },
  });

  if (!user) {
    return NextResponse.json(
      { message: "Nieprawidłowa sesja." },
      { status: 401 },
    );
  }

  if (!user.isDemo) {
    const response = NextResponse.json({
      success: true,
    });

    response.cookies.delete("token");
  }

  await prisma.user.deleteMany({
    where: {
      id: Number(payload.userID),
      isDemo: true,
    },
  });

  const response = NextResponse.json({
    success: true,
  });

  response.cookies.delete("token");

  return response;
}
