// /app/api/rt/surat/route.ts

import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const payload = verifyToken(token);
  if (!payload || payload.role !== "RT") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const rtProfile = await prisma.rTProfile.findUnique({
    where: { userId: payload.sub },
  });

  if (!rtProfile?.rt) {
    return NextResponse.json(
      { message: "RT tidak ditemukan" },
      { status: 404 }
    );
  }

  const suratList = await prisma.surat.findMany({
    where: {
      pemohon: {
        profil: {
          rt: rtProfile.rt,
        },
      },
    },
    include: {
      jenis: true,
      pemohon: {
        select: {
          username: true,
          profil: {
            select: {
              namaLengkap: true,
              nik: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(suratList);
}
