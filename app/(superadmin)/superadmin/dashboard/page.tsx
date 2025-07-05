"use client";

import { Card, CardBody, CardHeader } from "@heroui/react";

export default function SuperAdminDashboard() {
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
            <div className="text-2xl font-bold text-primary">150</div>
            <div className="text-sm text-default-600">Total Users</div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-success">1,234</div>
            <div className="text-sm text-default-600">Total Surat</div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-warning">45</div>
            <div className="text-sm text-default-600">Pending Review</div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-danger">3</div>
            <div className="text-sm text-default-600">System Alerts</div>
          </CardBody>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Overview */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">System Overview</h3>
          </CardHeader>
          <CardBody className="space-y-3">
            <div className="flex justify-between">
              <span>Server Status</span>
              <span className="text-success">Online</span>
            </div>
            <div className="flex justify-between">
              <span>Database</span>
              <span className="text-success">Connected</span>
            </div>
            <div className="flex justify-between">
              <span>Last Backup</span>
              <span className="text-default-600">2 hours ago</span>
            </div>
            <div className="flex justify-between">
              <span>Disk Usage</span>
              <span className="text-warning">75%</span>
            </div>
          </CardBody>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Recent Activities</h3>
          </CardHeader>
          <CardBody className="space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">New user registered</div>
                <div className="text-sm text-default-600">5 minutes ago</div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">System backup completed</div>
                <div className="text-sm text-default-600">2 hours ago</div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">Database maintenance</div>
                <div className="text-sm text-default-600">1 day ago</div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
