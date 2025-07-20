"use client";

import { UserIcon } from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Role } from "@prisma/client";

import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/common/PageHeader";
import { ListGrid } from "@/components/ui/ListGrid";
import { TableActionsInline } from "@/components/common/TableActionsInline";
import { Users } from "@/interfaces/users";
import { getUsers } from "@/services/userService";
import AddRoleModal from "@/components/AddonsDialog/AddRoleDialog";

export default function MultiRolePage() {
  const router = useRouter();
  const [selectedUser, setSelectedUser] = useState<{
    id: string;
    extraRoles: Role[];
  } | null>(null);
  const [showModal, setShowModal] = useState(false);
  const { data = [], isLoading } = useQuery<Users[]>({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const columns = [
    { key: "username", label: "USERNAME" },
    { key: "email", label: "EMAIL" },
    { key: "role", label: "ROLE" },
    { key: "extraRoles", label: "PERAN TAMBAHAN" },

    { key: "createdAt", label: "DIBUAT" },
    { key: "actions", label: "", align: "end" as const },
  ];

  const rows = data.map((user) => ({
    key: user.id,
    username: user.username,
    email: user.email ?? "-",
    role: user.role,
    extraRoles:
      user.extraRoles && user.extraRoles.length > 0 ? (
        <div className="flex flex-wrap gap-1">
          {user.extraRoles.map((r) => (
            <span
              key={r}
              className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium"
            >
              {r}
            </span>
          ))}
        </div>
      ) : (
        <span className="text-gray-400 text-sm italic">-</span>
      ),

    createdAt: new Date(user.createdAt).toLocaleDateString("id-ID"),

    actions: (
      <>
        <div className="flex items-center gap-2 justify-end">
          <TableActionsInline
            customActions={
              user.role !== "WARGA"
                ? [
                    {
                      key: "edit",
                      label: "Add Role",
                      icon: UserIcon,
                      onClick: () => {
                        setSelectedUser({
                          id: user.id,
                          extraRoles: user.extraRoles,
                        });
                        setShowModal(true);
                      },
                    },
                  ]
                : []
            }
          />

          {/* <TableActions
            onView={() => router.push(`/superadmin/users/${user.id}`)}
          /> */}
        </div>
      </>
    ),
  }));

  return (
    <>
      <PageHeader
        description="Kelola peran pengguna dengan lebih efisien"
        breadcrumbs={[
          { label: "Superadmin", href: "/superadmin/dashboard" },
          { label: "Manajemen Multi Role" },
        ]}
      />

      <ListGrid
        breadcrumbs={[]}
        columns={columns}
        description="Kelola pengguna dan peran mereka dalam sistem Kelurahan."
        empty={
          <EmptyState
            action={() => router.push("/superadmin/users/create")}
            actionLabel="Tambah Pengguna"
            description="Tambahkan pengguna baru untuk mengatur peran mereka."
            icon={<UserIcon className="w-6 h-6" />}
            title="Belum ada pengguna"
          />
        }
        loading={isLoading}
        rows={rows}
        title="Manajemen Multi Role"
        onOptionsClick={() => alert("Pengaturan")}
        onSearch={(val) => console.log("Search:", val)}
      />

      <AddRoleModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        userId={selectedUser?.id || ""}
        currentRoles={selectedUser?.extraRoles || []}
      />
    </>
  );
}
