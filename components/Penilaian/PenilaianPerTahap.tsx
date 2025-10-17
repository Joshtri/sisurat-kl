"use client";

import { useState } from "react";
import { Button, Card, CardBody, Divider } from "@heroui/react";
import { StarIcon } from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";

import { StarRating } from "@/components/ui/StarRating";
import { getPenilaianBySurat, Penilaian, TahapPenilaian } from "@/services/penilaianService";
import { PenilaianModal } from "./PenilaianModal";

interface PenilaianPerTahapProps {
  suratId: string;
  suratNomor?: string;
}

export function PenilaianPerTahap({ suratId, suratNomor }: PenilaianPerTahapProps) {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    tahapRole: TahapPenilaian | null;
  }>({
    isOpen: false,
    tahapRole: null,
  });

  const { data: penilaianList = [] } = useQuery<Penilaian[]>({
    queryKey: ["penilaian", suratId],
    queryFn: () => getPenilaianBySurat(suratId),
  });

  const tahapan: { role: TahapPenilaian; label: string }[] = [
    { role: "RT", label: "RT" },
    { role: "STAFF", label: "Staf" },
    { role: "LURAH", label: "Lurah" },
  ];

  const getPenilaianForTahap = (tahap: TahapPenilaian) => {
    return penilaianList.find((p) => p.tahapRole === tahap);
  };

  const handleOpenModal = (tahapRole: TahapPenilaian) => {
    setModalState({ isOpen: true, tahapRole });
  };

  const handleCloseModal = () => {
    setModalState({ isOpen: false, tahapRole: null });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <StarIcon className="h-5 w-5 text-warning-500" />
        <h3 className="text-lg font-semibold">Penilaian Layanan</h3>
      </div>

      <p className="text-sm text-default-500">
        Berikan penilaian Anda untuk setiap tahap proses permohonan surat
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tahapan.map((tahap) => {
          const penilaian = getPenilaianForTahap(tahap.role);
          const sudahDiberiRating = !!penilaian;

          return (
            <Card key={tahap.role} className="shadow-sm">
              <CardBody className="p-4">
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-semibold text-default-700">
                      Tahap {tahap.label}
                    </h4>
                    {!sudahDiberiRating && (
                      <div className="px-2 py-0.5 bg-warning-100 text-warning-700 text-xs rounded-full">
                        Belum dinilai
                      </div>
                    )}
                  </div>

                  {sudahDiberiRating ? (
                    <div className="space-y-2">
                      <StarRating value={penilaian.rating} readonly size="sm" />
                      {penilaian.deskripsi && (
                        <>
                          <Divider className="my-2" />
                          <p className="text-xs text-default-600 italic">
                            "{penilaian.deskripsi}"
                          </p>
                        </>
                      )}
                      <p className="text-xs text-default-400 mt-2">
                        {new Date(penilaian.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="flat"
                      color="warning"
                      startContent={<StarIcon className="h-4 w-4" />}
                      onPress={() => handleOpenModal(tahap.role)}
                      className="mt-2"
                    >
                      Beri Penilaian
                    </Button>
                  )}
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      {/* Modal Penilaian */}
      {modalState.tahapRole && (
        <PenilaianModal
          isOpen={modalState.isOpen}
          onClose={handleCloseModal}
          suratId={suratId}
          suratNomor={suratNomor}
          tahapRole={modalState.tahapRole}
        />
      )}
    </div>
  );
}
