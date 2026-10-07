import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
import {
  replace
} from "./chunk-IZJ6WEUF.mjs";
import {
  smartquotes
} from "./chunk-EXTHJCDF.mjs";
import {
  state_core_default
} from "./chunk-IXPFFGA7.mjs";
import {
  text_join
} from "./chunk-J2RWRTXZ.mjs";
import {
  block
} from "./chunk-PCGJAFH4.mjs";
import {
  inline
} from "./chunk-VAU2DLV3.mjs";
import {
  linkify
} from "./chunk-K7FTFT27.mjs";
import {
  normalize
} from "./chunk-OT7MJ2F7.mjs";
import {
  ruler_default
} from "./chunk-FXOPHPTI.mjs";

// node_modules/markdown-it/lib/parser_core.mjs
var _rules = [
  ["normalize", normalize],
  ["block", block],
  ["inline", inline],
  ["linkify", linkify],
  ["replacements", replace],
  ["smartquotes", smartquotes],
  // `text_join` finds `text_special` tokens (for escape sequences)
  // and joins them with the rest of the text
  ["text_join", text_join]
];
function Core() {
  this.ruler = new ruler_default();
  for (let i = 0; i < _rules.length; i++) {
    this.ruler.push(_rules[i][0], _rules[i][1]);
  }
}
Core.prototype.process = function(state) {
  const rules = this.ruler.getRules("");
  for (let i = 0, l = rules.length; i < l; i++) {
    rules[i](state);
  }
};
Core.prototype.State = state_core_default;
var parser_core_default = Core;

export {
  parser_core_default
};
