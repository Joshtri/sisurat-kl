"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Input, Textarea } from "@heroui/input";
import { useForm, FormProvider } from "react-hook-form";

import { SelectInput } from "@/components/ui/inputs/SelectInput";
import {
  JenisKelaminEnum,
  Pekerjaan,
  Agama,
  StatusHidupEnum,
} from "@/constants/enums";
import { enumToSelectOptions } from "@/utils/enumHelpers";
import { CreateOrEditButtons } from "../ui/CreateOrEditButtons";

export function EditWargaDialog({
  open,
  onClose,
  warga,
}: {
  open: boolean;
  onClose: () => void;
  warga: any;
}) {
  const methods = useForm({
    defaultValues: {
      namaLengkap: warga.namaLengkap,
      tempatLahir: warga.tempatLahir ?? "",
      tanggalLahir: warga.tanggalLahir ?? "",
      jenisKelamin: warga.jenisKelamin,
      pekerjaan: warga.pekerjaan ?? "",
      agama: warga.agama ?? "",
      noTelepon: warga.noTelepon ?? "",
      rt: warga.rt ?? "",
      rw: warga.rw ?? "",
      alamat: warga.alamat ?? "",
      statusHidup: warga.statusHidup,
    },
  });

  const { register, handleSubmit } = methods;

  const onSubmit = (formData: any) => {
    console.log("UPDATE WARGA:", formData);
    onClose();
  };

  return (
    <Modal isOpen={open} onClose={onClose}>
      <ModalContent>
        <ModalHeader>Edit Profil Warga</ModalHeader>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalBody className="grid grid-cols-3 sm:grid-cols-2 gap-4">
              <Input
                label="Nama Lengkap"
                {...register("namaLengkap")}
                placeholder="Masukkan nama lengkap"
              />

              <Input
                label="Tempat Lahir"
                {...register("tempatLahir")}
                placeholder="Masukkan tempat lahir"
              />

              <Input
                label="Tanggal Lahir"
                type="date"
                {...register("tanggalLahir")}
              />

              <SelectInput
                name="jenisKelamin"
                label="Jenis Kelamin"
                options={enumToSelectOptions(JenisKelaminEnum, {
                  LAKI_LAKI: "Laki-laki",
                  PEREMPUAN: "Perempuan",
                })}
              />

              <SelectInput
                name="pekerjaan"
                label="Pekerjaan"
                options={enumToSelectOptions(Pekerjaan)}
              />

              <SelectInput
                name="agama"
                label="Agama"
                options={enumToSelectOptions(Agama)}
              />

              <Input
                label="No Telepon"
                {...register("noTelepon")}
                placeholder="08xxxxxxxx"
              />

              <Input label="RT" {...register("rt")} placeholder="contoh: 01" />
              <Input label="RW" {...register("rw")} placeholder="contoh: 02" />

              <Textarea
                label="Alamat"
                {...register("alamat")}
                placeholder="Masukkan alamat lengkap"
                className="sm:col-span-2"
              />

              <SelectInput
                name="statusHidup"
                label="Status Hidup"
                options={enumToSelectOptions(StatusHidupEnum)}
              />
            </ModalBody>

            <ModalFooter className="flex justify-end space-x-2 pt-4">
              <CreateOrEditButtons
                onCancel={onClose}
                isEditMode={true}
                isLoading={false}
                showCancel={true}
                submitType="submit"
              />
              {/* <button
                type="button"
                onClick={onClose}
                className="text-gray-600 px-4 py-2"
              >
                Batal
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Simpan
              </button> */}
            </ModalFooter>
          </form>
        </FormProvider>
      </ModalContent>
    </Modal>
  );
}
