import { Card, CardBody } from "@heroui/react";

interface StatsCardProps {
  title: string;
  value: string | number;
  color: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export function StatsCard({
  title,
  value,
  color,
  icon,
  action,
}: StatsCardProps) {
  return (
    <Card>
      <CardBody className="text-center space-y-2">
        <div className={`text-2xl font-bold text-${color}`}>{value}</div>
        <div className="text-sm text-default-600">{title}</div>
        {action && <div className="flex justify-end">{action}</div>}
      </CardBody>
    </Card>
  );
}
