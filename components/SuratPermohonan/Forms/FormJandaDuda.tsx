"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@heroui/react";

export default function FormJandaDuda() {
  const { register } = useFormContext();

  return (
    <div className="space-y-6">
      <Input
        {...register("alasanPengajuan")}
        label="Alasan Permohonan Surat"
        placeholder="Contoh: Untuk keperluan bank"
        radius="md"
        size="lg"
        variant="bordered"
      />
    </div>
  );
}
