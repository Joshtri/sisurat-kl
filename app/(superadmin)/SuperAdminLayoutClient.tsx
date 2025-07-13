"use client";

import { useState } from "react";
import Header from "@/components/partials/Header";
import Footer from "@/components/partials/Footer";
import Sidebar from "@/components/partials/Sidebar";

export default function SuperAdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="relative flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "block" : "hidden"
        } fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg lg:static lg:block`}
      >
        <Sidebar userRole="SUPERADMIN" />
      </div>

      {/* Main Layout */}
      <div className="flex-1 flex flex-col">
        <Header
          userName="Super Admin"
          userRole="SUPERADMIN"
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        />

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>

        <Footer userRole="SUPERADMIN" />
      </div>
    </div>
  );
}
