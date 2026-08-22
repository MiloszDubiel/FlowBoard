import { prisma } from "../prisma";

export const getBoard = async (id: number, userID: number) => {
  return await prisma.board.findFirst({
    where: {
      projectId: id,
      ownerId: userID,
    },
    include: {
      lists: {
        orderBy: {
          position: "asc",
        },
        include: {
          cards: {
            orderBy: {
              position: "asc",
            },
          },
        },
      },
    },
  });
};
