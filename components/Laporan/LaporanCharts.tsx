"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { useState } from "react";
import { DetailModal } from "./DetailModal";

interface LaporanChartsProps {
  jenisBreakdown: Array<{
    jenis: string;
    kode: string;
    count: number;
  }>;
  statusBreakdown: Array<{
    status: string;
    count: number;
  }>;
  trending: Array<{
    jenis: string;
    kode: string;
    count: number;
  }>;
  trendPerBulan: Array<{
    month: string;
    count: number;
  }>;
  period: string;
  startDate?: string;
  endDate?: string;
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

export function LaporanCharts({
  jenisBreakdown,
  statusBreakdown,
  trending,
  trendPerBulan,
  period,
  startDate,
  endDate,
}: LaporanChartsProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<{
    type: "jenis" | "status" | null;
    value: string;
  }>({ type: null, value: "" });

  const handleClick = (type: "jenis" | "status", value: string) => {
    setSelectedFilter({ type, value });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedFilter({ type: null, value: "" });
  };

  // Calculate total for percentage
  const totalJenis = jenisBreakdown.reduce((sum, item) => sum + item.count, 0);
  const totalStatus = statusBreakdown.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Trending Jenis Surat */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Top 5 Jenis Surat Terpopuler</h3>
        </CardHeader>
        <Divider />
        <CardBody>
          <div className="space-y-4">
            {trending.length > 0 ? (
              trending.map((item, index) => {
                const percentage = totalJenis > 0 ? (item.count / totalJenis) * 100 : 0;
                return (
                  <div
                    key={index}
                    className="cursor-pointer hover:bg-default-100 p-2 rounded-lg transition-colors"
                    onClick={() => handleClick("jenis", item.jenis)}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">
                        {item.jenis} ({item.kode})
                      </span>
                      <span className="text-sm text-default-600">
                        {item.count} ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full bg-default-200 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-default-400 py-4">
                Tidak ada data
              </p>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Status Breakdown */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Distribusi Status Surat</h3>
        </CardHeader>
        <Divider />
        <CardBody>
          <div className="space-y-4">
            {statusBreakdown.length > 0 ? (
              statusBreakdown.map((item, index) => {
                const percentage = totalStatus > 0 ? (item.count / totalStatus) * 100 : 0;
                return (
                  <div
                    key={index}
                    className="cursor-pointer hover:bg-default-100 p-2 rounded-lg transition-colors"
                    onClick={() => handleClick("status", item.status)}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">
                        {statusLabels[item.status] || item.status}
                      </span>
                      <span className="text-sm text-default-600">
                        {item.count} ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full bg-default-200 rounded-full h-2">
                      <div
                        className="bg-success h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-default-400 py-4">
                Tidak ada data
              </p>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Jenis Breakdown */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Semua Jenis Surat</h3>
        </CardHeader>
        <Divider />
        <CardBody>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {jenisBreakdown.length > 0 ? (
              jenisBreakdown.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-2 border-b border-default-200 last:border-0 cursor-pointer hover:bg-default-100 px-2 rounded transition-colors"
                  onClick={() => handleClick("jenis", item.jenis)}
                >
                  <span className="text-sm">
                    {item.jenis} <span className="text-default-400">({item.kode})</span>
                  </span>
                  <span className="text-sm font-semibold">{item.count}</span>
                </div>
              ))
            ) : (
              <p className="text-center text-default-400 py-4">
                Tidak ada data
              </p>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Trend Per Bulan */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Trend Surat per Bulan</h3>
        </CardHeader>
        <Divider />
        <CardBody>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {trendPerBulan.length > 0 ? (
              trendPerBulan.map((item, index) => {
                const maxCount = Math.max(...trendPerBulan.map((t) => t.count));
                const barWidth = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
                return (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">{item.month}</span>
                      <span className="text-sm text-default-600">{item.count}</span>
                    </div>
                    <div className="w-full bg-default-200 rounded-full h-2">
                      <div
                        className="bg-secondary h-2 rounded-full"
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-default-400 py-4">
                Tidak ada data
              </p>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Detail Modal */}
      <DetailModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        filterType={selectedFilter.type}
        filterValue={selectedFilter.value}
        period={period}
        startDate={startDate}
        endDate={endDate}
      />
    </div>
  );
}
