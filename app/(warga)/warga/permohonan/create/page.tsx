"use client";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { JenisSurat } from "@prisma/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import * as z from "zod";
import { useState } from "react";
import { DocumentTextIcon } from "@heroicons/react/24/outline";
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
import DynamicSuratDetailForm from "@/components/SuratPermohonan/DynamicSuratDetailForm";

const formSchema = z
  .object({
    idJenisSurat: z.string().min(1, "Jenis surat wajib diisi"),
    alasanPengajuan: z.string().min(5, "Alasan harus lebih dari 5 karakter"),
  })
  .passthrough(); // ← penting agar field tambahan tetap ditangkap

export default function CreateSuratPermohonanPage() {
  const router = useRouter();
  const [selectedJenisSurat, setSelectedJenisSurat] =
    useState<JenisSurat | null>(null);
  const [detailSurat, setDetailSurat] = useState<Record<string, any> | null>(
    null,
  );

  const { data: jenisList = [], isLoading } = useQuery({
    queryKey: ["jenis-surat"],
    queryFn: getAllJenisSurat,
  });

  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
  });

  const isSuratKelahiran = selectedJenisSurat?.kode === "SURAT_KELAHIRAN";
  const isOrangTua =
    user?.peranDalamKk === "KEPALA_KELUARGA" || user?.peranDalamKk === "ISTRI";
  const isBlockedKelahiran = isSuratKelahiran && !isOrangTua;

  const isSuratSktm = selectedJenisSurat?.kode === "sktm"; // atau kode lain sesuai database
  const isBlockedSktm = isSuratSktm && !isOrangTua;

  // Fixed: Uncommented and corrected the surat orang tua logic
  const isSuratOrangTua = selectedJenisSurat?.kode === "suket_ortu";
  const isBlockedOrtu = isSuratOrangTua && user?.peranDalamKk !== "ANAK";

  const methods = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = methods;

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

  const onSubmit = async (formData: any) => {
    const { idJenisSurat, alasanPengajuan, ...rest } = formData;

    // Ambil hanya field dalam dataSurat yang valid
    const dataSurat = rest?.dataSurat ?? {};

    const filteredDataSurat = Object.fromEntries(
      Object.entries(dataSurat).filter(([_, v]) => v !== "" && v != null),
    );

    const statusPerkawinanOtomatis =
      user?.jenisKelamin === "PEREMPUAN" ? "Janda" : "Duda";

    if (selectedJenisSurat?.kode === "janda_duda") {
      filteredDataSurat.statusPerkawinan = statusPerkawinanOtomatis;
    }

    const payload = {
      idJenisSurat,
      alasanPengajuan,
      dataSurat: filteredDataSurat,
    };

    await mutateAsync(payload);
  };

  const watchedValues = watch();
  const isFormValid =
    !!watchedValues.idJenisSurat &&
    (watchedValues.alasanPengajuan?.length ?? 0) >= 5;

  const handleJenisSuratChange = (keys: Set<string>) => {
    const selectedKey = Array.from(keys)[0] as string;

    console.log("Selected key:", selectedKey);
    setValue("idJenisSurat", selectedKey);
    const selected = jenisList.find((j) => j.id === selectedKey);

    setSelectedJenisSurat(selected ?? null);
    console.log("Selected jenis surat:", selected);
  };

  // Enhanced debugging
  console.log("=== DEBUGGING INFO ===");
  console.log("kartuKeluargaId", user?.kartuKeluargaId);
  console.log("selectedJenisSurat?.kode", selectedJenisSurat?.kode);
  console.log("user?.peranDalamKk", user?.peranDalamKk);
  console.log("isBlockedOrtu", isBlockedOrtu);
  console.log("watchedValues", watchedValues);
  console.log("watchedValues.idJenisSurat", watchedValues.idJenisSurat);
  console.log("!!watchedValues.idJenisSurat", !!watchedValues.idJenisSurat);
  console.log("watchedValues.alasanPengajuan", watchedValues.alasanPengajuan);
  console.log("alasanPengajuan length", watchedValues.alasanPengajuan?.length);
  console.log(
    "alasanPengajuan >= 5",
    (watchedValues.alasanPengajuan?.length ?? 0) >= 5,
  );
  console.log("isFormValid", isFormValid);
  console.log("form errors", errors);
  console.log("=== END DEBUGGING ===");

  if (isLoadingUser) {
    return (
      <Card>
        <CardBody className="flex items-center justify-center py-12">
          <Spinner size="lg" />
          <p className="mt-4 text-default-500">Memuat data pengguna...</p>
        </CardBody>
      </Card>
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
        <Alert color="primary" variant="flat">
          Data profil Anda akan otomatis digunakan untuk permohonan surat ini.
        </Alert>

        <UserProfilPreview />

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
              </div>
            </div>
          </CardHeader>

          <Divider />

          <CardBody className="pt-6">
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Select
                  label="Jenis Surat"
                  placeholder="Pilih jenis surat"
                  labelPlacement="outside"
                  variant="bordered"
                  radius="md"
                  size="lg"
                  isLoading={isLoading}
                  isInvalid={!!errors.idJenisSurat}
                  errorMessage={errors.idJenisSurat?.message}
                  onSelectionChange={handleJenisSuratChange}
                  selectedKeys={
                    watchedValues.idJenisSurat
                      ? new Set([watchedValues.idJenisSurat])
                      : new Set()
                  }
                >
                  {jenisList.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.nama}
                    </SelectItem>
                  ))}
                </Select>

                {isBlockedKelahiran && (
                  <Alert color="danger" variant="flat">
                    Hanya orang tua (kepala keluarga atau istri) yang dapat
                    mengajukan surat kelahiran.
                  </Alert>
                )}

                {isBlockedSktm && (
                  <Alert color="danger" variant="flat">
                    Hanya orang tua (kepala keluarga atau istri) yang dapat
                    mengajukan surat keterangan tidak mampu.
                  </Alert>
                )}

                {isBlockedOrtu && (
                  <Alert color="danger" variant="flat">
                    Hanya anak yang dapat mengajukan surat keterangan orang tua.
                  </Alert>
                )}

                <Textarea
                  {...register("alasanPengajuan")}
                  label="Alasan Pengajuan"
                  placeholder="Contoh: Keperluan administrasi untuk melamar pekerjaan"
                  variant="bordered"
                  radius="md"
                  size="lg"
                  minRows={4}
                  isInvalid={!!errors.alasanPengajuan}
                  errorMessage={errors.alasanPengajuan?.message}
                />

                {/* Form Tambahan */}
                <DynamicSuratDetailForm
                  kartuKeluargaId={user?.kartuKeluargaId}
                  userId={user?.id}
                  kodeJenisSurat={selectedJenisSurat?.kode || ""}
                />

                <Divider />

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
                    isDisabled={
                      !isFormValid ||
                      isPending ||
                      isBlockedKelahiran ||
                      isBlockedSktm ||
                      isBlockedOrtu
                    }
                  >
                    {isPending ? "Mengirim..." : "Ajukan Surat"}
                  </Button>
                </div>
              </form>
            </FormProvider>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
