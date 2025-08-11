"use client";

import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Input, Select, SelectItem } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";

import { getAnggotaByKkId } from "@/services/wargaService";
import { convertFileToBase64 } from "@/utils/common";

interface Props {
  kartuKeluargaId: string;
}

export default function FormTidakDiTempat({ kartuKeluargaId }: Props) {
  const {
    register,
    setValue,
    setError,
    clearErrors,
    watch,
    formState: { errors },
  } = useFormContext();

  const [selectedNama, setSelectedNama] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["anggota-kk", kartuKeluargaId],
    queryFn: () => getAnggotaByKkId(kartuKeluargaId),
    enabled: !!kartuKeluargaId,
  });

  const anggotaKeluarga = (data?.data || []).filter(
    (a: any) =>
      a.peranDalamKK === "KEPALA_KELUARGA" || a.peranDalamKK === "ISTRI"
  );

  const selected = anggotaKeluarga.find(
    (a: any) => a.namaLengkap === selectedNama
  );
  const suketFile = watch("dataSurat.suketPribadiPasangan");

  useEffect(() => {
    register("dataSurat.namaPasangan");
    register("dataSurat.namaYangTidakDiTempat");
    register("dataSurat.suketPribadiPasangan");
    register("dataSurat.hubungan");
    register("dataSurat.alasanTidakDiTempat");
    register("dataSurat.lokasiTujuan");
    register("dataSurat.tanggalMulai");
    register("dataSurat.tanggalSelesai");
    register("dataSurat.suketPribadiPasanganBase64");

    if (selected) {
      setValue("dataSurat.namaPasangan", selected.namaLengkap);
      setValue("dataSurat.namaYangTidakDiTempat", selected.namaLengkap);
    }
  }, [selected, register, setValue]);

  // Proses file ke base64 & validasi
  useEffect(() => {
    const file = suketFile?.[0];

    if (!file) return;

    const isValidType =
      file.type === "application/pdf" || file.type.startsWith("image/");

    if (!isValidType) {
      setError("dataSurat.suketPribadiPasangan", {
        type: "manual",
        message: "Hanya file gambar atau PDF yang diperbolehkan",
      });

      return;
    }

    if (file.size > 1024 * 1024) {
      setError("dataSurat.suketPribadiPasangan", {
        type: "manual",
        message: "Ukuran file maksimal 1 MB",
      });

      return;
    }

    clearErrors("dataSurat.suketPribadiPasangan");

    convertFileToBase64(file).then((base64) => {
      setValue("dataSurat.suketPribadiPasanganBase64", base64);
    });
  }, [suketFile, setValue, setError, clearErrors]);

  return (
    <div className="space-y-6">
      {/* Pilih suami atau istri */}
      <Select
        label="Pilih Pasangan yang Tidak di Tempat"
        placeholder="Pilih Kepala Keluarga atau Istri"
        selectedKeys={selectedNama ? new Set([selectedNama]) : new Set()}
        onSelectionChange={(keys) => {
          const nama = Array.from(keys)[0] as string;
          setSelectedNama(nama);
        }}
        isLoading={isLoading}
        variant="bordered"
        radius="md"
        size="lg"
      >
        {anggotaKeluarga.map((a: any) => (
          <SelectItem
            key={a.namaLengkap}
            value={a.namaLengkap}
            textValue={`${a.namaLengkap} - ${a.peranDalamKK}`}
          >
            {a.namaLengkap} - {a.peranDalamKK} ({a.nik})
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

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">
          Upload Surat Pribadi Pasangan{" "}
          <span className="text-gray-500">(gambar/pdf, max 1MB)</span>
        </label>
        <Input
          {...register("dataSurat.suketPribadiPasangan")}
          type="file"
          accept="application/pdf,image/*"
          radius="md"
          size="lg"
          variant="bordered"
          required
        />
        {errors.dataSurat?.suketPribadiPasangan && (
          <p className="text-sm text-red-500">
            {errors.dataSurat.suketPribadiPasangan.message as string}
          </p>
        )}
      </div>
    </div>
  );
}
