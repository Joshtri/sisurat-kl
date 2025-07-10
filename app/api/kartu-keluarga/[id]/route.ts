import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { kartuKeluargaSchema } from "@/validations/kartuKeluargaSchema";

// GET satu KK berdasarkan ID
export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const kk = await prisma.kartuKeluarga.findUnique({
      where: { id: params.id },
      include: {
        kepalaKeluarga: true,
        anggota: true,
      },
    });

    if (!kk) {
      return NextResponse.json(
        { message: "KK tidak ditemukan" },
        { status: 404 },
      );
    }

    return NextResponse.json(kk);
  } catch (error: any) {
    return NextResponse.json(
      { message: "Gagal mengambil detail KK", error: error.message },
      { status: 500 },
    );
  }
}

// PATCH (update KK)
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const body = await req.json();
    const parsed = kartuKeluargaSchema.partial().parse(body);

    const updated = await prisma.kartuKeluarga.update({
      where: { id: params.id },
      data: parsed,
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json(
      { message: "Gagal memperbarui KK", error: error.message },
      { status: 400 },
    );
  }
}

// DELETE
export async function DELETE(
  _: Request,
  { params }: { params: { id: string } },
) {
  try {
    await prisma.kartuKeluarga.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "KK berhasil dihapus" });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Gagal menghapus KK", error: error.message },
      { status: 400 },
    );
  }
}
