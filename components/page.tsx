"use client";

import { JenisSurat } from "@prisma/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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

// ... (other imports remain the same)

// Base form schema for all surat types
const baseFormSchema = z.object({
  jenisSurat: z.string().min(1, "Jenis surat harus dipilih"),
  alasan: z.string().optional(),
  namaLengkap: z.string().min(1, "Nama lengkap harus diisi"),
  nik: z.string().min(16, "NIK harus 16 digit").max(16),
  tempatTanggalLahir: z.string().min(1, "Tempat/tanggal lahir harus diisi"),
  jenisKelamin: z.string().min(1, "Jenis kelamin harus dipilih"),
  agama: z.string().optional(),
  pekerjaan: z.string().optional(),
  alamat: z.string().optional(),
  noTelepon: z.string().optional(),
});

// Schema extensions for detailed forms
const usahaSchema = z.object({
  jenisUsaha: z.string().min(1, "Jenis usaha harus diisi"),
  namaUsaha: z.string().min(1, "Nama usaha harus diisi"),
  alamatUsaha: z.string().min(1, "Alamat usaha harus diisi"),
  fotoUsaha: z.string().optional(),
});

const kematianSchema = z.object({
  namaAyah: z.string().min(1, "Nama ayah harus diisi"),
  namaIbu: z.string().min(1, "Nama ibu harus diisi"),
  tanggalKematian: z.string().min(1, "Tanggal kematian harus diisi"),
  tempatKematian: z.string().min(1, "Tempat kematian harus diisi"),
  sebabKematian: z.string().min(1, "Sebab kematian harus diisi"),
  fileSuratKematian: z.string().optional(),
});

const ahliWarisSchema = z.object({
  namaAlmarhum: z.string().min(1, "Nama almarhum harus diisi"),
  tanggalMeninggal: z.string().min(1, "Tanggal meninggal harus diisi"),
  alamatTerakhir: z.string().min(1, "Alamat terakhir harus diisi"),
  hubunganDenganAlmarhum: z
    .string()
    .min(1, "Hubungan dengan almarhum harus diisi"),
});

export default function CreateSuratPermohonanPage() {
  const [selectedJenis, setSelectedJenis] = useState<string | null>(null);
  const [currentSchema, setCurrentSchema] = useState(baseFormSchema);

  const { data: jenisList = [], isLoading } = useQuery<JenisSurat[]>({
    queryKey: ["jenis-surat"],
    queryFn: getAllJenisSurat,
  });

  const form = useForm({
    resolver: zodResolver(currentSchema),
    defaultValues: {
      jenisSurat: "",
      alasan: "",
      namaLengkap: "",
      nik: "",
      tempatTanggalLahir: "",
      jenisKelamin: "",
      // Initialize detail fields to prevent undefined errors
      detailUsaha: {
        jenisUsaha: "",
        namaUsaha: "",
        alamatUsaha: "",
        fotoUsaha: "",
      },
      detailKematian: {
        namaAyah: "",
        namaIbu: "",
        tanggalKematian: "",
        tempatKematian: "",
        sebabKematian: "",
        fileSuratKematian: "",
      },
      detailAhliWaris: {
        namaAlmarhum: "",
        tanggalMeninggal: "",
        alamatTerakhir: "",
        hubunganDenganAlmarhum: "",
      },
    },
  });

  const mutation = useMutation({
    mutationFn: createSurat,
    onSuccess: (data) => {
      console.log("Surat berhasil diajukan:", data);
      form.reset();
      // Add success notification here
    },
    onError: (error) => {
      console.error("Gagal mengajukan surat:", error);
      // Add error notification here
    },
  });

  const handleSubmit = async (data: any) => {
    console.log("Form data being submitted:", data);

    try {
      // Base payload for all surat types
      const payload = {
        idJenisSurat: data.jenisSurat,
        namaLengkap: data.namaLengkap,
        nik: data.nik,
        tempatTanggalLahir: data.tempatTanggalLahir,
        jenisKelamin: data.jenisKelamin,
        agama: data.agama,
        pekerjaan: data.pekerjaan,
        alamat: data.alamat,
        noTelepon: data.noTelepon,
        alasanPengajuan: data.alasan,
        tanggalPengajuan: new Date().toISOString(),
      };

      // Add specific details based on surat type
      if (selectedJenis === "SUKET_USAHA") {
        Object.assign(payload, {
          detailUsaha: { create: data.detailUsaha },
        });
      } else if (selectedJenis === "KEMATIAN") {
        Object.assign(payload, {
          detailKematian: { create: data.detailKematian },
        });
      } else if (selectedJenis === "AHLI_WARIS") {
        Object.assign(payload, {
          detailAhliWaris: { create: data.detailAhliWaris },
        });
      }

      console.log("Final payload:", payload);
      await mutation.mutateAsync(payload);
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  const handleJenisChange = (val: string) => {
    const selected = jenisList.find((j) => j.id === val);
    const selectedKode = selected?.kode ?? null;
    setSelectedJenis(selectedKode);

    // Update schema based on selected type
    let newSchema = baseFormSchema;
    if (selectedKode === "SUKET_USAHA") {
      newSchema = newSchema.extend({ detailUsaha: usahaSchema });
    } else if (selectedKode === "KEMATIAN") {
      newSchema = newSchema.extend({ detailKematian: kematianSchema });
    } else if (selectedKode === "AHLI_WARIS") {
      newSchema = newSchema.extend({ detailAhliWaris: ahliWarisSchema });
    }

    setCurrentSchema(newSchema);
    form.clearErrors();
  };

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

        <FormWrapper schema={currentSchema} form={form} onSubmit={handleSubmit}>
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
            onChange={handleJenisChange}
            control={form.control}
          />

          {/* Conditional forms */}
          {selectedJenis === "SUKET_USAHA" && <FormDetailUsaha />}
          {selectedJenis === "KEMATIAN" && <FormDetailKematian />}
          {selectedJenis === "AHLI_WARIS" && <FormDetailAhliWaris />}

          <CreateOrEditButtons
            submitType="submit"
            cancelLabel="Batal"
            showCancel
            onCancel={() => window.history.back()}
            isLoading={mutation.isPending}
          />
        </FormWrapper>
      </CardContainer>
    </>
  );
}
