"use client";

import { useQuery } from "@tanstack/react-query";

import { getMe } from "@/services/authService";
import { ReadOnlyInput } from "@/components/ui/inputs/ReadOnlyInput";

export default function UserProfilPreview() {
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
  });

  if (isLoading)
    return <p className="text-sm text-gray-500">Memuat profil...</p>;

  if (isError || !user)
    return <p className="text-sm text-red-500">Gagal memuat data profil.</p>;

  console.log("🟢 Data user:", user);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      <ReadOnlyInput label="Nama Lengkap" value={user.namaLengkap} />
      <ReadOnlyInput label="NIK" value={user.nik} />
      <ReadOnlyInput
        label="Tempat, Tanggal Lahir"
        value={`${user.tempatLahir}, ${
          user.tanggalLahir
            ? new Date(user.tanggalLahir).toLocaleDateString("id-ID")
            : ""
        }`}
      />
      <ReadOnlyInput label="Jenis Kelamin" value={user.jenisKelamin} />
      <ReadOnlyInput label="Agama" value={user.agama} />
      <ReadOnlyInput label="Pekerjaan" value={user.pekerjaan} />
      <ReadOnlyInput label="Alamat" value={user.alamat} />
    </div>
  );
}
