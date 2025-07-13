// /app/api/maintenance/route.ts
import { prisma } from "@/lib/prisma"; // sesuaikan path

export async function GET() {
  const setting = await prisma.setting.findUnique({
    where: { key: "maintenance" },
  });

  const isMaintenance = setting?.value === "true";

  return Response.json({ isMaintenance });
}

export async function POST(req: Request) {
  const body = await req.json();
  const isMaintenance = !!body.isMaintenance;

  await prisma.setting.upsert({
    where: { key: "maintenance" },
    update: { value: isMaintenance.toString() },
    create: { key: "maintenance", value: isMaintenance.toString() },
  });

  return Response.json({ success: true, isMaintenance });
}
