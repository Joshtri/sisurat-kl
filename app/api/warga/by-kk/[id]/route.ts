// app/api/warga/by-kk/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params;

  if (!id) {
    return NextResponse.json(
      {
        success: false,
        message: "Parameter kartuKeluargaId wajib diisi",
        data: null,
      },
      { status: 400 },
    );
  }

  try {
    const anggota = await prisma.warga.findMany({
      where: {
        kartuKeluargaId: id,
      },
      select: {
        id: true,
        userId: true,
        namaLengkap: true,
        nik: true,
        tempatLahir: true,
        tanggalLahir: true,
        jenisKelamin: true,
        pekerjaan: true,
        agama: true,
        foto: true,
        statusHidup: true,
        statusPerkawinan: true,
        fileKtp: true,
        fileKk: true,
        peranDalamKK: true,
        kartuKeluargaId: true,
        createdAt: true,
        updatedAt: true,
        kartuKeluarga: {
          select: {
            id: true,
            alamat: true,
            rt: true,
            rw: true,
          },
        },
      },
      orderBy: {
        namaLengkap: "asc",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Berhasil mengambil anggota keluarga",
        data: anggota,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[GET WARGA BY KK ERROR]", error);

    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan server", data: null },
      { status: 500 },
    );
  }
}
