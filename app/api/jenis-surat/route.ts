import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { jenisSuratSchema } from "@/validations/jenisSuratSchema";

export async function GET() {
  const all = await prisma.jenisSurat.findMany({ orderBy: { nama: "asc" } });

  return NextResponse.json(all);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = jenisSuratSchema.parse(body);

    const created = await prisma.jenisSurat.create({
      data: parsed,
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Gagal membuat jenis surat", error: error.message },
      { status: 400 },
    );
  }
}
