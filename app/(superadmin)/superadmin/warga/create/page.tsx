"use client";

import { PageHeader } from "@/components/common/PageHeader";
import FormCreateWarga from "@/components/Warga/FormCreateWarga";

export default function CreateWargaPage() {
  return (
    <>
      <PageHeader
        actions={[]}
        backHref="/superadmin/warga"
        breadcrumbs={[
          { label: "Dashboard", href: "/superadmin" },
          { label: "Pengguna", href: "/superadmin/warga" },
          { label: "Buat Baru" },
        ]}
      />

      <FormCreateWarga />
    </>
  );
}
