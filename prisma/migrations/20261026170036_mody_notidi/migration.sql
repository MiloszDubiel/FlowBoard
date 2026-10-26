/*
  Warnings:

  - Changed the type of `type` on the `Notification` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('BOARD_INVITATION', 'CARD_ASSIGNED', 'CARD_COMMENT', 'CARD_UPDATED', 'LIST_UPDATED', 'MEMBER_ADDED');

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isRead" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "link" TEXT,
DROP COLUMN "type",
ADD COLUMN     "type" "NotificationType" NOT NULL;
