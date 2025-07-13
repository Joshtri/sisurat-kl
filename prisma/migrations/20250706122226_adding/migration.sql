-- CreateEnum
CREATE TYPE "Role" AS ENUM ('WARGA', 'RT', 'STAFF', 'LURAH', 'SUPERADMIN');

-- CreateEnum
CREATE TYPE "JenisKelamin" AS ENUM ('LAKI_LAKI', 'PEREMPUAN');

-- CreateEnum
CREATE TYPE "StatusHidup" AS ENUM ('HIDUP', 'MENINGGAL');

-- CreateEnum
CREATE TYPE "StatusSurat" AS ENUM ('DIAJUKAN', 'DIVERIFIKASI_STAFF', 'DITOLAK_STAFF', 'DIVERIFIKASI_LURAH', 'DITOLAK_LURAH', 'DITERBITKAN');

-- CreateEnum
CREATE TYPE "PeranKeluarga" AS ENUM ('KEPALA_KELUARGA', 'ISTRI', 'ANAK', 'ORANG_TUA', 'FAMILI_LAINNYA');

-- CreateTable
CREATE TABLE "JenisSurat" (
    "id" TEXT NOT NULL,
    "kode" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "deskripsi" TEXT,
    "aktif" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "JenisSurat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'WARGA',
    "rememberToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfilPengguna" (
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
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProfilPengguna_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KartuKeluarga" (
    "id" TEXT NOT NULL,
    "nomorKK" TEXT NOT NULL,
    "kepalaKeluargaId" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "rt" TEXT,
    "rw" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KartuKeluarga_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnggotaKeluarga" (
    "id" TEXT NOT NULL,
    "kartuKeluargaId" TEXT NOT NULL,
    "profilId" TEXT NOT NULL,
    "peran" "PeranKeluarga" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AnggotaKeluarga_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Surat" (
    "id" TEXT NOT NULL,
    "idJenisSurat" TEXT NOT NULL,
    "idPemohon" TEXT NOT NULL,
    "noTelepon" TEXT,
    "noSurat" TEXT,
    "namaLengkap" TEXT NOT NULL,
    "jenisKelamin" "JenisKelamin" NOT NULL,
    "tempatTanggalLahir" TEXT NOT NULL,
    "nik" TEXT NOT NULL,
    "agama" TEXT,
    "pekerjaan" TEXT,
    "alamat" TEXT,
    "alasanPengajuan" TEXT,
    "status" "StatusSurat" NOT NULL DEFAULT 'DIAJUKAN',
    "tanggalPengajuan" TIMESTAMP(3),
    "idStaff" TEXT,
    "tanggalVerifikasiStaff" TIMESTAMP(3),
    "idLurah" TEXT,
    "tanggalVerifikasiLurah" TIMESTAMP(3),
    "catatanPenolakan" TEXT,
    "fileSuratTerbit" TEXT,
    "fileKtp" TEXT,
    "fileKk" TEXT,
    "noSuratPengantar" TEXT,
    "fileSuratPengantar" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Surat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DetailSuratUsaha" (
    "id" TEXT NOT NULL,
    "suratId" TEXT NOT NULL,
    "jenisUsaha" TEXT NOT NULL,
    "namaUsaha" TEXT NOT NULL,
    "alamatUsaha" TEXT NOT NULL,
    "fotoUsaha" TEXT,

    CONSTRAINT "DetailSuratUsaha_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DetailSuratKematian" (
    "id" TEXT NOT NULL,
    "suratId" TEXT NOT NULL,
    "namaAyah" TEXT NOT NULL,
    "namaIbu" TEXT NOT NULL,
    "tanggalKematian" TIMESTAMP(3) NOT NULL,
    "tempatKematian" TEXT NOT NULL,
    "sebabKematian" TEXT NOT NULL,
    "fileSuratKematian" TEXT,

    CONSTRAINT "DetailSuratKematian_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DetailSuratAhliWaris" (
    "id" TEXT NOT NULL,
    "suratId" TEXT NOT NULL,
    "namaAlmarhum" TEXT NOT NULL,
    "tanggalMeninggal" TIMESTAMP(3) NOT NULL,
    "alamatTerakhir" TEXT NOT NULL,
    "hubunganDenganAlmarhum" TEXT NOT NULL,
    "dataAhliWaris" JSONB,
    "dataIstri" JSONB,
    "dataAnak" JSONB,
    "dataSaksi" JSONB,
    "fileAktaKematian" TEXT,
    "fileKtpAhliWaris" JSONB,
    "fileAktaLahirAhliWaris" JSONB,
    "fileKtpSaksi" JSONB,

    CONSTRAINT "DetailSuratAhliWaris_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "JenisSurat_kode_key" ON "JenisSurat"("kode");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ProfilPengguna_userId_key" ON "ProfilPengguna"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ProfilPengguna_nik_key" ON "ProfilPengguna"("nik");

-- CreateIndex
CREATE UNIQUE INDEX "KartuKeluarga_nomorKK_key" ON "KartuKeluarga"("nomorKK");

-- CreateIndex
CREATE UNIQUE INDEX "Surat_noSurat_key" ON "Surat"("noSurat");

-- CreateIndex
CREATE UNIQUE INDEX "DetailSuratUsaha_suratId_key" ON "DetailSuratUsaha"("suratId");

-- CreateIndex
CREATE UNIQUE INDEX "DetailSuratKematian_suratId_key" ON "DetailSuratKematian"("suratId");

-- CreateIndex
CREATE UNIQUE INDEX "DetailSuratAhliWaris_suratId_key" ON "DetailSuratAhliWaris"("suratId");

-- AddForeignKey
ALTER TABLE "ProfilPengguna" ADD CONSTRAINT "ProfilPengguna_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KartuKeluarga" ADD CONSTRAINT "KartuKeluarga_kepalaKeluargaId_fkey" FOREIGN KEY ("kepalaKeluargaId") REFERENCES "ProfilPengguna"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnggotaKeluarga" ADD CONSTRAINT "AnggotaKeluarga_kartuKeluargaId_fkey" FOREIGN KEY ("kartuKeluargaId") REFERENCES "KartuKeluarga"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnggotaKeluarga" ADD CONSTRAINT "AnggotaKeluarga_profilId_fkey" FOREIGN KEY ("profilId") REFERENCES "ProfilPengguna"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Surat" ADD CONSTRAINT "Surat_idJenisSurat_fkey" FOREIGN KEY ("idJenisSurat") REFERENCES "JenisSurat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Surat" ADD CONSTRAINT "Surat_idPemohon_fkey" FOREIGN KEY ("idPemohon") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Surat" ADD CONSTRAINT "Surat_idStaff_fkey" FOREIGN KEY ("idStaff") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Surat" ADD CONSTRAINT "Surat_idLurah_fkey" FOREIGN KEY ("idLurah") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetailSuratUsaha" ADD CONSTRAINT "DetailSuratUsaha_suratId_fkey" FOREIGN KEY ("suratId") REFERENCES "Surat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetailSuratKematian" ADD CONSTRAINT "DetailSuratKematian_suratId_fkey" FOREIGN KEY ("suratId") REFERENCES "Surat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetailSuratAhliWaris" ADD CONSTRAINT "DetailSuratAhliWaris_suratId_fkey" FOREIGN KEY ("suratId") REFERENCES "Surat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
