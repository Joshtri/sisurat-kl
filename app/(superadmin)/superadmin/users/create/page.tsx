"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Role } from "@prisma/client";

import { PageHeader } from "@/components/common/PageHeader";
import { userSchema, UserSchema } from "@/validations/userSchema";
import { TextInput } from "@/components/ui/inputs/TextInput";
import { SelectInput } from "@/components/ui/inputs/SelectInput";
import { FormWrapper } from "@/components/FormWrapper";
import { CardContainer } from "@/components/common/CardContainer";
import { createUser } from "@/services/userService";
import { showToast } from "@/utils/toastHelper";
import { CreateOrEditButtons } from "@/components/ui/CreateOrEditButtons";

export default function UsersCreatePage() {
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      showToast({
        title: "Berhasil",
        description: "Pengguna berhasil dibuat.",
        color: "success",
      });
      router.push("/superadmin/users");
    },
    onError: () => {
      showToast({
        title: "Gagal",
        description: "Terjadi kesalahan saat menyimpan data pengguna.",
        color: "error",
      });
    },
  });

  const onSubmit = (data: UserSchema) => {
    const payload = {
      username: data.username,
      email: data.email || undefined, // Kirim undefined jika string kosong
      password: data.password,
      confirmPassword: data.confirmPassword,
      role: data.role as Role,
      numberWhatsApp: data.numberWhatsApp || undefined, // Kirim undefined jika string kosong
    };

    mutate(payload);
  };

  return (
    <>
      <PageHeader
        actions={[]}
        backHref="/superadmin/users"
        title="Buat Pengguna Baru"
        breadcrumbs={[
          { label: "Dashboard", href: "/superadmin" },
          { label: "Pengguna", href: "/superadmin/users" },
          { label: "Buat Baru" },
        ]}
      />

      <CardContainer>
        <FormWrapper<UserSchema>
          defaultValues={{
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
            role: "" as Role,
            numberWhatsApp: "",
          }}
          schema={userSchema}
          onSubmit={onSubmit}
        >
          <TextInput label="Username" name="username" />
          <TextInput
            label="Email"
            name="email"
            type="email"
            isRequired={false}
          />

          <TextInput
            label="No. Telepon"
            name="numberWhatsapp"
            isRequired={false}
          />
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
          <SelectInput
            label="Role"
            name="role"
            options={[
              { label: "Warga", value: "WARGA" },
              { label: "RT", value: "RT" },
              { label: "Staff", value: "STAFF" },
              { label: "Lurah", value: "LURAH" },
              { label: "Admin", value: "SUPERADMIN" },
            ]}
          />

          <div className="flex justify-end space-x-3 pt-6">
            <CreateOrEditButtons
              isLoading={isPending}
              onCancel={() => router.push("/superadmin/users")}
            />
          </div>
        </FormWrapper>
      </CardContainer>
    </>
  );
}
