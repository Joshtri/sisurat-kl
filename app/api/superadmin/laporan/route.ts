import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

// Helper: Get date range based on period
function getDateRange(period: string, customStart?: string, customEnd?: string) {
  const now = new Date();
  let startDate = new Date();
  let endDate = new Date();

  switch (period) {
    case "today":
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
      break;
    case "week":
      startDate.setDate(now.getDate() - 7);
      startDate.setHours(0, 0, 0, 0);
      break;
    case "month":
      startDate.setMonth(now.getMonth() - 1);
      startDate.setHours(0, 0, 0, 0);
      break;
    case "3months":
      startDate.setMonth(now.getMonth() - 3);
      startDate.setHours(0, 0, 0, 0);
      break;
    case "6months":
      startDate.setMonth(now.getMonth() - 6);
      startDate.setHours(0, 0, 0, 0);
      break;
    case "year":
      startDate.setFullYear(now.getFullYear() - 1);
      startDate.setHours(0, 0, 0, 0);
      break;
    case "custom":
      if (customStart) startDate = new Date(customStart);
      if (customEnd) endDate = new Date(customEnd);
      break;
    default:
      // All time - set to very old date
      startDate = new Date("2020-01-01");
  }

  return { startDate, endDate };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "all";
    const customStart = searchParams.get("startDate") || undefined;
    const customEnd = searchParams.get("endDate") || undefined;

    const { startDate, endDate } = getDateRange(period, customStart, customEnd);

    // Build where clause for date filtering
    const dateFilter = {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    };

    // Parallel queries for better performance
    const [
      totalSurat,
      suratByStatus,
      suratByJenis,
      suratByRT,
      trendingJenis,
      suratDiterbitkan,
      suratDitolak,
      suratMenunggu,
      recentSurat,
      suratPerBulan,
    ] = await Promise.all([
      // Total surat dalam periode
      prisma.surat.count({ where: dateFilter }),

      // Surat berdasarkan status
      prisma.surat.groupBy({
        by: ["status"],
        where: dateFilter,
        _count: { _all: true },
      }),

      // Surat berdasarkan jenis
      prisma.surat.groupBy({
        by: ["idJenisSurat"],
        where: dateFilter,
        _count: { _all: true },
      }),

      // Surat berdasarkan RT (yang sudah diverifikasi RT)
      prisma.surat.groupBy({
        by: ["idRT"],
        where: {
          ...dateFilter,
          idRT: { not: null },
        },
        _count: { _all: true },
      }),

      // Top 5 jenis surat terbanyak (trending)
      prisma.surat.groupBy({
        by: ["idJenisSurat"],
        where: dateFilter,
        _count: { _all: true },
      }),

      // Surat diterbitkan
      prisma.surat.count({
        where: {
          ...dateFilter,
          status: "DITERBITKAN",
        },
      }),

      // Surat ditolak
      prisma.surat.count({
        where: {
          ...dateFilter,
          status: {
            in: ["DITOLAK_STAFF", "DITOLAK_RT", "DITOLAK_LURAH"],
          },
        },
      }),

      // Surat menunggu verifikasi
      prisma.surat.count({
        where: {
          ...dateFilter,
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

      // Recent surat (last 10)
      prisma.surat.findMany({
        where: dateFilter,
        include: {
          jenis: true,
          pemohon: {
            include: {
              profil: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),

      // Trend surat per bulan (last 12 months)
      prisma.$queryRaw<
        Array<{ month: string; count: number }>
      >`SELECT
          TO_CHAR(DATE_TRUNC('month', "createdAt"), 'YYYY-MM') as month,
          COUNT(*)::int as count
        FROM "Surat"
        WHERE "createdAt" >= NOW() - INTERVAL '12 months'
        GROUP BY DATE_TRUNC('month', "createdAt")
        ORDER BY month ASC`,
    ]);

    // Get jenis surat lookup
    const jenisLookup = await prisma.jenisSurat.findMany();
    const jenisMap = Object.fromEntries(jenisLookup.map((j) => [j.id, j]));

    // Get RT lookup
    const rtIds = suratByRT
      .map((r) => r.idRT)
      .filter((id): id is string => id !== null);
    const rtProfiles = await prisma.rTProfile.findMany({
      where: { userId: { in: rtIds } },
      include: { user: true },
    });
    const rtMap = Object.fromEntries(
      rtProfiles.map((rt) => [rt.userId, rt]),
    );

    // Format status breakdown
    const statusBreakdown = suratByStatus.map((item) => ({
      status: item.status,
      count: item._count._all,
    }));

    // Format jenis breakdown (sort by count desc)
    const jenisBreakdown = suratByJenis
      .map((item) => ({
        jenis: jenisMap[item.idJenisSurat]?.nama || "Tidak Diketahui",
        kode: jenisMap[item.idJenisSurat]?.kode || "-",
        count: item._count._all,
      }))
      .sort((a, b) => b.count - a.count);

    // Format RT breakdown (sort by count desc, take top 10)
    const rtBreakdown = suratByRT
      .map((item) => ({
        rt: rtMap[item.idRT!]?.namaLengkap || "Tidak Diketahui",
        rtNumber: rtMap[item.idRT!]?.rt || "-",
        count: item._count._all,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Format trending (sort by count desc, take top 5)
    const trending = trendingJenis
      .map((item) => ({
        jenis: jenisMap[item.idJenisSurat]?.nama || "Tidak Diketahui",
        kode: jenisMap[item.idJenisSurat]?.kode || "-",
        count: item._count._all,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Format recent surat
    const recentSuratFormatted = recentSurat.map((s) => ({
      id: s.id,
      jenis: s.jenis?.nama || "-",
      pemohon: s.pemohon?.profil?.namaLengkap || s.pemohon?.username || "-",
      status: s.status,
      tanggal: s.createdAt,
      noSurat: s.noSurat || "-",
    }));

    return NextResponse.json({
      period,
      dateRange: {
        start: startDate,
        end: endDate,
      },
      summary: {
        totalSurat,
        diterbitkan: suratDiterbitkan,
        ditolak: suratDitolak,
        menunggu: suratMenunggu,
      },
      statusBreakdown,
      jenisBreakdown,
      rtBreakdown,
      trending,
      recentSurat: recentSuratFormatted,
      trendPerBulan: suratPerBulan,
    });
  } catch (error) {
    console.error("Laporan Error:", error);

    return NextResponse.json(
      {
        message: "Gagal mengambil data laporan",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
