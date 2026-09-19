import { prisma } from "../prisma";
import { getCurrentUser } from "../auth/get-current-user";
import { number } from "zod";

export const getBoard = async (projectId: number) => {
  const user = await getCurrentUser();

  if (!user) return null;

  return await prisma.board.findFirst({
    where: {
      project: {
        id: projectId,
      },
      members: {
        some: {
          userId: Number(user.userID),
        },
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
      members: true,
    },
  });
};

export const getBoardMembers = async (boardId: number) => {
  const user = await getCurrentUser();

  if (!user) return [];

  const board = await prisma.board.findFirst({
    where: {
      id: boardId,
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

  if (!user || !boardId || !cardId) return null;

  return prisma.card.findFirst({
    where: {
      list: {
        board: {
          id: boardId,
          members: {
            some: {
              userId: Number(user.userID),
            },
          },
        },
      },
      id: cardId,
    },
    include: {
      members: {
        include: {
          user: {
            omit: {
              passwordHash: true,
            },
          },
        },
      },

      attachments: true,
      list: {
        include: {
          board: {
            include: { members: true },
          },
        },
      },
      comments: {
        include: {
          user: true,
          commentAttachments: true,
        },
      },
    },
  });
};

export const getMyCards = async () => {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  return await prisma.card.findMany({
    where: {
      members: {
        some: {
          userId: Number(user.userID),
        },
      },
    },
    include: {
      list: {
        include: { board: true },
      },
      members: {
        include: {
          user: true,
        },
      },

      createdBy: true,
    },
    orderBy: {
      dueDate: "asc",
    },
  });
};
