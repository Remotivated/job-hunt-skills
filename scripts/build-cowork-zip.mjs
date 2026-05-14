#!/usr/bin/env node
// Builds a Cowork-ready plugin ZIP from the current git HEAD.
//
// Uses `git archive --format=zip` so:
//   - tracked files only (ignored paths like my-documents/ user content,
//     node_modules/, __pycache__/, plans/, .claude/settings.local.json
//     are excluded automatically),
//   - no top-level wrapper directory (Cowork needs .claude-plugin/plugin.json
//     at the ZIP root, not nested under job-hunt-skills-main/),
//   - .gitattributes `export-ignore` entries drop .github/, .gitignore, and
//     .gitattributes itself.

import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const pkg = JSON.parse(readFileSync(join(repoRoot, "package.json"), "utf8"));
const distDir = join(repoRoot, "dist");
mkdirSync(distDir, { recursive: true });

const stableName = `${pkg.name}.zip`;
const stablePath = join(distDir, stableName);

execFileSync(
  "git",
  ["archive", "--worktree-attributes", "--format=zip", "-o", stablePath, "HEAD"],
  { cwd: repoRoot, stdio: "inherit" },
);

const size = (p) => `${(statSync(p).size / 1024).toFixed(1)} KB`;
console.log(`Wrote ${stablePath} (${size(stablePath)})`);
