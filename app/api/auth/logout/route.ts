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

  const userId = Number(payload.userID);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      demoSession: true,
    },
  });

  if (!user || !user.isDemo) {
    const response = NextResponse.json(
      { message: "To nie jest sesja demonstracyjna." },
      { status: 403 },
    );

    response.cookies.delete("token");
    return response;
  }

  if (!user.demoSession || user.demoSession.expiresAt <= new Date()) {
    const response = NextResponse.json(
      { message: "Sesja demonstracyjna wygasła." },
      { status: 401 },
    );

    response.cookies.delete("token");
    return response;
  }

  await prisma.user.delete({
    where: {
      id: userId,
    },
  });

  const response = NextResponse.json({
    success: true,
    message: "Sesja demonstracyjna została zakończona.",
  });

  response.cookies.delete("token");

  return response;
}
