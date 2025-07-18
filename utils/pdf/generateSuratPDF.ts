import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export async function generateSuratPDF(surat: any) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4 size
  const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);

  const { width, height } = page.getSize();
  let y = height - 50;
  const draw = (label: string, value: string | null | undefined) => {
    page.drawText(`${label}: ${value ?? "-"}`, {
      x: 50,
      y,
      size: 12,
      font,
      color: rgb(0, 0, 0),
    });
    y -= 20;
  };

  draw("SURAT KETERANGAN", "");
  y -= 10;
  draw("Nama Lengkap", surat.namaLengkap);
  draw("NIK", surat.nik);
  draw("Tempat/Tanggal Lahir", surat.tempatTanggalLahir);
  draw("Jenis Kelamin", surat.jenisKelamin);
  draw("Agama", surat.agama);
  draw("Pekerjaan", surat.pekerjaan);
  draw("Alamat", surat.alamat);
  draw("Alasan Pengajuan", surat.alasanPengajuan);
  draw(
    "Tanggal Pengajuan",
    surat.tanggalPengajuan?.toLocaleDateString("id-ID"),
  );

  y -= 30;
  draw("Diterbitkan oleh:", "Kelurahan Liliba");
  draw("Tanggal Cetak", new Date().toLocaleDateString("id-ID"));

  return pdfDoc.save();
}
