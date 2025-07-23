import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUserFromRequest } from "@/lib/authHelpers";
import { transporter } from "@/lib/email";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const { user, error, status } = getAuthUserFromRequest(req);

  if (!user || user.role !== "STAFF") {
    return NextResponse.json({ message: error || "Unauthorized" }, { status });
  }

  const id = params.id;
  const body = await req.json();

  try {
    const updateData: any = {
      tanggalVerifikasiStaff: new Date(),
      idStaff: user.sub,
      status: body.status,
    };

    if (body.catatanPenolakan) {
      updateData.catatanPenolakan = body.catatanPenolakan;
    }

    if (body.noSurat) {
      updateData.noSurat = body.noSurat;
    }

    // Update surat dan ambil data pemohon & jenis
    const updated = await prisma.surat.update({
      where: { id },
      data: updateData,
      include: {
        jenis: true,
        pemohon: true,
      },
    });

    const { pemohon, jenis } = updated;

    // Kirim email notifikasi ke pemohon
    if (pemohon?.email) {
      const subject =
        body.status === "DIVERIFIKASI_STAFF"
          ? "Surat Anda Telah Diverifikasi Staff"
          : "Pengajuan Surat Anda Ditolak oleh Staff";

      const htmlContent =
        body.status === "DIVERIFIKASI_STAFF"
          ? `
            <p style="font-size: 16px;">
              Halo <strong>${pemohon.username}</strong>,<br><br>
              Surat Anda dengan jenis <strong>${jenis.nama}</strong> telah <strong>diverifikasi oleh petugas kelurahan</strong>.
            </p>
            <p style="font-size: 14px; color: #666;">Selanjutnya surat akan diproses oleh Lurah untuk finalisasi.</p>
          `
          : `
            <p style="font-size: 16px;">
              Halo <strong>${pemohon.username}</strong>,<br><br>
              Mohon maaf, pengajuan surat Anda dengan jenis <strong>${jenis.nama}</strong> <strong>ditolak oleh petugas kelurahan</strong>.
            </p>
            <p style="font-size: 14px; color: #666;">Catatan Penolakan:</p>
            <blockquote style="background:#f8f8f8;padding:10px;border-left:4px solid #ccc;margin-top:5px;">
              ${body.catatanPenolakan || "-"}
            </blockquote>
          `;

      await transporter.sendMail({
        from: `"SISURAT Kelurahan Liliba" <${process.env.EMAIL_USER}>`,
        to: pemohon.email,
        subject: `${subject} - SISURAT Kelurahan Liliba`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #2d6cdf 0%, #00b3cc 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 22px;">${subject}</h1>
              <p style="color: white; margin: 0;">SISURAT Kelurahan Liliba</p>
            </div>
            <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              ${htmlContent}
              <p style="margin-top: 30px; font-size: 14px; color: #666;">Terima kasih,<br>Kelurahan Liliba</p>
            </div>
          </div>
        `,
        text: `
${subject} - SISURAT Kelurahan Liliba

Halo ${pemohon.username},

${body.status === "DIVERIFIKASI_STAFF"
            ? `Surat Anda dengan jenis ${jenis.nama} telah diverifikasi oleh petugas kelurahan.`
            : `Pengajuan surat Anda dengan jenis ${jenis.nama} ditolak oleh petugas kelurahan.

Catatan Penolakan:
${body.catatanPenolakan || "-"}`
          }

Terima kasih,
Kelurahan Liliba
        `,
      });
    }

    return NextResponse.json({
      message: "Surat berhasil diproses dan notifikasi dikirim",
      data: updated,
    });
  } catch (error) {
    console.error("PATCH /api/staff/surat/[id]/verify error:", error);

    return NextResponse.json(
      { message: "Gagal memproses surat", error: error.message },
      { status: 500 },
    );
  }
}
