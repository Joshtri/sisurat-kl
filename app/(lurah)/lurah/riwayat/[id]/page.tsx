"use client";

import { Button, Card, CardBody, Chip, Image } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

import { PageHeader } from "@/components/common/PageHeader";
import { ReadOnlyInput } from "@/components/ui/inputs/ReadOnlyInput";
import { SkeletonCard } from "@/components/ui/skeleton/SkeletonCard";
import { getSuratHistoryById } from "@/services/suratService";
import { formatDateIndo, formatKeyLabel } from "@/utils/common";

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";
import { useState } from "react";

export default function DetailPengajuanLurahPage() {
  const { id } = useParams();

  const [previewFileUrl, setPreviewFileUrl] = useState<string | null>(null);

  const {
    data: surat,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["surat-rt-detail", id],
    queryFn: () => getSuratHistoryById(id as string),
    enabled: !!id,
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

  //   const sudahDitangani =
  //     surat.status === "DIVERIFIKASI_RT" || surat.status === "DITOLAK_RT";

  return (
    <>
      <PageHeader
        title="Detail Pengajuan Surat"
        backHref="/lurah/riwayat"
        breadcrumbs={[
          { label: "Dashboard", href: "/lurah/dashboard" },
          { label: "Surat riwayat", href: "/lurah/riwayat" },
          { label: "Detail riwayat" },
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
          </CardBody>
        </Card>

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
