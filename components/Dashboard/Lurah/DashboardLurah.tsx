"use client";

import { Card, CardBody, CardHeader } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { SkeletonText } from "@/components/ui/skeleton/SkeletonText";
import { getLurahDashboardStats } from "@/services/dashboardService";

export default function DashboardLurah() {
  const { data, isLoading } = useQuery({
    queryKey: ["lurah-dashboard"],
    queryFn: getLurahDashboardStats,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Dashboard Lurah</h1>
        <p className="text-default-600">
          Portal lurah untuk persetujuan dan monitoring kelurahan
        </p>
      </div>

      {/* Statistik utama */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-warning">
              {isLoading ? <SkeletonText /> : (data?.menungguPersetujuan ?? 0)}
            </div>
            <div className="text-sm text-default-600">Menunggu Persetujuan</div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-success">
              {isLoading ? <SkeletonText /> : (data?.disetujuiHariIni ?? 0)}
            </div>
            <div className="text-sm text-default-600">Disetujui Hari Ini</div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-primary">
              {isLoading ? <SkeletonText /> : (data?.totalBulanIni ?? 0)}
            </div>
            <div className="text-sm text-default-600">Total Bulan Ini</div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-default-500">
              {isLoading ? <SkeletonText /> : (data?.totalTahunIni ?? 0)}
            </div>
            <div className="text-sm text-default-600">Total Tahun Ini</div>
          </CardBody>
        </Card>
      </div>

      {/* Data Ringkasan dan Surat Menunggu */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Menunggu Persetujuan</h3>
          </CardHeader>
          <CardBody className="space-y-4">
            {isLoading
              ? [1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-16 bg-default-100 rounded-lg animate-pulse"
                  />
                ))
              : data?.suratMenunggu?.map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center p-3 border rounded-lg"
                  >
                    <div>
                      <div className="font-medium">{item.jenis}</div>
                      <div className="text-sm text-default-600">
                        {item.keterangan}
                      </div>
                      <div className="text-xs text-default-500">
                        {item.waktu}
                      </div>
                    </div>
                    <span className="text-warning text-sm">
                      {item.prioritas}
                    </span>
                  </div>
                ))}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Laporan Singkat</h3>
          </CardHeader>
          <CardBody className="space-y-4">
            {isLoading
              ? [1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-10 bg-default-100 rounded-lg animate-pulse"
                  />
                ))
              : Object.entries(data?.laporanSingkat || {}).map(
                  ([label, jumlah]: any, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <span>{label}</span>
                      <div className="text-right">
                        <div className="font-bold">{jumlah}</div>
                        {/* Persentase bisa ditambahkan jika backend menyediakannya */}
                      </div>
                    </div>
                  )
                )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
