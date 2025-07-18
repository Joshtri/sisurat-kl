import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma"; // sesuaikan dengan path project kamu

// GET: Ambil profil RT berdasarkan userId
export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json(
      { message: "Parameter userId wajib diisi." },
      { status: 400 },
    );
  }

  try {
    const profile = await prisma.rTProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return NextResponse.json(
        { message: "Profil RT tidak ditemukan." },
        { status: 404 },
      );
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error("GET RT profile error:", error);

    return NextResponse.json(
      { message: "Terjadi kesalahan saat mengambil data." },
      { status: 500 },
    );
  }
}

// PATCH: Update sebagian data profil RT
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, nik, rt, rw, wilayah } = body;

    if (!userId) {
      return NextResponse.json(
        { message: "Field userId wajib diisi." },
        { status: 400 },
      );
    }

    const existingProfile = await prisma.rTProfile.findUnique({
      where: { userId },
    });

    if (!existingProfile) {
      return NextResponse.json(
        { message: "Profil RT tidak ditemukan." },
        { status: 404 },
      );
    }

    const updated = await prisma.rTProfile.update({
      where: { userId },
      data: {
        nik: nik ?? undefined,
        rt: rt ?? undefined,
        rw: rw ?? undefined,
        wilayah: wilayah ?? undefined,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH RT profile error:", error);

    return NextResponse.json(
      { message: "Gagal memperbarui profil RT." },
      { status: 500 },
    );
  }
}
