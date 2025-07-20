import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { userId: string } },
) {
  const { userId } = params;

  try {
    const warga = await prisma.warga.findUnique({
      where: { userId },
      include: {
        kartuKeluarga: {
          include: {
            anggota: true, // Ambil semua anggota keluarga
          },
        },
      },
    });

    if (!warga || !warga.kartuKeluarga) {
      return NextResponse.json(
        { message: "Data kartu keluarga tidak ditemukan" },
        { status: 404 },
      );
    }

    const anggota = warga.kartuKeluarga.anggota;

    const ayah = anggota.find((a) => a.peranDalamKK === "KEPALA_KELUARGA");
    const ibu = anggota.find((a) => a.peranDalamKK === "ISTRI");

    return NextResponse.json({
      // Data Orang Tua
      namaAyah: ayah?.namaLengkap || "",
      pekerjaanAyah: ayah?.pekerjaan || "",
      namaIbu: ibu?.namaLengkap || "",
      pekerjaanIbu: ibu?.pekerjaan || "",
      alamatOrtu: warga.kartuKeluarga.alamat || "",

      // Identitas Anak (user yang login)
      namaAnak: warga.namaLengkap,
      tanggalLahirAnak: warga.tanggalLahir,
      jenisKelaminAnak: warga.jenisKelamin,
    });
  } catch (error) {
    console.error("[GET_KK_PROFILE_ERROR]", error);

    return NextResponse.json(
      { message: "Terjadi kesalahan saat mengambil data" },
      { status: 500 },
    );
  }
}
