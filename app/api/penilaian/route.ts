import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { TahapPenilaian } from "@prisma/client";

// POST - Create penilaian per tahap
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { idSurat, tahapRole, rating, deskripsi } = body;

    // Validasi
    if (!idSurat) {
      return NextResponse.json(
        { message: "ID Surat harus disertakan" },
        { status: 400 },
      );
    }

    if (!tahapRole || !["RT", "STAFF", "LURAH"].includes(tahapRole)) {
      return NextResponse.json(
        { message: "Tahap role harus RT, STAFF, atau LURAH" },
        { status: 400 },
      );
    }

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { message: "Rating harus antara 1-5" },
        { status: 400 },
      );
    }

    // Cek apakah surat sudah DIVERIFIKASI_LURAH
    const surat = await prisma.surat.findUnique({
      where: { id: idSurat },
      select: { status: true },
    });

    if (!surat) {
      return NextResponse.json(
        { message: "Surat tidak ditemukan" },
        { status: 404 },
      );
    }

    if (surat.status !== "DIVERIFIKASI_LURAH") {
      return NextResponse.json(
        { message: "Penilaian hanya bisa diberikan untuk surat yang sudah diverifikasi lurah" },
        { status: 400 },
      );
    }

    // Cek apakah sudah ada penilaian untuk tahap ini
    const existingPenilaian = await prisma.penilaian.findUnique({
      where: {
        idSurat_tahapRole: {
          idSurat,
          tahapRole: tahapRole as TahapPenilaian,
        }
      },
    });

    if (existingPenilaian) {
      return NextResponse.json(
        { message: `Penilaian untuk tahap ${tahapRole} sudah diberikan sebelumnya` },
        { status: 400 },
      );
    }

    // Create new penilaian
    const newPenilaian = await prisma.penilaian.create({
      data: {
        idSurat,
        tahapRole: tahapRole as TahapPenilaian,
        rating,
        deskripsi: deskripsi || null,
      },
    });

    return NextResponse.json(
      {
        message: `Penilaian untuk tahap ${tahapRole} berhasil disimpan`,
        data: newPenilaian,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Penilaian Error:", error);

    return NextResponse.json(
      {
        message: "Gagal menyimpan penilaian",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

// GET - Get all penilaian for a surat (grouped by tahap)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const idSurat = searchParams.get("idSurat");

    if (!idSurat) {
      return NextResponse.json(
        { message: "ID Surat harus disertakan" },
        { status: 400 },
      );
    }

    const penilaianList = await prisma.penilaian.findMany({
      where: { idSurat },
      include: {
        surat: {
          include: {
            jenis: true,
            pemohon: {
              include: {
                profil: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      }
    });

    // Return array, bisa kosong jika belum ada penilaian
    return NextResponse.json({
      data: penilaianList,
    });
  } catch (error) {
    console.error("Get Penilaian Error:", error);

    return NextResponse.json(
      {
        message: "Gagal mengambil penilaian",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
