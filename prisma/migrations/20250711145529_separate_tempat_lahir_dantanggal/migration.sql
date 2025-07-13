/*
  Warnings:

  - You are about to drop the column `tempatTanggalLahir` on the `Warga` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Warga" DROP COLUMN "tempatTanggalLahir",
ADD COLUMN     "tanggalLahir" TIMESTAMP(3),
ADD COLUMN     "tempatLahir" TEXT;
