import { withAuth } from "@/lib/withAuth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { supabaseAdmin } from "@/lib/supabase-admin";

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

  if (!Array.isArray(files)) {
    return NextResponse.json(
      { message: "Nieprawidłowa lista plików" },
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
      { message: "Nie jesteś członkiem karty" },
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
    return NextResponse.json({ message: "Brak uprawnień" }, { status: 403 });
  }

  let deletedCount = 0;

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
    
    let storagePath = attachment.fileUrl;

    if (storagePath.startsWith("http")) {
      try {
        const url = new URL(storagePath);
        const prefix = "/storage/v1/object/";

        const index = url.pathname.indexOf(prefix);

        if (index === -1) {
          throw new Error("Nieprawidłowy adres pliku");
        }

        const objectPath = url.pathname.slice(index + prefix.length);
        const parts = objectPath.split("/");

        storagePath = decodeURIComponent(parts.slice(2).join("/"));

      } catch {
        return NextResponse.json(
          { message: "Nieprawidłowy adres pliku" },
          { status: 400 },
        );
      }
    }

    const { error: storageError } = await supabaseAdmin.storage
      .from("FlowBOard")
      .remove([storagePath]);

    if (storageError) {
      console.error("Supabase delete error:", storageError.message);

      return NextResponse.json(
        { message: "Nie udało się usunąć pliku z Storage" },
        { status: 500 },
      );
    }

    await prisma.attachment.delete({
      where: {
        id: attachment.id,
      },
    });

    deletedCount++;
  }

  return NextResponse.json({
    message: "Usunięto pliki",
    deletedCount,
  });
});
