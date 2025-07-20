"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@heroui/react";

export default function FormUsaha() {
  const { register } = useFormContext();

  return (
    <div className="space-y-6">
      {/* Nama Usaha */}
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
        placeholder="Contoh: 2020-01-01"
        radius="md"
        size="lg"
        variant="bordered"
        type="date"
      />
    </div>
  );
}
