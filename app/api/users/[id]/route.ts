import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import z from "zod";

import { prisma } from "@/lib/prisma";
import { userSchema } from "@/validations/userSchema";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
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
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const body = await req.json();

    // Ambil base schema dari userSchema
    const baseUserSchema = userSchema._def.schema || userSchema;
    const partialUserSchema = (baseUserSchema as z.ZodObject<any>).partial();
    const parsed = partialUserSchema.parse(body);

    const updateData: any = {
      ...(parsed.name && { username: parsed.name }),
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
      { status: 400 },
    );
  }
}

function convertRole(role: string) {
  const map: Record<string, string> = {
    user: "WARGA",
    admin: "STAFF",
    superadmin: "ADMIN",
  };

  return map[role] || "WARGA";
}
