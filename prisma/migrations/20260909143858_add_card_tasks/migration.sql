-- AlterTable
ALTER TABLE `cards` ADD COLUMN `tasks` JSON NULL;

-- AlterTable
ALTER TABLE `comments` ADD COLUMN `fileName` VARCHAR(191) NULL,
    ADD COLUMN `fileUrl` VARCHAR(191) NULL;
