"use client";

import { Chip } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

import { CardContainer } from "@/components/common/CardContainer";
import { PageHeader } from "@/components/common/PageHeader";
import { ReadOnlyInput } from "@/components/ui/inputs/ReadOnlyInput";
import { SkeletonCard } from "@/components/ui/skeleton/SkeletonCard";

async function getRTDetail(id: string) {
  const res = await fetch(`/api/rt/${id}`);

  if (!res.ok) throw new Error("Gagal memuat detail RT");

  return res.json();
}

export default function DetailRTPage() {
  const { id } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["rt-detail", id],
    queryFn: () => getRTDetail(id as string),
    enabled: !!id,
  });

  const rt = data?.user;
  const profile = data?.rtProfile;
  const kkList = data?.kartuKeluarga ?? [];

  return (
    <>
      <PageHeader
        backHref="/lurah/data-rt"
        breadcrumbs={[
          { label: "Dashboard", href: "/lurah/dashboard" },
          { label: "Manajemen RT", href: "/lurah/data-rt" },
          { label: "Detail Akun RT" },
        ]}
        title="Detail Akun RT"
      />

      <CardContainer isLoading={isLoading} skeleton={<SkeletonCard rows={3} />}>
        {rt && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ReadOnlyInput label="Username" value={rt.username} />
            <ReadOnlyInput label="Email" value={rt.email || "-"} />
            <ReadOnlyInput
              label="Role"
              value={
                <Chip color="warning" variant="flat" className="w-fit">
                  {rt.role}
                </Chip>
              }
            />
          </div>
        )}
      </CardContainer>

      <CardContainer
        title="Profil RT"
        className="mt-6"
        isLoading={isLoading}
        skeleton={<SkeletonCard rows={3} />}
      >
        {profile ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ReadOnlyInput label="NIK" value={profile.nik} />
            <ReadOnlyInput label="RT" value={profile.rt} />
            <ReadOnlyInput label="RW" value={profile.rw || "-"} />
            <ReadOnlyInput label="Wilayah" value={profile.wilayah || "-"} />
          </div>
        ) : (
          <p className="text-gray-500">Profil RT belum tersedia.</p>
        )}
      </CardContainer>

      <CardContainer
        title="Kartu Keluarga di RT ini"
        className="mt-6"
        isLoading={isLoading}
        skeleton={<SkeletonCard rows={4} />}
      >
        {kkList.length > 0 ? (
          <div className="space-y-6">
            {kkList.map((kk: any) => (
              <div
                key={kk.id}
                className="border rounded-lg p-4 space-y-2 shadow-sm bg-gray-50"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ReadOnlyInput label="Nomor KK" value={kk.nomorKK} />
                  <ReadOnlyInput label="Alamat" value={kk.alamat} />
                  <ReadOnlyInput
                    label="Kepala Keluarga"
                    value={
                      kk.kepalaKeluarga?.namaLengkap ||
                      kk.kepalaKeluarga?.user?.username ||
                      "-"
                    }
                  />
                </div>
                <div className="mt-2">
                  <p className="font-semibold mb-1">Anggota:</p>
                  <ul className="list-disc list-inside text-sm text-gray-700">
                    {kk.anggota.map((warga: any) => (
                      <li key={warga.id}>
                        {warga.namaLengkap || warga.user?.username}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">
            Belum ada Kartu Keluarga untuk RT ini.
          </p>
        )}
      </CardContainer>
    </>
  );
}
