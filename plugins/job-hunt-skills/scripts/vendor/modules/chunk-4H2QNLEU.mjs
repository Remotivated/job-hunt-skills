import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
import {
  unescapeAll
} from "./chunk-BQ7PUQNL.mjs";

// node_modules/markdown-it/lib/helpers/parse_link_destination.mjs
function parseLinkDestination(str, start, max) {
  let code;
  let pos = start;
  const result = {
    ok: false,
    pos: 0,
    str: ""
  };
  if (str.charCodeAt(pos) === 60) {
    pos++;
    while (pos < max) {
      code = str.charCodeAt(pos);
      if (code === 10) {
        return result;
      }
      if (code === 60) {
        return result;
      }
      if (code === 62) {
        result.pos = pos + 1;
        result.str = unescapeAll(str.slice(start + 1, pos));
        result.ok = true;
        return result;
      }
      if (code === 92 && pos + 1 < max) {
        pos += 2;
        continue;
      }
      pos++;
    }
    return result;
  }
  let level = 0;
  while (pos < max) {
    code = str.charCodeAt(pos);
    if (code === 32) {
      break;
    }
    if (code < 32 || code === 127) {
      break;
    }
    if (code === 92 && pos + 1 < max) {
      if (str.charCodeAt(pos + 1) === 32) {
        break;
      }
      pos += 2;
      continue;
    }
    if (code === 40) {
      level++;
      if (level > 32) {
        return result;
      }
    }
    if (code === 41) {
      if (level === 0) {
        break;
      }
      level--;
    }
    pos++;
  }
  if (start === pos) {
    return result;
  }
  if (level !== 0) {
    return result;
  }
  result.str = unescapeAll(str.slice(start, pos));
  result.pos = pos;
  result.ok = true;
  return result;
}

export {
  parseLinkDestination
};
