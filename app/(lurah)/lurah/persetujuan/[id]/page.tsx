"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { Button } from "@heroui/button";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { Card } from "@heroui/react";

import { PageHeader } from "@/components/common/PageHeader";
import { formatDateIndo } from "@/utils/common";
import {
  getSuratDetailByLurah,
  verifySuratByLurah,
} from "@/services/suratService";
import { showToast } from "@/utils/toastHelper";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";

export default function DetailPersetujuanPage() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data: surat,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["surat-detail-lurah", id],
    queryFn: () => getSuratDetailByLurah(id as string),
    enabled: !!id,
  });

  const sudahDitangani =
    surat?.status === "DIVERIFIKASI_LURAH" || surat?.status === "DITOLAK_LURAH";

  const { mutateAsync: verifikasiSurat, isPending: isVerifying } = useMutation({
    mutationFn: () =>
      verifySuratByLurah(id as string, { status: "DIVERIFIKASI_LURAH" }),
    onSuccess: () => {
      showToast({
        title: "Berhasil",
        description: "Surat diverifikasi.",
        color: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["surat-detail-lurah", id] });
      router.push("/lurah/persetujuan");
    },
    onError: () =>
      showToast({
        title: "Gagal",
        description: "Verifikasi gagal.",
        color: "error",
      }),
  });

  const { mutateAsync: tolakSurat, isPending: isRejecting } = useMutation({
    mutationFn: (alasan: string) =>
      verifySuratByLurah(id as string, {
        status: "DITOLAK_LURAH",
        catatanPenolakan: alasan,
      }),
    onSuccess: () => {
      showToast({
        title: "Ditolak",
        description: "Surat ditolak.",
        color: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["surat-detail-lurah", id] });
      router.push("/lurah/persetujuan");
    },
    onError: () =>
      showToast({
        title: "Gagal",
        description: "Penolakan gagal.",
        color: "error",
      }),
  });

  if (isLoading) return <p className="p-4">Memuat data surat...</p>;
  if (isError || !surat)
    return <p className="p-4 text-red-500">Gagal memuat data surat.</p>;

  return (
    <>
      <PageHeader
        title="Detail Surat Persetujuan"
        backHref="/lurah/persetujuan"
        breadcrumbs={[
          { label: "Dashboard", href: "/lurah/dashboard" },
          { label: "Persetujuan Surat", href: "/lurah/persetujuan" },
          { label: "Detail Surat" },
        ]}
      />

      <Card className="p-6 space-y-4 text-sm">
        <div>
          <h2 className="text-lg font-semibold mb-2">Informasi Umum</h2>
          <p>
            <strong>Jenis Surat:</strong> {surat.jenis?.nama}
          </p>
          <p>
            <strong>Nama Pemohon:</strong> {surat.namaLengkap}
          </p>
          <p>
            <strong>NIK:</strong> {surat.nik}
          </p>
          <p>
            <strong>Tempat & Tanggal Lahir:</strong> {surat.tempatTanggalLahir}
          </p>
          <p>
            <strong>Jenis Kelamin:</strong> {surat.jenisKelamin}
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
            <strong>RT/RW:</strong> {surat.pemohon?.profil?.rt} /{" "}
            {surat.pemohon?.profil?.rw}
          </p>
          <p>
            <strong>No Telepon:</strong> {surat.noTelepon}
          </p>
          <p>
            <strong>Status:</strong> {surat.status.replaceAll("_", " ")}
          </p>
          <p>
            <strong>Tanggal Pengajuan:</strong>{" "}
            {formatDateIndo(surat.tanggalPengajuan)}
          </p>
        </div>

        {surat.alasanPengajuan && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Alasan Pengajuan</h2>
            <p>{surat.alasanPengajuan}</p>
          </div>
        )}

        {surat.fileSuratPengantar && (
          <div>
            <h2 className="text-lg font-semibold mb-2">File Surat Pengantar</h2>
            <a
              href={`/uploads/${surat.fileSuratPengantar}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              Lihat Surat Pengantar
            </a>
          </div>
        )}

        {!sudahDitangani && (
          <div className="flex gap-4 pt-4">
            <ConfirmationDialog
              confirmLabel="Verifikasi"
              confirmColor="success"
              title="Verifikasi Surat"
              message="Yakin ingin memverifikasi surat ini?"
              loadingText="Memverifikasi..."
              onConfirm={async () => await verifikasiSurat()}
              trigger={
                <Button
                  size="sm"
                  color="success"
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
                  size="sm"
                  color="danger"
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
