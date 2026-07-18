// Unit tests for scripts/profile-strength.mjs.
//
// Run with:  node --test scripts/test-profile-strength.mjs
//            (or: npm run test:strength)
//
// Covers the pure parsing helpers, the strength/pulse computation, and the
// contract that a missing / empty / malformed state layer degrades rather
// than throwing — the script runs at the tail of a skill and must never take
// the skill down with it.

import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test, describe } from "node:test";

import {
  countStories,
  reportSkill,
  parseTracker,
  computeStrength,
  strengthLine,
  pulseLine,
} from "./profile-strength.mjs";

// --- Fixtures --------------------------------------------------------------

const SEPARATOR =
  "|----|---------|------|--------|---------------|--------|------------------|---------|------|";

const EMPTY_TRACKER = `# Applications

| id | company | role | status | comp_expected | source | next_action_date | updated | link |
${SEPARATOR}

## Notes
`;

// Build a tracker with data rows contiguous with the separator, the way a
// real applications.md is written.
function trackerWith(...rows) {
  return EMPTY_TRACKER.replace(SEPARATOR, SEPARATOR + "\n" + rows.join("\n"));
}

const STORY_BANK_SCAFFOLD = `# Story Bank

STAR+R stories for behavioral interviews and claim evidence.

<!--
Schema - one section per story:

## {Short memorable title}

usage: []
-->
`;

// Build a my-documents/ tree under a fresh temp dir. `spec` selects what to
// populate; anything omitted is simply absent, mimicking a partial workspace.
function makeWorkspace(spec = {}) {
  const root = mkdtempSync(join(tmpdir(), "strength-"));
  const md = join(root, "my-documents");
  mkdirSync(join(md, "reports"), { recursive: true });
  mkdirSync(join(md, "proof-assets"), { recursive: true });
  mkdirSync(join(md, "applications"), { recursive: true });

  if (spec.resume) writeFileSync(join(md, "resume.md"), "---\nversion: 1\n---\n# Jane\n");
  if (spec.cv) writeFileSync(join(md, "cv.md"), "---\nversion: 1\n---\n# Jane\n");
  if (spec.coverLetter) writeFileSync(join(md, "coverletter.md"), "Dear team,\n");
  if (spec.storyBank !== undefined)
    writeFileSync(join(md, "story-bank.md"), spec.storyBank);
  if (spec.applications !== undefined)
    writeFileSync(join(md, "applications.md"), spec.applications);
  (spec.reportSkills || []).forEach((skill, i) => {
    const n = String(i + 1).padStart(3, "0");
    writeFileSync(
      join(md, "reports", `${n}-r-2026-01-01.md`),
      `---\nskill: ${skill}\n---\nbody\n`,
    );
  });
  for (const slug of spec.proofAssets || [])
    writeFileSync(join(md, "proof-assets", `${slug}.md`), "# asset\n");
  for (const id of spec.tailoredApps || [])
    mkdirSync(join(md, "applications", id), { recursive: true });

  return root;
}

// --- countStories ----------------------------------------------------------

describe("countStories", () => {
  test("scaffold with only the comment example counts zero", () => {
    assert.equal(countStories(STORY_BANK_SCAFFOLD), 0);
  });
  test("counts real H2 stories outside the comment", () => {
    const text = STORY_BANK_SCAFFOLD + "\n## Led the migration\nx\n\n## Saved the launch\ny\n";
    assert.equal(countStories(text), 2);
  });
  test("null or empty is zero", () => {
    assert.equal(countStories(null), 0);
    assert.equal(countStories(""), 0);
  });
  test("does not count the H1 title", () => {
    assert.equal(countStories("# Story Bank\n\nintro\n"), 0);
  });
});

// --- reportSkill -----------------------------------------------------------

describe("reportSkill", () => {
  test("extracts skill from frontmatter", () => {
    assert.equal(reportSkill("---\nskill: resume-auditor\n---\nbody"), "resume-auditor");
  });
  test("no frontmatter yields null", () => {
    assert.equal(reportSkill("# just a heading\n"), null);
  });
  test("frontmatter without skill yields null", () => {
    assert.equal(reportSkill("---\nreport_id: 001\n---\n"), null);
  });
  test("null passthrough", () => {
    assert.equal(reportSkill(null), null);
  });
});

// --- parseTracker ----------------------------------------------------------

describe("parseTracker", () => {
  test("empty table yields no rows", () => {
    assert.deepEqual(parseTracker(EMPTY_TRACKER), []);
  });
  test("parses rows with status and next action", () => {
    const text = trackerWith(
      "| acme-pm | Acme | PM | applied | - | board | 2026-07-24 | 2026-07-15 | - |",
    );
    const rows = parseTracker(text);
    assert.equal(rows.length, 1);
    assert.equal(rows[0].id, "acme-pm");
    assert.equal(rows[0].status, "applied");
    assert.equal(rows[0].next_action_date, "2026-07-24");
  });
  test("ignores rows with an invalid status", () => {
    const text = trackerWith("| x | X | Y | bogus | - | - | - | 2026-01-01 | - |");
    assert.deepEqual(parseTracker(text), []);
  });
  test("back-compat six-column table still parses", () => {
    const text = `# Applications

| id | company | role | status | updated | link |
|----|---------|------|--------|---------|------|
| acme-pm | Acme | PM | interviewing | 2026-07-15 | - |
`;
    const rows = parseTracker(text);
    assert.equal(rows.length, 1);
    assert.equal(rows[0].status, "interviewing");
    assert.equal(rows[0].next_action_date, "-"); // column absent
  });
  test("null / no-table input yields no rows, does not throw", () => {
    assert.deepEqual(parseTracker(null), []);
    assert.deepEqual(parseTracker("# Applications\n\nno table here\n"), []);
  });
});

// --- computeStrength -------------------------------------------------------

describe("computeStrength", () => {
  test("empty workspace scores zero and points at the source document", () => {
    const root = makeWorkspace({ storyBank: STORY_BANK_SCAFFOLD, applications: EMPTY_TRACKER });
    try {
      const s = computeStrength(root);
      assert.equal(s.score, 0);
      assert.equal(s.total, 7);
      assert.match(s.nextUnlock, /source work document/i);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  test("counts each independent signal", () => {
    const root = makeWorkspace({
      resume: true,
      storyBank: STORY_BANK_SCAFFOLD + "\n## A\nx\n## B\ny\n## C\nz\n",
      reportSkills: ["resume-auditor", "claim-check"],
      proofAssets: ["case-study"],
      tailoredApps: ["acme-pm"],
      coverLetter: true,
      applications: EMPTY_TRACKER,
    });
    try {
      const s = computeStrength(root);
      // resume + audited + story_bank(3) + proof + tailored + claim + cover = 7
      assert.equal(s.score, 7);
      assert.equal(s.nextUnlock, null);
      assert.equal(s.label, "resume");
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  test("tailor report satisfies the verified-claim signal", () => {
    const root = makeWorkspace({ resume: true, reportSkills: ["resume-tailor"] });
    try {
      const s = computeStrength(root);
      const claim = s.signals.find((x) => x.key === "claim_verified");
      assert.equal(claim.met, true);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  test("two stories is not yet enough; unlock names the shortfall", () => {
    const root = makeWorkspace({
      resume: true,
      storyBank: STORY_BANK_SCAFFOLD + "\n## A\nx\n## B\ny\n",
    });
    try {
      const s = computeStrength(root);
      const story = s.signals.find((x) => x.key === "story_bank");
      assert.equal(story.met, false);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  test("cv-only workspace labels the document CV", () => {
    const root = makeWorkspace({ cv: true });
    try {
      assert.equal(computeStrength(root).label, "CV");
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  test("wholly missing my-documents does not throw", () => {
    const root = mkdtempSync(join(tmpdir(), "strength-bare-"));
    try {
      const s = computeStrength(root);
      assert.equal(s.score, 0);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});

// --- strengthLine / pulseLine ----------------------------------------------

describe("strengthLine", () => {
  test("renders score and next unlock", () => {
    const root = makeWorkspace({ resume: true });
    try {
      const line = strengthLine(root);
      assert.match(line, /^Profile strength: 1\/7 — /);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
  test("full profile reports completion, no dangling unlock", () => {
    const root = makeWorkspace({
      resume: true,
      storyBank: STORY_BANK_SCAFFOLD + "\n## A\nx\n## B\ny\n## C\nz\n",
      reportSkills: ["resume-auditor", "claim-check"],
      proofAssets: ["case-study"],
      tailoredApps: ["acme-pm"],
      coverLetter: true,
    });
    try {
      assert.match(strengthLine(root), /7\/7/);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});

describe("pulseLine", () => {
  test("empty tracker gives the starter line", () => {
    const root = makeWorkspace({ applications: EMPTY_TRACKER });
    try {
      assert.match(pulseLine(root), /No applications tracked yet/);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
  test("summarizes in-flight, interviewing, and nearest next action", () => {
    const applications = trackerWith(
      "| acme-pm | Acme | PM | applied | - | board | 2026-07-24 | 2026-07-15 | - |",
      "| beta-eng | Beta | Eng | interviewing | - | referral | 2026-07-20 | 2026-07-16 | - |",
    );
    const root = makeWorkspace({ applications });
    try {
      const line = pulseLine(root);
      assert.match(line, /2 in flight/);
      assert.match(line, /1 interviewing/);
      assert.match(line, /next action 2026-07-20 \(beta-eng\)/);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
  test("missing applications.md does not throw", () => {
    const root = mkdtempSync(join(tmpdir(), "strength-nopulse-"));
    try {
      assert.match(pulseLine(root), /No applications tracked yet/);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
