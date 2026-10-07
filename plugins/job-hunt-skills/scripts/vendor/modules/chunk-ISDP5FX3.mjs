import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
import {
  CFFDict,
  init_CFFDict
} from "./chunk-4LO37POG.mjs";
import {
  CFFIndex,
  init_CFFIndex
} from "./chunk-NJQSVP4A.mjs";
import {
  CFFPointer,
  init_CFFPointer
} from "./chunk-TXOQG3TN.mjs";
import {
  __esm
} from "./chunk-FDWSCWK2.mjs";

// node_modules/fontkit/src/cff/CFFPrivateDict.js
var CFFBlendOp, CFFPrivateDict_default;
var init_CFFPrivateDict = __esm({
  "node_modules/fontkit/src/cff/CFFPrivateDict.js"() {
    init_CFFDict();
    init_CFFIndex();
    init_CFFPointer();
    CFFBlendOp = class {
      static decode(stream, parent, operands) {
        let numBlends = operands.pop();
        while (operands.length > numBlends) {
          operands.pop();
        }
      }
    };
    CFFPrivateDict_default = new CFFDict([
      // key       name                    type                                          default
      [6, "BlueValues", "delta", null],
      [7, "OtherBlues", "delta", null],
      [8, "FamilyBlues", "delta", null],
      [9, "FamilyOtherBlues", "delta", null],
      [[12, 9], "BlueScale", "number", 0.039625],
      [[12, 10], "BlueShift", "number", 7],
      [[12, 11], "BlueFuzz", "number", 1],
      [10, "StdHW", "number", null],
      [11, "StdVW", "number", null],
      [[12, 12], "StemSnapH", "delta", null],
      [[12, 13], "StemSnapV", "delta", null],
      [[12, 14], "ForceBold", "boolean", false],
      [[12, 17], "LanguageGroup", "number", 0],
      [[12, 18], "ExpansionFactor", "number", 0.06],
      [[12, 19], "initialRandomSeed", "number", 0],
      [20, "defaultWidthX", "number", 0],
      [21, "nominalWidthX", "number", 0],
      [22, "vsindex", "number", 0],
      [23, "blend", CFFBlendOp, null],
      [19, "Subrs", new CFFPointer(new CFFIndex(), { type: "local" }), null]
    ]);
  }
});

export {
  CFFPrivateDict_default,
  init_CFFPrivateDict
};
