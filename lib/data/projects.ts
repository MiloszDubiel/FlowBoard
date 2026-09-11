"use server";

import { prisma } from "../prisma";
import { getCurrentUser } from "../auth/get-current-user";

export const getProjects = async () => {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  return await prisma.project.findMany({
    where: {
      ownerId: (user as any).userID,
    },
    include: {
      boards: {
        include: {
          lists: {
            include: {
              cards: true,
            },
          },
        },
      },
    },
  });
};
