import { Warga } from "@/interfaces/warga";

export function mapWargaToSuratFields(warga: Warga) {
  return {
    namaLengkap: warga.namaLengkap,
    nik: warga.nik,
    tempatTanggalLahir: `${warga.tempatLahir}, ${
      warga.tanggalLahir
        ? new Date(warga.tanggalLahir).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })
        : ""
    }`,
    jenisKelamin: warga.jenisKelamin,
    agama: warga.agama,
    pekerjaan: warga.pekerjaan,
    alamat: warga.alamat,
    noTelepon: warga.noTelepon,
  };
}
