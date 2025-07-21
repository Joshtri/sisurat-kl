"use client";

import { Role } from "@prisma/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";

import { FormWrapper } from "@/components/FormWrapper";
import { CardContainer } from "@/components/common/CardContainer";
import { PageHeader } from "@/components/common/PageHeader";
import { CreateOrEditButtons } from "@/components/ui/CreateOrEditButtons";
import { SelectInput } from "@/components/ui/inputs/SelectInput";
import { TextInput } from "@/components/ui/inputs/TextInput";
import { SkeletonCard } from "@/components/ui/skeleton/SkeletonCard";
import { getUserById, updateUser } from "@/services/userService";
import { showToast } from "@/utils/toastHelper";
import { userSchemaPartial, UserSchemaPartial } from "@/validations/userSchema";

export default function UsersEditPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  // Query untuk mengambil data user
  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId,
  });

  // Mutation untuk update user
  const { mutate, isPending } = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      showToast({
        title: "Berhasil",
        description: "Data pengguna berhasil diperbarui.",
        color: "success",
      });
      router.push("/superadmin/users");
    },
    onError: () => {
      showToast({
        title: "Gagal",
        description: "Terjadi kesalahan saat memperbarui data pengguna.",
        color: "error",
      });
    },
  });
  // Alternative approach dengan explicit types
  const onSubmit = (data: UserSchemaPartial) => {
    type UpdatePayloadBase = {
      id: string;
      username?: string;
      email?: string;
      numberWhatsApp?: string;
      role?: Role;
    };

    type UpdatePayloadWithPassword = UpdatePayloadBase & {
      password: string;
      confirmPassword: string;
    };

    type UpdatePayload = UpdatePayloadBase | UpdatePayloadWithPassword;

    const basePayload: UpdatePayloadBase = {
      id: userId,
      username: data.username,
      email: data.email || undefined,
      numberWhatsApp: data.numberWhatsApp || undefined,
      role: data.role,
    };

    let payload: UpdatePayload;

    if (data.password && data.password.length > 0) {
      payload = {
        ...basePayload,
        password: data.password,
        confirmPassword: data.confirmPassword,
      } as UpdatePayloadWithPassword;
    } else {
      payload = basePayload;
    }

    mutate(payload);
  };

  // Loading state
  if (isLoadingUser) {
    return (
      <>
        <PageHeader
          breadcrumbs={[
            { label: "Dashboard", href: "/superadmin" },
            { label: "Pengguna", href: "/superadmin/users" },
            { label: "Edit Pengguna" },
          ]}
          backHref="/superadmin/users"
          title="Edit Pengguna"
        />
        <CardContainer>
          <div className="p-4">
            <SkeletonCard rows={10} />
          </div>
        </CardContainer>
      </>
    );
  }

  // Error state
  if (!user) {
    return (
      <>
        <PageHeader
          breadcrumbs={[
            { label: "Dashboard", href: "/superadmin" },
            { label: "Pengguna", href: "/superadmin/users" },
            { label: "Edit Pengguna" },
          ]}
          backHref="/superadmin/users"
          title="Edit Pengguna"
        />
        <CardContainer>
          <div className="p-4">
            <p>Data pengguna tidak ditemukan.</p>
          </div>
        </CardContainer>
      </>
    );
  }

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/superadmin" },
          { label: "Pengguna", href: "/superadmin/users" },
          { label: `Edit: ${user.username}` },
        ]}
        backHref="/superadmin/users"
        title={`Edit Pengguna: ${user.username}`}
      />

      <CardContainer>
        <FormWrapper<UserSchemaPartial>
          defaultValues={{
            username: user.username || "",
            email: user.email || "",
            numberWhatsApp: user.numberWhatsApp || "",
            role: user.role as Role,
            password: "",
            confirmPassword: "",
          }}
          schema={userSchemaPartial}
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
            label="No. WhatsApp"
            name="numberWhatsApp"
            isRequired={false}
          />

          <TextInput
            label="Password Baru"
            name="password"
            type="password"
            showPasswordToggle
            isRequired={false}
            helperText="Kosongkan jika tidak ingin mengubah password"
          />

          <TextInput
            label="Konfirmasi Password Baru"
            name="confirmPassword"
            type="password"
            showPasswordToggle
            isRequired={false}
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
              isEditMode={true}
            />
          </div>
        </FormWrapper>
      </CardContainer>
    </>
  );
}
