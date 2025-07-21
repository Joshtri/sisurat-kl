"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  Skeleton,
} from "@heroui/react";
import {
  UserIcon,
  IdentificationIcon,
  MapPinIcon,
  BriefcaseIcon,
  HeartIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";

import { PageHeader } from "@/components/common/PageHeader";
import { getKartuKeluargaAnggota } from "@/services/kartuKeluargaService";
import { formatDateIndo, getGenderColor, getRoleColor } from "@/utils/common";

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
    statusPerkawinan?: string;
    kartuKeluarga?: {
      id: string;
      alamat: string;
      rt: string;
      rw: string;
      nomorKK: string;
    };
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

  const familyCardInfo = anggota[0]?.kartuKeluarga;
  const kepalaKeluarga = anggota.find(
    (member) => member.peranDalamKK === "KEPALA_KELUARGA",
  );

  if (isLoading) {
    return (
      <>
        <PageHeader
          backHref="/superadmin/kartu-keluarga"
          breadcrumbs={[
            { label: "Dashboard", href: "/superadmin" },
            { label: "Kartu Keluarga", href: "/superadmin/kartu-keluarga" },
            { label: "Anggota Keluarga" },
          ]}
          title="Kartu Keluarga"
        />
        <div className="space-y-4">
          <Skeleton className="h-32 w-full rounded-lg" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-64 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        backHref="/superadmin/kartu-keluarga"
        breadcrumbs={[
          { label: "Dashboard", href: "/superadmin" },
          { label: "Kartu Keluarga", href: "/superadmin/kartu-keluarga" },
          { label: "Anggota Keluarga" },
        ]}
        title="Kartu Keluarga"
      />

      <div className="space-y-6">
        {/* Family Card Header */}
        {familyCardInfo && (
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <HomeIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-blue-900">
                    KARTU KELUARGA
                  </h2>
                  <p className="text-sm text-blue-700">Republik Indonesia</p>
                </div>
              </div>
            </CardHeader>
            <CardBody className="pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <IdentificationIcon className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">
                      No. KK:
                    </span>
                    <span className="text-sm font-bold text-blue-800">
                      {familyCardInfo.nomorKK}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPinIcon className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">
                      Alamat:
                    </span>
                    <span className="text-sm text-blue-800">
                      {familyCardInfo.alamat}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-blue-900">
                        RT:
                      </span>
                      <Chip size="sm" color="primary" variant="flat">
                        {familyCardInfo.rt}
                      </Chip>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-blue-900">
                        RW:
                      </span>
                      <Chip size="sm" color="primary" variant="flat">
                        {familyCardInfo.rw}
                      </Chip>
                    </div>
                  </div>
                  {kepalaKeluarga && (
                    <div className="flex items-center gap-2">
                      <UserIcon className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">
                        Kepala Keluarga:
                      </span>
                      <span className="text-sm font-bold text-blue-800">
                        {kepalaKeluarga.namaLengkap}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </CardBody>
          </Card>
        )}

        {/* Family Members */}
        {anggota.length === 0 ? (
          <Card>
            <CardBody>
              <div className="text-center py-8">
                <UserIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  Belum ada anggota keluarga dalam kartu keluarga ini.
                </p>
              </div>
            </CardBody>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {anggota.map((warga, index) => (
              <Card
                key={warga.id}
                className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-blue-500"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <UserIcon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {warga.namaLengkap}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Chip
                            size="sm"
                            color={getRoleColor(warga.peranDalamKK)}
                            variant="flat"
                          >
                            {warga.peranDalamKK?.replace("_", " ") || "ANGGOTA"}
                          </Chip>
                          <Chip
                            size="sm"
                            color={getGenderColor(warga.jenisKelamin)}
                            variant="flat"
                          >
                            {warga.jenisKelamin === "LAKI_LAKI" ? "L" : "P"}
                          </Chip>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-gray-500">
                        Anggota #{index + 1}
                      </span>
                    </div>
                  </div>
                </CardHeader>

                <Divider />

                <CardBody className="pt-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <IdentificationIcon className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <span className="text-xs text-gray-500 block">NIK</span>
                        <span className="text-sm font-mono font-medium text-gray-900">
                          {warga.nik}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <MapPinIcon className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <span className="text-xs text-gray-500 block">
                          Tempat, Tanggal Lahir
                        </span>
                        <span className="text-sm text-gray-900">
                          {warga.tempatLahir || "-"},{" "}
                          {warga.tanggalLahir
                            ? formatDateIndo(warga.tanggalLahir)
                            : "-"}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2">
                        <BriefcaseIcon className="w-4 h-4 text-gray-500 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <span className="text-xs text-gray-500 block">
                            Pekerjaan
                          </span>
                          <span className="text-sm text-gray-900 truncate block">
                            {warga.pekerjaan || "-"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <HeartIcon className="w-4 h-4 text-gray-500 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <span className="text-xs text-gray-500 block">
                            Agama
                          </span>
                          <span className="text-sm text-gray-900 truncate block">
                            {warga.agama || "-"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-xs text-gray-500 block">
                          Status Hidup
                        </span>
                        <Chip
                          size="sm"
                          color={
                            warga.statusHidup === "HIDUP" ? "success" : "danger"
                          }
                          variant="flat"
                          className="mt-1"
                        >
                          {warga.statusHidup}
                        </Chip>
                      </div>

                      <div>
                        <span className="text-xs text-gray-500 block">
                          Status Perkawinan
                        </span>
                        <Chip
                          size="sm"
                          color="default"
                          variant="flat"
                          className="mt-1"
                        >
                          {warga.statusPerkawinan?.replace("_", " ") || "-"}
                        </Chip>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
