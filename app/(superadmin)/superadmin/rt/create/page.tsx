"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Role } from "@prisma/client";

import { PageHeader } from "@/components/common/PageHeader";
import { userSchema, UserSchema } from "@/validations/userSchema";
import { TextInput } from "@/components/ui/inputs/TextInput";
import { FormWrapper } from "@/components/FormWrapper";
import { CardContainer } from "@/components/common/CardContainer";
import { createUser } from "@/services/userService";
import { showToast } from "@/utils/toastHelper";
import { CreateOrEditButtons } from "@/components/ui/CreateOrEditButtons";

export default function RTCreatePage() {
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      showToast({
        title: "Berhasil",
        description: "Akun RT berhasil dibuat.",
        color: "success",
      });
      router.push("/superadmin/rt");
    },
    onError: () => {
      showToast({
        title: "Gagal",
        description: "Terjadi kesalahan saat menyimpan data RT.",
        color: "error",
      });
    },
  });

  const onSubmit = (data: UserSchema) => {
    const payload = {
      username: data.username,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
      role: "RT" as Role, // ⬅️ fix role to RT
    };

    mutate(payload);
  };

  return (
    <>
      <PageHeader
        actions={[]}
        backHref="/superadmin/rt"
        breadcrumbs={[
          { label: "Dashboard", href: "/superadmin" },
          { label: "Manajemen RT", href: "/superadmin/rt" },
          { label: "Buat Akun RT" },
        ]}
      />

      <CardContainer>
        <FormWrapper<UserSchema>
          defaultValues={{
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
            role: "RT" as Role,
          }}
          schema={userSchema}
          onSubmit={onSubmit}
        >
          <TextInput label="Username" name="username" />
          <TextInput label="Email" name="email" type="email" />
          <TextInput
            label="Password"
            name="password"
            type="password"
            showPasswordToggle
          />
          <TextInput
            label="Konfirmasi Password"
            name="confirmPassword"
            type="password"
            showPasswordToggle
          />

          <TextInput
            label="Role"
            name="role"
            isDisabled
            value="RT"
            placeholder="RT"
          />

          <div className="flex justify-end space-x-3 pt-6">
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
