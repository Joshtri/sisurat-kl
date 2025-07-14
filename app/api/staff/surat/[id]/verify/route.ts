import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await req.json();

    const dataToUpdate: any = {
      status: body.status,
      tanggalVerifikasiStaff: new Date(),
    };

    if (body.catatanPenolakan) {
      dataToUpdate.catatanPenolakan = body.catatanPenolakan;
    }

    const updated = await prisma.surat.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json({
      message: "Surat berhasil diproses",
      data: updated,
    });
  } catch (error) {
    console.error("PATCH /api/staff/surat/[id]/verify error:", error);
    return NextResponse.json(
      { message: "Gagal memproses surat", error: error.message },
      { status: 500 }
    );
  }
}
