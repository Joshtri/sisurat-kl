import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getAuthUserFromRequest } from "@/lib/authHelpers";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const { user, error, status } = getAuthUserFromRequest(req);

  if (!user || user.role !== "RT") {
    return NextResponse.json({ message: error || "Unauthorized" }, { status });
  }

  const id = params.id;
  const body = await req.json();

  try {
    const updateData: any = {
      tanggalVerifikasiRT: new Date(),
      idRT: user.sub,
    };

    if (body.status === "DIVERIFIKASI_RT") {
      updateData.status = "DIVERIFIKASI_RT";
      updateData.fileSuratPengantar = body.fileSuratPengantar;
    } else if (body.status === "DITOLAK_RT") {
      updateData.status = "DITOLAK_RT";
      updateData.catatanPenolakanRT = body.catatanPenolakanRT;
    } else {
      return NextResponse.json({ message: "Invalid status" }, { status: 400 });
    }

    const result = await prisma.surat.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("RT_VERIFIKASI_ERROR", error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
