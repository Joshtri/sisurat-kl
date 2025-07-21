"use client";

import { useQuery } from "@tanstack/react-query";

import ProfileSkeleton from "./ProfileSkeleton";
import { UserProfileSection } from "./UserProfileSection";
import { WargaProfileSection } from "./WargaProfileSection";
import { RTProfileSection } from "./RTProfileSection";

import { getMe } from "@/services/authService";

export default function ProfileGrid() {
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
  });

  if (isLoading) return <ProfileSkeleton />;

  if (isError || !user) {
    return (
      <div className="text-center text-red-500 py-10">Gagal memuat profil.</div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      <UserProfileSection
        user={{
          username: user.username,
          email: user.email,
          role: user.role,
          numberWhatsApp: user.numberWhatsApp,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        }}
      />

      {user.role === "WARGA" && user.namaLengkap && (
        <WargaProfileSection
          warga={{
            id: user.id,
            namaLengkap: user.namaLengkap,
            nik: user.nik,
            tempatLahir: user.tempatLahir,
            tanggalLahir: user.tanggalLahir,
            jenisKelamin: user.jenisKelamin,
            pekerjaan: user.pekerjaan,
            agama: user.agama,
            noTelepon: user.noTelepon,
            rt: user.rt,
            rw: user.rw,
            alamat: user.alamat,
            statusHidup: user.statusHidup,
            fileKk: user.fileKk,
            fileKtp: user.fileKtp,
            foto: user.foto,
          }}
        />
      )}

      {user.role === "RT" && user.rtProfile && (
        <RTProfileSection
          rtProfile={{
            id: user.rtProfile.id,
            namaLengkap: user.rtProfile.namaLengkap,
            nik: user.rtProfile.nik,
            rt: user.rtProfile.rt,
            rw: user.rtProfile.rw,
            wilayah: user.rtProfile.wilayah,
          }}
        />
      )}
    </div>
  );
}
