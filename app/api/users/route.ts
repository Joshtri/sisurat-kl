import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { userSchema } from "@/validations/userSchema";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = userSchema.parse(body);

    const hashedPassword = await bcrypt.hash(parsed.password, 10);

    const user = await prisma.user.create({
      data: {
        username: parsed.username,
        email: parsed.email,
        password: hashedPassword,
        role: convertRole(parsed.role),
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error: any) {
    console.error("POST USER ERROR:", error);

    return NextResponse.json(
      { message: "Gagal membuat user", error: error.message },
      { status: 400 },
    );
  }
}

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        profil: true, // tampilkan data Warga jika ada
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(users);
  } catch (error: any) {
    console.error("GET USER ERROR:", error);

    return NextResponse.json(
      { message: "Gagal mengambil data user", error: error.message },
      { status: 500 },
    );
  }
}

function convertRole(role: string): Role {
  const map: Record<string, Role> = {
    warga: "WARGA",
    rt: "RT",
    staff: "STAFF",
    lurah: "LURAH",
    admin: "ADMIN",
  };

  return map[role.toLowerCase()] || "WARGA";
}
