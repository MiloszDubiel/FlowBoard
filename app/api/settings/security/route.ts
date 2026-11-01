import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/withAuth";
import { NextResponse } from "next/server";
import { resetPasswordSchema } from "@/schema/resetPassword.schema";
import bcrypt from "bcryptjs";

export const PATCH = withAuth(async (user, request, context) => {
  const { body } = await request.json();

  const result = resetPasswordSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { message: "Nieprawidłowe dane" },
      {
        status: 400,
      },
    );
  }

  const userData = await prisma.user.findUnique({
    where: {
      id: Number(user.userID),
    },
  });

  const compare = await bcrypt.compare(
    body.currentPassword,
    userData?.passwordHash || "",
  );

  if (!compare) {
    return NextResponse.json(
      { message: "Niepoprawne stare hasło" },
      {
        status: 400,
      },
    );
  }

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(body.password, salt);

  await prisma.user.update({
    where: {
      id: Number(user.userID),
    },
    data: {
      passwordHash: hash,
    },
  });

  return NextResponse.json(
    { message: "Zapisano zmiany" },
    {
      status: 200,
    },
  );
});
