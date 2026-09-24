import { withAuth } from "@/lib/withAuth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";

export const POST = withAuth(async (user, request, context) => {
  const { cardId } = await context.params;
  const { files } = await request.json();

  const uID = Number(user.userID);
  const parsedCardId = Number(cardId);

  if (!cardId || !Number.isInteger(parsedCardId)) {
    return NextResponse.json(
      { message: "Nieprawidłowe cardId" },
      { status: 400 },
    );
  }

  const cardMember = await prisma.cardMember.findFirst({
    where: {
      cardId: parsedCardId,
      userId: uID,
    },
    include: {
      card: {
        include: {
          list: true,
        },
      },
    },
  });

  if (!cardMember) {
    return NextResponse.json(
      {
        message: "Nie jesteś członkiem karty",
      },
      { status: 403 },
    );
  }

  const boardMember = await prisma.boardMember.findFirst({
    where: {
      boardId: cardMember.card.list.boardId,
      userId: uID,
    },
  });

  if (!boardMember || !["ADMIN", "OWNER"].includes(boardMember.role)) {
    return NextResponse.json(
      {
        message: "Brak uprawnień",
      },
      { status: 403 },
    );
  }

  for (const file of files) {
    const attachment = await prisma.attachment.findFirst({
      where: {
        id: Number(file.id),
        cardId: parsedCardId,
      },
    });

    if (!attachment) {
      continue;
    }

    const filePath = path.join(
      process.cwd(),
      "public",
      attachment.fileUrl.replace(/^[/\\]/, ""),
    );

    await prisma.attachment.delete({
      where: {
        id: attachment.id,
      },
    });

    try {
      await fs.unlink(filePath);
    } catch (error: any) {
      if (error.code !== "ENOENT") {
        throw error;
      }
    }
  }

  return NextResponse.json({
    message: "Usunięto pliki",
  });
});
