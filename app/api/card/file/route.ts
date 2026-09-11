import { withAuth } from "@/lib/withAuth";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
export const POST = withAuth(async (user, request, context) => {
  const formData = await request.formData();

  const txt = formData.getAll("txt");
  const img = formData.getAll("img");
  const cardId = formData.get("cardId");

  if (!cardId) {
    return NextResponse.json({ message: "Brak cardId" }, { status: 400 });
  }

  if (img.length === 0) {
    return NextResponse.json(
      { message: "Nie przesłano plików" },
      { status: 400 },
    );
  }

  if (img.some((file) => !(file instanceof File))) {
    return NextResponse.json(
      { message: "Nieprawidłowy plik" },
      { status: 400 },
    );
  }

  const urls = await Promise.all([
    ...img.map(async (file) =>
      createFile("img", file, Number(cardId), user.userID),
    ),
    ...txt.map(async (file) =>
      createFile("txt", file, Number(cardId), user.userID),
    ),
  ]);

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
) => {
  const extension = path.extname(file.name);

  const randomFileName = `${crypto.randomUUID()}${extension}`;

  const uploadDir = path.join(
    process.cwd(),
    "public",
    "uploads",
    type === "img" ? "images" : "textfiles",
    String(cardId),
  );

  await fs.mkdir(uploadDir, { recursive: true });

  const filePath = path.join(uploadDir, randomFileName);

  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  await fs.writeFile(filePath, buffer);

  const fileUrl = `/uploads/${type === "img" ? "images" : "textfiles"}/${cardId}/${randomFileName}`;

  await prisma.attachment.create({
    data: {
      cardId: Number(cardId),
      fileUrl,
      fileName: randomFileName,
      userId: id,
      fileType: type === "img" ? "IMG" : "TEXTFILE",
    },
  });

  return fileUrl;
};
