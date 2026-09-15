import { withAuth } from "@/lib/withAuth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  checkBoardMembership,
  checkCardMembership,
} from "@/lib/auth/checkMembership";

export const PATCH = withAuth(async (user, request, context) => {
  const { tasks } = await request.json();
  const { cardId } = await context.params;

  if (!checkCardMembership(Number(user.userID), Number(cardId))) {
    return NextResponse.json(
      { message: "Nie jesteś członkiem tej karty" },
      { status: 403 },
    );
  }

  const board = await prisma.card.findFirst({
    where: {
      id: Number(cardId),
    },
    include: {
      list: {
        include: {
          board: true,
        },
      },
    },
  });

  if (!(await checkBoardMembership(Number(user.userID), Number(board?.id)))) {
    return NextResponse.json(
      {
        message: "Nie masz uprawnien",
      },
      {
        status: 403,
      },
    );
  }

  await prisma.card.update({
    where: {
      id: Number(cardId),
    },
    data: {
      tasks: tasks,
    },
  });

  return NextResponse.json({
    message: "Checklista została zaktualizowana",
  });
});
