"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { FormWrapper } from "@/components/FormWrapper";
import { TextInput } from "@/components/ui/inputs/TextInput";
import { DateInput } from "@/components/ui/inputs/DateInput";
import { SelectInput } from "@/components/ui/inputs/SelectInput";
import { CreateOrEditButtons } from "@/components/ui/CreateOrEditButtons";
import { wargaSchema, WargaSchema } from "@/validations/wargaSchema";
import { updateWarga } from "@/services/wargaService";
import {
  StatusHidupEnum,
  JenisKelaminEnum,
  Agama,
  Pekerjaan,
} from "@/constants/enums";
import { enumToSelectOptions } from "@/utils/enumHelpers";
import { showToast } from "@/utils/toastHelper";
import { Warga } from "@/interfaces/warga";

interface FormEditWargaProps {
  initialData: WargaSchema;
}

export default function FormEditWarga({ initialData }: FormEditWargaProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate: editWarga, isPending: isEditing } = useMutation<
    Warga,
    unknown,
    WargaSchema
  >({
    mutationFn: (data: WargaSchema) => {
      if (!initialData.id) {
        throw new Error("ID warga tidak ditemukan.");
      }

      return updateWarga(initialData.id, {
        ...data,
        tanggalLahir: data.tanggalLahir ? new Date(data.tanggalLahir) : null,
      });
    },
    onSuccess: () => {
      showToast({
        title: "Berhasil",
        description: "Data warga berhasil diperbarui",
        color: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["warga"] });
      router.push("/superadmin/warga");
    },
    onError: () =>
      showToast({
        title: "Gagal",
        description: "Terjadi kesalahan saat menyimpan data",
        color: "error",
      }),
  });

  // Handler to bridge react-hook-form's SubmitHandler to react-query's mutate
  const handleSubmit: (data: WargaSchema) => void = (data) => {
    editWarga(data);
  };

  return (
    <FormWrapper<WargaSchema>
      schema={wargaSchema}
      onSubmit={handleSubmit}
      defaultValues={initialData}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput label="Nama Lengkap" name="namaLengkap" />
        <TextInput label="NIK" name="nik" maxLength={16} />
        <TextInput label="Tempat Lahir" name="tempatLahir" />
        <DateInput
          label="Tanggal Lahir"
          name="tanggalLahir"
          placeholder="Pilih tanggal lahir"
        />
        <SelectInput
          label="Jenis Kelamin"
          name="jenisKelamin"
          options={enumToSelectOptions(JenisKelaminEnum, {
            LAKI_LAKI: "Laki-laki",
            PEREMPUAN: "Perempuan",
          })}
        />
        <SelectInput
          label="Pekerjaan"
          name="pekerjaan"
          options={enumToSelectOptions(Pekerjaan, {
            PELAJAR: "Pelajar",
            MAHASISWA: "Mahasiswa",
            PETANI: "Petani",
            NELAYAN: "Nelayan",
            PEGAWAI_NEGERI: "Pegawai Negeri",
            KARYAWAN_SWASTA: "Karyawan Swasta",
            WIRASWASTA: "Wiraswasta",
            GURU: "Guru",
            DOKTER: "Dokter",
            IBU_RUMAH_TANGGA: "Ibu Rumah Tangga",
            TIDAK_BEKERJA: "Tidak Bekerja",
            LAINNYA: "Lainnya",
          })}
        />
        <SelectInput
          label="Agama"
          name="agama"
          options={enumToSelectOptions(Agama, {
            KRISTEN: "Kristen",
            ISLAM: "Islam",
            KATOLIK: "Katolik",
            HINDU: "Hindu",
            BUDDHA: "Buddha",
            KHONGHUCU: "Khonghucu",
            LAINNYA: "Lainnya",
          })}
        />
        <TextInput label="No Telepon" name="noTelepon" />
        <TextInput label="RT" name="rt" />
        <TextInput label="RW" name="rw" />
        <TextInput label="Alamat" name="alamat" />
        <SelectInput
          label="Status Hidup"
          name="statusHidup"
          options={enumToSelectOptions(StatusHidupEnum, {
            HIDUP: "Hidup",
            MENINGGAL: "Meninggal",
          })}
        />
      </div>

      <div className="flex justify-end pt-6">
        <CreateOrEditButtons
          isLoading={isEditing}
          onCancel={() => router.push("/superadmin/warga")}
          showCancel
          cancelLabel="Batal"
          submitType="submit"
        />
      </div>
    </FormWrapper>
  );
}
