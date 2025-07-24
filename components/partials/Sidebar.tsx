"use client";

import type { MenuItem } from "@/config/sidebarMenus";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Link } from "@heroui/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useIsMobile } from "@/hooks/useIsMobile"; // ⬅️ Tambahkan ini

import { sidebarMenus } from "@/config/sidebarMenus";

interface SidebarProps {
  userRole: "WARGA" | "STAFF" | "LURAH" | "SUPERADMIN" | "RT";
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  className?: string;
}

export default function Sidebar({
  userRole,
  isCollapsed = false,
  onToggleCollapse,
  className = "",
}: SidebarProps) {
  const pathname = usePathname();
  const [expandedSubmenus, setExpandedSubmenus] = useState<string[]>([]);

  const toggleSubmenu = (menuTitle: string) => {
    setExpandedSubmenus((prev) =>
      prev.includes(menuTitle)
        ? prev.filter((item) => item !== menuTitle)
        : [...prev, menuTitle],
    );
  };

  const menuItems: MenuItem[] = sidebarMenus[userRole] ?? [];

  // Function to check if a menu item is active
  const isMenuItemActive = (item: MenuItem): boolean => {
    // Check if current path matches the item's href
    if (item.href && pathname === item.href) {
      return true;
    }

    // Check if current path matches any submenu item
    if (item.submenu && item.submenu.length > 0) {
      return item.submenu.some((subItem) => pathname === subItem.href);
    }

    // Special case for dashboard - if pathname is exactly the dashboard route
    if (
      item.title.toLowerCase() === "dashboard" &&
      (pathname === "/warga/dashboard" ||
        pathname === "/staff/dashboard" ||
        pathname === "/lurah/dashboard" ||
        pathname === "/superadmin/dashboard" ||
        pathname === "/rt/dashboard")
    ) {
      return true;
    }

    return false;
  };

  // Function to check if a submenu item is active
  const isSubmenuItemActive = (href: string): boolean => {
    return pathname === href;
  };

  // Auto-expand submenu if it contains active item
  useEffect(() => {
    menuItems.forEach((item) => {
      if (
        item.submenu &&
        item.submenu.some((subItem) => pathname === subItem.href)
      ) {
        setExpandedSubmenus((prev) =>
          prev.includes(item.title) ? prev : [...prev, item.title],
        );
      }
    });
  }, [pathname, menuItems]);

  return (
    <aside
      className={`bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900
    border-r border-blue-700/50 transition-all duration-500 ease-out
    flex flex-col shadow-2xl
    ${isCollapsed ? "w-16" : "w-64"}
    ${className}
    h-full  
    fixed z-40 top-16 bottom-0 lg:static pt-0 lg:pt-0
  `}
    >
      {/* Header */}
      <div className="p-4 border-b border-blue-600/30 bg-gradient-to-r from-blue-800/50 to-blue-700/50 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          {onToggleCollapse && (
            <Button
              isIconOnly
              className="text-blue-200 hover:text-white hover:bg-blue-700/50 transition-all duration-300 hover:scale-110"
              size="sm"
              variant="light"
              onClick={onToggleCollapse}
            >
              {isCollapsed ? (
                <ChevronRightIcon className="w-4 h-4 transition-transform duration-300 hover:translate-x-1" />
              ) : (
                <ChevronLeftIcon className="w-4 h-4 transition-transform duration-300 hover:-translate-x-1" />
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-2 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item, index) => {
            const isActive = isMenuItemActive(item);
            const hasSubmenu = item.submenu && item.submenu.length > 0;
            const isSubmenuExpanded = expandedSubmenus.includes(item.title);

            return (
              <li
                key={item.title}
                className={`animate-in slide-in-from-left duration-300 ${!isCollapsed ? `delay-${index * 50 + 200}` : ""}`}
                style={{
                  animationDelay: !isCollapsed
                    ? `${index * 50 + 200}ms`
                    : "0ms",
                }}
              >
                <div className="relative group">
                  {hasSubmenu ? (
                    <button
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-300 group/button transform hover:scale-[1.02] hover:shadow-lg ${
                        isActive
                          ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white border border-blue-400/50 shadow-lg"
                          : "text-blue-100 hover:bg-gradient-to-r hover:from-blue-700/50 hover:to-blue-600/50 hover:text-white hover:shadow-md"
                      }`}
                      onClick={() => {
                        if (!isCollapsed) {
                          toggleSubmenu(item.title);
                        }
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <item.icon
                            className={`w-5 h-5 transition-all duration-300 group/button-hover:scale-110 ${
                              isActive
                                ? "text-white"
                                : "text-blue-200 group/button-hover:text-white"
                            }`}
                          />
                          {isActive && (
                            <div className="absolute -inset-1 bg-blue-300 rounded-full opacity-30 animate-pulse" />
                          )}
                        </div>
                        {!isCollapsed && (
                          <span className="font-medium text-sm transition-all duration-300">
                            {item.title}
                          </span>
                        )}
                      </div>

                      {!isCollapsed && (
                        <div className="flex items-center space-x-2">
                          {item.badge && (
                            <Chip
                              className="animate-in zoom-in duration-300 hover:scale-110 transition-transform"
                              color="danger"
                              size="sm"
                              variant="flat"
                            >
                              {item.badge}
                            </Chip>
                          )}
                          <ChevronRightIcon
                            className={`w-4 h-4 transition-all duration-300 ${
                              isSubmenuExpanded
                                ? "rotate-90 text-white"
                                : "group/button-hover:translate-x-1 text-blue-200"
                            }`}
                          />
                        </div>
                      )}

                      {/* Hover effect line */}
                      <div
                        className={`absolute left-0 top-0 bottom-0 w-1 bg-blue-300 transition-all duration-300 ${
                          isActive
                            ? "opacity-100"
                            : "opacity-0 group/button-hover:opacity-100"
                        } rounded-r-full`}
                      />
                    </button>
                  ) : (
                    <Link
                      className={`flex items-center p-3 rounded-lg transition-all duration-300 group/link transform hover:scale-[1.02] hover:shadow-lg relative overflow-hidden ${
                        isActive
                          ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white border border-blue-400/50 shadow-lg"
                          : "text-blue-100 hover:bg-gradient-to-r hover:from-blue-700/50 hover:to-blue-600/50 hover:text-white hover:shadow-md"
                      }`}
                      href={item.href}
                    >
                      <div className="relative">
                        <item.icon
                          className={`w-5 h-5 transition-all duration-300 group/link-hover:scale-110 ${
                            isActive
                              ? "text-white"
                              : "text-blue-200 group/link-hover:text-white"
                          }`}
                        />
                        {isActive && (
                          <div className="absolute -inset-1 bg-blue-300 rounded-full opacity-30 animate-pulse" />
                        )}
                      </div>
                      {!isCollapsed && (
                        <>
                          <span className="ml-3 font-medium text-sm transition-all duration-300">
                            {item.title}
                          </span>
                          {item.badge && (
                            <Chip
                              className="ml-auto animate-in zoom-in duration-300 hover:scale-110 transition-transform"
                              color="danger"
                              size="sm"
                              variant="flat"
                            >
                              {item.badge}
                            </Chip>
                          )}
                        </>
                      )}

                      {/* Hover effect line */}
                      <div
                        className={`absolute left-0 top-0 bottom-0 w-1 bg-blue-300 transition-all duration-300 ${
                          isActive
                            ? "opacity-100"
                            : "opacity-0 group/link-hover:opacity-100"
                        } rounded-r-full`}
                      />

                      {/* Ripple effect on click */}
                      <div className="absolute inset-0 bg-blue-300 opacity-0 group/link-active:opacity-20 transition-opacity duration-150 rounded-lg" />
                    </Link>
                  )}
                </div>

                {/* Submenu with enhanced animations */}
                {hasSubmenu && !isCollapsed && (
                  <div
                    className={`overflow-hidden transition-all duration-500 ease-out ${
                      isSubmenuExpanded
                        ? "max-h-96 opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <ul className="mt-2 ml-8 space-y-1">
                      {item.submenu!.map((subItem, subIndex) => {
                        const isSubItemActive = isSubmenuItemActive(
                          subItem.href,
                        );

                        return (
                          <li
                            key={subItem.title}
                            className={`transform transition-all duration-300 ${
                              isSubmenuExpanded
                                ? "translate-x-0 opacity-100"
                                : "-translate-x-4 opacity-0"
                            }`}
                            style={{
                              transitionDelay: isSubmenuExpanded
                                ? `${subIndex * 100}ms`
                                : "0ms",
                            }}
                          >
                            <Link
                              className={`flex items-center p-2 text-sm rounded-md transition-all duration-300 transform hover:scale-105 hover:translate-x-2 group/sublink relative ${
                                isSubItemActive
                                  ? "bg-gradient-to-r from-blue-600/70 to-blue-500/70 text-white"
                                  : "text-blue-200 hover:bg-gradient-to-r hover:from-blue-600/50 hover:to-blue-500/50 hover:text-white"
                              }`}
                              href={subItem.href}
                            >
                              <div
                                className={`w-2 h-2 rounded-full mr-3 transition-all duration-300 ${
                                  isSubItemActive
                                    ? "bg-blue-100 scale-125"
                                    : "bg-blue-300 group/sublink-hover:bg-blue-100 group/sublink-hover:scale-125"
                                }`}
                              />
                              <span className="transition-all duration-300">
                                {subItem.title}
                              </span>

                              {/* Submenu hover indicator */}
                              <div
                                className={`absolute right-2 transition-all duration-300 transform ${
                                  isSubItemActive
                                    ? "opacity-100 translate-x-0"
                                    : "opacity-0 translate-x-2 group/sublink-hover:opacity-100 group/sublink-hover:translate-x-0"
                                }`}
                              >
                                <div className="w-1 h-4 bg-blue-300 rounded-full" />
                              </div>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-blue-600/30 bg-gradient-to-r from-blue-800/30 to-blue-700/30 backdrop-blur-sm animate-in slide-in-from-bottom duration-500">
          <div className="text-center group">
            <p className="text-xs text-blue-200 transition-colors duration-300 group-hover:text-blue-100">
              © 2025 Kelurahan Liliba
            </p>
            <p className="text-xs text-blue-300 mt-1 transition-all duration-300 group-hover:text-blue-200 group-hover:scale-105">
              SI SURAT v1.0.0
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}
