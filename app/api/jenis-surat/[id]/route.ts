import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { jenisSuratSchema } from "@/validations/jenisSuratSchema";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const data = await prisma.jenisSurat.findUnique({ where: { id: params.id } });

  return NextResponse.json(data);
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const body = await req.json();
    const parsed = jenisSuratSchema.partial().parse(body);

    const updated = await prisma.jenisSurat.update({
      where: { id: params.id },
      data: parsed,
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json(
      { message: "Gagal mengupdate jenis surat", error: error.message },
      { status: 400 },
    );
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } },
) {
  const deleted = await prisma.jenisSurat.delete({ where: { id: params.id } });

  return NextResponse.json(deleted);
}
