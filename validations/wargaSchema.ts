// schemas/wargaSchema.ts
import { z } from "zod";

import { isValidNIK } from "@/utils/common";

export const wargaSchema = z.object({
  id: z.string().optional(), // ✅ tambahkan ini

  userId: z.string(),
  namaLengkap: z.string().min(3, "Nama lengkap minimal 3 karakter"),

  nik: z.string().refine(isValidNIK, {
    message: "NIK harus terdiri dari 16 digit angka",
  }),

  tempatLahir: z.string().optional(),

  tanggalLahir: z.union([z.string(), z.date()]).refine(
    (val) => {
      const date = typeof val === "string" ? new Date(val) : val;

      return date instanceof Date && !isNaN(date.getTime());
    },
    { message: "Tanggal lahir tidak valid" },
  ),

  jenisKelamin: z.enum(["LAKI_LAKI", "PEREMPUAN"]),

  pekerjaan: z
    .enum([
      "PELAJAR",
      "MAHASISWA",
      "PETANI",
      "NELAYAN",
      "PEGAWAI_NEGERI",
      "KARYAWAN_SWASTA",
      "WIRASWASTA",
      "GURU",
      "DOKTER",
      "IBU_RUMAH_TANGGA",
      "TIDAK_BEKERJA",
      "LAINNYA",
    ])
    .optional(),

  agama: z
    .enum([
      "KRISTEN",
      "ISLAM",
      "KATOLIK",
      "HINDU",
      "BUDDHA",
      "KHONGHUCU",
      "LAINNYA",
    ])
    .optional(),

  // noTelepon: z.string().optional(),

  // rt: z.string().refine(isValidRTRW, {
  //   message: "RT harus terdiri dari 3 digit angka (contoh: 001)",
  // }),

  // rw: z.string().refine(isValidRTRW, {
  //   message: "RW harus terdiri dari 3 digit angka (contoh: 001)",
  // }),

  // alamat: z.string().optional(),
  foto: z.string().nullable().optional(),

  statusHidup: z.enum(["HIDUP", "MENINGGAL"]).default("HIDUP"),

  kartuKeluargaId: z.string().nullable().optional(),

  peranDalamKK: z
    .enum(["KEPALA_KELUARGA", "ISTRI", "ANAK", "ORANG_TUA", "FAMILI_LAINNYA"])
    .optional(),
});

export type WargaSchema = z.infer<typeof wargaSchema>;
