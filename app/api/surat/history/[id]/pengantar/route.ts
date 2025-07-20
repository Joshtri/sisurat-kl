import { readFile } from "fs/promises";
import path from "path";

import { NextRequest, NextResponse } from "next/server";
import Handlebars from "handlebars";
import puppeteer from "puppeteer";

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

    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });

    await browser.close();

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline; filename=surat-pengantar.pdf",
      },
    });
  } catch (error) {
    console.error("[API] Surat Pengantar:", error);

    return NextResponse.json(
      { message: "Gagal generate PDF" },
      { status: 500 },
    );
  }
}
