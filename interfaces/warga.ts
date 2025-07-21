export interface Warga {
  id: string;
  userId: string;
  namaLengkap: string;
  nik: string;
  tempatLahir: string;
  tanggalLahir: Date | null;
  jenisKelamin: string;
  pekerjaan: string;
  agama: string;
  noTelepon: string;
  rt: string;
  rw: string;
  alamat: string;
  foto: string | null;
  statusHidup: string;
  kartuKeluargaId: string | null;
  peranDalamKK: string | null;
  createdAt: string;
  updatedAt: string;

  kartuKeluarga?: {
    id: string;
    nomorKK: string;
    rt: string;
    rw: string;
    alamat: string;
    kepalaKeluarga: {
      id: string;
      namaLengkap: string;
    } | null;
  } | null;
}
