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
      ownerId: user.userID, //Na razie owner może zmieniać role, później będzie można dodać możliwość zmiany roli przez admina
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

  const isOwner = await prisma.board.findFirst({
    where: {
      id: Number(boardId),
      ownerId: Number(uid),
    },
  });

  if (isOwner) {
    return NextResponse.json(
      {
        message: "Nie możesz zmienić roli właściciela tablicy.",
      },
      { status: 400 },
    );
  }

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
