"use client";

import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Input, Select, SelectItem } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";

import { getAnggotaByKkId } from "@/services/wargaService";

interface Props {
  kartuKeluargaId: string;
}

export default function FormSktm({ kartuKeluargaId }: Props) {
  const { register, setValue } = useFormContext();
  const [selectedId, setSelectedId] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["anggota-kk", kartuKeluargaId],
    queryFn: () => getAnggotaByKkId(kartuKeluargaId),
    enabled: !!kartuKeluargaId,
  });

  const anggotaKeluarga = (data?.data || []).filter(
    (a: any) =>
      a.peranDalamKK === "ANAK" || a.peranDalamKK === "FAMILI_LAINNYA",
  );

  const selected = anggotaKeluarga.find((a: any) => a.id === selectedId);

  useEffect(() => {
    register("dataSurat.idAnak");
    register("dataSurat.namaYangDinyatakanTidakMampu");
    register("dataSurat.hubunganDenganPemohon");
    register("dataSurat.keperluan");
    register("dataSurat.keteranganTambahan");

    if (selected) {
      setValue("dataSurat.idAnak", selected.id);
      setValue("dataSurat.namaYangDinyatakanTidakMampu", selected.namaLengkap);
    }
  }, [selected, register, setValue]);

  return (
    <div className="space-y-6">
      <Select
        label="Pilih Anak yang Mengajukan SKTM"
        placeholder="Pilih anggota keluarga (anak)"
        onChange={(e) => setSelectedId(e.target.value)}
        isLoading={isLoading}
        variant="bordered"
        radius="md"
        name="dataSurat.idAnak"
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
        {...register("dataSurat.hubunganDenganPemohon")}
        label="Hubungan dengan Pemohon"
        placeholder="Contoh: Anak Kandung"
        radius="md"
        size="lg"
        variant="bordered"
      />

      <Input
        {...register("dataSurat.keperluan")}
        label="Keperluan Pengajuan SKTM"
        placeholder="Contoh: Beasiswa KIP Kuliah di Undana"
        radius="md"
        size="lg"
        variant="bordered"
      />

      <Input
        {...register("dataSurat.keteranganTambahan")}
        label="Keterangan Tambahan (Opsional)"
        placeholder="Contoh: Orang tua tunggal"
        radius="md"
        size="lg"
        variant="bordered"
      />
    </div>
  );
}
