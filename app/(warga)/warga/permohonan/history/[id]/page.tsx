"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  Card,
  CardBody,
  Button,
  Chip,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Divider,
} from "@heroui/react";

import { PageHeader } from "@/components/common/PageHeader";
import { getSuratHistoryById } from "@/services/suratService";
import SuratProgress from "@/components/SuratPermohonan/SuratProgress";
import { ReadOnlyInput } from "@/components/ui/inputs/ReadOnlyInput";
import { formatDateIndo, formatKeyLabel } from "@/utils/common";
import { SkeletonCard } from "@/components/ui/skeleton/SkeletonCard";

export default function DetailSuratPage() {
  const { id } = useParams();
  const [previewFileUrl, setPreviewFileUrl] = useState<string | null>(null);

  const {
    data: surat,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["surat-detail", id],
    queryFn: () => getSuratHistoryById(id as string),
    enabled: !!id,
  });

  // Function to get status chip color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "SELESAI":
        return "success";
      case "DITOLAK_RT":
      case "DITOLAK":
        return "danger";
      case "DIAJUKAN":
      case "MENUNGGU_VERIFIKASI_RT":
        return "warning";
      case "DIVERIFIKASI_RT":
      case "DIVERIFIKASI":
        return "primary";
      default:
        return "default";
    }
  };

  // Function to check if file is base64 image
  const isBase64Image = (value: any): boolean => {
    return (
      typeof value === "string" &&
      (value.startsWith("data:image/") ||
        value.startsWith("data:application/pdf"))
    );
  };

  // Function to get file name from base64 field
  const getFileNameFromBase64Field = (key: string): string => {
    if (key.includes("Base64")) {
      return key.replace("Base64", "");
    }
    return key;
  };

  if (isLoading) return <SkeletonCard rows={10} />;
  if (isError || !surat)
    return <p className="p-4 text-red-500">Gagal memuat surat.</p>;

  const profil = surat.pemohon?.profil;

  return (
    <>
      <PageHeader
        backHref="/warga/permohonan/history"
        title="Detail Surat"
        description="Informasi lengkap permohonan surat Anda."
        breadcrumbs={[
          { label: "Dashboard", href: "/warga/dashboard" },
          { label: "Permohonan Surat", href: "/warga/permohonan/history" },
          { label: "Detail" },
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
                value={formatDateIndo(surat.createdAt)}
              />
              {surat.noSurat && (
                <ReadOnlyInput label="Nomor Surat" value={surat.noSurat} />
              )}
            </div>

            <ReadOnlyInput
              label="Alasan Pengajuan"
              value={surat.alasanPengajuan}
            />

            {/* Progress Status */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Status Permohonan
              </h3>
              <SuratProgress status={surat.status} />
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
                value={formatDateIndo(profil?.tanggalLahir)}
              />
              <ReadOnlyInput
                label="Jenis Kelamin"
                value={profil?.jenisKelamin}
              />
              <ReadOnlyInput label="Agama" value={profil?.agama} />
              <ReadOnlyInput label="Pekerjaan" value={profil?.pekerjaan} />
            </div>

            <ReadOnlyInput
              label="Alamat"
              value={`${profil?.kartuKeluarga?.alamat}, RT ${profil?.kartuKeluarga?.rt} / RW ${profil?.kartuKeluarga?.rw}`}
            />
          </CardBody>
        </Card>

        {/* Data Pendukung Pemohon */}
        <Card>
          <CardBody className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Data Pendukung Pemohon
            </h2>

            <div className="flex flex-wrap gap-2">
              {profil?.fileKtp && (
                <Button
                  size="sm"
                  variant="flat"
                  color="secondary"
                  onPress={() => setPreviewFileUrl(profil.fileKtp!)}
                >
                  Lihat File KTP
                </Button>
              )}
              {profil?.fileKk && (
                <Button
                  size="sm"
                  variant="flat"
                  color="secondary"
                  onPress={() => setPreviewFileUrl(profil.fileKk!)}
                >
                  Lihat File KK
                </Button>
              )}
            </div>
          </CardBody>
        </Card>

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

        {/* Catatan Penolakan */}
        {(surat.catatanPenolakanRT || surat.catatanPenolakan) && (
          <Card>
            <CardBody>
              <h2 className="text-xl font-semibold text-red-600 mb-4">
                Catatan Penolakan
              </h2>
              {surat.catatanPenolakanRT && (
                <ReadOnlyInput
                  label="Catatan dari RT"
                  value={surat.catatanPenolakanRT}
                />
              )}
              {surat.catatanPenolakan && (
                <ReadOnlyInput
                  label="Catatan dari Staff"
                  value={surat.catatanPenolakan}
                />
              )}
            </CardBody>
          </Card>
        )}

        {/* Modal Preview File */}
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
                {previewFileUrl.includes("application/pdf") ? (
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
