import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth"; // atau apapun yang kamu pakai untuk decode token

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const payload = verifyToken(token);

  if (!payload || payload.role !== "RT") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // cari RT profile-nya dulu
    const rtProfile = await prisma.rTProfile.findUnique({
      where: { userId: payload.sub },
    });

    if (!rtProfile || !rtProfile.rt) {
      return NextResponse.json(
        { message: "RT tidak ditemukan" },
        { status: 404 }
      );
    }

    const wargaList = await prisma.warga.findMany({
      where: {
        kartuKeluarga: {
          rt: rtProfile.rt,
        },
      },
      include: {
        kartuKeluarga: {
          select: {
            nomorKK: true,
            alamat: true,
            rt: true,
            rw: true,
          },
        },
        user: {
          select: {
            email: true,
            username: true,
          },
        },
      },
      orderBy: {
        namaLengkap: "asc",
      },
    });

    return NextResponse.json(wargaList);
  } catch (error) {
    console.error("[GET_WARGA_BY_RT_ERROR]", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
