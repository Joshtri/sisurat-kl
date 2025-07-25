"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Button,
  Chip,
  Avatar,
  Pagination,
  Spinner,
} from "@heroui/react";
import {
  HomeIcon,
  UserGroupIcon,
  MagnifyingGlassIcon,
  PhoneIcon,
  IdentificationIcon,
  UserIcon,
  UserCircleIcon,
  UsersIcon,
  BookOpenIcon,
} from "@heroicons/react/24/outline";

import { PageHeader } from "@/components/common/PageHeader";
import { getMe } from "@/services/authService";
import { getKartuKeluargaByRT } from "@/services/kartuKeluargaService";
import { CalculatorIcon, EnvelopeIcon } from "@heroicons/react/24/solid";

export default function KartuKeluargaRTPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const { data: user } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
  });

  const { data: kkData, isLoading } = useQuery({
    queryKey: ["kartu-keluarga-rt", user?.id, currentPage, searchTerm],
    queryFn: () =>
      getKartuKeluargaByRT({
        userId: user?.id ?? "",
        page: currentPage,
        limit: 10,
        search: searchTerm,
      }),
    enabled: !!user?.id,
  });

  const handleSearch = () => {
    setSearchTerm(searchInput);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getGenderIcon = (jenisKelamin: string) => {
    return jenisKelamin === "LAKI_LAKI" ? (
      <UserIcon className="w-4 h-4 inline-block text-gray-500" />
    ) : (
      <UserCircleIcon className="w-4 h-4 inline-block text-pink-500" />
    );
  };

  const getPeranColor = (peran: string) => {
    switch (peran) {
      case "KEPALA_KELUARGA":
        return "primary";
      case "ISTRI":
        return "secondary";
      case "ANAK":
        return "success";
      default:
        return "default";
    }
  };

  return (
    <>
      <PageHeader
        title="Daftar Kartu Keluarga"
        description={`Kelola data kartu keluarga di wilayah RT ${kkData?.rtInfo?.rt || ""}`}
        breadcrumbs={[
          { label: "Dashboard", href: "/rt/dashboard" },
          { label: "Kartu Keluarga" },
        ]}
      />

      <div className="space-y-6">
        {/* Info RT & Search */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <HomeIcon className="w-6 h-6 text-primary" />
                <div>
                  <h2 className="text-lg font-semibold">
                    Wilayah RT {kkData?.rtInfo?.rt}
                  </h2>
                  {kkData?.rtInfo?.rw && (
                    <p className="text-sm text-gray-500">
                      RW {kkData.rtInfo.rw}
                    </p>
                  )}
                </div>
                {kkData?.rtInfo?.namaRT && (
                  <Chip color="primary" variant="flat" size="sm">
                    {kkData.rtInfo.namaRT}
                  </Chip>
                )}
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Input
                  placeholder="Cari nomor KK, alamat, atau nama kepala keluarga..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  startContent={
                    <MagnifyingGlassIcon className="w-4 h-4 text-gray-400" />
                  }
                  className="min-w-[300px]"
                />
                <Button color="primary" onPress={handleSearch}>
                  Cari
                </Button>
              </div>
            </div>
          </CardHeader>

          {kkData?.pagination && (
            <CardBody className="pt-0">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <CalculatorIcon className="w-4 h-4" /> Total:{" "}
                  <strong>{kkData.pagination.totalItems}</strong> Kartu Keluarga
                </span>
                <span className="flex items-center gap-1">
                  <BookOpenIcon className="w-4 h-4" /> Halaman:{" "}
                  <strong>{kkData.pagination.currentPage}</strong> dari{" "}
                  <strong>{kkData.pagination.totalPages}</strong>
                </span>
              </div>
            </CardBody>
          )}
        </Card>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-8">
            <Spinner size="lg" />
            <span className="ml-2">Memuat data kartu keluarga...</span>
          </div>
        )}

        {/* Data List */}
        {!isLoading && kkData?.data && (
          <div className="grid gap-4">
            {kkData.data.length === 0 ? (
              <Card>
                <CardBody className="text-center py-8">
                  <HomeIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-500 mb-2">
                    Tidak ada data kartu keluarga
                  </h3>
                  <p className="text-gray-400">
                    {searchTerm
                      ? `Tidak ditemukan hasil untuk "${searchTerm}"`
                      : "Belum ada kartu keluarga yang terdaftar di RT ini"}
                  </p>
                </CardBody>
              </Card>
            ) : (
              kkData.data.map((kk: any) => (
                <Card key={kk.id} className="hover:shadow-md transition-shadow">
                  <CardBody className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                              <IdentificationIcon className="w-5 h-5 text-primary" />
                              {kk.nomorKK}
                            </h3>
                            <p className="text-gray-600 mt-1">{kk.alamat}</p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                              <span>RT {kk.rt}</span>
                              {kk.rw && <span>RW {kk.rw}</span>}
                            </div>
                          </div>
                          <Chip color="primary" variant="flat">
                            {kk.anggota?.length || 0} Anggota
                          </Chip>
                        </div>

                        {/* Kepala Keluarga */}
                        <div className="bg-blue-50 p-4 rounded-lg mb-4">
                          <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                            <UsersIcon className="w-5 h-5 text-blue-700" />
                            Kepala Keluarga
                          </h4>
                          <div className="flex items-center gap-3">
                            <Avatar
                              name={kk.kepalaKeluarga?.namaLengkap?.charAt(0)}
                              className="bg-blue-100 text-blue-800"
                            />
                            <div>
                              <p className="font-medium">
                                {getGenderIcon(kk.kepalaKeluarga?.jenisKelamin)}{" "}
                                {kk.kepalaKeluarga?.namaLengkap}
                              </p>
                              <p className="text-sm text-gray-600">
                                NIK: {kk.kepalaKeluarga?.nik}
                              </p>
                              {kk.kepalaKeluarga?.pekerjaan && (
                                <p className="text-sm text-gray-600">
                                  {kk.kepalaKeluarga.pekerjaan}
                                </p>
                              )}
                              {kk.kepalaKeluarga?.user?.email && (
                                <p className="text-sm text-blue-600 flex items-center gap-1">
                                  <EnvelopeIcon className="w-4 h-4" />{" "}
                                  {kk.kepalaKeluarga.user.email}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Anggota Keluarga */}
                        {kk.anggota && kk.anggota.length > 1 && (
                          <div>
                            <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                              <UserGroupIcon className="w-4 h-4" />
                              Anggota Keluarga Lainnya
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {kk.anggota
                                .filter(
                                  (anggota: any) =>
                                    anggota.id !== kk.kepalaKeluarga?.id
                                )
                                .map((anggota: any) => (
                                  <div
                                    key={anggota.id}
                                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                                  >
                                    <Avatar
                                      name={anggota.namaLengkap?.charAt(0)}
                                      size="sm"
                                      className="bg-gray-200"
                                    />
                                    <div className="flex-1 min-w-0">
                                      <p className="font-medium text-sm truncate">
                                        {getGenderIcon(anggota.jenisKelamin)}{" "}
                                        {anggota.namaLengkap}
                                      </p>
                                      <div className="flex items-center gap-2">
                                        <Chip
                                          color={getPeranColor(
                                            anggota.peranDalamKK
                                          )}
                                          size="sm"
                                          variant="flat"
                                        >
                                          {anggota.peranDalamKK?.replace(
                                            "_",
                                            " "
                                          )}
                                        </Chip>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Pagination */}
        {!isLoading &&
          kkData?.pagination &&
          kkData.pagination.totalPages > 1 && (
            <div className="flex justify-center">
              <Pagination
                total={kkData.pagination.totalPages}
                page={currentPage}
                onChange={handlePageChange}
                showControls
                showShadow
                color="primary"
              />
            </div>
          )}
      </div>
    </>
  );
}
