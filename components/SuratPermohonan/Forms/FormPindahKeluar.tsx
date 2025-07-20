"use client";

import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Radio,
  RadioGroup,
  Textarea,
  Divider,
} from "@heroui/react";
import { useFormContext } from "react-hook-form";

export default function FormPindahKeluar() {
  const { register, watch, setValue } = useFormContext();

  return (
    <>
      <Card>
        <CardHeader>
          <h4 className="text-lg font-semibold">Data Pindahan</h4>
        </CardHeader>
        <CardBody className="space-y-4">
          <Textarea
            label="Alamat Tujuan"
            {...register("dataSurat.alamatTujuan")}
          />

          <div className="flex gap-4">
            <Input label="RT Tujuan" {...register("dataSurat.rtTujuan")} />
            <Input label="RW Tujuan" {...register("dataSurat.rwTujuan")} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Desa" {...register("dataSurat.desa")} />
            <Input label="Kecamatan" {...register("dataSurat.kecamatan")} />
            <Input
              label="Kabupaten/Kota"
              {...register("dataSurat.kabupaten")}
            />
            <Input label="Provinsi" {...register("dataSurat.provinsi")} />
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h4 className="text-lg font-semibold">Detail Kepindahan</h4>
        </CardHeader>
        <CardBody className="space-y-6">
          <RadioGroup
            label="Klasifikasi Pindah"
            value={watch("dataSurat.klasifikasiPindah")}
            onValueChange={(val) =>
              setValue("dataSurat.klasifikasiPindah", val)
            }
            isRequired
          >
            <Radio value="1_KK">1 KK</Radio>
            <Radio value="Kep_KK_Saja">Kepala Keluarga Saja</Radio>
            <Radio value="Kep_dan_Sebagian">Kepala dan Sebagian Anggota</Radio>
            <Radio value="Seluruh_Anggota">Seluruh Anggota</Radio>
          </RadioGroup>

          <Divider />

          <RadioGroup
            label="Jenis Kepindahan"
            value={watch("dataSurat.jenisKepindahan")}
            onValueChange={(val) => setValue("dataSurat.jenisKepindahan", val)}
            isRequired
          >
            <Radio value="NumpangKK">Numpang KK</Radio>
            <Radio value="TidakAdaKK">Tidak Ada KK</Radio>
            <Radio value="MembuatKKBaru">Membuat KK Baru</Radio>
          </RadioGroup>

          <Divider />

          <RadioGroup
            label="Status KK yang Ditinggal"
            value={watch("dataSurat.statusKKTinggal")}
            onValueChange={(val) => setValue("dataSurat.statusKKTinggal", val)}
            isRequired
          >
            <Radio value="NumpangKK">Numpang KK</Radio>
            <Radio value="MembuatKKBaru">Membuat KK Baru</Radio>
          </RadioGroup>

          <Divider />

          <RadioGroup
            label="Status KK di Tempat Tujuan"
            value={watch("dataSurat.statusKKTujuan")}
            onValueChange={(val) => setValue("dataSurat.statusKKTujuan", val)}
            isRequired
          >
            <Radio value="NumpangKK">Numpang KK</Radio>
            <Radio value="MembuatKKBaru">Membuat KK Baru</Radio>
          </RadioGroup>
        </CardBody>
      </Card>
    </>
  );
}
