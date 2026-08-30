// Sentry client-side init. Runs after document load, before React hydration.
// See node_modules/next/dist/docs — instrumentation-client.
import * as Sentry from "@sentry/nextjs";

import env from "@/config/env";

Sentry.init({
  dsn: env.sentryDsn,
  enableLogs: true,
  // Tracing disabled — enable by setting a tracesSampleRate.
  // Session Replay: never sample plain sessions, capture full replay on errors.
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 1.0,
  debug: false,
});

const loadReplay = async () => {
  const replayIntegration = await Sentry.lazyLoadIntegration("replayIntegration");
  Sentry.addIntegration(replayIntegration());
};

let replayArmed = false;
const armReplay = () => {
  if (replayArmed) return;
  replayArmed = true;
  void loadReplay();
};

(["pointerdown", "keydown"] as const).forEach((event) =>
  window.addEventListener(event, armReplay, { once: true, passive: true }),
);

if (typeof requestIdleCallback === "function") {
  requestIdleCallback(armReplay, { timeout: 5000 });
} else {
  setTimeout(armReplay, 2000);
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
