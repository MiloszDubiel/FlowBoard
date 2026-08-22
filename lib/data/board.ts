import { prisma } from "../prisma";
import { getCurrentUser } from "../auth/get-current-user";

export const getBoard = async (id: number, userID: number) => {
  const user: any = await getCurrentUser();

  if (user?.userID !== userID) return null;

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
