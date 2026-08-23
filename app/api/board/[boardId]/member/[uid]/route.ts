import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/withAuth";
import { NextResponse } from "next/server";

export const PUT = withAuth(async (user, request, context) => {
  const { boardId, uid } = await context.params;

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

  if (include) {
    return NextResponse.json(
      {
        message: "Uzytkownik jest już przypisany do tablicy.",
      },
      { status: 409 },
    );
  }

  const invitation = await prisma.boardInvite.findFirst({
    where: {
      userId: Number(uid),
      boardId: Number(boardId),
    },
  });

  if (invitation?.status === "PENDING") {
    return NextResponse.json(
      {
        message: "Zaproszenie zostało już wysłane.",
      },
      { status: 409 },
    );
  }

  await prisma.boardInvite.create({
    data: {
      userId: Number(uid),
      boardId: Number(boardId),
    },
  });

  return NextResponse.json({
    message: "Wysłano zaproszenie.",
  });
});

export const DELETE = withAuth(async (user, request, context) => {
  const { boardId, uid } = await context.params;

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

  await prisma.boardMember.delete({
    where: {
      boardId_userId: {
        boardId: Number(boardId),
        userId: Number(uid),
      },
    },
  });

  return NextResponse.json({
    message: "Usunięto użytkownika.",
  });
});
