// /app/api/users/import/route.ts
import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
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

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { message: "File tidak ditemukan" },
        { status: 400 },
      );
    }

    // Validasi tipe file
    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      return NextResponse.json(
        { message: "File harus berformat .xlsx atau .xls" },
        { status: 400 },
      );
    }

    // Read file
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Parse Excel file
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    if (!jsonData.length) {
      return NextResponse.json(
        { message: "File Excel kosong" },
        { status: 400 },
      );
    }

    const results = {
      success: [],
      errors: [],
      total: jsonData.length,
    };

    // Validasi roles yang valid
    const validRoles = ["WARGA", "RT", "STAFF", "LURAH", "SUPERADMIN"];

    // Process each row
    for (let i = 0; i < jsonData.length; i++) {
      const row = jsonData[i] as any;
      const rowNum = i + 2; // Excel row number (header = 1, data starts from 2)

      try {
        // Validasi data wajib
        if (!row.Username || typeof row.Username !== "string") {
          results.errors.push({
            row: rowNum,
            message: "Username wajib diisi",
          });
          continue;
        }

        if (
          !row.Password ||
          typeof row.Password !== "string" ||
          row.Password.length < 6
        ) {
          results.errors.push({
            row: rowNum,
            message: "Password wajib diisi dan minimal 6 karakter",
          });
          continue;
        }

        if (!row.Role || !validRoles.includes(row.Role)) {
          results.errors.push({
            row: rowNum,
            message: `Role wajib diisi. Pilihan: ${validRoles.join(", ")}`,
          });
          continue;
        }

        // Validasi email jika diisi
        if (
          row.Email &&
          typeof row.Email === "string" &&
          row.Email.trim() !== ""
        ) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

          if (!emailRegex.test(row.Email)) {
            results.errors.push({
              row: rowNum,
              message: "Format email tidak valid",
            });
            continue;
          }
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(row.Password, 12);

        // Prepare user data
        const userData = {
          username: row.Username.trim(),
          password: hashedPassword,
          role: row.Role,
          email: row.Email && row.Email.trim() !== "" ? row.Email.trim() : null,
          numberWhatsApp:
            row["Nomor WhatsApp"] &&
            row["Nomor WhatsApp"].toString().trim() !== ""
              ? row["Nomor WhatsApp"].toString().trim()
              : null,
        };

        // Create user
        const newUser = await prisma.user.create({
          data: userData,
          select: {
            id: true,
            username: true,
            email: true,
            role: true,
          },
        });

        results.success.push({
          row: rowNum,
          username: newUser.username,
          message: "Berhasil dibuat",
        });
      } catch (error: any) {
        let errorMessage = "Gagal membuat user";

        if (error.code === "P2002") {
          const target = error.meta?.target;

          if (target?.includes("username")) {
            errorMessage = "Username sudah digunakan";
          } else if (target?.includes("email")) {
            errorMessage = "Email sudah digunakan";
          } else if (target?.includes("numberWhatsApp")) {
            errorMessage = "Nomor WhatsApp sudah digunakan";
          }
        }

        results.errors.push({
          row: rowNum,
          message: errorMessage,
        });
      }
    }

    return NextResponse.json({
      message: "Import selesai",
      data: results,
    });
  } catch (error) {
    console.error("Error importing users:", error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
