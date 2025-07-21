import { NextResponse, NextRequest } from "next/server";

import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const suratList = await prisma.surat.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        jenis: true,
        pemohon: {
          include: {
            profil: {
              include: {
                kartuKeluarga: true,
              },
            },
          },
        },
      },
    });

    const formatted = suratList.map((surat) => {
      const profil = surat.pemohon?.profil;
      const kk = profil?.kartuKeluarga;

      return {
        id: surat.id,
        noSurat: surat.noSurat ?? "-",
        jenisSurat: surat.jenis?.nama ?? "-",
        namaLengkap:
          profil?.namaLengkap ??
          // surat.namaLengkap ??
          surat.pemohon?.username ??
          "-",
        nik: profil?.nik ?? "-",
        jenisKelamin:
          profil?.jenisKelamin === "LAKI_LAKI"
            ? "Laki-laki"
            : profil?.jenisKelamin === "PEREMPUAN"
              ? "Perempuan"
              : "-",
        alamat: kk?.alamat ?? "-",
        rt: kk?.rt ?? "-",
        rw: kk?.rw ?? "-",
        status: surat.status,
        tanggalPengajuan: surat.tanggalPengajuan,
      };
    });

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("GET /api/surat error:", error);

    return NextResponse.json(
      {
        message: "Gagal mengambil data surat",
        error:
          typeof error === "object" && error !== null && "message" in error
            ? (error as { message: string }).message
            : String(error),
      },
      { status: 500 },
    );
  }
}

// File: app/api/surat/create/route.ts

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    const userId = decoded?.sub;

    if (!userId) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const body = await req.json();

    const {
      idJenisSurat,
      alasanPengajuan,
      dataSurat, // untuk data tambahan (misalnya usaha, kematian, dst)
    } = body;

    const created = await prisma.surat.create({
      data: {
        idJenisSurat,
        idPemohon: userId,
        alasanPengajuan,
        tanggalPengajuan: new Date(),
        status: "DIAJUKAN",
        dataSurat: dataSurat, // flexible, bisa null kalau tidak ada
      },
    });

    return NextResponse.json({
      message: "Surat berhasil diajukan",
      data: created,
    });
  } catch (error) {
    console.error("[POST /api/surat/create] error:", error);

    return NextResponse.json(
      { message: "Terjadi kesalahan saat membuat surat" },
      { status: 500 },
    );
  }
}
