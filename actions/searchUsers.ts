"use server";

import { prisma } from "@/lib/prisma";

export async function searchUsers(query: string) {
  const users = await prisma.user.findMany({
    where: {
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
    take: 10,
  });

  return users;
}
