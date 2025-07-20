import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { message: "User ID wajib disediakan" },
        { status: 400 },
      );
    }

    const [totalSuratMasuk, totalSuratVerified, totalSuratRejected] =
      await Promise.all([
        prisma.surat.count({ where: { idPemohon: userId } }),
        prisma.surat.count({
          where: {
            idPemohon: userId,
            status: "DIVERIFIKASI_LURAH",
          },
        }),
        prisma.surat.count({
          where: {
            idPemohon: userId,
            status: {
              in: ["DITOLAK_STAFF", "DITOLAK_RT", "DITOLAK_LURAH"],
            },
          },
        }),
      ]);

    // 📊 Chart data
    const [suratByStatus, suratPerMonth] = await Promise.all([
      prisma.surat.groupBy({
        by: ["status"],
        where: { idPemohon: userId },
        _count: { _all: true },
      }),

      prisma.surat.groupBy({
        by: ["tanggalPengajuan"],
        where: {
          idPemohon: userId,
          tanggalPengajuan: { not: null },
          createdAt: {
            gte: new Date(new Date().getFullYear(), 0, 1),
          },
        },
        _count: { _all: true },
      }),
    ]);

    return NextResponse.json({
      totalSuratMasuk,
      totalSuratVerified,
      totalSuratRejected,
      chartData: {
        byStatus: suratByStatus.map((s) => ({
          status: s.status,
          count: s._count._all,
        })),
        perMonth: suratPerMonth.map((s) => ({
          month: new Date(s.tanggalPengajuan).toLocaleDateString("id-ID", {
            month: "short",
          }),
          count: s._count._all,
        })),
      },
    });
  } catch (error) {
    console.error("[API] Warga Dashboard error:", error);

    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}
