import axios from "axios";

export type TahapPenilaian = "RT" | "STAFF" | "LURAH";

export interface PenilaianData {
  idSurat: string;
  tahapRole: TahapPenilaian;
  rating: number;
  deskripsi?: string;
}

export interface Penilaian {
  id: string;
  idSurat: string;
  tahapRole: TahapPenilaian;
  rating: number;
  deskripsi?: string;
  createdAt: string;
  updatedAt: string;
}

export const createPenilaian = async (data: PenilaianData) => {
  const response = await axios.post("/api/penilaian", data);

  return response.data;
};

export const getPenilaianBySurat = async (idSurat: string) => {
  const response = await axios.get(`/api/penilaian?idSurat=${idSurat}`);

  return response.data.data as Penilaian[];
};
