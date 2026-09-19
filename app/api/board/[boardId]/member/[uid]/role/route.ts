import { checkBoardMembership } from "@/lib/auth/checkMembership";
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
      members: {
        some: {
          userId: Number(user.userID),
        },
      },
    },
    include: {
      members: true,
    },
  });

  if (!board) {
    return NextResponse.json(
      { message: "Nie znaleziono tablicy z danym uzytkownikiem" },
      { status: 404 },
    );
  }

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

  const getMyRole = await board.members.find(
    (el) => el.id === Number(user.userID),
  );

  if (!["ADMIN", "OWNER"].includes(getMyRole?.role || " ")) {
    return NextResponse.json(
      {
        message: "Nie masz uprawnien do zmiany ról.",
      },
      { status: 403 },
    );
  }

  if (Number(uid) === Number(user.userID)) {
    return NextResponse.json(
      {
        message: "Nie możesz zmienić swojej roli.",
      },
      { status: 403 },
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
