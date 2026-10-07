// Deterministic state boundary for my-documents/: tracker parse/upsert,
// documented status transitions, and collision-safe report allocation.
// The rules are skills/_shared/state-layer.md §3-§5 and §12; each rule id
// (TR-*, TW-*, ST-*, RP-*, PF-*) named below is defined there, and the
// native-file fallback follows the same rules without this script.
//
// Usage (run from the confirmed user workspace):
//   node state.mjs tracker check
//   node state.mjs tracker upsert --id ID [--company C] [--role R]
//        [--status S] [--comp-expected X] [--source S] [--next-action-date D]
//        [--link URL] [--set column=value]... [--user-confirmed] [--today D]
//   node state.mjs report write --slug SLUG [--date D] [--file PATH]   (else stdin)
//
// Every command prints one JSON object on stdout. Exit codes:
//   0 ok · 2 workspace refusal · 3 state refused (nothing written)
//   4 workspace busy (nothing written) · 1 unexpected error

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

import { assertUserWorkspace, USER_ROOT } from "./workspace.mjs";

export const STATUSES = Object.freeze([
  "saved",
  "applied",
  "interviewing",
  "offer",
  "closed",
  "hired",
]);
export const SOURCES = Object.freeze(["referral", "board", "cold", "recruiter", "watch", "-"]);
export const COLUMNS = Object.freeze([
  "id",
  "company",
  "role",
  "status",
  "comp_expected",
  "source",
  "next_action_date",
  "updated",
  "link",
]);
export const REPORT_KEYS = Object.freeze([
  "report_id",
  "company",
  "role",
  "application_id",
  "skill",
  "date",
  "summary",
]);

export const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
export const REPORT_FILE = /^(\d{3,})-.*\.md$/;

export class StateError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.code = code;
    this.details = details;
  }
}

// --- Values ----------------------------------------------------------------

export function isIsoDate(value) {
  if (!ISO_DATE.test(value)) return false;
  const d = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}

export function todayIso(now = new Date()) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

// Split a markdown table row on unescaped pipes; `\|` stays inside a cell.
function splitRow(line) {
  const trimmed = line.trim();
  if (!trimmed.startsWith("|")) return null;
  const cells = [];
  let cell = "";
  for (let i = 1; i < trimmed.length; i++) {
    const ch = trimmed[i];
    if (ch === "\\" && trimmed[i + 1] === "|") {
      cell += "\\|";
      i++;
    } else if (ch === "|") {
      cells.push(cell.trim());
      cell = "";
    } else {
      cell += ch;
    }
  }
  if (cell.trim() !== "") return null; // row did not end with a pipe
  return cells;
}

const unescapeCell = (cell) => cell.replaceAll("\\|", "|");
const escapeCell = (value) => String(value).replaceAll("|", "\\|");

export function region(lines, index, radius = 2) {
  const start = Math.max(0, index - radius);
  const end = Math.min(lines.length, index + radius + 1);
  return lines
    .slice(start, end)
    .map((l, i) => `${start + i + 1 === index + 1 ? ">" : " "} ${start + i + 1} | ${l}`)
    .join("\n");
}

function parseFailure(lines, index, message) {
  return new StateError("parse_error", message, {
    line: index + 1,
    region: region(lines, index),
  });
}

// --- Tracker ---------------------------------------------------------------

// Parse applications.md strictly (TR-1..TR-8, PF-1). Returns the pieces needed
// to rewrite the file without touching anything outside the table.
export function parseTracker(text) {
  const eol = text.includes("\r\n") ? "\r\n" : "\n";
  const lines = text.split(/\r?\n/);
  const headerIdx = lines.findIndex((l) => l.trim().startsWith("|"));
  if (headerIdx === -1) {
    throw new StateError("parse_error", "No markdown table found in applications.md.", {
      line: 1,
      region: region(lines, 0),
    });
  }

  const header = splitRow(lines[headerIdx]);
  if (!header) throw parseFailure(lines, headerIdx, "Header row is not a complete table row.");
  const names = header.map((c) => unescapeCell(c));
  const keys = names.map((c) => c.toLowerCase());
  const seen = new Set();
  for (const key of keys) {
    if (key === "" || seen.has(key)) {
      throw parseFailure(lines, headerIdx, `Header has an empty or duplicate column "${key}".`);
    }
    seen.add(key);
  }
  for (const required of ["id", "status"]) {
    if (!keys.includes(required)) {
      throw parseFailure(lines, headerIdx, `Header is missing the required "${required}" column.`);
    }
  }

  const sepIdx = headerIdx + 1;
  const sep = sepIdx < lines.length ? splitRow(lines[sepIdx]) : null;
  if (!sep || sep.length !== header.length || !sep.every((c) => /^:?-{3,}:?$/.test(c))) {
    throw parseFailure(
      lines,
      Math.min(sepIdx, lines.length - 1),
      `Expected a separator row with ${header.length} cells right under the header.`,
    );
  }

  const rows = [];
  const ids = new Map();
  let end = sepIdx + 1;
  for (; end < lines.length; end++) {
    const line = lines[end];
    if (!line.trim().startsWith("|")) break;
    const cells = splitRow(line);
    if (!cells || cells.length !== header.length) {
      throw parseFailure(
        lines,
        end,
        `Row has ${cells ? cells.length : "an unterminated set of"} cells; the header has ${header.length}.`,
      );
    }
    const row = {};
    keys.forEach((key, i) => {
      row[key] = unescapeCell(cells[i]);
    });
    const status = row.status.toLowerCase();
    if (!STATUSES.includes(status)) {
      throw parseFailure(lines, end, `Unknown status "${row.status}". Allowed: ${STATUSES.join(", ")}.`);
    }
    row.status = status;
    if (row.id === "") throw parseFailure(lines, end, "Row has an empty id.");
    if (ids.has(row.id)) {
      throw parseFailure(lines, end, `Duplicate id "${row.id}" (first seen on line ${ids.get(row.id) + 1}).`);
    }
    ids.set(row.id, end);
    for (const legacy of ["comp_expected", "source", "next_action_date"]) {
      if (!(legacy in row)) row[legacy] = "-";
    }
    rows.push(row);
  }

  return {
    eol,
    before: lines.slice(0, headerIdx),
    after: lines.slice(end),
    names,
    keys,
    rows,
  };
}

// Column order for a rewrite (TW-1): keep the existing order, add missing
// canonical columns in canonical order before `updated` (or at the end).
export function outputColumns(keys, names) {
  const missing = COLUMNS.filter((c) => !keys.includes(c));
  const out = keys.map((key, i) => ({ key, name: COLUMNS.includes(key) ? key : names[i] }));
  const at = keys.indexOf("updated");
  const add = missing.map((key) => ({ key, name: key }));
  if (at === -1) out.push(...add);
  else out.splice(at, 0, ...add);
  return out;
}

export function serializeTracker(parsed) {
  const columns = outputColumns(parsed.keys, parsed.names);
  // TW-2: newest `updated` first, by code point (ISO dates sort as text);
  // Array.prototype.sort is stable, so ties keep their order.
  const key = (row) => String(row.updated ?? "");
  const rows = [...parsed.rows].sort((a, b) => (key(a) < key(b)) - (key(a) > key(b)));
  const line = (cells) => `| ${cells.join(" | ")} |`;
  const table = [
    line(columns.map((c) => escapeCell(c.name))),
    `|${columns.map((c) => "-".repeat(Math.max(3, c.name.length + 2))).join("|")}|`,
    ...rows.map((row) => line(columns.map((c) => escapeCell(row[c.key] ?? "-")))),
  ];
  return [...parsed.before, ...table, ...parsed.after].join(parsed.eol);
}

function validateField(key, value) {
  if (typeof value !== "string") throw new StateError("invalid_field", `${key} is required.`);
  if (/[\r\n]/.test(value)) throw new StateError("invalid_field", `${key} cannot contain line breaks.`);
  if (value.trim() !== value || value === "") {
    throw new StateError("invalid_field", `${key} must be non-empty without surrounding spaces; use "-" for none.`);
  }
  if (key === "id" && !SLUG.test(value)) {
    throw new StateError("invalid_field", `id "${value}" must be kebab-case, e.g. buffer-content-marketing-manager.`);
  }
  if (key === "status" && !STATUSES.includes(value)) {
    throw new StateError("invalid_field", `status "${value}" is not one of ${STATUSES.join(", ")}.`);
  }
  if (key === "source" && !SOURCES.includes(value)) {
    throw new StateError("invalid_field", `source "${value}" is not one of ${SOURCES.join(", ")}.`);
  }
  if ((key === "next_action_date" || key === "updated") && value !== "-" && !isIsoDate(value)) {
    throw new StateError("invalid_field", `${key} "${value}" must be YYYY-MM-DD or "-".`);
  }
  if (key === "link" && value !== "-" && !/^https?:\/\/\S+$/.test(value)) {
    throw new StateError("invalid_field", `link "${value}" must be an http(s) URL or "-".`);
  }
}

const HISTORY_HEADING = /^##\s+Status history\s*$/i;

// ST-3: append one line to the `## Status history` section at the end of the
// file, creating the section when it is missing. Earlier lines are untouched.
export function appendHistory(after, entry) {
  const at = after.findIndex((l) => HISTORY_HEADING.test(l));
  if (at === -1) {
    const out = [...after];
    while (out.length && out[out.length - 1].trim() === "") out.pop();
    return [...out, "", "## Status history", "", entry, ""];
  }
  let end = after.findIndex((l, i) => i > at && /^#{1,2}\s/.test(l));
  if (end === -1) end = after.length;
  let insert = end;
  while (insert > at + 1 && after[insert - 1].trim() === "") insert--;
  return [...after.slice(0, insert), entry, ...after.slice(insert)];
}

// Pure upsert over tracker text. `fields` uses schema keys (comp_expected,
// next_action_date, ...) plus any existing custom column.
export function upsertTracker(text, { id, fields = {}, userConfirmed = false, today = todayIso() }) {
  const parsed = parseTracker(text);
  const allowed = new Set([...COLUMNS, ...parsed.keys]);
  const changes = { ...fields };
  delete changes.id;
  for (const [key, value] of Object.entries(changes)) {
    if (!allowed.has(key)) {
      throw new StateError("invalid_field", `Unknown column "${key}". Existing custom columns can be set; new ones cannot be added.`);
    }
    if (key === "updated") throw new StateError("invalid_field", "updated is set by the helper, not the caller.");
    validateField(key, value);
  }
  validateField("id", id);
  if (!isIsoDate(today)) throw new StateError("invalid_field", `today "${today}" must be YYYY-MM-DD.`);

  const warnings = [];
  const existing = parsed.rows.find((row) => row.id === id);
  let action;
  if (!existing) {
    if (!changes.company || changes.company === "-") {
      throw new StateError("invalid_field", "A new row needs company.");
    }
    changes.role ??= "-"; // company-only research rows have no role yet
    // ST-1: any status is allowed, so someone joining mid-search can bring
    // every application across; anything but the default needs confirmation.
    const status = changes.status ?? "saved";
    if (status !== "saved" && !userConfirmed) {
      throw new StateError("confirmation_required", `Creating a row at "${status}" needs the user's confirmation (--user-confirmed).`);
    }
    const twin = parsed.rows.find(
      (row) =>
        String(row.company).toLowerCase() === changes.company.toLowerCase() &&
        String(row.role).toLowerCase() === changes.role.toLowerCase(),
    );
    if (twin) warnings.push(`Row "${twin.id}" already tracks ${changes.company} / ${changes.role}.`);
    const row = Object.fromEntries(parsed.keys.map((k) => [k, "-"]));
    for (const key of COLUMNS) row[key] = "-";
    Object.assign(row, changes, { id, status, updated: today });
    parsed.rows.push(row);
    parsed.after = appendHistory(parsed.after, `- ${today} ${id}: created as ${status}`);
    action = "inserted";
  } else {
    // ST-2: forward or back, so a mistaken move can be corrected.
    const from = existing.status;
    const to = changes.status ?? from;
    if (to !== from && !userConfirmed) {
      throw new StateError(
        "confirmation_required",
        `Changing ${id} from "${existing.status}" to "${to}" needs the user's confirmation (--user-confirmed).`,
      );
    }
    const statusChanged = to !== from;
    const before = JSON.stringify(existing);
    Object.assign(existing, changes, { status: to });
    if (statusChanged) {
      existing.updated = today; // TW-3
      parsed.after = appendHistory(parsed.after, `- ${today} ${id}: ${from} → ${to}`);
    }
    action = JSON.stringify(existing) === before ? "unchanged" : "updated";
  }

  const row = parsed.rows.find((r) => r.id === id);
  return { text: serializeTracker(parsed), action, row: { ...row }, warnings };
}

// --- Locking and atomic files ------------------------------------------------

const LOCK_NAME = ".state.lock";
const sleep = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);

function pidAlive(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    return error.code === "EPERM";
  }
}

// One mkdir-based lock per workspace serializes helper mutations (RP-2, TW-5).
// Known limit: a lock is stolen only when its owner pid is dead on this host; a
// lock from another machine on a shared folder waits out the timeout instead.
export function withWorkspaceLock(
  stateRoot,
  fn,
  { timeoutMs = 10000 } = {},
) {
  const lock = path.join(stateRoot, LOCK_NAME);
  const owner = path.join(lock, "owner.json");
  const token = crypto.randomUUID();
  const deadline = Date.now() + timeoutMs;
  for (;;) {
    try {
      fs.mkdirSync(lock);
    } catch (error) {
      if (error.code !== "EEXIST") throw error;
      if (stealIfAbandoned(lock, owner, token)) continue;
      if (Date.now() > deadline) {
        throw new StateError(
          "busy",
          `Another job-hunt session is updating ${USER_ROOT}/ (lock: ${lock}). Try again in a moment.`,
        );
      }
      sleep(20 + Math.floor(Math.random() * 30));
      continue;
    }
    try {
      fs.writeFileSync(owner, JSON.stringify({ pid: process.pid, token, at: new Date().toISOString() }));
      break;
    } catch (error) {
      fs.rmSync(lock, { recursive: true, force: true });
      throw error;
    }
  }
  try {
    return fn();
  } finally {
    fs.rmSync(lock, { recursive: true, force: true });
  }
}

const readOwner = (owner) => {
  try {
    return JSON.parse(fs.readFileSync(owner, "utf8"));
  } catch {
    return null; // not written yet, released, or unreadable
  }
};

// Remove a lock whose owner process is gone, or one left without an owner
// file for longer than any helper run takes. Returns true when it removed one.
function stealIfAbandoned(lock, owner, token) {
  const held = readOwner(owner);
  let abandoned = held ? !pidAlive(held.pid) : false;
  if (!held) {
    try {
      abandoned = Date.now() - fs.statSync(lock).mtimeMs > 30000;
    } catch {
      return true; // released between mkdir and stat; retry now
    }
  }
  if (!abandoned) return false;
  const again = readOwner(owner);
  if ((held?.token ?? null) !== (again?.token ?? null)) return true; // changed hands; retry
  try {
    const stale = `${lock}.stale-${token}`;
    fs.renameSync(lock, stale);
    fs.rmSync(stale, { recursive: true, force: true });
  } catch {
    // Another process released or removed it first.
  }
  return true;
}

export function tempPath(target) {
  return path.join(path.dirname(target), `.tmp-${path.basename(target)}-${process.pid}-${crypto.randomUUID()}`);
}

// --- Tracker file ------------------------------------------------------------

export function upsertTrackerFile(workspace, options, hooks = {}) {
  const stateRoot = path.join(workspace, USER_ROOT);
  const file = path.join(stateRoot, "applications.md");
  if (!fs.existsSync(file)) {
    throw new StateError("not_scaffolded", `${USER_ROOT}/applications.md is missing. Run the scaffolder first.`);
  }
  return withWorkspaceLock(stateRoot, () => {
    const original = fs.readFileSync(file, "utf8");
    const result = upsertTracker(original, options);
    if (result.action === "unchanged") return result;
    const tmp = tempPath(file);
    try {
      fs.writeFileSync(tmp, result.text);
      hooks.beforeCommit?.();
      // A writer outside the helper (or a hand edit) changed the file mid-run.
      if (fs.readFileSync(file, "utf8") !== original) {
        throw new StateError("conflict", "applications.md changed while it was being updated. Nothing was written; re-run.");
      }
      fs.renameSync(tmp, file);
    } finally {
      fs.rmSync(tmp, { force: true });
    }
    return result;
  }, { timeoutMs: hooks.lockTimeoutMs });
}

// --- Reports -----------------------------------------------------------------

export function nextReportNumber(names) {
  let max = 0;
  for (const name of names) {
    const match = REPORT_FILE.exec(name);
    if (match) max = Math.max(max, Number.parseInt(match[1], 10));
  }
  return String(max + 1).padStart(3, "0");
}

// Validate report frontmatter (RP-3) and stamp the allocated report_id.
export function stampReport(content, reportId) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---(\r?\n|$)/.exec(content);
  if (!match) throw new StateError("invalid_report", "Report must start with YAML frontmatter between --- lines.");
  const eol = content.includes("\r\n") ? "\r\n" : "\n";
  const lines = match[1].split(/\r?\n/);
  const present = new Set(lines.map((l) => /^([a-z_]+):/.exec(l)?.[1]).filter(Boolean));
  const missing = REPORT_KEYS.filter((k) => k !== "report_id" && !present.has(k));
  if (missing.length) {
    throw new StateError("invalid_report", `Report frontmatter is missing: ${missing.join(", ")}.`);
  }
  const date = lines.map((l) => /^date:\s*(\S+)\s*$/.exec(l)?.[1]).find(Boolean);
  if (!date || !isIsoDate(date)) throw new StateError("invalid_report", "Report frontmatter date must be YYYY-MM-DD.");
  const stamped = present.has("report_id")
    ? lines.map((l) => (/^report_id:/.test(l) ? `report_id: ${reportId}` : l))
    : [`report_id: ${reportId}`, ...lines];
  return {
    date,
    text: `---${eol}${stamped.join(eol)}${eol}---${match[2]}${content.slice(match[0].length)}`,
  };
}

export function exclusiveCommit(tmp, target) {
  try {
    fs.linkSync(tmp, target); // atomic, fails with EEXIST instead of replacing
  } catch (error) {
    if (error.code === "EEXIST") throw error;
    fs.copyFileSync(tmp, target, fs.constants.COPYFILE_EXCL); // filesystems without hard links
  }
}

export function writeReport(workspace, { slug, content, date }, hooks = {}) {
  if (!SLUG.test(slug ?? "")) throw new StateError("invalid_field", `slug "${slug}" must be kebab-case.`);
  const stateRoot = path.join(workspace, USER_ROOT);
  const dir = path.join(stateRoot, "reports");
  if (!fs.existsSync(dir)) {
    throw new StateError("not_scaffolded", `${USER_ROOT}/reports/ is missing. Run the scaffolder first.`);
  }
  return withWorkspaceLock(stateRoot, () => {
    const reportId = nextReportNumber(fs.readdirSync(dir));
    const stamped = stampReport(content, reportId);
    const fileDate = date ?? stamped.date;
    if (!isIsoDate(fileDate)) throw new StateError("invalid_field", `date "${fileDate}" must be YYYY-MM-DD.`);
    const name = `${reportId}-${slug}-${fileDate}.md`;
    const target = path.join(dir, name);
    const tmp = tempPath(target);
    try {
      fs.writeFileSync(tmp, stamped.text, { flag: "wx" });
      hooks.beforeCommit?.(target);
      exclusiveCommit(tmp, target);
    } catch (error) {
      if (error.code === "EEXIST") {
        throw new StateError("conflict", `${name} already exists; reports are never overwritten. Nothing was written; re-run.`);
      }
      throw error;
    } finally {
      fs.rmSync(tmp, { force: true });
    }
    return { report_id: reportId, path: `${USER_ROOT}/reports/${name}` };
  }, { timeoutMs: hooks.lockTimeoutMs });
}

// --- CLI ---------------------------------------------------------------------

const FLAG_TO_FIELD = {
  "--company": "company",
  "--role": "role",
  "--status": "status",
  "--comp-expected": "comp_expected",
  "--source": "source",
  "--next-action-date": "next_action_date",
  "--link": "link",
};

function parseArgs(argv) {
  const opts = { fields: {}, userConfirmed: false };
  for (let i = 0; i < argv.length; i++) {
    const flag = argv[i];
    const value = () => {
      if (i + 1 >= argv.length) throw new StateError("usage", `${flag} needs a value.`);
      return argv[++i];
    };
    if (flag === "--user-confirmed") opts.userConfirmed = true;
    else if (flag in FLAG_TO_FIELD) opts.fields[FLAG_TO_FIELD[flag]] = value();
    else if (flag === "--set") {
      const pair = value();
      const eq = pair.indexOf("=");
      if (eq < 1) throw new StateError("usage", `--set expects column=value, got "${pair}".`);
      opts.fields[pair.slice(0, eq).trim().toLowerCase()] = pair.slice(eq + 1);
    } else if (["--id", "--today", "--slug", "--date", "--file"].includes(flag)) {
      opts[flag.slice(2)] = value();
    } else throw new StateError("usage", `Unknown argument "${flag}".`);
  }
  return opts;
}

export const EXIT = Object.freeze({ busy: 4, unexpected: 1 });

export function run(argv, workspace = process.cwd()) {
  const [area, command, ...rest] = argv;
  const opts = parseArgs(rest);
  const tracker = path.join(workspace, USER_ROOT, "applications.md");
  if (area === "tracker" && command === "check") {
    if (!fs.existsSync(tracker)) {
      throw new StateError("not_scaffolded", `${USER_ROOT}/applications.md is missing. Run the scaffolder first.`);
    }
    const parsed = parseTracker(fs.readFileSync(tracker, "utf8"));
    const legacy = COLUMNS.filter((c) => !parsed.keys.includes(c));
    return { ok: true, rows: parsed.rows.length, missing_columns: legacy, custom_columns: parsed.keys.filter((k) => !COLUMNS.includes(k)) };
  }
  if (area === "tracker" && command === "upsert") {
    const result = upsertTrackerFile(workspace, {
      id: opts.id,
      fields: opts.fields,
      userConfirmed: opts.userConfirmed,
      today: opts.today ?? todayIso(),
    });
    return { ok: true, action: result.action, row: result.row, warnings: result.warnings };
  }
  if (area === "report" && command === "write") {
    const content = fs.readFileSync(opts.file ?? 0, "utf8");
    return { ok: true, ...writeReport(workspace, { slug: opts.slug, content, date: opts.date }) };
  }
  throw new StateError("usage", "Usage: state.mjs tracker check | tracker upsert --id ID ... | report write --slug SLUG [--file PATH]");
}

if (process.argv[1] && fs.realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  assertUserWorkspace("state");
  try {
    console.log(JSON.stringify(run(process.argv.slice(2))));
  } catch (error) {
    const known = error instanceof StateError;
    console.log(
      JSON.stringify({
        ok: false,
        error: known ? error.code : "unexpected",
        message: error.message,
        ...(known ? error.details : {}),
      }),
    );
    process.exit(known ? (EXIT[error.code] ?? 3) : EXIT.unexpected);
  }
}
