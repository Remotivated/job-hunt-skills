import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
import {
  DecodingMode,
  decodeHTML,
  decodeXML
} from "./chunk-Y6GWYN54.mjs";
import {
  encodeHTML,
  encodeNonAsciiHTML
} from "./chunk-AQH3X5EA.mjs";
import {
  encodeXML,
  escapeAttribute,
  escapeText,
  escapeUTF8
} from "./chunk-JOA42TCZ.mjs";

// node_modules/entities/lib/esm/index.js
var EntityLevel;
(function(EntityLevel2) {
  EntityLevel2[EntityLevel2["XML"] = 0] = "XML";
  EntityLevel2[EntityLevel2["HTML"] = 1] = "HTML";
})(EntityLevel || (EntityLevel = {}));
var EncodingMode;
(function(EncodingMode2) {
  EncodingMode2[EncodingMode2["UTF8"] = 0] = "UTF8";
  EncodingMode2[EncodingMode2["ASCII"] = 1] = "ASCII";
  EncodingMode2[EncodingMode2["Extensive"] = 2] = "Extensive";
  EncodingMode2[EncodingMode2["Attribute"] = 3] = "Attribute";
  EncodingMode2[EncodingMode2["Text"] = 4] = "Text";
})(EncodingMode || (EncodingMode = {}));
function decode(data, options = EntityLevel.XML) {
  const level = typeof options === "number" ? options : options.level;
  if (level === EntityLevel.HTML) {
    const mode = typeof options === "object" ? options.mode : void 0;
    return decodeHTML(data, mode);
  }
  return decodeXML(data);
}
function decodeStrict(data, options = EntityLevel.XML) {
  var _a;
  const opts = typeof options === "number" ? { level: options } : options;
  (_a = opts.mode) !== null && _a !== void 0 ? _a : opts.mode = DecodingMode.Strict;
  return decode(data, opts);
}
function encode(data, options = EntityLevel.XML) {
  const opts = typeof options === "number" ? { level: options } : options;
  if (opts.mode === EncodingMode.UTF8)
    return escapeUTF8(data);
  if (opts.mode === EncodingMode.Attribute)
    return escapeAttribute(data);
  if (opts.mode === EncodingMode.Text)
    return escapeText(data);
  if (opts.level === EntityLevel.HTML) {
    if (opts.mode === EncodingMode.ASCII) {
      return encodeNonAsciiHTML(data);
    }
    return encodeHTML(data);
  }
  return encodeXML(data);
}

export {
  EntityLevel,
  EncodingMode,
  decode,
  decodeStrict,
  encode
};
