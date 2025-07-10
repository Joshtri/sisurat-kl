import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { wargaSchema } from "@/validations/wargaSchema";

export async function GET() {
  try {
    const wargaList = await prisma.warga.findMany({
      include: {
        user: true,
        kartuKeluarga: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(wargaList);
  } catch (error: any) {
    return NextResponse.json(
      { message: "Gagal mengambil data warga", error: error.message },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = wargaSchema.parse(body);

    const warga = await prisma.warga.create({
      data: parsed,
    });

    return NextResponse.json(warga, { status: 201 });
  } catch (error: any) {
    console.error("CREATE WARGA ERROR:", error);

    return NextResponse.json(
      { message: "Gagal membuat warga", error: error.message },
      { status: 400 },
    );
  }
}
