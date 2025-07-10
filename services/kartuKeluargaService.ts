// services/kartuKeluarga.service.ts
import axios from "axios";
import { KartuKeluarga } from "@prisma/client";

export async function getKartuKeluarga(): Promise<KartuKeluarga[]> {
  const res = await axios.get("/api/kartu-keluarga");

  return res.data;
}
