"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { PageHeader } from "@/components/common/PageHeader";
import { CardContainer } from "@/components/common/CardContainer";
import { SkeletonCard } from "@/components/ui/skeleton/SkeletonCard";
import { getWargaById } from "@/services/wargaService";
import FormEditWarga from "@/components/Warga/FormEditWarga";
import { Warga } from "@/interfaces/warga";

export default function EditWargaPage() {
  const { id } = useParams();

  const { data: warga, isLoading } = useQuery<Warga>({
    queryKey: ["warga", id],
    queryFn: () => getWargaById(id as string),
    enabled: !!id,
  });

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
        {warga && <FormEditWarga initialData={warga} />}
      </CardContainer>
    </>
  );
}
