"use server";

import { cookies } from "next/headers";
import { verifyToken } from "../auth";
import { prisma } from "../prisma";

export const getCurrentUser = async () => {
  const cookiesStore = await cookies();
  const token = cookiesStore.get("token")?.value;

  if (!token) {
    return console.log("Brak tokena");
  }

  const user = await verifyToken(token);

  return user;
};

export const getCurrentUserData = async () => {
  const user: any = await getCurrentUser();

  return await prisma.user.findFirst({
    where: {
      id: user.userID,
    },
    omit: {
      passwordHash: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};
