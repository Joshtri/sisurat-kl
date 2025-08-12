import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUserFromRequest } from "@/lib/authHelpers";
import { transporter } from "@/lib/email";

type BodyType = {
  status: "DIVERIFIKASI_RT" | "DITOLAK_RT";
  fileSuratPengantar?: string | null;    // akan disimpan ke dataSurat.fileSuratPengantar
  catatanPenolakanRT?: string | null;
};

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const { user, error, status } = getAuthUserFromRequest(req);

  if (!user || user.role !== "RT") {
    return NextResponse.json({ message: error || "Unauthorized" }, { status });
  }

  const id = params.id;
  const body = (await req.json()) as BodyType;

  // Validasi status & field terkait
  if (!["DIVERIFIKASI_RT", "DITOLAK_RT"].includes(body.status)) {
    return NextResponse.json({ message: "Invalid status" }, { status: 400 });
  }
  if (body.status === "DITOLAK_RT" && !body.catatanPenolakanRT) {
    return NextResponse.json(
      { message: "catatanPenolakanRT wajib saat DITOLAK_RT" },
      { status: 400 },
    );
  }

  try {
    // Ambil dataSurat lama untuk merge (karena fileSuratPengantar disimpan di JSON)
    const existing = await prisma.surat.findUnique({
      where: { id },
      select: {
        dataSurat: true,
      },
    });

    // siapkan payload update
    const isDiverifikasi = body.status === "DIVERIFIKASI_RT";

    const mergedDataSurat =
      isDiverifikasi && body.fileSuratPengantar
        ? {
          ...((typeof existing?.dataSurat === "object" && existing?.dataSurat !== null) ? existing.dataSurat : {}),
          fileSuratPengantar: body.fileSuratPengantar,
        }
        : existing?.dataSurat ?? undefined;

    const result = await prisma.surat.update({
      where: { id },
      data: {
        tanggalVerifikasiRT: new Date(),
        rt: { connect: { id: user.sub } }, // sesuai schema: relasi RTVerifikasi
        status: body.status,
        ...(isDiverifikasi
          ? {} // tidak ada kolom fileSuratPengantar di schema → simpan di dataSurat
          : { catatanPenolakanRT: body.catatanPenolakanRT ?? null }),
        ...(mergedDataSurat !== undefined ? { dataSurat: mergedDataSurat as any } : {}),
      },
      include: {
        jenis: true,
        pemohon: true,
      },
    });

    // Email notifikasi (kalau pemohon punya email)
    const { pemohon, jenis } = result;
    if (pemohon?.email) {
      const subject = isDiverifikasi
        ? "Surat Anda Telah Diverifikasi RT"
        : "Pengajuan Surat Anda Ditolak oleh RT";

      const htmlContent = isDiverifikasi
        ? `
          <p style="font-size:16px">
            Halo <strong>${pemohon.username}</strong>,<br><br>
            Surat Anda dengan jenis <strong>${jenis.nama}</strong> telah <strong>diverifikasi oleh RT</strong>.
          </p>
          <p style="font-size:14px;color:#666">Selanjutnya surat akan diproses oleh petugas kelurahan.</p>
        `
        : `
          <p style="font-size:16px">
            Halo <strong>${pemohon.username}</strong>,<br><br>
            Mohon maaf, pengajuan surat Anda dengan jenis <strong>${jenis.nama}</strong> <strong>ditolak oleh RT</strong>.
          </p>
          <p style="font-size:14px;color:#666">Catatan Penolakan:</p>
          <blockquote style="background:#f8f8f8;padding:10px;border-left:4px solid #ccc;margin-top:5px;">
            ${body.catatanPenolakanRT || "-"}
          </blockquote>
        `;

      await transporter.sendMail({
        from: `"SISURAT Kelurahan Liliba" <${process.env.EMAIL_USER}>`,
        to: pemohon.email,
        subject: `${subject} - SISURAT Kelurahan Liliba`,
        html: `
          <div style="font-family:Arial, sans-serif; max-width:600px; margin:0 auto; padding:20px;">
            <div style="background:linear-gradient(135deg,#2d6cdf 0%,#00b3cc 100%); padding:30px; text-align:center; border-radius:10px 10px 0 0;">
              <h1 style="color:#fff; margin:0; font-size:22px;">${subject}</h1>
              <p style="color:#fff; margin:0;">SISURAT Kelurahan Liliba</p>
            </div>
            <div style="background:#fff; padding:30px; border-radius:0 0 10px 10px; box-shadow:0 4px 6px rgba(0,0,0,0.1);">
              ${htmlContent}
              <p style="margin-top:30px; font-size:14px; color:#666;">Terima kasih,<br>Kelurahan Liliba</p>
            </div>
          </div>
        `,
        text: `${subject} - SISURAT Kelurahan Liliba

Halo ${pemohon.username},

${isDiverifikasi
            ? `Surat Anda dengan jenis ${jenis.nama} telah diverifikasi oleh RT.`
            : `Pengajuan surat Anda dengan jenis ${jenis.nama} ditolak oleh RT.

Catatan Penolakan:
${body.catatanPenolakanRT || "-"}`
          }

Terima kasih,
Kelurahan Liliba`,
      });
    }

    return NextResponse.json(result);
  } catch (e) {
    console.error("RT_VERIFIKASI_ERROR", e);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
