"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { PageHeader } from "@/components/common/PageHeader";
import { userSchema, UserSchema } from "@/validations/userSchema";
import { TextInput } from "@/components/ui/inputs/TextInput";
import { FormWrapper } from "@/components/FormWrapper";
import { SelectInput } from "@/components/ui/inputs/SelectInput";
import { CardContainer } from "@/components/common/CardContainer";

interface UserFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
  phone: string;
  address: string;
}

export default function UsersCreatePage() {
  const router = useRouter();
  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
    phone: "",
    address: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<UserFormData>>({});

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof UserFormData]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const onSubmit = async (data: UserSchema) => {
    console.log("SUBMIT:", data);
    await new Promise((r) => setTimeout(r, 1000));
    router.push("/superadmin/users");
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

      {/* <div className="max-w-2xl mx-auto p-2">
        <div className="bg-white rounded-lg shadow-md p-6"> */}
      <CardContainer>
        <FormWrapper<UserSchema>
          defaultValues={{
            name: "",
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
          <TextInput label="Username" name="name" />
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

          {/* DropdownInput, TextareaInput, dsb akan menyusul */}
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
      {/* </div>
      </div> */}
    </>
  );
}
