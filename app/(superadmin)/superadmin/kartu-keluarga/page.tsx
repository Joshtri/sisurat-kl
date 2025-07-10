"use client";

import { Button } from "@heroui/react";
import { UsersIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { KartuKeluarga } from "@prisma/client";

import { ListGrid } from "@/components/ui/ListGrid";
import { EmptyState } from "@/components/common/EmptyState";
import { TableActions } from "@/components/common/TableActions";
import { getKartuKeluarga } from "@/services/kartuKeluargaService";

export default function KartuKeluargaPage() {
  const router = useRouter();

  const { data = [], isLoading } = useQuery<KartuKeluarga[]>({
    queryKey: ["kartu-keluarga"],
    queryFn: getKartuKeluarga,
  });

  const columns = [
    { key: "nomorKK", label: "NO. KK" },
    { key: "kepala", label: "KEPALA KELUARGA" },
    { key: "alamat", label: "ALAMAT" },
    { key: "rtrw", label: "RT/RW" },
    { key: "createdAt", label: "DIBUAT" },
    { key: "actions", label: "", align: "end" as const },
  ];

  const rows = data.map((item) => ({
    key: item.id,
    nomorKK: item.nomorKK,
    kepala: item.kepalaKeluargaId,
    alamat: item.alamat,
    rtrw: `${item.rt ?? "-"} / ${item.rw ?? "-"}`,
    createdAt: new Date(item.createdAt).toLocaleDateString("id-ID"),
    actions: (
      <TableActions
        onDelete={{ onConfirm: () => alert(`Hapus KK ${item.nomorKK}`) }}
        onEdit={() => alert(`Edit KK ${item.nomorKK}`)}
        onView={() => alert(`Lihat KK ${item.nomorKK}`)}
      />
    ),
  }));

  return (
    <ListGrid
      showPagination
      actions={
        <Button
          color="primary"
          onPress={() => router.push("/superadmin/kartu-keluarga/create")}
        >
          Tambah KK
        </Button>
      }
      breadcrumbs={[
        { label: "Dashboard", href: "/superadmin/dashboard" },
        { label: "Kartu Keluarga" },
      ]}
      columns={columns}
      description="Daftar kartu keluarga yang terdaftar di kelurahan."
      empty={
        <EmptyState
          action={() => router.push("/superadmin/kartu-keluarga/create")}
          actionLabel="Tambah KK"
          description="Silakan tambah kartu keluarga baru."
          icon={<UsersIcon className="w-6 h-6" />}
          title="Belum ada data KK"
        />
      }
      loading={isLoading}
      pageSize={5}
      rows={rows}
      title="Data Kartu Keluarga"
    />
  );
}
