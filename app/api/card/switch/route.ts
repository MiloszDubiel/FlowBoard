import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request) {
  try {
    const { lists } = await request.json();

    const operations = Object.entries(lists).flatMap(([column, cards]) =>
      (cards as any[]).map((card, index) =>
        prisma.card.update({
          where: {
            id: card.id,
          },
          data: {
            listId: Number(column),
            position: index,
          },
        }),
      ),
    );

    await prisma.$transaction(operations);

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
