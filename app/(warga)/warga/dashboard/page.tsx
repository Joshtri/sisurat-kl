"use client";

import { Card, CardBody, CardHeader } from "@heroui/react";

export default function WargaDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Dashboard Warga</h1>
        <p className="text-default-600">
          Selamat datang di portal warga Kelurahan Liliba
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-primary">5</div>
            <div className="text-sm text-default-600">Surat Diajukan</div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-success">3</div>
            <div className="text-sm text-default-600">Surat Selesai</div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-warning">2</div>
            <div className="text-sm text-default-600">Dalam Proses</div>
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
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">Surat Keterangan Domisili</div>
                <div className="text-sm text-default-600">15 Jan 2025</div>
              </div>
              <span className="text-warning text-sm">Proses</span>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">Surat Keterangan Usaha</div>
                <div className="text-sm text-default-600">12 Jan 2025</div>
              </div>
              <span className="text-success text-sm">Selesai</span>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">Surat Pengantar KTP</div>
                <div className="text-sm text-default-600">10 Jan 2025</div>
              </div>
              <span className="text-success text-sm">Selesai</span>
            </div>
          </CardBody>
        </Card>

        {/* Layanan Populer */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Layanan Populer</h3>
          </CardHeader>
          <CardBody className="space-y-3">
            <div className="p-3 border rounded-lg hover:bg-default-50">
              <div className="font-medium">Surat Keterangan Domisili</div>
              <div className="text-sm text-default-600">
                Untuk keperluan administrasi
              </div>
            </div>
            <div className="p-3 border rounded-lg hover:bg-default-50">
              <div className="font-medium">Surat Pengantar KTP</div>
              <div className="text-sm text-default-600">
                Untuk pembuatan KTP baru
              </div>
            </div>
            <div className="p-3 border rounded-lg hover:bg-default-50">
              <div className="font-medium">Surat Keterangan Usaha</div>
              <div className="text-sm text-default-600">
                Untuk keperluan usaha
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
