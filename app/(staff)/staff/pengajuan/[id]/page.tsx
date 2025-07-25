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
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import {
  CheckCircleIcon,
  XCircleIcon,
  DocumentArrowDownIcon,
} from "@heroicons/react/24/outline";

import { PageHeader } from "@/components/common/PageHeader";
import { ReadOnlyInput } from "@/components/ui/inputs/ReadOnlyInput";
import { formatDateIndo, formatKeyLabel, getFileNameFromBase64Field, isBase64Image } from "@/utils/common";
import { showToast } from "@/utils/toastHelper";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import {
  getSuratDetailByStaff,
  verifySuratByStaff,
} from "@/services/suratService";
import { SkeletonCard } from "@/components/ui/skeleton/SkeletonCard";

export default function DetailPengajuanStaffPage() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [previewFileUrl, setPreviewFileUrl] = useState<string | null>(null);

  const {
    data: surat,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["surat-detail-staff", id],
    queryFn: () => getSuratDetailByStaff(id as string),
    enabled: !!id,
  });

  const sudahDitangani =
    surat?.status === "DIVERIFIKASI_STAFF" || surat?.status === "DITOLAK_STAFF";

  const { mutateAsync: verifikasiSurat, isPending: isVerifying } = useMutation({
    mutationFn: () =>
      verifySuratByStaff(id as string, { status: "DIVERIFIKASI_STAFF" }),
    onSuccess: () => {
      showToast({
        title: "Berhasil",
        description: "Surat diverifikasi.",
        color: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["surat-detail-staff", id] });
      router.push("/staff/pengajuan");
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
      verifySuratByStaff(id as string, {
        status: "DITOLAK_STAFF",
        catatanPenolakan: alasan,
      }),
    onSuccess: () => {
      showToast({
        title: "Ditolak",
        description: "Surat ditolak.",
        color: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["surat-detail-staff", id] });
      router.push("/staff/pengajuan");
    },
    onError: () =>
      showToast({
        title: "Gagal",
        description: "Penolakan gagal.",
        color: "error",
      }),
  });

  // Function to get status chip color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "DIVERIFIKASI_STAFF":
        return "success";
      case "DITOLAK_STAFF":
        return "danger";
      case "MENUNGGU_VERIFIKASI_STAFF":
        return "warning";
      default:
        return "default";
    }
  };

  if (isLoading) return <SkeletonCard rows={5} />;
  if (isError || !surat)
    return <p className="p-4 text-red-500">Gagal memuat data surat.</p>;

  return (
    <>
      <PageHeader
        title="Detail Pengajuan Surat"
        backHref="/staff/pengajuan"
        breadcrumbs={[
          { label: "Dashboard", href: "/staff/dashboard" },
          { label: "Pengajuan Surat", href: "/staff/pengajuan" },
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

        {/* Informasi Umum Pemohon */}
        <Card>
          <CardBody className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Informasi Umum
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ReadOnlyInput
                label="Nama Lengkap"
                value={surat.pemohon.profil.namaLengkap}
              />
              <ReadOnlyInput label="NIK" value={surat.pemohon.profil.nik} />
              <ReadOnlyInput
                label="Tempat, Tanggal Lahir"
                value={
                  surat.pemohon.profil.tempatLahir +
                  ", " +
                  formatDateIndo(surat.pemohon.profil.tanggalLahir)
                }
              />
              <ReadOnlyInput
                label="Jenis Kelamin"
                value={surat.pemohon.profil.jenisKelamin}
              />
              <ReadOnlyInput label="Agama" value={surat.pemohon.profil.agama} />
              <ReadOnlyInput
                label="Pekerjaan"
                value={surat.pemohon.profil.pekerjaan}
              />
              <ReadOnlyInput
                label="No Telepon"
                value={surat.pemohon.numberWhatsApp || "-"}
              />
            </div>

            <ReadOnlyInput
              label="Alamat"
              value={surat.pemohon.profil.kartuKeluarga.alamat}
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
        {/* Data Tambahan Surat */}
        {surat.dataSurat && Object.keys(surat.dataSurat).length > 0 && (
          <Card>
            <CardBody className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Data Tambahan Surat
              </h2>

              <div className="space-y-4">
                {Object.entries(surat.dataSurat).map(([key, value]) => {
                  // Skip jika value kosong atau null
                  if (!value) return null;

                  // PRIORITAS 1: Handle array daftarAnak untuk surat ahli waris
                  if (
                    key === "daftarAnak" &&
                    Array.isArray(value) &&
                    value.length > 0
                  ) {
                    return (
                      <div key={key} className="space-y-2">
                        <label className="block text-lg font-semibold text-gray-800">
                          {formatKeyLabel(key)}
                        </label>
                        <div className="bg-gray-50 p-4 rounded-lg border">
                          <div className="space-y-3">
                            {value.map((anak: any, index: number) => (
                              <div
                                key={index}
                                className="bg-white p-4 rounded-lg border shadow-sm"
                              >
                                <h4 className="font-semibold text-gray-800 mb-3 text-base">
                                  Anak ke-{index + 1}
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  <div className="flex flex-col">
                                    <span className="text-sm font-medium text-gray-600">
                                      Nama Lengkap
                                    </span>
                                    <span className="text-sm text-gray-800">
                                      {anak.namaLengkap || "-"}
                                    </span>
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-sm font-medium text-gray-600">
                                      Jenis Kelamin
                                    </span>
                                    <span className="text-sm text-gray-800">
                                      {anak.jenisKelamin || "-"}
                                    </span>
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-sm font-medium text-gray-600">
                                      Tempat Lahir
                                    </span>
                                    <span className="text-sm text-gray-800">
                                      {anak.tempatLahir || "-"}
                                    </span>
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-sm font-medium text-gray-600">
                                      Tanggal Lahir
                                    </span>
                                    <span className="text-sm text-gray-800">
                                      {anak.tanggalLahir
                                        ? formatDateIndo(anak.tanggalLahir)
                                        : "-"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  }

                  // PRIORITAS 2: Handle file base64 (file), tampilkan sebagai tombol preview
                  if (isBase64Image(value)) {
                    const fileName = getFileNameFromBase64Field(key);
                    return (
                      <div key={key} className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          {formatKeyLabel(fileName)}
                        </label>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="flat"
                            color="primary"
                            onPress={() => setPreviewFileUrl(value as string)}
                          >
                            Lihat File
                          </Button>
                          <span className="text-sm text-gray-500">
                            File tersedia
                          </span>
                        </div>
                      </div>
                    );
                  }

                  // PRIORITAS 3: Skip jika ini adalah field nama file biasa (tanpa base64)
                  if (
                    typeof value === "string" &&
                    Object.keys(surat.dataSurat).includes(`${key}Base64`)
                  ) {
                    return null;
                  }

                  // PRIORITAS 4: Handle array lainnya jika ada
                  if (Array.isArray(value) && value.length > 0) {
                    return (
                      <div key={key} className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          {formatKeyLabel(key)}
                        </label>
                        <div className="bg-gray-50 p-3 rounded border">
                          <ul className="space-y-1">
                            {value.map((item: any, index: number) => (
                              <li key={index} className="text-sm">
                                {typeof item === "object"
                                  ? JSON.stringify(item, null, 2)
                                  : String(item)}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    );
                  }

                  // PRIORITAS 5: Handle object yang bukan array
                  if (typeof value === "object" && !Array.isArray(value)) {
                    return (
                      <div key={key} className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          {formatKeyLabel(key)}
                        </label>
                        <div className="bg-gray-50 p-3 rounded border">
                          <pre className="text-sm whitespace-pre-wrap">
                            {JSON.stringify(value, null, 2)}
                          </pre>
                        </div>
                      </div>
                    );
                  }

                  // PRIORITAS 6: Tampilkan sebagai input read-only untuk data string/number lainnya
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
                  onConfirm={verifikasiSurat}
                  trigger={
                    <Button
                      size="md"
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
