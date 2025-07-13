import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalUsers,
      totalSurat,
      suratDalamTinjauan,
      suratDitolak,
      suratDiterbitkan,
      suratHariIni,
      usersPerRole,
    ] = await Promise.all([
      prisma.user.count(),

      prisma.surat.count(),

      prisma.surat.count({
        where: {
          status: {
            in: [
              "DIAJUKAN",
              "DIVERIFIKASI_STAFF",
              "DIVERIFIKASI_RT",
              "DIVERIFIKASI_LURAH",
            ],
          },
        },
      }),

      prisma.surat.count({
        where: {
          status: {
            in: ["DITOLAK_STAFF", "DITOLAK_RT", "DITOLAK_LURAH"],
          },
        },
      }),

      prisma.surat.count({
        where: { status: "DITERBITKAN" },
      }),

      prisma.surat.count({
        where: {
          createdAt: {
            gte: today,
          },
        },
      }),

      prisma.user.groupBy({
        by: ["role"],
        _count: {
          role: true,
        },
      }),
    ]);

    const roleBreakdown: Record<string, number> = {};
    usersPerRole.forEach((item) => {
      roleBreakdown[item.role] = item._count.role;
    });

    const result = {
      totalUsers,
      totalSurat,
      pendingReview: suratDalamTinjauan,
      rejected: suratDitolak,
      published: suratDiterbitkan,
      submittedToday: suratHariIni,
      usersPerRole: roleBreakdown,
    };

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("[API] Dashboard error:", error);
    return NextResponse.json(
      {
        message: "Gagal mengambil data dashboard",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
