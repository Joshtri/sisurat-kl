"use client";

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

interface RecentSuratTableProps {
  data: Array<{
    id: string;
    jenis: string;
    pemohon: string;
    status: string;
    tanggal: Date;
    noSurat: string;
  }>;
}

const statusColorMap: Record<string, "success" | "warning" | "danger" | "default"> = {
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
  return (
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
            <TableColumn>TANGGAL</TableColumn>
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
                  {new Date(item.tanggal).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardBody>
    </Card>
  );
}
