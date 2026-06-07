/** @type {import('@commitlint/types').UserConfig} */
module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "chore",
        "refactor",
        "docs",
        "style",
        "test",
        "ci",
        "perf",
        "wip",
      ],
    ],
    "header-max-length": [2, "always", 72],
    "subject-full-stop": [2, "never", "."],
    "no-vague-subject": [2, "always"],
  },
  plugins: [
    {
      rules: {
        "no-vague-subject": ({ subject }) => {
          if (!subject) {
            return [true];
          }

          const trimmed = subject.trim();
          const normalized = trimmed.toLowerCase();

          if (normalized === "updated" || normalized === "fixed") {
            return [
              false,
              'subject must not be only "updated" or "fixed"',
            ];
          }

          if (/^(Updated|Fixed)\b/.test(trimmed)) {
            return [
              false,
              'subject must not start with capitalised "Updated" or "Fixed"',
            ];
          }

          return [true];
        },
      },
    },
  ],
};
