import { z } from "zod";

export const jenisSuratSchema = z.object({
  kode: z.string().min(1, "Kode wajib diisi"),
  nama: z.string().min(1, "Nama wajib diisi"),
  deskripsi: z.string().optional(),
  aktif: z.boolean().optional().default(true),
});

export type JenisSuratSchema = z.infer<typeof jenisSuratSchema>;
