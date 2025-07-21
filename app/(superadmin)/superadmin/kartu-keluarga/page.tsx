"use client";

import { Button } from "@heroui/react";
import { UsersIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
// import { KartuKeluarga } from "@prisma/client";

import { ListGrid } from "@/components/ui/ListGrid";
import { EmptyState } from "@/components/common/EmptyState";
import { TableActions } from "@/components/common/TableActions";
import {
  deleteKartuKeluarga,
  getKartuKeluarga,
} from "@/services/kartuKeluargaService";
import { KartuKeluarga } from "@/interfaces/kartu-keluarga";
import { showToast } from "@/utils/toastHelper";

export default function KartuKeluargaPage() {
  const router = useRouter();

  const queryClient = useQueryClient();

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
    { key: "daftarAnggota", label: "DAFTAR ANGGOTA" },

    { key: "actions", label: "", align: "end" as const },
  ];

  const rows = data.map((item) => ({
    key: item.id,
    nomorKK: item.nomorKK,
    kepala: item.kepalaKeluarga.namaLengkap,
    alamat: item.alamat,
    rtrw: `${item.rt ?? "-"} / ${item.rw ?? "-"}`,
    createdAt: new Date(item.createdAt).toLocaleDateString("id-ID"),
    daftarAnggota: (
      <Button
        color="primary"
        onPress={() =>
          router.push(`/superadmin/kartu-keluarga/${item.id}/anggota`)
        }
      >
        Lihat Anggota
      </Button>
    ),
    actions: (
      <TableActions
        onDelete={{
          title: "Hapus Kartu Keluarga",
          message: `Apakah Anda yakin ingin menghapus kartu keluarga "${item.nomorKK}"?`,
          onConfirm: async () => {
            try {
              await deleteKartuKeluarga(item.id);
              showToast({
                title: "Berhasil",
                description: "Kartu keluarga berhasil dihapus",
                color: "success",
              });

              queryClient.invalidateQueries({ queryKey: ["kartu-keluarga"] }); // refresh list
            } catch (error) {
              showToast({
                title: "Gagal",
                description: "Terjadi kesalahan saat menghapus kartu keluarga",
                color: "error",
              });
            }
          },
        }}
        // onDelete={{ onConfirm: () => alert(`Hapus KK ${item.nomorKK}`) }}
        // onEdit={() => alert(`Edit KK ${item.nomorKK}`)}
        onEdit={() => router.push(`/superadmin/kartu-keluarga/${item.id}/edit`)}
        onView={() => router.push(`/superadmin/kartu-keluarga/${item.id}`)}
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
      onSearch={(search) => {
        // Implement search functionality if needed
        console.log("Search:", search);
      }}
      title="Data Kartu Keluarga"
    />
  );
}
