"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { PencilSquareIcon, UserIcon } from "@heroicons/react/24/outline";
import { Button } from "@heroui/button";
import Link from "next/link";

import { EmptyState } from "@/components/common/EmptyState";
import { TableActions } from "@/components/common/TableActions";
import { ListGrid } from "@/components/ui/ListGrid";
import { getAllRT } from "@/services/rtService";
import { deleteUser } from "@/services/userService";
import { showToast } from "@/utils/toastHelper";

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
      <Link
        href={`/superadmin/rt/create/profile?userId=${user.id}`}
        className="text-red-700 bg-red-100 hover:bg-red-200 px-2 py-1 rounded-full text-xs font-medium"
      >
        Lengkapi Profil
      </Link>
    ),

    actions: (
      <TableActions
        onDelete={{
          title: "Hapus RT",
          message: `Apakah Anda yakin ingin menghapus RT "${user.username}"?`,
          confirmLabel: "Hapus",
          loadingText: "Menghapus...",
          onConfirm: async () => {
            try {
              await deleteUser(user.id);
              showToast({
                title: "Berhasil",
                description: `Akun RT "${user.username}" telah dihapus.`,
                color: "success",
              });
              queryClient.invalidateQueries({ queryKey: ["rt-users"] });
            } catch (error) {
              showToast({
                title: "Gagal",
                description: "Gagal menghapus akun RT.",
                color: "error",
              });
            }
          },
        }}
        onEdit={() => router.push(`/superadmin/rt/${user.RTProfile?.id}/edit`)}
        onView={() => router.push(`/superadmin/rt/${user.id}`)}
        customActions={[
          {
            key: "custom1",
            label: "Edit RT Profile",
            icon: PencilSquareIcon,
            onClick: () =>
              router.push(`/superadmin/rt/${user.id}/edit/profile`),
          },
        ]}
      />
    ),
  }));

  return (
    <ListGrid
      actions={
        <Button
          color="primary"
          onPress={() => router.push("/superadmin/rt/create")}
        >
          Tambah RT
        </Button>
      }
      breadcrumbs={[
        { label: "Dashboard", href: "/superadmin/dashboard" },
        { label: "Manajemen RT", href: "/superadmin/rt" },
      ]}
      columns={columns}
      description="Kelola data pengguna RT yang terdaftar di sistem Kelurahan."
      empty={
        <EmptyState
          title="Belum ada RT"
          description="Tambahkan akun RT untuk mulai mengelola wilayah."
          icon={<UserIcon className="w-6 h-6" />}
          actionLabel="Tambah RT"
          action={() => router.push("/superadmin/rt/create")}
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
