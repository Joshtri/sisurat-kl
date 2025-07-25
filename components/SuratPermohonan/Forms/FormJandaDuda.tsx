"use client";

import { useEffect, useCallback } from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@heroui/react";

import { convertFileToBase64 } from "@/utils/common";

export default function FormJandaDuda() {
  const {
    register,
    setValue,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useFormContext();

  const fileAktaKematian = watch("dataSurat.aktaKematianSuamiIstri")?.[0];

  const handleFileValidation = async (
    file: File,
    fieldName: string,
    base64Field: string
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
    if (fileAktaKematian) {
      handleFileValidation(
        fileAktaKematian,
        "dataSurat.aktaKematianSuamiIstri",
        "dataSurat.aktaKematianSuamiIstriBase64"
      );
    }
  }, [fileAktaKematian]);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800">Data Pendukung</h3>

      <div className="space-y-1">
        <Input
          {...register("dataSurat.aktaKematianSuamiIstri")}
          label="Upload Akta Kematian Suami/Istri"
          type="file"
          accept="application/pdf,image/*"
          radius="md"
          size="lg"
          variant="bordered"
        />
        {errors.dataSurat?.aktaKematianSuamiIstri && (
          <p className="text-sm text-red-500">
            {errors.dataSurat.aktaKematianSuamiIstri.message as string}
          </p>
        )}
      </div>
    </div>
  );
}
