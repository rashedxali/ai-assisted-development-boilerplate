import type { BoilerplateMarker, SetupOptions } from "./types.js";
declare const MARKER_FILE = ".boilerplate.json";
export declare function readMarker(targetDir: string): Promise<BoilerplateMarker | null>;
export declare function writeMarker(targetDir: string, marker: BoilerplateMarker): Promise<void>;
export declare function applyFeatures(options: SetupOptions): Promise<void>;
export declare function assertCanSetup(targetDir: string, force?: boolean): Promise<void>;
export { MARKER_FILE };
