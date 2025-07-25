// app/api/rt/kartu-keluarga/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    if (!userId) {
      return NextResponse.json({ message: "Missing userId" }, { status: 400 });
    }

    // Get RT Profile
    const rtProfile = await prisma.rTProfile.findUnique({
      where: { userId },
    });

    if (!rtProfile) {
      return NextResponse.json(
        { message: "RT profile not found" },
        { status: 404 },
      );
    }

    const { rt } = rtProfile;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build where condition
    const whereCondition = {
      rt: rt,
      ...(search && {
        OR: [
          { nomorKK: { contains: search, mode: "insensitive" } },
          { alamat: { contains: search, mode: "insensitive" } },
          { 
            kepalaKeluarga: {
              namaLengkap: { contains: search, mode: "insensitive" }
            }
          },
        ],
      }),
    };

    // Get data with pagination
    const [kartuKeluarga, total] = await Promise.all([
      prisma.kartuKeluarga.findMany({
        where: whereCondition,
        include: {
          kepalaKeluarga: {
            select: {
              namaLengkap: true,
              nik: true,
              jenisKelamin: true,
              pekerjaan: true,
              user: {
                select: {
                  email: true,
                },
              },
            },
          },
          anggota: {
            select: {
              id: true,
              namaLengkap: true,
              nik: true,
              jenisKelamin: true,
              peranDalamKK: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      
      prisma.kartuKeluarga.count({
        where: whereCondition,
      }),
    ]);

    // Calculate totals
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      data: kartuKeluarga,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        hasNextPage,
        hasPrevPage,
        limit,
      },
      rtInfo: {
        rt: rt,
        rw: rtProfile.rw,
        namaRT: rtProfile.namaLengkap,
      },
    });
  } catch (error: any) {
    console.error("[API] Kartu Keluarga RT error:", error);
    return NextResponse.json(
      { message: "Gagal mengambil data kartu keluarga", error: error.message },
      { status: 500 },
    );
  }
}