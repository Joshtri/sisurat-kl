"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  DocumentIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@heroui/button";

import { ListGrid } from "@/components/ui/ListGrid";
import { EmptyState } from "@/components/common/EmptyState";
import { TableActions } from "@/components/common/TableActions";
import { TableActionsInline } from "@/components/common/TableActionsInline";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import {
  getSuratForStaff,
  previewSuratPdf,
  verifySuratByStaff,
} from "@/services/suratService";
import { formatDateIndo } from "@/utils/common";
import { showToast } from "@/utils/toastHelper";

export default function PengajuanSuratPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data = [], isLoading } = useQuery({
    queryKey: ["surat-staff"],
    queryFn: getSuratForStaff,
  });

  const { mutateAsync: verifikasiSurat, isPending: isVerifying } = useMutation({
    mutationFn: ({ id, noSurat }: { id: string; noSurat: string }) =>
      verifySuratByStaff(id, { status: "DIVERIFIKASI_STAFF", noSurat }),
    onSuccess: () => {
      showToast({
        title: "Berhasil",
        description: "Surat diverifikasi.",
        color: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["surat-staff"] });
    },
    onError: () => {
      showToast({
        title: "Gagal",
        description: "Verifikasi gagal.",
        color: "error",
      });
    },
  });

  const { mutateAsync: tolakSurat, isPending: isRejecting } = useMutation({
    mutationFn: ({ id, alasan }: { id: string; alasan: string }) =>
      verifySuratByStaff(id, {
        status: "DITOLAK_STAFF",
        catatanPenolakan: alasan,
      }),
    onSuccess: () => {
      showToast({
        title: "Ditolak",
        description: "Surat ditolak.",
        color: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["surat-staff"] });
    },
    onError: () => {
      showToast({
        title: "Gagal",
        description: "Penolakan gagal.",
        color: "error",
      });
    },
  });

  const columns = [
    { key: "noSurat", label: "No Surat" },
    { key: "jenisSurat", label: "Jenis Surat" },
    { key: "pemohon", label: "Pemohon" },
    { key: "rtrw", label: "RT / RW" },
    { key: "status", label: "Status" },
    { key: "tanggal", label: "Tanggal" },
    { key: "actions", label: "", align: "end" as const },
  ];

  const rows = Array.isArray(data)
    ? data.map((item: any) => {
        const sudahDiproses = ["DIVERIFIKASI_STAFF", "DITOLAK_STAFF"].includes(
          item.status
        );

        return {
          key: item.id,
          noSurat: item.noSurat || "-",
          jenisSurat: item.jenisSurat,
          pemohon: item.namaLengkap,
          rtrw: `${item.rt || "-"} / ${item.rw || "-"}`,
          status: item.status.replace(/_/g, " "),
          tanggal: formatDateIndo(item.tanggalPengajuan),
          actions: (
            <div className="flex items-center gap-2">
              <TableActions
                onView={() => router.push(`/staff/pengajuan/${item.id}`)}
              />
              {!sudahDiproses && (
                <TableActionsInline
                  customActions={[
                    {
                      key: "verifikasi",
                      label: "Verifikasi",
                      icon: CheckCircleIcon,
                      color: "success",
                      render: (
                        <ConfirmationDialog
                          title="Verifikasi Surat"
                          message="Yakin ingin memverifikasi surat ini?"
                          confirmLabel="Verifikasi"
                          confirmColor="success"
                          loadingText="Memverifikasi..."
                          onConfirm={async () => {
                            const noSurat = prompt("Masukkan Nomor Surat:");

                            if (!noSurat) {
                              showToast({
                                title: "Dibatalkan",
                                description: "Nomor surat wajib diisi.",
                                color: "warning",
                              });
                              return;
                            }

                            await verifikasiSurat({ id: item.id, noSurat });
                          }}
                          trigger={
                            <Button
                              size="sm"
                              variant="flat"
                              color="success"
                              isLoading={isVerifying}
                              startContent={
                                <CheckCircleIcon className="w-4 h-4" />
                              }
                            >
                              Verifikasi
                            </Button>
                          }
                        />
                      ),
                    },
                    {
                      key: "tolak",
                      label: "Tolak",
                      icon: XCircleIcon,
                      color: "danger",
                      render: (
                        <ConfirmationDialog
                          title="Tolak Surat"
                          message="Masukkan alasan penolakan:"
                          confirmLabel="Tolak"
                          confirmColor="danger"
                          loadingText="Menolak..."
                          onConfirm={async () => {
                            const alasan = prompt("Masukkan alasan penolakan:");

                            if (alasan) {
                              await tolakSurat({ id: item.id, alasan });
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
                              isLoading={isRejecting}
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
              )}

              <TableActionsInline
                customActions={[
                  {
                    key: "preview",
                    label: "Preview PDF",
                    icon: DocumentIcon,
                    onClick: async () => {
                      try {
                        await previewSuratPdf(item.id);
                      } catch (err: any) {
                        showToast({
                          title: "Gagal Preview",
                          description: err.message,
                          color: "error",
                        });
                      }
                    },
                  },
                ]}
              />
            </div>
          ),
        };
      })
    : [];

  return (
    <ListGrid
      title="Pengajuan Surat"
      breadcrumbs={[
        { label: "Dashboard", href: "/staff/dashboard" },
        { label: "Pengajuan Surat" },
      ]}
      description="Daftar surat yang diajukan oleh warga dan siap diverifikasi oleh staff."
      columns={columns}
      rows={rows}
      loading={isLoading}
      pageSize={10}
      searchPlaceholder="Cari surat..."
      showPagination
      empty={
        <EmptyState
          icon={<DocumentIcon className="w-6 h-6" />}
          title="Belum ada pengajuan"
          description="Tidak ada surat baru untuk diverifikasi."
        />
      }
    />
  );
}
