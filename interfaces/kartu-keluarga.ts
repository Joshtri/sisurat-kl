import { Warga } from "./warga";

export interface KartuKeluarga {
  id: string;
  nomorKK: string;
  kepalaKeluargaId: string;
  alamat: string;
  rt: string;
  rw: string;
  createdAt: string;
  updatedAt: string;
  kepalaKeluarga: Warga;
  anggota: Warga[]; // Memperjelas struktur anggota
}
