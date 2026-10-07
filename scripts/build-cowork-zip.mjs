#!/usr/bin/env node
// Builds a Claude/Cowork/Codex-ready plugin ZIP from the current git HEAD.
//
// Uses `git archive --format=zip HEAD:plugins/job-hunt-skills` so:
//   - tracked files only are included,
//   - only the plugin folder is packaged; repository-only material
//     (examples, prompts, contributor scripts, CI) never reaches users,
//   - no top-level wrapper directory is added, so
//     .claude-plugin/plugin.json and .codex-plugin/plugin.json sit at the
//     ZIP root where their plugin loaders expect them.
//
// One file is added that is not tracked in the plugin folder: a Codex
// marketplace at .agents/plugins/marketplace.json whose plugin source is the
// ZIP root ("./"). It is generated from the repository's marketplace so an
// unpacked release can still be added with `codex plugin marketplace add`.
// It stays out of the plugin folder itself because a marketplace is not part
// of the plugin that directory installs receive.
//
// Usage: node scripts/build-cowork-zip.mjs [output.zip]

import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const PLUGIN_DIR = "plugins/job-hunt-skills";
export const CODEX_MARKETPLACE = ".agents/plugins/marketplace.json";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

// The repository marketplace, re-pointed at the ZIP root.
export function releaseCodexMarketplace(root = repoRoot) {
  const marketplace = JSON.parse(readFileSync(join(root, CODEX_MARKETPLACE), "utf8"));
  const plugins = marketplace.plugins.map((plugin) => {
    if (plugin.source?.path !== `./${PLUGIN_DIR}`) {
      throw new Error(`${CODEX_MARKETPLACE}: expected ${plugin.name} to point at ./${PLUGIN_DIR}`);
    }
    return { ...plugin, source: { ...plugin.source, path: "./" } };
  });
  return `${JSON.stringify({ ...marketplace, plugins }, null, 2)}\n`;
}

export function buildZip(outPath) {
  mkdirSync(dirname(outPath), { recursive: true });
  execFileSync(
    "git",
    [
      "archive",
      "--format=zip",
      "-o",
      outPath,
      `--add-virtual-file=${CODEX_MARKETPLACE}:${releaseCodexMarketplace()}`,
      `HEAD:${PLUGIN_DIR}`,
    ],
    { cwd: repoRoot, stdio: "inherit" },
  );
  return outPath;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const manifest = JSON.parse(readFileSync(join(repoRoot, PLUGIN_DIR, ".claude-plugin/plugin.json"), "utf8"));
  const outPath = process.argv[2]
    ? resolve(process.argv[2])
    : join(repoRoot, "dist", `${manifest.name}.zip`);
  buildZip(outPath);
  console.log(`Wrote ${outPath} (${(statSync(outPath).size / 1024).toFixed(1)} KB)`);
}
