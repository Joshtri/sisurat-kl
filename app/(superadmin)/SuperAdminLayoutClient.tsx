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

  // Detect screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close sidebar on outside click
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

  // Close sidebar on escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isSidebarOpen]);

  const handleMobileMenuClick = () => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Mobile Overlay */}
      {isSidebarOpen && isMobile && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              setIsSidebarOpen(false);
            }
          }}
          role="button"
          tabIndex={0}
        />
      )}

      {/* Sidebar */}
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
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="flex-shrink-0 z-10">
          <Header
            userName="Super Admin"
            userRole="SUPERADMIN"
            onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          />
        </div>

        {/* Main Content */}
        <main className="flex-1 bg-gray-50">
          <div className="p-4 sm:p-6 max-w-7xl mx-auto w-full">{children}</div>
        </main>

        {/* Footer */}
        <Footer userRole="SUPERADMIN" />
      </div>
    </div>
  );
}
