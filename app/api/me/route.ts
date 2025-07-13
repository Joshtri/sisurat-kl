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
        profil: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const warga = user.profil;

    return NextResponse.json({
      // 🔐 USER SECTION
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,

      // 👤 WARGA SECTION (nullable if not WARGA)
      namaLengkap: warga?.namaLengkap ?? null,
      nik: warga?.nik ?? null,
      tempatLahir: warga?.tempatLahir ?? null,
      tanggalLahir: warga?.tanggalLahir ?? null,
      jenisKelamin: warga?.jenisKelamin ?? null,
      pekerjaan: warga?.pekerjaan ?? null,
      agama: warga?.agama ?? null,
      noTelepon: warga?.noTelepon ?? null,
      rt: warga?.rt ?? null,
      rw: warga?.rw ?? null,
      alamat: warga?.alamat ?? null,
      statusHidup: warga?.statusHidup ?? null,
      foto: warga?.foto ?? null,
      fileKtp: warga?.fileKtp ?? null,
      fileKk: warga?.fileKk ?? null,
    });
  } catch (error) {
    console.error("GET /api/me error:", error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
