"use client";

import type React from "react";

import {
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  Chip,
} from "@heroui/react";
import {
  ChevronDownIcon,
  Bars3Icon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { logout } from "@/services/authService";
import { useAuth } from "@/contexts/AuthContext";

interface HeaderProps {
  onToggleSidebar?: () => void;
}

interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // if (isLoading || !user) return null;

  const userRole = user?.role?.toLowerCase();
  const userName = user?.profil?.namaLengkap || user?.username  || "User";
  const userAvatar = user?.avatar || undefined;

  const navigationItems: Record<string, NavItem[]> = {
    warga: [] as Array<NavItem>,
    staff: [] as Array<NavItem>,
    lurah: [] as Array<NavItem>,
    superadmin: [] as Array<NavItem>,
    rt: [] as Array<NavItem>,
  };

  const portalConfig: Record<
    string,
    { title: string; color: string; bgClass: string; textClass: string }
  > = {
    warga: {
      title: "Portal Warga",
      color: "primary",
      bgClass: "bg-gradient-to-br from-blue-500 to-blue-600",
      textClass: "text-blue-600",
    },
    staff: {
      title: "Portal Staff",
      color: "secondary",
      bgClass: "bg-gradient-to-br from-purple-500 to-purple-600",
      textClass: "text-purple-600",
    },
    lurah: {
      title: "Portal Lurah",
      color: "success",
      bgClass: "bg-gradient-to-br from-green-500 to-green-600",
      textClass: "text-green-600",
    },
    superadmin: {
      title: "Portal Super Admin",
      color: "danger",
      bgClass: "bg-gradient-to-br from-red-500 to-red-600",
      textClass: "text-red-600",
    },
    rt: {
      title: "Portal RT",
      color: "warning",
      bgClass: "bg-gradient-to-br from-orange-500 to-orange-600",
      textClass: "text-orange-600",
    },
  };

  const currentNavItems = navigationItems[userRole] || [];
  const config = portalConfig[userRole] || portalConfig.warga;

  const handleLogout = async () => {
    await logout();
    router.push("/");
    router.refresh();
  };

  return (
    <Navbar
      isBordered
      className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-gray-200/50 shadow-sm"
      maxWidth="full"
      height="4rem"
    >
      {/* Brand Section */}
      <NavbarBrand className="flex-shrink-0">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl ${config.bgClass} flex items-center justify-center shadow-lg`}
          >
            <span className="text-white font-bold text-lg">
              {userRole?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex flex-col">
            <h1 className={`text-lg font-bold ${config.textClass}`}>
              {config.title}
            </h1>
            <span className="text-xs text-gray-500 font-medium">
              Kelurahan Liliba
            </span>
          </div>
        </div>
      </NavbarBrand>

      {/* Navigation Items - Desktop */}
      <NavbarContent className="hidden lg:flex gap-1" justify="center">
        {currentNavItems.map((item, index) => (
          <NavbarItem key={index}>
            <Link
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
              href={item.href}
            >
              {item.label}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      {/* User Section */}
      <NavbarContent justify="end" className="gap-3">
        {/* User Dropdown */}
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Button
              disableRipple
              className="p-2 h-auto min-w-0 bg-transparent hover:bg-gray-100 rounded-xl transition-all duration-200"
              variant="light"
            >
              <div className="flex items-center gap-3">
                <Avatar
                  className="ring-2 ring-gray-200 ring-offset-2"
                  name={userName}
                  size="sm"
                  src={userAvatar}
                />
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-sm font-semibold text-gray-900">
                    {userName}
                  </span>
                  <Chip
                    size="sm"
                    color={config.color as any}
                    variant="flat"
                    className="text-xs h-5"
                  >
                    {userRole?.toUpperCase()}
                  </Chip>
                </div>
                <ChevronDownIcon className="w-4 h-4 text-gray-400" />
              </div>
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="User menu"
            className="w-64"
            itemClasses={{
              base: "gap-4 p-3",
            }}
          >
            <DropdownItem
              key="profile"
              className="gap-3 p-4 cursor-default"
              textValue="Profile info"
            >
              <div className="flex items-center gap-3">
                <Avatar
                  className="ring-2 ring-gray-200"
                  name={userName}
                  size="md"
                  src={userAvatar}
                />
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-900">
                    {userName}
                  </span>
                  <Chip
                    size="sm"
                    color={config.color as any}
                    variant="flat"
                    className="text-xs h-5 w-fit"
                  >
                    {userRole?.toUpperCase()}
                  </Chip>
                </div>
              </div>
            </DropdownItem>
            <DropdownItem
              key="settings"
              href={`/${userRole}/profile`}
              className="gap-3"
              startContent={<Cog6ToothIcon className="w-5 h-5 text-gray-500" />}
            >
              <span className="font-medium">Pengaturan Profil</span>
            </DropdownItem>
            <DropdownItem
              onClick={handleLogout}
              key="logout"
              className="text-red-600 gap-3"
              color="danger"
              startContent={<ArrowRightOnRectangleIcon className="w-5 h-5" />}
            >
              <span className="font-medium">Keluar</span>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>

        {/* Mobile Menu Toggle */}
        <div className="lg:hidden">
          <Button
            isIconOnly
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            variant="light"
            onClick={onToggleSidebar}
            size="sm"
          >
            <Bars3Icon className="w-6 h-6" />
          </Button>
        </div>
      </NavbarContent>
    </Navbar>
  );
}
