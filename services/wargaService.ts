// import { Warga } from "@prisma/client";
import axios from "axios";

import { Warga } from "@/interfaces/warga";

export async function getAllWarga(): Promise<Warga[]> {
  const res = await axios.get("/api/warga");

  return res.data;
}

export async function getWargaById(id: string) {
  const res = await axios.get(`/api/warga/${id}`);

  return res.data;
}

export async function createWarga(payload: Partial<Warga>) {
  const res = await axios.post("/api/warga", payload);

  return res.data;
}

export async function updateWarga(id: string, payload: Partial<Warga>) {
  const res = await axios.patch(`/api/warga/${id}`, payload);

  return res.data;
}

export async function deleteWarga(id: string) {
  const res = await axios.delete(`/api/warga/${id}`);

  return res.data;
}

export async function getWargaByRT() {
  const token = localStorage.getItem("token");
  const res = await fetch("/api/warga/by-rt", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Gagal mengambil data warga RT");
  }

  return res.json();
}

export async function getAnggotaByKkId(kartuKeluargaId: string) {
  const res = await axios.get(`/api/warga/by-kk/${kartuKeluargaId}`);

  return res.data; // asumsikan ini mengembalikan Warga[]
}

export async function getProfileKKAnak(userId: string) {
  const res = await axios.get(`/api/profiles/kk/${userId}`);

  return res.data;
}
