"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import * as z from "zod";

import { CardContainer } from "@/components/common/CardContainer";
import { PageHeader } from "@/components/common/PageHeader";
import { FormWrapper } from "@/components/FormWrapper";
import { CreateOrEditButtons } from "@/components/ui/CreateOrEditButtons";
import { TextInput } from "@/components/ui/inputs/TextInput";
import { SkeletonCard } from "@/components/ui/skeleton/SkeletonCard";
import { getUserById, updateUser } from "@/services/userService";
import { showToast } from "@/utils/toastHelper";

// ✅ Schema khusus edit RT (tanpa password)
const userUpdateSchema = z.object({
  username: z.string().min(1, "Username wajib diisi"),
  email: z.string().email("Email tidak valid"),
  //   role: z.literal("RT"),
});

type UserUpdateSchema = z.infer<typeof userUpdateSchema>;

export default function EditRTPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const { data: user, isLoading } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      showToast({
        title: "Berhasil",
        description: "Data akun RT berhasil diperbarui.",
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

  const onSubmit = (data: UserUpdateSchema) => {
    mutate({
      id: userId,
      username: data.username,
      email: data.email,
      //   role: "RT",
    });
  };

  const defaultValues: UserUpdateSchema = {
    username: user?.username ?? "",
    email: user?.email ?? "",
    // role: "RT",
  };

  return (
    <>
      <PageHeader
        backHref="/superadmin/rt"
        breadcrumbs={[
          { label: "Dashboard", href: "/superadmin" },
          { label: "Manajemen RT", href: "/superadmin/rt" },
          { label: "Edit Akun RT" },
        ]}
        title="Edit Akun RT"
      />

      <CardContainer>
        {isLoading ? (
          <SkeletonCard rows={5} />
        ) : (
          <FormWrapper<UserUpdateSchema>
            defaultValues={defaultValues}
            schema={userUpdateSchema}
            onSubmit={onSubmit}
          >
            <TextInput label="Username" name="username" />
            <TextInput label="Email" name="email" type="email" />
            <TextInput label="Role" name="role" isDisabled value="RT" />

            <div className="flex justify-end space-x-3 pt-6">
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
