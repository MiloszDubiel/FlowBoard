import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/withAuth";
import { addListSchema } from "@/schema/addlist.schema";
import { NextResponse } from "next/server";
import { z } from "zod";

export const POST = withAuth(async (user, request, context) => {
  const { name, id } = await request.json();

  const result = addListSchema.safeParse({ name });

  if (!result.success) {
    return NextResponse.json({ message: "Niepoprawne dane" }, { status: 400 });
  }

  const board = await prisma.board.findFirst({
    where: {
      id: Number(id),
      ownerId: user.userID,
    },
  });

  if (!board) {
    return NextResponse.json(
      { message: "Nie znaleziono tablicy" },
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

  const list = await prisma.list.create({
    data: {
      boardId: board.id,
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
