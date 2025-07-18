// File: app/api/health/check/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const serverStatus = {
      status: "Online",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };

    // Simulasi pengecekan database
    const dbStatus = {
      status: "Connected",
      latencyMs: Math.floor(Math.random() * 100),
    };

    return NextResponse.json({
      server: serverStatus,
      database: dbStatus,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Gagal mengambil status sistem" },
      { status: 500 },
    );
  }
}
