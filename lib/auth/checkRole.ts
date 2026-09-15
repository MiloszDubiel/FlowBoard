import { prisma } from "@/lib/prisma";

export const checkBoardRole = (board: any, userID: number) => {
  const findEditorRole = board?.members.find((el: any) => el.userId === userID);

  if (!["OWNER", "ADMIN"].includes(findEditorRole?.role || "")) {
    return false;
  }

  return true;
};

export const checkCardRole = (card: any, userID: number) => {
  const findEditorRole = card?.members.find((el: any) => el.userId === userID);

  if (!["OWNER", "ADMIN"].includes(findEditorRole?.role || "")) {
    return false;
  }

  return true;
};
