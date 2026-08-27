import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/withAuth";
import { addListSchema } from "@/schema/addlist.schema";
import { NextResponse } from "next/server";

export const PATCH = withAuth(async (user, request, context) => {
  const { name } = await request.json();
  const { listId } = await context.params;

  const result = addListSchema.safeParse({ name });

  if (!result.success) {
    return NextResponse.json({ message: "Niepoprawne dane" }, { status: 400 });
  }

  const listIdNumber = Number(listId);

  const listById = await prisma.list.findFirst({
    where: {
      id: listIdNumber,
      board: {
        ownerId: user.userID,
      },
    },
  });

  if (!listById) {
    return NextResponse.json(
      { message: "Nie znaleziono listy" },
      { status: 404 },
    );
  }

  const list = await prisma.list.update({
    where: {
      id: listIdNumber,
    },
    data: {
      name: result.data.name,
    },
  });

  return NextResponse.json(
    {
      message: "Edytowano listę",
      list,
    },
    { status: 200 },
  );
});

export const DELETE = withAuth(async (user, request, context) => {
  const { listId } = await context.params;

  const listIdNumber = Number(listId);

  const listById = await prisma.list.findFirst({
    where: {
      id: listIdNumber,
      board: {
        ownerId: user.userID,
      },
    },
  });

  if (!listById) {
    return NextResponse.json(
      { message: "Nie znaleziono listy" },
      { status: 404 },
    );
  }

  const list = await prisma.list.delete({
    where: {
      id: listIdNumber,
    },
  });

  return NextResponse.json(
    {
      message: "Usunięto listę",
      list,
    },
    { status: 200 },
  );
});
