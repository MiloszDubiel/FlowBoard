import { prisma } from "../prisma";
import { getCurrentUser } from "../auth/get-current-user";
import { AnyARecord } from "node:dns";

export const getProjects = async () => {
  const user: any = await getCurrentUser();

  return await prisma.project.findMany({
    where: {
      ownerId: user.userID,
    },
  });
};
