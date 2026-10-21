import { withAuth } from "@/lib/withAuth";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase-admin";
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
  ".pdf": "application/pdf",
  ".docx":
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
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

  const uploadDir = path.join(folder, String(cardId));

  try {
    const { data, error } = await supabaseAdmin.storage
      .from("FlowBOard")
      .upload(uploadDir, Buffer.from(await file.arrayBuffer()), {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error("Supabase upload error:", error.message);
      return NextResponse.json(
        { error: "Nie udało się zapisać pliku." },
        { status: 500 },
      );
    }

    await prisma.attachment.create({
      data: {
        cardId,
        fileUrl: ` ${process.env.SUPABASE_URL}/${data.path} `,
        fileName: randomFileName,
        userId: id,
        fileType: type === "img" ? "IMG" : "TEXTFILE",
      },
    });
  } catch (err) {
    console.log(err);
  }
};
