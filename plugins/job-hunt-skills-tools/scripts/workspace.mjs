// Plugin-owned vs user-owned paths, and the workspace preflight shared by
// every script that writes user state. The user paths match state-layer §0 in
// the Job Hunt Skills plugin.
//
// This companion's root (`plugins/job-hunt-skills-tools/` in the source
// repository, or an installed copy of that folder) is read-only at runtime,
// and so is the Job Hunt Skills plugin it serves. User state lives only under
// `my-documents/` inside a workspace the user confirmed, and that workspace
// may never be either plugin's folder, the repository or marketplace checkout
// that contains them, or a folder inside any of these.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const PLUGIN_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

// Relative to this companion's root. A trailing slash marks a directory.
export const PLUGIN_PATHS = Object.freeze([
  ".claude-plugin/",
  ".codex-plugin/",
  "LICENSE",
  "README.md",
  "scripts/",
  "skills/",
  "templates/",
]);

// The plugins whose installed folders never hold user state: the Job Hunt
// Skills plugin and this companion, wherever each is installed.
export const PLUGIN_NAMES = Object.freeze(["job-hunt-skills", "job-hunt-skills-tools"]);

const PLUGIN_MANIFESTS = Object.freeze([
  ".claude-plugin/plugin.json",
  ".codex-plugin/plugin.json",
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
  `  Claude Code:    cd into your job-hunt folder, then run 'claude' there.`;

const MARKETPLACE_MANIFESTS = Object.freeze([
  ".claude-plugin/marketplace.json",
  ".agents/plugins/marketplace.json",
]);

function readJsonOrNull(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return null;
  }
}

function realpathOrNull(target) {
  try {
    return fs.realpathSync(target);
  } catch {
    return null;
  }
}

// The checkout that publishes this companion: a clone of the source repository
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

// True when `dir` is the root of an installed or checked-out copy of either
// plugin, recognised by its own manifest.
export function isJobHuntPluginRoot(dir) {
  return PLUGIN_MANIFESTS.some((manifest) =>
    PLUGIN_NAMES.includes(readJsonOrNull(path.join(dir, manifest))?.name));
}

// True when `dir` holds a marketplace manifest that lists either plugin, such
// as a clone of the source repository.
export function isJobHuntMarketplace(dir) {
  return MARKETPLACE_MANIFESTS.some((manifest) => {
    const plugins = readJsonOrNull(path.join(dir, manifest))?.plugins;
    return Array.isArray(plugins) && plugins.some((entry) => PLUGIN_NAMES.includes(entry?.name));
  });
}

// True when `workspace` is this companion's root, the checkout that contains
// it, the folder of an installed copy of either plugin, a marketplace checkout
// that lists either plugin, or a folder inside any of these. Symlinks are
// resolved first, so a link into a plugin folder is refused too.
export function isPluginLocation(workspace, pluginRoot = PLUGIN_ROOT) {
  const realWorkspace = fs.realpathSync(workspace);
  if (isWithin(realWorkspace, fs.realpathSync(pluginRoot))) return true;
  const checkout = marketplaceRoot(pluginRoot);
  if (checkout !== null && isWithin(realWorkspace, checkout)) return true;
  for (let dir = realWorkspace; ; dir = path.dirname(dir)) {
    if (isJobHuntPluginRoot(dir) || isJobHuntMarketplace(dir)) return true;
    if (path.dirname(dir) === dir) return false;
  }
}

// Exit 2 with the recovery message when the working directory is not a user
// workspace. Every state-writing script calls this before its first write.
export function assertUserWorkspace(scriptName, workspace = process.cwd()) {
  if (isPluginLocation(workspace)) {
    console.error(`${scriptName}: ${WORKSPACE_REFUSAL}`);
    process.exit(2);
  }
}
