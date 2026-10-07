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
  Struct
} from "./chunk-2FAS3ON4.mjs";
import {
  Pointer
} from "./chunk-ETHVAYUP.mjs";
import {
  Reserved
} from "./chunk-TSASLJV5.mjs";
import {
  ArrayT
} from "./chunk-KM4TAG6K.mjs";
import {
  Bitfield
} from "./chunk-SPZOCPRY.mjs";
import {
  fixed32,
  int16,
  uint16,
  uint32,
  uint8
} from "./chunk-TXWX2CMZ.mjs";
import {
  __esm
} from "./chunk-FDWSCWK2.mjs";

// node_modules/fontkit/src/tables/feat.js
var Setting, FeatureName, feat_default;
var init_feat = __esm({
  "node_modules/fontkit/src/tables/feat.js"() {
    init_restructure();
    Setting = new Struct({
      setting: uint16,
      nameIndex: int16,
      name: (t) => t.parent.parent.parent.name.records.fontFeatures[t.nameIndex]
    });
    FeatureName = new Struct({
      feature: uint16,
      nSettings: uint16,
      settingTable: new Pointer(uint32, new ArrayT(Setting, "nSettings"), { type: "parent" }),
      featureFlags: new Bitfield(uint8, [
        null,
        null,
        null,
        null,
        null,
        null,
        "hasDefault",
        "exclusive"
      ]),
      defaultSetting: uint8,
      nameIndex: int16,
      name: (t) => t.parent.parent.name.records.fontFeatures[t.nameIndex]
    });
    feat_default = new Struct({
      version: fixed32,
      featureNameCount: uint16,
      reserved1: new Reserved(uint16),
      reserved2: new Reserved(uint32),
      featureNames: new ArrayT(FeatureName, "featureNameCount")
    });
  }
});

export {
  feat_default,
  init_feat
};
