export const roleLabel = (role: string) => {
  switch (role) {
    case "superadmin":
      return "Superadmin";
    case "staff":
      return "Staff";
    case "lurah":
      return "Lurah";
    case "rt":
      return "RT";
    case "warga":
      return "Warga";
    default:
      return role;
  }
};

export const toLowerCase = (value: string | undefined): string => {
  return value ? value.toLowerCase() : "";
};

export const isValidNIK = (value: string): boolean => {
  return /^\d{16}$/.test(value);
};

/**
 * Validasi RT/RW (harus 3 digit angka, contoh: 001, 010, 123)
 */
export const isValidRTRW = (value: string): boolean => {
  return /^\d{3}$/.test(value);
};

export function formatDateIndo(dateString: string, withTime = false): string {
  if (!dateString) return "-";
  const date = new Date(dateString);

  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "long",
    year: "numeric",
  };

  if (withTime) {
    options.hour = "2-digit";
    options.minute = "2-digit";
  }

  return date.toLocaleDateString("id-ID", options);
}
