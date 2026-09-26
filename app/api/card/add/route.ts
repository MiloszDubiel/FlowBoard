import { Label } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/withAuth";
import { createCardSchema } from "@/schema/addcard.schema";
import { NextResponse } from "next/server";

const createLabels = async (
  label: Pick<Label, "color" | "name">,
  boardId: number,
) => {
  const newLabel = await prisma.label.create({
    data: {
      name: label.name,
      color: label.color,
      boardId: boardId,
    },
  });

  return newLabel.id;
};

export const POST = withAuth(async (user, request, context) => {
  const { listId, tasks, newLabels, ...body } = await request.json();

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

  const isHasPermission = list.board.members.find(
    (member) =>
      member.userId === user.userID && ["ADMIN", "OWNER"].includes(member.role),
  );

  const findOwnersOrAdmins = list.board.members.filter(
    (member) => member.role == "OWNER" || member.role == "ADMIN",
  );

  if (!isHasPermission) {
    return NextResponse.json(
      { message: "Nie masz dostępu do tego edycji boardu" },
      { status: 403 },
    );
  }
  const cardMembers = [
    ...new Set([
      ...userIds,
      ...findOwnersOrAdmins.map((member) => member.userId),
    ]),
  ];

  const boardMemberIds = new Set(
    list.board.members.map((member) => member.userId),
  );

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

  const tasksToCard = tasks.map(
    (task: { name: string; isCompleted: boolean }) => ({
      name: task.name,
      isCompleted: task.isCompleted,
    }),
  );

  const card = await prisma.card.create({
    data: {
      title,
      description,
      dueDate: dueDate ? new Date(dueDate) : null,
      priority,
      position,
      tasks: tasksToCard,
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
    },
    include: {
      list: true,
    },
  });

  if (newLabels?.length) {
    const labelsId = await Promise.all(
      newLabels.map((el: Pick<Label, "color" | "name">) =>
        createLabels(el, Number(list.boardId)),
      ),
    );

    await prisma.cardLabel.createMany({
      data: labelsId.map((labelId) => ({
        cardId: card.id,
        labelId: Number(labelId),
      })),
    });
  }

  await prisma.cardMember.createMany({
    data: cardMembers.map((userId) => ({
      cardId: card.id,
      userId,
    })),
  });

  return NextResponse.json(
    { message: "Utworzono", cardId: card.id },
    { status: 201 },
  );
});
