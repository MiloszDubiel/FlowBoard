import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/withAuth";
import { createCardSchema } from "@/schema/addcard.schema";
import { NextResponse } from "next/server";
export const POST = withAuth(async (user, request, context) => {
  const { listId, ...body } = await request.json();

  const result = createCardSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ message: "Niepoprawne dane" }, { status: 400 });
  }

  const { title, description, priority, dueDate, userIds } = result.data;

  const list = await prisma.list.findUnique({
    where: {
      id: Number(listId),
    },
    include: {
      board: {
        include: {
          members: true,
        },
      },
    },
  });

  if (!list) {
    return NextResponse.json(
      { message: "Lista nie istnieje" },
      { status: 404 },
    );
  }

  const isBoardMemberWithPermition = list.board.members.some(
    (member) =>
      member.userId === user.userID && ["ADMIN", "OWNER"].includes(member.role),
  );

  const findOwner = list.board.members.find((member) => member.role == "OWNER");
  const isOwner = list.board.ownerId === user.userID;

  if (!isBoardMemberWithPermition) {
    return NextResponse.json(
      { message: "Nie masz dostępu do tego edycji boardu" },
      { status: 403 },
    );
  }
  const boardMemberIds = new Set(
    list.board.members.map((member) => member.userId),
  );
  boardMemberIds.add(list.board.ownerId);

  const invalidUsers = userIds.filter(
    (userId: number) => !boardMemberIds.has(userId),
  );

  const lastCard = await prisma.card.findFirst({
    where: {
      listId: Number(listId),
    },
    orderBy: {
      position: "desc",
    },
  });
  const position = lastCard ? lastCard.position + 1 : 0;

  if (invalidUsers.length > 0) {
    return NextResponse.json(
      {
        message: "Niektórzy użytkownicy nie są członkami tego boardu",
        invalidUsers,
      },
      { status: 400 },
    );
  }

  const card = await prisma.card.create({
    data: {
      title,
      description,
      dueDate: dueDate ? new Date(dueDate) : null,
      createdById: user.id,
      position: position,
      list: {
        connect: {
          id: Number(listId),
        },
      },
      createdBy: {
        connect: {
          id: Number(user.userID),
        },
      },
      members: {
        create: userIds.map((userId: number) => ({
          userId,
        })),
      },
    },
  });

  return NextResponse.json(
    { message: "Utworzono", cardId: card.id },
    { status: 201 },
  );
});
