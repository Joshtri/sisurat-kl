"use client";

import { Card, CardBody } from "@heroui/card";
import { Progress } from "@heroui/progress";
import { StarIcon } from "@heroicons/react/24/solid";

interface RatingPerRoleData {
  role: "RT" | "STAFF" | "LURAH";
  averageRating: number;
  totalRating: number;
}

interface RatingPerRoleProps {
  data: RatingPerRoleData[];
}

export function RatingPerRole({ data }: RatingPerRoleProps) {
  const getRoleLabel = (role: string) => {
    switch (role) {
      case "RT":
        return "RT";
      case "STAFF":
        return "Staf";
      case "LURAH":
        return "Lurah";
      default:
        return role;
    }
  };

  const getRoleColor = (rating: number) => {
    if (rating >= 4.5) return "success";
    if (rating >= 4.0) return "primary";
    if (rating >= 3.5) return "warning";
    return "danger";
  };

  const getRoleEmoji = (rating: number) => {
    if (rating >= 4.5) return "🌟";
    if (rating >= 4.0) return "😊";
    if (rating >= 3.5) return "😐";
    return "😞";
  };

  const getPerformanceLabel = (rating: number) => {
    if (rating >= 4.5) return "Sangat Baik";
    if (rating >= 4.0) return "Baik";
    if (rating >= 3.5) return "Cukup";
    if (rating >= 3.0) return "Kurang";
    return "Perlu Perbaikan";
  };

  // Sort by average rating descending
  const sortedData = [...data].sort((a, b) => b.averageRating - a.averageRating);

  return (
    <Card>
      <CardBody>
        <div className="flex items-center gap-2 mb-4">
          <StarIcon className="h-6 w-6 text-warning-500" />
          <h3 className="text-lg font-semibold">Performa Layanan per Tahap</h3>
        </div>
        <p className="text-sm text-default-500 mb-6">
          Rata-rata penilaian dari warga untuk setiap tahap proses permohonan surat
        </p>

        {sortedData.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-default-400">Belum ada penilaian</p>
          </div>
        ) : (
          <div className="space-y-6">
            {sortedData.map((item) => (
              <div key={item.role} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getRoleEmoji(item.averageRating)}</span>
                    <div>
                      <h4 className="font-semibold text-default-700">
                        {getRoleLabel(item.role)}
                      </h4>
                      <p className="text-xs text-default-400">
                        {item.totalRating} penilaian
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <StarIcon className="h-5 w-5 text-warning-500" />
                      <span className="text-2xl font-bold text-default-700">
                        {item.averageRating.toFixed(1)}
                      </span>
                      <span className="text-sm text-default-400">/5.0</span>
                    </div>
                    <p
                      className={`text-xs font-medium text-${getRoleColor(item.averageRating)}`}
                    >
                      {getPerformanceLabel(item.averageRating)}
                    </p>
                  </div>
                </div>

                <Progress
                  value={(item.averageRating / 5) * 100}
                  color={getRoleColor(item.averageRating)}
                  size="sm"
                  className="mt-2"
                />
              </div>
            ))}
          </div>
        )}

        {/* Summary */}
        {sortedData.length > 0 && (
          <div className="mt-6 pt-6 border-t border-default-200">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs text-default-500 mb-1">Terbaik</p>
                <p className="font-semibold text-success">
                  {getRoleLabel(sortedData[0].role)}
                </p>
                <p className="text-xs text-default-400">
                  {sortedData[0].averageRating.toFixed(1)} ⭐
                </p>
              </div>
              <div>
                <p className="text-xs text-default-500 mb-1">Rata-rata</p>
                <p className="font-semibold text-primary">
                  {(
                    sortedData.reduce((acc, item) => acc + item.averageRating, 0) /
                    sortedData.length
                  ).toFixed(1)}
                </p>
                <p className="text-xs text-default-400">dari semua tahap</p>
              </div>
              <div>
                <p className="text-xs text-default-500 mb-1">Total Penilaian</p>
                <p className="font-semibold text-default-700">
                  {sortedData.reduce((acc, item) => acc + item.totalRating, 0)}
                </p>
                <p className="text-xs text-default-400">penilaian</p>
              </div>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
