import { readFile } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import Handlebars from "handlebars";
import puppeteer from "puppeteer"; // TAMBAH PUPPETEER

import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

// Helper functions untuk Handlebars
const formatTanggal = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const addOne = (index) => index + 1;
const terbilang = (num) => {
  const angka = [
    "", "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh", "delapan", "sembilan", "sepuluh",
    "sebelas", "dua belas", "tiga belas", "empat belas", "lima belas", "enam belas", "tujuh belas",
    "delapan belas", "sembilan belas", "dua puluh",
  ];
  if (num <= 20) return angka[num] || num.toString();
  return num.toString();
};

export async function GET(
  req: NextRequest,
  context: { params: { id: string } },
) {
  const { id } = context.params;
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

  const formatTTL = (tempat, tanggal) =>
    `${tempat ?? "-"}, ${tanggal ? new Date(tanggal).toLocaleDateString("id-ID") : "-"}`;

  const { sub: userId, role: userRole } = user;

  const surat = await prisma.surat.findUnique({
    where: { id },
    include: {
      jenis: true,
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

  if (!surat)
    return NextResponse.json(
      { message: "Surat tidak ditemukan" },
      { status: 404 },
    );

  const isAuthorized =
    userRole === "LURAH" ||
    userRole === "STAFF" ||
    userRole === "WARGA" ||
    userRole === "SUPERADMIN" ||
    (userRole === "RT" && surat.idRT === userId);

  if (!isAuthorized)
    return NextResponse.json({ message: "Akses ditolak" }, { status: 403 });

  // Register Handlebars helpers
  Handlebars.registerHelper("formatTanggal", formatTanggal);
  Handlebars.registerHelper("addOne", addOne);
  Handlebars.registerHelper("terbilang", terbilang);

  const kodeSurat = surat.jenis.kode?.toLowerCase();
  const templatePath = path.resolve(`public/templates/surat-${kodeSurat}.hbs`);

  let rawTemplate = "";
  try {
    rawTemplate = await readFile(templatePath, "utf-8");
  } catch (err) {
    console.error("Template error:", err);
    return NextResponse.json(
      { message: `Template tidak ditemukan: ${kodeSurat}` },
      { status: 500 },
    );
  }

  const profil = surat.pemohon?.profil;
  const kk = profil?.kartuKeluarga;

  if (!profil || !kk) {
    return NextResponse.json(
      { message: "Data profil atau kartu keluarga tidak lengkap" },
      { status: 400 },
    );
  }

  const daftarAnak = (surat.dataSurat as any)?.daftarAnak ?? [];

  // Logika pencarian ayah & ibu
  const anggotaKK = await prisma.warga.findMany({
    where: { kartuKeluargaId: kk?.id },
  });

  function findOrangTua(anggota: typeof anggotaKK) {
    let ayah = anggota.find(w => w.peranDalamKK === "KEPALA_KELUARGA" && w.jenisKelamin === "LAKI_LAKI") ??
      anggota.find(w => w.peranDalamKK === "ORANG_TUA" && w.jenisKelamin === "LAKI_LAKI");

    let ibu = anggota.find(w => w.peranDalamKK === "ISTRI" && w.jenisKelamin === "PEREMPUAN") ??
      anggota.find(w => w.peranDalamKK === "ORANG_TUA" && w.jenisKelamin === "PEREMPUAN");

    return { ayah, ibu };
  }

  const { ayah, ibu } = findOrangTua(anggotaKK);

  // Data tambahan
  const extra = {
    ...((surat.dataSurat as Record<string, any>) ?? {}),
    ayah: {
      nama: ayah?.namaLengkap ?? "-",
      ttl: formatTTL(ayah?.tempatLahir, ayah?.tanggalLahir),
      wargaNegara: "Indonesia",
      agama: ayah?.agama ?? "-",
      pekerjaan: ayah?.pekerjaan ?? "-",
      alamat: kk?.alamat ?? "-",
    },
    ibu: {
      nama: ibu?.namaLengkap ?? "-",
      ttl: formatTTL(ibu?.tempatLahir, ibu?.tanggalLahir),
      wargaNegara: "Indonesia",
      agama: ibu?.agama ?? "-",
      pekerjaan: ibu?.pekerjaan ?? "-",
      alamat: kk?.alamat ?? "-",
    },
    anak: {
      nama: profil?.namaLengkap,
      ttl: formatTTL(profil?.tempatLahir, profil?.tanggalLahir),
      wargaNegara: "Indonesia",
      agama: profil?.agama ?? "-",
      pekerjaan: profil?.pekerjaan ?? "-",
      alamat: kk?.alamat ?? "-",
    },
    namaPasangan: (surat.dataSurat as any)?.namaYangTidakDiTempat ?? ibu?.namaLengkap ?? ayah?.namaLengkap ?? "-",
    lokasiPasangan: (surat.dataSurat as any)?.lokasiTujuan ?? "-",
    keperluan: surat.alasanPengajuan ?? "-",
    tanggalSurat: new Date(),
  };

  // Kondisi khusus untuk surat nikah
  if (kodeSurat === "nikah") {
    extra.namaLengkap = profil?.namaLengkap ?? "-";
    extra.jenisKelamin = profil?.jenisKelamin ?? "-";
    extra.tempatLahir = profil?.tempatLahir ?? "-";
    extra.tanggalLahir = profil?.tanggalLahir ? new Date(profil.tanggalLahir).toLocaleDateString("id-ID") : "-";
    extra.wargaNegara = "Indonesia";
    extra.agama = profil?.agama ?? "-";
    extra.pekerjaan = profil?.pekerjaan ?? "-";
    extra.alamat = kk?.alamat ?? "-";
    extra.binBinti = (surat.dataSurat as any)?.binBinti ?? "-";
  }

  let statusPerkawinan = "-";
  if (kodeSurat === "janda_duda") {
    statusPerkawinan = profil?.jenisKelamin?.toLowerCase() === "perempuan" ? "Janda" : "Duda";
  }

  // Struktur data final
  const data = {
    jenisSurat: surat.jenis.nama,
    noSurat: surat.noSurat ?? "Belum ditentukan",
    namaLengkap: profil.namaLengkap,
    jenisKelamin: profil.jenisKelamin,
    tempatTanggalLahir: `${profil.tempatLahir ?? "-"}, ${profil.tanggalLahir ? new Date(profil.tanggalLahir).toLocaleDateString("id-ID") : "-"}`,
    dataSurat: {
      daftarAnak: daftarAnak.map((anak: any) => ({
        namaLengkap: anak.namaLengkap,
        tempatLahir: anak.tempatLahir,
        tanggalLahir: anak.tanggalLahir,
        jenisKelamin: anak.jenisKelamin === "LAKI_LAKI" ? "L" : anak.jenisKelamin === "PEREMPUAN" ? "P" : "-",
      })),
    },
    nik: profil.nik,
    agama: profil.agama ?? "-",
    pekerjaan: profil.pekerjaan ?? "-",
    statusPerkawinan,
    alamat: kk.alamat ?? "-",
    rt: kk.rt ?? "-",
    rw: kk.rw ?? "-",
    noSuratPengantar: surat.noSuratPengantar ?? "-",
    tanggalSuratPengantar: surat.tanggalVerifikasiRT?.toLocaleDateString("id-ID") ?? "-",
    alasanPengajuan: surat.alasanPengajuan ?? "-",
    tanggalTerbit: new Date().toLocaleDateString("id-ID"),
    qrData: surat.id,
    namaLurah: "Viktor A. Makoni, S.Sos",
    nipLurah: "19731206 200701 1 009",
    ...extra,
  };

  try {
    // Compile template Handlebars
    const compiled = Handlebars.compile(rawTemplate);
    const renderedHtml = compiled(data);

    // TAMBAH PUPPETEER UNTUK GENERATE PDF
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    // Set content dengan HTML yang sudah di-render
    await page.setContent(renderedHtml, { waitUntil: "networkidle0" });

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' }
    });

    await browser.close();

    // RETURN PDF BINARY (BUKAN HTML!)
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline",
      },
    });

  } catch (error) {
    console.error("[API] Error generating PDF:", error);
    return NextResponse.json(
      { message: "Gagal generate PDF" },
      { status: 500 },
    );
  }
}
