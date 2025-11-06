"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardBody } from "@heroui/card";

import { PeriodFilter } from "@/components/Laporan/PeriodFilter";
import { LaporanStats } from "@/components/Laporan/LaporanStats";
import { LaporanCharts } from "@/components/Laporan/LaporanCharts";
import { RecentSuratTable } from "@/components/Laporan/RecentSuratTable";
import { RatingPerRole } from "@/components/Laporan/RatingPerRole";
import { DetailModal } from "@/components/Laporan/DetailModal";
import { exportLaporan, getLaporanData } from "@/services/laporanService";
import { SkeletonCard } from "@/components/ui/skeleton/SkeletonCard";

export default function LaporanPage() {
  const [period, setPeriod] = useState("month");
  const [startDate, setStartDate] = useState<string>();
  const [endDate, setEndDate] = useState<string>();
  const [isExporting, setIsExporting] = useState(false);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    filterType: "jenis" | "status" | "all" | null;
    filterValue: string;
  }>({
    isOpen: false,
    filterType: null,
    filterValue: "",
  });

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["laporan", period, startDate, endDate],
    queryFn: () => getLaporanData(period, startDate, endDate),
  });

  const handlePeriodChange = (
    newPeriod: string,
    newStartDate?: string,
    newEndDate?: string,
  ) => {
    setPeriod(newPeriod);
    setStartDate(newStartDate);
    setEndDate(newEndDate);
    refetch();
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportLaporan(period, startDate, endDate);
    } catch (error) {
      console.error("Export error:", error);
      alert("Gagal export laporan. Silakan coba lagi.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleCardClick = (
    filterType: "all" | "status",
    filterValue: string,
  ) => {
    setModalState({
      isOpen: true,
      filterType,
      filterValue,
    });
  };

  const handleCloseModal = () => {
    setModalState({
      isOpen: false,
      filterType: null,
      filterValue: "",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Laporan & Statistik</h1>
        <p className="text-default-600">
          Lihat laporan dan statistik pengajuan surat secara komprehensif
        </p>+
      </div>

      {/* Filter */}
      <PeriodFilter
        onPeriodChange={handlePeriodChange}
        onExport={handleExport}
        isLoading={isExporting}
      />

      {/* Info Periode */}
      {data && (
        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-default-600">Periode Laporan</p>
                <p className="font-semibold">
                  {new Date(data.dateRange.start).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}{" "}
                  -{" "}
                  {new Date(data.dateRange.end).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-default-600">Total Data</p>
                <p className="text-2xl font-bold text-primary">
                  {data.summary.totalSurat}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Stats Cards */}
      {isLoading ? (
        <SkeletonCard rows={1} />
      ) : data ? (
        <LaporanStats
          summary={data.summary}
          ratingStats={data.ratingStats}
          onCardClick={handleCardClick}
        />
      ) : null}

      {/* Rating Per Role */}
      {isLoading ? (
        <SkeletonCard rows={1} />
      ) : data && data.ratingPerRole && data.ratingPerRole.length > 0 ? (
        <RatingPerRole data={data.ratingPerRole} />
      ) : null}

      {/* Charts */}
      {isLoading ? (
        <SkeletonCard rows={2} />
      ) : data ? (
        <LaporanCharts
          jenisBreakdown={data.jenisBreakdown}
          statusBreakdown={data.statusBreakdown}
          trending={data.trending}
          trendPerBulan={data.trendPerBulan}
          period={period}
          startDate={startDate}
          endDate={endDate}
        />
      ) : null}

      {/* Recent Surat Table */}
      {isLoading ? (
        <SkeletonCard rows={1} />
      ) : data ? (
        <RecentSuratTable data={data.recentSurat} />
      ) : null}

      {/* RT Breakdown */}
      {!isLoading && data && data.rtBreakdown.length > 0 && (
        <Card>
          <CardBody>
            <h3 className="text-lg font-semibold mb-4">Top 10 RT Aktif</h3>
            <div className="space-y-3">
              {data.rtBreakdown.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-2 border-b border-default-200 last:border-0"
                >
                  <div>
                    <span className="font-medium">{item.rt}</span>
                    <span className="text-default-400 ml-2">
                      (RT {item.rtNumber})
                    </span>
                  </div>
                  <span className="text-sm font-semibold bg-primary/10 text-primary px-3 py-1 rounded-full">
                    {item.count} surat
                  </span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Detail Modal */}
      <DetailModal
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        filterType={modalState.filterType}
        filterValue={modalState.filterValue}
        period={period}
        startDate={startDate}
        endDate={endDate}
      />
    </div>
  );
}
