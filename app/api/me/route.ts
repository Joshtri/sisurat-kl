import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    const userId = decoded?.sub;

    if (!userId) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profil: {
          include: {
            kartuKeluarga: true, // Include kartuKeluarga relation
          },
        },
        RTProfile: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const warga = user.profil;
    const rtProfile = user.RTProfile;
    const kartuKeluarga = warga?.kartuKeluarga;

    return NextResponse.json({
      // 🔐 USER SECTION
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      numberWhatsApp: user.numberWhatsApp,

      createdAt: user.createdAt,
      updatedAt: user.updatedAt,

      // 👤 WARGA SECTION
      wargaId: warga?.id ?? null, // ID WARGA

      namaLengkap: warga?.namaLengkap ?? null,
      nik: warga?.nik ?? null,
      tempatLahir: warga?.tempatLahir ?? null,
      tanggalLahir: warga?.tanggalLahir ?? null,
      jenisKelamin: warga?.jenisKelamin ?? null,

      kartuKeluargaId: warga?.kartuKeluargaId ?? null,
      pekerjaan: warga?.pekerjaan ?? null,
      agama: warga?.agama ?? null,

      // 🏠 ALAMAT SECTION (dari Kartu Keluarga)
      alamat: kartuKeluarga?.alamat ?? null,
      rt: kartuKeluarga?.rt ?? null,
      rw: kartuKeluarga?.rw ?? null,
      // alamat: warga.k
      statusHidup: warga?.statusHidup ?? null,
      statusPerkawinan: warga?.statusPerkawinan ?? null,
      peranDalamKk: warga?.peranDalamKK ?? null,
      foto: warga?.foto ?? null,
      fileKtp: warga?.fileKtp ?? null,
      fileKk: warga?.fileKk ?? null,

      // 🏠 RT PROFILE SECTION
      rtProfile: rtProfile
        ? {
            id: rtProfile.id,
            namaLengkap: rtProfile.namaLengkap ?? null,
            nik: rtProfile.nik,
            rt: rtProfile.rt,
            rw: rtProfile.rw,
            wilayah: rtProfile.wilayah,
          }
        : null,
    });
  } catch (error) {
    console.error("GET /api/me error:", error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
