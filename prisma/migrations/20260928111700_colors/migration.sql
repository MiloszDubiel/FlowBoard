/*
  Warnings:

  - You are about to alter the column `color` on the `projects` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(4))` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `projects` MODIFY `color` ENUM('#3B82F6', '#8B5CF6', '#EC4899', '#EF4444', '#F97316', '#EAB308', '#22C55E', '#14B8A6', '#06B6D4', '#64748B') NOT NULL DEFAULT '#F97316';
