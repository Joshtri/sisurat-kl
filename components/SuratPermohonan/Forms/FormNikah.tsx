"use client";

import { useFormContext } from "react-hook-form";
import { Input, Select, SelectItem } from "@heroui/react";
import { useEffect, useState } from "react";

export default function FormNikah() {
  const { register, watch } = useFormContext();

  const jenisKelamin = watch("jenisKelamin"); // ini akan auto-terisi dari database
  const statusPerkawinan = watch("statusPerkawinan");

  const [showStatusPria, setShowStatusPria] = useState(false);
  const [showStatusWanita, setShowStatusWanita] = useState(false);

  useEffect(() => {
    setShowStatusPria(
      jenisKelamin === "Laki-laki" && statusPerkawinan === "Pernah Menikah",
    );
    setShowStatusWanita(
      jenisKelamin === "Perempuan" && statusPerkawinan === "Pernah Menikah",
    );
  }, [jenisKelamin, statusPerkawinan]);

  return (
    <div className="space-y-6">
      {/* Bin / Binti */}
      <Input
        {...register("dataSurat.binBinti")}
        label="Bin / Binti"
        placeholder="Contoh: Yohanes Polin"
        radius="md"
        size="lg"
        variant="bordered"
      />

      {/* Status Perkawinan */}
      <Select
        {...register("dataSurat.statusPerkawinan")}
        label="Status Perkawinan"
        placeholder="Pilih status"
        radius="md"
        size="lg"
        variant="bordered"
      >
        <SelectItem key="Belum Menikah" textValue="Belum Menikah">
          Belum Menikah
        </SelectItem>
        <SelectItem key="Pernah Menikah" textValue="Pernah Menikah">
          Pernah Menikah
        </SelectItem>
      </Select>

      {/* Jika pria pernah menikah */}
      {showStatusPria && (
        <Input
          {...register("dataSurat.statusPria")}
          label="Jika Pria, Jejaka / Duda dan jumlah istri"
          placeholder="Contoh: Duda beristri 1"
          radius="md"
          size="lg"
          variant="bordered"
        />
      )}

      {/* Jika wanita pernah menikah */}
      {showStatusWanita && (
        <Input
          {...register("dataSurat.statusWanita")}
          label="Jika Wanita, Perawan / Janda"
          placeholder="Contoh: Janda"
          radius="md"
          size="lg"
          variant="bordered"
        />
      )}

      {/* Nama pasangan terdahulu */}
      {statusPerkawinan === "Pernah Menikah" && (
        <Input
          {...register("dataSurat.namaPasanganTerdahulu")}
          label="Nama Suami / Istri Terdahulu"
          placeholder="Contoh: Yohanes Noni"
          radius="md"
          size="lg"
          variant="bordered"
        />
      )}
    </div>
  );
}
