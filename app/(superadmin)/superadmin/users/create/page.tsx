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

import { Button } from "@heroui/react";
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
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
      role: data.role as Role,
      phone: data.phone,
      address: data.address,
    };
    mutate(payload);
  };

  return (
    <>
      <PageHeader
        actions={[]}
        backHref="/superadmin/users"
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
            phone: "",
            address: "",
          }}
          schema={userSchema}
          onSubmit={onSubmit}
        >
          <TextInput label="Username" name="username" />
          <TextInput label="Email" name="email" type="email" />
          <TextInput label="Password" name="password" type="password" />
          <TextInput
            label="Konfirmasi Password"
            name="confirmPassword"
            type="password"
          />
          <SelectInput
            label="Role"
            name="role"
            options={[
              { label: "Warga", value: "WARGA" },
              { label: "RT", value: "RT" },
              { label: "Staff", value: "STAFF" },
              { label: "Lurah", value: "LURAH" },
              { label: "Admin", value: "ADMIN" },
            ]}
          />
          <TextInput label="No. Telepon" name="phone" />
          <TextInput label="Alamat" name="address" />

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
