"use client";

import { Link, Divider, Chip } from "@heroui/react";

interface FooterProps {
  userRole?: "WARGA" | "STAFF" | "LURAH" | "SUPERADMIN" | "RT";
  showVersion?: boolean;
  customText?: string;
  links?: Array<{
    label: string;
    href: string;
  }>;
}

export default function Footer({
  userRole,
  showVersion = true,
  customText,
  links = [],
}: FooterProps) {
  // Ubah userRole ke lowercase untuk konsistensi mapping
  const roleKey = userRole?.toLowerCase() as
    | "warga"
    | "staff"
    | "lurah"
    | "superadmin"
    | "rt"
    | undefined;

  const getFooterText = () => {
    if (customText) return customText;

    const roleTexts = {
      warga: "© 2025 Kelurahan Liliba",
      staff: "© 2025 Kelurahan Liliba - Staff Portal",
      lurah: "© 2025 Kelurahan Liliba - Portal Lurah",
      superadmin: "© 2025 Kelurahan Liliba - Super Admin Portal",
      rt: "© 2025 Kelurahan Liliba - RT Portal",
    };

    return roleKey ? roleTexts[roleKey] : "© 2025 Kelurahan Liliba";
  };

  const getDefaultLinks = () => {
    if (links.length > 0) return links;

    const roleLinks = {
      warga: [
        // { label: "Bantuan", href: "/warga/bantuan" },
        // { label: "Kontak", href: "/warga/kontak" },
      ],
      staff: [
        // { label: "Bantuan", href: "/staff/bantuan" },
        // { label: "Panduan", href: "/staff/panduan" },
      ],
      lurah: [
        // { label: "Bantuan", href: "/lurah/bantuan" },
        // { label: "Kontak", href: "/lurah/kontak" },
      ],
      superadmin: [
        // { label: "Help", href: "/superadmin/help" },
        // { label: "Settings", href: "/superadmin/settings" },
      ],
      rt: [
        // { label: "Bantuan", href: "/rt/bantuan" },
        // { label: "Kontak", href: "/rt/kontak" },
      ],
    };

    return roleKey ? roleLinks[roleKey] : [];
  };

  const getRoleColor = () => {
    const roleColors = {
      warga: "primary",
      staff: "secondary",
      lurah: "success",
      superadmin: "danger",
      rt: "info",
    };

    return roleKey ? roleColors[roleKey] : "default";
  };

  const footerLinks = getDefaultLinks();
  const roleColor = getRoleColor();

  return (
    <footer className="w-full border-t border-divider bg-background/80 backdrop-blur-md">
      <div className="container mx-auto max-w-7xl px-6 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-sm text-default-600">{getFooterText()}</span>
            {roleKey && (
              <Chip
                className="text-xs"
                color={roleColor as any}
                size="sm"
                variant="flat"
              >
                {roleKey.charAt(0).toUpperCase() + roleKey.slice(1)}
              </Chip>
            )}
          </div>

          <div className="flex items-center gap-6">
            {footerLinks.length > 0 && (
              <div className="flex items-center gap-4">
                {footerLinks.map((link, index) => (
                  <Link
                    key={index}
                    className="text-default-600 hover:text-primary transition-colors"
                    href={link.href}
                    size="sm"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}

            {footerLinks.length > 0 && showVersion && (
              <Divider className="h-4" orientation="vertical" />
            )}

            {showVersion && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-default-500">Version</span>
                <Chip className="text-xs" size="sm" variant="bordered">
                  1.0.0
                </Chip>
              </div>
            )}
          </div>
        </div>

        {(userRole === "LURAH" || userRole === "SUPERADMIN") && (
          <>
            <Divider className="my-4" />
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-default-500">
              <div className="flex items-center gap-4">
                <span>Status: Online</span>
                <span>
                  Last Update: {new Date().toLocaleDateString("id-ID")}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <Link
                  className="text-default-500"
                  href="/privacy"
                  size="sm"
                  target="_blank"
                >
                  Privacy Policy
                </Link>
                <Link
                  className="text-default-500"
                  href="/terms"
                  size="sm"
                  target="_blank"
                >
                  Terms of Service
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </footer>
  );
}
