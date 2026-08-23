"use server";

import { getCurrentUser } from "@/lib/auth/get-current-user";
import { prisma } from "@/lib/prisma";

export async function searchUsers(query: string, boardId: number) {
  const user: any = await getCurrentUser();

  const users = await prisma.user.findMany({
    where: {
      id: {
        not: user.userID,
      },

      memberships: {
        none: {
          boardId,
        },
      },

      OR: [
        {
          name: {
            contains: query,
          },
        },
        {
          email: {
            contains: query,
          },
        },
      ],
    },

    select: {
      id: true,
      name: true,
      email: true,
    },

    take: 10,
  });

  return users;
}
