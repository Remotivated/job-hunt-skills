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
import os from "node:os";
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
// A lock owned from another host is a lease, not a pid: the pid in its owner
// file means nothing on this machine. It may only be taken over once this
// long has passed since the owner's last heartbeat (see below).
export const LOCK_LEASE_MS = 30000;
const LOCK_HEARTBEAT_MS = 10000;
// A lock left without an owner file is abandoned only once it is older than
// any helper run takes; a live owner writes owner.json right after mkdir.
const OWNERLESS_STALE_MS = 30000;
const sleep = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);

function pidAlive(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    return error.code === "EPERM";
  }
}

// What identifies "this host" for pid purposes: the hostname, plus the boot
// id and the pid namespace where the platform exposes them (Linux). A pid is
// only comparable between two runs that share all three; VMs and containers
// on one machine differ in at least one of them.
let cachedIdentity = null;
function hostIdentity() {
  if (cachedIdentity) return cachedIdentity;
  let bootId = null;
  let pidNamespace = null;
  try {
    bootId = fs.readFileSync("/proc/sys/kernel/random/boot_id", "utf8").trim() || null;
  } catch {
    // Not Linux, or not readable: the hostname alone decides.
  }
  try {
    pidNamespace = fs.readlinkSync("/proc/self/ns/pid");
  } catch {
    // Same as above.
  }
  cachedIdentity = { hostname: os.hostname(), bootId, pidNamespace };
  return cachedIdentity;
}

// True when `owner` was written by a run whose pids this host can judge.
// Owner files from before host identity was recorded carry none of the three
// fields; they are judged as local, which keeps single-machine behaviour
// (and locks left by an older helper) exactly as it was.
export function isSameHostOwner(owner, identity = hostIdentity()) {
  if (!owner) return false;
  if (owner.hostname == null && owner.bootId == null && owner.pidNamespace == null) return true;
  if (owner.hostname != null && owner.hostname !== identity.hostname) return false;
  if (owner.bootId != null && identity.bootId != null && owner.bootId !== identity.bootId) return false;
  if (owner.pidNamespace != null && identity.pidNamespace != null && owner.pidNamespace !== identity.pidNamespace) {
    return false;
  }
  return true;
}

function leaseExpiryMs(owner, lockMtimeMs) {
  const stated = Date.parse(owner?.leaseExpiresAt ?? "");
  if (!Number.isNaN(stated)) return stated;
  const heartbeat = Date.parse(owner?.heartbeatAt ?? owner?.at ?? "");
  if (!Number.isNaN(heartbeat)) return heartbeat + LOCK_LEASE_MS;
  return (lockMtimeMs ?? 0) + LOCK_LEASE_MS;
}

// True only when the lock at `lockPath` is provably abandoned: a dead pid for
// a same-host owner, an expired lease for a foreign owner (its pid is never
// consulted), or no owner file older than any helper run takes.
function isAbandoned(owner, lockPath) {
  let mtimeMs;
  try {
    mtimeMs = fs.statSync(lockPath).mtimeMs;
  } catch {
    return true; // released between our checks; the caller retries
  }
  if (!owner) return Date.now() - mtimeMs > OWNERLESS_STALE_MS;
  if (isSameHostOwner(owner)) return !pidAlive(owner.pid);
  return Date.now() > leaseExpiryMs(owner, mtimeMs);
}

const readOwner = (owner) => {
  try {
    return JSON.parse(fs.readFileSync(owner, "utf8"));
  } catch {
    return null; // not written yet, released, or unreadable
  }
};

function ownerRecord(token, identity, acquiredAt, now = new Date()) {
  return {
    pid: process.pid,
    token,
    hostname: identity.hostname,
    bootId: identity.bootId,
    pidNamespace: identity.pidNamespace,
    at: acquiredAt,
    heartbeatAt: now.toISOString(),
    leaseExpiresAt: new Date(now.getTime() + LOCK_LEASE_MS).toISOString(),
  };
}

// Write owner.json via a temp file and a rename, so a reader never sees a
// half-written record and judges a live lock ownerless.
function writeOwner(owner, token, identity, acquiredAt) {
  const tmp = `${owner}.tmp-${token}`;
  fs.writeFileSync(tmp, JSON.stringify(ownerRecord(token, identity, acquiredAt)));
  fs.renameSync(tmp, owner);
}

// Refresh the lease while the run works. The timer is unref'd and every
// refresh re-checks the token, so a heartbeat can never resurrect a lock
// that has been taken over, and it never keeps a process alive by itself.
function startHeartbeat(owner, token, identity, acquiredAt) {
  const timer = setInterval(() => {
    try {
      if (readOwner(owner)?.token !== token) return;
      writeOwner(owner, token, identity, acquiredAt);
    } catch {
      // The lock is gone or the folder is read-only; the lease just expires.
    }
  }, LOCK_HEARTBEAT_MS);
  timer.unref?.();
  return timer;
}

// Put a lock folder we renamed aside back at `lock`. If another run claimed
// the path in the meantime, the displaced folder is left where it is rather
// than overwriting that run's live lock; its owner's token-checked release
// (below) will not touch the new lock either.
function restoreDisplaced(displaced, lock) {
  try {
    if (fs.existsSync(lock)) return false;
    fs.renameSync(displaced, lock);
    return true;
  } catch {
    return false;
  }
}

// Rename `lock` to a token-named path first, then verify and delete: the
// folder that gets removed is exactly the one whose owner was checked, never
// whatever happens to sit at `lock` when the delete runs. With
// `allowMissingOwner`, a folder with no owner file also counts as ours (the
// cleanup path for a lock whose owner write just failed). Otherwise a
// missing or foreign owner file means the lock changed hands, and the
// folder that was renamed aside is put back untouched.
function discardCapturedLock(lock, token, kind, { allowMissingOwner = false } = {}) {
  const captured = `${lock}.${kind}-${token}`;
  try {
    fs.renameSync(lock, captured);
  } catch {
    return false; // already gone, or taken over and removed
  }
  const held = readOwner(path.join(captured, "owner.json"));
  const ours = held ? held.token === token : allowMissingOwner;
  if (!ours) {
    restoreDisplaced(captured, lock);
    return false;
  }
  fs.rmSync(captured, { recursive: true, force: true });
  return true;
}

// Release deletes the lock only when it still carries this run's token.
function releaseLock(lock, token) {
  discardCapturedLock(lock, token, "release");
}

// Take over a lock whose owner is provably gone. The rename comes first and
// the owner inside the renamed folder is re-judged, so a lock whose old
// owner released it and a new run acquired it in the meantime is put back
// instead of being deleted from under the new run. Returns true when the
// caller should retry acquiring right away.
export function stealIfAbandoned(lock, owner, token) {
  const held = readOwner(owner);
  if (!isAbandoned(held, lock)) return false;
  const judgedToken = held?.token ?? null;
  const stale = `${lock}.stale-${token}`;
  try {
    fs.renameSync(lock, stale);
  } catch {
    return true; // Another process released or removed it first; retry now.
  }
  const captured = readOwner(path.join(stale, "owner.json"));
  if ((captured?.token ?? null) !== judgedToken || !isAbandoned(captured, stale)) {
    restoreDisplaced(stale, lock);
    return false; // It is a live lock again; wait on it instead of spinning.
  }
  fs.rmSync(stale, { recursive: true, force: true });
  return true;
}

// One mkdir-based lock per workspace serializes helper mutations (RP-2, TW-5).
// owner.json records { pid, token, hostname, bootId, pidNamespace, at,
// heartbeatAt, leaseExpiresAt }. A same-host lock is taken over only when its
// owner pid is dead on this host. A lock from another machine, VM or
// container on a shared folder is never judged by its pid: it is a lease
// that expires LOCK_LEASE_MS after its last heartbeat, so a waiter with the
// default timeout reports busy instead of stealing it, and a later retry
// takes it over once the lease has truly expired. Release and takeover are
// both rename-then-verify on the token (see discardCapturedLock and
// stealIfAbandoned). Remaining limits: the lease compares the owner's clock
// with this host's clock, so clock skew between machines stretches or
// shortens it; and if a third run claims the lock path in the instant a
// displaced lock is being put back, the displaced folder is left in its
// token-named path rather than overwriting the new lock.
export function withWorkspaceLock(
  stateRoot,
  fn,
  { timeoutMs = 10000 } = {},
) {
  const lock = path.join(stateRoot, LOCK_NAME);
  const owner = path.join(lock, "owner.json");
  const token = crypto.randomUUID();
  const identity = hostIdentity();
  const deadline = Date.now() + timeoutMs;
  let acquiredAt = new Date().toISOString();
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
    acquiredAt = new Date().toISOString();
    try {
      writeOwner(owner, token, identity, acquiredAt);
      break;
    } catch (error) {
      discardCapturedLock(lock, token, "discard", { allowMissingOwner: true });
      throw error;
    }
  }
  const heartbeat = startHeartbeat(owner, token, identity, acquiredAt);
  try {
    return fn();
  } finally {
    clearInterval(heartbeat);
    releaseLock(lock, token);
  }
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
