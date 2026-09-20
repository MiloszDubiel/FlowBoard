import { withAuth } from "@/lib/withAuth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  checkBoardMembership,
  checkCardMembership,
} from "@/lib/auth/checkMembership";

export const DELETE = withAuth(async (user, request, context) => {
  const { cardId } = await context.params;

  const uID: number = user.userID;

  if (!checkCardMembership(Number(uID), Number(cardId))) {
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

  const userExits = await checkBoardMembership(
    Number(uID),
    Number(card?.list.boardId),
  );

  if (!userExits) {
    return NextResponse.json(
      {
        message: "Nie masz dostępu do tej tablicy",
      },
      {
        status: 403,
      },
    );
  }

  if (!["OWNER", "ADMIN"].includes(userExits.role)) {
    return NextResponse.json(
      {
        message: "Nie masz uprawnień",
      },
      {
        status: 403,
      },
    );
  }
  await prisma.card.delete({
    where: {
      id: Number(cardId),
    },
  });

  return NextResponse.json({
    message: "Usunięto kartę",
  });
});
