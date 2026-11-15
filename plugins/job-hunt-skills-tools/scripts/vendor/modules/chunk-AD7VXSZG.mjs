import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
import {
  isSpace,
  normalizeReference
} from "./chunk-G4K4TQXX.mjs";

// node_modules/markdown-it/lib/rules_block/reference.mjs
var MAX_LABEL_LENGTH = 999;
function countCodePoints(str) {
  let length = str.length;
  for (let i = 0; i < str.length - 1; i++) {
    const high = str.charCodeAt(i);
    if (high < 55296 || high > 56319) {
      continue;
    }
    const low = str.charCodeAt(i + 1);
    if (low >= 56320 && low <= 57343) {
      length--;
      i++;
    }
  }
  return length;
}
function lineEnd(state, line) {
  return Math.min(state.eMarks[line] + 1, state.src.length);
}
function getNextLinePos(state, nextLine) {
  const endLine = state.lineMax;
  if (nextLine >= endLine || state.isEmpty(nextLine)) {
    return -1;
  }
  let isContinuation = false;
  if (state.sCount[nextLine] - state.blkIndent > 3) {
    isContinuation = true;
  }
  if (state.sCount[nextLine] < 0) {
    isContinuation = true;
  }
  if (!isContinuation) {
    const terminatorRules = state.md.block.ruler.getRules("reference");
    const oldParentType = state.parentType;
    state.parentType = "reference";
    let terminate = false;
    for (let i = 0, l = terminatorRules.length; i < l; i++) {
      if (terminatorRules[i](state, nextLine, endLine, true)) {
        terminate = true;
        break;
      }
    }
    state.parentType = oldParentType;
    if (terminate) {
      return -1;
    }
  }
  return state.bMarks[nextLine] + state.tShift[nextLine];
}
function reference(state, startLine, _endLine, silent) {
  const src = state.src;
  let pos = state.bMarks[startLine] + state.tShift[startLine];
  let nextLine = startLine + 1;
  if (state.sCount[startLine] - state.blkIndent >= 4) {
    return false;
  }
  if (src.charCodeAt(pos) !== 91) {
    return false;
  }
  let max = lineEnd(state, startLine);
  let rawLabel = "";
  let labelEnd = -1;
  let segmentStart = ++pos;
  while (pos < max) {
    if (rawLabel.length + pos - segmentStart > MAX_LABEL_LENGTH * 2) {
      return false;
    }
    let ch = src.charCodeAt(pos);
    if (ch === 91) {
      return false;
    }
    if (ch === 93) {
      labelEnd = pos;
      break;
    }
    if (ch === 92) {
      ch = src.charCodeAt(++pos);
    }
    if (ch === 10 && pos < max) {
      const nextPos = getNextLinePos(state, nextLine);
      if (nextPos < 0) {
        return false;
      }
      rawLabel += src.slice(segmentStart, max);
      pos = segmentStart = nextPos;
      max = lineEnd(state, nextLine++);
      continue;
    }
    pos++;
  }
  if (labelEnd < 0 || src.charCodeAt(labelEnd + 1) !== 58) {
    return false;
  }
  rawLabel += src.slice(segmentStart, labelEnd);
  if (rawLabel.length > MAX_LABEL_LENGTH && countCodePoints(rawLabel) > MAX_LABEL_LENGTH) {
    return false;
  }
  pos = labelEnd + 2;
  while (pos < max) {
    const ch = src.charCodeAt(pos);
    if (ch === 10) {
      const nextPos = getNextLinePos(state, nextLine);
      if (nextPos < 0) {
        break;
      }
      pos = nextPos;
      max = lineEnd(state, nextLine++);
    } else if (isSpace(ch)) {
      pos++;
    } else {
      break;
    }
  }
  const destRes = state.md.helpers.parseLinkDestination(src, pos, max);
  if (!destRes.ok) {
    return false;
  }
  const href = state.md.normalizeLink(destRes.str);
  if (!state.md.validateLink(href)) {
    return false;
  }
  pos = destRes.pos;
  const destEndPos = pos;
  const destEndMax = max;
  const destEndLineNo = nextLine;
  while (pos < max) {
    const ch = src.charCodeAt(pos);
    if (ch === 10) {
      const nextPos = getNextLinePos(state, nextLine);
      if (nextPos < 0) {
        break;
      }
      pos = nextPos;
      max = lineEnd(state, nextLine++);
    } else if (isSpace(ch)) {
      pos++;
    } else {
      break;
    }
  }
  const titleStart = pos;
  let titleRes = state.md.helpers.parseLinkTitle(src, pos, max);
  while (titleRes.can_continue) {
    const nextPos = getNextLinePos(state, nextLine);
    if (nextPos < 0) break;
    pos = nextPos;
    max = lineEnd(state, nextLine++);
    titleRes = state.md.helpers.parseLinkTitle(src, pos, max, titleRes);
  }
  let title;
  if (titleStart !== destEndPos && titleRes.ok) {
    title = titleRes.str;
    pos = titleRes.pos;
  } else {
    title = "";
    pos = destEndPos;
    max = destEndMax;
    nextLine = destEndLineNo;
  }
  while (pos < max) {
    const ch = src.charCodeAt(pos);
    if (!isSpace(ch)) {
      break;
    }
    pos++;
  }
  if (pos < max && src.charCodeAt(pos) !== 10) {
    if (title) {
      title = "";
      pos = destEndPos;
      max = destEndMax;
      nextLine = destEndLineNo;
      while (pos < max) {
        const ch = src.charCodeAt(pos);
        if (!isSpace(ch)) {
          break;
        }
        pos++;
      }
    }
  }
  if (pos < max && src.charCodeAt(pos) !== 10) {
    return false;
  }
  const label = normalizeReference(rawLabel);
  if (!label) {
    return false;
  }
  if (silent) {
    return true;
  }
  if (typeof state.env.references === "undefined") {
    state.env.references = {};
  }
  if (typeof state.env.references[label] === "undefined") {
    state.env.references[label] = { title, href };
  }
  state.line = nextLine;
  return true;
}

export {
  reference
};
