#!/usr/bin/env node

import { build } from "esbuild";
import {
  existsSync,
  readFileSync,
  readdirSync,
  writeFileSync,
  mkdirSync,
  rmSync,
} from "node:fs";
import { basename, dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

// `root` is the repository (node_modules, the vendor entry point). Modules
// and their notices ship inside the plugin folder, and the license paths they
// record are relative to the plugin root, except node_modules/ paths, which
// stay relative to the repository.
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const pluginRoot = join(root, "plugins/job-hunt-skills");
const vendorDir = join(pluginRoot, "scripts/vendor");

function normalizePath(path) {
  return relative(root, path).replaceAll("\\", "/");
}

// Non-npm files that ship inside the plugin and carry their own license.
const bundledAssets = [
  {
    name: "Gelasio",
    version: "Regular, Italic, Bold, BoldItalic",
    declaredLicense: "OFL-1.1",
    notice:
      "TrueType files embedded by the PDF exporter for the serif document theme",
    licenseTextSource: "templates/fonts/OFL.txt",
    licenseFiles: ["templates/fonts/OFL.txt"],
  },
];

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
  if (["fontkit", "dfa"].includes(pkg.name)) {
    const pinned = { fontkit: "2.0.4", dfa: "1.2.0" };
    if (pkg.version !== pinned[pkg.name]) throw new Error(`Review supplemental notices for ${pkg.name}@${pkg.version}`);
    licenseFiles.push("scripts/vendor/SOURCE-NOTICES.md");
  }
  return {
    name: pkg.name ?? basename(packageRoot),
    version: pkg.version ?? "unknown",
    declaredLicense:
      pkg.license ??
      "see included package license file",
    licenseFiles: [...new Set(licenseFiles)].sort(),
  };
}

function packageDir(name) {
  return join(root, "node_modules", ...name.split("/"));
}

// Keep each input as a module boundary. Extra entry wrappers force esbuild
// to split at source boundaries, then are discarded unless the export entry
// imports them. The remaining shared modules retain readable source comments.
const entry = join(root, "scripts/vendor-entry.mjs");
const sourcePlugin = {
  name: "readable-export-sources",
  setup(builder) {
    builder.onResolve({ filter: /^fontkit$/ }, () => ({
      path: join(packageDir("fontkit"), "src/index.js"),
    }));
    const replacements = [
      [/^brotli\/decompress\.js$/, "brotli.mjs"],
      [/3rd-party\/svg-to-pdfkit$/, "svg.mjs"],
      [/\/SVGMeasure$/, "svg-measure.mjs"],
    ];
    for (const [filter, name] of replacements) {
      builder.onResolve({ filter }, () => ({ path: join(root, "scripts/vendor-stubs", name) }));
    }
    builder.onLoad({ filter: /node_modules\/fontkit\/src\/.*\.js$/ }, ({ path }) => ({
      // Fontkit's Parcel build embeds these small Unicode shaping tables. Do
      // the same from the locked package's source so no runtime file reads or
      // binary trie assets are needed. Legacy @cache decorators use TS mode.
      contents: readFileSync(path, "utf8").replace(
        /require\('fs'\)\.readFileSync\(__dirname \+ '\/([^']+)', 'base64'\)/g,
        (_, filename) => JSON.stringify(readFileSync(join(dirname(path), filename)).toString("base64")),
      ),
      loader: "ts",
    }));
  },
};
const options = {
  absWorkingDir: root,
  bundle: true,
  format: "esm",
  platform: "node",
  target: "node18",
  tsconfigRaw: { compilerOptions: { experimentalDecorators: true } },
  legalComments: "external",
  minify: false,
  // Keep string data on one line so trimming generated trailing whitespace
  // never alters a multiline template literal.
  supported: { "template-literal": false },
  metafile: true,
  write: false,
  plugins: [sourcePlugin],
  banner: {
    js: [
      'import { createRequire as __vendorCreateRequire } from "node:module";',
      'import { fileURLToPath as __vendorFileURLToPath } from "node:url";',
      'import { dirname as __vendorDirname } from "node:path";',
      'const require = __vendorCreateRequire(import.meta.url);',
      'const __filename = __vendorFileURLToPath(import.meta.url);',
      'const __dirname = __vendorDirname(__filename);',
    ].join("\n"),
  },
};
const graph = await build({ ...options, entryPoints: [entry], outfile: join(vendorDir, "export-deps.mjs") });
const inputs = Object.keys(graph.metafile.inputs).sort();
const entries = inputs.map((input) => ({
  in: resolve(root, input),
  out: input === normalizePath(entry) ? "export-deps" : `entries/${input.replace(/\.[^.]+$/, "")}`,
}));
const result = await build({
  ...options,
  entryPoints: entries,
  splitting: true,
  outdir: vendorDir,
  outExtension: { ".js": ".mjs" },
  chunkNames: "modules/[name]-[hash]",
});
const outputByPath = new Map(result.outputFiles.map((file) => [file.path, file]));
const metadataByPath = new Map(Object.entries(result.metafile.outputs).map(([path, metadata]) => [resolve(root, path), metadata]));
const retained = new Set();
function visit(path) {
  if (retained.has(path)) return;
  const metadata = metadataByPath.get(path);
  if (!metadata) throw new Error(`Missing generated module: ${path}`);
  retained.add(path);
  for (const dependency of metadata.imports) {
    if (!dependency.external) visit(resolve(root, dependency.path));
  }
}
visit(join(vendorDir, "export-deps.mjs"));
const outputs = [...retained].sort().map((path) => ({
  path: relative(pluginRoot, path).replaceAll("\\", "/"),
  inputs: Object.keys(metadataByPath.get(path).inputs).sort(),
}));
for (const path of retained) {
  const file = outputByPath.get(path);
  if (!file || file.contents.length >= 256 * 1024) throw new Error(`Oversized or missing module: ${path}`);
}
// Remove obsolete modules on every rebuild. The directory contains generated
// files only; runtime sources and replacement modules live outside it.
rmSync(vendorDir, { recursive: true, force: true });
mkdirSync(vendorDir, { recursive: true });
for (const path of retained) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, outputByPath.get(path).text.replace(/[ \t]+$/gm, ""));
}
const legal = [...retained].sort().flatMap((path) => {
  const file = outputByPath.get(`${path}.LEGAL.txt`);
  return file ? [file.text.trim()] : [];
});
writeFileSync(join(vendorDir, "LEGAL.txt"), [...new Set(legal)].join("\n\n") + "\n");
writeFileSync(join(vendorDir, "SOURCE-NOTICES.md"), readFileSync(join(root, "scripts/vendor-source-notices.md")));
const shippedInputs = [...new Set(outputs.flatMap((output) => output.inputs))].sort();
const packageRoots = new Set();
const unmappedInputs = [];
const buildInputs = shippedInputs.filter((input) => input.includes("node_modules/")).map((input) => {
  const packageRoot = packageRootForInput(input);
  if (!packageRoot) {
    unmappedInputs.push(input);
    return { path: input, package: null };
  }
  packageRoots.add(packageRoot);
  const record = packageRecord(packageRoot);
  return { path: input.replaceAll("\\", "/"), package: `${record.name}@${record.version}` };
});
const packages = [...packageRoots].map(packageRecord).sort((a, b) => a.name.localeCompare(b.name));
// These binary input tables were read by the fontkit transform above, so
// include them in the source inventory even though esbuild sees their text.
for (const input of [...shippedInputs]) {
  if (!input.startsWith("node_modules/fontkit/src/")) continue;
  for (const match of readFileSync(resolve(root, input), "utf8").matchAll(/__dirname \+ '\/([^']+\.trie)'/g)) {
    buildInputs.push({ path: normalizePath(join(dirname(resolve(root, input)), match[1])), package: `fontkit@${JSON.parse(readFileSync(join(packageDir("fontkit"), "package.json"), "utf8")).version}` });
  }
}
buildInputs.sort((a, b) => a.path.localeCompare(b.path));
const fontkitVersion = JSON.parse(readFileSync(join(packageDir("fontkit"), "package.json"), "utf8")).version;
const embedded = [
  {
    name: "fontkit-base64-arraybuffer",
    version: `embedded in fontkit ${fontkitVersion}; upstream version not encoded`,
    declaredLicense: "MIT",
    notice: "fontkit/src/utils.js identifies its decoder as adapted from niklasvh/base64-arraybuffer",
    licenseTextSource: "scripts/vendor/SOURCE-NOTICES.md#base64-decoder-adapted-by-fontkit",
    licenseFiles: ["scripts/vendor/SOURCE-NOTICES.md"],
  },
  {
    name: "fontkit-harfbuzz",
    version: `adapted by fontkit ${fontkitVersion}; original port versions not encoded`,
    declaredLicense: "HarfBuzz Old MIT (see included text)",
    notice: "Fontkit identifies HarfBuzz adaptations in ArabicShaper, IndicShaper, UnicodeLayoutEngine, GPOSProcessor and GSUBProcessor",
    licenseTextSource: "scripts/vendor/SOURCE-NOTICES.md#shaping-logic-adapted-by-fontkit",
    licenseFiles: ["scripts/vendor/SOURCE-NOTICES.md"],
  },
];
const assets = [...bundledAssets];
const unresolved = [
  ...unmappedInputs.map((input) => `unmapped build input: ${input}`),
  ...packages.filter((record) => !record.licenseFiles.length).map((record) => `${record.name}@${record.version}`),
];
for (const asset of assets) {
  for (const path of asset.licenseFiles) {
    if (!existsSync(join(pluginRoot, path))) throw new Error(`Missing asset license: ${path}`);
  }
}
writeFileSync(join(vendorDir, "vendor-inputs.json"), `${JSON.stringify({ buildInputs, outputs, packages, embedded, assets, unresolved }, null, 2)}\n`);
if (unresolved.length) throw new Error(`Unresolved vendor licenses: ${unresolved.join(", ")}`);
execFileSync(process.execPath, [join(root, "scripts/render-vendor-notices.mjs")], { cwd: root, stdio: "inherit" });
execFileSync(process.execPath, [join(root, "scripts/render-vendor-notices.mjs"), "--normalize-legal"], { cwd: root, stdio: "inherit" });
console.log(`Wrote ${retained.size} readable export modules from ${buildInputs.length} package inputs.`);
