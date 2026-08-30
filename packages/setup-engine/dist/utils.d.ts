export declare function pathExists(path: string): Promise<boolean>;
export declare function removePath(targetPath: string): Promise<void>;
export declare function copyAddonDir(sourceDir: string, targetDir: string): Promise<void>;
export declare function copyAddonPaths(addonRoot: string, targetRoot: string, paths: string[]): Promise<void>;
export declare function readTextFile(path: string): Promise<string | null>;
export declare function writeTextFile(path: string, content: string): Promise<void>;
export declare function rel(from: string, to: string): string;
