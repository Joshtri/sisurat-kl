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
      // Set value only if field is empty (tidak override jika user sudah mengisi)
      const currentNamaAyah = watch("dataSurat.namaAyah");
      const currentPekerjaanAyah = watch("dataSurat.pekerjaanAyah");
      const currentNamaIbu = watch("dataSurat.namaIbu");
      const currentPekerjaanIbu = watch("dataSurat.pekerjaanIbu");
      const currentAlamatOrtu = watch("dataSurat.alamatOrtu");
      const currentNamaAnak = watch("dataSurat.namaAnak");
      const currentTanggalLahirAnak = watch("dataSurat.tanggalLahirAnak");

      if (!currentNamaAyah) setValue("dataSurat.namaAyah", data.namaAyah || "");
      if (!currentPekerjaanAyah)
        setValue("dataSurat.pekerjaanAyah", data.pekerjaanAyah || "");
      if (!currentNamaIbu) setValue("dataSurat.namaIbu", data.namaIbu || "");
      if (!currentPekerjaanIbu)
        setValue("dataSurat.pekerjaanIbu", data.pekerjaanIbu || "");
      if (!currentAlamatOrtu)
        setValue("dataSurat.alamatOrtu", data.alamatOrtu || "");
      if (!currentNamaAnak) setValue("dataSurat.namaAnak", data.namaAnak || "");
      if (!currentTanggalLahirAnak) {
        setValue(
          "dataSurat.tanggalLahirAnak",
          data.tanggalLahirAnak?.slice(0, 10) || ""
        );
      }
    }
  }, [data, setValue, watch]);

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
    if (fileKtpAyah) {
      handleFileValidation(
        fileKtpAyah,
        "dataSurat.fileKtpAyah",
        "dataSurat.fileKtpAyahBase64"
      );
    }
  }, [fileKtpAyah]);

  useEffect(() => {
    if (fileKtpIbu) {
      handleFileValidation(
        fileKtpIbu,
        "dataSurat.fileKtpIbu",
        "dataSurat.fileKtpIbuBase64"
      );
    }
  }, [fileKtpIbu]);

  useEffect(() => {
    if (fileAktaLahir) {
      handleFileValidation(
        fileAktaLahir,
        "dataSurat.fileAktaLahirAnak",
        "dataSurat.fileAktaLahirAnakBase64"
      );
    }
  }, [fileAktaLahir]);

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-l-blue-500">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">
          📋 Data Orang Tua
        </h3>
        <p className="text-sm text-blue-600">
          {isLoading
            ? "⏳ Memuat data dari KK..."
            : "✏️ Data di bawah dapat diedit sesuai kebutuhan. Data awal diambil dari Kartu Keluarga."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          {...register("dataSurat.namaAyah")}
          label="Nama Ayah"
          placeholder="Masukkan nama ayah"
          radius="md"
          size="lg"
          variant="bordered"
          isLoading={isLoading}
          description="Data dari KK, dapat diedit"
        />
        <Input
          {...register("dataSurat.pekerjaanAyah")}
          label="Pekerjaan Ayah"
          placeholder="Masukkan pekerjaan ayah"
          radius="md"
          size="lg"
          variant="bordered"
          isLoading={isLoading}
          description="Data dari KK, dapat diedit"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          {...register("dataSurat.namaIbu")}
          label="Nama Ibu"
          placeholder="Masukkan nama ibu"
          radius="md"
          size="lg"
          variant="bordered"
          isLoading={isLoading}
          description="Data dari KK, dapat diedit"
        />
        <Input
          {...register("dataSurat.pekerjaanIbu")}
          label="Pekerjaan Ibu"
          placeholder="Masukkan pekerjaan ibu"
          radius="md"
          size="lg"
          variant="bordered"
          isLoading={isLoading}
          description="Data dari KK, dapat diedit"
        />
      </div>

      <Input
        {...register("dataSurat.alamatOrtu")}
        label="Alamat Orang Tua"
        placeholder="Masukkan alamat orang tua"
        radius="md"
        size="lg"
        variant="bordered"
        isLoading={isLoading}
        description="Data dari KK, dapat diedit"
      />

      <div className="bg-green-50 p-4 rounded-lg border-l-4 border-l-green-500">
        <h3 className="text-lg font-semibold text-green-800 mb-2">
          👶 Data Anak
        </h3>
        <p className="text-sm text-green-600">
          Masukkan data lengkap anak yang membutuhkan surat keterangan orang
          tua.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          {...register("dataSurat.namaAnak")}
          label="Nama Lengkap Anak"
          placeholder="Contoh: Siti Aminah"
          radius="md"
          size="lg"
          variant="bordered"
          isRequired
        />
        <Input
          {...register("dataSurat.tanggalLahirAnak")}
          type="date"
          label="Tanggal Lahir Anak"
          radius="md"
          size="lg"
          variant="bordered"
          isRequired
        />
      </div>

      <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-l-orange-500">
        <h3 className="text-lg font-semibold text-orange-800 mb-4">
          📎 Data Pendukung
        </h3>
        <p className="text-sm text-orange-600 mb-4">
          Upload dokumen pendukung dalam format PDF atau gambar (maksimal 1MB
          per file).
        </p>

        <div className="space-y-4">
          <div className="space-y-1">
            <Input
              {...register("dataSurat.fileKtpAyah")}
              type="file"
              label="📄 KTP Ayah"
              placeholder="Pilih file KTP Ayah"
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
              label="📄 KTP Ibu"
              placeholder="Pilih file KTP Ibu"
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
              label="📋 Akta Lahir Anak"
              placeholder="Pilih file Akta Lahir Anak"
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
      </div>
    </div>
  );
}
