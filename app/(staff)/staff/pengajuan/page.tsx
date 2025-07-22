"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  DocumentIcon,
  CheckCircleIcon,
  XCircleIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@heroui/button";

import { ListGrid } from "@/components/ui/ListGrid";
import { EmptyState } from "@/components/common/EmptyState";
import { TableActions } from "@/components/common/TableActions";
import { TableActionsInline } from "@/components/common/TableActionsInline";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import LoadingScreen from "@/components/ui/loading/LoadingScreen";
import {
  getSuratForStaff,
  previewSuratPdf,
  previewSuratPengantar,
  verifySuratByStaff,
} from "@/services/suratService";
import { formatDateIndo } from "@/utils/common";
import { showToast } from "@/utils/toastHelper";

export default function PengajuanSuratPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Loading states untuk berbagai preview actions
  const [loadingStates, setLoadingStates] = useState({
    previewPdf: null, // akan berisi ID surat yang sedang loading
    previewPengantar: null, // akan berisi ID surat yang sedang loading
  });

  const { data = [], isLoading } = useQuery({
    queryKey: ["surat-staff"],
    queryFn: getSuratForStaff,
  });

  // Helper function untuk set loading state
  const setPreviewLoading = (type, suratId = null) => {
    setLoadingStates((prev) => ({
      ...prev,
      [type]: suratId,
    }));
  };

  // Check if any loading is active
  const isAnyLoading = Object.values(loadingStates).some(
    (state) => state !== null
  );

  // Function to handle preview PDF with loading
  const handlePreviewPdf = async (suratId) => {
    try {
      setPreviewLoading("previewPdf", suratId);
      const blob = await previewSuratPdf(suratId);
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, "_blank");
    } catch (err) {
      showToast({
        title: "Gagal Preview",
        description: err.message,
        color: "error",
      });
    } finally {
      setPreviewLoading("previewPdf", null);
    }
  };

  // Function to handle preview surat pengantar with loading
  const handlePreviewPengantar = async (suratId) => {
    try {
      setPreviewLoading("previewPengantar", suratId);
      await previewSuratPengantar(suratId);
    } catch (err) {
      showToast({
        title: "Gagal Preview",
        description: err.message || "Gagal memuat surat pengantar",
        color: "error",
      });
    } finally {
      setPreviewLoading("previewPengantar", null);
    }
  };

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

  // Determine loading message based on active loading state
  const getLoadingMessage = () => {
    if (loadingStates.previewPdf) return "Memuat preview PDF...";
    if (loadingStates.previewPengantar) return "Memuat surat pengantar...";
    return "Memuat...";
  };

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
                              isDisabled={isAnyLoading}
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
                              isDisabled={isAnyLoading}
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
                    color: "primary",
                    onClick: async () => {
                      await handlePreviewPdf(item.id);
                    },
                    render: (
                      <Button
                        size="sm"
                        variant="flat"
                        color="primary"
                        startContent={<DocumentIcon className="w-4 h-4" />}
                        isLoading={loadingStates.previewPdf === item.id}
                        isDisabled={isAnyLoading}
                        onPress={() => handlePreviewPdf(item.id)}
                      >
                        {loadingStates.previewPdf === item.id
                          ? "Loading..."
                          : "Preview PDF"}
                      </Button>
                    ),
                  },
                  {
                    key: "previewPengantar",
                    label: "Preview Pengantar",
                    icon: DocumentTextIcon,
                    onClick: async () => {
                      await handlePreviewPengantar(item.id);
                    },
                    render: (
                      <Button
                        size="sm"
                        variant="flat"
                        color="secondary"
                        startContent={<DocumentTextIcon className="w-4 h-4" />}
                        isLoading={loadingStates.previewPengantar === item.id}
                        isDisabled={isAnyLoading}
                        onPress={() => handlePreviewPengantar(item.id)}
                      >
                        {loadingStates.previewPengantar === item.id
                          ? "Loading..."
                          : "Preview Pengantar"}
                      </Button>
                    ),
                  },
                ]}
              />
            </div>
          ),
        };
      })
    : [];

  return (
    <>
      {/* Loading Screen Overlay dengan dynamic message */}
      {isAnyLoading && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4 animate-pulse">
            <div className="w-40 h-40">
              <LoadingScreen />
            </div>
            <p className="text-white text-sm font-medium">
              {getLoadingMessage()}
            </p>
          </div>
        </div>
      )}

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
        onSearch={(query) => {
          queryClient.setQueryData(["surat-staff"], (oldData: any) => {
            if (!Array.isArray(oldData)) return oldData;

            return oldData.filter((item: any) =>
              item.jenisSurat.toLowerCase().includes(query.toLowerCase())
            );
          });
        }}
        empty={
          <EmptyState
            icon={<DocumentIcon className="w-6 h-6" />}
            title="Belum ada pengajuan"
            description="Tidak ada surat baru untuk diverifikasi."
          />
        }
      />
    </>
  );
}
