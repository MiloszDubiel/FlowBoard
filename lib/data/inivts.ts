import { prisma } from "../prisma";
import { getCurrentUser } from "../auth/get-current-user";

export const getInvits = async () => {
  const user: any = await getCurrentUser();

  if (!user?.userID) return null;

  return await prisma.boardInvite.findMany({
    where: {
      userId: user?.userID,
    },
    include: {
      board: {
        include: {
          project: {
            include: {
              owner: {
                omit: {
                  passwordHash: true,
                  id: true,
                },
              },
            },
          },
        },
      },
    },
  });
};

export type GetInvitsType = Awaited<ReturnType<typeof getInvits>>;
export type GetInvitType = GetInvitsType[];
