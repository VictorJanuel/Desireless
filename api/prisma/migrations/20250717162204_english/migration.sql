/*
  Warnings:

  - You are about to drop the column `nom` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `prenom` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `pseudo` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Lieu` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PointInteret` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Trajet` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TrajetUser` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `firstName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Trajet` DROP FOREIGN KEY `Trajet_lieuArriveeId_fkey`;

-- DropForeignKey
ALTER TABLE `Trajet` DROP FOREIGN KEY `Trajet_lieuDepartId_fkey`;

-- DropForeignKey
ALTER TABLE `TrajetUser` DROP FOREIGN KEY `TrajetUser_trajetId_fkey`;

-- DropForeignKey
ALTER TABLE `TrajetUser` DROP FOREIGN KEY `TrajetUser_userId_fkey`;

-- DropIndex
DROP INDEX `User_pseudo_key` ON `User`;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `nom`,
    DROP COLUMN `prenom`,
    DROP COLUMN `pseudo`,
    ADD COLUMN `firstName` VARCHAR(191) NOT NULL,
    ADD COLUMN `lastName` VARCHAR(191) NOT NULL,
    ADD COLUMN `username` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `Lieu`;

-- DropTable
DROP TABLE `PointInteret`;

-- DropTable
DROP TABLE `Trajet`;

-- DropTable
DROP TABLE `TrajetUser`;

-- CreateTable
CREATE TABLE `Place` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `latitude` DOUBLE NOT NULL,
    `longitude` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Route` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `departurePlaceId` INTEGER NOT NULL,
    `arrivalPlaceId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PointOfInterest` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `information` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RouteUser` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `routeId` INTEGER NOT NULL,

    UNIQUE INDEX `RouteUser_userId_routeId_key`(`userId`, `routeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `User_username_key` ON `User`(`username`);

-- AddForeignKey
ALTER TABLE `Route` ADD CONSTRAINT `Route_departurePlaceId_fkey` FOREIGN KEY (`departurePlaceId`) REFERENCES `Place`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Route` ADD CONSTRAINT `Route_arrivalPlaceId_fkey` FOREIGN KEY (`arrivalPlaceId`) REFERENCES `Place`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RouteUser` ADD CONSTRAINT `RouteUser_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RouteUser` ADD CONSTRAINT `RouteUser_routeId_fkey` FOREIGN KEY (`routeId`) REFERENCES `Route`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
