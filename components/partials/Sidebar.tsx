"use client";

import type { MenuItem } from "@/config/sidebarMenus";

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Link } from "@heroui/link";
import { useState } from "react";

import { sidebarMenus } from "@/config/sidebarMenus";
interface SidebarProps {
  userRole: "WARGA" | "STAFF" | "LURAH" | "SUPERADMIN";
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
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [expandedSubmenus, setExpandedSubmenus] = useState<string[]>([]);

  const toggleSubmenu = (menuTitle: string) => {
    setExpandedSubmenus((prev) =>
      prev.includes(menuTitle)
        ? prev.filter((item) => item !== menuTitle)
        : [...prev, menuTitle],
    );
  };

  const menuItems: MenuItem[] = sidebarMenus[userRole] ?? [];

  const getRoleDisplayName = () => {
    switch (userRole) {
      case "WARGA":
        return "Warga";
      case "STAFF":
        return "Staff";
      case "LURAH":
        return "Lurah";
      case "SUPERADMIN":
        return "Super Admin";
      default:
        return "User";
    }
  };

  const getRoleColor = () => {
    switch (userRole) {
      case "WARGA":
        return "bg-blue-600";
      case "STAFF":
        return "bg-green-600";
      case "LURAH":
        return "bg-purple-600";
      case "SUPERADMIN":
        return "bg-red-600";
      default:
        return "bg-gray-600";
    }
  };

  return (
    <aside
      className={`bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900 border-r border-blue-700/50 transition-all duration-500 ease-out flex flex-col h-full shadow-2xl ${
        isCollapsed ? "w-16" : "w-64"
      } ${className}`}
    >
      {/* Header */}
      <div className="p-4 border-b border-blue-600/30 bg-gradient-to-r from-blue-800/50 to-blue-700/50 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-3 animate-in slide-in-from-left duration-300">
              <div
                className={`w-10 h-10 ${getRoleColor()} rounded-lg flex items-center justify-center shadow-lg transform transition-all duration-300 hover:scale-110 hover:rotate-3 hover:shadow-xl ring-2 ring-white/20`}
              >
                <ShieldCheckIcon className="w-6 h-6 text-white transition-transform duration-300" />
              </div>
              <div className="transition-all duration-300">
                <h3 className="font-bold text-white text-sm hover:text-blue-200 transition-colors duration-200">
                  SI SURAT
                </h3>
                <p className="text-xs text-blue-200 hover:text-blue-100 transition-colors duration-200">
                  Kelurahan Liliba
                </p>
              </div>
            </div>
          )}

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

        {!isCollapsed && (
          <div className="mt-3 animate-in fade-in slide-in-from-top duration-500 delay-100">
            <Chip
              className={`${getRoleColor()} text-white transition-all duration-300 hover:scale-105 hover:shadow-lg ring-1 ring-white/30`}
              size="sm"
              variant="flat"
            >
              {getRoleDisplayName()}
            </Chip>
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item, index) => {
            const isActive = activeMenu === item.title.toLowerCase();
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
                      onClick={() => setActiveMenu(item.title.toLowerCase())}
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
                      {item.submenu!.map((subItem, subIndex) => (
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
                            className="flex items-center p-2 text-sm text-blue-200 rounded-md hover:bg-gradient-to-r hover:from-blue-600/50 hover:to-blue-500/50 hover:text-white transition-all duration-300 transform hover:scale-105 hover:translate-x-2 group/sublink relative"
                            href={subItem.href}
                          >
                            <div className="w-2 h-2 bg-blue-300 rounded-full mr-3 transition-all duration-300 group/sublink-hover:bg-blue-100 group/sublink-hover:scale-125" />
                            <span className="transition-all duration-300">
                              {subItem.title}
                            </span>

                            {/* Submenu hover indicator */}
                            <div className="absolute right-2 opacity-0 group/sublink-hover:opacity-100 transition-all duration-300 transform translate-x-2 group/sublink-hover:translate-x-0">
                              <div className="w-1 h-4 bg-blue-300 rounded-full" />
                            </div>
                          </Link>
                        </li>
                      ))}
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
