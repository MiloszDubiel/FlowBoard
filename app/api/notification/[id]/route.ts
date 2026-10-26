import { getCurrentUser } from "@/lib/auth/get-current-user";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/withAuth";
import { NextResponse } from "next/server";

export const DELETE = withAuth(async (user, request, context) => {
  const { id } = await context.params;

  const notification = await prisma.notification.findFirst({
    where: {
      userId: Number(user.userID),
      id: Number(id),
    },
  });

  if (!notification) {
    return NextResponse.json(
      { message: "Powiadomienie nie istnieje" },
      { status: 404 },
    );
  }

  await prisma.notification.delete({
    where: {
      userId: Number(user.userID),
      id: Number(id),
    },
  });

  return NextResponse.json({
    message: "Usunięto powiadomienie",
  });
});
