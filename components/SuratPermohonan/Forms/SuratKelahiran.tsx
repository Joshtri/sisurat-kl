"use client";

import { useFormContext } from "react-hook-form";
import { Input, Select, SelectItem } from "@heroui/react";

export default function FormKelahiran() {
  const { register } = useFormContext();

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
    </div>
  );
}
