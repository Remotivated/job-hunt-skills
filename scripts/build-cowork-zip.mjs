#!/usr/bin/env node
// Builds a Claude/Cowork/Codex-ready plugin ZIP from the current git HEAD.
//
// Uses `git archive --format=zip` so:
//   - tracked files only are included,
//   - no top-level wrapper directory is added,
//   - both .claude-plugin/plugin.json and .codex-plugin/plugin.json sit at
//     the ZIP root in the locations their respective plugin loaders expect,
//   - contributor-only files listed in EXCLUDED_PATHS are left out.
//
// The exclusions live here rather than as .gitattributes export-ignore
// entries because Anthropic's plugin directory refuses to validate a
// repository whose .gitattributes uses export-ignore.

import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const EXCLUDED_PATHS = [".gitattributes", ".gitignore", ".github"];

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const pkg = JSON.parse(readFileSync(join(repoRoot, "package.json"), "utf8"));
const distDir = join(repoRoot, "dist");
mkdirSync(distDir, { recursive: true });

const stableName = `${pkg.name}.zip`;
const stablePath = join(distDir, stableName);

execFileSync(
  "git",
  [
    "archive",
    "--format=zip",
    "-o",
    stablePath,
    "HEAD",
    "--",
    ".",
    ...EXCLUDED_PATHS.map((path) => `:(exclude,top)${path}`),
  ],
  { cwd: repoRoot, stdio: "inherit" },
);

const size = (p) => `${(statSync(p).size / 1024).toFixed(1)} KB`;
console.log(`Wrote ${stablePath} (${size(stablePath)})`);
