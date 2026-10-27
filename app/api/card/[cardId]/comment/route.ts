import { withAuth } from "@/lib/withAuth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { commentSchema } from "@/schema/addComment.schema";

export const POST = withAuth(async (user, request, context) => {
  const { comment } = await request.json();
  const { cardId } = await context.params;

  const result = commentSchema.safeParse({ comment });
  const uID: number = user.userID;

  if (!result.success) {
    return NextResponse.json(
      { message: "Nieprawidłowy komentarz" },
      { status: 400 },
    );
  }

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

  const cardMembers = await prisma.cardMember.findMany({
    where: {
      cardId: Number(cardId),
    },
  });

  const addedComment = await prisma.comment.create({
    data: {
      cardId: Number(cardId),
      userId: uID,
      content: comment,
    },
  });

  const card = await prisma.card.findFirst({
    where: {
      id: Number(cardId),
    },
    include: {
      list: {
        include: {
          board: {
            include: {
              project: true,
            },
          },
        },
      },
    },
  });

  await prisma.notification.createMany({
    data: cardMembers.map((el) => ({
      type: "CARD_COMMENT",
      message: `Dodano komentarz w karcie ${card?.title} w projekcie ${card?.list.board.project.name} `,
      userId: el.userId,
    })),
  });

  return NextResponse.json({
    message: "Komentarz został dodany",
    commentId: addedComment.id,
  });
});
