import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
import {
  unescapeAll
} from "./chunk-BQ7PUQNL.mjs";

// node_modules/markdown-it/lib/helpers/parse_link_title.mjs
function parseLinkTitle(str, start, max, prev_state) {
  let code;
  let pos = start;
  const state = {
    // if `true`, this is a valid link title
    ok: false,
    // if `true`, this link can be continued on the next line
    can_continue: false,
    // if `ok`, it's the position of the first character after the closing marker
    pos: 0,
    // if `ok`, it's the unescaped title
    str: "",
    // expected closing marker character code
    marker: 0
  };
  if (prev_state) {
    state.str = prev_state.str;
    state.marker = prev_state.marker;
  } else {
    if (pos >= max) {
      return state;
    }
    let marker = str.charCodeAt(pos);
    if (marker !== 34 && marker !== 39 && marker !== 40) {
      return state;
    }
    start++;
    pos++;
    if (marker === 40) {
      marker = 41;
    }
    state.marker = marker;
  }
  while (pos < max) {
    code = str.charCodeAt(pos);
    if (code === state.marker) {
      state.pos = pos + 1;
      state.str += unescapeAll(str.slice(start, pos));
      state.ok = true;
      return state;
    } else if (code === 40 && state.marker === 41) {
      return state;
    } else if (code === 92 && pos + 1 < max) {
      pos++;
    }
    pos++;
  }
  state.can_continue = true;
  state.str += unescapeAll(str.slice(start, pos));
  return state;
}

export {
  parseLinkTitle
};
