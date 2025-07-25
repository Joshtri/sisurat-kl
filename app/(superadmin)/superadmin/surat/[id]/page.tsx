"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
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
  DocumentArrowDownIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";

import { PageHeader } from "@/components/common/PageHeader";
import { ReadOnlyInput } from "@/components/ui/inputs/ReadOnlyInput";
import { SkeletonCard } from "@/components/ui/skeleton/SkeletonCard";
import {
  formatDateIndo,
  formatKeyLabel,
  getFileNameFromBase64Field,
  isBase64Image,
} from "@/utils/common";
import {
  downloadSuratPdf,
  getSuratHistoryById,
  previewSuratPengantar,
} from "@/services/suratService";

const statusColorMap: Record<
  string,
  "success" | "danger" | "warning" | "default"
> = {
  DIVERIFIKASI_LURAH: "success",
  DITOLAK_LURAH: "danger",
  MENUNGGU_VERIFIKASI_LURAH: "warning",
};

export default function DetailSuratSuperadminPage() {
  const { id } = useParams();

  const { data: surat, isLoading } = useQuery({
    queryKey: ["surat-detail-superadmin", id],
    queryFn: () => getSuratHistoryById(id as string),
    enabled: !!id,
  });

  const profil = surat?.pemohon?.profil;

  const [previewFileUrl, setPreviewFileUrl] = useState<string | null>(null);

  const renderDataSuratTambahan = (dataSurat: any) => {
    return Object.entries(dataSurat).map(([key, value]) => {
      if (Array.isArray(value) && key === "daftarAnak") {
        return (
          <div key={key} className="col-span-full space-y-2">
            <p className="font-semibold">Daftar anak sebagai ahli waris</p>
            {value.map((anak, i) => (
              <div
                key={i}
                className="grid grid-cols-1 md:grid-cols-4 gap-2 pl-2"
              >
                <ReadOnlyInput label="Nama Lengkap" value={anak.namaLengkap} />
                <ReadOnlyInput label="Tempat Lahir" value={anak.tempatLahir} />
                <ReadOnlyInput
                  label="Tanggal Lahir"
                  value={formatDateIndo(String(anak.tanggalLahir))}
                />
                <ReadOnlyInput
                  label="Jenis Kelamin"
                  value={
                    anak.jenisKelamin === "LAKI_LAKI"
                      ? "Laki-laki"
                      : "Perempuan"
                  }
                />
              </div>
            ))}
          </div>
        );
      } else if (typeof value === "string" && value.startsWith("data:")) {
        return (
          <div key={key} className="col-span-full space-y-2">
            <p className="font-semibold capitalize">{formatKeyLabel(key)}</p>
            {value.includes("application/pdf") ? (
              <iframe
                src={value}
                className="w-full h-[500px] rounded-md"
                title={`Preview ${key}`}
              />
            ) : (
              <Image
                src={value}
                alt={`Preview ${key}`}
                className="max-h-96 rounded-md object-contain"
              />
            )}
          </div>
        );
      } else {
        return (
          <ReadOnlyInput
            key={key}
            label={key}
            value={
              typeof value === "object" ? JSON.stringify(value) : String(value)
            }
            className="col-span-full"
          />
        );
      }
    });
  };

  return (
    <>
      <PageHeader
        // title="Detail Surat Permohonan"
        title={`Detail Surat: ${surat?.jenis?.nama || "-"}`}
        backHref="/superadmin/surat"
        breadcrumbs={[
          { label: "Dashboard", href: "/superadmin" },
          { label: "Surat", href: "/superadmin/surat" },
          { label: "Detail Surat" },
        ]}
      />

      {isLoading ? (
        <SkeletonCard rows={8} />
      ) : !surat ? (
        <p className="p-4 text-red-500">Gagal memuat data surat.</p>
      ) : (
        <div className="space-y-6">
          {surat.status === "DIVERIFIKASI_LURAH" && (
            <Button
              onPress={() => downloadSuratPdf(surat.id)}
              variant="flat"
              color="success"
              size="sm"
              startContent={<DocumentArrowDownIcon className="h-4 w-4" />}
            >
              Unduh PDF
            </Button>
          )}

          {/* Tampilkan jika sudah diverifikasi RT */}
          {surat.idRT && (
            <Button
              onPress={() => previewSuratPengantar(surat.id)}
              variant="flat"
              color="warning"
              size="sm"
              startContent={<DocumentTextIcon className="h-4 w-4" />}
            >
              Lihat Surat Pengantar
            </Button>
          )}
          <Card>
            <CardBody className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">
                  Informasi Surat
                </h2>
                <Chip
                  color={statusColorMap[surat.status] ?? "default"}
                  variant="flat"
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

          <Card>
            <CardBody className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Informasi Pemohon
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ReadOnlyInput
                  label="Nama Lengkap"
                  value={profil?.namaLengkap}
                />
                <ReadOnlyInput label="NIK" value={profil?.nik} />
                <ReadOnlyInput
                  label="Tempat Lahir"
                  value={profil?.tempatLahir}
                />
                <ReadOnlyInput
                  label="Tanggal Lahir"
                  value={
                    profil?.tanggalLahir && formatDateIndo(profil.tanggalLahir)
                  }
                />
                <ReadOnlyInput
                  label="Jenis Kelamin"
                  value={
                    profil?.jenisKelamin === "LAKI_LAKI"
                      ? "Laki-laki"
                      : "Perempuan"
                  }
                />
                <ReadOnlyInput label="Agama" value={profil?.agama} />
                <ReadOnlyInput label="Pekerjaan" value={profil?.pekerjaan} />
                <ReadOnlyInput
                  label="RT / RW"
                  value={`${profil?.kartuKeluarga?.rt || "-"} / ${
                    profil?.kartuKeluarga?.rw || "-"
                  }`}
                />
              </div>
              <ReadOnlyInput
                label="Alamat"
                value={profil?.kartuKeluarga?.alamat}
                className="col-span-full"
              />

              <div className="flex flex-wrap gap-2">
                {surat.pemohon.profil.fileKtp && (
                  <Button
                    size="sm"
                    variant="flat"
                    color="secondary"
                    onPress={() =>
                      setPreviewFileUrl(surat.pemohon.profil.fileKtp!)
                    }
                  >
                    Lihat File KTP
                  </Button>
                )}
                {surat.pemohon.profil.fileKk && (
                  <Button
                    size="sm"
                    variant="flat"
                    color="secondary"
                    onPress={() =>
                      setPreviewFileUrl(surat.pemohon.profil.fileKk!)
                    }
                  >
                    Lihat File KK
                  </Button>
                )}
              </div>
            </CardBody>
          </Card>

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

                    // Jika ini adalah field base64 (file), tampilkan sebagai tombol preview
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

                    // Skip jika ini adalah field nama file biasa (tanpa base64)
                    if (
                      typeof value === "string" &&
                      Object.keys(surat.dataSurat).includes(`${key}Base64`)
                    ) {
                      return null;
                    }

                    // Tampilkan sebagai input read-only untuk data lainnya
                    return (
                      <ReadOnlyInput
                        key={key}
                        label={formatKeyLabel(key)}
                        value={
                          typeof value === "object"
                            ? JSON.stringify(value)
                            : String(value)
                        }
                      />
                    );
                  })}
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
      )}
    </>
  );
}
