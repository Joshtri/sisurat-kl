"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@heroui/react";
import { useEffect, useState } from "react";
import { convertFileToBase64 } from "@/utils/common";

export default function FormUsaha() {
  const {
    register,
    setValue,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useFormContext();

  const fotoFile = watch("dataSurat.fotoUsaha");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const file = fotoFile?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("dataSurat.fotoUsaha", {
        type: "manual",
        message: "File harus berupa gambar (jpg/png/webp)",
      });
      setPreviewUrl(null);
      return;
    }

    if (file.size > 1024 * 1024) {
      setError("dataSurat.fotoUsaha", {
        type: "manual",
        message: "Ukuran file maksimal 1 MB",
      });
      setPreviewUrl(null);
      return;
    }

    clearErrors("dataSurat.fotoUsaha");

    convertFileToBase64(file).then((base64) => {
      setValue("dataSurat.fotoUsahaBase64", base64);
      setPreviewUrl(base64);
    });
  }, [fotoFile, setValue, setError, clearErrors]);

  return (
    <div className="space-y-6">
      <Input
        {...register("dataSurat.namaUsaha")}
        label="Nama Usaha"
        placeholder="Contoh: Toko Jaya Abadi"
        radius="md"
        size="lg"
        variant="bordered"
      />

      <Input
        {...register("dataSurat.jenisUsaha")}
        label="Jenis Usaha"
        placeholder="Contoh: Toko Sembako"
        radius="md"
        size="lg"
        variant="bordered"
      />

      <Input
        {...register("dataSurat.alamatUsaha")}
        label="Alamat Usaha"
        placeholder="Contoh: Jl. El Tari No. 15, Liliba"
        radius="md"
        size="lg"
        variant="bordered"
      />

      <Input
        {...register("dataSurat.lamaUsaha")}
        label="Lama Usaha Berdiri"
        placeholder="Contoh: 5 tahun"
        radius="md"
        size="lg"
        variant="bordered"
      />

      <Input
        {...register("dataSurat.jumlahKaryawan")}
        label="Jumlah Karyawan (Opsional)"
        placeholder="Contoh: 3 orang"
        radius="md"
        size="lg"
        variant="bordered"
      />

      <Input
        {...register("dataSurat.penghasilanBulanan")}
        label="Penghasilan Perbulan (Opsional)"
        placeholder="Contoh: Rp 5.000.000"
        radius="md"
        size="lg"
        variant="bordered"
      />

      <Input
        {...register("dataSurat.tanggalMulaiUsaha")}
        label="Tanggal Mulai Usaha"
        type="date"
        placeholder="Contoh: 2020-01-01"
        radius="md"
        size="lg"
        variant="bordered"
      />

      <h3 className="text-lg font-semibold text-gray-800">
        Data Pendukung Usaha
      </h3>

      <div className="space-y-1">
        <label htmlFor="fotoUsahaInput" className="text-sm font-medium text-gray-700">
          Foto Usaha <span className="text-gray-500">(gambar, max 1MB)</span>
        </label>
        <Input
          id="fotoUsahaInput"
          type="file"
          accept="image/*"
          {...register("dataSurat.fotoUsaha")}
          radius="md"
          size="lg"
          variant="bordered"
        />
        {errors.dataSurat?.fotoUsaha && (
          <p className="text-sm text-red-500">
            {errors.dataSurat.fotoUsaha.message as string}
          </p>
        )}

        {previewUrl && (
          <img
            src={previewUrl}
            alt="Preview Usaha"
            className="mt-2 w-60 rounded border"
          />
        )}
      </div>
    </div>
  );
}
