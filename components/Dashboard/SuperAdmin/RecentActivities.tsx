"use client";

import { Card, CardHeader, CardBody } from "@heroui/react";
import { Button } from "@heroui/button";
import {
  TrashIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ServerStackIcon,
} from "@heroicons/react/24/outline";

import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";

export function RecentActivities() {
  const activities = [
    {
      icon: <UserGroupIcon className="w-4 h-4 text-blue-500" />,
      title: "New user registered",
      time: "5 minutes ago",
    },
    {
      icon: <DocumentTextIcon className="w-4 h-4 text-green-500" />,
      title: "System backup completed",
      time: "2 hours ago",
    },
    {
      icon: <ServerStackIcon className="w-4 h-4 text-orange-500" />,
      title: "Database maintenance",
      time: "1 day ago",
    },
  ];

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Recent Activities</h3>
        <ConfirmationDialog
          confirmColor="danger"
          confirmLabel="DELETE ALL LOGS"
          icon={<TrashIcon className="w-6 h-6 text-danger" />}
          loadingText="Deleting logs..."
          message="This will permanently delete ALL system logs and activity history. This action is IRREVERSIBLE and may affect system debugging capabilities. Are you absolutely sure?"
          title="⚠️ Dangerous Action"
          trigger={
            <Button
              color="danger"
              size="sm"
              startContent={<TrashIcon className="w-4 h-4" />}
              variant="flat"
            >
              Clear Logs
            </Button>
          }
          onConfirm={async () => {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            console.log("All logs deleted successfully");
          }}
        />
      </CardHeader>
      <CardBody className="space-y-3">
        {activities.map((activity, index) => (
          <div key={index} className="flex justify-between items-center">
            <div>
              <div className="font-medium flex items-center gap-2">
                {activity.icon}
                {activity.title}
              </div>
              <div className="text-sm text-default-600">{activity.time}</div>
            </div>
          </div>
        ))}
      </CardBody>
    </Card>
  );
}
