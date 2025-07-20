import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { kartuKeluargaSchema } from "@/validations/kartuKeluargaSchema";

// GET semua KK
export async function GET() {
  try {
    const kkList = await prisma.kartuKeluarga.findMany({
      include: {
        kepalaKeluarga: true,
        anggota: true,
      },
    });

    return NextResponse.json(kkList);
  } catch (error: any) {
    return NextResponse.json(
      { message: "Gagal mengambil data", error: error.message },
      { status: 500 },
    );
  }
}

// POST buat KK baru
// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const parsed = kartuKeluargaSchema.parse(body);

//     const created = await prisma.kartuKeluarga.create({
//       data: {
//         nomorKK: parsed.nomorKK,
//         kepalaKeluargaId: parsed.kepalaKeluargaId,
//         alamat: parsed.alamat,
//         rt: parsed.rt,
//         rw: parsed.rw,
//       },
//     });

//     return NextResponse.json(created, { status: 201 });
//   } catch (error: any) {
//     return NextResponse.json(
//       { message: "Gagal membuat kartu keluarga", error: error.message },
//       { status: 400 },
//     );
//   }
// }

// POST buat KK baru + update Warga (kepala keluarga)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = kartuKeluargaSchema.parse(body);

    const created = await prisma.kartuKeluarga.create({
      data: {
        nomorKK: parsed.nomorKK,
        kepalaKeluargaId: parsed.kepalaKeluargaId,
        alamat: parsed.alamat,
        rt: parsed.rt,
        rw: parsed.rw,
      },
    });

    // ✅ Setelah buat KK, update warga agar kartuKeluargaId-nya terisi
    await prisma.warga.update({
      where: { id: parsed.kepalaKeluargaId },
      data: { kartuKeluargaId: created.id },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Gagal membuat kartu keluarga", error: error.message },
      { status: 400 },
    );
  }
}
