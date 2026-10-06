// Compute a "profile strength" score and a tracker "momentum" pulse from the
// my-documents/ state layer. Both are the reward currency for the progress
// loop described in skills/_shared/state-layer.md §11.
//
// Everything here is derived live from files already on disk. There is no
// telemetry, no logging, and no state of its own — running it twice on the
// same workspace always prints the same thing.
//
// Usage:
//   node scripts/profile-strength.mjs            # human strength line
//   node scripts/profile-strength.mjs --json     # machine-readable strength
//   node scripts/profile-strength.mjs --pulse    # one-line tracker momentum
//
// Parsing is defensive by contract: an empty, partial, or malformed state
// layer must degrade to a sensible score, never throw. Skills call this at
// the end of a run; a crash here must never take down the skill.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const STATUS_ENUM = [
  "saved",
  "applied",
  "interviewing",
  "offer",
  "closed",
  "hired",
];

// A submitted, non-terminal application is "in flight".
const IN_FLIGHT = new Set(["applied", "interviewing", "offer"]);

function safeRead(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch {
    return null;
  }
}

function safeList(dir) {
  try {
    return fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return [];
  }
}

// --- Story bank ------------------------------------------------------------

// Count real STAR+R stories: H2 sections outside the instructional HTML
// comment the scaffold ships with. The schema example lives inside <!-- -->,
// so stripping comments first leaves only stories the user actually wrote.
export function countStories(storyBankText) {
  if (!storyBankText) return 0;
  const withoutComments = storyBankText.replace(/<!--[\s\S]*?-->/g, "");
  const matches = withoutComments.match(/^##\s+\S.*$/gm);
  return matches ? matches.length : 0;
}

// --- Reports ---------------------------------------------------------------

// Pull the `skill:` value from a report's YAML frontmatter. Returns null when
// there is no frontmatter or no skill field.
export function reportSkill(reportText) {
  if (!reportText) return null;
  const fm = reportText.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!fm) return null;
  const skill = fm[1].match(/^skill:\s*(\S+)\s*$/m);
  return skill ? skill[1] : null;
}

function reportSkills(root) {
  const dir = path.join(root, "my-documents", "reports");
  const skills = [];
  for (const entry of safeList(dir)) {
    if (!entry.isFile() || !entry.name.endsWith(".md")) continue;
    const skill = reportSkill(safeRead(path.join(dir, entry.name)));
    if (skill) skills.push(skill);
  }
  return skills;
}

// --- Applications tracker --------------------------------------------------

// Parse the first markdown table in applications.md into rows of
// {status, next_action_date, id}. Tolerant of the back-compat 6-column schema
// and of a missing/empty/malformed file — returns [] rather than throwing.
export function parseTracker(applicationsText) {
  if (!applicationsText) return [];
  const lines = applicationsText.split(/\r?\n/);
  const headerIdx = lines.findIndex(
    (l) => /^\s*\|/.test(l) && /\bid\b/i.test(l) && /\bstatus\b/i.test(l),
  );
  if (headerIdx === -1) return [];

  const cols = lines[headerIdx]
    .split("|")
    .slice(1, -1)
    .map((c) => c.trim().toLowerCase());
  const idIdx = cols.indexOf("id");
  const statusIdx = cols.indexOf("status");
  const nextIdx = cols.indexOf("next_action_date");
  if (statusIdx === -1) return [];

  const rows = [];
  for (let i = headerIdx + 2; i < lines.length; i++) {
    const line = lines[i];
    if (!/^\s*\|/.test(line)) break; // table ends at first non-row line
    const cells = line.split("|").slice(1, -1).map((c) => c.trim());
    if (cells.length < cols.length) continue;
    const status = (cells[statusIdx] || "").toLowerCase();
    if (!STATUS_ENUM.includes(status)) continue;
    rows.push({
      id: idIdx === -1 ? "" : cells[idIdx],
      status,
      next_action_date: nextIdx === -1 ? "-" : cells[nextIdx],
    });
  }
  return rows;
}

// --- Strength --------------------------------------------------------------

// The seven signals, in the order we prefer to unlock them. Each has a `next`
// hint naming the single highest-leverage action when it's the top gap.
export function computeStrength(root = process.cwd()) {
  const md = path.join(root, "my-documents");
  const resume = safeRead(path.join(md, "resume.md"));
  const cv = safeRead(path.join(md, "cv.md"));
  const storyBank = safeRead(path.join(md, "story-bank.md"));
  const coverLetter = safeRead(path.join(md, "coverletter.md"));
  const skills = reportSkills(root);
  const stories = countStories(storyBank);

  const proofAssets = safeList(path.join(md, "proof-assets")).filter(
    (e) => e.isFile() && e.name.endsWith(".md"),
  ).length;
  const tailoredApps = safeList(path.join(md, "applications")).filter(
    (e) => e.isDirectory(),
  ).length;

  const label = resume ? "resume" : cv ? "CV" : "work document";

  const signals = [
    {
      key: "source_document",
      met: Boolean(resume || cv),
      next: "Build your source work document so every other skill has something to read.",
    },
    {
      key: "audited",
      met: skills.includes("resume-auditor"),
      next: `Run an honest audit on your ${label} to see what's blocking callbacks.`,
    },
    {
      key: "story_bank",
      met: stories >= 3,
      next:
        stories === 0
          ? "Add three STAR+R stories so claim-check can verify your top claims and interview prep has material."
          : `Add ${3 - stories} more ${3 - stories === 1 ? "story" : "stories"} to your story bank (${stories}/3) to back more claims.`,
    },
    {
      key: "proof_asset",
      met: proofAssets >= 1,
      next: "Capture one reusable proof asset (a case study with metrics) you can point to across applications.",
    },
    {
      key: "tailored_application",
      met: tailoredApps >= 1,
      next: "Tailor your first application to a real posting to see the transform end to end.",
    },
    {
      key: "claim_verified",
      met: skills.includes("claim-check") || skills.includes("resume-tailor"),
      next: `Run claim-check on your ${label} to confirm every concrete claim is backed by evidence.`,
    },
    {
      key: "cover_letter",
      met: Boolean(coverLetter),
      next: "Seed a source cover letter for a target lane so tailored letters start from your voice.",
    },
  ];

  const score = signals.filter((s) => s.met).length;
  const total = signals.length;
  const firstGap = signals.find((s) => !s.met) || null;

  return {
    score,
    total,
    label,
    signals: signals.map(({ key, met }) => ({ key, met })),
    nextUnlock: firstGap ? firstGap.next : null,
  };
}

// One human-facing line: "Profile strength: 3/7 — <next unlock>."
export function strengthLine(root = process.cwd()) {
  const { score, total, nextUnlock } = computeStrength(root);
  if (score >= total) {
    return `Profile strength: ${score}/${total} — every layer is in place. Keep it current as your search evolves.`;
  }
  return `Profile strength: ${score}/${total} — ${nextUnlock}`;
}

// --- Pulse -----------------------------------------------------------------

function earliestNextAction(rows) {
  const dated = rows
    .filter((r) => /^\d{4}-\d{2}-\d{2}$/.test(r.next_action_date))
    .filter((r) => IN_FLIGHT.has(r.status) || r.status === "saved")
    .sort((a, b) => a.next_action_date.localeCompare(b.next_action_date));
  return dated[0] || null;
}

// One-line momentum summary from the tracker. Returns a gentle starter line
// when nothing is tracked yet.
export function pulseLine(root = process.cwd()) {
  const rows = parseTracker(
    safeRead(path.join(root, "my-documents", "applications.md")),
  );
  if (rows.length === 0) {
    return "No applications tracked yet — tailor your first one and it lands on the board.";
  }

  const inFlight = rows.filter((r) => IN_FLIGHT.has(r.status)).length;
  const interviewing = rows.filter((r) => r.status === "interviewing").length;
  const saved = rows.filter((r) => r.status === "saved").length;

  const parts = [];
  parts.push(`${inFlight} in flight`);
  if (interviewing > 0) parts.push(`${interviewing} interviewing`);
  if (saved > 0) parts.push(`${saved} saved`);

  const next = earliestNextAction(rows);
  if (next) {
    parts.push(`next action ${next.next_action_date}${next.id ? ` (${next.id})` : ""}`);
  }
  return parts.join(" · ");
}

// --- CLI -------------------------------------------------------------------

function main(argv) {
  const root = process.cwd();
  if (argv.includes("--pulse")) {
    console.log(pulseLine(root));
    return;
  }
  if (argv.includes("--json")) {
    console.log(JSON.stringify(computeStrength(root), null, 2));
    return;
  }
  console.log(strengthLine(root));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main(process.argv.slice(2));
}
