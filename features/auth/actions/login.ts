"use server";

import { loginSchema } from "@/features/auth/schemas/login-schema";
import { loginUser } from "@/features/auth/services/auth-service";

export async function login(_: unknown, formData: FormData) {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.flatten() };
  return loginUser(parsed.data);
}
