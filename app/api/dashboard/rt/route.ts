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
        { status: 404 },
      );
    }

    const { rt, rw } = rtProfile;

    const [
      totalWarga,
      totalKK,
      totalSuratMasuk,
      totalSuratVerified,
      totalSuratDitolak
    ] = await Promise.all([
      // Total warga di RT ini
      prisma.warga.count({
        where: {
          kartuKeluarga: {
            rt: rt,
          },
        },
      }),

      // Total Kartu Keluarga di RT ini
      prisma.kartuKeluarga.count({
        where: {
          rt: rt,
        },
      }),

      // Surat yang masih menunggu verifikasi RT
      prisma.surat.count({
        where: {
          pemohon: {
            profil: {
              kartuKeluarga: {
                rt: rt,
              },
            },
          },
          status: "DIAJUKAN",
        },
      }),

      // Surat yang sudah diverifikasi RT
      prisma.surat.count({
        where: {
          pemohon: {
            profil: {
              kartuKeluarga: {
                rt: rt,
              },
            },
          },
          status: "DIVERIFIKASI_RT",
        },
      }),

      // Surat yang ditolak RT
      prisma.surat.count({
        where: {
          pemohon: {
            profil: {
              kartuKeluarga: {
                rt: rt,
              },
            },
          },
          status: "DITOLAK_RT",
        },
      }),
    ]);

    // Rata-rata warga per KK
    const avgWargaPerKK = totalKK > 0 ? Math.round((totalWarga / totalKK) * 10) / 10 : 0;

    return NextResponse.json({
      wilayah: {
        rt: rt,
        rw: rw,
        namaRT: rtProfile.namaLengkap,
      },
      statistik: {
        totalWarga,
        totalKK,
        avgWargaPerKK,
        totalSuratMasuk,
        totalSuratVerified,
        totalSuratDitolak,
        totalSuratProses: totalSuratMasuk + totalSuratVerified + totalSuratDitolak,
      },
    });
  } catch (error: any) {
    console.error("[API] Dashboard RT error:", error);

    return NextResponse.json(
      { message: "Gagal mengambil data dashboard RT", error: error.message },
      { status: 500 },
    );
  }
}