import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const payload = await verifyToken(token);

  if (!payload || payload.role !== "WARGA") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const history = await prisma.surat.findMany({
      where: {
        idPemohon: payload.sub,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        jenis: true,
      },
    });

    const cleanedHistory = history.map((surat) => {
      const dataSurat = surat.dataSurat;

      let filteredDataSurat = dataSurat;

      if (dataSurat && typeof dataSurat === "object") {
        filteredDataSurat = Object.fromEntries(
          Object.entries(dataSurat).filter(([key, value]) => {
            const isBase64 =
              typeof value === "string" &&
              (value.startsWith("data:image") ||
                value.startsWith("data:application/pdf"));

            const blacklist = [
              "fotoUsahaBase64",
              "fotoAnakBase64",
              "buktiBase64",
              "lampiranPdf",
            ];
            return !isBase64 && !blacklist.includes(key);
          })
        );
      }

      return {
        ...surat,
        dataSurat: filteredDataSurat,
      };
    });

    return NextResponse.json(cleanedHistory);
  } catch (error) {
    console.error("[HISTORY_SURAT_ERROR]", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
