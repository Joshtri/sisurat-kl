"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { JenisSurat } from "@prisma/client";
import * as z from "zod";

import { PageHeader } from "@/components/common/PageHeader";
import { CardContainer } from "@/components/common/CardContainer";
import { getAllJenisSurat } from "@/services/jenisSuratService";
import { createSurat } from "@/services/suratService";
import { showToast } from "@/utils/toastHelper";
import UserProfilPreview from "@/components/SuratPermohonan/UserProfilPreview";
import { getMe } from "@/services/authService";

const formSchema = z.object({
  idJenisSurat: z.string().min(1, "Jenis surat wajib diisi"),
  alasanPengajuan: z.string().min(5, "Alasan harus lebih dari 5 karakter"),
});

export default function CreateSuratPermohonanPage() {
  const router = useRouter();

  const { data: jenisList = [], isLoading } = useQuery<JenisSurat[]>({
    queryKey: ["jenis-surat"],
    queryFn: getAllJenisSurat,
  });
  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
  });

  const nonDetailSuratList = jenisList.filter(
    (jenis) =>
      !jenis.nama.toLowerCase().includes("usaha") &&
      !jenis.nama.toLowerCase().includes("kematian") &&
      !jenis.nama.toLowerCase().includes("ahli waris")
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createSurat,
    onSuccess: () => {
      showToast({
        title: "Berhasil mengajukan surat",
        description: "Surat Anda telah berhasil diajukan.",
        color: "success",
      });
      router.push("/warga/dashboard");
    },
    onError: () => {
      showToast({
        title: "Gagal mengajukan surat",
        description:
          "Terjadi kesalahan saat mengajukan surat. Silakan coba lagi.",
        color: "error",
      });
    },
  });

  const onSubmit = async (formData: z.infer<typeof formSchema>) => {
    if (!user) return;

    const {
      id: idPemohon,
      namaLengkap,
      nik,
      jenisKelamin,
      tempatLahir,
      tanggalLahir,
      agama,
      pekerjaan,
      alamat,
      noTelepon,
    } = user;

    const tempatTanggalLahir = `${tempatLahir}, ${new Date(
      tanggalLahir
    ).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })}`;

    const payload = {
      ...formData,
      idPemohon,
      namaLengkap,
      nik,
      jenisKelamin,
      tempatTanggalLahir,
      agama,
      pekerjaan,
      alamat,
      noTelepon,
    };

    await mutateAsync(payload);
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <UserProfilPreview />

          <div>
            <label className="block text-sm font-medium">Jenis Surat</label>
            <select
              {...register("idJenisSurat")}
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
            >
              <option value="">Pilih jenis surat</option>
              {nonDetailSuratList.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nama}
                </option>
              ))}
            </select>
            {errors.idJenisSurat && (
              <p className="text-sm text-red-600">
                {errors.idJenisSurat.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">
              Alasan Pengajuan
            </label>
            <textarea
              {...register("alasanPengajuan")}
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
              rows={3}
              placeholder="Contoh: Keperluan administrasi"
            />
            {errors.alasanPengajuan && (
              <p className="text-sm text-red-600">
                {errors.alasanPengajuan.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isPending ? "Mengirim..." : "Ajukan Surat"}
          </button>
        </form>
      </CardContainer>
    </>
  );
}
