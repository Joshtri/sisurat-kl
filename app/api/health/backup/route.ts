// /api/health/backup
import { readFile } from "fs/promises";
import path from "path";

import { NextResponse } from "next/server";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "backup.json");
    const content = await readFile(filePath, "utf-8");
    const data = JSON.parse(content);

    return NextResponse.json({ lastBackup: data.lastBackup });
  } catch (err) {
    return NextResponse.json({ lastBackup: null, error: "No backup found" });
  }
}
