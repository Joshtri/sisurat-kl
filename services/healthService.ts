import axios from "axios";

export interface HealthStatus {
  status: string;
  timestamp: string;
}

export interface DiskStatus {
  diskUsage: string; // misal "8056 kB"
}

export interface DatabaseStatus {
  database: string; // misal "Connected", "Maintenance Mode"
}

export interface BackupStatus {
  lastBackup: string;
}

export async function getServerStatus(): Promise<HealthStatus> {
  try {
    const res = await axios.get("/api/health/server");

    return res.data;
  } catch (err) {
    return { status: "Error", timestamp: new Date().toISOString() };
  }
}

export async function getDatabaseStatus(): Promise<DatabaseStatus> {
  try {
    const res = await axios.get("/api/health/database");

    return res.data;
  } catch (err) {
    return { database: "Error" };
  }
}

export async function getBackupStatus(): Promise<BackupStatus> {
  try {
    const res = await axios.get("/api/health/backup");

    return res.data;
  } catch (err) {
    return { lastBackup: "Unavailable" };
  }
}

export async function getDiskStatus(): Promise<DiskStatus> {
  try {
    const res = await fetch("/api/disk");

    if (!res.ok) throw new Error("Disk status failed");
    const data = await res.json();

    return {
      diskUsage: data.size ?? "Unknown",
    };
  } catch (err) {
    return { diskUsage: "Error" };
  }
}

export async function checkSystemHealth(): Promise<{
  server: { status: string; uptime: number; timestamp: string };
  database: { status: string; latencyMs: number };
}> {
  try {
    const res = await axios.get("/api/health/check");

    return res.data;
  } catch (err) {
    return {
      server: {
        status: "Unavailable",
        uptime: 0,
        timestamp: new Date().toISOString(),
      },
      database: {
        status: "Unavailable",
        latencyMs: 0,
      },
    };
  }
}
