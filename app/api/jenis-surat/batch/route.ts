// app/api/jenis-surat/batch/route.ts
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json(); // expect array of jenis surat

    if (!Array.isArray(body)) {
      return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
    }

    const created = await prisma.jenisSurat.createMany({
      data: body,
      skipDuplicates: true,
    });

    return NextResponse.json({
      message: "Berhasil menambahkan",
      count: created.count,
    });
  } catch (error) {
    console.error("POST /api/jenis-surat/batch error:", error);

    return NextResponse.json(
      { message: "Gagal menambahkan data" },
      { status: 500 },
    );
  }
}
