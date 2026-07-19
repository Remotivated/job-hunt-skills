import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, test } from "node:test";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(SCRIPT_DIR, "..");

function readJson(relativePath) {
  return JSON.parse(readFileSync(join(ROOT, relativePath), "utf8"));
}

function skillDirectoryNames() {
  return readdirSync(join(ROOT, "skills"), { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name !== "_shared")
    .map((entry) => entry.name)
    .sort();
}

function userFacingSkillNames() {
  return skillDirectoryNames().filter((name) =>
    existsSync(join(ROOT, "skills", name, "SKILL.md")),
  );
}

function userFacingSkillFiles() {
  return userFacingSkillNames().map((name) =>
    join(ROOT, "skills", name, "SKILL.md"),
  );
}

function openAiMetadataSkillNames() {
  return skillDirectoryNames().filter((name) =>
    existsSync(join(ROOT, "skills", name, "agents/openai.yaml")),
  );
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
  const expectedInterface = {
    "claim-check": {
      displayName: "Claim Check",
      shortDescription: "Verify application claims before submission",
      defaultPrompt:
        "Use $claim-check to check this application material for unsupported, inflated, or invented claims.",
    },
    "company-research": {
      displayName: "Company Research",
      shortDescription: "Vet a company and role before applying",
      defaultPrompt:
        "Use $company-research to research this company and role, then tell me whether it is worth pursuing.",
    },
    "cover-letter": {
      displayName: "Cover Letter",
      shortDescription: "Write a truthful role-specific cover letter",
      defaultPrompt:
        "Use $cover-letter to write a cover letter for this role using only claims supported by my materials.",
    },
    "get-started": {
      displayName: "Get Started",
      shortDescription: "Start a guided, truthful job-search workflow",
      defaultPrompt:
        "Use $get-started to help me get started with Job Hunt Skills.",
    },
    "interview-coach": {
      displayName: "Interview Coach",
      shortDescription: "Prepare for a specific upcoming interview",
      defaultPrompt:
        "Use $interview-coach to help me prepare for this interview using my actual experience and saved materials.",
    },
    interviewing: {
      displayName: "Interview Tracker",
      shortDescription: "Track interviews, notes, and follow-ups",
      defaultPrompt:
        "Use $interviewing to update my interview process and help me plan the next follow-up.",
    },
    "linkedin-optimizer": {
      displayName: "LinkedIn Optimizer",
      shortDescription: "Audit and improve a LinkedIn profile",
      defaultPrompt:
        "Use $linkedin-optimizer to audit my LinkedIn profile and improve the sections that weaken my positioning.",
    },
    "proof-asset-creator": {
      displayName: "Proof Asset Creator",
      shortDescription: "Scope a portfolio asset that proves capability",
      defaultPrompt:
        "Use $proof-asset-creator to help me choose and scope a proof-of-value asset for my target roles.",
    },
    "resume-auditor": {
      displayName: "Resume Auditor",
      shortDescription: "Give direct, evidence-based resume feedback",
      defaultPrompt:
        "Use $resume-auditor to audit my resume honestly and identify the highest-leverage fixes.",
    },
    "resume-builder": {
      displayName: "Resume Builder",
      shortDescription: "Build or update a truthful source resume or CV",
      defaultPrompt:
        "Use $resume-builder to build or update my source resume or CV from my real experience.",
    },
    "resume-tailor": {
      displayName: "Resume Tailor",
      shortDescription: "Tailor a resume or CV to a specific role",
      defaultPrompt:
        "Use $resume-tailor to tailor my resume or CV to this posting without changing the facts.",
    },
  };

  function assertOpenAiInterface(yaml, expected, metadataPath) {
    const expectedYaml = `interface:
  display_name: "${expected.displayName}"
  short_description: "${expected.shortDescription}"
  default_prompt: "${expected.defaultPrompt}"
`;
    assert.equal(
      yaml,
      expectedYaml,
      `${metadataPath}: metadata must exactly match the approved interface`,
    );
    assert.ok(
      expected.shortDescription.length >= 25 &&
        expected.shortDescription.length <= 64,
      `${metadataPath}: short description must be 25-64 characters`,
    );
  }

  test("every user-facing skill has exact interface metadata", () => {
    const expectedSkillNames = Object.keys(expectedInterface).sort();
    assert.deepEqual(
      userFacingSkillNames(),
      expectedSkillNames,
      "user-facing skill directories must match the metadata contract",
    );
    assert.deepEqual(
      openAiMetadataSkillNames(),
      expectedSkillNames,
      "OpenAI metadata files must match the user-facing skill set",
    );

    for (const skillName of expectedSkillNames) {
      const metadataPath = join(
        ROOT,
        "skills",
        skillName,
        "agents/openai.yaml",
      );
      const yaml = readFileSync(metadataPath, "utf8");
      assertOpenAiInterface(yaml, expectedInterface[skillName], metadataPath);
    }
  });

  test("rejects prompt text that only preserves the skill identifier", () => {
    const yaml = `interface:
  display_name: "Claim Check"
  short_description: "Verify application claims before submission"
  default_prompt: "Use $claim-check to write an unrelated networking email."
`;

    assert.throws(
      () =>
        assertOpenAiInterface(
          yaml,
          expectedInterface["claim-check"],
          "mismatched prompt fixture",
        ),
      { name: "AssertionError" },
    );
  });
});

describe("Public Codex documentation", () => {
  test("README documents install, invocation, and local-file behavior", () => {
    const readme = readFileSync(join(ROOT, "README.md"), "utf8");
    assert.match(readme, /## Use The Codex Plugin/);
    assert.match(
      readme,
      /codex plugin marketplace add Remotivated\/job-hunt-skills/,
    );
    assert.match(
      readme,
      /codex plugin add job-hunt-skills@remotivated/,
    );
    assert.match(readme, /\$job-hunt-skills:get-started/);
    assert.match(readme, /Codex CLI/);
    assert.match(readme, /Codex IDE extension/);
    assert.match(readme, /ChatGPT desktop app/);
  });

  test("getting-started and contributing docs include Codex", () => {
    const gettingStarted = readFileSync(
      join(ROOT, "GETTING-STARTED.md"),
      "utf8",
    );
    const contributing = readFileSync(
      join(ROOT, "CONTRIBUTING.md"),
      "utf8",
    );
    assert.match(gettingStarted, /Codex/);
    assert.match(gettingStarted, /\$job-hunt-skills:get-started/);
    assert.match(contributing, /\.codex-plugin/);
    assert.match(contributing, /npm run test:codex/);
  });
});
