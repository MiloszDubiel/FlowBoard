-- DropForeignKey
ALTER TABLE "cards" DROP CONSTRAINT "cards_createdById_fkey";

-- AddForeignKey
ALTER TABLE "cards" ADD CONSTRAINT "cards_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
