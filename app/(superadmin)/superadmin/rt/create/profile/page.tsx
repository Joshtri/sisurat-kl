"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";

import { CardContainer } from "@/components/common/CardContainer";
import { PageHeader } from "@/components/common/PageHeader";
import { FormWrapper } from "@/components/FormWrapper";
import { TextInput } from "@/components/ui/inputs/TextInput";
import { showToast } from "@/utils/toastHelper";
import { createRTProfile } from "@/services/rtService";
import { CreateOrEditButtons } from "@/components/ui/CreateOrEditButtons";

import * as z from "zod";

const rtProfileSchema = z.object({
  nik: z.string().min(16, "NIK harus 16 digit"),
  rt: z.string().min(1, "RT wajib diisi"),
  rw: z.string().min(1, "RW wajib diisi"),
  wilayah: z.string().optional(),
});

type RTProfileSchema = z.infer<typeof rtProfileSchema>;

export default function CreateProfileRTPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");

  const { mutate, isPending } = useMutation({
    mutationFn: createRTProfile,
    onSuccess: () => {
      showToast({
        title: "Berhasil",
        description: "Profil RT berhasil disimpan.",
        color: "success",
      });
      router.push("/superadmin/rt");
    },
    onError: (error: any) => {
      showToast({
        title: "Gagal",
        description:
          error?.response?.data?.message ||
          "Gagal menyimpan profil RT. Silakan coba lagi.",
        color: "error",
      });
    },
  });

  useEffect(() => {
    if (!userId) {
      showToast({
        title: "Gagal",
        description: "User ID tidak ditemukan.",
        color: "error",
      });
      router.push("/superadmin/rt");
    }
  }, [userId, router]);

  const onSubmit = (data: RTProfileSchema) => {
    if (!userId) return;
    mutate({ userId, ...data });
  };

  return (
    <>
      <PageHeader
        backHref="/superadmin/rt"
        breadcrumbs={[
          { label: "Dashboard", href: "/superadmin" },
          { label: "Manajemen RT", href: "/superadmin/rt" },
          { label: "Lengkapi Profil RT" },
        ]}
        title="Lengkapi Profil RT"
      />

      <CardContainer>
        <FormWrapper<RTProfileSchema>
          defaultValues={{ nik: "", rt: "", rw: "", wilayah: "" }}
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
      </CardContainer>
    </>
  );
}
