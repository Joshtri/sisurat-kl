"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@heroui/react";

export default function FormJandaDuda() {
  const { register } = useFormContext();

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800">Data Pendukung</h3>

      <Input
        {...register("dataSurat.aktaKematianSuamiIstri")}
        label="Upload Akta Kematian Suami/Istri"
        type="file"
        accept="application/pdf,image/*"
        radius="md"
        size="lg"
        variant="bordered"
      />
    </div>
  );
}
