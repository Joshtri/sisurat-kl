import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
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

    const surat = await prisma.surat.findUnique({
      where: { id: params.id },
      include: {
        jenis: true,
        pemohon: {
          include: { profil: true },
        },
        detailUsaha: true,
        detailKematian: true,
        detailAhliWaris: true,
      },
    });

    if (!surat) {
      return NextResponse.json(
        { message: "Surat tidak ditemukan" },
        { status: 404 },
      );
    }

    return NextResponse.json({ data: surat });
  } catch (error) {
    console.error("[API] /api/lurah/surat/[id]", error);

    return NextResponse.json(
      {
        message: "Gagal mengambil detail surat",
        error: (error as any).message,
      },
      { status: 500 },
    );
  }
}
