"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Chip } from "@heroui/react";

import { PageHeader } from "@/components/common/PageHeader";
import { ReadOnlyInput } from "@/components/ui/inputs/ReadOnlyInput";
import { CardContainer } from "@/components/common/CardContainer";
import { getUserById } from "@/services/userService";
import { roleLabel, toLowerCase } from "@/utils/common";
import { SkeletonCard } from "@/components/ui/skeleton/SkeletonCard";

export default function UsersDetailPage() {
  const { id } = useParams();

  const roleColorMap: Record<
    string,
    "primary" | "success" | "warning" | "danger"
  > = {
    superadmin: "danger",
    staff: "warning",
    lurah: "success",
    rt: "success",
    warga: "primary",
  };

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
        title={`Detail Pengguna ${user?.username || ""}`}
        actions={[]}
      />

      <CardContainer isLoading={isLoading} skeleton={<SkeletonCard rows={4} />}>
        {/* {isLoading && <SkeletonCard rows={4} />} */}

        {user && (
          <>
            <ReadOnlyInput label="Nama Pengguna" value={user.username} />
            <ReadOnlyInput label="Email" value={user.email || ""} />
            <ReadOnlyInput
              label="Role"
              value={
                <Chip
                  color={roleColorMap[toLowerCase(user.role)] ?? "default"}
                  variant="flat"
                  className="w-fit"
                >
                  {roleLabel(toLowerCase(user.role))}
                </Chip>
              }
            />
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
