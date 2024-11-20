-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'KASIR', 'MANAJER');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('BELUM_BAYAR', 'LUNAS');

-- CreateEnum
CREATE TYPE "Jenis" AS ENUM ('MAKANAN', 'MINUMAN');

-- CreateTable
CREATE TABLE "User" (
    "id_user" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'ADMIN',
    "unalived" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id_user")
);

-- CreateTable
CREATE TABLE "Meja" (
    "id_meja" TEXT NOT NULL,
    "nomor_meja" INTEGER NOT NULL,
    "isVacant" BOOLEAN NOT NULL DEFAULT true,
    "destructed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Meja_pkey" PRIMARY KEY ("id_meja")
);

-- CreateTable
CREATE TABLE "Menu" (
    "id_menu" TEXT NOT NULL,
    "nama_menu" TEXT NOT NULL,
    "jenis" "Jenis" NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "gambar" TEXT NOT NULL,
    "harga" INTEGER NOT NULL,
    "isPerished" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Menu_pkey" PRIMARY KEY ("id_menu")
);

-- CreateTable
CREATE TABLE "Transaksi" (
    "id_transaksi" TEXT NOT NULL,
    "tgl_transaksi" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_user" TEXT NOT NULL,
    "id_meja" TEXT NOT NULL,
    "nama_pelanggan" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'BELUM_BAYAR',

    CONSTRAINT "Transaksi_pkey" PRIMARY KEY ("id_transaksi")
);

-- CreateTable
CREATE TABLE "Detail Transaksi" (
    "id_detail_transaksi" TEXT NOT NULL,
    "id_transaksi" TEXT NOT NULL,
    "id_menu" TEXT NOT NULL,
    "harga" INTEGER NOT NULL,
    "qty" INTEGER NOT NULL,
    "totalHarga" BIGINT NOT NULL,

    CONSTRAINT "Detail Transaksi_pkey" PRIMARY KEY ("id_detail_transaksi")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Meja_nomor_meja_key" ON "Meja"("nomor_meja");

-- CreateIndex
CREATE UNIQUE INDEX "Menu_nama_menu_key" ON "Menu"("nama_menu");

-- AddForeignKey
ALTER TABLE "Transaksi" ADD CONSTRAINT "Transaksi_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaksi" ADD CONSTRAINT "Transaksi_id_meja_fkey" FOREIGN KEY ("id_meja") REFERENCES "Meja"("id_meja") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Detail Transaksi" ADD CONSTRAINT "Detail Transaksi_id_transaksi_fkey" FOREIGN KEY ("id_transaksi") REFERENCES "Transaksi"("id_transaksi") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Detail Transaksi" ADD CONSTRAINT "Detail Transaksi_id_menu_fkey" FOREIGN KEY ("id_menu") REFERENCES "Menu"("id_menu") ON DELETE RESTRICT ON UPDATE CASCADE;
