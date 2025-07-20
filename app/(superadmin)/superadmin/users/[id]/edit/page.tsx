import React from "react";

import { CardContainer } from "@/components/common/CardContainer";
import { PageHeader } from "@/components/common/PageHeader";

export default function UsersEditPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/superadmin" },
          { label: "Pengguna", href: "/superadmin/users" },
          { label: "Edit Pengguna" },
        ]}
        backHref="/superadmin/users"
        title="Edit Pengguna"
      />

      <CardContainer>
        <p className="p-4">Formulir edit pengguna akan ditempatkan di sini.</p>
      </CardContainer>
    </>
  );
}
