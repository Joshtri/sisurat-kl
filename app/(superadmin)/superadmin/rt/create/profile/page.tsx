"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import * as z from "zod";

import { CardContainer } from "@/components/common/CardContainer";
import { PageHeader } from "@/components/common/PageHeader";
import { FormWrapper } from "@/components/FormWrapper";
import { CreateOrEditButtons } from "@/components/ui/CreateOrEditButtons";
import { TextInput } from "@/components/ui/inputs/TextInput";
import { createRTProfile } from "@/services/rtService";
import { showToast } from "@/utils/toastHelper";

const rtProfileSchema = z.object({
  namaLengkap: z.string().min(1, "Nama lengkap wajib diisi"),
  nik: z.string().min(16, "NIK harus 16 digit"),
  rt: z.string().min(1, "RT wajib diisi"),
  rw: z.string().min(1, "RW wajib diisi"),
  wilayah: z.string().optional(),
});

type RTProfileSchema = z.infer<typeof rtProfileSchema>;

export default function CreateProfileRTPage() {
  const router = useRouter();
  // const userId = searchParams.get("userId");

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

  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const uid = sp.get("userId");

    setUserId(uid);

    if (!uid) {
      showToast({
        title: "Gagal",
        description: "User ID tidak ditemukan.",
        color: "error",
      });
      router.push("/superadmin/rt");
    }
  }, [router]);
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
          <TextInput name="namaLengkap" label="Nama Lengkap" />
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
