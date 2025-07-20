import React from "react";

import { PageHeader } from "@/components/common/PageHeader";
import ProfileGrid from "@/components/Profile/ProfileGrid";

export default function ProfilePage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/rt/dashboard" },
          { label: "Profil" },
        ]}
        backHref="/rt/dashboard"
        title="Profil RT"
      />
      <ProfileGrid />
    </>
  );
}
