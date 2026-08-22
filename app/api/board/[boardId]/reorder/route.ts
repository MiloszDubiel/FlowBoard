import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/withAuth";
import { NextResponse } from "next/server";

export const PATCH = withAuth(async (user, request, context) => {
  const { boardId } = await context.params;

  const { position, id } = await request.json();

  const board = await prisma.board.findFirst({
    where: {
      id: Number(boardId),
      ownerId: user.userID,
    },
  });

  if (!board) {
    return NextResponse.json(
      { message: "Nie znaleziono tablicy" },
      { status: 404 },
    );
  }

  await prisma.list.update({
    where: {
      id: id,
    },
    data: {
      position: position,
    },
  });

  return NextResponse.json({
    message: "Zmieniono kolejność list",
  });
});
