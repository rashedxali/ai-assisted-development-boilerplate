// Validate and export typed env vars.
// Access process.env ONLY here — never raw in components, hooks, or services.

const env = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? "",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  nodeEnv: process.env.NODE_ENV,
} as const;

export default env;
