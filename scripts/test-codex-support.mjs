import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, test } from "node:test";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(SCRIPT_DIR, "..");

function readJson(relativePath) {
  return JSON.parse(readFileSync(join(ROOT, relativePath), "utf8"));
}

function userFacingSkillFiles() {
  return [
    "claim-check",
    "company-research",
    "cover-letter",
    "get-started",
    "interview-coach",
    "interviewing",
    "linkedin-optimizer",
    "proof-asset-creator",
    "resume-auditor",
    "resume-builder",
    "resume-tailor",
  ].map((name) => join(ROOT, "skills", name, "SKILL.md"));
}

describe("Installed-plugin resource resolution", () => {
  test("skills never assume bundled scripts live in the user workspace", () => {
    const files = [
      ...userFacingSkillFiles(),
      join(ROOT, "skills/_shared/state-layer.md"),
    ];
    for (const file of files) {
      const text = readFileSync(file, "utf8");
      assert.doesNotMatch(text, /node scripts\//, file);
    }

    const state = readFileSync(
      join(ROOT, "skills/_shared/state-layer.md"),
      "utf8",
    );
    assert.match(state, /job_hunt_skills_root/);
    assert.match(state, /confirmed user workspace/);
  });

  test("bundled state scripts operate on a separate user workspace", () => {
    const workspace = mkdtempSync(join(tmpdir(), "job-hunt-codex-"));
    try {
      const scaffold = spawnSync(
        process.execPath,
        [join(ROOT, "scripts/scaffold-state.mjs")],
        { cwd: workspace, encoding: "utf8" },
      );
      assert.equal(scaffold.status, 0, scaffold.stderr);
      assert.ok(existsSync(join(workspace, "my-documents/applications.md")));
      assert.ok(existsSync(join(workspace, "my-documents/story-bank.md")));

      const strength = spawnSync(
        process.execPath,
        [join(ROOT, "scripts/profile-strength.mjs")],
        { cwd: workspace, encoding: "utf8" },
      );
      assert.equal(strength.status, 0, strength.stderr);
      assert.match(strength.stdout, /^Profile strength: 0\/7/);
    } finally {
      rmSync(workspace, { recursive: true, force: true });
    }
  });

  test("scaffolder refuses the plugin root without creating user state", () => {
    const stateFiles = [
      join(ROOT, "my-documents/applications.md"),
      join(ROOT, "my-documents/story-bank.md"),
    ];
    for (const file of stateFiles) {
      assert.equal(existsSync(file), false, `${file} must start absent`);
    }

    try {
      const scaffold = spawnSync(
        process.execPath,
        [join(ROOT, "scripts/scaffold-state.mjs")],
        {
          cwd: ROOT,
          encoding: "utf8",
          env: { ...process.env, JOB_HUNT_SKILLS_DEV: "" },
        },
      );

      assert.equal(scaffold.status, 2, scaffold.stderr);
      assert.match(
        scaffold.stderr,
        /Codex CLI\/IDE:  open or cd into your job-hunt folder, then start Codex there\./,
      );
      assert.match(
        scaffold.stderr,
        /Desktop agent:  select a folder you own with the app's folder\/workspace control, then start again\./,
      );
      assert.match(
        scaffold.stderr,
        /Claude Code:    cd into your job-hunt folder, then run 'claude' there\./,
      );
      for (const file of stateFiles) {
        assert.equal(existsSync(file), false, "refusal must not create state");
      }
    } finally {
      for (const file of stateFiles) rmSync(file, { force: true });
    }
  });
});

describe("Codex plugin manifest", () => {
  test("declares the existing skills directory without unsupported components", () => {
    const manifest = readJson(".codex-plugin/plugin.json");
    assert.equal(manifest.name, "job-hunt-skills");
    assert.equal(manifest.version, "1.1.0");
    assert.equal(manifest.skills, "./skills/");
    assert.equal(manifest.license, "MIT");
    assert.ok(existsSync(join(ROOT, manifest.skills)));
    assert.equal("apps" in manifest, false);
    assert.equal("mcpServers" in manifest, false);
    assert.equal("hooks" in manifest, false);
  });

  test("keeps shared identity fields aligned with the Claude manifest", () => {
    const codex = readJson(".codex-plugin/plugin.json");
    const claude = readJson(".claude-plugin/plugin.json");
    for (const field of [
      "name",
      "version",
      "description",
      "homepage",
      "repository",
      "license",
    ]) {
      assert.deepEqual(codex[field], claude[field], field);
    }
  });
});

describe("Codex marketplace", () => {
  test("exposes the repository-root plugin with required policy metadata", () => {
    const marketplace = readJson(".agents/plugins/marketplace.json");
    assert.equal(marketplace.name, "remotivated");
    assert.equal(marketplace.interface.displayName, "Remotivated");
    assert.equal(marketplace.plugins.length, 1);

    const plugin = marketplace.plugins[0];
    assert.equal(plugin.name, "job-hunt-skills");
    assert.deepEqual(plugin.source, {
      source: "local",
      path: "./",
    });
    assert.deepEqual(plugin.policy, {
      installation: "AVAILABLE",
      authentication: "ON_INSTALL",
    });
    assert.equal(plugin.category, "Productivity");
  });
});

describe("Codex repository guidance", () => {
  test("routes skill edits through the canonical state contract and checks", () => {
    const guidance = readFileSync(join(ROOT, "AGENTS.md"), "utf8");
    assert.match(guidance, /skills\/_shared\/state-layer\.md/);
    assert.match(guidance, /npm run test:codex/);
    assert.match(guidance, /python3 scripts\/test_skill_contracts\.py/);
    assert.match(guidance, /Do not duplicate/i);
    assert.match(guidance, /Claude Code and Cowork/i);
  });
});

describe("OpenAI skill metadata", () => {
  test("every user-facing skill has concise interface metadata", () => {
    const expectedInterface = {
      "claim-check": [
        "Claim Check",
        "Verify application claims before submission",
      ],
      "company-research": [
        "Company Research",
        "Vet a company and role before applying",
      ],
      "cover-letter": [
        "Cover Letter",
        "Write a truthful role-specific cover letter",
      ],
      "get-started": [
        "Get Started",
        "Start a guided, truthful job-search workflow",
      ],
      "interview-coach": [
        "Interview Coach",
        "Prepare for a specific upcoming interview",
      ],
      interviewing: [
        "Interview Tracker",
        "Track interviews, notes, and follow-ups",
      ],
      "linkedin-optimizer": [
        "LinkedIn Optimizer",
        "Audit and improve a LinkedIn profile",
      ],
      "proof-asset-creator": [
        "Proof Asset Creator",
        "Scope a portfolio asset that proves capability",
      ],
      "resume-auditor": [
        "Resume Auditor",
        "Give direct, evidence-based resume feedback",
      ],
      "resume-builder": [
        "Resume Builder",
        "Build or update a truthful source resume or CV",
      ],
      "resume-tailor": [
        "Resume Tailor",
        "Tailor a resume or CV to a specific role",
      ],
    };

    const skillFiles = userFacingSkillFiles();
    assert.equal(skillFiles.length, 11);
    for (const skillFile of skillFiles) {
      const skillDir = dirname(skillFile);
      const skillName = basename(skillDir);
      const metadataPath = join(skillDir, "agents/openai.yaml");
      assert.ok(existsSync(metadataPath), metadataPath);
      const yaml = readFileSync(metadataPath, "utf8");
      const [displayName, shortDescription] = expectedInterface[skillName];
      assert.match(
        yaml,
        new RegExp(
          `^interface:\\n` +
            `  display_name: "${displayName}"\\n` +
            `  short_description: "${shortDescription}"\\n` +
            `  default_prompt: ".+\\$${skillName}.+"\\n$`,
        ),
        metadataPath,
      );
      assert.match(yaml, /^  short_description: ".{25,64}"\n/m, metadataPath);
      assert.doesNotMatch(yaml, /^policy:|^dependencies:/m, metadataPath);
    }
  });
});
