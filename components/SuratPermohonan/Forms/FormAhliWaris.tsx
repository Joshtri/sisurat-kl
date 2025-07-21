"use client";

import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

import { getAnggotaByKkId } from "@/services/wargaService";
import { convertFileToBase64 } from "@/utils/common";

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
  const {
    setValue,
    register,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useFormContext();

  const [anakList, setAnakList] = useState<AnakWaris[]>([]);
  const [loading, setLoading] = useState(true);

  const aktaNikah = watch("dataSurat.aktaNikah")?.[0];
  const ktpSaksi = watch("dataSurat.ktpSaksi")?.[0];
  const aktaLahirFiles = watch("dataSurat.aktaLahirAnak") || [];

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

  const validateAndConvert = async (
    file: File,
    fieldName: string,
    targetField: string,
  ) => {
    const isValidType =
      file.type === "application/pdf" || file.type.startsWith("image/");

    if (!isValidType) {
      setError(fieldName, {
        type: "manual",
        message: "Hanya file gambar atau PDF yang diperbolehkan",
      });

      return;
    }

    if (file.size > 1024 * 1024) {
      setError(fieldName, {
        type: "manual",
        message: "Ukuran file maksimal 1 MB",
      });

      return;
    }

    clearErrors(fieldName);
    const base64 = await convertFileToBase64(file);

    setValue(targetField, base64);
  };

  useEffect(() => {
    if (aktaNikah) {
      validateAndConvert(
        aktaNikah,
        "dataSurat.aktaNikah",
        "dataSurat.aktaNikahBase64",
      );
    }
  }, [aktaNikah]);

  useEffect(() => {
    if (ktpSaksi) {
      validateAndConvert(
        ktpSaksi,
        "dataSurat.ktpSaksi",
        "dataSurat.ktpSaksiBase64",
      );
    }
  }, [ktpSaksi]);

  useEffect(() => {
    aktaLahirFiles.forEach(async (file: File, index: number) => {
      if (file) {
        const field = `dataSurat.aktaLahirAnak.${index}`;
        const base64Field = `dataSurat.aktaLahirAnakBase64.${index}`;

        await validateAndConvert(file, field, base64Field);
      }
    });
  }, [aktaLahirFiles]);

  return (
    <div className="space-y-4">
      <div>
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

      {/* Akta Nikah */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Upload Akta Nikah{" "}
          <span className="text-gray-500">(gambar/pdf, max 1MB)</span>
        </label>
        <input
          type="file"
          accept="application/pdf,image/*"
          {...register("dataSurat.aktaNikah")}
          className="block w-full text-sm file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
        {errors.dataSurat?.aktaNikah && (
          <p className="text-sm text-red-500">
            {errors.dataSurat.aktaNikah.message as string}
          </p>
        )}
      </div>

      {/* Akta Lahir Tiap Anak */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Upload Akta Lahir Tiap Ahli Waris{" "}
          <span className="text-gray-500">(gambar/pdf, max 1MB)</span>
        </label>

        {anakList.map((anak, index) => (
          <div key={anak.id} className="space-y-1">
            <p className="text-sm font-semibold text-gray-600">
              {anak.namaLengkap} ({anak.nik})
            </p>
            <input
              type="file"
              accept="application/pdf,image/*"
              {...register(`dataSurat.aktaLahirAnak.${index}`)}
              className="block w-full text-sm file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0 file:bg-green-50 file:text-green-700
                hover:file:bg-green-100"
            />
            {errors.dataSurat?.aktaLahirAnak?.[index] && (
              <p className="text-sm text-red-500">
                {errors.dataSurat.aktaLahirAnak[index].message as string}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* KTP Saksi */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Upload KTP Saksi{" "}
          <span className="text-gray-500">(gambar/pdf, max 1MB)</span>
        </label>
        <input
          type="file"
          accept="application/pdf,image/*"
          {...register("dataSurat.ktpSaksi")}
          className="block w-full text-sm file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0 file:bg-purple-50 file:text-purple-700
            hover:file:bg-purple-100"
        />
        {errors.dataSurat?.ktpSaksi && (
          <p className="text-sm text-red-500">
            {errors.dataSurat.ktpSaksi.message as string}
          </p>
        )}
      </div>
    </div>
  );
}
