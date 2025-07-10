import React from "react";

import { PageHeader } from "@/components/common/PageHeader";

export default function UsersDetailPage() {
  return (
    <>
      <PageHeader
        actions={[]}
        backHref="/superadmin/users"
        breadcrumbs={[
          { label: "Dashboard", href: "/superadmin" },
          { label: "Pengguna", href: "/superadmin/users" },
          { label: "Detail Pengguna" },
        ]}
      />
    </>
  );
}
