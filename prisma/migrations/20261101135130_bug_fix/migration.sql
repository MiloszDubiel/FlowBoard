-- DropForeignKey
ALTER TABLE "BoardInvite" DROP CONSTRAINT "BoardInvite_boardId_fkey";

-- DropForeignKey
ALTER TABLE "BoardInvite" DROP CONSTRAINT "BoardInvite_userId_fkey";

-- DropForeignKey
ALTER TABLE "boards" DROP CONSTRAINT "boards_ownerId_fkey";

-- AddForeignKey
ALTER TABLE "boards" ADD CONSTRAINT "boards_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoardInvite" ADD CONSTRAINT "BoardInvite_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "boards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoardInvite" ADD CONSTRAINT "BoardInvite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
