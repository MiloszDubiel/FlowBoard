import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request) {
  try {
    const { lists } = await request.json();

    if (!Array.isArray(lists)) {
      return NextResponse.json(
        { error: "List musi być tablicaą" },
        { status: 400 },
      );
    }

    await prisma.$transaction(
      lists.map((list) =>
        prisma.list.update({
          where: {
            id: list.id,
          },
          data: {
            position: list.position,
          },
        }),
      ),
    );

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Reorder cards error:", error);

    return NextResponse.json(
      {
        error: "Failed to update cards",
      },
      {
        status: 500,
      },
    );
  }
}
