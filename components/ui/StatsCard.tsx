import { Card, CardBody } from "@heroui/react";
import React from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  color: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  isLoading?: boolean;
}

export function StatsCard({
  title,
  value,
  color,
  icon,
  action,
  isLoading = false,
}: StatsCardProps) {
  return (
    <Card>
      <CardBody className="text-center space-y-2">
        {isLoading ? (
          <>
            <div className="w-1/3 h-6 mx-auto rounded bg-gray-200 animate-pulse" />
            <div className="w-2/3 h-4 mx-auto rounded bg-gray-100 animate-pulse" />
          </>
        ) : (
          <>
            <div className={`text-2xl font-bold text-${color}`}>{value}</div>
            <div className="text-sm text-default-600">{title}</div>
          </>
        )}

        {!isLoading && action && (
          <div className="flex justify-end">{action}</div>
        )}
      </CardBody>
    </Card>
  );
}
