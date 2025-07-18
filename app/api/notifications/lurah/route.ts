import { NextRequest, NextResponse } from "next/server";

import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/notifications/lurah
export async function GET(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  const payload = verifyToken(token ?? "");

  if (!token || payload?.role !== "LURAH")
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const surat = await prisma.surat.findMany({
    where: {
      status: "DIVERIFIKASI_STAFF",
    },
    include: {
      jenis: true,
      pemohon: {
        include: { profil: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(surat);
}
