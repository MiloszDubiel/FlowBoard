import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/withAuth";
import { profileSchema } from "@/schema/editUser.schema";
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export const PATCH = withAuth(async (user, request, context) => {
  const formData = await request.formData();

  const name = formData.get("firstName");
  const lastname = formData.get("lastName");
  const bio = formData.get("bio");
  const img = formData.get("img");

  const body = { firstName: name, lastName: lastname, bio };

  const userID = Number(user.userID);
  const result = profileSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { message: "Nie poprawne dane" },
      {
        status: 400,
      },
    );
  }

  let fileUrl = null;

  if (img) {
    await fs.rm(
      path.join(process.cwd(), "public", "uploads", "avatar", String(userID)),
      { recursive: true },
    );
    const extension = path.extname(img.name);

    const randomFileName = `${crypto.randomUUID()}${extension}`;

    const uploadDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      "avatar",
      String(userID),
    );

    await fs.mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, randomFileName);

    const arrayBuffer = await img.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    await fs.writeFile(filePath, buffer);

    fileUrl = `/uploads/avatar/${userID}/${randomFileName}`;
  }

  await prisma.user.update({
    where: {
      id: userID,
    },
    data: {
      name: body.firstName as string,
      lastname: body.lastName as string,
      bio: body.bio as string,
      avatarUrl: fileUrl ? fileUrl : null,
    },
  });

  return NextResponse.json(
    { message: "Zapisano zmiany" },
    {
      status: 200,
    },
  );
});
