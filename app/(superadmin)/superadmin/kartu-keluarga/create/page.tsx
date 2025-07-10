"use client";

import React from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

import { PageHeader } from "@/components/common/PageHeader";
import { CardContainer } from "@/components/common/CardContainer";
import { FormWrapper } from "@/components/FormWrapper";
import { TextInput } from "@/components/ui/inputs/TextInput";
import { SelectInput } from "@/components/ui/inputs/SelectInput";
import {
  kartuKeluargaSchema,
  KartuKeluargaSchema,
} from "@/validations/kartuKeluargaSchema";

interface KepalaKeluargaOption {
  label: string;
  value: string;
}

export default function CreateKartuKeluargaPage() {
  const router = useRouter();

  const { data: options = [], isLoading } = useQuery<KepalaKeluargaOption[]>({
    queryKey: ["warga-options"],
    queryFn: async () => {
      const res = await axios.get("/api/warga");
      const wargaList = res.data as any[];

      return wargaList.map((warga) => ({
        label: warga.namaLengkap,
        value: warga.id,
      }));
    },
  });

  const onSubmit = async (data: KartuKeluargaSchema) => {
    console.log("SUBMIT KK:", data);
    await new Promise((r) => setTimeout(r, 1000));
    router.push("/superadmin/kartu-keluarga");
  };

  return (
    <>
      <PageHeader
        actions={[]}
        backHref="/superadmin/kartu-keluarga"
        breadcrumbs={[
          { label: "Dashboard", href: "/superadmin" },
          { label: "Kartu Keluarga", href: "/superadmin/kartu-keluarga" },
          { label: "Buat Baru" },
        ]}
      />

      <CardContainer>
        <FormWrapper<KartuKeluargaSchema>
          defaultValues={{
            nomorKK: "",
            kepalaKeluargaId: "",
            alamat: "",
            rt: "",
            rw: "",
          }}
          schema={kartuKeluargaSchema}
          onSubmit={onSubmit}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput label="Nomor KK" name="nomorKK" />
            <SelectInput
              isLoading={isLoading}
              label="Kepala Keluarga"
              name="kepalaKeluargaId"
              options={[
                { label: "-- Pilih Kepala Keluarga --", value: "" },
                ...options,
              ]}
            />
            <TextInput label="Alamat" name="alamat" />
            <TextInput label="RT" name="rt" />
            <TextInput label="RW" name="rw" />
          </div>

          <div className="flex justify-end space-x-3 pt-6">
            <button
              className="px-4 py-2 bg-gray-200 rounded-md"
              type="button"
              onClick={() => router.push("/superadmin/kartu-keluarga")}
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
    </>
  );
}
