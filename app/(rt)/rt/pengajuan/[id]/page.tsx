"use client";

import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Card, CardBody, Chip, Image, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";

import { PageHeader } from "@/components/common/PageHeader";
import { ReadOnlyInput } from "@/components/ui/inputs/ReadOnlyInput";
import { getSuratDetailByRT, verifySuratByRT } from "@/services/suratService";
import { formatDateIndo, formatKeyLabel } from "@/utils/common";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { showToast } from "@/utils/toastHelper";
import { SkeletonCard } from "@/components/ui/skeleton/SkeletonCard";
import { useState } from "react";

export default function DetailSuratRTPage() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [previewFileUrl, setPreviewFileUrl] = useState<string | null>(null);

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
      router.push("/rt/pengajuan");
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
      router.push("/rt/pengajuan");
    },
    onError: () =>
      showToast({
        title: "Gagal",
        description: "Terjadi kesalahan saat menolak surat.",
        color: "error",
      }),
  });

  // Function to get status chip color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "DIVERIFIKASI_RT":
        return "success";
      case "DITOLAK_RT":
        return "danger";
      case "MENUNGGU_VERIFIKASI_RT":
        return "warning";
      default:
        return "default";
    }
  };

  if (isLoading) return <SkeletonCard rows={10} />;
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

      <div className="space-y-6">
        {/* Informasi Surat */}
        <Card>
          <CardBody className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">
                Informasi Surat
              </h2>
              <Chip
                color={getStatusColor(surat.status)}
                variant="flat"
                size="md"
              >
                {surat.status.replace(/_/g, " ")}
              </Chip>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ReadOnlyInput label="Jenis Surat" value={surat.jenis?.nama} />
              <ReadOnlyInput
                label="Tanggal Pengajuan"
                value={formatDateIndo(surat.tanggalPengajuan)}
              />
            </div>
          </CardBody>
        </Card>

        {/* Informasi Pemohon */}
        <Card>
          <CardBody className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Informasi Pemohon
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ReadOnlyInput
                label="Nama Lengkap"
                value={surat.pemohon?.profil?.namaLengkap}
              />
              <ReadOnlyInput label="NIK" value={surat.pemohon?.profil?.nik} />
              <ReadOnlyInput
                label="Tempat Lahir"
                value={surat.pemohon?.profil?.tempatLahir}
              />
              <ReadOnlyInput
                label="Tanggal Lahir"
                value={formatDateIndo(surat.pemohon?.profil?.tanggalLahir)}
              />
              <ReadOnlyInput
                label="Agama"
                value={surat.pemohon?.profil?.agama}
              />
              <ReadOnlyInput
                label="Pekerjaan"
                value={surat.pemohon?.profil?.pekerjaan}
              />
              <ReadOnlyInput
                label="RT/RW"
                value={`${surat.pemohon?.profil?.kartuKeluarga?.rt}/${surat.pemohon?.profil?.kartuKeluarga?.rw}`}
              />
            </div>

            <ReadOnlyInput
              label="Alamat"
              value={surat.pemohon?.profil?.kartuKeluarga?.alamat}
              className="col-span-full"
            />
          </CardBody>
        </Card>

        <h3 className="text-lg font-semibold text-gray-800">Data Pendukung</h3>

        <div className="flex flex-wrap gap-2">
          {surat.pemohon.profil.fileKtp && (
            <Button
              size="sm"
              variant="flat"
              color="secondary"
              onPress={() => setPreviewFileUrl(surat.pemohon.profil.fileKtp!)}
            >
              Lihat File KTP
            </Button>
          )}
          {surat.pemohon.profil.fileKk && (
            <Button
              size="sm"
              variant="flat"
              color="secondary"
              onPress={() => setPreviewFileUrl(surat.pemohon.profil.fileKk!)}
            >
              Lihat File KK
            </Button>
          )}
        </div>

        {/* Alasan Pengajuan */}
        <Card>
          <CardBody>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Alasan Pengajuan
            </h2>
            <ReadOnlyInput value={surat.alasanPengajuan} />
          </CardBody>
        </Card>

        {/* Detail Tambahan Surat */}
        {Object.entries(surat.dataSurat).map(([key, value]) => {
          const isImageBase64 =
            typeof value === "string" && value.startsWith("data:image/");

          return (
            <div key={key}>
              {isImageBase64 ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {formatKeyLabel(key)}
                  </label>
                  <Image
                    src={value}
                    alt={formatKeyLabel(key)}
                    className="max-w-xs rounded-md border"
                  />
                </div>
              ) : (
                <ReadOnlyInput
                  label={formatKeyLabel(key)}
                  value={String(value)}
                />
              )}
            </div>
          );
        })}
        {/* Actions */}
        {!sudahDitangani && (
          <Card>
            <CardBody>
              <div className="flex flex-col sm:flex-row gap-4">
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
                      size="md"
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
                      size="md"
                      isLoading={isRejecting}
                      startContent={<XCircleIcon className="w-5 h-5" />}
                    >
                      Tolak
                    </Button>
                  }
                />
              </div>
            </CardBody>
          </Card>
        )}

        {previewFileUrl && (
          <Modal
            isOpen={!!previewFileUrl}
            onClose={() => setPreviewFileUrl(null)}
            size="3xl"
            placement="center"
          >
            <ModalContent>
              <ModalHeader>Pratinjau Dokumen</ModalHeader>
              <ModalBody>
                {previewFileUrl.endsWith(".pdf") ? (
                  <iframe
                    title="Preview PDF"
                    src={previewFileUrl}
                    className="w-full h-[80vh] rounded-md"
                  />
                ) : (
                  <Image
                    src={previewFileUrl}
                    alt="Preview Dokumen"
                    className="w-full max-h-[80vh] object-contain rounded-md"
                  />
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={() => setPreviewFileUrl(null)}>
                  Tutup
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        )}
      </div>
    </>
  );
}
