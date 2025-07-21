// /app/api/users/check-completion/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    // Ambil token dari Authorization header
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    const userId = decoded?.sub;

    if (!userId) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    // Ambil data user dengan profil warga
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profil: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Cek kelengkapan data yang wajib
    const requiredUserFields = {
      email: user.email,
      numberWhatsApp: user.numberWhatsApp,
    };

    const requiredProfilFields = user.profil
      ? {
          fileKtp: user.profil.fileKtp,
          fileKk: user.profil.fileKk,
        }
      : {
          fileKtp: null,
          fileKk: null,
        };

    // Tentukan field mana yang kosong/null
    const missingUserFields = Object.entries(requiredUserFields)
      .filter(([key, value]) => !value || value.trim() === "")
      .map(([key]) => key);

    const missingProfilFields = Object.entries(requiredProfilFields)
      .filter(([key, value]) => !value || value.trim() === "")
      .map(([key]) => key);

    const allMissingFields = [...missingUserFields, ...missingProfilFields];

    const isComplete = allMissingFields.length === 0;

    return NextResponse.json({
      isComplete,
      missingFields: allMissingFields,
      user: {
        email: user.email,
        numberWhatsApp: user.numberWhatsApp,
      },
      profil: user.profil
        ? {
            fileKtp: user.profil.fileKtp,
            fileKk: user.profil.fileKk,
          }
        : null,
    });
  } catch (error) {
    console.error("Error checking user completion:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
