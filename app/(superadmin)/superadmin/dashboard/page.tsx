"use client";

import { useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { Button } from "@heroui/button";
import {
  TrashIcon,
  ArrowPathIcon,
  ShieldExclamationIcon,
  ServerStackIcon,
  UserGroupIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { TableActions } from "@/components/common/TableActions";

export default function SuperAdminDashboard() {
  const [systemStatus, setSystemStatus] = useState({
    server: "Online",
    database: "Connected",
    lastBackup: "2 hours ago",
    diskUsage: "75%",
  });

  const [stats, setStats] = useState({
    totalUsers: 150,
    totalSurat: 1234,
    pendingReview: 45,
    systemAlerts: 3,
  });

  // Simulate API calls
  const handleSystemRestart = async () => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setSystemStatus((prev) => ({ ...prev, server: "Restarting..." }));

    // Simulate restart completion
    setTimeout(() => {
      setSystemStatus((prev) => ({ ...prev, server: "Online" }));
    }, 3000);
  };

  const handleDatabaseMaintenance = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSystemStatus((prev) => ({ ...prev, database: "Maintenance Mode" }));

    setTimeout(() => {
      setSystemStatus((prev) => ({ ...prev, database: "Connected" }));
    }, 5000);
  };

  const handleClearSystemAlerts = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setStats((prev) => ({ ...prev, systemAlerts: 0 }));
  };

  const handleBackupDatabase = async () => {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setSystemStatus((prev) => ({ ...prev, lastBackup: "Just now" }));
  };

  const handleDeleteAllLogs = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("All logs deleted successfully");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Dashboard Super Admin</h1>
        <p className="text-default-600">
          Selamat datang di portal Super Admin Kelurahan Liliba
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-primary">
              {stats.totalUsers}
            </div>
            <div className="text-sm text-default-600">Total Users</div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-success">
              {stats.totalSurat}
            </div>
            <div className="text-sm text-default-600">Total Surat</div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-warning">
              {stats.pendingReview}
            </div>
            <div className="text-sm text-default-600">Pending Review</div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center space-y-2">
            <div className="text-2xl font-bold text-danger">
              {stats.systemAlerts}
            </div>
            <div className="text-sm text-default-600">System Alerts</div>
            {stats.systemAlerts > 0 && (
              <ConfirmationDialog
                confirmColor="warning"
                confirmLabel="Clear Alerts"
                icon={
                  <ShieldExclamationIcon className="w-6 h-6 text-warning" />
                }
                loadingText="Clearing..."
                message="Are you sure you want to clear all system alerts? This action cannot be undone."
                title="Clear System Alerts"
                trigger={
                  <Button
                    color="danger"
                    size="sm"
                    startContent={<TrashIcon className="w-4 h-4" />}
                    variant="flat"
                  >
                    Clear
                  </Button>
                }
                onConfirm={handleClearSystemAlerts}
              />
            )}
          </CardBody>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Overview */}
        <Card>
          <CardHeader className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">System Overview</h3>
            <div className="flex gap-2">
              <ConfirmationDialog
                confirmColor="primary"
                confirmLabel="Restart System"
                icon={<ServerStackIcon className="w-6 h-6 text-primary" />}
                loadingText="Restarting..."
                message="This will restart the system and may cause temporary downtime. Are you sure you want to continue?"
                title="Restart System"
                trigger={
                  <Button
                    color="primary"
                    size="sm"
                    startContent={<ArrowPathIcon className="w-4 h-4" />}
                    variant="flat"
                  >
                    Restart
                  </Button>
                }
                onConfirm={handleSystemRestart}
              />

              <ConfirmationDialog
                confirmColor="warning"
                confirmLabel="Start Maintenance"
                icon={
                  <ShieldExclamationIcon className="w-6 h-6 text-warning" />
                }
                loadingText="Starting maintenance..."
                message="This will put the database in maintenance mode. Users may experience temporary service interruptions."
                title="Database Maintenance"
                trigger={
                  <Button
                    color="warning"
                    size="sm"
                    startContent={<ArrowPathIcon className="w-4 h-4" />}
                    variant="flat"
                  >
                    Maintenance
                  </Button>
                }
                onConfirm={handleDatabaseMaintenance}
              />
            </div>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Server Status</span>
              <span
                className={`font-semibold ${
                  systemStatus.server === "Online"
                    ? "text-success"
                    : systemStatus.server === "Restarting..."
                      ? "text-warning"
                      : "text-danger"
                }`}
              >
                {systemStatus.server}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Database</span>
              <span
                className={`font-semibold ${
                  systemStatus.database === "Connected"
                    ? "text-success"
                    : systemStatus.database === "Maintenance Mode"
                      ? "text-warning"
                      : "text-danger"
                }`}
              >
                {systemStatus.database}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Last Backup</span>
              <div className="flex items-center gap-2">
                <span className="text-default-600">
                  {systemStatus.lastBackup}
                </span>
                <ConfirmationDialog
                  confirmColor="success"
                  confirmLabel="Start Backup"
                  icon={<DocumentTextIcon className="w-6 h-6 text-success" />}
                  loadingText="Creating backup..."
                  message="This will create a new backup of the database. This process may take several minutes."
                  title="Backup Database"
                  trigger={
                    <Button
                      isIconOnly
                      color="success"
                      size="sm"
                      variant="light"
                    >
                      <ArrowPathIcon className="w-4 h-4" />
                    </Button>
                  }
                  onConfirm={handleBackupDatabase}
                />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span>Disk Usage</span>
              <span className="text-warning font-semibold">
                {systemStatus.diskUsage}
              </span>
            </div>
          </CardBody>
        </Card>

        {/* Recent Activities */}
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
              onConfirm={handleDeleteAllLogs}
            />
          </CardHeader>
          <CardBody className="space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium flex items-center gap-2">
                  <UserGroupIcon className="w-4 h-4 text-blue-500" />
                  New user registered
                </div>
                <div className="text-sm text-default-600">5 minutes ago</div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium flex items-center gap-2">
                  <DocumentTextIcon className="w-4 h-4 text-green-500" />
                  System backup completed
                </div>
                <div className="text-sm text-default-600">2 hours ago</div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium flex items-center gap-2">
                  <ServerStackIcon className="w-4 h-4 text-orange-500" />
                  Database maintenance
                </div>
                <div className="text-sm text-default-600">1 day ago</div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Quick Actions Section */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Quick Actions</h3>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ConfirmationDialog
              confirmColor="primary"
              confirmLabel="Run Check"
              loadingText="Running check..."
              message="This will perform a comprehensive system health check. The process may take a few minutes."
              title="Run System Health Check"
              trigger={
                <Button
                  fullWidth
                  className="h-20 flex-col"
                  color="primary"
                  variant="flat"
                >
                  <ServerStackIcon className="w-6 h-6 mb-2" />
                  System Health Check
                </Button>
              }
              onConfirm={async () => {
                await new Promise((resolve) => setTimeout(resolve, 2000));
                console.log("System health check completed");
              }}
            />

            <ConfirmationDialog
              confirmColor="success"
              confirmLabel="Update Now"
              loadingText="Updating..."
              message="This will download and install the latest system updates. The system may need to restart afterward."
              title="Update System"
              trigger={
                <Button
                  fullWidth
                  className="h-20 flex-col"
                  color="success"
                  variant="flat"
                >
                  <ArrowPathIcon className="w-6 h-6 mb-2" />
                  Update System
                </Button>
              }
              onConfirm={async () => {
                await new Promise((resolve) => setTimeout(resolve, 3000));
                console.log("System updated successfully");
              }}
            />

            <ConfirmationDialog
              confirmColor="warning"
              confirmLabel="Send Notification"
              loadingText="Sending..."
              message="This will send a system-wide notification to all active users. Use this feature responsibly."
              title="Send System Notification"
              trigger={
                <Button
                  fullWidth
                  className="h-20 flex-col"
                  color="warning"
                  variant="flat"
                >
                  <UserGroupIcon className="w-6 h-6 mb-2" />
                  Send Notifications
                </Button>
              }
              onConfirm={async () => {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                console.log("Notification sent to all users");
              }}
            />
          </div>
        </CardBody>
      </Card>

      {/* Table Actions Demo Section */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Table Actions Demo</h3>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            <p className="text-sm text-default-600">
              This demonstrates the reusable TableActions component with
              different action combinations:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">John Doe</p>
                  <p className="text-sm text-default-600">Admin User</p>
                </div>
                <TableActions
                  onDelete={{
                    message:
                      "Are you sure you want to delete this user? This action cannot be undone.",
                    confirmLabel: "Delete User",
                    onConfirm: async () => {
                      await new Promise((resolve) => setTimeout(resolve, 1000));
                      alert("User deleted successfully");
                    },
                  }}
                  onEdit={() => alert("Edit user")}
                  onView={() => alert("View user details")}
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Jane Smith</p>
                  <p className="text-sm text-default-600">Staff User</p>
                </div>
                <TableActions
                  onEdit={() => alert("Edit user")}
                  onView={() => alert("View user details")}
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Bob Johnson</p>
                  <p className="text-sm text-default-600">Read-only User</p>
                </div>
                <TableActions onView={() => alert("View user details")} />
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
