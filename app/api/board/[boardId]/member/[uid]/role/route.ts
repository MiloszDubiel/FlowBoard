import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/withAuth";
import { NextResponse } from "next/server";

export const PATCH = withAuth(async (user, request, context) => {
  const { boardId, uid } = await context.params;
  const { role } = await request.json();

  if (!role) {
    return NextResponse.json({ message: "Nie podano roli" }, { status: 400 });
  }

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

  const include = await prisma.boardMember.findFirst({
    where: {
      userId: Number(uid),
      boardId: Number(boardId),
    },
  });

  if (!include) {
    return NextResponse.json(
      {
        message: "Uzytkownik nie należy do tablicy.",
      },
      { status: 409 },
    );
  }

  await prisma.boardMember.update({
    where: {
      boardId_userId: {
        boardId: Number(boardId),
        userId: Number(uid),
      },
    },
    data: {
      role,
    },
  });

  return NextResponse.json({
    message: "Zmieniono rolę.",
  });
});
