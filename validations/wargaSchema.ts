// schemas/wargaSchema.ts
import { z } from "zod";

export const wargaSchema = z.object({
  userId: z.string().uuid(),
  namaLengkap: z.string().min(3, "Nama lengkap minimal 3 karakter"),
  nik: z.string().length(16, "NIK harus terdiri dari 16 digit"),
  tempatTanggalLahir: z.string().optional(),
  jenisKelamin: z.enum(["LAKI_LAKI", "PEREMPUAN"]),
  pekerjaan: z.string().optional(),
  agama: z.string().optional(),
  noTelepon: z.string().optional(),
  rt: z.string().optional(),
  rw: z.string().optional(),
  alamat: z.string().optional(),
  foto: z.string().optional(),
  statusHidup: z.enum(["HIDUP", "MENINGGAL"]).default("HIDUP"),
  kartuKeluargaId: z.string().uuid().optional(),
  peranDalamKK: z
    .enum(["KEPALA_KELUARGA", "ISTRI", "ANAK", "ORANG_TUA", "FAMILI_LAINNYA"])
    .optional(),
});

export type WargaSchema = z.infer<typeof wargaSchema>;
