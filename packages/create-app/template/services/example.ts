import type { ApiResponse } from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

export async function fetchResource<T>(
  endpoint: string,
  revalidate = 60
): Promise<ApiResponse<T>> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    next: { revalidate },
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<ApiResponse<T>>;
}
