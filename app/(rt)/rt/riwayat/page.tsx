import { PageHeader } from "@/components/common/PageHeader";
import React from "react";

export default function RiwayatPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/rt/dashboard" },
          { label: "Riwayat Surat" },
        ]}
      />
    </>
  );
}
