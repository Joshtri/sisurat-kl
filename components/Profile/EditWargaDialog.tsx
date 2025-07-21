"use client";

import { Input } from "@heroui/input";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";
import { FormProvider, useForm } from "react-hook-form";

import { CreateOrEditButtons } from "../ui/CreateOrEditButtons";

import { SelectInput } from "@/components/ui/inputs/SelectInput";
import {
  Agama,
  JenisKelaminEnum,
  Pekerjaan,
  StatusHidupEnum,
} from "@/constants/enums";
import { enumToSelectOptions } from "@/utils/enumHelpers";

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
