"use client";

import { useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import { Button } from "@heroui/button";
import { DocumentIcon, DocumentTextIcon } from "@heroicons/react/24/outline";

import { StarRating } from "@/components/ui/StarRating";
import { previewSuratPdf, previewSuratPengantar } from "@/services/suratService";
import { showToast } from "@/utils/toastHelper";
import LoadingScreen from "@/components/ui/loading/LoadingScreen";

interface RecentSuratTableProps {
  data: Array<{
    id: string;
    jenis: string;
    pemohon: string;
    status: string;
    tanggal: Date;
    noSurat: string;
    penilaian?: {
      rating: number;
      deskripsi?: string;
    } | null;
  }>;
}

const statusColorMap: Record<
  string,
  "success" | "warning" | "danger" | "default"
> = {
  DIAJUKAN: "default",
  DIVERIFIKASI_STAFF: "warning",
  DITOLAK_STAFF: "danger",
  DIVERIFIKASI_RT: "warning",
  DITOLAK_RT: "danger",
  DIVERIFIKASI_LURAH: "warning",
  DITOLAK_LURAH: "danger",
  DITERBITKAN: "success",
};

const statusLabels: Record<string, string> = {
  DIAJUKAN: "Diajukan",
  DIVERIFIKASI_STAFF: "Verifikasi Staff",
  DITOLAK_STAFF: "Ditolak Staff",
  DIVERIFIKASI_RT: "Verifikasi RT",
  DITOLAK_RT: "Ditolak RT",
  DIVERIFIKASI_LURAH: "Verifikasi Lurah",
  DITOLAK_LURAH: "Ditolak Lurah",
  DITERBITKAN: "Diterbitkan",
};

export function RecentSuratTable({ data }: RecentSuratTableProps) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      {isLoading && <LoadingScreen />}
      <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">Surat Terkini</h3>
      </CardHeader>
      <Divider />
      <CardBody>
        <Table aria-label="Tabel surat terkini">
          <TableHeader>
            <TableColumn>NO SURAT</TableColumn>
            <TableColumn>JENIS SURAT</TableColumn>
            <TableColumn>PEMOHON</TableColumn>
            <TableColumn>STATUS</TableColumn>
            <TableColumn>RATING</TableColumn>
            <TableColumn>TANGGAL</TableColumn>
            <TableColumn align="end">ACTIONS</TableColumn>
          </TableHeader>
          <TableBody emptyContent="Tidak ada data surat">
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.noSurat}</TableCell>
                <TableCell>{item.jenis}</TableCell>
                <TableCell>{item.pemohon}</TableCell>
                <TableCell>
                  <Chip
                    color={statusColorMap[item.status] || "default"}
                    size="sm"
                    variant="flat"
                  >
                    {statusLabels[item.status] || item.status}
                  </Chip>
                </TableCell>
                <TableCell>
                  {item.penilaian ? (
                    <div className="flex items-center gap-2">
                      <StarRating
                        value={item.penilaian.rating}
                        readonly
                        size="sm"
                      />
                    </div>
                  ) : (
                    <span className="text-xs text-default-400">-</span>
                  )}
                </TableCell>
                <TableCell>
                  {new Date(item.tanggal).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      size="sm"
                      variant="flat"
                      color="primary"
                      isIconOnly
                      onPress={async () => {
                        setIsLoading(true);
                        try {
                          await previewSuratPdf(item.id);
                        } catch (err: any) {
                          showToast({
                            title: "Gagal Preview",
                            description: err.message,
                            color: "error",
                          });
                        } finally {
                          setIsLoading(false);
                        }
                      }}
                    >
                      <DocumentIcon className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="flat"
                      color="secondary"
                      isIconOnly
                      onPress={async () => {
                        setIsLoading(true);
                        try {
                          await previewSuratPengantar(item.id);
                        } catch (err: any) {
                          showToast({
                            title: "Gagal Preview",
                            description: err.message,
                            color: "error",
                          });
                        } finally {
                          setIsLoading(false);
                        }
                      }}
                    >
                      <DocumentTextIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardBody>
    </Card>
    </>
  );
}
