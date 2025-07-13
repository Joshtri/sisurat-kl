"use client";

import { Button, Card, CardBody, CardHeader } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { getMe } from "@/services/authService";
import { SkeletonCard } from "@/components/ui/skeleton/SkeletonCard";
import { SkeletonText } from "@/components/ui/skeleton/SkeletonText";
import EditFileWargaDialog from "@/components/Profile/EditFileWargaDialog";

export default function WargaDashboard() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
  });
  const [openDialog, setOpenDialog] = useState(false);

  console.log(openDialog, "openDialog");

  return (
    <div className="space-y-6">
      {/* Header */}

      {isLoading && (
        <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-100">
          <SkeletonCard rows={2} />
        </div>
      )}

      {!isLoading && (!user?.fileKtp || !user?.fileKk) && (
        <div className="p-4 rounded-lg bg-yellow-100 border border-yellow-300 text-yellow-800 space-y-2">
          <strong>Profil Belum Lengkap</strong>
          <p>
            Anda belum mengunggah {!user.fileKtp && "KTP"}
            {!user.fileKtp && !user.fileKk && " dan "}
            {!user.fileKk && "KK"}.
          </p>
          <Button
            variant="faded"
            size="sm"
            color="primary"
            onPress={() => setOpenDialog(true)}
            className="inline-block text-sm"
          >
            Lengkapi Sekarang →
          </Button>
        </div>
      )}
      {isLoading ? (
        <div className="flex flex-col gap-2">
          <SkeletonText width="w-1/3" height="h-8" />
          <SkeletonText width="w-1/2" height="h-5" />
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Dashboard Warga</h1>
          <p className="text-default-600">
            Selamat datang,{" "}
            <span className="font-semibold">
              {user?.namaLengkap ?? user?.username}
            </span>{" "}
            👋
          </p>
        </div>
      )}

      <EditFileWargaDialog
        isOpen={openDialog}
        // isOpen={openDialog}
        onClose={() => setOpenDialog(false)}
        onSubmit={async (formData) => {
          // TODO: kirim ke API untuk update dokumen
          // await updateWargaFile(formData);
          setOpenDialog(false);
        }}
      />
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
