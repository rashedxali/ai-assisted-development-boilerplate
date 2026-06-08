"use client";

import { useAuth } from "@/features/auth/hooks/use-auth";

export function LoginForm() {
  const { login, isPending } = useAuth();

  return (
    <form action={login}>
      <input name="email" type="email" placeholder="Email" required />
      <input name="password" type="password" placeholder="Password" required />
      <button type="submit" disabled={isPending}>
        {isPending ? "Logging in…" : "Login"}
      </button>
    </form>
  );
}
