import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
import {
  encode_html_default
} from "./chunk-KS6OINTL.mjs";
import {
  getCodePoint,
  xmlReplacer
} from "./chunk-JOA42TCZ.mjs";

// node_modules/entities/lib/esm/encode.js
var htmlReplacer = /[\t\n!-,./:-@[-`\f{-}$\x80-\uFFFF]/g;
function encodeHTML(data) {
  return encodeHTMLTrieRe(htmlReplacer, data);
}
function encodeNonAsciiHTML(data) {
  return encodeHTMLTrieRe(xmlReplacer, data);
}
function encodeHTMLTrieRe(regExp, str) {
  let ret = "";
  let lastIdx = 0;
  let match;
  while ((match = regExp.exec(str)) !== null) {
    const i = match.index;
    ret += str.substring(lastIdx, i);
    const char = str.charCodeAt(i);
    let next = encode_html_default.get(char);
    if (typeof next === "object") {
      if (i + 1 < str.length) {
        const nextChar = str.charCodeAt(i + 1);
        const value = typeof next.n === "number" ? next.n === nextChar ? next.o : void 0 : next.n.get(nextChar);
        if (value !== void 0) {
          ret += value;
          lastIdx = regExp.lastIndex += 1;
          continue;
        }
      }
      next = next.v;
    }
    if (next !== void 0) {
      ret += next;
      lastIdx = i + 1;
    } else {
      const cp = getCodePoint(str, i);
      ret += "&#x".concat(cp.toString(16), ";");
      lastIdx = regExp.lastIndex += Number(cp !== char);
    }
  }
  return ret + str.substr(lastIdx);
}

export {
  encodeHTML,
  encodeNonAsciiHTML
};
