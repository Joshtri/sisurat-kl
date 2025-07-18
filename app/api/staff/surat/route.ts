// /app/api/staff/surat/route.ts
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const suratList = await prisma.surat.findMany({
      where: {
        status: "DIVERIFIKASI_RT",
      },
      orderBy: { createdAt: "desc" },
      include: {
        jenis: true,
        pemohon: {
          include: {
            profil: true,
          },
        },
      },
    });

    const formatted = suratList.map((surat) => ({
      id: surat.id,
      noSurat: surat.noSurat,
      jenisSurat: surat.jenis?.nama,
      namaLengkap: surat.namaLengkap ?? surat.pemohon?.profil?.namaLengkap,
      rt: surat.pemohon?.profil?.rt ?? "-",
      rw: surat.pemohon?.profil?.rw ?? "-",
      status: surat.status,
      tanggalPengajuan: surat.tanggalPengajuan,
    }));

    return NextResponse.json({ data: formatted });
  } catch (error) {
    console.error("GET /api/staff/surat error:", error);

    return NextResponse.json(
      { message: "Gagal memuat surat untuk staff" },
      { status: 500 },
    );
  }
}
