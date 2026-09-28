"use server";

import { prisma } from "../prisma";
import { getCurrentUser } from "../auth/get-current-user";

export const getProjects = async () => {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const projects = await prisma.project.findMany({
    where: {
      boards: {
        some: {
          members: {
            some: {
              userId: Number(user.userID),
            },
          },
        },
      },
    },

    include: {
      boards: {
        include: {
          lists: {
            include: {
              cards: {
                include: {
                  labels: {
                    include: { label: true },
                  },
                },
              },
            },
          },
          members: true,
        },
      },
    },
  });

  return projects.map((project) => {
    let totalTasks = 0;
    let completedTasks = 0;

    project.boards.forEach((board) => {
      board.lists.forEach((list) => {
        list.cards.forEach((card) => {
          const tasks = Array.isArray(card.tasks) ? card.tasks : [];

          totalTasks += tasks.length;

          completedTasks += tasks.filter(
            (task: any) => task.isCompleted === true,
          ).length;
        });
      });
    });

    const progress =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const members = project.boards[0].members.length;

    return {
      ...project,
      completedTasks,
      totalTasks,
      progress,
      members,
    };
  });
};
