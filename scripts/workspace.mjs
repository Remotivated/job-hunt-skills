// Plugin-owned vs user-owned paths, and the workspace preflight shared by
// every script that writes user state. See skills/_shared/state-layer.md §0.
//
// The plugin root (this repository or an installed copy of it) is read-only
// at runtime. User state lives only under `my-documents/` inside a workspace
// the user confirmed, and that workspace may never be the plugin root or a
// folder inside it.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const PLUGIN_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

// Relative to the plugin root. A trailing slash marks a directory.
export const PLUGIN_PATHS = Object.freeze([
  ".agents/",
  ".claude/",
  ".claude-plugin/",
  ".codex-plugin/",
  ".gitattributes",
  ".github/",
  ".gitignore",
  "AGENTS.md",
  "CHANGELOG.md",
  "CLAUDE.md",
  "CONTRIBUTING.md",
  "GETTING-STARTED.md",
  "LICENSE",
  "README.md",
  "assets/",
  "examples/",
  "guides/",
  "package-lock.json",
  "package.json",
  "prompts/",
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

// True when `workspace` is the plugin root or inside it (symlinks resolved).
export function isPluginLocation(workspace, pluginRoot = PLUGIN_ROOT) {
  return isWithin(fs.realpathSync(workspace), fs.realpathSync(pluginRoot));
}

// Exit 2 with the recovery message when the working directory is not a user
// workspace. Every state-writing script calls this before its first write.
export function assertUserWorkspace(scriptName, workspace = process.cwd()) {
  if (isPluginLocation(workspace) && process.env.JOB_HUNT_SKILLS_DEV !== "1") {
    console.error(`${scriptName}: ${WORKSPACE_REFUSAL}`);
    process.exit(2);
  }
}
