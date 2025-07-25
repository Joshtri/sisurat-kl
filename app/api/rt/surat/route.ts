import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const payload = verifyToken(token);

  if (!payload || payload.role !== "RT") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const rtProfile = await prisma.rTProfile.findUnique({
    where: { userId: payload.sub },
  });

  if (!rtProfile?.rt) {
    return NextResponse.json(
      { message: "RT tidak ditemukan" },
      { status: 404 },
    );
  }

  const searchParams = req.nextUrl.searchParams;
  const startDateParam = searchParams.get("startDate");
  const endDateParam = searchParams.get("endDate");

  let dateFilter = {};

  if (startDateParam && endDateParam) {
    dateFilter = {
      tanggalPengajuan: {
        gte: new Date(startDateParam),
        lte: new Date(endDateParam),
      },
    };
  } else if (startDateParam) {
    dateFilter = {
      tanggalPengajuan: {
        gte: new Date(startDateParam),
      },
    };
  } else if (endDateParam) {
    dateFilter = {
      tanggalPengajuan: {
        lte: new Date(endDateParam),
      },
    };
  }

  // Step 1: Cari userId dari warga yang tinggal di RT tersebut
  const wargaDiRt = await prisma.warga.findMany({
    where: {
      kartuKeluarga: {
        rt: rtProfile.rt,
      },
    },
    select: {
      userId: true,
    },
  });

  const userIds = wargaDiRt.map((w) => w.userId);

  // Step 2: Ambil surat dari userId yang cocok
  const suratList = await prisma.surat.findMany({
    where: {
      ...dateFilter,
      idPemohon: {
        in: userIds,
      },
    },
    include: {
      jenis: true,
      pemohon: {
        select: {
          username: true,
          profil: {
            select: {
              namaLengkap: true,
              nik: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // return NextResponse.json(suratList);

  const cleanedSuratList = suratList.map((surat) => {
    const dataSurat = surat.dataSurat;

    let filteredDataSurat = dataSurat;

    if (dataSurat && typeof dataSurat === "object") {
      filteredDataSurat = Object.fromEntries(
        Object.entries(dataSurat).filter(([key, value]) => {
          // Exclude jika:
          // 1. Value adalah base64 image/pdf
          // 2. Atau key-nya dalam daftar blacklist
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
        }),
      );
    }

    return {
      ...surat,
      dataSurat: filteredDataSurat,
    };
  });

  return NextResponse.json(cleanedSuratList);
}
