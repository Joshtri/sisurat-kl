import { Role } from "@prisma/client";
import { z } from "zod";

const userBaseSchema = z.object({
  username: z.string().min(1, "Username wajib diisi"),
  email: z.string().email("Email tidak valid").optional().or(z.literal("")),
  password: z.string().min(6, "Password minimal 6 karakter"),
  confirmPassword: z.string(),
  extraRoles: z.array(z.nativeEnum(Role)).optional(),
  role: z.nativeEnum(Role),
  numberWhatsApp: z.string().optional().or(z.literal("")),
});

// Schema untuk create (password wajib)
export const userSchema = userBaseSchema.refine(
  (data) => data.password === data.confirmPassword,
  {
    path: ["confirmPassword"],
    message: "Password tidak cocok",
  }
);

// Schema untuk edit - buat schema terpisah untuk fleksibilitas lebih baik
const userEditBaseSchema = z.object({
  username: z.string().min(1, "Username wajib diisi").optional(),
  email: z.string().email("Email tidak valid").optional().or(z.literal("")),
  password: z.string().optional().or(z.literal("")), // Hapus min(6) untuk edit
  confirmPassword: z.string().optional().or(z.literal("")),
  extraRoles: z.array(z.nativeEnum(Role)).optional(),
  role: z.nativeEnum(Role).optional(),
  numberWhatsApp: z.string().optional().or(z.literal("")),
});

export const userSchemaPartial = userEditBaseSchema.refine(
  (data) => {
    // Jika password diisi dan tidak kosong, maka:
    // 1. Password harus minimal 6 karakter
    // 2. confirmPassword harus cocok
    if (data.password && data.password.length > 0) {
      if (data.password.length < 6) {
        return false; // Password kurang dari 6 karakter
      }
      return data.password === data.confirmPassword;
    }
    // Jika password kosong/undefined, skip validasi
    return true;
  },
  (data) => {
    // Dynamic error message
    if (data.password && data.password.length > 0) {
      if (data.password.length < 6) {
        return {
          path: ["password"],
          message: "Password minimal 6 karakter",
        };
      }
      if (data.password !== data.confirmPassword) {
        return {
          path: ["confirmPassword"],
          message: "Password tidak cocok",
        };
      }
    }
    return {
      path: ["confirmPassword"],
      message: "Password tidak cocok",
    };
  }
);

export type UserSchema = z.infer<typeof userSchema>;
export type UserSchemaPartial = z.infer<typeof userSchemaPartial>;
