// /app/api/users/complete-onboarding/route.ts
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function PATCH(request: NextRequest) {
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

    const formData = await request.formData();
    const email = formData.get("email") as string;
    const numberWhatsApp = formData.get("numberWhatsApp") as string;

    // Validasi input basic - only email is required, phone number is optional
    // if (!email) {
    //   return NextResponse.json(
    //     { message: "Email wajib diisi" },
    //     { status: 400 },
    //   );
    // }

    // Upload files ke Supabase Storage
    const uploads: Record<string, string> = {};

    for (const key of ["fileKtp", "fileKk"]) {
      const file = formData.get(key) as File;

      if (!file) {
        return NextResponse.json(
          {
            message: `File ${key === "fileKtp" ? "KTP" : "Kartu Keluarga"} wajib diupload`,
          },
          { status: 400 },
        );
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const path = `warga/${userId}/${key}-${Date.now()}-${file.name}`;

      const { data, error } = await supabase.storage
        .from("sisurat-bucket")
        .upload(path, buffer, {
          contentType: file.type,
          upsert: true,
        });

      if (error) {
        console.error(`Error uploading ${key}:`, error);

        return NextResponse.json(
          {
            message: `Gagal mengupload ${key === "fileKtp" ? "KTP" : "Kartu Keluarga"}`,
          },
          { status: 500 },
        );
      }

      const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/sisurat-bucket/${data.path}`;

      uploads[key] = url;
    }

    // Update data user - only update phone number if it's provided
    const updateData: any = {
      email: email.trim(),
    };

    if (numberWhatsApp) {
      updateData.numberWhatsApp = numberWhatsApp.trim();
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    // Cari atau buat profil warga
    const existingProfil = await prisma.warga.findUnique({
      where: { userId: userId },
    });

    if (existingProfil) {
      // Update profil yang sudah ada
      await prisma.warga.update({
        where: { userId: userId },
        data: {
          fileKtp: uploads.fileKtp,
          fileKk: uploads.fileKk,
        },
      });
    } else {
      // Buat profil baru jika belum ada
      await prisma.warga.create({
        data: {
          userId: userId,
          namaLengkap: updatedUser.username, // Default nama lengkap dari username
          nik: "", // Akan diisi nanti
          jenisKelamin: "LAKI_LAKI", // Default, bisa diubah nanti
          fileKtp: uploads.fileKtp,
          fileKk: uploads.fileKk,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Data berhasil dilengkapi",
      urls: uploads,
    });
  } catch (error) {
    console.error("Error completing onboarding:", error);

    // Handle specific prisma errors
    // if (error.code === "P2002") {
    //   return NextResponse.json(
    //     { message: "Email atau nomor WhatsApp sudah digunakan" },
    //     { status: 400 },
    //   );
    // }

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
