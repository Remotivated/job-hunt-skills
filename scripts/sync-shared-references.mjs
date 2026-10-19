#!/usr/bin/env node
// Copies the shared rule files into every skill folder.
//
// The rule files live once in plugins/job-hunt-skills/skills/_shared/, which
// is the only place to edit them. Some hosts let a skill read only files
// inside its own folder, so each skill also carries a generated copy in
// skills/<skill>/references/, and its SKILL.md links that copy. A copy is the
// source with a one-line banner on top; nothing else changes, so the links
// between the rule files keep working inside references/.
//
// Usage:
//   node scripts/sync-shared-references.mjs           (or: npm run sync:shared)
//   node scripts/sync-shared-references.mjs --check   exit 1 if any copy is stale
//
// `npm run test:plugin` runs the same check.

import { existsSync, mkdirSync, readFileSync, readdirSync, realpathSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PLUGIN = join(repoRoot, "plugins", "job-hunt-skills");

const SHARED = "skills/_shared";
const REFERENCES = "references";
const BANNER_START = "<!-- Generated from skills/_shared/";

export function bannerFor(name) {
  return `${BANNER_START}${name} in the source repository. Contributors edit that file and run npm run sync:shared; this note is not part of the rules. -->\n\n`;
}

const normalize = (text) => text.replace(/\r\n/g, "\n");

function sharedSources(pluginRoot) {
  return readdirSync(join(pluginRoot, SHARED))
    .filter((name) => name.endsWith(".md"))
    .sort();
}

function skillNames(pluginRoot) {
  return readdirSync(join(pluginRoot, "skills"), { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && existsSync(join(pluginRoot, "skills", entry.name, "SKILL.md")))
    .map((entry) => entry.name)
    .sort();
}

// Every copy that should exist, as plugin-relative paths with their content.
function expectedCopies(pluginRoot) {
  const sources = sharedSources(pluginRoot).map((name) => ({
    name,
    content: bannerFor(name) + normalize(readFileSync(join(pluginRoot, SHARED, name), "utf8")),
  }));
  return skillNames(pluginRoot).flatMap((skill) =>
    sources.map(({ name, content }) => ({ path: `skills/${skill}/${REFERENCES}/${name}`, content })),
  );
}

// Generated copies whose source file no longer exists. Files in references/
// without the banner belong to the skill and are left alone.
function orphanedCopies(pluginRoot) {
  const sources = new Set(sharedSources(pluginRoot));
  const orphans = [];
  for (const skill of skillNames(pluginRoot)) {
    const dir = join(pluginRoot, "skills", skill, REFERENCES);
    if (!existsSync(dir)) continue;
    for (const name of readdirSync(dir).sort()) {
      if (sources.has(name) || !name.endsWith(".md")) continue;
      if (readFileSync(join(dir, name), "utf8").startsWith(BANNER_START)) {
        orphans.push(`skills/${skill}/${REFERENCES}/${name}`);
      }
    }
  }
  return orphans;
}

// [{ path, problem: "missing" | "differs" | "orphaned" }], sorted by path.
export function findSharedDrift(pluginRoot = PLUGIN) {
  const drift = [];
  for (const { path, content } of expectedCopies(pluginRoot)) {
    const full = join(pluginRoot, path);
    if (!existsSync(full)) drift.push({ path, problem: "missing" });
    else if (normalize(readFileSync(full, "utf8")) !== content) drift.push({ path, problem: "differs" });
  }
  for (const path of orphanedCopies(pluginRoot)) drift.push({ path, problem: "orphaned" });
  return drift.sort((a, b) => a.path.localeCompare(b.path));
}

export function syncSharedReferences(pluginRoot = PLUGIN) {
  const written = [];
  for (const { path, content } of expectedCopies(pluginRoot)) {
    const full = join(pluginRoot, path);
    if (existsSync(full) && normalize(readFileSync(full, "utf8")) === content) continue;
    mkdirSync(dirname(full), { recursive: true });
    writeFileSync(full, content);
    written.push(path);
  }
  const removed = orphanedCopies(pluginRoot);
  for (const path of removed) rmSync(join(pluginRoot, path));
  return { written, removed };
}

if (process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (process.argv.includes("--check")) {
    const drift = findSharedDrift();
    if (drift.length) {
      console.error("Shared rule copies are out of date. Run npm run sync:shared.\n");
      for (const { path, problem } of drift) console.error(`- ${problem}: plugins/job-hunt-skills/${path}`);
      process.exit(1);
    }
    console.log("Shared rule copies are up to date.");
  } else {
    const { written, removed } = syncSharedReferences();
    for (const path of written) console.log(`wrote   plugins/job-hunt-skills/${path}`);
    for (const path of removed) console.log(`removed plugins/job-hunt-skills/${path}`);
    if (!written.length && !removed.length) console.log("Shared rule copies are already up to date.");
  }
}
