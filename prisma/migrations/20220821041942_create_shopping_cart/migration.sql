/*
  Warnings:

  - You are about to drop the column `productId` on the `shopping_cart` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `shopping_cart` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id]` on the table `shopping_cart` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `shopping_cart` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `shopping_cart` DROP FOREIGN KEY `shopping_cart_productId_fkey`;

-- AlterTable
ALTER TABLE `shopping_cart` DROP COLUMN `productId`,
    DROP COLUMN `quantity`,
    ADD COLUMN `user_id` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `shoppingCartDetail` (
    `shoppingCartDetail_id` INTEGER NOT NULL AUTO_INCREMENT,
    `productId` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL DEFAULT 1,
    `shoppingCartCart_id` INTEGER NULL,

    UNIQUE INDEX `shoppingCartDetail_shoppingCartDetail_id_key`(`shoppingCartDetail_id`),
    PRIMARY KEY (`shoppingCartDetail_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `shopping_cart_user_id_key` ON `shopping_cart`(`user_id`);

-- AddForeignKey
ALTER TABLE `shoppingCartDetail` ADD CONSTRAINT `shoppingCartDetail_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`prod_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shoppingCartDetail` ADD CONSTRAINT `shoppingCartDetail_shoppingCartCart_id_fkey` FOREIGN KEY (`shoppingCartCart_id`) REFERENCES `shopping_cart`(`cart_id`) ON DELETE SET NULL ON UPDATE CASCADE;
