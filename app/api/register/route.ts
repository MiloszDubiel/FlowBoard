import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { registerShema } from "@/schema/register.schem";

export async function POST(request: Request) {
  const body = await request.json();

  const result = registerShema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ status: 400 });
  }
  const check = await prisma.user.findUnique({
    where: {
      email: body.email,
    },
  });

  if (check) {
    return NextResponse.json(
      { message: "Użytkownik już istnieje" },
      { status: 409 },
    );
  }

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(body.password, salt);

  await prisma.user.create({
    data: {
      name: body.name,
      email: body.email,
      password: hash,
    },
  });

  return NextResponse.json(
    { message: "Pomyślnie zarejestrowano" },
    { status: 201 },
  );
}
