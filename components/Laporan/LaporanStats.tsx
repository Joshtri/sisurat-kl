"use client";

import { Card, CardBody } from "@heroui/card";
import {
  CheckCircleIcon,
  ClockIcon,
  DocumentTextIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

interface LaporanStatsProps {
  summary: {
    totalSurat: number;
    diterbitkan: number;
    ditolak: number;
    menunggu: number;
  };
}

export function LaporanStats({ summary }: LaporanStatsProps) {
  const stats = [
    {
      title: "Total Surat",
      value: summary.totalSurat,
      icon: DocumentTextIcon,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Diterbitkan",
      value: summary.diterbitkan,
      icon: CheckCircleIcon,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Menunggu",
      value: summary.menunggu,
      icon: ClockIcon,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      title: "Ditolak",
      value: summary.ditolak,
      icon: XCircleIcon,
      color: "text-danger",
      bgColor: "bg-danger/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
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
  );
}
