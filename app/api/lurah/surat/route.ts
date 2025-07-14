import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth"; // pastikan fungsi ini ada

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await verifyToken(token);

    if (!user || user.role !== "LURAH") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const suratList = await prisma.surat.findMany({
      where: {
        status: "DIVERIFIKASI_STAFF",
      },
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

    const formatted = suratList.map((surat) => ({
      id: surat.id,
      noSurat: surat.noSurat,
      jenisSurat: surat.jenis?.nama,
      namaLengkap: surat.pemohon?.profil?.namaLengkap ?? surat.namaLengkap,
      rt: surat.pemohon?.profil?.rt ?? "-",
      rw: surat.pemohon?.profil?.rw ?? "-",
      status: surat.status,
      tanggalPengajuan: surat.tanggalPengajuan,
    }));

    return NextResponse.json({ data: formatted });
  } catch (error) {
    console.error("[API] /api/lurah/surat", error);
    return NextResponse.json(
      { message: "Gagal mengambil data surat untuk lurah" },
      { status: 500 }
    );
  }
}
