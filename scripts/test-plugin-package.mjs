// Checks that plugins/job-hunt-skills/ works as a standalone package.
//
// Run with:  node --test scripts/test-plugin-package.mjs   (or: npm run test:plugin)
//
// Installers, the release ZIP, and the plugin directory receive only the
// plugin folder. These tests keep that folder self-contained and inside the
// plugin directory's pre-submission limits (file types, sizes, count, a
// README that works as the listing description, a license), and check that
// the release ZIP is exactly that folder plus the generated Codex marketplace.

import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, lstatSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, extname, join, posix, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, test } from "node:test";

import { CODEX_MARKETPLACE, PLUGIN_DIR, buildZip, releaseCodexMarketplace } from "./build-cowork-zip.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PLUGIN = join(ROOT, PLUGIN_DIR);

const KIB = 1024;
const MAX_FILE_BYTES = 256 * KIB;
const MAX_FILES = 512;
const MEDIA_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".gif", ".webp", ".ttf", ".otf", ".woff", ".woff2"]);

function git(args, cwd = ROOT) {
  const run = spawnSync("git", args, { cwd, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  assert.equal(run.status, 0, run.stderr);
  return run.stdout;
}

// [{ mode, path }] for every non-ignored file currently in the plugin folder.
function trackedPluginFiles() {
  const tracked = git(["ls-files", "-s", "-z"], PLUGIN)
    .split("\0")
    .filter(Boolean)
    .map((line) => {
      const [meta, path] = line.split("\t");
      return { mode: meta.split(" ")[0], path };
    })
    .filter(({ path }) => {
      try {
        lstatSync(join(PLUGIN, path)); // Include dangling symlinks so the rule rejects them.
        return true;
      } catch (error) {
        if (error.code === "ENOENT") return false;
        throw error;
      }
    });
  const added = git(["ls-files", "--others", "--exclude-standard", "-z"], PLUGIN)
    .split("\0")
    .filter(Boolean)
    .map((path) => ({ mode: lstatSync(join(PLUGIN, path)).isSymbolicLink() ? "120000" : "100644", path }));
  // Check the working package, including generated modules before staging.
  return [...tracked, ...added];
}

function isBinary(buffer) {
  return buffer.subarray(0, 8000).includes(0);
}

function proseWordCount(markdown) {
  const withoutCode = markdown.replace(/^(```|~~~)[\s\S]*?^\1[^\n]*$/gm, "").replace(/`[^`]*`/g, "");
  const withoutMarkup = withoutCode
    .replace(/<[^>]+>/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\]\([^)]*\)/g, "]");
  return (withoutMarkup.match(/[A-Za-z][A-Za-z'-]*/g) ?? []).length;
}

// Entry names from a ZIP's central directory (no decompression needed).
function zipEntryNames(buffer) {
  let eocd = -1;
  for (let i = buffer.length - 22; i >= Math.max(0, buffer.length - 65557); i -= 1) {
    if (buffer.readUInt32LE(i) === 0x06054b50) {
      eocd = i;
      break;
    }
  }
  assert.ok(eocd >= 0, "ZIP end-of-central-directory record not found");
  const count = buffer.readUInt16LE(eocd + 10);
  let offset = buffer.readUInt32LE(eocd + 16);
  const names = [];
  for (let i = 0; i < count; i += 1) {
    assert.equal(buffer.readUInt32LE(offset), 0x02014b50, "bad central directory entry");
    const nameLength = buffer.readUInt16LE(offset + 28);
    const extraLength = buffer.readUInt16LE(offset + 30);
    const commentLength = buffer.readUInt16LE(offset + 32);
    names.push(buffer.subarray(offset + 46, offset + 46 + nameLength).toString("utf8"));
    offset += 46 + nameLength + extraLength + commentLength;
  }
  return names;
}

describe("plugin folder contents", () => {
  const files = trackedPluginFiles();

  test("is populated and within the file-count limit", () => {
    assert.ok(files.length > 50, `expected the plugin folder to be tracked, found ${files.length} files`);
    assert.ok(files.length <= MAX_FILES, `${files.length} files exceeds the ${MAX_FILES}-file limit`);
  });

  test("has no symlinks, submodules, or OS clutter", () => {
    for (const { mode, path } of files) {
      assert.notEqual(mode, "120000", `${path} is a symlink`);
      assert.notEqual(mode, "160000", `${path} is a submodule`);
      assert.ok(![".DS_Store", "Thumbs.db", "desktop.ini"].includes(posix.basename(path)), `${path} is OS clutter`);
    }
  });

  test("has no .gitattributes, hooks, MCP servers, or package manifests", () => {
    for (const { path } of files) {
      assert.notEqual(posix.basename(path), ".gitattributes", `${path}: keep git attributes out of the plugin folder`);
      assert.ok(!path.startsWith("hooks/"), `${path}: the plugin ships no hooks`);
      assert.ok(![".mcp.json"].includes(path), `${path}: the plugin ships no MCP servers`);
    }
    for (const name of ["package.json", "package-lock.json", "npm-shrinkwrap.json", "yarn.lock", "pnpm-lock.yaml"]) {
      assert.equal(existsSync(join(PLUGIN, name)), false, `${name} belongs at the repository root, not in the plugin folder`);
    }
    for (const manifest of [".claude-plugin/plugin.json", ".codex-plugin/plugin.json"]) {
      const data = JSON.parse(readFileSync(join(PLUGIN, manifest), "utf8"));
      for (const key of ["hooks", "mcpServers", "apps"]) {
        assert.equal(key in data, false, `${manifest} must not declare ${key}`);
      }
    }
  });

  test("ships only text, images, and fonts", () => {
    for (const { path } of files) {
      const buffer = readFileSync(join(PLUGIN, path));
      if (!isBinary(buffer)) continue;
      assert.ok(
        MEDIA_EXTENSIONS.has(extname(path).toLowerCase()),
        `${path} is binary; only images and fonts may be binary in the plugin folder`,
      );
    }
  });

  test(`keeps every text file under ${MAX_FILE_BYTES / KIB} KiB`, () => {
    for (const { path } of files) {
      if (MEDIA_EXTENSIONS.has(extname(path).toLowerCase())) continue;
      const size = statSync(join(PLUGIN, path)).size;
      assert.ok(size < MAX_FILE_BYTES, `${path} is ${(size / KIB).toFixed(1)} KiB`);
    }

  });

  test("LICENSE is identical to the repository LICENSE and the manifests say MIT", () => {
    assert.equal(readFileSync(join(PLUGIN, "LICENSE"), "utf8"), readFileSync(join(ROOT, "LICENSE"), "utf8"));
    for (const manifest of [".claude-plugin/plugin.json", ".codex-plugin/plugin.json"]) {
      assert.equal(JSON.parse(readFileSync(join(PLUGIN, manifest), "utf8")).license, "MIT", manifest);
    }
  });

  test("README works as the plugin directory listing description", () => {
    const readme = readFileSync(join(PLUGIN, "README.md"), "utf8");
    assert.ok(proseWordCount(readme) >= 40, "README needs at least 40 words outside code blocks");
    const skills = readdirSync(join(PLUGIN, "skills"), { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && existsSync(join(PLUGIN, "skills", entry.name, "SKILL.md")))
      .map((entry) => entry.name);
    for (const skill of skills) {
      assert.ok(readme.includes(`skills/${skill}/SKILL.md`), `README must list ${skill}`);
    }
    // Images resolve outside the plugin only through absolute URLs.
    for (const [, src] of readme.matchAll(/!\[[^\]]*\]\(([^)\s]+)/g)) {
      assert.match(src, /^https:\/\//, `README image ${src} must be an absolute https URL`);
    }
    for (const [, src] of readme.matchAll(/<img[^>]+src="([^"]+)"/g)) {
      assert.match(src, /^https:\/\//, `README image ${src} must be an absolute https URL`);
    }
    assert.match(readme, /typst/i, "README must disclose the optional local typst run");
    assert.match(readme, /network/i, "README must say what the scripts send over the network");
  });

  test("every bundled path a skill names resolves inside the plugin folder", () => {
    const docs = [];
    const walk = (dir) => {
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const full = join(dir, entry.name);
        if (entry.isDirectory()) walk(full);
        else if (entry.name.endsWith(".md")) docs.push(full);
      }
    };
    walk(join(PLUGIN, "skills"));
    let checked = 0;
    for (const doc of docs) {
      const text = readFileSync(doc, "utf8");
      for (const [, rel] of text.matchAll(/\{job_hunt_skills_root\}\/([A-Za-z0-9_./-]+)/g)) {
        assert.ok(existsSync(join(PLUGIN, rel)), `${doc}: {job_hunt_skills_root}/${rel} is not in the plugin folder`);
        checked += 1;
      }
      for (const [, rel] of text.matchAll(/`((?:guides|templates)\/[A-Za-z0-9_./-]+)`/g)) {
        assert.ok(existsSync(join(PLUGIN, rel)), `${doc}: ${rel} is not in the plugin folder`);
        checked += 1;
      }
    }
    assert.ok(checked > 20, `expected skills to reference bundled files, found ${checked}`);
  });
});

describe("release ZIP", () => {
  test("generated Codex marketplace points at the ZIP root", () => {
    const marketplace = JSON.parse(releaseCodexMarketplace());
    assert.equal(marketplace.name, "remotivated");
    assert.deepEqual(marketplace.plugins.map((plugin) => plugin.source), [{ source: "local", path: "./" }]);
  });

  test("contains exactly the committed plugin folder plus the Codex marketplace", () => {
    const tmp = mkdtempSync(join(tmpdir(), "job-hunt-zip-"));
    try {
      const zipPath = buildZip(join(tmp, "job-hunt-skills.zip"));
      const entries = zipEntryNames(readFileSync(zipPath)).filter((name) => !name.endsWith("/"));
      const committed = git(["ls-tree", "-r", "--name-only", "-z", `HEAD:${PLUGIN_DIR}`])
        .split("\0")
        .filter(Boolean);
      assert.deepEqual([...entries].sort(), [...committed, CODEX_MARKETPLACE].sort());
      for (const required of [".claude-plugin/plugin.json", ".codex-plugin/plugin.json", "README.md", "LICENSE"]) {
        assert.ok(entries.includes(required), `ZIP root must contain ${required}`);
      }
    } finally {
      rmSync(tmp, { recursive: true, force: true });
    }
  });
});
