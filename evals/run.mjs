#!/usr/bin/env node
// Runs the behavioural eval suite in evals/ with `claude plugin eval`.
//
//   npm run eval -- [claude plugin eval options]
//
// Every option is passed through, so `--case`, `--tag`, `--runs`, and the rest
// work as the CLI documents them. The runner fills in the defaults below only
// when you did not give that option yourself. Every run is a real model call on
// your own Claude Code sign-in; see CONTRIBUTING.md before starting one.
//
// `--dry-run` prints the command and exits without calling a model.

import { spawnSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { dirname, isAbsolute, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PLUGIN = join(ROOT, "plugins", "job-hunt-skills");

// Pinned so scores stay comparable from one run to the next. Override with
// --model or --judge-model.
export const DEFAULT_MODEL = "claude-sonnet-5-5";
export const DEFAULT_JUDGE_MODEL = "claude-haiku-5-5";
// A ceiling on the list-price estimate of one invocation. A full suite needs
// more: pass your own --max-cost-usd.
export const DEFAULT_MAX_COST_USD = "10";
// Cases that save documents write into their own temporary workspace.
export const DEFAULT_ALLOWED_TOOLS = ["Write", "Edit"];

function timestamp() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

function has(args, ...names) {
  return args.some((arg) => names.some((name) => arg === name || arg.startsWith(`${name}=`)));
}

function valueOf(args, name) {
  for (let i = 0; i < args.length; i += 1) {
    if (args[i] === name) return args[i + 1];
    if (args[i].startsWith(`${name}=`)) return args[i].slice(name.length + 1);
  }
  return undefined;
}

function insidePlugin(path) {
  const rel = relative(PLUGIN, path);
  return rel === "" || (!rel.startsWith("..") && !isAbsolute(rel));
}

// Output paths are resolved against the folder you ran the command from and
// passed on as absolute paths, because `claude` itself runs from the
// repository root.
const PATH_OPTIONS = ["--output-dir", "--report", "--json"];

function absolutePaths(args, cwd) {
  const out = [...args];
  for (let i = 0; i < out.length; i += 1) {
    for (const name of PATH_OPTIONS) {
      if (out[i].startsWith(`${name}=`)) {
        out[i] = `${name}=${resolve(cwd, out[i].slice(name.length + 1))}`;
      } else if (out[i] === name && i + 1 < out.length && !out[i + 1].startsWith("-")) {
        out[i + 1] = resolve(cwd, out[i + 1]);
      }
    }
  }
  return out;
}

export function buildCommand(argv, { now = timestamp(), cwd = process.cwd() } = {}) {
  const args = [...argv];
  const dryRun = args.includes("--dry-run");
  const passed = absolutePaths(
    args.filter((arg) => arg !== "--dry-run"),
    cwd,
  );

  for (const name of PATH_OPTIONS) {
    // Every copy of an option reaches the CLI, so a second one could undo the
    // check below. Give each path option once.
    if (passed.filter((arg) => arg === name || arg.startsWith(`${name}=`)).length > 1) {
      throw new Error(`${name} may be given only once`);
    }
    const value = valueOf(passed, name);
    if (value && !value.startsWith("-") && insidePlugin(value)) {
      throw new Error(`${name} must point outside plugins/job-hunt-skills/: ${value}`);
    }
  }
  if (has(passed, "--eval-dir")) {
    throw new Error("--eval-dir is not supported: the suite lives in evals/ at the repository root");
  }

  const defaults = [];
  const outputDir = valueOf(passed, "--output-dir") ?? join(ROOT, "evals", "results", now);
  if (!has(passed, "--output-dir")) defaults.push("--output-dir", outputDir);
  if (!has(passed, "--report")) defaults.push("--report", join(outputDir, "report.html"));
  if (!has(passed, "--no-publish", "--publish-report")) defaults.push("--no-publish");
  if (!has(passed, "--model")) defaults.push("--model", DEFAULT_MODEL);
  if (!has(passed, "--judge-model")) defaults.push("--judge-model", DEFAULT_JUDGE_MODEL);
  if (!has(passed, "--max-cost-usd")) defaults.push("--max-cost-usd", DEFAULT_MAX_COST_USD);
  if (!has(passed, "--scaffold", "--no-scaffold")) defaults.push("--scaffold");
  // --allow-tools takes a list, so its default goes last, where nothing after
  // it can be read as one more tool.
  const tools = has(passed, "--allow-tools") ? [] : ["--allow-tools", ...DEFAULT_ALLOWED_TOOLS];

  // The target goes first: --allow-tools, --tag, and --json read a following
  // bare word as their own value.
  return { dryRun, outputDir, args: ["plugin", "eval", ROOT, ...defaults, ...passed, ...tools] };
}

function quote(arg) {
  return /^[\w@%+=:,./-]+$/.test(arg) ? arg : `'${arg.replace(/'/g, "'\\''")}'`;
}

export function main(argv = process.argv.slice(2), platform = process.platform) {
  let command;
  try {
    command = buildCommand(argv);
  } catch (error) {
    console.error(`eval: ${error.message}`);
    return 1;
  }

  console.error(`$ claude ${command.args.map(quote).join(" ")}`);
  if (command.dryRun) return 0;
  // Starting the Windows `claude` shim needs a shell, which would read some
  // characters in paths and patterns as syntax. Run the suite inside WSL.
  if (platform === "win32") {
    console.error("eval: on Windows, run the suite inside WSL (see CONTRIBUTING.md)");
    return 1;
  }

  mkdirSync(command.outputDir, { recursive: true });
  const result = spawnSync("claude", command.args, { cwd: ROOT, stdio: "inherit" });
  if (result.error) {
    console.error(`eval: could not start claude: ${result.error.message}`);
    return 1;
  }
  return result.status ?? 1;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = main();
}
