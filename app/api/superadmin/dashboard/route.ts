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
      recentActivities,
      suratByJenis,
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
        where: { status: "DIVERIFIKASI_LURAH" }, // surat yang sudah diterbitkan
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
        _count: { role: true },
      }),

      prisma.surat.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { jenis: true },
      }),

      prisma.surat.groupBy({
        by: ["idJenisSurat"],
        _count: { _all: true },
      }),
    ]);

    const roleBreakdown = Object.fromEntries(
      usersPerRole.map((item) => [item.role, item._count.role]),
    );

    const jenisLookup = await prisma.jenisSurat.findMany();
    const jenisMap = Object.fromEntries(jenisLookup.map((j) => [j.id, j.nama]));

    return NextResponse.json({
      stats: {
        totalUsers,
        totalSurat,
        pendingReview: suratDalamTinjauan,
        rejected: suratDitolak,
        published: suratDiterbitkan,
        submittedToday: suratHariIni,
        usersPerRole: roleBreakdown,
      },
      recentActivities: recentActivities.map((s) => ({
        id: s.id,
        jenis: s.jenis?.nama ?? "-",
        nama: s.namaLengkap,
        status: s.status,
        waktu: timeAgo(s.createdAt),
      })),
      chartData: suratByJenis.map((item) => ({
        label: jenisMap[item.idJenisSurat] ?? "Lainnya",
        value: item._count._all,
      })),
    });
  } catch (error) {
    console.error("Dashboard Superadmin Error:", error);

    return NextResponse.json(
      { message: "Gagal mengambil data dashboard", error: `${error}` },
      { status: 500 },
    );
  }
}

// Helper: Format waktu relatif
function timeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return "Baru saja";
  if (diffMin < 60) return `${diffMin} menit lalu`;
  const diffJam = Math.floor(diffMin / 60);

  if (diffJam < 24) return `${diffJam} jam lalu`;
  const diffHari = Math.floor(diffJam / 24);

  return `${diffHari} hari lalu`;
}
