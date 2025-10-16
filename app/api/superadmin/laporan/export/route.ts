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

// Helper: Convert to CSV
function convertToCSV(data: any[], headers: string[]): string {
  const headerRow = headers.join(",");
  const rows = data.map((row) =>
    headers.map((header) => {
      const value = row[header] ?? "";
      // Escape commas and quotes in CSV
      if (typeof value === "string" && (value.includes(",") || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(",")
  );

  return [headerRow, ...rows].join("\n");
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "all";
    const customStart = searchParams.get("startDate") || undefined;
    const customEnd = searchParams.get("endDate") || undefined;
    const format = searchParams.get("format") || "csv";

    const { startDate, endDate } = getDateRange(period, customStart, customEnd);

    // Build where clause for date filtering
    const dateFilter = {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    };

    // Get all surat data for export
    const suratData = await prisma.surat.findMany({
      where: dateFilter,
      include: {
        jenis: true,
        pemohon: {
          include: {
            profil: true,
          },
        },
        rt: {
          include: {
            RTProfile: true,
          },
        },
        staff: {
          include: {
            profil: true,
          },
        },
        lurah: {
          include: {
            profil: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Format data for export
    const exportData = suratData.map((surat) => ({
      "No Surat": surat.noSurat || "-",
      "Jenis Surat": surat.jenis?.nama || "-",
      "Kode Jenis": surat.jenis?.kode || "-",
      "Pemohon": surat.pemohon?.profil?.namaLengkap || surat.pemohon?.username || "-",
      "NIK Pemohon": surat.pemohon?.profil?.nik || "-",
      "Status": surat.status,
      "Tanggal Pengajuan": surat.tanggalPengajuan
        ? new Date(surat.tanggalPengajuan).toLocaleDateString("id-ID")
        : "-",
      "RT Verifikator": surat.rt?.RTProfile?.namaLengkap || "-",
      "Tanggal Verifikasi RT": surat.tanggalVerifikasiRT
        ? new Date(surat.tanggalVerifikasiRT).toLocaleDateString("id-ID")
        : "-",
      "Staff Verifikator": surat.staff?.profil?.namaLengkap || "-",
      "Tanggal Verifikasi Staff": surat.tanggalVerifikasiStaff
        ? new Date(surat.tanggalVerifikasiStaff).toLocaleDateString("id-ID")
        : "-",
      "Lurah Verifikator": surat.lurah?.profil?.namaLengkap || "-",
      "Tanggal Verifikasi Lurah": surat.tanggalVerifikasiLurah
        ? new Date(surat.tanggalVerifikasiLurah).toLocaleDateString("id-ID")
        : "-",
      "Alasan Pengajuan": surat.alasanPengajuan || "-",
      "Catatan Penolakan RT": surat.catatanPenolakanRT || "-",
      "Catatan Penolakan Staff": surat.catatanPenolakan || "-",
    }));

    if (format === "csv") {
      const headers = [
        "No Surat",
        "Jenis Surat",
        "Kode Jenis",
        "Pemohon",
        "NIK Pemohon",
        "Status",
        "Tanggal Pengajuan",
        "RT Verifikator",
        "Tanggal Verifikasi RT",
        "Staff Verifikator",
        "Tanggal Verifikasi Staff",
        "Lurah Verifikator",
        "Tanggal Verifikasi Lurah",
        "Alasan Pengajuan",
        "Catatan Penolakan RT",
        "Catatan Penolakan Staff",
      ];

      const csv = convertToCSV(exportData, headers);

      // Return CSV file
      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="laporan-surat-${period}-${new Date().toISOString().split("T")[0]}.csv"`,
        },
      });
    } else {
      // Return JSON format
      return NextResponse.json({
        period,
        dateRange: {
          start: startDate,
          end: endDate,
        },
        total: exportData.length,
        data: exportData,
      });
    }
  } catch (error) {
    console.error("Export Laporan Error:", error);

    return NextResponse.json(
      {
        message: "Gagal export data laporan",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
