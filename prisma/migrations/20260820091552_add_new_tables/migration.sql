/*
  Warnings:

  - You are about to alter the column `color` on the `projects` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(1))` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `projects` MODIFY `color` ENUM('bg-green-500/10', 'bg-blue-500/10', 'bg-red-500/10', 'bg-orange-500/10') NOT NULL DEFAULT 'bg-orange-500/10';
