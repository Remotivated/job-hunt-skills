#!/usr/bin/env node

import { build } from "esbuild";
import {
  existsSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from "node:fs";
import { basename, dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const vendorDir = join(root, "scripts/vendor");

function normalizePath(path) {
  return relative(root, path).replaceAll("\\", "/");
}

function packageRootForInput(input) {
  let current = dirname(resolve(root, input));
  while (current.startsWith(root)) {
    const candidate = join(current, "package.json");
    if (existsSync(candidate)) {
      const pkg = JSON.parse(readFileSync(candidate, "utf8"));
      if (pkg.name && pkg.version) return current;
    }
    const parent = dirname(current);
    if (parent === current) break;
    current = parent;
  }
  return null;
}

function packageRecord(packageRoot) {
  const pkg = JSON.parse(readFileSync(join(packageRoot, "package.json"), "utf8"));
  const topLevelFiles = readdirSync(packageRoot);
  const licenseFiles = topLevelFiles
    .filter((file) => /^(licen[cs]e|copying|notice)([.\-_]|$)/i.test(file))
    .sort()
    .map((file) => normalizePath(join(packageRoot, file)));
  if (!licenseFiles.length) {
    const readme = topLevelFiles.find((file) => /^readme(?:[.\-_]|$)/i.test(file));
    if (readme && /(?:^|\n)#{1,4}\s+licen[cs]e\b/i.test(
      readFileSync(join(packageRoot, readme), "utf8"),
    )) {
      licenseFiles.push(normalizePath(join(packageRoot, readme)));
    }
  }
  if (pkg.name === "brotli") {
    licenseFiles.push(normalizePath(join(packageRoot, "dec/bit_reader.js")));
    licenseFiles.push("node_modules/@swc/helpers/LICENSE");
  }
  if (pkg.name === "hash.js") {
    licenseFiles.push(normalizePath(join(packageRoot, "lib/hash/utils.js")));
    licenseFiles.push("node_modules/@swc/helpers/LICENSE");
  }
  return {
    name: pkg.name ?? basename(packageRoot),
    version: pkg.version ?? "unknown",
    declaredLicense: pkg.license ?? "see included package license file",
    licenseFiles: [...new Set(licenseFiles)].sort(),
  };
}

function packageDir(name) {
  return join(root, "node_modules", ...name.split("/"));
}

function dependencyClosure(name, seen = new Set()) {
  const dir = packageDir(name);
  const pkg = JSON.parse(readFileSync(join(dir, "package.json"), "utf8"));
  const key = `${pkg.name}@${pkg.version}`;
  if (seen.has(key)) return [];
  seen.add(key);
  const records = [];
  for (const dependency of Object.keys(pkg.dependencies ?? {}).sort()) {
    const dependencyRoot = packageDir(dependency);
    const record = packageRecord(dependencyRoot);
    records.push({
      ...record,
      notice: `Bundled inside ${pkg.name} ${pkg.version}'s distributed module`,
      licenseTextSource: record.licenseFiles.join(", "),
    });
    records.push(...dependencyClosure(dependency, seen));
  }
  return records;
}

const result = await build({
  absWorkingDir: root,
  entryPoints: [join(root, "scripts/vendor-entry.mjs")],
  bundle: true,
  format: "esm",
  platform: "node",
  target: "node18",
  legalComments: "external",
  minify: true,
  outfile: join(vendorDir, "export-deps.mjs"),
  metafile: true,
  banner: {
    js:
      'import { createRequire as __createRequire } from "node:module";' +
      'import { fileURLToPath as __fileURLToPath } from "node:url";' +
      'import { dirname as __pathDirname } from "node:path";' +
      "const require=__createRequire(import.meta.url);" +
      "const __filename=__fileURLToPath(import.meta.url);" +
      "const __dirname=__pathDirname(__filename);",
  },
});

const packageRootByInput = new Map();
const unmappedInputs = [];
for (const input of Object.keys(result.metafile.inputs).sort()) {
  if (!input.includes("node_modules")) continue;
  const packageRoot = packageRootForInput(input);
  if (packageRoot) {
    packageRootByInput.set(input, packageRoot);
  } else {
    unmappedInputs.push(input);
  }
}

const packageRoots = new Set(packageRootByInput.values());
const buildInputs = [...packageRootByInput]
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([input, packageRoot]) => {
    const record = packageRecord(packageRoot);
    return {
      path: input.replaceAll("\\", "/"),
      package: `${record.name}@${record.version}`,
    };
  });

const packages = [...packageRoots]
  .map(packageRecord)
  .sort((a, b) =>
    `${a.name}@${a.version}`.localeCompare(`${b.name}@${b.version}`),
  );

const docxPackage = JSON.parse(
  readFileSync(join(packageDir("docx"), "package.json"), "utf8"),
);
const pinnedDocxVersion = "9.7.1";
if (docxPackage.version !== pinnedDocxVersion) {
  throw new Error(`Review pinned docx notices for ${docxPackage.version}`);
}
const legalOutput = readFileSync(
  join(vendorDir, "export-deps.mjs.LEGAL.txt"),
  "utf8",
);
const pinnedSignatures = [
  "The buffer module from node.js",
  "ieee754. BSD-3-Clause License",
  "fromcodepoint v0.1.0",
];
for (const signature of pinnedSignatures) {
  if (!legalOutput.includes(signature)) {
    throw new Error(`Missing pinned docx legal signature: ${signature}`);
  }
}

const embeddedByKey = new Map();
for (const record of dependencyClosure("docx")) {
  embeddedByKey.set(`${record.name}@${record.version}`, record);
}

const pinnedDocxNotices = [
  {
    name: "docx-browser-buffer",
    version: `embedded in docx ${pinnedDocxVersion}; upstream version not encoded`,
    declaredLicense: "MIT",
    notice: "Buffer browser shim attribution preserved by esbuild",
    licenseTextSource: "scripts/vendor/embedded-docx-notices.md#buffer-browser-shim",
    licenseFiles: ["scripts/vendor/embedded-docx-notices.md"],
  },
  {
    name: "docx-browser-ieee754",
    version: `embedded in docx ${pinnedDocxVersion}; upstream version not encoded`,
    declaredLicense: "BSD-3-Clause",
    notice: "ieee754 attribution preserved by esbuild",
    licenseTextSource: "scripts/vendor/embedded-docx-notices.md#ieee754",
    licenseFiles: ["scripts/vendor/embedded-docx-notices.md"],
  },
  {
    name: "docx-browser-fromcodepoint",
    version: "0.1.0",
    declaredLicense: "MIT",
    notice: "fromcodepoint attribution preserved by esbuild",
    licenseTextSource: "scripts/vendor/embedded-docx-notices.md#fromcodepoint",
    licenseFiles: ["scripts/vendor/embedded-docx-notices.md"],
  },
];
for (const record of pinnedDocxNotices) {
  embeddedByKey.set(`${record.name}@${record.version}`, record);
}

const embedded = [...embeddedByKey.values()].sort((a, b) =>
  `${a.name}@${a.version}`.localeCompare(`${b.name}@${b.version}`),
);
const unresolved = [
  ...unmappedInputs.map((input) => `unmapped build input: ${input}`),
  ...[...packages, ...embedded]
    .filter(
      (record) =>
        !record.licenseFiles.length ||
        (embedded.includes(record) && !record.licenseTextSource),
    )
    .map((record) => `${record.name}@${record.version}`),
].sort();

writeFileSync(
  join(vendorDir, "vendor-inputs.json"),
  `${JSON.stringify({ buildInputs, packages, embedded, unresolved }, null, 2)}\n`,
  "utf8",
);

execFileSync(process.execPath, [join(root, "scripts/render-vendor-notices.mjs")], {
  cwd: root,
  stdio: "inherit",
});
execFileSync(
  process.execPath,
  [join(root, "scripts/render-vendor-notices.mjs"), "--normalize-legal"],
  { cwd: root, stdio: "inherit" },
);

if (unresolved.length) {
  throw new Error(`Unresolved vendor license records: ${unresolved.join(", ")}`);
}
