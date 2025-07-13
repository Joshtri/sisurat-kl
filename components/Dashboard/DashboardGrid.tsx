import React from "react";

import DashboardSuperAdmin from "./SuperAdmin/DashboardSuperAdmin";

export default function DashboardGrid() {
  return (
    <>
      {/* in this dashboard grid we can add multiple dashboard components and the logic was on here, if the role user was war or else */}
      <DashboardSuperAdmin />
    </>
  );
}
