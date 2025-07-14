import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

// GET /api/notifications/rt
export async function GET(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  const payload = verifyToken(token ?? "");
  if (!token || payload?.role !== "RT")
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const rtProfile = await prisma.rTProfile.findUnique({
    where: { userId: payload.sub },
  });
  if (!rtProfile)
    return NextResponse.json(
      { message: "RT profile not found" },
      { status: 404 }
    );

  const surat = await prisma.surat.findMany({
    where: {
      status: "DIAJUKAN",
      pemohon: {
        profil: {
          rt: rtProfile.rt,
        },
      },
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
