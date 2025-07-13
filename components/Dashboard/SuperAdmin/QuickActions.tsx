"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardBody } from "@heroui/react";
import { Button } from "@heroui/button";
import { ServerStackIcon } from "@heroicons/react/24/outline";

import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import {
  getServerStatus,
  getDatabaseStatus,
  checkSystemHealth,
} from "@/services/healthService";
import { showToast } from "@/utils/toastHelper";

export function QuickActions() {
  const { data: serverStatus } = useQuery({
    queryKey: ["health-server"],
    queryFn: getServerStatus,
    refetchInterval: 10000,
  });

  const { data: databaseStatus } = useQuery({
    queryKey: ["health-database"],
    queryFn: getDatabaseStatus,
    refetchInterval: 10000,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["health-check"],
    queryFn: checkSystemHealth,
  });

  const handleCheckHealth = async () => {
    const data = await checkSystemHealth();

    showToast({
      title: "System Health Check",
      description: `✅ Server: ${data.server.status}\n📡 DB: ${data.database.status} (${data.database.latencyMs}ms)`,
      color: "success",
    });
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">Quick Action</h3>
      </CardHeader>
      <CardBody>
        <ConfirmationDialog
          confirmColor="primary"
          confirmLabel="Check Now"
          loadingText="Checking..."
          message="This will perform a real-time check of the server and database status."
          title="System Health Check"
          trigger={
            <Button
              fullWidth
              className="h-20 flex-col"
              color="primary"
              variant="flat"
            >
              <ServerStackIcon className="w-6 h-6 mb-2" />
              Check System Health
            </Button>
          }
          onConfirm={handleCheckHealth}
        />
      </CardBody>
    </Card>
  );
}
