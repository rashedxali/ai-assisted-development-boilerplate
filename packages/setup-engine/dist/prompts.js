import * as p from "@clack/prompts";
import { FEATURES, getDefaultSelections } from "./features.js";
export function parseFeatureFlags(argv) {
    const flags = {};
    for (const arg of argv) {
        if (arg === "--yes" || arg === "-y")
            continue;
        if (arg === "--force")
            continue;
        const noMatch = arg.match(/^--no-([\w-]+)$/);
        if (noMatch) {
            flags[noMatch[1]] = false;
            continue;
        }
        const yesMatch = arg.match(/^--([\w-]+)$/);
        if (yesMatch && FEATURES.some((f) => f.id === yesMatch[1])) {
            flags[yesMatch[1]] = true;
        }
    }
    return flags;
}
export function hasYesFlag(argv) {
    return argv.includes("--yes") || argv.includes("-y");
}
export async function promptFeatureSelection(options = {}) {
    const defaults = {
        ...getDefaultSelections(),
        ...options.defaults,
    };
    if (options.yes) {
        return defaults;
    }
    p.intro("Configure your project");
    const selections = { ...defaults };
    for (const feature of FEATURES) {
        const value = await p.confirm({
            message: `${feature.label}?`,
            initialValue: defaults[feature.id],
        });
        if (p.isCancel(value)) {
            p.cancel("Setup cancelled.");
            process.exit(0);
        }
        selections[feature.id] = value;
    }
    p.outro("Applying selections…");
    return selections;
}
export function summarizeSelections(selections) {
    const enabled = FEATURES.filter((f) => selections[f.id]).map((f) => f.label);
    const disabled = FEATURES.filter((f) => !selections[f.id]).map((f) => f.label);
    const lines = ["Enabled:", ...enabled.map((l) => `  ✓ ${l}`)];
    if (disabled.length > 0) {
        lines.push("Disabled:", ...disabled.map((l) => `  ✗ ${l}`));
    }
    return lines.join("\n");
}
