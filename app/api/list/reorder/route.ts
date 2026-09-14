import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/withAuth";

export const PATCH = withAuth(async (user, request, context) => {
  try {
    const { columnOrder, boardId } = await request.json();

    const board = await prisma.board.findFirst({
      where: {
        id: Number(boardId),
        members: {
          some: {
            userId: Number(user.userID),
          },
        },
      },
      include: {
        members: true,
      },
    });

    if (!board) {
      return NextResponse.json(
        { message: "Nie znaleziono tablicy z danym uzytkownkiem" },
        { status: 404 },
      );
    }

    if (!Array.isArray(columnOrder)) {
      return NextResponse.json(
        { error: "columnOrder musi być tablicą" },
        { status: 400 },
      );
    }
    const findEditorRole = board.members.find(
      (el) => el.userId === Number(user.userID),
    );

    if (!["OWNER", "ADMIN"].includes(findEditorRole?.role || "")) {
      return NextResponse.json(
        {
          message: "Nie masz uprawnień do zmiany kolejnosci listy",
        },
        { status: 403 },
      );
    }

    await prisma.$transaction(
      columnOrder.map((id, index) =>
        prisma.list.update({
          where: {
            id: Number(id),
          },
          data: {
            position: index,
          },
        }),
      ),
    );

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Reorder lists error:", error);

    return NextResponse.json(
      {
        error: "Failed to update lists",
      },
      {
        status: 500,
      },
    );
  }
});
