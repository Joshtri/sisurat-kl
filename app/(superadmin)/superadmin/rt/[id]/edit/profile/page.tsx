"use client";

import { useRouter, useParams } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import * as z from "zod";

import { PageHeader } from "@/components/common/PageHeader";
import { CardContainer } from "@/components/common/CardContainer";
import { FormWrapper } from "@/components/FormWrapper";
import { TextInput } from "@/components/ui/inputs/TextInput";
import { CreateOrEditButtons } from "@/components/ui/CreateOrEditButtons";
import { SkeletonCard } from "@/components/ui/skeleton/SkeletonCard";
import { showToast } from "@/utils/toastHelper";
import { updateRTProfile } from "@/services/rtService";

// ✅ schema untuk form RTProfile
const rtProfileSchema = z.object({
  nik: z.string().min(16, "NIK harus 16 digit"),
  rt: z.string().min(1, "RT wajib diisi"),
  rw: z.string().min(1, "RW wajib diisi"),
  wilayah: z.string().optional(),
});
type RTProfileSchema = z.infer<typeof rtProfileSchema>;

// ✅ get detail gabungan dari /api/rt/[id]
async function getRTDetail(id: string) {
  const res = await fetch(`/api/rt/${id}`);
  if (!res.ok) throw new Error("Gagal memuat detail RT");
  return res.json();
}

export default function EditRTProfilePage() {
  const { id } = useParams();
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ["rt-detail", id],
    queryFn: () => getRTDetail(id as string),
    enabled: !!id,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (formData: RTProfileSchema) =>
      updateRTProfile(data?.user?.id, formData), // gunakan userId dari detail
    onSuccess: () => {
      showToast({
        title: "Berhasil",
        description: "Profil RT berhasil diperbarui.",
        color: "success",
      });
      router.push("/superadmin/rt");
    },
    onError: () => {
      showToast({
        title: "Gagal",
        description: "Terjadi kesalahan saat memperbarui data.",
        color: "error",
      });
    },
  });

  const onSubmit = (formData: RTProfileSchema) => {
    mutate(formData);
  };

  return (
    <>
      <PageHeader
        backHref="/superadmin/rt"
        breadcrumbs={[
          { label: "Dashboard", href: "/superadmin" },
          { label: "Manajemen RT", href: "/superadmin/rt" },
          { label: "Edit Profil RT" },
        ]}
        title="Edit Profil RT"
      />

      <CardContainer isLoading={isLoading} skeleton={<SkeletonCard rows={5} />}>
        {data?.rtProfile && (
          <FormWrapper<RTProfileSchema>
            defaultValues={{
              nik: data.rtProfile.nik,
              rt: data.rtProfile.rt,
              rw: data.rtProfile.rw ?? "",
              wilayah: data.rtProfile.wilayah ?? "",
            }}
            schema={rtProfileSchema}
            onSubmit={onSubmit}
          >
            <TextInput name="nik" label="NIK" maxLength={16} isNumber />
            <TextInput name="rt" label="RT" maxLength={3} isNumber />
            <TextInput name="rw" label="RW" maxLength={3} isNumber />
            <TextInput name="wilayah" label="Wilayah (Opsional)" />

            <div className="flex justify-end pt-6 space-x-3">
              <CreateOrEditButtons
                isLoading={isPending}
                onCancel={() => router.push("/superadmin/rt")}
              />
            </div>
          </FormWrapper>
        )}
      </CardContainer>
    </>
  );
}
