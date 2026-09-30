import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/withAuth";
import { accountSchema, profileSchema } from "@/schema/editUser.schema";
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export const PATCH = withAuth(async (user, request, context) => {
  const { body } = await request.json();

  const result = accountSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { message: "Niepoprawne dane" },
      {
        status: 400,
      },
    );
  }

  const checkIsExist = await prisma.user.findFirst({
    where: {
      email: body.email,
    },
  });

  if (checkIsExist) {
    return NextResponse.json(
      { message: "Zarezerwowany email" },
      {
        status: 409,
      },
    );
  }

  await prisma.user.update({
    where: {
      id: Number(user.userID),
    },
    data: {
      email: body.email,
    },
  });

  return NextResponse.json(
    { message: "Zapisano zmiany" },
    {
      status: 200,
    },
  );
});
