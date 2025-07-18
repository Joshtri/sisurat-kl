"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@heroui/react";
import { DocumentTextIcon } from "@heroicons/react/24/outline";
import { JenisSurat } from "@prisma/client";

import {
  deleteJenisSurat,
  getAllJenisSurat,
} from "@/services/jenisSuratService";
import { ListGrid } from "@/components/ui/ListGrid";
import { EmptyState } from "@/components/common/EmptyState";
import { TableActions } from "@/components/common/TableActions";
import { showToast } from "@/utils/toastHelper";

export default function JenisSuratPage() {
  const router = useRouter();
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const { data = [], isLoading } = useQuery<JenisSurat[]>({
    queryKey: ["jenisSurat"],
    queryFn: getAllJenisSurat,
  });

  const queryClient = useQueryClient();

  const columns = [
    { key: "kode", label: "KODE" },
    { key: "nama", label: "NAMA SURAT" },
    { key: "deskripsi", label: "DESKRIPSI" },
    { key: "aktif", label: "AKTIF" },
    { key: "actions", label: "", align: "end" as const },
  ];

  const rows = data.map((item) => ({
    key: item.id,
    kode: item.kode,
    nama: item.nama,
    deskripsi: item.deskripsi ?? "-",
    aktif: item.aktif ? "Ya" : "Tidak",
    actions: (
      <TableActions
        onDelete={{
          title: "Hapus Jenis Surat",
          message: `Apakah Anda yakin ingin menghapus jenis surat "${item.nama}"?`,
          confirmLabel: "Hapus",
          loadingText: "Menghapus...",
          onConfirm: async () => {
            try {
              await deleteJenisSurat(item.id);
              showToast({
                title: "Berhasil",
                description: "Jenis surat berhasil dihapus.",
                color: "success",
              });

              queryClient.invalidateQueries({ queryKey: ["jenisSurat"] });
            } catch (error) {
              showToast({
                title: "Gagal",
                description: "Gagal menghapus pengguna.",
                color: "error",
              });
            }
          },
        }}
        onEdit={() => router.push(`/superadmin/jenis-surat/${item.id}/edit`)}
        onView={() => router.push(`/superadmin/jenis-surat/${item.id}`)}
      />
    ),
  }));

  return (
    <ListGrid
      actions={
        <Button
          color="primary"
          onPress={() => router.push("/superadmin/jenis-surat/create")}
        >
          Tambah Jenis Surat
        </Button>
      }
      breadcrumbs={[
        { label: "Dashboard", href: "/superadmin/dashboard" },
        { label: "Jenis Surat" },
      ]}
      columns={columns}
      description="Kelola jenis surat resmi yang tersedia di sistem kelurahan."
      empty={
        <EmptyState
          action={() => router.push("/superadmin/jenis-surat/create")}
          actionLabel="Tambah Jenis Surat"
          description="Tambahkan jenis surat baru untuk digunakan di sistem."
          icon={<DocumentTextIcon className="w-6 h-6" />}
          title="Belum ada jenis surat"
        />
      }
      loading={isLoading}
      rows={rows}
      showPagination
      // sortDirection={sortDirection}
      // sortKey="nama"
      title="Jenis Surat"
      onOptionsClick={() =>
        setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
      }
      onSearch={(val) => console.log("Search:", val)}
    />
  );
}
