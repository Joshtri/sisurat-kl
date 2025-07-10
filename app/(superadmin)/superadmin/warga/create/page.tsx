"use client";

import React from "react";
import { useRouter } from "next/navigation";

import { PageHeader } from "@/components/common/PageHeader";
import { FormWrapper } from "@/components/FormWrapper";
import { TextInput } from "@/components/ui/inputs/TextInput";
import { SelectInput } from "@/components/ui/inputs/SelectInput";
import { wargaSchema, WargaSchema } from "@/validations/wargaSchema";
import { CardContainer } from "@/components/common/CardContainer";

export default function CreateWarga() {
  const router = useRouter();

  const onSubmit = async (data: WargaSchema) => {
    console.log("SUBMIT:", data);
    await new Promise((r) => setTimeout(r, 1000));
    router.push("/superadmin/users");
  };

  return (
    <>
      <PageHeader
        actions={[]}
        backHref="/superadmin/warga"
        breadcrumbs={[
          { label: "Dashboard", href: "/superadmin" },
          { label: "Pengguna", href: "/superadmin/warga" },
          { label: "Buat Baru" },
        ]}
      />

      {/* <div className="max-w-5xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-md p-8"> */}
      <CardContainer>
        <FormWrapper<WargaSchema>
          defaultValues={{
            userId: "",
            namaLengkap: "",
            nik: "",
            tempatTanggalLahir: "",
            jenisKelamin: "LAKI_LAKI",
            pekerjaan: "",
            agama: "",
            noTelepon: "",
            rt: "",
            rw: "",
            alamat: "",
            foto: "",
            statusHidup: "HIDUP",
            kartuKeluargaId: undefined,
            peranDalamKK: undefined,
          }}
          schema={wargaSchema}
          onSubmit={onSubmit}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput label="Nama Lengkap" name="namaLengkap" />
            <TextInput label="NIK" name="nik" />
            <TextInput label="Tempat Tanggal Lahir" name="tempatTanggalLahir" />
            <SelectInput
              label="Jenis Kelamin"
              name="jenisKelamin"
              options={[
                { label: "Laki-laki", value: "LAKI_LAKI" },
                { label: "Perempuan", value: "PEREMPUAN" },
              ]}
            />
            <TextInput label="Pekerjaan" name="pekerjaan" />
            <TextInput label="Agama" name="agama" />
            <TextInput label="No Telepon" name="noTelepon" />
            <TextInput label="RT" name="rt" />
            <TextInput label="RW" name="rw" />
            <TextInput label="Alamat" name="alamat" />
            <TextInput label="Foto (URL)" name="foto" />
            <SelectInput
              label="Status Hidup"
              name="statusHidup"
              options={[
                { label: "Hidup", value: "HIDUP" },
                { label: "Meninggal", value: "MENINGGAL" },
              ]}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-6">
            <button
              className="px-4 py-2 bg-gray-200 rounded-md"
              type="button"
              onClick={() => router.push("/superadmin/users")}
            >
              Batal
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
              type="submit"
            >
              Simpan
            </button>
          </div>
        </FormWrapper>
      </CardContainer>
      {/* </div>
      </div> */}
    </>
  );
}
