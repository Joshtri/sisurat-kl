import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const payload = verifyToken(token);

  if (!payload || payload.role !== "LURAH") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const surat = await prisma.surat.findUnique({
      where: { id: params.id },
      include: {
        jenis: true,
        pemohon: {
          select: {
            id: true,
            username: true,
            email: true,
            profil: {
              include: {
                kartuKeluarga: {
                  select: {
                    alamat: true,
                    rt: true,
                    rw: true,
                    nomorKK: true,
                  },
                },
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

    return NextResponse.json({ data: surat }); // penting: wrap dalam { data: ... }
  } catch (error) {
    console.error("GET_SURAT_DETAIL_LURAH_ERROR", error);

    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}
