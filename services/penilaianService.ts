import axios from "axios";

export interface PenilaianData {
  idSurat: string;
  rating: number;
  deskripsi?: string;
}

export interface Penilaian {
  id: string;
  idSurat: string;
  rating: number;
  deskripsi?: string;
  createdAt: string;
  updatedAt: string;
}

export const createOrUpdatePenilaian = async (data: PenilaianData) => {
  const response = await axios.post("/api/penilaian", data);

  return response.data;
};

export const getPenilaianBySurat = async (idSurat: string) => {
  const response = await axios.get(`/api/penilaian?idSurat=${idSurat}`);

  return response.data.data as Penilaian;
};
