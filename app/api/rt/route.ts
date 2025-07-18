import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma"; // pastikan ini mengarah ke prisma client

export async function GET() {
  try {
    const rtAccounts = await prisma.user.findMany({
      where: {
        role: "RT",
        // RTProfile: {
        //   isNot: null, // pastikan hanya yang punya RTProfile
        // },
      },
      include: {
        RTProfile: true,
      },
    });

    return NextResponse.json(rtAccounts);
  } catch (error) {
    console.error("Error fetching RT accounts:", error);

    return NextResponse.json(
      { message: "Failed to fetch RT accounts" },
      { status: 500 },
    );
  }
}
