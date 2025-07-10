import { Warga } from "@prisma/client";
import axios from "axios";

export async function getAllWarga(): Promise<Warga[]> {
  const res = await axios.get("/api/warga");

  return res.data;
}

export async function getWargaById(id: string): Promise<Warga> {
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
