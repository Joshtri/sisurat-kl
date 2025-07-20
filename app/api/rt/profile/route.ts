import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";

import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { namaLengkap, userId, nik, rt, rw, wilayah } = body;

    if (!userId || !nik || !rt || !rw || !namaLengkap) {
      return NextResponse.json(
        { message: "Field userId, nik, rt, rw, dan namaLengkap wajib diisi" },
        { status: 400 },
      );
    }

    // Cek apakah user sudah punya profil RT
    const existingProfile = await prisma.rTProfile.findUnique({
      where: { userId },
    });

    if (existingProfile) {
      return NextResponse.json(
        { message: "User ini sudah memiliki profil RT" },
        { status: 409 },
      );
    }

    const newProfile = await prisma.rTProfile.create({
      data: {
        userId,
        namaLengkap,
        nik,
        rt,
        rw,
        wilayah,
      },
    });

    return NextResponse.json(newProfile, { status: 201 });
  } catch (error) {
    console.error("Error creating RTProfile:", error);

    return NextResponse.json(
      { message: "Terjadi kesalahan saat membuat profil RT" },
      { status: 500 },
    );
  }
}

// Schema validasi body untuk PATCH
const rtProfileSchema = z.object({
  namaLengkap: z.string().min(1, "Nama lengkap wajib diisi"),
  nik: z.string().min(16, "NIK harus 16 digit"),
  rt: z.string().min(1, "RT wajib diisi"),
  rw: z.string().min(1, "RW wajib diisi"),
  wilayah: z.string().optional(),
});

export async function PATCH(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json(
      { message: "Parameter userId wajib diisi." },
      { status: 400 },
    );
  }

  try {
    const body = await req.json();
    const parsed = rtProfileSchema.parse(body);

    // Cek apakah profil RT sudah ada
    const existingProfile = await prisma.rTProfile.findUnique({
      where: { userId },
    });

    if (!existingProfile) {
      return NextResponse.json(
        { message: "Profil RT tidak ditemukan." },
        { status: 404 },
      );
    }

    // Update RTProfile
    const updatedProfile = await prisma.rTProfile.update({
      where: { userId },
      data: {
        namaLengkap: parsed.namaLengkap,
        nik: parsed.nik,
        rt: parsed.rt,
        rw: parsed.rw,
        wilayah: parsed.wilayah,
      },
    });

    return NextResponse.json(updatedProfile);
  } catch (error: any) {
    console.error("PATCH RTProfile error:", error);

    return NextResponse.json(
      { message: "Gagal memperbarui profil RT", error: error.message },
      { status: 400 },
    );
  }
}
