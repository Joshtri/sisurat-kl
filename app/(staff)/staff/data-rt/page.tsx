"use client";

import { UserIcon } from "@heroicons/react/24/outline";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { EmptyState } from "@/components/common/EmptyState";
import { TableActions } from "@/components/common/TableActions";
import { ListGrid } from "@/components/ui/ListGrid";
import { getAllRT } from "@/services/rtService";

export default function RTPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data = [], isLoading } = useQuery({
    queryKey: ["rt-users"],
    queryFn: getAllRT,
  });

  const columns = [
    { key: "username", label: "USERNAME" },
    { key: "email", label: "EMAIL" },
    { key: "rt", label: "RT" },
    { key: "rw", label: "RW" },
    { key: "wilayah", label: "WILAYAH" },
    { key: "statusProfil", label: "PROFIL" },
    { key: "actions", label: "", align: "end" as const },
  ];

  const rows = data.map((user: any) => ({
    key: user.id,
    username: user.username,
    email: user.email ?? "-",
    rt: user.RTProfile?.rt ?? "-",
    rw: user.RTProfile?.rw ?? "-",
    wilayah: user.RTProfile?.wilayah ?? "-",

    statusProfil: user.RTProfile ? (
      <span className="text-green-700 bg-green-100 px-2 py-1 rounded-full text-xs font-medium">
        Lengkap
      </span>
    ) : (
      <span className="text-red-700 bg-red-100 hover:bg-red-200 px-2 py-1 rounded-full text-xs font-medium">
        Lengkapi Profil
      </span>
    ),

    actions: (
      <TableActions onView={() => router.push(`/lurah/data-rt/${user.id}`)} />
    ),
  }));

  return (
    <ListGrid
      breadcrumbs={[
        { label: "Dashboard", href: "/staff/dashboard" },
        { label: "Manajemen RT", href: "/staff/data-rt" },
      ]}
      columns={columns}
      description="Kelola data pengguna RT yang terdaftar di sistem Kelurahan."
      empty={
        <EmptyState
          title="Belum ada RT"
          icon={<UserIcon className="w-6 h-6" />}
        />
      }
      showPagination
      pageSize={20}
      loading={isLoading}
      rows={rows}
      title="Manajemen RT"
      onSearch={(val) => console.log("Search:", val)}
    />
  );
}
