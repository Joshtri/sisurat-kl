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
    case "thisweek":
      // Minggu ini: dari Senin hingga sekarang
      const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, ...
      const daysFromMonday = currentDay === 0 ? 6 : currentDay - 1; // Handle Sunday
      startDate.setDate(now.getDate() - daysFromMonday);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
      break;
    case "lastweek":
      // Minggu lalu: Senin - Minggu minggu lalu
      const lastWeekDay = now.getDay();
      const daysFromLastMonday = lastWeekDay === 0 ? 6 : lastWeekDay - 1;
      startDate.setDate(now.getDate() - daysFromLastMonday - 7);
      startDate.setHours(0, 0, 0, 0);
      endDate.setDate(now.getDate() - daysFromLastMonday - 1);
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
    const filterType = searchParams.get("filterType"); // "jenis" or "status"
    const filterValue = searchParams.get("filterValue");

    if (!filterType || !filterValue) {
      return NextResponse.json(
        { message: "filterType dan filterValue harus disertakan" },
        { status: 400 },
      );
    }

    const { startDate, endDate } = getDateRange(period, customStart, customEnd);

    // Build base where clause
    const whereClause: any = {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    };

    // Add specific filter
    if (filterType === "status") {
      whereClause.status = filterValue;
    } else if (filterType === "jenis") {
      // Get jenis surat by name
      const jenisSurat = await prisma.jenisSurat.findFirst({
        where: { nama: filterValue },
      });

      if (!jenisSurat) {
        return NextResponse.json(
          { message: "Jenis surat tidak ditemukan" },
          { status: 404 },
        );
      }

      whereClause.idJenisSurat = jenisSurat.id;
    }

    // Get surat data with filter
    const suratData = await prisma.surat.findMany({
      where: whereClause,
      include: {
        jenis: true,
        pemohon: {
          include: {
            profil: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Format data
    const formattedData = suratData.map((surat) => ({
      id: surat.id,
      noSurat: surat.noSurat || "Belum ada nomor",
      jenis: surat.jenis?.nama || "-",
      pemohon: surat.pemohon?.profil?.namaLengkap || surat.pemohon?.username || "-",
      status: surat.status,
      tanggal: surat.createdAt,
    }));

    return NextResponse.json({
      filterType,
      filterValue,
      period,
      dateRange: {
        start: startDate,
        end: endDate,
      },
      total: formattedData.length,
      data: formattedData,
    });
  } catch (error) {
    console.error("Detail Laporan Error:", error);

    return NextResponse.json(
      {
        message: "Gagal mengambil detail data laporan",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
