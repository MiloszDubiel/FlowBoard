import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { object } from "zod";

export async function PATCH(request: Request) {
  try {
    const { cards } = await request.json();

    const cardsArray = Object.entries(cards);

    if (!Array.isArray(cardsArray)) {
      return NextResponse.json(
        { error: "cardsArray musi być tablicą" },
        { status: 400 },
      );
    }

    await prisma.$transaction(
      cardsArray.flatMap(([listId, items]: any) =>
        items.map((el: any) =>
          prisma.card.update({
            where: {
              id: Number(el.id),
            },
            data: {
              listId: Number(listId),
            },
          }),
        ),
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
}
