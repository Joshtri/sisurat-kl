// import ProfileGrid from "@/components/Profile/ProfileGrid";
import React from "react";

import { PageHeader } from "@/components/common/PageHeader";
import ProfileGrid from "@/components/Profile/ProfileGrid";

export default function ProfilePage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/warga/dashboard" },
          { label: "Profil" },
        ]}
        title="Profil Warga"
      />
      <ProfileGrid />
    </>
  );
}
