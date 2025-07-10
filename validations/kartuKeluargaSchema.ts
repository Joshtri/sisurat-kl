import { z } from "zod";

export const kartuKeluargaSchema = z.object({
  nomorKK: z
    .string()
    .min(16, "Nomor KK harus 16 digit")
    .max(16, "Nomor KK harus 16 digit"),
  kepalaKeluargaId: z.string().min(1, "Kepala keluarga harus dipilih"),
  alamat: z.string().min(1, "Alamat wajib diisi"),
  rt: z.string().optional(),
  rw: z.string().optional(),
});

export type KartuKeluargaSchema = z.infer<typeof kartuKeluargaSchema>;
