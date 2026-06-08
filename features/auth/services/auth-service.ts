import type { LoginInput } from "@/features/auth/schemas/login-schema";
import type { User } from "@/features/auth/types/auth";

export async function loginUser(data: LoginInput): Promise<{ token: string }> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function fetchCurrentUser(): Promise<User> {
  const res = await fetch("/api/auth/me");
  return res.json();
}
