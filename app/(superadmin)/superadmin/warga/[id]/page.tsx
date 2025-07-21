"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  Alert,
  Button,
  Chip,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { PencilIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { PageHeader } from "@/components/common/PageHeader";
import { ReadOnlyInput } from "@/components/ui/inputs/ReadOnlyInput";
import { CardContainer } from "@/components/common/CardContainer";
import { SkeletonCard } from "@/components/ui/skeleton/SkeletonCard";
import { getWargaById } from "@/services/wargaService";
import { formatDateIndo } from "@/utils/common";
const genderColorMap: Record<string, "primary" | "success" | "danger"> = {
  LAKI_LAKI: "primary",
  PEREMPUAN: "danger",
};

const statusColorMap: Record<string, "success" | "danger"> = {
  HIDUP: "success",
  MENINGGAL: "danger",
};

export default function WargaDetailPage() {
  const { id } = useParams();
  const [previewFileUrl, setPreviewFileUrl] = useState<string | null>(null);

  const { data: warga, isLoading } = useQuery({
    queryKey: ["warga", id],
    queryFn: () => getWargaById(id as string),
    enabled: !!id,
  });

  const router = useRouter();

  const kepalaKeluargaNama =
    warga?.kartuKeluarga?.kepalaKeluargaId === warga?.id
      ? "(Diri Sendiri)"
      : warga?.kartuKeluarga?.anggota?.find(
          (w: any) => w.id === warga.kartuKeluarga.kepalaKeluargaId,
        )?.namaLengkap;

  return (
    <>
      <PageHeader
        backHref="/superadmin/warga"
        breadcrumbs={[
          { label: "Dashboard", href: "/superadmin" },
          { label: "Warga", href: "/superadmin/warga" },
          { label: "Detail Warga" },
        ]}
        title={`Detail Warga: ${warga?.namaLengkap || "-"}`}
        actions={
          <Button
            variant="flat"
            color="primary"
            startContent={<PencilIcon className="w-5 h-5" />}
            onPress={() => router.push(`/superadmin/warga/${id}/edit`)}
            size="md"
          >
            Edit
          </Button>
        }
      />

      <CardContainer isLoading={isLoading} skeleton={<SkeletonCard rows={8} />}>
        {warga && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ReadOnlyInput label="Nama Lengkap" value={warga.namaLengkap} />
            <ReadOnlyInput label="NIK" value={warga.nik} />
            <ReadOnlyInput
              label="Tempat Lahir"
              value={warga.tempatLahir || "-"}
            />
            <ReadOnlyInput
              label="Tanggal Lahir"
              value={
                warga.tanggalLahir
                  ? formatDateIndo(String(warga.tanggalLahir))
                  : "-"
              }
            />
            <ReadOnlyInput
              label="Jenis Kelamin"
              value={
                <Chip
                  color={genderColorMap[warga.jenisKelamin] ?? "primary"}
                  variant="flat"
                  className="w-fit"
                >
                  {warga.jenisKelamin === "LAKI_LAKI"
                    ? "Laki-laki"
                    : "Perempuan"}
                </Chip>
              }
            />
            <ReadOnlyInput label="Pekerjaan" value={warga.pekerjaan || "-"} />
            <ReadOnlyInput label="Agama" value={warga.agama || "-"} />
            <ReadOnlyInput
              label="Peran dalam KK"
              value={warga.peranDalamKK || "-"}
            />
            <ReadOnlyInput
              label="Status Hidup"
              value={
                <Chip
                  color={statusColorMap[warga.statusHidup] ?? "success"}
                  variant="flat"
                  className="w-fit"
                >
                  {warga.statusHidup === "HIDUP" ? "Hidup" : "Meninggal"}
                </Chip>
              }
            />
            <ReadOnlyInput
              label="Alamat"
              value={warga.kartuKeluarga?.alamat || "-"}
            />
            <ReadOnlyInput
              label="RT / RW"
              value={`${warga.kartuKeluarga?.rt || "-"} / ${warga.kartuKeluarga?.rw || "-"}`}
            />
            <ReadOnlyInput
              label="Nomor Kartu Keluarga"
              value={warga.kartuKeluarga?.nomorKK || "-"}
            />
            <ReadOnlyInput
              label="Kepala Keluarga"
              value={
                kepalaKeluargaNama
                  ? kepalaKeluargaNama
                  : warga.kartuKeluarga?.kepalaKeluargaId || "-"
              }
            />
            <ReadOnlyInput
              label="Dibuat pada"
              value={formatDateIndo(String(warga.createdAt), true)}
            />

            <h3>File Dokumen</h3>

            {!warga.fileKtp && (
              <Alert color="warning" variant="flat" className="col-span-2">
                File KTP belum dilengkapi warga.
              </Alert>
            )}

            {!warga.fileKk && (
              <Alert color="warning" variant="flat" className="col-span-2">
                File KK belum dilengkapi warga.
              </Alert>
            )}

            {warga.fileKtp && (
              <Button
                size="sm"
                variant="flat"
                color="secondary"
                onPress={() => setPreviewFileUrl(warga.fileKtp!)}
              >
                Lihat File KTP
              </Button>
            )}
            {warga.fileKk && (
              <Button
                size="sm"
                variant="flat"
                color="secondary"
                onPress={() => setPreviewFileUrl(warga.fileKk!)}
              >
                Lihat File KK
              </Button>
            )}
          </div>
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
      </CardContainer>
    </>
  );
}
