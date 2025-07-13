"use client";

import { JenisSurat } from "@prisma/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { z } from "zod";

import { CardContainer } from "@/components/common/CardContainer";
import { PageHeader } from "@/components/common/PageHeader";
import { FormWrapper } from "@/components/FormWrapper";
import { FormDetailAhliWaris } from "@/components/SuratPermohonan/FormDetailAhliWaris";
import { FormDetailKematian } from "@/components/SuratPermohonan/FormDetailKematian";
import { FormDetailUsaha } from "@/components/SuratPermohonan/FormDetailUsaha";
import { AutoCompleteInput } from "@/components/ui/inputs/AutoCompleteInput";
import { getAllJenisSurat } from "@/services/jenisSuratService";
import FormAutofillFromWarga from "@/components/SuratPermohonan/FormAutofillFromWarga";
import UserProfilPreview from "@/components/SuratPermohonan/UserProfilPreview";
import { CreateOrEditButtons } from "@/components/ui/CreateOrEditButtons";
import { createSurat } from "@/services/suratService";

const formSchema = z.object({
  jenisSurat: z.string().min(1),
  alasan: z.string().optional(),

  // Tambahan dari Warga
  namaLengkap: z.string(),
  nik: z.string(),
  tempatTanggalLahir: z.string(),
  jenisKelamin: z.string(),
  agama: z.string().optional(),
  pekerjaan: z.string().optional(),
  alamat: z.string().optional(),
  noTelepon: z.string().optional(),
});

const jenisSuratWithFormMap: Record<
  string,
  "usaha" | "kematian" | "ahli_waris" | null
> = {
  SUKET_USAHA: "usaha",
  KEMATIAN: "kematian",
  AHLI_WARIS: "ahli_waris",
};

export default function CreateSuratPermohonanPage() {
  const [selectedJenis, setSelectedJenis] = useState<string | null>(null);

  const { data: jenisList = [], isLoading } = useQuery<JenisSurat[]>({
    queryKey: ["jenis-surat"],
    queryFn: getAllJenisSurat,
  });

  const {} = useMutation({});

  const handleSubmit = async (data: any) => {
    try {
      const payload = {
        ...data,
        idJenisSurat: data.jenisSurat, // asumsi ini id dari AutoCompleteInput
        tanggalPengajuan: new Date().toISOString(),
      };

      const result = await createSurat(payload);

      console.log("Surat berhasil diajukan:", result);

      // ✅ Tambahkan notifikasi atau redirect setelah berhasil
      // showToast({ title: "Sukses", description: "Surat berhasil diajukan", color: "success" });
    } catch (error: any) {
      console.error("Gagal mengajukan surat:", error?.response || error);
      // showToast({ title: "Gagal", description: "Periksa kembali data atau koneksi", color: "error" });
    }
  };

  console.log(selectedJenis, "selectedJenis");

  return (
    <>
      <PageHeader
        title="Buat Permohonan"
        description="Silakan isi formulir berikut untuk membuat permohonan surat."
        breadcrumbs={[
          { label: "Dashboard", href: "/warga/dashboard" },
          { label: "Permohonan Surat", href: "/warga/permohonan" },
          { label: "Buat Permohonan" },
        ]}
      />

      <CardContainer>
        <UserProfilPreview />

        <FormWrapper
          schema={formSchema}
          defaultValues={{ jenisSurat: "", alasan: "" }}
          onSubmit={handleSubmit}
        >
          <FormAutofillFromWarga />

          <AutoCompleteInput
            name="jenisSurat"
            label="Jenis Surat"
            placeholder="Cari jenis surat..."
            isLoading={isLoading}
            options={jenisList.map((jenis) => ({
              label: jenis.nama,
              value: jenis.id,
            }))}
            onChange={(val) => {
              const selected = jenisList.find((j) => j.id === val);

              console.log("Terpilih KODE:", selected?.kode);
              setSelectedJenis(selected?.kode ?? null);
            }}
          />

          {/* Tampilkan form tambahan berdasarkan jenis */}
          {selectedJenis &&
            jenisSuratWithFormMap[selectedJenis] === "usaha" && (
              <FormDetailUsaha />
            )}
          {selectedJenis &&
            jenisSuratWithFormMap[selectedJenis] === "kematian" && (
              <FormDetailKematian />
            )}
          {selectedJenis &&
            jenisSuratWithFormMap[selectedJenis] === "ahli_waris" && (
              <FormDetailAhliWaris />
            )}

          <CreateOrEditButtons
            // isEditMode={true}
            cancelLabel="Batal"
            showCancel
            onCancel={() => console.log("Batal")}
            // onSubmit={() => console.log("Simpan")}
          />
        </FormWrapper>
      </CardContainer>
    </>
  );
}
