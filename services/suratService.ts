// services/suratService.ts
import { Surat } from "@prisma/client";

// import axios from "axios";
import axios from "@/utils/axiosWithAuth";
// export interface SuratResponse {
//   id: string;
//   namaLengkap: string;
//   nik: string;
//   jenisKelamin: string;
//   tempatTanggalLahir: string;
//   alamat?: string;
//   pekerjaan?: string;
//   jenis: {
// nama: string;
//   };
//   status: string;
//   tanggalPengajuan?: string;
// }

export async function getAllSurat(): Promise<Surat[]> {
  const res = await axios.get("/api/surat");

  return res.data;
}

// ✅ Submit surat baru
export async function createSurat(data: any): Promise<Surat> {
  const res = await axios.post("/api/surat", data);

  return res.data.data; // ambil dari response { message, data }
}
