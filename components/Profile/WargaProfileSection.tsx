"use client";

import { Button } from "@heroui/button";
import { useState } from "react";
import { BookOpenIcon, PencilIcon } from "@heroicons/react/24/solid";

import { EditWargaDialog } from "./EditWargaDialog";
import EditFileWargaDialog from "./EditFileWargaDialog";

import { ReadOnlyInput } from "@/components/ui/inputs/ReadOnlyInput";

interface WargaProfileSectionProps {
  warga: {
    namaLengkap: string;
    nik: string;
    tempatLahir?: string;
    tanggalLahir?: string;
    jenisKelamin: string;
    pekerjaan?: string;
    agama?: string;
    noTelepon?: string;
    rt?: string;
    rw?: string;
    alamat?: string;
    statusHidup: string;
    foto?: string;
  };
}

export function WargaProfileSection({ warga }: WargaProfileSectionProps) {
  const [open, setOpen] = useState(false);

  const [openFile, setOpenFile] = useState(false);

  return (
    <div className="p-4 rounded-xl border bg-white shadow-sm space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">Profil Warga</h3>
        <Button
          onPress={() => setOpen(true)}
          isIconOnly
          variant="ghost"
          className="text-blue-600"
        >
          <PencilIcon className="w-5 h-5" />
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ReadOnlyInput label="Nama Lengkap" value={warga.namaLengkap} />
        <ReadOnlyInput label="NIK" value={warga.nik} />
        <ReadOnlyInput label="Jenis Kelamin" value={warga.jenisKelamin} />
        <ReadOnlyInput label="Tempat Lahir" value={warga.tempatLahir ?? "-"} />
        <ReadOnlyInput
          label="Tanggal Lahir"
          value={
            warga.tanggalLahir
              ? new Date(warga.tanggalLahir).toLocaleDateString("id-ID")
              : "-"
          }
        />
        <ReadOnlyInput label="Pekerjaan" value={warga.pekerjaan ?? "-"} />
        <ReadOnlyInput label="Agama" value={warga.agama ?? "-"} />
        <ReadOnlyInput label="No Telepon" value={warga.noTelepon ?? "-"} />
        <ReadOnlyInput
          label="RT/RW"
          value={`${warga.rt ?? "-"} / ${warga.rw ?? "-"}`}
        />
        <ReadOnlyInput label="Alamat" value={warga.alamat ?? "-"} />
        <ReadOnlyInput label="Status Hidup" value={warga.statusHidup} />

        <div className="pt-3 sm:pt-6 flex justify-end">
          <Button
            color="default"
            variant="solid"
            onPress={() => setOpenFile(true)}
            // onPress={() => setOpenPassword(true)}
            endContent={<BookOpenIcon className="w-5 h-5" />}
          >
            Lengkapi Dokumen
          </Button>
        </div>
      </div>

      <EditFileWargaDialog
        onSubmit={async (formData) => {
          // TODO: kirim ke API untuk update dokumen
          // await updateWargaFile(formData);
          setOpenFile(false);
        }}
        isOpen={openFile}
        onClose={() => setOpenFile(false)}
        // warga={warga}
      />

      <EditWargaDialog
        open={open}
        onClose={() => setOpen(false)}
        warga={warga}
      />
    </div>
  );
}
