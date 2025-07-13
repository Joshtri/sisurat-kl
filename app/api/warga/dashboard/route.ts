// /app/api/warga/dashboard/route.ts
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

    // Hitung jumlah total surat dari user ini
    const [totalSuratMasuk, totalSuratVerified, totalSuratRejected] =
      await Promise.all([
        prisma.surat.count({ where: { idPemohon: userId } }),
        prisma.surat.count({
          where: {
            idPemohon: userId,
            status: "DITERBITKAN",
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

    return NextResponse.json({
      totalSuratMasuk,
      totalSuratVerified,
      totalSuratRejected,
    });
  } catch (error) {
    console.error("[API] Warga Dashboard error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
