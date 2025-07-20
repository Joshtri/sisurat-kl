"use client";

import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";

import { getProfileKKAnak } from "@/services/wargaService";

interface Props {
  userId?: string;
}

export default function FormOrangTua({ userId }: Props) {
  const {
    register,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useFormContext();

  const { data, isLoading } = useQuery({
    queryKey: ["kk-profile", userId],
    queryFn: () => getProfileKKAnak(userId!),
    enabled: !!userId,
  });

  // Set individual fields tanpa mereset form
  useEffect(() => {
    if (data) {
      // Set field satu per satu untuk menghindari reset form
      setValue("dataSurat.namaAyah", data.namaAyah || "");
      setValue("dataSurat.pekerjaanAyah", data.pekerjaanAyah || "");
      setValue("dataSurat.namaIbu", data.namaIbu || "");
      setValue("dataSurat.pekerjaanIbu", data.pekerjaanIbu || "");
      setValue("dataSurat.alamatOrtu", data.alamatOrtu || "");
      setValue("dataSurat.namaAnak", data.namaAnak || "");
      setValue(
        "dataSurat.tanggalLahirAnak",
        data.tanggalLahirAnak?.slice(0, 10) || "",
      );
    }
  }, [data, setValue]);

  return (
    <div className="space-y-6">
      <Input
        {...register("dataSurat.namaAyah")}
        label="Nama Ayah"
        readOnly
        radius="md"
        size="lg"
        variant="bordered"
        isLoading={isLoading}
      />
      <Input
        {...register("dataSurat.pekerjaanAyah")}
        label="Pekerjaan Ayah"
        readOnly
        radius="md"
        size="lg"
        variant="bordered"
        isLoading={isLoading}
      />

      <Input
        {...register("dataSurat.namaIbu")}
        label="Nama Ibu"
        readOnly
        radius="md"
        size="lg"
        variant="bordered"
        isLoading={isLoading}
      />
      <Input
        {...register("dataSurat.pekerjaanIbu")}
        label="Pekerjaan Ibu"
        readOnly
        radius="md"
        size="lg"
        variant="bordered"
        isLoading={isLoading}
      />

      <Input
        {...register("dataSurat.alamatOrtu")}
        label="Alamat Orang Tua"
        readOnly
        radius="md"
        size="lg"
        variant="bordered"
        isLoading={isLoading}
      />

      <Input
        {...register("dataSurat.namaAnak")}
        label="Nama Anak"
        placeholder="Contoh: Siti Aminah"
        radius="md"
        size="lg"
        variant="bordered"
      />
      <Input
        {...register("dataSurat.tanggalLahirAnak")}
        type="date"
        label="Tanggal Lahir Anak"
        radius="md"
        size="lg"
        variant="bordered"
      />
    </div>
  );
}
