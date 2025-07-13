import axios from "axios";

export async function getServerStatus(): Promise<{ server: string }> {
  const res = await axios.get("/api/health/server");

  return res.data;
}

export async function getDatabaseStatus(): Promise<{ database: string }> {
  const res = await axios.get("/api/health/database");

  return res.data;
}

export async function getBackupStatus(): Promise<{ lastBackup: string }> {
  const res = await axios.get("/api/health/backup");

  return res.data;
}

export async function getDiskStatus() {
  const res = await fetch("/api/disk");

  if (!res.ok) throw new Error("Gagal fetch ukuran DB");
  const data = await res.json();

  return {
    diskUsage: data.size, // misalnya "8056 kB"
  };
}

export async function checkSystemHealth(): Promise<{
  server: { status: string; uptime: number; timestamp: string };
  database: { status: string; latencyMs: number };
}> {
  const res = await axios.get("/api/health/check");

  return res.data;
}
