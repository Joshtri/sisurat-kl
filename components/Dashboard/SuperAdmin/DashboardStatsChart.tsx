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
  chartData?: ChartDataItem[]; // Optional chartData from API
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

  // Create chart data for users per role
  const userRoleData = Object.entries(usersPerRole).map(([role, count]) => ({
    name: role,
    value: count,
  }));

  // Use chartData from API if available, otherwise create from other data
  const suratTypeData =
    chartData && chartData.length > 0
      ? chartData
      : [{ label: "Belum ada data", value: 0 }];

  // Colors for different sections
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  return (
    <div className="space-y-6">
      {/* General Statistics Bar Chart */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Statistik Umum</h3>
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
            <h3 className="text-lg font-semibold">Distribusi Pengguna</h3>
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
            <h3 className="text-lg font-semibold">Jenis Surat</h3>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={suratTypeData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" allowDecimals={false} />
                <YAxis
                  dataKey="label"
                  type="category"
                  width={120}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip />
                <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
