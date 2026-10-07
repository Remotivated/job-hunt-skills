import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
import {
  init_restructure
} from "./chunk-YFRH6662.mjs";
import {
  VersionedStruct
} from "./chunk-DCBC6YOO.mjs";
import {
  Struct
} from "./chunk-2FAS3ON4.mjs";
import {
  Pointer
} from "./chunk-ETHVAYUP.mjs";
import {
  StringT
} from "./chunk-CJLFWYXH.mjs";
import {
  ArrayT
} from "./chunk-KM4TAG6K.mjs";
import {
  uint16
} from "./chunk-TXWX2CMZ.mjs";
import {
  LANGUAGES,
  getEncoding,
  init_encodings
} from "./chunk-3SYJ6GZQ.mjs";
import {
  __esm
} from "./chunk-FDWSCWK2.mjs";

// node_modules/fontkit/src/tables/name.js
var NameRecord, LangTagRecord, NameTable, name_default, NAMES;
var init_name = __esm({
  "node_modules/fontkit/src/tables/name.js"() {
    init_restructure();
    init_encodings();
    NameRecord = new Struct({
      platformID: uint16,
      encodingID: uint16,
      languageID: uint16,
      nameID: uint16,
      length: uint16,
      string: new Pointer(
        uint16,
        new StringT("length", (t) => getEncoding(t.platformID, t.encodingID, t.languageID)),
        { type: "parent", relativeTo: (ctx) => ctx.parent.stringOffset, allowNull: false }
      )
    });
    LangTagRecord = new Struct({
      length: uint16,
      tag: new Pointer(uint16, new StringT("length", "utf16be"), { type: "parent", relativeTo: (ctx) => ctx.stringOffset })
    });
    NameTable = new VersionedStruct(uint16, {
      0: {
        count: uint16,
        stringOffset: uint16,
        records: new ArrayT(NameRecord, "count")
      },
      1: {
        count: uint16,
        stringOffset: uint16,
        records: new ArrayT(NameRecord, "count"),
        langTagCount: uint16,
        langTags: new ArrayT(LangTagRecord, "langTagCount")
      }
    });
    name_default = NameTable;
    NAMES = [
      "copyright",
      "fontFamily",
      "fontSubfamily",
      "uniqueSubfamily",
      "fullName",
      "version",
      "postscriptName",
      // Note: A font may have only one PostScript name and that name must be ASCII.
      "trademark",
      "manufacturer",
      "designer",
      "description",
      "vendorURL",
      "designerURL",
      "license",
      "licenseURL",
      null,
      // reserved
      "preferredFamily",
      "preferredSubfamily",
      "compatibleFull",
      "sampleText",
      "postscriptCIDFontName",
      "wwsFamilyName",
      "wwsSubfamilyName"
    ];
    NameTable.process = function(stream) {
      var records = {};
      for (let record of this.records) {
        let language = LANGUAGES[record.platformID][record.languageID];
        if (language == null && this.langTags != null && record.languageID >= 32768) {
          language = this.langTags[record.languageID - 32768].tag;
        }
        if (language == null) {
          language = record.platformID + "-" + record.languageID;
        }
        let key = record.nameID >= 256 ? "fontFeatures" : NAMES[record.nameID] || record.nameID;
        if (records[key] == null) {
          records[key] = {};
        }
        let obj = records[key];
        if (record.nameID >= 256) {
          obj = obj[record.nameID] || (obj[record.nameID] = {});
        }
        if (typeof record.string === "string" || typeof obj[language] !== "string") {
          obj[language] = record.string;
        }
      }
      this.records = records;
    };
    NameTable.preEncode = function() {
      if (Array.isArray(this.records)) return;
      this.version = 0;
      let records = [];
      for (let key in this.records) {
        let val = this.records[key];
        if (key === "fontFeatures") continue;
        records.push({
          platformID: 3,
          encodingID: 1,
          languageID: 1033,
          nameID: NAMES.indexOf(key),
          length: val.en.length * 2,
          string: val.en
        });
        if (key === "postscriptName") {
          records.push({
            platformID: 1,
            encodingID: 0,
            languageID: 0,
            nameID: NAMES.indexOf(key),
            length: val.en.length,
            string: val.en
          });
        }
      }
      this.records = records;
      this.count = records.length;
      this.stringOffset = NameTable.size(this, null, false);
    };
  }
});

export {
  name_default,
  init_name
};
