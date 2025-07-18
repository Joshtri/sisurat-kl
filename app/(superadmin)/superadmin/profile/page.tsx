import React from "react";

import { PageHeader } from "@/components/common/PageHeader";
import ProfileGrid from "@/components/Profile/ProfileGrid";

export default function ProfilePage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/superadmin/dashboard" },
          { label: "Profil" },
        ]}
        title="Profil Superadmin"
      />
      <ProfileGrid />
    </>
  );
}
