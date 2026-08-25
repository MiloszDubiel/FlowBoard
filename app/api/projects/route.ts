import { withAuth } from "@/lib/withAuth";
import { NextResponse } from "next/server";
import { addProjectSchema } from "@/schema/addproject.schema";
import { prisma } from "@/lib/prisma";

export const POST = withAuth(async (user, request) => {
  const body = await request.json();

  const result = addProjectSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ message: "Błędne dane" }, { status: 400 });
  }

  const creatorID = user.userID;

  const { name, description } = result.data;

  await prisma.$transaction(async (tx) => {
    const project = await tx.project.create({
      data: {
        name,
        description,
        ownerId: user.userID,
      },
    });

    const board = await tx.board.create({
      data: {
        name: "Główny",
        projectId: project.id,
        ownerId: user.userID,

        members: {
          create: {
            userId: creatorID,
            role: "OWNER",
          },
        },
      },
    });

    return {
      project,
      board,
    };
  });

  return NextResponse.json({ message: "Utworzono projekt" }, { status: 201 });
});

export const GET = withAuth(async (user, request) => {
  const creatorID = user.userID;

  try {
    const projects = await prisma.project.findMany({
      where: {
        ownerId: creatorID,
      },
    });
    return NextResponse.json(projects, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ status: 404 });
  }
});
