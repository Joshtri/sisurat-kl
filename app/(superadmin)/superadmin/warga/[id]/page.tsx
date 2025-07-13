"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Chip } from "@heroui/react";

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

  const { data: warga, isLoading } = useQuery({
    queryKey: ["warga", id],
    queryFn: () => getWargaById(id as string),
    enabled: !!id,
  });

  return (
    <>
      <PageHeader
        backHref="/superadmin/warga"
        breadcrumbs={[
          { label: "Dashboard", href: "/superadmin" },
          { label: "Warga", href: "/superadmin/warga" },
          { label: "Detail Warga" },
        ]}
        actions={[]}
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
            <ReadOnlyInput label="No Telepon" value={warga.noTelepon || "-"} />
            <ReadOnlyInput label="RT" value={warga.rt || "-"} />
            <ReadOnlyInput label="RW" value={warga.rw || "-"} />
            <ReadOnlyInput label="Alamat" value={warga.alamat || "-"} />
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
              label="Dibuat pada"
              value={formatDateIndo(String(warga.createdAt), true)}
            />
          </div>
        )}
      </CardContainer>
    </>
  );
}
