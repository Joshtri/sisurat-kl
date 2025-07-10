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

export default function CreateJenisSuratPage() {
  const router = useRouter();

  const onSubmit = async (data: JenisSuratSchema) => {
    console.log("SUBMIT JENIS SURAT:", data);
    await new Promise((r) => setTimeout(r, 1000));
    router.push("/superadmin/jenis-surat");
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
          defaultValues={{ kode: "", nama: "", deskripsi: "", aktif: true }}
          schema={jenisSuratSchema}
          onSubmit={onSubmit}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput label="Kode Surat" name="kode" />
            <TextInput label="Nama Surat" name="nama" />
            <TextInput label="Deskripsi" name="deskripsi" isRequired={false} />
            <SelectInput
              label="Status Aktif"
              name="aktif"
              options={[
                { label: "Aktif", value: "true" },
                { label: "Nonaktif", value: "false" },
              ]}
              
              isRequired
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
