import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  copyFileSync,
  existsSync,
  mkdtempSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  symlinkSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, test } from "node:test";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(SCRIPT_DIR, "..");
const PLUGIN_DIR = "plugins/job-hunt-skills";
const PLUGIN = join(ROOT, PLUGIN_DIR);

function makePluginFixture() {
  const tmp = mkdtempSync(join(tmpdir(), "job-hunt-plugin-fixture-"));
  const pluginRoot = join(tmp, "plugin");
  const scriptsDir = join(pluginRoot, "scripts");
  const skillsDir = join(pluginRoot, "skills");
  mkdirSync(scriptsDir, { recursive: true });
  mkdirSync(skillsDir, { recursive: true });
  for (const name of ["scaffold-state.mjs", "workspace.mjs", "state.mjs"]) {
    copyFileSync(join(PLUGIN, "scripts", name), join(scriptsDir, name));
  }
  return { tmp, pluginRoot, skillsDir };
}

// Entries the release ZIP must contain, relative to the ZIP root. The ZIP is
// the plugin folder, so each of these is tracked under plugins/job-hunt-skills/.
const PLUGIN_ARCHIVE_PATHS = [
  ".claude-plugin/plugin.json",
  ".codex-plugin/plugin.json",
  "LICENSE",
  "README.md",
  "scripts/vendor/LICENSES.md",
  "scripts/vendor/LEGAL.txt",
  "scripts/vendor/SOURCE-NOTICES.md",
  "scripts/vendor/vendor-inputs.json",
  "skills/get-started/agents/openai.yaml",
  "skills/_shared/truth-and-content.md",
  "scripts/state.mjs",
  "scripts/workspace.mjs",
  "scripts/opportunity.mjs",
  "skills/opportunity-evaluator/SKILL.md",
];

// Added to the ZIP by scripts/build-cowork-zip.mjs rather than tracked in the
// plugin folder: a Codex marketplace pointing at the ZIP root, so an unpacked
// release can be added with `codex plugin marketplace add <folder>`.
const GENERATED_ARCHIVE_PATHS = [".agents/plugins/marketplace.json"];

const RELEASE_ARCHIVE_PATHS = [...PLUGIN_ARCHIVE_PATHS, ...GENERATED_ARCHIVE_PATHS];

function assertGitArchiveEligible(relativePath) {
  const tracked = spawnSync(
    "git",
    ["ls-files", "--error-unmatch", "--", relativePath],
    { cwd: PLUGIN, encoding: "utf8" },
  );
  assert.equal(
    tracked.status,
    0,
    `${relativePath} must be tracked: ${tracked.stderr.trim()}`,
  );

  const attribute = spawnSync(
    "git",
    ["check-attr", "export-ignore", "--", relativePath],
    { cwd: PLUGIN, encoding: "utf8" },
  );
  assert.equal(attribute.status, 0, attribute.stderr);
  assert.equal(
    attribute.stdout.trim(),
    `${relativePath}: export-ignore: unspecified`,
    `${relativePath} must not be export-ignored; got ${attribute.stdout.trim()}`,
  );
}

function readJson(relativePath) {
  return JSON.parse(readFileSync(join(ROOT, relativePath), "utf8"));
}

function skillDirectoryNames() {
  return readdirSync(join(PLUGIN, "skills"), { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name !== "_shared")
    .map((entry) => entry.name)
    .sort();
}

function userFacingSkillNames() {
  return skillDirectoryNames().filter((name) =>
    existsSync(join(PLUGIN, "skills", name, "SKILL.md")),
  );
}

function userFacingSkillFiles() {
  return userFacingSkillNames().map((name) =>
    join(PLUGIN, "skills", name, "SKILL.md"),
  );
}

function openAiMetadataSkillNames() {
  return skillDirectoryNames().filter((name) =>
    existsSync(join(PLUGIN, "skills", name, "agents/openai.yaml")),
  );
}

describe("Installed-plugin resource resolution", () => {
  test("skills never assume bundled scripts live in the user workspace", () => {
    const files = [
      ...userFacingSkillFiles(),
      join(PLUGIN, "skills/_shared/state-layer.md"),
    ];
    for (const file of files) {
      const text = readFileSync(file, "utf8");
      assert.doesNotMatch(text, /node scripts\//, file);
    }

    const state = readFileSync(
      join(PLUGIN, "skills/_shared/state-layer.md"),
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
        [join(PLUGIN, "scripts/scaffold-state.mjs")],
        { cwd: workspace, encoding: "utf8" },
      );
      assert.equal(scaffold.status, 0, scaffold.stderr);
      assert.ok(existsSync(join(workspace, "my-documents/applications.md")));
      assert.ok(existsSync(join(workspace, "my-documents/story-bank.md")));

      const strength = spawnSync(
        process.execPath,
        [join(PLUGIN, "scripts/profile-strength.mjs")],
        { cwd: workspace, encoding: "utf8" },
      );
      assert.equal(strength.status, 0, strength.stderr);
      assert.match(strength.stdout, /^Profile strength: 0\/7/);
    } finally {
      rmSync(workspace, { recursive: true, force: true });
    }
  });

  test("scaffolder refuses the plugin root without creating user state", () => {
    const fixture = makePluginFixture();
    const script = join(fixture.pluginRoot, "scripts/scaffold-state.mjs");
    const stateRoot = join(fixture.pluginRoot, "my-documents");
    try {
      const scaffold = spawnSync(
        process.execPath,
        [script],
        {
          cwd: fixture.pluginRoot,
          encoding: "utf8",
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
      assert.equal(
        existsSync(stateRoot),
        false,
        "refusal must not create state",
      );
    } finally {
      rmSync(fixture.tmp, { recursive: true, force: true });
    }
  });

  test("scaffolder refuses descendants of the plugin root", () => {
    const fixture = makePluginFixture();
    const script = join(fixture.pluginRoot, "scripts/scaffold-state.mjs");
    const stateRoot = join(fixture.skillsDir, "my-documents");
    try {
      const scaffold = spawnSync(
        process.execPath,
        [script],
        {
          cwd: fixture.skillsDir,
          encoding: "utf8",
        },
      );
      assert.equal(scaffold.status, 2, scaffold.stderr);
      assert.equal(
        existsSync(stateRoot),
        false,
        "refusal must not create state",
      );
    } finally {
      rmSync(fixture.tmp, { recursive: true, force: true });
    }
  });

  test("scaffolder refuses symlinked descendants of the plugin root", () => {
    const fixture = makePluginFixture();
    const linkedRoot = join(fixture.tmp, "linked-plugin");
    const script = join(fixture.pluginRoot, "scripts/scaffold-state.mjs");
    const stateRoot = join(fixture.skillsDir, "my-documents");
    try {
      symlinkSync(fixture.pluginRoot, linkedRoot, "dir");
      const scaffold = spawnSync(
        process.execPath,
        [script],
        {
          cwd: join(linkedRoot, "skills"),
          encoding: "utf8",
        },
      );
      assert.equal(scaffold.status, 2, scaffold.stderr);
      assert.equal(
        existsSync(stateRoot),
        false,
        "refusal must not create state",
      );
    } finally {
      rmSync(fixture.tmp, { recursive: true, force: true });
    }
  });

});

describe("Vendor licensing", () => {
  test("build preserves legal comments and ships deterministic notices", () => {
    const pkg = readJson("package.json");
    assert.equal(pkg.scripts["build:vendor"], "node scripts/build-vendor.mjs");
    const buildSource = readFileSync(join(ROOT, "scripts/build-vendor.mjs"), "utf8");
    assert.match(buildSource, /legalComments:\s*["']external["']/);
    assert.doesNotMatch(buildSource, /legalComments:\s*["']none["']/);
    assert.match(buildSource, /target:\s*["']node18["']/);
    assert.match(buildSource, /metafile:\s*true/);
    assert.match(buildSource, /minify:\s*false/);

    const notices = readFileSync(
      join(PLUGIN, "scripts/vendor/LICENSES.md"),
      "utf8",
    );
    assert.match(notices, /fontkit/);
    assert.match(notices, /BSD[- ]2-Clause/i);
    assert.doesNotMatch(notices, /All bundled code is MIT-licensed/i);

    const legal = readFileSync(
      join(PLUGIN, "scripts/vendor/LEGAL.txt"),
      "utf8",
    );
    assert.ok(legal.length > 0, "preserved upstream legal comments");
    for (const [name, text] of [["LICENSES.md", notices], ["LEGAL.txt", legal]]) {
      assert.doesNotMatch(text, /\r/, `${name} must use LF line endings`);
      assert.doesNotMatch(text, /[ \t]+$/m, `${name} must not have trailing whitespace`);
    }

    const entry = readFileSync(join(ROOT, "scripts/vendor-entry.mjs"), "utf8");
    assert.doesNotMatch(
      entry,
      /pdfmake\/build\/pdfmake\.js/,
      "do not redistribute pdfmake's opaque prebuilt browser dependency graph",
    );

    const inventory = readJson(`${PLUGIN_DIR}/scripts/vendor/vendor-inputs.json`);
    assert.deepEqual(inventory.unresolved, [], "vendor inputs need zero silent omissions");
    assert.ok(inventory.packages.length > 5);
    for (const record of inventory.packages) {
      assert.ok(record.name && record.version && record.declaredLicense, JSON.stringify(record));
      assert.ok(record.licenseFiles.length > 0, `${record.name} lacks a license file`);
    }
    assert.deepEqual(inventory.embedded.map((record) => record.name).sort(), ["fontkit-base64-arraybuffer", "fontkit-harfbuzz"]);
    assert.match(notices, /Copyright \(c\) 2012 Niklas von Hertzen/);
    assert.match(notices, /Copyright © 2010,2012,2013  Google, Inc\./);
    for (const name of ["fontkit", "dfa"]) {
      const record = inventory.packages.find((record) => record.name === name);
      assert.ok(record.licenseFiles.includes("scripts/vendor/SOURCE-NOTICES.md"), `${name} needs full MIT terms beyond its README label`);
    }
    for (const name of ["docx", "brotli", "jszip", "svg-to-pdfkit", "xmldoc", "sax"]) {
      assert.ok(!inventory.packages.some((record) => record.name === name), `${name} must not ship`);
    }
    assert.ok(inventory.buildInputs.some((input) => input.path.startsWith("node_modules/fontkit/src/")));
    assert.ok(!inventory.buildInputs.some((input) => input.path.includes("fontkit/dist/")));
    for (const style of ["Regular", "Bold", "Italic", "BoldItalic"]) {
      const font = readFileSync(join(PLUGIN, "templates/fonts", `Gelasio-${style}.ttf`));
      assert.equal(font.readUInt32BE(0), 0x00010000, `${style} must be TrueType; WOFF2 decoding is unsupported`);
    }
    assert.ok(inventory.outputs.length > 20, "dependencies must remain separate readable modules");
    for (const output of inventory.outputs) {
      assert.ok(readFileSync(join(PLUGIN, output.path)).length < 256 * 1024, output.path);
    }

    assert.match(notices, /Zero unresolved build-input packages: yes/);
    for (const record of [...inventory.packages, ...inventory.embedded]) {
      assert.match(notices, new RegExp(record.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    }
  });
});

describe("Codex plugin manifest", () => {
  test("declares the existing skills directory without unsupported components", () => {
    const manifest = readJson(`${PLUGIN_DIR}/.codex-plugin/plugin.json`);
    assert.equal(manifest.name, "job-hunt-skills");
    assert.equal(manifest.version, "1.2.0");
    assert.equal(manifest.skills, "./skills/");
    assert.equal(manifest.license, "MIT");
    assert.ok(existsSync(join(PLUGIN, manifest.skills)));
    assert.equal("apps" in manifest, false);
    assert.equal("mcpServers" in manifest, false);
    assert.equal("hooks" in manifest, false);
  });

  test("keeps shared identity fields aligned with the Claude manifest", () => {
    const codex = readJson(`${PLUGIN_DIR}/.codex-plugin/plugin.json`);
    const claude = readJson(`${PLUGIN_DIR}/.claude-plugin/plugin.json`);
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

describe("Release versions", () => {
  test("package, lockfile, both plugin manifests, and the changelog name one version", () => {
    const version = readJson("package.json").version;
    const lock = readJson("package-lock.json");
    assert.equal(lock.version, version, "package-lock.json version");
    assert.equal(lock.packages[""].version, version, "package-lock.json root package version");
    assert.equal(readJson(`${PLUGIN_DIR}/.claude-plugin/plugin.json`).version, version, "Claude manifest");
    assert.equal(readJson(`${PLUGIN_DIR}/.codex-plugin/plugin.json`).version, version, "Codex manifest");
    const changelog = readFileSync(join(ROOT, "CHANGELOG.md"), "utf8");
    const latest = /^## (\d+\.\d+\.\d+)\b/m.exec(changelog);
    assert.ok(latest, "CHANGELOG.md must have a version heading");
    assert.equal(latest[1], version, "newest CHANGELOG.md heading");
  });
});

describe("Codex marketplace", () => {
  test("exposes the plugin folder with required policy metadata", () => {
    const marketplace = readJson(".agents/plugins/marketplace.json");
    assert.equal(marketplace.name, "remotivated");
    assert.equal(marketplace.interface.displayName, "Remotivated");
    assert.equal(marketplace.plugins.length, 1);

    const plugin = marketplace.plugins[0];
    assert.equal(plugin.name, "job-hunt-skills");
    assert.deepEqual(plugin.source, {
      source: "local",
      path: `./${PLUGIN_DIR}`,
    });
    assert.ok(existsSync(join(ROOT, plugin.source.path, ".codex-plugin/plugin.json")));
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
    "opportunity-evaluator": {
      displayName: "Opportunity Evaluator",
      shortDescription: "Decide whether a job posting is worth pursuing",
      defaultPrompt:
        "Use $opportunity-evaluator to tell me whether this posting is worth pursuing, based only on my actual experience.",
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
        PLUGIN,
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
    const codexPluginSection = readme.match(
      /## Use The Codex Plugin[\s\S]*?(?=\n## Use The Claude Code Plugin)/,
    )?.[0];
    const codexPluginRow = readme.match(/^\| Codex plugin \|.*$/m)?.[0];

    assert.ok(codexPluginSection, "Codex plugin section must exist");
    assert.ok(codexPluginRow, "Codex plugin start-path row must exist");
    assert.match(readme, /## Use The Codex Plugin/);
    assert.match(codexPluginSection, /Codex CLI/);
    assert.match(codexPluginSection, /ChatGPT desktop app/);
    assert.doesNotMatch(codexPluginSection, /IDE extension/);
    assert.doesNotMatch(codexPluginRow, /IDE extension/);
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

describe("Release archive configuration", () => {
  test("release metadata is tracked in the plugin folder and not export-ignored", () => {
    for (const relativePath of PLUGIN_ARCHIVE_PATHS) {
      assertGitArchiveEligible(relativePath);
    }
  });

  test("eligibility helper rejects untracked paths", () => {
    assert.throws(
      () => assertGitArchiveEligible("not-a-tracked-release-entry.fixture"),
      /not-a-tracked-release-entry\.fixture must be tracked/,
    );
  });

  test("release workflow verifies exact archive entry names", () => {
    const workflow = readFileSync(
      join(ROOT, ".github/workflows/release.yml"),
      "utf8",
    );
    for (const relativePath of RELEASE_ARCHIVE_PATHS) {
      const exactCheck = `unzip -Z1 dist/job-hunt-skills.zip | grep -Fx -- "${relativePath}"`;
      assert.ok(
        workflow.includes(exactCheck),
        `${relativePath} must use an exact archive entry check`,
      );
    }
  });

  test("archive is derived only from HEAD attributes", () => {
    const builder = readFileSync(
      join(ROOT, "scripts/build-cowork-zip.mjs"),
      "utf8",
    );
    assert.doesNotMatch(builder, /--worktree-attributes/);
  });

  test("no .gitattributes uses rules the plugin directory refuses", () => {
    const files = spawnSync("git", ["ls-files", "--", ":(glob)**/.gitattributes"], {
      cwd: ROOT,
      encoding: "utf8",
    }).stdout.trim().split("\n").filter(Boolean);
    for (const file of files) {
      const rules = readFileSync(join(ROOT, file), "utf8")
        .split("\n")
        .filter((line) => line.trim() && !line.trimStart().startsWith("#"));
      for (const rule of rules) {
        assert.doesNotMatch(
          rule,
          /\b(export-ignore|export-subst|filter)\b/,
          `${file} rule "${rule}" makes the plugin directory refuse to validate the repository`,
        );
      }
    }
  });
});
