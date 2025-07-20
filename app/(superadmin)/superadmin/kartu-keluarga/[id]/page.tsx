"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@heroui/button";
import { useRouter } from "next/navigation";
import { PencilIcon } from "@heroicons/react/24/outline";

import { getKartuKeluargaById } from "@/services/kartuKeluargaService";
import { PageHeader } from "@/components/common/PageHeader";
import { CardContainer } from "@/components/common/CardContainer";
import { SkeletonCard } from "@/components/ui/skeleton/SkeletonCard";
import { KartuKeluarga } from "@/interfaces/kartu-keluarga";
import { ReadOnlyInput } from "@/components/ui/inputs/ReadOnlyInput";

export default function KartuKeluargaDetailPage() {
  const { id } = useParams();

  const router = useRouter();

  const { data, isLoading } = useQuery<KartuKeluarga>({
    queryKey: ["kartuKeluarga", id],
    queryFn: () => getKartuKeluargaById(id as string),
    enabled: !!id,
  });

  return (
    <>
      <PageHeader
        backHref="/superadmin/kartu-keluarga"
        breadcrumbs={[
          { label: "Dashboard", href: "/superadmin" },
          { label: "Kartu Keluarga", href: "/superadmin/kartu-keluarga" },
          { label: "Detail" },
        ]}
        actions={
          <Button
            variant="flat"
            onPress={() => router.push(`/superadmin/kartu-keluarga/${id}/edit`)}
            startContent={<PencilIcon />}
            size="md"
          >
            Edit
          </Button>
        }
        title={`Detail Kartu Keluarga ${data?.kepalaKeluarga?.namaLengkap || ""}`}
        description="Informasi detail mengenai Kartu Keluarga."
        // titleAlign="center"
      />

      <CardContainer isLoading={isLoading} skeleton={<SkeletonCard rows={6} />}>
        {data && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ReadOnlyInput label="Nomor KK" value={data.nomorKK} />
            <ReadOnlyInput
              label="Kepala Keluarga"
              value={data.kepalaKeluarga?.namaLengkap ?? "-"}
            />
            <ReadOnlyInput label="Alamat" value={data.alamat} />
            <ReadOnlyInput label="RT" value={data.rt || "-"} />
            <ReadOnlyInput label="RW" value={data.rw || "-"} />
            <ReadOnlyInput
              label="Tanggal Dibuat"
              value={new Date(data.createdAt).toLocaleDateString("id-ID")}
            />
          </div>
        )}
      </CardContainer>
    </>
  );
}
