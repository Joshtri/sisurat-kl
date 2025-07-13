"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { DocumentIcon } from "@heroicons/react/24/outline";

import { ListGrid } from "@/components/ui/ListGrid";
import { EmptyState } from "@/components/common/EmptyState";
import { TableActions } from "@/components/common/TableActions";
import { getAllSurat } from "@/services/suratService";
import { formatDateIndo } from "@/utils/common";

export default function SuratPage() {
  const router = useRouter();

  const { data = [], isLoading } = useQuery({
    queryKey: ["surat"],
    queryFn: getAllSurat,
  });

  const columns = [
    { key: "noSurat", label: "No Surat" },
    { key: "jenisSurat", label: "Jenis Surat" },
    { key: "pemohon", label: "Pemohon" },
    { key: "rtrw", label: "RT/RW" },
    { key: "status", label: "Status" },
    { key: "tanggal", label: "Tanggal" },
    { key: "actions", label: "", align: "end" as const },
  ];

  const rows = data.map((item) => ({
    key: item.id,
    noSurat: item.noSurat || "-",
    jenisSurat: item.jenisSurat,
    pemohon: item.namaPemohon,
    rtrw: `${item.rt || "-"} / ${item.rw || "-"}`,
    status: item.status.replaceAll("_", " "),
    tanggal: formatDateIndo(item.tanggalPengajuan),
    actions: (
      <TableActions
        onView={() => router.push(`/superadmin/surat/${item.id}`)}
        onDelete={{
          onConfirm: () => alert(`Hapus surat ${item.noSurat}`),
        }}
      />
    ),
  }));

  return (
    <ListGrid
      actions={null}
      breadcrumbs={[
        { label: "Dashboard", href: "/superadmin/dashboard" },
        { label: "Surat" },
      ]}
      columns={columns}
      description="Daftar semua surat dari warga yang masuk dalam sistem."
      empty={
        <EmptyState
          icon={<DocumentIcon className="w-6 h-6" />}
          title="Belum ada data surat"
          description="Belum ada pengajuan surat yang masuk."
        />
      }
      loading={isLoading}
      pageSize={10}
      rows={rows}
      searchPlaceholder="Cari surat..."
      showPagination={true}
      title="Data Surat"
      onSearch={(query) => console.log("Search:", query)}
    />
  );
}
