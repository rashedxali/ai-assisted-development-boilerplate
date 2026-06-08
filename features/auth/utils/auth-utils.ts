import type { User } from "@/features/auth/types/auth";

export function isAdmin(user: User): boolean {
  return user.role === "admin";
}

export function formatUserName(email: string): string {
  return email.split("@")[0];
}
