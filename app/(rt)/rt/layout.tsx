// RTLayout.tsx (Responsive)
"use client";

import { useState, useEffect } from "react";

import "@/styles/globals.css";
import Header from "@/components/partials/Header";
import Footer from "@/components/partials/Footer";
import Sidebar from "@/components/partials/Sidebar";

export default function RTLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

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

  return (
    <div className="relative flex min-h-screen">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar khusus RT */}
      <div
        id="mobile-sidebar"
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:block`}
      >
        <Sidebar userRole="RT" />
      </div>

      {/* Main Layout */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          userName="RT User"
          userRole="RT"
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        />

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto w-full">{children}</div>
        </main>

        <Footer userRole="RT" />
      </div>
    </div>
  );
}
