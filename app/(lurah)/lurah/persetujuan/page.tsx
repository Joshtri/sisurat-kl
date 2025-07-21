"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  CheckCircleIcon,
  DocumentIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@heroui/button";

import { ListGrid } from "@/components/ui/ListGrid";
import { EmptyState } from "@/components/common/EmptyState";
import { TableActions } from "@/components/common/TableActions";
import {
  getSuratForLurah,
  previewSuratPengantar,
  verifySuratByLurah,
} from "@/services/suratService";
import { formatDateIndo } from "@/utils/common";
import { TableActionsInline } from "@/components/common/TableActionsInline";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { showToast } from "@/utils/toastHelper";

export default function PersetujuanPage() {
  const router = useRouter();

  const { data = [], isLoading } = useQuery({
    queryKey: ["surat"],
    queryFn: getSuratForLurah,
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
    pemohon: item.namaLengkap,
    rtrw: `${item.rt || "-"} / ${item.rw || "-"}`,
    status: item.status.replaceAll("_", " "),
    tanggal: formatDateIndo(item.tanggalPengajuan),
    actions: (
      <>
        <div className="flex items-center gap-2">
          <TableActions
            onView={() => router.push(`/lurah/persetujuan/${item.id}`)}
            onDelete={{
              onConfirm: () => alert(`Hapus surat ${item.noSurat}`),
            }}
          />

          <TableActionsInline
            customActions={[
              {
                key: "preview",
                label: "Lihat Surat Pengantar RT",
                icon: DocumentIcon,
                color: "primary",

                onClick: async () => {
                  await previewSuratPengantar(item.id);
                },
              },
              {
                key: "verifikasi",
                label: "Verifikasi Surat",
                icon: DocumentIcon,
                color: "success",
                onClick: async () => {},
                render: (
                  <>
                    <ConfirmationDialog
                      title="Verifikasi Surat"
                      message={`Apakah Anda yakin ingin memverifikasi surat ${item.noSurat}?`}
                      onConfirm={async () => {
                        await verifySuratByLurah(item.id as string, {
                          status: "DIVERIFIKASI_LURAH",
                        });
                        showToast({
                          title: "Berhasil",
                          description: "Surat berhasil diverifikasi.",
                          color: "success",
                        });
                        router.refresh();
                      }}
                      trigger={
                        <Button
                          size="sm"
                          variant="flat"
                          color="success"
                          // isLoading={isVerifying}
                          startContent={<CheckCircleIcon className="w-4 h-4" />}
                        >
                          Verifikasi
                        </Button>
                      }
                    />
                  </>
                ),
              },

              {
                key: "tolak",
                label: "Tolak",
                icon: XCircleIcon,
                color: "danger",
                onClick: () => {},
                render: (
                  <ConfirmationDialog
                    confirmLabel="Tolak"
                    confirmColor="danger"
                    title="Tolak Surat"
                    loadingText="Menolak..."
                    message="Masukkan alasan penolakan dalam prompt yang akan muncul."
                    onConfirm={async () => {
                      const alasan = prompt("Masukkan alasan penolakan:");

                      if (alasan) {
                        verifySuratByLurah(item.id as string, {
                          status: "DITOLAK_LURAH",
                          catatanPenolakan: alasan,
                        });
                        showToast({
                          title: "Berhasil",
                          description: "Surat berhasil ditolak.",
                          color: "success",
                        });
                        router.refresh();
                      } else {
                        showToast({
                          title: "Dibatalkan",
                          description: "Alasan penolakan tidak diisi.",
                          color: "warning",
                        });
                      }
                    }}
                    trigger={
                      <Button
                        size="sm"
                        variant="flat"
                        color="danger"
                        // isLoading={isRejecting}
                        startContent={<XCircleIcon className="w-4 h-4" />}
                      >
                        Tolak
                      </Button>
                    }
                  />
                ),
              },
            ]}
          />
        </div>
      </>
    ),
  }));

  return (
    <ListGrid
      actions={null}
      breadcrumbs={[
        { label: "Dashboard", href: "/lurah/dashboard" },
        { label: "Persetujuan Surat" },
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
      title="Data Persetujuan Surat"
      onSearch={(query) => console.log("Search:", query)}
    />
  );
}
