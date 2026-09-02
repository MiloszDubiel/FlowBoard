import { prisma } from "../prisma";
import { getCurrentUser } from "../auth/get-current-user";

export const getBoard = async (projectId: number) => {
  const user = await getCurrentUser();

  if (!user) return null;

  return prisma.board.findFirst({
    where: {
      ownerId: Number(user.userID),
      project: {
        id: projectId,
      },
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

            include: {
              attachments: true,
              createdBy: true,
            },
          },
        },
      },
    },
  });
};

export const getBoardMembers = async (boardId: number) => {
  const user = await getCurrentUser();

  if (!user) return [];

  const board = await prisma.board.findFirst({
    where: {
      id: boardId,
      ownerId: Number(user.userID),
    },
  });

  if (!board) return [];

  return prisma.boardMember.findMany({
    where: {
      boardId: board.id,
    },
    include: {
      user: {
        omit: {
          passwordHash: true,
        },
      },
    },
  });
};

export const getBoardLists = async (boardId: number) => {
  const user = await getCurrentUser();

  if (!user) return [];

  return prisma.list.findMany({
    where: {
      boardId,
      board: {
        ownerId: Number(user.userID),
      },
    },
    orderBy: {
      position: "asc",
    },
  });
};

export const getBoardCards = async (boardId: number) => {
  const user = await getCurrentUser();

  if (!user) return [];

  return prisma.card.findMany({
    where: {
      list: {
        board: {
          id: boardId,
          ownerId: Number(user.userID),
        },
      },
    },
    orderBy: {
      position: "asc",
    },
  });
};

export const getCard = async (cardId: number, boardId: number) => {
  const user = await getCurrentUser();

  if (!user) return [];

  return prisma.card.findFirst({
    where: {
      list: {
        board: {
          id: boardId,
          ownerId: Number(user.userID),
        },
      },
      id: cardId,
    },
    include: {
      members: {
        include: {
          user: true,
        },
      },
      attachments: true,
      comments: {
        include: {
          user: true,
        },
      },
    },
  });
};
