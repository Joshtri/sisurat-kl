// ===============================================

// SuperAdminLayoutClient.tsx (Enhanced with Mobile Auto-Close)
"use client";

import { useState, useEffect } from "react";

import Header from "@/components/partials/Header";
import Footer from "@/components/partials/Footer";
import Sidebar from "@/components/partials/Sidebar";

export default function SuperAdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById("mobile-sidebar");
      const toggleButton = document.getElementById("sidebar-toggle");

      if (
        isSidebarOpen &&
        sidebar &&
        !sidebar.contains(event.target as Node) &&
        toggleButton &&
        !toggleButton.contains(event.target as Node)
      ) {
        setIsSidebarOpen(false);
      }
    };

    if (isSidebarOpen && isMobile) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen, isMobile]);

  // Close sidebar on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isSidebarOpen]);

  // Handler for mobile menu click
  const handleMobileMenuClick = () => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile Overlay */}
      {isSidebarOpen && isMobile && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Fixed Position */}
      <div
        id="mobile-sidebar"
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 z-40 w-64 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:block lg:flex-shrink-0`}
      >
        <Sidebar
          userRole="SUPERADMIN"
          isMobile={isMobile}
          onMobileMenuClick={handleMobileMenuClick}
        />
      </div>

      {/* Main Layout */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Header - Fixed at top */}
        <div className="flex-shrink-0 z-10">
          <Header
            userName="Super Admin"
            userRole="SUPERADMIN"
            onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          />
        </div>

        {/* Main Content - Scrollable */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-4 sm:p-6">
            <div className="max-w-7xl mx-auto w-full">{children}</div>
          </div>
        </main>

        {/* Footer - Fixed at bottom */}
        <div className="flex-shrink-0">
          <Footer userRole="SUPERADMIN" />
        </div>
      </div>
    </div>
  );
}
