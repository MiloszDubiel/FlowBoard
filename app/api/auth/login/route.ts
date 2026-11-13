import { NextResponse } from "next/server";
import { loginSchema } from "@/schema/login.schema";
import { createToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

const isDemo = process.env.IS_DEMO === "1";

export async function POST(request: Request) {
  const body = await request.json();

  const result = loginSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ status: 400 });
  }

  const { email, password } = body;

  const user = await prisma.user.findFirst({
    where: { email },
  });

  if (!user) {
    return NextResponse.json(
      { message: "Użytkownik nie istnieje" },
      { status: 400 },
    );
  }

  const compare = await bcrypt.compare(password, user.passwordHash || "");

  if (!compare) {
    return NextResponse.json(
      { message: "Niepoprawny email lub hasło" },
      { status: 400 },
    );
  }

  if (isDemo && !user?.isDemo) {
    return NextResponse.json(
      { message: "Nie możesz się zalogować na tym koncie w wersji demo" },
      { status: 403 },
    );
  }

  const token = await createToken(user.id);

  const response = NextResponse.json({ message: "Zalogowano", user });

  response.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 1000 * 15,
  });

  return response;
}
