/*
  Warnings:

  - You are about to drop the `AnggotaKeluarga` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProfilPengguna` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[kepalaKeluargaId]` on the table `KartuKeluarga` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "AnggotaKeluarga" DROP CONSTRAINT "AnggotaKeluarga_kartuKeluargaId_fkey";

-- DropForeignKey
ALTER TABLE "AnggotaKeluarga" DROP CONSTRAINT "AnggotaKeluarga_profilId_fkey";

-- DropForeignKey
ALTER TABLE "KartuKeluarga" DROP CONSTRAINT "KartuKeluarga_kepalaKeluargaId_fkey";

-- DropForeignKey
ALTER TABLE "ProfilPengguna" DROP CONSTRAINT "ProfilPengguna_userId_fkey";

-- DropTable
DROP TABLE "AnggotaKeluarga";

-- DropTable
DROP TABLE "ProfilPengguna";

-- CreateTable
CREATE TABLE "Warga" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "namaLengkap" TEXT NOT NULL,
    "nik" TEXT NOT NULL,
    "tempatTanggalLahir" TEXT,
    "jenisKelamin" "JenisKelamin" NOT NULL,
    "pekerjaan" TEXT,
    "agama" TEXT,
    "noTelepon" TEXT,
    "rt" TEXT,
    "rw" TEXT,
    "alamat" TEXT,
    "foto" TEXT,
    "statusHidup" "StatusHidup" NOT NULL DEFAULT 'HIDUP',
    "kartuKeluargaId" TEXT,
    "peranDalamKK" "PeranKeluarga",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Warga_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Warga_userId_key" ON "Warga"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Warga_nik_key" ON "Warga"("nik");

-- CreateIndex
CREATE UNIQUE INDEX "KartuKeluarga_kepalaKeluargaId_key" ON "KartuKeluarga"("kepalaKeluargaId");

-- AddForeignKey
ALTER TABLE "Warga" ADD CONSTRAINT "Warga_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Warga" ADD CONSTRAINT "Warga_kartuKeluargaId_fkey" FOREIGN KEY ("kartuKeluargaId") REFERENCES "KartuKeluarga"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KartuKeluarga" ADD CONSTRAINT "KartuKeluarga_kepalaKeluargaId_fkey" FOREIGN KEY ("kepalaKeluargaId") REFERENCES "Warga"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
