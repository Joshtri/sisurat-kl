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
            profil: true,
          },
        },
      },
    });

    const formatted = suratList.map((surat) => ({
      id: surat.id,
      noSurat: surat.noSurat ?? "-",
      jenisSurat: surat.jenis?.nama ?? "-",
      namaLengkap:
        surat.pemohon?.profil?.namaLengkap ??
        surat.namaLengkap ??
        surat.pemohon?.username ??
        "-",
      rt: surat.pemohon?.profil?.rt ?? "-",
      rw: surat.pemohon?.profil?.rw ?? "-",
      status: surat.status,
      tanggalPengajuan: surat.tanggalPengajuan,
    }));

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
      namaLengkap,
      nik,
      tempatTanggalLahir,
      jenisKelamin,
      agama,
      pekerjaan,
      alamat,
      noTelepon,
      alasanPengajuan,
      detailUsaha,
      detailKematian,
      detailAhliWaris,
    } = body;

    const surat = await prisma.surat.create({
      data: {
        idJenisSurat,
        idPemohon: userId,
        namaLengkap,
        nik,
        tempatTanggalLahir,
        jenisKelamin,
        agama,
        pekerjaan,
        alamat,
        noTelepon,
        alasanPengajuan,
        tanggalPengajuan: new Date(),
        status: "DIAJUKAN",
        ...(detailUsaha && {
          detailUsaha: {
            create: detailUsaha,
          },
        }),
        ...(detailKematian && {
          detailKematian: {
            create: detailKematian,
          },
        }),
        ...(detailAhliWaris && {
          detailAhliWaris: {
            create: detailAhliWaris,
          },
        }),
      },
    });

    return NextResponse.json({
      message: "Surat berhasil diajukan",
      data: surat,
    });
  } catch (error) {
    console.error("[POST /api/surat/create] error:", error);

    return NextResponse.json(
      { message: "Terjadi kesalahan saat membuat surat" },
      { status: 500 },
    );
  }
}
