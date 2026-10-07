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
  Optional
} from "./chunk-VTOYGDRI.mjs";
import {
  StringT
} from "./chunk-CJLFWYXH.mjs";
import {
  ArrayT
} from "./chunk-KM4TAG6K.mjs";
import {
  fixed32,
  uint16
} from "./chunk-TXWX2CMZ.mjs";
import {
  __esm
} from "./chunk-FDWSCWK2.mjs";

// node_modules/fontkit/src/tables/fvar.js
var Axis, Instance, fvar_default;
var init_fvar = __esm({
  "node_modules/fontkit/src/tables/fvar.js"() {
    init_restructure();
    Axis = new Struct({
      axisTag: new StringT(4),
      minValue: fixed32,
      defaultValue: fixed32,
      maxValue: fixed32,
      flags: uint16,
      nameID: uint16,
      name: (t) => t.parent.parent.name.records.fontFeatures[t.nameID]
    });
    Instance = new Struct({
      nameID: uint16,
      name: (t) => t.parent.parent.name.records.fontFeatures[t.nameID],
      flags: uint16,
      coord: new ArrayT(fixed32, (t) => t.parent.axisCount),
      postscriptNameID: new Optional(uint16, (t) => t.parent.instanceSize - t._currentOffset > 0)
    });
    fvar_default = new Struct({
      version: fixed32,
      offsetToData: uint16,
      countSizePairs: uint16,
      axisCount: uint16,
      axisSize: uint16,
      instanceCount: uint16,
      instanceSize: uint16,
      axis: new ArrayT(Axis, "axisCount"),
      instance: new ArrayT(Instance, "instanceCount")
    });
  }
});

export {
  fvar_default,
  init_fvar
};
