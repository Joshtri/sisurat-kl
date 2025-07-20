"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { z } from "zod";

import { PageHeader } from "@/components/common/PageHeader";
import { FormWrapper } from "@/components/FormWrapper";
import { TextInput } from "@/components/ui/inputs/TextInput";
import { SwitchInput } from "@/components/ui/inputs/SwitchInput";
import { showToast } from "@/utils/toastHelper";
import {
  getJenisSuratById,
  updateJenisSurat,
} from "@/services/jenisSuratService";
import { CreateOrEditButtons } from "@/components/ui/CreateOrEditButtons";
import { CardContainer } from "@/components/common/CardContainer";
import { SkeletonCard } from "@/components/ui/skeleton/SkeletonCard";

// ✅ Schema Zod
const jenisSuratSchema = z.object({
  nama: z.string().min(3, "Nama surat minimal 3 karakter"),
  kode: z.string().min(2, "Kode surat minimal 2 karakter"),
  deskripsi: z.string().optional(),
  aktif: z.boolean(),
});

type JenisSuratSchema = z.infer<typeof jenisSuratSchema>;

export default function EditJenisSuratPage() {
  const { id } = useParams();
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ["jenis-surat", id],
    queryFn: () => getJenisSuratById(id as string),
    enabled: !!id,
  });

  const mutation = useMutation({
    mutationFn: (formData: JenisSuratSchema) =>
      updateJenisSurat(id as string, formData),
    onSuccess: () => {
      showToast({
        title: "Berhasil",
        description: "Jenis surat berhasil diperbarui.",
        color: "success",
      });
      router.push("/superadmin/jenis-surat");
    },
    onError: () => {
      showToast({
        title: "Gagal",
        description: "Gagal memperbarui data jenis surat.",
        color: "error",
      });
    },
  });

  return (
    <>
      <PageHeader
        title="Edit Jenis Surat"
        backHref="/superadmin/jenis-surat"
        breadcrumbs={[
          { label: "Dashboard", href: "/superadmin/dashboard" },
          { label: "Jenis Surat", href: "/superadmin/jenis-surat" },
          { label: "Edit" },
        ]}
      />

      <CardContainer isLoading={isLoading} skeleton={<SkeletonCard rows={5} />}>
        {data && (
          <FormWrapper<JenisSuratSchema>
            schema={jenisSuratSchema}
            onSubmit={(values) => mutation.mutate(values)}
            defaultValues={{
              nama: data.nama,
              kode: data.kode,
              deskripsi: data.deskripsi ?? "",
              aktif: data.aktif,
            }}
            isLoading={mutation.isPending}
          >
            <TextInput name="nama" label="Nama Jenis Surat" />
            <TextInput name="kode" label="Kode Surat" />
            <TextInput name="deskripsi" label="Deskripsi" />
            <SwitchInput name="aktif" label="Status Aktif" />

            <CreateOrEditButtons
              isLoading={mutation.isPending}
              submitType="submit"
              onCancel={() => router.push("/superadmin/jenis-surat")}
            />
          </FormWrapper>
        )}
      </CardContainer>
    </>
  );
}
