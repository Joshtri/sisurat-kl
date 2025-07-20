import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ message: "Missing userId" }, { status: 400 });
    }

    // Data utama
    const [menungguReview, sedangDiproses, totalSelesai] = await Promise.all([
      prisma.surat.count({
        where: {
          status: "DIVERIFIKASI_RT",
        },
      }),
      prisma.surat.count({
        where: {
          status: "DIVERIFIKASI_STAFF",
          idStaff: userId,
        },
      }),
      prisma.surat.count({
        where: {
          idStaff: userId,
          status: {
            in: ["DIVERIFIKASI_LURAH", "DITOLAK_LURAH", "DITERBITKAN"],
          },
          tanggalVerifikasiStaff: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
    ]);

    // Data Chart 1: berdasarkan status
    const suratByStatus = await prisma.surat.groupBy({
      by: ["status"],
      where: {
        idStaff: userId,
      },
      _count: {
        _all: true,
      },
    });

    // Data Chart 2: berdasarkan bulan (per bulan surat diverifikasi staff)
    const suratPerMonth = await prisma.surat.groupBy({
      by: ["tanggalVerifikasiStaff"],
      where: {
        idStaff: userId,
        tanggalVerifikasiStaff: {
          not: null,
          gte: new Date(new Date().getFullYear(), 0, 1),
        },
      },
      _count: {
        _all: true,
      },
    });

    return NextResponse.json({
      menungguReview,
      sedangDiproses,
      totalSelesai,
      chartData: {
        byStatus: suratByStatus.map((item) => ({
          status: item.status,
          count: item._count._all,
        })),
        perMonth: suratPerMonth.map((item) => ({
          month: new Date(item.tanggalVerifikasiStaff).toLocaleDateString(
            "id-ID",
            {
              month: "short",
            },
          ),
          count: item._count._all,
        })),
      },
    });
  } catch (error: any) {
    console.error("[API] Dashboard Staff error:", error);

    return NextResponse.json(
      { message: "Gagal mengambil data dashboard staff", error: error.message },
      { status: 500 },
    );
  }
}
