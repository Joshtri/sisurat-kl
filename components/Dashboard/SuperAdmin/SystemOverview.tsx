"use client";

import {
  ArrowPathIcon,
  DocumentTextIcon,
  ServerStackIcon,
  ShieldExclamationIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { Tooltip } from "@heroui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { useIsMobile } from "@/hooks/useIsMobile";
import { checkSystemHealth } from "@/services/healthService";
import { showToast } from "@/utils/toastHelper";
import {
  getMaintenanceStatus,
  setMaintenanceStatus,
} from "@/services/maintenanceService";

interface SystemOverviewProps {
  serverStatus: string | React.ReactNode;
  databaseStatus: string | React.ReactNode;
  backupStatus: string | React.ReactNode;
  diskStatus: string | React.ReactNode;
}

export function SystemOverview({
  serverStatus,
  databaseStatus,
  backupStatus,
  diskStatus,
}: SystemOverviewProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["health-check"],
    queryFn: checkSystemHealth,
  });

  const isMobile = useIsMobile();

  const handleCheckHealth = async () => {
    const data = await checkSystemHealth();

    showToast({
      title: "System Health Check",
      description: `✅ Server: ${data.server.status}\n📡 DB: ${data.database.status} (${data.database.latencyMs}ms)`,
      color: "success",
    });
  };

  const { data: isMaintenance } = useQuery({
    queryKey: ["maintenance"],
    queryFn: getMaintenanceStatus,
  });

  // Toggle status
  const queryClient = useQueryClient();
  const { mutate: toggleMaintenance, isPending: isToggling } = useMutation({
    mutationFn: (status: boolean) => setMaintenanceStatus(status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenance"] });
      showToast({
        title: "Status Updated",
        description: "Maintenance status has been changed successfully.",
        color: "success",
      });
    },
    onError: () => {
      showToast({
        title: "Error",
        description: "Failed to update maintenance status.",
        color: "error",
      });
    },
  });

  // Wrapper component for tooltip functionality
  const TooltipWrapper = ({
    children,
    content,
    showTooltip = false,
    placement = "bottom",
  }: {
    children: React.ReactNode;
    content: string;
    showTooltip?: boolean;
    placement?: "top" | "bottom" | "left" | "right";
  }) => {
    if (showTooltip) {
      return (
        <Tooltip content={content} placement={placement}>
          <div className="inline-block">{children}</div>
        </Tooltip>
      );
    }

    return <>{children}</>;
  };

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h3 className="text-lg font-semibold">System Overview</h3>
        <div className="flex gap-2 justify-end self-end sm:self-auto">
          <TooltipWrapper
            content="Check System Health"
            showTooltip={isMobile}
            placement="bottom"
          >
            <ConfirmationDialog
              confirmColor="primary"
              confirmLabel="Check Now"
              loadingText="Checking..."
              message="This will perform a real-time check of the server and database status."
              title="System Health Check"
              trigger={
                <Button
                  isIconOnly={isMobile}
                  size="sm"
                  color="primary"
                  variant="flat"
                  startContent={
                    isMobile ? undefined : (
                      <ServerStackIcon className="w-4 h-4" />
                    )
                  }
                >
                  {isMobile ? (
                    <ServerStackIcon className="w-4 h-4" />
                  ) : (
                    "Check System Health"
                  )}
                </Button>
              }
              onConfirm={handleCheckHealth}
            />
          </TooltipWrapper>

          <TooltipWrapper
            content="Restart System"
            showTooltip={isMobile}
            placement="bottom"
          >
            <ConfirmationDialog
              confirmColor="primary"
              confirmLabel="Restart System"
              icon={<ServerStackIcon className="w-6 h-6 text-primary" />}
              loadingText="Restarting..."
              message="This will restart the system and may cause temporary downtime. Are you sure you want to continue?"
              title="Restart System"
              trigger={
                <Button
                  isIconOnly={isMobile}
                  color="primary"
                  size="sm"
                  variant="flat"
                  startContent={
                    isMobile ? undefined : <ArrowPathIcon className="w-4 h-4" />
                  }
                >
                  {isMobile ? <ArrowPathIcon className="w-4 h-4" /> : "Restart"}
                </Button>
              }
              onConfirm={async () => {
                await new Promise((resolve) => setTimeout(resolve, 2000));
                console.log("System restarted");
              }}
            />
          </TooltipWrapper>

          <TooltipWrapper
            content={
              isMaintenance ? "Disable Maintenance" : "Enable Maintenance"
            }
            showTooltip={isMobile}
            placement="bottom"
          >
            <ConfirmationDialog
              confirmColor={isMaintenance ? "success" : "warning"}
              confirmLabel={
                isMaintenance ? "Disable Maintenance" : "Enable Maintenance"
              }
              icon={
                <ShieldExclamationIcon
                  className={`w-6 h-6 ${isMaintenance ? "text-success" : "text-warning"}`}
                />
              }
              loadingText={isMaintenance ? "Disabling..." : "Enabling..."}
              message={
                isMaintenance
                  ? "This will disable maintenance mode and restore normal access to the system."
                  : "This will enable maintenance mode. All users will be temporarily blocked."
              }
              title={
                isMaintenance ? "Disable Maintenance" : "Enable Maintenance"
              }
              trigger={
                <Button
                  isIconOnly={isMobile}
                  color={isMaintenance ? "success" : "warning"}
                  size="sm"
                  variant="flat"
                  isLoading={isToggling}
                  startContent={
                    isMobile ? undefined : (
                      <ShieldExclamationIcon className="w-4 h-4" />
                    )
                  }
                >
                  {isMobile ? (
                    <ShieldExclamationIcon className="w-4 h-4" />
                  ) : isMaintenance ? (
                    "Disable Maintenance"
                  ) : (
                    "Maintenance"
                  )}
                </Button>
              }
              onConfirm={() => toggleMaintenance(!isMaintenance)}
            />
          </TooltipWrapper>
        </div>
      </CardHeader>
      <CardBody className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between gap-1 sm:gap-2 items-start sm:items-center">
          <span>Server Status</span>
          <span
            className={`font-semibold ${
              serverStatus === "Online"
                ? "text-success"
                : serverStatus === "Restarting..."
                  ? "text-warning"
                  : "text-danger"
            }`}
          >
            {serverStatus || "Loading..."}
          </span>
        </div>
        <div className="flex flex-col sm:flex-row justify-between gap-1 sm:gap-2 items-start sm:items-center">
          <span>Database</span>
          <span
            className={`font-semibold ${
              databaseStatus === "Connected"
                ? "text-success"
                : databaseStatus === "Maintenance Mode"
                  ? "text-warning"
                  : "text-danger"
            }`}
          >
            {databaseStatus || "Loading..."}
          </span>
        </div>
        <div className="flex flex-col sm:flex-row justify-between gap-1 sm:gap-2 items-start sm:items-center">
          <span>Last Backup</span>
          <div className="flex items-center gap-2">
            <span className="text-default-600">
              {backupStatus || "Loading..."}
            </span>
            <TooltipWrapper
              content="Create Backup"
              showTooltip={isMobile}
              placement="left"
            >
              <ConfirmationDialog
                confirmColor="success"
                confirmLabel="Start Backup"
                icon={<DocumentTextIcon className="w-6 h-6 text-success" />}
                loadingText="Creating backup..."
                message="This will create a new backup of the database. This process may take several minutes."
                title="Backup Database"
                trigger={
                  <Button isIconOnly color="success" size="sm" variant="light">
                    <ArrowPathIcon className="w-4 h-4" />
                  </Button>
                }
                onConfirm={async () => {
                  await new Promise((resolve) => setTimeout(resolve, 3000));
                  console.log("Database backup created");
                }}
              />
            </TooltipWrapper>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-between gap-1 sm:gap-2 items-start sm:items-center">
          <span>Disk Usage</span>
          <span className="text-warning font-semibold">
            {diskStatus || "Loading..."}
          </span>
        </div>
      </CardBody>
    </Card>
  );
}
