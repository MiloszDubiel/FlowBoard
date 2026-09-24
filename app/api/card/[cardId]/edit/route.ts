import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/withAuth";
import { createCardSchema } from "@/schema/addcard.schema";
import { NextResponse } from "next/server";
import { use } from "react";
export const PATCH = withAuth(async (user, request, context) => {
  const { tasks, ...body } = await request.json();
  const { cardId } = await context.params;

  const result = createCardSchema.safeParse(body);


  if (!result.success) {
    return NextResponse.json({ message: "Niepoprawne dane" }, { status: 400 });
  }

  const uid: number = user.userID;

  const { title, description, priority, dueDate, userIds } = result.data;

  console.log(dueDate);

  const card = await prisma.card.findFirst({
    where: {
      id: Number(cardId),
    },
    include: {
      list: true,
    },
  });

  const boardMemebrship = await prisma.boardMember.findFirst({
    where: {
      userId: uid,
      boardId: Number(card?.list.boardId),
    },
  });

  if (!boardMemebrship) {
    return NextResponse.json(
      { message: "Nie jesteś członkiem tablicy" },
      { status: 403 },
    );
  }

  const cardMembership = await prisma.cardMember.findFirst({
    where: {
      userId: uid,
      cardId: Number(cardId),
    },
  });

  if (!cardMembership) {
    return NextResponse.json(
      { message: "Nie masz uprawnien do teej tablicy" },
      { status: 403 },
    );
  }

  if (!["OWNER", "ADMIN"].includes(boardMemebrship.role)) {
    return NextResponse.json(
      { message: "Nie masz uprawnien do edychi karty" },
      { status: 403 },
    );
  }

  const updatedTasks = [
    ...(card?.tasks as []).filter(
      (task: any) => !tasks.some((newTask: any) => newTask.name === task.name),
    ),
    ...tasks,
  ];

  //MUSZA BYC ADMINI I OWNER
  const permittedUsers = await prisma.boardMember.findMany({
    where: {
      boardId: Number(card?.list.boardId),
      role: {
        in: ["OWNER", "ADMIN"],
      },
    },
  });

  const permittedUserIds = permittedUsers.map((member) => member.userId);

  const finalUserIds = [...new Set([...permittedUserIds, ...userIds])];

  await prisma.$transaction(async (tx) => {
    await tx.card.update({
      where: {
        id: Number(cardId),
      },
      data: {
        title,
        description,
        priority,

        dueDate: dueDate ? new Date(dueDate) : null,
        tasks: updatedTasks,
      },
    });

    await tx.cardMember.deleteMany({
      where: {
        cardId: Number(cardId),
      },
    });

    await tx.cardMember.createMany({
      data: finalUserIds.map((userId) => ({
        cardId: Number(cardId),
        userId,
      })),
      skipDuplicates: true,
    });
  });

  return NextResponse.json(
    { message: "Zmieniono dane karty" },
    { status: 200 },
  );
});
