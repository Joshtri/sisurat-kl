import axios from "axios";

export async function getDashboardStats() {
  const res = await axios.get("/api/superadmin/dashboard");

  return res.data;
}

export interface RTDashboardStats {
  totalWarga: number;
  totalSuratMasuk: number;
  totalSuratVerified: number;
}

export async function getRTDashboardStats(
  userId: string,
): Promise<RTDashboardStats> {
  const res = await axios.get(`/api/dashboard/rt?userId=${userId}`);

  return res.data;
}

export async function getLurahDashboardStats() {
  const res = await fetch("/api/lurah/dashboard");

  if (!res.ok) throw new Error("Gagal memuat data dashboard lurah");

  return res.json();
}

export async function getWargaDashboardStats(userId: string) {
  const res = await fetch(`/api/warga/dashboard?userId=${userId}`);

  if (!res.ok) throw new Error("Gagal mengambil data dashboard warga");

  return res.json();
}

export async function getStaffDashboardStats(userId: string) {
  const res = await axios.get(`/api/dashboard/staff?userId=${userId}`);

  return res.data;
}
