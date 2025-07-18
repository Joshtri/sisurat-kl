"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { PageHeader } from "@/components/common/PageHeader";
import { getSuratHistoryById } from "@/services/suratService";
import SuratProgress from "@/components/SuratPermohonan/SuratProgress";

export default function DetailSuratPage() {
  const { id } = useParams();
  const {
    data: surat,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["surat-detail", id],
    queryFn: () => getSuratHistoryById(id as string),
    enabled: !!id,
  });

  if (isLoading) return <p>Memuat detail surat...</p>;
  if (isError || !surat) return <p>Gagal memuat surat.</p>;

  const profil = surat.pemohon?.profil;

  return (
    <>
      <PageHeader
        title="Detail Surat"
        description="Informasi lengkap permohonan surat Anda."
        breadcrumbs={[
          { label: "Dashboard", href: "/warga/dashboard" },
          { label: "Permohonan Surat", href: "/warga/permohonan" },
          { label: "Detail" },
        ]}
      />

      <div className="bg-white p-6 rounded-md shadow-sm space-y-4 mt-6">
        <h2 className="text-lg font-semibold">{surat.jenis.nama}</h2>

        <div className="space-y-1 text-sm">
          <p>
            <strong>Status:</strong> {surat.status}
          </p>
          <p>
            <strong>Diajukan pada:</strong>{" "}
            {new Date(surat.createdAt).toLocaleDateString("id-ID")}
          </p>
          {surat.noSurat && (
            <p>
              <strong>No Surat:</strong> {surat.noSurat}
            </p>
          )}
          <p>
            <strong>Alasan Pengajuan:</strong> {surat.alasanPengajuan}
          </p>
        </div>

        <SuratProgress status={surat.status} />

        <hr className="my-4" />

        <h3 className="font-semibold">Data Pemohon</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 text-sm">
          <p>
            <strong>Nama:</strong> {profil?.namaLengkap}
          </p>
          <p>
            <strong>NIK:</strong> {profil?.nik}
          </p>
          <p>
            <strong>Tempat, Tanggal Lahir:</strong> {profil?.tempatLahir},{" "}
            {new Date(profil?.tanggalLahir).toLocaleDateString("id-ID")}
          </p>
          <p>
            <strong>Jenis Kelamin:</strong> {profil?.jenisKelamin}
          </p>
          <p>
            <strong>Agama:</strong> {profil?.agama}
          </p>
          <p>
            <strong>Pekerjaan:</strong> {profil?.pekerjaan}
          </p>
          <p>
            <strong>No Telepon:</strong> {profil?.noTelepon}
          </p>
          <p>
            <strong>Alamat:</strong> {profil?.alamat} RT {profil?.rt} / RW{" "}
            {profil?.rw}
          </p>
        </div>

        <hr className="my-4" />

        {surat.detailUsaha && (
          <>
            <h3 className="font-semibold">Detail Usaha</h3>
            <p>
              <strong>Nama Usaha:</strong> {surat.detailUsaha.namaUsaha}
            </p>
            <p>
              <strong>Jenis Usaha:</strong> {surat.detailUsaha.jenisUsaha}
            </p>
            <p>
              <strong>Alamat Usaha:</strong> {surat.detailUsaha.alamatUsaha}
            </p>
          </>
        )}

        {/* Tambahkan render conditional untuk detailKematian, detailAhliWaris jika perlu */}
      </div>
    </>
  );
}
