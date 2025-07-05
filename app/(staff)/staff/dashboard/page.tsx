"use client";

import { Card, CardBody, CardHeader } from "@heroui/react";

export default function StaffDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Dashboard Staff</h1>
        <p className="text-default-600">
          Portal staff untuk mengelola pengajuan surat warga
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-warning">12</div>
            <div className="text-sm text-default-600">Menunggu Review</div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-primary">8</div>
            <div className="text-sm text-default-600">Sedang Diproses</div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-success">45</div>
            <div className="text-sm text-default-600">Selesai Hari Ini</div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-default-500">127</div>
            <div className="text-sm text-default-600">Total Bulan Ini</div>
          </CardBody>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pengajuan Terbaru */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Pengajuan Terbaru</h3>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="flex justify-between items-center p-3 border rounded-lg">
              <div>
                <div className="font-medium">Surat Domisili - Ahmad S.</div>
                <div className="text-sm text-default-600">2 menit lalu</div>
              </div>
              <span className="text-warning text-sm">Baru</span>
            </div>
            <div className="flex justify-between items-center p-3 border rounded-lg">
              <div>
                <div className="font-medium">Surat Usaha - Budi P.</div>
                <div className="text-sm text-default-600">15 menit lalu</div>
              </div>
              <span className="text-warning text-sm">Baru</span>
            </div>
            <div className="flex justify-between items-center p-3 border rounded-lg">
              <div>
                <div className="font-medium">Pengantar KTP - Siti M.</div>
                <div className="text-sm text-default-600">1 jam lalu</div>
              </div>
              <span className="text-primary text-sm">Review</span>
            </div>
          </CardBody>
        </Card>

        {/* Tugas Hari Ini */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Tugas Hari Ini</h3>
          </CardHeader>
          <CardBody className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-warning rounded-full" />
              <div className="flex-1">
                <div className="font-medium">Review 12 pengajuan baru</div>
                <div className="text-sm text-default-600">Deadline: 17:00</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <div className="flex-1">
                <div className="font-medium">Proses 8 surat yang disetujui</div>
                <div className="text-sm text-default-600">Dalam progress</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-success rounded-full" />
              <div className="flex-1">
                <div className="font-medium">Update template surat</div>
                <div className="text-sm text-default-600">Selesai</div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
