"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@heroui/react";
import { UserIcon } from "@heroicons/react/24/outline";

import { deleteWarga, getAllWarga } from "@/services/wargaService";
import { ListGrid } from "@/components/ui/ListGrid";
import { EmptyState } from "@/components/common/EmptyState";
import { TableActions } from "@/components/common/TableActions";
import { formatDateIndo } from "@/utils/common";
import { showToast } from "@/utils/toastHelper";

export default function WargaPage() {
  const router = useRouter();

  const { data = [], isLoading } = useQuery({
    queryKey: ["warga"],
    queryFn: getAllWarga,
  });

  const queryClient = useQueryClient();

  const columns = [
    { key: "nik", label: "NIK" },
    { key: "namaLengkap", label: "Nama Lengkap" },
    { key: "jenisKelamin", label: "Jenis Kelamin" },
    { key: "tempatTanggalLahir", label: "Tanggal Lahir" },
    { key: "pekerjaan", label: "Pekerjaan" },
    { key: "alamat", label: "Alamat" },
    { key: "rtrw", label: "RT/RW" },
    { key: "status", label: "Status" },
    { key: "actions", label: "", align: "end" as const },
  ];

  const formatJenisKelamin = (jk: string) => {
    return jk === "LAKI_LAKI" ? "Laki-laki" : "Perempuan";
  };

  const formatStatus = (status: string) => {
    return status === "HIDUP" ? "Hidup" : "Meninggal";
  };

  const rows = data.map((item) => ({
    key: item.id,
    nik: item.nik,
    namaLengkap: item.namaLengkap,
    jenisKelamin: formatJenisKelamin(item.jenisKelamin),
    tempatTanggalLahir:
      formatDateIndo(item.tanggalLahir ? String(item.tanggalLahir) : "") || "-",
    pekerjaan: item.pekerjaan || "-",
    alamat: item.kartuKeluarga?.alamat || "-",
    rtrw: `${item.kartuKeluarga?.rt || "-"} / ${item.kartuKeluarga?.rw || "-"}`,
    status: formatStatus(item.statusHidup),
    actions: (
      <TableActions
        onDelete={{
          title: "Hapus Warga",
          message: `Apakah Anda yakin ingin menghapus warga "${item.namaLengkap}"?`,
          confirmLabel: "Hapus",
          loadingText: "Menghapus...",
          onConfirm: async () => {
            try {
              await deleteWarga(item.id);
              showToast({
                title: "Berhasil",
                description: `Warga ${item.namaLengkap} berhasil dihapus.`,
                color: "success",
              });

              queryClient.invalidateQueries({ queryKey: ["warga"] }); // refresh list
            } catch (error) {
              showToast({
                title: "Gagal",
                description: `Terjadi kesalahan saat menghapus warga ${item.namaLengkap}.`,
                color: "error",
              });
            }
          },
        }}
        onEdit={() => router.push(`/superadmin/warga/${item.id}/edit`)}
        // onEdit={() => alert(`Edit warga ${item.namaLengkap}`)}
        onView={() => router.push(`/superadmin/warga/${item.id}`)}
      />
    ),
  }));

  return (
    <ListGrid
      actions={
        <Button
          color="primary"
          onPress={() => router.push("/superadmin/warga/create")}
        >
          Tambah Warga
        </Button>
      }
      breadcrumbs={[
        { label: "Dashboard", href: "/superadmin/dashboard" },
        { label: "Warga" },
      ]}
      columns={columns}
      description="Daftar warga yang terdaftar di sistem"
      empty={
        <EmptyState
          action={() => router.push("/superadmin/warga/create")}
          actionLabel="Tambah Warga"
          description="Silakan tambah data warga baru."
          icon={<UserIcon className="w-6 h-6" />}
          title="Belum ada data warga"
        />
      }
      loading={isLoading}
      pageSize={10}
      rows={rows}
      searchPlaceholder="Cari warga..."
      showPagination={true}
      title="Data Warga"
      onSearch={(query) => console.log("Search:", query)}
    />
  );
}
