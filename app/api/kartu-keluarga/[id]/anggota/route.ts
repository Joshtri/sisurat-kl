import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const kkId = params.id;

    const anggota = await prisma.warga.findMany({
      where: {
        kartuKeluargaId: kkId,
      },
      select: {
        id: true,
        namaLengkap: true,
        nik: true,
        jenisKelamin: true,
        tanggalLahir: true,
        tempatLahir: true,
        pekerjaan: true,
        agama: true,
        statusHidup: true,
        peranDalamKK: true,
        statusPerkawinan: true,
        createdAt: true,
        updatedAt: true,
        kartuKeluarga: {
          select: {
            id: true,
            alamat: true,
            rt: true,
            rw: true,
            nomorKK: true,
          },
        },
        fileKk: true,
        fileKtp: true,
        foto: true,
        kepalaDariKK: true,
      },
      orderBy: {
        namaLengkap: "asc",
      },
    });

    return NextResponse.json(anggota);
  } catch (error: any) {
    console.error("GET ANGGOTA KK ERROR:", error);

    return NextResponse.json(
      { message: "Gagal mengambil data anggota KK", error: error.message },
      { status: 500 },
    );
  }
}
