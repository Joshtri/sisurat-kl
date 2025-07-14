import { verifyToken } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/notifications/staff
export async function GET(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  const payload = verifyToken(token ?? "");
  if (!token || payload?.role !== "STAFF")
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const surat = await prisma.surat.findMany({
    where: {
      status: "DIVERIFIKASI_RT",
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
