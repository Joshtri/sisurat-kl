"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { z } from "zod";

import { PageHeader } from "@/components/common/PageHeader";
import { CardContainer } from "@/components/common/CardContainer";
import { FormWrapper } from "@/components/FormWrapper";
import { TextInput } from "@/components/ui/inputs/TextInput";
import { CreateOrEditButtons } from "@/components/ui/CreateOrEditButtons";
import { SkeletonCard } from "@/components/ui/skeleton/SkeletonCard";
import { showToast } from "@/utils/toastHelper";
import {
  getKartuKeluargaById,
  updateKartuKeluarga,
} from "@/services/kartuKeluargaService";

const kkSchema = z.object({
  nomorKK: z.string().min(10, "Nomor KK harus minimal 10 karakter"),
  alamat: z.string().min(5, "Alamat wajib diisi"),
  rt: z.string().optional(),
  rw: z.string().optional(),
});

type KKFormSchema = z.infer<typeof kkSchema>;

export default function KartuKeluargaEditPage() {
  const { id } = useParams();
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ["kartu-keluarga", id],
    queryFn: () => getKartuKeluargaById(id as string),
    enabled: !!id,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (values: KKFormSchema) =>
      updateKartuKeluarga(id as string, values),
    onSuccess: () => {
      showToast({
        title: "Berhasil",
        description: "Data Kartu Keluarga berhasil diperbarui.",
        color: "success",
      });
      router.push("/superadmin/kartu-keluarga");
    },
    onError: () => {
      showToast({
        title: "Gagal",
        description: "Terjadi kesalahan saat memperbarui data.",
        color: "error",
      });
    },
  });

  const onSubmit = (values: KKFormSchema) => mutate(values);

  return (
    <>
      <PageHeader
        backHref="/superadmin/kartu-keluarga"
        breadcrumbs={[
          { label: "Superadmin", href: "/superadmin/dashboard" },
          { label: "Kartu Keluarga", href: "/superadmin/kartu-keluarga" },
          { label: "Edit" },
        ]}
        title="Edit Kartu Keluarga"
        description="Halaman ini digunakan untuk mengedit data Kartu Keluarga."
      />

      <CardContainer isLoading={isLoading} skeleton={<SkeletonCard rows={5} />}>
        {data && (
          <FormWrapper<KKFormSchema>
            defaultValues={{
              nomorKK: data.nomorKK,
              alamat: data.alamat,
              rt: data.rt ?? "",
              rw: data.rw ?? "",
            }}
            schema={kkSchema}
            onSubmit={onSubmit}
          >
            <TextInput name="nomorKK" label="Nomor KK" />
            <TextInput name="alamat" label="Alamat" />
            <TextInput name="rt" label="RT" />
            <TextInput name="rw" label="RW" />

            <div className="flex justify-end pt-6 space-x-3">
              <CreateOrEditButtons
                isLoading={isPending}
                onCancel={() => router.push("/superadmin/kartu-keluarga")}
              />
            </div>
          </FormWrapper>
        )}
      </CardContainer>
    </>
  );
}
