import { Board } from "@/generated/prisma/client";
import { checkBoardMembership } from "@/lib/auth/checkMembership";
import { checkBoardRole } from "@/lib/auth/checkRole";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/withAuth";
import { addListSchema } from "@/schema/addlist.schema";
import { NextResponse } from "next/server";

export const POST = withAuth(async (user, request, context) => {
  const { name, id } = await request.json();

  const result = addListSchema.safeParse({ name });

  if (!result.success) {
    return NextResponse.json({ message: "Niepoprawne dane" }, { status: 400 });
  }

  const board = await prisma.board.findFirst({
    where: {
      id: id,
      members: {
        some: {
          userId: user.userID,
        },
      },
    },
    include: {
      members: {
        where: {
          userId: user.userID,
        },
      },
    },
  });

  if (!board) {
    return NextResponse.json(
      { message: "Nie znaleziono tablicy z danym uzytkownkiem" },
      { status: 404 },
    );
  }

  const listByName = await prisma.list.findFirst({
    where: {
      boardId: Number(id),
      name,
    },
  });

  if (listByName) {
    return NextResponse.json(
      { message: "Lista o danej nazwie już istnieje" },
      { status: 409 },
    );
  }

  const lastList = await prisma.list.findFirst({
    where: {
      boardId: Number(id),
    },
    orderBy: {
      position: "desc",
    },
  });

  const role = await prisma.boardMember.findFirst({
    where: {
      userId: Number(user.userID),
    },
  });

  if (!["OWNER", "ADMIN"].includes(role?.role || "MEMBER")) {
    return NextResponse.json(
      {
        message: "Brak uprawnień",
      },
      { status: 403 },
    );
  }

  const list = await prisma.list.create({
    data: {
      board: {
        connect: {
          id: (board as any).id,
        },
      },
      name,
      position: lastList ? lastList.position + 1 : 0,
    },
  });
  return NextResponse.json(
    {
      message: "Dodano listę",
      list,
    },
    { status: 201 },
  );
});
