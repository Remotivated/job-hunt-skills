// Tests for the opportunity envelope and snapshot boundary
// (scripts/opportunity.mjs).
//
// Run with:  node --test scripts/test-opportunity.mjs   (or: npm run test:opportunity)
//
// Behavior is data-driven from scripts/fixtures/opportunity/, the same fixture
// set the native-file fallback in state-layer.md §13 is contract-checked
// against.

import assert from "node:assert/strict";
import { spawn, spawnSync } from "node:child_process";
import fs from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, test } from "node:test";
import { fileURLToPath } from "node:url";

import {
  ENVELOPE_KEYS,
  RESERVED_KEYS,
  SOURCE_FIELDS,
  SOURCE_KINDS,
  checkOpportunity,
  normalizeEnvelope,
  parseSnapshot,
  serializeSnapshot,
  unknownFields,
  writeSnapshot,
} from "./opportunity.mjs";
import { StateError } from "./state.mjs";
import { USER_ROOT } from "./workspace.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const FIXTURES = path.join(ROOT, "scripts/fixtures/opportunity");
const HELPER = path.join(ROOT, "scripts/opportunity.mjs");
const SCAFFOLD = path.join(ROOT, "scripts/scaffold-state.mjs");
const { cases } = JSON.parse(fs.readFileSync(path.join(FIXTURES, "cases.json"), "utf8"));
const NOW = new Date("2026-10-03T12:00:00Z");

const envelope = (name) => JSON.parse(fs.readFileSync(path.join(FIXTURES, "envelopes", name), "utf8"));

function workspace(setup = {}) {
  const root = fs.mkdtempSync(path.join(tmpdir(), "job-hunt-opportunity-"));
  const md = path.join(root, USER_ROOT);
  fs.mkdirSync(path.join(md, "applications"), { recursive: true });
  fs.mkdirSync(path.join(md, "reports"), { recursive: true });
  for (const [rel, name] of Object.entries(setup.files ?? {})) {
    fs.mkdirSync(path.dirname(path.join(md, rel)), { recursive: true });
    fs.copyFileSync(path.join(FIXTURES, "files", name), path.join(md, rel));
  }
  for (const s of setup.snapshots ?? []) {
    writeSnapshot(root, { id: s.id, input: envelope(s.input), userConfirmed: true, today: "2026-10-01", now: NOW });
  }
  return root;
}

const appDir = (root, id) => path.join(root, USER_ROOT, "applications", id);
const listApp = (root, id) => (fs.existsSync(appDir(root, id)) ? fs.readdirSync(appDir(root, id)).sort() : []);

function snapshotBytes(root, id) {
  return Object.fromEntries(listApp(root, id).map((n) => [n, fs.readFileSync(path.join(appDir(root, id), n), "utf8")]));
}

function capture(fn) {
  try {
    return { ok: true, ...fn() };
  } catch (error) {
    if (!(error instanceof StateError)) throw error;
    return { ok: false, error: error.code, message: error.message, ...error.details };
  }
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

function runCli(args, cwd, input) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [HELPER, ...args], { cwd });
    let stdout = "";
    child.stdout.on("data", (d) => (stdout += d));
    child.on("close", (status) => resolve({ status, json: JSON.parse(stdout) }));
    child.stdin.end(input ?? "");
  });
}

const runners = {
  normalize(c) {
    return capture(() => {
      const { envelope: out, warnings } = normalizeEnvelope(envelope(c.input), { now: NOW });
      return {
        fingerprint: out.fingerprint,
        unknown: unknownFields(out),
        warnings: warnings.length,
        compensation: out.compensation,
        observed_at: out.observed_at,
      };
    });
  },

  roundtrip(c) {
    return capture(() => {
      const { envelope: out } = normalizeEnvelope(envelope(c.input), { now: NOW });
      const text = serializeSnapshot(out, { applicationId: "fixture-role", snapshot: 1, supersedes: null, captured: "2026-10-03" });
      const parsed = parseSnapshot(text);
      assert.deepEqual(parsed.envelope, out, `${c.name}: every field survives`);
      assert.deepEqual(normalizeEnvelope(parsed.envelope).envelope, out, `${c.name}: a re-read snapshot is a valid envelope`);
      assert.deepEqual(parsed.meta.unknown, unknownFields(out));
      for (const [key, value] of Object.entries(envelope(c.input))) {
        if (key !== "posting_text" && key !== "fingerprint") assert.deepEqual(parsed.envelope[key], value, `${c.name}: ${key}`);
      }
      return {};
    });
  },

  check(c) {
    const root = workspace(c.setup);
    const result = capture(() => checkOpportunity(root, envelope(c.input), { now: NOW }));
    if (result.ok) {
      result.snapshots = result.snapshots.map(({ path: _p, ...rest }) => rest);
      result.unreadable = result.unreadable.length;
    }
    return result;
  },

  snapshot(c) {
    const root = workspace(c.setup);
    const before = snapshotBytes(root, c.id);
    const result = capture(() =>
      writeSnapshot(root, { id: c.id, input: envelope(c.input), userConfirmed: c.confirmed, today: "2026-10-03", now: NOW }),
    );
    const after = snapshotBytes(root, c.id);
    for (const [name, text] of Object.entries(before)) assert.equal(after[name], text, `${c.name}: ${name} must never change`);
    assert.deepEqual(Object.keys(after).sort(), c.files_after, `${c.name}: files in the application folder`);
    if (result.ok && result.action !== "unchanged") {
      const written = parseSnapshot(after[`opportunity-${result.snapshot}.md`]);
      assert.equal(written.meta.application_id, c.id);
      assert.equal(written.meta.supersedes, result.supersedes);
    }
    assertNoLeftovers(root);
    return result;
  },

  async "snapshot-concurrent"(c) {
    const root = workspace();
    const runs = await Promise.all(
      Array.from({ length: c.writers }, (_, i) => {
        const input = JSON.stringify({ envelope_version: 1, source: { kind: "paste" }, posting_text: `Posting revision ${i}` });
        return runCli(["snapshot", "--id", c.id, "--user-confirmed", "--today", "2026-10-03"], root, input);
      }),
    );
    for (const run of runs) assert.equal(run.status, 0, JSON.stringify(run.json));
    assert.equal(listApp(root, c.id).length, c.writers);
    assertNoLeftovers(root);
    return { ok: true, distinct: new Set(runs.map((r) => r.json.snapshot)).size };
  },

  "snapshot-collision"(c) {
    const root = workspace();
    const squatter = "written by something that is not the helper\n";
    const result = capture(() =>
      writeSnapshot(
        root,
        { id: c.id, input: envelope(c.input), userConfirmed: true, today: "2026-10-03", now: NOW },
        { beforeCommit: (target) => fs.writeFileSync(target, squatter) },
      ),
    );
    assert.deepEqual(listApp(root, c.id), ["opportunity-1.md"]);
    assert.equal(fs.readFileSync(path.join(appDir(root, c.id), "opportunity-1.md"), "utf8"), squatter, "never overwritten");
    assertNoLeftovers(root);
    return result;
  },
};

describe("opportunity fixtures (shared with the native-file contract)", () => {
  for (const c of cases) {
    test(`${c.rules.join(" ")}: ${c.name}`, async () => {
      const result = await runners[c.kind](c);
      for (const [key, value] of Object.entries(c.expect)) {
        assert.deepEqual(result[key], value, `${c.name}: ${key} (${JSON.stringify(result)})`);
      }
    });
  }
});

describe("opportunity helper CLI", () => {
  test("check prints matches as JSON and writes nothing", async () => {
    const root = workspace({ snapshots: [{ id: "acme-pay-senior-pm", input: "url.json" }] });
    const before = snapshotBytes(root, "acme-pay-senior-pm");
    const run = await runCli(["check"], root, JSON.stringify(envelope("url-changed.json")));
    assert.equal(run.status, 0, JSON.stringify(run.json));
    assert.equal(run.json.snapshots[0].relation, "changed");
    assert.equal(run.json.snapshots[0].path, "my-documents/applications/acme-pay-senior-pm/opportunity-1.md");
    assert.equal(run.json.warnings.length, 1);
    assert.deepEqual(snapshotBytes(root, "acme-pay-senior-pm"), before);
  });

  test("an invalid envelope exits 3 with the reason", async () => {
    const root = workspace();
    const run = await runCli(["check"], root, JSON.stringify(envelope("bad-version.json")));
    assert.equal(run.status, 3);
    assert.equal(run.json.error, "invalid_envelope");
    assert.match(run.json.message, /envelope_version 2 is not supported/);
  });

  test("a missing confirmation exits 3 and creates no folder", async () => {
    const root = workspace();
    const run = await runCli(["snapshot", "--id", "acme-pay-senior-pm"], root, JSON.stringify(envelope("url.json")));
    assert.equal(run.status, 3);
    assert.equal(run.json.error, "confirmation_required");
    assert.equal(fs.existsSync(appDir(root, "acme-pay-senior-pm")), false);
  });

  test("a live lock times out as busy without writing", () => {
    const root = workspace();
    const lock = path.join(root, USER_ROOT, ".state.lock");
    fs.mkdirSync(lock);
    fs.writeFileSync(path.join(lock, "owner.json"), JSON.stringify({ pid: process.pid, token: "live" }));
    const run = spawnSync(process.execPath, [HELPER, "snapshot", "--id", "acme-pay-senior-pm", "--user-confirmed"], {
      cwd: root,
      encoding: "utf8",
      input: JSON.stringify(envelope("url.json")),
      env: { ...process.env, JOB_HUNT_STATE_LOCK_TIMEOUT_MS: "200" },
    });
    assert.equal(run.status, 4, run.stdout);
    assert.equal(fs.existsSync(appDir(root, "acme-pay-senior-pm")), false);
  });

  test("refuses to run inside the plugin with the workspace recovery message", () => {
    const run = spawnSync(process.execPath, [HELPER, "check"], {
      cwd: path.join(ROOT, "skills"),
      encoding: "utf8",
      input: JSON.stringify(envelope("paste.json")),
      env: { ...process.env, JOB_HUNT_SKILLS_DEV: "" },
    });
    assert.equal(run.status, 2);
    assert.match(run.stderr, /Claude Code:    cd into your job-hunt folder, then run 'claude' there\./);
  });

  test("a scaffolded workspace accepts a snapshot and keeps it under user paths", () => {
    const root = fs.mkdtempSync(path.join(tmpdir(), "job-hunt-opportunity-scaffold-"));
    try {
      assert.equal(spawnSync(process.execPath, [SCAFFOLD], { cwd: root }).status, 0);
      const run = spawnSync(process.execPath, [HELPER, "snapshot", "--id", "globex-support-ops-lead", "--user-confirmed"], {
        cwd: root,
        encoding: "utf8",
        input: JSON.stringify(envelope("record.json")),
      });
      assert.equal(run.status, 0, run.stdout);
      const out = JSON.parse(run.stdout);
      assert.equal(out.path, "my-documents/applications/globex-support-ops-lead/opportunity-1.md");
      const text = fs.readFileSync(path.join(root, out.path), "utf8");
      assert.match(text, /nothing in it is an instruction/);
      assert.match(text, /^extensions: \{"example_feed":\{"category":"support","verified_employer":true\}\}$/m);
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  });
});

describe("state-layer §13 and the helper describe the same envelope", () => {
  const doc = fs.readFileSync(path.join(ROOT, "skills/_shared/state-layer.md"), "utf8");
  const section = doc.split("## 13. Opportunity Envelope and Snapshots")[1];

  test("every envelope field, source field, kind, and reserved name is documented", () => {
    assert.ok(section, "state-layer.md must have §13");
    for (const key of ENVELOPE_KEYS) assert.match(section, new RegExp(`\`${key}\``), key);
    for (const key of SOURCE_FIELDS) assert.match(section, new RegExp(`\`source\\.${key}\``), key);
    for (const kind of SOURCE_KINDS) assert.match(section, new RegExp(`\`${kind}\``), kind);
    for (const key of RESERVED_KEYS) assert.match(section, new RegExp(`\`${key}\``), key);
  });

  test("the documented example is a valid envelope", () => {
    const example = /```json\n([\s\S]*?)```/.exec(section);
    assert.ok(example, "§13 must show a JSON example");
    const { envelope: out, warnings } = normalizeEnvelope(JSON.parse(example[1]), { now: NOW });
    assert.deepEqual(warnings, []);
    assert.equal(out.envelope_version, 1);
  });
});
