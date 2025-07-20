"use client";

import { useFormContext } from "react-hook-form";

export default function FormBelumMenikah() {
  const { register } = useFormContext();

  return (
    <div className="space-y-6">
      {/* Alasan tambahan */}
      {/* <Input
        {...register("alasanPermohonan")}
        label="Alasan Permohonan Surat"
        placeholder="Contoh: Untuk syarat pendaftaran CPNS"
        radius="md"
        size="lg"
        variant="bordered"
      /> */}
    </div>
  );
}
