import { withAuth } from "@/lib/withAuth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  checkBoardMembership,
  checkCardMembership,
} from "@/lib/auth/checkMembership";

export const PATCH = withAuth(async (user, request, context) => {
  const { newList } = await request.json();
  const { cardId } = await context.params;

  if (!checkCardMembership(Number(user.userID), Number(cardId))) {
    return NextResponse.json(
      { message: "Nie jesteś członkiem tej karty" },
      { status: 403 },
    );
  }

  const card = await prisma.card.findFirst({
    where: {
      id: Number(cardId),
    },
    include: {
      list: true,
    },
  });

  if (
    !(await checkBoardMembership(
      Number(user.userID),
      Number(card?.list.boardId),
    ))
  ) {
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
      tasks: newList,
    },
  });

  return NextResponse.json({
    message: "Checklista została zaktualizowana",
  });
});
