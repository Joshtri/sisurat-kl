import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma"; // pastikan sesuai path prisma client kamu

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const userId = params.id;
  const body = await req.json();

  const { extraRoles } = body;

  if (!Array.isArray(extraRoles)) {
    return NextResponse.json(
      { error: "Field 'extraRoles' harus berupa array." },
      { status: 400 },
    );
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        extraRoles: extraRoles, // Prisma will handle enum[] directly
      },
    });

    return NextResponse.json(
      { message: "Role berhasil diperbarui", user: updatedUser },
      { status: 200 },
    );
  } catch (error) {
    console.error("[UPDATE_USER_ROLES_ERROR]", error);

    return NextResponse.json(
      { error: "Gagal memperbarui role." },
      { status: 500 },
    );
  }
}
