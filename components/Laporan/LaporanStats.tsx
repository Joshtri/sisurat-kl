"use client";

import { Card, CardBody } from "@heroui/card";
import {
  CheckCircleIcon,
  ClockIcon,
  DocumentTextIcon,
  XCircleIcon,
  StarIcon,
} from "@heroicons/react/24/outline";

import { StarRating } from "@/components/ui/StarRating";

interface LaporanStatsProps {
  summary: {
    totalSurat: number;
    diterbitkan: number;
    ditolak: number;
    menunggu: number;
  };
  ratingStats?: {
    totalRating: number;
    averageRating: number;
  };
  onCardClick?: (filterType: "all" | "status", filterValue: string) => void;
}

export function LaporanStats({ summary, ratingStats, onCardClick }: LaporanStatsProps) {
  const stats = [
    {
      title: "Total Surat",
      value: summary.totalSurat,
      icon: DocumentTextIcon,
      color: "text-primary",
      bgColor: "bg-primary/10",
      filterType: "all" as const,
      filterValue: "all",
    },
    {
      title: "Diterbitkan",
      value: summary.diterbitkan,
      icon: CheckCircleIcon,
      color: "text-success",
      bgColor: "bg-success/10",
      filterType: "status" as const,
      filterValue: "DITERBITKAN",
    },
    {
      title: "Menunggu",
      value: summary.menunggu,
      icon: ClockIcon,
      color: "text-warning",
      bgColor: "bg-warning/10",
      filterType: "status" as const,
      filterValue: "MENUNGGU",
    },
    {
      title: "Ditolak",
      value: summary.ditolak,
      icon: XCircleIcon,
      color: "text-danger",
      bgColor: "bg-danger/10",
      filterType: "status" as const,
      filterValue: "DITOLAK",
    },
  ];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <Card
              key={index}
              isPressable
              onPress={() => onCardClick?.(stat.filterType, stat.filterValue)}
              className="cursor-pointer hover:scale-[1.02] transition-transform"
            >
              <CardBody>
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-default-600">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      {/* Rating Statistics Card */}
      {ratingStats && ratingStats.totalRating > 0 && (
        <Card className="mt-4">
          <CardBody>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-warning/10">
                <StarIcon className="w-6 h-6 text-warning" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-default-600 mb-1">Kepuasan Layanan</p>
                <div className="flex items-center gap-3">
                  <StarRating value={ratingStats.averageRating} readonly size="sm" />
                  <span className="text-xs text-default-500">
                    ({ratingStats.totalRating} penilaian)
                  </span>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      )}
    </>
  );
}
