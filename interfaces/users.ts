export interface Users {
  id: string;
  username: string;
  email: string | null;
  role: string;
  numberWhatsApp: string | null; // Perbaiki penamaan properti
  createdAt: string;
  updatedAt: string;
  profil: {
    id: string;
  } | null;
  isWarga: boolean; // Pastikan properti ini ada
  extraRoles: ("WARGA" | "RT" | "STAFF" | "LURAH" | "SUPERADMIN")[];
}
