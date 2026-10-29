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
        message: "Uzytkownik jest już przypisany do tablicy",
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
        message: "Zaproszenie zostało już wysłane",
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

  const projectName = await prisma.project.findFirst({
    where: {
      id: board.projectId,
    },
  });

  await prisma.notification.create({
    data: {
      type: "BOARD_INVITATION",
      message: `Otrzymałeś zaproszenie do projektu: ${projectName?.name}`,
      userId: Number(uid),
      link: `/projects/${board.projectId}`,
    },
  });

  return NextResponse.json({
    message: "Wysłano zaproszenie",
  });
});
