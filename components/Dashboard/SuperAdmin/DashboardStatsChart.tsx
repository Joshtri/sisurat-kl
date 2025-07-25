"use client";

import { Card, CardHeader, CardBody } from "@heroui/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

interface ChartDataItem {
  label: string;
  value: number;
}

interface DashboardStatsChartProps {
  submittedToday: number;
  published: number;
  usersPerRole: Record<string, number>;
  chartData?: ChartDataItem[];
}

export function DashboardStatsChart({
  submittedToday,
  published,
  usersPerRole,
  chartData,
}: DashboardStatsChartProps) {
  // Create chart data for bar chart (general stats)
  const generalStatsData = [
    { name: "Pengajuan Hari Ini", value: submittedToday },
    { name: "Surat Diterbitkan", value: published },
  ];

  // Create chart data for users per role with Indonesian labels
  const roleLabels: Record<string, string> = {
    SUPERADMIN: "Super Admin",
    LURAH: "Lurah",
    STAFF: "Staff",
    RT: "RT",
    WARGA: "Warga",
  };

  const userRoleData = Object.entries(usersPerRole).map(([role, count]) => ({
    name: roleLabels[role] || role,
    value: count,
  }));

  // Process chart data for surat types - transform chartData to proper format
  const suratTypeData =
    chartData && chartData.length > 0
      ? chartData
          .map((item) => ({
            name: item.label.replace("Surat Keterangan ", ""), // Shorten labels for better display
            fullName: item.label,
            value: item.value,
          }))
          .filter((item) => item.value > 0) // Only show types with data
      : [];

  // Colors for different sections
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82ca9d",
    "#ffc658",
    "#ff7300",
    "#8dd1e1",
    "#d084d0",
  ];

  // Custom tooltip for surat types
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{data.fullName}</p>
          <p className="text-blue-600">
            Jumlah: <span className="font-bold">{data.value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* General Statistics Bar Chart */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">📊 Statistik Umum</h3>
        </CardHeader>
        <CardBody>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={generalStatsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#4f46e5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Users per Role Pie Chart */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">👥 Distribusi Pengguna</h3>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={userRoleData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value, percent }) =>
                    `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {userRoleData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        {/* Surat Types Bar Chart */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                📋 Jenis Surat Terpopuler
              </h3>
              <span className="text-sm text-gray-500">
                {suratTypeData.length} jenis surat
              </span>
            </div>
          </CardHeader>
          <CardBody>
            {suratTypeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={suratTypeData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 5, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" allowDecimals={false} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={150}
                    tick={{ fontSize: 11 }}
                    interval={0}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]}>
                    {suratTypeData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <div className="text-4xl mb-4">📝</div>
                <h4 className="text-lg font-medium mb-2">Belum Ada Data</h4>
                <p className="text-sm text-center">
                  Belum ada surat yang diajukan.
                  <br />
                  Chart akan muncul setelah ada pengajuan surat.
                </p>
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Summary Stats */}
      {suratTypeData.length > 0 && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">📈 Ringkasan Jenis Surat</h3>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {suratTypeData
                .sort((a, b) => b.value - a.value) // Sort by highest count
                .slice(0, 8) // Show top 8
                .map((item, index) => (
                  <div
                    key={item.name}
                    className="bg-gray-50 p-3 rounded-lg border-l-4"
                    style={{ borderLeftColor: COLORS[index % COLORS.length] }}
                  >
                    <div className="text-sm font-medium text-gray-600 mb-1">
                      {item.name}
                    </div>
                    <div
                      className="text-2xl font-bold"
                      style={{ color: COLORS[index % COLORS.length] }}
                    >
                      {item.value}
                    </div>
                    <div className="text-xs text-gray-500">pengajuan</div>
                  </div>
                ))}
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
