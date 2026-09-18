import { withAuth } from "@/lib/withAuth";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
export const POST = withAuth(async (user, request, context) => {
  const formData = await request.formData();

  const file = formData.getAll("files");

  const { cardId } = await context.params;
  const { commentId } = await context.params;

  if (!cardId) {
    return NextResponse.json({ message: "Brak cardId" }, { status: 400 });
  }

  if (file.some((file) => !(file instanceof File))) {
    return NextResponse.json(
      { message: "Nieprawidłowy plik" },
      { status: 400 },
    );
  }

  const urls = file?.map(
    async (file) =>
      await createFile(
        "txt",
        file,
        Number(cardId),
        user.userID,
        Number(commentId),
      ),
  );

  revalidatePath("/");

  return NextResponse.json({
    status: "success",
    urls,
  });
});

const createFile = async (
  type: "img" | "txt",
  file: any,
  cardId: number,
  id: number,
  commentId: number,
) => {
  const extension = path.extname(file.name);

  const randomFileName = `${crypto.randomUUID()}${extension}`;

  const uploadDir = path.join(
    process.cwd(),
    "public",
    "uploads",
    "comment",
    String(cardId),
    String(id),
  );

  await fs.mkdir(uploadDir, { recursive: true });

  const filePath = path.join(uploadDir, randomFileName);

  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  await fs.writeFile(filePath, buffer);

  const fileUrl = `/uploads/comment/${cardId}/${id}/${randomFileName}`;

  await prisma.commentAttachment.create({
    data: {
      cardId: Number(cardId),
      fileUrl,
      fileName: randomFileName,
      userId: id,
      commentId: commentId,
    },
  });

  return fileUrl;
};
