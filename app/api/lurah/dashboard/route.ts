import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const now = new Date();
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    // 1. Jumlah surat menunggu persetujuan lurah
    const pending = await prisma.surat.count({
      where: {
        status: {
          in: ["DIVERIFIKASI_LURAH"],
        },
      },
    });

    // 2. Jumlah surat disetujui lurah hari ini
    const approvedToday = await prisma.surat.count({
      where: {
        status: "DITERBITKAN",
        tanggalVerifikasiLurah: {
          gte: startOfToday,
        },
      },
    });

    // 3. Total bulan ini
    const totalMonth = await prisma.surat.count({
      where: {
        createdAt: {
          gte: startOfMonth,
        },
      },
    });

    // 4. Total tahun ini
    const totalYear = await prisma.surat.count({
      where: {
        createdAt: {
          gte: startOfYear,
        },
      },
    });

    // 5. Daftar 5 surat menunggu verifikasi lurah
    const pendingSurat = await prisma.surat.findMany({
      where: {
        status: "DIVERIFIKASI_LURAH",
      },
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        jenis: true,
      },
    });

    const formattedPendingSurat = pendingSurat.map((s) => ({
      id: s.id,
      jenis: s.jenis.nama,
      keterangan: s.alasanPengajuan ?? "-",
      waktu: timeAgo(s.createdAt),
      prioritas: "Normal", // bisa disesuaikan nanti
    }));

    // 6. Statistik jumlah surat per jenis
    const grouped = await prisma.surat.groupBy({
      by: ["idJenisSurat"],
      _count: { _all: true },
    });

    const jenisMap = await prisma.jenisSurat.findMany();
    const jenisLookup = Object.fromEntries(jenisMap.map((j) => [j.id, j.nama]));

    const statPerJenis = grouped.map((item) => ({
      jenis: jenisLookup[item.idJenisSurat] ?? "Lainnya",
      total: item._count._all,
      trend: Math.floor(Math.random() * 21) - 10, // dummy trend +10%/-10%
    }));

    return NextResponse.json({
      pending,
      approvedToday,
      totalMonth,
      totalYear,
      pendingSurat: formattedPendingSurat,
      statPerJenis,
    });
  } catch (error) {
    console.error("[API] Lurah Dashboard error:", error);
    return NextResponse.json(
      { message: "Gagal memuat dashboard lurah", error: `${error}` },
      { status: 500 },
    );
  }
}

// Helper: Format waktu relatif (e.g., "2 jam lalu")
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
