// /app/api/users/template/route.ts
import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";

import { verifyToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);

    if (!decoded?.sub) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    // Data template dengan contoh dan instruksi
    const templateData = [
      {
        Username: "john_doe",
        Email: "john@example.com",
        "Nomor WhatsApp": "081234567890",
        Role: "WARGA",
        Password: "password123",
      },
      {
        Username: "jane_admin",
        Email: "", // Kosong untuk menunjukkan optional
        "Nomor WhatsApp": "",
        Role: "STAFF",
        Password: "admin123",
      },
    ];

    // Buat workbook dan worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(templateData);

    // Set column widths
    worksheet["!cols"] = [
      { wch: 20 }, // Username
      { wch: 25 }, // Email
      { wch: 20 }, // Nomor WhatsApp
      { wch: 15 }, // Role
      { wch: 15 }, // Password
    ];

    // Add instructions sheet
    const instructionsData = [
      {
        Kolom: "Username",
        Keterangan: "WAJIB. Nama pengguna unik",
        Contoh: "john_doe",
      },
      {
        Kolom: "Email",
        Keterangan: "OPSIONAL. Email valid",
        Contoh: "user@example.com",
      },
      {
        Kolom: "Nomor WhatsApp",
        Keterangan: "OPSIONAL. Nomor WhatsApp",
        Contoh: "081234567890",
      },
      {
        Kolom: "Role",
        Keterangan: "WAJIB. Pilihan: WARGA, RT, STAFF, LURAH, SUPERADMIN",
        Contoh: "WARGA",
      },
      {
        Kolom: "Password",
        Keterangan: "WAJIB. Minimal 6 karakter",
        Contoh: "password123",
      },
    ];

    const instructionsSheet = XLSX.utils.json_to_sheet(instructionsData);

    instructionsSheet["!cols"] = [
      { wch: 20 }, // Kolom
      { wch: 50 }, // Keterangan
      { wch: 20 }, // Contoh
    ];

    // Add sheets to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template");
    XLSX.utils.book_append_sheet(workbook, instructionsSheet, "Instruksi");

    // Generate buffer
    const buffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "buffer",
    });

    // Set headers for download
    const headers = new Headers();

    headers.set(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    headers.set(
      "Content-Disposition",
      'attachment; filename="template-import-users.xlsx"',
    );

    return new NextResponse(buffer, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Error generating template:", error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
