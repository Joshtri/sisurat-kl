import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const userId = params.id;

    // 1. Ambil user dengan RTProfile
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        RTProfile: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User tidak ditemukan" },
        { status: 404 },
      );
    }

    const rtProfile = user.RTProfile;

    if (!rtProfile) {
      return NextResponse.json(
        { message: "Profil RT tidak ditemukan" },
        { status: 404 },
      );
    }

    // 2. Ambil semua KK yang sesuai RT-nya
    const kkList = await prisma.kartuKeluarga.findMany({
      where: {
        rt: rtProfile.rt,
      },
      include: {
        anggota: {
          include: {
            user: {
              select: {
                username: true,
                email: true,
              },
            },
          },
        },
        kepalaKeluarga: {
          include: {
            user: {
              select: {
                username: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      rtProfile,
      kartuKeluarga: kkList,
    });
  } catch (error: any) {
    console.error("GET RT DETAIL ERROR:", error);

    return NextResponse.json(
      { message: "Terjadi kesalahan saat mengambil detail RT" },
      { status: 500 },
    );
  }
}
