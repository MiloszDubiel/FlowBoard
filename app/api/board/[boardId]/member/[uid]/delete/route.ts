import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/withAuth";
import { NextResponse } from "next/server";

export const DELETE = withAuth(async (user, request, context) => {
  const { boardId, uid } = await context.params;

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
      { message: "Nie znaleziono tablicy z danym uzytkownkiem" },
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
        message: "Nie możesz usunąc własciciela tablicy.",
      },
      { status: 400 },
    );
  }

  const findEditorRole = board.members.find(
    (el) => el.userId === Number(user.userID),
  );

  if (["OWNER", "ADMIN"].includes(findEditorRole?.role || "")) {
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
  }

  return NextResponse.json(
    {
      message: "Nie masz uprawnien do usunięcia użytkownika.",
    },
    { status: 403 },
  );
});
