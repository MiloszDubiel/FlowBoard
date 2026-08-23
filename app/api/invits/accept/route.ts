import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/withAuth";
import { NextResponse } from "next/server";

export const POST = withAuth(async (user, request, context) => {
  const { boardId } = await request.json();

  const boardIvit = await prisma.boardInvite.findFirst({
    where: {
      boardId: Number(boardId),
      userId: Number(user.userID),
    },
  });

  if (!boardIvit)
    return NextResponse.json(
      {
        message: "Nie możesz dołaczyć do tej tablicy.",
      },
      { status: 403 },
    );

  await prisma.boardInvite.delete({
    where: {
      boardId_userId: {
        userId: Number(user.userID),
        boardId: Number(boardId),
      },
    },
  });
    
  await prisma.boardMember.create({
    data: {
      userId: Number(user.userID),
      boardId: Number(boardId),
    },
  });

  return NextResponse.json({
    message: "Zaakceptowano zaproszenie.",
  });
});
