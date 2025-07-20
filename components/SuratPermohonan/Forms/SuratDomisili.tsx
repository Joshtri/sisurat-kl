"use client";

import { useFormContext } from "react-hook-form";
import { Input, Select, SelectItem } from "@heroui/react";
import { useEffect, useState } from "react";

export default function FormDomisili() {
  const { register, watch } = useFormContext();
  const statusTempatTinggal = watch("statusTempatTinggal");

  const [showNamaPemilik, setShowNamaPemilik] = useState(false);

  useEffect(() => {
    setShowNamaPemilik(
      statusTempatTinggal === "sewa" || statusTempatTinggal === "menumpang",
    );
  }, [statusTempatTinggal]);

  return (
    <div className="space-y-6">
      <Input
        {...register("dataSurat.tujuanPermohonan")}
        label="Tujuan Permohonan Surat Domisili"
        placeholder="Contoh: Pengurusan KTP / KK"
        radius="md"
        size="lg"
        variant="bordered"
      />
      {/* Alamat Domisili */}
      <Input
        {...register("dataSurat.alamatDomisili")}
        label="Alamat Domisili Saat Ini"
        placeholder="Contoh: Jl. Garuda No. 45, Liliba"
        radius="md"
        size="lg"
        variant="bordered"
      />

      {/* Sejak Tinggal */}
      <Input
        {...register("dataSurat.sejakTinggal")}
        type="date"
        label="Sejak Tinggal di Alamat Ini"
        radius="md"
        size="lg"
        variant="bordered"
      />

      {/* Status Tempat Tinggal */}
      <Select
        {...register("dataSurat.statusTempatTinggal")}
        label="Status Tempat Tinggal"
        placeholder="Pilih status tempat tinggal"
        radius="md"
        size="lg"
        variant="bordered"
      >
        <SelectItem key="milik_sendiri">Milik Sendiri</SelectItem>
        <SelectItem key="sewa">Sewa / Kontrak</SelectItem>
        <SelectItem key="menumpang">Menumpang</SelectItem>
      </Select>

      {/* Nama Pemilik Rumah */}
      {showNamaPemilik && (
        <Input
          {...register("dataSurat.namaPemilikRumah")}
          label="Nama Pemilik Rumah"
          placeholder="Contoh: Bapak Agus Salim"
          radius="md"
          size="lg"
          variant="bordered"
        />
      )}
    </div>
  );
}
