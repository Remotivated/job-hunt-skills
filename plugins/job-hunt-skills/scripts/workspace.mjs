// Plugin-owned vs user-owned paths, and the workspace preflight shared by
// every script that writes user state. See skills/_shared/state-layer.md §0.
//
// The plugin root (`plugins/job-hunt-skills/` in the source repository, or an
// installed copy of that folder) is read-only at runtime. User state lives
// only under `my-documents/` inside a workspace the user confirmed, and that
// workspace may never be the plugin root, the repository or marketplace
// checkout that contains it, or a folder inside either.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const PLUGIN_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

// Relative to the plugin root. A trailing slash marks a directory.
export const PLUGIN_PATHS = Object.freeze([
  ".claude-plugin/",
  ".codex-plugin/",
  "LICENSE",
  "README.md",
  "guides/",
  "scripts/",
  "skills/",
  "templates/",
]);

// Relative to the confirmed user workspace.
export const USER_PATHS = Object.freeze([
  "my-documents/",
  "my-documents/applications/",
  "my-documents/applications.md",
  "my-documents/coverletter.md",
  "my-documents/cv.md",
  "my-documents/proof-assets/",
  "my-documents/reports/",
  "my-documents/resume.md",
  "my-documents/retracted-claims.md",
  "my-documents/story-bank.md",
]);

export const USER_ROOT = "my-documents";

export function isWithin(candidate, parent) {
  const relative = path.relative(parent, candidate);
  return relative === "" ||
    (!relative.startsWith(`..${path.sep}`) && relative !== ".." && !path.isAbsolute(relative));
}

export const WORKSPACE_REFUSAL =
  `working directory is the plugin install dir, not a user workspace.\n\n` +
  `Your job-hunt files belong in a folder you chose, not inside the plugin.\n\n` +
  `  Codex CLI/IDE:  open or cd into your job-hunt folder, then start Codex there.\n` +
  `  Desktop agent:  select a folder you own with the app's folder/workspace control, then start again.\n` +
  `  Claude Code:    cd into your job-hunt folder, then run 'claude' there.\n\n` +
  `Set JOB_HUNT_SKILLS_DEV=1 only if you are intentionally developing the plugin itself.`;

const MARKETPLACE_MANIFESTS = Object.freeze([
  ".claude-plugin/marketplace.json",
  ".agents/plugins/marketplace.json",
]);

function realpathOrNull(target) {
  try {
    return fs.realpathSync(target);
  } catch {
    return null;
  }
}

// The checkout that publishes this plugin: a clone of the source repository
// or a marketplace copy of it. It is recognised by a marketplace manifest two
// levels above the plugin root whose plugin entry points back at the plugin
// root. Returns null for an installed copy that has no such parent.
export function marketplaceRoot(pluginRoot = PLUGIN_ROOT) {
  const realPlugin = realpathOrNull(pluginRoot);
  if (!realPlugin) return null;
  const candidate = path.dirname(path.dirname(realPlugin));
  for (const manifest of MARKETPLACE_MANIFESTS) {
    let data;
    try {
      data = JSON.parse(fs.readFileSync(path.join(candidate, manifest), "utf8"));
    } catch {
      continue;
    }
    for (const entry of Array.isArray(data?.plugins) ? data.plugins : []) {
      const source = typeof entry?.source === "string" ? entry.source : entry?.source?.path;
      if (typeof source !== "string") continue;
      if (realpathOrNull(path.resolve(candidate, source)) === realPlugin) return candidate;
    }
  }
  return null;
}

// True when `workspace` is the plugin root, the checkout that contains it, or
// a folder inside either (symlinks resolved).
export function isPluginLocation(workspace, pluginRoot = PLUGIN_ROOT) {
  const realWorkspace = fs.realpathSync(workspace);
  if (isWithin(realWorkspace, fs.realpathSync(pluginRoot))) return true;
  const checkout = marketplaceRoot(pluginRoot);
  return checkout !== null && isWithin(realWorkspace, checkout);
}

// Exit 2 with the recovery message when the working directory is not a user
// workspace. Every state-writing script calls this before its first write.
export function assertUserWorkspace(scriptName, workspace = process.cwd()) {
  if (isPluginLocation(workspace) && process.env.JOB_HUNT_SKILLS_DEV !== "1") {
    console.error(`${scriptName}: ${WORKSPACE_REFUSAL}`);
    process.exit(2);
  }
}
