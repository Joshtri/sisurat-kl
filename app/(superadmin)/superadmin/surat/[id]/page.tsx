"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Button, Card, CardBody, Chip } from "@heroui/react";

import { PageHeader } from "@/components/common/PageHeader";
import { ReadOnlyInput } from "@/components/ui/inputs/ReadOnlyInput";
import { SkeletonCard } from "@/components/ui/skeleton/SkeletonCard";
import { formatDateIndo } from "@/utils/common";
import {
  downloadSuratPdf,
  getSuratHistoryById,
  previewSuratPengantar,
} from "@/services/suratService";
import {
  DocumentArrowDownIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

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

          {surat.dataSurat && Object.keys(surat.dataSurat).length > 0 && (
            <Card>
              <CardBody>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Data Tambahan
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderDataSuratTambahan(surat.dataSurat)}
                </div>
              </CardBody>
            </Card>
          )}
        </div>
      )}
    </>
  );
}
