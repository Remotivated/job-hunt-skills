// Keeps plugins/job-hunt-skills/ a text-only plugin.
//
// Run with:  node --test scripts/test-text-only.mjs   (or: npm run test:text-only)
//
// The main plugin ships Markdown, plain text, JSON, YAML, its PNG icon, and
// its license, and nothing that runs. Scripts, vendored modules, fonts, and
// code templates live in the optional companion plugin
// (plugins/job-hunt-skills-tools/), which the main plugin addresses only by
// skill name. These tests fail on any other file type in the main plugin, and
// on any instruction there that runs a script, names a script path, or pulls
// code or instructions from outside the plugin.

import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { lstatSync, readFileSync } from "node:fs";
import { dirname, join, posix, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, test } from "node:test";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PLUGIN = join(ROOT, "plugins/job-hunt-skills");

// Extension (lowercase, with the dot) of every file type the plugin may hold.
const TEXT_EXTENSIONS = new Set([".md", ".txt", ".json", ".yaml", ".yml"]);
// Exact paths allowed without one of those extensions.
const NAMED_FILES = new Set([".claude-plugin/icon.png", "LICENSE"]);

function git(args, cwd = ROOT) {
  const run = spawnSync("git", args, { cwd, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  assert.equal(run.status, 0, run.stderr);
  return run.stdout.split("\0").filter(Boolean);
}

// Tracked files that still exist, plus new files not yet staged, so the check
// sees the working package as a user would install it.
function pluginFiles() {
  const tracked = git(["ls-files", "-z"], PLUGIN).filter((path) => {
    try {
      lstatSync(join(PLUGIN, path));
      return true;
    } catch (error) {
      if (error.code === "ENOENT") return false;
      throw error;
    }
  });
  const added = git(["ls-files", "--others", "--exclude-standard", "-z"], PLUGIN);
  return [...new Set([...tracked, ...added])].sort();
}

function isAllowed(path) {
  if (NAMED_FILES.has(path)) return true;
  return TEXT_EXTENSIONS.has(posix.extname(path).toLowerCase());
}

// Every file whose text a host loads as instructions or shows as the plugin's
// description: skills, shared references and their generated copies, guides,
// templates, agent metadata, and the README.
function instructionFiles() {
  return pluginFiles().filter((path) =>
    path === "README.md" ||
    /^(skills|guides|templates)\//.test(path) ||
    /^\.(claude|codex)-plugin\/plugin\.json$/.test(path),
  );
}

// Patterns that mean "run code" or "load something from outside the plugin".
const FORBIDDEN = [
  { name: "a node command", pattern: /(^|[\s`"'(])(?:[\w.~-]*\/)*node(?:\.exe)?\s+["'{./\w-]/m },
  { name: "a scripts/ path", pattern: /scripts\// },
  { name: "a script file", pattern: /\.(?:mjs|cjs|js|ts|py|sh|ps1)\b(?![\w-])/ },
  { name: "a package install or download", pattern: /\b(?:npm|pnpm|yarn)\s+(?:install|i|add|ci|exec)\b|\bnpx\s+\S|\bpip3?\s+install\b|\b(?:brew|winget|snap|apt|apt-get)\s+install\b|\b(?:curl|wget)\s+\S/ },
  { name: "a pipe into a shell", pattern: /\|\s*(?:ba|z)?sh\b/ },
];

function findForbidden(text) {
  return FORBIDDEN.filter(({ pattern }) => pattern.test(text)).map(({ name }) => name);
}

describe("text-only main plugin", () => {
  const files = pluginFiles();

  test("holds only Markdown, plain text, JSON, YAML, the icon, and the license", () => {
    assert.ok(files.length > 50, `expected the plugin folder to be tracked, found ${files.length} files`);
    const rejected = files.filter((path) => !isAllowed(path));
    assert.deepEqual(rejected, [], `files the text-only plugin may not hold:\n${rejected.join("\n")}`);
  });

  test("the file-type rule rejects code, fonts, and markup templates", () => {
    for (const path of [
      "scripts/state.mjs",
      "skills/x/helper.js",
      "templates/resume.typ",
      "templates/preview-template.html",
      "templates/fonts/Gelasio-Regular.ttf",
      "guides/.gitkeep",
      "icon.png",
      "skills/x/run.sh",
    ]) {
      assert.equal(isAllowed(path), false, path);
    }
    for (const path of ["README.md", "LICENSE", ".claude-plugin/plugin.json", ".claude-plugin/icon.png", "skills/x/agents/openai.yaml"]) {
      assert.equal(isAllowed(path), true, path);
    }
  });

  test("no instruction runs a script, names a script path, or installs anything", () => {
    const docs = instructionFiles();
    assert.ok(docs.some((path) => path.includes("/references/")), "generated reference copies must be checked");
    assert.ok(docs.some((path) => path.startsWith("guides/")), "guides must be checked");
    const problems = [];
    for (const path of docs) {
      for (const name of findForbidden(readFileSync(join(PLUGIN, path), "utf8"))) {
        problems.push(`${path}: ${name}`);
      }
    }
    assert.deepEqual(problems, [], problems.join("\n"));
  });

  test("the invocation rule catches the forms the plugin used to ship", () => {
    for (const text of [
      'node "{job_hunt_skills_root}/scripts/state.mjs" tracker upsert --id x',
      "Run `node scripts/scaffold-state.mjs` first.",
      "then /usr/bin/node x",
      "use {job_hunt_skills_root}/scripts/export-documents.mjs",
      "the exporter in scripts/vendor/",
      "npm install markdown-it",
      "curl -fsSL https://example.com/x | sh",
      "brew install typst",
    ]) {
      assert.notDeepEqual(findForbidden(text), [], text);
    }
    for (const text of [
      "This plugin contains no scripts or other code.",
      "Node 22 or newer is needed only by the companion.",
      "Open `resume.html` in your browser.",
    ]) {
      assert.deepEqual(findForbidden(text), [], text);
    }
  });

  test("no instruction loads behaviour from outside the plugin", () => {
    const problems = [];
    for (const path of instructionFiles().filter((p) => p.startsWith("skills/"))) {
      const text = readFileSync(join(PLUGIN, path), "utf8");
      // A skill reads its own references/ copies and the plugin's guides,
      // never a file outside the plugin or the companion's files, and never
      // fetches instructions from the web.
      for (const [, target] of text.matchAll(/\]\((\.\.\/[^)\s#]*)/g)) {
        const resolved = resolve(dirname(join(PLUGIN, path)), target);
        if (!resolved.startsWith(PLUGIN + sep)) problems.push(`${path}: links outside the plugin folder (${target})`);
      }
      if (/job-hunt-skills-tools\//.test(text)) problems.push(`${path}: names a companion file path`);
      if (/(?:fetch|download|load|read)[^.\n]{0,40}(?:instructions|skill|rules)[^.\n]{0,40}https?:\/\//i.test(text)) {
        problems.push(`${path}: pulls instructions from a URL`);
      }
    }
    assert.deepEqual(problems, [], problems.join("\n"));
  });

  test("the manifests declare no hooks, MCP servers, or apps", () => {
    for (const manifest of [".claude-plugin/plugin.json", ".codex-plugin/plugin.json"]) {
      const data = JSON.parse(readFileSync(join(PLUGIN, manifest), "utf8"));
      for (const key of ["hooks", "mcpServers", "apps", "commands", "agents"]) {
        assert.equal(key in data, false, `${manifest} must not declare ${key}`);
      }
    }
  });
});
