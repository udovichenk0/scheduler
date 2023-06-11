/*
  Warnings:

  - You are about to drop the `token` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `token` DROP FOREIGN KEY `Token_userId_fkey`;

-- DropTable
DROP TABLE `token`;

-- CreateTable
CREATE TABLE `task` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `status` ENUM('FINISHED', 'CANCELED', 'INPROGRESS') NOT NULL DEFAULT 'INPROGRESS',
    `start_date` DATETIME(3) NOT NULL,
    `user_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `task` ADD CONSTRAINT `task_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `user` RENAME INDEX `User_email_key` TO `user_email_key`;
