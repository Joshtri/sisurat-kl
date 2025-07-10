"use client";

import { UserIcon } from "@heroicons/react/24/outline";
import { Button } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { User } from "@prisma/client";

import { EmptyState } from "@/components/common/EmptyState";
import { TableActions } from "@/components/common/TableActions";
import { ListGrid } from "@/components/ui/ListGrid";
import { getUsers } from "@/services/userService";

export default function UsersPage() {
  const router = useRouter();

  const { data = [], isLoading } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const columns = [
    { key: "username", label: "USERNAME" },
    { key: "email", label: "EMAIL" },
    { key: "role", label: "ROLE" },
    { key: "createdAt", label: "DIBUAT" },
    { key: "actions", label: "", align: "end" as "end" },
  ];

  const rows = data.map((user) => ({
    key: user.id,
    username: user.username,
    email: user.email ?? "-",
    role: user.role,
    createdAt: new Date(user.createdAt).toLocaleDateString("id-ID"),
    actions: (
      <TableActions
        onDelete={{
          onConfirm: () => alert(`Hapus ${user.username}`),
        }}
        onEdit={() => alert(`Edit ${user.username}`)}
        onView={() => alert(`Lihat ${user.username}`)}
      />
    ),
  }));

  return (
    <ListGrid
      actions={
        <Button
          color="primary"
          onPress={() => router.push("/superadmin/users/create")}
        >
          Tambah Pengguna
        </Button>
      }
      breadcrumbs={[
        { label: "Dashboard", href: "/superadmin/dashboard" },
        { label: "Pengguna" },
      ]}
      columns={columns}
      description="Daftar pengguna yang terdaftar di sistem Kelurahan."
      empty={
        <EmptyState
          action={() => router.push("/superadmin/users/create")}
          actionLabel="Tambah Pengguna"
          description="Tambahkan pengguna baru untuk mulai menggunakan sistem."
          icon={<UserIcon className="w-6 h-6" />}
          title="Belum ada pengguna"
        />
      }
      loading={isLoading}
      rows={rows}
      title="Manajemen Pengguna"
      onOptionsClick={() => alert("Pengaturan")}
      onSearch={(val) => console.log("Search:", val)}
    />
  );
}
