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
} from "recharts";

interface DashboardStatsChartProps {
  submittedToday: number;
  published: number;
  usersPerRole: Record<string, number>;
}

export function DashboardStatsChart({
  submittedToday,
  published,
  usersPerRole,
}: DashboardStatsChartProps) {
  const chartData = [
    { name: "Pengajuan Hari Ini", value: submittedToday },
    { name: "Surat Diterbitkan", value: published },
    ...Object.entries(usersPerRole).map(([role, count]) => ({
      name: `User: ${role}`,
      value: count,
    })),
  ];

  return (
    <Card className="mt-6">
      <CardHeader>
        <h3 className="text-lg font-semibold">Statistik Visual</h3>
      </CardHeader>
      <CardBody>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="value" fill="#4f46e5" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  );
}
