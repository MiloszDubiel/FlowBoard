import { prisma } from "../prisma";
import { getCurrentUser } from "../auth/get-current-user";

export const getCard = async (projectId: number, cardId: number) => {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  return await prisma.card.findFirst({
    where: {
      id: cardId,
      list: {
        board: {
          projectId: projectId,
        },
      },
    },
    include: {
      list: {
        include: {
          board: true,
        },
      },
      attachments: true,
      comments: true,

      members: {
        include: {
          user: {
            omit: {
              passwordHash: true,
            },
          },
        },
      },
    },
  });
};
