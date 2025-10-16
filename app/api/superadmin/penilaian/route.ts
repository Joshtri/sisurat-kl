import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    // Get all penilaian with surat details
    const [penilaianList, total] = await Promise.all([
      prisma.penilaian.findMany({
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
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
      }),
      prisma.penilaian.count(),
    ]);

    // Calculate statistics
    const stats = await prisma.penilaian.aggregate({
      _avg: {
        rating: true,
      },
      _count: {
        rating: true,
      },
    });

    // Rating distribution
    const distribution = await prisma.penilaian.groupBy({
      by: ["rating"],
      _count: {
        rating: true,
      },
    });

    const formattedData = penilaianList.map((p) => ({
      id: p.id,
      rating: p.rating,
      deskripsi: p.deskripsi,
      createdAt: p.createdAt,
      surat: {
        id: p.surat.id,
        noSurat: p.surat.noSurat,
        jenis: p.surat.jenis?.nama || "-",
        status: p.surat.status,
        tanggalPengajuan: p.surat.tanggalPengajuan,
      },
      pemohon: {
        nama: p.surat.pemohon?.profil?.namaLengkap || p.surat.pemohon?.username || "-",
        nik: p.surat.pemohon?.profil?.nik || "-",
      },
    }));

    return NextResponse.json({
      data: formattedData,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      statistics: {
        totalRating: stats._count.rating || 0,
        averageRating: stats._avg.rating || 0,
        distribution: distribution.map((d) => ({
          rating: d.rating,
          count: d._count.rating,
        })),
      },
    });
  } catch (error) {
    console.error("Get All Penilaian Error:", error);

    return NextResponse.json(
      {
        message: "Gagal mengambil data penilaian",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
