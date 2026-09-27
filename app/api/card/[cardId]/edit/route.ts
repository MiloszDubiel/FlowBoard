import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/withAuth";
import { createCardSchema } from "@/schema/addcard.schema";
import { NextResponse } from "next/server";
import { Label } from "@/generated/prisma/client";

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

export const PATCH = withAuth(async (user, request, context) => {
  const { tasks, newLabels, selectedLabels, ...body } = await request.json();
  const { cardId } = await context.params;

  const result = createCardSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ message: "Niepoprawne dane" }, { status: 400 });
  }

  const uid: number = user.userID;

  const { title, description, priority, dueDate, userIds } = result.data;

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
        tasks: tasks,
      },
    });

    const existingLabels = await tx.cardLabel.findMany({
      where: {
        cardId: Number(cardId),
      },
    });

    const labelsToDelete = existingLabels.filter(
      (el) => !selectedLabels.includes(el.labelId),
    );

    //TU USUWAME TE KTORE SA ODZNACZONE
    if (labelsToDelete.length > 0) {
      await tx.cardLabel.deleteMany({
        where: {
          cardId: Number(cardId),
          labelId: {
            in: labelsToDelete.map((el) => el.labelId),
          },
        },
      });
    }

    //Tu ZANZNACZAM I POMIJAM TUPL:IKATY
    await tx.cardLabel.createMany({
      data: selectedLabels.map((id: number) => ({
        cardId: Number(cardId),
        labelId: Number(id),
      })),
      skipDuplicates: true,
    });

    if (newLabels?.length) {
      const labelsId = await Promise.all(
        newLabels.map((el: Pick<Label, "color" | "name">) =>
          createLabels(el, Number(card?.list.boardId)),
        ),
      );

      await tx.cardLabel.createMany({
        data: labelsId.map((labelId) => ({
          cardId: Number(cardId),
          labelId: Number(labelId),
        })),
        skipDuplicates: true,
      });
    }

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
