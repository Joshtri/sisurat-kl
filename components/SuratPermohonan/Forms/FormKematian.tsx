"use client";

import { useFormContext } from "react-hook-form";
import { Input, Select, SelectItem } from "@heroui/react";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { getAnggotaByKkId } from "@/services/wargaService";

interface Props {
  kartuKeluargaId: string;
}

export default function FormKematian({ kartuKeluargaId }: Props) {
  const { register, setValue } = useFormContext();
  const [selectedId, setSelectedId] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["anggota-kk", kartuKeluargaId],
    queryFn: () => getAnggotaByKkId(kartuKeluargaId),
    enabled: !!kartuKeluargaId,
  });

  const anggotaKeluarga = data?.data || [];
  const selected = anggotaKeluarga.find((a: any) => a.id === selectedId);

  useEffect(() => {
    register("dataSurat.namaAlmarhum");
    register("dataSurat.nikAlmarhum");
    register("dataSurat.jenisKelamin");
    register("dataSurat.tanggalLahir");
    register("dataSurat.tempatLahir");
    register("dataSurat.alamat");
    register("dataSurat.rt");
    register("dataSurat.rw");
    register("dataSurat.pekerjaan");

    if (selected) {
      setValue("dataSurat.namaAlmarhum", selected.namaLengkap);
      setValue("dataSurat.nikAlmarhum", selected.nik);
      setValue("dataSurat.jenisKelamin", selected.jenisKelamin);
      setValue("dataSurat.tanggalLahir", selected.tanggalLahir);
      setValue("dataSurat.tempatLahir", selected.tempatLahir);
      setValue("dataSurat.alamat", selected.kartuKeluarga?.alamat || "");
      setValue("dataSurat.rt", selected.kartuKeluarga?.rt || "");
      setValue("dataSurat.rw", selected.kartuKeluarga?.rw || "");
      setValue("dataSurat.pekerjaan", selected.pekerjaan || "");
    }
  }, [selected, setValue, register]);

  return (
    <div className="space-y-6">
      <Select
        label="Pilih Anggota yang Meninggal"
        placeholder="Pilih dari anggota keluarga"
        onChange={(e) => setSelectedId(e.target.value)}
        isLoading={isLoading}
        variant="bordered"
        radius="md"
        size="lg"
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
        {...register("dataSurat.namaAyah")}
        label="Nama Ayah"
        placeholder="Contoh: Yohanes Kaleledo"
        variant="bordered"
        radius="md"
        size="lg"
      />
      <Input
        {...register("dataSurat.namaIbu")}
        label="Nama Ibu"
        placeholder="Contoh: Maria Kaleledo"
        variant="bordered"
        radius="md"
        size="lg"
      />
      <Input
        {...register("dataSurat.pekerjaan")}
        label="Pekerjaan"
        placeholder="Contoh: PNS / Wiraswasta"
        variant="bordered"
        radius="md"
        size="lg"
      />
      <Input
        {...register("dataSurat.tanggalMeninggal")}
        type="date"
        label="Tanggal Meninggal"
        variant="bordered"
        radius="md"
        size="lg"
      />
      <Input
        {...register("dataSurat.tempatMeninggal")}
        label="Tempat Meninggal"
        placeholder="Contoh: Kupang / Rumah Sakit"
        variant="bordered"
        radius="md"
        size="lg"
      />
      <Input
        {...register("dataSurat.penyebabKematian")}
        label="Penyebab Kematian (Opsional)"
        placeholder="Contoh: Sakit"
        variant="bordered"
        radius="md"
        size="lg"
      />
    </div>
  );
}
