import type { FeatureManifest } from "./types.js";
export declare const FEATURES: FeatureManifest[];
export declare function getDefaultSelections(): Record<string, boolean>;
export declare function getFeature(id: string): FeatureManifest | undefined;
