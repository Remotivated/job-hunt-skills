// Idempotently scaffold the my-documents/ state layer.
// See skills/_shared/state-layer.md for the contract.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SCRIPT_REPO_ROOT = path.resolve(__dirname, "..");
const TARGET_ROOT = process.cwd();

// Workspace preflight (state-layer §10): refuse to scaffold inside the plugin
// install dir. Early Cowork testers hit this — files landed in the plugin
// folder, invisible to the user, and the next session "couldn't find" them.
if (path.resolve(TARGET_ROOT) === path.resolve(SCRIPT_REPO_ROOT)) {
  const myDocsExists = fs.existsSync(path.join(TARGET_ROOT, "my-documents"));
  if (!myDocsExists && !process.env.JOB_HUNT_SKILLS_DEV) {
    console.error(
      `scaffold-state: working directory is the plugin install dir, not a user workspace.\n\n` +
      `Your job-hunt files belong in your own folder, not inside the plugin.\n\n` +
      `  Cowork:       Customize → Folders → pick a local folder, then ask Claude to start over.\n` +
      `  Claude Code:  cd into your workspace folder, then run 'claude' there.\n\n` +
      `Set JOB_HUNT_SKILLS_DEV=1 only if you are intentionally developing the plugin itself.`
    );
    process.exit(2);
  }
}

const ROOT = path.join(TARGET_ROOT, "my-documents");

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
  return path.relative(TARGET_ROOT, p).replaceAll("\\", "/");
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
