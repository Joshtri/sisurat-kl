// app/api/lurah/surat/[id]/verify/route.ts
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const id = params.id;
    const body = await req.json();

    if (!id) {
      return NextResponse.json({ message: "Missing ID" }, { status: 400 });
    }

    const updateData: any = {
      status: body.status,
      tanggalVerifikasiLurah: new Date(),
    };

    if (body.catatanPenolakan) {
      updateData.catatanPenolakan = body.catatanPenolakan;
    }

    const updatedSurat = await prisma.surat.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      message: "Surat berhasil diperbarui",
      data: updatedSurat,
    });
  } catch (error) {
    console.error("[LURAH_VERIFY_ERROR]", error);

    return NextResponse.json(
      { message: "Gagal memverifikasi surat", error },
      { status: 500 },
    );
  }
}
