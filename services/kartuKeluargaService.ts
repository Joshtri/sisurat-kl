// services/kartuKeluarga.service.ts
import axios from "axios";

import { KartuKeluarga } from "@/interfaces/kartu-keluarga";
// import { KartuKeluarga } from "@prisma/client";

export async function getKartuKeluarga(): Promise<KartuKeluarga[]> {
  const res = await axios.get("/api/kartu-keluarga");

  return res.data;
}

export async function createKartuKeluarga(data: Partial<KartuKeluarga>) {
  const res = await axios.post("/api/kartu-keluarga", data);

  return res.data;
}

export async function getKartuKeluargaById(id: string): Promise<KartuKeluarga> {
  const res = await axios.get(`/api/kartu-keluarga/${id}`);

  return res.data;
}

export async function getKartuKeluargaAnggota(
  id: string,
): Promise<KartuKeluarga> {
  const res = await axios.get(`/api/kartu-keluarga/${id}/anggota`);

  return res.data;
}
