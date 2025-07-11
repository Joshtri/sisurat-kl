"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { PageHeader } from "@/components/common/PageHeader";
import { ReadOnlyInput } from "@/components/ui/inputs/ReadOnlyInput";
import { CardContainer } from "@/components/common/CardContainer";
import { getUserById } from "@/services/userService";

const roleLabel = (role: string) => {
  switch (role) {
    case "superadmin":
      return "Superadmin";
    case "admin":
      return "Admin";
    case "user":
      return "User";
    default:
      return role;
  }
};

export default function UsersDetailPage() {
  const { id } = useParams();

  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["user", id],
    queryFn: () => getUserById(id as string),
    enabled: !!id,
  });

  return (
    <>
      <PageHeader
        backHref="/superadmin/users"
        breadcrumbs={[
          { label: "Dashboard", href: "/superadmin" },
          { label: "Pengguna", href: "/superadmin/users" },
          { label: "Detail Pengguna" },
        ]}
        actions={[]}
      />

      <CardContainer>
        {user && (
          <>
            <ReadOnlyInput label="Nama Pengguna" value={user.username} />
            <ReadOnlyInput label="Email" value={user.email} />
            <ReadOnlyInput label="Role" value={user.role} />
            <ReadOnlyInput
              label="Dibuat pada"
              value={new Date(user.createdAt).toLocaleString()}
            />
          </>
        )}
      </CardContainer>
    </>
  );
}
