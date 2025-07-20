import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");
  const payload = verifyToken(token ?? "");

  if (!token || !payload || payload.role !== "STAFF") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const suratId = params.id;

  try {
    const surat = await prisma.surat.findUnique({
      where: { id: suratId },
      include: {
        jenis: true,
        pemohon: {
          select: {
            id: true,
            username: true,
            email: true,
            numberWhatsApp: true,
            profil: {
              include: {
                kartuKeluarga: true,
              },
            },
          },
        },
      },
    });

    if (!surat) {
      return NextResponse.json(
        { message: "Surat tidak ditemukan" },
        { status: 404 },
      );
    }

    return NextResponse.json(surat);
  } catch (error) {
    console.error("GET_SURAT_DETAIL_STAFF_ERROR", error);

    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}
