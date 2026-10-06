// Runs a Python contributor script with whichever interpreter is installed.
//
// Run with:  node scripts/run-python.mjs <script.py> [args...]
//
// Some systems provide only `python3` (most Linux distributions) and others only
// `python` (Windows, some macOS setups). npm scripts go through this launcher so
// the same command works everywhere. Set PYTHON to force a specific interpreter.

import { spawnSync } from "node:child_process";

const candidates = process.env.PYTHON ? [process.env.PYTHON] : ["python3", "python"];
const args = process.argv.slice(2);

for (const cmd of candidates) {
  const probe = spawnSync(cmd, ["--version"], { stdio: "ignore" });
  if (probe.error || probe.status !== 0) continue;
  const run = spawnSync(cmd, args, { stdio: "inherit" });
  process.exit(run.status ?? 1);
}

console.error(`No Python interpreter found (tried: ${candidates.join(", ")}).`);
process.exit(1);
