"use client";

import { toPascalCase } from "@/utils/common";
import { Card, CardBody, CardHeader, Chip } from "@heroui/react";

interface RecentActivity {
  id: string;
  jenis: string;
  nama: string;
  status: string;
  waktu: string;
}

interface RecentActivitiesProps {
  data: RecentActivity[];
}

export function RecentActivities({ data }: RecentActivitiesProps) {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold text-gray-800">
          Aktivitas Terbaru
        </h2>
      </CardHeader>
      <CardBody className="max-h-[300px] overflow-y-auto">
        <ul className="space-y-4">
          {data.length === 0 ? (
            <li className="text-sm text-gray-500">Belum ada aktivitas.</li>
          ) : (
            data.map((activity) => (
              <li
                key={activity.id}
                className="border-b border-gray-100 pb-3 last:border-none last:pb-0"
              >
                <div className="text-sm text-gray-800">
                  <span className="font-semibold">{activity.nama}</span>{" "}
                  Mengajukan{" "}
                  <span className="font-medium text-primary">
                    {activity.jenis}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                  <Chip
                    size="sm"
                    variant="flat"
                    color={getStatusColor(activity.status)}
                  >
                    {toPascalCase(activity.status)}
                  </Chip>
                  <span className="text-xs text-gray-400">
                    • {activity.waktu}
                  </span>
                </div>
              </li>
            ))
          )}
        </ul>
      </CardBody>
    </Card>
  );
}

function getStatusColor(
  status: string,
): "success" | "danger" | "warning" | "primary" {
  if (status.startsWith("DITOLAK")) return "danger";
  if (status === "DIAJUKAN") return "warning";
  if (status.startsWith("DIVERIFIKASI")) return "primary";
  if (status === "DITERBITKAN") return "success";

  return "primary";
}
