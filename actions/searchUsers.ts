"use server";

import { getCurrentUser } from "@/lib/auth/get-current-user";
import { prisma } from "@/lib/prisma";

export async function searchUsers(query: string) {
  const user: any = await getCurrentUser();

  const users = await prisma.user.findMany({
    where: {
      id: {
        not: user.userID,
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
    include: {
      boardInvites: true,
    },
    take: 10,
  });

  return users;
}
