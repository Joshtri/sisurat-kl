"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { CreateOrEditButtons } from "../ui/CreateOrEditButtons";
import { DateInput } from "../ui/inputs/DateInput";

import { CardContainer } from "@/components/common/CardContainer";
import { FormWrapper } from "@/components/FormWrapper";
import { SelectInput } from "@/components/ui/inputs/SelectInput";
import { TextInput } from "@/components/ui/inputs/TextInput";
import {
  Agama,
  JenisKelaminEnum,
  Pekerjaan,
  StatusHidupEnum,
} from "@/constants/enums";
import { getKartuKeluarga } from "@/services/kartuKeluargaService";
import { getUsers } from "@/services/userService";
import { createWarga } from "@/services/wargaService";
import { enumToSelectOptions } from "@/utils/enumHelpers";
import { showToast } from "@/utils/toastHelper"; // kalau ada
import { wargaSchema, WargaSchema } from "@/validations/wargaSchema";
interface FormCreateWargaProps {
  defaultUserId?: string;
  onSuccess?: () => void;
}

export default function FormCreateWarga({
  defaultUserId,
  onSuccess,
}: FormCreateWargaProps) {
  const router = useRouter();
  // const searchParams = useSearchParams();

  // const userIdFromQuery = searchParams.get("userId") || "";

  // const effectiveUserId = defaultUserId || userIdFromQuery;

  const [userIdFromQuery, setUserIdFromQuery] = useState<string>("");

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const uid = sp.get("userId");

    if (uid) setUserIdFromQuery(uid);
  }, []);
  const queryClient = useQueryClient();

  const { data: users = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const { data: kkList = [], isLoading: loadingKK } = useQuery({
    queryKey: ["kartuKeluarga"],
    queryFn: getKartuKeluarga, // <- kamu perlu buat ini
  });

  const { mutate: submitWarga, isPending: isSubmitting } = useMutation({
    mutationFn: createWarga,
    onSuccess: () => {
      showToast({
        title: "Berhasil",
        description: "Data warga berhasil disimpan",
        color: "success",
      });

      queryClient.invalidateQueries({ queryKey: ["warga"] });

      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/superadmin/warga");
      }
    },
    onError: (error: any) => {
      showToast({
        title: "Gagal",
        description: error?.response?.data?.message || "Gagal menyimpan data",
        color: "error",
      });
    },
  });

  return (
    <CardContainer>
      <FormWrapper<WargaSchema>
        defaultValues={{
          userId: userIdFromQuery,
          namaLengkap: "",
          nik: "",
          //   tempatTanggalLahir: "",
          tempatLahir: "",
          tanggalLahir: undefined,
          jenisKelamin: "LAKI_LAKI",
          pekerjaan: "LAINNYA",
          agama: "LAINNYA",
          noTelepon: "",
          rt: "",
          rw: "",
          alamat: "",
          //   foto: "",
          statusHidup: "HIDUP",
          kartuKeluargaId: undefined,
          peranDalamKK: undefined,
        }}
        schema={wargaSchema}
        onSubmit={(data) => {
          const payload = {
            ...data,
            tanggalLahir: data.tanggalLahir
              ? new Date(data.tanggalLahir)
              : null,
          };

          submitWarga(payload);
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectInput
            label="Akun Pengguna"
            name="userId"
            placeholder="Pilih akun pengguna"
            isLoading={loadingUsers}
            options={users
              .filter((user: any) => !user.isWarga) // ✅ hanya yang belum punya profil warga
              .map((user: any) => ({
                label: `${user.username} | (${user.email || "-"})`,
                value: user.id,
              }))}
          />

          <SelectInput
            label="Kartu Keluarga"
            name="kartuKeluargaId"
            placeholder="Pilih kartu keluarga"
            isLoading={loadingKK}
            options={kkList.map((kk) => ({
              label:
                kk.nomorKK + " - " + (kk.kepalaKeluarga?.namaLengkap ?? "-"),
              value: kk.id,
            }))}
          />

          <SelectInput
            label="Peran dalam Keluarga"
            name="peranDalamKK"
            options={[
              { label: "Kepala Keluarga", value: "KEPALA_KELUARGA" },
              { label: "Istri", value: "ISTRI" },
              { label: "Anak", value: "ANAK" },
              { label: "Orang Tua", value: "ORANG_TUA" },
              { label: "Famili Lainnya", value: "FAMILI_LAINNYA" },
            ]}
          />
          <TextInput label="Nama Lengkap" name="namaLengkap" />
          <TextInput label="NIK" name="nik" maxLength={16} />
          <TextInput label="Tempat Lahir" name="tempatLahir" />
          <SelectInput
            label="Jenis Kelamin"
            name="jenisKelamin"
            options={enumToSelectOptions(JenisKelaminEnum, {
              LAKI_LAKI: "Laki-laki",
              PEREMPUAN: "Perempuan",
            })}
          />
          <DateInput
            label="Tanggal Lahir"
            name="tanggalLahir"
            placeholder="Pilih tanggal lahir"
          />
          {/* <TextInput label="Pekerjaan" name="pekerjaan" /> */}
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
          {/* <TextInput label="Agama" name="agama" /> */}
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
          {/* <TextInput label="Foto (URL)" name="foto" /> */}
          <SelectInput
            label="Status Hidup"
            name="statusHidup"
            options={enumToSelectOptions(StatusHidupEnum, {
              HIDUP: "Hidup",
              MENINGGAL: "Meninggal",
            })}
          />
        </div>

        <div className="flex justify-end space-x-3 pt-6">
          <CreateOrEditButtons
            submitType="submit"
            cancelLabel="Batal"
            showCancel
            isLoading={isSubmitting}
            onCancel={() => router.push("/superadmin/warga")}
          />
        </div>
      </FormWrapper>
    </CardContainer>
  );
}
