"use client";

import { useTransition } from "react";
import { login } from "@/features/auth/actions/login";

export function useAuth() {
  const [isPending, startTransition] = useTransition();

  const handleLogin = (formData: FormData) => {
    startTransition(async () => {
      await login(undefined, formData);
    });
  };

  return { login: handleLogin, isPending };
}
