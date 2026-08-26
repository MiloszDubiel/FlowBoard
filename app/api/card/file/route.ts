import { withAuth } from "@/lib/withAuth";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export const POST = withAuth(async (user, request, context) => {
  const formData = await request.formData();

  const file = formData.get("file") as File;
  const cardId = formData.get("cardId");

  if (!(file instanceof File)) {
    return NextResponse.json(
      { message: "Nie przesłano pliku" },
      { status: 400 },
    );
  }

  if (!cardId) {
    return NextResponse.json({ message: "Brak cardId" }, { status: 400 });
  }
  const extension = path.extname(file.name);

  const randomFileName = `${crypto.randomUUID()}${extension}`;

  const uploadDir = path.join(
    process.cwd(),
    "public",
    "uploads",
    String(cardId),
  );

  await fs.mkdir(uploadDir, { recursive: true });

  const filePath = path.join(uploadDir, randomFileName);
  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  await fs.writeFile(filePath, buffer);

  const fileUrl = `/uploads/${cardId}/${randomFileName}`;

  revalidatePath("/");

  await prisma.attachment.create({
    data: {
      cardId: Number(cardId),
      fileUrl: fileUrl,
      fileName: randomFileName,
      userId: user.userID,
    },
  });

  return NextResponse.json({
    status: "success",
    url: fileUrl,
    filename: randomFileName,
  });
});
