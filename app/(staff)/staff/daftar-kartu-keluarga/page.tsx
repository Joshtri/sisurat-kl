"use client";

import { Button } from "@heroui/react";
import { UsersIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { ListGrid } from "@/components/ui/ListGrid";
import { EmptyState } from "@/components/common/EmptyState";
import { getKartuKeluarga } from "@/services/kartuKeluargaService";
import { KartuKeluarga } from "@/interfaces/kartu-keluarga";

export default function DaftarKartuKeluargPage() {
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
    { key: "daftarAnggota", label: "DAFTAR ANGGOTA" },
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
        variant="flat"
        onPress={() =>
          router.push(`/staff/daftar-kartu-keluarga/${item.id}/anggota`)
        }
      >
        Lihat Anggota
      </Button>
    ),
  }));

  return (
    <ListGrid
      showPagination
      breadcrumbs={[
        { label: "Dashboard", href: "/staff/dashboard" },
        { label: "Daftar Kartu Keluarga" },
      ]}
      columns={columns}
      description="Daftar kartu keluarga yang terdaftar di kelurahan."
      empty={
        <EmptyState
          description="Belum ada data kartu keluarga yang terdaftar."
          icon={<UsersIcon className="w-6 h-6" />}
          title="Belum ada data KK"
        />
      }
      loading={isLoading}
      pageSize={10}
      rows={rows}
      onSearch={(search) => {
        // Implement search functionality if needed
        console.log("Search:", search);
      }}
      title="Daftar Kartu Keluarga"
    />
  );
}
