"use client";

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
} from "@heroui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

import { logout } from "@/services/authService";

interface HeaderProps {
  userRole: "WARGA" | "STAFF" | "LURAH" | "SUPERADMIN" | "RT";
  userName?: string;
  userAvatar?: string;
  onToggleSidebar?: () => void; // <- ini tambahan penting
}

interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

export default function Header({
  userRole,
  userName = "User",
  userAvatar,
  onToggleSidebar,
}: HeaderProps) {
  // Navigation items untuk setiap role
  const navigationItems: Record<string, NavItem[]> = {
    warga: [
      { label: "Dashboard", href: "/warga" },
      { label: "Pengajuan Surat", href: "/warga/pengajuan" },
      { label: "Riwayat", href: "/warga/riwayat" },
    ],
    staff: [
      { label: "Dashboard", href: "/staff" },
      { label: "Kelola Pengajuan", href: "/staff/pengajuan" },
      { label: "Laporan", href: "/staff/laporan" },
      { label: "Template Surat", href: "/staff/template" },
    ],
    lurah: [
      { label: "Dashboard", href: "/lurah" },
      { label: "Persetujuan", href: "/lurah/persetujuan" },
      { label: "Laporan", href: "/lurah/laporan" },
      { label: "Manajemen", href: "/lurah/manajemen" },
    ],
    superadmin: [
      { label: "Dashboard", href: "/superadmin" },
      { label: "Kelola User", href: "/superadmin/users" },
      { label: "Sistem", href: "/superadmin/system" },
      { label: "Backup", href: "/superadmin/backup" },
      { label: "Logs", href: "/superadmin/logs" },
    ],
    rt: [
      { label: "Dashboard", href: "/rt" },
      { label: "Pengajuan", href: "/rt/pengajuan" },
      { label: "Riwayat", href: "/rt/riwayat" },
    ],
  };

  // Portal titles untuk setiap role
  const portalTitles: Record<string, string> = {
    warga: "Portal Warga",
    staff: "Portal Staff",
    lurah: "Portal Lurah",
    superadmin: "Portal Super Admin",
    rt: "Portal RT",
  };

  // Color variants untuk setiap role
  const roleColors: Record<string, string> = {
    warga: "primary",
    staff: "secondary",
    lurah: "success",
    superadmin: "danger",
    rt: "info",
  };

  const currentNavItems = navigationItems[userRole] || [];
  const portalTitle = portalTitles[userRole] || "Portal";
  const roleColor = roleColors[userRole] || "primary";

  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/"); // Redirect to home or login page
  };

  return (
    <Navbar
      isBordered
      className="sticky top-0 z-50 backdrop-blur-md bg-background/70"
      maxWidth="full"
    >
      {/* Brand/Logo Section */}
      <NavbarBrand className="flex-grow-0">
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-lg bg-gradient-to-br from-${roleColor} to-${roleColor}-600 flex items-center justify-center`}
          >
            <span className="text-white font-bold text-sm">
              {userRole.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex flex-col">
            <h1 className={`text-lg font-bold text-${roleColor}`}>
              {portalTitle}
            </h1>
            <span className="text-xs text-default-500">Kelurahan Liliba</span>
          </div>
        </div>
      </NavbarBrand>

      {/* Navigation Items */}
      <NavbarContent className="hidden md:flex gap-6" justify="center">
        {currentNavItems.map((item, index) => (
          <NavbarItem key={index}>
            <Link
              className="text-sm font-medium hover:text-primary transition-colors"
              color="foreground"
              href={item.href}
            >
              {item.label}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      {/* User Menu */}
      <NavbarContent justify="end">
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Button
              disableRipple
              className="p-0 h-auto min-w-0"
              variant="light"
            >
              <div className="flex items-center gap-2">
                <Avatar
                  className={`border-2 border-${roleColor}`}
                  name={userName}
                  size="sm"
                  src={userAvatar}
                />
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-sm font-medium">{userName}</span>
                  <span className="text-xs text-default-500 capitalize">
                    {userRole}
                  </span>
                </div>
                <ChevronDownIcon className="w-4 h-4 text-default-500" />
              </div>
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="User menu">
            <DropdownItem key="profile" className="gap-2">
              <div className="flex flex-col">
                <span className="font-medium">{userName}</span>
                <span className="text-xs text-default-500 capitalize">
                  {userRole}
                </span>
              </div>
            </DropdownItem>
            <DropdownItem
              key="settings"
              href={`/${userRole.toLowerCase()}/profile`}
            >
              Profil
            </DropdownItem>
            <DropdownItem
              key="help"
              href={`/${userRole.toLowerCase()}/bantuan`}
            >
              Bantuan
            </DropdownItem>
            <DropdownItem
              onClick={handleLogout}
              key="logout"
              className="text-danger"
              color="danger"
            >
              Keluar
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>

        {/* Mobile Menu (untuk toggle sidebar di mobile) */}
        <div className="md:hidden">
          <Button
            isIconOnly
            className="text-default-500"
            variant="light"
            onClick={onToggleSidebar}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M4 6h16M4 12h16M4 18h16"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          </Button>
        </div>

        {/* Mobile Menu */}
        {/* <div className="md:hidden"> */}
        {/* <Dropdown>
            <DropdownTrigger>
              <Button isIconOnly className="text-default-500" variant="light">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M4 6h16M4 12h16M4 18h16"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Mobile navigation">
              {currentNavItems.map((item, index) => (
                <DropdownItem key={index} href={item.href}>
                  {item.label}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </div> */}
      </NavbarContent>
    </Navbar>
  );
}
