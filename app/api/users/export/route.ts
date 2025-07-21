// /app/api/users/export/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import * as XLSX from "xlsx";

export async function GET(request: NextRequest) {
  try {
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

    // Ambil semua data users
    const users = await prisma.user.findMany({
      select: {
        username: true,
        email: true,
        numberWhatsApp: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Format data untuk Excel
    const excelData = users.map((user, index) => ({
      No: index + 1,
      Username: user.username,
      Email: user.email || "",
      "Nomor WhatsApp": user.numberWhatsApp || "",
      Role: user.role,
      "Tanggal Dibuat": new Date(user.createdAt).toLocaleDateString("id-ID"),
    }));

    // Buat workbook dan worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Set column widths
    const colWidths = [
      { wch: 5 }, // No
      { wch: 20 }, // Username
      { wch: 25 }, // Email
      { wch: 20 }, // Nomor WhatsApp
      { wch: 15 }, // Role
      { wch: 15 }, // Tanggal Dibuat
    ];
    worksheet["!cols"] = colWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

    // Generate buffer
    const buffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "buffer",
    });

    // Set headers for download
    const headers = new Headers();
    headers.set(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    headers.set(
      "Content-Disposition",
      `attachment; filename="users-export-${new Date().toISOString().split("T")[0]}.xlsx"`
    );

    return new NextResponse(buffer, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Error exporting users:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
