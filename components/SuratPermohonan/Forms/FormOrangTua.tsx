"use client";

import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";

import { getProfileKKAnak } from "@/services/wargaService";
import { convertFileToBase64 } from "@/utils/common";

interface Props {
  userId?: string;
}

export default function FormOrangTua({ userId }: Props) {
  const {
    register,
    setValue,
    watch,
    setError,
    clearErrors,
    formState: { isSubmitting, errors },
  } = useFormContext();

  const { data, isLoading } = useQuery({
    queryKey: ["kk-profile", userId],
    queryFn: () => getProfileKKAnak(userId!),
    enabled: !!userId,
  });

  const fileKtpAyah = watch("dataSurat.fileKtpAyah")?.[0];
  const fileKtpIbu = watch("dataSurat.fileKtpIbu")?.[0];
  const fileAktaLahir = watch("dataSurat.fileAktaLahirAnak")?.[0];

  useEffect(() => {
    if (data) {
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

  const handleFileValidation = async (
    file: File,
    fieldName: string,
    base64Field: string,
  ) => {
    const isValidType =
      file.type === "application/pdf" || file.type.startsWith("image/");

    if (!isValidType) {
      setError(fieldName, {
        type: "manual",
        message: "Hanya file gambar atau PDF yang diperbolehkan",
      });

      return;
    }

    if (file.size > 1024 * 1024) {
      setError(fieldName, {
        type: "manual",
        message: "Ukuran file maksimal 1 MB",
      });

      return;
    }

    clearErrors(fieldName);
    const base64 = await convertFileToBase64(file);

    setValue(base64Field, base64);
  };

  useEffect(() => {
    if (fileKtpAyah) {
      handleFileValidation(
        fileKtpAyah,
        "dataSurat.fileKtpAyah",
        "dataSurat.fileKtpAyahBase64",
      );
    }
  }, [fileKtpAyah]);

  useEffect(() => {
    if (fileKtpIbu) {
      handleFileValidation(
        fileKtpIbu,
        "dataSurat.fileKtpIbu",
        "dataSurat.fileKtpIbuBase64",
      );
    }
  }, [fileKtpIbu]);

  useEffect(() => {
    if (fileAktaLahir) {
      handleFileValidation(
        fileAktaLahir,
        "dataSurat.fileAktaLahirAnak",
        "dataSurat.fileAktaLahirAnakBase64",
      );
    }
  }, [fileAktaLahir]);

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

      <h3 className="text-lg font-semibold text-gray-800">
        Data Pendukung Orang Tua
      </h3>

      <div className="space-y-1">
        <Input
          {...register("dataSurat.fileKtpAyah")}
          type="file"
          label="KTP Ayah"
          placeholder="Contoh: upload file KTP Ayah"
          accept="application/pdf,image/*"
          radius="md"
          size="lg"
          variant="bordered"
        />
        {errors.dataSurat?.fileKtpAyah && (
          <p className="text-sm text-red-500">
            {errors.dataSurat.fileKtpAyah.message as string}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Input
          {...register("dataSurat.fileKtpIbu")}
          type="file"
          label="KTP Ibu"
          placeholder="Contoh: upload file KTP Ibu"
          accept="application/pdf,image/*"
          radius="md"
          size="lg"
          variant="bordered"
        />
        {errors.dataSurat?.fileKtpIbu && (
          <p className="text-sm text-red-500">
            {errors.dataSurat.fileKtpIbu.message as string}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Input
          {...register("dataSurat.fileAktaLahirAnak")}
          type="file"
          label="Akta Lahir Anak"
          placeholder="Contoh: upload file Akta Lahir Anak"
          accept="application/pdf,image/*"
          radius="md"
          size="lg"
          variant="bordered"
        />
        {errors.dataSurat?.fileAktaLahirAnak && (
          <p className="text-sm text-red-500">
            {errors.dataSurat.fileAktaLahirAnak.message as string}
          </p>
        )}
      </div>
    </div>
  );
}
