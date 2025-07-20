import {
  HomeIcon,
  DocumentTextIcon,
  UserGroupIcon,
  CogIcon,
  ChartBarIcon,
  UserIcon,
  ShieldCheckIcon,
  ArchiveBoxIcon,
} from "@heroicons/react/24/outline";
import {
  HomeIcon as HomeSolidIcon,
  DocumentTextIcon as DocumentSolidIcon,
  UserGroupIcon as UserGroupSolidIcon,
  CogIcon as CogSolidIcon,
  ChartBarIcon as ChartSolidIcon,
} from "@heroicons/react/24/solid";

export interface MenuItem {
  title: string;
  href: string;
  icon: React.ElementType;
  iconSolid: React.ElementType;
  badge?: string | number;
  submenu?: {
    title: string;
    href: string;
    icon?: React.ElementType;
  }[];
}

export const sidebarMenus: Record<string, MenuItem[]> = {
  WARGA: [
    {
      title: "Dashboard",
      href: "/warga/dashboard",
      icon: HomeIcon,
      iconSolid: HomeSolidIcon,
    },
    {
      title: "Permohonan Surat",
      href: "/warga/permohonan",
      icon: DocumentTextIcon,
      iconSolid: DocumentSolidIcon,
      submenu: [
        { title: "Buat Permohonan", href: "/warga/permohonan/create" },
        { title: "Riwayat Permohonan", href: "/warga/permohonan/history" },
      ],
    },
    {
      title: "Profile",
      href: "/warga/profile",
      icon: UserIcon,
      iconSolid: UserIcon,
    },
  ],
  STAFF: [
    {
      title: "Dashboard",
      href: "/staff/dashboard",
      icon: HomeIcon,
      iconSolid: HomeSolidIcon,
    },

    {
      title: "Permohonan Masuk",
      href: "/staff/pengajuan",
      icon: DocumentTextIcon,
      iconSolid: DocumentSolidIcon,
    },

    {
      title: "Riwayat Surat",
      href: "/staff/riwayat",
      icon: ArchiveBoxIcon,
      iconSolid: ArchiveBoxIcon,
    },
    {
      title: "Data Warga",
      href: "/staff/warga",
      icon: UserGroupIcon,
      iconSolid: UserGroupSolidIcon,
    },
    // {
    //   title: "Template Surat",
    //   href: "/staff/template",
    //   icon: DocumentDuplicateIcon,
    //   iconSolid: DocumentDuplicateIcon,
    // },
  ],
  LURAH: [
    {
      title: "Dashboard",
      href: "/lurah/dashboard",
      icon: HomeIcon,
      iconSolid: HomeSolidIcon,
    },
    // {
    //   title: "Laporan",
    //   href: "/lurah/laporan",
    //   icon: ChartBarIcon,
    //   iconSolid: ChartSolidIcon,
    //   submenu: [
    //     { title: "Laporan Harian", href: "/lurah/laporan/harian" },
    //     { title: "Laporan Bulanan", href: "/lurah/laporan/bulanan" },
    //     { title: "Laporan Tahunan", href: "/lurah/laporan/tahunan" },
    //   ],
    // },
    // {
    //   title: "Persetujuan Surat",
    //   href: "/lurah/persetujuan",
    //   icon: ShieldCheckIcon,
    //   iconSolid: ShieldCheckIcon,
    //   badge: "5",
    // },
    // {
    //   title: "Manajemen Staff",
    //   href: "/lurah/staff",
    //   icon: UsersIcon,
    //   iconSolid: UsersIcon,
    // },
    // {
    //   title: "Arsip",
    //   href: "/lurah/arsip",
    //   icon: ArchiveBoxIcon,
    //   iconSolid: ArchiveBoxIcon,
    // },4

    {
      title: "Persetujuan Surat",
      href: "/lurah/persetujuan",
      icon: ShieldCheckIcon,
      iconSolid: ShieldCheckIcon,
      badge: "5",
    },

    {
      title: "Riwayat Surat",
      href: "/lurah/riwayat",
      icon: ArchiveBoxIcon,
      iconSolid: ArchiveBoxIcon,
    },

    {
      title: "Profile Anda",
      href: "/warga/profile",
      icon: UserIcon,
      iconSolid: UserIcon,
    },
  ],
  SUPERADMIN: [
    {
      title: "Dashboard",
      href: "/superadmin/dashboard",
      icon: HomeIcon,
      iconSolid: HomeSolidIcon,
    },

    {
      title: "Manajemen User",
      href: "/superadmin/users",
      icon: UserGroupIcon,
      iconSolid: UserGroupSolidIcon,
    },
    {
      title: "Manajemen Jenis Surat",
      href: "/superadmin/jenis-surat",
      icon: DocumentTextIcon,
      iconSolid: DocumentSolidIcon,
    },
    {
      title: "Manajemen Surat",
      href: "/superadmin/surat",
      icon: DocumentTextIcon,
      iconSolid: DocumentSolidIcon,
    },

    {
      title: "Manajemen Kartu Keluarga",
      href: "/superadmin/kartu-keluarga",
      icon: DocumentTextIcon,
      iconSolid: DocumentSolidIcon,
    },

    {
      title: "Manajemen Warga",
      href: "/superadmin/warga",
      icon: UserGroupIcon,
      iconSolid: UserGroupSolidIcon,
    },

    {
      title: "Manajemen Multi Role",
      href: "/superadmin/multi-role",
      icon: DocumentTextIcon,
      iconSolid: DocumentSolidIcon,
    },

    {
      title: "Manajemen RT",
      href: "/superadmin/rt",
      icon: DocumentTextIcon,
      iconSolid: DocumentSolidIcon,
    },

    {
      title: "Sistem",
      href: "/superadmin/sistem",
      icon: CogIcon,
      iconSolid: CogSolidIcon,
      submenu: [
        { title: "Pengaturan", href: "/superadmin/sistem/pengaturan" },
        { title: "Backup", href: "/superadmin/sistem/backup" },
        { title: "Log Aktivitas", href: "/superadmin/sistem/logs" },
      ],
    },
    {
      title: "Laporan Global",
      href: "/superadmin/laporan-global",
      icon: ChartBarIcon,
      iconSolid: ChartSolidIcon,
    },
  ],
  RT: [
    {
      title: "Dashboard",
      href: "/rt/dashboard",
      icon: HomeIcon,
      iconSolid: HomeSolidIcon,
    },
    {
      title: "Pengajuan Surat",
      href: "/rt/pengajuan",
      icon: DocumentTextIcon,
      iconSolid: DocumentSolidIcon,
    },

    {
      title: "Data Warga",
      href: "/rt/warga",
      icon: UserGroupIcon,
      iconSolid: UserGroupSolidIcon,
    },

    {
      title: "Riwayat",
      href: "/rt/riwayat",
      icon: ArchiveBoxIcon,
      iconSolid: ArchiveBoxIcon,
    },
    {
      title: "Profile Anda",
      href: "/rt/profile",
      icon: UserIcon,
      iconSolid: UserIcon,
    },
  ],
};
