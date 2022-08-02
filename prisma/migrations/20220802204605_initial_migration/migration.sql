-- CreateTable
CREATE TABLE `categories` (
    `cat_id` INTEGER NOT NULL AUTO_INCREMENT,
    `cat_name` VARCHAR(45) NOT NULL,
    `cat_desc` VARCHAR(100) NOT NULL,
    `cat_img` TEXT NOT NULL,

    UNIQUE INDEX `categories_cat_id_key`(`cat_id`),
    PRIMARY KEY (`cat_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Product` (
    `prod_id` INTEGER NOT NULL AUTO_INCREMENT,
    `prod_name` VARCHAR(100) NOT NULL,
    `prod_type` ENUM('MEN', 'WOMEN', 'KIDS') NOT NULL DEFAULT 'MEN',
    `prod_size` JSON NOT NULL,
    `prod_color` JSON NOT NULL,
    `prod_price` DECIMAL(10, 2) NOT NULL,
    `prod_topic` ENUM('MUSIC', 'SPORTS', 'URBAN') NOT NULL DEFAULT 'URBAN',
    `prod_designer` VARCHAR(45) NOT NULL,
    `prod_img` TEXT NOT NULL,

    UNIQUE INDEX `Product_prod_id_key`(`prod_id`),
    PRIMARY KEY (`prod_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
