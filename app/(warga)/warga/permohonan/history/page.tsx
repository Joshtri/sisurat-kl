import React from "react";

import { PageHeader } from "@/components/common/PageHeader";

export default function HistorySuratPermohonanPage() {
  return (
    <PageHeader
      title="Riwayat Permohonan"
      description="Berikut adalah riwayat permohonan surat Anda."
      breadcrumbs={[
        { label: "Dashboard", href: "/warga/dashboard" },
        { label: "Permohonan Surat", href: "/warga/dashboard" },
        { label: "Riwayat Permohonan" },
      ]}
    />
  );
}
