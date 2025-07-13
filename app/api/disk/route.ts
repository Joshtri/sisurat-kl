import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma"; // sesuaikan path prisma

export async function GET() {
  try {
    const result = await prisma.$queryRawUnsafe<{ size: string }[]>(
      `SELECT pg_size_pretty(pg_database_size(current_database())) AS size`,
    );

    return NextResponse.json({
      size: result[0]?.size || "Unknown",
    });
  } catch (error) {
    console.error("[DB SIZE ERROR]", error);

    return NextResponse.json(
      { message: "Gagal mengambil ukuran database" },

      { status: 500 },
    );
  }
}
