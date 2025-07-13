import { PageHeader } from "@/components/common/PageHeader";
import ProfileGrid from "@/components/Profile/ProfileGrid";
import React from "react";

export default function ProfilePage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/staff/dashboard" },
          { label: "Profil" },
        ]}
        title="Profil Staff"
      />
      <ProfileGrid />
    </>
  );
}
