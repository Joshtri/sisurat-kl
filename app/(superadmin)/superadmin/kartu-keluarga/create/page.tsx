"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { PageHeader } from "@/components/common/PageHeader";
import { CardContainer } from "@/components/common/CardContainer";
import { FormWrapper } from "@/components/FormWrapper";
import { TextInput } from "@/components/ui/inputs/TextInput";
import { SelectInput } from "@/components/ui/inputs/SelectInput";
import { CreateOrEditButtons } from "@/components/ui/CreateOrEditButtons";
import {
  kartuKeluargaSchema,
  KartuKeluargaSchema,
} from "@/validations/kartuKeluargaSchema";
import { getAllWarga } from "@/services/wargaService";
import { createKartuKeluarga } from "@/services/kartuKeluargaService";
import { showToast } from "@/utils/toastHelper"; // kalau pakai

export default function CreateKartuKeluargaPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: wargaList = [], isLoading } = useQuery({
    queryKey: ["warga-options"],
    queryFn: getAllWarga,
  });

  const { mutate, isPending: isSubmitting } = useMutation({
    mutationFn: createKartuKeluarga,
    onSuccess: () => {
      showToast({
        title: "Berhasil",
        description: "Kartu Keluarga berhasil dibuat",
        color: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["kartu-keluarga"] });
      router.push("/superadmin/kartu-keluarga");
    },
    onError: (error: any) => {
      showToast({
        title: "Gagal",
        description: error?.response?.data?.message || "Gagal menyimpan data",
        color: "error",
      });
    },
  });

  const onSubmit = (data: KartuKeluargaSchema) => {
    mutate(data);
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
            <TextInput label="Nomor KK" name="nomorKK" maxLength={16} />
            <SelectInput
              isLoading={isLoading}
              label="Kepala Keluarga"
              name="kepalaKeluargaId"
              options={[
                { label: "-- Pilih Kepala Keluarga --", value: "" },
                ...wargaList.map((w) => ({
                  label: w.namaLengkap,
                  value: w.id,
                })),
              ]}
            />
            <TextInput label="Alamat" name="alamat" />
            <TextInput label="RT" name="rt" />
            <TextInput label="RW" name="rw" />
          </div>

          <div className="flex justify-end space-x-3 pt-6">
            <CreateOrEditButtons
              submitType="submit"
              cancelLabel="Batal"
              showCancel
              isLoading={isSubmitting}
              onCancel={() => router.push("/superadmin/kartu-keluarga")}
            />
          </div>
        </FormWrapper>
      </CardContainer>
    </>
  );
}
