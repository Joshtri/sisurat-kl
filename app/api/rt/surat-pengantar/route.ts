// app/api/rt/surat-pengantar/route.ts
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const payload = verifyToken(token);

  if (!payload || payload.role !== "RT") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    const suratList = await prisma.surat.findMany({
      where: {
        idRT: payload.sub, // ID RT dari token
        jenis: {
          nama: {
            contains: "pengantar", // optional, bisa hilangkan kalau ingin semua jenis
            mode: "insensitive",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        jenis: true,
        pemohon: {
          select: {
            id: true,
            email: true,
            username: true,
            profil: {
              select: {
                nama: true,
                nik: true,
                noTelepon: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ data: suratList });
  } catch (error) {
    console.error("GET_SURAT_PENGANTAR_RT_ERROR", error);

    return NextResponse.json(
      { message: "Gagal mengambil data surat pengantar" },
      { status: 500 },
    );
  }
}
