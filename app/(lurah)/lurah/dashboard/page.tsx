"use client";

import { Card, CardBody, CardHeader } from "@heroui/react";

export default function LurahDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Dashboard Lurah</h1>
        <p className="text-default-600">
          Portal lurah untuk persetujuan dan monitoring kelurahan
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-warning">5</div>
            <div className="text-sm text-default-600">Menunggu Persetujuan</div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-success">23</div>
            <div className="text-sm text-default-600">Disetujui Hari Ini</div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-primary">156</div>
            <div className="text-sm text-default-600">Total Bulan Ini</div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-default-500">1,234</div>
            <div className="text-sm text-default-600">Total Tahun Ini</div>
          </CardBody>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Menunggu Persetujuan */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Menunggu Persetujuan</h3>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="flex justify-between items-center p-3 border rounded-lg">
              <div>
                <div className="font-medium">Surat Izin Keramaian</div>
                <div className="text-sm text-default-600">
                  Acara 17 Agustus RT 05
                </div>
                <div className="text-xs text-default-500">30 menit lalu</div>
              </div>
              <span className="text-warning text-sm">Urgent</span>
            </div>
            <div className="flex justify-between items-center p-3 border rounded-lg">
              <div>
                <div className="font-medium">Surat Rekomendasi Usaha</div>
                <div className="text-sm text-default-600">
                  Toko Sembako Pak Budi
                </div>
                <div className="text-xs text-default-500">2 jam lalu</div>
              </div>
              <span className="text-primary text-sm">Normal</span>
            </div>
            <div className="flex justify-between items-center p-3 border rounded-lg">
              <div>
                <div className="font-medium">
                  Surat Keterangan Kelakuan Baik
                </div>
                <div className="text-sm text-default-600">
                  Untuk melamar kerja
                </div>
                <div className="text-xs text-default-500">4 jam lalu</div>
              </div>
              <span className="text-primary text-sm">Normal</span>
            </div>
          </CardBody>
        </Card>

        {/* Laporan Singkat */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Laporan Singkat</h3>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Surat Domisili</span>
              <div className="text-right">
                <div className="font-bold">45</div>
                <div className="text-xs text-success">+12%</div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span>Surat Usaha</span>
              <div className="text-right">
                <div className="font-bold">23</div>
                <div className="text-xs text-success">+8%</div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span>Pengantar KTP</span>
              <div className="text-right">
                <div className="font-bold">67</div>
                <div className="text-xs text-warning">-3%</div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span>Surat Kelakuan Baik</span>
              <div className="text-right">
                <div className="font-bold">12</div>
                <div className="text-xs text-success">+25%</div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
