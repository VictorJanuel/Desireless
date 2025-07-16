-- CreateTable
CREATE TABLE `Lieu` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `latitude` DOUBLE NOT NULL,
    `longitude` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Trajet` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `lieuDepartId` INTEGER NOT NULL,
    `lieuArriveeId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PointInteret` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `information` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NOT NULL,
    `prenom` VARCHAR(191) NOT NULL,
    `pseudo` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `User_pseudo_key`(`pseudo`),
    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TrajetUser` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `trajetId` INTEGER NOT NULL,

    UNIQUE INDEX `TrajetUser_userId_trajetId_key`(`userId`, `trajetId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Trajet` ADD CONSTRAINT `Trajet_lieuDepartId_fkey` FOREIGN KEY (`lieuDepartId`) REFERENCES `Lieu`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Trajet` ADD CONSTRAINT `Trajet_lieuArriveeId_fkey` FOREIGN KEY (`lieuArriveeId`) REFERENCES `Lieu`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TrajetUser` ADD CONSTRAINT `TrajetUser_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TrajetUser` ADD CONSTRAINT `TrajetUser_trajetId_fkey` FOREIGN KEY (`trajetId`) REFERENCES `Trajet`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
