// Lighthouse CI configuration.
//
// package.json has no `"type": "module"`, so CommonJS (`module.exports`) is
// the correct format for a `.js` config file here.
//
// The production build is run separately in CI (`bun run build`); LHCI only
// starts the already-built server and audits it.
//
// Next.js 16.2.6 (`next start`) prints `✓ Ready in <n>ms` on stdout once the
// server is listening — verified by running `bun run build && bun run start`.
// `startServerReadyPattern` is matched against that line.
module.exports = {
  ci: {
    collect: {
      startServerCommand: "bun run start",
      startServerReadyPattern: "Ready in",
      startServerReadyTimeout: 60000,
      url: ["http://localhost:3000/", "http://localhost:3000/docs"],
      numberOfRuns: 3,
      settings: {
        // Audit performance categories only; reduces run-to-run noise.
        onlyCategories: [
          "performance",
          "accessibility",
          "best-practices",
          "seo",
        ],
        // Skip the (often flaky / irrelevant in CI) PWA + screenshot audits.
        skipAudits: ["uses-http2"],
      },
    },
    assert: {
      assertions: {
        "categories:performance": ["warn", { minScore: 0.85 }],
        "categories:accessibility": ["error", { minScore: 0.9 }],
        "categories:best-practices": ["warn", { minScore: 0.9 }],
        "categories:seo": ["warn", { minScore: 0.9 }],
        "first-contentful-paint": ["warn", { maxNumericValue: 2000 }],
        "largest-contentful-paint": ["error", { maxNumericValue: 2500 }],
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.1 }],
        "total-blocking-time": ["warn", { maxNumericValue: 300 }],
      },
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};
