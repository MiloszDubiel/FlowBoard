import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/withAuth";
import { profileSchema } from "@/schema/editUser.schema";
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { supabaseAdmin } from "@/lib/supabase-admin";

const imageTypes: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};
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

  let fileUrl: string | null = null;

  if (img) {
    const extension = path.extname((img as File).name).toLowerCase();
    const randomFileName = `${crypto.randomUUID()}${extension}`;

    const storagePath = `avatar/${userID}/${randomFileName}`;

    const allowedTypes = imageTypes;
    const contentType = allowedTypes[extension];

    const { data, error } = await supabaseAdmin.storage
      .from("FlowBOard")
      .upload(storagePath, Buffer.from(await (img as File).arrayBuffer()), {
        contentType,
        upsert: false,
      });

    if (error) {
      throw new Error(`Błąd uploadu: ${error.message}`);
    }

    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from("FlowBOard").getPublicUrl(data.path);

    fileUrl = publicUrl ? publicUrl : null;
  }

  await prisma.user.update({
    where: {
      id: userID,
    },
    data: {
      name: body.firstName as string,
      lastname: body.lastName as string,
      bio: body.bio as string,
      avatarUrl: fileUrl,
    },
  });

  return NextResponse.json(
    { message: "Zapisano zmiany" },
    {
      status: 200,
    },
  );
});
