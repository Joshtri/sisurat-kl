import axios from "axios";

export async function getAllRT(): Promise<any[]> {
  const res = await axios.get("/api/rt");

  return res.data;
}

export async function createRTProfile(data: {
  userId: string;
  nik: string;
  rt: string;
  rw: string;
  wilayah?: string;
}): Promise<any> {
  const res = await axios.post("/api/rt/profile", data);
  return res.data;
}

export async function getRTProfileByUserId(userId: string): Promise<any> {
  const res = await axios.get(`/api/rt/profile?userId=${userId}`);
  return res.data;
}

export async function updateRTProfile(
  userId: string,
  data: { nik?: string; rt?: string; rw?: string; wilayah?: string }
): Promise<any> {
  const res = await axios.patch(`/api/rt/profile?userId=${userId}`, data);
  return res.data;
}

export async function getRTDetails(id: string): Promise<any> {
  const res = await axios.get(`/api/rt/${id}`);

  return res.data;
}
