import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

// POST - Create penilaian
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { idSurat, rating, deskripsi } = body;

    // Validasi
    if (!idSurat) {
      return NextResponse.json(
        { message: "ID Surat harus disertakan" },
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

    // Cek apakah sudah ada penilaian
    const existingPenilaian = await prisma.penilaian.findUnique({
      where: { idSurat },
    });

    if (existingPenilaian) {
      // Update existing
      const updatedPenilaian = await prisma.penilaian.update({
        where: { idSurat },
        data: {
          rating,
          deskripsi: deskripsi || null,
        },
      });

      return NextResponse.json({
        message: "Penilaian berhasil diperbarui",
        data: updatedPenilaian,
      });
    } else {
      // Create new
      const newPenilaian = await prisma.penilaian.create({
        data: {
          idSurat,
          rating,
          deskripsi: deskripsi || null,
        },
      });

      return NextResponse.json(
        {
          message: "Penilaian berhasil disimpan",
          data: newPenilaian,
        },
        { status: 201 },
      );
    }
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

// GET - Get penilaian by surat ID
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

    const penilaian = await prisma.penilaian.findUnique({
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
    });

    if (!penilaian) {
      return NextResponse.json(
        { message: "Penilaian tidak ditemukan" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      data: penilaian,
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
