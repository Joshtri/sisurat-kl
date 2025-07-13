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
      { message: "NIK dan password wajib diisi" },
      { status: 400 },
    );
  }

  try {
    const warga = await prisma.warga.findUnique({
      where: { nik },
      include: { user: true },
    });

    if (!warga || !warga.user) {
      return NextResponse.json(
        {
          message: "NIK belum terdaftar. Silakan hubungi pihak administrator.",
        },
        { status: 401 },
      );
    }

    const user = warga.user;
    const isValid = await verifyPassword(password, user.password);

    if (!isValid) {
      return NextResponse.json({ message: "Password salah." }, { status: 401 });
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
