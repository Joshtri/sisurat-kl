"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { DocumentIcon } from "@heroicons/react/24/outline";

import { ListGrid } from "@/components/ui/ListGrid";
import { EmptyState } from "@/components/common/EmptyState";
import { TableActions } from "@/components/common/TableActions";
import { getAllSurat, previewSuratPdf } from "@/services/suratService";
import { getMe } from "@/services/authService";
import { formatDateIndo } from "@/utils/common";
import { TableActionsInline } from "@/components/common/TableActionsInline";

export default function RiwayatPage() {
  const router = useRouter();

  const { data = [], isLoading } = useQuery({
    queryKey: ["surat"],
    queryFn: getAllSurat,
  });

  const { data: user } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
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

  const rows = data.map((item) => {
    const showPreview =
      user?.role === "LURAH" ||
      (user?.role === "STAFF" && item.idStaff === user.id) ||
      (user?.role === "RT" && item.idRT === user.id);

    return {
      key: item.id,
      noSurat: item.noSurat || "-",
      jenisSurat: item.jenisSurat,
      pemohon: item.namaLengkap,
      rtrw: `${item.rt || "-"} / ${item.rw || "-"}`,
      status: item.status.replaceAll("_", " "),
      tanggal: formatDateIndo(item.tanggalPengajuan),
      actions: (
        <>
          <div className="flex items-center gap-2">
            {showPreview && (
              <TableActionsInline
                customActions={[
                  {
                    key: "preview",
                    label: "Preview PDF",
                    icon: DocumentIcon,
                    onClick: async () => {
                      try {
                        const blob = await previewSuratPdf(item.id);
                        const url = URL.createObjectURL(blob);

                        window.open(url, "_blank");
                      } catch (error: any) {
                        alert(
                          error.message ||
                            "Terjadi kesalahan saat preview PDF.",
                        );
                      }
                    },
                  },
                ]}
              />
            )}
            <TableActions
              onView={() => router.push(`/lurah/riwayat/${item.id}`)}
            />
          </div>
        </>
      ),
    };
  });

  return (
    <ListGrid
      actions={null}
      breadcrumbs={[
        { label: "Dashboard", href: "/lurah/dashboard" },
        { label: "Riwayat Surat" },
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
