import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/withAuth";
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export const DELETE = withAuth(async (user, request, context) => {
  const { userId } = await context.params;

  const id = Number(userId);

  if (id !== Number(user.userID)) {
    return NextResponse.json({ message: "Brak uprawnień" }, { status: 403 });
  }

  const userData = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      avatarUrl: true,
    },
  });

  if (!userData) {
    return NextResponse.json(
      { message: "Użytkownik nie istnieje" },
      { status: 404 },
    );
  }

  await prisma.user.delete({
    where: {
      id,
    },
  });

  if (userData.avatarUrl) {
    const filePath = path.join(process.cwd(), "public", userData.avatarUrl);

    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.error("Nie udało się usunąć zdjęcia:", error);
    }
  }

  const response = NextResponse.redirect(new URL("/", request.url));

  response.cookies.delete("token");

  return response;
});
