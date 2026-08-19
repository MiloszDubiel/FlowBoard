import { NextResponse } from "next/server";
import { withAuth } from "@/lib/withAuth";
import { prisma } from "@/lib/prisma";

export const GET = withAuth(async (user, request) => {
  const loggedUser = await prisma.user.findFirst({
    select: {
      email: true,
      name: true,
      id: true,
    },
    where: {
      id: user.userID,
    },
  });

  return NextResponse.json({ user: loggedUser });
});
