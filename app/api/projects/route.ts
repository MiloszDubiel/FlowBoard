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

  await prisma.board.create({
    data: {
      ownerId: creatorID,
      name,
      description,
    },
  });

  return NextResponse.json({ message: "Utworzono projekt" }, { status: 201 });
});
