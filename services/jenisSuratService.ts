import { JenisSurat } from "@prisma/client";
import axios from "axios";

export async function getAllJenisSurat(): Promise<JenisSurat[]> {
  const res = await axios.get("/api/jenis-surat");

  return res.data;
}

export async function getJenisSuratById(id: string): Promise<JenisSurat> {
  const res = await axios.get(`/api/jenis-surat/${id}`);

  return res.data;
}

export async function createJenisSurat(payload: Omit<JenisSurat, "id">) {
  const res = await axios.post("/api/jenis-surat", payload);

  return res.data;
}

export async function updateJenisSurat(
  id: string,
  payload: Partial<JenisSurat>,
) {
  const res = await axios.patch(`/api/jenis-surat/${id}`, payload);

  return res.data;
}

export async function deleteJenisSurat(id: string) {
  const res = await axios.delete(`/api/jenis-surat/${id}`);

  return res.data;
}
