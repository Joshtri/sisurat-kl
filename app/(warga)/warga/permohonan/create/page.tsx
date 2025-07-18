"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { JenisSurat } from "@prisma/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  DocumentTextIcon,
  PaperAirplaneIcon
} from "@heroicons/react/24/outline";
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Select,
  SelectItem,
  Spinner,
  Textarea,
} from "@heroui/react";

import { PageHeader } from "@/components/common/PageHeader";
import UserProfilPreview from "@/components/SuratPermohonan/UserProfilPreview";
import { getMe } from "@/services/authService";
import { getAllJenisSurat } from "@/services/jenisSuratService";
import { createSurat } from "@/services/suratService";
import { showToast } from "@/utils/toastHelper";

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
      !jenis.nama.toLowerCase().includes("ahli waris") &&
      !jenis.nama.toLowerCase().includes("orang tua"),
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
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

  const watchedValues = watch();
  const isFormValid =
    watchedValues.idJenisSurat && watchedValues.alasanPengajuan?.length >= 5;

  if (isLoadingUser) {
    return (
      <>
        <PageHeader
          title="Buat Permohonan"
          description="Silakan isi formulir berikut untuk membuat permohonan surat."
          breadcrumbs={[
            { label: "Dashboard", href: "/warga/dashboard" },
            { label: "Permohonan Surat", href: "/warga/permohonan/create" },
            { label: "Buat Permohonan" },
          ]}
        />
        <Card>
          <CardBody className="flex items-center justify-center py-12">
            <Spinner size="lg" />
            <p className="mt-4 text-default-500">Memuat data pengguna...</p>
          </CardBody>
        </Card>
      </>
    );
  }

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

      <div className="space-y-6">
        {/* Info Alert */}
        <Alert
          color="primary"
          variant="flat"
          // startContent={<CheckCircleIcon className="h-5 w-5" />}
        >
          {/* <Alert> */}
          Data profil Anda akan otomatis digunakan untuk permohonan surat ini.
          Pastikan data profil Anda sudah benar dan lengkap.
          {/* </Alert> */}
        </Alert>

        {/* User Profile Preview */}
        <UserProfilPreview />

        {/* Form Card */}
        <Card className="shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <DocumentTextIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Formulir Permohonan Surat
                </h3>
                <p className="text-sm text-default-500">
                  Lengkapi informasi di bawah ini untuk mengajukan permohonan
                  surat
                </p>
              </div>
            </div>
          </CardHeader>

          <Divider />

          <CardBody className="pt-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Jenis Surat Selection */}
              <div className="space-y-2">
                <Select
                  label="Jenis Surat"
                  placeholder="Pilih jenis surat yang ingin diajukan"
                  labelPlacement="outside"
                  variant="bordered"
                  radius="md"
                  size="lg"
                  isLoading={isLoading}
                  isInvalid={!!errors.idJenisSurat}
                  errorMessage={errors.idJenisSurat?.message}
                  startContent={
                    <DocumentTextIcon className="h-5 w-5 text-default-400" />
                  }
                  classNames={{
                    trigger: "min-h-14",
                    label: "font-medium text-default-700",
                  }}
                  onSelectionChange={(keys) => {
                    const selectedKey = Array.from(keys)[0] as string;
                    setValue("idJenisSurat", selectedKey);
                  }}
                >
                  {nonDetailSuratList.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.nama}
                    </SelectItem>
                  ))}
                </Select>
              </div>

              {/* Alasan Pengajuan */}
              <div className="space-y-2">
                <Textarea
                  {...register("alasanPengajuan")}
                  label="Alasan Pengajuan"
                  placeholder="Contoh: Keperluan administrasi untuk melamar pekerjaan"
                  labelPlacement="outside"
                  variant="bordered"
                  radius="md"
                  size="lg"
                  minRows={4}
                  maxRows={6}
                  isInvalid={!!errors.alasanPengajuan}
                  errorMessage={errors.alasanPengajuan?.message}
                  classNames={{
                    label: "font-medium text-default-700",
                    input: "resize-none",
                  }}
                  description="Jelaskan alasan atau keperluan Anda mengajukan surat ini (minimal 5 karakter)"
                />
              </div>

              {/* Warning for incomplete form */}
              {!isFormValid && (
                <Alert
                  color="warning"
                  variant="flat"
                  // startContent={<ExclamationTriangleIcon className="h-5 w-5" />}
                >
                  {/* <Alert> */}
                  Pastikan semua field sudah terisi dengan benar sebelum
                  mengajukan permohonan.
                  {/* </Alert> */}
                </Alert>
              )}

              <Divider />

              {/* Submit Button */}
              <div className="flex justify-end gap-3">
                <Button
                  color="default"
                  variant="flat"
                  size="lg"
                  onPress={() => router.back()}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  size="lg"
                  isLoading={isPending}
                  isDisabled={!isFormValid || isPending}
                  startContent={
                    !isPending && <PaperAirplaneIcon className="h-5 w-5" />
                  }
                  className="min-w-32"
                >
                  {isPending ? "Mengirim..." : "Ajukan Surat"}
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>

        {/* Additional Info */}
        {/* <Card className="bg-default-50">
          <CardBody>
            <div className="text-center">
              <h4 className="font-semibold text-default-700 mb-2">
                Informasi Penting
              </h4>
              <p className="text-sm text-default-600">
                Setelah mengajukan permohonan, Anda dapat memantau status
                permohonan melalui halaman{" "}
                <span className="font-medium text-primary">
                  Riwayat Permohonan
                </span>
                . Proses verifikasi memerlukan waktu 1-3 hari kerja.
              </p>
            </div>
          </CardBody>
        </Card> */}
      </div>
    </>
  );
}
