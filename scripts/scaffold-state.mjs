// Idempotently scaffold the my-documents/ state layer.
// See .claude/skills/_shared/state-layer.md for the contract.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "..");
const ROOT = path.join(REPO_ROOT, "my-documents");

const DIRS = [
  ROOT,
  path.join(ROOT, "applications"),
  path.join(ROOT, "reports"),
  path.join(ROOT, "proof-assets"),
];

const APPLICATIONS_MD = `# Applications

| id | company | role | status | updated | link |
|----|---------|------|--------|---------|------|

## Notes
`;

const STORY_BANK_MD = `# Story Bank

STAR+R stories used by interview-coach and as evidence by resume-tailor / resume-drift-check.

Each story uses YAML metadata followed by a STAR+R body:

\`\`\`yaml
---
id: distributed-team-migration
title: Migrating a distributed team off Slack-only sync
themes: [remote, async, leadership]
archetypes: [conflict-resolution, process-change]
---
\`\`\`

**Situation:** Context and setting.
**Task:** What you needed to accomplish.
**Action:** Specific steps you took (emphasize your own decisions).
**Result:** Quantified outcomes, learnings, follow-on impact.
**Reflection:** What you'd do differently, what surprised you, what this taught you.
`;

function rel(p) {
  return path.relative(REPO_ROOT, p).replaceAll("\\", "/");
}

function ensureDir(dir) {
  if (fs.existsSync(dir)) {
    console.log(`dir  ${rel(dir)}: exists, skipping`);
  } else {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`dir  ${rel(dir)}: created`);
  }
}

function ensureFile(filePath, contents) {
  if (fs.existsSync(filePath)) {
    console.log(`file ${rel(filePath)}: exists, skipping`);
    return;
  }
  fs.writeFileSync(filePath, contents);
  console.log(`file ${rel(filePath)}: created`);
}

for (const dir of DIRS) {
  ensureDir(dir);
  ensureFile(path.join(dir, ".gitkeep"), "");
}

ensureFile(path.join(ROOT, "applications.md"), APPLICATIONS_MD);
ensureFile(path.join(ROOT, "story-bank.md"), STORY_BANK_MD);

process.exit(0);
