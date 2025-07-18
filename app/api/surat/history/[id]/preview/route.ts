import { readFile } from "fs/promises";
import path from "path";

import puppeteer from "puppeteer";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { renderTemplate } from "@/utils/pdf/renderTemplate";

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.split(" ")[1];

  if (!token)
    return NextResponse.json(
      { message: "Token tidak ditemukan" },
      { status: 401 },
    );
  const user = verifyToken(token);

  if (!user)
    return NextResponse.json({ message: "Token tidak valid" }, { status: 401 });

  const { sub: userId, role: userRole } = user;

  const surat = await prisma.surat.findUnique({
    where: { id: params.id },
    include: {
      jenis: true,
      pemohon: {
        include: {
          profil: true,
        },
      },
    },
  });

  if (!surat)
    return NextResponse.json(
      { message: "Surat tidak ditemukan" },
      { status: 404 },
    );

  // Akses terbatas
  const isAuthorized =
    userRole === "LURAH" ||
    userRole === "STAFF" ||
    userRole === "WARGA" ||
    (userRole === "RT" && surat.idRT === userId);

  if (!isAuthorized)
    return NextResponse.json({ message: "Akses ditolak" }, { status: 403 });

  // Load template HTML dari public atau local
  const templatePath = path.resolve(
    "public/templates/surat-dinamis-template.html",
  );
  const rawHtml = await readFile(templatePath, "utf-8");

  // Ambil data warga dari relasi
  const profil = surat.pemohon?.profil;

  if (!profil)
    return NextResponse.json(
      { message: "Data profil warga tidak ditemukan" },
      { status: 400 },
    );

  // Format data template
  const data = {
    jenisSurat: surat.jenis.nama,
    noSurat: surat.noSurat ?? "Belum ditentukan",
    namaLengkap: surat.namaLengkap,
    tempatTanggalLahir: surat.tempatTanggalLahir,
    nik: surat.nik,
    agama: surat.agama,
    pekerjaan: surat.pekerjaan,
    statusPerkawinan: "Belum Menikah", // TODO: ambil dari data jika ada
    alamat: surat.alamat,
    rt: profil.rt,
    rw: profil.rw,
    noSuratPengantar: surat.noSuratPengantar ?? "-",
    tanggalSuratPengantar:
      surat.tanggalVerifikasiRT?.toLocaleDateString("id-ID"),
    alasanPengajuan: surat.alasanPengajuan,
    tanggalTerbit: new Date().toLocaleDateString("id-ID"),
    qrData: surat.id,
    namaLurah: "Viktor A. Makoni, S.Sos",
    nipLurah: "19731206 200701 1 009",
  };

  const renderedHtml = renderTemplate(rawHtml, data);

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  await page.setContent(renderedHtml, { waitUntil: "networkidle0" });

  const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });

  await browser.close();

  return new Response(pdfBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline; filename=preview-surat.pdf",
    },
  });
}
