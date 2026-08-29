import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request) {
  try {
    const { columnOrder } = await request.json();

    if (!Array.isArray(columnOrder)) {
      return NextResponse.json(
        { error: "columnOrder musi być tablicą" },
        { status: 400 },
      );
    }

    console.log(columnOrder.map((id, index) => console.log(id, index)));

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
}
