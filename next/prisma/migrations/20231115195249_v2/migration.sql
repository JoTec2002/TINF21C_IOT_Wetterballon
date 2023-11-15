/*
  Warnings:

  - Added the required column `source` to the `image` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `image` ADD COLUMN `source` VARCHAR(191) NOT NULL;
