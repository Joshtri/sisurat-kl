"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { PageHeader } from "@/components/common/PageHeader";
import { CardContainer } from "@/components/common/CardContainer";
import { SkeletonCard } from "@/components/ui/skeleton/SkeletonCard";
import { getKartuKeluargaAnggota } from "@/services/kartuKeluargaService";
import { formatDateIndo } from "@/utils/common";

export default function KartuKeluargaAnggotaPage() {
  const { id } = useParams();

  type Warga = {
    id: string;
    namaLengkap: string;
    nik: string;
    tempatLahir?: string;
    tanggalLahir?: string;
    jenisKelamin?: string;
    pekerjaan?: string;
    agama?: string;
    statusHidup?: string;
    peranDalamKK?: string;
  };

  const {
    data: anggotaRaw,
    isLoading,
    isError,
  } = useQuery<Warga[] | Warga>({
    queryKey: ["kartuKeluargaAnggota", id],
    queryFn: () => getKartuKeluargaAnggota(id as string),
    enabled: !!id,
  });

  const anggota: Warga[] = Array.isArray(anggotaRaw)
    ? (anggotaRaw as Warga[])
    : anggotaRaw
      ? [anggotaRaw as Warga]
      : [];

  return (
    <>
      <PageHeader
        backHref="/superadmin/kartu-keluarga"
        breadcrumbs={[
          { label: "Dashboard", href: "/superadmin" },
          { label: "Kartu Keluarga", href: "/superadmin/kartu-keluarga" },
          { label: "Anggota Keluarga" },
        ]}
        title="Anggota Keluarga"
      />

      <CardContainer isLoading={isLoading} skeleton={<SkeletonCard rows={6} />}>
        {anggota.length === 0 ? (
          <p className="text-sm text-gray-500">
            Belum ada anggota keluarga dalam kartu keluarga ini.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {anggota.map((warga) => (
              <div
                key={warga.id}
                className="border rounded-md p-4 bg-gray-50 space-y-1"
              >
                <p className="font-semibold">{warga.namaLengkap}</p>
                <p className="text-sm text-gray-600">NIK: {warga.nik}</p>
                <p className="text-sm text-gray-600">
                  Lahir: {warga.tempatLahir ?? "-"},{" "}
                  {warga.tanggalLahir
                    ? formatDateIndo(warga.tanggalLahir)
                    : "-"}
                </p>
                <p className="text-sm text-gray-600">
                  Jenis Kelamin: {warga.jenisKelamin}
                </p>
                <p className="text-sm text-gray-600">
                  Pekerjaan: {warga.pekerjaan || "-"}
                </p>
                <p className="text-sm text-gray-600">
                  Agama: {warga.agama || "-"}
                </p>
                <p className="text-sm text-gray-600">
                  Status: {warga.statusHidup}
                </p>
                <p className="text-sm text-gray-600">
                  Peran: {warga.peranDalamKK || "Anggota"}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContainer>
    </>
  );
}
