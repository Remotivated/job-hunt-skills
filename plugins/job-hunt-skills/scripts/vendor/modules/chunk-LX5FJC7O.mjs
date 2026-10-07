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
  Fixed,
  uint16,
  uint32
} from "./chunk-TXWX2CMZ.mjs";
import {
  __esm
} from "./chunk-FDWSCWK2.mjs";

// node_modules/fontkit/src/tables/gvar.js
var shortFrac, Offset, gvar, gvar_default;
var init_gvar = __esm({
  "node_modules/fontkit/src/tables/gvar.js"() {
    init_restructure();
    shortFrac = new Fixed(16, "BE", 14);
    Offset = class {
      static decode(stream, parent) {
        return parent.flags ? stream.readUInt32BE() : stream.readUInt16BE() * 2;
      }
    };
    gvar = new Struct({
      version: uint16,
      reserved: new Reserved(uint16),
      axisCount: uint16,
      globalCoordCount: uint16,
      globalCoords: new Pointer(uint32, new ArrayT(new ArrayT(shortFrac, "axisCount"), "globalCoordCount")),
      glyphCount: uint16,
      flags: uint16,
      offsetToData: uint32,
      offsets: new ArrayT(new Pointer(Offset, "void", { relativeTo: (ctx) => ctx.offsetToData, allowNull: false }), (t) => t.glyphCount + 1)
    });
    gvar_default = gvar;
  }
});

export {
  gvar_default,
  init_gvar
};
