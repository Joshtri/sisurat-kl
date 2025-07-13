import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  verifyPassword,
  generateToken,
  getRedirectPathByRole,
} from "@/lib/auth";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { nik, password } = body;

  if (!nik || !password) {
    return NextResponse.json(
      { message: "NIK / Email dan password wajib diisi" },
      { status: 400 },
    );
  }

  try {
    let user = await prisma.user.findFirst({
      where: {
        OR: [{ email: nik }, { profil: { nik } }, { RTProfile: { nik } }],
      },
      include: {
        profil: true,
        RTProfile: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Akun tidak ditemukan. Silakan periksa kembali." },
        { status: 401 },
      );
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return NextResponse.json({ message: "Password salah." }, { status: 401 });
    }

    // Validasi profil sesuai role
    if (user.role === "WARGA" && !user.profil) {
      return NextResponse.json(
        { message: "Akun warga belum memiliki profil lengkap." },
        { status: 401 },
      );
    }

    if (user.role === "RT" && !user.RTProfile) {
      return NextResponse.json(
        { message: "Akun RT belum memiliki profil RT." },
        { status: 401 },
      );
    }

    const token = generateToken(user);
    const redirectPath = getRedirectPathByRole(user.role);

    return NextResponse.json({
      message: "Login berhasil",
      token,
      role: user.role,
      redirect: redirectPath,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server" },
      { status: 500 },
    );
  }
}
