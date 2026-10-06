import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { registerShema } from "@/schema/register.schem";
import { resetPasswordSchema } from "@/schema/resetPassword.schema";

export async function POST(request: Request) {
  const { token, userId, ...body } = await request.json();

  const result = resetPasswordSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ status: 400 });
  }

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(body.password, salt);

  const tokenRecord = await prisma.passwordResetToken.findFirst({
    where: {
      userId,
      tokenHash: token,
    },
    orderBy: {
      expiresAt: "desc",
    },
  });

  if (!token) {
    return NextResponse.json({ status: 403 });
  }

  try {
    await prisma.user.update({
      where: {
        id: tokenRecord?.userId,
      },
      data: {
        passwordHash: hash,
      },
    });

    await prisma.passwordResetToken.deleteMany({
      where: {
        userId,
      },
    });
  } catch (err) {
    console.log(err);
  }

  return NextResponse.json({ message: "Zresetowano hasło" }, { status: 200 });
}
