import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ message: "Missing userId" }, { status: 400 });
    }

    const rtProfile = await prisma.rTProfile.findUnique({
      where: { userId },
    });

    if (!rtProfile) {
      return NextResponse.json(
        { message: "RT profile not found" },
        { status: 404 }
      );
    }

    const { rt } = rtProfile;

    const [totalWarga, totalSuratMasuk, totalSuratVerified] = await Promise.all(
      [
        // ✅ ambil warga yang kartu keluarganya RT-nya sama
        prisma.warga.count({
          where: {
            kartuKeluarga: {
              rt: rt,
            },
          },
        }),
        prisma.surat.count({
          where: {
            idRT: userId,
            status: "DIAJUKAN", // yang masih menunggu
          },
        }),
        prisma.surat.count({
          where: {
            idRT: userId,
            status: {
              in: ["DIVERIFIKASI_RT", "DITOLAK_RT"],
            },
          },
        }),
      ]
    );

    return NextResponse.json({
      totalWarga,
      totalSuratMasuk,
      totalSuratVerified,
    });
  } catch (error: any) {
    console.error("[API] Dashboard RT error:", error);
    return NextResponse.json(
      { message: "Gagal mengambil data dashboard RT", error: error.message },
      { status: 500 }
    );
  }
}
