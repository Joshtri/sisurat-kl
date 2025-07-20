"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  DocumentArrowDownIcon,
  DocumentIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

import { ListGrid } from "@/components/ui/ListGrid";
import { EmptyState } from "@/components/common/EmptyState";
import { TableActions } from "@/components/common/TableActions";
import {
  downloadSuratPdf,
  getAllSurat,
  previewSuratPdf,
  previewSuratPengantar,
} from "@/services/suratService";
import { formatDateIndo } from "@/utils/common";
import { TableActionsInline } from "@/components/common/TableActionsInline";
import { showToast } from "@/utils/toastHelper";

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
    jenisSurat: item.jenisSurat || "-",
    pemohon: item.namaLengkap || "-",
    // rtrw: `${item.pemohon?.profil?.kartuKeluarga?.rt || "-"} / ${
    //   item.pemohon?.profil?.kartuKeluarga?.rw || "-"
    // }`,
    rtrw: `${item.rt || "-"} / ${item.rw || "-"}`,
    status: item.status.replaceAll("_", " "),
    tanggal: formatDateIndo(item.tanggalPengajuan),
    actions: (
      <div className="flex items-center gap-2">
        <TableActions
          onView={() => router.push(`/superadmin/surat/${item.id}`)}
          onDelete={{
            onConfirm: () => alert(`Hapus surat ${item.noSurat}`),
          }}
        />

        <TableActionsInline
          customActions={[
            {
              key: "preview",
              label: "Preview PDF",
              icon: DocumentIcon,
              color: "primary",
              onClick: async () => {
                try {
                  const blob = await previewSuratPdf(item.id);
                  const blobUrl = URL.createObjectURL(blob);
                  window.open(blobUrl, "_blank");
                } catch (err: any) {
                  showToast({
                    title: "Gagal Preview",
                    description: err.message,
                    color: "error",
                  });
                }
              },
            },
            {
              key: "previewPengantar",
              label: "Preview Pengantar",
              icon: DocumentTextIcon,
              onClick: async () => {
                await previewSuratPengantar(item.id);
              },
            },
          ]}
        />
      </div>
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
