import { NextResponse, NextRequest } from "next/server";

import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { transporter } from "@/lib/email";

export async function GET(req: NextRequest) {
  try {
    const suratList = await prisma.surat.findMany({
      orderBy: { createdAt: "desc" },
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

    const formatted = suratList.map((surat) => {
      const profil = surat.pemohon?.profil;
      const kk = profil?.kartuKeluarga;

      return {
        id: surat.id,
        noSurat: surat.noSurat ?? "-",
        jenisSurat: surat.jenis?.nama ?? "-",
        namaLengkap:
          profil?.namaLengkap ??
          // surat.namaLengkap ??
          surat.pemohon?.username ??
          "-",
        nik: profil?.nik ?? "-",
        jenisKelamin:
          profil?.jenisKelamin === "LAKI_LAKI"
            ? "Laki-laki"
            : profil?.jenisKelamin === "PEREMPUAN"
              ? "Perempuan"
              : "-",
        alamat: kk?.alamat ?? "-",
        rt: kk?.rt ?? "-",
        rw: kk?.rw ?? "-",
        status: surat.status,
        tanggalPengajuan: surat.tanggalPengajuan,
      };
    });

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("GET /api/surat error:", error);

    return NextResponse.json(
      {
        message: "Gagal mengambil data surat",
        error:
          typeof error === "object" && error !== null && "message" in error
            ? (error as { message: string }).message
            : String(error),
      },
      { status: 500 },
    );
  }
}

// File: app/api/surat/create/route.ts

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    const userId = decoded?.sub;

    if (!userId) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const body = await req.json();

    const {
      idJenisSurat,
      alasanPengajuan,
      dataSurat,
    } = body;

    // Ambil info user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.email) {
      return NextResponse.json({ message: "Email pengguna tidak ditemukan" }, { status: 400 });
    }

    // Buat surat
    const created = await prisma.surat.create({
      data: {
        idJenisSurat,
        idPemohon: userId,
        alasanPengajuan,
        tanggalPengajuan: new Date(),
        status: "DIAJUKAN",
        dataSurat,
      },
    });

    const jenisSurat = await prisma.jenisSurat.findUnique({
      where: { id: idJenisSurat },
    });

    if (!jenisSurat) {
      return NextResponse.json({ message: "Jenis surat tidak ditemukan" }, { status: 400 });
    }

    // Kirim email notifikasi ke pemohon
    await transporter.sendMail({
      from: `"SISURAT Kelurahan Liliba" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Pengajuan Surat Berhasil - SISURAT Kelurahan Liliba",
      html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #2d6cdf 0%, #00b3cc 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">Pengajuan Surat Berhasil</h1>
        <p style="color: white; margin: 0;">SISURAT Kelurahan Liliba</p>
      </div>
      <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <p style="font-size: 16px;">
          Halo <strong>${user.username}</strong>,<br><br>
          Pengajuan surat Anda telah berhasil dikirim ke sistem SISURAT Kelurahan Liliba.
        </p>
        <p style="font-size: 16px;">
          Jenis Surat: <strong>${jenisSurat.nama}</strong><br>
          Status saat ini: <strong>DIAJUKAN</strong><br>
          Tanggal Pengajuan: <strong>${new Date().toLocaleDateString("id-ID")}</strong>
        </p>
        <p style="font-size: 14px; color: #666; margin-top: 30px;">
          Tim kami akan memproses pengajuan Anda dan memberikan informasi selanjutnya melalui sistem.
        </p>
        <div style="margin-top: 30px; text-align: left; font-size: 14px; color: #666;">
          <p>Terima kasih,<br>Kelurahan Liliba</p>
        </div>
      </div>
    </div>
  `,
      text: `
    Pengajuan Surat Berhasil - SISURAT Kelurahan Liliba

    Halo ${user.username},

    Pengajuan surat Anda telah berhasil dikirim ke sistem SISURAT Kelurahan Liliba.

    Jenis Surat: ${jenisSurat.nama}
    Status: DIAJUKAN
    Tanggal: ${new Date().toLocaleDateString("id-ID")}

    Tim kami akan memproses pengajuan Anda dan memberikan informasi selanjutnya.

    Terima kasih,
    Kelurahan Liliba
  `,
    });


    return NextResponse.json({
      message: "Surat berhasil diajukan dan email telah dikirim",
      data: created,
    });
  } catch (error) {
    console.error("[POST /api/surat/create] error:", error);

    return NextResponse.json(
      { message: "Terjadi kesalahan saat membuat surat" },
      { status: 500 },
    );
  }
}
