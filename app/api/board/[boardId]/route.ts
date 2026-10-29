import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/withAuth";
import { NextResponse } from "next/server";

export const POST = withAuth(async (user, request, context) => {
  const { boardId } = await context.params;
  const { name } = await request.json();

  console.log(name);

  const board = await prisma.board.findFirst({
    where: {
      id: Number(boardId),
      ownerId: user.userID,
    },
  });

  if (!board) {
    return NextResponse.json(
      { message: "Nie znaleziono tablicy" },
      { status: 404 },
    );
  }

  if (typeof name !== "string" || name.trim() == "" || name.length === 0) {
    return NextResponse.json({ message: "Niepoprawne dane" }, { status: 409 });
  }

  await prisma.board.update({
    where: {
      id: Number(boardId),
      ownerId: user.userID,
    },
    data: {
      name,
    },
  });

  return NextResponse.json(
    {
      message: "Zmieniono nazwę",
    },
    { status: 200 },
  );
});
