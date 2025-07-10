import { z } from "zod";

const userBaseSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  confirmPassword: z.string(),
  role: z.enum(["user", "admin", "superadmin"]),
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
