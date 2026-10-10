import { roleChangeLimiter } from "@/lib/ratelimits/ratelimits";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/withAuth";
import { NextResponse } from "next/server";

export const PATCH = withAuth(async (user, request, context) => {
  const { boardId, uid } = await context.params;
  const { role } = await request.json();

  if (!role) {
    return NextResponse.json({ message: "Nie podano roli" }, { status: 400 });
  }

  const { success, reset } = await roleChangeLimiter.limit(
    `${user.userID}:${boardId}`,
  );

  if (!success) {
    return NextResponse.json(
      {
        message: "Zbyt wiele prób zmiany roli. Spróbuj ponownie później.",
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(
            Math.max(1, Math.ceil((reset - Date.now()) / 1000)),
          ),
        },
      },
    );
  }

  const boardMemeber = await prisma.boardMember.findFirst({
    where: {
      userId: Number(uid),
      boardId: Number(boardId),
    },
  });

  if (boardMemeber?.role === role) {
    return NextResponse.json(
      { message: "Użytkownik ma już tę rolę" },
      { status: 409 },
    );
  }

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
      { message: "Nie znaleziono tablicy z danym uzytkownikiem" },
      { status: 404 },
    );
  }

  const isOwner = await prisma.board.findFirst({
    where: {
      id: Number(boardId),
      ownerId: Number(uid),
    },
  });

  if (isOwner) {
    return NextResponse.json(
      {
        message: "Nie możesz zmienić roli właściciela tablicy.",
      },
      { status: 400 },
    );
  }

  const getMyRole = board.members.find(
    (el) => Number(el.userId) === Number(user.userID),
  );

  if (!["ADMIN", "OWNER"].includes(getMyRole?.role || " ")) {
    return NextResponse.json(
      {
        message: "Nie masz uprawnien do zmiany ról.",
      },
      { status: 403 },
    );
  }

  if (Number(uid) === Number(user.userID)) {
    return NextResponse.json(
      {
        message: "Nie możesz zmienić swojej roli.",
      },
      { status: 403 },
    );
  }

  await prisma.boardMember.update({
    where: {
      boardId_userId: {
        boardId: Number(boardId),
        userId: Number(uid),
      },
    },
    data: {
      role,
    },
  });

  return NextResponse.json({
    message: "Zmieniono rolę.",
  });
});
