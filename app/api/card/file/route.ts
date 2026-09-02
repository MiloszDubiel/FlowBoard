import { withAuth } from "@/lib/withAuth";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
export const POST = withAuth(async (user, request, context) => {
  const formData = await request.formData();

  const files = formData.getAll("files");
  const cardId = formData.get("cardId");

  if (!cardId) {
    return NextResponse.json({ message: "Brak cardId" }, { status: 400 });
  }

  if (files.length === 0) {
    return NextResponse.json(
      { message: "Nie przesłano plików" },
      { status: 400 },
    );
  }

  if (files.some((file) => !(file instanceof File))) {
    return NextResponse.json(
      { message: "Nieprawidłowy plik" },
      { status: 400 },
    );
  }

  const urls = await Promise.all(
    files.map(async (file) => {
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

      await prisma.attachment.create({
        data: {
          cardId: Number(cardId),
          fileUrl,
          fileName: randomFileName,
          userId: user.userID,
        },
      });

      return fileUrl;
    }),
  );

  revalidatePath("/");

  return NextResponse.json({
    status: "success",
    urls,
  });
});
