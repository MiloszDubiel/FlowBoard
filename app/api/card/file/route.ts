import { withAuth } from "@/lib/withAuth";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { fileTypeFromBuffer } from "file-type";
import { prisma } from "@/lib/prisma";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const imageTypes: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

const textTypes: Record<string, string> = {
  ".txt": "text/plain",
  ".md": "text/markdown",
  ".csv": "text/csv",
  ".json": "application/json",
};

export const POST = withAuth(async (user, request, context) => {
  const formData = await request.formData();

  const txt = formData.getAll("txt");
  const img = formData.getAll("img");
  const cardId = formData.get("cardId");

  if (!cardId || isNaN(Number(cardId))) {
    return NextResponse.json(
      { message: "Nieprawidłowy cardId" },
      { status: 400 },
    );
  }

  if (
    img.some((file) => !(file instanceof File)) ||
    txt.some((file) => !(file instanceof File))
  ) {
    return NextResponse.json(
      { message: "Nieprawidłowy plik" },
      { status: 400 },
    );
  }

  if (img.length > 5 || txt.length > 5) {
    return NextResponse.json({ message: "Za dużo plików" }, { status: 400 });
  }

  const files = [
    ...img.map((file) => ({ type: "img" as const, file: file as File })),
    ...txt.map((file) => ({ type: "txt" as const, file: file as File })),
  ];


  for (const { type, file } of files) {
    const error = await validateFile(type, file);

    if (error) {
      return NextResponse.json({ message: error }, { status: 400 });
    }
  }


  const urls = await Promise.all(
    files.map(({ type, file }) =>
      createFile(type, file, Number(cardId), user.userID),
    ),
  );

  revalidatePath("/");

  return NextResponse.json({
    status: "success",
    urls,
  });
});

async function validateFile(
  type: "img" | "txt",
  file: File,
): Promise<string | null> {
  const extension = path.extname(file.name).toLowerCase();

  if (file.size === 0) {
    return "Plik jest pusty.";
  }

  if (file.size > MAX_FILE_SIZE) {
    return `Plik ${file.name} przekracza limit 5 MB.`;
  }

  const allowedTypes = type === "img" ? imageTypes : textTypes;

  if (!Object.hasOwn(allowedTypes, extension)) {
    return type === "img"
      ? `Niedozwolony format obrazu: ${extension || "brak rozszerzenia"}.`
      : `Niedozwolony format pliku: ${extension || "brak rozszerzenia"}.`;
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  if (type === "img") {
    const detected = await fileTypeFromBuffer(buffer);

    if (!detected || detected.mime !== allowedTypes[extension]) {
      return "Zawartość pliku nie odpowiada rozszerzeniu obrazu.";
    }
    if (file.type !== detected.mime) {
      return "Nieprawidłowy typ MIME obrazu.";
    }
  } else {
    if (file.type && file.type !== allowedTypes[extension]) {
      return "Typ MIME pliku nie odpowiada jego rozszerzeniu.";
    }

    if (buffer.includes(0)) {
      return "Plik tekstowy zawiera niedozwolone dane binarne.";
    }

    try {
      new TextDecoder("utf-8", { fatal: true }).decode(buffer);
    } catch {
      return "Plik tekstowy musi być zapisany w formacie UTF-8.";
    }
  }

  return null;
}

const createFile = async (
  type: "img" | "txt",
  file: File,
  cardId: number,
  id: number,
) => {
  const extension = path.extname(file.name).toLowerCase();
  const randomFileName = `${crypto.randomUUID()}${extension}`;

  const folder = type === "img" ? "images" : "textfiles";

  const uploadDir = path.join(
    process.cwd(),
    "public",
    "uploads",
    folder,
    String(cardId),
  );

  await fs.mkdir(uploadDir, { recursive: true });

  const filePath = path.join(uploadDir, randomFileName);
  const buffer = Buffer.from(await file.arrayBuffer());

  await fs.writeFile(filePath, buffer, { flag: "wx" });

  const fileUrl = `/uploads/${folder}/${cardId}/${randomFileName}`;

  try {
    await prisma.attachment.create({
      data: {
        cardId,
        fileUrl,
        fileName: randomFileName,
        userId: id,
        fileType: type === "img" ? "IMG" : "TEXTFILE",
      },
    });
  } catch (error) {
    await fs.unlink(filePath).catch(() => {});
    throw error;
  }

  return fileUrl;
};
