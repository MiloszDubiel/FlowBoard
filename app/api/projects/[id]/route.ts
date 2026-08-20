import { withAuth } from "@/lib/withAuth";
import { NextResponse } from "next/server";
import { addProjectSchema } from "@/schema/addproject.schema";
import { prisma } from "@/lib/prisma";

export const PATCH = withAuth(async (user, request, { params }) => {
  const body = await request.json();
  const { id } = await params;

  const projectID = Number(id);

  const getproject = await prisma.project.findFirst({
    where: {
      id: projectID,
    },
  });

  if (getproject?.ownerId !== user.userID)
    return NextResponse.json({ message: "Brak uprawienień" }, { status: 403 });

  await prisma.project.update({
    where: { id: projectID },
    data: { name: body.name, description: body.description },
  });

  return NextResponse.json({});
});

export const DELETE = withAuth(async (user, request, { params }) => {
  const { id } = await params;

  const projectID = Number(id);

  const getProject = await prisma.project.findFirst({
    where: {
      id: projectID,
    },
  });

  if (getProject?.ownerId !== user.userID)
    return NextResponse.json({ message: "Brak uprawienień" }, { status: 403 });

  await prisma.project.delete({
    where: {
      id: projectID,
    },
  });

  return NextResponse.json({ message: "Usunięto projekt" }, { status: 200 });
});
