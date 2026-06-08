import env from "@/config/env";

export const siteConfig = {
  name: "My App",
  description: "Next.js App Router boilerplate.",
  url: env.siteUrl,
} as const;
