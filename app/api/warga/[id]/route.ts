import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { wargaSchema } from "@/schemas/wargaSchema";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const warga = await prisma.warga.findUnique({
      where: { id: params.id },
      include: {
        user: true,
        kartuKeluarga: true,
      },
    });

    if (!warga) {
      return NextResponse.json(
        { message: "Warga tidak ditemukan" },
        { status: 404 },
      );
    }

    return NextResponse.json(warga);
  } catch (error: any) {
    return NextResponse.json(
      { message: "Gagal mengambil detail warga", error: error.message },
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
    const parsed = wargaSchema.partial().parse(body); // update parsial

    const updated = await prisma.warga.update({
      where: { id: params.id },
      data: parsed,
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json(
      { message: "Gagal mengubah data warga", error: error.message },
      { status: 400 },
    );
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } },
) {
  try {
    await prisma.warga.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Warga berhasil dihapus" });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Gagal menghapus data warga", error: error.message },
      { status: 400 },
    );
  }
}
