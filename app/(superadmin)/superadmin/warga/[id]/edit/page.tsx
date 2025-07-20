// EditWargaPage.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Input, Select, SelectItem } from "@heroui/react";

import { PageHeader } from "@/components/common/PageHeader";
import { CardContainer } from "@/components/common/CardContainer";
import { SkeletonCard } from "@/components/ui/skeleton/SkeletonCard";
import { CreateOrEditButtons } from "@/components/ui/CreateOrEditButtons";
import { getWargaById, updateWarga } from "@/services/wargaService";
import { showToast } from "@/utils/toastHelper";
import { Warga } from "@/interfaces/warga";
import {
  Agama,
  JenisKelaminEnum,
  Pekerjaan,
  StatusHidupEnum,
} from "@/constants/enums";

export default function EditWargaPage() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: warga, isLoading } = useQuery<Warga>({
    queryKey: ["warga", id],
    queryFn: () => getWargaById(id as string),
    enabled: !!id,
  });

  const [formData, setFormData] = useState<Warga | null>(null);

  useEffect(() => {
    if (warga) setFormData(warga);
  }, [warga]);

  const { mutate: editWarga, isPending } = useMutation({
    mutationFn: (data: Warga) =>
      updateWarga(data.id, {
        ...data,
        tanggalLahir: data.tanggalLahir ? new Date(data.tanggalLahir) : null,
      }),
    onSuccess: () => {
      showToast({
        title: "Berhasil",
        description: "Data warga berhasil diperbarui",
        color: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["warga"] });
      router.push("/superadmin/warga");
    },
    onError: () => {
      showToast({
        title: "Gagal",
        description: "Terjadi kesalahan saat menyimpan data",
        color: "error",
      });
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      editWarga(formData);
    }
  };

  return (
    <>
      <PageHeader
        backHref="/superadmin/warga"
        breadcrumbs={[
          { label: "Dashboard", href: "/superadmin" },
          { label: "Warga", href: "/superadmin/warga" },
          { label: "Edit" },
        ]}
      />
      <CardContainer isLoading={isLoading} skeleton={<SkeletonCard rows={8} />}>
        {formData && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                name="namaLengkap"
                label="Nama Lengkap"
                value={formData.namaLengkap}
                onChange={handleChange}
                placeholder="Masukkan Nama Lengkap"
              />
              <Input
                name="nik"
                label="NIK"
                value={formData.nik}
                maxLength={16}
                onChange={handleChange}
                placeholder="Masukkan NIK"
              />
              <Input
                name="tempatLahir"
                label="Tempat Lahir"
                value={formData.tempatLahir}
                onChange={handleChange}
                placeholder="Masukkan Tempat Lahir"
              />
              <Input
                type="date"
                label="Tanggal Lahir"
                name="tanggalLahir"
                value={formData.tanggalLahir?.split("T")[0] || ""}
                onChange={handleChange}
              />
              <Select
                aria-label="jenisKelamin"
                label="Jenis Kelamin"
                name="jenisKelamin"
                selectedKeys={new Set([formData.jenisKelamin])}
                onSelectionChange={(keys) => {
                  const val = Array.from(keys)[0];

                  setFormData((prev) => ({
                    ...prev!,
                    jenisKelamin: val as string,
                  }));
                }}
              >
                {Object.entries(JenisKelaminEnum).map(([key, val]) => (
                  <SelectItem key={val}>{val}</SelectItem>
                ))}
              </Select>
              <Select
                aria-label="pekerjaan"
                label="Pekerjaan"
                name="pekerjaan"
                selectedKeys={new Set([formData.pekerjaan])}
                onSelectionChange={(keys) => {
                  const val = Array.from(keys)[0];

                  setFormData((prev) => ({
                    ...prev!,
                    pekerjaan: val as string,
                  }));
                }}
              >
                {Object.entries(Pekerjaan).map(([key, val]) => (
                  <SelectItem key={val}>{val}</SelectItem>
                ))}
              </Select>
              <Select
                aria-label="agama"
                label="Agama"
                name="agama"
                selectedKeys={new Set([formData.agama])}
                onSelectionChange={(keys) => {
                  const val = Array.from(keys)[0];

                  setFormData((prev) => ({ ...prev!, agama: val as string }));
                }}
              >
                {Object.entries(Agama).map(([key, val]) => (
                  <SelectItem key={val}>{val}</SelectItem>
                ))}
              </Select>
              <Input
                name="noTelepon"
                label="No Telepon"
                value={formData.noTelepon}
                onChange={handleChange}
                placeholder="Masukkan No Telepon"
              />
              {/* <Input
                name="rt"
                label="RT"
                value={formData.rt}
                onChange={handleChange}
                placeholder="Masukkan RT"
              />
              <Input
                name="rw"
                label="RW"
                value={formData.rw}
                onChange={handleChange}
                placeholder="Masukkan RW"
              />
              <Input
                name="alamat"
                label="Alamat"
                value={formData.alamat}
                onChange={handleChange}
                placeholder="Masukkan Alamat"
              /> */}
              <Select
                aria-label="statusHidup"
                label="Status Hidup"
                name="statusHidup"
                selectedKeys={new Set([formData.statusHidup])}
                onSelectionChange={(keys) => {
                  const val = Array.from(keys)[0];

                  setFormData((prev) => ({
                    ...prev!,
                    statusHidup: val as string,
                  }));
                }}
              >
                {Object.entries(StatusHidupEnum).map(([key, val]) => (
                  <SelectItem key={val}>{val}</SelectItem>
                ))}
              </Select>
            </div>

            <div className="flex justify-end pt-6">
              <CreateOrEditButtons
                isLoading={isPending}
                onCancel={() => router.push("/superadmin/warga")}
                showCancel
                cancelLabel="Batal"
                submitType="submit"
              />
            </div>
          </form>
        )}
      </CardContainer>
    </>
  );
}
