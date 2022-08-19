-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(45) NOT NULL,
    `lastname` VARCHAR(45) NOT NULL,
    `email` VARCHAR(45) NOT NULL,
    `password` TEXT NOT NULL,
    `phone` VARCHAR(45) NULL,
    `birthdate` DATE NULL,
    `nationality` VARCHAR(45) NOT NULL,
    `validated` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_id_key`(`id`),
    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `addresses` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `country` VARCHAR(45) NOT NULL,
    `address` VARCHAR(100) NOT NULL,
    `reference` VARCHAR(100) NULL,
    `city` VARCHAR(45) NOT NULL,
    `province` VARCHAR(45) NOT NULL,
    `postalcode` VARCHAR(45) NOT NULL,
    `userId` INTEGER NOT NULL,

    UNIQUE INDEX `addresses_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `carts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `status` ENUM('OPEN', 'PENDING', 'CLOSE') NOT NULL DEFAULT 'OPEN',
    `userId` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `carts_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cartItems` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `quantity` INTEGER NOT NULL,
    `size` ENUM('S', 'M', 'L', 'XL') NOT NULL DEFAULT 'M',
    `color` ENUM('BLACK', 'WHITE', 'RED', 'GREY') NOT NULL DEFAULT 'BLACK',
    `cartId` INTEGER NOT NULL,
    `productId` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `cartItems_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `addresses` ADD CONSTRAINT `addresses_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `carts` ADD CONSTRAINT `carts_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cartItems` ADD CONSTRAINT `cartItems_cartId_fkey` FOREIGN KEY (`cartId`) REFERENCES `carts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cartItems` ADD CONSTRAINT `cartItems_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`prod_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
