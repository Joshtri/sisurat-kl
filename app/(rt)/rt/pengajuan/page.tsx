"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";

import { PageHeader } from "@/components/common/PageHeader";
import { ListGrid } from "@/components/ui/ListGrid";
import { TableActions } from "@/components/common/TableActions";
import { TableActionsInline } from "@/components/common/TableActionsInline";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { showToast } from "@/utils/toastHelper";
import { getSuratByRT, verifySuratByRT } from "@/services/suratService";
import { formatDateIndo } from "@/utils/common";

export default function DaftarPengajuanPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data = [], isLoading } = useQuery({
    queryKey: ["rt-surat"],
    queryFn: getSuratByRT,
  });

  const { mutateAsync: verifikasiSurat, isPending: isVerifying } = useMutation({
    mutationFn: (id: string) =>
      verifySuratByRT(id, {
        status: "DIVERIFIKASI_RT",
        fileSuratPengantar: "dummy.pdf", // ganti dengan file asli jika perlu
      }),
    onSuccess: () => {
      showToast({
        title: "Berhasil",
        description: "Surat berhasil diverifikasi.",
        color: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["rt-surat"] });
    },
    onError: () => {
      showToast({
        title: "Gagal",
        description: "Gagal memverifikasi surat.",
        color: "error",
      });
    },
  });

  const { mutateAsync: tolakSurat, isPending: isRejecting } = useMutation({
    mutationFn: (payload: { id: string; alasan: string }) =>
      verifySuratByRT(payload.id, {
        status: "DITOLAK_RT",
        catatanPenolakanRT: payload.alasan,
      }),
    onSuccess: () => {
      showToast({
        title: "Ditolak",
        description: "Surat berhasil ditolak.",
        color: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["rt-surat"] });
    },
    onError: () => {
      showToast({
        title: "Gagal",
        description: "Gagal menolak surat.",
        color: "error",
      });
    },
  });

  const columns = [
    { key: "nama", label: "Nama Pemohon" },
    { key: "nik", label: "NIK" },
    { key: "jenis", label: "Jenis Surat" },
    { key: "tanggal", label: "Tanggal Pengajuan" },
    { key: "status", label: "Status" },
    { key: "actions", label: "", align: "end" as const },
  ];

  const rows = data.map((item: any) => {
    const sudahDitangani = !["DIAJUKAN"].includes(item.status);

    return {
      key: item.id,
      nama: item.pemohon?.profil?.namaLengkap || item.pemohon?.username,
      nik: item.pemohon?.profil?.nik || "-",
      jenis: item.jenis?.nama || "-",
      tanggal: formatDateIndo(item.tanggalPengajuan),
      status: item.status.replace(/_/g, " "),
      actions: (
        <div className="flex items-center gap-2">
          <TableActions
            onView={() => router.push(`/rt/pengajuan/${item.id}`)}
          />

          {!sudahDitangani && (
            <TableActionsInline
              customActions={[
                {
                  key: "verifikasi",
                  label: "Verifikasi",
                  icon: CheckCircleIcon,
                  color: "success",
                  onClick: () => {},
                  render: (
                    <ConfirmationDialog
                      confirmLabel="Verifikasi"
                      confirmColor="success"
                      message="Yakin ingin memverifikasi surat ini?"
                      title="Verifikasi Surat"
                      loadingText="Memverifikasi..."
                      onConfirm={async () => {
                        await verifikasiSurat(item.id);
                      }}
                      trigger={
                        <Button
                          size="sm"
                          variant="flat"
                          color="success"
                          isLoading={isVerifying}
                          startContent={<CheckCircleIcon className="w-4 h-4" />}
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
        </div>
      ),
    };
  });

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "RT", href: "/rt" },
          { label: "Pengajuan Surat", href: "/rt/pengajuan" },
          { label: "Daftar Pengajuan" },
        ]}
      />
      <ListGrid
        title="Daftar Pengajuan Surat"
        columns={columns}
        rows={rows}
        onSearch={(query) => {
          // Implement search logic if needed
        }}
        empty="Tidak ada pengajuan surat yang ditemukan."
        loading={isLoading}
        pageSize={10}
        showPagination
        searchPlaceholder="Cari surat..."
      />
    </>
  );
}
