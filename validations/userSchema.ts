import { Role } from "@prisma/client";
import { z } from "zod";

const userBaseSchema = z.object({
  username: z.string().min(1, "Username wajib diisi"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  confirmPassword: z.string(),
  role: z.nativeEnum(Role),
  phone: z.string().optional(),
  address: z.string().optional(),
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
