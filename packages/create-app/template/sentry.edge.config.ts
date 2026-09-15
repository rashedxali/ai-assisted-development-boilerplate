// Sentry edge-runtime init. Loaded by instrumentation.ts in the Edge runtime.
import * as Sentry from "@sentry/nextjs";

import env from "@/config/env";

Sentry.init({
  dsn: env.sentryDsn,
  enableLogs: true,
  debug: false,
});
