-- AlterTable
ALTER TABLE `projects` ADD COLUMN `color` ENUM('bg-green-500', 'bg-blue-500', 'bg-red-500', 'bg-orange-500') NOT NULL DEFAULT 'bg-orange-500';
