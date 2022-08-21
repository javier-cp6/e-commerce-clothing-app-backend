/*
  Warnings:

  - You are about to drop the `product` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `Product`;

-- CreateTable
CREATE TABLE `products` (
    `prod_id` INTEGER NOT NULL AUTO_INCREMENT,
    `prod_name` VARCHAR(100) NOT NULL,
    `prod_type` ENUM('MEN', 'WOMEN', 'KIDS') NOT NULL DEFAULT 'MEN',
    `prod_size` JSON NOT NULL,
    `prod_color` JSON NOT NULL,
    `prod_price` DECIMAL(10, 2) NOT NULL,
    `prod_topic` ENUM('MUSIC', 'SPORTS', 'URBAN') NOT NULL DEFAULT 'URBAN',
    `prod_designer` VARCHAR(45) NOT NULL,
    `prod_img` TEXT NOT NULL,

    UNIQUE INDEX `products_prod_id_key`(`prod_id`),
    PRIMARY KEY (`prod_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
