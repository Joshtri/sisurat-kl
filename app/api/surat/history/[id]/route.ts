import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params;

  try {
    const surat = await prisma.surat.findUnique({
      where: { id },
      include: {
        jenis: true,
        pemohon: {
          select: {
            id: true,
            username: true,
            email: true,
            profil: {
              select: {
                namaLengkap: true,
                nik: true,
                // alamat: true,
                // rt: true,
                // rw: true,
                fileKk: true,
                fileKtp: true,
                jenisKelamin: true,
                tempatLahir: true,
                tanggalLahir: true,
                agama: true,
                pekerjaan: true,
                kartuKeluarga: {
                  select: {
                    rt: true,
                    rw: true,
                    alamat: true,
                  },
                },
                // noTelepon: true,
              },
            },
          },
        },
        rt: { select: { username: true } },
        staff: { select: { username: true } },
        lurah: { select: { username: true } },
      },
    });

    if (!surat) {
      return NextResponse.json(
        { message: "Surat tidak ditemukan" },
        { status: 404 },
      );
    }

    return NextResponse.json(surat);
  } catch (error) {
    console.error("[GET_SURAT_DETAIL_ERROR]", error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
