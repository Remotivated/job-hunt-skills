// Idempotently scaffold the my-documents/ state layer.
// See skills/_shared/state-layer.md for the contract.

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

| id | company | role | status | comp_expected | source | next_action_date | updated | link |
|----|---------|------|--------|---------------|--------|------------------|---------|------|

## Notes
`;

const STORY_BANK_MD = `# Story Bank

STAR+R stories for behavioral interviews and claim evidence. Add one H2 section per story.

<!--
Schema - one section per story:

## {Short memorable title}

\`\`\`yaml
id: {kebab-case-slug}
themes: [leadership, delivery, conflict, failure-learning, scope, stakeholder, crisis, ambiguity]
archetypes: [technical-leadership, scope-negotiation, cross-functional, turnaround, mentorship]
created: YYYY-MM-DD
usage: []
\`\`\`

**Situation:** Where and when. One or two sentences of context.

**Task:** What you were responsible for. Make the stakes visible.

**Action:** What you specifically did. First person, concrete verbs.

**Result:** Quantified outcome where possible; scope and qualitative impact where numbers are not available.

**Reflection:** What you would do differently, what you learned, or how this changed your approach.
-->
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
