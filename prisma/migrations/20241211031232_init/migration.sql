-- CreateTable
CREATE TABLE `User` (
    `id_user` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'KASIR', 'MANAJER') NOT NULL DEFAULT 'ADMIN',
    `unalived` BOOLEAN NOT NULL DEFAULT false,
    `image` VARCHAR(191) NULL,

    UNIQUE INDEX `User_username_key`(`username`),
    PRIMARY KEY (`id_user`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Meja` (
    `id_meja` VARCHAR(191) NOT NULL,
    `nomor_meja` INTEGER NOT NULL,
    `isVacant` BOOLEAN NOT NULL DEFAULT true,
    `destructed` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `Meja_nomor_meja_key`(`nomor_meja`),
    PRIMARY KEY (`id_meja`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Menu` (
    `id_menu` VARCHAR(191) NOT NULL,
    `nama_menu` VARCHAR(191) NOT NULL,
    `jenis` ENUM('MAKANAN', 'MINUMAN') NOT NULL,
    `deskripsi` VARCHAR(191) NOT NULL,
    `gambar` VARCHAR(191) NOT NULL,
    `harga` INTEGER NOT NULL,
    `isPerished` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `Menu_nama_menu_key`(`nama_menu`),
    PRIMARY KEY (`id_menu`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Outlet` (
    `id_outlet` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `longitude` DOUBLE NOT NULL,
    `latitude` DOUBLE NOT NULL,

    PRIMARY KEY (`id_outlet`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Transaksi` (
    `id_transaksi` VARCHAR(191) NOT NULL,
    `tgl_transaksi` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `id_user` VARCHAR(191) NOT NULL,
    `id_meja` VARCHAR(191) NOT NULL,
    `nama_pelanggan` VARCHAR(191) NOT NULL,
    `status` ENUM('LUNAS', 'BELUM_BAYAR', 'CANCELED', 'EXPIRED') NOT NULL DEFAULT 'BELUM_BAYAR',
    `id_outlet` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_transaksi`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Detail Transaksi` (
    `id_detail_transaksi` VARCHAR(191) NOT NULL,
    `id_transaksi` VARCHAR(191) NOT NULL,
    `id_menu` VARCHAR(191) NOT NULL,
    `harga` INTEGER NOT NULL,
    `qty` INTEGER NOT NULL,
    `totalHarga` BIGINT NOT NULL,

    PRIMARY KEY (`id_detail_transaksi`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Transaksi` ADD CONSTRAINT `Transaksi_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `User`(`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaksi` ADD CONSTRAINT `Transaksi_id_meja_fkey` FOREIGN KEY (`id_meja`) REFERENCES `Meja`(`id_meja`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaksi` ADD CONSTRAINT `Transaksi_id_outlet_fkey` FOREIGN KEY (`id_outlet`) REFERENCES `Outlet`(`id_outlet`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Detail Transaksi` ADD CONSTRAINT `Detail Transaksi_id_transaksi_fkey` FOREIGN KEY (`id_transaksi`) REFERENCES `Transaksi`(`id_transaksi`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Detail Transaksi` ADD CONSTRAINT `Detail Transaksi_id_menu_fkey` FOREIGN KEY (`id_menu`) REFERENCES `Menu`(`id_menu`) ON DELETE RESTRICT ON UPDATE CASCADE;
