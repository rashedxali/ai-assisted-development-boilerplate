import type { FeatureSelection, PromptOptions } from "./types.js";
export declare function parseFeatureFlags(argv: string[]): Partial<FeatureSelection>;
export declare function hasYesFlag(argv: string[]): boolean;
export declare function promptFeatureSelection(options?: PromptOptions): Promise<FeatureSelection>;
export declare function summarizeSelections(selections: FeatureSelection): string;
