"use client";

import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Input, Select, SelectItem } from "@heroui/react";

import { convertFileToBase64 } from "@/utils/common";

export default function FormKelahiran() {
  const { register, setValue, watch, setError, clearErrors } = useFormContext();

  const suketRSFile = watch("dataSurat.suketRS");
  const ktpSaksiFile = watch("dataSurat.ktpSaksi");

  useEffect(() => {
    const file = suketRSFile?.[0];

    if (file) {
      if (file.size > 1024 * 1024) {
        setError("dataSurat.suketRS", {
          type: "manual",
          message: "Ukuran file maksimal 1 MB",
        });

        return;
      } else {
        clearErrors("dataSurat.suketRS");
      }

      convertFileToBase64(file).then((base64) => {
        setValue("dataSurat.suketRSBase64", base64);
      });
    }
  }, [suketRSFile, setValue, setError, clearErrors]);

  useEffect(() => {
    const file = ktpSaksiFile?.[0];

    if (file) {
      if (file.size > 1024 * 1024) {
        setError("dataSurat.ktpSaksi", {
          type: "manual",
          message: "Ukuran file maksimal 1 MB",
        });

        return;
      } else {
        clearErrors("dataSurat.ktpSaksi");
      }

      convertFileToBase64(file).then((base64) => {
        setValue("dataSurat.ktpSaksiBase64", base64);
      });
    }
  }, [ktpSaksiFile, setValue, setError, clearErrors]);

  return (
    <div className="space-y-6">
      <Input
        {...register("dataSurat.namaAnak")}
        label="Nama Anak"
        placeholder="Contoh: Siti Aminah"
        radius="md"
        size="lg"
        variant="bordered"
      />

      <Select
        {...register("dataSurat.agamaAnak")}
        label="Agama"
        placeholder="Pilih agama"
        radius="md"
        size="lg"
        variant="bordered"
      >
        <SelectItem key="Islam" textValue="Islam">
          Islam
        </SelectItem>
        <SelectItem key="Kristen" textValue="Kristen">
          Kristen
        </SelectItem>
        <SelectItem key="Katolik" textValue="Katolik">
          Katolik
        </SelectItem>
        <SelectItem key="Hindu" textValue="Hindu">
          Hindu
        </SelectItem>
        <SelectItem key="Buddha" textValue="Buddha">
          Buddha
        </SelectItem>
        <SelectItem key="Konghucu" textValue="Konghucu">
          Konghucu
        </SelectItem>
      </Select>

      <Select
        {...register("dataSurat.jenisKelaminAnak")}
        label="Jenis Kelamin Anak"
        placeholder="Pilih jenis kelamin"
        radius="md"
        size="lg"
        variant="bordered"
      >
        <SelectItem key="laki-laki" textValue="laki-laki">
          Laki-laki
        </SelectItem>
        <SelectItem key="perempuan" textValue="perempuan">
          Perempuan
        </SelectItem>
      </Select>

      <Input
        {...register("dataSurat.tempatLahirAnak")}
        label="Tempat Lahir"
        placeholder="Contoh: Kupang"
        radius="md"
        size="lg"
        variant="bordered"
      />

      <Input
        {...register("dataSurat.tanggalLahirAnak")}
        type="date"
        label="Tanggal Lahir"
        radius="md"
        size="lg"
        variant="bordered"
      />

      <Input
        {...register("dataSurat.namaAyah")}
        label="Nama Ayah"
        placeholder="Contoh: Bapak Joko"
        radius="md"
        size="lg"
        variant="bordered"
      />

      <Input
        {...register("dataSurat.namaIbu")}
        label="Nama Ibu"
        placeholder="Contoh: Ibu Sari"
        radius="md"
        size="lg"
        variant="bordered"
      />

      <Input
        {...register("dataSurat.namaSaksi1")}
        label="Nama Saksi 1"
        placeholder="Contoh: Pak Anto"
        radius="md"
        size="lg"
        variant="bordered"
      />

      <Input
        {...register("dataSurat.namaSaksi2")}
        label="Nama Saksi 2"
        placeholder="Contoh: Bu Rina"
        radius="md"
        size="lg"
        variant="bordered"
      />

      <h3 className="text-lg font-semibold text-gray-800">
        Data Pendukung Kelahiran
      </h3>

      <div className="space-y-1">
        <label htmlFor="suketRS" className="text-sm font-medium text-gray-700">
          Surat Keterangan Rumah Sakit{" "}
          <span className="text-gray-500">(gambar, max 1MB)</span>
        </label>
        <Input
          {...register("dataSurat.suketRS")}
          id="suketRS"
          type="file"
          accept="image/*"
          radius="md"
          size="lg"
          variant="bordered"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="ktpSaksi" className="text-sm font-medium text-gray-700">
          KTP Saksi <span className="text-gray-500">(gambar, max 1MB)</span>
        </label>
        <Input
          {...register("dataSurat.ktpSaksi")}
          id="ktpSaksi"
          type="file"
          accept="image/*"
          radius="md"
          size="lg"
          variant="bordered"
        />
      </div>
    </div>
  );
}
