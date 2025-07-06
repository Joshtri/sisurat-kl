"use client";

import { useState } from "react";
import { Button } from "@heroui/button";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

import Header from "@/components/partials/Header";
import Footer from "@/components/partials/Footer";
import Sidebar from "@/components/partials/Sidebar";

interface LayoutWithSidebarProps {
  children: React.ReactNode;
  userRole: "WARGA" | "STAFF" | "LURAH" | "SUPERADMIN";
  userName: string;
}

export default function LayoutWithSidebar({
  children,
  userRole,
  userName,
}: LayoutWithSidebarProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] =
    useState(false);

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const toggleDesktopSidebar = () => {
    setIsDesktopSidebarCollapsed(!isDesktopSidebarCollapsed);
  };

  return (
    <div className="relative flex min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div
          aria-label="Close sidebar"
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300"
          role="button"
          tabIndex={0}
          onClick={toggleMobileSidebar}
          onKeyDown={(e) => {
            if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
              toggleMobileSidebar();
            }
          }}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full z-50 lg:hidden transform transition-transform duration-300 ease-in-out ${
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar userRole={userRole} />
        <Button
          isIconOnly
          className="absolute -right-12 top-4 bg-white shadow-lg text-gray-600 hover:text-gray-800"
          size="sm"
          onClick={toggleMobileSidebar}
        >
          <XMarkIcon className="w-5 h-5" />
        </Button>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          isCollapsed={isDesktopSidebarCollapsed}
          userRole={userRole}
          onToggleCollapse={toggleDesktopSidebar}
        />
      </div>

      {/* Main Layout */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between p-4 lg:hidden bg-white border-b border-gray-200">
          <Button
            isIconOnly
            className="text-gray-600 hover:text-gray-800"
            variant="light"
            onClick={toggleMobileSidebar}
          >
            <Bars3Icon className="w-6 h-6" />
          </Button>
          <h1 className="font-semibold text-gray-900">SI SURAT</h1>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>

        <Header userName={userName} userRole={userRole} />

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>

        <Footer userRole={userRole} />
      </div>
    </div>
  );
}
