"use client";

import {
  CheckCircleIcon,
  DocumentIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@heroui/button";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { EmptyState } from "@/components/common/EmptyState";
import { TableActions } from "@/components/common/TableActions";
import { TableActionsInline } from "@/components/common/TableActionsInline";
import { ListGrid } from "@/components/ui/ListGrid";
import LoadingScreen from "@/components/ui/loading/LoadingScreen";
import {
  getSuratForLurah,
  previewSuratPdf,
  previewSuratPengantar,
  verifySuratByLurah,
} from "@/services/suratService";
import { formatDateIndo } from "@/utils/common";
import { showToast } from "@/utils/toastHelper";



export default function PersetujuanPage() {
  const router = useRouter();
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);

  const { data = [], isLoading } = useQuery({
    queryKey: ["surat"],
    queryFn: getSuratForLurah,
  });

  // Function to handle preview with loading
  const handlePreview = async (suratId, type = "surat") => {
    try {
      setIsLoadingPreview(true);
      await previewSuratPengantar(suratId);
    } catch (error) {
      console.error("Error previewing surat:", error);
      showToast({
        title: "Error",
        description: "Gagal memuat preview surat",
        color: "error",
      });
    } finally {
      setIsLoadingPreview(false);
    }
  };

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
                key: "view",
                label: "Preview Surat",
                icon: DocumentIcon,
                color: "primary",
                onClick: async () => {
                  await previewSuratPdf(item.id);
                },
              },
              {
                key: "preview",
                label: "Lihat Surat Pengantar RT",
                icon: DocumentIcon,
                color: "primary",
                onClick: async () => {
                  await handlePreview(item.id, "pengantar");
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
                        try {
                          await verifySuratByLurah(item.id as string, {
                            status: "DIVERIFIKASI_LURAH",
                          });
                          showToast({
                            title: "Berhasil",
                            description: "Surat berhasil diverifikasi.",
                            color: "success",
                          });
                          router.refresh();
                        } catch (error) {
                          showToast({
                            title: "Error",
                            description: "Gagal memverifikasi surat",
                            color: "error",
                          });
                        }
                      }}
                      trigger={
                        <Button
                          size="sm"
                          variant="flat"
                          color="success"
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
                        try {
                          await verifySuratByLurah(item.id as string, {
                            status: "DITOLAK_LURAH",
                            catatanPenolakan: alasan,
                          });
                          showToast({
                            title: "Berhasil",
                            description: "Surat berhasil ditolak.",
                            color: "success",
                          });
                          router.refresh();
                        } catch (error) {
                          showToast({
                            title: "Error",
                            description: "Gagal menolak surat",
                            color: "error",
                          });
                        }
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
    <>
      {/* Loading Screen Overlay */}
      {isLoadingPreview && <LoadingScreen />}

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
    </>
  );
}
