import { supabase } from "@/lib/supabase";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  const formData = await req.formData();
  const userId = formData.get("userId") as string;

  const uploads: Record<string, string> = {};

  for (const key of ["fileKtp", "fileKk"]) {
    const file = formData.get(key) as File;
    if (!file) continue;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const path = `warga/${userId}/${key}-${Date.now()}-${file.name}`;

    const { data, error } = await supabase.storage
      .from("sisurat-bucket")
      .upload(path, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });

    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/sisurat-bucket/${data.path}`;
    uploads[key] = url;
  }

  await prisma.warga.update({
    where: { userId },
    data: uploads,
  });

  return NextResponse.json({ message: "Berhasil update data", urls: uploads });
}
