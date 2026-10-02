// Tests for the deterministic state boundary (scripts/state.mjs) and the
// plugin/user path split (scripts/workspace.mjs).
//
// Run with:  node --test scripts/test-state.mjs   (or: npm run test:state)
//
// Tracker and report behavior is data-driven from scripts/fixtures/state/,
// the same fixture set the native-file fallback in state-layer.md §12 is
// contract-checked against.

import assert from "node:assert/strict";
import { spawn, spawnSync } from "node:child_process";
import fs from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, test } from "node:test";
import { fileURLToPath } from "node:url";

import { StateError, upsertTrackerFile, writeReport, parseTracker } from "./state.mjs";
import { PLUGIN_PATHS, USER_PATHS, USER_ROOT, isPluginLocation } from "./workspace.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const FIXTURES = path.join(ROOT, "scripts/fixtures/state");
const STATE = path.join(ROOT, "scripts/state.mjs");
const SCAFFOLD = path.join(ROOT, "scripts/scaffold-state.mjs");
const { cases } = JSON.parse(fs.readFileSync(path.join(FIXTURES, "cases.json"), "utf8"));

const fixture = (name) => fs.readFileSync(path.join(FIXTURES, name), "utf8");

function workspace({ tracker, reports = [] } = {}) {
  const root = fs.mkdtempSync(path.join(tmpdir(), "job-hunt-state-"));
  const md = path.join(root, USER_ROOT);
  fs.mkdirSync(path.join(md, "reports"), { recursive: true });
  if (tracker !== undefined) fs.writeFileSync(path.join(md, "applications.md"), tracker);
  for (const name of reports) fs.writeFileSync(path.join(md, "reports", name), "---\nreport_id: 0\n---\n");
  return root;
}

const trackerPath = (root) => path.join(root, USER_ROOT, "applications.md");
const reportNames = (root) => fs.readdirSync(path.join(root, USER_ROOT, "reports")).sort();

function reportContent(frontmatter) {
  const lines = Object.entries(frontmatter).map(([k, v]) => `${k}: ${v === null ? "null" : v}`);
  return `---\n${lines.join("\n")}\n---\n\n# Body\n`;
}

function capture(fn) {
  try {
    return { ok: true, ...fn() };
  } catch (error) {
    if (!(error instanceof StateError)) throw error;
    return { ok: false, error: error.code, ...error.details };
  }
}

function runCli(args, cwd, input) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [STATE, ...args], { cwd });
    let stdout = "";
    child.stdout.on("data", (d) => (stdout += d));
    child.on("close", (status) => resolve({ status, json: JSON.parse(stdout) }));
    child.stdin.end(input ?? "");
  });
}

function assertNoLeftovers(root) {
  const leftovers = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name.startsWith(".tmp-") || entry.name.startsWith(".state.lock")) leftovers.push(entry.name);
      if (entry.isDirectory()) walk(path.join(dir, entry.name));
    }
  };
  walk(path.join(root, USER_ROOT));
  assert.deepEqual(leftovers, [], "temp files and locks must be cleaned up");
}

const runners = {
  check(c) {
    return capture(() => ({ rows: parseTracker(fixture(c.input)).rows.length }));
  },

  upsert(c) {
    const root = workspace({ tracker: fixture(c.input) });
    const before = fs.readFileSync(trackerPath(root), "utf8");
    const result = capture(() => upsertTrackerFile(root, c.args));
    const after = fs.readFileSync(trackerPath(root), "utf8");
    if (!result.ok) assert.equal(after, before, `${c.name}: a refusal must not touch the file`);
    if (c.expect.output) assert.equal(after, fixture(c.expect.output), `${c.name}: output`);
    if ("warnings" in c.expect) assert.equal(result.warnings.length, c.expect.warnings, c.name);
    assertNoLeftovers(root);
    return result;
  },

  "tracker-conflict"(c) {
    const root = workspace({ tracker: fixture(c.input) });
    const edited = `${fixture(c.input)}\n- edited by hand mid-run\n`;
    const result = capture(() =>
      upsertTrackerFile(root, c.args, { beforeCommit: () => fs.writeFileSync(trackerPath(root), edited) }),
    );
    assert.equal(fs.readFileSync(trackerPath(root), "utf8"), edited, "the concurrent edit must survive");
    assertNoLeftovers(root);
    return result;
  },

  async "tracker-concurrent"(c) {
    const root = workspace({ tracker: fixture(c.input) });
    const runs = await Promise.all(
      Array.from({ length: c.writers }, (_, i) =>
        runCli(["tracker", "upsert", "--id", `parallel-role-${i}`, "--company", `Parallel ${i}`, "--role", "Role", "--today", "2026-10-01"], root),
      ),
    );
    for (const run of runs) assert.equal(run.status, 0, JSON.stringify(run.json));
    assertNoLeftovers(root);
    return { ok: true, rows: parseTracker(fs.readFileSync(trackerPath(root), "utf8")).rows.length };
  },

  report(c) {
    const root = workspace({ reports: c.existing });
    const before = reportNames(root);
    const result = capture(() => writeReport(root, { slug: c.slug, content: reportContent(c.frontmatter) }));
    if (result.ok) {
      const written = fs.readFileSync(path.join(root, result.path), "utf8");
      assert.match(written, new RegExp(`^---\\nreport_id: ${result.report_id}\\n`), "report_id is stamped first");
      assert.equal((written.match(/^report_id:/gm) || []).length, 1);
    } else {
      assert.deepEqual(reportNames(root), before, `${c.name}: a refusal must not add a report`);
    }
    assertNoLeftovers(root);
    return result;
  },

  async "report-concurrent"(c) {
    const root = workspace({ reports: c.existing });
    const content = reportContent({ company: null, role: null, application_id: null, skill: "claim-check", date: "2026-10-01", summary: "x" });
    const runs = await Promise.all(
      Array.from({ length: c.writers }, () => runCli(["report", "write", "--slug", "claim-check"], root, content)),
    );
    for (const run of runs) assert.equal(run.status, 0, JSON.stringify(run.json));
    const ids = new Set(runs.map((r) => r.json.report_id));
    assert.equal(reportNames(root).length, c.existing.length + c.writers);
    assertNoLeftovers(root);
    return { ok: true, distinct: ids.size };
  },

  "report-collision"(c) {
    const root = workspace({ reports: c.existing });
    const squatter = "written by something that is not the helper\n";
    const result = capture(() =>
      writeReport(
        root,
        { slug: c.slug, content: reportContent(c.frontmatter) },
        { beforeCommit: (target) => fs.writeFileSync(target, squatter) },
      ),
    );
    const names = reportNames(root);
    assert.equal(names.length, c.existing.length + 1);
    const added = names.find((n) => !c.existing.includes(n));
    assert.equal(fs.readFileSync(path.join(root, USER_ROOT, "reports", added), "utf8"), squatter, "never overwritten");
    assertNoLeftovers(root);
    return result;
  },
};

describe("state fixtures (shared with the native-file contract)", () => {
  for (const c of cases) {
    test(`${c.rules.join(" ")}: ${c.name}`, async () => {
      const result = await runners[c.kind](c);
      for (const [key, value] of Object.entries(c.expect)) {
        if (key === "output" || key === "warnings") continue;
        assert.deepEqual(result[key], value, `${c.name}: ${key} (${JSON.stringify(result)})`);
      }
    });
  }
});

describe("state helper CLI", () => {
  test("prints JSON and exits 3 on a refusal without writing", async () => {
    const root = workspace({ tracker: fixture("malformed-cell-count.md") });
    const run = await runCli(["tracker", "upsert", "--id", "acme-pm", "--status", "applied", "--user-confirmed"], root);
    assert.equal(run.status, 3);
    assert.equal(run.json.error, "parse_error");
    assert.match(run.json.region, /> 6 \| \| initech-analyst/);
    assert.equal(fs.readFileSync(trackerPath(root), "utf8"), fixture("malformed-cell-count.md"));
  });

  test("preserves CRLF line endings", () => {
    const root = workspace({ tracker: fixture("canonical.md").replaceAll("\n", "\r\n") });
    upsertTrackerFile(root, { id: "ghost-ops-manager", fields: { link: "https://example.com/ghost" }, today: "2026-10-01" });
    const text = fs.readFileSync(trackerPath(root), "utf8");
    assert.equal(text.split("\r\n").length, text.split("\n").length);
  });

  test("an abandoned lock from a dead process is recovered", async () => {
    const root = workspace({ tracker: fixture("canonical.md") });
    const lock = path.join(root, USER_ROOT, ".state.lock");
    fs.mkdirSync(lock);
    fs.writeFileSync(path.join(lock, "owner.json"), JSON.stringify({ pid: 2 ** 22 + 12345, token: "dead" }));
    const run = await runCli(["tracker", "upsert", "--id", "ghost-ops-manager", "--link", "https://example.com/g"], root);
    assert.equal(run.status, 0, JSON.stringify(run.json));
    assertNoLeftovers(root);
  });

  test("a live lock times out as busy without writing", () => {
    const root = workspace({ tracker: fixture("canonical.md") });
    const lock = path.join(root, USER_ROOT, ".state.lock");
    fs.mkdirSync(lock);
    fs.writeFileSync(path.join(lock, "owner.json"), JSON.stringify({ pid: process.pid, token: "live" }));
    const run = spawnSync(process.execPath, [STATE, "tracker", "upsert", "--id", "ghost-ops-manager", "--link", "https://example.com/g"], {
      cwd: root,
      encoding: "utf8",
      env: { ...process.env, JOB_HUNT_STATE_LOCK_TIMEOUT_MS: "200" },
    });
    assert.equal(run.status, 4, run.stdout);
    assert.equal(fs.readFileSync(trackerPath(root), "utf8"), fixture("canonical.md"));
  });

  test("refuses to run inside the plugin with the workspace recovery message", () => {
    const run = spawnSync(process.execPath, [STATE, "tracker", "check"], {
      cwd: path.join(ROOT, "skills"),
      encoding: "utf8",
      env: { ...process.env, JOB_HUNT_SKILLS_DEV: "" },
    });
    assert.equal(run.status, 2);
    assert.match(run.stderr, /Claude Code:    cd into your job-hunt folder, then run 'claude' there\./);
    assert.equal(fs.existsSync(path.join(ROOT, "skills", USER_ROOT)), false);
  });
});

describe("plugin and user paths", () => {
  const isDir = (p) => p.endsWith("/");
  const covers = (entry, file) => (isDir(entry) ? file.startsWith(entry) : file === entry);

  test("the two sets are disjoint and user paths stay under my-documents/", () => {
    for (const user of USER_PATHS) {
      assert.ok(user === `${USER_ROOT}/` || user.startsWith(`${USER_ROOT}/`), user);
      for (const plugin of PLUGIN_PATHS) {
        assert.ok(!covers(plugin, user) && !covers(user, plugin), `${plugin} overlaps ${user}`);
      }
    }
  });

  test("every tracked repository file is plugin-owned, except the empty my-documents/ skeleton", () => {
    const tracked = spawnSync("git", ["ls-files"], { cwd: ROOT, encoding: "utf8" }).stdout.trim().split("\n");
    for (const file of tracked) {
      if (file.startsWith(`${USER_ROOT}/`)) {
        assert.equal(path.posix.basename(file), ".gitkeep", `${file}: user documents are never committed`);
        continue;
      }
      assert.equal(PLUGIN_PATHS.filter((p) => covers(p, file)).length, 1, `${file} must be classified exactly once`);
    }
  });

  test("state-layer.md publishes exactly the same path lists", () => {
    const doc = fs.readFileSync(path.join(ROOT, "skills/_shared/state-layer.md"), "utf8");
    const block = (heading) => {
      const match = new RegExp(`\\*\\*${heading}\\*\\*[^\\n]*\\n+\`\`\`text\\n([\\s\\S]*?)\`\`\``).exec(doc);
      assert.ok(match, `state-layer.md must have a ${heading} block`);
      return match[1].trim().split("\n").map((l) => l.trim());
    };
    assert.deepEqual(block("Plugin-owned paths"), [...PLUGIN_PATHS]);
    assert.deepEqual(block("User-owned paths"), [...USER_PATHS]);
  });

  test("the scaffolder and helper write only user paths in a separate workspace", () => {
    const root = fs.mkdtempSync(path.join(tmpdir(), "job-hunt-paths-"));
    try {
      assert.equal(isPluginLocation(root), false);
      assert.equal(spawnSync(process.execPath, [SCAFFOLD], { cwd: root }).status, 0);
      const content = reportContent({ company: null, role: null, application_id: null, skill: "claim-check", date: "2026-10-01", summary: "x" });
      assert.equal(spawnSync(process.execPath, [STATE, "report", "write", "--slug", "claim-check"], { cwd: root, input: content }).status, 0);
      assert.equal(
        spawnSync(process.execPath, [STATE, "tracker", "upsert", "--id", "acme-pm", "--company", "Acme", "--role", "PM"], { cwd: root }).status,
        0,
      );
      const written = spawnSync("find", [".", "-mindepth", "1"], { cwd: root, encoding: "utf8" }).stdout.trim().split("\n");
      for (const entry of written) {
        const rel = entry.replace(/^\.\//, "");
        const under = USER_PATHS.some((u) => covers(u, rel) || covers(u, `${rel}/`));
        assert.ok(under, `${rel} is outside the user paths`);
      }
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  });

  test("the scaffold template is a valid empty canonical tracker", () => {
    const root = fs.mkdtempSync(path.join(tmpdir(), "job-hunt-scaffold-"));
    try {
      spawnSync(process.execPath, [SCAFFOLD], { cwd: root });
      const parsed = parseTracker(fs.readFileSync(trackerPath(root), "utf8"));
      assert.equal(parsed.rows.length, 0);
      assert.deepEqual(parsed.keys, ["id", "company", "role", "status", "comp_expected", "source", "next_action_date", "updated", "link"]);
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  });
});
