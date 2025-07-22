import { readFile } from "fs/promises";
import path from "path";

import { NextRequest, NextResponse } from "next/server";
import Handlebars from "handlebars";
// REMOVE PUPPETEER - return HTML instead

import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { formatDateIndo } from "@/utils/common";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const payload = verifyToken(token);

  if (!payload)
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  try {
    const surat = await prisma.surat.findUnique({
      where: { id: params.id },
      include: {
        pemohon: {
          include: {
            profil: {
              include: {
                kartuKeluarga: true,
              },
            },
          },
        },
      },
    });

    if (!surat) {
      return NextResponse.json(
        { message: "Surat tidak ditemukan" },
        { status: 404 },
      );
    }

    const nama = surat.pemohon.profil?.namaLengkap ?? "-";
    const nik = surat.pemohon.profil?.nik ?? "-";
    const alamat = surat.pemohon?.profil?.kartuKeluarga?.alamat ?? "-";
    const rt = surat.pemohon?.profil?.kartuKeluarga?.rt ?? "-";
    const rw = surat.pemohon?.profil?.kartuKeluarga?.rw ?? "-";
    const alasanPengajuan = surat.alasanPengajuan ?? "-";
    const tanggal = formatDateIndo(new Date());

    const templatePath = path.resolve(
      process.cwd(),
      "public/templates/surat-pengantar.hbs",
    );
    const templateHtml = await readFile(templatePath, "utf-8");
    const compiled = Handlebars.compile(templateHtml);
    const html = compiled({
      nama,
      nik,
      alamat,
      rt,
      rw,
      alasanPengajuan,
      tanggal,
    });

    // RETURN HTML WITH PRINT STYLING - CONSISTENT WITH PREVIEW API
    const styledHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Surat Pengantar RT</title>
        <style>
          @page {
            size: A4;
            margin: 0;
          }
          
          body {
            width: 210mm;
            min-height: 297mm;
            margin: 0;
            padding: 20mm;
            box-sizing: border-box;
            font-family: 'Times New Roman', serif;
            background: white;
          }
          
          @media print {
            body {
              width: 210mm;
              height: 297mm;
              margin: 0;
              padding: 20mm;
            }
            @page {
              size: A4 portrait;
              margin: 0;
            }
          }
        </style>
      </head>
      <body>
        ${html}
      </body>
      </html>
    `;

    // RETURN HTML INSTEAD OF PDF
    return new Response(styledHtml, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": "inline",
      },
    });

  } catch (error) {
    console.error("[API] Surat Pengantar:", error);

    return NextResponse.json(
      { message: "Gagal generate HTML" },
      { status: 500 },
    );
  }
}