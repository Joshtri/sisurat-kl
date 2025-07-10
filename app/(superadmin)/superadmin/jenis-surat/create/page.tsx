"use client";

import { useRouter } from "next/navigation";

import { CardContainer } from "@/components/common/CardContainer";
import { PageHeader } from "@/components/common/PageHeader";
import { FormWrapper } from "@/components/FormWrapper";
import { SelectInput } from "@/components/ui/inputs/SelectInput";
import { TextInput } from "@/components/ui/inputs/TextInput";
import {
  jenisSuratSchema,
  JenisSuratSchema,
} from "@/validations/jenisSuratSchema";
import { createJenisSurat } from "@/services/jenisSuratService";
import { showToast } from "@/utils/toastHelper";

export default function CreateJenisSuratPage() {
  const router = useRouter();

  const onSubmit = async (data: JenisSuratSchema) => {
    try {
      console.log("SUBMIT JENIS SURAT:", data);

      await createJenisSurat({
        ...data,
        deskripsi: data.deskripsi ?? null,
      });

      showToast({
        title: "Berhasil",
        description: "Jenis surat berhasil dibuat.",
        color: "success",
      });

      router.push("/superadmin/jenis-surat");
    } catch (error) {
      console.error("Gagal membuat jenis surat:", error);

      showToast({
        title: "Gagal",
        description: "Terjadi kesalahan saat menyimpan data.",
        color: "error",
      });
    }
  };

  return (
    <>
      <PageHeader
        backHref="/superadmin/jenis-surat"
        breadcrumbs={[
          { label: "Dashboard", href: "/superadmin" },
          { label: "Jenis Surat", href: "/superadmin/jenis-surat" },
          { label: "Buat Baru" },
        ]}
      />

      <CardContainer>
        <FormWrapper<JenisSuratSchema>
          schema={jenisSuratSchema}
          onSubmit={onSubmit}
          defaultValues={{
            kode: "",
            nama: "",
            deskripsi: "",
            aktif: true,
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput label="Kode Surat" name="kode" />
            <TextInput label="Nama Surat" name="nama" />
            <TextInput label="Deskripsi" name="deskripsi" isRequired={false} />
            <SelectInput
              label="Status Aktif"
              name="aktif"
              isRequired
              options={[
                { label: "Aktif", value: true },
                { label: "Nonaktif", value: false },
              ]}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-6">
            <button
              type="button"
              className="px-4 py-2 bg-gray-200 rounded-md"
              onClick={() => router.push("/superadmin/jenis-surat")}
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              Simpan
            </button>
          </div>
        </FormWrapper>
      </CardContainer>
    </>
  );
}
