import { prisma } from "@/lib/prisma";

export const checkBoardMembership = async (userID: number, boardID: number) => {
  const board = await prisma.board.findFirst({
    where: {
      id: boardID,
      members: {
        some: {
          userId: userID,
        },
      },
    },
    include: {
      members: {
        where: {
          userId: userID,
        },
      },
    },
  });

  if (!board) return null;

  return {
    board,
    role: board.members[0]?.role,
  };
};

export const checkCardMembership = async (userID: number, cardID: number) => {
  const card = await prisma.cardMember.findFirst({
    where: {
      cardId: Number(cardID),
      userId: userID,
    },
  });

  if (!card) return null;

  return card;
};
