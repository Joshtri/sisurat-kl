"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Card, CardBody, Chip, Image, Link } from "@heroui/react";
import {
  CheckCircleIcon,
  XCircleIcon,
  DocumentArrowDownIcon,
} from "@heroicons/react/24/outline";

import { PageHeader } from "@/components/common/PageHeader";
import { ReadOnlyInput } from "@/components/ui/inputs/ReadOnlyInput";
import { formatDateIndo, formatKeyLabel } from "@/utils/common";
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

        {/* Lampiran Dokumen */}
        {(surat.fileKtp || surat.fileKk) && (
          <Card>
            <CardBody>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Lampiran Dokumen
              </h2>
              <div className="flex flex-col sm:flex-row gap-4">
                {surat.fileKtp && (
                  <Link
                    href={`/uploads/${surat.fileKtp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    showAnchorIcon
                    color="primary"
                    className="flex items-center gap-2"
                  >
                    <DocumentArrowDownIcon className="h-5 w-5" />
                    Lihat KTP
                  </Link>
                )}
                {surat.fileKk && (
                  <Link
                    href={`/uploads/${surat.fileKk}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    showAnchorIcon
                    color="primary"
                    className="flex items-center gap-2"
                  >
                    <DocumentArrowDownIcon className="h-5 w-5" />
                    Lihat KK
                  </Link>
                )}
              </div>
            </CardBody>
          </Card>
        )}

        {/* Data Tambahan */}
        {/* Data Tambahan */}
        {surat.dataSurat && Object.keys(surat.dataSurat).length > 0 && (
          <Card>
            <CardBody>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Data Tambahan
              </h2>

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

              {/* Untuk data tambahan lainnya */}
              {Object.entries(surat.dataSurat)
                .filter(([key]) => key !== "daftarAnak")
                .map(([key, value]) => {
                  const isBase64Image =
                    typeof value === "string" && value.startsWith("data:image");

                  const isBase64PDF =
                    typeof value === "string" &&
                    value.startsWith("data:application/pdf");

                  if (isBase64Image) {
                    return (
                      <div key={key} className="mb-4">
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
                      <div key={key} className="mb-4">
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
                      className="mb-4"
                    />
                  );
                })}
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
      </div>
    </>
  );
}
