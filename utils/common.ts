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

export const getRoleColor = (role?: string) => {
  switch (role) {
    case "KEPALA_KELUARGA":
      return "primary";
    case "ISTRI":
      return "secondary";
    case "ANAK":
      return "success";
    default:
      return "default";
  }
};

export const getGenderColor = (gender?: string) => {
  return gender === "LAKI_LAKI" ? "primary" : "secondary";
};

export function convertFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsDataURL(file); // Hasilkan base64 dengan prefix data:...

    reader.onload = () => {
      const result = reader.result as string;

      resolve(result); // langsung string base64
    };

    reader.onerror = (error) => {
      reject(error);
    };
  });
}

export function formatKeyLabel(key: string): string {
  return key
    .replace(/Base64$/i, "") // buang akhiran "Base64"
    .replace(/File$/i, "") // buang akhiran "File" juga kalau ada
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}


// Function to check if file is base64 image
export const isBase64Image = (value: any): boolean => {
  return (
    typeof value === "string" &&
    (value.startsWith("data:image/") ||
      value.startsWith("data:application/pdf"))
  );
};

// Function to get file name from base64 field
export const getFileNameFromBase64Field = (key: string): string => {
  if (key.includes("Base64")) {
    return key.replace("Base64", "");
  }
  return key;
};


export function toPascalCase(input: string): string {
  return input
    .split(/[\s_\-]+/) // Pisahkan berdasarkan spasi, underscore, atau hyphen
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");
}
