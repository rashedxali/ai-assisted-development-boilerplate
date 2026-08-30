import { fetchCurrentUser } from "@/features/auth/services/auth-service";

// Used with TanStack Query — install: npm install @tanstack/react-query
//
// export const currentUserQuery = () => ({
//   queryKey: ["auth", "me"],
//   queryFn: fetchCurrentUser,
// });

export async function getCurrentUser() {
  return fetchCurrentUser();
}
