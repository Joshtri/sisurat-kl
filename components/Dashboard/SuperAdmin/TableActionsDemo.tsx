"use client";

import { Card, CardHeader, CardBody } from "@heroui/react";
import { TableActions } from "@/components/common/TableActions";

interface ActionData {
  id: string;
  nama: string;
  jenis: string;
  status: string;
}

interface TableActionsDemoProps {
  data: ActionData[];
}

export function TableActionsDemo({ data }: TableActionsDemoProps) {
  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">Pengajuan Terbaru</h3>
      </CardHeader>
      <CardBody>
        <div className="space-y-4">
          <p className="text-sm text-default-600">
            Tindakan cepat untuk pengajuan surat terbaru:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div>
                  <p className="font-medium">{item.nama}</p>
                  <p className="text-sm text-default-600">{item.jenis}</p>
                </div>
                <TableActions
                  onView={() => alert(`Lihat detail surat ID: ${item.id}`)}
                  onEdit={
                    item.status === "DIAJUKAN" ||
                    item.status.startsWith("DIVERIFIKASI")
                      ? () => alert(`Verifikasi surat ID: ${item.id}`)
                      : undefined
                  }
                  onDelete={
                    item.status.startsWith("DITOLAK")
                      ? {
                          message: "Yakin ingin menghapus surat ini?",
                          confirmLabel: "Hapus Surat",
                          onConfirm: async () => {
                            await new Promise((resolve) =>
                              setTimeout(resolve, 1000)
                            );
                            alert(`Surat ${item.id} berhasil dihapus`);
                          },
                        }
                      : undefined
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
