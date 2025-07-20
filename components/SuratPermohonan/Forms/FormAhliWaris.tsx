"use client";

import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

import { getAnggotaByKkId } from "@/services/wargaService";

interface Props {
  kartuKeluargaId: string;
  userId: string;
}

interface AnakWaris {
  id: string;
  namaLengkap: string;
  nik: string;
  jenisKelamin: string;
  tempatLahir: string;
  tanggalLahir: string;
  peranDalamKK: string;
  userId: string;
}

export default function FormAhliWaris({ kartuKeluargaId, userId }: Props) {
  const { setValue } = useFormContext();
  const [anakList, setAnakList] = useState<AnakWaris[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!kartuKeluargaId) return;

    const fetchAnggota = async () => {
      try {
        const res = await getAnggotaByKkId(kartuKeluargaId);
        const semuaAnggota: AnakWaris[] = res.data;

        const anak = semuaAnggota.filter(
          (item) => item.peranDalamKK === "ANAK" && item.userId !== userId,
        );

        setAnakList(anak);

        // Simpan ke react-hook-form: hanya field yang dibutuhkan untuk surat
        const mapped = anak.map((a) => ({
          namaLengkap: a.namaLengkap,
          jenisKelamin: a.jenisKelamin,
          tempatLahir: a.tempatLahir,
          tanggalLahir: a.tanggalLahir,
        }));

        setValue("dataSurat.daftarAnak", mapped);
      } catch (err) {
        console.error("Gagal memuat anggota KK", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnggota();
  }, [kartuKeluargaId, userId, setValue]);

  return (
    <div className="space-y-3">
      <h4 className="font-semibold text-md">Daftar Anak (Ahli Waris)</h4>

      {loading ? (
        <p className="text-sm text-gray-500">Memuat data anak...</p>
      ) : anakList.length === 0 ? (
        <p className="text-sm text-red-500">Tidak ada anak lain dalam KK.</p>
      ) : (
        <ul className="list-disc ml-5 text-sm">
          {anakList.map((anak) => (
            <li key={anak.id}>
              {anak.namaLengkap} ({anak.nik})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
