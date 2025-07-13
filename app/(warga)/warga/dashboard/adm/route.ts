// file: app/api/superadmin/dashboard/route.ts

import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [
      totalUsers,
      totalWarga,
      totalSurat,
      totalJenisSurat,
      usersByRole,
      suratByStatus,
      topJenisSurat,
      recentSurat,
      detailCounts,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.warga.count(),
      prisma.surat.count(),
      prisma.jenisSurat.count(),

      prisma.user.groupBy({
        by: ["role"],
        _count: true,
      }),

      prisma.surat.groupBy({
        by: ["status"],
        _count: true,
      }),

      prisma.surat.groupBy({
        by: ["idJenisSurat"],
        _count: true,
        orderBy: { _count: { id: "desc" } },
        take: 5,
      }),

      prisma.surat.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          jenis: true,
          pemohon: true,
        },
      }),

      Promise.all([
        prisma.detailSuratUsaha.count(),
        prisma.detailSuratKematian.count(),
        prisma.detailSuratAhliWaris.count(),
      ]),
    ]);

    return NextResponse.json({
      totalUsers,
      totalWarga,
      totalSurat,
      totalJenisSurat,

      usersByRole: usersByRole.map((u) => ({
        role: u.role,
        count: u._count,
      })),

      suratByStatus: suratByStatus.map((s) => ({
        status: s.status,
        count: s._count,
      })),

      topJenisSurat: await Promise.all(
        topJenisSurat.map(async (j) => {
          const jenis = await prisma.jenisSurat.findUnique({
            where: { id: j.idJenisSurat },
          });

          return {
            jenis: jenis?.nama || "-",
            count: j._count,
          };
        }),
      ),

      recentSurat: recentSurat.map((s) => ({
        id: s.id,
        jenis: s.jenis.nama,
        namaLengkap: s.namaLengkap,
        status: s.status,
        tanggal: s.tanggalPengajuan,
      })),

      detailCounts: {
        usaha: detailCounts[0],
        kematian: detailCounts[1],
        ahliWaris: detailCounts[2],
      },
    });
  } catch (error) {
    console.error("[GET /api/superadmin/dashboard]", error);

    return NextResponse.json(
      { message: "Gagal memuat data dashboard" },
      { status: 500 },
    );
  }
}
