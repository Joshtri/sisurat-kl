import { Role } from "@prisma/client";
import { z } from "zod";

const userBaseSchema = z.object({
  username: z.string().min(1, "Username wajib diisi"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  confirmPassword: z.string(),
  extraRoles: z.array(z.nativeEnum(Role)).optional(), // Tambahkan extraRoles sebagai array enum Role
  role: z.nativeEnum(Role),

  // namaLengkap: z.string().min(1, "Nama lengkap wajib diisi"),
  // phone: z.string().optional(),
  // address: z.string().optional(),
});

export const userSchema = userBaseSchema.refine(
  (data) => data.password === data.confirmPassword,
  {
    path: ["confirmPassword"],
    message: "Password tidak cocok",
  },
);

export const userSchemaPartial = userBaseSchema.partial(); // ✅ bisa gunakan ini untuk PATCH

export type UserSchema = z.infer<typeof userSchema>;
export type UserSchemaPartial = z.infer<typeof userSchemaPartial>;
