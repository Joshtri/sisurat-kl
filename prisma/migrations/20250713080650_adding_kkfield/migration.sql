/*
  Warnings:

  - A unique constraint covering the columns `[nik]` on the table `RTProfile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nik` to the `RTProfile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RTProfile" ADD COLUMN     "nik" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "RTProfile_nik_key" ON "RTProfile"("nik");
