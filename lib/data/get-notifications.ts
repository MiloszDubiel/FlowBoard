"use server";

import { getCurrentUser } from "../auth/get-current-user";
import { prisma } from "../prisma";

export const getNotifications = async () => {
  const user: any = await getCurrentUser();

  return await prisma.notification.findMany({
    where: {
      userId: Number(user.userID),
    },
  });
};
