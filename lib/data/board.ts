import { prisma } from "../prisma";

export const getBoard = async (id: number, userID: number) => {
  return await prisma.board.findFirst({
    where: {
      projectId: id,
      ownerId: userID,
    },
    include: {
      members: true,
      lists: {
        include: {
          cards: true,
        },
      },
      labels: true,
      activities: true,
    },
  });
};
