"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Role } from "@prisma/client";

import { PageHeader } from "@/components/common/PageHeader";
import { userSchema, UserSchema } from "@/validations/userSchema";
import { TextInput } from "@/components/ui/inputs/TextInput";
import { SelectInput } from "@/components/ui/inputs/SelectInput";
import { FormWrapper } from "@/components/FormWrapper";
import { CardContainer } from "@/components/common/CardContainer";
import { createUser } from "@/services/userService";
import { showToast } from "@/utils/toastHelper"; // ✅ toast helper

export default function UsersCreatePage() {
  const router = useRouter();

  const onSubmit = async (data: UserSchema) => {
    try {
      const payload = {
        username: data.username,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        role: data.role as Role,
        phone: data.phone,
        address: data.address,
      };

      await createUser(payload);

      showToast({
        title: "Berhasil",
        description: "Pengguna berhasil dibuat.",
        color: "success",
      });

      router.push("/superadmin/users");
    } catch (error) {
      console.error("Gagal membuat user:", error);

      showToast({
        title: "Gagal",
        description: "Terjadi kesalahan saat menyimpan data pengguna.",
        color: "error",
      });
    }
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
            role: "user",
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
              { label: "User", value: "user" },
              { label: "Admin", value: "admin" },
              { label: "Super Admin", value: "superadmin" },
            ]}
          />
          <TextInput label="No. Telepon" name="phone" />
          <TextInput label="Alamat" name="address" />

          <div className="flex justify-end space-x-3 pt-6">
            <button
              className="px-4 py-2 bg-gray-200 rounded-md"
              type="button"
              onClick={() => router.push("/superadmin/users")}
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
