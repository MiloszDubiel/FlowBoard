import { withAuth } from "@/lib/withAuth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { commentSchema } from "@/schema/addComment.schema";

export const PATCH = withAuth(async (user, request, context) => {
  const { tasks } = await request.json();
  const { cardId } = await context.params;

  const uID = user.userID;



  const isMember = await prisma.cardMember.findFirst({
    where: {
      cardId: Number(cardId),
      userId: uID,
    },
  });

  if (!isMember) {
    return NextResponse.json(
      { message: "Nie jesteś członkiem tej karty" },
      { status: 403 },
    );
  }

  await prisma.card.update({
    where: {
      id: Number(cardId),
    },
    data: {
      checklist: {
        tasks: tasks,
      },
    },
  });

  return NextResponse.json({
    message: "Checklista została zaktualizowana",
  });
});
