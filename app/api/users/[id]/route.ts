import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import z from "zod";

import { prisma } from "@/lib/prisma";
import { userSchema } from "@/validations/userSchema";
import { Role } from "@prisma/client";

export async function GET(req: Request, context: { params: { id: string } }) {
  // ambil id dari context (TIDAK langsung destructuring di parameter fungsi!)
  const id = context.params.id;

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error: any) {
    console.error("GET USER ERROR:", error);

    return NextResponse.json(
      { message: "Gagal mengambil detail user", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.user.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "User berhasil dihapus" });
  } catch (error: any) {
    console.error("DELETE USER ERROR:", error);

    return NextResponse.json(
      { message: "Gagal menghapus user", error: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();

    // Ambil base schema dari userSchema
    const baseUserSchema = userSchema._def.schema || userSchema;
    const partialUserSchema = (baseUserSchema as z.ZodObject<any>).partial();
    const parsed = partialUserSchema.parse(body);

    const updateData: any = {
      ...(parsed.username && { username: parsed.username }),
      ...(parsed.email && { email: parsed.email }),
      ...(parsed.role && { role: convertRole(parsed.role) }),
      ...(parsed.password && {
        password: await bcrypt.hash(parsed.password, 10),
      }),
    };

    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    console.error("PATCH USER ERROR:", error);

    return NextResponse.json(
      { message: "Gagal mengubah user", error: error.message },
      { status: 400 }
    );
  }
}

function convertRole(role: string) {
  const map: Record<string, Role> = {
    warga: "WARGA",
    staff: "STAFF",
    superadmin: "SUPERADMIN",
    rt: "RT",
    lurah: "LURAH", // jika ada
  };

  return map[role] || "WARGA"; // default fallback
}
