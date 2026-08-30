export type FeatureKind = "subtract" | "add";

export type FeatureId =
  | "husky"
  | "lighthouse"
  | "github-ci"
  | "fumadocs"
  | "agent-tooling"
  | "sentry"
  | "storybook";

export type FeatureSelection = Record<FeatureId, boolean>;

export type FeatureManifest = {
  id: FeatureId;
  label: string;
  description: string;
  defaultEnabled: boolean;
  kind: FeatureKind;
  /** Paths relative to project root — deleted when subtract feature is declined */
  paths?: string[];
  /** Paths copied from addons/<id>/ when feature is selected or re-enabled */
  addonPaths?: string[];
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  /** Script keys removed from package.json when feature is disabled */
  scriptKeys?: string[];
  /** Scripts added when feature is enabled (add) or kept when subtract enabled */
  scripts?: Record<string, string>;
};

export type BoilerplateMarker = {
  version: 1;
  configuredAt: string;
  features: FeatureSelection;
};

export type SetupOptions = {
  targetDir: string;
  /** Repo root where addons/ lives (may differ from targetDir for create-app) */
  repoRoot?: string;
  selections: FeatureSelection;
  force?: boolean;
};

export type PromptOptions = {
  defaults?: Partial<FeatureSelection>;
  yes?: boolean;
};
