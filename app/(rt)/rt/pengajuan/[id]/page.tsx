"use client";

import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@heroui/button";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { Card } from "@heroui/react";
import { getSuratDetailByRT, verifySuratByRT } from "@/services/suratService";
import { formatDateIndo } from "@/utils/common";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { showToast } from "@/utils/toastHelper";

export default function DetailSuratRTPage() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data: surat,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["surat-rt-detail", id],
    queryFn: () => getSuratDetailByRT(id as string),
    enabled: !!id,
  });

  const { mutateAsync: verifikasiSurat, isPending: isVerifying } = useMutation({
    mutationFn: () =>
      verifySuratByRT(id as string, {
        status: "DIVERIFIKASI_RT",
        fileSuratPengantar: "dummy.pdf", // ganti sesuai implementasi
      }),
    onSuccess: () => {
      showToast({
        title: "Berhasil",
        description: "Surat berhasil diverifikasi.",
        color: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["surat-rt-detail", id] });
      queryClient.invalidateQueries({ queryKey: ["rt-surat"] });
      router.push("/rt/surat");
    },
    onError: () =>
      showToast({
        title: "Gagal",
        description: "Terjadi kesalahan saat verifikasi.",
        color: "error",
      }),
  });

  const { mutateAsync: tolakSurat, isPending: isRejecting } = useMutation({
    mutationFn: (alasan: string) =>
      verifySuratByRT(id as string, {
        status: "DITOLAK_RT",
        catatanPenolakanRT: alasan,
      }),
    onSuccess: () => {
      showToast({
        title: "Ditolak",
        description: "Surat berhasil ditolak.",
        color: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["surat-rt-detail", id] });
      queryClient.invalidateQueries({ queryKey: ["rt-surat"] });
      router.push("/rt/surat");
    },
    onError: () =>
      showToast({
        title: "Gagal",
        description: "Terjadi kesalahan saat menolak surat.",
        color: "error",
      }),
  });

  if (isLoading) return <p className="p-4">Memuat detail surat...</p>;
  if (isError || !surat)
    return <p className="p-4 text-red-500">Gagal memuat data.</p>;

  const sudahDitangani =
    surat.status === "DIVERIFIKASI_RT" || surat.status === "DITOLAK_RT";

  return (
    <>
      <PageHeader
        title="Detail Pengajuan Surat"
        backHref="/rt/pengajuan"
        breadcrumbs={[
          { label: "Dashboard", href: "/rt/dashboard" },
          { label: "Surat Pengajuan", href: "/rt/pengajuan" },
          { label: "Detail Pengajuan" },
        ]}
      />

      <Card className="p-6 space-y-4">
        <div className="text-sm space-y-1">
          <p>
            <strong>Jenis Surat:</strong> {surat.jenis?.nama}
          </p>
          <p>
            <strong>Status:</strong> {surat.status.replace(/_/g, " ")}
          </p>
          <p>
            <strong>Nama:</strong> {surat.namaLengkap}
          </p>
          <p>
            <strong>NIK:</strong> {surat.nik}
          </p>
          <p>
            <strong>TTL:</strong> {surat.tempatTanggalLahir}
          </p>
          <p>
            <strong>Agama:</strong> {surat.agama}
          </p>
          <p>
            <strong>Pekerjaan:</strong> {surat.pekerjaan}
          </p>
          <p>
            <strong>Alamat:</strong> {surat.alamat}
          </p>
          <p>
            <strong>Alasan Pengajuan:</strong> {surat.alasanPengajuan}
          </p>
          <p>
            <strong>Tanggal Pengajuan:</strong>{" "}
            {formatDateIndo(surat.tanggalPengajuan)}
          </p>
        </div>

        {!sudahDitangani && (
          <div className="flex gap-4 pt-4">
            <ConfirmationDialog
              confirmLabel="Verifikasi"
              confirmColor="success"
              title="Verifikasi Surat"
              message="Yakin ingin memverifikasi surat ini?"
              loadingText="Memverifikasi..."
              onConfirm={async () => {
                await verifikasiSurat();
              }}
              trigger={
                <Button
                  color="success"
                  size="sm"
                  isLoading={isVerifying}
                  startContent={<CheckCircleIcon className="w-5 h-5" />}
                >
                  Verifikasi
                </Button>
              }
            />

            <ConfirmationDialog
              confirmLabel="Tolak"
              confirmColor="danger"
              title="Tolak Surat"
              message="Masukkan alasan penolakan di prompt yang muncul"
              loadingText="Menolak..."
              onConfirm={async () => {
                const alasan = prompt("Masukkan alasan penolakan:");
                if (alasan) {
                  await tolakSurat(alasan);
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
                  color="danger"
                  size="sm"
                  isLoading={isRejecting}
                  startContent={<XCircleIcon className="w-5 h-5" />}
                >
                  Tolak
                </Button>
              }
            />
          </div>
        )}
      </Card>
    </>
  );
}
