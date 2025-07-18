export interface Users {
  id: string;
  username: string;
  email: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
  profil: {
    id: string;
  } | null;
  isWarga: boolean; // Pastikan properti ini ada
  extraRoles: ("WARGA" | "RT" | "STAFF" | "LURAH" | "SUPERADMIN")[];
}
