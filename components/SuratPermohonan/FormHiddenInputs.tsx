"use client";

import { useFormContext } from "react-hook-form";

export function FormHiddenInputs() {
  const { register } = useFormContext();

  return (
    <>
      <input type="hidden" {...register("namaLengkap")} />
      <input type="hidden" {...register("nik")} />
      <input type="hidden" {...register("tempatTanggalLahir")} />
      <input type="hidden" {...register("jenisKelamin")} />
      <input type="hidden" {...register("agama")} />
      <input type="hidden" {...register("pekerjaan")} />
      <input type="hidden" {...register("alamat")} />
      <input type="hidden" {...register("noTelepon")} />
    </>
  );
}
