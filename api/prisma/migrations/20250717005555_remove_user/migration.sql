/*
  Warnings:

  - You are about to drop the `TrajetUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `TrajetUser` DROP FOREIGN KEY `TrajetUser_trajetId_fkey`;

-- DropForeignKey
ALTER TABLE `TrajetUser` DROP FOREIGN KEY `TrajetUser_userId_fkey`;

-- DropTable
DROP TABLE `TrajetUser`;

-- DropTable
DROP TABLE `User`;
