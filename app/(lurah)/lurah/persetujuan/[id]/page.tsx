"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Card,
  CardBody,
  Chip,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import {
  CheckCircleIcon,
  DocumentTextIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

import { PageHeader } from "@/components/common/PageHeader";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { ReadOnlyInput } from "@/components/ui/inputs/ReadOnlyInput";
import {
  getSuratDetailByLurah,
  previewSuratPdf,
  previewSuratPengantar,
  verifySuratByLurah,
} from "@/services/suratService";
import { showToast } from "@/utils/toastHelper";
import { formatDateIndo, formatKeyLabel } from "@/utils/common";
import { SkeletonCard } from "@/components/ui/skeleton/SkeletonCard";
import LoadingScreen from "@/components/ui/loading/LoadingScreen";

export default function DetailPersetujuanPage() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  // Loading states for preview buttons
  const [isLoadingSuratPdf, setIsLoadingSuratPdf] = useState(false);
  const [isLoadingSuratPengantar, setIsLoadingSuratPengantar] = useState(false);
  const [previewFileUrl, setPreviewFileUrl] = useState<string | null>(null);
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
        description: "Surat berhasil diverifikasi.",
        color: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["surat-detail-lurah", id] });
      router.push("/lurah/persetujuan");
    },
    onError: () => {
      showToast({
        title: "Gagal",
        description: "Verifikasi surat gagal.",
        color: "error",
      });
    },
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
        description: "Surat berhasil ditolak.",
        color: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["surat-detail-lurah", id] });
      router.push("/lurah/persetujuan");
    },
    onError: () => {
      showToast({
        title: "Gagal",
        description: "Penolakan surat gagal.",
        color: "error",
      });
    },
  });

  // Function to handle preview surat PDF with loading
  const handlePreviewSuratPdf = async () => {
    try {
      setIsLoadingSuratPdf(true);
      await previewSuratPdf(surat.id);
    } catch (error) {
      console.error("Error previewing surat PDF:", error);
      showToast({
        title: "Error",
        description: "Gagal memuat surat PDF",
        color: "error",
      });
    } finally {
      setIsLoadingSuratPdf(false);
    }
  };

  // Function to handle preview surat pengantar with loading
  const handlePreviewSuratPengantar = async () => {
    try {
      setIsLoadingSuratPengantar(true);
      await previewSuratPengantar(surat.id);
    } catch (error) {
      console.error("Error previewing surat pengantar:", error);
      showToast({
        title: "Error",
        description: "Gagal memuat surat pengantar",
        color: "error",
      });
    } finally {
      setIsLoadingSuratPengantar(false);
    }
  };

  // Function to get status chip color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "DIVERIFIKASI_LURAH":
        return "success";
      case "DITOLAK_LURAH":
        return "danger";
      case "MENUNGGU_VERIFIKASI_LURAH":
        return "warning";
      default:
        return "default";
    }
  };

  if (isLoading) return <SkeletonCard rows={10} />;
  if (isError || !surat)
    return <p className="p-4 text-red-500">Gagal memuat data surat.</p>;

  const profil = surat.pemohon?.profil;

  return (
    <>
      {/* Loading Screen Overlays */}
      {isLoadingSuratPdf && <LoadingScreen />}
      {isLoadingSuratPengantar && <LoadingScreen />}

      <PageHeader
        title="Detail Surat Persetujuan"
        backHref="/lurah/persetujuan"
        breadcrumbs={[
          { label: "Dashboard", href: "/lurah/dashboard" },
          { label: "Persetujuan Surat", href: "/lurah/persetujuan" },
          { label: "Detail Surat" },
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
                {surat.status.replaceAll("_", " ")}
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
              <ReadOnlyInput label="Nama Lengkap" value={profil?.namaLengkap} />
              <ReadOnlyInput label="NIK" value={profil?.nik} />
              <ReadOnlyInput label="Tempat Lahir" value={profil?.tempatLahir} />
              <ReadOnlyInput
                label="Tanggal Lahir"
                value={
                  profil?.tanggalLahir && formatDateIndo(profil?.tanggalLahir)
                }
              />
              <ReadOnlyInput
                label="Jenis Kelamin"
                value={profil?.jenisKelamin}
              />
              <ReadOnlyInput label="Agama" value={profil?.agama} />
              <ReadOnlyInput label="Pekerjaan" value={profil?.pekerjaan} />
              <ReadOnlyInput
                label="RT/RW"
                value={`${profil?.kartuKeluarga?.rt} / ${profil?.kartuKeluarga?.rw}`}
              />
            </div>

            <ReadOnlyInput
              label="Alamat"
              value={profil?.kartuKeluarga?.alamat}
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
        {surat.alasanPengajuan && (
          <Card>
            <CardBody>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Alasan Pengajuan
              </h2>
              <ReadOnlyInput value={surat.alasanPengajuan} />
            </CardBody>
          </Card>
        )}

        {/* Data Tambahan */}
        {surat.dataSurat && Object.keys(surat.dataSurat).length > 0 && (
          <Card>
            <CardBody>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Data Tambahan
              </h2>

              {/* Jika ada daftar anak */}
              {surat.dataSurat.daftarAnak && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-700 mb-3">
                    Daftar Anak
                  </h3>
                  <div className="space-y-4">
                    {surat.dataSurat.daftarAnak.map((anak, index) => (
                      <div
                        key={index}
                        className="border rounded-lg p-4 space-y-4"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {Object.entries(anak).map(([key, value]) => {
                            const isBase64Image =
                              typeof value === "string" &&
                              value.startsWith("data:image");

                            if (isBase64Image) {
                              return (
                                <div key={key} className="space-y-2">
                                  <p className="text-sm font-semibold text-gray-600">
                                    {formatKeyLabel(key)}
                                  </p>
                                  <Image
                                    src={value}
                                    alt={formatKeyLabel(key)}
                                    className="max-w-xs rounded border"
                                  />
                                </div>
                              );
                            }

                            return (
                              <ReadOnlyInput
                                key={key}
                                label={formatKeyLabel(key)}
                                value={
                                  key === "tanggalLahir"
                                    ? formatDateIndo(value)
                                    : typeof value === "string"
                                      ? value.replace("_", " ")
                                      : String(value)
                                }
                              />
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Untuk field lain selain daftarAnak */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(surat.dataSurat)
                  .filter(([key]) => key !== "daftarAnak")
                  .map(([key, value]) => {
                    const isBase64Image =
                      typeof value === "string" &&
                      value.startsWith("data:image");
                    const isBase64PDF =
                      typeof value === "string" &&
                      value.startsWith("data:application/pdf");

                    if (isBase64Image) {
                      return (
                        <div key={key}>
                          <p className="text-sm font-semibold text-gray-600 mb-2">
                            {formatKeyLabel(key)}
                          </p>
                          <Image
                            src={value}
                            alt={formatKeyLabel(key)}
                            className="max-w-xs rounded border"
                          />
                        </div>
                      );
                    }

                    if (isBase64PDF) {
                      return (
                        <div key={key}>
                          <p className="text-sm font-semibold text-gray-600 mb-2">
                            {formatKeyLabel(key)}
                          </p>
                          <a
                            href={value}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-blue-600 underline text-sm"
                          >
                            📄 Lihat Dokumen PDF
                          </a>
                        </div>
                      );
                    }

                    return (
                      <ReadOnlyInput
                        key={key}
                        label={formatKeyLabel(key)}
                        value={String(value)}
                      />
                    );
                  })}
              </div>
            </CardBody>
          </Card>
        )}

        {/* Actions */}
        <Card>
          <CardBody>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handlePreviewSuratPdf}
                variant="flat"
                color="primary"
                size="md"
                isLoading={isLoadingSuratPdf}
                disabled={isLoadingSuratPdf || isLoadingSuratPengantar}
                startContent={
                  !isLoadingSuratPdf && <DocumentTextIcon className="h-4 w-4" />
                }
              >
                {isLoadingSuratPdf ? "Memuat..." : "Lihat Surat"}
              </Button>

              {surat.idRT && (
                <Button
                  onClick={handlePreviewSuratPengantar}
                  variant="flat"
                  color="warning"
                  size="md"
                  isLoading={isLoadingSuratPengantar}
                  disabled={isLoadingSuratPdf || isLoadingSuratPengantar}
                  startContent={
                    !isLoadingSuratPengantar && (
                      <DocumentTextIcon className="h-4 w-4" />
                    )
                  }
                >
                  {isLoadingSuratPengantar
                    ? "Memuat..."
                    : "Lihat Surat Pengantar"}
                </Button>
              )}

              {!sudahDitangani && (
                <>
                  <ConfirmationDialog
                    confirmLabel="Verifikasi"
                    confirmColor="success"
                    title="Verifikasi Surat"
                    message="Yakin ingin memverifikasi surat ini?"
                    loadingText="Memverifikasi..."
                    onConfirm={verifikasiSurat}
                    trigger={
                      <Button
                        size="md"
                        color="success"
                        isLoading={isVerifying}
                        disabled={isLoadingSuratPdf || isLoadingSuratPengantar}
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

                      if (alasan) await tolakSurat(alasan);
                      else
                        showToast({
                          title: "Dibatalkan",
                          description: "Alasan penolakan tidak diisi.",
                          color: "warning",
                        });
                    }}
                    trigger={
                      <Button
                        size="md"
                        color="danger"
                        isLoading={isRejecting}
                        disabled={isLoadingSuratPdf || isLoadingSuratPengantar}
                        startContent={<XCircleIcon className="w-5 h-5" />}
                      >
                        Tolak
                      </Button>
                    }
                  />
                </>
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
                      <Button
                        color="primary"
                        onPress={() => setPreviewFileUrl(null)}
                      >
                        Tutup
                      </Button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
              )}
            </div>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
