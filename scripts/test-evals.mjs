// Static checks for the behavioural eval suite in evals/. Free: no model calls.
//
// Run with:  node --test scripts/test-evals.mjs   (or: npm run test:evals)
//
// The suite itself runs with `npm run eval` (see CONTRIBUTING.md). These tests
// keep its case files well formed so a run never fails to load, every case says
// which rule it protects with a link that resolves, the suite covers its five
// behaviour groups and every main-plugin skill, the regex graders that judge
// wording pass honest samples and catch forbidden ones, the data stays
// synthetic, and the runner keeps results out of the plugin folder.

import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, test } from "node:test";

import { buildCommand, main } from "../evals/run.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const EVALS = join(ROOT, "evals");
const PLUGIN = join(ROOT, "plugins", "job-hunt-skills");

const GROUPS = ["no-invented-claims", "withdrawn-claims", "posting-as-data", "chat-no-workspace", "trigger"];
const MIN_CASES = 15;
const MAX_CASES = 25;
const GRADER_TYPES = new Set(["regex", "tool_used", "tool_order", "file_exists", "llm", "baseline"]);
const DETERMINISTIC = new Set(["regex", "tool_used", "tool_order", "file_exists"]);
// Every key prompt.md frontmatter accepts; the CLI rejects any other.
const PROMPT_KEYS = new Set([
  "schema_version", "name", "description", "tags", "plugins", "runs", "expected_outcome", "model",
  "max_turns", "timeout_seconds", "allowed_tools", "append_system_prompt", "env",
]);
const COMMON_GRADER_KEYS = new Set(["type", "weight", "arm"]);
const GRADER_KEYS = {
  regex: new Set(["pattern", "flags", "match", "target"]),
  tool_used: new Set(["tool", "input_match", "min", "max"]),
  tool_order: new Set(["before", "after"]),
  file_exists: new Set(["path", "exists"]),
  llm: new Set(["criteria", "focus"]),
  baseline: new Set(["baseline_file", "criteria"]),
};

const read = (path) => readFileSync(path, "utf8").replace(/\r\n/g, "\n");

// ---------------------------------------------------------------- frontmatter
//
// The suite's frontmatter uses a small YAML subset on purpose: `key: value`
// lines with plain, single- or double-quoted scalars, one-line [lists] and
// {maps}, and `>-` folded text. Anything else fails here, before a paid run.

function splitFlow(text) {
  const items = [];
  let depth = 0;
  let quote = null;
  let current = "";
  for (const ch of text) {
    if (quote) {
      current += ch;
      if (ch === quote) quote = null;
    } else if (ch === "'" || ch === '"') {
      quote = ch;
      current += ch;
    } else if (ch === "[" || ch === "{") {
      depth += 1;
      current += ch;
    } else if (ch === "]" || ch === "}") {
      depth -= 1;
      current += ch;
    } else if (ch === "," && depth === 0) {
      items.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  if (current.trim()) items.push(current.trim());
  return items;
}

function scalar(raw, where) {
  const text = raw.trim();
  if (text.startsWith("'")) {
    assert.ok(text.endsWith("'") && text.length > 1, `${where}: unterminated single-quoted value`);
    return text.slice(1, -1).replace(/''/g, "'");
  }
  if (text.startsWith('"')) {
    assert.ok(text.endsWith('"') && text.length > 1, `${where}: unterminated double-quoted value`);
    return JSON.parse(text);
  }
  if (text.startsWith("[")) {
    assert.ok(text.endsWith("]"), `${where}: lists must be written on one line`);
    return splitFlow(text.slice(1, -1)).map((item) => scalar(item, where));
  }
  if (text.startsWith("{")) {
    assert.ok(text.endsWith("}"), `${where}: maps must be written on one line`);
    return Object.fromEntries(
      splitFlow(text.slice(1, -1)).map((item) => {
        const at = item.indexOf(":");
        assert.ok(at > 0, `${where}: bad map entry ${item}`);
        return [item.slice(0, at).trim(), scalar(item.slice(at + 1), where)];
      }),
    );
  }
  if (/^-?\d+(\.\d+)?$/.test(text)) return Number(text);
  if (text === "true" || text === "false") return text === "true";
  return text;
}

export function parseFrontmatter(text, where) {
  const match = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/.exec(text);
  assert.ok(match, `${where}: needs a --- frontmatter block`);
  const fields = {};
  const lines = match[1].split("\n");
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (!line.trim()) continue;
    const kv = /^([a-z_]+):(?:\s(.*))?$/.exec(line);
    assert.ok(kv, `${where}: cannot read frontmatter line "${line}"`);
    const [, key, rest = ""] = kv;
    assert.ok(!(key in fields), `${where}: duplicate key ${key}`);
    if (rest.trim() === ">-") {
      const folded = [];
      while (i + 1 < lines.length && /^\s+\S/.test(lines[i + 1])) folded.push(lines[++i].trim());
      assert.ok(folded.length, `${where}: empty folded value for ${key}`);
      fields[key] = folded.join(" ");
    } else {
      assert.ok(rest.trim(), `${where}: ${key} has no value (nested YAML is not used in this suite)`);
      fields[key] = scalar(rest, `${where} ${key}`);
    }
  }
  return { fields, body: match[2] };
}

// ---------------------------------------------------------------- headings

// The same GitHub-style slug scripts/check-internal-links.py uses.
function slug(text) {
  return text.trim().toLowerCase().replace(/[^\p{L}\p{N}_\s-]/gu, "").replace(/\s+/g, "-");
}

function anchors(path) {
  const found = new Set();
  const counts = new Map();
  let fence = null;
  for (const line of read(path).split("\n")) {
    const opener = /^\s{0,3}(`{3,}|~{3,})/.exec(line);
    if (opener) {
      if (!fence) fence = opener[1];
      else if (opener[1][0] === fence[0] && opener[1].length >= fence.length) fence = null;
      continue;
    }
    if (fence) continue;
    const heading = /^\s{0,3}#{1,6}\s+(.*?)\s*#*\s*$/.exec(line);
    if (!heading) continue;
    const base = slug(heading[1]);
    if (!base) continue;
    const seen = counts.get(base) ?? 0;
    counts.set(base, seen + 1);
    found.add(seen ? `${base}-${seen}` : base);
  }
  return found;
}

// ---------------------------------------------------------------- the suite

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (name === "results" && dir === EVALS) return [];
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

function loadCases() {
  return readdirSync(EVALS)
    .filter((name) => existsSync(join(EVALS, name, "prompt.md")))
    .sort()
    .map((name) => {
      const dir = join(EVALS, name);
      const { fields, body } = parseFrontmatter(read(join(dir, "prompt.md")), `${name}/prompt.md`);
      const graderDir = join(dir, "graders");
      const graders = existsSync(graderDir)
        ? readdirSync(graderDir)
            .filter((file) => file.endsWith(".md"))
            .sort()
            .map((file) => {
              const parsed = parseFrontmatter(read(join(graderDir, file)), `${name}/graders/${file}`);
              return { name: file.replace(/\.md$/, ""), ...parsed.fields, body: parsed.body.trim() };
            })
        : [];
      const caseYaml = join(dir, "case.yaml");
      return { name, dir, fields, body, graders, caseYaml: existsSync(caseYaml) ? read(caseYaml) : null };
    });
}

const CASES = loadCases();
const SKILLS = readdirSync(join(PLUGIN, "skills"))
  .filter((name) => !name.startsWith("_") && existsSync(join(PLUGIN, "skills", name, "SKILL.md")))
  .sort();

function skillFired(grader) {
  if (grader.type !== "tool_used" || grader.tool !== "Skill" || !grader.input_match) return [];
  const pattern = new RegExp(grader.input_match);
  return SKILLS.filter((skill) => pattern.test(`{"skill": "job-hunt-skills:${skill}"}`));
}

function fileTarget(grader) {
  const value = grader.type === "regex" ? grader.target : grader.type === "llm" ? grader.focus : null;
  return value && typeof value === "object" && value.source === "file" ? value.path : null;
}

describe("eval suite layout", () => {
  test(`holds ${MIN_CASES} to ${MAX_CASES} cases at the repository root`, () => {
    assert.ok(CASES.length >= MIN_CASES && CASES.length <= MAX_CASES, `found ${CASES.length} cases`);
    assert.ok(!existsSync(join(PLUGIN, "evals")), "the suite must stay outside plugins/job-hunt-skills/");
  });

  test("every case directory has a prompt.md and at least one grader", () => {
    for (const name of readdirSync(EVALS)) {
      const dir = join(EVALS, name);
      if (name === "results" || !statSync(dir).isDirectory()) continue;
      assert.ok(existsSync(join(dir, "prompt.md")), `${name}: missing prompt.md`);
    }
    for (const c of CASES) assert.ok(c.graders.length > 0, `${c.name}: no graders`);
  });

  test("prompt.md frontmatter uses only fields the CLI accepts", () => {
    for (const c of CASES) {
      for (const key of Object.keys(c.fields)) assert.ok(PROMPT_KEYS.has(key), `${c.name}: unknown key ${key}`);
      assert.ok(c.body.trim(), `${c.name}: empty prompt`);
      assert.ok(Array.isArray(c.fields.tags) && c.fields.tags.length, `${c.name}: needs tags`);
      assert.ok(Array.isArray(c.fields.allowed_tools), `${c.name}: needs allowed_tools`);
      assert.ok(Number.isInteger(c.fields.max_turns) && c.fields.max_turns <= 200, `${c.name}: max_turns`);
      assert.ok(Number.isInteger(c.fields.timeout_seconds) && c.fields.timeout_seconds <= 3600, `${c.name}: timeout_seconds`);
    }
  });

  test("every case loads the main plugin through its plugins field", () => {
    for (const c of CASES) {
      assert.ok(Array.isArray(c.fields.plugins) && c.fields.plugins.length === 1, `${c.name}: plugins must list one path`);
      assert.equal(resolve(c.dir, c.fields.plugins[0]), PLUGIN, `${c.name}: plugins must point at plugins/job-hunt-skills`);
    }
  });

  test("case.yaml, when present, names the case and an existing scaffold script", () => {
    for (const c of CASES.filter((item) => item.caseYaml)) {
      // Only the keys this suite uses, so a misspelt key cannot silently skip the scaffold.
      for (const line of c.caseYaml.split("\n").filter((item) => item.trim())) {
        assert.match(
          line,
          /^(schema_version|name|context): |^context:$|^ {2}(scaffold_script|add_dirs|history_file): /,
          `${c.name}/case.yaml: unexpected line "${line}"`,
        );
      }
      assert.match(c.caseYaml, /^schema_version: "1\.1"$/m, `${c.name}: schema_version`);
      assert.match(c.caseYaml, new RegExp(`^name: ${c.name}$`, "m"), `${c.name}: name must match the folder`);
      const script = /^\s+scaffold_script: (\S+)$/m.exec(c.caseYaml)?.[1];
      if (script) {
        assert.ok(existsSync(join(c.dir, script)), `${c.name}: missing ${script}`);
        assert.match(read(join(c.dir, script)), /^#!\/usr\/bin\/env bash\n/, `${c.name}: ${script} needs a bash shebang`);
      }
    }
  });
});

describe("what each case protects", () => {
  test("each case has a one-line Protects: statement whose link resolves to a rule anchor", () => {
    for (const c of CASES) {
      const description = c.fields.description ?? "";
      const link = /^Protects: \[[^\]]+\]\(([^)#\s]+)#([^)\s]+)\)$/.exec(description);
      assert.ok(link, `${c.name}: description must be "Protects: [rule](path#anchor)"`);
      const target = resolve(c.dir, link[1]);
      assert.ok(target.startsWith(PLUGIN + sep), `${c.name}: Protects must link a rule in the plugin`);
      assert.ok(existsSync(target), `${c.name}: ${link[1]} does not exist`);
      assert.ok(anchors(target).has(link[2]), `${c.name}: #${link[2]} is not a heading in ${link[1]}`);
    }
  });

  test("each case states its expected outcome", () => {
    for (const c of CASES) assert.ok((c.fields.expected_outcome ?? "").length > 40, `${c.name}: expected_outcome`);
  });
});

describe("coverage", () => {
  test("every behaviour group has cases", () => {
    for (const group of GROUPS) {
      assert.ok(CASES.some((c) => c.fields.tags.includes(group)), `no case tagged ${group}`);
    }
  });

  test("every case is tagged with the skill it exercises, so --tag <skill> runs one skill", () => {
    for (const c of CASES) {
      assert.ok(c.fields.tags.some((tag) => SKILLS.includes(tag)), `${c.name}: tag it with a skill name`);
      for (const tag of c.fields.tags) {
        assert.ok(GROUPS.includes(tag) || tag === "fidelity" || SKILLS.includes(tag), `${c.name}: unknown tag ${tag}`);
      }
    }
  });

  test("every main-plugin skill has a trigger case with a tool_used Skill grader", () => {
    assert.equal(SKILLS.length, 12);
    for (const skill of SKILLS) {
      const owners = CASES.filter(
        (c) => c.fields.tags.includes("trigger") && c.fields.tags.includes(skill) && c.graders.some((g) => skillFired(g).includes(skill)),
      );
      assert.ok(owners.length > 0, `no trigger case for ${skill}`);
    }
    for (const c of CASES.filter((item) => item.fields.tags.includes("trigger"))) {
      assert.ok(c.graders.some((g) => skillFired(g).length === 1), `${c.name}: trigger case without a Skill grader`);
    }
  });

  // Cases whose protected claim is whether letter prose says the user did the
  // work. No pattern decides that on its face, so the rubric that reads the
  // saved letter judges it, and these cases have no regex over that letter.
  const CLAIM_IN_LETTER_PROSE = new Set(["fidelity-target-role-not-experience"]);

  test("every fidelity case records source, allowed meaning and forbidden change, and grades the saved document and the reply", () => {
    const fidelity = CASES.filter((c) => c.fields.tags.includes("fidelity"));
    assert.ok(fidelity.length >= 5, "the five fidelity sub-cases each need a case");
    for (const name of CLAIM_IN_LETTER_PROSE) {
      const c = fidelity.find((item) => item.name === name);
      assert.ok(c, `${name}: listed as a letter-prose case but is not a fidelity case`);
      assert.ok(!c.graders.some((g) => g.type === "regex" && fileTarget(g)), `${name}: has a regex over the saved document, so remove it from the letter-prose list`);
    }
    for (const c of fidelity) {
      for (const part of ["Source:", "Allowed meaning:", "Forbidden change:"]) {
        assert.ok(c.fields.expected_outcome.includes(part), `${c.name}: expected_outcome needs "${part}"`);
      }
      if (!CLAIM_IN_LETTER_PROSE.has(c.name)) {
        assert.ok(c.graders.some((g) => g.type === "regex" && fileTarget(g)), `${c.name}: needs a regex over the saved document`);
      }
      assert.ok(c.graders.some((g) => g.type === "file_exists" && g.exists !== false), `${c.name}: needs a file_exists check`);
      assert.ok(c.graders.some((g) => g.type === "llm" && fileTarget(g)), `${c.name}: needs a paraphrase rubric on the saved document`);
      assert.ok(c.graders.some((g) => g.type === "llm" && !fileTarget(g)), `${c.name}: needs a grader on the reply`);
    }
  });
});

describe("graders", () => {
  test("use known types and fields, and patterns compile", () => {
    for (const c of CASES) {
      for (const g of c.graders) {
        const where = `${c.name}/graders/${g.name}.md`;
        assert.ok(GRADER_TYPES.has(g.type), `${where}: unknown type ${g.type}`);
        for (const key of Object.keys(g)) {
          if (key === "name" || key === "body") continue;
          assert.ok(COMMON_GRADER_KEYS.has(key) || GRADER_KEYS[g.type]?.has(key), `${where}: ${key} is not a ${g.type} option`);
        }
        if (g.type === "tool_order") {
          for (const side of ["before", "after"]) {
            const value = g[side];
            assert.ok(value, `${where}: needs ${side}`);
            if (typeof value === "object") {
              assert.ok(value.tool, `${where}: ${side} needs a tool`);
              if (value.input_match) assert.doesNotThrow(() => new RegExp(value.input_match), `${where}: ${side}.input_match`);
            }
          }
        }
        if (g.type === "regex") {
          assert.ok(g.pattern, `${where}: needs a pattern`);
          assert.ok(!g.pattern.includes("(?i)"), `${where}: put case-insensitivity in flags`);
          assert.match(g.flags ?? "", /^[gimsuy]*$/, `${where}: flags`);
          assert.doesNotThrow(() => new RegExp(g.pattern, g.flags ?? ""), `${where}: pattern does not compile`);
          if (g.match) assert.match(g.match, /^(contains|not_contains|count:\d+)$/, `${where}: match`);
        }
        if (g.type === "tool_used" && g.input_match) {
          assert.doesNotThrow(() => new RegExp(g.input_match), `${where}: input_match does not compile`);
        }
        if (g.type === "llm") {
          assert.match(g.body, /^PASS if\b/m, `${where}: rubric needs a PASS condition`);
          assert.match(g.body, /^FAIL (only )?if\b/m, `${where}: rubric needs a FAIL condition`);
        }
        const path = fileTarget(g) ?? (g.type === "file_exists" ? g.path : null);
        if (path) {
          assert.ok(!path.startsWith("/") && !path.split("/").includes(".."), `${where}: workspace paths stay relative`);
        }
      }
      assert.ok(c.graders.some((g) => DETERMINISTIC.has(g.type)), `${c.name}: needs a deterministic grader`);
    }
  });

  test("a regex over a document saved by the run has a file_exists check beside it", () => {
    for (const c of CASES) {
      const script = c.caseYaml && /^\s+scaffold_script: (\S+)$/m.exec(c.caseYaml)?.[1];
      const scaffolded = script && existsSync(join(c.dir, script)) ? read(join(c.dir, script)) : "";
      for (const g of c.graders.filter((item) => item.type === "regex" && fileTarget(item))) {
        const path = fileTarget(g);
        if (scaffolded.includes(`cat > ${path} `)) continue;
        assert.ok(
          c.graders.some((other) => other.type === "file_exists" && other.path === path && other.exists !== false),
          `${c.name}/${g.name}: add a file_exists grader for ${path}`,
        );
      }
    }
  });
});

// ---------------------------------------------------------------- regex samples
//
// The regex graders that judge wording, tried on sample documents: harmless
// rewordings and honest sentences must pass, and each forbidden change must
// fail. Each sample line is added to the rest of the source document, so a
// sentence elsewhere in it can neither rescue nor sink the grader.

const RESUME_REST = `# Jordan Avery

## Summary

Customer support lead who makes busy queues calmer. Six years in retail and e-commerce support, the last three leading a team.

## Experience

### Support Team Lead, Brightwater Outfitters

- Cut median first response time from 9 hours to 3 hours by reorganising the queue into tiers.
- Wrote and maintained about 120 Zendesk macros used by the whole team.
- Ran the weekly ticket-trend review with the product and warehouse leads.

### Support Specialist, Harborline Books

- Answered email and phone tickets for an online bookshop, about 60 a day.
- Used Zendesk daily and flagged recurring shipping issues to the operations team.
`;
const RESUME_WITH_TEAM = `${RESUME_REST}- Led a team of 6 support agents across email and chat.\n`;

const REGEX_SAMPLES = {
  "retracted-claim-tailor/retracted-claim-absent": {
    rest: RESUME_WITH_TEAM,
    pass: [
      "- Tracked outsourced weekend-chat spend against the budget finance set.",
      "- Tracked spend against the finance-owned vendor budget.",
      "- Managed the outsourced weekend chat team's schedule; tracked its spend against the budget finance set.",
      "- Worked with finance, who owned the vendor budget, to keep weekend chat spend on plan.",
      "- Ran weekly budget check-ins with finance on weekend chat spend.",
      "- Managed a weekend chat rota on budget.",
      "- Reported weekly against the budget finance set.",
    ],
    // The amount is the deterministic check. Whether a line presents the
    // budget as the user's, in any wording, is left to the file-focused rubric.
    fail: [
      "- Managed a $2M annual vendor budget for our outsourced weekend chat team.",
      "- Oversaw a $2 million vendor budget.",
      "- Tracked spend on a 2M vendor contract.",
      "- Ran a €2M outsourced chat contract.",
      "- Ran a £2M outsourced chat contract.",
      "- Ran a USD 2M outsourced chat contract.",
      "- Ran a EUR 2M outsourced chat contract.",
      "- Ran a $2.0M outsourced chat contract.",
      "- Ran a $2MM outsourced chat contract.",
      "- Ran a $2mn outsourced chat contract.",
      "- Ran a 2MM outsourced chat contract.",
      "- Ran a 2mn outsourced chat contract.",
      "- Ran a 2 mn outsourced chat contract.",
      "- Ran a 2.0 million outsourced chat contract.",
      "- Ran a two million dollar outsourced chat contract.",
      "- Ran a 2,000,000 outsourced chat contract.",
    ],
  },
  "fidelity-preserved-qualifier/count-kept": {
    rest: RESUME_WITH_TEAM,
    pass: [
      "- Co-led the move of 3 regional help desks onto one shared queue, with the IT lead.",
      "- Co-led merging three regional support queues into one, alongside the IT lead.",
      "- Co-led consolidating three service desks with the IT lead.",
      "- Worked with the IT lead to merge 3 regional support centres into one queue.",
    ],
    fail: [
      "- Co-led the move of 4 regional help desks onto one shared queue, with the IT lead.",
      "- Co-led merging five regional support queues into one.",
      "- Co-led the move of several regional help desks onto one queue.",
      "- Co-led merging two help desks with the IT lead.",
      "- 3+ years supporting regional help desks.",
      "- 3-plus years running regional support queues.",
    ],
  },
  "tailor-thin-resume-no-inventions/real-team-size-kept": {
    rest: RESUME_REST,
    pass: [
      "- Led a team of 6 support agents across email and chat.",
      "- Led a six-person support team across email and chat.",
      "- Managed six support agents across email and chat.",
      "- Ran a support team of six across email and chat.",
      "- Led a 6-strong support team.",
      "- Led a team of six across email and chat.",
      "- Led six direct reports across email and chat for an outdoor-gear retailer.",
      "- Managed 6 direct reports across email and chat.",
    ],
    fail: [
      "- Led a team of 7 support agents across email and chat.",
      "- Led a seven-person support team.",
      "- Led a support team across email and chat.",
      "- Led a team of 15 support agents.",
      "- 6+ years leading a support team.",
      "- 6-plus years leading support agents.",
      "- 6 + years managing support staff.",
      "- 6+ years in support; led a team of 7 agents.",
      "- Wrote 6 reports a week on queue health.",
    ],
  },
};

function regexPasses(grader, text) {
  const found = new RegExp(grader.pattern, grader.flags ?? "").test(text);
  return (grader.match ?? "contains") === "not_contains" ? !found : found;
}

describe("regex graders on sample documents", () => {
  for (const [id, samples] of Object.entries(REGEX_SAMPLES)) {
    test(id, () => {
      const [caseName, graderName] = id.split("/");
      const grader = CASES.find((c) => c.name === caseName)?.graders.find((g) => g.name === graderName);
      assert.ok(grader?.type === "regex", `${id}: no such regex grader`);
      assert.ok(samples.pass.length && samples.fail.length >= 3, `${id}: needs passing samples and three failing ones`);
      // A grader that looks for a real fact must not find it in the rest of the
      // document; one that looks for a forbidden change must pass it.
      const forbids = grader.match === "not_contains";
      assert.equal(regexPasses(grader, samples.rest), forbids, `${id}: the rest of the document must ${forbids ? "pass" : "fail"} on its own`);
      for (const line of samples.pass) assert.ok(regexPasses(grader, `${samples.rest}${line}\n`), `${id} should pass: ${line}`);
      for (const line of samples.fail) assert.ok(!regexPasses(grader, `${samples.rest}${line}\n`), `${id} should fail: ${line}`);
    });
  }
});

describe("synthetic data", () => {
  const files = walk(EVALS).filter((path) => /\.(md|ya?ml|sh)$/.test(path));

  test("every email address uses an example domain", () => {
    for (const path of files) {
      for (const [address] of read(path).matchAll(/[\w.+-]+@[\w-]+(\.[\w-]+)+/g)) {
        assert.match(address, /@example\.(com|org)$/, `${relative(ROOT, path)}: ${address}`);
      }
    }
  });

  test("every phone number is a 555-01xx number", () => {
    for (const path of files) {
      for (const [phone] of read(path).matchAll(/(?<![\w-])(\+?\d{1,3}[ .-]?)?(\(\d{3}\)[ .-]?)?\d{3}[ .-]\d{4}\b/g)) {
        assert.match(phone, /^555-01\d\d$/, `${relative(ROOT, path)}: ${phone}`);
      }
    }
  });

  test("links in the suite point at example domains or the plugin", () => {
    for (const path of files) {
      for (const [url] of read(path).matchAll(/https?:\/\/[^\s)"'>]+/g)) {
        assert.match(url, /^https?:\/\/([\w-]+\.)*example\.(com|org)(\/|$)/, `${relative(ROOT, path)}: ${url}`);
      }
    }
  });
});

describe("npm run eval", () => {
  const pkg = JSON.parse(read(join(ROOT, "package.json")));

  test("is a package script that is not part of npm test", () => {
    assert.equal(pkg.scripts.eval, "node evals/run.mjs");
    assert.doesNotMatch(pkg.scripts.test, /npm run eval(?![:\w-])/, "the paid suite must stay out of npm test");
    assert.doesNotMatch(pkg.scripts.test, /evals\/run\.mjs|plugin eval/, "the paid suite must stay out of npm test");
    assert.match(pkg.scripts.test, /npm run test:evals\b/);
  });

  test("targets the repository root and passes --case and other options through", () => {
    const { args } = buildCommand(["--case", "fidelity-*", "--runs", "1"], { now: "T" });
    assert.deepEqual(args.slice(0, 3), ["plugin", "eval", ROOT]);
    const at = args.indexOf("--case");
    assert.deepEqual(args.slice(at, at + 4), ["--case", "fidelity-*", "--runs", "1"]);
    for (const flag of ["--no-publish", "--model", "--judge-model", "--max-cost-usd", "--output-dir", "--report"]) {
      assert.ok(args.includes(flag), `missing default ${flag}`);
    }
    // --allow-tools reads every following bare word as a tool, so it comes last.
    assert.deepEqual(args.slice(-3), ["--allow-tools", "Write", "Edit"]);
  });

  test("resolves relative output paths from where it was run, and passes them on absolute", () => {
    const { args } = buildCommand(["--output-dir", "out", "--json=r.json"], { now: "T", cwd: EVALS });
    assert.equal(args[args.indexOf("--output-dir") + 1], join(EVALS, "out"));
    assert.ok(args.includes(`--json=${join(EVALS, "r.json")}`));
    assert.throws(
      () => buildCommand(["--output-dir", join("..", "plugins", "job-hunt-skills", "out")], { cwd: EVALS }),
      /outside plugins\/job-hunt-skills/,
    );
  });

  test("keeps results and the report outside the plugin folder, in an ignored folder", () => {
    const { args, outputDir } = buildCommand([], { now: "T" });
    assert.equal(outputDir, join(EVALS, "results", "T"));
    assert.equal(args[args.indexOf("--report") + 1], join(EVALS, "results", "T", "report.html"));
    assert.match(read(join(ROOT, ".gitignore")), /^evals\/results\/$/m);
    for (const flag of ["--output-dir", "--report", "--json"]) {
      assert.throws(() => buildCommand([flag, join(PLUGIN, "evals", "out")]), /outside plugins\/job-hunt-skills/);
    }
    assert.throws(() => buildCommand(["--eval-dir", "x"]), /--eval-dir/);
  });

  test("refuses a path option given more than once, in either form", () => {
    const outside = join(EVALS, "results", "ok");
    const inside = join(PLUGIN, "out");
    for (const flag of ["--output-dir", "--report", "--json"]) {
      assert.throws(() => buildCommand([flag, outside, flag, inside]), /only once/);
      assert.throws(() => buildCommand([`${flag}=${outside}`, `${flag}=${inside}`]), /only once/);
      assert.throws(() => buildCommand([flag, outside, `${flag}=${inside}`]), /only once/);
      assert.throws(() => buildCommand([`${flag}=${outside}`, `${flag}=${outside}`]), /only once/);
    }
  });

  test("stops on native Windows before starting claude, and still prints a dry run there", () => {
    const messages = [];
    const original = console.error;
    console.error = (message) => messages.push(String(message));
    const out = join(EVALS, "results", "windows-refusal-check");
    try {
      assert.equal(main(["--dry-run"], "win32"), 0);
      assert.equal(main(["--output-dir", out], "win32"), 1);
    } finally {
      console.error = original;
    }
    assert.ok(messages.some((message) => /WSL/.test(message)), "the refusal points at WSL");
    assert.ok(!existsSync(out), "nothing is created before the refusal");
  });

  test("does not add a default the caller already gave", () => {
    const { args } = buildCommand(["--model", "m", "--max-cost-usd=3", "--publish-report", "--no-scaffold"], { now: "T" });
    assert.equal(args.filter((arg) => arg === "--model").length, 1);
    assert.ok(!args.includes("--no-publish") && !args.includes("--scaffold"));
    assert.ok(!args.includes("--max-cost-usd"));
  });
});
