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

  const addedComment = await prisma.comment.create({
    data: {
      cardId: Number(cardId),
      userId: uID,
      content: comment,
    },
  });

  return NextResponse.json({
    message: "Komentarz został dodany",
    commentId: addedComment.id,
  });
});
