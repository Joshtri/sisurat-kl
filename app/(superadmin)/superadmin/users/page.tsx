"use client";

import { UserIcon } from "@heroicons/react/24/outline";
import { Button } from "@heroui/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { User } from "@prisma/client";

import { EmptyState } from "@/components/common/EmptyState";
import { TableActions } from "@/components/common/TableActions";
import { ListGrid } from "@/components/ui/ListGrid";
import { getUsers } from "@/services/userService";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { deleteUser } from "@/services/userService";
import { showToast } from "@/utils/toastHelper";

export default function UsersPage() {
  const router = useRouter();

  const { data = [], isLoading } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: getUsers,
  });
  const queryClient = useQueryClient();

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
          title: "Hapus Pengguna",
          message: `Apakah Anda yakin ingin menghapus pengguna "${user.username}"?`,
          confirmLabel: "Hapus",
          loadingText: "Menghapus...",
          onConfirm: async () => {
            try {
              await deleteUser(user.id);

              showToast({
                title: "Berhasil",
                description: `Pengguna "${user.username}" telah dihapus.`,
                color: "success",
              });

              queryClient.invalidateQueries({ queryKey: ["users"] }); // refresh list
            } catch (error) {
              showToast({
                title: "Gagal",
                description: "Gagal menghapus pengguna.",
                color: "error",
              });
            }
          },
        }}
        onEdit={() => alert(`Edit ${user.username}`)}
        onView={() => router.push(`/superadmin/users/${user.id}`)}
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
