"use client";

import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Input, Select, SelectItem } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";

import { getAnggotaByKkId } from "@/services/wargaService";

interface Props {
  kartuKeluargaId: string;
}

export default function FormTidakDiTempat({ kartuKeluargaId }: Props) {
  const { register, setValue } = useFormContext();
  const [selectedId, setSelectedId] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["anggota-kk", kartuKeluargaId],
    queryFn: () => getAnggotaByKkId(kartuKeluargaId),
    enabled: !!kartuKeluargaId,
  });

  // Filter hanya Kepala Keluarga & Istri
  const anggotaKeluarga = (data?.data || []).filter(
    (a: any) =>
      a.peranDalamKK === "KEPALA_KELUARGA" || a.peranDalamKK === "ISTRI",
  );

  const selected = anggotaKeluarga.find((a: any) => a.id === selectedId);

  useEffect(() => {
    register("dataSurat.idPasangan");
    register("dataSurat.namaYangTidakDiTempat");
    register("dataSurat.hubungan");
    register("dataSurat.alasanTidakDiTempat");
    register("dataSurat.lokasiTujuan");
    register("dataSurat.tanggalMulai");
    register("dataSurat.tanggalSelesai");

    if (selected) {
      setValue("dataSurat.idPasangan", selected.id);
      setValue("dataSurat.namaYangTidakDiTempat", selected.namaLengkap);
    }
  }, [selected, register, setValue]);

  return (
    <div className="space-y-6">
      {/* Pilih suami atau istri */}
      <Select
        label="Pilih Pasangan yang Tidak di Tempat"
        placeholder="Pilih Kepala Keluarga atau Istri"
        onChange={(e) => setSelectedId(e.target.value)}
        isLoading={isLoading}
        variant="bordered"
        radius="md"
        size="lg"
        name="idPasangan"
      >
        {anggotaKeluarga.map((a: any) => (
          <SelectItem
            key={a.id}
            textValue={`${a.namaLengkap} - ${a.peranDalamKK}`}
          >
            {a.namaLengkap} - {a.nik}
          </SelectItem>
        ))}
      </Select>

      <Input
        {...register("dataSurat.hubungan")}
        label="Hubungan Anda dengan yang Tidak di Tempat"
        placeholder="Contoh: Suami / Istri"
        radius="md"
        size="lg"
        variant="bordered"
      />

      <Input
        {...register("dataSurat.alasanTidakDiTempat")}
        label="Alasan Tidak Berada di Tempat"
        placeholder="Contoh: Bekerja di luar kota"
        radius="md"
        size="lg"
        variant="bordered"
      />

      <Input
        {...register("dataSurat.lokasiTujuan")}
        label="Lokasi Tujuan"
        placeholder="Contoh: Jakarta"
        radius="md"
        size="lg"
        variant="bordered"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          {...register("dataSurat.tanggalMulai")}
          type="date"
          label="Tanggal Mulai"
          radius="md"
          size="lg"
          variant="bordered"
        />
        <Input
          {...register("dataSurat.tanggalSelesai")}
          type="date"
          label="Tanggal Selesai"
          radius="md"
          size="lg"
          variant="bordered"
        />
      </div>
    </div>
  );
}
