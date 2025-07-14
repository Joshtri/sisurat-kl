import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ message: "Missing userId" }, { status: 400 });
    }

    const [menungguReview, sedangDiproses, totalSelesai] = await Promise.all([
      prisma.surat.count({
        where: {
          status: "DIVERIFIKASI_RT",
        },
      }),
      prisma.surat.count({
        where: {
          status: "DIVERIFIKASI_STAFF",
          idStaff: userId,
        },
      }),
      prisma.surat.count({
        where: {
          idStaff: userId,
          status: {
            in: ["DIVERIFIKASI_LURAH", "DITOLAK_LURAH", "DITERBITKAN"],
          },
          tanggalVerifikasiStaff: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
    ]);

    return NextResponse.json({
      menungguReview,
      sedangDiproses,
      totalSelesai,
    });
  } catch (error: any) {
    console.error("[API] Dashboard Staff error:", error);
    return NextResponse.json(
      { message: "Gagal mengambil data dashboard staff", error: error.message },
      { status: 500 }
    );
  }
}
