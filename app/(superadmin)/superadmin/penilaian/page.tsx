"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import axios from "axios";

import { PageHeader } from "@/components/common/PageHeader";
import { StarRating } from "@/components/ui/StarRating";

interface PenilaianData {
  id: string;
  rating: number;
  deskripsi?: string;
  createdAt: string;
  surat: {
    id: string;
    noSurat?: string;
    jenis: string;
    status: string;
    tanggalPengajuan?: string;
  };
  pemohon: {
    nama: string;
    nik: string;
  };
}

interface PenilaianResponse {
  data: PenilaianData[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  statistics: {
    totalRating: number;
    averageRating: number;
    distribution: Array<{ rating: number; count: number }>;
  };
}

const statusLabels: Record<string, string> = {
  DIAJUKAN: "Diajukan",
  DIVERIFIKASI_STAFF: "Verifikasi Staff",
  DITOLAK_STAFF: "Ditolak Staff",
  DIVERIFIKASI_RT: "Verifikasi RT",
  DITOLAK_RT: "Ditolak RT",
  DIVERIFIKASI_LURAH: "Verifikasi Lurah",
  DITOLAK_LURAH: "Ditolak Lurah",
  DITERBITKAN: "Diterbitkan",
};

export default function PenilaianPage() {
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading } = useQuery<PenilaianResponse>({
    queryKey: ["penilaian-list", currentPage],
    queryFn: async () => {
      const response = await axios.get(
        `/api/superadmin/penilaian?page=${currentPage}&limit=20`
      );

      return response.data;
    },
  });

  return (
    <>
      <PageHeader
        title="Daftar Penilaian"
        description="Lihat semua penilaian yang diberikan warga terhadap layanan surat"
        breadcrumbs={[
          { label: "Dashboard", href: "/superadmin/dashboard" },
          { label: "Penilaian" },
        ]}
      />

      {/* Statistics Cards */}
      {data?.statistics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardBody>
              <p className="text-sm text-default-600">Total Penilaian</p>
              <p className="text-3xl font-bold text-primary">
                {data.statistics.totalRating}
              </p>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <p className="text-sm text-default-600">Rata-rata Rating</p>
              <div className="flex items-center gap-2 mt-2">
                <StarRating
                  value={data.statistics.averageRating}
                  readonly
                  size="md"
                />
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <p className="text-sm text-default-600 mb-2">Distribusi Rating</p>
              <div className="space-y-1">
                {[5, 4, 3, 2, 1].map((star) => {
                  const dist = data.statistics.distribution.find(
                    (d) => d.rating === star
                  );
                  const count = dist?.count || 0;
                  const percentage =
                    data.statistics.totalRating > 0
                      ? (count / data.statistics.totalRating) * 100
                      : 0;

                  return (
                    <div key={star} className="flex items-center gap-2 text-xs">
                      <span className="w-12">{star} ⭐</span>
                      <div className="flex-1 bg-default-200 rounded-full h-2">
                        <div
                          className="bg-warning h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="w-12 text-right text-default-600">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {/* Penilaian List */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Daftar Penilaian</h3>
        </CardHeader>
        <Divider />
        <CardBody>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Spinner size="lg" />
            </div>
          ) : !data || data.data.length === 0 ? (
            <div className="text-center py-8 text-default-400">
              <p>Belum ada penilaian</p>
            </div>
          ) : (
            <div className="space-y-4">
              {data.data.map((item) => (
                <Card key={item.id} className="shadow-sm">
                  <CardBody>
                    <div className="flex flex-col md:flex-row gap-4">
                      {/* Rating Section */}
                      <div className="md:w-48 flex-shrink-0">
                        <StarRating value={item.rating} readonly size="md" />
                        <p className="text-xs text-default-500 mt-2">
                          {new Date(item.createdAt).toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                      </div>

                      {/* Details Section */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-semibold text-sm">
                              {item.surat.jenis}
                            </p>
                            <p className="text-xs text-default-500">
                              {item.surat.noSurat || "Belum ada nomor"}
                            </p>
                          </div>
                          <Chip size="sm" variant="flat" color="success">
                            {statusLabels[item.surat.status] || item.surat.status}
                          </Chip>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-default-600 mb-3">
                          <div>
                            <span className="font-medium">Pemohon:</span>{" "}
                            {item.pemohon.nama}
                          </div>
                          <div>
                            <span className="font-medium">NIK:</span>{" "}
                            {item.pemohon.nik}
                          </div>
                        </div>

                        {item.deskripsi && (
                          <div className="p-3 bg-default-50 rounded-lg mt-2">
                            <p className="text-xs font-medium text-default-700 mb-1">
                              Komentar:
                            </p>
                            <p className="text-sm text-default-600 italic">
                              "{item.deskripsi}"
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination */}
          {data && data.pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <Button
                size="sm"
                variant="light"
                isDisabled={currentPage === 1}
                onPress={() => setCurrentPage((p) => Math.max(1, p - 1))}
                startContent={<ChevronLeftIcon className="w-4 h-4" />}
              >
                Sebelumnya
              </Button>
              <span className="text-sm text-default-600">
                Halaman {currentPage} dari {data.pagination.totalPages}
              </span>
              <Button
                size="sm"
                variant="light"
                isDisabled={currentPage === data.pagination.totalPages}
                onPress={() =>
                  setCurrentPage((p) =>
                    Math.min(data.pagination.totalPages, p + 1)
                  )
                }
                endContent={<ChevronRightIcon className="w-4 h-4" />}
              >
                Selanjutnya
              </Button>
            </div>
          )}
        </CardBody>
      </Card>
    </>
  );
}
